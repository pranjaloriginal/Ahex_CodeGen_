import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

test('adds a new todo', () => {
    render(<App />);
    const input = screen.getByLabelText(/new to-do item/i);
    const button = screen.getByText(/add/i);
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);
    expect(screen.getByText(/new todo/i)).toBeInTheDocument();
});