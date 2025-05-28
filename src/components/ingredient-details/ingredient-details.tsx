import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
	const { id } = useParams<{ id: string }>();

	/** TODO: взять переменную из стора */
	const ingredientData = useAppSelector(store => store.ingredients.data.find(ingredient => ingredient._id === id));

	if (!ingredientData) {
		return <Preloader />;
	}

	return <IngredientDetailsUI ingredientData={ingredientData} />;
};
