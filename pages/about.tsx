import React from "react";
import withApollo from "../src/utils/apolloClient";

interface AboutProps {}

const About: React.FC<AboutProps> = ({}) => {
  return <h1>About</h1>;
};

export default withApollo({ ssr: false })(About);
