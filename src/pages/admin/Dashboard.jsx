import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../config';

const Dashboard = () => <Navigate to={ROUTES.ADMIN_LISTING_PROPERTY} replace />;

export default Dashboard;
