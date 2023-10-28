import { Flex, Heading, Table } from "@radix-ui/themes";

const Last5Mail = () => {
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
          <Table.Row>
            <Table.Cell>danilo@example.com</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>zahra@example.com</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>jasper@example.com</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>jasper@example.com</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>jasper@example.com</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default Last5Mail;
