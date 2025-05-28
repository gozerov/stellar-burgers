import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store/store';

export const AppHeader: FC = () => {
    const user = useAppSelector((state) => state.auth.data);

    return <AppHeaderUI userName={user.name} />;
};
