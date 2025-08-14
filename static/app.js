
const faceInput = document.getElementById('faceInput');
const facePreview = document.getElementById('facePreview');
const swapForm = document.getElementById('swapForm');
const resultDiv = document.getElementById('result');
const swapBtn = document.getElementById('swapBtn');
const retryBtn = document.getElementById('retryBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loader = document.getElementById('loader');

// Equation row elements
const equationRow = document.getElementById('equationRow');
const plusSign = document.getElementById('plusSign');
const equalsSign = document.getElementById('equalsSign');
const baseImgEq = document.getElementById('baseImgEq');
const swappedImgEq = document.getElementById('swappedImgEq');
const genBtnHolder = document.getElementById('genBtnHolder');
const genBtn = document.getElementById('genBtn');
const loadingHolder = document.getElementById('loadingHolder');




faceInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            facePreview.src = e.target.result;
            facePreview.style.display = 'block';
            // Show equation row with uploaded and base image
            equationRow.style.display = 'flex';
            plusSign.style.display = 'inline-block';
            baseImgEq.style.display = 'block';
            equalsSign.style.display = 'inline-block';
            swappedImgEq.style.display = 'none';
            // Show generate button in generated position
            if (genBtnHolder) genBtnHolder.style.display = 'flex';
            if (genBtn) genBtn.disabled = false;
            if (loadingHolder) loadingHolder.style.display = 'none';
        };
        reader.readAsDataURL(file);
        swapBtn.disabled = false;
        swapBtn.style.display = 'none';
        retryBtn.style.display = 'none';
        downloadBtn.style.display = 'none';
    } else {
        facePreview.style.display = 'none';
        swapBtn.disabled = true;
        swapBtn.style.display = 'none';
        retryBtn.style.display = 'none';
        downloadBtn.style.display = 'none';
        equationRow.style.display = 'none';
        if (genBtnHolder) genBtnHolder.style.display = 'none';
        if (loadingHolder) loadingHolder.style.display = 'none';
    }
});



// Intercept the equation row generate button
if (genBtn) {
    genBtn.addEventListener('click', function(e) {
        e.preventDefault();
        swapForm.dispatchEvent(new Event('submit', { cancelable: true }));
    });
}

swapForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    resultDiv.innerHTML = '';
    // Show loading in generated position, keep other images visible
    if (genBtnHolder) genBtnHolder.style.display = 'none';
    if (loadingHolder) loadingHolder.style.display = 'flex';
    if (swappedImgEq) swappedImgEq.style.display = 'none';
    swapBtn.disabled = true;
    swapBtn.style.display = 'none';
    retryBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
    loader.style.display = 'none';
    const file = faceInput.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch('/api/swap.jpeg', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Face swap failed');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        resultDiv.innerHTML = `<h3>Swapped Result:</h3>`;
        // Show equation row with all images and signs
        if (equationRow) {
            equationRow.style.display = 'flex';
            plusSign.style.display = 'inline-block';
            baseImgEq.style.display = 'block';
            equalsSign.style.display = 'inline-block';
            swappedImgEq.src = url;
            swappedImgEq.style.display = 'block';
            if (loadingHolder) loadingHolder.style.display = 'none';
        }
        downloadBtn.href = url;
        downloadBtn.style.display = 'inline-block';
        retryBtn.style.display = 'inline-block';
    } catch (err) {
        resultDiv.innerHTML = `<span style="color:red;">${err.message}</span>`;
        retryBtn.style.display = 'inline-block';
        if (loadingHolder) loadingHolder.style.display = 'none';
    } finally {
        swapBtn.disabled = false;
        swapBtn.style.display = 'none';
        loader.style.display = 'none';
    }
});

retryBtn.addEventListener('click', function() {
    faceInput.value = '';
    facePreview.style.display = 'none';
    resultDiv.innerHTML = '';
    retryBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
    swapBtn.disabled = true;
    swapBtn.style.display = 'none';
    if (equationRow) equationRow.style.display = 'none';
    if (genBtnHolder) genBtnHolder.style.display = 'none';
    if (loadingHolder) loadingHolder.style.display = 'none';
    faceInput.focus();
});
