import { FC, memo } from "react";
import { useLocation } from "react-router-dom";

import { BurgerIngredientUI } from "@ui";
import { TBurgerIngredientProps } from "./type";
import { useAppDispatch } from "../../services/store/store";
import {
	addIngredient,
	setBun,
} from "../../services/slices/constructorSlice/constructorSlice";

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
	({ ingredient, count }) => {
		const location = useLocation();
		const dispatch = useAppDispatch();

		const handleAdd = () => {
			if (ingredient.type === "bun") {
				dispatch(setBun(ingredient));
			} else {
				dispatch(addIngredient(ingredient));
			}
		};

		return (
			<BurgerIngredientUI
				ingredient={ingredient}
				count={count}
				locationState={{ background: location }}
				handleAdd={handleAdd}
			/>
		);
	}
);
