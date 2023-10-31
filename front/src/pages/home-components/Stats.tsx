import { Flex, Heading, Table } from "@radix-ui/themes";
import useModels from "../../services/useModels";
import { sURL } from "../../c";

interface IStats {
  sent_count: number;
  pending_count: number;
  delivered_count: number;
  template_count: number;
  sender_count: number;
}

const Stats = () => {
  const { data: stats } = useModels<IStats>(sURL.userStats, "user-stats");
  return (
    <Flex direction={"column"} gap={"3"}>
      <Heading align={"center"}>User Stats</Heading>
      <Table.Root variant="surface" size={"1"}>
        <Table.Body>
          <Table.Row>
            <Table.ColumnHeaderCell>Total Sent</Table.ColumnHeaderCell>
            <Table.Cell>{stats?.sent_count}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>Total Delivered</Table.ColumnHeaderCell>
            <Table.Cell>{stats?.delivered_count}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>Total Pending</Table.ColumnHeaderCell>
            <Table.Cell>{stats?.pending_count}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>Total template</Table.ColumnHeaderCell>
            <Table.Cell>{stats?.template_count}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>Total Mail Account</Table.ColumnHeaderCell>
            <Table.Cell>{stats?.sender_count}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default Stats;
