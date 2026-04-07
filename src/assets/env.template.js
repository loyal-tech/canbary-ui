(function (window) {
  window.env = window.env || {};

  // Environment variables

  window["env"]["APIGATEWAY_IP_PORT"] = "${APIGATEWAY_IP_PORT}";
  window["env"]["TACACS_IP_PORT"] = "${TACACS_IP_PORT}";
  window["env"]["OTP_GENERATE_USERNAME"] = "${OTP_GENERATE_USERNAME}";
  window["env"]["ADOPT_API_GATEWAY_COMMON_PORT"] = "${ADOPT_API_GATEWAY_COMMON_PORT}";

  window["env"]["TIMER_COUNT"] = "${TIMER_COUNT}";
  window["env"]["SERVICEAREA_ID"] = "${SERVICEAREA_ID}";
  window["env"]["COUNTRY_ID"] = "${COUNTRY_ID}";
  window["env"]["CITY_ID"] = "${CITY_ID}";
  window["env"]["STATE_ID"] = "${STATE_ID}";
  window["env"]["PINCODE_ID"] = "${PINCODE_ID}";
  window["env"]["AREA_ID"] = "${AREA_ID}";
  window["env"]["FOOTER"] = "${FOOTER}";
  window["env"]["TITLE"] = "${TITLE}";
  window["env"]["LOGIN_CAPTCHA"] = "${LOGIN_CAPTCHA}";
  window["env"]["INDEPENDENT_AAA"] = "${INDEPENDENT_AAA}";
  window["env"]["GOOGLE_MAPS_API_KEY"] = "${GOOGLE_MAPS_API_KEY}";
})(this);
