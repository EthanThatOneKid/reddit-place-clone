import type { CanvasRenderingContext2D } from "./deps.ts";
import { Canvas, escapeHtml, serve as createServer } from "./deps.ts";

const template = (
  { canvasData, bundle, submissions, totalPlacements }: {
    canvasData: string;
    bundle: string;
    submissions: PlacementRequest[];
    totalPlacements: number;
  },
) => ``;

const defaultPlacementRequestValues: PlacementRequest = {
  x: -1,
  y: -1,
  color: "black",
  msg: "",
  ts: -1,
  ok: false,
  id: -1,
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
        result.id = totalPlacements;
        result.ok = true;
      }
      return result;
    },
    { ...defaultPlacementRequestValues },
  );

const width = 400,
  height = 400,
  port = Deno.env.get("PORT") ? Number(Deno.env.get("PORT")) : 8080,
  submissions: PlacementRequest[] = [];
ctx.fillStyle = "black";
ctx.fillRect(0, 0, width, height);

let totalPlacements = 0;

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
      totalPlacements++;
      console.log(submissions[0]);
    }
    const body = template({
      bundle,
      submissions,
      totalPlacements,
      canvasData: cnv.toDataURL(),
    });
    request.respond({ body, status: 200 });
  }
};

if (import.meta.main) {
  serve();
}

export default serve;
