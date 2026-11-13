import React, { useState, useEffect } from 'react';
import { Truck, Navigation, Phone, MapPin, Radio, Compass, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSocket, joinOrderTracking } from '../services/socket';

const LiveTrackingMap = ({ order }) => {
  const [telemetry, setTelemetry] = useState({
    lat: order?.liveTracking?.currentLat || 28.6139,
    lng: order?.liveTracking?.currentLng || 77.2090,
    etaMinutes: order?.liveTracking?.etaMinutes || 35,
    orderStatus: order?.orderStatus || 'out_for_delivery',
    driverName: order?.liveTracking?.driverName || 'FedEx Express Freight Partner',
    driverPhone: order?.liveTracking?.driverPhone || '+1 (800) 463-3339',
    vehicleNumber: order?.liveTracking?.vehicleNumber || 'TRK-9821-X',
    speed: 68,
    heading: 142,
    lastPing: new Date().toLocaleTimeString(),
  });

  // Socket.io telemetry listener
  useEffect(() => {
    if (!order?._id) return;
    joinOrderTracking(order._id);
    const socket = getSocket();

    const handleLocationUpdate = (data) => {
      setTelemetry((prev) => ({
        ...prev,
        lat: data.lat !== undefined ? data.lat : prev.lat,
        lng: data.lng !== undefined ? data.lng : prev.lng,
        etaMinutes: data.etaMinutes !== undefined ? data.etaMinutes : prev.etaMinutes,
        orderStatus: data.orderStatus || prev.orderStatus,
        speed: data.speed || Math.floor(Math.random() * 20 + 55),
        heading: data.heading || prev.heading,
        lastPing: new Date().toLocaleTimeString(),
      }));

      toast(
        `📍 Live Telemetry Ping: Lat ${data.lat?.toFixed(4)}, Lng ${data.lng?.toFixed(4)} | ETA: ~${data.etaMinutes}m`,
        {
          icon: '🚚',
          style: {
            borderRadius: '12px',
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            fontWeight: 500,
            fontSize: '12px',
          },
        }
      );
    };

    socket.on('delivery_location_changed', handleLocationUpdate);

    return () => {
      socket.off('delivery_location_changed', handleLocationUpdate);
    };
  }, [order?._id]);

  // Simulate a live GPS ping
  const handleSimulateGPSMove = () => {
    const socket = getSocket();
    const newLat = telemetry.lat + (Math.random() - 0.5) * 0.01;
    const newLng = telemetry.lng + (Math.random() - 0.5) * 0.01;
    const newEta = Math.max(5, telemetry.etaMinutes - 2);

    socket.emit('update_delivery_coords', {
      orderId: order?._id || 'ORD-DEMO',
      lat: Number(newLat.toFixed(5)),
      lng: Number(newLng.toFixed(5)),
      speed: 74,
      heading: 180,
    });

    setTelemetry((prev) => ({
      ...prev,
      lat: Number(newLat.toFixed(5)),
      lng: Number(newLng.toFixed(5)),
      etaMinutes: newEta,
      lastPing: new Date().toLocaleTimeString(),
    }));

    toast.success('Driver GPS Telemetry ping broadcasted via WebSockets!', {
      duration: 3000,
      style: {
        borderRadius: '12px',
        background: '#ffffff',
        color: '#0f172a',
        border: '1px solid #e2e8f0',
        fontWeight: 600,
      },
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              WebSockets Telemetry Active
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Room: order_{order?._id || 'ORD-DEMO'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Real-Time Logistics Fleet Telemetry
          </h3>
        </div>

        <button
          onClick={handleSimulateGPSMove}
          className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold font-mono flex items-center gap-2 transition"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Simulate Driver GPS Ping</span>
        </button>
      </div>

      {/* Visual GPS Simulation Map Canvas */}
      <div className="relative w-full h-80 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Subtle grid lines resembling top-tier logistics maps */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #f8fafc 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Vector Route */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 100 240 Q 260 160 400 210 T 700 110"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            className="opacity-75"
          />
        </svg>

        {/* Origin Hub */}
        <div className="absolute left-16 bottom-14 flex flex-col items-center">
          <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-md text-slate-700">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-700 mt-1 bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-xs">
            Distribution Hub #04
          </span>
        </div>

        {/* Destination Facility */}
        <div className="absolute right-16 top-14 flex flex-col items-center">
          <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-md text-slate-700">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-700 mt-1 bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-xs">
            Client Warehouse
          </span>
        </div>

        {/* Animated Moving Truck Pin */}
        <div className="relative z-10 flex flex-col items-center animate-bounce">
          <div className="relative p-3.5 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/30 text-white">
            <Truck className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
          </div>
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-center shadow-lg">
            <p className="text-[11px] font-extrabold text-slate-900 font-mono">{telemetry.vehicleNumber}</p>
            <p className="text-[10px] font-mono text-blue-600 font-bold">
              {telemetry.lat.toFixed(4)}, {telemetry.lng.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Real-time HUD Badges */}
        <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-xs font-mono text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Speed: {telemetry.speed} km/h</span>
          </div>
          <div className="text-[11px] text-slate-500">Last GPS Ping: <span className="text-emerald-700 font-semibold">{telemetry.lastPing}</span></div>
        </div>

        <div className="absolute top-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-right">
          <p className="text-[10px] uppercase font-mono font-semibold text-slate-500">Estimated Delivery Time</p>
          <p className="text-xl font-black text-amber-600 font-mono">
            ~{telemetry.etaMinutes} Mins
          </p>
        </div>
      </div>

      {/* Driver & Telemetry Details Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold uppercase">Assigned Carrier</p>
          <p className="text-sm font-bold text-slate-900 mt-1">{telemetry.driverName}</p>
          <p className="text-xs text-blue-600 font-mono mt-0.5">{telemetry.vehicleNumber}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold uppercase">Dispatch Hotline</p>
          <div className="flex items-center space-x-2 mt-1 text-slate-900 text-sm font-mono font-bold">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{telemetry.driverPhone}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold uppercase">Shipment Status</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase font-mono font-black text-emerald-700">
              {telemetry.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
