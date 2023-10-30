import { Flex, Heading, Table } from "@radix-ui/themes";

const Stats = () => {
  return (
    <Flex direction={"column"} gap={"3"}>
      <Heading align={"center"}>User Stats</Heading>
      <Table.Root variant="surface" size={"1"}>
        <Table.Body>
          <Table.Row>
            <Table.ColumnHeaderCell>Total sent</Table.ColumnHeaderCell>
            <Table.Cell>400</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>Total Delivered</Table.ColumnHeaderCell>
            <Table.Cell>400</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>Total Pending</Table.ColumnHeaderCell>
            <Table.Cell>400</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>Total template</Table.ColumnHeaderCell>
            <Table.Cell>3</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>API key</Table.ColumnHeaderCell>
            <Table.Cell>400</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default Stats;
