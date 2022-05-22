import { withUrqlClient } from "next-urql";
import React from "react";
import createUrqlClient from "../src/utils/createUrqlClient";

interface AboutProps {}

const About: React.FC<AboutProps> = ({}) => {
  return <h1>About</h1>;
};

export default withUrqlClient(createUrqlClient)(About);
