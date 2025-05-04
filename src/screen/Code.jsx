import { Button, Card, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import Editor from "@monaco-editor/react";

const Code = ({ code }) => {
  const handleCopyCode = () => {
    if (!code) return message.warning("Nothing to copy");
    navigator.clipboard.writeText(code);
    message.success("Code copied!");
  };

  return (
    <Card
      className="data-card"
      title="Generated Code"
      extra={
        <Button type="default" icon={<CopyOutlined />} onClick={handleCopyCode}>
          Copy
        </Button>
      }
      bodyStyle={{ height: "600px", padding: 0 }}
    >
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />
    </Card>
  );
};

export default Code;
