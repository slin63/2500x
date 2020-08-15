const MAX_DIMENSION = 600;

// Handle file uploads
const fileSelector = document.getElementById("fileUpload");
const fileSelectorForm = document.getElementById("file-upload-form");
const fileSelectorLabel = document.getElementById("custom-file-label");
const checkForms = document.getElementsByClassName("form-check-input");

// Other junk
const knobsForm = document.getElementById("image-manipulation-form");
const pitchCards = document.getElementById("pitch-cards");
const canvasDump = document.getElementById("twofiveoo");
const headerHr = document.getElementById("header-hr");
const reportDiv = document.getElementById("report");

// Handle the checkbox disclaimers above the upload image form
Array.prototype.map.call(checkForms, (form) => {
    form.addEventListener("change", (event) => {
        if (checkHasConsent()) {
            fileSelector.removeAttribute("disabled");
            fileSelectorLabel.innerHTML = "Upload an image";
        } else {
            fileSelector.setAttribute("disabled", "true");
            fileSelectorLabel.innerHTML = "Sign disclaimer first.";
        }
    });
});

fileSelector.addEventListener("input", (event) => {
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

        const htmlOut = create2500xImage(canvas);
        canvasDump.innerHTML = htmlOut;

        // Report new file size and dimensions
        const fileSize = htmlOut.length / 1024.0; /* kb */
        const fileSizeChange = htmlOut.length / uploadedImage.size; /* kb */
        const pCount = canvas.height * canvas.width;
        const divCount = canvas.height;

        const report = `<p><b>${fileSizeChange
            .toFixed(2)
            .toLocaleString()}</b> times larger. <b>${pCount.toLocaleString()}</b> <code>&lt;p&gt;</code> tags. <b>Infinitely more powerful.</b></p>`;
        reportDiv.style.display = "flex";
        reportDiv.innerHTML = report;

        canvasDump.style.visibility = "visible";
        headerHr.style.display = "none";
        getCSSRule(".twofiveoo").style.display = "block";

        knobsForm.style.display = "flex";
        pitchCards.innerHTML = "";
        canvasDump.classList.add("sneakattack");
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
const flexWrapSelect = document.getElementById("flex-wrap-select");
const horizontalPaddingSelect = document.getElementById("horizontalPadding");
const verticalPaddingSelect = document.getElementById("verticalPadding");
const horizontalMarginSelect = document.getElementById("horizontalMargin");
const verticalMarginSelect = document.getElementById("verticalMargin");

justifyContentSelect.addEventListener("change", (event) => {
    getCSSRule(".twofiveoo.sneakattack div").style["justify-content"] =
        event.target.value;
});

flexDirectionSelect.addEventListener("change", (event) => {
    getCSSRule(".twofiveoo.sneakattack div").style["flex-direction"] =
        event.target.value;
});

flexWrapSelect.addEventListener("change", (event) => {
    getCSSRule(".twofiveoo.sneakattack div").style["flex-wrap"] =
        event.target.value;
});

const JCR = getCSSRule(".twofiveoo.sneakattack div > p");
horizontalPaddingSelect.addEventListener("change", (event) => {
    JCR.style["padding-left"] = toPx(event.target.value);
    JCR.style["padding-right"] = toPx(event.target.value);
});
verticalPaddingSelect.addEventListener("change", (event) => {
    JCR.style["padding-bottom"] = toPx(event.target.value);
    JCR.style["padding-top"] = toPx(event.target.value);
});
horizontalMarginSelect.addEventListener("change", (event) => {
    JCR.style["margin-left"] = toPx(event.target.value);
    JCR.style["margin-right"] = toPx(event.target.value);
});
verticalMarginSelect.addEventListener("change", (event) => {
    JCR.style["margin-bottom"] = toPx(event.target.value);
    JCR.style["margin-top"] = toPx(event.target.value);
});

const toPx = (number) => {
    return `${number}px`;
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

const checkHasConsent = () => {
    let hasConsent = true;
    Array.prototype.map.call(checkForms, (form) => {
        hasConsent = hasConsent && form.checked;
    });
    return hasConsent;
};
