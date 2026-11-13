import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, Mail, Lock, User, Building, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser, clearError } from '../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Customer',
    companyName: '',
    gstinOrTaxId: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(registerUser(formData));
    if (!res.error) {
      toast.success(`Account registered! Session token issued.`, {
        duration: 3000,
      });
      navigate('/');
    } else {
      toast.error(res.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Enterprise Account</h2>
          <p className="text-xs text-slate-500">
            Join the HyperScale B2B Flash-Trade & Supply Chain Logistics Network
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Marcus Vance"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="marcus@vanceindustries.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              >
                <option value="Customer">Customer (Wholesale Buyer)</option>
                <option value="Vendor">Vendor (OEM / Supplier)</option>
                <option value="SuperAdmin">SuperAdmin (Platform Operator)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Vance Heavy Industries Ltd"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN / Corporate Tax ID</label>
              <input
                type="text"
                value={formData.gstinOrTaxId}
                onChange={(e) => setFormData({ ...formData, gstinOrTaxId: e.target.value })}
                placeholder="27AAACH7409R1ZZ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-blue-500/25 mt-3"
          >
            {loading ? 'Registering Account...' : 'CREATE ACCOUNT & INITIALIZE JWT'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
