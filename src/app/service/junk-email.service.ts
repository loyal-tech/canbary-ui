import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class JunkEmailService {
  constructor(private http: HttpClient) {}

  EMAIL_BASE_URL = RadiusConstants.ADOPT_TICKET_MANAGEMENT + "/mailservice";

  getMethod(url) {
    return this.http.get(this.EMAIL_BASE_URL + url);
  }

  postMethod(url, data) {
    return this.http.post(this.EMAIL_BASE_URL + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(this.EMAIL_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(this.EMAIL_BASE_URL + url, data);
  }
}
