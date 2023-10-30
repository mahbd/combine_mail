import { Badge, Flex, Heading, Table } from "@radix-ui/themes";
import useModels from "../../services/useModels";
import { sURL } from "../../c";
import SenderEmailSkeleton from "./SenderEmailSkeleton";
import DeleteSenderMail from "./DeleteSenderMail";

interface ISenderMail {
  id: number;
  email: string;
  password: string;
  refresh_time: number;
  last_expired?: string;
}

const SenderEmail = () => {
  const { data: senderMails } = useModels<ISenderMail[]>(
    sURL.senderMail,
    "senderMail"
  );
  if (!senderMails) return <SenderEmailSkeleton />;

  return (
    <Flex direction={"column"} gap={"3"}>
      <Heading align={"center"}>Sender Emails</Heading>
      <Table.Root variant="surface" size={"1"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Email Address</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {senderMails.map((senderMail) => (
            <Table.Row key={senderMail.id}>
              <Table.Cell>{senderMail.email}</Table.Cell>
              <Table.Cell>
                <StatusBadge last_expire={senderMail.last_expired} />{" "}
              </Table.Cell>
              <Table.Cell>
                <DeleteSenderMail Id={senderMail.id} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default SenderEmail;

const StatusBadge = ({ last_expire }: { last_expire: string | undefined }) => {
  if (!last_expire) return <Badge color="green">Active</Badge>;
  // 2023-10-30T18:00:00+06:00  convert this to datetime
  const last_expire_date = new Date(last_expire);
  const now = new Date();
  if (last_expire_date > now) return <Badge color="red">Inactive</Badge>;
  return <Badge color="green">Active</Badge>;
};
