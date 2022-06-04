import { useRouter } from "next/router";
import { useEffect } from "react";
import { usePostQuery } from "../generated/graphql";

const useFetchSinglePost = () => {
  const router = useRouter();
  const id =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching, error }] = usePostQuery({
    variables: {
      id,
    },
  });
  useEffect(() => {
    if (error || (!data?.post.post && !fetching)) {
      router.back();
    }
  }, [data, fetching, error, router]);

  return { post: data?.post.post, fetching, error, id } as const;
};

export default useFetchSinglePost;
