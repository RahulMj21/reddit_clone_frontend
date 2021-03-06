import { Edit, Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { Post, useDeletePostMutation } from "../generated/graphql";

interface UpdateDeleteButtonsProps {
  post: Post;
}

const UpdateDeleteButtons: React.FC<UpdateDeleteButtonsProps> = ({ post }) => {
  const router = useRouter();
  const [deletePost, { loading }] = useDeletePostMutation();

  return (
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
        disabled={loading}
        color="inherit"
        onClick={() =>
          deletePost({
            variables: { id: post.id },
            update: (cache) => {
              cache.evict({ id: `Post:${post.id}` });
            },
          })
        }
      >
        <Delete />
      </Button>
    </Box>
  );
};

export default UpdateDeleteButtons;
