import React from 'react';
import { Routes, Route, Navigate, BrowserRouter, useInRouterContext } from 'react-router-dom';
import { DashboardLayout } from '../shared/layouts/DashboardLayout';
import { UserListPage } from '../features/users/pages/UserListPage';
import { UserDetailPage } from '../features/users/pages/UserDetailPage';
import { CreateUserPage } from '../features/users/pages/CreateUserPage';
import { EditUserPage } from '../features/users/pages/EditUserPage';

// Conditional Router Wrapper that prevents double-BrowserRouter crashes in Federated Shell integrations
export const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let hasRouterContext = false;
  try {
    hasRouterContext = useInRouterContext();
  } catch (err) {
    hasRouterContext = false;
  }

  if (hasRouterContext) {
    return <>{children}</>;
  }

  return <BrowserRouter>{children}</BrowserRouter>;
};

// Core application nested sub-routes
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Standalone redirects to users list */}
        <Route index element={<Navigate to="/users" replace />} />
        
        {/* User domain routing structure */}
        <Route path="users">
          <Route index element={<UserListPage />} />
          <Route path="create" element={<CreateUserPage />} />
          <Route path=":id" element={<UserDetailPage />} />
          <Route path=":id/edit" element={<EditUserPage />} />
        </Route>

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Route>
    </Routes>
  );
};
