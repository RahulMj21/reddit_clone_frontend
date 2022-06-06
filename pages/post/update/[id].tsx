import { Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Header from "../../../src/components/Header";
import Loader from "../../../src/components/Loader";
import {
  PostInput,
  useUpdatePostMutation,
} from "../../../src/generated/graphql";
import FormLayout from "../../../src/layouts/FormLayout";
import useFetchSinglePost from "../../../src/utils/useFetchSinglePost";
import { useIsAuth } from "../../../src/utils/useIsAuth";
import withApollo from "../../../src/utils/apolloClient";

const UpdatePost = ({}) => {
  const router = useRouter();
  const {
    post: existingPost,
    loading: existingPostFetching,
    id,
  } = useFetchSinglePost();
  const { loading: fetchingMe, data: dataMe } = useIsAuth();
  const [submit, { loading, error, data }] = useUpdatePostMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<PostInput>();

  const handleUpdatePost = async (input: PostInput) => {
    if (error) toast.error(error.message);

    const response = await submit({ variables: { input: { id, ...input } } });

    // success
    if (response.data?.updatePost?.post) {
      router.back();
    }

    // errors
    if (response.data?.updatePost?.errors) {
      const errors = response.data.updatePost.errors;

      errors.forEach((error: any) => {
        setError(error.field as "title" | "description", {
          type: error.__typename,
          message: error.message,
        });
        toast.error(error.message);
      });
    }
  };

  useEffect(() => {
    setValue("title", existingPost?.title as string);
    setValue("description", existingPost?.description as string);
  }, [existingPost]);

  return (loading && !data?.updatePost?.post) ||
    (existingPostFetching && !existingPost) ||
    (fetchingMe && !dataMe?.me) ? (
    <Loader />
  ) : (
    <>
      <Header />
      <FormLayout heading="Update Post" withNavbar={true}>
        <form onSubmit={handleSubmit(handleUpdatePost)}>
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
              Update Post
            </Button>
          </Stack>
        </form>
      </FormLayout>
    </>
  );
};

export default withApollo({ ssr: false })(UpdatePost);
