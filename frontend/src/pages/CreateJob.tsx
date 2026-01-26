import { Link, useNavigate } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { Text } from "welcome-ui/Text";
import { useState, FormEvent } from "react";

export const CreateJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job: {
          title,
          description,
          contract_type: "FULL_TIME",
          office: "Remote",
          status: "published",
          work_mode: "remote",
          profession_id: 1,
        },
      }),
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="p-xl max-w-1200 my-0 mx-auto">
      <Link to="/">← Back to Jobs</Link>
      <Text variant="h1" className="mt-md mb-md">
        Create New Job
      </Text>
      <Text className="mb-lg">
        TODO: Improve this form using welcome-ui Form, Field, Input components.
      </Text>

      {error && <Text className="mb-md text-red-70">Error: {error}</Text>}

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-md">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Job"}
        </Button>
      </form>
    </div>
  );
};
