import * as insights from "applicationinsights";
import { config } from "dotenv";
import { isEqual, isUndefined } from "lodash";

config();

export const applicationInsigthsConfiguration = () => {
    const appInsights = insights;
    const insightsConditions = !isUndefined(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    && isEqual(process.env.NODE_ENV, "production");
    if (insightsConditions) {
        appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(true)
        .start();
    }
}