import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from "../components/Header";

describe('Header Component', () => {
  test('renders the header with the correct title', () => {
    render(<Header />);
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Task Manager');
  });

  test('renders the header description', () => {
    render(<Header />);
    const descriptionElement = screen.getByText(/organize and track your tasks effectively/i);
    expect(descriptionElement).toBeInTheDocument();
  });
});
