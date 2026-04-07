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
import { KpiManagementService } from "src/app/service/kpi-management.service";
import { SALES_FULFILLMENTS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-kpi-management",
  templateUrl: "./kpi-management.component.html",
  styleUrls: ["./kpi-management.component.css"]
})
export class KpiManagementComponent implements OnInit {
  KPIGroupForm: FormGroup;
  KPIMappingFormArray: FormArray;
  KPIMappingForm: FormGroup;
  detailView: boolean = false;
  listView: boolean = true;
  createView: boolean = false;
  KPIListData: any;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  currentPageKpiListdata = 1;
  kpiListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  kpiListdatatotalRecords: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  searchkey: any;
  showItemPerPage = 5;
  isKPIEdit: boolean = false;

  submitted: boolean = false;
  viewKPIDetailData: any;
  createKPIData: any;
  statusOptions = RadiusConstants.status;
  searchData: any;
  searchVal: any;
  totalVal: any = 0;
  totalAmountPer: any = 0;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private kpiManagementService: KpiManagementService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(SALES_FULFILLMENTS.CREATE_KPI);
    this.deleteAccess = loginService.hasPermission(SALES_FULFILLMENTS.DELETE_KPI);
    this.editAccess = loginService.hasPermission(SALES_FULFILLMENTS.EDIT_KPI);
  }

  ngOnInit(): void {
    this.KPIGroupForm = this.fb.group({
      name: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      status: ["", Validators.required]
    });

    this.KPIMappingForm = this.fb.group({
      area: [""],
      no: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      amount: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      amountPercentage: [
        "",
        [
          Validators.required,
          Validators.pattern(Regex.numeric),
          Validators.max(99),
          Validators.min(0)
        ]
      ]
    });

    this.KPIMappingFormArray = this.fb.array([]);
    this.getKPIList("");

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

  createKPIMappingFormGroup(areaName): FormGroup {
    return this.fb.group({
      area: [areaName],
      no: [this.KPIMappingForm.value.no, [Validators.required, Validators.pattern(Regex.numeric)]],
      amount: [
        this.KPIMappingForm.value.amount,
        [Validators.required, Validators.pattern(Regex.numeric)]
      ],
      amountPercentage: [
        this.KPIMappingForm.value.amountPercentage,
        [
          Validators.required,
          Validators.pattern(Regex.numeric),
          Validators.max(99),
          Validators.min(0)
        ]
      ],
      id: [""]
    });
  }

  getKPIList(list) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPageKpiListdata;
    if (list) {
      size = list;
      this.kpiListdataitemsPerPage = list;
    } else {
      size = this.kpiListdataitemsPerPage;
    }

    const url = "/kpimaster";
    let chargedata = {
      page: page_list,
      pageSize: size,
      sortOrder: 0,
      sortBy: "id"
    };
    this.kpiManagementService.postMethod(url, chargedata).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.KPIListData = response.dataList;
          this.kpiListdatatotalRecords = response.totalRecords;
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
  searchKPI() {
    if (!this.searchkey || this.searchkey !== this.searchVal) {
      this.currentPageKpiListdata = 1;
    }
    this.searchkey = this.searchVal;
    if (this.showItemPerPage) {
      this.kpiListdataitemsPerPage = this.showItemPerPage;
    }
    if (this.searchVal) {
      this.searchData.filter[0].filterValue = this.searchVal.trim();
    }

    const url =
      "/kpimaster/search?page=" +
      this.currentPageKpiListdata +
      "&pageSize=" +
      this.kpiListdataitemsPerPage +
      "&sortBy=id&sortOrder=0";
    this.kpiManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.KPIListData = response.dataList;
        this.kpiListdatatotalRecords = response.totalRecords;
      },
      (error: any) => {
        this.kpiListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.KPIListData = [];
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

  clearSearchKPI() {
    this.searchVal = "";
    this.searchkey = "";
    this.getKPIList("");
  }

  addEditKPI(kpiId) {
    this.submitted = true;
    if (this.KPIGroupForm.valid && this.KPIMappingFormArray.valid) {
      if (this.totalAmountPer >= 100) {
        if (kpiId) {
          this.createKPIData = this.KPIGroupForm.value;
          this.createKPIData.id = this.viewKPIDetailData.id;
          this.createKPIData.kpiMasterMappingList = this.KPIMappingFormArray.value;
          const url = "/kpimaster/update";
          this.kpiManagementService.postMethod(url, this.createKPIData).subscribe(
            (response: any) => {
              if (response.responseCode == 200) {
                this.messageService.add({
                  severity: "success",
                  summary: " ",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle"
                });
                this.clearKpiData();
                if (!this.searchkey) {
                  this.getKPIList("");
                } else {
                  this.searchKPI();
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
          this.createKPIData = this.KPIGroupForm.value;
          this.createKPIData.kpiMasterMappingList = this.KPIMappingFormArray.value;
          const url = "/kpimaster/save";
          this.kpiManagementService.postMethod(url, this.createKPIData).subscribe(
            (response: any) => {
              if (response.responseCode == 200) {
                this.messageService.add({
                  severity: "success",
                  summary: " ",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle"
                });
                this.clearKpiData();
                if (!this.searchkey) {
                  this.getKPIList("");
                } else {
                  this.searchKPI();
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
          detail: "Total Amount % not less than 100",
          icon: "far fa-times-circle"
        });
      }
    }
  }

  getKPIDetailById(kpiId) {
    const url = "/kpimaster/" + kpiId;
    this.kpiManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.isKPIEdit = true;
          this.viewKPIDetailData = response.data;
          this.KPIGroupForm.patchValue(this.viewKPIDetailData);
          this.KPIMappingFormArray = this.fb.array([]);
          this.viewKPIDetailData.kpiMasterMappingList.forEach(element => {
            this.KPIMappingFormArray.push(this.fb.group(element));
          });
          this.KPIMappingFormArray.patchValue(this.viewKPIDetailData.kpiMasterMappingList);
          this.totalAmountFun();
          this.totalAmountPerFun();
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

  clearKpiData() {
    this.listView = true;
    this.createView = false;
    this.KPIGroupForm.reset();
    this.submitted = false;
    this.isKPIEdit = false;
    this.KPIMappingFormArray.controls = [];
    this.totalVal = 0;
    this.totalAmountPer = 0;
  }

  createKPIView() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.submitted = false;
    this.isKPIEdit = false;
    this.KPIGroupForm.reset();
    this.KPIMappingFormArray.controls = [];
    let areaName = "";
    this.totalVal = 0;
    this.totalAmountPer = 0;
    for (let i = 0; i <= 4; i++) {
      if (i == 0) {
        areaName = "Renewal";
      } else if (i == 1) {
        areaName = "Activation - inactive";
      } else if (i == 2) {
        areaName = "Activation - Suspend";
      } else if (i == 3) {
        areaName = "Lead Conversion";
      } else if (i == 4) {
        areaName = "Termination (Clouser)";
      }
      this.createKPIMappingFormGroup(areaName);
      this.KPIMappingFormArray.push(this.createKPIMappingFormGroup(areaName));
    }
  }

  searchKPIView() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }

  pageChangedKPIList(pageNumber) {
    this.currentPageKpiListdata = pageNumber;
    if (!this.searchkey) {
      this.getKPIList("");
    } else {
      this.searchKPI();
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageKpiListdata > 1) {
      this.currentPageKpiListdata = 1;
    }
    if (!this.searchkey) {
      this.getKPIList(this.showItemPerPage);
    } else {
      this.searchKPI();
    }
  }

  editKPI(kpiId) {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.isKPIEdit = true;
    this.KPIGroupForm.reset();
    this.KPIMappingFormArray.controls = [];
    this.totalVal = 0;
    this.totalAmountPer = 0;
    this.getKPIDetailById(kpiId);
  }

  deleteConfirmonKPI(KPI) {
    if (KPI) {
      this.confirmationService.confirm({
        message: "Do you want to delete this KPI?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteKPI(KPI);
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

  deleteKPI(KPI) {
    const url = "/kpimaster/delete";
    this.kpiManagementService.postMethod(url, KPI).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (this.currentPageKpiListdata != 1 && this.KPIListData.length == 1) {
            this.currentPageKpiListdata = this.currentPageKpiListdata - 1;
          }
          if (!this.searchkey) {
            this.getKPIList("");
          } else {
            this.searchKPI();
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

  totalAmountFun() {
    this.totalVal = 0;
    for (let i = 0; i < 5; i++) {
      if (!isNaN(Number(this.KPIMappingFormArray.controls[i].value.amount)))
        this.totalVal = this.totalVal + Number(this.KPIMappingFormArray.controls[i].value.amount);
    }
    // this.totalVal = this.totalVal + Number(this.KPIMappingFormArray.controls[i].value.amount);
  }

  totalAmountPerFun() {
    this.totalAmountPer = 0;
    for (let i = 0; i < 5; i++) {
      if (!isNaN(Number(this.KPIMappingFormArray.controls[i].value.amountPercentage)))
        this.totalAmountPer =
          this.totalAmountPer + Number(this.KPIMappingFormArray.controls[i].value.amountPercentage);
    }
  }
}
