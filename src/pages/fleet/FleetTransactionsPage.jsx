import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { hasFleetPermission } from '../../config/userTypes';

/**
 * Fleet Transactions Page - View and approve fuel purchases
 */
export default function FleetTransactionsPage() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const canApprove = hasFleetPermission(userRole, 'canApprovePurchase');
  const canViewAll = hasFleetPermission(userRole, 'canViewAllTransactions');

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  async function fetchTransactions() {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('fuel_transactions')
        .select(`
          *,
          vehicle:vehicles(vehicle_number, make, model),
          driver:users!fuel_transactions_driver_id_fkey(first_name, last_name)
        `)
        .eq('account_type', 'fleet')
        .order('transaction_date', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('approval_status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(transactionId) {
    if (!isSupabaseConfigured()) return;

    try {
      // Get current user's ID from users table
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single();

      const { error } = await supabase
        .from('fuel_transactions')
        .update({
          approval_status: 'approved',
          approved_by: currentUser.id,
          approval_notes: `Approved by ${user.firstName} ${user.lastName}`
        })
        .eq('id', transactionId);

      if (error) throw error;

      // Refresh list
      await fetchTransactions();
      
    } catch (error) {
      console.error('Error approving transaction:', error);
      alert('Failed to approve transaction');
    }
  }

  async function handleReject(transactionId) {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    if (!isSupabaseConfigured()) return;

    try {
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single();

      const { error } = await supabase
        .from('fuel_transactions')
        .update({
          approval_status: 'rejected',
          approved_by: currentUser.id,
          approval_notes: reason
        })
        .eq('id', transactionId);

      if (error) throw error;

      await fetchTransactions();
      
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      alert('Failed to reject transaction');
    }
  }

  const statusCounts = {
    all: transactions.length,
    pending: transactions.filter(t => t.approval_status === 'pending').length,
    approved: transactions.filter(t => t.approval_status === 'approved').length,
    rejected: transactions.filter(t => t.approval_status === 'rejected').length,
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
          Fuel Transactions
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          {canApprove ? 'Review and approve fuel purchases' : 'View fuel transaction history'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'All Transactions', count: statusCounts.all },
          { key: 'pending', label: 'Pending Approval', count: statusCounts.pending },
          { key: 'approved', label: 'Approved', count: statusCounts.approved },
          { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '10px 20px',
              background: filter === tab.key ? '#3b82f6' : 'white',
              color: filter === tab.key ? 'white' : '#64748b',
              border: `2px solid ${filter === tab.key ? '#3b82f6' : '#e2e8f0'}`,
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {tab.label}
            <span style={{
              background: filter === tab.key ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '12px'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {transactions.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛽</div>
            <p style={{ fontSize: '16px', color: '#64748b' }}>
              No {filter !== 'all' ? filter : ''} transactions found
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Date & Time
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Vehicle
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Driver
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Station
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Gallons
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Amount
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Status
                </th>
                {canApprove && (
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: idx < transactions.length - 1 ? '1px solid #f1f5f9' : 'none',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      {new Date(tx.transaction_date).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {new Date(tx.transaction_date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    {tx.vehicle?.vehicle_number || 'N/A'}
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>
                      {tx.vehicle?.make} {tx.vehicle?.model}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#64748b' }}>
                    {tx.driver ? `${tx.driver.first_name} ${tx.driver.last_name}` : 'N/A'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#64748b' }}>
                    {tx.station_name}
                    {tx.station_network && (
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {tx.station_network}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b', textAlign: 'right', fontWeight: '600' }}>
                    {parseFloat(tx.gallons).toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '16px', color: '#1e293b', textAlign: 'right', fontWeight: '700' }}>
                    ${parseFloat(tx.total_amount).toFixed(2)}
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>
                      ${parseFloat(tx.price_per_gallon).toFixed(3)}/gal
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
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
                  {canApprove && (
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {tx.approval_status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleApprove(tx.id)}
                            style={{
                              padding: '6px 16px',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(tx.id)}
                            style={{
                              padding: '6px 16px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Footer */}
      {transactions.length > 0 && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              Total Transactions
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
              {transactions.length}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              Total Gallons
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
              {transactions.reduce((sum, t) => sum + parseFloat(t.gallons || 0), 0).toFixed(1)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              Total Spend
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
              ${transactions.reduce((sum, t) => sum + parseFloat(t.total_amount || 0), 0).toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              Avg Price/Gal
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
              ${(transactions.reduce((sum, t) => sum + parseFloat(t.price_per_gallon || 0), 0) / transactions.length).toFixed(3)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
