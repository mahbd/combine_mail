import { Outlet } from "react-router-dom";
import ScrollTop from "../components/ScrollTop";
import "@radix-ui/themes/styles.css";
import { Box } from "@radix-ui/themes";

const AuthLayout = () => {
  return (
    <Box>
      <ScrollTop />
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
