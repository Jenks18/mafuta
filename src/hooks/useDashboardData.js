import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabaseClient';

/**
 * Hook to fetch real-time dashboard data from database
 */
export const useDashboardData = () => {
  const { user } = useUser();
  const [data, setData] = useState({
    currentPeriod: {
      start: null,
      end: null,
      spent: 0,
      savings: 0,
      availableToSpend: 0,
      pendingTransactions: 0,
      earlyPayments: 0,
    },
    upcomingPayment: {
      amount: 0,
      date: null,
      nextPeriodStart: null,
      nextPeriodEnd: null,
    },
    accountBalance: 0,
    fuelCardBalance: 0,
    recentTransactions: [],
    loading: true,
    error: null,
  });

  // Get current week's Monday and Sunday
  const getCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust when day is Sunday
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { monday, sunday };
  };

  // Get next week's dates
  const getNextWeekDates = () => {
    const { monday } = getCurrentWeekDates();
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    
    return { nextMonday, nextSunday };
  };

  // Format date as "Mon 05/02"
  const formatDate = (date) => {
    if (!date) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${days[date.getDay()]} ${month}/${day}`;
  };

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        const { monday, sunday } = getCurrentWeekDates();
        const { nextMonday, nextSunday } = getNextWeekDates();

        // Get user's organization/profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id, wallet_balance')
          .eq('clerk_user_id', user.id)
          .single();

        if (!profile) {
          throw new Error('Profile not found');
        }

        // Fetch transactions for current week
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select(`
            *,
            vehicles (
              registration_number,
              make,
              model
            ),
            drivers (
              first_name,
              last_name
            )
          `)
          .eq('organization_id', profile.organization_id)
          .gte('created_at', monday.toISOString())
          .lte('created_at', sunday.toISOString())
          .order('created_at', { ascending: false });

        if (txError) throw txError;

        // Calculate spent this week
        const spent = transactions
          ?.filter(t => t.status === 'approved')
          .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        // Calculate pending transactions
        const pendingTransactions = transactions
          ?.filter(t => t.status === 'pending')
          .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        // Fetch wallet balance
        const walletBalance = profile.wallet_balance || 0;

        // Fetch fuel cards total balance
        const { data: fuelCards } = await supabase
          .from('fuel_cards')
          .select('balance')
          .eq('organization_id', profile.organization_id);

        const totalFuelCardBalance = fuelCards
          ?.reduce((sum, card) => sum + (card.balance || 0), 0) || 0;

        // Calculate savings (placeholder: 10% of spent as rewards/cashback)
        const savings = spent * 0.10;

        // Available to spend = wallet balance
        const availableToSpend = walletBalance;

        // Get recent 10 transactions (all time, not just this week)
        const { data: recentTx } = await supabase
          .from('transactions')
          .select(`
            *,
            vehicles (
              registration_number,
              make,
              model
            ),
            drivers (
              first_name,
              last_name
            )
          `)
          .eq('organization_id', profile.organization_id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Calculate upcoming payment (next week's estimated spend based on current week)
        const upcomingPaymentAmount = spent > 0 ? spent * 1.2 : 0; // Estimate 20% more

        // Next payment date (next week's Monday)
        const nextPaymentDate = new Date(nextMonday);
        nextPaymentDate.setDate(nextMonday.getDate() + 14); // Two weeks from now

        setData({
          currentPeriod: {
            start: monday,
            end: sunday,
            spent,
            savings,
            availableToSpend,
            pendingTransactions,
            earlyPayments: 0, // TODO: Implement early payments logic
          },
          upcomingPayment: {
            amount: upcomingPaymentAmount,
            date: nextPaymentDate,
            nextPeriodStart: nextMonday,
            nextPeriodEnd: nextSunday,
          },
          accountBalance: walletBalance,
          fuelCardBalance: totalFuelCardBalance,
          recentTransactions: recentTx || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    };

    fetchDashboardData();

    // Set up real-time subscription for transactions
    const subscription = supabase
      .channel('dashboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    ...data,
    formatDate,
  };
};
