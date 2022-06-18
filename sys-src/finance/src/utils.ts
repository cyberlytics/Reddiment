import { stringify } from "querystring";

function padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
}

function formatDate(date: Date): string {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ]

    ).join('-')
};

function verifyTicker(ticker: string): boolean {

    if (ticker.length >= 5) {
        return false
    }
    if (ticker.length < 3) {
        return true
    }

    return true
}

export { formatDate, verifyTicker };