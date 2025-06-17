setInterval(rainbow, 500);
function rainbow() {
  const toColor = document.querySelectorAll(".rainbow");
  if (toColor.length > 0) {
    toColor.forEach((el) => {
      (el as HTMLElement).style.color = getRandomColor();
    });
  } else {
    //Shitty hack, but i honestly cannot be bothered to figure out a dynamic way to fix it.
    //And yes... we are unfortunately hard coding an element here.
    const namelbl = document.getElementById("caseName") as HTMLHeadingElement;
    namelbl.style.color = "#FFF";
    return;
  }
}

function getRandomColor() {
  let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

  return colors[Math.floor(Math.random() * colors.length)];
}
