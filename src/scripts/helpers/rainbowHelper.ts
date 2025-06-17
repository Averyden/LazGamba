setInterval(rainbow, 500);
function rainbow() {
  const toColor = document.querySelectorAll(".rainbow");
  if (toColor.length > 0) {
    toColor.forEach((el) => {
      (el as HTMLElement).style.color = getRandomColor();
    });
  } else {
    return;
  }
}

function getRandomColor() {
  let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

  return colors[Math.floor(Math.random() * colors.length)];
}
