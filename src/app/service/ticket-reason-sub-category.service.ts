import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class TicketReasonSubCategoryService {

  constructor(private http: HttpClient) { }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url, data);
  }
}
