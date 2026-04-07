import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { CountryManagementService } from "src/app/service/country-management.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { IDeactivateGuard } from "src/app/service/deactivate.service";
import { Observable, Observer } from "rxjs";
import { CasManagement } from "../model/CasManagement";
import { CasManagementService } from "src/app/service/cas-management.service";
import { DTVS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-cas-management",
  templateUrl: "./cas-management.component.html",
  styleUrls: ["./cas-management.component.css"]
})
export class CASManagementComponent implements OnInit, IDeactivateGuard {
  title = "CAS";
  casFormGroup: FormGroup;
  casePackageMappings: FormArray;
  casParameterMappingsfromgroup: FormGroup;
  casParameterMappingsFromArray: FormArray;
  submitted: boolean = false;
  casData: CasManagement;
  casListData: any;
  casMapping: any;
  isCasEdit: boolean = false;
  viewCasListData: any;
  currentPageCasSlab = 1;
  casitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  castotalRecords: any;
  searchCasName: any = "";
  searchData: any;
  AclClassConstants;
  AclConstants;
  //   createCASAccess: boolean = false;
  //   editCASAccess: boolean = false;
  //   deleteCASAccess: boolean = false;

  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  casParamaterSubmitted = false;

  parameterItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parametertotalRecords: String;
  currentPageparameter = 1;

  PackageItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  PackagetotalRecords: String;
  currentPagePackage = 1;

  listView: boolean = true;
  createView: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  public loginService: LoginService;
  casMappingList: any = [];
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private countryManagementService: CountryManagementService,
    private casManagementService: CasManagementService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(DTVS.CAS_CREATE);
    this.deleteAccess = loginService.hasPermission(DTVS.CAS_DELETE);
    this.editAccess = loginService.hasPermission(DTVS.CAS_EDIT);

