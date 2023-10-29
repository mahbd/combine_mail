import { Box, Button, Flex, Grid, TextArea, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import { z } from "zod";
import { sURL } from "../c";
import Loading from "../components/Loading";

const New = () => {
  const [receivers, setReceivers] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string | undefined>(undefined);
  const [delay, setDelay] = useState<number>(1000);
  const [loading, setLoading] = useState<boolean>(false);

  const send_email = async () => {
    setLoading(true);
    validateEmails(receivers);
    const emails = receivers.split("\n");
    try {
      await axios.post(sURL.login, {
        emails,
        subject,
        body,
        delay,
      });
      alert("Emails sent");
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const validateEmails = (emails: string) => {
    const emailsArray = emails.split("\n");
    const validEmails: string[] = [];
    let invalidCount = 0;
    for (let email of emailsArray) {
      if (email.length == 0) continue;
      const res = z.string().email().safeParse(email);
      if (res.success) validEmails.push(email);
      else invalidCount++;
    }
    setReceivers(validEmails.join("\n"));
    if (invalidCount > 0) {
      alert(`${invalidCount} emails are invalid`);
    }
  };

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
      <Flex direction={"column"} gap={"3"}>
        <Box>
          <label htmlFor="delay">Delay(in milliseconds)</label>
          <TextField.Input
            id="delay"
            placeholder="Delay in milliseconds"
            type="number"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
          />
        </Box>
        <Box>
          <label htmlFor="subject">Subject</label>
          <TextField.Input
            id="subject"
            placeholder="Subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Box>
        <Box>
          <label htmlFor="body">Body</label>
          <TextArea
            id="body"
            name="email_body"
            value={body}
            style={{ height: "300px" }}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
        </Box>
        <Button onClick={send_email}>
          {loading ? <Loading /> : " Send Email"}
        </Button>
      </Flex>
      <Flex gap={"3"} direction={"column"}>
        <Box>
          <label htmlFor="receivers">Receivers</label>
          <TextArea
            id="receivers"
            placeholder="Receivers"
            value={receivers}
            style={{ height: "435px" }}
            onChange={(e) => setReceivers(e.target.value)}
          />
        </Box>
        <Button onClick={() => validateEmails(receivers)}>Validate</Button>
      </Flex>
    </Grid>
  );
};

export default New;
