export type CreateJobParams = {
  title: string;
  description: string;
  office: string;
  contract_type: string;
  work_mode: string;
  status: string;
};

export const createJob = async (
  params: CreateJobParams,
  token: string,
): Promise<any> => {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job: params }),
  });

  if (!res.ok) {
    throw new Error("Failed to create job");
  }

  return res.json();
};
