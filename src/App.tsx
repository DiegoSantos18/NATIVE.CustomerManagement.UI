import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@/components/common/mui';
import { AppThemeProvider, FaviconProvider, NotificationProvider } from '@/providers';
import { AppRoutes } from '@/routes';

export function App() {
  return (
    <AppThemeProvider>
      <NotificationProvider>
        <FaviconProvider />
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </AppThemeProvider>
  );
}

export default App;
