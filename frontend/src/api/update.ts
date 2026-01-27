export type UpdateJobParams = {
  title: string;
  description: string;
  office: string;
  contract_type: string;
  work_mode: string;
  status: string;
};

export const updateJob = async (
  jobId: string,
  params: UpdateJobParams,
  token: string,
): Promise<any> => {
  const res = await fetch(`/api/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job: params }),
  });

  if (!res.ok) {
    throw new Error("Failed to update job");
  }

  return res.json();
};
