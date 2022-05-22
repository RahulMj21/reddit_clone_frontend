import type { NextPage } from "next";
import { useLogoutMutation, useMeQuery } from "../src/generated/graphql";
import Loader from "../src/components/Loader";
import { Box, Container } from "@mui/material";
import createUrqlClient from "../src/utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import Header from "../src/components/Header";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [{ fetching, data }] = useMeQuery({
    pause: !domLoaded,
  });

  const [_, logout] = useLogoutMutation();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (!domLoaded) return <></>;

  return fetching ? (
    <Loader />
  ) : (
    <Box sx={{ minHeight: "100vh", width: "100%" }}>
      <Header logout={logout} data={data} />
      <Container maxWidth="xl">Home Page</Container>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
