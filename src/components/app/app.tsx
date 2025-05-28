import {
	ConstructorPage,
	Feed,
	ForgotPassword,
	Login,
	NotFound404,
	Profile,
	ProfileOrders,
	Register,
	ResetPassword,
} from "@pages";
import "../../index.css";
import styles from "./app.module.css";

import {
	AppHeader,
	IngredientDetails,
	Modal,
	OrderInfo,
	ProtectedRoute,
} from "@components";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "../../services/store/store";
import { fetchIngredients } from "../../services/slices/ingredientsSlice/ingredientsSlice";
import { resetOrderModalData } from "../../services/slices/orderSlice/orderSlice";
import { checkUserAuth } from "../../services/slices/authSlice/authSlice";

const App = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const backgroundLocation = location.state?.background;

	useEffect(() => {
		dispatch(fetchIngredients());
		dispatch(checkUserAuth());
	}, [dispatch]);

	const closeModal = () => {
		navigate(-1);
		dispatch(resetOrderModalData());
	};

	return (
		<div className={styles.app}>
			<AppHeader />

			<Routes location={backgroundLocation || location}>
				<Route path="*" element={<NotFound404 />} />
				<Route path="/" element={<ConstructorPage />} />
				<Route path="/feed" element={<Feed />} />
				<Route
					path="/feed/:number"
					element={
						<Modal title="Детали заказа" onClose={closeModal}>
							<OrderInfo />
						</Modal>
					}
				/>
				<Route
					path="/ingredients/:id"
					element={
						<Modal title="Детали ингредиента" onClose={closeModal}>
							<IngredientDetails />
						</Modal>
					}
				/>
				<Route
					path="/profile/orders/:number"
					element={
						<ProtectedRoute>
							<Modal title="Детали заказа" onClose={closeModal}>
								<OrderInfo />
							</Modal>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/login"
					element={
						<ProtectedRoute onlyUnAuth>
							<Login />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/register"
					element={
						<ProtectedRoute onlyUnAuth>
							<Register />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/forgot-password"
					element={
						<ProtectedRoute onlyUnAuth>
							<ForgotPassword />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/reset-password"
					element={
						<ProtectedRoute onlyUnAuth>
							<ResetPassword />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile/orders"
					element={
						<ProtectedRoute>
							<ProfileOrders />
						</ProtectedRoute>
					}
				/>
			</Routes>

			{backgroundLocation && (
				<>
					<Routes>
						<Route
							path="/ingredients/:id"
							element={
								<Modal title="Детали ингредиента" onClose={closeModal}>
									<IngredientDetails />
								</Modal>
							}
						/>
					</Routes>
					<Routes>
						<Route
							path="/feed/:number"
							element={
								<Modal title="Детали заказа" onClose={closeModal}>
									<OrderInfo />
								</Modal>
							}
						/>
					</Routes>
					<Routes>
						<Route
							path="/profile/orders/:number"
							element={
								<Modal title="Детали заказа" onClose={closeModal}>
									<OrderInfo />
								</Modal>
							}
						/>
					</Routes>
				</>
			)}
		</div>
	);
};

export default App;
