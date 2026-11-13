import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Package,
  Truck,
  Activity,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
    { name: 'Flash-Trade Engine', path: '/flash-sale', icon: Zap, badge: 'High-Concurrency' },
    { name: 'B2B Catalog & S3', path: '/products', icon: Package },
    { name: 'Fleet Logistics Map', path: '/logistics', icon: Truck, badge: 'Live GPS' },
    { name: 'System Design Lab', path: '/architecture', icon: Cpu, badge: 'Live Chaos' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
            Platform Modules
          </p>
          <div className="mt-2.5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Live Infrastructure Health Telemetry Panel */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>System Design Health</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-600 font-mono">
            <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
              <span className="text-slate-500">Redis In-Memory</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                ATOMIC DECR
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
              <span className="text-slate-500">BullMQ Jobs</span>
              <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                ASYNC WORKERS
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
              <span className="text-slate-500">RabbitMQ Broker</span>
              <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                DIRECT EXCH
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500">Apache Kafka</span>
              <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                AUDIT STREAM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Indicator Footer */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="text-slate-900 font-bold">{user?.name || 'Guest User'}</p>
            <p className="text-slate-500 text-[11px] font-mono capitalize">
              Role: {user?.role || 'Unauthenticated'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
