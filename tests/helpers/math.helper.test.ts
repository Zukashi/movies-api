import { expect } from 'chai';
import { getRandomIntNumber, isNumberInRange } from '@helpers/math.helper';

describe('MathHelper', () => {
    describe('getRandomIntNumber', () => {
        it('Generates a random integer within a specified range, inclusive', () => {
            let randomNumber = getRandomIntNumber(20, 60);
            expect(randomNumber).to.be.a('number').within(20, 60);

            randomNumber = getRandomIntNumber(3, 9);
            expect(randomNumber).to.be.a('number').within(3, 9);

            randomNumber = getRandomIntNumber(150, 300);
            expect(randomNumber).to.be.a('number').within(150, 300);
        });
    });

    describe('isNumberInRange', () => {
        it('Checks if a specified number falls within a defined range', () => {
            let numberInRange = isNumberInRange(-30, 5, 30);
            expect(numberInRange).to.be.a('boolean').equal(false);

            numberInRange = isNumberInRange(8, 5, 10);
            expect(numberInRange).to.be.a('boolean').equal(true);

            numberInRange = isNumberInRange(200, 150, 250);
            expect(numberInRange).to.be.a('boolean').equal(true);
        });
    });
});
