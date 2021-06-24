import { winstonLog } from "./winston.config";

export class CustomLogs {

    public static logError(error: Error): void {
        winstonLog.error(error.stack);        
    }

    public static logSilly(message: string): void {
        winstonLog.silly(message);
    }

    public static logInfo(message: string): void {
        winstonLog.info(message);
    }
}