const noQRtoShow = document.querySelector('.noQRtoShow');
let isQRGenerated = false;

if (isQRGenerated) {
    if (!noQRtoShow.classList.contains('hidden')) {
        noQRtoShow.classList.add('hidden');
    };
} else {
    noQRtoShow.classList.remove('hidden');
};

function generateQR(value) {
    const qrText = document.getElementById("qr-text").value;
    if (!qrText && !value) {
        alert("Please enter text or URL to generate QR code.");
        return;
    };

    const qrCodeDiv = document.getElementById("qr-code");
    qrCodeDiv.innerHTML = "";

    const qr = new QRCode(qrCodeDiv, {
        text: qrText? qrText : value,
        width: 300,
        height: 300
    });

    // Handle QR code generation error
    if (!qr) {
        noQRtoShow.classList.remove('hidden');
        alert("Failed to generate QR code.");
        return;
    } else {
        if (!noQRtoShow.classList.contains('hidden')) {
            noQRtoShow.classList.add('hidden');
        };
    };

    // Convert QR code to image and create download link
    const qrCodeImage = qrCodeDiv.querySelector('img');
    const downloadLink = document.getElementById('download-link');

    qrCodeImage.onload = function() {
        const canvas = document.createElement('canvas');
        const padding = 20; // Adjust padding value as needed
        canvas.width = qrCodeImage.naturalWidth + 2 * padding;
        canvas.height = qrCodeImage.naturalHeight + 2 * padding;
        const ctx = canvas.getContext('2d');
        
        // Fill canvas with a background color (optional)
        ctx.fillStyle = '#ffffff'; // White background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code onto the canvas with padding
        ctx.drawImage(qrCodeImage, padding, padding);
        
        // Convert the canvas to a data URL in JPEG format and set as href for download link
        downloadLink.href = canvas.toDataURL('image/jpeg');
        downloadLink.style.display = 'block';

        document.getElementById("qr-text").value = "";
    };
}

async function shortenURL() {
    const longURL = document.getElementById('inputURL').value;
    const urlActions = document.querySelector('.url-actions');

    if (!longURL) {
        alert("Please enter URL");
        return;
    };

    // Replace 'YOUR_API_TOKEN' with your actual TinyURL API token
    const apiKey = 'p8I2naR1jXkqBmBVi8YPQ7bjiKJPH3CHmw7RbpTnCkjeKhLJ0SWxjMHgOOwI';
    const apiUrl = 'https://api.tinyurl.com/create';

    try {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: longURL })
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById('shortenedURL').innerHTML = `<a id="newTinyUrl" href="${data.data.tiny_url}">${data.data.tiny_url}</a>`;
        urlActions.classList.remove('hidden');
        document.getElementById('inputURL').value = "";
    } else {
        document.getElementById('shortenedURL').innerHTML = `Error: ${data.errors}`;
        if (!urlActions.classList.contains('hidden')) {
            urlActions.classList.add('hidden');
        };
    };
    } catch (error) {
    document.getElementById('shortenedURL').innerHTML = `Error: ${error.message}`;
    };
}

function copyToClipboard() {
    const copyText = document.getElementById("shortenedURL");
    const textArea = document.createElement("textarea");

    // Set the text content to be copied to the clipboard
    textArea.value = copyText.textContent;

    // Append the textarea element to the document
    document.body.appendChild(textArea);

    // Select the text content within the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand("copy");

    // Remove the textarea element after copying
    document.body.removeChild(textArea);

    // Alert the user or provide feedback (optional)
    alert("Copied to clipboard: " + copyText.textContent);
}

function getTinurlQrCode() {
    let hrefValue;
    const newTinyUrl = document.getElementById('newTinyUrl');
    console.log(typeof newTinyUrl)
    if (newTinyUrl) {
        hrefValue = newTinyUrl.getAttribute('href');
        console.log(hrefValue)
        if (hrefValue) {
            generateQR(hrefValue);
        };
    };
}
  