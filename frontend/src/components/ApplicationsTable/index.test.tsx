import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ApplicationsTable } from ".";

const mockApplications = [
  {
    id: 1,
    candidate_name: "John Doe",
    candidate_email: "john@example.com",
    candidate_phone: "0612345678",
    last_known_job: "Frontend Developer",
    salary_expectation: 50000,
    status: "new",
  },
  {
    id: 2,
    candidate_name: "Jane Smith",
    candidate_email: "jane@example.com",
    candidate_phone: "0687654321",
    last_known_job: "Backend Developer",
    salary_expectation: 60000,
    status: "new",
  },
];

describe("ApplicationsTable", () => {
  it("shows message when no applications", () => {
    render(<ApplicationsTable applications={[]} />);

    expect(screen.getByText("No applications yet")).toBeVisible();
  });

  it("renders table with applications", () => {
    render(<ApplicationsTable applications={mockApplications} />);

    expect(screen.getByText("John Doe")).toBeVisible();
    expect(screen.getByText("Jane Smith")).toBeVisible();
    expect(screen.getByText("Frontend Developer")).toBeVisible();
    expect(screen.getByText("Backend Developer")).toBeVisible();
  });

  it("displays salary expectations formatted", () => {
    render(<ApplicationsTable applications={mockApplications} />);

    expect(screen.getByText("€50,000")).toBeVisible();
    expect(screen.getByText("€60,000")).toBeVisible();
  });

  it("has Email and Phone buttons for each application", () => {
    render(<ApplicationsTable applications={mockApplications} />);

    const emailButtons = screen.getAllByText("Email");
    const phoneButtons = screen.getAllByText("Phone");

    expect(emailButtons).toHaveLength(2);
    expect(phoneButtons).toHaveLength(2);
  });

  it("renders Email and Phone buttons with correct handlers", () => {
    render(<ApplicationsTable applications={mockApplications} />);

    const emailButtons = screen.getAllByText("Email");
    const phoneButtons = screen.getAllByText("Phone");

    expect(emailButtons[0]).toBeInTheDocument();
    expect(phoneButtons[0]).toBeInTheDocument();
    expect(emailButtons).toHaveLength(2);
    expect(phoneButtons).toHaveLength(2);
  });
});
