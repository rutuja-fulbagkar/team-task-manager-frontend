import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '../../../utils/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      console.log("hjdhsjhdshds", response,credentials);
      toast.success(response?.data?.message || 'Login successful!');
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed!');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      console.log("rereasteatsryat", response,userData);
      toast.success(response?.data?.message || 'Registration successful!');
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed!');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/verifyOTP', verificationData);
      toast.success(response?.data?.message || 'Verification successful!');
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Verification failed!');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);