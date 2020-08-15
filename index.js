const MAX_DIMENSION = 600;

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
    fileSelectorForm.innerHTML = "";
    pitchCards.innerHTML = `
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>`;

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

        knobsForm.style.display = "flex";
        pitchCards.innerHTML = "";
        canvasDump.classList.add("sneakattack");
        test();
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

// Knobs -----------------------------------------------
const justifyContentSelect = document.getElementById("justify-content-select");
const flexDirectionSelect = document.getElementById("flex-direction-select");
const horizontalPaddingSelect = document.getElementById("horizontalPadding");
const verticalPaddingSelect = document.getElementById("verticalPadding");
const horizontalMarginSelect = document.getElementById("horizontalMargin");
const verticalMarginSelect = document.getElementById("verticalMargin");

justifyContentSelect.addEventListener("change", (event) => {
    const jcr = getCSSRule(".twofiveoo.sneakattack div");
    jcr.style["justify-content"] = event.target.value;

    console.log("set justify-content to: ", event.target.value, jcr.style["justify-content"]);

    jcr.style["justify-content"] = event.target.value;

    debugger;
});

flexDirectionSelect.addEventListener("change", (event) => {
    const jcr = getCSSRule(".twofiveoo.sneakattack div");
    jcr.style["flex-direction"] = event.target.value;
});

const test = () => {
    console.log(justifyContentSelect.value);
    console.log(flexDirectionSelect.value);
    console.log(horizontalPaddingSelect.value);
    console.log(verticalPaddingSelect.value);
    console.log(horizontalMarginSelect.value);
    console.log(verticalMarginSelect.value);
};

// https://stackoverflow.com/questions/1409225/changing-a-css-rule-set-from-javascript
function getCSSRule(ruleName) {
    ruleName = ruleName.toLowerCase();
    var result = null;
    var find = Array.prototype.find;

    find.call(document.styleSheets, (styleSheet) => {
        result = find.call(styleSheet.cssRules, (cssRule) => {
            return (
                cssRule instanceof CSSStyleRule &&
                cssRule.selectorText.toLowerCase() == ruleName
            );
        });
        return result != null;
    });
    return result;
}
