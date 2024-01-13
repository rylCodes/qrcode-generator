// Input elements
const qrText = document.getElementById("qr-text");
const longURL = document.getElementById('input-url');
const aliasText = document.getElementById('input-alias');

const qrTextContainer = document.querySelector(".qr-text");
const noQRtoShow = document.querySelector('.temp-div');
const urlActions = document.querySelector('.url-actions');
const closeIcon = document.querySelector('span.close-icon');
const clearTextIcon = document.querySelector('span.close-icon.for-text');
const clearUrlIcon = document.querySelector('span.close-icon.for-url');
const clearAliasIcon = document.querySelector('span.close-icon.for-alias');
const copyIcon = document.querySelector('span.copy-icon');
const cssLoader = document.querySelector(".css-loader");

async function generateQR(value) {
    cssLoader.style.display = "flex";
    if (!value) {
        alert("Please enter text or URL to generate QR code.");
        cssLoader.style.display = "none";
        return;
    };

    const qrCodeDiv = document.getElementById("qr-code");
    qrCodeDiv.innerHTML = "";

    const qr = await new QRCode(qrCodeDiv, {
        text: value,
        width: 300,
        height: 300
    });

    // Handle QR code generation error
    if (!qr) {
        noQRtoShow.classList.remove('hidden');
        cssLoader.style.display = "none";
        alert("Failed to generate QR code.");
        return;
    } else {
        noQRtoShow.classList.add('hidden');
        cssLoader.style.display = "none";
    };
    
    // Convert QR code to image and create download link
    const qrCodeImage = qrCodeDiv.querySelector('img');
    const downloadLink = document.getElementById('download-link');
    const canvas = document.createElement('canvas');

    if (qrCodeImage) {
        async function handleQrCodeImage() {
            qrCodeImage.onload = () => {
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

                // Download as PNG
                if (value.includes('http')) {
                    const splitValue = value.split('/');
                    downloadLink.setAttribute('download', `${splitValue.pop()}.jpg`);
                } else {
                    downloadLink.setAttribute('download', `${value}.jpg`);
                };

                downloadLink.classList.remove('hidden');       
            };
        }

        await handleQrCodeImage();

        if (qrTextContainer) {
            qrTextContainer.textContent = value;
        };

        Toastify({
            text: `Your QR Code successfully generated`,
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top", // 'top' or 'bottom'
            position: 'center', // 'left', 'right', 'center'
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)", // Use your preferred color
            },
        }).showToast();
    };
}

async function shortenURL() {
    if (!longURL.value) {
        alert("Please enter URL");
        return;
    };

    // Replace 'YOUR_API_TOKEN' with your actual TinyURL API token
    const apiKey = 'p8I2naR1jXkqBmBVi8YPQ7bjiKJPH3CHmw7RbpTnCkjeKhLJ0SWxjMHgOOwI';
    const apiUrl = 'https://api.tinyurl.com/create';

    try {
        cssLoader.style.display = "flex";
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: longURL.value,
                alias: aliasText.value? aliasText.value.trim() : null,
            })
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            document.getElementById('shortenedURL').innerHTML = `
                <a id="newTinyUrl" target="_blank" href="${data.data.tiny_url}">${data.data.tiny_url}
                </a>`;

            urlActions.classList.remove('hidden');
            copyIcon.style.display = "block";
            cssLoader.style.display = "none";

            Toastify({
                text: `URL successfully shortened: ${data.data.tiny_url}`,
                duration: 5000,
                newWindow: true,
                close: true,
                gravity: "top", // 'top' or 'bottom'
                position: 'center', // 'left', 'right', 'center'
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)", // Use your preferred color
                },
            }).showToast();
        } else {
            document.getElementById('shortenedURL').innerHTML = `<p class="text-red">Error: ${data.errors}</p>`;
            if (!urlActions.classList.contains('hidden')) {
                urlActions.classList.add('hidden');
            };

            cssLoader.style.display = "none";

            Toastify({
                text: `Error: ${data.errors}`,
                duration: 5000,
                newWindow: true,
                close: true,
                gravity: "top", // 'top' or 'bottom'
                position: 'center', // 'left', 'right', 'center'
                style: {
                    background: "linear-gradient(to right, #e53935, #b71c1c)", // Use your preferred color
                },
            }).showToast();
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
    Toastify({
        text: `Copied to clipboard: ${copyText.textContent}`,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top", // 'top' or 'bottom'
        position: 'center', // 'left', 'right', 'center'
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)", // Use your preferred color
        },
    }).showToast();
}

function displayTextQrCode() {
    generateQR(qrText.value);
}

function displayTinyurlQrCode() {
    let hrefValue;
    const newTinyUrl = document.getElementById('newTinyUrl');

    if (newTinyUrl) {
        hrefValue = newTinyUrl.getAttribute('href');
        console.log(hrefValue)
        if (hrefValue) {
            generateQR(hrefValue);
        };
    };
}

function removeInputValue(element, icon) {
    element.value = "";
    icon.style.display = "none";
}

function handleClearTextInput() {
    removeInputValue(qrText, clearTextIcon);
}

function handleClearUrlInput() {
    removeInputValue(longURL, clearUrlIcon);
}

function handleClearAliasInput() {
    removeInputValue(aliasText, clearAliasIcon);
}

function showClearIcon(input, icon) {
    if (input.value.trim() !== "") {
        icon.style.display = 'block';
    } else {
        icon.style.display = 'none';
    };
}

qrText.addEventListener("input", () => showClearIcon(qrText, clearTextIcon));
longURL.addEventListener("input", () => showClearIcon(longURL, clearUrlIcon));
aliasText.addEventListener("input", () => showClearIcon(aliasText, clearAliasIcon));