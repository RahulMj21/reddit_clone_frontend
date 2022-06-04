import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
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
      toast.error("post not found");
      router.back();
    }
  }, [data, fetching, error, router]);

  return { data, fetching, error, id } as const;
};

export default useFetchSinglePost;
