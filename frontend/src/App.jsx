import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import FlashSale from './pages/FlashSale';
import Products from './pages/Products';
import Logistics from './pages/Logistics';
import ArchitectureCenter from './pages/ArchitectureCenter';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Global Interactive Notification Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'shadow-lg font-sans text-xs',
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '12px 16px',
            fontWeight: 600,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Top Global Navigation Bar */}
      <Navbar />

      {/* Full-width Responsive Body Container */}
      <div className="flex-1 flex w-full">
        {/* Left Enterprise Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace (Full Width on Desktop) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-[1700px] mx-auto">
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Core Application Modules (Role Guarded) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flash-sale"
              element={
                <ProtectedRoute>
                  <FlashSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logistics"
              element={
                <ProtectedRoute>
                  <Logistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/architecture"
              element={
                <ProtectedRoute>
                  <ArchitectureCenter />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
