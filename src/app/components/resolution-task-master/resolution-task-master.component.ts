import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ResolutionMasterService } from "src/app/service/resolution-master.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { TASK_SYSTEMS, TICKETING_SYSTEMS } from "src/app/constants/aclConstants";
import { saveAs as importedSaveAs } from "file-saver";
import { DomSanitizer } from "@angular/platform-browser";
import { ResolutionTaskMasterService } from "src/app/service/resolution-task-master.service";

@Component({
  selector: "app-resolution-task-master",
  templateUrl: "./resolution-task-master.component.html",
  styleUrls: ["./resolution-task-master.component.css"]
})
export class ResolutionTaskMasterComponent implements OnInit {
  resolutionMasterGroupForm: FormGroup;
  submitted = false;
  createResolutionMasterData: any;
  resolutionMasterDataList: any;
  currentPageResoluionMasterListdata = 1;
  resoluionMasterListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  resoluionMasterListdatatotalRecords: any;
  viewResolutionData: any;
  deletedata: any = {
    id: "",
    name: "",
    status: ""
  };

  statusOptions = RadiusConstants.status;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  totalAreaListLength = 0;

  isResolutionEdit = false;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  rootCauseReasonMappingForm: FormGroup;

  rootCauseReasonMappingSubmitted: boolean;

  rootCauseReasonMapping: FormArray;
  currentPageReasonMapping = 1;
  currentPageSubReasonMapping = 1;
  reasonMappingItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  subReasonMappingItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  reasonMappingTotalRecords: string;
  subReasonMappingTotalRecords: string;
  listView: Boolean = false;
  currentPageRootCauseListdata = 1;
  searchData: any;
  rootCauseitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchRootCauseName: any = "";
  rootCauseListDatatotalRecords: any;
  rootCauseListData: any;
  ticketReasonSubCategoryListData: any;
  createView: boolean;
  detailView: boolean;

  rootCauseSubReasonMappingForm: FormGroup;
  rootCauseSubReasonMapping: FormArray;

  rootCauseSubReasonMappingSubmitted: boolean;

  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  pageItem;
  uploadDocForm: FormGroup;
  uploadDocumentId: boolean = false;
  selectedFile: any;
  rootCauseId: number;
  selectedFileUploadPreview: File[] = [];
  resolutionIdData: any;
  resolutionBaseFileData: any;
  downloadDocumentId: boolean = false;
  previewUrl: any;
  previewType: string = "";
  documentPreview: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private resolutionTaskMasterService: ResolutionTaskMasterService,
    loginService: LoginService,
    private sanitizer: DomSanitizer
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(TASK_SYSTEMS.ROOT_CAUSE_CREATE);
    this.deleteAccess = loginService.hasPermission(TASK_SYSTEMS.ROOT_CAUSE_DELETE);
    this.editAccess = loginService.hasPermission(TASK_SYSTEMS.ROOT_CAUSE_EDIT);

