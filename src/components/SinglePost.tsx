import { Box, Button, IconButton, Typography } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { Post, useVoteMutation } from "../generated/graphql";
import toast from "react-hot-toast";

interface SinglePostProps {
  post: Post;
}

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
  const [voting, setVoting] = useState(false);
  const [_, submit] = useVoteMutation();

  const doVote = async (vote: string) => {
    setVoting(true);
    const value = vote === "up" ? 1 : -1;
    const response = await submit({ value, postId: post.id });
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
          // color="success"
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
      <Box>
        <Typography fontSize="0.9rem" color={"GrayText"}>
          Posted by {post.creator.name}
        </Typography>
        <Typography mb={1} fontSize={"1.7rem"} variant="h4">
          {post.title}
        </Typography>
        <Typography>{post.descriptionSnippet}</Typography>
      </Box>
    </Box>
  );
};

export default SinglePost;
