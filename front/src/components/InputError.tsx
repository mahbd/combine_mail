import { Text } from "@radix-ui/themes";

interface Props {
  error?: any;
}

const InputError = ({ error }: Props) => {
  if (!error) return null;
  return (
    <Text color="red" size={"1"}>
      {error.message}
    </Text>
  );
};

export default InputError;
