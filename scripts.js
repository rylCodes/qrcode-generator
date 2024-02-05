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
const customizeQr = document.querySelector('#customize-qr');
const uploadedImage = document.querySelector('#uploadedImage');

// Input elements
const qrText = document.getElementById("qr-text");
const longURL = document.getElementById('input-url');
const aliasText = document.getElementById('input-alias');
const imageUploadInput = document.getElementById('imageUploadInput');

let dotsColor;
let squareCorderColor;
let isCustomizing = false;
let qrLogo = '';

let copyQrCode;
let downloadQrCode;

const dotOptionsColor = Pickr.create({
    el: '#dotOptionsColor',
    theme: 'nano', // You can choose a different theme
    default: '#0000ff', // Default color
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true,
        },
    },
});

const squareCorderOptionsColor = Pickr.create({
    el: '#squareCorderOptionsColor',
    theme: 'nano', // You can choose a different theme
    default: '#0000ff', // Default color
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true,
        },
    },
});

dotOptionsColor.on('change', (color, instance) => {
    isCustomizing = true;
    dotsColor = color.toHEXA().toString();
    displayTextQrCode();
});

squareCorderOptionsColor.on('change', (color, instance) => {
    isCustomizing = true;
    squareCorderColor = color.toHEXA().toString();
    displayTextQrCode();
});

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
        width: 350,
        height: 350,
        margin: 4,
        type: 'svg',
        data: value,
        image: qrLogo? qrLogo: null,
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 4,
        },
        dotsOptions: {
            color: dotsColor? dotsColor: '#000000',
        },
        cornersSquareOptions: {
            color: squareCorderColor? squareCorderColor: '#000000',
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

    copyBtn.removeEventListener('click', copyQrCode);
    downloadBtn.removeEventListener('click', downloadQrCode);

    copyQrCode = () => {
        alert("Unfortunately, this feature isn't ready for use.")
    }

    downloadQrCode = () => {
        downloadBtn.disabled = true;

        if (value.includes('http')) {
            const splitValue = value.split('/');
            qr.download({ name: splitValue, extension: "png" });
        } else {
            qr.download({ name: value, extension: "png" });
        }

        setTimeout(() => {
            downloadBtn.disabled = false;
        }, 100);
    }

    copyBtn.addEventListener('click', copyQrCode);
    downloadBtn.addEventListener('click', downloadQrCode);

    if (!isCustomizing) {
        Toastify({
            text: `Your QR Code successfully generated`,
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top", // 'top' or 'bottom'
            position: 'center', // 'left', 'right', 'center'
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
    }

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
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
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
                    background: "linear-gradient(to right, #FF1744, #FF8C00)",
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
            background: "linear-gradient(to right, #00b09b, #96c93d)",
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
    toggleCustomizeQr();
}

function handleClearUrlInput() {
    removeInputValue(longURL, clearUrlIcon);
    toggleCustomizeQr();
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

function toggleCustomizeQr() {
    if (qrText.value.trim() === '') {
        customizeQr.classList.add('hidden');
        return;
    };

    customizeQr.classList.toggle('hidden');
}

function readFile(element) {
    if (element.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // Create a canvas element
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set the canvas dimensions to the image dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0);

                // Convert the canvas content back to a data URL with reduced quality
                const compressedDataURL = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality as needed

                uploadedImage.setAttribute('src', compressedDataURL);
                uploadedImage.classList.remove('hidden');
                qrLogo = compressedDataURL;
                displayTextQrCode();
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(element.files[0]);
    }
}

qrText.addEventListener("input", () => showClearIcon(qrText, clearTextIcon));
longURL.addEventListener("input", () => showClearIcon(longURL, clearUrlIcon));
aliasText.addEventListener("input", () => showClearIcon(aliasText, clearAliasIcon));