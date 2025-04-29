export const componentMappings = {
  card: {
    bootstrapComponent: "div",
    className: "card",
    structure: [
      { type: "img", className: "card-img-top", props: ["src", "alt"] },
      {
        type: "div",
        className: "card-body",
        children: [
          { type: "h5", className: "card-title", props: ["text"] },
          {
            type: "h6",
            className: "card-subtitle mb-2 text-muted",
            props: ["text"],
          },
          { type: "p", className: "card-text", props: ["text"] },
          { type: "a", className: "btn btn-primary", props: ["href", "text"] },
        ],
      },
    ],
  },
  button: {
    bootstrapComponent: "a",
    className: "btn btn-primary",
    props: ["href", "text"],
  },
  navbar: {
    bootstrapComponent: "nav",
    className: "navbar navbar-expand-lg navbar-light bg-light",
    props: [],
  },
};
