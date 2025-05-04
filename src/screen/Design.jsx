import { Card, Input, Button, Row, Col, message, Image, Spin } from "antd";
import { useState } from "react";
import axios from "axios";

const Design = ({ setGeneratedCode }) => {
  const [figmaUrl, setFigmaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const extractFileKey = (url) => {
    const match = url.match(/(?:file|design)\/([a-zA-Z0-9]+)\//);
    return match?.[1] || null;
  };

  const handlePreview = async () => {
    const fileKey = extractFileKey(figmaUrl);
    if (!fileKey) return message.error("Invalid Figma URL");

    setThumbnailUrl("loading");

    try {
      const res = await axios.get(`https://api.figma.com/v1/files/${fileKey}`, {
        headers: {
          "X-Figma-Token": import.meta.env.VITE_FIGMA_TOKEN,
        },
      });

      const thumb = res.data.thumbnailUrl;
      setThumbnailUrl(thumb);
      message.success("✅ Preview loaded!");
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to load preview");
    }
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    message.loading("Generating code...");
  
    try {
      // Step: Request generated code directly from backend
      const res = await axios.get("http://localhost:4000/generate-code");
  
      if (!res.data?.code) {
        throw new Error("No code returned from server");
      }
  
      setGeneratedCode(res.data.code);
      message.success("✅ Code generated and loaded!");
    } catch (err) {
      console.error("Error generating code:", err);
      message.error("❌ Failed to generate code");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <Card className="data-card" title="Design Preview">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input
            placeholder="Paste Figma Link"
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" block onClick={handlePreview}>
            Preview
          </Button>
        </Col>
        <Col span={6}>
          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleGenerateCode}
          >
            Generate Code
          </Button>
        </Col>
      </Row>

      <div style={{ marginTop: "5rem", textAlign: "center" }}>
        {thumbnailUrl === "loading" && <Spin />}
        {thumbnailUrl && thumbnailUrl !== "loading" && (
          <Image
            src={thumbnailUrl}
            alt="Figma Design Preview"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        )}
      </div>
    </Card>
  );
};

export default Design;
