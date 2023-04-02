let msg;

main();

function main() {
  const img = document.querySelector("img");
  if (img !== null) {
    img.addEventListener("click", function handleClick(event) {
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

  const colorInput = document.querySelector("input[type=color]");
  if (colorInput !== null) {
    const color = new URLSearchParams(location.href).get("c") || "black";
    colorInput.value = decodeURIComponent(color);
    colorInput.addEventListener("change", (event) => {
      color = event?.target?.value;
    });
  }

  const msgInput = document.querySelector("input[type=text]");
  if (msgInput !== null) {
    msgInput.addEventListener("change", (event) => {
      msg = event?.target?.value;
    });
  }
}
