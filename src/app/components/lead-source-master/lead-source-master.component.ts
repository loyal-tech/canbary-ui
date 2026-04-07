import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { LeadSourceMasterService } from "src/app/service/lead-source-master-service";
import { LeadSource } from "../model/leadSource";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LeadSubSource } from "../model/leadSubSource";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { SALES_CRMS } from "src/app/constants/aclConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";

@Component({
  selector: "app-lead-source-master",
  templateUrl: "./lead-source-master.component.html",
  styleUrls: ["./lead-source-master.component.css"]
})
export class LeadSourceMasterComponent implements OnInit {
  leadSourceMasterFormGroup: FormGroup;
  submitted: boolean = false;
  searchLeadSourceFormGroup: FormGroup;
  statusOptions = RadiusConstants.status;
  currentLeadSourceListData = 1;
  leadSourceItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  leadSourceDataList: any = [];
  leadSourceDataListTotalRecords: string;
  isLeadSourceMasterEdit: boolean;
  showItemPerPage: any;
  createLeadSourceMasterData: LeadSource;
  editLeadSourceMasterData: any;
  viewTrscData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  leadSubSourcePageLimitOptions = RadiusConstants.pageLimitOptions;
  leadSubSourceMapping: any;
  leadSubSourceDeletedIds: any;
  leadSourceMapping: any;
  leadSubSourceMappingForm: FormGroup;
  leadSubSourceSubmitted: boolean;

  currentLeadSubSourceListData = 1;
  leadSubSourceItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  leadSubSourceDataListTotalRecords: string;

  viewLeadSubSourceListData = 1;
  viewLeadSubSourceItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewLeadSubSourceDataListTotalRecords: string;

  mvnoid: number;
  buid: number;

  searchkey: string;
  searchTrscName: any = "";
  searchData: any;
  searchSubmitted: boolean = false;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;

