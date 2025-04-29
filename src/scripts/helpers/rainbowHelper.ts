setInterval(rainbow, 1000)
function rainbow() {
    const toColor = document.querySelectorAll('.rainbow');
    if (toColor.length > 0) {
        toColor.forEach((el) => {
            (el as HTMLElement).style.color = getRandomColor();
        });
    } else {
        console.log("No elements to rainbow.");
    }
}


function getRandomColor() {
    let charset = "89ABCDEF"
    let color = "#"
    for (var i = 0; i<6; i++) {
        color += charset[Math.floor(Math.random() * charset.length)]
    }
    return color
}

