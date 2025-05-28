import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store/store";
import { createOrder } from "../slices/orderSlice/orderSlice";
import { resetConstructor } from "../slices/constructorSlice/constructorSlice";

export const middleware: Middleware =
	(store: MiddlewareAPI<AppDispatch, RootState>) => (next) => (action) => {
		if (createOrder.fulfilled.match(action)) {
			store.dispatch(resetConstructor());
		}

		next(action);
	};
