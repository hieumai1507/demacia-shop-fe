// account-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userList: [],
  userDetails: null,
  isLoading: false,
  error: null,
  selectedUserId: null, // Keep selectedUserId in the store
};

// ... (your async thunks - getAllUsersAccount, getUsersDetails, deleteUserAccount, updateUserAccount) ...
export const getAllUsersAccount = createAsyncThunk(
  "account/getAllUsersAccount",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/accounts/all-user-account`
      );
      return response.data;
    } catch (error) {
      // Xử lý lỗi ở đây, ví dụ:
      throw new Error(
        error.response?.data?.message || "Failed to fetch users."
      ); // Trả về message lỗi
    }
  }
);

export const getUsersDetails = createAsyncThunk(
  "account/getUsersDetails",
  async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/accounts/user-account-detail/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get user details."
      );
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "account/deleteUserAccount",
  async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/accounts/delete-user-account/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete user."
      );
    }
  }
);

export const updateUserAccount = createAsyncThunk(
  "account/updateUserAccount",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/accounts/update-user-account/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update user." }
      ); // Trả về toàn bộ response.data
    }
  }
);
const accountSlice = createSlice({
  name: "adminAccountSlice",
  initialState,
  reducers: {
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get all users account
      .addCase(getAllUsersAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsersAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
        state.error = null;
      })
      .addCase(getAllUsersAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Sử dụng message lỗi từ error
        state.userList = [];
      })
      //get user account details
      .addCase(getUsersDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getUsersDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // update user account
      .addCase(updateUserAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearUserDetails, setSelectedUserId } = accountSlice.actions;
export default accountSlice.reducer;
