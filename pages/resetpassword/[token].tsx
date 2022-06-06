import { Button, Stack, TextField } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../../src/components/Loader";
import {
  MeDocument,
  MeQuery,
  useResetPasswordMutation,
} from "../../src/generated/graphql";
import FormLayout from "../../src/layouts/FormLayout";
import useIsGuest from "../../src/utils/useIsGuest";
import withApollo from "../../src/utils/apolloClient";

type InputType = {
  newPassword: string;
};

const ResetPassword: NextPage<{}> = ({}) => {
  const router = useRouter();
  const token = router.query?.token;
  const { loading: fetchingMe } = useIsGuest();
  const [submit, { loading, error }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputType>();

  const handleResetPassword = async ({ newPassword }: InputType) => {
    if (error) toast.error(error.message);

    const response = await submit({
      variables: { token: token as string, newPassword },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: data?.resetPassword.user,
          },
        });
        cache.evict({ fieldName: "posts" });
      },
    });

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

  return loading || fetchingMe ? (
    <Loader />
  ) : (
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

export default withApollo({ ssr: false })(ResetPassword);
