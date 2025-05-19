import { render, screen } from '@testing-library/react';

export const renderWithProviders = (ui, { ...renderOptions } = {}) => {
    return render(ui, { ...renderOptions });
};