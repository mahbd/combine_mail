import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Heading, Box, TextField, Button, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import z from "zod";
import InputError from "../components/InputError";
import http from "../services/http";
import { sURL } from "../c";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
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
            <Text>Email</Text>
            <TextField.Root>
              <TextField.Input {...register("email")} type="email" />
            </TextField.Root>
            <InputError error={errors.email} />
          </Box>
          <Button type="submit" disabled={isSubmitting}>
            Send Link
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default ForgotPassword;
