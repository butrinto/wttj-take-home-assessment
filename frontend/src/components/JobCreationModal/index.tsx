import { JobModal } from "../JobModal";
import { Field } from "welcome-ui/Field";
import { InputText } from "welcome-ui/InputText";
import { Select } from "welcome-ui/Select";
import { Textarea } from "welcome-ui/Textarea";
import { Button } from "welcome-ui/Button";
import { useState } from "react";

interface JobCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobCreationModal = ({
  isOpen,
  onClose,
}: JobCreationModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    office: "",
    contract_type: "",
    work_mode: "",
    status: "draft",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // API call will go here in next commit
  };

  if (!isOpen) return null;

  return (
    <JobModal isOpen={isOpen} onClose={onClose} title="Create New Job">
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

        <div className="flex gap-md mt-lg">
          <Button type="submit" variant="primary">
            Create Job
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </JobModal>
  );
};
