import type { Placement } from "./placement.ts";

function getDrawInstructions(
  { x, y }: Placement,
  size = 16,
): [number, number, number, number] {
  const halfSize = size * 0.5;
  return [
    x - halfSize,
    y - halfSize,
    size,
    size,
  ];
}
