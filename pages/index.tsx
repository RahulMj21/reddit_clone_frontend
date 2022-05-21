import type { NextPage } from "next";
import { useLogoutMutation, useMeQuery } from "../src/generated/graphql";
import Loader from "../src/components/Loader";
import { Link, Box, Typography, Container, Button, Stack } from "@mui/material";
import NextLink from "next/link";

const Home: NextPage = () => {
  const [{ fetching, data }] = useMeQuery();
  const [_, logout] = useLogoutMutation();
  return fetching ? (
    <Loader />
  ) : (
    <Box sx={{ minHeight: "100vh", width: "100%" }}>
      <Box>
        <Container
          maxWidth="xl"
          sx={{
            width: "100%",
            background: "#21c795",
            height: "4.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography component="h2" fontSize="1.3rem">
            Logo
          </Typography>
          {data?.me?.id ? (
            <Stack direction="row" alignItems="center" gap={"1.5rem"}>
              <Typography>{data.me.name}</Typography>
              <Button onClick={async () => await logout()}>Logout</Button>
            </Stack>
          ) : (
            <Box>
              <NextLink href="/auth/register">
                <Link mr={2}>Register</Link>
              </NextLink>
              <NextLink href="/auth/login">
                <Link>Login</Link>
              </NextLink>
            </Box>
          )}
        </Container>
      </Box>
      <Container maxWidth="xl">Home Page</Container>
    </Box>
  );
};

export default Home;
