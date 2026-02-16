import { ErrorHandler, inject, Injectable } from "@angular/core";
import { Logger } from "./common/logger";

@Injectable({providedIn: 'root'})
export class LoggingErrorHandler implements ErrorHandler {
    readonly logger = inject(Logger);
    handleError(error: any): void {
        this.logger.log(`[ERROR] ${error}\n\t${(error as Error).stack}`);
    }

}