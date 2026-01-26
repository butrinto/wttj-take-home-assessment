import { Link as WUILink } from "welcome-ui/Link";
import { Text } from "welcome-ui/Text";
import { Link } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { SignUpForm, SignUpFormValues } from "../components/SignupForm";
import { useSignup } from "../components/SignupForm/useSignup";

export const SignUp = () => {
  const { signup, loading, error } = useSignup();

  const onSubmit = async (values: SignUpFormValues) => {
    await signup({ email: values.email, password: values.password });
  };

  return (
    <>
      <div className="max-w-480 mx-auto my-4xl p-xl">
        <WUILink as={Link} to="/" variant="secondary">
          Back to jobs
        </WUILink>
        <Text variant="h1">Create account</Text>
        <SignUpForm
          onSubmit={onSubmit}
          serverError={error}
          initialLoading={loading}
        />
        <WUILink as={Link} className="mt-md" to="/signin">
          Already have an account? Sign in
        </WUILink>
      </div>
    </>
  );
};
