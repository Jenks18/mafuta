import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { getCompanyData } from '../../lib/supabaseAuth';
import { hasFleetPermission } from '../../config/userTypes';

/**
 * Fleet Dashboard - Main dashboard for fleet management customers
 */
export default function FleetDashboard() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    pendingTransactions: 0,
    monthlySpend: 0,
    monthlyGallons: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        // Get company info from user metadata
        const companyId = user?.unsafeMetadata?.companyId;
        if (companyId) {
          const companyData = await getCompanyData(companyId);
          setCompany(companyData);
        }

        // Get vehicle stats
        const { data: vehicles } = await supabase
          .from('vehicles')
          .select('status');

        // Get driver stats
        const { data: drivers } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'driver');

        // Get transaction stats
        const { data: transactions } = await supabase
          .from('fuel_transactions')
          .select('total_amount, gallons, approval_status, transaction_date, station_name, vehicle:vehicles(vehicle_number), driver:fleet_users(first_name, last_name)')
          .gte('transaction_date', new Date(new Date().setDate(1)).toISOString()) // This month
          .order('transaction_date', { ascending: false })
          .limit(10);

        const pendingCount = transactions?.filter(t => t.approval_status === 'pending').length || 0;
        const monthlySpend = transactions?.reduce((sum, t) => sum + parseFloat(t.total_amount || 0), 0) || 0;
        const monthlyGallons = transactions?.reduce((sum, t) => sum + parseFloat(t.gallons || 0), 0) || 0;

        setStats({
          totalVehicles: vehicles?.length || 0,
          activeVehicles: vehicles?.filter(v => v.status === 'active').length || 0,
          totalDrivers: drivers?.length || 0,
          pendingTransactions: pendingCount,
          monthlySpend: monthlySpend,
          monthlyGallons: monthlyGallons
        });

        setRecentTransactions(transactions || []);

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
        <p style={{ color: '#64748b' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1e40af', marginBottom: '8px' }}>
          Fleet Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b' }}>
          {company?.name} • {stats.totalVehicles} vehicles
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Active Vehicles */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Active Vehicles</div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
            {stats.activeVehicles}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            of {stats.totalVehicles} total vehicles
          </div>
        </div>

        {/* Monthly Spend */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Monthly Spend</div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
            ${stats.monthlySpend.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            {stats.monthlyGallons.toFixed(1)} gallons this month
          </div>
        </div>

        {/* Drivers */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Drivers</div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
            {stats.totalDrivers}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Active employees
          </div>
        </div>

        {/* Pending Approvals */}
        {hasFleetPermission(userRole, 'canApprovePurchase') && (
          <div style={{
            background: stats.pendingTransactions > 0
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Pending Approvals</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {stats.pendingTransactions}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {stats.pendingTransactions > 0 ? 'Requires review' : 'All caught up! 🎉'}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {hasFleetPermission(userRole, 'canAddVehicle') && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/fleet/vehicles/add"
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              + Add Vehicle
            </Link>
            {hasFleetPermission(userRole, 'canInviteDriver') && (
              <Link
                to="/fleet/drivers/invite"
                style={{
                  padding: '12px 24px',
                  background: '#8b5cf6',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                + Invite Driver
              </Link>
            )}
            <Link
              to="/fleet/reports"
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              📊 View Reports
            </Link>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af' }}>
            Recent Fuel Transactions
          </h2>
          <Link
            to="/fleet/transactions"
            style={{
              fontSize: '14px',
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            View All →
          </Link>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {recentTransactions.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛽</div>
              <p>No fuel transactions yet</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Vehicle</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Driver</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Station</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Gallons</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Amount</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, idx) => (
                  <tr key={tx.id} style={{ borderBottom: idx < recentTransactions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>
                      {new Date(tx.transaction_date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                      {tx.vehicle?.vehicle_number || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>
                      {tx.driver?.first_name} {tx.driver?.last_name}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>
                      {tx.station_name}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b', textAlign: 'right' }}>
                      {parseFloat(tx.gallons).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b', fontWeight: '600', textAlign: 'right' }}>
                      ${parseFloat(tx.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: tx.approval_status === 'approved' ? '#d1fae5' :
                                   tx.approval_status === 'pending' ? '#fef3c7' :
                                   tx.approval_status === 'rejected' ? '#fee2e2' : '#f1f5f9',
                        color: tx.approval_status === 'approved' ? '#065f46' :
                               tx.approval_status === 'pending' ? '#92400e' :
                               tx.approval_status === 'rejected' ? '#991b1b' : '#64748b'
                      }}>
                        {tx.approval_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
