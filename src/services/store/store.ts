import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
	useDispatch as useAppDispatchHook,
	useSelector as useAppSelectorHook,
	TypedUseSelectorHook,
} from "react-redux";

import { reducer as ingredientsSlice } from "../slices/ingredientsSlice/ingredientsSlice";
import { reducer as orderSlice } from "../slices/orderSlice/orderSlice";
import { reducer as constructorSlice } from "../slices/constructorSlice/constructorSlice";
import { reducer as feedSlice } from "../slices/feedSlice/feedSlice";
import { reducer as authSlice } from "../slices/authSlice/authSlice";

import { middleware as websocketMiddleware } from "../middlewares/ordersMiddleware";

export const rootReducer = combineReducers({
	ingredients: ingredientsSlice,
	order: orderSlice,
	constructor: constructorSlice,
	feed: feedSlice,
	auth: authSlice,
});

const appStore = configureStore({
	reducer: rootReducer,
	middleware: (defaultMiddleware) =>
		defaultMiddleware().concat(websocketMiddleware),
	devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof appStore.dispatch;

export const useAppDispatch: () => AppDispatch = () => useAppDispatchHook();
export const useAppSelector: TypedUseSelectorHook<RootState> = useAppSelectorHook;

export default appStore;
