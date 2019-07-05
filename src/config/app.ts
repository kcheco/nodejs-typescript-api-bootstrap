export interface IApplicationConfig {
  cacheEnabled?: boolean;
  corsEnabled?: boolean;
  databaseEnabled?: boolean;
  logsEnabled?: boolean;
  websocketEnabled?: boolean;
}

export const applicationConfig: IApplicationConfig = {
  cacheEnabled: false,
  corsEnabled: false,
  databaseEnabled: true,
  logsEnabled: true,
  websocketEnabled: false,
};
