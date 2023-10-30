import { Flex, Heading, Table } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";

const SenderEmailSkeleton = () => {
  const senderMails = [1, 2, 3, 4, 5];
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
          {senderMails.map((_, i) => (
            <Table.Row key={i}>
              <Table.Cell>
                <Skeleton height={"2rem"} />
              </Table.Cell>
              <Table.Cell>
                <Skeleton height={"2rem"} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default SenderEmailSkeleton;
