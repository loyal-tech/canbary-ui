import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Observable } from "rxjs";
const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
    providedIn: "root",
})
export class CustomerInventoryManagementService {
    constructor(private http: HttpClient) { }

    getMethod(url) {
        return this.http.get(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
    }

    postMethod(url, data) {
        return this.http.post(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
    }

    deleteMethod(url) {
        return this.http.delete(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
    }

    updateMethod(url, data) {
        return this.http.put(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
    }

    downloadFile(inventoryId, uniquename, section): Observable<any> {
        const get_url = RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + "/inwards/inventory/document/download/" + inventoryId + "/" + uniquename + "/" + section + "/";
        return this.http.get(get_url, {
            observe: 'response',
            responseType: 'blob' as 'json',
            headers: httpOptions.headers,
        });
    }
}
