import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScrollTop from "../components/ScrollTop";
import "@radix-ui/themes/styles.css";
import { useEffect } from "react";
import { Box, Container } from "@radix-ui/themes";
import Footer from "../components/Footer";

const Layout = () => {
  useEffect(() => {
    if (!localStorage.getItem("access")) {
      window.location.replace("/auth/login?next=" + window.location.pathname);
    }
  }, []);

  return (
    <Container>
      <ScrollTop />
      <Navbar />
      <Box mt={"2"}>
        <Outlet />
      </Box>
      <Footer />
    </Container>
  );
};

export default Layout;
