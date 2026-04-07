import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { TicketReasonCategoryService } from "src/app/service/ticket-reason-category.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { WORKFLOWS } from "src/app/constants/aclConstants";
import { CustomerService } from "src/app/service/customer.service";

@Component({
  selector: "app-tat-Matrics",
  templateUrl: "./tat-Matrics.component.html",
  styleUrls: ["./tat-Matrics.component.css"]
})
export class TATMatricsComponent implements OnInit {
  public loginService: LoginService;
  AclClassConstants;
  AclConstants;

  MatricsFormGroup: FormGroup;
  tatMatricsTAT: FormArray;
  tatMatricsTATForm: FormGroup;
  submitted = false;
  statusOptions = RadiusConstants.status;
  serviceData: any;
  teamListData: any;
  tatMatricsTATSubmitted = false;
  currentPagetatMatricsTAT = 1;
  tatMatricsTATitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  tatMatricsTATtotalRecords: string;
  createtatMatricsData: any = [];
  currentPagetatMatricsListdata = 1;
  tatMatricsListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  tatMatricsListDatatotalRecords: any;
  tatMatricsListData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  istatMatricsEdit = false;
  edittatMatricsData: any = [];
  searchkey: string;
  searchTATName: any = "";
  searchService: any = "";
  searchData: any;
  searchAllData: any;
  listView = true;
  createView = false;
  detailView = false;
  viewTrcData: any = [];
  currentPageViewTATListdata = 1;
  viewTATListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewTATListDatatotalRecords: any;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
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
  levelData: any = [];
  ifOrder4greaterthan = false;
  pageSize;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private tatMatricsService: TicketReasonCategoryService,
    private commondropdownService: CommondropdownService,
    loginService: LoginService,
    private customermgmtservice: CustomerService
  ) {
    this.createAccess = loginService.hasPermission(WORKFLOWS.TAT_METRICS__CREATE);
    this.deleteAccess = loginService.hasPermission(WORKFLOWS.TAT_METRICS__DELETE);
    this.editAccess = loginService.hasPermission(WORKFLOWS.TAT_METRICS__EDIT);
    this.loginService = loginService;
  }

  ngOnInit(): void {
    this.MatricsFormGroup = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
      slaTime: ["", Validators.required],
      slaUnit: ["", Validators.required],
      rtime: ["", [Validators.pattern(Regex.numeric), Validators.required]],
      runit: ["", [Validators.required]]
    });
    this.tatMatricsTATForm = this.fb.group({
      orderNo: ["", Validators.required],
      level: ["", [Validators.required]],
      mtime: ["", [Validators.pattern(Regex.numeric), Validators.required]],
      munit: ["", [Validators.required]],
      action: ["Notification", [Validators.required]],

      tatManagementId: [""],
      id: [""]
    });
    this.tatMatricsTAT = this.fb.array([]);
    this.levelAllData();
    this.gettatMatricsDataList("");
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
  }

  levelAllData() {
    for (let i = 1; i < 100; i++) {
      this.levelData.push({ label: `Level ${i}` });
    }
  }
  gettatMatricsDataList(list) {
    let size;
    this.searchkey = "";
    const page = this.currentPagetatMatricsListdata;
    if (list) {
      size = list;
      this.tatMatricsListdataitemsPerPage = list;
    } else {
      size = this.tatMatricsListdataitemsPerPage;
    }

    const pagedata = {
      page,
      pageSize: size
    };
    const url = "/matrix?mvnoId=" + localStorage.getItem("mvnoId");
    this.customermgmtservice.postMethod(url, pagedata).subscribe(
      (response: any) => {
        this.tatMatricsListData = response.dataList;
        this.tatMatricsListDatatotalRecords = response.totalRecords;
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

  searchViewTrc() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.currentPagetatMatricsListdata = 1;
    this.tatMatricsListdataitemsPerPage = 5;
    this.pageSize = 5;
    this.gettatMatricsDataList("");
    this.searchTATName = "";
    this.searchService = "";
  }

  createTrc() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.submitted = false;
    this.istatMatricsEdit = false;
    this.MatricsFormGroup.reset();
    this.tatMatricsTATForm.reset();
    this.tatMatricsTAT.controls = [];

    this.tatMatricsTATForm.patchValue({
      action: "Notification",
      orderNo: 1,
      level: "Level 1"
    });
  }

  TotalItemPerPage(event) {
    this.tatMatricsListdataitemsPerPage = Number(event.value);
    this.currentPagetatMatricsListdata = 1;
    if (this.tatMatricsListData > 1) {
      this.currentPagetatMatricsListdata = 1;
    }
    if (!this.searchkey) {
      this.gettatMatricsDataList("");
    } else {
      this.searchTAT();
    }
  }

  pageChangedTrcList(pageNumber) {
    this.currentPagetatMatricsListdata = pageNumber;
    this.gettatMatricsDataList("");
  }

  deleteConfirmonTATField(TATFieldIndex: number) {
    if (TATFieldIndex || TATFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this TAT ?",
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
  }

  //   async onRemoveTAT(TATFieldIndex: number) {
  //     this.tatMatricsTAT.removeAt(TATFieldIndex);
  //   }

  async onRemoveTAT(TATFieldIndex: number) {
    this.tatMatricsTAT.removeAt(TATFieldIndex);

    this.tatMatricsTAT.value.forEach((element, i) => {
      let n = i + 1;
      element.orderNo = n;
      element.level = `Level ${n}`;

      if (this.tatMatricsTAT.value.length == n) {
        this.tatMatricsTAT.patchValue(this.tatMatricsTAT.value);

        this.tatMatricsTATForm.patchValue({
          orderNo: n + 1,
          level: `Level ${n + 1}`
        });
      }
    });
    if (this.tatMatricsTAT.value.length == 0) {
      this.tatMatricsTATForm.patchValue({
        orderNo: 1,
        level: `Level ${1}`
      });
    }
  }

  addEdittatMatrics(id) {
    this.submitted = true;

    if (this.MatricsFormGroup.valid) {
      if (id) {
        const url = "/matrix/update?mvnoId=" + localStorage.getItem("mvnoId");

        this.createtatMatricsData = this.MatricsFormGroup.value;
        this.createtatMatricsData.id = id;
        this.createtatMatricsData.matrixDetailsList = this.tatMatricsTAT.value;

        if (this.tatMatricsTAT.value.length < 1) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Please add TAT details",
            icon: "far fa-times-circle"
          });
        } else {
          this.customermgmtservice.postMethod(url, this.createtatMatricsData).subscribe(
            (response: any) => {
              if (response.responseCode == 200) {
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle"
                });
                this.cleartatMatrics();
                this.istatMatricsEdit = false;
              } else {
                this.messageService.add({
                  severity: "info",
                  summary: "info",
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
      } else {
        const url = "/matrix/save?mvnoId=" + localStorage.getItem("mvnoId");

        this.createtatMatricsData = this.MatricsFormGroup.value;
        this.createtatMatricsData.matrixDetailsList = this.tatMatricsTAT.value;
        if (this.tatMatricsTAT.value.length < 1) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Please add TAT details",
            icon: "far fa-times-circle"
          });
        } else {
          this.customermgmtservice.postMethod(url, this.createtatMatricsData).subscribe(
            (response: any) => {
              if (response.responseCode == 406) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
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
                this.cleartatMatrics();
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
    }
  }

  cleartatMatrics() {
    this.MatricsFormGroup.reset();
    this.submitted = false;
    this.tatMatricsTAT.controls = [];
    this.tatMatricsTATForm.reset();
    this.tatMatricsTAT = this.fb.array([]);
    this.listView = true;
    this.createView = false;
    if (!this.searchkey) {
      this.gettatMatricsDataList("");
    } else {
      this.searchTAT();
    }
  }

  tatMatricsTATFormGroup(): FormGroup {
    // console.log("this.tatMatricsTATForm.value.orderNo", this.tatMatricsTATForm.value.orderNo);
    return this.fb.group({
      orderNo: [this.tatMatricsTATForm.value.orderNo, [Validators.required]],
      level: [this.tatMatricsTATForm.value.level, [Validators.required]],
      mtime: [
        String(this.tatMatricsTATForm.value.mtime),
        [Validators.pattern(Regex.numeric), Validators.required]
      ],
      munit: [this.tatMatricsTATForm.value.munit, [Validators.required]],
      action: [this.tatMatricsTATForm.value.action, [Validators.required]],
      tatManagementId: [this.tatMatricsTATForm.value.tatManagementId],
      id: [this.tatMatricsTATForm.value.id]
    });
  }

  onAddtatMatricsTATField() {
    this.tatMatricsTATSubmitted = true;

    if (this.tatMatricsTATForm.valid) {
      this.tatMatricsTAT.push(this.tatMatricsTATFormGroup());
      this.tatMatricsTATForm.reset();
      this.tatMatricsTATSubmitted = false;

      // if(this.tatMatricsTAT.length <= 3){
      let orderN = this.tatMatricsTAT.length + 1;
      let level = `Level ${orderN}`;

      this.ifOrder4greaterthan = false;

      this.tatMatricsTATForm.patchValue({
        action: "Notification",
        orderNo: orderN,
        level: level,
        mtime: "",
        munit: "",
        escalatedTime: ""
      });

      // }
      // else{
      //   this.ifOrder4greaterthan =true
      //   this.tatMatricsTATForm.reset();

      //   this.tatMatricsTATForm.patchValue({
      //     action:'Notification',
      //   })
      // }
    }
  }

  pageChangedtatMatricsTATData(pageNumber) {
    this.currentPagetatMatricsTAT = pageNumber;
  }

  edittatMatrics(id) {
    this.MatricsFormGroup.reset();
    this.tatMatricsTATForm.reset();
    this.istatMatricsEdit = true;
    this.listView = false;
    this.createView = true;
    this.detailView = false;

    if (this.tatMatricsTAT.controls) {
      this.tatMatricsTAT.controls = [];
    }
    const url = "/matrix/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customermgmtservice.getMethod(url).subscribe(
      (response: any) => {
        this.edittatMatricsData = response.data;
        this.MatricsFormGroup.patchValue({
          name: this.edittatMatricsData.name,
          status: this.edittatMatricsData.status,
          slaTime: this.edittatMatricsData.slaTime,
          slaUnit: this.edittatMatricsData.slaUnit,
          rtime: this.edittatMatricsData.rtime,
          runit: this.edittatMatricsData.runit
        });

        this.tatMatricsTAT = this.fb.array([]);
        this.edittatMatricsData.matrixDetailsList.forEach(element => {
          this.tatMatricsTAT.push(this.fb.group(element));
        });
        this.tatMatricsTAT.patchValue(this.edittatMatricsData.matrixDetailsList);

        let orderN = this.tatMatricsTAT.length + 1;
        let level = `Level ${orderN}`;

        this.ifOrder4greaterthan = false;

        this.tatMatricsTATForm.patchValue({
          action: "Notification",
          orderNo: orderN,
          level: level,
          mtime: "",
          munit: "",
          escalatedTime: ""
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

  tatAllDetails(id) {
    this.listView = false;
    this.createView = false;
    this.detailView = true;

    const url = "/matrix/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customermgmtservice.getMethod(url).subscribe(
      (response: any) => {
        this.viewTrcData = response.data;
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

  deleteConfirmontatMatrics(TrcData) {
    if (TrcData) {
      this.confirmationService.confirm({
        message: "Do you want to delete this TAT Metrics?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTAT(TrcData);
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

  searchTAT() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPagetatMatricsListdata = 1;
      this.tatMatricsListdataitemsPerPage = 5;
      this.pageSize = 5;
    }
    this.searchkey = this.searchData;
    // if (this.showItemPerPage) {
    //   this.tatMatricsListdataitemsPerPage = this.showItemPerPage;
    // }
    let data: any = [];
    this.searchData.filter[0].filterValue = this.searchTATName.trim();
    ((this.searchData.filter[0].page = this.currentPagetatMatricsListdata),
      (this.searchData.filter[0].pageSize = this.tatMatricsListdataitemsPerPage));
    data = this.searchData;

    // console.log("this.searchData", this.searchData)
    const url =
      "/matrix/search?page=" +
      this.currentPagetatMatricsListdata +
      "&pageSize=" +
      this.tatMatricsListdataitemsPerPage +
      "&sortBy=Id&sortOrder=0" +
      "&mvnoId=" +
      localStorage.getItem("mvnoId");

    this.customermgmtservice.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.tatMatricsListData = [];
        } else {
          this.tatMatricsListData = response.dataList;
          this.tatMatricsListDatatotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.tatMatricsListDatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.tatMatricsListData = [];
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

  clearSearchTAT() {
    this.searchTATName = "";
    this.searchService = "";
    this.gettatMatricsDataList("");
  }

  deleteTAT(data) {
    const url = "/matrix/delete";
    this.customermgmtservice.postMethod(url, data).subscribe(
      (response: any) => {
        if (
          response.responseCode == 406 ||
          response.responseCode == 417 ||
          response.responseCode == 500
        ) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPagetatMatricsListdata != 1 && this.tatMatricsListData.length == 1) {
            this.currentPagetatMatricsListdata = this.currentPagetatMatricsListdata - 1;
          }
          if (!this.searchkey) {
            this.gettatMatricsDataList("");
          } else {
            this.searchTAT();
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
    if (!this.MatricsFormGroup.dirty && !this.tatMatricsTAT.dirty && !this.tatMatricsTATForm.dirty)
      return true;
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

  keypressId(event: any) {
    const pattern = /^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onInput(event: any) {
    const pattern = /^[0-9]+$/;
    let inputValue = event.target.value;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, "");

    // Limit to 10 digits
    inputValue = inputValue.slice(0, 5);

    // Update the input value only if it doesn't exceed the maximum length
    if (event.target.value.length <= 5) {
      event.target.value = inputValue;
    }

    // Now, you can access the 10-digit value in your Angular code
    const mobileNumber = inputValue;
  }
}
