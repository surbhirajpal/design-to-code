import { componentMappings } from '../mappings/componentMappings';

/**
 * Traverses the Figma node tree and finds all components
 * that match your mapping definitions (card, button, navbar, etc.)
 */
export function findMappedComponents(figmaJson) {
  const mappedComponents = [];

  function traverse(node) {
    if (!node) return;

    const nodeName = node.name ? node.name.toLowerCase() : "";

    // Match against your component mappings
    Object.keys(componentMappings).forEach(componentKey => {
      if (nodeName.includes(componentKey)) {
        mappedComponents.push({
          id: node.id,
          name: node.name,
          type: componentKey,
          bootstrapMapping: componentMappings[componentKey]
        });
      }
    });

    // Recursively traverse children if they exist
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => traverse(child));
    }
  }

  // --- THIS IS THE KEY: We fetch from "nodes" ---
  const nodeIds = Object.keys(figmaJson.nodes);
  nodeIds.forEach(nodeId => {
    const rootNode = figmaJson.nodes[nodeId].document;
    traverse(rootNode);
  });

  return mappedComponents;
}
