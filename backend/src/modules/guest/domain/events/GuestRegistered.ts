import { Email } from "../value-objects/Email";

export class GuestRegistered {
  constructor(
    public readonly guestSeq: number,
    public readonly name: string,
    public readonly email: Email
  ) {}
}
