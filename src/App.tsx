import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { EmergencyProvider } from './context/EmergencyContext';

function App() {
  return (
    <EmergencyProvider>
      <RouterProvider router={router} />
    </EmergencyProvider>
  );
}

export default App;
