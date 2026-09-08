import { type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { Layout } from '@/components/Layout';
import { ToastProvider } from '@/components/toast';
import { StoreProvider } from '@/hooks/useStore';
import { HomePage, ShopPage, CollectionsPage, ProductPage, AboutPage, SearchPage, FavoritesPage, CartPage, CheckoutPage, ConfirmationPage } from '@/pages/StorePages';

function Router() {
  return (
    <Layout>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/collections" component={CollectionsPage} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/favorites" component={FavoritesPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/order-confirmation" component={ConfirmationPage} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Layout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;
