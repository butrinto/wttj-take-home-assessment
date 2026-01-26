import { Link as WUILink } from "welcome-ui/Link";
import { Text } from "welcome-ui/Text";
import { Link } from "react-router-dom";
import { useSignIn } from "../components/SigninForm/useSignIn";
import { SignInFormValues, SignInForm } from "../components/SigninForm";

export const SignIn = () => {
  const { signIn, loading, error } = useSignIn();

  const onSubmit = async (values: SignInFormValues) => {
    await signIn(values);
  };

  return (
    <div className="max-w-400 mx-auto my-4xl p-xl">
      <WUILink as={Link} to="/" variant="secondary">
        Back to jobs
      </WUILink>
      <Text variant="h1">Sign in</Text>
      <SignInForm
        onSubmit={onSubmit}
        serverError={error}
        initialLoading={loading}
      />
      <WUILink as={Link} className="mt-md" to="/signup">
        Create an account
      </WUILink>
    </div>
  );
};