  mvnoId = Number(localStorage.getItem("mvnoId"));
  mvnoTitle = RadiusConstants.MVNO;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private leadSourceMasterService: LeadSourceMasterService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(SALES_CRMS.CREATE_LEAD_SOURCE);
    this.deleteAccess = loginService.hasPermission(SALES_CRMS.DELETE_LEAD_SOURCE);
    this.editAccess = loginService.hasPermission(SALES_CRMS.EDIT_LEAD_SOURCE);
  }

  ngOnInit(): void {
    this.mvnoid = Number.parseInt(localStorage.getItem("mvnoId"));

    this.leadSourceMasterFormGroup = this.fb.group({
      leadSourceName: ["", Validators.required],
      status: ["", Validators.required],
      mvnoId: [""]
    });

    const mvnoControl = this.leadSourceMasterFormGroup.get("mvnoId");

    if (this.mvnoId === 1) {
      mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();

    this.searchLeadSourceFormGroup = this.fb.group({
      searchTrscName: ["", Validators.required]
    });

    this.leadSubSourceMappingForm = this.fb.group({
      id: [""],
      leadSubSourceName: ["", Validators.required]
    });

    this.leadSubSourceMapping = this.fb.array([]);
    this.leadSubSourceDeletedIds = this.fb.array([]);
    // this.mvnoId != 1 ?
    this.getLeadSourceList("");

    this.viewTrscData = {
      buId: null,
      id: 0,
      isDelete: false,
      leadSourceName: "",
      leadSubSourceDtoList: [],
      mvnoId: null,
      status: ""
    };

    this.searchData = {
      filterBy: "",
      filters: [
        {
          filterValue: "",
          filterColumn: "leadSourceName",
          filterDataType: "",
          filterOperator: "",
          filterCondition: ""
        }
      ],
      page: this.currentLeadSourceListData,
      pageSize: this.leadSourceItemsPerPage,
      sortOrder: 0
    };
  }
  leadSourceDataLength: any = 0;
  getLeadSourceList(list, mvnoId?: any) {
    let size;
    this.searchkey = "";
    let pageList = this.currentLeadSourceListData;
    if (list) {
      size = list;
      this.leadSourceItemsPerPage = list;
    } else {
      size = this.leadSourceItemsPerPage;
    }
    let actualMvnoId = Number(localStorage.getItem("mvnoId"));
    const url =
      "/leadSource/all?page=" + pageList + "&pageSize=" + size + "&mvnoId=" + actualMvnoId;
    this.searchkey = "";
    this.leadSourceMasterService.getMethod(url).subscribe((response: any) => {
      if (response.status == 200) {
        this.leadSourceDataList = response.leadSourceList.content;
        this.leadSourceDataListTotalRecords = response.leadSourceList.totalElements;
        if (this.showItemPerPage > this.leadSourceItemsPerPage) {
          this.leadSourceDataLength = this.leadSourceDataList?.length % this.showItemPerPage;
        } else {
          this.leadSourceDataLength = this.leadSourceDataList?.length % this.leadSourceItemsPerPage;
        }
      } else {
        this.leadSourceDataList = [];
      }
    });
  }

  searchLeadSource(isPageChange: boolean = false) {
    let data: any = [];
    if (this.searchLeadSourceFormGroup.valid) {
      this.searchData.filters[0].filterColumn = "leadSourceName";
      this.searchData.filters[0].filterValue =
        this.searchLeadSourceFormGroup.controls["searchTrscName"].value.trim();
      this.searchData.page = this.currentLeadSourceListData;
      this.searchData.pageSize = this.leadSourceItemsPerPage;
      this.searchData.filterBy = this.searchData.filters[0].filterColumn;
      this.searchkey = this.searchData;
      if (!isPageChange) {
        this.currentLeadSourceListData = 1;
      }
      data = this.searchData;
      let mvnoId = Number(localStorage.getItem("mvnoId"));
      const url = "/leadSource/search?mvnoId=" + mvnoId;
      this.leadSourceMasterService.postMethod(url, data).subscribe(
        (response: any) => {
          if (response.status == 200) {
            if (response.errorMessage === "No Records Found!") {
              this.leadSourceDataList = "";
              this.leadSourceDataListTotalRecords = "";
              this.submitted = false;
              this.leadSubSourceSubmitted = false;
              this.searchSubmitted = false;
            } else {
              //   this.currentLeadSourceListData = 1;
              this.leadSourceDataList = response.leadSourceList.content;
              this.leadSourceDataListTotalRecords = response.leadSourceList.totalElements;
              this.searchSubmitted = false;
              this.submitted = false;
              this.leadSubSourceSubmitted = false;
            }
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.errorMessage,
              icon: "far fa-times-circle"
            });
            this.searchSubmitted = false;
            this.submitted = false;
            this.leadSubSourceSubmitted = false;
          }
        },
        (error: any) => {
          this.leadSourceDataListTotalRecords = "";
          if (error.status == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "Page Not Found!",
              icon: "far fa-times-circle"
            });
            this.leadSourceDataList = [];
            this.searchSubmitted = false;
            this.submitted = false;
            this.leadSubSourceSubmitted = false;
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong with the request!",
              icon: "far fa-times-circle"
            });
          }
          this.searchSubmitted = false;
          this.submitted = false;
          this.leadSubSourceSubmitted = false;
        }
      );
    } else {
      this.searchSubmitted = true;
      this.currentLeadSourceListData = 1;
      this.getLeadSourceList("");
    }
  }

  clearSearchTrsc() {
    this.searchTrscName = "";
    this.searchSubmitted = false;
    this.currentLeadSourceListData = 1;
    this.getLeadSourceList("");
    this.searchSubmitted = false;
    this.submitted = false;
    // this.onRemoveLeadSubSourceMapping(this.leadSubSourceMappingForm.value);
    this.leadSourceMasterFormGroup.reset();
    this.leadSubSourceMappingForm.reset();
    this.leadSubSourceMapping.controls = [];
    this.isLeadSourceMasterEdit = false;
  }

  pageChangedTrscList(pageNumber, idType) {
    if (idType === "leadSubSourcePageData") {
      this.viewLeadSubSourceListData = pageNumber;
    }
    if (idType === "leadSourceData") {
      this.currentLeadSourceListData = pageNumber;
      if (this.searchkey) {
        this.searchLeadSource(true);
      } else {
        this.getLeadSourceList("");
      }
    }
  }

  TotalItemPerPage(event) {
    this.currentLeadSourceListData = 1;
    this.leadSourceItemsPerPage = Number(event.value);

    if (!this.searchkey) {
      this.getLeadSourceList(this.leadSourceItemsPerPage);
    } else {
      this.searchLeadSource(true);
    }
  }

  leadSourceDetailsmodal: boolean = false;

  trscAllDetails(data) {
    this.viewTrscData = data;
    this.leadSourceDetailsmodal = true;
  }

  closeModalOfdetails() {
    this.leadSourceDetailsmodal = false;
  }

  setLeadSubSourceMappingForm(): FormGroup {
    return this.fb.group({
      leadSubSourceName: [this.leadSubSourceMappingForm.value.leadSubSourceName]
    });
  }

  onAddSubSourceMappingField() {
    this.leadSubSourceSubmitted = true;
    if (this.leadSubSourceMappingForm.valid) {
      this.leadSubSourceMapping.push(this.setLeadSubSourceMappingForm());
      this.leadSubSourceMappingForm.reset();
      this.leadSubSourceSubmitted = false;
    }
  }

  async onRemoveLeadSubSourceMapping(reasonMappingFieldIndex: number) {
    this.leadSubSourceMapping.removeAt(reasonMappingFieldIndex);
  }

  canExit() {
    if (!this.leadSourceMasterFormGroup.dirty) return true;
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
  deleteConfirmonLeadSubSourceMappingField(leadSourceMappingFieldIndex: number, id: any) {
    if (leadSourceMappingFieldIndex !== null) {
      this.confirmationService.confirm({
        message: "Do you want to delete this lead sub source?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveLeadSubSourceMapping(leadSourceMappingFieldIndex);
          if (id) this.leadSubSourceDeletedIds.push(id);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected the request!"
          });
        }
      });
    }
  }

  deleteTrsc(id) {
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.leadSourceMasterFormGroup.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/leadSource/delete?leadSourceId=" + id + "&mvnoId=" + mvnoId;
    this.leadSourceMasterService.deleteMethod(url).subscribe(
      (response: any) => {
        if (response.status == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentLeadSourceListData != 1 && this.leadSourceDataList.length == 1) {
            this.currentLeadSourceListData = this.leadSourceDataList - 1;
          }
          if (!this.searchkey) {
            this.getLeadSourceList("");
          } else {
            this.searchLeadSource(true);
          }
          this.clearLeadSourceMasterData();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
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

  deleteConfirmonLeadSourceData(id) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this lead source?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTrsc(id);
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

  addEditLeadSourceMaster(id) {
    this.submitted = true;
    if (this.leadSourceMasterFormGroup.valid) {
      if (id) {
        let mvnoId =
          localStorage.getItem("mvnoId") === "1"
            ? this.leadSourceMasterFormGroup.value?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        const url = "/leadSource/update/" + id + "?mvnoId=" + mvnoId;
        let dataObj: any;
        dataObj = {
          id: this.editLeadSourceMasterData.id,
          leadSourceName: this.editLeadSourceMasterData.leadSourceName,
          status: this.editLeadSourceMasterData.status,
          leadSubSourceDtoList: this.editLeadSourceMasterData.leadSubSourceList,
          leadSubSourceDeletedIds: [],
          mvnoId: this.editLeadSourceMasterData.mvnoId,
          buId: this.editLeadSourceMasterData.buId
        };
        dataObj.id = id;
        dataObj.leadSourceName = this.leadSourceMasterFormGroup.value.leadSourceName;
        dataObj.status = this.leadSourceMasterFormGroup.value.status;
        let subSourceArray: any = [];
        let deletedSubsource: any = [];

        for (let j = 0; j < this.leadSubSourceDeletedIds.value.length; j++) {
          if (dataObj.leadSubSourceDtoList.length > 0) {
            dataObj.leadSubSourceDtoList.forEach((entity: any) =>
              entity.id === this.leadSubSourceDeletedIds.value[j]
                ? deletedSubsource.push(entity.id)
                : ""
            );
          }
        }
        if (this.leadSubSourceMapping.value.length > 0) {
          for (let i = 0; i < this.leadSubSourceMapping.value.length; i++) {
            let myList: LeadSubSource = {
              id: this.leadSubSourceMapping.value[i].id,
              name: this.leadSubSourceMapping.value[i].leadSubSourceName,
              leadSourceId: dataObj.id
            };
            subSourceArray.push(myList);
          }
        }

        dataObj.leadSubSourceDtoList = subSourceArray;
        dataObj.leadSubSourceDeletedIds = deletedSubsource;

        this.leadSourceMasterService.updateMethod(url, dataObj).subscribe(
          response => {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              //detail: "Update successfully",
              icon: "far fa-check-circle"
            });
            this.leadSubSourceDeletedIds.value = [];
            this.leadSourceMasterFormGroup.reset();
            this.leadSubSourceMappingForm.reset();
            this.leadSubSourceMapping.controls = [];
            this.isLeadSourceMasterEdit = false;
            this.leadSubSourceSubmitted = false;
            this.searchSubmitted = false;
            this.submitted = false;
            this.getLeadSourceList("");
          },
          error => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
            this.leadSubSourceDeletedIds.value = [];
            this.leadSourceMasterFormGroup.reset();
            this.leadSubSourceMappingForm.reset();
            this.leadSubSourceMapping.controls = [];
            this.isLeadSourceMasterEdit = false;
            this.leadSubSourceSubmitted = false;
            this.searchSubmitted = false;
            this.submitted = false;
            this.getLeadSourceList("");
          }
        );
      } else {
        const url = "/leadSource/save";
        this.createLeadSourceMasterData = this.leadSourceMasterFormGroup.value;
        this.createLeadSourceMasterData.mvnoId =
          localStorage.getItem("mvnoId") === "1"
            ? this.leadSourceMasterFormGroup.value?.mvnoId
            : localStorage.getItem("mvnoId");
        this.createLeadSourceMasterData.leadSubSourceDtoList = [];

        if (this.leadSubSourceMapping.length > 0) {
          for (let i = 0; i < this.leadSubSourceMapping.controls.length; i++) {
            let myList: LeadSubSource = {
              id: null,
              name: this.leadSubSourceMapping.controls[i].value.leadSubSourceName,
              leadSourceId: null
            };

            this.createLeadSourceMasterData.leadSubSourceDtoList.push(myList);
          }
        }

        this.leadSourceMasterService.postMethod(url, this.createLeadSourceMasterData).subscribe(
          (response: any) => {
            if (response.status === 200) {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                //detail: response.message,
                icon: "far fa-check-circle"
              });
              this.leadSubSourceDeletedIds.value = [];
              this.leadSourceMasterFormGroup.reset();
              this.leadSubSourceMappingForm.reset();
              this.leadSubSourceMapping.controls = [];
              this.leadSubSourceSubmitted = false;
              this.submitted = false;
              this.isLeadSourceMasterEdit = false;
              this.searchSubmitted = false;
              this.getLeadSourceList("");
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.errorMessage,
                icon: "far fa-times-circle"
              });
              this.leadSubSourceDeletedIds.value = [];
              this.leadSourceMasterFormGroup.reset();
              this.leadSubSourceMappingForm.reset();
              this.leadSubSourceMapping.controls = [];
              this.leadSubSourceSubmitted = false;
              this.submitted = false;
              this.isLeadSourceMasterEdit = false;
              this.searchSubmitted = false;
              this.getLeadSourceList("");
            }
          },
          (error: any) => {
            if(error.status === 500){
              this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
            }
            else{
              this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
            }
            
            this.leadSubSourceDeletedIds.value = [];
            this.leadSourceMasterFormGroup.reset();
            this.leadSubSourceMappingForm.reset();
            this.leadSubSourceMapping.controls = [];
            this.leadSubSourceSubmitted = false;
            this.submitted = false;
            this.isLeadSourceMasterEdit = false;
            this.searchSubmitted = false;
            this.getLeadSourceList("");
          }
        );
      }
    }
  }

  clearLeadSourceMasterData() {
    this.leadSourceMasterFormGroup.reset();
    this.submitted = false;
    this.searchSubmitted = false;
    this.leadSubSourceSubmitted = false;
    this.isLeadSourceMasterEdit = false;
    this.leadSubSourceMapping.controls = [];
    this.searchSubmitted = false;
    this.getLeadSourceList("");
  }

  editLeadSourceMasterDataFunction(id) {
    this.leadSourceMasterFormGroup.reset();
    this.leadSubSourceMappingForm.reset();
    this.isLeadSourceMasterEdit = true;

    if (this.leadSubSourceMapping.controls) {
      this.leadSubSourceMapping.controls = [];
    }
    const url = "/leadSource/findById?leadSourceid=" + id;
    this.leadSourceMasterService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.editLeadSourceMasterData = response.leadSource;
          this.leadSourceMasterFormGroup.patchValue({
            leadSourceName: this.editLeadSourceMasterData.leadSourceName,
            status: this.editLeadSourceMasterData.status,
            mvnoId: this.editLeadSourceMasterData.mvnoId
          });

          this.leadSourceMapping = this.fb.array([]);
          this.editLeadSourceMasterData.leadSubSourceList.forEach(element => {
            this.leadSubSourceMapping.push(this.fb.group(element));
          });
          this.leadSubSourceMappingForm.patchValue(this.editLeadSourceMasterData.leadSubSourceList);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
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

  LeadSubTotalItemPerPage(event) {
    this.currentLeadSubSourceListData = 1;
    this.leadSubSourceItemsPerPage = Number(event.value);
  }

  leadSubsourcePageChanged(pageNumber: any) {
    this.currentLeadSubSourceListData = pageNumber;
  }

  mvnoChange(event) {
    // this.getLeadSourceList(event.value);
  }
}
