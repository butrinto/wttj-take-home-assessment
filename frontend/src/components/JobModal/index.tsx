import { Modal, useModal } from "welcome-ui/Modal";
import { Accordion, useAccordion } from "welcome-ui/Accordion";
import { Button } from "welcome-ui/Button";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { ApplicationsTable } from "../ApplicationsTable";

interface Job {
  id: number;
  title: string;
  description: string;
  contract_type: string;
  office: string;
  status: string;
  work_mode: string;
}

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  isAuthenticated?: boolean;
  job?: Job | null;
  loading?: boolean;
  error?: string | null;
  applications?: any[];
  modifications?: any[];
  footerActions?: ReactNode;
}

export const JobModal = ({
  isOpen,
  onClose,
  children,
  title,
  isAuthenticated = false,
  applications = [],
  modifications = [],
  footerActions,
}: JobModalProps) => {
  const navigate = useNavigate();
  const modal = useModal({
    defaultOpen: isOpen,
    onClose: () => {
      onClose();
      navigate("/");
    },
  });

  const accordionApplications = useAccordion();
  const accordionHistory = useAccordion();

  if (!isOpen) return null;

  // Authenticated users see details + accordions for extra info
  if (isAuthenticated) {
    return (
      <Modal ariaLabel={title || "Job Modal"} store={modal}>
        <Modal.Content>
          <Modal.Header title={title || "Job Details"}>
            <Button variant="ghost" size="sm" onClick={modal.hide}>
              ✕
            </Button>
          </Modal.Header>

          <Modal.Body style={{ padding: "24px" }}>
            <div className="modal-scroll">
              {children}
              <div className="mt-lg">
                <Accordion store={accordionApplications} title="Applications">
                  <ApplicationsTable applications={applications} />
                </Accordion>

                <Accordion store={accordionHistory} title="Change History">
                  {modifications.length === 0 ? (
                    <div>No modifications yet</div>
                  ) : (
                    <ul>
                      {modifications.map((mod: any) => (
                        <li key={mod.id}>
                          {mod.user_email} changed {mod.field_name} at{" "}
                          {new Date(mod.inserted_at).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  )}
                </Accordion>
              </div>
            </div>

            {footerActions && (
              <div className="flex justify-end mt-lg">{footerActions}</div>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    );
  }

  // Non-authenticated users get simple modal
  return (
    <Modal ariaLabel={title || "Job Modal"} store={modal}>
      <Modal.Content>
        <Modal.Header title={title || "Job Details"}>
          <Button variant="ghost" size="sm" onClick={modal.hide}>
            ✕
          </Button>
        </Modal.Header>
        <Modal.Body style={{ padding: "24px" }}>
          <div className="modal-scroll">{children}</div>

          {footerActions && (
            <div className="flex justify-end mt-lg">{footerActions}</div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
