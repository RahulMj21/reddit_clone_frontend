import React, { useEffect, useState } from "react";
import { Link, Box, Typography, Container, Button, Stack } from "@mui/material";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const [{ data }] = useMeQuery({
    pause: !domLoaded,
  });

  const [_, logout] = useLogoutMutation();

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
      }}
    >
      <Container
        maxWidth="lg"
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
            <Button onClick={async () => await logout()}>Logout</Button>
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
