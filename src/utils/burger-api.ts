import { setCookie, getCookie } from "./cookie";
import { TIngredient, TOrder, TUser } from "./types";

const API = process.env.API_URL;

const handleResponse = async <T>(res: Response): Promise<T> => {
	if (res.ok) return res.json();
	const error = await res.json();
	return Promise.reject(error);
};

type TServer<T> = {
	success: boolean;
} & T;

type TRefreshTokens = TServer<{
	refreshToken: string;
	accessToken: string;
}>;

export const requestNewTokens = (): Promise<TRefreshTokens> =>
	fetch(`${API}/auth/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify({
			token: localStorage.getItem("refreshToken"),
		}),
	})
		.then((res) => handleResponse<TRefreshTokens>(res))
		.then((result) => {
			if (!result.success) return Promise.reject(result);
			localStorage.setItem("refreshToken", result.refreshToken);
			setCookie("accessToken", result.accessToken);
			return result;
		});

export const fetchWithTokenUpdate = async <T>(
	url: RequestInfo,
	options: RequestInit
) => {
	try {
		const response = await fetch(url, options);
		return await handleResponse<T>(response);
	} catch (err: any) {
		if (err.message === "jwt expired") {
			const updatedTokens = await requestNewTokens();
			const token = updatedTokens.accessToken;
			if (options.headers && typeof options.headers === "object") {
				(options.headers as Record<string, string>).authorization = token;
			}
			const retry = await fetch(url, options);
			return await handleResponse<T>(retry);
		}
		return Promise.reject(err);
	}
};

type TIngredientsData = TServer<{ data: TIngredient[] }>;
type TFeedsData = TServer<{ orders: TOrder[]; total: number; totalToday: number }>;

export const loadIngredients = () =>
	fetch(`${API}/ingredients`)
		.then((res) => handleResponse<TIngredientsData>(res))
		.then((payload) => (payload.success ? payload.data : Promise.reject(payload)));

export const loadPublicOrders = () =>
	fetch(`${API}/orders/all`)
		.then((res) => handleResponse<TFeedsData>(res))
		.then((payload) => (payload.success ? payload : Promise.reject(payload)));

export const loadUserOrders = () => {
	const token = getCookie("accessToken");
	const headers: HeadersInit = {
		"Content-Type": "application/json;charset=utf-8",
		...(token && { authorization: token }),
	};

	return fetchWithTokenUpdate<TFeedsData>(`${API}/orders`, {
		method: "GET",
		headers,
	}).then((payload) =>
		payload.success ? payload.orders : Promise.reject(payload)
	);
};

type TNewOrder = TServer<{ order: TOrder; name: string }>;

export const sendOrder = (ids: string[]) => {
	const token = getCookie("accessToken");
	const headers: HeadersInit = {
		"Content-Type": "application/json;charset=utf-8",
		...(token && { authorization: token }),
	};

	return fetchWithTokenUpdate<TNewOrder>(`${API}/orders`, {
		method: "POST",
		headers,
		body: JSON.stringify({ ingredients: ids }),
	}).then((payload) => (payload.success ? payload : Promise.reject(payload)));
};

type TOrderById = TServer<{ orders: TOrder[] }>;

export const loadOrderByNumber = (id: number) =>
	fetch(`${API}/orders/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => handleResponse<TOrderById>(res));

export type TRegistration = {
	email: string;
	name: string;
	password: string;
};

type TAuthResult = TServer<{
	refreshToken: string;
	accessToken: string;
	user: TUser;
}>;

export const registerUser = (data: TRegistration) =>
	fetch(`${API}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(data),
	})
		.then((res) => handleResponse<TAuthResult>(res))
		.then((payload) => (payload.success ? payload : Promise.reject(payload)));

export type TLogin = {
	email: string;
	password: string;
};

export const loginUser = (credentials: TLogin) =>
	fetch(`${API}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(credentials),
	})
		.then((res) => handleResponse<TAuthResult>(res))
		.then((payload) => (payload.success ? payload : Promise.reject(payload)));

export const requestPasswordReset = (data: { email: string }) =>
	fetch(`${API}/password-reset`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(data),
	})
		.then((res) => handleResponse<TServer<{}>>(res))
		.then((payload) => (payload.success ? payload : Promise.reject(payload)));

export const submitNewPassword = (data: { password: string; token: string }) =>
	fetch(`${API}/password-reset/reset`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(data),
	})
		.then((res) => handleResponse<TServer<{}>>(res))
		.then((payload) => (payload.success ? payload : Promise.reject(payload)));

type TUserResult = TServer<{ user: TUser }>;

export const fetchUserInfo = () => {
	const token = getCookie("accessToken");
	const headers: HeadersInit = token ? { authorization: token } : {};

	return fetchWithTokenUpdate<TUserResult>(`${API}/auth/user`, { headers });
};

export const updateUserInfo = (user: Partial<TRegistration>) => {
	const token = getCookie("accessToken");
	const headers: HeadersInit = {
		"Content-Type": "application/json;charset=utf-8",
		...(token && { authorization: token }),
	};

	return fetchWithTokenUpdate<TUserResult>(`${API}/auth/user`, {
		method: "PATCH",
		headers,
		body: JSON.stringify(user),
	});
};

export const logoutUser = () =>
	fetch(`${API}/auth/logout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify({
			token: localStorage.getItem("refreshToken"),
		}),
	}).then((res) => handleResponse<TServer<{}>>(res));
