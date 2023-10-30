import { Button, Flex, Link } from "@radix-ui/themes";

const Footer = () => {
  return (
    <Flex justify={"center"} mt={"9"}>
      <Link href="https://github.com/mahbd" target="_blank">
        <Button
          variant="soft"
          size={"3"}
          color="blue"
          style={{ cursor: "pointer" }}
        >
          Developed by Mahmudul Alam
        </Button>
      </Link>
    </Flex>
  );
};

export default Footer;
