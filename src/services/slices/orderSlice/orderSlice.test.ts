import {
	reducer as orderReducer,
	initialState as orderInitialState,
	resetOrderModalData,
	fetchOrder,
	createOrder,
	fetchOrders,
} from "./orderSlice";
import { describe, test, expect } from "@jest/globals";

describe("orderReducer — unit-тесты редьюсера заказов", () => {
	describe("обработка fetchOrder", () => {
		const fakeOrder = {
			_id: "1",
			ingredients: ["i1", "i2"],
			status: "done",
			name: "Test Order",
			number: 101,
			createdAt: "2023-01-01",
			updatedAt: "2023-01-01",
		};

		test("fetchOrder.pending обновляет isOrderLoading", () => {
			const result = orderReducer(orderInitialState, {
				type: fetchOrder.pending.type,
			});
			expect(result.isOrderLoading).toBe(true);
		});

		test("fetchOrder.rejected отключает загрузку", () => {
			const result = orderReducer(orderInitialState, {
				type: fetchOrder.rejected.type,
				error: { message: "fail" },
			});
			expect(result.isOrderLoading).toBe(false);
		});

		test("fetchOrder.fulfilled сохраняет данные заказа", () => {
			const result = orderReducer(orderInitialState, {
				type: fetchOrder.fulfilled.type,
				payload: fakeOrder,
			});
			expect(result.isOrderLoading).toBe(false);
			expect(result.orderModalData).toEqual(fakeOrder);
		});
	});

	describe("обработка fetchOrders", () => {
		const list = [
			{
				_id: "a1",
				ingredients: ["x", "y"],
				status: "created",
				name: "Order A",
				number: 7,
				createdAt: "now",
				updatedAt: "now",
			},
		];

		test("fetchOrders.pending очищает ошибки и включает загрузку", () => {
			const result = orderReducer(orderInitialState, {
				type: fetchOrders.pending.type,
			});
			expect(result.isOrdersLoading).toBe(true);
			expect(result.error).toBeNull();
		});

		test("fetchOrders.rejected сохраняет ошибку", () => {
			const errorAction = {
				type: fetchOrders.rejected.type,
				error: { message: "network error" },
			};
			const result = orderReducer(orderInitialState, errorAction);
			expect(result.isOrdersLoading).toBe(false);
			expect(result.error).toEqual(errorAction.error);
		});

		test("fetchOrders.fulfilled обновляет список заказов", () => {
			const result = orderReducer(orderInitialState, {
				type: fetchOrders.fulfilled.type,
				payload: list,
			});
			expect(result.isOrdersLoading).toBe(false);
			expect(result.data).toEqual(list);
		});
	});

	describe("обработка createOrder", () => {
		const orderPayload = {
			order: {
				_id: "z9",
				ingredients: ["bun", "patty"],
				status: "pending",
				name: "Mega Burger",
				number: 404,
				createdAt: "today",
				updatedAt: "today",
			},
			name: "Mega Burger",
		};

		test("createOrder.pending активирует флаг запроса", () => {
			const result = orderReducer(orderInitialState, {
				type: createOrder.pending.type,
			});
			expect(result.orderRequest).toBe(true);
		});

		test("createOrder.rejected сбрасывает флаг", () => {
			const result = orderReducer(orderInitialState, {
				type: createOrder.rejected.type,
				error: { message: "fail" },
			});
			expect(result.orderRequest).toBe(false);
		});

		test("createOrder.fulfilled сохраняет заказ", () => {
			const result = orderReducer(orderInitialState, {
				type: createOrder.fulfilled.type,
				payload: orderPayload,
			});
			expect(result.orderRequest).toBe(false);
			expect(result.orderModalData).toEqual(orderPayload.order);
		});
	});

	describe("resetOrderModalData сбрасывает orderModalData", () => {
		test("обнуляет данные заказа", () => {
			const stateWithOrder = {
				...orderInitialState,
				orderModalData: {
					_id: "abc",
					ingredients: ["i1", "i2"],
					status: "done",
					name: "Temp",
					number: 1,
					createdAt: "some",
					updatedAt: "some",
				},
			};
			const result = orderReducer(stateWithOrder, resetOrderModalData());
			expect(result.orderModalData).toBeNull();
		});
	});
});
