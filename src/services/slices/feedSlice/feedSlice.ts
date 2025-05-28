import { loadPublicOrders } from "../../../utils/burger-api";
import {
	createAsyncThunk,
	createSlice,
	SerializedError,
} from "@reduxjs/toolkit";
import { TOrdersData } from "@utils-types";

type TFeedsState = {
	isLoading: boolean;
	error: null | SerializedError;
	data: TOrdersData;
};

export const initialState: TFeedsState = {
	isLoading: true,
	error: null,
	data: {
		orders: [],
		total: NaN,
		totalToday: NaN,
	},
};

export const fetchFeeds = createAsyncThunk(
	"fetch/feed",
	async () => await loadPublicOrders()
);

const slice = createSlice({
	name: "feed",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFeeds.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchFeeds.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.data = action.payload;
			})
			.addCase(fetchFeeds.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message as SerializedError;
			});
	},
});

export const reducer = slice.reducer;
