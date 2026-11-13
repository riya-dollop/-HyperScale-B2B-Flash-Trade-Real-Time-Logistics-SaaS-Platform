import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser, clearError } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(loginUser({ email, password }));
    if (!res.error) {
      toast.success(`Welcome back, ${res.payload.user?.name}! Session authorized.`, {
        duration: 3000,
      });
      navigate('/');
    } else {
      toast.error(res.payload || 'Invalid login credentials');
    }
  };

  const handleQuickLogin = (roleEmail, rolePass, roleName) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    toast(`Filled ${roleName} credentials! Click Authenticate.`, {
      icon: '🔑',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Sign In</h2>
          <p className="text-xs text-slate-500">
            Protected by Redis Sliding Window Rate Limiter & JWT Rotation
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@nexus.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating & Issuing Token...' : 'AUTHENTICATE SESSION'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Fill Pills */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-mono text-slate-500 mb-2.5 text-center font-semibold">
            One-Click Demo Credentials:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@hyperscale.internal', 'Password123!', 'SuperAdmin')}
              className="py-2 px-2 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-[10px] font-mono font-bold text-purple-700 transition"
            >
              SuperAdmin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('vendor@nexus.com', 'Password123!', 'Vendor')}
              className="py-2 px-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[10px] font-mono font-bold text-blue-700 transition"
            >
              Vendor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('buyer@apexcorp.com', 'Password123!', 'Customer')}
              className="py-2 px-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-mono font-bold text-emerald-700 transition"
            >
              Customer
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Need a wholesale supplier account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
