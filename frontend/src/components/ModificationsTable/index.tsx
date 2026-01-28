import { Table } from "welcome-ui/Table";
import { Button } from "welcome-ui/Button";

interface Modification {
  id: number;
  field_name: string;
  old_value: string;
  new_value: string;
  user_email: string;
  inserted_at: string;
}

interface ModificationsTableProps {
  modifications: Modification[];
  onViewEdits: (mod: Modification) => void;
}

export const ModificationsTable = ({
  modifications,
  onViewEdits,
}: ModificationsTableProps) => {
  if (modifications.length === 0) {
    return <div>No modifications yet</div>;
  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Who Edited</Table.Th>
          <Table.Th>When</Table.Th>
          <Table.Th>Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {modifications.map((mod) => (
          <Table.Tr key={mod.id}>
            <Table.Td>{mod.user_email}</Table.Td>
            <Table.Td>{new Date(mod.inserted_at).toLocaleString()}</Table.Td>
            <Table.Td>
              <Button size="sm" onClick={() => onViewEdits(mod)}>
                View Edits
              </Button>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
