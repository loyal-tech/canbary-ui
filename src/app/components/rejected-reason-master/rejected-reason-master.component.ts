import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RejectedReason } from "../model/rejectedReason";
import { RejectedReasonService } from "src/app/service/rejected-reason.service";
import { RejectedSubReason } from "../model/rejectedSubReason";
import { PaginationDto } from "../model/paginationDto";
import { GenericSearchModel } from "../model/GenericSearchModel";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { SALES_CRMS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-rejected-reason-master",
  templateUrl: "./rejected-reason-master.component.html",
  styleUrls: ["./rejected-reason-master.component.css"]
})
export class RejectedReasonMasterComponent implements OnInit {
  rejectedReasonMasterFormGroup: FormGroup;
  submitted: boolean = false;
  searchSubmitted: boolean = false;
  statusOptions = RadiusConstants.status;
  currentRejectedReasonListData = 1;
  rejectedReasonItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  rejectedReasonDataList: any = [];
  rejectedReasonDataListTotalRecords: string;
  isRejectedReasonMasterEdit: boolean = false;
  showItemPerPage: any;
  createRejectedReasonMasterData: RejectedReason;
  editRejectedReasonMasterData: any;
  viewTrscData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  leadSubSourcePageLimitOptions = RadiusConstants.pageLimitOptions;
  rejectedSubReasonMapping: any;
  rejectedReasonMapping: any;
  rejecteSubReasonMappingForm: FormGroup;
  rejectedSubReasonSubmitted: boolean = false;
  currentRejectedSubReasonListData = 1;
  rejectedSubReasonItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  rejectedSubReasonDataListTotalRecords: string;
  searchRejectedReasonFormGroup: FormGroup;
  rejectedSubReasonDeletedIds: any;
  viewrejectedSubReasonListData = 1;
  viewrejectedSubReasonItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewrejectedSubReasonDataListTotalRecords: string;

