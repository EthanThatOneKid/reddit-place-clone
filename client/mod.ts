const main = () => {
  let color = new URLSearchParams(location.href).get("c") || "black";
  let msg: string | undefined = undefined;
  const img = document.querySelector("img");
  if (img !== null) {
    img.addEventListener("click", (event) => {
      const { offsetX, offsetY } = event;
      const params = new URLSearchParams();
      params.append("x", offsetX.toString());
      params.append("y", offsetY.toString());
      params.append("c", color);
      msg && params.append("msg", msg);
      const url = `${location.origin}?${params}`;
      location.replace(url);
    });
  }
  const colorInput: any = document.querySelector("input[type=color]");
  if (colorInput !== null) {
    colorInput.value = decodeURIComponent(color);
    colorInput.addEventListener("change", (event: any) => {
      color = event?.target?.value;
    });
  }
  const msgInput = document.querySelector("input[type=text]");
  if (msgInput !== null) {
    msgInput.addEventListener("change", (event: any) => {
      msg = event?.target?.value;
    });
  }
};

export default main();
