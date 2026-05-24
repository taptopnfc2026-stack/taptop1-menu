import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, User, Menu, X, QrCode, UtensilsCrossed, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const subLinks = [
    { to: '/generate-review', label: 'AI Reviews', icon: Sparkles },
    { to: '/create-menu', label: 'Digital Menu', icon: UtensilsCrossed },
    { to: '/create-qr', label: 'QR Codes', icon: QrCode },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Taptop Menu
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive(link.to)
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {subLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Taptop Menu
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-14 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="absolute top-0 left-0 right-0 bg-white rounded-b-3xl shadow-xl animate-slideDown"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all cursor-pointer ${
                        isActive(link.to)
                          ? 'bg-violet-50 text-violet-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                
                <div className="border-t border-gray-100 my-3 pt-3">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Access</p>
                  {subLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-all cursor-pointer"
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
