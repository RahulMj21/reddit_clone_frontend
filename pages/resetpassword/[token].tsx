import { Button, Stack, TextField } from "@mui/material";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../../src/generated/graphql";
import FormLayout from "../../src/layouts/FormLayout";
import createUrqlClient from "../../src/utils/createUrqlClient";

interface ResetPasswordProps {
  token: string;
}

type InputType = {
  newPassword: string;
};

const ResetPassword: NextPage<ResetPasswordProps> = ({ token }) => {
  const router = useRouter();
  const [{ fetching, error }, submit] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputType>();

  const handleResetPassword = async ({ newPassword }: InputType) => {
    if (error) toast.error(error.message);
    console.log("token--> ", token);

    const response = await submit({ token, newPassword });

    // success
    if (response.data?.resetPassword.user) {
      router.push("/");
    }

    // errors
    if (response.data?.resetPassword.errors) {
      const errors = response.data.resetPassword.errors;

      errors.forEach((error) => {
        setError(error.field as "newPassword", {
          type: error.__typename,
          message: error.message,
        });
        toast.error(error.message);
      });
    }
  };

  return (
    <FormLayout heading="ResetPassword">
      <form onSubmit={handleSubmit(handleResetPassword)}>
        <Stack typeof="form" direction={"column"} gap={4} my={4}>
          <TextField
            error={errors?.newPassword?.message ? true : false}
            id="password"
            type="password"
            label="Password"
            required
            {...register("newPassword", {
              minLength: {
                value: 6,
                message: "new password must contain atleast 6 characters",
              },
            })}
            helperText={
              errors?.newPassword?.message ? errors.newPassword.message : ""
            }
          />
          <Button
            sx={{ background: "#14C38E", ":hover": { background: "#13ae7f" } }}
            variant="contained"
            type="submit"
            size="large"
          >
            Reset
          </Button>
        </Stack>
      </form>
    </FormLayout>
  );
};

ResetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ResetPassword);
