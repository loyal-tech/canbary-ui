import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { AcsManagementService } from "src/app/service/acs-management.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { IDeactivateGuard } from "src/app/service/deactivate.service";
import { Observable, Observer } from "rxjs";
import { AcsManagement } from "../model/AcsManagement";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { INTEGRATION_SYSTEMS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-acs-master",
  templateUrl: "./acs-master.component.html",
  styleUrls: ["./acs-master.component.css"],
})
export class AcsMasterComponent implements OnInit {
  title = "ACS";
  acsFormGroup: FormGroup;
  acsPackageMappings: FormArray;
  acsParameterMappingsfromgroup: FormGroup;
  acsParameterMappingsFromArray: FormArray;
  acsUrlParameterMappingsfromgroup: FormGroup;
  acsUrlParameterMappingsFromArray: FormArray;
  submitted: boolean = false;
  acsData: AcsManagement;
  acsListData: any;
  acsMapping: any;
  isAcsEdit: boolean = false;
  viewAcsListData: any;
  currentPageCasSlab = 1;
  //casitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  acsitemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  acstotalRecords: any;
  searchCasName: any = "";
  searchData: any;
  AclClassConstants;
  AclConstants;

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

  searchAcsName: any = "";
  casMappingList: any = [];
  apiMethodList: any = [];
  apiNameList: any = [];
  apiDataList: any = [];
  acsALLDeatilsShow: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  acsAllData: any = [];

  vendoritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageVendorSlab = 1;
  vendorListData: any;
  vendortotalRecords: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private acsManagementService: AcsManagementService,
    private messageService: MessageService,
    private commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.ACS_MASTER_CREATE);
    this.deleteAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.ACS_MASTER_DELETE);
    this.editAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.ACS_MASTER_EDIT);
  }

  ngOnInit(): void {
    this.acsFormGroup = this.fb.group({
      name: ["", Validators.required],
      url: ["", Validators.required],
      username: ["", Validators.required],
      vendorId: ["", Validators.required],
      password: ["", Validators.required],
      id: [""],
      acsMasterAPIMappings: (this.acsParameterMappingsFromArray = this.fb.array([])),
      acsMasterUrlParamMappingList: (this.acsUrlParameterMappingsFromArray = this.fb.array([])),
    });
    this.acsParameterMappingsfromgroup = this.fb.group({
      id: [""],
      apiMethod: [""],
      apiName: [""],
      endpoint: [""],
    });
    this.acsUrlParameterMappingsfromgroup = this.fb.group({
      paramName: [""],
      paramValue: [""],
    });
    this.searchData = {
      filter: [
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

    this.getMethodType();
    this.getApiName();
    this.getAcsListData("");
    this.getVendorListData("");
  }
  createAcs() {
    this.listView = false;
    this.createView = true;
    this.acsALLDeatilsShow = false;
    this.submitted = false;
    this.isAcsEdit = false;
    this.acsFormGroup.reset();
    this.acsParameterMappingsFromArray = this.fb.array([]);
    this.acsParameterMappingsfromgroup.reset();
    this.acsUrlParameterMappingsFromArray = this.fb.array([]);
    this.acsUrlParameterMappingsfromgroup.reset();
  }

  addEditCas(id) {
    this.submitted = true;
    if (this.acsFormGroup.valid) {
      if (id) {
        const url = "/acsMaster/update";
        this.acsFormGroup.value.acsMasterAPIMappings = this.acsParameterMappingsFromArray.value;
        this.acsFormGroup.value.acsMasterUrlParamMappingList =
          this.acsUrlParameterMappingsFromArray.value;
        this.acsData = this.acsFormGroup.value;
        this.acsData.id = id;
        this.acsData.casPackageMappings = this.viewAcsListData.casPackageMappings;
        this.acsManagementService.postMethod(url, this.acsData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isAcsEdit = false;
            this.acsFormGroup.reset();
            this.acsParameterMappingsFromArray = this.fb.array([]);
            this.acsParameterMappingsfromgroup.reset();
            this.acsUrlParameterMappingsFromArray = this.fb.array([]);
            this.acsUrlParameterMappingsfromgroup.reset();
            this.listView = true;
            this.createView = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            this.submitted = false;
            if (this.searchkey) {
              this.searchAcs();
            } else {
              this.getAcsListData("");
            }
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
      } else {
        if (
          this.acsParameterMappingsFromArray.length > 0 &&
          this.acsUrlParameterMappingsFromArray.length > 0
        ) {
          const url = "/acsMaster/save";
          this.acsFormGroup.value.acsMasterAPIMappings = this.acsParameterMappingsFromArray.value;
          this.acsFormGroup.value.acsMasterUrlParamMappingList =
            this.acsUrlParameterMappingsFromArray.value;
          this.acsData = this.acsFormGroup.value;
          this.acsManagementService.postMethod(url, this.acsData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.acsFormGroup.reset();
              this.acsParameterMappingsFromArray = this.fb.array([]);
              this.acsParameterMappingsfromgroup.reset();
              this.acsUrlParameterMappingsFromArray = this.fb.array([]);
              this.acsUrlParameterMappingsfromgroup.reset();
              this.listView = true;
              this.createView = false;

              if (this.searchkey) {
                this.searchAcs();
              } else {
                this.getAcsListData("");
              }

              if (response.responseCode !== 200) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle",
                });
              } else {
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle",
                });
              }
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
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Required ",
            detail: "Minimum one Parameter mapping Details and API mapping need to add",
            icon: "far fa-times-circle",
          });
        }
      }
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageCasSlab > 1) {
      this.currentPageCasSlab = 1;
    }
    if (!this.searchkey) {
      this.getAcsListData(this.showItemPerPage);
    } else {
      this.searchAcs();
    }
  }

  editAcs(acsId) {
    this.listView = false;
    this.createView = true;
    this.acsALLDeatilsShow = false;
    this.acsParameterMappingsFromArray = this.fb.array([]);
    this.acsParameterMappingsfromgroup.reset();
    this.acsUrlParameterMappingsFromArray = this.fb.array([]);
    this.acsUrlParameterMappingsfromgroup.reset();
    this.acsFormGroup.reset();
    if (acsId) {
      const url = "/acsMaster/" + acsId;
      this.acsManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isAcsEdit = true;
          this.viewAcsListData = response.data;
          this.acsFormGroup.patchValue(this.viewAcsListData);

          if (this.viewAcsListData.acsMasterAPIMappings.length > 0) {
            this.viewAcsListData.acsMasterAPIMappings.forEach(element => {
              this.acsParameterMappingsFromArray.push(
                this.fb.group({
                  apiMethod: [element.apiMethod],
                  apiName: [element.apiName],
                  endpoint: [element.endpoint],
                })
              );
            });
          }
          if (this.viewAcsListData.acsMasterUrlParamMappingList.length > 0) {
            this.viewAcsListData.acsMasterUrlParamMappingList.forEach(element => {
              this.acsUrlParameterMappingsFromArray.push(
                this.fb.group({
                  paramName: [element.paramName],
                  paramValue: [element.paramValue],
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
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  searchAcs() {
    if (!this.searchkey || this.searchkey !== this.searchCasName) {
      this.currentPageCasSlab = 1;
    }
    this.searchkey = this.searchCasName;
    if (this.showItemPerPage) {
      this.acsitemPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchCasName.trim();
    this.searchData.page = this.currentPageCasSlab;
    this.searchData.pageSize = this.acsitemPerPage;
    const url =
      "/acsMaster/search?page=" +
      this.currentPageCasSlab +
      "&pageSize=" +
      this.acsitemPerPage +
      "&sortBy=id&sortOrder=0";
    this.acsManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.acsListData = response.dataList;
      },
      (error: any) => {
        this.acstotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.acsListData = [];
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

  clearSearchAcs() {
    this.searchCasName = "";
    this.searchkey = "";
    this.getAcsListData("");
    this.submitted = false;
    this.isAcsEdit = false;
    this.listView = true;
    this.acsFormGroup.reset();
    this.acsParameterMappingsFromArray = this.fb.array([]);
    this.acsParameterMappingsfromgroup.reset();
    this.acsUrlParameterMappingsFromArray = this.fb.array([]);
    this.acsUrlParameterMappingsfromgroup.reset();
  }

  deleteConfirmonCas(id: number) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.title + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteAcs(id);
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

  deleteAcs(data) {
    const url = "/acsMaster/delete";
    this.acsManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          if (this.currentPageCasSlab != 1 && this.acsListData.length == 1) {
            this.currentPageCasSlab = this.currentPageCasSlab - 1;
          }
          this.clearSearchAcs();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
          if (this.searchkey) {
            this.searchAcs();
          } else {
            this.getAcsListData("");
          }
        }
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

  addParameters() {}
  pageChangedCasList(pageNumber) {
    this.currentPageCasSlab = pageNumber;
    if (this.searchkey) {
      this.searchAcs();
    } else {
      this.getAcsListData("");
    }
  }
  createParameterMappingFormGroup(): FormGroup {
    return this.fb.group({
      id: [
        this.acsParameterMappingsfromgroup.value.id
          ? this.acsParameterMappingsfromgroup.value.id
          : "",
      ],
      apiMethod: [
        this.acsParameterMappingsfromgroup.value.apiMethod
          ? this.acsParameterMappingsfromgroup.value.apiMethod
          : "",
      ],
      apiName: [this.acsParameterMappingsfromgroup.value.apiName],
      endpoint: [this.acsParameterMappingsfromgroup.value.endpoint],
    });
  }

  createUrlParameterMappingFormGroup(): FormGroup {
    return this.fb.group({
      paramName: [this.acsUrlParameterMappingsfromgroup.value.paramName],
      paramValue: [this.acsUrlParameterMappingsfromgroup.value.paramValue],
    });
  }

  onAddParameterMappingList() {
    this.submitted = true;
    if (
      this.acsParameterMappingsfromgroup.controls.apiName.value != null &&
      this.acsParameterMappingsfromgroup.controls.apiMethod.value != null &&
      this.acsParameterMappingsfromgroup.controls.endpoint.value != null
    ) {
      this.acsParameterMappingsFromArray.push(this.createParameterMappingFormGroup());
      this.acsParameterMappingsfromgroup.reset();
      this.submitted = false;
    } else {
      this.acsParameterMappingsfromgroup.reset();
    }
  }

  onAddUrlParameterMappingList() {
    this.submitted = true;
    if (
      this.acsUrlParameterMappingsfromgroup.controls.paramName.value != null &&
      this.acsUrlParameterMappingsfromgroup.controls.paramValue.value != null
    ) {
      this.acsUrlParameterMappingsFromArray.push(this.createUrlParameterMappingFormGroup());
      this.acsUrlParameterMappingsfromgroup.reset();
      this.submitted = false;
    } else {
      this.acsUrlParameterMappingsfromgroup.reset();
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
          detail: "You have rejected",
        });
      },
    });
  }

  deleteConfirmonUrlParameterMappingList(index) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Paramater?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.onRemoveUrlparameter(index);
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

  async onRemoveparameter(chargeFieldIndex: number) {
    this.acsParameterMappingsFromArray.removeAt(chargeFieldIndex);
  }

  async onRemoveUrlparameter(chargeFieldIndex: number) {
    this.acsUrlParameterMappingsFromArray.removeAt(chargeFieldIndex);
  }

  changepagePackage(page) {
    this.currentPagePackage = page;
  }

  totalItemPerPageMapping(event: any) {
    this.PackageItemPerPage = event.value;
    this.currentPagePackage = 1;
  }

  canExit() {
    if (!this.acsFormGroup.dirty) return true;
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

  getVendorListData(list) {
    const url = "/vendor/getAllVendor";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageVendorSlab;
    if (list) {
      size = list;
      this.vendoritemsPerPage = list;
    } else {
      size = this.vendoritemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.acsManagementService.postMethodVendor(url, plandata).subscribe(
      (response: any) => {
        this.vendorListData = response.dataList;
        this.vendortotalRecords = response.totalRecords;

        this.searchkey = "";
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getMethodType() {
    let url = `/commonList/generic/API_METHOD_TYPE`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.apiMethodList = response.dataList;
    });
  }

  getApiName() {
    let url = `/commonList/generic/ACS_API_NAME`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.apiNameList = response.dataList;
    });
  }

  getAcsListData(list) {
    const url = "/acsMaster";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageCasSlab;
    if (list) {
      size = list;
      this.acsitemPerPage = list;
    } else {
      size = this.acsitemPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.acsManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.apiDataList = response.dataList;
        this.acstotalRecords = response.totalRecords;

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

  getVendorInfo(event) {
    let url =
      "/acsMaster/getAcsMasterByVendorId?mvnoId=" +
      localStorage.getItem("mvnoId") +
      "&vendorId=" +
      event.value;
    this.acsManagementService.getMethod(url).subscribe((response: any) => {
      // this.apiNameList = response.dataList;
      if (response.data != null) {
        this.messageService.add({
          severity: "error",
          summary: "Error ",
          detail: "Vendor already configured.",
          icon: "far fa-times-circle",
        });
        this.acsFormGroup.controls.vendorId.reset();
      }
    });
  }

  acsAllDetails(data: any) {
    this.acsAllData = data;
    this.acsALLDeatilsShow = true;
    this.listView = false;
    this.createView = false;
  }

  listAcs() {
    this.listView = true;
    this.createView = false;
    this.acsALLDeatilsShow = false;
    this.getAcsListData("");
  }
}
