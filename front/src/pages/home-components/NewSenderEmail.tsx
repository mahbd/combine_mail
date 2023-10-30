import { zodResolver } from "@hookform/resolvers/zod";
import {
  Flex,
  Heading,
  Box,
  TextField,
  Button,
  Text,
  Card,
} from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import z from "zod";
import { sURL } from "../../c";
import InputError from "../../components/InputError";
import http from "../../services/http";
import PasswordField from "../../auth/PasswordField";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(16, "App Password must be at least 16 characters")
    .max(16, "App Password must be at most 16 characters"),
});

type FormData = z.infer<typeof schema>;

const NewSenderEmail = () => {
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
      .post(sURL.senderMail, data)
      .then(() => {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading align={"center"}>Add Email</Heading>
      <Card mt={"3"}>
        <Flex direction={"column"} gap={"5"}>
          <Box>
            <Text>Email</Text>
            <TextField.Root>
              <TextField.Input {...register("email")} type="email" />
            </TextField.Root>
            <InputError error={errors.email} />
          </Box>
          <Box>
            <Text>App Password</Text>
            <PasswordField register={register("password")} id="app-password" />
            <InputError error={errors.password} />
          </Box>
          <Button type="submit" disabled={isSubmitting}>
            Add New Email
          </Button>
        </Flex>
      </Card>
    </form>
  );
};

export default NewSenderEmail;
