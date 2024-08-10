import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders start drawing button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Start Drawing/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders shuffle deck button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Shuffle Deck/i);
  expect(buttonElement).toBeInTheDocument();
});

test('starts and stops drawing cards', async () => {
  render(<App />);
  const startButton = screen.getByText(/Start Drawing/i);
  
  // Start drawing
  fireEvent.click(startButton);
  expect(startButton).toHaveTextContent(/Stop Drawing/i);

  // Wait for a card to be drawn
  await waitFor(() => {
    const cardImage = screen.getByRole('img');
    expect(cardImage).toBeInTheDocument();
  });

  // Stop drawing
  fireEvent.click(startButton);
  expect(startButton).toHaveTextContent(/Start Drawing/i);
});

test('shuffles the deck', async () => {
  render(<App />);
  const shuffleButton = screen.getByText(/Shuffle Deck/i);
  
  // Shuffle the deck
  fireEvent.click(shuffleButton);
  expect(shuffleButton).toHaveTextContent(/Shuffling.../i);

  // Wait for shuffling to complete
  await waitFor(() => {
    expect(shuffleButton).toHaveTextContent(/Shuffle Deck/i);
  });
});
