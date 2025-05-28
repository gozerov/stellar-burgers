import { reducer as ingredientsReducer, initialState as baseState, fetchIngredients } from "./ingredientsSlice";
import { describe, test, expect } from "@jest/globals";

describe("ingredientsReducer — тест на асинхронное поведение", () => {
	const sampleData = [
		{
			_id: "1",
			name: "Булка",
			type: "bun",
			proteins: 10,
			fat: 5,
			carbohydrates: 15,
			calories: 100,
			price: 100,
			image: "",
			image_mobile: "",
			image_large: "",
		},
		{
			_id: "2",
			name: "Котлета",
			type: "main",
			proteins: 20,
			fat: 10,
			carbohydrates: 5,
			calories: 150,
			price: 200,
			image: "",
			image_mobile: "",
			image_large: "",
		},
	];

	const asyncActions = {
		pendingAction: {
			type: fetchIngredients.pending.type,
		},
		rejectedAction: {
			type: fetchIngredients.rejected.type,
			error: { message: "не удалось загрузить" },
		},
		fulfilledAction: {
			type: fetchIngredients.fulfilled.type,
			payload: sampleData,
		},
	};

	test("pending — активируется загрузка и сбрасывается ошибка", () => {
		const updated = ingredientsReducer(baseState, asyncActions.pendingAction);
		expect(updated.isLoading).toBe(true);
		expect(updated.error).toBeNull();
	});

	test("rejected — отключается загрузка и сохраняется ошибка", () => {
		const updated = ingredientsReducer(baseState, asyncActions.rejectedAction);
		expect(updated.isLoading).toBe(false);
		expect(updated.error).toEqual(asyncActions.rejectedAction.error);
		expect(updated.data).toEqual([]);
	});

	test("fulfilled — ингредиенты записываются в стейт", () => {
		const updated = ingredientsReducer(baseState, asyncActions.fulfilledAction);
		expect(updated.isLoading).toBe(false);
		expect(updated.error).toBeNull();
		expect(updated.data).toEqual(sampleData);
	});
});
