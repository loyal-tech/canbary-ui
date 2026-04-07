import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class RadiusClientService {
  baseUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;
  baseUrlForNetConf = RadiusConstants.ADOPT_API_GATEWAY_NETCONF_CUSTOMER;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}

  getClientDataByIp(clientIp) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findClientByIpAddress?mvnoId=${this.mvnoId}&ipAddress=` +
        encodeURIComponent(clientIp)
    );
  }

  getAllCustomerr(page, size, data) {
    return this.http.post(
      `${this.baseUrl}/customers/search?mvnoId=${this.mvnoId}&page=${page}&size=${size}`,
      data
    );
  }

  getAllNetConfCustomer(page, size, data) {
    return this.http.post(
      `${this.baseUrlForNetConf}/customer/customers/search?mvnoId=${this.mvnoId}&page=${page}&size=${size}`,
      data
    );
  }

  getClientDataById(clientId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findClientById?mvnoId=${this.mvnoId}&clientId=` + clientId
    );
  }

  findAllClientData(page, size, clientIpAddress) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/clients?mvnoId=${this.mvnoId}&page=${page}&size=${size}&clientIpAddress=${clientIpAddress}`
    );
  }

  addNewClient(data, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.post(`${this.baseUrl}/addClient?mvnoId=${selectedMvnoId}`, data);
    // else
    return this.http.post(`${this.baseUrl}/addClient?mvnoId=${this.mvnoId}`, data);
  }

  updateClient(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.put(`${this.baseUrl}/updateClient?mvnoId=${data.mvnoId}`, data);
    // else
    return this.http.put(`${this.baseUrl}/updateClient?mvnoId=${this.mvnoId}`, data);
  }

  deleteClientById(clientId, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.delete(
    //     `${this.baseUrl}/deleteClient?mvnoId=${selectedMvnoId}&clientId=` + clientId
    //   );
    // else
    return this.http.delete(
      `${this.baseUrl}/deleteClient?mvnoId=${this.mvnoId}&clientId=` + clientId
    );
  }

  getAllClientGroups() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/clientGroups?mvnoId=${this.mvnoId}`);
  }

  getAllValidClientGroups() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/validGroups?mvnoId=${this.mvnoId}`);
  }

  getAllIPname() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/ippool/getAll?mvnoId=${this.mvnoId}`);
  }

  getAVailableIPname() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/ippool/getAvailable?mvnoId=${this.mvnoId}`);
  }

  findAllClientList() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/all/clients?mvnoId=${this.mvnoId}`);
  }
}
