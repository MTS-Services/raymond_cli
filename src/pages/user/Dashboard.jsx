import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../config';
import { selectUser } from '../../store/slices/authSlice';

const UserDashboard = () => {
	const user = useSelector(selectUser);
	const isAdmin = String(user?.role || '').toUpperCase() === 'ADMIN';

	return (
		<Navigate
			to={isAdmin ? ROUTES.ADMIN_LISTING_PROPERTY : ROUTES.USER_MESSAGES}
			replace
		/>
	);
};

export default UserDashboard;
