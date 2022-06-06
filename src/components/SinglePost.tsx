import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { gql } from "urql";
import { Post, useMeQuery, useVoteMutation } from "../generated/graphql";
import CreateDeleteButtons from "./CreateDeleteButtons";

interface SinglePostProps {
  post: Post;
}

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
  const [voting, setVoting] = useState(false);
  const [submit] = useVoteMutation();
  const { data } = useMeQuery();

  const doVote = async (vote: string) => {
    setVoting(true);
    const value = vote === "up" ? 1 : -1;
    const response = await submit({
      variables: { value, postId: post.id },
      update: (cache) => {
        const data = cache.readFragment({
          id: `Post:${post.id}`,
          fragment: gql`
            fragment _ on Post {
              id
              points
              voteStatus
            }
          `,
        });
        if (data) {
          const newPoints = data.points + value;
          cache.writeFragment({
            id: `Post:${post.id}`,
            fragment: gql`
              fragment __ on Post {
                points
                voteStatus
              }
            `,
            data: {
              points: newPoints,
              voteStatus: value,
            },
          });
        }
      },
    });
    if (!response.data?.vote) return toast.error("login to continue");
    setVoting(false);
  };

  return (
    <Box
      display={"flex"}
      alignItems="flex-start"
      gap={2}
      key={post.createdAt}
      boxShadow={3}
      p={2}
      mb={4}
      border={1}
      borderRadius={2}
      borderColor="#c3c2c2"
      sx={{ ":hover": { boxShadow: 5 }, transition: "0.5s ease" }}
    >
      <Box
        display="flex"
        gap={"0.3rem"}
        flexDirection="column"
        alignItems="center"
      >
        <Button
          color={post.voteStatus === 1 ? "secondary" : "inherit"}
          variant="contained"
          disabled={voting}
          onClick={() => doVote("up")}
        >
          <ExpandLessIcon />
        </Button>
        <Typography fontSize={"1.2rem"}>{post.points}</Typography>
        <Button
          color={post.voteStatus === -1 ? "error" : "inherit"}
          variant="contained"
          disabled={voting}
          onClick={() => doVote("down")}
        >
          <ExpandMoreIcon />
        </Button>
      </Box>
      <Box flex={1}>
        <Typography fontSize="0.9rem" color={"GrayText"}>
          Posted by {post.creator.name}
        </Typography>
        <NextLink href={`/post/${post.id}`}>
          <a
            style={{
              color: "#333",
              fontSize: "1.6rem",
              textDecoration: "none",
            }}
          >
            {post.title}
          </a>
        </NextLink>
        <Typography mb={2}>{post.descriptionSnippet}</Typography>
        {post.creator.id === data?.me?.id && (
          <CreateDeleteButtons post={post} />
        )}
      </Box>
    </Box>
  );
};

export default SinglePost;
