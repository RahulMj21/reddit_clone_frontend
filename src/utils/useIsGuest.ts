import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

const useIsGuest = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (data?.me) {
      router.push("/");
    }
  }, [data, loading]);

  return { data, loading } as const;
};
export default useIsGuest;
