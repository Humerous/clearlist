import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

const errorMessage = (error) =>
  error.response?.data?.msg || 'Something went wrong. Please try again.';

const authHeaders = (token) => ({
  headers: {
    'x-auth-token': token,
  },
});

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    if (!token) return rejectWithValue(null);

    try {
      const response = await axios.get('/api/auth/user', authHeaders(token));
      return response.data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (details, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users', details);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const fetchTasks = createAsyncThunk(
  'tasks/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(
        '/api/items',
        authHeaders(getState().auth.token)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (name, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(
        '/api/items',
        { name },
        authHeaders(getState().auth.token)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/remove',
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(
        `/api/items/${id}`,
        authHeaders(getState().auth.token)
      );
      return id;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

const storedToken = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedToken,
    user: null,
    isAuthenticated: false,
    loading: Boolean(storedToken),
    error: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTasks(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export const { clearTasks } = tasksSlice.actions;

export const createAppStore = (preloadedState) =>
  configureStore({
    reducer: {
      auth: authSlice.reducer,
      tasks: tasksSlice.reducer,
    },
    preloadedState,
  });

export const store = createAppStore();
