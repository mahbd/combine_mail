import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Heading, Box, Button, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import z from "zod";
import InputError from "../components/InputError";
import http from "../services/http";
import { sURL } from "../c";
import PasswordField from "./PasswordField";

const schema = z.object({
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

const ResetPassword = () => {
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
          Object.keys(FormData).forEach((key) => {
            setError(key as keyof FormData, {
              type: "custom",
              message: err.response.data[key as keyof FormData],
            });
          });
        }
      });
  };

  return (
    <Flex justify={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction={"column"} gap={"2"} style={{ width: "360px" }}>
          <Heading align={"center"}>Reset Password</Heading>
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
            Send Link
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default ResetPassword;
