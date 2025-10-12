import { Link, useLocation } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useState } from 'react';

/**
 * Fleet Layout - Navigation and layout for fleet management pages
 */
export default function FleetLayout({ children }) {
  const { user } = useUser();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const companyName = user?.publicMetadata?.companyName || 'Fleet Company';
  const userRole = user?.publicMetadata?.role || '';

  // Format role for display
  const roleDisplay = userRole
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const navigation = [
    { name: 'Dashboard', href: '/fleet/dashboard', icon: '📊' },
    { name: 'Vehicles', href: '/fleet/vehicles', icon: '🚛' },
    { name: 'Drivers', href: '/fleet/drivers', icon: '👥' },
    { name: 'Transactions', href: '/fleet/transactions', icon: '⛽' },
    { name: 'Trips', href: '/fleet/trips', icon: '🗺️' },
    { name: 'Maintenance', href: '/fleet/maintenance', icon: '🔧' },
    { name: 'Reports', href: '/fleet/reports', icon: '📈' },
    { name: 'Settings', href: '/fleet/settings', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '280px' : '80px',
          background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)',
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000
        }}
      >
        {/* Logo & Company */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🚛
            </div>
            {sidebarOpen && (
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>
                  Mafuta Fleet
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  {companyName}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navigation.map(item => (
            <Link
              key={item.href}
              to={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: isActive(item.href) ? 'white' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                background: isActive(item.href) ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: isActive(item.href) ? '4px solid #60a5fa' : '4px solid transparent',
                transition: 'all 0.2s ease',
                fontWeight: isActive(item.href) ? '600' : '500',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '◀ Collapse' : '▶'}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 z-20 bg-indigo-600 text-white p-4 rounded-full shadow-lg"
        >
          <Menu size={24} />
        </button>

        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
