import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/** Health Check **/
app.get("/", (req, res) => {
  res.send("🎯 Design-to-Code Server is Running!");
});

/** Fetch Figma Nodes **/
app.get("/fetch-figma", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${process.env.FIGMA_FILE_KEY}/nodes`,
      {
        headers: {
          "X-Figma-Token": process.env.FIGMA_TOKEN,
        },
        params: {
          ids: process.env.FIGMA_NODE_ID,
        },
      }
    );

    const figmaData = response.data;
    const savePath = path.join(__dirname, "figmaData.json");
    fs.writeFileSync(savePath, JSON.stringify(figmaData, null, 2));

    console.log(`✅ Figma JSON saved at ${savePath}`);
    res.status(200).json({ message: "Figma JSON saved", path: savePath });
  } catch (error) {
    console.error("❌ Error fetching Figma data:", error.message || error);
    res.status(500).json({ error: "Failed to fetch Figma data" });
  }
});

/** Clean minimal structure recursively + remove hidden **/
function extractMinimalData(node) {
  if (node.visible === false) return null;

  const minimal = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  if (node.characters) minimal.characters = node.characters;

  if (node.children) {
    const visibleChildren = node.children
      .map(extractMinimalData)
      .filter(Boolean); // remove nulls
    if (visibleChildren.length > 0) {
      minimal.children = visibleChildren;
    }
  }

  return minimal;
}

/** Generate React-Bootstrap Code **/
app.get("/generate-code", async (req, res) => {
  try {
    const figmaDataPath = path.join(__dirname, "figmaData.json");
    if (!fs.existsSync(figmaDataPath)) {
      return res.status(400).json({
        error: "figmaData.json not found. Fetch Figma data first!",
      });
    }

    const figmaData = JSON.parse(fs.readFileSync(figmaDataPath, "utf8"));
    const rawChildren =
      figmaData.nodes[process.env.FIGMA_NODE_ID].document.children;

    const minimalChildren = rawChildren.map(extractMinimalData).filter(Boolean); // Filter out null from root level

    const prompt = `
You are a React frontend assistant.

Input: A simplified set of Figma nodes. Each node includes:
- type (e.g., TEXT, RECTANGLE, FRAME)
- name (e.g., Card, Button, Header)
- characters: visible content text (if present)
- children (optional nested nodes)

Your job:
- Convert this structure to JSX using React Bootstrap.
- Use only content and structure found in the JSON — no assumptions.
- Use "characters" exactly as text/labels.
- Use "name" and "type" to infer Bootstrap components (Card, Button, etc).
- Do NOT add dummy content (e.g., placeholder images, Card.Footer, repeated links).
- Do NOT repeat or fabricate anything.
- Generate valid, clean JSX code in a functional component.
- - Output only the JSX inside the Bootstrap Card component — no outer function, no imports, no export.
- Return only raw JSX — no markdown, no wrapping, no explanation.

Input Figma nodes:
${JSON.stringify(minimalChildren, null, 2)}

Output:
`;

    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedCode = openaiResponse.data.choices[0].message.content;
    // Remove Markdown wrapping if present
    const cleanCode = generatedCode
      .replace(/^```(?:jsx)?\n?/, "")
      .replace(/```$/, "");

    console.log("✅ Code generated via OpenAI");
    res.status(200).json({ code: cleanCode });
  } catch (error) {
    console.error(
      "❌ Error generating code:",
      error.message || error.response?.data || error
    );
    res.status(500).json({ error: "Failed to generate code" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
