import { Canvas, escapeHtml, serve as createServer } from "./deps.ts";
import type { CanvasRenderingContext2D } from "./deps.ts";

const template = (
  { canvasData, bundle, submissions }: {
    canvasData: string;
    bundle: string;
    submissions: PlacementRequest[];
  },
) =>
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reddit Place Clone</title>
</head>
<body>
  <h1>Reddit Place Clone</h1>
  <p>
    Type a message and click the canvas to add your own blot.
  </p>
  <img src="${canvasData}" />
  <br>
  <a href="https://github.com/EthanThatOneKid/reddit-place-clone">
    github.com/EthanThatOneKid/reddit-place-clone ✨
  </a>
  <br>
  <label>Color: <input type="color" /></label>
  <label>Message: <input type="text" /></label>
  <div>${
    submissions.map(({ color, msg, ts }) =>
      `<p style="border: 5px solid ${color}; width: max-content">
        ${escapeHtml(msg.toLowerCase().replace(/\+/g, " "))}
        <br>
        <small>${new Date(ts)}</small>
      </p>`
    ).join("</div><div>")
  }</div>
  <script type="module">${bundle}</script>
</body>
</html>`;

interface PlacementRequest {
  x: number;
  y: number;
  color: string;
  msg: string;
  ts: number;
  ok: boolean;
}

const defaultPlacementRequestValues: PlacementRequest = {
  x: -1,
  y: -1,
  color: "black",
  msg: "",
  ts: -1,
  ok: false,
};

const parsePlacementRequest = (searchParams: string): PlacementRequest =>
  searchParams.replace(/(^\/*\?)|(\/*?)/g, "").split("&").reduce(
    (result, entry) => {
      const [key, value] = entry.split("=");
      if (key === "x") {
        result.x = Number(value);
      } else if (key === "y") {
        result.y = Number(value);
      } else if (key === "c") {
        result.color = decodeURIComponent(value);
      } else if (key === "msg") {
        result.msg = decodeURIComponent(value);
      }
      if (
        result.color !== defaultPlacementRequestValues.color &&
        result.x !== defaultPlacementRequestValues.x &&
        result.y !== defaultPlacementRequestValues.y
      ) {
        result.ts = Date.now();
        result.ok = true;
      }
      return result;
    },
    { ...defaultPlacementRequestValues },
  );

const getDrawInstructions = (
  { x, y }: PlacementRequest,
  size: number = 16,
): [number, number, number, number] => {
  const halfSize = size * 0.5;
  return [
    x - halfSize,
    y - halfSize,
    size,
    size,
  ];
};

const width = 400,
  height = 400,
  port = Deno.env.get("PORT") ? Number(Deno.env.get("PORT")) : 8080,
  cnv = Canvas.MakeCanvas(width, height),
  ctx = cnv.getContext("2d") as CanvasRenderingContext2D,
  submissions: PlacementRequest[] = [];
ctx.fillStyle = "black";
ctx.fillRect(0, 0, width, height);

const serve = async (): Promise<void> => {
  const bundle = await Deno.readTextFile("./client/mod.bundle.js");
  const server = createServer({ port });
  console.log(`Open http://localhost:${port}/ ✨`);
  for await (const request of server) {
    const placement = parsePlacementRequest(request.url);
    if (placement.ok) {
      if (placement.msg !== defaultPlacementRequestValues.msg) {
        submissions.unshift({ ...placement });
        if (submissions.length > 100) {
          submissions.pop();
        }
      }
      ctx.fillStyle = placement.color;
      ctx.fillRect(...getDrawInstructions(placement));
      console.log(submissions[0]);
    }
    const body = template({
      bundle,
      submissions,
      canvasData: cnv.toDataURL(),
    });
    request.respond({ body, status: 200 });
  }
};

if (import.meta.main) {
  serve();
}

export default serve;
