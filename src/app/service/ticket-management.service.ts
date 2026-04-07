import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class TicketManagementService {
    httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };

    constructor(private http: HttpClient) { }

    getMethod(url) {
        return this.http.get(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url);
    }

    postMethod(url, data) {
        return this.http.post(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url, data);
    }

    assignMethod(url, formData) {
        return this.http.post(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url, formData);
    }

    deleteMethod(url) {
        return this.http.delete(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url);
    }

    updateMethod(url, data) {
        return this.http.put(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url, data);
    }

    downloadFile(url): Observable<any> {
        return this.http.get(RadiusConstants.ADOPT_TICKET_MANAGEMENT + url, {
            responseType: "blob",
            headers: this.httpOptions.headers,
        });
    }

    downloadResolveFile(ticketId, uniquename, section): Observable<any> {
        const get_url = RadiusConstants.ADOPT_TICKET_MANAGEMENT + "/case/document/download/" + ticketId + "/" + uniquename + "/" + section + "/";
        return this.http.get(get_url, {
            observe: 'response',
            responseType: 'blob' as 'json',
            headers: this.httpOptions.headers,
        });
    }

    getCutomerTicketData(url) {
        return this.http.get(RadiusConstants.ADOPT_TICKET_MANAGEMENT + "/case" + url);
    }
}