    // this.isResolutionEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.resolutionMasterGroupForm = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required]
    });
    this.rootCauseReasonMappingForm = this.fb.group({
      id: [""],
      rootCauseReason: ["", Validators.required],
      resolutionId: [""]
    });
    this.rootCauseSubReasonMappingForm = this.fb.group({
      id: [""],
      caseCategoryId: ["", Validators.required],
      resId: [""]
    });
    this.uploadDocForm = this.fb.group({
      file: ["", Validators.required]
    });

    this.getResolutionMaster("");
    this.getTicketReasonSubCategoryDataList();
    this.rootCauseReasonMapping = this.fb.array([]);
    this.rootCauseSubReasonMapping = this.fb.array([]);
    this.listView = true;
    this.searchData = {
      filters: [
        {
          filterValue: "",
          filterColumn: "any"
        }
      ],
      page: "",
      pageSize: "",
      sortBy: "createdate",
      sortOrder: 0
    };
  }

  pageChangedData(number) {
    this.currentPageReasonMapping = number;
  }

  TotalItemPerPage(event): void {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageResoluionMasterListdata > 1) {
      this.currentPageResoluionMasterListdata = 1;
    }
    if (!this.searchkey) {
      this.getResolutionMaster(this.showItemPerPage);
    }
  }

  getResolutionMaster(list): void {
    let size;
    this.searchkey = "";
    const pageList = this.currentPageResoluionMasterListdata;
    if (list) {
      size = list;
      this.resoluionMasterListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.resoluionMasterListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.resoluionMasterListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.resoluionMasterListdataitemsPerPage;
    }

    const url = "/resolutionReasons";
    const resolutionmasterdata = {
      page: pageList,
      pageSize: size
    };
    this.resolutionTaskMasterService.postMethod(url, resolutionmasterdata).subscribe(
      (response: any) => {
        this.resolutionMasterDataList = response.dataList;
        this.resoluionMasterListdatatotalRecords = response.totalRecords;
        // if (this.showItemPerPage > this.resoluionMasterListdataitemsPerPage) {
        //   this.totalAreaListLength =
        //     this.resolutionMasterDataList.length % this.showItemPerPage
        // } else {
        //   this.totalAreaListLength =
        //     this.resolutionMasterDataList.length %
        //     this.resoluionMasterListdataitemsPerPage
        // }
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

  validateText() {
    this.resolutionMasterGroupForm.value.name = this.resolutionMasterGroupForm.value.name.trim();
    if (
      this.resolutionMasterGroupForm.value.name == "" ||
      this.resolutionMasterGroupForm.value.name == null
    ) {
      this.resolutionMasterGroupForm.patchValue({ name: "" });
    }
  }

  addEditResolutionMaster(resolutionMasterId): void {
    this.submitted = true;
    if (this.rootCauseReasonMapping.value.length <= 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Resolution is required please add atleast one.",
        icon: "far fa-times-circle"
      });
      return;
    }
    if (this.rootCauseSubReasonMapping.value.length <= 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Sub Problem Domain is required please add atleast one.",
        icon: "far fa-times-circle"
      });
      return;
    }
    if (this.resolutionMasterGroupForm.valid) {
      if (resolutionMasterId) {
        const url = "/resolutionReasons/update";
        this.viewResolutionData = this.resolutionMasterGroupForm.value;
        this.viewResolutionData.rootCauseResolutionMappingList = this.rootCauseReasonMapping.value;
        this.viewResolutionData.resoSubCategoryMappingList = this.rootCauseSubReasonMapping.value;
        this.viewResolutionData.rootCauseResolutionMappingList.forEach(e => {
          e.resolutionId = resolutionMasterId;
        });
        this.viewResolutionData.id = resolutionMasterId;
        if (
          this.rootCauseReasonMapping.value.length > 0 &&
          this.rootCauseSubReasonMapping.value.length > 0
        ) {
          this.resolutionTaskMasterService.postMethod(url, this.viewResolutionData).subscribe(
            (response: any) => {
              if (
                response.responseCode === 406 ||
                response.responseCode === 417 ||
                response.responseCode === 500
              ) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else {
                this.submitted = false;
                this.searchViewTrc();
                this.rootCauseReasonMapping = this.fb.array([]);
                this.rootCauseReasonMappingSubmitted = false;
                this.resolutionMasterGroupForm.reset();
                this.rootCauseSubReasonMapping = this.fb.array([]);
                this.rootCauseSubReasonMappingSubmitted = false;
                // this.resolutionMasterGroupForm.reset();
                this.getResolutionMaster("");
                this.isResolutionEdit = false;
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
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          );
        } else {
          if (this.rootCauseReasonMapping.value.length == 0) {
            this.messageService.add({
              severity: "error",
              summary: "Required ",
              detail: "Minimum one Resolution Details need to add.",
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Required ",
              detail: "Minimum one Sub Problem Domain need to add.",
              icon: "far fa-times-circle"
            });
          }
        }
      } else {
        const url = "/resolutionReasons/save";
        this.createResolutionMasterData = this.resolutionMasterGroupForm.value;
        this.createResolutionMasterData.rootCauseResolutionMappingList =
          this.rootCauseReasonMapping.value;
        this.createResolutionMasterData.resoSubCategoryMappingList =
          this.rootCauseSubReasonMapping.value;
        this.createResolutionMasterData.isDeleted = false;
        if (
          this.rootCauseReasonMapping.value.length > 0 &&
          this.rootCauseSubReasonMapping.value.length > 0
        ) {
          this.resolutionTaskMasterService
            .postMethod(url, this.createResolutionMasterData)
            .subscribe(
              (response: any) => {
                if (response.responseCode === 406) {
                  this.messageService.add({
                    severity: "info",
                    summary: "Info",
                    detail: response.responseMessage,
                    icon: "far fa-times-circle"
                  });
                } else {
                  this.submitted = false;
                  this.searchViewTrc();
                  this.resolutionMasterGroupForm.reset();
                  this.rootCauseReasonMappingSubmitted = false;
                  this.rootCauseReasonMapping = this.fb.array([]);
                  this.rootCauseSubReasonMapping = this.fb.array([]);
                  this.getResolutionMaster("");
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
                  detail: error.error.ERROR,
                  icon: "far fa-times-circle"
                });
              }
            );
        } else {
          if (this.rootCauseReasonMapping.value.length == 0) {
            this.messageService.add({
              severity: "error",
              summary: "Required ",
              detail: "Minimum one Resolution Details need to add.",
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Required ",
              detail: "Minimum one Sub Problem Domain need to add.",
              icon: "far fa-times-circle"
            });
          }
        }
      }
    }
  }

  editResolution(resolutionId): void {
    if (resolutionId) {
      this.isResolutionEdit = true;
      // this.getResolutionById(resolutionId)
      // setTimeout(() => {
      //   this.resolutionMasterGroupForm.patchValue(this.viewResolutionData)
      // }, 1000)

      const url = "/resolutionReasons/" + resolutionId;
      this.resolutionTaskMasterService.getMethod(url).subscribe(
        (response: any) => {
          this.createView = true;
          this.listView = false;
          this.viewResolutionData = response.data;
          this.rootCauseReasonMappingForm.reset();
          this.rootCauseSubReasonMapping = this.fb.array([]);
          this.rootCauseSubReasonMappingForm.reset();
          this.rootCauseReasonMapping = this.fb.array([]);
          this.resolutionMasterGroupForm.patchValue(response.data);
          this.viewResolutionData.rootCauseResolutionMappingList.forEach(e => {
            this.rootCauseReasonMapping.push(this.fb.group(e));
          });
          this.viewResolutionData.resoSubCategoryMappingList.forEach(e => {
            this.rootCauseSubReasonMapping.push(this.fb.group(e));
          });
          // this.rootCauseReasonMapping.patchValue(
          //     this.viewResolutionData.ticketSubCategoryGroupReasonMappingList
          // );
          this.deletedata = this.viewResolutionData;
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
  }

  async getResolutionById(resolutionId): Promise<void> {
    const url = "/resolutionReasons/" + resolutionId;
    this.resolutionTaskMasterService.getMethod(url).subscribe(
      (response: any) => {
        this.viewResolutionData = response.data;
        this.deletedata = this.viewResolutionData;
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

  deleteConfirmonResolution(resolutionId): void {
    this.getResolutionById(resolutionId);
    setTimeout(() => {
      if (resolutionId) {
        this.confirmationService.confirm({
          message: "Do you want to delete this Root Cause?",
          header: "Delete Confirmation",
          icon: "pi pi-info-circle",
          accept: () => {
            this.deleteResolution(resolutionId);
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
    }, 500);
  }

  deleteResolution(resolutionId): void {
    const url = "/resolutionReasons/delete";
    this.resolutionTaskMasterService.postMethod(url, this.deletedata).subscribe(
      (response: any) => {
        if (response.responseCode !== 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPageResoluionMasterListdata !== 1 && this.totalAreaListLength === 1) {
            this.currentPageResoluionMasterListdata = this.currentPageResoluionMasterListdata - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.submitted = false;
          this.resolutionMasterGroupForm.reset();
          this.rootCauseReasonMappingSubmitted = false;
          this.rootCauseReasonMapping = this.fb.array([]);
          this.rootCauseSubReasonMappingSubmitted = false;
          this.rootCauseSubReasonMapping = this.fb.array([]);

          // this.submitted = false;
          // this.rootCauseReasonMapping = this.fb.array([]);
          // this.rootCauseReasonMappingSubmitted = false;
          // this.resolutionMasterGroupForm.reset();
          this.isResolutionEdit = false;

          this.getResolutionMaster("");
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

  pageChangedResolutionMasterList(pageNumber): void {
    this.currentPageResoluionMasterListdata = pageNumber;

    this.getResolutionMaster("");
  }

  rootCauseReasonMappingFormGroup(): FormGroup {
    return this.fb.group({
      rootCauseReason: [
        this.rootCauseReasonMappingForm.value.rootCauseReason,
        [Validators.required]
      ],
      resolutionId: [""]
    });
  }

  onAddRootCauseReasonMappingField(): void {
    this.rootCauseReasonMappingSubmitted = true;
    if (this.rootCauseReasonMappingForm.valid) {
      this.rootCauseReasonMapping.push(this.rootCauseReasonMappingFormGroup());
      this.rootCauseReasonMappingForm.reset();
      this.rootCauseReasonMappingSubmitted = false;
    }
  }

  async onRemoveRootCauseReasonMapping(
    reasonMappingFieldIndex: number,
    reasonMappingFieldId: number
  ): Promise<void> {
    this.rootCauseReasonMapping.removeAt(reasonMappingFieldIndex);
  }

  searchTrc() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPageResoluionMasterListdata = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage) {
      this.resoluionMasterListdataitemsPerPage = this.showItemPerPage;
    }
    let data: any = [];
    this.searchData.filters[0].filterColumn = "any";
    this.searchData.filters[0].filterValue = this.searchRootCauseName.trim();
    this.searchData.page = this.currentPageResoluionMasterListdata;
    this.searchData.pageSize = this.resoluionMasterListdataitemsPerPage;
    data = this.searchData;

    // console.log("this.searchData", this.searchData)
    const url = "/resolutionReasons/searchAll";
    this.resolutionTaskMasterService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response?.dataList?.length > 0) {
          this.resolutionMasterDataList = response.dataList;
          this.resoluionMasterListdatatotalRecords = response.totalRecords;
        } else {
          this.resolutionMasterDataList = [];
          this.resoluionMasterListdatatotalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Record Found",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.resoluionMasterListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.resolutionMasterDataList = [];
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

  clearSearchTrc() {
    this.searchRootCauseName = "";
    this.submitted = false;
    this.rootCauseReasonMapping = this.fb.array([]);
    this.rootCauseSubReasonMapping = this.fb.array([]);
    this.rootCauseReasonMappingSubmitted = false;
    this.resolutionMasterGroupForm.reset();
    this.getResolutionMaster("");
    this.isResolutionEdit = false;
  }

  canExit() {
    if (!this.resolutionMasterGroupForm.dirty) {
      return true;
    }
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

  TotalItemPerPageReasonMappingTotalRecords(event: any) {
    this.reasonMappingItemsPerPage = event.value;
  }

  getTicketReasonSubCategoryDataList() {
    // const pagedata = {
    //     page: 1,
    //     pageSize: 100000,
    // };
    const url = "/CaseSubCategory/all";
    this.resolutionTaskMasterService.getMethod(url).subscribe(
      (response: any) => {
        this.ticketReasonSubCategoryListData = response.dataList;
        this.ticketReasonSubCategoryListData = response.dataList.filter(
          element => element.status === "Active"
        );
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

  createTrc() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.submitted = false;
    this.isResolutionEdit = false;
    this.resolutionMasterGroupForm.reset();
    this.rootCauseReasonMappingForm.reset();
    this.rootCauseReasonMapping = this.fb.array([]);
    this.rootCauseSubReasonMapping = this.fb.array([]);
  }

  searchViewTrc() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.pageItem = this.resoluionMasterListdataitemsPerPage;
    this.getResolutionMaster("");
    this.searchRootCauseName = "";
    // this.searchService = "";
  }

  rootCauseSubReasonMappingFormGroup(): FormGroup {
    return this.fb.group({
      caseCategoryId: [
        this.rootCauseSubReasonMappingForm.value.caseCategoryId,
        [Validators.required]
      ],
      resId: [""]
    });
  }

  onAddRootCauseSubReasonMappingField(): void {
    this.rootCauseSubReasonMappingSubmitted = true;
    if (this.rootCauseSubReasonMappingForm.valid) {
      this.rootCauseSubReasonMapping.push(this.rootCauseSubReasonMappingFormGroup());
      this.rootCauseSubReasonMappingForm.reset();
      this.rootCauseSubReasonMappingSubmitted = false;
    }
  }

  async onRemoveRootCauseSubReasonMapping(
    reasonMappingFieldIndex: number,
    reasonMappingFieldId: number
  ): Promise<void> {
    this.rootCauseSubReasonMapping.removeAt(reasonMappingFieldIndex);
  }

  pageChangedSubReasonData(number) {
    this.currentPageSubReasonMapping = number;
  }

  TotalItemPerPageSubReasonMappingTotalRecords(event): void {
    this.subReasonMappingItemsPerPage = Number(event.value);
    if (this.currentPageSubReasonMapping > 1) {
      this.currentPageSubReasonMapping = 1;
    }
  }

  uploadDocuments() {
    this.submitted = true;
    if (this.uploadDocForm.valid) {
      const formData = new FormData();
      let fileArray: FileList;
      if (this.uploadDocForm.controls.file) {
        if (
          this.selectedFile.type != "image/png" &&
          this.selectedFile.type != "image/jpg" &&
          this.selectedFile.type != "image/jpeg" &&
          this.selectedFile.type != "application/pdf"
        ) {
          alert("File type must be png, jpg, jpeg or pdf");
        } else {
          fileArray = this.uploadDocForm.controls.file.value;
          Array.from(fileArray).forEach(file => {
            formData.append("fileList", file);
          });
        }
      }
      const url = `/resolutionReasons/uploadFile/${this.rootCauseId}`;
      this.resolutionTaskMasterService.postMethod(url, formData).subscribe(
        (response: any) => {
          if (response.responseCode === 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else if (response.responseCode === 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.submitted = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.uploadDocumentId = false;
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
  }

  uploadDocument(resolution) {
    this.rootCauseId = resolution.id;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
    this.uploadDocumentId = true;
  }

  closeUploadDocumentId() {
    this.uploadDocumentId = false;
    this.submitted = false;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
  }

  onFileChangeUpload(event: any) {
    this.selectedFileUploadPreview = [];
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.selectedFileUploadPreview.push(files.item(i));
      }
      if (
        this.selectedFile.type != "image/png" &&
        this.selectedFile.type != "image/jpg" &&
        this.selectedFile.type != "image/jpeg" &&
        this.selectedFile.type != "application/pdf"
      ) {
        this.uploadDocForm.controls.file.reset();
        alert("File type must be png, jpg, jpeg or pdf");
      } else {
        const file = event.target.files;
        this.uploadDocForm.patchValue({
          file: file
        });
      }
    }
  }

  deletUploadedFile(event: any) {
    var temp: File[] = this.selectedFileUploadPreview?.filter((item: File) => item?.name != event);
    this.selectedFileUploadPreview = temp;
    this.uploadDocForm.patchValue({
      file: temp
    });
  }

  downloadDocument(resolution) {
    this.resolutionIdData = resolution.id;
    const url = "/resolutionReasons/fileList/" + this.resolutionIdData;

    this.resolutionTaskMasterService.getMethod(url).subscribe(
      (response: any) => {
        if (
          response.responseCode === 200 &&
          response.dataList != null &&
          response.dataList.length > 0
        ) {
          const fileDetails = response.dataList.map((item: any) => ({
            id: item.id,
            filename: item.filename,
            uniqueName: item.uniquename,
            latitude: item.latitiude,
            longitude: item.longitude,
            caseId: item.caseId,
            staffId: item.staffId,
            resolutionTime: item.resolutionTime,
            remarks: item.remarks
          }));

          this.resolutionBaseFileData = {
            resolutionBaseId: this.resolutionIdData,
            fileDetails
          };

          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });

          this.downloadDocumentId = true;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No files available for this document",
            icon: "far fa-info-circle"
          });
        }
      },
      (error: any) => {
        console.error("API Error: ", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  downloadDoc(fileName, resolutionBaseId, uniquename) {
    this.resolutionTaskMasterService.downloadFile(resolutionBaseId, uniquename).subscribe(
      blob => {
        if (blob.status == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Download Successfully",
            icon: "far fa-check-circle"
          });
          importedSaveAs(blob.body, fileName);
        } else if (blob.status == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "File Not Found",
            icon: "far fa-times-circle"
          });
        } else if (blob.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Can't Download, File is Remove From The Server Directory",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!",
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

  showDocData(fileName, resolutionBaseId, uniqueName) {
    const extension = fileName.split(".").pop().toLowerCase();
    this.resolutionTaskMasterService.downloadFile(resolutionBaseId, uniqueName).subscribe(
      data => {
        if (data.status == 200) {
          let mimeType = "application/octet-stream";
          switch (extension) {
            case "pdf":
              mimeType = "application/pdf";
              break;
            case "png":
              mimeType = "image/png";
              break;
            case "jpg":
            case "jpeg":
              mimeType = "image/jpeg";
              break;
            case "mp4":
              mimeType = "video/mp4";
              break;
          }

          const blob = new Blob([data.body], { type: mimeType });
          const blobUrl = URL.createObjectURL(blob);
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
          this.previewType = extension;
          this.documentPreview = true;
        } else if (data.status == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "File Not Found",
            icon: "far fa-times-circle"
          });
        } else if (data.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "File is Remove From The Server Directory",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!",
            icon: "far fa-times-circle"
          });
        }
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  closeDocumentPreview() {
    this.documentPreview = false;
    this.previewUrl = null;
    this.previewType = "";
  }

  deleteResolveConfirm(file) {
    this.confirmationService.confirm({
      message: "Do you want to delete this file?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteResolveDoc(file);
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

  deleteResolveDoc(filedata: any) {
    const resolutionBaseId = filedata.id;
    const fileName = filedata.filename;
    const uniqueName = filedata.uniqueName;
    const url = `/resolutionReasons/deletefiles/${resolutionBaseId}`;

    this.resolutionTaskMasterService.deleteMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });

          this.resolutionBaseFileData.fileDetails = this.resolutionBaseFileData.fileDetails.filter(
            (file: any) => file.uniqueName !== uniqueName
          );
        } else if (response.responseCode == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
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
          detail: error.error?.ERROR || "Server error",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  closeDownloadDocumentId() {
    this.downloadDocumentId = false;
  }
}
