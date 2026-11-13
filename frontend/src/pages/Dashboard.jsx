import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, Zap, RefreshCw, Activity, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardCharts from '../components/DashboardCharts';
import FlashSaleTimer from '../components/FlashSaleTimer';
import api from '../services/api';
import { fetchProducts } from '../redux/slices/productSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { flashSaleItem } = useSelector((state) => state.products);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/metrics');
      setMetrics(res.data.data);
      toast.success('Analytics & Kafka Audit metrics synchronized!', {
        id: 'sync-toast',
        duration: 2500,
      });
    } catch (err) {
      console.warn('Metrics fallback used');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="space-y-6 w-full">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Enterprise Control Plane
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Node.js + Redis + RabbitMQ + Kafka + Kubernetes
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Welcome back, {user?.name || 'Supply Chain Executive'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, sliding window rate limits, and sub-millisecond flash-sale execution active.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold font-mono flex items-center gap-2 self-start sm:self-auto transition shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Analytics</span>
        </button>
      </div>

      {/* Real-time Flash Sale Active Highlight */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-700">
            Active High-Concurrency Flash Sale
          </h2>
        </div>
        <FlashSaleTimer product={flashSaleItem} />
      </div>

      {/* Main Charts & Analytics Visuals */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-700">
            Logistics & Financial Throughput
          </h2>
        </div>
        <DashboardCharts metrics={metrics} />
      </div>
    </div>
  );
};

export default Dashboard;
