export const deleteJob = async (
  jobId: string,
  token: string,
): Promise<void> => {
  const res = await fetch(`/api/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete job");
  }
};
