import { Link, useLocation } from 'react-router-dom';
import { Home, User, BarChart3, QrCode } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/create-menu', label: 'Menu', icon: QrCode },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-200 ${
                isActive ? 'text-orange-600' : 'text-gray-400'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-200 ${isActive ? 'bg-orange-50' : ''}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
