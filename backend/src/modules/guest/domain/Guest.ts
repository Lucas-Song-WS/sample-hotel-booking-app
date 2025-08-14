import { GuestRegistered } from "./events/GuestRegistered";
import { Email } from "./value-objects/Email";
import { GuestIdNo } from "./value-objects/GuestIdNo";

export class Guest {
  private _events: any[] = [];

  constructor(
    private _guestSeq: number,
    private _username: string,
    private _passwordHash: string,
    private _idNo: GuestIdNo,
    private _name: string,
    private _email: Email
  ) {}

  static register(
    guestSeq: number,
    username: string,
    passwordHash: string,
    idNo: string,
    name: string,
    email: string
  ) {
    const emailObj = new Email(email);
    const guest = new Guest(
      guestSeq,
      username,
      passwordHash,
      new GuestIdNo(idNo),
      name,
      emailObj
    );

    guest.recordEvent(new GuestRegistered(guestSeq, name, emailObj));
    return guest;
  }

  private recordEvent(event: any) {
    this._events.push(event);
  }

  pullEvents() {
    const events = [...this._events];
    this._events = [];
    return events;
  }

  get guestSeq() {
    return this._guestSeq;
  }
  get email() {
    return this._email.value;
  }
  get idNo() {
    return this._idNo.value;
  }
  get username() {
    return this._username;
  }
  get name() {
    return this._name;
  }
}
