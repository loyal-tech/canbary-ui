// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APIGATEWAY_IP_PORT: window["env"]["APIGATEWAY_IP_PORT"] || "localhost:30085",
  TACACS_IP_PORT: window["env"]["TACACS_IP_PORT"] || "localhost:30081",

  ADOPT_API_GATEWAY_COMMON_PORT:
    window["env"]["ADOPT_API_GATEWAY_COMMON_PORT"] || "localhost:30080",

  OTP_GENERATE_USERNAME: window["env"]["OTP_GENERATE_USERNAME"] || "OTP",
  TIMER_COUNT: window["env"]["TIMER_COUNT"] || "10",
  SERVICEAREA_ID: window["env"]["SERVICEAREA_ID"] || "5",
  COUNTRY_ID: window["env"]["COUNTRY_ID"] || "2",
  CITY_ID: window["env"]["CITY_ID"] || "2",
  STATE_ID: window["env"]["STATE_ID"] || "2",
  PINCODE_ID: window["env"]["PINCODE_ID"] || "2",
  AREA_ID: window["env"]["AREA_ID"] || "2",
  FOOTER: window["env"]["FOOTER"] || "Adopt Nettech",
  TITLE: window["env"]["TITLE"] || "Adopt Converge BSS",
  LOGIN_CAPTCHA: window["env"]["LOGIN_CAPTCHA"] || "true",
  INDEPENDENT_AAA: window["env"]["INDEPENDENT_AAA"] || "false",
  GOOGLE_MAPS_API_KEY:
    window["env"]["GOOGLE_MAPS_API_KEY"] || "AIzaSyBJMMItJT9bMQlbJK8RnXhHi5rLrICje0s"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
