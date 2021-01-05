import build from "./build.ts";
import serve from "./serve.ts";

const dev = async () => {
  const status = await build();
  if (status) {
    await serve();
  }
};

if (import.meta.main) {
  dev();
}

export default dev;
