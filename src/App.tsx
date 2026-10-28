import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@/components/common';
import { AppThemeProvider, FaviconProvider } from '@/providers';
import { AppRoutes } from '@/routes';

export function App() {
  return (
    <AppThemeProvider>
      <FaviconProvider />
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppThemeProvider>
  );
}

export default App;
