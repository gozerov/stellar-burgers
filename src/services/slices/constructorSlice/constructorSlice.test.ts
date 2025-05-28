import {
	addIngredient,
	initialState,
	moveIngredient,
	removeIngredient,
	resetConstructor,
	setBun,
	reducer
} from "./constructorSlice";
import { describe, test, expect } from "@jest/globals";

const sampleIngredient = {
	_id: "test-id",
	name: "Sample Ingredient",
	type: "main",
	proteins: 10,
	fat: 5,
	carbohydrates: 20,
	calories: 200,
	price: 300,
	image: "image.png",
	image_mobile: "image_mobile.png",
	image_large: "image_large.png",
	__v: 0
};

describe("constructorSlice reducer behavior", () => {
	test("should assign bun via setBun action", () => {
		const newState = reducer(initialState, setBun(sampleIngredient));
		expect(newState.bun).toEqual(sampleIngredient);
	});

	test("should remove bun when setBun(null) is called", () => {
		const prevState = { ...initialState, bun: sampleIngredient };
		const newState = reducer(prevState, setBun(null));
		expect(newState.bun).toBeNull();
	});

	test("should add ingredient to ingredients list", () => {
		const newState = reducer(initialState, addIngredient(sampleIngredient));
		expect(newState.ingredients.length).toBe(1);
		expect(newState.ingredients[0]).toMatchObject(sampleIngredient);
	});

	test("should remove ingredient from ingredients list", () => {
		const state = {
			...initialState,
			ingredients: [{ ...sampleIngredient, id: "123" }]
		};
		const newState = reducer(state, removeIngredient("123"));
		expect(newState.ingredients).toHaveLength(0);
	});

	test("should swap ingredients on moveIngredient upward", () => {
		const state = {
			...initialState,
			ingredients: [
				{ ...sampleIngredient, id: "1" },
				{ ...sampleIngredient, id: "2" }
			]
		};
		const newState = reducer(state, moveIngredient({ index: 1, upwards: true }));
		expect(newState.ingredients[0].id).toBe("2");
	});

	test("should swap ingredients on moveIngredient downward", () => {
		const state = {
			...initialState,
			ingredients: [
				{ ...sampleIngredient, id: "1" },
				{ ...sampleIngredient, id: "2" }
			]
		};
		const newState = reducer(state, moveIngredient({ index: 0, upwards: false }));
		expect(newState.ingredients[1].id).toBe("1");
	});

	test("should reset constructor state with resetConstructor", () => {
		const state = {
			bun: sampleIngredient,
			ingredients: [{ ...sampleIngredient, id: "123" }]
		};
		const newState = reducer(state, resetConstructor());
		expect(newState.bun).toBeNull();
		expect(newState.ingredients).toHaveLength(0);
	});
});