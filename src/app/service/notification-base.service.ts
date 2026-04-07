import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as ReadiusConstant from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class NotificationBaseService {

  constructor(private http: HttpClient) { }

  get(path: string) {
    return this.http.get(ReadiusConstant.ADOPT_NOTIFICATION_BASE_URL + path);
  }

  delete(path: string) {
    return this.http.delete(ReadiusConstant.ADOPT_NOTIFICATION_BASE_URL + path);
  }

  // post(path: string) {
  //   return this.http.post(ReadiusConstant.ADOPT_NOTIFICATION_BASE_URL + path);
  // }

  post(path: string, data: any) {
    return this.http.post(ReadiusConstant.ADOPT_NOTIFICATION_BASE_URL + path, data);
  }

  put(path: string, data: any) {
    return this.http.put(ReadiusConstant.ADOPT_NOTIFICATION_BASE_URL + path, data);
  }

  getapigateway(path: string){
    return this.http.get(ReadiusConstant.ADOPT_COMMON_BASE_URL+path);
  }
  

}
