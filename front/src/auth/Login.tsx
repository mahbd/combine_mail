import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import http from "../services/http";
import { sURL } from "../c.ts";
import { Flex, Box, Button, TextField, Text, Heading } from "@radix-ui/themes";
import InputError from "../components/InputError.tsx";
import PasswordField from "./PasswordField.tsx";

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be at most 32 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(32, "Password must be at most 32 characters"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    http
      .post(sURL.login, data)
      .then((res) => {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        // @ts-ignore
        window.location = "/restricted/dashboard";
      })
      .catch((err) => {
        if (err.response && err.response.status == 400) {
          if (err.response.data.username) {
            setError("username", {
              type: "custom",
              message: err.response.data.username,
            });
          }
          if (err.response.data.password) {
            setError("password", {
              type: "custom",
              message: err.response.data.password,
            });
          }
        }
        if (
          err.response &&
          err.response.status >= 400 &&
          err.response.status < 500
        ) {
          setError("password", {
            type: "custom",
            message: "Invalid username or password",
          });
        }
      });
  };

  return (
    <Flex justify={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction={"column"} gap={"2"} style={{ width: "360px" }}>
          <Heading align={"center"}>Login</Heading>
          <Box>
            <Text>Username</Text>
            <TextField.Root>
              <TextField.Input {...register("username")} />
            </TextField.Root>
            <InputError error={errors.username} />
          </Box>
          <Box>
            <Text>Password</Text>
            <PasswordField register={register("password")} id="password" />
            <InputError error={errors.password} />
          </Box>
          <Button type="submit" disabled={isSubmitting}>
            Login
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default Login;
