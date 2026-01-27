import { JobModal } from "../JobModal";
import { Text } from "welcome-ui/Text";
import { Button } from "welcome-ui/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Job {
  id: number;
  title: string;
  description: string;
  contract_type: string;
  office: string;
  status: string;
  work_mode: string;
}

interface JobDetailModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}

export const JobDetailModal = ({
  jobId,
  isOpen,
  onClose,
  isAuthenticated,
}: JobDetailModalProps) => {
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !jobId) return;

    setLoading(true);
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((response: { data: Job }) => {
        setJob(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [jobId, isOpen]);

  if (!isOpen) return null;

  const jobDetailsContent = (
    <div>
      <Text className="mb-sm">
        <strong>Description:</strong> {job?.description}
      </Text>
      <Text className="mb-sm">
        <strong>Contract Type:</strong> {job?.contract_type}
      </Text>
      <Text className="mb-sm">
        <strong>Office:</strong> {job?.office}
      </Text>
      <Text className="mb-sm">
        <strong>Work Mode:</strong> {job?.work_mode}
      </Text>
      <Text className="mb-sm">
        <strong>Status:</strong> {job?.status}
      </Text>

      {!isAuthenticated && (
        <div className="flex justify-end mt-lg">
          <Button onClick={() => navigate(`/jobs/${jobId}/apply`)}>
            Apply for this Job
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <JobModal
      isOpen={isOpen}
      onClose={onClose}
      title={job?.title || "Job Details"}
      isAuthenticated={isAuthenticated}
      job={job}
      loading={loading}
      error={error}
    >
      {jobDetailsContent}
    </JobModal>
  );
};
