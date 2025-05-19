import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

test('renders todo input and button', () => {
    render(<App />);
    const inputElement = screen.getByLabelText(/new todo item/i);
    const buttonElement = screen.getByText(/add/i);
    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
});

test('adds a new todo', () => {
    render(<App />);
    const inputElement = screen.getByLabelText(/new todo item/i);
    const buttonElement = screen.getByText(/add/i);
    fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
    fireEvent.click(buttonElement);
    expect(screen.getByText(/test todo/i)).toBeInTheDocument();
});