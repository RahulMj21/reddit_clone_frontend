import { Typography } from "@mui/material";
import Loader from "../../src/components/Loader";
import HomeLayout from "../../src/layouts/HomeLayout";
import useFetchSinglePost from "../../src/utils/useFetchSinglePost";
import { useMeQuery } from "../../src/generated/graphql";
import CreateDeleteButtons from "../../src/components/CreateDeleteButtons";
import { Post } from "../../src/generated/graphql";
import withApollo from "../../src/utils/apolloClient";
import { isServer } from "../../src/utils/isServer";

const Post = () => {
  const { post, loading } = useFetchSinglePost();
  const { data: meData, loading: fetchingMe } = useMeQuery({
    skip: isServer(),
  });

  return loading || !post || fetchingMe ? (
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

export default withApollo({ ssr: true })(Post);
