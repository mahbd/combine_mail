import {
  Box,
  Button,
  Flex,
  Grid,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { z } from "zod";
import Loading from "../components/Loading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputError from "../components/InputError";
import http from "../services/http";
import { sURL } from "../c";

enum Mode {
  SERIAL = "serial",
  DISTRIBUTE = "distribute",
  RANDOM = "random",
}

const schema = z.object({
  emails: z.string().min(4, "Receivers email is required"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  body: z.string().min(100, "Body is too short"),
  delay: z.number(),
  burst_mode: z.enum([Mode.DISTRIBUTE, Mode.RANDOM, Mode.SERIAL]),
});

type FormData = z.infer<typeof schema>;

const New = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const copied_data = {
      ...data,
      emails: validateEmails(data.emails).split("\n"),
    };
    http
      .post(sURL.sendMail, JSON.stringify(copied_data), {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        alert("Emails are being sent");
        // @ts-ignore
        window.location = "/sent-mail";
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

  const validateEmails = (emails: string): string => {
    const emailsArray = emails.split("\n");
    const validEmails: string[] = [];
    let invalidCount = 0;
    for (let email of emailsArray) {
      if (email.length == 0) continue;
      const res = z.string().email().safeParse(email);
      if (res.success) validEmails.push(email);
      else invalidCount++;
    }
    setValue("emails", validEmails.join("\n"));
    if (invalidCount > 0) {
      alert(`${invalidCount} emails are invalid`);
    }
    return validEmails.join("\n");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
        <Flex direction={"column"} gap={"3"}>
          <Box>
            <label htmlFor="delay">Delay(in milliseconds)</label>
            <TextField.Input {...register("delay", { valueAsNumber: true })} />
          </Box>
          <Box>
            <label htmlFor="subject">Subject</label>
            <TextField.Input {...register("subject")} />
            <InputError error={errors.subject} />
          </Box>
          <Box>
            <label htmlFor="body">Body</label>
            <TextArea style={{ height: "300px" }} {...register("body")} />
            <InputError error={errors.body} />
          </Box>
          <Button type="submit">
            {isSubmitting ? <Loading /> : " Send Email"}
          </Button>
        </Flex>
        <Flex gap={"3"} direction={"column"}>
          <Box>
            <Select.Root
              defaultValue=""
              name="burst_mode"
              onValueChange={(value) => {
                setValue("burst_mode", value as Mode);
                console.log(value);
              }}
            >
              <Select.Trigger mt={"2"} placeholder="Select burst mode ..." />
              <Select.Content>
                <Select.Item value="serial">
                  After exceeding limit of one email send from next email
                </Select.Item>
                <Select.Item value="distribute">
                  1st from 1st email, 2nd from 2nd email....
                </Select.Item>
                <Select.Item value="random">
                  Randomly select sender email
                </Select.Item>
              </Select.Content>
            </Select.Root>
            <InputError error={errors.burst_mode} />
          </Box>
          <Box>
            <label htmlFor="receivers">Receivers</label>
            <TextArea {...register("emails")} style={{ height: "385px" }} />
            <InputError error={errors.emails} />
          </Box>
          <Button
            type="button"
            onClick={() => validateEmails(getValues("emails"))}
          >
            Validate
          </Button>
        </Flex>
      </Grid>
    </form>
  );
};

export default New;
