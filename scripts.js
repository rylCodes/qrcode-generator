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
const imageMargin = document.querySelector('#imageMargin');
const dotOptionsStyle = document.querySelector('#dotOptionsStyle');
const cornersSquareOptionsStyle = document.querySelector('#cornersSquareOptionsStyle');
const cornersDotOptionsStyle = document.querySelector('#cornersDotOptionsStyle');
const backgroundDots = document.querySelector('#backgroundDots');
const backgroundDotsSpan = document.querySelector('.backgroundDots');

// Input elements
const qrText = document.getElementById("qr-text");
const longURL = document.getElementById('input-url');
const aliasText = document.getElementById('input-alias');
const imageUploadInput = document.getElementById('imageUploadInput');

let backgroundColor;
let dotsColor;
let cornersSquareColor;
let cornersDotColor;
let isCustomizing = false;
let qrLogo;
let logoMargin;
let isBackgroundDotsHidden = true;
let dotStyle;
let cornersSquareStyle;
let cornersDotStyle;

let downloadQrCode;

const backgroundColorPickr = Pickr.create({
    el: '#backgroundColor',
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

const dotOptionsColorPickr = Pickr.create({
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

const cornersSquareColorPickr = Pickr.create({
    el: '#cornersSquareColorElem',
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

const cornersDotColorPickr = Pickr.create({
    el: '#cornersDotColorElem',
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

backgroundColorPickr.on('change', (color, instance) => {
    isCustomizing = true;
    backgroundColor = color.toHEXA().toString();
    displayTextQrCode();
});

dotOptionsColorPickr.on('change', (color, instance) => {
    isCustomizing = true;
    dotsColor = color.toHEXA().toString();
    displayTextQrCode();
});

cornersSquareColorPickr.on('change', (color, instance) => {
    isCustomizing = true;
    cornersSquareColor = color.toHEXA().toString();
    displayTextQrCode();
});

cornersDotColorPickr.on('change', (color, instance) => {
    isCustomizing = true;
    cornersDotColor = color.toHEXA().toString();
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
        width: 300,
        height: 300,
        margin: 4,
        type: 'svg',
        data: value,
        image: qrLogo? qrLogo: null,
        backgroundOptions: {
            color: backgroundColor? backgroundColor: '#fff',
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: logoMargin? logoMargin: 0,
            imageSize: 0.4,
            hideBackgroundDots: isBackgroundDotsHidden,
        },
        dotsOptions: {
            color: dotsColor? dotsColor: '#000',
            type: dotStyle? dotStyle: 'square', 
        },
        cornersSquareOptions: {
            color: cornersSquareColor? cornersSquareColor: '#000',
            type: cornersSquareStyle? cornersSquareStyle: null,
        },
        cornersDotOptions: {
            color: cornersDotColor? cornersDotColor: '#000',
            type: cornersDotStyle? cornersDotStyle: null,
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

    if (downloadQrCode) {
        downloadBtn.removeEventListener('click', downloadQrCode);
    };

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

function copyTextToClipboard(value) {
    const textArea = document.createElement("textarea");
    textArea.value = shortenedURL.textContent;
    document.body.appendChild(textArea);
    textArea.select();

    document.execCommand("copy");
    document.body.removeChild(textArea);

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

function copyImageToClipboard(value) {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    document.body.appendChild(textArea);
    textArea.select();

    document.execCommand("copy");
    document.body.removeChild(textArea);

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
    if (qrText.value.trim() === '' && longURL.value.trim() === '' ) {        
        customizeQr.classList.add('hidden');
        customizeQr.classList.remove('flex');
        return;
    };

    customizeQr.classList.toggle('hidden');
    customizeQr.classList.toggle('flex');
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
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                const compressedDataURL = canvas.toDataURL('image/png', 0.5); // Adjust quality as needed

                // uploadedImage.setAttribute('src', compressedDataURL);
                // uploadedImage.classList.remove('hidden');
                isCustomizing = true;
                qrLogo = compressedDataURL;
                displayTextQrCode();
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(element.files[0]);
    }
}

function removeImage() {
    isCustomizing = true;
    qrLogo = '';
    imageUploadInput.value = '';
    displayTextQrCode();
}

function handleImageMargin() {
    isCustomizing = true;
    logoMargin = imageMargin.value;
    displayTextQrCode();
}

function handleHideBackgroundDots() {
    isCustomizing = true;
    isBackgroundDotsHidden = backgroundDots.checked;
    displayTextQrCode();
}

function handleDotStyle() {
    isCustomizing = true;
    dotStyle = dotOptionsStyle.value;
    displayTextQrCode();
}

function handleCornersSquareStyle() {
    isCustomizing = true;
    cornersSquareStyle = cornersSquareOptionsStyle.value;
    displayTextQrCode();
}

function handleCornersDotStyle() {
    isCustomizing = true;
    cornersDotStyle = cornersDotOptionsStyle.value;
    displayTextQrCode();
}

qrText.addEventListener("input", () => showClearIcon(qrText, clearTextIcon));
longURL.addEventListener("input", () => showClearIcon(longURL, clearUrlIcon));
aliasText.addEventListener("input", () => showClearIcon(aliasText, clearAliasIcon));