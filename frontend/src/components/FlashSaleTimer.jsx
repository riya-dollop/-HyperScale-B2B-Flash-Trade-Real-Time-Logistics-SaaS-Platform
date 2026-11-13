import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Zap, Clock, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { getSocket } from '../services/socket';
import { updateLiveStock } from '../redux/slices/productSlice';
import { placeFlashOrder } from '../redux/slices/orderSlice';

const FlashSaleTimer = ({ product }) => {
  const dispatch = useDispatch();
  const { flashOrderLoading } = useSelector((state) => state.orders);

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 42, seconds: 15 });
  const [liveStock, setLiveStock] = useState(product?.flashSale?.stock || 48);
  const [initialStock] = useState(product?.flashSale?.stock || 50);

  // Socket.io Live Stock Synchronization
  useEffect(() => {
    const socket = getSocket();

    const handleStockUpdate = (data) => {
      if (!product || data.productId === product._id) {
        setLiveStock(data.remainingStock);
        dispatch(updateLiveStock(data));
      }
    };

    socket.on('flash_stock_updated', handleStockUpdate);

    return () => {
      socket.off('flash_stock_updated', handleStockUpdate);
    };
  }, [product, dispatch]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBuyFlashSale = async () => {
    if (!product) return;

    try {
      const result = await dispatch(
        placeFlashOrder({
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      toast.success(
        `Flash Trade Secured! Order #${result.orderNumber} queued via Redis DECR & BullMQ.`,
        {
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            fontWeight: 600,
          },
        }
      );
    } catch (err) {
      toast.error(err || 'Sold out or rate limit reached.');
    }
  };

  const stockPercentage = Math.max(0, Math.min(100, (liveStock / (initialStock || 1)) * 100));
  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="p-6 rounded-2xl bg-white border border-amber-200/90 shadow-sm relative overflow-hidden">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-300/60 flex items-center justify-center">
            <Flame className="w-5 h-5 animate-pulse text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Flash Trade Active
              </span>
              <span className="text-xs text-slate-500 font-mono">Sub-Millisecond Redis Atomic DECR</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {product?.title || 'Industrial Heavy Duty Inverter Drive (15kW)'}
            </h3>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <Clock className="w-4 h-4 text-amber-600" />
          <div className="flex items-center space-x-1 font-mono text-xs font-bold text-slate-800">
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-xs">
              {formatNumber(timeLeft.hours)}
            </span>
            <span>:</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-xs">
              {formatNumber(timeLeft.minutes)}
            </span>
            <span>:</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white font-black">
              {formatNumber(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Stock Meter Grid */}
      <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Price Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold uppercase">Flash Wholesale Price</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black text-slate-900 font-mono">
              ${product?.flashSale?.discountPrice || '1,249'}
            </span>
            <span className="text-sm line-through text-slate-400 font-mono">
              ${product?.price || '2,499'}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
              50% OFF
            </span>
          </div>
        </div>

        {/* Stock Bar */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-slate-600 font-semibold">Live Reserved Reservoir:</span>
            <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {liveStock} / {initialStock} Available
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stockPercentage > 40
                  ? 'bg-emerald-500'
                  : stockPercentage > 15
                  ? 'bg-amber-500'
                  : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {liveStock <= 0 ? '⚠️ SOLD OUT: Atomic lock closed' : '⚡ Single-threaded sub-millisecond atomic isolation'}
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleBuyFlashSale}
          disabled={liveStock <= 0 || flashOrderLoading}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-md ${
            liveStock <= 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              : 'bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-amber-500/25'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>
            {flashOrderLoading
              ? 'Locking in Redis Memory...'
              : liveStock <= 0
              ? 'SOLD OUT'
              : 'EXECUTE FLASH TRADE ORDER'}
          </span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Sliding Window Rate Limit: Max 10 attempts/min
        </span>
      </div>
    </div>
  );
};

export default FlashSaleTimer;
