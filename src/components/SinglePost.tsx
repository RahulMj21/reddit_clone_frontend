import { Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Post,
  useDeletePostMutation,
  useMeQuery,
  useUpdatePostMutation,
  useVoteMutation,
} from "../generated/graphql";

interface SinglePostProps {
  post: Post;
}

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
  const router = useRouter();
  const [voting, setVoting] = useState(false);
  const [_, submit] = useVoteMutation();
  const [{ data: deletePostData, fetching: deletePostFetching }, deletePost] =
    useDeletePostMutation();
  const [{ data }] = useMeQuery();

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              width: "7.5rem",
              textAlign: "right",
            }}
          >
            <Button
              color="inherit"
              onClick={() => router.push(`/post/update/${post.id}`)}
            >
              <Edit />
            </Button>
            <Button
              disabled={deletePostFetching}
              color="inherit"
              onClick={() => deletePost({ id: post.id })}
            >
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SinglePost;
