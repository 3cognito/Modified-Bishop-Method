// Get references to the download and upload buttons
const downloadButton = document.getElementById("download-button");
const uploadButton = document.getElementById("upload-button");

// Add a click event listener to the download button
downloadButton.addEventListener("click", () => {
  fetch("https://bishop-2i7r.onrender.com/api/v1/download-template")
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "template.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
      alert("An error occurred while downloading the file. Please try again later.");
    });
});

const fileInput = document.getElementById("file-input");

// Add a click event listener to the upload button
uploadButton.addEventListener("click", () => {
  // Trigger the file input when the upload button is clicked
  fileInput.click();
});

// Add an event listener to the file input to handle the selected file
fileInput.addEventListener("change", () => {
  const formData = new FormData();
  const fileInput = document.getElementById("file-input"); // Replace with the actual ID of your file input element
  formData.append("file", fileInput.files[0]);

  // Replace 'your-upload-api-url' with the actual URL for uploading the file
  fetch("https://bishop-2i7r.onrender.com/api/v1/solve", {
    method: "POST",
    body: formData, // Send the FormData object
  })
    .then((response) => {
      //   console.log(response.blob());
      if (response.status === 200) {
        return response.json(); // Assuming the response is JSON
      } else {
        throw new Error("File upload failed");
      }
    })
    .then((data) => {
      console.log(data);
      // Display the result in the result box
      const resultBox = document.getElementById("result-box");
      resultBox.textContent = `Result: ${data.FactorOfSafety}`; // Adjust the response structure as needed
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      // You can display an error message or handle the error as needed
      const resultBox = document.getElementById("result-box");
      resultBox.textContent = "Error: File upload failed";
    });
});
