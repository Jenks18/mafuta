import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuthenticatedSupabase } from '../../lib/supabaseAuth';
import { hasFleetPermission } from '../../config/userTypes';

/**
 * Fleet Vehicles Page - Manage company vehicles
 */
export default function FleetVehiclesPage() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchVehicles();
  }, [filterStatus]);

  async function fetchVehicles() {
    try {
      const supabase = useAuthenticatedSupabase();
      let query = supabase
        .from('vehicles')
        .select(`
          *,
          assigned_driver:users(id, first_name, last_name, email)
        `)
        .order('vehicle_number');

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  }

  const canAddVehicle = hasFleetPermission(userRole, 'canAddVehicle');
  const canEditVehicle = hasFleetPermission(userRole, 'canEditVehicle');

  const statusColors = {
    active: { bg: '#d1fae5', text: '#065f46' },
    maintenance: { bg: '#fef3c7', text: '#92400e' },
    retired: { bg: '#e5e7eb', text: '#374151' },
    sold: { bg: '#fee2e2', text: '#991b1b' }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Fleet Vehicles</h1>
          <p className="text-sm lg:text-base text-gray-500">Manage your vehicle fleet</p>
        </div>
        {hasFleetPermission(userRole, 'canAddVehicle') && (
          <button className="w-full sm:w-auto bg-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
            + Add Vehicle
          </button>
        )}
      </div>

      {/* Filters - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
        {['all', 'active', 'maintenance', 'inactive'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors text-sm lg:text-base ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div style={{
          background: 'white',
          border: '2px dashed #e2e8f0',
          borderRadius: '16px',
          padding: '64px 32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚛</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
            No vehicles yet
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
            Get started by adding your first vehicle to the fleet.
          </p>
          {canAddVehicle && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Add First Vehicle
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {vehicles.map(vehicle => (
            <div
              key={vehicle.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Vehicle Header */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1e40af',
                      marginBottom: '4px'
                    }}>
                      {vehicle.vehicle_number}
                    </div>
                    <div style={{ fontSize: '16px', color: '#64748b' }}>
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    background: statusColors[vehicle.status]?.bg || '#f1f5f9',
                    color: statusColors[vehicle.status]?.text || '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    {vehicle.status}
                  </span>
                </div>
              </div>

              {/* Vehicle Details */}
              <div style={{
                display: 'grid',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>License Plate</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{vehicle.license_plate || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Fuel Type</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>
                    {vehicle.fuel_type?.charAt(0).toUpperCase() + vehicle.fuel_type?.slice(1) || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Odometer</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>
                    {vehicle.odometer ? `${parseFloat(vehicle.odometer).toLocaleString()} mi` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Assigned Driver */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                  ASSIGNED DRIVER
                </div>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                  {vehicle.assigned_driver
                    ? `${vehicle.assigned_driver.first_name} ${vehicle.assigned_driver.last_name}`
                    : '👤 Unassigned'
                  }
                </div>
              </div>

              {/* Actions */}
              {canEditVehicle && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'white',
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
