import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './routes';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <RouterProvider router={router} />
      </div>
      <Toaster />
    </>
  );
}

export default App;
