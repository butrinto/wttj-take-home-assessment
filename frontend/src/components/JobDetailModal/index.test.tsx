import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { JobDetailModal } from ".";

// Mock fetch globally
global.fetch = vi.fn();

const mockJob = {
  id: 1,
  title: "Frontend Developer",
  description: "Build amazing UIs",
  contract_type: "FULL_TIME",
  office: "Paris",
  work_mode: "remote",
  status: "published",
};

describe("JobDetailModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when not open", () => {
    render(
      <BrowserRouter>
        <JobDetailModal
          jobId="1"
          isOpen={false}
          onClose={vi.fn()}
          isAuthenticated={false}
        />
      </BrowserRouter>,
    );

    expect(screen.queryByText("Frontend Developer")).not.toBeInTheDocument();
  });

  it("fetches and displays job details when open", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockJob }),
    });

    render(
      <BrowserRouter>
        <JobDetailModal
          jobId="1"
          isOpen={true}
          onClose={vi.fn()}
          isAuthenticated={false}
        />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Build amazing UIs/i)).toBeVisible();
    });

    expect(screen.getByText(/Paris/i)).toBeVisible();
    expect(screen.getByText(/remote/i)).toBeVisible();
  });

  it("shows Apply button for non-authenticated users", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockJob }),
    });

    render(
      <BrowserRouter>
        <JobDetailModal
          jobId="1"
          isOpen={true}
          onClose={vi.fn()}
          isAuthenticated={false}
        />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Apply for this Job")).toBeVisible();
    });
  });

  it("shows Edit button for authenticated users", async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJob }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

    render(
      <BrowserRouter>
        <JobDetailModal
          jobId="1"
          isOpen={true}
          onClose={vi.fn()}
          isAuthenticated={true}
        />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Job")).toBeVisible();
    });
  });
});
