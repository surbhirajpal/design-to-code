import axios from "axios";

//from figm account token
const FIGMA_TOKEN = "figd_4tnfD-rqohXLIjcH_zc5zcn_VCHqvgeVExfMDypL";

//from figma file url
const FILE_KEY = "p8YCxiiqUdv8NNmhbHvW3t";

// figma file url: https://www.figma.com/design/p8YCxiiqUdv8NNmhbHvW3t/Bootstrap-5-Design-System---UI-Kit--Community-?node-id=0-1&p=f&t=wZ1K0ACzf1K9m5uH-0
// error from api: 400 - request too large
// adding node id from url 'node-id=0-1'
const NODE_ID = "0:1";

export async function fetchFigmaNode() {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(
    NODE_ID
  )}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Figma data:", error);
    throw error;
  }
}
