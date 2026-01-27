import { JobModal } from "../JobModal";

interface JobCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobCreationModal = ({
  isOpen,
  onClose,
}: JobCreationModalProps) => {
  if (!isOpen) return null;

  return (
    <JobModal isOpen={isOpen} onClose={onClose} title="Create New Job">
      <div>Form coming soon...</div>
    </JobModal>
  );
};
