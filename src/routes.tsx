import { createBrowserRouter, Navigate } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import History from './pages/History';

import { useEmergency } from './context/EmergencyContext';
import { ReactNode } from 'react';

// Require Auth wrapper
function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useEmergency();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <MobileLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "history",
        element: <History />,
      }
    ]
  }
]);
