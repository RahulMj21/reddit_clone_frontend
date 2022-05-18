import React from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import FormLayout from "../../src/layouts/FormLayout";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleLogin = (values: any) => {
    // console.log(values);
  };

  return (
    <FormLayout heading="Login">
      <form onSubmit={handleSubmit(handleLogin)}>
        <Stack typeof="form" direction={"column"} gap={4} my={4}>
          <TextField
            id="email"
            label="Email"
            type="email"
            {...register("email")}
            helperText={errors?.email?.message ? errors.email.message : ""}
          />
          <TextField
            id="password"
            label="Password"
            {...register("password")}
            helperText={
              errors?.password?.message ? errors.password.message : ""
            }
          />
          <Button variant="contained" type="submit" size="large">
            Login
          </Button>
        </Stack>
      </form>
    </FormLayout>
  );
};

export default Login;
