import { ThemeProvider } from './components/theme';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router';
import { Toaster } from './components';

const router = createBrowserRouter(routes);
function App() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
