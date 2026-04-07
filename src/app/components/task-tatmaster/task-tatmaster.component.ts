import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { TASK_SYSTEMS, TICKETING_SYSTEMS } from "src/app/constants/aclConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { TicketReasonCategoryService } from "src/app/service/ticket-reason-category.service";

@Component({
  selector: "app-task-tatmaster",
  templateUrl: "./task-tatmaster.component.html",
  styleUrls: ["./task-tatmaster.component.css"]
})
export class TaskTATmasterComponent implements OnInit {
  public loginService: LoginService;
  AclClassConstants;
  AclConstants;
  ticketReasonCatFormGroup: FormGroup;
  TATMatrixTAT: FormArray;
  TATMatrixTATForm: FormGroup;
  submitted = false;
  statusOptions = RadiusConstants.status;
  serviceData: any;
  teamListData: any;
  TATMatrixTATSubmitted = false;
  currentPageTATMatrixTAT = 1;
  TATMatrixTATitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  TATMatrixTATtotalRecords: string;
  currentPageTATMatrixListdata = 1;
  TATMatrixListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  TATMatrixListDatatotalRecords: any;
  TATMatrixListData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  isTATMatrixEdit = false;
  searchkey: string;
  searchTrcName: any = "";
  searchService: any = "";
  searchData: any;
  searchAllData: any;
  listView = true;
  createView = false;
  detailView = false;
  viewTrcData: any;
  currentPageViewTATListdata = 1;
  viewTATListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewTATListDatatotalRecords: any;
  levelData = [];
  departmentTypeData: any;

  actionData = [
    { label: "Notification", value: "Notification" },
    { label: "Reassign", value: "Reassign" },
    { label: "Both", value: "Both" }
  ];
  timeUnitData = [
    { label: "Day", value: "Day" },
    { label: "Hour", value: "Hour" },
    { label: "Min", value: "Min" }
  ];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  pageItem;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private TATMatrixService: TicketReasonCategoryService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(TASK_SYSTEMS.TAT_TASK_CREATE);
    this.deleteAccess = loginService.hasPermission(TASK_SYSTEMS.TAT_TASK_DELETE);
    this.editAccess = loginService.hasPermission(TASK_SYSTEMS.TAT_TASK_EDIT);

