import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import http from "../services/http";
import { sURL } from "../c.ts";
import { Flex, Box, Button, TextField, Text, Heading } from "@radix-ui/themes";
import InputError from "../components/InputError.tsx";
import PasswordField from "./PasswordField.tsx";
import Link from "../components/Link.tsx";
import { useSearchParams } from "react-router-dom";
import Loading from "../components/Loading.tsx";
import { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [searchParams] = useSearchParams();

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    http
      .post(sURL.login, data)
      .then((res) => {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        // @ts-ignore
        window.location = searchParams.get("next") || "/";
      })
      .catch((err) => {
        setIsSubmitting(false);
        if (err.response && err.response.status == 400) {
          Object.keys(err.response.data).forEach((key) => {
            setError(key as keyof FormData, {
              type: "custom",
              message: err.response.data[key as keyof FormData],
            });
          });
        } else if (err.response && err.response.status == 401) {
          setError("password", {
            type: "custom",
            message: err.response.data.detail,
          });
        } else {
          alert("Something went wrong");
        }
      });
  };

  return (
    <Flex direction={"column"} justify={"center"} style={{ minHeight: "70vh" }}>
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
              {isSubmitting ? <Loading /> : " Login"}
            </Button>
            <Flex justify={"between"}>
              <Link href="/auth/register">Register</Link>
              <Link href="/auth/forgot-password">Forgot Password</Link>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
};

export default Login;
