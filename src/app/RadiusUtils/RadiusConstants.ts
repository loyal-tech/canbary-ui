import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

const apigatewayCommonIp_PORT = environment.ADOPT_API_GATEWAY_COMMON_PORT;
const apigatewayIP_PORT = environment.APIGATEWAY_IP_PORT;
const tacacsManagement_PORT = environment.TACACS_IP_PORT;
const username_generateOTP = environment.OTP_GENERATE_USERNAME;

export const SERVICEAREA_ID = environment.SERVICEAREA_ID;
export const COUNTRY_ID = environment.COUNTRY_ID;
export const CITY_ID = environment.CITY_ID;
export const STATE_ID = environment.STATE_ID;
export const PINCODE_ID = environment.PINCODE_ID;
export const AREA_ID = environment.AREA_ID;
export const TITLE = environment.TITLE;
export const FOOTER = environment.FOOTER;
export const LOGIN_CAPTCHA = environment.LOGIN_CAPTCHA;
export const INDPENDENT_AAA = environment.INDEPENDENT_AAA;
export const GOOGLE_MAPS_API_KEY = environment.GOOGLE_MAPS_API_KEY;
export const TIMER_COUNT = environment.TIMER_COUNT;
const hostName: any = localStorage.getItem("hostName");
//Constants for Adopt Radius.
export const DELETE_GROUP_CONFIRM_MESSAGE = "Are you sure you want to delete this group?";
export const DELETE_CLIENT_CONFIRM_MESSAGE = "Are you sure you want to delete this client?";
export const DELETE_CUSTOMER_CONFIRM_MESSAGE = "Are you sure you want to delete this customer?";
export const DELETE_CONFIRM_MESSAGE = (str: String) =>
  `Are you sure you want to delete this ${str}?`;

export const USERNAME = `${username_generateOTP}`;
export const DEMOGRAPHICDATA: any = JSON.parse(localStorage.getItem("demographic"));
export var COUNTRY = "Country";
export var DEPARMENT = "Department";
export var STATE = "State";
export var CITY = "City";
export var LOCATION = "Location";
export var PINCODE = "Pincode";
export var AREA = "Area";
export var MVNO = "MVNO";
export var PROFILE = "Profile";
export var REGEX = "Number";
export var STREET = "Street Name";
export var HOUSENO = "House No";
export var CUSTOMER_PREPAID = "Prepaid Customer";
export var CUSTOMER_POSTPAID = "Postpaid Customer";
export var CUSTOMER_VRN = "Customer VAT Registration Number";
export var CUSTOMER_NID = "Customer National Identification";
export var ADDRESS = "Address";
export var SUBAREA = "Subarea";
export var BUILDING = "Building";
export var BuildingConfig = "Building Config";
export var KNOWLEDGEBASE = "Knowldege Base";
export var SCHEDULARMANAGEMENT = "Schedular ";
export var CHILDMANAGEMENT = "Child Management";
export var SECRETKEY = "howtotrainyourdragon";

function updateValues(DEMOGRAPHICDATA) {
  if (Array.isArray(DEMOGRAPHICDATA)) {
    DEMOGRAPHICDATA.forEach(item => {
      switch (item.currentName) {
        case "Country":
          COUNTRY = item.newName || COUNTRY;
          break;
        case "State":
          STATE = item.newName || STATE;
          break;
        case "City":
          CITY = item.newName || CITY;
          break;
        case "Pincode":
          PINCODE = item.newName || PINCODE;
          break;
        case "Area":
          AREA = item.newName || AREA;
          break;
        case "MVNO":
          MVNO = item.newName || MVNO;
          break;
        case "Number":
          REGEX = item.validationRegex || REGEX;
          break;
        case "Prepaid Customer":
          CUSTOMER_PREPAID = item.newName || CUSTOMER_PREPAID;
          break;
        case "Postpaid Customer":
          CUSTOMER_POSTPAID = item.newName || CUSTOMER_POSTPAID;
          break;
        case "Customer VAT Registration Number":
          CUSTOMER_VRN = item.newName || CUSTOMER_VRN;
          break;
        case "Customer National Identification":
          CUSTOMER_NID = item.newName || CUSTOMER_NID;
          break;
        case "Address":
          ADDRESS = item.newName || ADDRESS;
          break;
        case "Sub Area":
          SUBAREA = item.newName || SUBAREA;
          break;
        case "Building":
          BUILDING = item.newName || BUILDING;
          break;
        case "Department":
          DEPARMENT = item.newName || DEPARMENT;
          break;
      }
    });
  }
}

