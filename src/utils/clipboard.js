export function copyToClipboard(text, showOK, showFail) {
    navigator.clipboard
    .writeText(text)
    .then(() => showOK())
    .catch((err) => {
        console.log(err);
        showFail();
    });
}
