import { Button, Stack, TextField } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Header from "../src/components/Header";
import Loader from "../src/components/Loader";
import {
  PostInput,
  useCreatePostMutation,
  useMeQuery,
} from "../src/generated/graphql";
import FormLayout from "../src/layouts/FormLayout";
import createUrqlClient from "../src/utils/createUrqlClient";
import { useIsAuth } from "../src/utils/useIsAuth";

const createPost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const { fetching: fetchingMe, data: dataMe } = useIsAuth();
  const [{ fetching, error, data }, submit] = useCreatePostMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<PostInput>();

  const handleCreatePost = async (input: PostInput) => {
    if (error) toast.error(error.message);

    const response = await submit({ input });

    // success
    if (response.data?.createPost.post) {
      router.push("/");
    }

    // errors
    if (response.data?.createPost.errors) {
      const errors = response.data.createPost.errors;

      errors.forEach((error) => {
        setError(error.field as "title" | "description", {
          type: error.__typename,
          message: error.message,
        });
        toast.error(error.message);
      });
    }
  };

  return (fetching && !data?.createPost.post) || (fetchingMe && !dataMe?.me) ? (
    <Loader />
  ) : (
    <>
      <Header />
      <FormLayout heading="Create Post" withNavbar={true}>
        <form onSubmit={handleSubmit(handleCreatePost)}>
          <Stack typeof="form" direction={"column"} gap={4} my={4}>
            <TextField
              error={errors?.title?.message ? true : false}
              id="title"
              label="Title"
              required
              {...register("title", {
                minLength: {
                  value: 3,
                  message: "title must contain atleast 3 characters",
                },
              })}
              helperText={errors?.title?.message ? errors.title.message : ""}
            />
            <TextField
              error={errors?.description?.message ? true : false}
              id="description"
              label="Description"
              multiline
              rows={4}
              required
              {...register("description", {
                minLength: {
                  value: 10,
                  message: "description must be atleast 10 characters long",
                },
              })}
              helperText={
                errors?.description?.message ? errors.description.message : ""
              }
            />
            <Button
              sx={{
                background: "#14C38E",
                ":hover": { background: "#13ae7f" },
              }}
              variant="contained"
              type="submit"
              size="large"
            >
              Create Post
            </Button>
          </Stack>
        </form>
      </FormLayout>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(createPost);
