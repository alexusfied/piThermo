const basePath = "http://raspberrypi.local/thermoApp.fcgi/";

export const api = {
  get: (endpoint: string) => fetch(`${basePath}/${endpoint}`),
};
