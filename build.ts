const build = async (): Promise<boolean> => {
  const process = Deno.run({
    cmd: [
      "deno",
      "bundle",
      "client/mod.ts",
      "assets/mod.bundle.js",
      "--config",
      "client/tsconfig.json",
    ],
  });
  const { success } = await process.status();
  return success;
};

if (import.meta.main) {
  build();
}

export default build;
