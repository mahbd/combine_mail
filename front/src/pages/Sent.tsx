import { Flex, Heading, Table } from "@radix-ui/themes";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";

interface SentMail {
  sender: string;
  receiver: string;
  subject: string;
  status: string;
  time: string;
}

const sentMails: SentMail[] = [
  {
    sender: "test@gmail.com",
    receiver: "test@gmail.com",
    subject: "test",
    status: "sent",
    time: "2021-08-08 12:00:00",
  },
  {
    sender: "test@gmail.com",
    receiver: "test@gmail.com",
    subject: "test",
    status: "sent",
    time: "2021-08-08 12:00:00",
  },
  {
    sender: "test@gmail.com",
    receiver: "test@gmail.com",
    subject: "test",
    status: "sent",
    time: "2021-08-08 12:00:00",
  },
];

const Sent = () => {
  const [searchParams] = useSearchParams();
  return (
    <Flex direction={"column"} gap={"3"}>
      <Heading align={"center"}>Sent Messages</Heading>
      <Table.Root variant="surface" size={"1"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Sender</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Receiver</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Sent Time</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sentMails.map((mail) => (
            <Table.Row>
              <Table.Cell>{mail.sender}</Table.Cell>
              <Table.Cell>{mail.receiver}</Table.Cell>
              <Table.Cell>{mail.subject}</Table.Cell>
              <Table.Cell>{mail.status}</Table.Cell>
              <Table.Cell>{mail.time}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        itemCount={100}
        pageSize={5}
        currentPage={parseInt(searchParams.get("page") || "1")}
      />
    </Flex>
  );
};

export default Sent;
