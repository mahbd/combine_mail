import "./quill.css";
import ReactQuill from "react-quill";

const modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
    handlers: {
      image: function (this: any) {
        const editor = this.quill;
        const range = editor.getSelection();
        const value = prompt("Please paste the image url here.");
        if (value) {
          editor.insertEmbed(range.index, "image", value);
        }
      },
    },
  },
};

interface Props {
  name: string;
  label: string;
  onChange: (event: any) => void;
  value?: string;
  error?: string;
}

const TextEditor = ({ name, label, onChange, value, error }: Props) => {
  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        margin: "0.2rem",
        background: "white",
      }}
    >
      <label htmlFor={name}>{label}</label>
      <ReactQuill
        defaultValue={value}
        onChange={onChange}
        theme="snow"
        modules={modules}
      ></ReactQuill>
      {error && <div className="alert-danger">{error}</div>}
      <br />
    </div>
  );
};

export default TextEditor;
