import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const placeFlashOrder = createAsyncThunk('orders/flashTrade', async (orderPayload, { rejectWithValue }) => {
  try {
    const res = await api.post('/flash-sale/purchase', orderPayload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Flash trade purchase failed');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    selectedOrder: null,
    liveTracking: {
      lat: 28.6139,
      lng: 77.2090,
      etaMinutes: 45,
      driverName: 'Logistics Partner Express',
      vehicleNumber: 'TRK-9821-X',
      orderStatus: 'out_for_delivery',
    },
    loading: false,
    flashOrderLoading: false,
    error: null,
  },
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
      if (action.payload.liveTracking) {
        state.liveTracking = {
          lat: action.payload.liveTracking.currentLat || state.liveTracking.lat,
          lng: action.payload.liveTracking.currentLng || state.liveTracking.lng,
          etaMinutes: action.payload.liveTracking.etaMinutes || state.liveTracking.etaMinutes,
          driverName: action.payload.liveTracking.driverName || state.liveTracking.driverName,
          vehicleNumber: action.payload.liveTracking.vehicleNumber || state.liveTracking.vehicleNumber,
          orderStatus: action.payload.orderStatus,
        };
      }
    },
    updateLiveLocation: (state, action) => {
      const { lat, lng, etaMinutes, orderStatus } = action.payload;
      if (lat !== undefined) state.liveTracking.lat = lat;
      if (lng !== undefined) state.liveTracking.lng = lng;
      if (etaMinutes !== undefined) state.liveTracking.etaMinutes = etaMinutes;
      if (orderStatus !== undefined) state.liveTracking.orderStatus = orderStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        if (!state.selectedOrder && action.payload.length > 0) {
          state.selectedOrder = action.payload[0];
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(placeFlashOrder.pending, (state) => {
        state.flashOrderLoading = true;
      })
      .addCase(placeFlashOrder.fulfilled, (state) => {
        state.flashOrderLoading = false;
      })
      .addCase(placeFlashOrder.rejected, (state, action) => {
        state.flashOrderLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder, updateLiveLocation } = orderSlice.actions;
export default orderSlice.reducer;

