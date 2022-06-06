import React from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import FormLayout from "../../src/layouts/FormLayout";
import toast from "react-hot-toast";
import {
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from "../../src/generated/graphql";
import { useRouter } from "next/router";
import useIsGuest from "../../src/utils/useIsGuest";
import Loader from "../../src/components/Loader";
import withApollo from "../../src/utils/apolloClient";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const { loading: fetchingMe } = useIsGuest();
  const router = useRouter();
  const nextpath = router.query?.next ? router.query.next : "/";
  const [submit, { error, loading }] = useLoginMutation();

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<LoginInput>();

  const handleLogin = async (values: LoginInput) => {
    if (error) toast.error(error.message);

    const response = await submit({
      variables: values,
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: data?.login.user,
          },
        });
        cache.evict({ fieldName: "posts" });
      },
    });

    // success
    if (response.data?.login.user) {
      router.replace(`${nextpath}`);
    }

    // errors
    if (response.data?.login.errors) {
      const errors = response.data.login.errors;

      errors.forEach((error) => {
        setError(error.field as "email" | "password", {
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
    <FormLayout heading="Login">
      <form onSubmit={handleSubmit(handleLogin)}>
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
          <TextField
            error={errors?.password?.message ? true : false}
            id="password"
            type="password"
            label="Password"
            required
            {...register("password", {
              minLength: {
                value: 6,
                message: "password must contain atleast 6 characters",
              },
            })}
            helperText={
              errors?.password?.message ? errors.password.message : ""
            }
          />
          <Button
            sx={{ background: "#14C38E", ":hover": { background: "#13ae7f" } }}
            variant="contained"
            type="submit"
            size="large"
          >
            Login
          </Button>
        </Stack>
      </form>
    </FormLayout>
  );
};

export default withApollo({ ssr: false })(Login);
