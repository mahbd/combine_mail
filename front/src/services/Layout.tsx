import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScrollTop from "../components/ScrollTop";
import "@radix-ui/themes/styles.css";
import { useEffect } from "react";
import { Box, Container } from "@radix-ui/themes";

const Layout = () => {
  useEffect(() => {
    if (!localStorage.getItem("access")) {
      window.location.replace("/auth/login");
    }
  }, []);

  return (
    <Container>
      <ScrollTop />
      <Navbar />
      <Box mt={"2"}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default Layout;
