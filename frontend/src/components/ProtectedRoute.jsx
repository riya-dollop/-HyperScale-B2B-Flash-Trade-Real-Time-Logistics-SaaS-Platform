import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">Verifying JWT & Session Context...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-6">
        <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-red-500/30 text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">403 Forbidden</h2>
          <p className="text-sm text-slate-400">
            Your role (<span className="font-mono text-white">{user.role}</span>) does not have authorization to view this enterprise module.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-sky-400 text-xs font-mono hover:bg-slate-700"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

