import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class TaskManagementService {
    httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    constructor(private http: HttpClient) { }

    getMethod(url) {
        return this.http.get(RadiusConstants.ADOPT_TASK_MANAGEMENT + url);
    }

    postMethod(url, data) {
        return this.http.post(RadiusConstants.ADOPT_TASK_MANAGEMENT + url, data);
    }

    deleteMethod(url) {
        return this.http.delete(RadiusConstants.ADOPT_TASK_MANAGEMENT + url);
    }

    updateMethod(url, data) {
        return this.http.put(RadiusConstants.ADOPT_TASK_MANAGEMENT + url, data);
    }

    assignMethod(url, formData) {
        return this.http.post(RadiusConstants.ADOPT_TASK_MANAGEMENT + url, formData);
    }
    downloadFile(url): Observable<any> {
        return this.http.get(RadiusConstants.ADOPT_TASK_MANAGEMENT + url, {
            responseType: "blob",
            headers: this.httpOptions.headers
        });
    }

    postFullMethod(url) {
        return this.http.get(RadiusConstants.ADOPT_TASK_MANAGEMENT + url);
    }

    getTeamFromStaffList(url) {
        return this.http.get(RadiusConstants.ADOPT_TASK_MANAGEMENT + url);
    }

    getTeamAll(url) {
        return this.http.get(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url);
    }

    downloadResolveFile(ticketId, uniquename, section): Observable<any> {
        const get_url = RadiusConstants.ADOPT_TASK_MANAGEMENT + "/case/document/download/" + ticketId + "/" + uniquename + "/" + section + "/";
        return this.http.get(get_url, {
            observe: 'response',
            responseType: 'blob' as 'json',
            headers: this.httpOptions.headers,
        });
    }
}
