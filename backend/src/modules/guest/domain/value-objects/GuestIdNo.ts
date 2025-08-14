export class GuestIdNo {
  constructor(public readonly value: string) {
    if (!GuestIdNo.validate(value)) throw new Error("Invalid ID number");
  }

  static validate(id: string): boolean {
    return id.length > 0 && id.length <= 20;
  }
}
