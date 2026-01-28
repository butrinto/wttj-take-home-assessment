import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { JobCreationModal } from ".";

// Mock the API
vi.mock("../../api/create", () => ({
  createJob: vi.fn(),
}));

// Mock Cookies
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(() => "mock-token"),
  },
}));

describe("JobCreationModal", () => {
  it("renders nothing when not open", () => {
    render(
      <BrowserRouter>
        <JobCreationModal isOpen={false} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.queryByText("Create New Job")).not.toBeInTheDocument();
  });

  it("renders form fields when open", () => {
    render(
      <BrowserRouter>
        <JobCreationModal isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Create New Job")).toBeVisible();
    expect(screen.getByLabelText(/Job Title/i)).toBeVisible();
    expect(screen.getByLabelText(/Description/i)).toBeVisible();
    expect(screen.getByLabelText(/Office Location/i)).toBeVisible();
    expect(screen.getByLabelText(/Contract Type/i)).toBeVisible();
  });

  it("has Create Job button", () => {
    render(
      <BrowserRouter>
        <JobCreationModal isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.getByRole("button", { name: /Create Job/i })).toBeVisible();
  });

  it("has Cancel button that calls onClose", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <BrowserRouter>
        <JobCreationModal isOpen={true} onClose={handleClose} />
      </BrowserRouter>,
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    expect(handleClose).toHaveBeenCalled();
  });

  it("requires title field", async () => {
    render(
      <BrowserRouter>
        <JobCreationModal isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    const titleInput = screen.getByLabelText(/Job Title/i);
    expect(titleInput).toHaveAttribute("required");
  });
});
