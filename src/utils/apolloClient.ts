import { withApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";
import { isServer } from "./isServer";

const apolloClient = (ctx: NextPageContext) =>
  new ApolloClient({
    uri: "http://localhost:8000/graphql",
    credentials: "include" as const,
    headers: {
      cookie: (isServer() ? ctx?.req?.headers.cookie : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: ["limit"],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  __typename: "PaginatedPosts",
                  hasMore: incoming.hasMore,
                  posts: [
                    ...(existing?.posts || []),
                    ...(incoming.posts || []),
                  ],
                };
              },
            },
          },
        },
      },
    }),
  });

export default withApollo(apolloClient);
