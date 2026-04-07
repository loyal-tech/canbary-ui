import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { Observable } from 'rxjs';
const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})

export class ResolutionTaskMasterService {
    

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

    downloadFile(resolutionBaseId, uniquename): Observable<any> {
        const get_url = RadiusConstants.ADOPT_TASK_MANAGEMENT + "/resolutionReasons/downloadfile/" + resolutionBaseId + "/" + uniquename;
        return this.http.get(get_url, {
            observe: 'response',
            responseType: 'blob' as 'json',
            headers: httpOptions.headers,
        });
    }
}
