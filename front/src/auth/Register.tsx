import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import http from "../services/http";
import { sURL } from "../c.ts";
import { Flex, Box, Button, TextField, Text, Heading } from "@radix-ui/themes";
import InputError from "../components/InputError.tsx";
import PasswordField from "./PasswordField.tsx";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be at most 32 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(32, "Password must be at most 32 characters"),
  password2: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(32, "Password must be at most 32 characters"),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    if (data.password != data.password2) {
      setError("password2", {
        type: "custom",
        message: "Passwords do not match",
      });
      return;
    }
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
          Object.keys(FormData).forEach((key) => {
            setError(key as keyof FormData, {
              type: "custom",
              message: err.response.data[key as keyof FormData],
            });
          });
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
          <Heading align={"center"}>Register</Heading>
          <Box>
            <Text>Email</Text>
            <TextField.Root>
              <TextField.Input {...register("email")} type="email" />
            </TextField.Root>
            <InputError error={errors.email} />
          </Box>
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
          <Box>
            <Text>Confirm Password</Text>
            <PasswordField register={register("password2")} id="password2" />
            <InputError error={errors.password2} />
          </Box>
          <Button type="submit" disabled={isSubmitting}>
            Register
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default Register;
