import { status } from "./../../RadiusUtils/RadiusConstants";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthResponseService } from "src/app/service/auth-response.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { DatePipe } from "@angular/common";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
@Component({
  selector: "app-auth-response",
  templateUrl: "./auth-response.component.html",
  styleUrls: ["./auth-response.component.css"]
})
export class AuthResponseComponent implements OnInit {
  searchAuthRespForm: FormGroup;
  searchSubmitted = false;
  searchAcctCdrData = {
    userName: ""
  };
  userName = "";
  groupData: any[] = [];
  filterdData: any[] = [];
  //Used and required for pagination
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  //Used to store error data and error message
  accessData: any = JSON.parse(localStorage.getItem("accessData"));

  errorMsg = "";

  editMode: boolean = false;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  deleteAuthAccess: any;

  constructor(
    private AuthResponseService: AuthResponseService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.deleteAuthAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_AUTHEN_AUDIT_DELETE);
    this.findAllAuth("");
  }

  ngOnInit(): void {
    this.searchAuthRespForm = this.fb.group({
      username: [""],
      replymessage: [""],
      packettype: [""],
      clientip: [""],
      clientgroup: [""],
      fromDate: [""],
      toDate: [""]
    });
  }

  findAllAuth(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.AuthResponseService.findAllAuthResponseData(page, size).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        } else {
          this.groupData = response.authResponse.content;
          this.totalRecords = response.authResponse.totalElements;
          this.filterdData = this.groupData;
        }
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllAuth(this.showItemPerPage);
    } else {
      this.searchAuthResp();
    }
  }

  deleteConfirm(authRespId) {
    this.confirmationService.confirm({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteGroupById(authRespId);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
      }
    });
  }
  deleteGroupById(authRespId) {
    this.AuthResponseService.deleteAuthResponseById(authRespId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.groupData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.findAllAuth("");
        } else {
          this.searchAuthResp();
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  searchAuthResp() {
    this.searchSubmitted = true;
    this.searchkey = "";
    // this.currentPage = 1;
    if (!this.searchkey || this.searchkey !== this.searchAuthRespForm.value.username) {
      this.currentPage = this.currentPage; 
    }
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    if (this.searchAuthRespForm.valid) {
      Object.keys(this.searchAuthRespForm.value).forEach(key => {
        if (this.searchAuthRespForm.value[key] !== null) {
          if (this.searchAuthRespForm.value[key] instanceof Date) {
            this.searchkey += `&${key}=${this.datePipe.transform(
              this.searchAuthRespForm.value[key],
              "yyyy-MM-dd"
            )}`;
          } else {
            this.searchkey += `&${key}=${this.searchAuthRespForm.value[key]}`;
          }
        }
      });
      // let userNameForSearch = this.searchAuthRespForm.value.username.trim()
      //   ? this.searchAuthRespForm.value.username.trim()
      //   : "";

      // this.searchkey = userNameForSearch;
      this.filterdData = [];

      // this.AuthResponseService.searchByUserName
      this.AuthResponseService.findAllAuthResponseData(
        this.currentPage,
        this.itemsPerPage,
        this.searchkey
      ).subscribe(
        (response: any) => {
          this.groupData = response.authResponse.content;
          this.totalRecords = response.authResponse.totalElements;
          this.filterdData = this.groupData;
        },
        (error: any) => {
          if (error.error.status == 404) {
            this.totalRecords = 0;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.totalRecords = 0;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        }
      );
    }
  }

  clearSearchForm() {
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.searchAuthRespForm.reset();
    this.findAllAuth("");
  }
  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllAuth("");
    } else {
      this.searchAuthResp();
    }
  }
}
