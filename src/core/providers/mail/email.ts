import { IEmail } from '../../../shared/interfaces/email.interface';

/**
 *
 *
 * @export
 * @class Email
 */
export class Email {
  private _server: string;
  private _from: string;
  private _to: string;
  private _header: string;
  private _message: string;
  private _password: string;

  /**
   *Creates an instance of Email.
   * @param {IEmail} mail
   * @memberof Email
   */
  constructor(mail: IEmail) {
    this._server = mail.server;
    this._from = mail.from;
    this._to = mail.to;
    this._header = mail.header;
    this._message = mail.message;
    this._password = mail.password;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof Email
   */
  get server(): string {
    return this._server;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof Email
   */
  get from(): string {
    return this._from;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof Email
   */
  get to(): string {
    return this._to;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof Email
   */
  get header(): string {
    return this._header;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof Email
   */
  get message(): string {
    return this._message;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof Email
   */
  get password(): string {
    return this._password;
  }
}
