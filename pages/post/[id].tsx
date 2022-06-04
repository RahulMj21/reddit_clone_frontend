import { Typography } from "@mui/material";
import { withUrqlClient } from "next-urql";
import Loader from "../../src/components/Loader";
import HomeLayout from "../../src/layouts/HomeLayout";
import createUrqlClient from "../../src/utils/createUrqlClient";
import useFetchSinglePost from "../../src/utils/useFetchSinglePost";

const Post = () => {
  const { data, fetching } = useFetchSinglePost();

  return fetching || !data?.post.post ? (
    <Loader />
  ) : (
    <HomeLayout>
      <Typography variant="h1" fontSize="2rem" mb={4}>
        {data.post.post.title}
      </Typography>
      <Typography color="GrayText">{data.post.post.description}</Typography>
    </HomeLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
