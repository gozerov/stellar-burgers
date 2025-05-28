import { FC, SyntheticEvent, useState } from "react";
import { LoginUI } from "@ui-pages";
import { useAppDispatch, useAppSelector } from "../../services/store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../services/slices/authSlice/authSlice";

export const Login: FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { from } = location.state || { from: { pathname: "/" } };
	const { loginError } = useAppSelector((store) => store.auth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();

		try {
			await dispatch(login({ email, password })).unwrap();
			navigate(from.pathname, { replace: true });
		} catch (_) {}
	};

	return (
		<LoginUI
			errorText={loginError?.message}
			email={email}
			setEmail={setEmail}
			password={password}
			setPassword={setPassword}
			handleSubmit={handleSubmit}
		/>
	);
};
