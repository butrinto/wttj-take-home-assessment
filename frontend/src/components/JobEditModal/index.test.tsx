import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { JobEditModal } from ".";

// Mock fetch globally
global.fetch = vi.fn();

// Mock Cookies
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(() => "mock-token"),
  },
}));

const mockJob = {
  id: 1,
  title: "Frontend Developer",
  description: "Build amazing UIs",
  office: "Paris",
  contract_type: "FULL_TIME",
  work_mode: "remote",
  status: "published",
};

describe("JobEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when not open", () => {
    render(
      <BrowserRouter>
        <JobEditModal jobId="1" isOpen={false} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.queryByText("Edit Job")).not.toBeInTheDocument();
  });

  it("fetches and prefills form with job data", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockJob }),
    });

    render(
      <BrowserRouter>
        <JobEditModal jobId="1" isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Frontend Developer")).toBeVisible();
    });

    expect(screen.getByDisplayValue("Build amazing UIs")).toBeVisible();
    expect(screen.getByDisplayValue("Paris")).toBeVisible();
  });

  it("has Save, Cancel, and Delete buttons", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockJob }),
    });

    render(
      <BrowserRouter>
        <JobEditModal jobId="1" isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeVisible();
    });

    expect(screen.getByText("Cancel")).toBeVisible();
    expect(screen.getByText("Delete Job")).toBeVisible();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockJob }),
    });

    render(
      <BrowserRouter>
        <JobEditModal jobId="1" isOpen={true} onClose={handleClose} />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeVisible();
    });

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(handleClose).toHaveBeenCalled();
  });
});
