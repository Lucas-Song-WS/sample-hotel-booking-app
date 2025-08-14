export class Email {
  constructor(public readonly value: string) {
    if (!Email.validate(value)) throw new Error("Invalid email address");
  }

  static validate(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