    // this.isCasEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.casFormGroup = this.fb.group({
      casname: ["", Validators.required],
      status: ["", Validators.required],
      endpoint: [""],
      paraName: [""],
      paraValue: [""],
      id: [""],
      mvnoId: [""],
      casParameterMappings: (this.casParameterMappingsFromArray = this.fb.array([]))
    });
    this.casParameterMappingsfromgroup = this.fb.group({
      id: [""],
      casparamid: [""],
      paramName: ["", Validators.required],
      paramValue: ["", Validators.required]
    });
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: ""
    };
    this.getCasListData("");
  }

  createCas() {
    this.listView = false;
    this.createView = true;
    this.submitted = false;
    this.isCasEdit = false;
    this.casFormGroup.reset();
    this.casFormGroup.controls.status.setValue("");
    this.casParameterMappingsFromArray = this.fb.array([]);
    this.casParameterMappingsfromgroup.reset();
  }
  lisCas() {
    this.listView = true;
    this.createView = false;
    this.getCasListData("");
  }

  canExit() {
    if (!this.casFormGroup.dirty) return true;
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
          }
        });
        return false;
      });
    }
  }

  addEditCas(id) {
    this.submitted = true;
    if (this.casFormGroup.valid) {
      if (id) {
        const url = "/casepackage/update?mvnoId=" + localStorage.getItem("mvnoId");
        this.casFormGroup.value.casParameterMappings = this.casParameterMappingsFromArray.value;
        this.casData = this.casFormGroup.value;
        this.casData.id = id;
        this.casData.isDelete = false;
        this.casData.casPackageMappings = this.viewCasListData.casPackageMappings;
        this.casManagementService.postMethod(url, this.casData).subscribe(
          (response: any) => {
            if (response.responseCode === 200) {
              this.submitted = false;
              this.isCasEdit = false;
              this.casFormGroup.reset();
              this.casFormGroup.controls.status.setValue("");
              this.casParameterMappingsFromArray = this.fb.array([]);
              this.casParameterMappingsfromgroup.reset();
              this.listView = true;
              this.createView = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              if (this.searchkey) {
                this.searchCas();
              } else {
                this.getCasListData("");
              }
            } else {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            }
          },
          (error: any) => {
            // console.log(error, "error")

            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        const url = "/casepackage/save?mvnoId=" + localStorage.getItem("mvnoId");
        this.casFormGroup.value.casParameterMappings = this.casParameterMappingsFromArray.value;
        this.casData = this.casFormGroup.value;
        this.casData.delete = false;
        this.casData.isDelete = false;
        this.casManagementService.postMethod(url, this.casData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.casFormGroup.reset();
            this.casFormGroup.controls.status.setValue("");
            this.casParameterMappingsFromArray = this.fb.array([]);
            this.casParameterMappingsfromgroup.reset();
            this.listView = true;
            this.createView = false;
            if (this.searchkey) {
              this.searchCas();
            } else {
              this.getCasListData("");
            }

            if (response.responseCode !== 200) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
            }
          },
          (error: any) => {
            // console.log(error, "error")

            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      }
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageCasSlab > 1) {
      this.currentPageCasSlab = 1;
    }
    if (!this.searchkey) {
      this.getCasListData(this.showItemPerPage);
    } else {
      this.searchCas();
    }
  }

  getCasListData(list) {
    const url = "/casepackage?mvnoId=" + localStorage.getItem("mvnoId");
    let size;
    this.searchkey = "";
    let pageList = this.currentPageCasSlab;
    if (list) {
      size = list;
      this.casitemsPerPage = list;
    } else {
      size = this.casitemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size
    };
    this.casManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.casListData = response.dataList;
        this.casMapping = this.casListData[0].casePackageMappings;
        this.castotalRecords = response.totalRecords;

        this.searchkey = "";
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  editCas(casId) {
    this.listView = false;
    this.createView = true;
    this.casParameterMappingsFromArray = this.fb.array([]);
    this.casParameterMappingsfromgroup.reset();
    this.casFormGroup.reset();
    if (casId) {
      const url = "/casepackage/" + casId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.casManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isCasEdit = true;
          this.viewCasListData = response.data;
          this.casFormGroup.patchValue(this.viewCasListData);

          if (this.viewCasListData.casParameterMappings.length > 0) {
            this.viewCasListData.casParameterMappings.forEach(element => {
              this.casParameterMappingsFromArray.push(
                this.fb.group({
                  id: [element.id],
                  casparamid: [element.casparamid],
                  paramName: [element.paramName],
                  paramValue: [element.paramValue]
                })
              );
            });
          }
        },
        (error: any) => {
          // console.log(error, "error")
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  referncecasPackage(casId) {
    const url = "/casepackage/refreshCasPackage?casID=" + casId;
    this.casManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.casMappingList = response.data;
        this.editCas(casId);
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
      },
      (error: any) => {
        this.castotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.casListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
  searchCas() {
    if (!this.searchkey || this.searchkey !== this.searchCasName) {
      this.currentPageCasSlab = 1;
    }
    this.searchkey = this.searchCasName;
    if (this.showItemPerPage) {
      this.casitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchCasName.trim();
    this.searchData.page = this.currentPageCasSlab;
    this.searchData.pageSize = this.casitemsPerPage;
    const url =
      "/casepackage/search?page=" +
      this.currentPageCasSlab +
      "&pageSize=" +
      this.casitemsPerPage +
      "&sortBy=id&sortOrder=0"+
      "&mvnoId=" + localStorage.getItem("mvnoId");
    this.casManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.casListData = response.dataList;
      },
      (error: any) => {
        this.castotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.casListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  clearSearchCas() {
    this.searchCasName = "";
    this.searchkey = "";
    this.getCasListData("");
    this.submitted = false;
    this.isCasEdit = false;
    this.casFormGroup.reset();
    this.casFormGroup.controls.status.setValue("");
    this.casParameterMappingsFromArray = this.fb.array([]);
    this.casParameterMappingsfromgroup.reset();
  }

  deleteConfirmonCas(id: number) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.title + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteCas(id);
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
  }
  deleteCas(data) {
    const url = "/casepackage/delete";
    this.casManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPageCasSlab != 1 && this.casListData.length == 1) {
            this.currentPageCasSlab = this.currentPageCasSlab - 1;
          }
          this.clearSearchCas();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          if (this.searchkey) {
            this.searchCas();
          } else {
            this.getCasListData("");
          }
        }
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  addParameters() {}
  pageChangedCasList(pageNumber) {
    this.currentPageCasSlab = pageNumber;
    if (this.searchkey) {
      this.searchCas();
    } else {
      this.getCasListData("");
    }
  }

  createParameterMappingFormGroup(): FormGroup {
    return this.fb.group({
      id: [
        this.casParameterMappingsfromgroup.value.id
          ? this.casParameterMappingsfromgroup.value.id
          : ""
      ],
      casparamid: [
        this.casParameterMappingsfromgroup.value.casparamid
          ? this.casParameterMappingsfromgroup.value.casparamid
          : ""
      ],
      paramName: [this.casParameterMappingsfromgroup.value.paramName],
      paramValue: [this.casParameterMappingsfromgroup.value.paramValue]
    });
  }

  onAddParameterMappingList() {
    this.casParamaterSubmitted = true;
    if (this.casParameterMappingsfromgroup.valid) {
      this.casParameterMappingsFromArray.push(this.createParameterMappingFormGroup());
      this.casParameterMappingsfromgroup.reset();
      this.casParamaterSubmitted = false;
    } else {
    }
  }
  pageChangedParameterMappingList(pageNumber) {
    this.currentPageparameter = pageNumber;
  }

  deleteConfirmonParameterMappingList(index) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Paramater?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.onRemoveparameter(index);
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

  async onRemoveparameter(chargeFieldIndex: number) {
    this.casParameterMappingsFromArray.removeAt(chargeFieldIndex);
  }

  changepagePackage(page) {
    this.currentPagePackage = page;
  }

  totalItemPerPageMapping(event: any) {
    this.PackageItemPerPage = event.value;
    this.currentPagePackage = 1;
  }
}
