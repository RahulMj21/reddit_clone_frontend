import type { NextPage } from "next";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import createUrqlClient from "../src/utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import Header from "../src/components/Header";
import { usePostsQuery } from "../src/generated/graphql";
import { useState } from "react";

const Home: NextPage = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", paddingTop: "5rem" }}>
      <Header />
      <Container maxWidth="lg" sx={{ padding: "2rem 0" }}>
        <Typography variant="h3" mb={2} textAlign="center">
          Posts
        </Typography>
        {data?.posts.posts ? (
          <Stack>
            {data.posts.posts.map((post) => (
              <Box
                key={post.createdAt}
                boxShadow={2}
                p={2}
                mb={4}
                border={1}
                borderColor="#c3c2c2"
              >
                <Typography mb={1.5} fontSize={"1.7rem"} variant="h4">
                  {post.title}
                </Typography>
                <Typography>{post.descriptionSnippet}</Typography>
              </Box>
            ))}
            {data.posts.posts && data.posts.hasMore && (
              <Button
                onClick={() =>
                  setVariables({
                    limit: variables.limit,
                    cursor:
                      data.posts.posts![data.posts.posts!.length - 1].createdAt,
                  })
                }
                variant="contained"
                sx={{
                  background: "#eee",
                  color: "#333",
                  height: "3rem",
                  width: "12rem",
                  fontSize: "1.1rem",
                  textTransform: "capitalize",
                  margin: "auto",
                  ":hover": {
                    background: "#eee",
                  },
                }}
              >
                Load More
              </Button>
            )}
          </Stack>
        ) : fetching ? (
          <Typography
            sx={{ color: "gray" }}
            variant="h1"
            fontSize={"2rem"}
            mb={2}
            textAlign="center"
          >
            Loading..
          </Typography>
        ) : (
          <Typography
            sx={{ color: "#9f9f9f" }}
            variant="h1"
            fontSize={"4rem"}
            mb={2}
            textAlign="center"
          >
            No Post to Show
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
