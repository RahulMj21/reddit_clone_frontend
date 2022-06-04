import { Box, Container } from "@mui/material";
import React, { ReactNode } from "react";
import Header from "../components/Header";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ minHeight: "100vh", width: "100%", paddingTop: "5rem" }}>
      <Header />
      <Container maxWidth="md" sx={{ padding: "2.5rem 1rem" }}>
        {children}
      </Container>
    </Box>
  );
};

export default HomeLayout;
