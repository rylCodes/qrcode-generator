const qrTextContainer = document.querySelector(".qr-text");
const noQRtoShow = document.querySelector('.temp-div');
const shortenedURL = document.querySelector('.shortenedURL');
const shortenedUrlDiv = document.querySelector('.shortened-url-div')
const closeIcon = document.querySelector('span.clear-icon');
const clearTextIcon = document.querySelector('span.clear-icon.for-text');
const clearUrlIcon = document.querySelector('span.clear-icon.for-url');
const clearAliasIcon = document.querySelector('span.clear-icon.for-alias');
const copyIcon = document.querySelector('span.copy-icon');
const cssLoader = document.querySelector(".css-loader");

// Input elements
const qrText = document.getElementById("qr-text");
const longURL = document.getElementById('input-url');
const aliasText = document.getElementById('input-alias');

async function generateQR(value) {
    cssLoader.style.display = "flex";
    if (!value) {
        alert("Please enter text or URL to generate QR code.");
        cssLoader.style.display = "none";
        return;
    };

    const qrCodeDiv = document.getElementById("qr-code");
    qrCodeDiv.innerHTML = "";

    const qr = await new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg',
        data: value,
        image: 'img/qrlink-logo.png',
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 8,
        }
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
    
    qr.append(qrCodeDiv);

    if (qrTextContainer) {
        qrTextContainer.textContent = value;
    };
    
    // Convert QR code to image and create download link
    const qrCodeImage = qrCodeDiv.querySelector('img');
    const qrCodeActions = document.querySelector('.qrcode-actions');
    const copyBtn = document.querySelector('.copy-qrcode');
    const downloadBtn = document.querySelector('.download-qrcode');

    qrCodeActions.classList.remove('hidden'); 
    qrCodeActions.classList.add('flex'); 
    console.log(qrCodeImage);

    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            alert("Unfortunately, this feature isn't ready for use.")
        });
    }

    if(downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (value.includes('http')) {
                const splitValue = value.split('/');
                qr.download({ name: splitValue, extension: "png" });
            } else {
                qr.download({ name: value, extension: "png" });
            };
        });
    }

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
            shortenedUrlDiv.classList.remove('hidden');
            shortenedURL.innerHTML = `
                <a id="newTinyUrl" target="_blank" href="${data.data.tiny_url}">${data.data.tiny_url}
                </a>`;

            copyIcon.style.display = "block";
            cssLoader.style.display = "none";

            Toastify({
                text: `Your URL successfully shortened`,
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
            shortenedURL.innerHTML = `<p class="text-red">Error: ${data.errors}</p>`;
            if (!shortenedUrlDiv.classList.contains('hidden')) {
                shortenedUrlDiv.classList.add('hidden');
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
                    background: "linear-gradient(to right, #FF1744, #FF8C00)", // Use your preferred color
                },
            }).showToast();
        };
    } catch (error) {
        cssLoader.style.display = "none";
        shortenedURL.innerHTML = `Error: ${error.message}`;
    };
}

function copyToClipboard() {
    const textArea = document.createElement("textarea");

    // Set the text content to be copied to the clipboard
    textArea.value = shortenedURL.textContent;

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
        text: `Copied to clipboard`,
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