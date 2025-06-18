import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';
import AppRoutes from './routes';
import { store } from './app/store';
import ThemeProvider from './features/theme/components/ThemeProvider';
import { SocketProvider } from './context/SocketContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* StyledEngineProvider allows Tailwind to override MUI styles */}
        <StyledEngineProvider injectFirst>
          <ThemeProvider>
            <SocketProvider>
              <div className="min-h-screen">
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </div>
            </SocketProvider>
          </ThemeProvider>
        </StyledEngineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default App;