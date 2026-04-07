import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;
  baseUrlForNetConf = RadiusConstants.ADOPT_API_GATEWAY_NETCONF_CUSTOMER;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  userId = localStorage.getItem("userId");

  getCustomerById(customerId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customerById?custid=` + customerId + `&mvnoId=${this.mvnoId}`
    );
  }

  getAll(page, size) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customers?mvnoId=${this.mvnoId}&staffId=${this.userId}&page=${page}&size=${size}`
    );
  }

  getNetConfCustomer(page, size) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrlForNetConf}/customer/customers?mvnoId=${this.mvnoId}&staffId=${this.userId}&page=${page}&size=${size}`
    );
  }

  getAllCDRsForExport(username, fromDate, toDate) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/exportExcel?mvnoId=${this.mvnoId}&userName=` +
        encodeURIComponent(username) +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }

  getCustomerByName(page, size, customerName) {
    // return this.http.get(
    //   `${this.baseUrl}/customerByName?mvnoId=${this.mvnoId}&userName=` +
    //   encodeURIComponent(customerName)
    // );
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customerByName?mvnoId=${this.mvnoId}&name=` +
        encodeURIComponent(customerName) +
        "&page=" +
        page +
        "&size=" +
        size
    );
  }

  getMacAddressMappings(customerId, mvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findMacAddressMappingByCustomerId?customerId=${customerId}&mvnoId=${this.mvnoId}`
    );
  }

  getCustomerAttributes(customerId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customerReplyByCustId?custId=${customerId}&mvnoId=${this.mvnoId}`
    );
  }
  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  saveIps(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  getAllIps(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  deleteIps(url) {
    return this.http.delete(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  updateIps(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  saveMacs(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  getAllMacs(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  updateMacs(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  deleteMacs(url) {
    return this.http.delete(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
}
