/**
 * A placement request from the client.
 */
export interface Placement {
  /**
   * The id of the placement.
   */
  id: number;
  /**
   * The x coordinate of the placement.
   */
  x: number;
  /**
   * The y coordinate of the placement.
   */
  y: number;
  /**
   * The color of the placement.
   */
  color: string;
  /**
   * The message of the placement.
   */
  msg: string;
  /**
   * The timestamp of the placement.
   */
  ts: number;
  /**
   * Whether the placement is valid.
   */
  ok: boolean;
}

/**
 * Parse a placement from a request.
 */
export function fromRequest(request: Request, id: number): Placement {
  const url = new URL(request.url);
  const result = { ...ZERO_PLACEMENT };

  const x = Number(url.searchParams.get("x"));
  if (!isNaN(x)) {
    result.x = x;
  }

  const y = Number(url.searchParams.get("y"));
  if (!isNaN(y)) {
    result.y = y;
  }

  const color = url.searchParams.get("c");
  if (color) {
    result.color = color;
  }

  const msg = url.searchParams.get("msg");
  if (msg) {
    result.msg = msg;
  }

  if (
    result.color !== ZERO_PLACEMENT.color &&
    result.x !== ZERO_PLACEMENT.x &&
    result.y !== ZERO_PLACEMENT.y
  ) {
    result.ts = Date.now();
    result.id = id;
    result.ok = true;
  }

  return result;
}

const ZERO_PLACEMENT: Placement = {
  x: -1,
  y: -1,
  color: "black",
  msg: "",
  ts: -1,
  ok: false,
  id: -1,
};
