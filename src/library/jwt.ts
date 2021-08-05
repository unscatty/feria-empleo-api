import * as jwt from "jsonwebtoken";

export class JWT {

    constructor() {}

    public static sign(data: string): string {
        return jwt.sign(data, process.env.JWT_SECRET);
    }
}