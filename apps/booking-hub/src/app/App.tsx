import { Provider } from 'react-redux';
import { EventsList } from '../features/events/EventsList';
import { store } from './store';
import './App.css';

export default function App() {
  return (
    <Provider store={store}>
      <main className="booking-hub">
        <h1>BookingHub</h1>
        <p>Learning scaffold. Events use in-memory demo data.</p>
        <EventsList />
      </main>
    </Provider>
  );
}
