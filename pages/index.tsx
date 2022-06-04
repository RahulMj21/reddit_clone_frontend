import type { NextPage } from "next";
import { Button, Stack, Typography } from "@mui/material";
import createUrqlClient from "../src/utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Post, usePostsQuery } from "../src/generated/graphql";
import { useState } from "react";
import SinglePost from "../src/components/SinglePost";
import HomeLayout from "../src/layouts/HomeLayout";

const Home: NextPage = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  return (
    <HomeLayout>
      <Typography variant="h3" mb={2} textAlign="center">
        Posts
      </Typography>
      {data?.posts.posts ? (
        <Stack>
          {data.posts.posts.map((post) => (
            <SinglePost post={post as Post} key={post.id} />
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
          Loading...
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
    </HomeLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
