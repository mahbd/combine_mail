import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Heading, Box, TextField, Button, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import z from "zod";
import InputError from "../components/InputError";
import http from "../services/http";
import { sURL } from "../c";
import Link from "../components/Link";
import Loading from "../components/Loading";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  callback: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    data["callback"] = window.location.origin + "/auth/reset-password?access=";
    http
      .post(sURL.resetPassword, data)
      .then(() => {
        alert("Password reset link sent");
        // @ts-ignore
        window.location = "https://gmail.com";
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
            <Heading align={"center"}>Reset Password</Heading>
            <Box>
              <Text>Email</Text>
              <TextField.Root>
                <TextField.Input {...register("email")} type="email" />
              </TextField.Root>
              <InputError error={errors.email} />
            </Box>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loading /> : " Send Link"}
            </Button>
            <Flex justify={"between"}>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Register</Link>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
};

export default ForgotPassword;