if (Array.isArray(DEMOGRAPHICDATA)) {
  updateValues(DEMOGRAPHICDATA);
}

export function masterdata(data) {
  updateValues(data);
}
export const ADOPT_COMMON_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/cms`;
export const ADOPT_PRODUCT_MANAGEMENT_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/cms`;
export const ADOPT_SUBSCRIBER_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/cms/portal/subscriber`;
export const PMS_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/pms`;
export const ADOPT_RADIUS_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/AdoptRadius`;
export const ADOPT_NOTIFICATION_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/AdoptNotification`;
export const ADOPT_SERVICE_MANAGER_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/service-manager`;
export const ADOPT_ENRICHMENT_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/enrichment`;
export const ADOPT_REVENUE_MANAGEMENT_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/Revenue`;
export const ADOPT_PAYMENT_RECEIPT_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/Revenue`;
export const ADOPT_LEAD_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/AdoptSalesCrmsBss`;
export const ADOPT_PREPAID_REJECT_REASON_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/cms/caf`;
export const ADOPT_TASK_MGMT_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/AdoptTaskMgmt`;
export const ADOPT_INTEGRATION_SYSTEM_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/AdoptIntegrationSystem`;
export const ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${tacacsManagement_PORT}/tacacs-management/v1/api`;
export const ADOPT_PRODUCT_MANAGEMENT_BASE_URL_TEMPLATE_APIS = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}`;
export const ADOPT_KPI_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/KpiManagement`;
export const ADOPT_INVENTORY_MANAGEMENT_BASE_URL = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/AdoptInventoryManagement`;

export const ADOPT_TICKET_MANAGEMENT = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/TicketManagement`;

/*Uncomment this one when checking the new api gateway*/
export const ADOPT_API_GATEWAY_COMMON_MANAGEMENT = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/AdoptApiGateWayCommon`;

export const ADOPT_API_GATEWAY_NETCONF_CUSTOMER = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/AdoptNetConfManagement`;
export const ADOPT_TASK_MANAGEMENT = `${
  apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayCommonIp_PORT}/api/v1/TaskManagement`;
export const ADOPT_PAY = `${
  apigatewayIP_PORT.startsWith("https://") || apigatewayIP_PORT.startsWith("http://")
    ? ""
    : "http://"
}${apigatewayIP_PORT}`;
export const HEADER = new HttpHeaders()
  .set("content-type", "application/json")
  .set("authorization", "Basic YWRtaW46YWRtaW4xMjM=")
  .set("Access-Control-Allow-Origin", "*")
  .set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE,OPTIONS");

export const CONFIRM_DIALOG_TITLE = "Record Delete Confirmation";
export const ACTIVE = "Active";
export const IN_ACTIVE = "Inactive";
//Used in pagination
export const ITEMS_PER_PAGE = 5;
export const PER_PAGE_ITEMS = 20;
export const SUPERADMINID = "1";

export const getHeaders = { headers: HEADER };
export const pageLimitOptions = [
  { value: 5 },
  { value: 10 },
  { value: 20 },
  { value: 50 },
  { value: 100 }
];
export const SUPER_ADMIN_MVNO = 1;
export const CUSTOMER_STATUS = {
  ACTIVE: "Active",
  NEW_ACTIVATION: "NewActivation"
};
export const CUSTOMER_TYPE = {
  PREPAID: "Prepaid",
  POSTPAID: "Postpaid"
};
export const status = [
  { label: "Active", value: "Y", val: "ACTIVE" },
  { label: "Inactive", value: "N", val: "INACTIVE" }
];

export const isTwoFactorEnabled = [
  { label: "true", value: "true", val: "true" },
  { label: "false", value: "false", val: "false" }
];
export const TAT_CONSIDERATION_TICKET = {
  ASSIGN: "Assignment",
  CREATION: "Creation"
};
export const billingType = [
  { label: "Monthly", value: "1", val: "Monthly" },
  { label: "Bi-Monthly", value: "2", val: "Bi-Monthly" }
];
