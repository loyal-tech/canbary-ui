import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Observable, Observer } from "rxjs";
import { TargetManagementService } from "src/app/service/target-management.service";
import { SALES_FULFILLMENTS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-target-management",
  templateUrl: "./target-management.component.html",
  styleUrls: ["./target-management.component.css"]
})
export class TargetManagementComponent implements OnInit {
  targetGroupForm: FormGroup;
  targetMappingFormArray: FormArray;
  targetMappingForm: FormGroup;
  targetListData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  currentPageTargetListdata = 1;
  targetListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  targetListdatatotalRecords: any;
  showItemPerPage = 5;
  searchkey: any;
  detailView: boolean = false;
  listView: boolean = true;
  createView: boolean = false;
  isTargetEdit: boolean = false;
  submitted: boolean = false;
  parentStaffList: any = [];
  childStaffList: any = [];
  kpiManagementList: any = [];
  statusOptions = RadiusConstants.status;
  createTargetData: any;
  viewTargetDetailData: any;
  searchVal: any;
  searchData: any;
  totalTargetPer: any = 0;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private targetManagementService: TargetManagementService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(SALES_FULFILLMENTS.CREATE_TARGET);
    this.deleteAccess = loginService.hasPermission(SALES_FULFILLMENTS.DELETE_TARGET);
    this.editAccess = loginService.hasPermission(SALES_FULFILLMENTS.EDIT_TARGET);
  }

  ngOnInit(): void {
    this.targetGroupForm = this.fb.group({
      amount: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      staffId: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      status: ["", Validators.required]
    });

    this.targetMappingForm = this.fb.group({
      kpiMasterId: ["", [Validators.required]],
      staffId: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      targetValue: ["", [Validators.required]],
      targetPercentage: [
        "",
        [
          Validators.required,
          Validators.pattern(Regex.numeric),
          Validators.max(100),
          Validators.min(0)
        ]
      ]
    });

    this.getParentStafflist();
    this.getKPIManagement();
    this.getTargetList("");
    this.targetMappingFormArray = this.fb.array([]);
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };
  }

  createTargetView() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.submitted = false;
    this.isTargetEdit = false;
    this.targetGroupForm.reset();
    this.targetMappingFormArray.controls = [];
  }

  searchTargetView() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }

  getTargetList(list) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPageTargetListdata;
    if (list) {
      size = list;
      this.targetListdataitemsPerPage = list;
    } else {
      size = this.targetListdataitemsPerPage;
    }

    const url = "/targetmaster";
    let chargedata = {
      page: page_list,
      pageSize: size,
      sortOrder: 0,
      sortBy: "id"
    };
    this.targetManagementService.postMethod(url, chargedata).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.targetListData = response.dataList;
          this.targetListdatatotalRecords = response.totalRecords;
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

  addEditTarget(kpiId) {
    this.submitted = true;
    if (this.targetGroupForm.valid && this.targetMappingFormArray.valid) {
      if (this.totalTargetPer >= 100 || this.totalTargetPer == 0) {
        if (kpiId) {
          this.createTargetData = this.targetGroupForm.value;
          this.createTargetData.id = this.viewTargetDetailData.id;
          this.createTargetData.targetMasterMappingList = this.targetMappingFormArray.value;
          const url = "/targetmaster/update";
          this.targetManagementService.postMethod(url, this.createTargetData).subscribe(
            (response: any) => {
              if (response.responseCode == 200) {
                this.messageService.add({
                  severity: "success",
                  summary: " ",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle"
                });
                this.clearTargetData();
                if (!this.searchkey) {
                  this.getTargetList("");
                } else {
                  this.searchTarget();
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
        } else {
          this.createTargetData = this.targetGroupForm.value;
          this.createTargetData.targetMasterMappingList = this.targetMappingFormArray.value;
          const url = "/targetmaster/save";
          this.targetManagementService.postMethod(url, this.createTargetData).subscribe(
            (response: any) => {
              if (response.responseCode == 200) {
                this.messageService.add({
                  severity: "success",
                  summary: " ",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle"
                });
                this.clearTargetData();
                if (!this.searchkey) {
                  this.getTargetList("");
                } else {
                  this.searchTarget();
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
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Total Target % not less than 100",
          icon: "far fa-times-circle"
        });
      }
    }
  }

  clearTargetData() {
    this.listView = true;
    this.createView = false;
    this.targetGroupForm.reset();
    this.submitted = false;
    this.isTargetEdit = false;
    this.targetMappingFormArray.controls = [];
  }

  searchTarget() {
    if (!this.searchkey || this.searchkey !== this.searchVal) {
      this.currentPageTargetListdata = 1;
    }
    this.searchkey = this.searchVal;
    if (this.showItemPerPage) {
      this.targetListdataitemsPerPage = this.showItemPerPage;
    }
    if (this.searchVal) {
      this.searchData.filter[0].filterValue = this.searchVal.trim();
    }

    const url =
      "/targetmaster/search?page=" +
      this.currentPageTargetListdata +
      "&pageSize=" +
      this.targetListdataitemsPerPage +
      "&sortBy=id&sortOrder=0";
    this.targetManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.targetListData = response.dataList;
        this.targetListdatatotalRecords = response.totalRecords;
      },
      (error: any) => {
        this.targetListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.targetListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.response.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  editTarget(targetId) {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.isTargetEdit = true;
    this.targetGroupForm.reset();
    this.targetMappingFormArray.controls = [];
    this.getTargetDetailById(targetId);
  }

  deleteConfirmonTarget(target) {
    if (target) {
      this.confirmationService.confirm({
        message: "Do you want to delete this KPI?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTarget(target);
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

  deleteTarget(target) {
    const url = "/targetmaster/delete";
    this.targetManagementService.postMethod(url, target).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (this.currentPageTargetListdata != 1 && this.targetListData.length == 1) {
            this.currentPageTargetListdata = this.currentPageTargetListdata - 1;
          }
          if (!this.searchkey) {
            this.getTargetList("");
          } else {
            this.searchTarget();
          }
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getTargetDetailById(targetId) {
    const url = "/targetmaster/" + targetId;
    this.targetManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.isTargetEdit = true;
          this.viewTargetDetailData = response.data;
          this.targetGroupForm.patchValue(this.viewTargetDetailData);
          this.targetMappingFormArray = this.fb.array([]);
          this.viewTargetDetailData.targetMasterMappingList.forEach(element => {
            this.targetMappingFormArray.push(this.fb.group(element));
          });
          this.targetMappingFormArray.patchValue(this.viewTargetDetailData.targetMasterMappingList);
          let event = {
            value: this.viewTargetDetailData.staffId
          };
          this.getChildStaff(event, false);
          this.setAllAmountFun();
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

  pageChangedTargetList(pageNumber) {
    this.currentPageTargetListdata = pageNumber;
    if (!this.searchkey) {
      this.getTargetList("");
    } else {
      this.searchTarget();
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageTargetListdata > 1) {
      this.currentPageTargetListdata = 1;
    }
    if (!this.searchkey) {
      this.getTargetList(this.showItemPerPage);
    } else {
      this.searchTarget();
    }
  }

  getParentStafflist() {
    const url = "/findAllParentStaff";
    this.targetManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.parentStaffList = response.dataList;
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

  getChildStaff(event, val) {
    const url = "/findAllChildStaffByParentStaffId/" + event.value;
    this.targetManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.childStaffList = response.dataList;
          if (val) {
            setTimeout(() => {
              this.createStaffMappingFun();
            }, 500);
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

  createStaffMappingFun() {
    this.targetMappingFormArray.controls = [];
    this.targetMappingFormArray = this.fb.array([]);
    if (this.childStaffList.length > 0) {
      for (let i = 0; i < this.childStaffList.length; i++) {
        this.targetMappingFormArray.push(this.createTargetStaffMappingFormGroup(i));
      }
    }
  }

  createTargetStaffMappingFormGroup(i): FormGroup {
    return this.fb.group({
      kpiMasterId: [this.targetMappingForm.value.kpiMasterId, [Validators.required]],
      staffId: [this.childStaffList[i].id, [Validators.required]],
      targetValue: [this.targetMappingForm.value.targetValue, [Validators.required]],
      targetPercentage: [
        this.targetMappingForm.value.targetPercentage,
        [
          Validators.required,
          Validators.pattern(Regex.numeric),
          Validators.max(100),
          Validators.min(0)
        ]
      ],
      id: [""]
    });
  }

  getKPIManagement() {
    const url = "/kpimaster/all";
    this.targetManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.kpiManagementList = response.dataList;
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

  setAmountFun(i) {
    let amountVal = 0;
    if (
      !isNaN(Number(this.targetMappingFormArray.controls[i].value.targetPercentage)) &&
      !isNaN(Number(this.targetGroupForm.value.amount))
    ) {
      amountVal =
        (Number(this.targetMappingFormArray.controls[i].value.targetPercentage) *
          Number(this.targetGroupForm.value.amount)) /
        100;
      this.targetMappingFormArray.controls[i].get("targetValue").setValue(amountVal);
      this.totalTargetFun();
    }
  }

  setAllAmountFun() {
    if (this.targetMappingFormArray.controls.length > 0) {
      for (let i = 0; i < this.targetMappingFormArray.controls.length; i++) {
        this.setAmountFun(i);
      }
    }
  }

  clearSearchTarget() {
    this.searchVal = "";
    this.searchkey = "";
    this.getTargetList("");
  }

  totalTargetFun() {
    this.totalTargetPer = 0;
    for (let i = 0; i < this.targetMappingFormArray.controls.length; i++) {
      if (!isNaN(Number(this.targetMappingFormArray.controls[i].value.targetPercentage)))
        this.totalTargetPer =
          this.totalTargetPer +
          Number(this.targetMappingFormArray.controls[i].value.targetPercentage);
    }
    // this.totalVal = this.totalVal + Number(this.KPIMappingFormArray.controls[i].value.amount);
  }
}
