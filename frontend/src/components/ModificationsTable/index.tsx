import { Table } from "welcome-ui/Table";
import { Button } from "welcome-ui/Button";
import { Popover, usePopover } from "welcome-ui/Popover";

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
}

const ModificationAction = ({ mod }: { mod: Modification }) => {
  const popover = usePopover();

  return (
    <>
      <Popover.Trigger as={Button} store={popover} size="sm" variant="tertiary">
        View Edits
      </Popover.Trigger>
      {/* 1. maxWidth: Prevents the popover from being wider than the modal.
          2. zIndex: Ensures it sits on top of the Welcome-UI Modal.
      */}
      <Popover
        aria-label="Edit Details"
        store={popover}
        style={{ maxWidth: "300px", zIndex: 1000 }}
      >
        <Popover.Content>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#000", // Matches your screenshot
              color: "#fff",
              borderRadius: "4px",
              wordBreak: "break-word", // CRITICAL: Forces long text to wrap
              overflowWrap: "anywhere",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "12px",
                borderBottom: "1px solid #444",
                paddingBottom: "8px",
              }}
            >
              Edit Details
            </div>
            <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Field:</strong> {mod.field_name}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Old Value:</strong> {mod.old_value || "None"}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>New Value:</strong> {mod.new_value}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Changed By:</strong> {mod.user_email}
              </div>
              <div>
                <strong>Changed At:</strong>{" "}
                {new Date(mod.inserted_at).toLocaleString()}
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </>
  );
};

export const ModificationsTable = ({
  modifications,
}: ModificationsTableProps) => {
  if (!modifications || modifications.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        No modifications yet
      </div>
    );
  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Edit User</Table.Th>
          <Table.Th>Edit Timestamp</Table.Th>
          <Table.Th>Edit Action/s</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {modifications.map((mod) => (
          <Table.Tr key={mod.id}>
            <Table.Td>{mod.user_email}</Table.Td>
            <Table.Td>{new Date(mod.inserted_at).toLocaleString()}</Table.Td>
            <Table.Td>
              <ModificationAction mod={mod} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
