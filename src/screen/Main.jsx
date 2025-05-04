import { useState } from "react";
import { Row, Col } from "antd";
import Design from "./Design";
import Code from "./Code";

import './Main.scss';

function Main() {
  const [generatedCode, setGeneratedCode] = useState("");

  return (
    <div className="full-height">
      <h1 className="title">Design to Code</h1>
      <Row gutter={[16, 16]} style={{ marginTop: "2rem" }}>
        <Col span={12}>
          <Design setGeneratedCode={setGeneratedCode} />
        </Col>
        <Col span={12}>
          <Code code={generatedCode} />
        </Col>
      </Row>
    </div>
  );
}

export default Main;
