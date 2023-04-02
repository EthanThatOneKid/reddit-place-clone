import { escapeHtml, eta } from "./deps.ts";
import type { Placement } from "./placement.ts";

const INDEX_HTML = Deno.readTextFileSync(
  import.meta.resolve("../web/index.html"),
);
const MAIN_JS = Deno.readTextFileSync(import.meta.resolve("../web/main.js"));

export interface PageData {
  canvasData: string;
  submissions: Placement[];
}

export function render(data: PageData) {
  const submissionsHTML = renderSubmissions(data.submissions);
  return renderData({
    canvasData: data.canvasData,
    js: MAIN_JS,
    submissionsHTML,
    totalSubmissions: data.submissions.length,
  });
}

function renderSubmissions(data: Placement[]): string {
  return data.map(({ color, msg, ts, id }) =>
    `<p style="border: 5px solid ${color}; width: max-content">
    ${escapeHtml(msg.toLowerCase().replace(/\+/g, " "))}
    <br>
    <small>#${id} | ${new Date(ts)}</small>
  </p>`
  ).join("</div><div>");
}

interface RenderData {
  canvasData: string;
  js: string;
  submissionsHTML: string;
  totalSubmissions: number;
}

function renderData(data: RenderData) {
  return eta(INDEX_HTML, data);
}
