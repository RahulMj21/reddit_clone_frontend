import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

const useIsGuest = () => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery();

  useEffect(() => {
    if (data?.me) {
      router.push("/");
    }
  }, [data, fetching]);

  return { data, fetching } as const;
};
export default useIsGuest;
