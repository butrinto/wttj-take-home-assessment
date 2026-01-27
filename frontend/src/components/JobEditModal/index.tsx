import { JobModal } from "../JobModal";
import { Field } from "welcome-ui/Field";
import { InputText } from "welcome-ui/InputText";
import { Select } from "welcome-ui/Select";
import { Textarea } from "welcome-ui/Textarea";
import { Button } from "welcome-ui/Button";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { updateJob } from "../../api/update";

interface Job {
  id: number;
  title: string;
  description: string;
  office: string;
  contract_type: string;
  work_mode: string;
  status: string;
}

interface JobEditModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const JobEditModal = ({ jobId, isOpen, onClose }: JobEditModalProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    office: "",
    contract_type: "",
    work_mode: "",
    status: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !jobId) return;

    // Fetch job data to prefill form
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((response: { data: Job }) => {
        setJob(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          office: response.data.office,
          contract_type: response.data.contract_type,
          work_mode: response.data.work_mode,
          status: response.data.status,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jobId, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = Cookies.get("user-token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      await updateJob(jobId, formData, token);

      // Success - close modal and refresh
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;
  if (loading) return <div>Loading...</div>;

  return (
    <JobModal isOpen={isOpen} onClose={onClose} title="Edit Job">
      <form onSubmit={handleSubmit}>
        <Field label="Job Title" className="mb-md" required>
          <InputText
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            required
          />
        </Field>

        <Field label="Description" className="mb-md">
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Job description..."
            rows={4}
          />
        </Field>

        <Field label="Office Location" className="mb-md" required>
          <InputText
            value={formData.office}
            onChange={(e) => handleChange("office", e.target.value)}
            placeholder="e.g. Paris, London"
            required
          />
        </Field>

        <Field label="Contract Type" className="mb-md" required>
          <Select
            value={formData.contract_type}
            onChange={(value) => handleChange("contract_type", value as string)}
            options={[
              { label: "Full-Time", value: "FULL_TIME" },
              { label: "Part-Time", value: "PART_TIME" },
              { label: "Temporary", value: "TEMPORARY" },
              { label: "Freelance", value: "FREELANCE" },
              { label: "Internship", value: "INTERNSHIP" },
            ]}
            placeholder="Select contract type"
            required
          />
        </Field>

        <Field label="Work Mode" className="mb-md">
          <Select
            value={formData.work_mode}
            onChange={(value) => handleChange("work_mode", value as string)}
            options={[
              { label: "Onsite", value: "onsite" },
              { label: "Remote", value: "remote" },
              { label: "Hybrid", value: "hybrid" },
            ]}
            placeholder="Select work mode"
          />
        </Field>

        <Field label="Status" className="mb-md">
          <Select
            value={formData.status}
            onChange={(value) => handleChange("status", value as string)}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
            placeholder="Select status"
          />
        </Field>

        {error && (
          <div className="mb-md" style={{ color: "red" }}>
            {error}
          </div>
        )}

        <div className="flex gap-md mt-lg">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </JobModal>
  );
};
