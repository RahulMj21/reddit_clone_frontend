import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Button, Stack } from "@mui/material";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [domLoaded, setDomLoaded] = useState(false);
  const { data } = useMeQuery({
    skip: !domLoaded,
  });

  const [logout] = useLogoutMutation();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "#21c795",
        zIndex: 1000,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          width: "100%",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          onClick={() => router.push("/")}
          component="h2"
          fontSize="1.3rem"
          sx={{ cursor: "pointer" }}
        >
          {"<"}LOGO{">"}
        </Typography>
        {data?.me?.id ? (
          <Stack direction="row" alignItems="center" gap={"1.5rem"}>
            <Typography>{data.me.name}</Typography>
            <Button
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
              }}
            >
              Logout
            </Button>
            <Button
              onClick={() => router.push("/createpost")}
              variant="contained"
            >
              Create
            </Button>
          </Stack>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Button onClick={() => router.push("/auth/register")}>
              Register
            </Button>
            <Button onClick={() => router.push("/auth/login")}>Login</Button>
            <Button
              onClick={() => router.push("/createpost")}
              variant="contained"
            >
              Create
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Header;
