import { fetchFeeds, reducer as feedReducer, initialState as feedInitialState } from "./feedSlice";
import { describe, test, expect } from "@jest/globals";

describe("feedReducer — тесты асинхронного запроса ленты заказов", () => {
	const fakeOrders = {
		orders: ["order1", "order2", "order3"],
		total: 999,
		totalToday: 42,
	};

	const fakeActions = {
		pending: {
			type: fetchFeeds.pending.type,
		},
		rejected: {
			type: fetchFeeds.rejected.type,
			error: { message: "network error" },
		},
		fulfilled: {
			type: fetchFeeds.fulfilled.type,
			payload: fakeOrders,
		},
	};

	test("при fetchFeeds.pending isLoading становится true", () => {
		const result = feedReducer(feedInitialState, fakeActions.pending);
		expect(result.isLoading).toBe(true);
		expect(result.error).toBeNull();
	});

	test("при fetchFeeds.rejected — ошибка сохраняется", () => {
		const result = feedReducer(feedInitialState, fakeActions.rejected);
		expect(result.isLoading).toBe(false);
		expect(result.error).toBe("network error");
	});

	test("при fetchFeeds.fulfilled — данные обновляются", () => {
		const result = feedReducer(feedInitialState, fakeActions.fulfilled);
		expect(result.isLoading).toBe(false);
		expect(result.data.orders).toEqual(fakeOrders.orders);
	});
});
