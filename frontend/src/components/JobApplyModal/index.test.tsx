import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { JobApplyModal } from ".";

// Mock the useApply hook
vi.mock("../ApplyForm/useApply", () => ({
  useApply: () => ({
    handleApply: vi.fn(),
    loading: false,
    error: null,
  }),
}));

describe("JobApplyModal", () => {
  it("renders nothing when not open", () => {
    render(
      <BrowserRouter>
        <JobApplyModal jobId="1" isOpen={false} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.queryByText("Apply for Job")).not.toBeInTheDocument();
  });

  it("renders apply form when open", () => {
    render(
      <BrowserRouter>
        <JobApplyModal jobId="1" isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Apply for Job")).toBeVisible();
    expect(screen.getByLabelText(/Full name/i)).toBeVisible();
    expect(screen.getByLabelText(/Email/i)).toBeVisible();
    expect(screen.getByLabelText(/Phone/i)).toBeVisible();
  });

  it("has Apply button", () => {
    render(
      <BrowserRouter>
        <JobApplyModal jobId="1" isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.getByRole("button", { name: /Apply/i })).toBeVisible();
  });

  it("requires all form fields", () => {
    render(
      <BrowserRouter>
        <JobApplyModal jobId="1" isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.getByLabelText(/Full name/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/Email/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/Phone/i)).toHaveAttribute("required");
  });
});
