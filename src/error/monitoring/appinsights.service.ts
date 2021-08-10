import * as appInsightsLibrary from "applicationinsights";
import { isEqual, isUndefined, isNull } from "lodash";

class AppInsightsService {

  private appInsights = appInsightsLibrary;
  private nodeEnv: string = "production";
  private cloudRole: string = process.env.APPINSIGHTS_ROLE_NAME;

  /**
   * @description Application Insights configuration.
   */
  public appInsightsConfig(): void {
    try {
      if (isEqual(process.env.NODE_ENV, this.nodeEnv) && !isUndefined(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)) {
        this.appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
          .setAutoDependencyCorrelation(true)
          .setAutoCollectRequests(true)
          .setAutoCollectPerformance(true)
          .setAutoCollectExceptions(true)
          .setAutoCollectDependencies(true)
          .setAutoCollectConsole(true)
          .setUseDiskRetryCaching(true)
          .setSendLiveMetrics(true)
          .setUseDiskRetryCaching(true)
          .setDistributedTracingMode(this.appInsights.DistributedTracingModes.AI_AND_W3C);
        this.appInsightsRoleConfig();
        this.appInsights.start();        }
    } catch (error) {
        throw new Error(`Application Insights cannot be started. ${error}`);
    }
  }

  /**
   * @description Configures application insights role name displayed in Azure resource.
   */
  public appInsightsRoleConfig(): void {
    if (!isNull(this.cloudRole) && !isUndefined(this.cloudRole)) {
      this.appInsights.defaultClient.context.tags[this.appInsights.defaultClient.context.keys.cloudRole] = this.cloudRole;
    }
  }

  /**
   * @description Log events caught.
   * @param {string} name - Name of the event.
   * @param {dictionary} properties - Additional data used to filter events.
   * @param {dictionary} measurements - Additional metrics used to filter events.
   */
  public logEvent(name: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void {
    try {
      if (isEqual(process.env.NODE_ENV, this.nodeEnv) && !isUndefined(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)) {
        this.appInsights.defaultClient.trackEvent({ name, properties, measurements });
      }
    } catch (error) {
        throw new Error(`Application Insights event cannot be tracked. ${error}`);
    }
  }

  /**
   * @description Log exceptions caught.
   * @param {Error} exception - Error object.
   * @param {dictionary} properties - Additional data used to filter exceptions.
   * @param {number} severity - Severity of the exception.
   * @param {Date} time - Exception time stamp.
   */
  public logError(exception: Error, properties?: { [key: string]: any }, severity?: number, time?: Date): void {
    try {
      if (isEqual(process.env.NODE_ENV, this.nodeEnv) && !isUndefined(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)) {
        this.appInsights.defaultClient.trackException({ exception, properties, severity, time });
      }
    } catch (error) {
        throw new Error(`Application Insights error cannot be tracked. ${error}`);
    }
  }

  /**
   * @description Log custom metrics caught.
   * @param {string} name - Custom metric name.
   * @param {number} value - Custom metric value.
   * @param {dictionary} properties - Additional data used to filter custom metrics.
   */
  public logMetric(name: string, value?: number, properties?: { [key: string]: string }): void {
    try {
      if (isEqual(process.env.NODE_ENV, this.nodeEnv) && !isUndefined(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)) {
        this.appInsights.defaultClient.trackMetric({ name: name, value: value, properties: properties });
      }
    } catch (error) {
        throw new Error(`Application Insights metric cannot be tracked. ${error}`);
    }
  }
}

const appInsightsService = new AppInsightsService();
export default appInsightsService;
