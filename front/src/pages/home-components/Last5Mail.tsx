import { Flex, Heading, Table } from "@radix-ui/themes";
import useModels from "../../services/useModels";
import { ISentMail, readableDateTime } from "../Sent";
import { sURL } from "../../c";

const Last5Mail = () => {
  const { data: sentMails } = useModels<ISentMail[]>(
    sURL.sentMails + "?limit=5",
    "last-5-mail",
    undefined,
    true
  );
  return (
    <Flex direction={"column"} gap={"3"}>
      <Heading align={"center"}>Last 5 Mail</Heading>
      <Table.Root variant="surface" size={"1"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Email Address</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Sent Time</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sentMails?.map((mail) => (
            <Table.Row>
              <Table.Cell>{mail.email_address}</Table.Cell>
              <Table.Cell>{readableDateTime(mail.sent_time)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default Last5Mail;
