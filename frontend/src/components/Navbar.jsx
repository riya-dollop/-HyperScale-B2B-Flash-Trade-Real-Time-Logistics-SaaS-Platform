import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Zap,
  LogOut,
  Radio,
  Truck,
  Package,
  LayoutDashboard,
  Cpu,
} from 'lucide-react';
import { logoutUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logged out successfully. Redis access token blacklisted.');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Flash-Trade', path: '/flash-sale', icon: Zap, highlight: true },
    { name: 'B2B Catalog', path: '/products', icon: Package },
    { name: 'Fleet Logistics', path: '/logistics', icon: Truck },
    { name: 'System Design Lab', path: '/architecture', icon: Cpu, badge: 'L5 Staff' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Platform Title */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-extrabold tracking-tight text-slate-900">
                    HyperScale
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    B2B CLOUD
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Real-Time Trade & Fleet Logistics
                </span>
              </div>
            </Link>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        item.highlight
                          ? 'text-amber-500 fill-amber-500'
                          : isActive
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-1 text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Live Status Telemetry & User Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live WebSockets Status Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE TELEMETRY ACTIVE</span>
            </div>

            {/* User Session Profile */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded font-bold ${
                        user.role === 'SuperAdmin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : user.role === 'Vendor'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out of enterprise session"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