  searchkey: any;
  searchTrscName: any = "";
  searchData: any;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private rejectedReasonService: RejectedReasonService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(SALES_CRMS.CREATE_REJECTED_REASON);
    this.deleteAccess = loginService.hasPermission(SALES_CRMS.DELETE_REJECTED_REASON);
    this.editAccess = loginService.hasPermission(SALES_CRMS.EDIT_REJECTED_REASON);
  }

  ngOnInit(): void {
    // this.mvnoid = Number.parseInt(localStorage.getItem('mvnoId'));

    this.rejectedReasonMasterFormGroup = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required]
    });

    this.rejecteSubReasonMappingForm = this.fb.group({
      name: ["", Validators.required]
    });

    this.searchRejectedReasonFormGroup = this.fb.group({
      searchTrscName: ["", Validators.required]
    });

    this.rejectedSubReasonMapping = this.fb.array([]);
    this.rejectedSubReasonDeletedIds = this.fb.array([]);

    this.searchData = {
      page: this.currentRejectedReasonListData,
      pageSize: this.rejectedReasonItemsPerPage,
      sortOrder: 0,
      filters: [
        {
          filterColumn: "name",
          filterValue: "",
          filterDataType: "",
          filterOperator: "",
          filterCondition: ""
        }
      ],
      filterBy: ""
    };

    this.getRejectedReasonList("");

    this.viewTrscData = {
      buId: null,
      id: 0,
      isDelete: false,
      name: "",
      rejectSubReasonDtoList: [],
      mvnoId: null,
      status: ""
    };
  }

  getRejectedReasonList(list: any) {
    let size;
    this.searchkey = "";
    let pageList = this.currentRejectedReasonListData;
    if (list) {
      size = list;
      this.rejectedReasonItemsPerPage = list;
    } else {
      size = this.rejectedReasonItemsPerPage;
    }

    const url =
      "/rejectReason/all?page=" +
      pageList +
      "&pageSize=" +
      size +
      "&mvnoId=" +
      localStorage.getItem("mvnoId");
    this.searchkey = "";

    this.rejectedReasonService.getMethod(url).subscribe((response: any) => {
      if (response.status == 200) {
        this.rejectedReasonDataList = response.rejectReasonList.content;
        this.rejectedReasonDataListTotalRecords = response.rejectReasonList.totalElements;
      } else {
        this.rejectedReasonDataList = [];
      }
    });
  }

  searchRejectedReason() {
    this.searchSubmitted = true;
    if (this.searchRejectedReasonFormGroup.valid) {
      let data: any = [];
      this.searchData.filters[0].filterColumn = "name";
      this.searchData.filters[0].filterValue =
        this.searchRejectedReasonFormGroup.controls["searchTrscName"].value.trim();
      this.searchData.page = this.currentRejectedReasonListData;
      this.searchData.pageSize = this.rejectedReasonItemsPerPage;
      this.searchData.filterBy = this.searchData.filters[0].filterColumn;

      data = this.searchData;

      const url = "/rejectReason/search?mvnoId=" + localStorage.getItem("mvnoId");
      this.rejectedReasonService.postMethod(url, data).subscribe(
        (response: any) => {
          if (response.status == 200) {
            if (response.message) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.message,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Record fetched successfully",
                icon: "far fa-times-circle"
              });
            }
            this.rejectedReasonDataList = response.rejectReasonList.content;
            this.rejectedReasonDataListTotalRecords = response.rejectReasonList.totalElements;

            this.submitted = false;
            this.rejectedSubReasonSubmitted = false;
            this.searchSubmitted = false;
          } else {
            this.getRejectedReasonList("");
            this.submitted = false;
            this.rejectedSubReasonSubmitted = false;
            this.searchSubmitted = false;
          }
        },
        (error: any) => {
          this.rejectedReasonDataListTotalRecords = "";
          if (error.status == 404) {
            this.getRejectedReasonList("");

            this.submitted = false;
            this.rejectedSubReasonSubmitted = false;
            this.searchSubmitted = false;
          } else {
            this.getRejectedReasonList("");

            this.submitted = false;
            this.rejectedSubReasonSubmitted = false;
            this.searchSubmitted = false;
          }
        }
      );
    } else {
      this.searchRejectedReasonFormGroup.reset();
      this.getRejectedReasonList("");
    }
  }

  clearSearchTrsc() {
    this.searchTrscName = "";
    this.getRejectedReasonList("");
    this.submitted = false;
    this.rejectedSubReasonSubmitted = false;
    this.searchSubmitted = false;
    this.onRemoveRejectedSubReasonMapping(this.rejecteSubReasonMappingForm.value);
    this.rejectedReasonMasterFormGroup.reset();
    this.rejecteSubReasonMappingForm.reset();
  }

  pageChangedTrscList(pageNumber) {
    this.currentRejectedReasonListData = pageNumber;
    if (this.searchkey) {
      this.searchRejectedReason();
    } else {
      this.getRejectedReasonList("");
    }
  }

  pageChangedleadSubSourceOnView(pageNumber) {
    this.viewrejectedSubReasonListData = pageNumber;
    // this.trscAllDetails('');
  }

  TotalItemPerPage(event) {
    this.currentRejectedReasonListData = 1;
    this.rejectedReasonItemsPerPage = Number(event.value);

    if (!this.searchkey) {
      this.getRejectedReasonList(this.rejectedReasonItemsPerPage);
    } else {
      this.searchRejectedReason();
    }
  }

  trscAllDetails(data) {
    this.viewTrscData = data;
  }

  setRejectedSubReasonMappingForm(): FormGroup {
    return this.fb.group({
      name: [this.rejecteSubReasonMappingForm.value.name]
    });
  }

  onAddRejectedSubReasonMappingField() {
    this.rejectedSubReasonSubmitted = true;
    if (this.rejecteSubReasonMappingForm.valid) {
      this.rejectedSubReasonMapping.push(this.setRejectedSubReasonMappingForm());
      this.rejecteSubReasonMappingForm.reset();
      this.rejectedSubReasonSubmitted = false;
    }
  }

  async onRemoveRejectedSubReasonMapping(reasonMappingFieldIndex: number) {
    this.rejectedSubReasonMapping.removeAt(reasonMappingFieldIndex);
  }

  deleteConfirmonRejectedSubReasonMappingField(rejectedReasonMappingFieldIndex: number, id: any) {
    if (rejectedReasonMappingFieldIndex !== null) {
      this.confirmationService.confirm({
        message: "Do you want to delete this rejected Sub Reason?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveRejectedSubReasonMapping(rejectedReasonMappingFieldIndex);
          if (id) this.rejectedSubReasonDeletedIds.push(id);
          if (this.rejectedSubReasonMapping.length <= 5) this.currentRejectedSubReasonListData = 1;
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
    const url =
      "/rejectReason/delete?rejectReasonId=" + id + "&mvnoId=" + localStorage.getItem("mvnoId");
    this.rejectedReasonService.deleteMethod(url).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
        }
        if (this.currentRejectedReasonListData != 1 && this.rejectedReasonDataList?.length == 1) {
          this.currentRejectedReasonListData = this.rejectedReasonDataList - 1;
        }
        this.clearRejectedReasonMasterData();
        this.getRejectedReasonList("");
      },
      (error: any) => {
        if (error.status === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage
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

  deleteConfirmonRejectedReasonData(id) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this rejected reason?",
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

  addEditRejectedReasonMaster(id) {
    this.submitted = true;
    if (this.rejectedReasonMasterFormGroup.valid) {
      if (id) {
        const url = "/rejectReason/update/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
        let dataObj: any;
        dataObj = {
          id: this.editRejectedReasonMasterData.id,
          name: this.editRejectedReasonMasterData.name,
          status: this.editRejectedReasonMasterData.status,
          rejectSubReasonDtoList: this.editRejectedReasonMasterData.rejectSubReasonDtoList,
          rejectSubReasonDeletedIds: []
        };
        dataObj.id = id;
        dataObj.name = this.rejectedReasonMasterFormGroup.value.name;
        dataObj.status = this.rejectedReasonMasterFormGroup.value.status;
        let subSourceArray: any = [];
        let deletedSubsource: any = [];

        for (let j = 0; j < this.rejectedSubReasonDeletedIds.value?.length; j++) {
          if (dataObj.rejectSubReasonDtoList?.length > 0) {
            dataObj.rejectSubReasonDtoList.forEach((entity: any) =>
              entity.id === this.rejectedSubReasonDeletedIds.value[j]
                ? deletedSubsource.push(entity.id)
                : ""
            );
          }
        }
        if (this.rejectedSubReasonMapping.value?.length > 0) {
          for (let i = 0; i < this.rejectedSubReasonMapping.value?.length; i++) {
            let myList: RejectedSubReason = {
              id: this.rejectedSubReasonMapping.value[i].id,
              name: this.rejectedSubReasonMapping.value[i].name,
              rejectReasonId: dataObj.id
            };
            subSourceArray.push(myList);
          }
        }

        // this.createLeadSourceMasterData.leadSubSourceDtoList = this.leadSubSourceMapping.value;
        dataObj.rejectSubReasonDtoList = subSourceArray;
        dataObj.rejectSubReasonDeletedIds = deletedSubsource;

        this.rejectedReasonService.updateMethod(url, dataObj).subscribe(
          (response: any) => {
            if (response.status === 200) {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                // detail: "Update Successfull",
                icon: "far fa-check-circle"
              });
              this.getRejectedReasonList("");
              this.rejectedReasonMasterFormGroup.reset();
              this.rejecteSubReasonMappingForm.reset();
              this.rejectedSubReasonMapping.controls = [];
              this.isRejectedReasonMasterEdit = false;
              this.submitted = false;
              this.rejectedSubReasonSubmitted = false;
              this.searchSubmitted = false;
            }
            if (response.status === 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.errorMessage,
                icon: "far fa-times-circle"
              });
              this.getRejectedReasonList("");
              this.rejectedReasonMasterFormGroup.reset();
              this.rejecteSubReasonMappingForm.reset();
              this.rejectedSubReasonMapping.controls = [];
              this.isRejectedReasonMasterEdit = false;
              this.submitted = false;
              this.rejectedSubReasonSubmitted = false;
              this.searchSubmitted = false;
            }
          },
          error => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
            this.getRejectedReasonList("");
            this.rejectedReasonMasterFormGroup.reset();
            this.rejecteSubReasonMappingForm.reset();
            this.rejectedSubReasonMapping.controls = [];
            this.isRejectedReasonMasterEdit = false;
            this.submitted = false;
            this.rejectedSubReasonSubmitted = false;
            this.searchSubmitted = false;
          }
        );
        // }
      } else {
        const url = "/rejectReason/save?mvnoId=" + localStorage.getItem("mvnoId");

        this.createRejectedReasonMasterData = this.rejectedReasonMasterFormGroup.value;
        this.createRejectedReasonMasterData.rejectSubReasonDtoList = [];
        if (this.rejectedSubReasonMapping?.length > 0) {
          for (let i = 0; i < this.rejectedSubReasonMapping.controls?.length; i++) {
            let myList: RejectedSubReason = {
              id: null,
              name: this.rejectedSubReasonMapping.controls[i].value.name,
              rejectReasonId: null
            };

            this.createRejectedReasonMasterData.rejectSubReasonDtoList.push(myList);
          }
        }

        this.rejectedReasonService.postMethod(url, this.createRejectedReasonMasterData).subscribe(
          (response: any) => {
            if (response.status === 200) {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                //detail: response.message,
                icon: "far fa-check-circle"
              });

              this.getRejectedReasonList("");
              this.rejectedReasonMasterFormGroup.reset();
              this.rejecteSubReasonMappingForm.reset();
              this.rejectedSubReasonMapping.controls = [];
              this.isRejectedReasonMasterEdit = false;
              this.submitted = false;
              this.rejectedSubReasonSubmitted = false;
              this.searchSubmitted = false;
            }
            if (response.status === 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.errorMessage,
                icon: "far fa-times-circle"
              });
              this.getRejectedReasonList("");
              this.rejectedReasonMasterFormGroup.reset();
              this.rejecteSubReasonMappingForm.reset();
              this.rejectedSubReasonMapping.controls = [];
              this.isRejectedReasonMasterEdit = false;
              this.submitted = false;
              this.rejectedSubReasonSubmitted = false;
              this.searchSubmitted = false;
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
            this.getRejectedReasonList("");
            this.rejectedReasonMasterFormGroup.reset();
            this.rejecteSubReasonMappingForm.reset();
            this.rejectedSubReasonMapping.controls = [];
            this.isRejectedReasonMasterEdit = false;
            this.submitted = false;
            this.rejectedSubReasonSubmitted = false;
            this.searchSubmitted = false;
          }
        );
      }
    }
  }

  clearRejectedReasonMasterData() {
    this.rejectedReasonMasterFormGroup.reset();
    this.submitted = false;
    this.rejectedSubReasonSubmitted = false;
    this.searchSubmitted = false;
    this.rejectedSubReasonMapping.controls = [];
    this.getRejectedReasonList("");
  }

  editRejectedReasonMasterDataFunction(id) {
    this.rejectedReasonMasterFormGroup.reset();
    this.rejectedSubReasonMapping.reset();
    this.isRejectedReasonMasterEdit = true;

    if (this.rejectedSubReasonMapping.controls) {
      this.rejectedSubReasonMapping.controls = [];
    }
    const url =
      "/rejectReason/findById?rejectReasonId=" + id + "&mvnoId=" + localStorage.getItem("mvnoId");
    this.rejectedReasonService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.editRejectedReasonMasterData = response.rejectReason;
          this.rejectedReasonMasterFormGroup.patchValue({
            name: this.editRejectedReasonMasterData.name,
            status: this.editRejectedReasonMasterData.status
          });

          this.rejectedReasonMapping = this.fb.array([]);
          if (this.editRejectedReasonMasterData.rejectSubReasonDtoList) {
            this.editRejectedReasonMasterData.rejectSubReasonDtoList.forEach(element => {
              this.rejectedSubReasonMapping.push(this.fb.group(element));
            });
            this.rejecteSubReasonMappingForm.patchValue(
              this.editRejectedReasonMasterData.rejectSubReasonDtoList
            );
          }
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
    this.currentRejectedSubReasonListData = 1;
    this.rejectedSubReasonItemsPerPage = Number(event.value);
  }

  pageChangedRejectedSubReason(pageNumber) {
    this.currentRejectedSubReasonListData = pageNumber;
  }

  canExit() {
    if (!this.rejectedReasonMasterFormGroup.dirty) return true;
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
}
