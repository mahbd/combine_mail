import { Box, Button, Flex } from "@radix-ui/themes";
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
          {localStorage.getItem("access") == null ? (
            <Link href="/auth/login" color="white">
              Logout
            </Link>
          ) : (
            <Button
              size={"1"}
              color="red"
              onClick={() => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                // @ts-ignore
                window.location = "/auth/login";
              }}
            >
              Logout
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
