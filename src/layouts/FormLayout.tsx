import { Typography, Container, Box } from "@mui/material";
import React, { ReactNode } from "react";

interface FormLayoutProps {
  children: ReactNode;
  heading: string;
  withNavbar?: Boolean;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  heading,
  withNavbar = false,
}) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        width: "35rem",
        minHeight: `${withNavbar ? "calc(100vh - 4rem)" : "100vh"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box width="100%" py={2} px={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h1" textAlign={"center"} fontSize={"2.5rem"}>
          {heading}
        </Typography>
        {children}
      </Box>
    </Container>
  );
};

export default FormLayout;
