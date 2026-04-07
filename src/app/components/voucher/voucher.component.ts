import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { VoucherService } from "src/app/service/voucher.service";
import * as XLSX from "xlsx";
import { countries } from "../model/country";
import { LoginService } from "src/app/service/login.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { SystemconfigService } from "src/app/service/systemconfig.service";

@Component({
  selector: "app-voucher",
  templateUrl: "./voucher.component.html",
  styleUrls: ["./voucher.component.css"]
})
export class VoucherComponent implements OnInit {
  checked: boolean = false;
  allChecked: boolean = false;
  selectedCities: string[] = [];
  public model: any;
  searchVoucherForm: FormGroup;
  countries: any = countries;
  customerGroupForm: FormGroup;
  allIsChecked: boolean = false;
  modalToggle: boolean = false;
  //Used for pagination
  totalElements: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  voucherIdSms = "";
  voucherCodeSms: String = "";
  fileName = "voucher.xlsx";
  submitted: boolean;
  showBatch: boolean;
  batchData: string[] = [];
  status = [
    { label: "GENERATED" },
    { label: "ACTIVE" },
    { label: "BLOCKED" },
    { label: "USED" },
    { label: "SCRAPPED" },
    { label: "EXPIRED" }
  ];
  voucherConfigData: any = [];
  voucherData: any = [];
  errorData: any = [];
  errorMsg = "";
  voucherId: any = [];
  checkVoucher: any = {};
  checkedIDs = [];
  allIDs = [];
  isChecked: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: number;
  searchkey: string;
  voucherIdSet = new Set();
  totalvoucherIdList = [];
  selectedItemsList = [];
  lastkeydown1: number = 0;
  batchNameList;
  batchNameSet = new Set();
  totalBatchNameList = [];
  activeAccess: boolean = false;
  blockAccess: boolean = false;
  unblockAccess: boolean = false;
  scrap: boolean = false;
  downloadAccess: boolean = false;
  voucherBatchAccess: boolean = false;
  voucherManageAccess: boolean = false;
  createVoucherAccess: boolean = false;
  editVoucherAccess: boolean = false;
  deleteVoucherAccess: boolean = false;
  smsAccess: boolean = false;
  batchId = history.state.data ? history.state.data.batchId : null;
  batchName = history.state.data ? history.state.data.batchName : null;
  currency: any;
  constructor(
    private voucherService: VoucherService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    loginService: LoginService,
    public systemService: SystemconfigService
  ) {
    this.createVoucherAccess = loginService.hasPermission(PRODUCTS.VOUCHER_CREATE);
    this.editVoucherAccess = loginService.hasPermission(PRODUCTS.VOUCHER_EDIT);
    this.deleteVoucherAccess = loginService.hasPermission(PRODUCTS.VOUCHER_DELETE);
    this.voucherBatchAccess = loginService.hasPermission(PRODUCTS.SHOW_VOUCHER_BATCH);
    this.voucherManageAccess = loginService.hasPermission(PRODUCTS.SHOW_MANAGE_VOUCHERS);
    this.activeAccess = loginService.hasPermission(PRODUCTS.VOUCHER_ACTIVE);
    this.blockAccess = loginService.hasPermission(PRODUCTS.VOUCHER_BLOCK);
    this.unblockAccess = loginService.hasPermission(PRODUCTS.VOUCHER_UNBLOCK);
    this.scrap = loginService.hasPermission(PRODUCTS.VOUCHER_SCRAP);
    this.smsAccess = loginService.hasPermission(PRODUCTS.SEND_SMS_MANAGE_VOUCHERS);
    this.downloadAccess = loginService.hasPermission(PRODUCTS.DOWNLOAD_VOUCHER);
    this.showBatch = true;
  }

