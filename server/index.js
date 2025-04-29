import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname for ESM (import/export style)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(express.json());

// ---------------------------
// Route: Server Status
// ---------------------------
app.get("/", (req, res) => {
  res.send("🎯 Design-to-Code Automation Server is Running!");
});

// ---------------------------
// Route: Fetch Figma Data
// ---------------------------
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

    console.log(`✅ Full Figma JSON saved at ${savePath}`);
    res
      .status(200)
      .json({ message: "Figma JSON fetched and saved!", path: savePath });
  } catch (error) {
    console.error("❌ Error fetching Figma data:", error.message || error);
    res.status(500).json({ error: "Failed to fetch Figma data" });
  }
});

// ---------------------------
// Helper: Clean node data
// ---------------------------
function extractMinimalData(node) {
  if (node.visible === false) {
    // Skip hidden nodes completely
    return null;
  }

  const minimal = {
    id: node.id,
    type: node.type,
    name: node.name,
  };

  if (node.characters) {
    minimal.characters = node.characters;
  }

  if (node.children) {
    const cleanedChildren = node.children
      .map(extractMinimalData)
      .filter((child) => child !== null); // Remove hidden/null children
    if (cleanedChildren.length > 0) {
      minimal.children = cleanedChildren;
    }
  }

  return minimal;
}

// ---------------------------
// Route: Generate Code from Figma JSON
// ---------------------------
app.get("/generate-code", async (req, res) => {
  try {
    const figmaDataPath = path.join(__dirname, "figmaData.json");
    if (!fs.existsSync(figmaDataPath)) {
      return res
        .status(400)
        .json({ error: "figmaData.json not found. Fetch Figma data first!" });
    }

    const figmaData = JSON.parse(fs.readFileSync(figmaDataPath, "utf8"));

    const rawChildren =
      figmaData.nodes[process.env.FIGMA_NODE_ID].document.children;

    // Clean children recursively
    const minimalChildren = rawChildren.map(extractMinimalData);

    const cleanPath = path.join(__dirname, "figmaChildrenClean.json");
    fs.writeFileSync(cleanPath, JSON.stringify(minimalChildren, null, 2));

    console.log(`✅ Cleaned Children JSON saved at ${cleanPath}`);

    // Build prompt dynamically
    const prompt = `
You are a frontend assistant specializing in Bootstrap and React.

Given the following simplified Figma nodes:
${JSON.stringify(minimalChildren, null, 2)}

Task:
- Detect real UI components (Button, Card, Navbar, etc.)
- Map them into react-bootstrap components.
- Maintain hierarchy if children exist.
- Use node.name and characters for labels/text.
- Only output clean JSX code.

Output:
`;

    // Call OpenAI manually via Axios
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // or gpt-3.5-turbo
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

    const outputPath = path.join(__dirname, "generatedDesktop1.jsx");
    fs.writeFileSync(outputPath, generatedCode);

    console.log(`✅ Generated React Bootstrap code saved at ${outputPath}`);
    res
      .status(200)
      .json({ message: "Generated code saved!", path: outputPath });
  } catch (error) {
    console.error(
      "❌ Error generating code:",
      error.message || error.response?.data || error
    );
    res.status(500).json({ error: "Failed to generate code" });
  }
});

// ---------------------------
// Start the server
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
