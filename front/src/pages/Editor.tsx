import { Button, Flex } from "@radix-ui/themes";
import TextEditor from "../components/TextEditor";
import { useEffect, useState } from "react";

const Editor = () => {
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    const editor = localStorage.getItem("editor");
    if (editor) setValue(editor || "<p><br></p>");
  }, []);

  return (
    <Flex direction={"column"}>
      {value && (
        <TextEditor
          label="Editor"
          name="editor"
          onChange={(value) => {
            localStorage.setItem("editor", value);
            setValue(value);
          }}
          value={value}
        />
      )}
      <Button
        className="cursor-pointer"
        onClick={() => {
          const style_sheet =
            "<link rel='stylesheet' href='https://storage.googleapis.com/tsp-storage/assets/quill.css'>";
          const message = `<html><head>${style_sheet}</head><body>${value}</body></html>`;
          navigator.clipboard.writeText(message || "");
        }}
      >
        Copy
      </Button>
    </Flex>
  );
};

export default Editor;
