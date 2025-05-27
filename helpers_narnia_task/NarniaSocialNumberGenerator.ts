import { expect } from "@playwright/test";

export enum ResidencyStatus {
    Domestic,
    Foreign,
    NonResident
}

export class NarniaSocialNumberGenerator {
    private static readonly MULTIPLICATION_FACTOR = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];

    private static padZerosAtStart(number: number, numberWidth: number): string {
        return number.toString().padStart(numberWidth, '0');
    }

    private static generateRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private static isValidDate(year: number, month: number, day: number): boolean {
        const parsedDate = new Date(year, month - 1, day);
        return (
            parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getDate() === day
        );
    }

    private static calculateControlDigit(socialNumberBase: string): number {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum = sum + Number(socialNumberBase.charAt(i)) * NarniaSocialNumberGenerator.MULTIPLICATION_FACTOR[i];
        }
        const remainder = sum % 11;
        return remainder === 10 ? 1 : remainder;
    }

    private static generateResidencyDigit(residencyStatus: ResidencyStatus, birthYear: number): number {
        switch (residencyStatus) {
            case ResidencyStatus.Domestic:
                if (birthYear >= 1900 && birthYear <= 1999) return NarniaSocialNumberGenerator.generateRandomInt(1, 2);
                if (birthYear >= 1800 && birthYear <= 1899) return NarniaSocialNumberGenerator.generateRandomInt(3, 4);
                if (birthYear >= 2000 && birthYear <= 2099) return NarniaSocialNumberGenerator.generateRandomInt(5, 6);
                throw new Error('Birth year is out of valid range for domestic residents');
            case ResidencyStatus.Foreign:
                return NarniaSocialNumberGenerator.generateRandomInt(7, 8);
            case ResidencyStatus.NonResident:
                return 9;
            default:
                throw new Error('Invalid residency status');
        }
    }

    public static generateSocialNumber(
        birthYear: number,
        birthMonth: number,
        birthDay: number,
        areaCode: number,
        orderNumber: number,
        residencyStatus: ResidencyStatus = ResidencyStatus.Domestic): string {
        if (!NarniaSocialNumberGenerator.isValidDate(birthYear, birthMonth, birthDay)) {
            throw new Error(`Invalid birth date: ${birthYear}-${birthMonth}-${birthDay}`);
        }
        if (areaCode < 1 || areaCode > 52) {
            throw new Error('Area code must be between 1 and 52');
        }
        if (orderNumber < 1 || orderNumber > 999) {
            throw new Error('Order number must be between 1 and 999');
        }

        const residencyDigit = NarniaSocialNumberGenerator.generateResidencyDigit(residencyStatus, birthYear);
        const yearDigits = NarniaSocialNumberGenerator.padZerosAtStart(birthYear % 100, 2);
        const monthDigits = NarniaSocialNumberGenerator.padZerosAtStart(birthMonth, 2);
        const dayDigits = NarniaSocialNumberGenerator.padZerosAtStart(birthDay, 2);
        const areaDigits = NarniaSocialNumberGenerator.padZerosAtStart(areaCode, 2);
        const orderNumberDigits = NarniaSocialNumberGenerator.padZerosAtStart(orderNumber, 3);

        const socialNumberBase = `${residencyDigit}${yearDigits}${monthDigits}${dayDigits}${areaDigits}${orderNumberDigits}`;
        const controlDigit = NarniaSocialNumberGenerator.calculateControlDigit(socialNumberBase);
        const socialNumber = `${socialNumberBase}${controlDigit}`;

        if (socialNumber.length !== 13) {
            throw new Error(`Social number unexpected length: ${socialNumber.length}`);
        }

        return socialNumber;
    }

    public static assertValidSocialNumberLength(socialNumber: string): void {
        expect(socialNumber).toHaveLength(13);
    }
}