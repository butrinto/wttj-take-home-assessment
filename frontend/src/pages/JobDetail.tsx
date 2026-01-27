import { useParams, Link } from "react-router-dom";
import { Text } from "welcome-ui/Text";
import { useState, useEffect } from "react";

interface Job {
  id: number;
  title: string;
  description: string;
  contract_type: string;
  office: string;
  status: string;
  work_mode: string;
}

export const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((res) => res.json())
      .then((response: { data: Job }) => {
        setJob(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text className="text-red-70">Error: {error}</Text>;
  if (!job) return <Text>Job not found</Text>;

  return (
    <div className="p-xl max-w-1200 my-0 mx-auto">
      <Link to="/">← Back to Jobs</Link>
      <Text variant="h1" className="mt-md mb-md">
        {job.title}
      </Text>

      <div>
        <Text>
          <strong>Description:</strong> {job.description}
        </Text>
        <Text>
          <strong>Contract Type:</strong> {job.contract_type}
        </Text>
        <Text>
          <strong>Office:</strong> {job.office}
        </Text>
        <Text>
          <strong>Work Mode:</strong> {job.work_mode}
        </Text>
        <Text>
          <strong>Status:</strong> {job.status}
        </Text>
      </div>
    </div>
  );
};
