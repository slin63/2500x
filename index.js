const MAX_DIMENSION = 800;

// Handle file uploads
const fileSelector = document.getElementById("fileUpload");
const fileSelectorForm = document.getElementById("file-upload-form");
const knobsForm = document.getElementById("image-manipulation-form");
const pitchCards = document.getElementById("pitch-cards");
const canvasDump = document.getElementById("twofiveoo");

fileSelector.addEventListener("input", (event) => {
    console.log("upload event fired!");
    const uploadedImage = event.target.files[0];
    const imagePath = URL.createObjectURL(uploadedImage);
    const imageObject = new Image();
    const canvas = document.createElement("canvas");
    // Collapse pitch cards
        fileSelectorForm.innerHTML = '';
    pitchCards.innerHTML = ''

    // Draw image onto canvas once the image finishes loading
    imageObject.onload = function () {
        // Must set dimensions before drawing object
        canvas.width =
            imageObject.width < MAX_DIMENSION
                ? imageObject.width
                : MAX_DIMENSION;
        canvas.height =
            imageObject.height < MAX_DIMENSION
                ? imageObject.height
                : MAX_DIMENSION;
        canvas.getContext("2d").drawImage(imageObject, 0, 0);

        canvasDump.innerHTML = create2500xImage(canvas);

        canvasDump.style.visibility = "visible";
        knobsForm.style.visibility = "visible";
        pitchCards.innerHTML = ""
        canvasDump.classList.add("sneakattack");
        canvasDump.innerHTML = beautifulImage;
    };
    imageObject.src = imagePath;
});

// Create html text for 2500x image
const create2500xImage = (canvas) => {
    var htmlOut = "";
    const imageData = canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        var row = "";
        for (let x = 0; x < canvas.width; x++) {
            const color = getPixelXY(imageData, x, y);
            row += `<p style='color:rgb(${color[0]},${color[1]},${color[2]})'>.</p>`;
        }
        htmlOut += `<div>${row}</div>`;
    }

    console.log(`File size: ${htmlOut.length} bytes`);
    return htmlOut;
};

// https://stackoverflow.com/questions/667045/getpixel-from-html-canvas
function getPixelXY(imageData, x, y) {
    return getPixel(imageData, y * imageData.width + x);
}
function getPixel(imgData, index) {
    var i = index * 4,
        d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]]; // returns array [R,G,B,A]
}
