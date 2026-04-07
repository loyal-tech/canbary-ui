import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Injectable } from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
import jwt_decode from "jwt-decode";
import { MenuItems } from "../constants/menuItems";
import { PermitACLConstants } from "../constants/PermitACLConstants";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { HttpResponseCache } from "./http-response-cache";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class LoginService {
  permissionList = [];
  menuPermissionList = [];
  PermitAclConstants;
  redirectUrl: string | null = null;

  private aclEntrySubject = new BehaviorSubject<any>(null);

  // Observable to watch for changes in ACL entries
  aclEntry$ = this.aclEntrySubject.asObservable();

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private cache: HttpResponseCache,
    private router: Router
  ) {
    this.PermitAclConstants = PermitACLConstants;
  }

  baseUrl = RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT;

  generateOtp(username: string, password: string): Observable<any> {
    const OTPGenerateDTO = {
      username: username,
      password: password,
      otpForStaff: true
    };
    return this.http.post(`${this.baseUrl}/otp/generate`, OTPGenerateDTO, httpOptions);
  }

  verifyOtp(username: string, otp: string): Observable<any> {
    const otpValidatData = {
      username: username,
      otp: otp,
      otpForStaff: true
    };
    return this.http.post(`${this.baseUrl}/otp/validate`, otpValidatData, httpOptions);
  }

  generateToken(data) {
    return this.http.post(`${this.baseUrl}/login`, data, httpOptions);
  }
  refreshToken() {
    this.http.get(`${this.baseUrl}/refreshtoken`).subscribe(
      (response: any) => {
        localStorage.setItem("token", response.accessToken);
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  loginUser(token) {
    localStorage.setItem("token", token);
    return true;
  }

  data = {
    sub: ""
  };

  isLoggedIn() {
    let token = localStorage.getItem("token");
    this.data = this.getDecodedAccessToken(token);
    if (this.data != null) {
      let mvno = this.data.sub
        .substring(this.data.sub.indexOf('mvnoId":'))
        .split(",")[0]
        .split(":")[1];
      localStorage.setItem("mvnoId", mvno);
    }
    if (token == undefined || token === "" || token == null) {
      return false;
    } else {
      return true;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwt_decode(token);
      return decoded.exp * 1000 < Date.now(); // Check if token is expired
    } catch (error) {
      return true; // If decoding fails, assume token is invalid
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("mvnoId");
    localStorage.removeItem("demographic");
    localStorage.clear();
    this.cache.clear();
    return true;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getRadiusServiceStatus() {
    return this.http.get(`${RadiusConstants.ADOPT_RADIUS_BASE_URL}/serviceStatus`);
  }

  //   getTacacsServiceStatus() {
  //     return this.http.get(
  //       `${RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL}/tacacs-service/health`
  //     );
  //   }

  getNotificationServiceStatus() {
    return this.http.get(`${RadiusConstants.ADOPT_NOTIFICATION_BASE_URL}/serviceStatus`);
  }

  getSaleCrmServiceStatus() {
    return this.http.get(`${RadiusConstants.ADOPT_LEAD_BASE_URL}/serviceStatus`);
  }

  getTaskMgmtServiceStatus() {
    return this.http.get(`${RadiusConstants.ADOPT_TASK_MGMT_BASE_URL}/serviceStatus`);
  }

  getMethod(url) {
    return this.http.get(this.baseUrl + url);
  }
  getCurrentBUStaff(url) {
    return this.http.get(`${RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT}` + url);
  }
  setMenuPermission(data) {
    localStorage.setItem("menuPermission", JSON.stringify(data));
  }

  public getAclEntry(): Observable<any> {
    const url = "/acl/getAclEntry";
    this.permissionList = [];
    return this.getMethod(url).pipe(
      tap((res: any) => {
        if (res.dataList != null) {
          localStorage.setItem("aclEntries", JSON.stringify(res.dataList));
          this.updateAclEntry(res.dataList);
        }
      }),
      catchError(err => {
        this.messageService.add({
          severity: "error",
          summary: err.error.errorMessage,
          detail: "Something was wrong. Try again",
          icon: "far fa-times-circle"
        });
        return throwError(() => err);
      })
    );
  }

  // Method to update ACL entries
  updateAclEntry(aclEntry: any) {
    this.aclEntrySubject.next(aclEntry);
  }

  setUserRoleOperationPermission(data) {
    localStorage.setItem("userRoleOperationPermission", JSON.stringify(data));
  }

  hasOperationPermission(classId, operationId, accessIdForAllOpreation) {
    return true;
    let RoleAdmin = localStorage.getItem("userRoles");
    this.permissionList = [];
    let permissionList = localStorage.getItem("userRoleOperationPermission");
    if (permissionList.length > 0) {
      this.permissionList = JSON.parse(localStorage.getItem("userRoleOperationPermission"));
    }
    if (RoleAdmin === "1") {
      return true;
    }
    if (this.permissionList.length > 0) {
      for (let permission of this.permissionList) {
        let isPersmissionList = permission.operations.filter(
          item =>
            (item.opid === accessIdForAllOpreation || item.opid === operationId) &&
            item.classid === classId
        );
        if (isPersmissionList.length != 0) {
          // console.log("true");
          return true;
        }
      }
      return true;
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Restriction",
        detail: "Sorry you have not privilege to any operation!",
        icon: "far fa-times-circle"
      });
    }
  }

  hasOperationPermissionOfAll(classId, accessIdForAllOpreation) {
    let RoleAdmin = localStorage.getItem("userRoles");
    this.permissionList = [];
    let permissionList = localStorage.getItem("userRoleOperationPermission");
    if (permissionList.length > 0) {
      this.permissionList = JSON.parse(localStorage.getItem("userRoleOperationPermission"));
    }
    if (RoleAdmin === "1") {
      return true;
    }
    if (this.permissionList.length > 0) {
      for (let permission of this.permissionList) {
        let isPersmissionList = permission.operations.filter(
          item => item.opid === accessIdForAllOpreation && item.classid === classId
        );
        if (isPersmissionList.length != 0) {
          // console.log("true");
          return true;
        }
      }
      return false;
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Restriction",
        detail: "Sorry you have not privilege to any operation!",
        icon: "far fa-times-circle"
      });
    }
  }

  hideParentMenu(menuId) {
    this.menuPermissionList = [];
    let RoleAdmin = localStorage.getItem("userRoles");
    //this.menuPermissionList = this.tokenStorageService.getMenuPermission();
    let menuPermissionList = localStorage.getItem("menuPermission");
    if (menuPermissionList.length > 0) {
      this.menuPermissionList = JSON.parse(localStorage.getItem("menuPermission"));
    }
    if (RoleAdmin === "1") {
      return true;
    }
    if (this.menuPermissionList) {
      if (this.menuPermissionList.length > 0) {
        let filterPersmissionList = this.menuPermissionList.filter(menu => menu.menuid === menuId);

        if (filterPersmissionList && filterPersmissionList.length > 0) {
          let submenus = filterPersmissionList[0].submenu.filter((obj: any) => obj.permits != null);
          let permitList = [];
          let list = [];
          submenus.forEach(item =>
            item.permits && item.permits.length > 0 ? permitList.push(item.permits) : ""
          );
          for (let myconstant in PermitACLConstants) {
            permitList.forEach(item =>
              item.forEach((obj: any) =>
                obj === PermitACLConstants[myconstant] ? list.push(obj) : ""
              )
            );
          }
          if (list && list.length > 0) {
            return true;
          }
        }
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Restriction",
        detail: "Sorry you have not privilege to access any menu!",
        icon: "far fa-times-circle"
      });
    }
  }

  hideSidebarMenu(menuId, subMenuId, constantVar) {
    let RoleAdmin = localStorage.getItem("userRoles");
    if (RoleAdmin === "1") {
      return true;
    }

    this.menuPermissionList = [];
    let menuPermissionList = localStorage.getItem("menuPermission");
    if (menuPermissionList.length > 0) {
      this.menuPermissionList = JSON.parse(localStorage.getItem("menuPermission"));
    }
    //this.menuPermissionList = this.tokenStorageService.getMenuPermission();
    if (this.menuPermissionList) {
      if (this.menuPermissionList.length > 0) {
        let filterPersmissionList = this.menuPermissionList.filter(menu => menu.menuid === menuId);
        if (filterPersmissionList && filterPersmissionList.length > 0) {
          let isPersmissionList = filterPersmissionList[0].submenu.filter(
            item => item.menuid === subMenuId
          );
          if (isPersmissionList && isPersmissionList.length > 0) {
            let list = [];
            isPersmissionList.forEach(item =>
              item.permits.includes(constantVar) ? list.push(item) : ""
            );
            if (list && list.length > 0) {
              return true;
            }
          }
        }
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Restriction",
          detail: "Sorry you have not privilege to access any menu!",
          icon: "far fa-times-circle"
        });
      }
    }
  }

  hideChildSidebarMenu(menuId, subMenuId, childSubMenuId) {
    let RoleAdmin = localStorage.getItem("userRoles");
    if (RoleAdmin === "1") {
      return true;
    }
    this.menuPermissionList = [];
    //this.menuPermissionList = this.tokenStorageService.getMenuPermission();
    let menuPermissionList = localStorage.getItem("menuPermission");
    if (menuPermissionList.length > 0) {
      this.menuPermissionList = JSON.parse(localStorage.getItem("menuPermission"));
    }
    if (this.menuPermissionList.length > 0) {
      let filterPersmissionList = this.menuPermissionList.filter(menu => menu.menuid === menuId);
      if (filterPersmissionList.length > 0) {
        let isPersmissionList = filterPersmissionList[0].submenu.filter(
          item => item.menuid === subMenuId
        );
        if (isPersmissionList.length != 0) {
          if (isPersmissionList[0].submenu) {
            if (isPersmissionList[0].submenu.length > 0) {
              let isPersmissionListChild = isPersmissionList[0].submenu.filter(
                item => item.menuid === childSubMenuId
              );
              if (isPersmissionListChild.length != 0) {
                return true;
              }
            }
          }
        }
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Restriction",
        detail: "Sorry you have not privilege to access any menu!",
        icon: "far fa-times-circle"
      });
    }
  }

  getOTP(data) {
    return this.http.post(
      `${RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL}/otp/generate`,
      data
    );
  }

  validateOTP(data) {
    return this.http.post(
      `${RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL}/otp/validate`,
      data
    );
  }

  changePassword(data) {
    return this.http.put(
      `${RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT}/staffuser/resetpassword`,
      data
    );
  }

  SearchResellerName(name) {
    return this.http.get(
      `${RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL}/getStaffContactByUserName?username=` +
        encodeURIComponent(name) +
        "&mvnoId=" +
        localStorage.getItem("mvnoId")
    );
  }

  hasPermission(...itemCodes: string[]): boolean {
    const rolePermissions = JSON.parse(localStorage.getItem("aclEntries"));

    if (rolePermissions != null) {
      return rolePermissions.some((item: any) => {
        return itemCodes.includes(item.code);
      });
    }
    return false;
  }

  resetPassword(data) {
    return this.http.put(`${this.baseUrl}/staffuser/changepassword`, data, {});
  }
}
