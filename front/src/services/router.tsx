import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      let { default: Layout } = await import("./Layout");
      return { Component: Layout };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          let { default: Home } = await import("../pages/Home");
          return { Component: Home };
        },
      },
      {
        path: "editor",
        lazy: async () => {
          let { default: Editor } = await import("../pages/Editor");
          return { Component: Editor };
        },
      },
      {
        path: "sent-mail",
        lazy: async () => {
          let { default: Sent } = await import("../pages/Sent");
          return { Component: Sent };
        },
      },
      {
        path: "new-mail",
        lazy: async () => {
          let { default: New } = await import("../pages/New");
          return { Component: New };
        },
      },
    ],
  },
  {
    path: "auth",
    lazy: async () => {
      let { default: AuthLayout } = await import("./AuthLayout");
      return { Component: AuthLayout };
    },
    children: [
      {
        path: "login",
        lazy: async () => {
          let { default: Login } = await import("../auth/Login");
          return { Component: Login };
        },
      },
      {
        path: "register",
        lazy: async () => {
          let { default: Register } = await import("../auth/Register");
          return { Component: Register };
        },
      },
      {
        path: "forgot-password",
        lazy: async () => {
          let { default: ForgotPassword } = await import(
            "../auth/ForgotPassword"
          );
          return { Component: ForgotPassword };
        },
      },
      {
        path: "reset-password",
        lazy: async () => {
          let { default: ResetPassword } = await import(
            "../auth/ResetPassword"
          );
          return { Component: ResetPassword };
        },
      },
      {
        path: "change-password",
        lazy: async () => {
          let { default: ChangePassword } = await import(
            "../auth/ChangePassword"
          );
          return { Component: ChangePassword };
        },
      },
    ],
  },
]);

export default router;
