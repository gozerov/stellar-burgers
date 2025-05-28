import { FC, memo } from "react";
import { BurgerConstructorElementUI } from "@ui";
import { BurgerConstructorElementProps } from "./type";
import { useAppDispatch } from "../../services/store/store";
import {
	moveIngredient,
	removeIngredient,
} from "../../services/slices/constructorSlice/constructorSlice";

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> =
	memo(({ ingredient, index, totalItems }) => {
		const dispatch = useAppDispatch();

		const handleMoveDown = () => {
			dispatch(moveIngredient({ index, upwards: false }));
		};

		const handleMoveUp = () => {
			dispatch(moveIngredient({ index, upwards: true }));
		};

		const handleClose = () => {
			dispatch(removeIngredient(ingredient.id));
		};

		return (
			<BurgerConstructorElementUI
				ingredient={ingredient}
				index={index}
				totalItems={totalItems}
				handleMoveUp={handleMoveUp}
				handleMoveDown={handleMoveDown}
				handleClose={handleClose}
			/>
		);
	});
