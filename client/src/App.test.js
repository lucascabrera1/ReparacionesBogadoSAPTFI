import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import {store} from '../src/App/Store';

test('renders learn react link', () => {
  render(<Provider store={store}><App /></Provider>);
  const linkElement = screen.getByText(/Reparaciones Bogado/i);
  expect(linkElement).toBeInTheDocument(); 
});
