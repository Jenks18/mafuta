import { Link, useLocation } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

/**
 * Fleet Layout - Mobile Responsive Navigation for fleet management
 */
export default function FleetLayout({ children }) {
  const { user } = useUser();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const companyName = user?.publicMetadata?.companyName || 'Fleet Company';
  const userRole = user?.publicMetadata?.role || '';

  const roleDisplay = userRole
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const navigation = [
    { name: 'Dashboard', href: '/fleet/dashboard', icon: '📊' },
    { name: 'Vehicles', href: '/fleet/vehicles', icon: '🚛' },
    { name: 'Drivers', href: '/fleet/drivers', icon: '👥' },
    { name: 'Transactions', href: '/fleet/transactions', icon: '⛽' },
    { name: 'Payroll', href: '/fleet/payroll', icon: '💰' },
  ];

  const isActive = (path) => location.pathname === path;

  const getPageTitle = () => {
    const currentPage = navigation.find(item => isActive(item.href));
    return currentPage?.name || 'Fleet Management';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static h-full z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'lg:w-64'}
          bg-gradient-to-b from-blue-800 to-blue-900
          flex flex-col
        `}
      >
        {/* Logo & Company */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-xl">
                🚛
              </div>
              <div>
                <div className="text-white font-bold text-base">Mafuta Fleet</div>
                <div className="text-white/70 text-xs">{companyName}</div>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navigation.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-6 py-3 text-sm font-medium
                transition-all duration-200
                ${isActive(item.href) 
                  ? 'bg-white/10 text-white border-l-4 border-blue-400' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10">
          <div className="text-white/70 text-xs mb-1">Logged in as:</div>
          <div className="text-white text-sm font-medium">{roleDisplay}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          <h1 className="text-lg lg:text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
          
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
