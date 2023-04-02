import { parse } from "./deps.ts";

export interface Flags {
  port: number;
  width: number;
  height: number;
}

export function parseFlags(args: string[]): Flags {
  const parsedArgs = parse(args);
  const port = parsedArgs.port ? Number(parsedArgs.port) : 8080;
  const width = parsedArgs.width ? Number(parsedArgs.width) : 400;
  const height = parsedArgs.height ? Number(parsedArgs.height) : width;
  return {
    port,
    width,
    height,
  };
}
