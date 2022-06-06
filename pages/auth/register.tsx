import React from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import FormLayout from "../../src/layouts/FormLayout";
import {
  MeDocument,
  MeQuery,
  RegisterInput,
  useRegisterMutation,
} from "../../src/generated/graphql";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import useIsGuest from "../../src/utils/useIsGuest";
import Loader from "../../src/components/Loader";
import withApollo from "../../src/utils/apolloClient";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const { loading: fetchingMe } = useIsGuest();
  const [submit, { loading, error }] = useRegisterMutation();

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<RegisterInput>();

  const handleRegister = async (values: RegisterInput) => {
    if (error) toast.error(error.message);

    const response = await submit({
      variables: values,
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: data?.register.user,
          },
        });
      },
    });

    if (response.data?.register.user) {
      router.push("/");
    }

    if (response.data?.register.errors) {
      const errors = response.data.register.errors;

      errors.forEach((error) => {
        setError(error.field as "name" | "email" | "password", {
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
    <FormLayout heading="Register">
      <form onSubmit={handleSubmit(handleRegister)}>
        <Stack typeof="form" direction={"column"} gap={4} my={4}>
          <TextField
            error={errors?.name?.message ? true : false}
            id="name"
            label="Name"
            required
            {...register("name", {
              minLength: {
                value: 3,
                message: "name must contain atleast 3 characters",
              },
            })}
            helperText={errors?.name?.message ? errors.name.message : ""}
          />
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
            Register
          </Button>
        </Stack>
      </form>
    </FormLayout>
  );
};

export default withApollo({ ssr: false })(Register);
