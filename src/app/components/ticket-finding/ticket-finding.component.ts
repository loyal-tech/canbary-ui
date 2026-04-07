import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { TICKETING_SYSTEMS } from "src/app/constants/aclConstants";
import { saveAs as importedSaveAs } from "file-saver";
import { DomSanitizer } from "@angular/platform-browser";
import { TicketFindingService } from "src/app/service/ticket-finding.service";
import { StaffService } from "src/app/service/staff.service";

@Component({
  selector: "app-ticket-finding",
  templateUrl: "./ticket-finding.component.html",
  styleUrls: ["./ticket-finding.component.css"]
})
export class TicketFindingComponent implements OnInit {
  ticketFindingGroupForm: FormGroup;
  submitted = false;
  createTicketFindingData: any;
  ticketFindingDataList: any;
  currentPageTicketFindingListdata = 1;
  ticketFindingListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  ticketFindingListdatatotalRecords: any;
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

  //   rootCauseSubReasonMappingForm: FormGroup;
  //   rootCauseSubReasonMapping: FormArray;

  //   rootCauseSubReasonMappingSubmitted: boolean;

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
  typeOptions: any = [
    { label: "Internal Remark", value: "Internal Remark" },
    { label: "External Remark", value: "External Remark" }
  ];
  ticketRemarkListData: any;
  conversationListData: any;
  teamsData: any = [];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ticketFindingService: TicketFindingService,
    loginService: LoginService,
    private sanitizer: DomSanitizer,
    private staffService: StaffService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(TICKETING_SYSTEMS.TICKET_FINDINGS_CREATE);
    this.deleteAccess = loginService.hasPermission(TICKETING_SYSTEMS.TICKET_FINDINGS_DELETE);
    this.editAccess = loginService.hasPermission(TICKETING_SYSTEMS.TICKET_FINDINGS_EDIT);

