import type { NextPage } from "next";
import { Button, Stack, Typography } from "@mui/material";
import { Post, usePostsQuery } from "../src/generated/graphql";
import SinglePost from "../src/components/SinglePost";
import HomeLayout from "../src/layouts/HomeLayout";
import withApollo from "../src/utils/apolloClient";

const Home: NextPage = () => {
  const { data, loading, variables, fetchMore } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
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
                fetchMore({
                  variables: {
                    limit: variables?.limit,
                    cursor:
                      data.posts.posts![data.posts.posts!.length - 1].createdAt,
                  },
                  /* updateQuery: (prev, { fetchMoreResult }): PostsQuery => {
                    if (!fetchMoreResult) {
                      return prev;
                    }
                    return {
                      __typename: "Query",
                      posts: {
                        __typename: "PaginatedPosts",
                        hasMore: fetchMoreResult.posts.hasMore,
                        posts: [
                          ...(prev.posts.posts as Post[]),
                          ...(fetchMoreResult.posts.posts as Post[]),
                        ],
                      },
                    };
                  },*/
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
      ) : loading ? (
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

export default withApollo({ ssr: true })(Home);
