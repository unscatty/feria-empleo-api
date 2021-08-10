import appInsightsService from "./appinsights.service";

class AppInsightsErrorMonitoringService {

  /**
   * @description Monitorig api errors on express, create a log error and an event.
   * @param {Error} error - Error object.
   */
  public monitorigError(error: Error, properties: { [key: string]: any }): void {
    appInsightsService.logEvent("Error", properties);
    properties["name"] = error.name;
    properties["stack"] = error.stack;
    properties["message"] = error.message;
    appInsightsService.logError(error, properties);
  }
}

const appInsightsErrorMonitoringService = new AppInsightsErrorMonitoringService();
export default appInsightsErrorMonitoringService;
