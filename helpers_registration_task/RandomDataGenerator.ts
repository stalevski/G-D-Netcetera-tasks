export class RandomDataGenerator {
    private static randomNumber(min = 0, max = Number.MAX_SAFE_INTEGER): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private static randomChar(chars: string): string {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }

    public static randomEmailAddress(): string {
        const domainChars = 'abcdefghijklmnopqrstuvwxyz';
        const emailChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';

        const localLength = this.randomNumber(8, 13);
        const domainLength = this.randomNumber(4, 7);

        const localPart = Array.from({ length: localLength }, () => this.randomChar(emailChars)).join('');
        const domain = Array.from({ length: domainLength }, () => this.randomChar(domainChars)).join('');

        return `${localPart}@${domain}.com`;
    }

    public static randomAlphaNumericString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => this.randomChar(chars)).join('');
    }
}