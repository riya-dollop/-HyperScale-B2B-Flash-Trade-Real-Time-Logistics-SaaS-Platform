import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UploadCloud, CheckCircle, Plus, Trash2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { addProduct } from '../redux/slices/productSlice';

const ProductUploadForm = ({ onCreated }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    category: 'Industrial Electronics',
    price: '',
    moq: '5',
    stock: '250',
    description: '',
    flashSaleEnabled: true,
    flashDiscountPrice: '',
    flashStock: '50',
  });

  const [tierPricing, setTierPricing] = useState([
    { minQty: 10, unitPrice: 280 },
    { minQty: 50, unitPrice: 240 },
  ]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleAddTier = () => {
    setTierPricing([...tierPricing, { minQty: 100, unitPrice: 200 }]);
  };

  const handleRemoveTier = (index) => {
    setTierPricing(tierPricing.filter((_, i) => i !== index));
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...tierPricing];
    updated[index][field] = Number(value);
    setTierPricing(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('sku', formData.sku);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('moq', formData.moq);
      data.append('stock', formData.stock);
      data.append('description', formData.description);
      data.append('flashSaleEnabled', formData.flashSaleEnabled);
      data.append('flashDiscountPrice', formData.flashDiscountPrice || Number(formData.price) * 0.7);
      data.append('flashStock', formData.flashStock);
      data.append('b2bTierPricing', JSON.stringify(tierPricing));

      selectedFiles.forEach((file) => {
        data.append('images', file);
      });

      await dispatch(addProduct(data)).unwrap();
      toast.success('B2B Product published! Redis catalog cache invalidated.', {
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          fontWeight: 600,
        },
      });

      if (onCreated) onCreated();
    } catch (err) {
      toast.error(err || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Publish B2B Inventory Asset</h3>
          <p className="text-xs text-slate-500">AWS S3 Image Streaming & Redis Cache Invalidation Pipeline</p>
        </div>
        <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
          AWS S3 Bucket: hyperscale-saas-media
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Precision Industrial Servo Motors"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">SKU (Unique Identifier)</label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. SRV-IND-2026-X"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Base Price ($)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="350"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Order Qty (MOQ)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.moq}
              onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* B2B Tier Pricing */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Volume Tier Discount Rates</h4>
              <p className="text-[11px] text-slate-500">Automatically calculated on bulk checkout</p>
            </div>
            <button
              type="button"
              onClick={handleAddTier}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1 hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tier
            </button>
          </div>

          <div className="space-y-2">
            {tierPricing.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="text-slate-600 w-24">Min Qty:</span>
                <input
                  type="number"
                  value={tier.minQty}
                  onChange={(e) => handleTierChange(idx, 'minQty', e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 font-mono"
                />
                <span className="text-slate-600 w-24">Unit Price ($):</span>
                <input
                  type="number"
                  value={tier.unitPrice}
                  onChange={(e) => handleTierChange(idx, 'unitPrice', e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTier(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* S3 Image Dropzone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Upload Product Assets (AWS S3)
          </label>
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50 relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-700">
              Drag & drop images here or <span className="text-blue-600 underline">browse files</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direct upload to AWS S3 bucket with resilient local disk fallback
            </p>
          </div>

          {previewUrls.length > 0 && (
            <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-1">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-xs">
                  <img src={url} alt="S3 Preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Product Description</label>
          <textarea
            rows="3"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Technical specifications, ISO certifications, warranty terms..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-blue-500/20"
        >
          {loading ? 'Streaming to AWS S3 & Updating Redis...' : 'PUBLISH B2B CATALOG ITEM'}
        </button>
      </form>
    </div>
  );
};

export default ProductUploadForm;
