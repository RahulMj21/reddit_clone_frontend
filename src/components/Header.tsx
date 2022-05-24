import React, { useEffect, useState } from "react";
import { Link, Box, Typography, Container, Button, Stack } from "@mui/material";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const [{ fetching, data }] = useMeQuery({
    pause: !domLoaded,
  });

  const [_, logout] = useLogoutMutation();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <Box>
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          background: "#21c795",
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
          Logo
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
  );
};

export default Header;