    // this.isTATMatrixEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.ticketReasonCatFormGroup = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
      slaTimep1: ["", [Validators.pattern(Regex.numeric), Validators.required, Validators.min(0)]],
      slaTimep2: ["", [Validators.pattern(Regex.numeric), Validators.required, Validators.min(0)]],
      slaTime3: ["", [Validators.pattern(Regex.numeric), Validators.required, Validators.min(0)]],
      sunitp1: ["", Validators.required],
      sunitp2: ["", Validators.required],
      sunitp3: ["", Validators.required],
      rtime: ["", [Validators.pattern(Regex.numeric), Validators.required, Validators.min(0)]],
      runit: ["", Validators.required]
    });
    this.TATMatrixTATForm = this.fb.group({
      orderNo: [""],
      mtime2: ["", [Validators.pattern(Regex.numeric), Validators.required, Validators.min(0)]],
      munit: ["", [Validators.required, Validators.min(0)]],
      action: ["", [Validators.required, Validators.min(0)]],
      mtime1: ["", [Validators.required, Validators.min(0)]],
      mtime3: ["", [Validators.pattern(Regex.numeric), Validators.required, Validators.min(0)]],
      level: [""],
      tatMappingtId: [""],
      id: [""]
    });
    this.TATMatrixTAT = this.fb.array([]);

    this.getTATMatrixDataList("");
    this.levelAllData();

    this.searchData = {
      filters: [
        {
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
          filterDataType: "",
          filterValue: "",
          port: "",
          salesRepresentative: "",
          serviceArea: "",
          serviceNetwork: "",
          slot: ""
        }
      ],
      page: "",
      pageSize: "",
      sortBy: "createdate",
      sortOrder: 0
    };
  }

  levelAllData() {
    for (let i = 1; i < 100; i++) {
      this.levelData.push({ label: `Level ${i}` });
    }
  }

  getTATMatrixDataList(list) {
    let size;
    this.searchkey = "";
    const page = this.currentPageTATMatrixListdata;
    if (list) {
      size = list;
      this.currentPageTATMatrixListdata = list;
    } else {
      size = this.TATMatrixListdataitemsPerPage;
    }

    const pagedata = {
      page,
      pageSize: size
    };
    const url = "/tickettatmatrix?mvnoId=" + localStorage.getItem("mvnoId");
    this.TATMatrixService.postMethod(url, pagedata).subscribe(
      (response: any) => {
        this.TATMatrixListData = response.dataList;
        this.TATMatrixListDatatotalRecords = response.totalRecords;
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

  async searchViewTrc() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.pageItem = this.TATMatrixListdataitemsPerPage;
    this.getTATMatrixDataList("");
    this.searchTrcName = "";
    this.searchService = "";
  }

  async createTicketMaster() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.submitted = false;
    this.isTATMatrixEdit = false;
    this.ticketReasonCatFormGroup.reset();
    this.TATMatrixTATForm.reset();
    this.TATMatrixTAT.controls = [];
    this.TATMatrixTATForm.patchValue({
      orderNo: 1,
      level: "Level 1"
    });
  }

  TotalItemPerPage(event) {
    this.TATMatrixListdataitemsPerPage = Number(event.value);
    this.currentPageTATMatrixListdata = 1;
    if (this.TATMatrixListData > 1) {
      this.currentPageTATMatrixListdata = 1;
    }
    this.getTATMatrixDataList(this.showItemPerPage);
  }

  pageChangedTrcList(pageNumber) {
    this.currentPageTATMatrixListdata = pageNumber;
    this.getTATMatrixDataList("");
  }
  deleteConfirmonTATField(TATFieldIndex: number) {
    this.confirmationService.confirm({
      message: "Do you want to delete this TAT?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.onRemoveTAT(TATFieldIndex);
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

  async onRemoveTAT(TATFieldIndex: number) {
    this.TATMatrixTAT.removeAt(TATFieldIndex);
    this.TATMatrixTAT.value.forEach((element, i) => {
      let n = i + 1;
      element.orderNo = n;
      element.level = `Level ${n}`;

      if (this.TATMatrixTAT.value.length == n) {
        this.TATMatrixTAT.patchValue(this.TATMatrixTAT.value);

        this.TATMatrixTATForm.patchValue({
          orderNo: n + 1,
          level: `Level ${n + 1}`
        });
      }
    });
    if (this.TATMatrixTAT.value.length == 0) {
      this.TATMatrixTATForm.patchValue({
        orderNo: 1,
        level: `Level ${1}`
      });
    }
  }

  addEditTicketReasonCat(id) {
    // if (this.ticketReasonCatFormGroup.invalid) {
    //   this.messageService.add({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Invalid SLA Time",
    //     icon: "far fa-times-circle",
    //   });
    // }
    this.submitted = true;

    let createTATMatrixData: any = [];
    if (this.ticketReasonCatFormGroup.valid) {
      if (id) {
        const url = "/tickettatmatrix/update?mvnoId=" + localStorage.getItem("mvnoId");
        createTATMatrixData = this.ticketReasonCatFormGroup.value;
        createTATMatrixData.id = id;
        createTATMatrixData.tatMatrixMappings = this.TATMatrixTAT.value;

        if (createTATMatrixData.tatMatrixMappings.length < 1) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please add TAT details",
            icon: "far fa-times-circle"
          });
        } else {
          this.TATMatrixService.postMethod(url, createTATMatrixData).subscribe(
            (response: any) => {
              if (response.responseCode == 406) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else if (response.responseCode == 417 || response.responseCode == 500) {
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
                this.clearTATMatrix();
                this.isTATMatrixEdit = false;
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
      } else {
        const url = "/tickettatmatrix/save?mvnoId=" + localStorage.getItem("mvnoId");

        createTATMatrixData = this.ticketReasonCatFormGroup.value;
        createTATMatrixData.tatMatrixMappings = this.TATMatrixTAT.value;

        if (createTATMatrixData.tatMatrixMappings.length < 1) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please add TAT details",
            icon: "far fa-times-circle"
          });
        } else {
          this.TATMatrixService.postMethod(url, createTATMatrixData).subscribe(
            (response: any) => {
              if (response.responseCode == 406 || response.responseCode == 417) {
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
                this.clearTATMatrix();
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
    } else {
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      };
    }
  }

  clearTATMatrix() {
    this.ticketReasonCatFormGroup.reset();
    this.submitted = false;
    this.TATMatrixTAT.controls = [];
    this.listView = true;
    this.createView = false;
    this.getTATMatrixDataList("");
  }

  TATMatrixTATFormGroup(): FormGroup {
    // console.log("this.TATMatrixTATForm.value.orderNo", this.TATMatrixTATForm.value.orderNo);
    return this.fb.group({
      orderNo: [this.TATMatrixTATForm.value.orderNo],
      mtime2: [
        this.TATMatrixTATForm.value.mtime2,
        [Validators.pattern(Regex.numeric), Validators.required]
      ],
      munit: [this.TATMatrixTATForm.value.munit, [Validators.required]],
      action: [this.TATMatrixTATForm.value.action, [Validators.required]],
      mtime3: [
        this.TATMatrixTATForm.value.mtime3,
        [Validators.pattern(Regex.numeric), Validators.required]
      ],
      mtime1: [this.TATMatrixTATForm.value.mtime1, Validators.required],
      level: [this.TATMatrixTATForm.value.level],
      tatMappingtId: [this.TATMatrixTATForm.value.tatMappingtId],
      id: [this.TATMatrixTATForm.value.id]
    });
  }

  onAddTATMatrixTATField() {
    this.TATMatrixTATSubmitted = true;
    if (this.TATMatrixTATForm.valid) {
      this.TATMatrixTAT.push(this.TATMatrixTATFormGroup());
      this.TATMatrixTATForm.reset();
      this.TATMatrixTATSubmitted = false;
      let orderN = this.TATMatrixTAT.length + 1;
      let level = `Level ${orderN}`;

      this.TATMatrixTATForm.patchValue({
        orderNo: orderN,
        level: level
      });
    }
  }

  pageChangedTATMatrixTATData(pageNumber) {
    this.currentPageTATMatrixTAT = pageNumber;
  }
  editcustomerID = "";
  editTATMatrix(id) {
    let editTATMatrixData: any = [];
    this.ticketReasonCatFormGroup.reset();
    this.TATMatrixTATForm.reset();
    this.isTATMatrixEdit = true;
    this.listView = false;
    this.createView = true;
    this.detailView = false;

    if (this.TATMatrixTAT.controls) {
      this.TATMatrixTAT.controls = [];
    }
    const url = "/tickettatmatrix/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.TATMatrixService.getMethod(url).subscribe(
      (response: any) => {
        editTATMatrixData = response.data;
        this.editcustomerID = editTATMatrixData.id;
        this.ticketReasonCatFormGroup.patchValue({
          name: editTATMatrixData.name,
          status: editTATMatrixData.status,
          slaTimep1: editTATMatrixData.slaTimep1,
          slaTimep2: editTATMatrixData.slaTimep2,
          slaTime3: editTATMatrixData.slaTime3,
          sunitp1: editTATMatrixData.sunitp1,
          sunitp2: editTATMatrixData.sunitp2,
          sunitp3: editTATMatrixData.sunitp3,
          rtime: editTATMatrixData.rtime,
          runit: editTATMatrixData.runit
        });

        this.TATMatrixTAT = this.fb.array([]);
        editTATMatrixData.tatMatrixMappings.forEach(element => {
          this.TATMatrixTAT.push(this.fb.group(element));
        });
        this.TATMatrixTAT.patchValue(editTATMatrixData.tatMatrixMappings);

        let orderN = this.TATMatrixTAT.length + 1;
        let level = `Level ${orderN}`;

        this.TATMatrixTATForm.patchValue({
          orderNo: orderN,
          level: level
        });
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

  trcAllDetails(data) {
    this.listView = false;
    this.createView = false;
    this.detailView = true;
    this.viewTrcData = data;
    // console.log("this.viewTrcData", this.viewTrcData);
  }

  deleteConfirmonTicketReasonCat(TrcData) {
    if (TrcData) {
      this.confirmationService.confirm({
        message: "Do you want to delete this TAT ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTrc(TrcData);
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

  searchTrc() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPageTATMatrixListdata = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage) {
      this.TATMatrixListdataitemsPerPage = this.showItemPerPage;
    }
    let data: any = [];
    this.searchData.filters[0].filterColumn = "any";
    this.searchData.filters[0].filterValue = this.searchTrcName ? this.searchTrcName.trim() : "";

    this.searchData.page = this.currentPageTATMatrixListdata;
    this.searchData.pageSize = this.TATMatrixListdataitemsPerPage;
    data = this.searchData;

    // console.log("this.searchData", this.searchData)
    const url = `/tickettatmatrix/searchAll?mvnoId=${localStorage.getItem("mvnoId")}`;
    this.TATMatrixService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response?.dataList?.length <= 0) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Record Found!",
            icon: "far fa-times-circle"
          });
          this.TATMatrixListData = [];
        } else {
          this.TATMatrixListData = response.dataList;
          this.TATMatrixListDatatotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.TATMatrixListDatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.TATMatrixListData = [];
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
    this.searchTrcName = "";
    this.searchService = "";
    this.getTATMatrixDataList("");
  }

  deleteTrc(data) {
    const url = "/tickettatmatrix/delete";
    this.TATMatrixService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPageTATMatrixListdata != 1 && this.TATMatrixListData.length == 1) {
            this.currentPageTATMatrixListdata = this.currentPageTATMatrixListdata - 1;
          }
          if (!this.searchkey) {
            this.getTATMatrixDataList("");
          } else {
            this.searchTrc();
          }
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

  pageChangedViewTAT(pageNumber) {
    this.currentPageViewTATListdata = pageNumber;
  }
  canExit() {
    if (!this.ticketReasonCatFormGroup.dirty && !this.TATMatrixTATForm.dirty) return true;
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
