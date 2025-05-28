import { useAppDispatch, useAppSelector } from "../../services/store/store";
import { ProfileOrdersUI } from "@ui-pages";
import { TOrder } from "@utils-types";
import { FC, useEffect } from "react";
import { fetchOrders } from "../../services/slices/orderSlice/orderSlice";

export const ProfileOrders: FC = () => {
	const dispatch = useAppDispatch();
	/** TODO: взять переменную из стора */
	const { data: orders } = useAppSelector((store) => store.order);

	useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);

	return <ProfileOrdersUI orders={orders} />;
};
