import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.push(`/auth/login?next=${router.pathname}`);
    }
  }, [loading, data, router]);
  return { loading, data } as const;
};
