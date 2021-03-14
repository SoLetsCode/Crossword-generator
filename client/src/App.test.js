import { render, screen } from "@testing-library/react";
import App from "./App";

test("Datamuse kudos", () => {
  render(<App />);
  const linkElement = screen.getByText(/www.datamuse.com/i);
  expect(linkElement).toBeInTheDocument();
});
