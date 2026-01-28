import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from ".";

describe("SearchBar", () => {
  it("renders search input with placeholder", () => {
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
        placeholder="Search by title..."
      />,
    );

    const input = screen.getByPlaceholderText("Search by title...");
    expect(input).toBeVisible();
  });

  it("displays the current value", () => {
    render(
      <SearchBar value="frontend" onChange={vi.fn()} placeholder="Search..." />,
    );

    const input = screen.getByDisplayValue("frontend");
    expect(input).toBeVisible();
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SearchBar value="" onChange={handleChange} placeholder="Search..." />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "developer");

    expect(handleChange).toHaveBeenCalled();
  });
});
