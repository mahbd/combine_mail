import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Heading, Box, Button, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import z from "zod";
import InputError from "../components/InputError";
import http from "../services/http";
import { sURL } from "../c";
import PasswordField from "./PasswordField";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const schema = z.object({
  new_password: z
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
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (!searchParams.get("access")) {
      window.location.replace("/auth/login");
    }
    if (searchParams.get("access")) {
      localStorage.setItem("access", searchParams.get("access") as string);
    }
  }, [searchParams.get("access")]);

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
    http
      .post(sURL.changePassword, data)
      .then(() => {
        alert("Password reset successful");
        // @ts-ignore
        window.location = "/auth/login";
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
        }
      });
  };

  return (
    <Flex direction={"column"} justify={"center"} style={{ minHeight: "70vh" }}>
      <Flex justify={"center"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction={"column"} gap={"2"} style={{ width: "360px" }}>
            <Heading align={"center"}>Set Password</Heading>
            <Box>
              <Text>Password</Text>
              <PasswordField
                register={register("new_password")}
                id="password"
              />
              <InputError error={errors.new_password} />
            </Box>
            <Box>
              <Text>Confirm Password</Text>
              <PasswordField register={register("password2")} id="password2" />
              <InputError error={errors.password2} />
            </Box>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loading /> : " Set Password"}
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
};

export default ResetPassword;
