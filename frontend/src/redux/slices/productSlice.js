import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/products', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const addProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    flashSaleItem: null,
    liveFlashStock: 0,
    loading: false,
    error: null,
  },
  reducers: {
    updateLiveStock: (state, action) => {
      const { productId, remainingStock } = action.payload;
      if (state.flashSaleItem && state.flashSaleItem._id === productId) {
        state.liveFlashStock = remainingStock;
      }
      const item = state.items.find((p) => p._id === productId);
      if (item && item.flashSale) {
        item.flashSale.stock = remainingStock;
      }
    },
    setFlashSaleItem: (state, action) => {
      state.flashSaleItem = action.payload;
      state.liveFlashStock = action.payload?.flashSale?.stock || 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        // Auto pick first flash sale item if available
        const flash = action.payload.data.find((p) => p.flashSale?.isEnabled);
        if (flash) {
          state.flashSaleItem = flash;
          state.liveFlashStock = flash.flashSale.stock;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { updateLiveStock, setFlashSaleItem } = productSlice.actions;
export default productSlice.reducer;