  ngOnInit(): void {
    if (this.batchId == null) {
      this.getAllVouchers("");
    } else {
      this.findByBatchId(this.batchId);
    }
    this.searchVoucherForm = this.fb.group({
      batchName: ["", Validators.required],
      configId: [""],
      status: [""]
    });
    this.customerGroupForm = this.fb.group({
      countryCode: ["+91"],
      mobileNo: ["", [Validators.required, Validators.pattern("[0-9]+")]]
    });
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  clearcustomerGroupForm() {
    this.customerGroupForm = this.fb.group({
      countryCode: ["+91"],
      mobileNo: ["", [Validators.required, Validators.pattern("[0-9]+")]]
    });
  }

  showSendSms(id, code) {
    this.modalToggle = true;
    this.voucherIdSms = id;
    this.voucherCodeSms = code;
  }
  closeModalSendSMS() {
    this.modalToggle = false;
  }
  sendSms(voucherIdSms) {
    let countryCode = this.customerGroupForm.value.countryCode;
    let mobileNo = this.customerGroupForm.value.mobileNo;
    this.voucherService.sendSms(countryCode, mobileNo, voucherIdSms, this.voucherCodeSms).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        this.clearcustomerGroupForm();
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
  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (this.searchkey) {
      this.searchVoucher();
    } else if (this.batchId == null) {
      this.getAllVouchers("");
    } else {
      this.findByBatchId(this.batchId);
    }
  }

  addVoucher(id, event: any) {
    if (event.checked) {
      this.allIDs.push(id);
      if (this.allIDs.length === this.voucherData.length) {
        this.isChecked = true;
      }
    } else {
      let voucherDetails = this.voucherData;
      voucherDetails.forEach(element => {
        if (element.eventId == id) {
          element.isChecked = false;
        }
      });
      if (this.allIsChecked == true) {
        this.allIDs.forEach((value, index) => {
          if (value == id) {
            this.allIDs.splice(index, 1);
          }
        });
      }

      if (this.allIDs.length == 0 || this.allIDs.length !== this.voucherData.length) {
        this.isChecked = false;
      }
    }
  }

  findByBatchId(batchId) {
    this.allIDs = [];
    this.voucherData = [];
    this.itemsPerPage = this.showItemPerPage ? this.showItemPerPage : this.itemsPerPage;
    this.voucherService.findByBatchId(batchId, this.currentPage, this.itemsPerPage).subscribe(
      (response: any) => {
        this.voucherData = response.voucher.content;
        this.totalElements = response.voucher.totalElements;
        if (this.allIsChecked == true) {
          let voucherDetail = this.voucherData;
          for (let i = 0; i < voucherDetail.length; i++) {
            this.allIDs.push(this.voucherData[i].id);
          }
          this.allIDs.forEach((value, index) => {
            voucherDetail.forEach(element => {
              if (element.id == value) {
                element.isChecked = true;
              }
            });
            this.allIsChecked = true;
          });
        }
        this.searchVoucherForm.patchValue({
          batchName: this.batchName
        });
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

  changeStatusToActive() {
    if (this.allChecked) {
      this.voucherService.changeStatusToActive(this.allIDs).subscribe(
        (response: any) => {
          //this.voucherData = response;
          this.pageChanged(1);
          this.checkedIDs = [];
          this.allIDs = [];
          this.allIsChecked = false;
          this.isChecked = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 400) {
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
    } else {
      this.voucherService.changeStatusToActive(this.allIDs).subscribe(
        (response: any) => {
          // checkedIDs
          //this.voucherData = response;
          this.pageChanged(1);
          this.checkedIDs = [];
          this.allIDs = [];
          this.allIsChecked = false;
          this.isChecked = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 400) {
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
  changeStatusToBlock() {
    if (this.allChecked) {
      this.voucherService.changeStatusToBlock(this.allIDs).subscribe(
        (response: any) => {
          //this.voucherData = response;
          this.pageChanged(1);
          this.checkedIDs = [];
          this.allIDs = [];
          this.allIsChecked = false;
          this.isChecked = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 400) {
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
    } else {
      this.voucherService.changeStatusToBlock(this.allIDs).subscribe(
        (response: any) => {
          // this.voucherData = response;
          this.pageChanged(1);
          this.checkedIDs = [];
          this.allIDs = [];
          this.allIsChecked = false;
          this.isChecked = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 400) {
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
  changeStatusToUnblock() {
    if (this.allChecked) {
      this.voucherService.changeStatusToUnblock(this.allIDs).subscribe(
        (response: any) => {
          //this.voucherData = response;
          this.pageChanged(1);
          this.allIsChecked = false;
          this.isChecked = false;
          this.checkedIDs = [];
          this.allIDs = [];
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 400) {
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
    } else {
      this.voucherService.changeStatusToUnblock(this.allIDs).subscribe(
        (response: any) => {
          //this.voucherData = response;
          this.pageChanged(1);
          this.checkedIDs = [];
          this.allIsChecked = false;
          this.isChecked = false;
          this.allIDs = [];
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 400) {
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
  changeStatusToScrap() {
    if (this.allChecked) {
      this.voucherService.changeStatusToScrap(this.allIDs).subscribe(
        (response: any) => {
          //this.voucherData = response;
          this.pageChanged(1);
          this.checkedIDs = [];
          this.allIDs = [];

          this.allIsChecked = false;
          this.isChecked = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 400) {
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
    } else {
      this.voucherService.changeStatusToScrap(this.allIDs).subscribe(
        (response: any) => {
          //this.voucherData = response;
          this.pageChanged(1);
          this.checkedIDs = [];
          this.allIDs = [];
          this.allIsChecked = false;
          this.isChecked = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 400) {
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
  searchVoucher() {
    //  var f = '';
    //  var t = '';

    if (!this.searchkey || this.searchkey !== this.searchVoucherForm.value) {
      this.currentPage = 1;
      this.allIsChecked = false;
      this.isChecked = false;
    }
    this.searchkey = this.searchVoucherForm.value;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }

    // if (this.searchVoucherForm.value.fromDate) {
    //   f = this.datePipe.transform(
    //     this.searchVoucherForm.controls.fromDate.value,
    //     'yyyy-MM-dd'
    //   );
    // }
    // if (this.searchVoucherForm.value.toDate) {
    //   t = this.datePipe.transform(
    //     this.searchVoucherForm.controls.toDate.value,
    //     'yyyy-MM-dd'
    //   );
    // }
    let status = "";
    let batchName = "";
    if (
      this.searchVoucherForm.value.status != null &&
      this.searchVoucherForm.value.status != "null"
    ) {
      status = this.searchVoucherForm.value.status;
    }
    if (
      this.searchVoucherForm.value.batchName != null &&
      this.searchVoucherForm.value.batchName != "null"
    ) {
      batchName = this.searchVoucherForm.value.batchName;
    }
    this.voucherService
      .findVouchers(
        batchName,
        status
        //this.currentPage,
        // this.itemsPerPage
      )
      .subscribe(
        (response: any) => {
          if (response.status == 204) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.message,
              icon: "far fa-times-circle"
            });
            this.voucherData = [];
            this.totalElements = 0;
            this.batchNameSet.clear();
            this.totalBatchNameList = [];
            return;
          }
          this.voucherData = response.voucher.content;
          this.totalElements = response.voucher.totalElements;
          for (let index = 0; index < this.voucherData.length; index++) {
            const voucher = this.voucherData[index];
            this.batchNameSet.add(voucher.batchName);
          }
          this.totalBatchNameList = Array.from(this.batchNameSet);
          this.isChecked = false;
          this.allIDs = [];
          // if (this.allIsChecked == true) {
          //   this.allChecked = true;
          //   this.allIDs = [];
          //   let voucherDetail = this.voucherData;
          //   for (let i = 0; i < voucherDetail.length; i++) {
          //     this.allIDs.push(this.voucherData[i].id);
          //   }
          //   this.allIDs.forEach((value, index) => {
          //     voucherDetail.forEach((element) => {
          //       if (element.id == value) {
          //         element.isChecked = true;
          //       }
          //     });
          //     this.allIsChecked = true;
          //     //this.isChecked = true;
          //   });
          // }
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
          this.voucherData = [];
          this.totalElements = 0;
        }
      );
  }

  clearSearchForm() {
    this.batchId = null;
    this.currentPage = 1;
    this.searchVoucherForm.reset();
    this.searchVoucherForm.patchValue({
      status: "null"
    });
    this.getAllVouchers("");
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey && this.batchId == null) {
      this.getAllVouchers(this.showItemPerPage);
    } else if (this.searchkey && this.batchId == null) {
      this.searchVoucher();
    } else {
      this.findByBatchId(this.batchId);
    }
  }
  getAllVoucherConfigurations() {
    this.voucherService.getAllVoucherConfgiuration().subscribe(
      response => {
        this.voucherConfigData = response;
      },
      error => {
        this.errorData = error;
        this.errorMsg = this.errorData.errorMessage;
      }
    );
  }

  addAllVoucher(event) {
    if (event.checked == true) {
      this.allIDs = [];
      this.allChecked = true;
      let voucherDetail = this.voucherData;
      for (let i = 0; i < voucherDetail.length; i++) {
        this.allIDs.push(this.voucherData[i].id);
      }
      this.allIDs.forEach((value, index) => {
        voucherDetail.forEach(element => {
          if (element.id == value) {
            element.isChecked = true;
          }
        });
      });
      this.allIsChecked = true;
    }
    if (event.checked == false) {
      this.allChecked = false;
      let voucherDetail = this.voucherData;
      this.allIDs.forEach((value, index) => {
        voucherDetail.forEach(element => {
          if (element.id == value) {
            element.isChecked = false;
          }
        });
      });
      this.allIDs = [];
      this.allIsChecked = false;
      this.isChecked = false;
    }
  }

  // getAllVouchers(list) {
  //
  //   let size;
  //   this.searchkey = '';
  //   let page = this.currentPage;
  //   if (list) {
  //     size = list;
  //     this.itemsPerPage = list;
  //   } else {
  //     size = this.itemsPerPage;
  //   }
  //   this.voucherService.getAllVouchers(page, size).subscribe(
  //     (response: any) => {
  //       console.log("***started****")
  //       this.voucherData = response.voucher.content;
  //       this.totalRecords = response.voucher.totalRecords;
  //       console.log(response.voucher);
  //       for (let index = 0; index < response.totalElements; index++) {
  //         const voucher = this.voucherData[index];
  //         console.log("voucher" , voucher);
  //         this.batchNameSet.add(voucher.batchName);

  //       }

  //       // if (this.allIsChecked == true) {
  //       this.isChecked = false;
  //       this.allIDs = [];
  //       // }

  //       //console.log(this.batchNameSet);
  //       this.totalBatchNameList = Array.from(this.batchNameSet);
  //       console.log("#####ended####");
  //       //console.log(this.batchNameArray);
  //
  //     },
  //     (error: any) => {
  //       this.voucherData = [];
  //       this.totalRecords = 0;
  //       if (error.error.status == 404) {
  //         this.messageService.add({
  //           severity: 'info',
  //           summary: 'Info',
  //           detail: error.error.errorMessage,
  //           icon: 'far fa-times-circle',
  //         });
  //       } else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: error.error.errorMessage,
  //           icon: 'far fa-times-circle',
  //         });
  //       }
  //
  //     }
  //   );
  // }

  getAllVouchers(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.voucherService.getAllVouchers(page, size).subscribe(
      (response: any) => {
        if (response.status === 204) {
          this.voucherData = [];
          this.totalElements = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.errorMessage,
            icon: "pi pi-info-circle"
          });
        } else {
          this.voucherData = response.voucher.content;
          this.totalElements = response.voucher.totalElements;
        }
      },
      error => {
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
        this.totalElements = 0;
        this.voucherData = [];
      }
    );
  }

  getUserIdsFirstWay($event) {
    let batchName = (<HTMLInputElement>document.getElementById("batchName")).value;
    this.batchNameList = [];

    if (batchName.length > 2) {
      if ($event.timeStamp - this.lastkeydown1 > 200) {
        this.batchNameList = this.searchFromArray(this.totalBatchNameList, batchName);
      }
    }
  }

  searchFromArray(arr, regex) {
    let matches = [],
      i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].match(regex)) {
        matches.push(arr[i]);
      }
    }
    return matches;
  }

  async exportExcel() {
    let batchName = this.searchVoucherForm.controls.batchName.value
      ? this.searchVoucherForm.controls.batchName.value
      : "";
    let status = this.searchVoucherForm.controls.status.value
      ? this.searchVoucherForm.controls.status.value
      : "";
    this.voucherService.getDataTOExport(batchName, status).subscribe(
      (res: any) => {
        if (res.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: res.errorMessage,
            icon: "far fa-times-circle"
          });
        } else if (res.status == 401) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: res.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res.dataToExport);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, batchName);
          XLSX.writeFile(wb, batchName ? batchName + ".xlsx" : "Vouchers" + ".xlsx");
        }
      },
      (error: any) => {
        if (error.error.status == 400) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
}
