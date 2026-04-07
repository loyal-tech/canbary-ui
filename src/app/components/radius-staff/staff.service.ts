import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { HttpParams } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, last, map, tap } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class StaffService {
  constructor(private http: HttpClient) {}

  transformStaffData(data) {
    let formatedData = [];
    data.staffUserlist.forEach(function (item: any) {
      let itemData: any = {};
      itemData.staff_id = item.id;
      itemData.firstname = item.firstname;
      itemData.lastname = item.lastname;
      itemData.email = item.email;
      itemData.phone = item.phone;
      itemData.username = item.username;
      itemData.password = item.password;
      itemData.roleIds = item.roleIds;
      itemData.status = item.status;
      itemData.regDate = item.regDate;
      itemData.sysstaff = item.sysstaff;
      itemData.updatedate = item.updatedate;
      formatedData.push(itemData);
    });
    return { content: formatedData, pageDetails: data.pageDetails ? data.pageDetails : null };
  }
  transformStaffBeta(data) {
    let formatedData = [];
    data.staffUserlist.forEach(function (item: any) {
      let itemData: any = {};
      itemData.staff_id = item.id;
      itemData.firstname = item.firstname;
      itemData.lastname = item.lastname;
      itemData.email = item.email;
      itemData.phone = item.phone;
      itemData.username = item.username;
      itemData.password = item.password;
      itemData.roleIds = item.roleIds;
      itemData.status = item.status;
      itemData.regDate = item.regDate;
      itemData.sysstaff = item.sysstaff;
      formatedData.push(itemData);
    });
    return { content: formatedData, pageDetails: data.pageDetails ? data.pageDetails : null };
  }

  getStaffDataWithPageing(params: HttpParams): Observable<any> {
    const post_url = "staffuser/list";

    return this.http.post<any>(post_url, params, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return this.transformStaffData(res);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getStaffData(staff_id): Observable<any> {
    const get_url = "staffuser";

    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return this.transformStaffBeta(res);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  getStaffById(staff_id): Observable<any> {
    const get_url = "staffuser/" + staff_id;

    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  transformSalesRepresentativeList(data) {
    let formatedData = [];
    data.staffUserlist.forEach(function (item: any) {
      if (item.lastname && item.lastname.length) {
        item.fullname = item.firstname + " " + item.lastname;
      } else {
        item.fullname = item.firstname;
      }
      formatedData.push(item);
    });
    return { content: formatedData };
  }

  getSalesRepresentativeList(role_id): Observable<any> {
    const get_url = "staffuserByRole/" + role_id;

    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return this.transformSalesRepresentativeList(res);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  insertStaff(staff_data: any): Observable<any> {
    const post_url = "staffuser";
    return this.http.post<any>(post_url, staff_data, httpOptions).pipe(
      map(data => data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updateStaff(staff_data: any, staff_id: any): Observable<any> {
    const update_url = "/staffuser/" + staff_id;
    staff_data.mvnoId = localStorage.getItem("mvnoId");
    return this.http.put<any>(update_url, staff_data, httpOptions).pipe(
      map(data => data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  deleteStaff(staff_id: any): Observable<any> {
    const delete_url = "staffuser/" + staff_id;
    return this.http.delete(delete_url, httpOptions);
  }

  getAllStaffData(): Observable<any> {
    const get_url = "staffuser";

    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return this.transformStaffBeta(res);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getAllRoleData(): Observable<any> {
    const get_url = "role/all";

    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  getTeamsData() {
    const get_url = "teams/all";
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  checkUniqueMobile(data): Observable<any> {
    const get_url = "staffuser/phoneDuplicate";
    return this.http.post<any>(get_url, data, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  checkUniqueEmail(data): Observable<any> {
    const get_url = "staffuser/emailDuplicate";
    return this.http.post<any>(get_url, data, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
}
