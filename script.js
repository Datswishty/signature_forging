document.getElementById('abiInput').addEventListener('input', function() {
    const abiText = this.value;
    try {
        const abi = JSON.parse(abiText);
        const signatures = getCustomErrorSignatures(abi);
        displaySignatures(signatures);
    } catch (e) {
        document.getElementById('signaturesOutput').innerText = 'Invalid ABI';
    }
});

function getCustomErrorSignatures(abi) {
    const signatures = {};

    abi.forEach(entry => {
        if (entry.type === 'error') {
            const name = entry.name;
            const params = entry.inputs.map(input => input.type).join(',');
            const signature = `${name}(${params})`;
            const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature));
            const hashHex = hash.substring(0, 10); // First 4 bytes of the hash, in hex
            signatures[signature] = hashHex;
        }
    });

    return signatures;
}

function displaySignatures(signatures) {
    const outputDiv = document.getElementById('signaturesOutput');
    outputDiv.innerHTML = ''; // Clear the current content

    // Add the COPY button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'COPY';
    copyBtn.classList.add('copy-btn');
    copyBtn.onclick = copySignaturesToClipboard; // Function to copy text
    outputDiv.appendChild(copyBtn);

    // Create a <pre> element to display JSON
    const pre = document.createElement('pre');
    pre.style.overflowX = 'auto'; // Ensure long JSON strings are scrollable horizontally

    const jsonString = JSON.stringify(signatures, null, 2);
    pre.innerText = jsonString;
    outputDiv.appendChild(pre);
}

function copySignaturesToClipboard() {
    const outputDiv = document.getElementById('signaturesOutput');
    const textToCopy = outputDiv.querySelector('pre').innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Optional: Show a brief message confirming the copy action
        alert('Copied to clipboard!');
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

