import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Truck, FileText, CheckCircle2, Clock, RefreshCw, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOrders, setSelectedOrder } from '../redux/slices/orderSlice';
import LiveTrackingMap from '../components/LiveTrackingMap';
import PaymentModal from '../components/PaymentModal';

const Logistics = () => {
  const dispatch = useDispatch();
  const { items, selectedOrder, loading } = useSelector((state) => state.orders);

  // Payment Modal state for unpaid orders
  const [modalOrder, setModalOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const defaultMockOrder = {
    _id: 'DEMO-ORD-771',
    orderNumber: 'ORD-771829-US',
    totalAmount: 4890.00,
    orderStatus: 'out_for_delivery',
    paymentStatus: 'paid',
    liveTracking: {
      driverName: 'FedEx Express Freight Partner',
      driverPhone: '+1 (800) 463-3339',
      vehicleNumber: 'TRK-9821-X',
      currentLat: 28.6139,
      currentLng: 77.2090,
      etaMinutes: 32,
    },
    items: [
      { title: 'High-Torque Industrial Servomotors', quantity: 20, unitPrice: 120, subtotal: 2400 },
      { title: 'Optocoupler High-Speed Isolators', quantity: 100, unitPrice: 24.9, subtotal: 2490 },
    ],
  };

  const activeOrder = selectedOrder || items[0] || defaultMockOrder;

  const handlePayOrder = (ord) => {
    setModalOrder(ord);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Socket.io WebSockets + BullMQ Invoicing
            </span>
            <span className="text-xs text-slate-400 font-mono">GPS Ping Interval: 10000ms</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Real-Time Logistics Fleet Control
          </h1>
          <p className="text-xs text-slate-500">
            Live telemetry tracking for B2B dispatches with automatic PDF invoice generation on delivery.
          </p>
        </div>

        <button
          onClick={() => {
            dispatch(fetchOrders());
            toast.success('Fleet dispatches and orders refreshed!');
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold font-mono flex items-center gap-2 self-start sm:self-auto transition shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Fleet Telemetry</span>
        </button>
      </div>

      {/* Real-time Visual Tracking Map Component */}
      <LiveTrackingMap order={activeOrder} />

      {/* Orders & Dispatch Manifest Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            Active Fleet Dispatches & Invoices
          </h3>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {items.length || 1} Shipments In Transit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Order Manifest</th>
                <th className="py-3 px-4 font-bold">Carrier Unit</th>
                <th className="py-3 px-4 font-bold">Tracking Status</th>
                <th className="py-3 px-4 font-bold">Gross Amount</th>
                <th className="py-3 px-4 font-bold">Payment</th>
                <th className="py-3 px-4 font-bold">BullMQ PDF Invoice</th>
                <th className="py-3 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {(items.length > 0 ? items : [defaultMockOrder]).map((ord) => {
                const isSelected = activeOrder._id === ord._id;
                const isPaid = ord.paymentStatus === 'paid';

                return (
                  <tr
                    key={ord._id}
                    className={`hover:bg-slate-50/80 transition cursor-pointer ${
                      isSelected ? 'bg-blue-50/60 font-medium' : ''
                    }`}
                    onClick={() => dispatch(setSelectedOrder(ord))}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {ord.liveTracking?.vehicleNumber || 'TRK-9821-X'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ord.orderStatus || 'in transit'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${ord.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {isPaid ? (
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayOrder(ord);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-[10px] font-bold hover:bg-blue-700 shadow-xs flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" /> PAY NOW
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.invoiceUrl ? (
                        <a
                          href={ord.invoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px] font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" /> Download PDF
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> BullMQ Generating...
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => dispatch(setSelectedOrder(ord))}
                        className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'TRACKING LIVE' : 'FOCUS MAP'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderData={modalOrder}
        onPaymentSuccess={() => {
          dispatch(fetchOrders());
        }}
      />
    </div>
  );
};

export default Logistics;
