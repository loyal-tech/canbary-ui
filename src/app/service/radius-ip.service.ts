import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class RadiusIpService {
  mvnoId = localStorage.getItem("mvnoId");
  baseUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;

  constructor(private http: HttpClient) {}

  postMethod(url, data) {
    return this.http.post(this.baseUrl + url, data);
  }

  getMethod(url, data) {
    return this.http.get(this.baseUrl + url, data);
  }

  findIpPoolById(url) {
    return this.http.get(this.baseUrl + url);
  }

  getIpData(poolId: number, ipAddress: string, size: number, page: number) {
    const mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/ippool/allocation/search?mvnoId=${mvnoId}&poolId=${poolId}&size=${size}&page=${page}`
    );
  }

  searchByIp(poolId, ipAddress, size, page) {
    const mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/ippool/allocation/getByIp?mvnoId=${mvnoId}&poolId=${poolId}&ipAddress=${ipAddress}&size=${size}&page=${page}`
    );
  }
}
