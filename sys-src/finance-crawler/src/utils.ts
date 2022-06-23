
function padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
}

function formatDate(date: Date): string {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth()),
            padTo2Digits(date.getDate()),
        ]

    ).join('-')
};

function verifyTicker(ticker: string): boolean {

    // check if ticker exists
    if (!ticker) {
        return false
    }
    if (ticker.length >= 5) {
        return false
    }
    if (ticker.length < 3) {
        return false
    }

    return true
}

export { formatDate, verifyTicker, padTo2Digits };