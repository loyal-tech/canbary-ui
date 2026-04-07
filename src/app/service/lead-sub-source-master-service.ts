import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { FormGroup } from '@angular/forms';
import { LeadSource } from '../components/model/leadSource';

@Injectable({
    providedIn: 'root'
})
export class LeadSubSourceMasterService {

    constructor(private http: HttpClient) { }

    getMethod(url) {
        return this.http.get(RadiusConstants.ADOPT_LEAD_SOURCE_BASE_URL + url);
    }

    postMethod(url, data) {
        return this.http.post(RadiusConstants.ADOPT_LEAD_SOURCE_BASE_URL + url, data);
    }

    deleteMethod(url) {
        return this.http.delete(RadiusConstants.ADOPT_LEAD_SOURCE_BASE_URL + url);
    }

    updateMethod(url, data) {
        return this.http.put(RadiusConstants.ADOPT_LEAD_SOURCE_BASE_URL + url, data);
    }
}
