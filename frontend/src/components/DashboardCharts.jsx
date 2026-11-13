import React from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, ShoppingCart, Truck, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const DashboardCharts = ({ metrics }) => {
  const salesData = metrics?.salesOverTime || [
    { month: 'Jan', revenue: 24500, orders: 34 },
    { month: 'Feb', revenue: 38200, orders: 48 },
    { month: 'Mar', revenue: 54100, orders: 69 },
    { month: 'Apr', revenue: 47900, orders: 61 },
    { month: 'May', revenue: 78500, orders: 94 },
    { month: 'Jun', revenue: 98200, orders: 128 },
    { month: 'Jul', revenue: 134500, orders: 172 },
  ];

  const pieData = metrics?.logisticsDistribution || [
    { name: 'Dispatched', count: 18, fill: '#3b82f6' },
    { name: 'Processing', count: 24, fill: '#6366f1' },
    { name: 'In Transit', count: 42, fill: '#f59e0b' },
    { name: 'Delivered', count: 96, fill: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gross B2B Revenue
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono tracking-tight">
                ${metrics?.totalRevenue ? Number(metrics.totalRevenue).toLocaleString() : '184,500'}
              </h3>
              <div className="flex items-center space-x-1.5 mt-2 text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+28.4%</span>
                <span className="text-slate-400 font-normal">vs last month</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Metric 2: Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Orders Processed
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono tracking-tight">
                {metrics?.totalOrders || 248}
              </h3>
              <p className="text-xs text-slate-500 mt-2 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>BullMQ Async Queue: 0 backlog</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Metric 3: Flash Trade Velocity */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Flash Trade Peak Velocity
              </p>
              <h3 className="text-2xl font-black text-amber-600 mt-1 font-mono tracking-tight">
                25,000 <span className="text-xs font-bold text-slate-500">req/s</span>
              </h3>
              <p className="text-xs text-amber-700 mt-2 font-mono flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                <span>Redis In-Memory Atomic Lock</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>

        {/* Metric 4: Logistics Fleet */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Fleet Telemetry
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono tracking-tight">
                36 Units
              </h3>
              <p className="text-xs text-emerald-700 mt-2 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live GPS WebSocket Stream</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart: Revenue Trend */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Gross Transaction Volume (GTV)
              </h4>
              <p className="text-xs text-slate-500">Aggregated B2B wholesale trade throughput (USD)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium">
              Apache Kafka Streamed
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLightRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: '#0f172a',
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: '#2563eb' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLightRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Logistics Mix */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Fleet Delivery Distribution
            </h4>
            <p className="text-xs text-slate-500 mb-2">Live multi-stage shipment status</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-slate-500">{item.name}:</span>
                <span className="font-bold text-slate-800 font-mono">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
