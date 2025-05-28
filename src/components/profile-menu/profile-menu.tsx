import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileMenuUI } from "@ui";
import { useAppDispatch } from "../../services/store/store";
import { logout } from "../../services/slices/authSlice/authSlice";

export const ProfileMenu: FC = () => {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout())
			.unwrap()
			.then(() => {
				navigate("/login");
			})
			.catch((error) => {
				console.error("Ошибка при выходе:", error);
			});
	};

	return (
		<ProfileMenuUI
			handleLogout={handleLogout}
			pathname={pathname}
		/>
	);
};
