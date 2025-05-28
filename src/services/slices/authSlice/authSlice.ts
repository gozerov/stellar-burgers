import {
	fetchUserInfo,
	loginUser,
	logoutUser,
	registerUser,
	updateUserInfo,
	TLogin,
	TRegistration,
} from "../../../utils/burger-api";
import {
	createAsyncThunk,
	createSlice,
	SerializedError,
} from "@reduxjs/toolkit";
import { TUser } from "@utils-types";
import { clearTokens, storeTokens } from "../../../utils/cookie";

type TAuthState = {
	isAuthChecked: boolean;
	isAuthenticated: boolean;
	loginError?: SerializedError;
	registerError?: SerializedError;
	data: TUser;
};

export const initialState: TAuthState = {
	isAuthChecked: false,
	isAuthenticated: false,
	data: {
		name: "",
		email: "",
	},
};

export const register = createAsyncThunk<TUser, TRegistration>(
	"auth/register",
	async (userInfo, { rejectWithValue }) => {
		const res = await registerUser(userInfo);
		if (!res.success) return rejectWithValue(res);
		storeTokens(res.refreshToken, res.accessToken);
		return res.user;
	}
);

export const login = createAsyncThunk<TUser, TLogin>(
	"auth/login",
	async (credentials, { rejectWithValue }) => {
		const res = await loginUser(credentials);
		if (!res.success) return rejectWithValue(res);
		storeTokens(res.refreshToken, res.accessToken);
		return res.user;
	}
);

export const logout = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		const res = await logoutUser();
		if (!res.success) return rejectWithValue(res);
		clearTokens();
	}
);

export const fetchUser = createAsyncThunk(
	"auth/fetch",
	async (_, { rejectWithValue }) => {
		const res = await fetchUserInfo();
		if (!res?.success) return rejectWithValue(res);
		return res.user;
	}
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegistration>>(
	"auth/update",
	async (formData, { rejectWithValue }) => {
		const res = await updateUserInfo(formData);
		if (!res?.success) return rejectWithValue(res);
		return res.user;
	}
);

export const checkUserAuth = createAsyncThunk(
	"auth/checkAuth",
	async (_, { dispatch }) => {
		const hasToken = localStorage.getItem("refreshToken");
		if (!hasToken) return Promise.reject("No refresh token");

		try {
			await dispatch(fetchUser());
		} catch (err) {
			clearTokens();
			return Promise.reject(err);
		}
	}
);

const slice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.registerError = undefined;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.registerError = undefined;
				state.isAuthenticated = true;
				state.data = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.registerError = action.meta?.rejectedWithValue
					? (action.payload as SerializedError)
					: action.error;
			})
			.addCase(login.pending, (state) => {
				state.loginError = undefined;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loginError = undefined;
				state.isAuthenticated = true;
				state.data = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.loginError = action.meta?.rejectedWithValue
					? (action.payload as SerializedError)
					: action.error;
			})
			.addCase(logout.fulfilled, (state) => {
				state.isAuthenticated = false;
				state.data = {
					email: "",
					name: "",
				};
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.isAuthChecked = true;
				state.data = action.payload;
			})
			.addCase(fetchUser.rejected, (state) => {
				state.isAuthChecked = true;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.data = action.payload;
			})
			.addCase(checkUserAuth.fulfilled, (state) => {
				state.isAuthChecked = true;
			})
			.addCase(checkUserAuth.rejected, (state) => {
				state.isAuthChecked = true;
				state.isAuthenticated = false;
			});
	},
});

export const reducer = slice.reducer;
