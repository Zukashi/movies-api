export function getRandomIntNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor((max - min + 1) * Math.random() + min);
}

export function isNumberInRange(number: number, min: number, max: number): boolean {
    return number >= min && number <= max;
}
