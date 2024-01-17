import { expect } from 'chai';
import { hasCommonElement, countCommonElements } from '@helpers/array.helper';

describe('ArrayHelper', () => {
    describe('countCommonElements', () => {
        it('Should return number of common elements between array and compare array', () => {
            let countNumberOfCommonElements = countCommonElements([30, 60, 90], [30, 70, 90, 110]);
            expect(countNumberOfCommonElements).to.be.an('number').equals(2);

            countNumberOfCommonElements = countCommonElements([7, 8, 9], [10, 11, 12]);
            expect(countNumberOfCommonElements).to.be.an('number').equals(0);

            countNumberOfCommonElements = countCommonElements([200, 400, 600], [600, 800, 1000]);
            expect(countNumberOfCommonElements).to.be.an('number').equals(1);

            countNumberOfCommonElements = countCommonElements([20, 40, 60], [20, 50, 60]);
            expect(countNumberOfCommonElements).to.be.an('number').equals(2);
        });
    });

    describe('hasCommonElement', () => {
        it('Should check if any element from the first array is present in the second array, returning true for a match and false otherwise', () => {
            let arrayHasCommonElement = hasCommonElement([15, 25], [55, 75, 95]);
            expect(arrayHasCommonElement).to.be.an('boolean').equals(false);

            arrayHasCommonElement = hasCommonElement([21, 22, 23], [23, 24, 25]);
            expect(arrayHasCommonElement).to.be.an('boolean').equals(true);

            arrayHasCommonElement = hasCommonElement([300, 500, 700], [800, 1000]);
            expect(arrayHasCommonElement).to.be.an('boolean').equals(false);
        });
    });
});
