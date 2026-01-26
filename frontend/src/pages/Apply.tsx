import { Link as WUILink } from "welcome-ui/Link";
import { Text } from "welcome-ui/Text";
import { Link, useParams } from "react-router-dom";
import { ApplyForm, ApplyFormValues } from "../components/ApplyForm";
import { useApply } from "../components/ApplyForm/useApply";

export const Apply = () => {
  const { handleApply, loading, error } = useApply();
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  const onSubmit = async (values: ApplyFormValues) => {
    if (!jobId) throw new Error("No job id");
    await handleApply(jobId, {
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      last_known_job: values.last_known_job,
      salary_expectation: Number(values.salary_expectation),
    });
  };

  return (
    <div className="max-w-640 mx-auto my-4xl p-xl">
      <Text variant="h1">Apply</Text>
      <ApplyForm
        onSubmit={onSubmit}
        serverError={error}
        initialLoading={loading}
      />
      <WUILink as={Link} className="mt-md" to="/">
        Back to home
      </WUILink>
    </div>
  );
};
