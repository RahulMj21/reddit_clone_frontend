import type { NextPage } from "next";
import { Box, Container } from "@mui/material";
import createUrqlClient from "../src/utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import Header from "../src/components/Header";

const Home: NextPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", width: "100%" }}>
      <Header />
      <Container maxWidth="xl">Home Page</Container>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
