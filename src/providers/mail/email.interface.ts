/**
 *
 *
 * @interface IEmail
 */
 export interface IEmail {
    server: string;
    from: string;
    to: string;
    header: string;
    message: string;
    password: string;
}
