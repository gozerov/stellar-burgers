import { useAppDispatch, useAppSelector } from "../../services/store/store";
import { Preloader } from "@ui";
import { FeedUI } from "@ui-pages";
import { TOrder } from "@utils-types";
import { FC, useEffect } from "react";
import { fetchFeeds } from "../../services/slices/feedSlice/feedSlice";

export const Feed: FC = () => {
	const dispatch = useAppDispatch();

	/** TODO: взять переменную из стора */
	const { isLoading, data } = useAppSelector((state) => state.feed);
	const orders: TOrder[] = data.orders;

	const handleGetFeeds = () => {
		dispatch(fetchFeeds());
	};

	useEffect(() => {
		handleGetFeeds();
	}, [dispatch]);

	if (!orders.length) {
		return <Preloader />;
	}

	return isLoading ? (
		<Preloader />
	) : (
		<FeedUI
			orders={orders}
			handleGetFeeds={handleGetFeeds}
		/>
	);
};
