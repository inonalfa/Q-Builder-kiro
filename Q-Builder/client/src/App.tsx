import AppRouter from './components/routing/AppRouter';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Notification from './components/ui/Notification';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <Notification />
    </ErrorBoundary>
  );
}

export default App;