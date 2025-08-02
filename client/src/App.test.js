import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple component test to ensure React and testing setup works
const TestComponent = () => {
  return <div data-testid="test-component">Hello World</div>;
};

test('React testing setup works', () => {
  render(<TestComponent />);
  expect(screen.getByTestId('test-component')).toBeInTheDocument();
  expect(screen.getByTestId('test-component')).toHaveTextContent('Hello World');
});

test('basic assertions work', () => {
  expect(true).toBe(true);
  expect('hello').toEqual('hello');
  expect([1, 2, 3]).toHaveLength(3);
});
