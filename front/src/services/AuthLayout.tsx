import { Outlet } from "react-router-dom";
import ScrollTop from "../components/ScrollTop";
import "@radix-ui/themes/styles.css";
import { Suspense } from "react";

const AuthLayout = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScrollTop />
      <Outlet />
    </Suspense>
  );
};

export default AuthLayout;
