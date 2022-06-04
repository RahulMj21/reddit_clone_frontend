import { Typography } from "@mui/material";
import { withUrqlClient } from "next-urql";
import Loader from "../../src/components/Loader";
import HomeLayout from "../../src/layouts/HomeLayout";
import createUrqlClient from "../../src/utils/createUrqlClient";
import useFetchSinglePost from "../../src/utils/useFetchSinglePost";
import { useMeQuery } from "../../src/generated/graphql";
import CreateDeleteButtons from "../../src/components/CreateDeleteButtons";
import { Post } from "../../src/generated/graphql";

const Post = () => {
  const { post, fetching } = useFetchSinglePost();
  const [{ data: meData, fetching: fetchingMe }] = useMeQuery();

  return fetching || !post || fetchingMe ? (
    <Loader />
  ) : (
    <HomeLayout>
      <Typography variant="h1" fontSize="2rem" mb={4}>
        {post.title}
      </Typography>
      <Typography mb={4} color="GrayText">
        {post.description}
      </Typography>
      {post?.creatorId === meData?.me?.id ? (
        <CreateDeleteButtons post={post as Post} />
      ) : null}
    </HomeLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
