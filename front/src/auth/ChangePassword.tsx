import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Heading, Box, Button, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import z from "zod";
import InputError from "../components/InputError";
import http from "../services/http";
import { sURL } from "../c";
import PasswordField from "./PasswordField";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

const schema = z.object({
  new_password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(32, "Password must be at most 32 characters"),
});

type FormData = z.infer<typeof schema>;

const ChangePassword = () => {
  useEffect(() => {
    if (!localStorage.getItem("access")) {
      window.location.replace("/auth/login?next=" + window.location.pathname);
    }
  }, []);

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
        alert("Password changed successfully");
        // @ts-ignore
        window.location = "/";
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
    <Flex direction={"column"} justify={"center"} style={{ minHeight: "70vh" }}>
      <Flex justify={"center"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction={"column"} gap={"2"} style={{ width: "360px" }}>
            <Heading align={"center"}>Change Password</Heading>
            <Box>
              <Text>New Password</Text>
              <PasswordField
                register={register("new_password")}
                id="new_password"
              />
              <InputError error={errors.new_password} />
            </Box>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loading /> : " Change Password"}
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
};

export default ChangePassword;
