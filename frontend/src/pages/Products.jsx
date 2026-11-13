import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Package, Search, Plus, ShoppingBag, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductUploadForm from '../components/ProductUploadForm';
import PaymentModal from '../components/PaymentModal';
import api from '../services/api';

const Products = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [orderingProductId, setOrderingProductId] = useState(null);

  // Payment Modal state
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ search: searchTerm, category: selectedCategory }));
  }, [dispatch, searchTerm, selectedCategory]);

  const handleOrderClick = async (product) => {
    setOrderingProductId(product._id);
    try {
      // 1. Create order payload
      const res = await api.post('/orders', {
        items: [
          {
            productId: product._id,
            quantity: product.moq || 5,
          },
        ],
        paymentMethod: 'stripe',
        shippingAddress: {
          street: '450 Innovation Parkway',
          city: 'San Jose',
          state: 'CA',
          postalCode: '95134',
          country: 'USA',
        },
      });

      const newOrder = res.data.data;
      toast.success(
        `Order #${newOrder.orderNumber} initiated! Opening secure payment gateway...`,
        {
          duration: 3000,
        }
      );

      // Open Real Payment Gateway Modal
      setActivePaymentOrder(newOrder);
      setIsPaymentModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order initialization failed');
    } finally {
      setOrderingProductId(null);
    }
  };

  const isVendorOrAdmin = user?.role === 'Vendor' || user?.role === 'SuperAdmin';

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Redis Cache-Aside Pattern
            </span>
            <span className="text-xs text-slate-500 font-mono">Response Time: ~1.2ms (Cache Hit)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            B2B Product & Material Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Wholesale bulk purchase tiers, Minimum Order Quantities (MOQ), and automated PDF invoice generation.
          </p>
        </div>

        {isVendorOrAdmin && (
          <button
            onClick={() => setShowUploadModal(!showUploadModal)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showUploadModal ? 'Close Form' : 'Publish New Asset'}</span>
          </button>
        )}
      </div>

      {/* Upload Form Modal / Collapsible */}
      {showUploadModal && isVendorOrAdmin && (
        <div className="mb-6">
          <ProductUploadForm
            onCreated={() => {
              setShowUploadModal(false);
              dispatch(fetchProducts());
            }}
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by SKU, item title or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
        >
          <option value="">All Categories</option>
          <option value="Industrial Electronics">Industrial Electronics</option>
          <option value="Raw Materials">Raw Materials</option>
          <option value="Logistics Equipment">Logistics Equipment</option>
          <option value="Semiconductors">Semiconductors</option>
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-500">Querying Redis Cache / MongoDB Cluster...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Catalog Items Found</h3>
          <p className="text-xs text-slate-500">
            Publish products as a Vendor or adjust your search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-white/95 text-slate-900 text-[10px] font-mono font-bold border border-slate-200 shadow-xs">
                      {product.sku}
                    </span>
                    {product.flashSale?.isEnabled && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-black uppercase font-mono shadow-xs">
                        Flash Sale
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-white/95 text-slate-700 text-[10px] font-mono font-bold border border-slate-200 shadow-xs">
                    MOQ: {product.moq || 1} Units
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <p className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider">
                    {product.category || 'General'}
                  </p>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>

                  {/* Volume Tier Rates */}
                  {product.b2bTierPricing && product.b2bTierPricing.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                      <span className="text-slate-600 font-bold block">Volume Tier Rates:</span>
                      <div className="flex flex-wrap gap-1.5 font-mono">
                        {product.b2bTierPricing.map((tier, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-semibold shadow-xs">
                            {tier.minQty}+ qty: ${tier.unitPrice}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">Base Unit Price</p>
                  <p className="text-xl font-black text-slate-900 font-mono">${product.price}</p>
                </div>

                <button
                  onClick={() => handleOrderClick(product)}
                  disabled={orderingProductId === product._id}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    {orderingProductId === product._id ? 'Routing RabbitMQ...' : `Buy MOQ (${product.moq || 1})`}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Gateway Modal Component */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={activePaymentOrder}
        onPaymentSuccess={() => {
          dispatch(fetchProducts());
        }}
      />
    </div>
  );
};

export default Products;
