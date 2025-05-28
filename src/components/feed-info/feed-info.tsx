import { FC } from "react";

import { TOrder } from "@utils-types";
import { FeedInfoUI } from "../ui/feed-info";
import { useAppSelector } from "../../services/store/store";

const getOrders = (orders: TOrder[], status: string): number[] =>
	orders
		.filter((item) => item.status === status)
		.map((item) => item.number)
		.slice(0, 20);

export const FeedInfo: FC = () => {
	/** TODO: взять переменные из стора */
	const orders: TOrder[] = useAppSelector(
		(store) => store.feed.data.orders
	);
	const feed = useAppSelector((store) => ({
		total: store.feed.data.total,
		totalToday: store.feed.data.totalToday,
	}));

	const readyOrders = getOrders(orders, "done");

	const pendingOrders = getOrders(orders, "pending");

	return (
		<FeedInfoUI
			readyOrders={readyOrders}
			pendingOrders={pendingOrders}
			feed={feed}
		/>
	);
};
