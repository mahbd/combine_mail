"use client";

import { Button, Flex, Select, Text } from "@radix-ui/themes";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

interface Props {
  itemCount: number;
  limit: number;
  offset: number;
}

const Pagination = ({ itemCount, limit, offset }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  if (itemCount <= limit) return null;

  const changePage = (offset: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", offset.toString());
    params.set("limit", limit.toString());
    setSearchParams(params);
  };

  return (
    <Flex align={"center"} gap={"2"}>
      <Text size={"2"}>
        Showing {offset + 1} - {offset + limit} of {itemCount}
      </Text>
      <Button
        color="gray"
        variant="soft"
        disabled={offset === 0}
        onClick={() => changePage(0)}
      >
        <BiChevronsLeft />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={offset === 0}
        onClick={() => changePage(Math.max(0, offset - limit))}
      >
        <BiChevronLeft />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={offset + limit >= itemCount}
        onClick={() => changePage(offset + limit)}
      >
        <BiChevronRight />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={offset + limit >= itemCount}
        onClick={() => changePage(itemCount - limit)}
      >
        <BiChevronsRight />
      </Button>
      <Select.Root
        defaultValue={limit.toString()}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams);
          params.set("limit", value as string);
          setSearchParams(params);
        }}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="10">10</Select.Item>
          <Select.Item value="20">20</Select.Item>
          <Select.Item value="50">50</Select.Item>
          <Select.Item value="100">100</Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default Pagination;
