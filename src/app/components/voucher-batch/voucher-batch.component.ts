import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { VoucherBatchService } from "src/app/service/voucher-batch.service";
import { VoucherBatch } from "../model/voucher-batch";

import { DatePipe } from "@angular/common";
import { LoginService } from "src/app/service/login.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { SystemconfigService } from "src/app/service/systemconfig.service";
declare var $: any;
@Component({
  selector: "app-voucher-batch",
  templateUrl: "./voucher-batch.component.html",
  styleUrls: ["./voucher-batch.component.css"]
})
export class VoucherBatchComponent implements OnInit {
  batchData: any = [];
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  searchForm: FormGroup;
  assignForm: FormGroup;
  searchSubmitted = false;
  assignSubmitted = false;
  expiryAccess = false;
  liveUserDetail: any = [];
  fileName = "Live-User.xlsx";
  batchWithoutAssign: any;
  resellerData: any;
  voucherShowBatch: VoucherBatch;
  loggedInUser: string;
  showBatch: boolean;
  currentExpiry: any;
  UpdatedExpiry: any;
  voucherBatchId: number;
  prevMonth: any;
  prevYear: any;
  createdDate: any;
  voucherBatchAccess: boolean = false;
  voucherManageAccess: boolean = false;
  extendExpiry = false;
  currency: string;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private VoucherBatchService: VoucherBatchService,
    private router: Router,
    private datePipe: DatePipe,
    private systemService: SystemconfigService,
    loginService: LoginService
  ) {
    this.expiryAccess = loginService.hasPermission(PRODUCTS.EXTEND_EXPIRY_VOUCHER_BATCH);
    this.voucherBatchAccess = loginService.hasPermission(PRODUCTS.SHOW_VOUCHER_BATCH);
    this.voucherManageAccess = loginService.hasPermission(PRODUCTS.SHOW_MANAGE_VOUCHERS);
    this.showBatch = true;
  }

  ngOnInit(): void {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    this.prevMonth = month === 0 ? 11 : month - 1;
    this.prevYear = this.prevMonth === 11 ? year - 1 : year;

    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.searchForm = this.fb.group({
      batchName: [""]
    });
    this.assignForm = this.fb.group({
      resellerId: ["", Validators.required],
      voucherBatchId: ["", Validators.required],
      lastModifiedBy: [this.loggedInUser],
      overwiteExpiry: [false]
    });
    this.getAll("");
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
    // this.getAllBatchWithoutReseller();
    // this.getAllReseller();
  }

  getAll(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.VoucherBatchService.getAll(page, size).subscribe(
      (response: any) => {
        if (response.status === 204) {
          this.batchData = [];
          this.totalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.errorMessage,
            icon: "pi pi-info-circle"
          });
        } else {
          this.batchData = response.voucherbatch.data;
          this.totalRecords = response.voucherbatch.totalRecords;
        }
        // this.batchData = response.voucherBatchList;
        // this.totalRecords = response.voucherBatchList.length;
      },
      (error: any) => {
        this.batchData = [];
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
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

  currentExpiryUpdate(voucherBatchId, date, create) {
    this.currentExpiry = new Date(date);
    this.createdDate = new Date(create);
    // this.currentExpiry.setMonth(this.prevMonth);
    this.createdDate.setFullYear(this.prevYear);
    this.voucherBatchId = voucherBatchId;
    setTimeout(() => {
      this.extendExpiry = true;
    }, 1000);
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAll(this.showItemPerPage);
    } else {
      this.search();
    }
  }
  getAllBatchWithoutReseller() {
    this.VoucherBatchService.getAllBatchWithoutReseller().subscribe(
      (response: any) => {
        this.batchWithoutAssign = response.voucherBatch;
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
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
  filteredResellerData: any;
  getAllReseller() {
    this.VoucherBatchService.findAllReseller().subscribe(
      (response: any) => {
        this.resellerData = response.resellers.data;
        this.filteredResellerData = this.resellerData.filter(element => element.status == "Active");
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
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

  async search() {
    // this.currentPage = 1;
    if (!this.searchkey || this.searchkey !== this.searchForm.value.batchName) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchForm.value.batchName;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchSubmitted = true;
    let name = this.searchForm.value.batchName ? this.searchForm.value.batchName : "";
    if (this.searchForm.valid) {
      this.VoucherBatchService.getByUserName(name, this.currentPage, this.itemsPerPage).subscribe(
        (response: any) => {
          {
            if (response.status === 204) {
              ((this.batchData = []), (this.totalRecords = 0));
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.errorMessage,
                icon: "pi pi-info-circle"
              });
            } else {
              this.batchData = response.voucherbatch.data;
              this.totalRecords = response.voucherbatch.totalRecords;
            }
          }
        },
        error => {
          this.totalRecords = 0;
          if (error.error.status == 404) {
            this.batchData = [];
            this.totalRecords = 0;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.batchData = [];
            this.totalRecords = 0;
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
  }

  viewVoucher(batchId, batchName) {
    this.router.navigate(["/home/voucher"], {
      state: { data: { batchId: batchId, batchName: batchName } }
    });
  }

  clearSearchForm() {
    this.currentPage = 1;
    this.searchSubmitted = false;
    this.getAll("");
    this.searchForm.reset();
  }

  assignReseller() {
    this.assignSubmitted = true;
    if (this.assignForm.valid) {
      this.assignForm.value.lastModifiedBy = this.loggedInUser;
      this.VoucherBatchService.assignReseller(this.assignForm.value).subscribe(
        (response: any) => {
          this.assignForm.reset();
          this.assignSubmitted = false;
          this.getAll("");
          this.getAllBatchWithoutReseller();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          this.assignForm.reset();
          this.assignSubmitted = false;
          if (error.error.status == 402) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
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
  }
  resellerDropDown: any;
  searchReseller() {
    let selectedBatch;
    this.VoucherBatchService.getAllVoucherBatchData().subscribe(
      (response: any) => {
        // this.batchData = response.voucherBatchList;
        // this.totalRecords = response.voucherBatchList.length;
        this.batchData = response.voucherbatch.data;
        this.totalRecords = response.voucherbatch.totalRecords;
      },
      (error: any) => {
        this.batchData = [];
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
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
    selectedBatch = this.batchData.filter(
      element => element.voucherBatchId == this.assignForm.value.voucherBatchId
    );
    this.resellerDropDown = this.filteredResellerData;
    let resellerFilterDataNew: any = [];
    let isMappedLocationFound: boolean = false;
    selectedBatch.forEach(item => {
      if (item.plan.planLocationsMapping != null) {
        item.plan.planLocationsMapping.forEach(locationData => {
          this.resellerDropDown = [];
          this.filteredResellerData.filter(element => {
            if (element.locationMaster.locationMasterId == locationData.locationId) {
              isMappedLocationFound = true;
              resellerFilterDataNew.push(element);
            }
          });
        });
      }
    });
    if (isMappedLocationFound) {
      this.resellerDropDown = resellerFilterDataNew;
    }
  }
  updateExpiry() {
    //this.UpdatedExpiry = new Date(this.UpdatedExpiry);
    this.UpdatedExpiry = this.datePipe.transform(this.UpdatedExpiry, "yyyy-MM-dd HH:mm");
    this.VoucherBatchService.updateExpiryDate(this.UpdatedExpiry, this.voucherBatchId).subscribe(
      (response: any) => {
        this.UpdatedExpiry = null;
        this.extendExpiry = false;
        this.getAll("");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getAll("");
    } else {
      this.search();
    }
  }
  getVoucherBatchDetails(batchId) {
    for (let index = 0; index < this.batchData.length; index++) {
      if (this.batchData[index].voucherBatchId == batchId) {
        this.voucherShowBatch = this.batchData[index];
      }
    }
  }

  modalCloseExtendExpiry() {
    this.UpdatedExpiry = null;
    this.extendExpiry = false;
  }
}
