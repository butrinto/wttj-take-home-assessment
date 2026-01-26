import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { Text } from "welcome-ui/Text";
import Cookies from "js-cookie";
import { logout } from "../api/logout";

interface Job {
  id: string;
  title: string;
  description: string;
  contract_type: string;
  office: string;
  status: string;
}

export const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBearerToken, setHasBearerToken] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/jobs")
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
      <Text variant="h1" className="mb-md">
        Job Listings
      </Text>

      <div>
        {jobs.map((job) => (
          <div key={job.id} className="p-md mb-md bg-neutral-20">
            <div className="flex items-center justify-between">
              <Link to={`/jobs/${job.id}`}>
                <Text variant="h3">{job.title}</Text>
              </Link>
              <Button as={Link} to={`/jobs/${job.id}/apply`} size="sm">
                Apply
              </Button>
            </div>
            <Text>{job.description}</Text>
            <Text variant="sm">
              Type: {job.contract_type} | Office: {job.office}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};
