import { test, expect } from '@playwright/test';
import { NarniaSocialNumberGenerator, ResidencyStatus } from '../helpers_narnia_task/NarniaSocialNumberGenerator';

test.describe('Narnia social number generator tests', () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    test('Generate valid social numbers for residents born between 1900-1999', () => {
        const firstSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(1900, 1, 1, 1, 1);
        console.log('Earliest resident social number in 1900:', firstSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(firstSocialNumber);

        const secondSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(1999, 12, 31, 52, 999);
        console.log('Latest resident social number in 1999:', secondSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(secondSocialNumber);

        const thirdSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(1925, 5, 25, 1, 1);
        console.log('Random resident social number between 1900-1999:', thirdSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(thirdSocialNumber);
    });

    test('Generate valid social numbers for residents born between 1800-1899', () => {
        const firstSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(1800, 1, 1, 1, 1);
        console.log('Earliest resident social number in 1800:', firstSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(firstSocialNumber)

        const secondSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(1899, 12, 31, 52, 999);
        console.log('Latest resident social number in 1899:', secondSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(secondSocialNumber);
    });

    test('Generate valid social numbers for residents born between 2000-2099', () => {
        const firstSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(2000, 1, 1, 1, 1);
        console.log('Earliest resident social number in 2000:', firstSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(firstSocialNumber)

        const secondSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(2099, 12, 31, 52, 999);
        console.log('Latest resident social number in 2099:', secondSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(secondSocialNumber);

        const thirdSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(currentYear, currentMonth, currentDay, 1, 1);
        console.log('Resident social number born today:', thirdSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(thirdSocialNumber);

        const fourthSocialNumber = NarniaSocialNumberGenerator.generateSocialNumber(2024, 2, 29, 1, 1);
        console.log('Resident social number in a leap year:', fourthSocialNumber);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(fourthSocialNumber);
    });

    test('Generate valid social numbers for foreigners and non-residents', () => {
        const socialNumberForeigner = NarniaSocialNumberGenerator.generateSocialNumber(1985, 7, 15, 1, 1, ResidencyStatus.Foreign);
        console.log('Foreign resident social number:', socialNumberForeigner);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(socialNumberForeigner);

        const socialNumberNonResident = NarniaSocialNumberGenerator.generateSocialNumber(1970, 1, 1, 1, 1, ResidencyStatus.NonResident);
        console.log('Non-resident social number:', socialNumberNonResident);
        NarniaSocialNumberGenerator.assertValidSocialNumberLength(socialNumberNonResident);
    });

    test(`Verify invalid social numbers throw exceptions`, () => {
        expect(() => NarniaSocialNumberGenerator.generateSocialNumber(2023, 2, 30, 1, 1)).toThrow();
        expect(() => NarniaSocialNumberGenerator.generateSocialNumber(2023, 1, 1, 0, 1)).toThrow();
        expect(() => NarniaSocialNumberGenerator.generateSocialNumber(1799, 1, 1, 1, 1)).toThrow();
        expect(() => NarniaSocialNumberGenerator.generateSocialNumber(2100, 1, 1, 1, 1)).toThrow();
        expect(() => NarniaSocialNumberGenerator.generateSocialNumber(1850, 1, 1, 1, 1000)).toThrow();
    });
});
