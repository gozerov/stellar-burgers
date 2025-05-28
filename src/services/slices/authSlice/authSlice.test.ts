import {
	reducer as authReducer,
	initialState as authInitialState,
	register,
	login,
	logout,
	fetchUser,
	updateUser,
	checkUserAuth,
} from "./authSlice";
import { describe, test, expect } from "@jest/globals";

describe("authReducer — проверка асинхронных экшенов", () => {
	describe("регистрация", () => {
		const userData = { name: "Tester", email: "tester@mail.com" };

		test("pending", () => {
			const action = { type: register.pending.type };
			const result = authReducer(
				{ ...authInitialState, registerError: { message: "fail" } },
				action
			);
			expect(result.registerError).toBeUndefined();
		});

		test("fulfilled", () => {
			const action = { type: register.fulfilled.type, payload: userData };
			const result = authReducer(authInitialState, action);
			expect(result.data).toEqual(userData);
			expect(result.isAuthenticated).toBe(true);
		});

		test("rejected", () => {
			const action = { type: register.rejected.type, error: { message: "error" } };
			const result = authReducer(authInitialState, action);
			expect(result.registerError).toEqual({ message: "error" });
		});

		test("rejected с payload", () => {
			const action = {
				type: register.rejected.type,
				payload: { message: "ошибка API" },
				meta: { rejectedWithValue: true },
			};
			const result = authReducer(authInitialState, action);
			expect(result.registerError).toEqual({ message: "ошибка API" });
		});
	});

	describe("авторизация", () => {
		const userInfo = { name: "User", email: "u@a.a" };

		test("pending", () => {
			const result = authReducer(
				{ ...authInitialState, loginError: { message: "err" } },
				{ type: login.pending.type }
			);
			expect(result.loginError).toBeUndefined();
			expect(result.isAuthChecked).toBe(false);
			expect(result.isAuthenticated).toBe(false);
		});

		test("успех", () => {
			const result = authReducer(
				authInitialState,
				{ type: login.fulfilled.type, payload: userInfo }
			);
			expect(result.data).toEqual(userInfo);
			expect(result.isAuthenticated).toBe(true);
		});

		test("ошибка", () => {
			const result = authReducer(
				authInitialState,
				{ type: login.rejected.type, error: { message: "fail" } }
			);
			expect(result.loginError).toEqual({ message: "fail" });
		});

		test("ошибка через payload", () => {
			const result = authReducer(
				authInitialState,
				{
					type: login.rejected.type,
					payload: { message: "ошибка API" },
					meta: { rejectedWithValue: true },
				}
			);
			expect(result.loginError).toEqual({ message: "ошибка API" });
		});
	});

	describe("выход из системы", () => {
		test("успех", () => {
			const prevState = {
				...authInitialState,
				isAuthenticated: true,
				data: { name: "A", email: "a@a.com" },
			};
			const result = authReducer(prevState, { type: logout.fulfilled.type });
			expect(result.data).toEqual({ name: "", email: "" });
		});

		test("ошибка", () => {
			const result = authReducer(
				authInitialState,
				{ type: logout.rejected.type, error: { message: "error" } }
			);
			expect(result).toEqual(authInitialState);
		});
	});

	describe("загрузка данных пользователя", () => {
		const profile = { name: "Tester", email: "tester@mail.com" };

		test("успешная загрузка", () => {
			const result = authReducer(
				authInitialState,
				{ type: fetchUser.fulfilled.type, payload: profile }
			);
			expect(result.data).toEqual(profile);
			expect(result.isAuthChecked).toBe(true);
			expect(result.isAuthenticated).toBe(true);
		});

		test("ошибка при загрузке", () => {
			const result = authReducer(
				authInitialState,
				{ type: fetchUser.rejected.type }
			);
			expect(result.isAuthChecked).toBe(true);
			expect(result.isAuthenticated).toBe(false);
		});
	});

	describe("обновление профиля", () => {
		const updated = { name: "Updated", email: "new@mail.com" };

		test("успешный апдейт", () => {
			const state = {
				...authInitialState,
				data: { name: "Old", email: "old@mail.com" },
			};
			const result = authReducer(
				state,
				{ type: updateUser.fulfilled.type, payload: updated }
			);
			expect(result.data).toEqual(updated);
		});

		test("ошибка обновления", () => {
			const result = authReducer(
				authInitialState,
				{ type: updateUser.rejected.type }
			);
			expect(result).toEqual(authInitialState);
		});
	});

	describe("проверка авторизации", () => {
		test("успех", () => {
			const result = authReducer(
				authInitialState,
				{ type: checkUserAuth.fulfilled.type }
			);
			expect(result.isAuthChecked).toBe(true);
		});

		test("ошибка", () => {
			const result = authReducer(
				authInitialState,
				{ type: checkUserAuth.rejected.type }
			);
			expect(result.isAuthChecked).toBe(true);
			expect(result.isAuthenticated).toBe(false);
		});
	});
});
