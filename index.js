// Handle file uploads
const fileSelector = document.getElementById("fileUpload");
const fileSelectorForm = document.getElementById("file-upload-form");
fileSelector.addEventListener("change", (event) => {
    const uploadedImage = event.target.files[0];
    const imagePath = URL.createObjectURL(uploadedImage);
    const imageObject = new Image();
    const canvas = document.createElement("canvas");

    // Draw image onto canvas once the image finishes loading
    imageObject.onload = function () {
        canvas.getContext("2d").drawImage(imageObject, 0, 0);
        document.body.appendChild(imageObject);
        console.log(uploadedImage);

    canvas.width = imageObject.width;
    canvas.height = imageObject.height;
        create2500xImage(canvas);
    };
    imageObject.src = imagePath;
});

// Create html text for 2500x image
const create2500xImage = (canvas) => {
    var htmlOut = "";
    const imageData = canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.width; y++) {
        var row = "";
        for (let x = 0; x < canvas.height; x++) {
            const color = getPixelXY(imageData, x, y);
            row += `<p style='color:rgb(${color[0]},${color[1]},${color[2]})'>.</p>`;
        }
    }

    htmlOut += `<div>${row}</div>`;

    // console.log(htmlOut.length); /* the file size in bytes */
    console.log(canvas);
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
