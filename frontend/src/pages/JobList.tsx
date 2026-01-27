import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { Text } from "welcome-ui/Text";
import Cookies from "js-cookie";
import { logout } from "../api/logout";
import { SearchBar } from "../components/SearchBar";
import { JobDetailModal } from "../components/JobDetailModal";
import { JobCreationModal } from "../components/JobCreationModal";
import { JobApplyModal } from "../components/JobApplyModal";

interface Job {
  id: string;
  title: string;
  description: string;
  contract_type: string;
  office: string;
  status: string;
}

export const JobList = () => {
  const { id } = useParams<{ id?: string }>();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBearerToken, setHasBearerToken] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseModal = () => {
    navigate("/");
  };

  useEffect(() => {
    const bearerToken = Cookies.get("user-token");
    const csrfToken = Cookies.get("technical-test-csrf-token");

    // Include auth token to fetch all jobs (including drafts) when logged in
    fetch("/api/jobs", {
      headers: {
        ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
        ...(csrfToken && { "x-csrf-token": csrfToken }),
      },
    })
      .then((res) => res.json())
      .then((response: { data: Job[] }) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const csrfToken = Cookies.get("technical-test-csrf-token");
    const bearerToken = Cookies.get("user-token");
    setHasBearerToken(Boolean(bearerToken));

    if (bearerToken) {
      (async () => {
        try {
          const res = await fetch("/api/me", {
            credentials: "include",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${bearerToken}`,
              ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
            },
          });

          if (res.ok) {
            const body = await res.json().catch(() => ({}));
            setUser(body?.data ?? null);
          } else {
            setUser(null);
          }
        } catch (e) {
          setUser(null);
        }
      })();
    }
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.office.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isCreatingJob = window.location.pathname === "/jobs/new";
  const applyJobId =
    window.location.pathname.match(/\/jobs\/(\d+)\/apply/)?.[1];

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">Error: {error}</Text>;

  return (
    <div className="p-xl max-w-1200 my-0 mx-auto">
      {hasBearerToken ? (
        <div className="flex justify-end items-center mb-md">
          {user ? (
            <>
              <Text className="mr-sm">{user.email}</Text>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  try {
                    await logout();
                  } catch (e) {}
                  setUser(null);
                  setHasBearerToken(false);
                  navigate("/signin");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </div>
      ) : (
        <div className="flex justify-end mb-md">
          <Button as={Link} to="/signup" size="sm" className="mr-sm">
            Sign up
          </Button>
          <Button as={Link} to="/signin" size="sm" variant="ghost">
            Sign in
          </Button>
        </div>
      )}
      <div className="flex justify-between items-end mb-md">
        <Text variant="h1">Job Listings</Text>
        {hasBearerToken && (
          <Button onClick={() => navigate("/jobs/new")} size="sm">
            + New Job
          </Button>
        )}
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by title or location..."
      />

      <div></div>
      <div>
        {filteredJobs.map((job) => (
          <div key={job.id} className="p-md mb-md bg-neutral-20">
            <div className="flex items-center justify-between gap-md">
              <div
                onClick={() => navigate(`/jobs/${job.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Text variant="h3">{job.title}</Text>
              </div>
              {hasBearerToken ? (
                <Button
                  onClick={() => navigate(`/jobs/${job.id}/edit`)}
                  size="sm"
                  className="flex-shrink-0"
                  style={{ width: "60px" }}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  as={Link}
                  to={`/jobs/${job.id}/apply`}
                  size="sm"
                  className="flex-shrink-0"
                  style={{ width: "60px" }}
                >
                  Apply
                </Button>
              )}
            </div>
            <Text className="mt-sm">{job.description}</Text>
            <Text variant="sm" className="mt-auto">
              Type: {job.contract_type} | Office: {job.office}
            </Text>
          </div>
        ))}
      </div>

      <JobDetailModal
        jobId={id || ""}
        isOpen={!!id}
        onClose={handleCloseModal}
        isAuthenticated={hasBearerToken}
      />
      <JobCreationModal isOpen={isCreatingJob} onClose={handleCloseModal} />
      <JobApplyModal
        jobId={applyJobId || ""}
        isOpen={!!applyJobId}
        onClose={handleCloseModal}
      />
    </div>
  );
};
