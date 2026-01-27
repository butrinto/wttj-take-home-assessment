import { JobModal } from "../JobModal";
import { ApplyForm, ApplyFormValues } from "../ApplyForm";
import { useApply } from "../ApplyForm/useApply";

interface JobApplyModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const JobApplyModal = ({
  jobId,
  isOpen,
  onClose,
}: JobApplyModalProps) => {
  const { handleApply, loading, error } = useApply();

  const onSubmit = async (values: ApplyFormValues) => {
    await handleApply(jobId, {
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      last_known_job: values.last_known_job,
      salary_expectation: Number(values.salary_expectation),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <JobModal isOpen={isOpen} onClose={onClose} title="Apply for Job">
      <ApplyForm
        onSubmit={onSubmit}
        serverError={error}
        initialLoading={loading}
      />
    </JobModal>
  );
};
