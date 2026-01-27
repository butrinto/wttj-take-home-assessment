import { Modal, useModal } from "welcome-ui/Modal";
import { Accordion, useAccordion } from "welcome-ui/Accordion";
import { Button } from "welcome-ui/Button";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

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
}

export const JobModal = ({
  isOpen,
  onClose,
  children,
  title,
  isAuthenticated = false,
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <h2 style={{ margin: 0 }}>{title || "Job Details"}</h2>
              <Button variant="ghost" size="sm" onClick={modal.hide}>
                ✕
              </Button>
            </div>
          </Modal.Header>

          <Modal.Body>
            {children}
            <div className="mt-lg">
              <Accordion store={accordionApplications} title="Applications">
                <div>Applications list coming soon...</div>
              </Accordion>

              <Accordion store={accordionHistory} title="Change History">
                <div>Change history coming soon...</div>
              </Accordion>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    );
  }

  // Non-authenticated users get simple modal
  return (
    <Modal ariaLabel={title || "Job Modal"} store={modal}>
      <Modal.Content>
        <Modal.Body title={title}>{children}</Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
