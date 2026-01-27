import { Table } from "welcome-ui/Table";
import { Button } from "welcome-ui/Button";

interface Application {
  id: number;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  last_known_job: string;
  salary_expectation: number;
  status: string;
}

interface ApplicationsTableProps {
  applications: Application[];
}

export const ApplicationsTable = ({ applications }: ApplicationsTableProps) => {
  if (applications.length === 0) {
    return <div>No applications yet</div>;
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhone = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Full Name</Table.Th>
          <Table.Th>Last Known Job</Table.Th>
          <Table.Th>Salary Expectation</Table.Th>
          <Table.Th>Contact</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {applications.map((app) => (
          <Table.Tr key={app.id}>
            <Table.Td>{app.candidate_name}</Table.Td>
            <Table.Td>{app.last_known_job}</Table.Td>
            <Table.Td>€{app.salary_expectation.toLocaleString()}</Table.Td>
            <Table.Td>
              <div className="flex gap-sm">
                <Button
                  size="sm"
                  onClick={() => handleEmail(app.candidate_email)}
                >
                  Email
                </Button>
                {app.candidate_phone && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handlePhone(app.candidate_phone)}
                  >
                    Phone
                  </Button>
                )}
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
