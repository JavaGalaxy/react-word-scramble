import { render, screen, waitFor, act } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  jest.useFakeTimers();

  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve("apple\nbanana\ncherry"),
    }),
  ) as jest.Mock;
});

afterEach(() => {
  jest.useRealTimers();
});

test("displays loading state initially", () => {
  render(<App />);
  expect(screen.getByText(/loading data/i)).toBeInTheDocument();
});

test("shows begin button after data loads", async () => {
  render(<App />);

  expect(screen.getByText(/loading data/i)).toBeInTheDocument();

  await act(async () => {
    await Promise.resolve();
  });

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  await waitFor(
    () => {
      expect(screen.getByText(/begin new game/i)).toBeInTheDocument();
    },
    { timeout: 1000 },
  );
});
