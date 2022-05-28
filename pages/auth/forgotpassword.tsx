import { Button, Stack, TextField } from "@mui/material";
import { withUrqlClient } from "next-urql";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../../src/components/Loader";
import {
  ForgotPasswordMutationVariables,
  useForgotPasswordMutation,
} from "../../src/generated/graphql";
import FormLayout from "../../src/layouts/FormLayout";
import createUrqlClient from "../../src/utils/createUrqlClient";
import useIsGuest from "../../src/utils/useIsGuest";

interface ForgotpasswordProps {}

const Forgotpassword: React.FC<ForgotpasswordProps> = ({}) => {
  const { fetching: fetchingMe } = useIsGuest();
  const [{ fetching, error }, submit] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordMutationVariables>();

  const handleForgotPassword = async (
    values: ForgotPasswordMutationVariables
  ) => {
    if (error) toast.error(error.message);

    const response = await submit(values);

    // success
    if (response.data?.forgotPassword.success) {
      toast.success("check your email");
    }

    // errors
    if (response.data?.forgotPassword.errors) {
      const errors = response.data.forgotPassword.errors;

      errors.forEach((error) => {
        setError(error.field as "email", {
          type: error.__typename,
          message: error.message,
        });
        toast.error(error.message);
      });
    }
  };

  return fetching || fetchingMe ? (
    <Loader />
  ) : (
    <FormLayout heading="Forgot Password">
      <form onSubmit={handleSubmit(handleForgotPassword)}>
        <Stack typeof="form" direction={"column"} gap={4} my={4}>
          <TextField
            error={errors?.email?.message ? true : false}
            id="email"
            label="Email"
            type="email"
            required
            {...register("email")}
            helperText={errors?.email?.message ? errors.email.message : ""}
          />

          <Button
            sx={{ background: "#14C38E", ":hover": { background: "#13ae7f" } }}
            variant="contained"
            type="submit"
            size="large"
          >
            Submit
          </Button>
        </Stack>
      </form>
    </FormLayout>
  );
};

export default withUrqlClient(createUrqlClient)(Forgotpassword);
