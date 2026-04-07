import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CountryManagementService } from "src/app/service/country-management.service";
import { Regex } from "src/app/constants/regex";
import { CountryManagement } from "src/app/components/model/country-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY } from "src/app/RadiusUtils/RadiusConstants";
import { IDeactivateGuard } from "src/app/service/deactivate.service";
import { Observable, Observer } from "rxjs";
import { resolve } from "dns";
import { ObserversModule } from "@angular/cdk/observers";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
import { RadiusBaseServiceService } from "src/app/service/radius-base-service.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-radius-access-response-managemnt",
  templateUrl: "./radius-access-response-managemnt.component.html",
  styleUrls: ["./radius-access-response-managemnt.component.css"]
})
export class RadiusAccessResponseManagementComponent implements OnInit, IDeactivateGuard {
  title = COUNTRY;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  accessResponseFormGroup: FormGroup;
  submitted: boolean = false;
  countryData: CountryManagement;
  accessResponseListData: any;
  isAccessResponseEdit: boolean = false;
  viewAccessResponseData: any;
  currentPageAccessResponseSlab = 1;
  accessResponseitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  accessResponsetotalRecords: any;
  searchCountryName: any = "";
  searchData: any;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  eventListData: any[] = [];
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private countryManagementService: CountryManagementService,
    private commondropdownService: CommondropdownService,
    private radiusService: RadiusBaseServiceService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_ACCESS_RESPONSE_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_ACCESS_RESPONSE_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_ACCESS_RESPONSE_EDIT);
  }

  ngOnInit(): void {
    this.accessResponseFormGroup = this.fb.group({
      id: [""],
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      message: ["", Validators.required],
      event: ["", Validators.required],
    });

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: "",
      pageSize: "",
    };
    this.getAccessResponseListData("");
    this.getEvent();
  }

  canExit() {
    if (!this.accessResponseFormGroup.dirty) return true;
    {
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          header: "Alert",
          message: "The filled data will be lost. Do you want to continue? (Yes/No)",
          icon: "pi pi-info-circle",
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          },
        });
        return false;
      });
    }
  }

  addEditAccessResponse(accessResponseId) {
    this.submitted = true;
    if (this.accessResponseFormGroup.valid) {
      if (accessResponseId) {
        const url = "/updateAccessResponse";
        this.radiusService.post(url, this.accessResponseFormGroup.value).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isAccessResponseEdit = false;
            this.accessResponseFormGroup.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            this.submitted = false;
            if (this.searchkey) {
              //   this.searchCountry();
            } else {
              this.getAccessResponseListData("");
            }
          },
          (error: any) => {
            if (error.error.status == 417 || error.error.status == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.ERROR,
                icon: "far fa-times-circle",
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle",
              });
            }
          }
        );
      } else {
        const url = "/addAccessResponse";
        this.radiusService.post(url, this.accessResponseFormGroup.value).subscribe(
          (response: any) => {
            this.submitted = false;
            this.accessResponseFormGroup.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            if (this.searchkey) {
              //   this.searchCountry();
            } else {
              this.getAccessResponseListData("");
            }
          },
          (error: any) => {
            if (
              error.error.status == 417 ||
              error.error.status == 406 ||
              error.error.status == 400
            ) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.message,
                icon: "far fa-times-circle",
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle",
              });
            }
          }
        );
      }
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAccessResponseSlab > 1) {
      this.currentPageAccessResponseSlab = 1;
    }
    if (!this.searchkey) {
      this.getAccessResponseListData(this.showItemPerPage);
    } else {
      //   this.searchCountry();
    }
  }

  getAccessResponseListData(list) {
    const url = "/accessResponse";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageAccessResponseSlab;
    if (list) {
      size = list;
      this.accessResponseitemsPerPage = list;
    } else {
      size = this.accessResponseitemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.radiusService.post(url, plandata).subscribe(
      (response: any) => {
        this.accessResponseListData = response.accessResponseList;
        this.accessResponsetotalRecords = response.pageDetails.totalRecords;

        this.searchkey = "";
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  editAccessResponse(accessResponseId) {
    if (accessResponseId) {
      const url = "/accessResponse/" + accessResponseId;
      this.radiusService.get(url).subscribe(
        (response: any) => {
          this.isAccessResponseEdit = true;
          this.viewAccessResponseData = response.accessResponseList;
          this.accessResponseFormGroup.patchValue(this.viewAccessResponseData);
        },
        (error: any) => {
          // console.log(error, "error")
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  //   searchCountry() {
  //     if (!this.searchkey || this.searchkey !== this.searchCountryName) {
  //       this.currentPageAccessResponseSlab = 1;
  //     }
  //     this.searchkey = this.searchCountryName;
  //     if (this.showItemPerPage) {
  //       this.accessResponseitemsPerPage = this.showItemPerPage;
  //     }
  //     this.searchData.filters[0].filterValue = this.searchCountryName.trim();
  //     this.searchData.page = this.currentPageAccessResponseSlab;
  //     this.searchData.pageSize = this.accessResponseitemsPerPage;

  //     const url = "/country/search";
  //     // console.log("this.searchData", this.searchData)
  //     this.countryManagementService.postMethod(url, this.searchData).subscribe(
  //       (response: any) => {
  //         this.accessResponseListData = response.countryList;
  //         this.accessResponsetotalRecords = response.pageDetails.totalRecords;
  //       },
  //       (error: any) => {
  //         this.accessResponsetotalRecords = 0;
  //         if (error.error.status == 404) {
  //           this.messageService.add({
  //             severity: "info",
  //             summary: "Info",
  //             detail: error.error.msg,
  //             icon: "far fa-times-circle",
  //           });
  //           this.accessResponseListData = [];
  //         } else {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.response.ERROR,
  //             icon: "far fa-times-circle",
  //           });
  //         }
  //       }
  //     );
  //   }

  clearSearchCountry() {
    this.searchCountryName = "";
    this.searchkey = "";
    this.getAccessResponseListData("");
    this.submitted = false;
    this.isAccessResponseEdit = false;
    this.accessResponseFormGroup.reset();
  }

  deleteConfirmonAccessResponse(accessResponseId: number) {
    if (accessResponseId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteAccessResponse(accessResponseId);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
        },
      });
    }
  }

  deleteAccessResponse(accessResponseId) {
    const url = "/deleteAccesresponse/" + accessResponseId;

    this.radiusService.get(url).subscribe(
      (response: any) => {
        if (this.currentPageAccessResponseSlab != 1 && this.accessResponseListData.length == 1) {
          this.currentPageAccessResponseSlab = this.currentPageAccessResponseSlab - 1;
        }
        this.clearSearchCountry();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Successfully",
          icon: "far fa-check-circle",
        });
        if (this.searchkey) {
          //   this.searchCountry();
        } else {
          //   this.getAccessResponseListData("");
        }
      },
      (error: any) => {
        if (error.error.status == 417 || error.error.status == 405 || error.error.status == 406) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  pageChangedCountryList(pageNumber) {
    this.currentPageAccessResponseSlab = pageNumber;
    if (this.searchkey) {
      //   this.searchCountry();
    } else {
      this.getAccessResponseListData("");
    }
  }

  getEvent() {
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/radius_access_response_mode")
      .subscribe((response: any) => {
        this.eventListData = response.dataList;
      });
  }
}
