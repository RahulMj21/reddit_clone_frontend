import React from "react";
import { Link, Box, Typography, Container, Button, Stack } from "@mui/material";
import { MeQuery } from "../generated/graphql";
import NextLink from "next/link";

interface HeaderProps {
  logout: Function;
  data: MeQuery | undefined;
}

const Header: React.FC<HeaderProps> = ({ logout, data }) => {
  return (
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
  );
};

export default Header;
