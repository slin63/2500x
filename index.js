// Handle file uploads
const fileSelector = document.getElementById("fileUpload");
const fileSelectorForm = document.getElementById("file-upload-form");
fileSelector.addEventListener("change", (event) => {
    const uploadedImage = event.target.files[0];
    console.log(uploadedImage);
});
