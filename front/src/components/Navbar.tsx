import { Box, Flex } from "@radix-ui/themes";
import Link from "./Link";

const Navbar = () => {
  return (
    <Box className="bg-blue-700 rounded-lg px-3 py-2">
      <Flex justify={"between"}>
        <Flex gap={"2"}>
          <Link href="/" color="white">
            Home
          </Link>
          <Link href="/new-mail" color="white">
            New
          </Link>
          <Link href="/sent-mail" color="white">
            Sent
          </Link>
          <Link href="/editor" color="white">
            Editor
          </Link>
        </Flex>
        <Flex>
          <Link href="/logout" color="white">
            Logout
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
