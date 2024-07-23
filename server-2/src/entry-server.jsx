import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";
import { generateMetaTags } from "../utils/ssrUtils";

export function render(params) {
  const metaTgas = generateMetaTags(params.summary);
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App initialData={params.summary} />
    </React.StrictMode>
  );

  return {
    head: metaTgas,
    html,
  };
}