    // this.isResolutionEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.ticketFindingGroupForm = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
      teamIds: [""],
      remarkType: ["", Validators.required]
    });
    this.rootCauseReasonMappingForm = this.fb.group({
      id: [""],
      findingCauseReason: ["", Validators.required]
      //   findingCauseId: [""]
    });
    // this.rootCauseSubReasonMappingForm = this.fb.group({
    //   id: [""],
    //   subcateId: ["", Validators.required],
    //   resId: [""]
    // });
    this.uploadDocForm = this.fb.group({
      file: ["", Validators.required]
    });

    this.getTicketFinding("");
    this.getTicketReasonSubCategoryDataList();
    this.rootCauseReasonMapping = this.fb.array([]);
    // this.rootCauseSubReasonMapping = this.fb.array([]);
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
    if (this.currentPageTicketFindingListdata > 1) {
      this.currentPageTicketFindingListdata = 1;
    }
    if (!this.searchkey) {
      this.getTicketFinding(this.showItemPerPage);
    }
  }

  getTicketFinding(list): void {
    let size;
    this.searchkey = "";
    const pageList = this.currentPageTicketFindingListdata;
    if (list) {
      size = list;
      this.ticketFindingListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.ticketFindingListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.ticketFindingListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.ticketFindingListdataitemsPerPage;
    }

    const url = "/ticketFindings?mvnoId=" + localStorage.getItem("mvnoId");
    const resolutionmasterdata = {
      page: pageList,
      pageSize: size
    };
    this.ticketFindingService.postMethod(url, resolutionmasterdata).subscribe(
      (response: any) => {
        this.ticketFindingDataList = response.dataList;
        this.ticketFindingListdatatotalRecords = response.totalRecords;
        // if (this.showItemPerPage > this.ticketFindingListdataitemsPerPage) {
        //   this.totalAreaListLength =
        //     this.ticketFindingDataList.length % this.showItemPerPage
        // } else {
        //   this.totalAreaListLength =
        //     this.ticketFindingDataList.length %
        //     this.ticketFindingListdataitemsPerPage
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
    this.ticketFindingGroupForm.value.name = this.ticketFindingGroupForm.value.name.trim();
    if (
      this.ticketFindingGroupForm.value.name == "" ||
      this.ticketFindingGroupForm.value.name == null
    ) {
      this.ticketFindingGroupForm.patchValue({ name: "" });
    }
  }

  addEditTicketFinding(ticketFindingId?: number): void {
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

    if (this.ticketFindingGroupForm.valid) {
      if (ticketFindingId) {
        const url = "/ticketFindings/updateFinding?mvnoId=" + localStorage.getItem("mvnoId");

        this.viewResolutionData = {
          ...this.ticketFindingGroupForm.value,
          id: ticketFindingId,
          ticketFindingCauseMappingDTOList: this.rootCauseReasonMapping.value.map((e: any) => ({
            id: e.id || null,
            findingCauseReason: e.findingCauseReason
          }))
        };

        if (this.rootCauseReasonMapping.value.length > 0) {
          this.ticketFindingService.postMethod(url, this.viewResolutionData).subscribe(
            (response: any) => {
              if ([406, 417, 500].includes(response.responseCode)) {
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
                this.ticketFindingGroupForm.reset();
                this.getTicketFinding("");
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
        const url = "/ticketFindings/saveFinding?mvnoId=" + localStorage.getItem("mvnoId");

        this.createTicketFindingData = {
          ...this.ticketFindingGroupForm.value,
          teamIds: this.ticketFindingGroupForm.value.teamIds || [],
          isDeleted: false,
          ticketFindingCauseMappingDTOList: this.rootCauseReasonMapping.value.map((e: any) => ({
            id: e.id || null, // new records → null
            findingCauseReason: e.findingCauseReason
          }))
        };

        if (this.rootCauseReasonMapping.value.length > 0) {
          this.ticketFindingService.postMethod(url, this.createTicketFindingData).subscribe(
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
                this.ticketFindingGroupForm.reset();
                this.rootCauseReasonMappingSubmitted = false;
                this.rootCauseReasonMapping = this.fb.array([]);
                this.getTicketFinding("");
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

  editResolution(findingCauseId): void {
    if (findingCauseId) {
      this.isResolutionEdit = true;

      this.staffService.getTeamsData().subscribe(result => {
        this.teamsData = result.dataList;
      });

      const url = "/ticketFindings/" + findingCauseId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.ticketFindingService.getMethod(url).subscribe(
        (response: any) => {
          this.createView = true;
          this.listView = false;
          this.viewResolutionData = response.data;

          this.rootCauseReasonMappingForm.reset();
          this.rootCauseReasonMapping = this.fb.array([]);

          this.ticketFindingGroupForm.patchValue({
            id: response.data.id,
            name: response.data.name,
            status: response.data.status,
            remarkType: response.data.remarkType,
            teamIds: Array.isArray(response.data?.teamIds) ? response.data.teamIds : []
          });

          if (Array.isArray(this.viewResolutionData.ticketFindingCauseMappings)) {
            this.viewResolutionData.ticketFindingCauseMappings.forEach(e => {
              this.rootCauseReasonMapping.push(
                this.fb.group({
                  id: [e.id],
                  findingCauseReason: [e.findingCauseReason, Validators.required]
                })
              );
            });
          }
          this.reasonMappingItemsPerPage = 5;
          this.currentPageReasonMapping = 1;

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

  async getResolutionById(findingCauseId): Promise<void> {
    const url = "/ticketFindings/" + findingCauseId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.ticketFindingService.getMethod(url).subscribe(
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

  deleteConfirmonResolution(findingCauseId): void {
    // this.getResolutionById(findingCauseId);
    // setTimeout(() => {
    if (findingCauseId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Ticket Finding?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteResolution(findingCauseId);
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
    // }, 500);
  }

  deleteResolution(findingCauseId): void {
    const url = "/ticketFindings/delete/" + findingCauseId;
    this.ticketFindingService.deleteMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode !== 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPageTicketFindingListdata !== 1 && this.totalAreaListLength === 1) {
            this.currentPageTicketFindingListdata = this.currentPageTicketFindingListdata - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.submitted = false;
          this.ticketFindingGroupForm.reset();
          this.rootCauseReasonMappingSubmitted = false;
          this.rootCauseReasonMapping = this.fb.array([]);
          //   this.rootCauseSubReasonMappingSubmitted = false;
          //   this.rootCauseSubReasonMapping = this.fb.array([]);

          // this.submitted = false;
          // this.rootCauseReasonMapping = this.fb.array([]);
          // this.rootCauseReasonMappingSubmitted = false;
          // this.ticketFindingGroupForm.reset();
          this.isResolutionEdit = false;

          this.getTicketFinding("");
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

  pageChangedTicketFindingList(pageNumber): void {
    this.currentPageTicketFindingListdata = pageNumber;

    this.getTicketFinding("");
  }

  rootCauseReasonMappingFormGroup(): FormGroup {
    return this.fb.group({
      findingCauseReason: [
        this.rootCauseReasonMappingForm.value.findingCauseReason,
        [Validators.required]
      ],
      id: [""]
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

  async onRemoveRootCauseReasonMapping(reasonMappingFieldIndex: number): Promise<void> {
    this.rootCauseReasonMapping.removeAt(reasonMappingFieldIndex);
  }

  searchTrc() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPageTicketFindingListdata = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage) {
      this.ticketFindingListdataitemsPerPage = this.showItemPerPage;
    }
    let data: any = [];
    this.searchData.filters[0].filterColumn = "any";
    this.searchData.filters[0].filterValue = this.searchRootCauseName.trim();
    this.searchData.page = this.currentPageTicketFindingListdata;
    this.searchData.pageSize = this.ticketFindingListdataitemsPerPage;
    data = this.searchData;

    // console.log("this.searchData", this.searchData)
    const url = "/ticketFindings/searchAll?mvnoId=" + localStorage.getItem("mvnoId");
    this.ticketFindingService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response?.dataList?.length > 0) {
          this.ticketFindingDataList = response.dataList;
          this.ticketFindingListdatatotalRecords = response.totalRecords;
        } else {
          this.ticketFindingDataList = [];
          this.ticketFindingListdatatotalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Record Found",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.ticketFindingListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.ticketFindingDataList = [];
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
    // this.rootCauseSubReasonMapping = this.fb.array([]);
    this.rootCauseReasonMappingSubmitted = false;
    this.ticketFindingGroupForm.reset();
    this.getTicketFinding("");
    this.isResolutionEdit = false;
  }

  canExit() {
    if (!this.ticketFindingGroupForm.dirty) {
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
    this.currentPageReasonMapping = 1;
  }

  getTicketReasonSubCategoryDataList() {
    const pagedata = {
      page: 1,
      pageSize: 100000
    };
    const url = "/ticketReasonSubCategory";
    this.ticketFindingService.postMethod(url, pagedata).subscribe(
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
    this.ticketFindingGroupForm.reset();
    this.rootCauseReasonMappingForm.reset();
    this.rootCauseReasonMapping = this.fb.array([]);
    this.staffService.getTeamsData().subscribe(result => {
      this.teamsData = result.dataList;
    });
    // this.rootCauseSubReasonMapping = this.fb.array([]);
  }

  searchViewTrc() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.pageItem = this.ticketFindingListdataitemsPerPage;
    this.getTicketFinding("");
    this.searchRootCauseName = "";
    // this.searchService = "";
  }

  //   rootCauseSubReasonMappingFormGroup(): FormGroup {
  //     return this.fb.group({
  //       subcateId: [this.rootCauseSubReasonMappingForm.value.subcateId, [Validators.required]],
  //       resId: [""]
  //     });
  //   }

  //   onAddRootCauseSubReasonMappingField(): void {
  //     this.rootCauseSubReasonMappingSubmitted = true;
  //     if (this.rootCauseSubReasonMappingForm.valid) {
  //       this.rootCauseSubReasonMapping.push(this.rootCauseSubReasonMappingFormGroup());
  //       this.rootCauseSubReasonMappingForm.reset();
  //       this.rootCauseSubReasonMappingSubmitted = false;
  //     }
  //   }

  //   async onRemoveRootCauseSubReasonMapping(
  //     reasonMappingFieldIndex: number,
  //     reasonMappingFieldId: number
  //   ): Promise<void> {
  //     this.rootCauseSubReasonMapping.removeAt(reasonMappingFieldIndex);
  //   }

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
      const url = `/ticketFindings/uploadFile/${this.rootCauseId}`;
      this.ticketFindingService.postMethod(url, formData).subscribe(
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
    const url = "/ticketFindings/fileList/" + this.resolutionIdData;

    this.ticketFindingService.getMethod(url).subscribe(
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
    this.ticketFindingService.downloadFile(resolutionBaseId, uniquename).subscribe(
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
    this.ticketFindingService.downloadFile(resolutionBaseId, uniqueName).subscribe(
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
    const url = `/ticketFindings/deletefiles/${resolutionBaseId}`;

    this.ticketFindingService.deleteMethod(url).subscribe(
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

  //   getFollowUpDetailById(ticketId): void {
  //     const url = "/ticketFollowupDetails/getAllByCaseId/" + ticketId;
  //     this.ticketFindingService.getMethod(url).subscribe(
  //       (response: any) => {
  //         this.typeOptions = response.dataList;
  //         this.ticketRemarkListData = response.dataList.filter(
  //           data => data.remarkType === "Internal Remark"
  //         );
  //         this.conversationListData = response.dataList.filter(
  //           data => data.remarkType === "External Remark"
  //         );
  //       },
  //       (error: any) => {
  //         // console.log(error, 'error');
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle"
  //         });
  //       }
  //     );
  //   }
  get isRemarkTypeDisabled(): boolean {
    return (
      this.rootCauseReasonMapping.value.length > 0 &&
      this.ticketFindingGroupForm.controls.remarkType.value
    );
  }
}
