import { Box, Grid } from "@radix-ui/themes";
import NewSenderEmail from "./home-components/NewSenderEmail";
import Stats from "./home-components/Stats";
import Last5Mail from "./home-components/Last5Mail";
import SenderEmail from "./home-components/SenderEmail";

const Home = () => {
  return (
    <Grid columns={{ initial: "1", md: "2" }}>
      <Box mr={{ initial: "0", md: "5" }} mt={"5"}>
        <Stats />
      </Box>
      <Box ml={{ initial: "0", md: "5" }} mt={"5"}>
        <Last5Mail />
      </Box>
      <Box mr={{ initial: "0", md: "5" }} mt={"5"}>
        <NewSenderEmail />
      </Box>
      <Box ml={{ initial: "0", md: "5" }} mt={"5"}>
        <SenderEmail />
      </Box>
    </Grid>
  );
};

export default Home;
