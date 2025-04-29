import axios from "axios";

const figmaToken = import.meta.env.FIGMA_TOKEN;
const figmaFileKey = import.meta.env.FILE_KEY;
const nodeID = import.meta.env.NODE_ID;


// figma file url: https://www.figma.com/design/p8YCxiiqUdv8NNmhbHvW3t/Bootstrap-5-Design-System---UI-Kit--Community-?node-id=0-1&p=f&t=wZ1K0ACzf1K9m5uH-0
// error from api: 400 - request too large
// adding node id from url 'node-id=0-1'

export async function fetchFigmaNode() {
  const url = `https://api.figma.com/v1/files/${figmaFileKey}/nodes?ids=${encodeURIComponent(
    nodeID
  )}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-Figma-Token": figmaToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Figma data:", error);
    throw error;
  }
}
