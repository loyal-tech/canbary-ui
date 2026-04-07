import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class ProxyServerService {
  constructor(private http: HttpClient) {}
  baseUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  getById(serverId, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.get(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${selectedMvnoId}`);
    // else
    return this.http.get(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${this.mvnoId}`);
  }

  // getAll() {
  //   return this.http.get(
  //     `${this.baseUrl}/proxyserver/all?mvnoId=${this.mvnoId}`
  //   );
  // }

  getAll(page, size, name) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // return this.http.get(
    //   `${this.baseUrl}/proxyserver/getAllProxyServer?mvnoId=${this.mvnoId}&page=${page}&size=${size}&name=` +
    //     encodeURIComponent(name)
    // );
    if (name) {
      return this.http.get(`${this.baseUrl}/proxyserver/name/` + name + `?mvnoId=${this.mvnoId}`);
    } else {
      return this.http.get(`${this.baseUrl}/proxyserver/all?mvnoId=${this.mvnoId}`);
    }
  }

  findActiveProxyServer() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/proxyserver/findActiveProxyServer` + "?mvnoId=" + this.mvnoId
    );
  }

  delete(serverId: number, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.delete(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${selectedMvnoId}`);
    // else
    return this.http.delete(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${this.mvnoId}`);
  }

  getByName(serverName: string, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.get(
    //     `${this.baseUrl}/proxyserver/name/` +
    //       encodeURIComponent(serverName) +
    //       `?mvnoId=${selectedMvnoId}`
    //   );
    // else
    return this.http.get(
      `${this.baseUrl}/proxyserver/name/` +
        encodeURIComponent(serverName) +
        `?mvnoId=${this.mvnoId}`
    );
  }

  add(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.post(`${this.baseUrl}/proxyserver?mvnoId=${data.mvnoId}`, data);
    // else
    return this.http.post(`${this.baseUrl}/proxyserver?mvnoId=${this.mvnoId}`, data);
  }

  update(serverId, data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.put(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${data.mvnoId}`, data);
    // else
    return this.http.put(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${this.mvnoId}`, data);
  }

  changeSatus(id, status, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.get(
    //     `${this.baseUrl}/proxyserver/updateStatus?id=${id}&status=${status}&mvnoId=${selectedMvnoId}` +
    //       "&lastModifiedBy=" +
    //       this.loggedInUser
    //   );
    // else
    return this.http.get(
      `${this.baseUrl}/proxyserver/updateStatus?id=${id}&status=${status}&mvnoId=${this.mvnoId}` +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }
}
