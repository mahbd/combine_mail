import { Badge, Flex, Heading, Table } from "@radix-ui/themes";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import useModels from "../services/useModels";
import { sURL } from "../c";
import Loading from "../components/Loading";

export interface ISentMail {
  id: number;
  from_email: string;
  email_address: string;
  sent_time: string;
  status: string;
  subject: string;
}

const Sent = () => {
  const [searchParams] = useSearchParams();
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const trailing = `?limit=${limit}&offset=${offset}`;

  const { data: sentMails, count } = useModels<ISentMail[]>(
    sURL.sentMails + trailing,
    "sent-mails?" + trailing,
    undefined,
    true
  );

  if (!sentMails) return <Loading />;

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
              <Table.Cell>{mail.from_email}</Table.Cell>
              <Table.Cell>{mail.email_address}</Table.Cell>
              <Table.Cell>{mail.subject}</Table.Cell>
              <Table.Cell>
                <StatusBadge status={mail.status} />
              </Table.Cell>
              <Table.Cell>{readableDateTime(mail.sent_time)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination itemCount={count || 1} limit={limit} offset={offset} />
    </Flex>
  );
};

export default Sent;

export const readableDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()];
  const day =
    date.getDate() < 10
      ? "0" + date.getDate().toString()
      : date.getDate().toString();
  const hours =
    date.getHours() < 10
      ? "0" + date.getHours().toString()
      : date.getHours().toString();
  const minutes =
    date.getMinutes() < 10
      ? "0" + date.getMinutes().toString()
      : date.getMinutes().toString();
  const amOrPm = parseInt(hours) >= 12 ? "PM" : "AM";
  const formattedHours = parseInt(hours) % 12 || 12;
  const formattedDateTime = `${month} ${day}, ${year} ${formattedHours}:${minutes} ${amOrPm}`;
  return formattedDateTime;
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status == "pending") return <Badge color="blue">Pending</Badge>;
  if (status == "sent") return <Badge color="lime">Sent</Badge>;
  if (status == "sending") return <Badge color="pink">Sending</Badge>;
  if (status == "delivered") return <Badge color="green">Delivered</Badge>;
  if (status == "failed") return <Badge color="red">Failed</Badge>;
  return <Badge color="yellow">Unknown</Badge>;
};
