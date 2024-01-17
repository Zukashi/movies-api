export function hasCommonElement<T>(array: T[], compareArray: T[]): boolean {
    const compareSet = new Set(compareArray);
    return array.some((value) => compareSet.has(value));
}

export function countCommonElements<T>(array: T[], compareArray: T[]): number {
    const compareSet = new Set(compareArray);
    return array.filter((value) => compareSet.has(value)).length;
}
