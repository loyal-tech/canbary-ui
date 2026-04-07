import { Component, OnInit, ViewChild } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LiveUserService } from "src/app/service/live-user.service";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as XLSX from "xlsx";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { BehaviorSubject } from "rxjs";
import { CustomerDetailsService } from "../../service/customer-details.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { DatePipe } from "@angular/common";

declare var $: any;

@Component({
  selector: "app-live-user",
  templateUrl: "./live-user.component.html",
  styleUrls: ["./live-user.component.css"]
})
export class LiveUserComponent implements OnInit {
  liveUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  presentGroupForm: FormGroup;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: any;
  searchForm: FormGroup;
  searchSubmitted = false;
  liveUserDetail: any = [];
  fileName = "Live-User.xlsx";
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  mvnoId: any = "";
  checkedIDs: any = [];
  allIDs: any = [];
  isChecked: boolean = false;
  allIsChecked: boolean = false;
  displayShiftLocationDetails: boolean = false;
  checked: boolean = false;
  allChecked: boolean = false;
  rootInstanceData: any = null;

  cols: any[] = [
    {
      field: "",
      header: "",
      customExportHeader: ""
    }
  ];
  selectedCols: any[] = [];
  exportColumns: any = [];
  hideTable: boolean = false;
  value: string = "Simple Search";
  custID: number;
  public loginService: LoginService;
  //   viewAccess: any;
  //   createAccess: any;
  //   editAccess: any;
  //   deleteAccess: any;
  custId = new BehaviorSubject({
    custId: ""
  });
  dialogId: boolean = false;
  maxconcurrentsession: number;
  searchOptionSelect = [
    { label: "User Name", value: "userName" },
    { label: "Framed Ip Address", value: "framedIpAddress" },
    { label: "Nas Ip Address", value: "nasIpAddress" },
    { label: "Class Attribute", value: "classAttribute" },
    { label: "Account Status Type", value: "acctStatusType" },
    { label: "Nas Identifier", value: "nasIdentifier" },
    { label: "Framed Route", value: "framedRoute" },
    { label: "Nas Port Type", value: "nasPortType" },
    { label: "Nas Port Id", value: "nasPortId" },
    { label: "Account Multi Session Id", value: "acctMultiSessionId" },
    { label: "Framed Ipv6 Address", value: "framedIpv6Address" },
    { label: "Account Session Id", value: "acctSessionId" },
    { label: "Source Ip Address", value: "sourceIpAddress" }
  ];
  searchOption: any = [];

  constructor(
    private liveUserService: LiveUserService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    loginService: LoginService,
    private customerDetailsService: CustomerDetailsService,
    private datePipe: DatePipe
  ) {
    this.loginService = loginService;
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      userName: [""],
      framedIpAddress: [""],
      nasIpAddress: [""],
      classAttribute: [""],
      acctStatusType: [""],
      acctSessionId: [""],
      nasIdentifier: [""],
      framedRoute: [""],
      nasPortType: [""],
      nasPortId: [""],
      acctMultiSessionId: [""],
      framedIpv6Address: [""],
      sourceIpAddress: [""],
      fromDate: [""],
      toDate: [""]
    });
    this.presentGroupForm = this.fb.group({
      maxconcurrentsession: [""]
    });
    this.mvnoId = localStorage.getItem("mvnoId");
    this.getAll("");
  }
  async exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.liveUsers);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, this.fileName);
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

  getAll(list) {
    this.liveUsers = [];
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.liveUserService.getAll(page, size).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        } else {
          this.liveUsers = response.liveUser.content;
          this.liveUsers.forEach(element => {
            const dateObj = new Date(element.acctSessionTime * 1000);
            const hours = dateObj.getUTCHours();
            const minutes = dateObj.getUTCMinutes();
            const seconds = dateObj.getSeconds();

            const timeString =
              hours.toString().padStart(2, "0") +
              ":" +
              minutes.toString().padStart(2, "0") +
              ":" +
              seconds.toString().padStart(2, "0");

            element.acctSessionTime = timeString;
            element.isDeleted = true;
            element.isView = true;
            element.isDisconnect = true;
            element.createDate = this.datePipe.transform(
              element.createDate,
              "dd MMM yyyy HH:mm:ss"
            );
            element.lastModificationDate = this.datePipe.transform(
              element.lastModificationDate,
              "dd MMM yyyy HH:mm:ss"
            );
          });
          // this.saveShiftLocation(this.custId);
          this.totalRecords = response.liveUser.totalElements;
          this.getRootInstanceData(this.liveUsers);
        }
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
    const allEmpty = Object.values(this.searchForm.value).every(
      value => value === "" || value === null
    );
    if (allEmpty === true) {
      return this;
    }
    var f = "";
    var t = "";
    this.searchSubmitted = true;

    if (this.searchForm.value.userName == null) {
      this.searchForm.value.userName = "";
    }
    if (this.searchForm.value.framedIpAddress == null) {
      this.searchForm.value.framedIpAddress = "";
    }
    if (this.searchForm.value.nasIpAddress == null) {
      this.searchForm.value.nasIpAddress = "";
    }
    if (this.searchForm.value.classAttribute == null) {
      this.searchForm.value.classAttribute = "";
    }
    if (this.searchForm.value.acctStatusType == null) {
      this.searchForm.value.acctStatusType = "";
    }
    if (this.searchForm.value.nasIdentifier == null) {
      this.searchForm.value.nasIdentifier = "";
    }
    if (this.searchForm.value.framedRoute == null) {
      this.searchForm.value.framedRoute = "";
    }
    if (this.searchForm.value.nasPortType == null) {
      this.searchForm.value.nasPortType = "";
    }
    if (this.searchForm.value.nasPortId == null) {
      this.searchForm.value.nasPortId = "";
    }
    if (this.searchForm.value.acctMultiSessionId == null) {
      this.searchForm.value.acctMultiSessionId = "";
    }
    if (this.searchForm.value.framedIpv6Address == null) {
      this.searchForm.value.framedIpv6Address = "";
    }
    if (this.searchForm.value.acctSessionId == null) {
      this.searchForm.value.acctSessionId = "";
    }
    if (this.searchForm.value.sourceIpAddress == null) {
      this.searchForm.value.sourceIpAddress = "";
    }
    if (this.searchForm.value.fromDate) {
      f = this.datePipe.transform(this.searchForm.controls.fromDate.value, "yyyy-MM-dd");
    }
    if (this.searchForm.value.toDate) {
      t = this.datePipe.transform(this.searchForm.controls.toDate.value, "yyyy-MM-dd");
    }
    if (this.searchForm.valid) {
      const isSearchKeyValid = this.searchOption.includes(this.searchkey);
      const hasDates = this.searchForm.value.fromDate || this.searchForm.value.toDate;
      if (!this.searchkey || (!isSearchKeyValid && !hasDates)) {
        this.currentPage = 1;
      }
      if (this.searchOption.length === 0) {
        this.searchkey = this.searchForm.value.fromDate
          ? this.searchForm.value.fromDate
          : this.searchForm.value.toDate;
      } else {
        this.searchkey = this.searchOption[0];
      }
      if (this.showItemPerPage) {
        this.itemsPerPage = this.showItemPerPage;
      }
      this.liveUsers = [];
      const { fromDate, toDate, ...rest } = this.searchForm.value;

      let searchData = {
        page: this.currentPage,
        size: this.itemsPerPage,
        fromDate: f,
        toDate: t,
        ...rest
      };
      this.liveUserService.getByUserName(searchData).subscribe(
        (response: any) => {
          this.liveUsers = response.liveUser.content;
          this.liveUsers.forEach(element => {
            const dateObj = new Date(element.acctSessionTime * 1000);

            const hours = dateObj.getUTCHours();
            const minutes = dateObj.getUTCMinutes();
            const seconds = dateObj.getSeconds();
            const timeString =
              hours.toString().padStart(2, "0") +
              ":" +
              minutes.toString().padStart(2, "0") +
              ":" +
              seconds.toString().padStart(2, "0");

            element.acctSessionTime = timeString;
            element.isDeleted = true;
            element.isView = true;
            element.isDisconnect = true;
            element.createDate = this.datePipe.transform(
              element.createDate,
              "dd MMM yyyy HH:mm:ss"
            );
            element.lastModificationDate = this.datePipe.transform(
              element.lastModificationDate,
              "dd MMM yyyy HH:mm:ss"
            );
          });
          this.totalRecords = response.liveUser.totalElements;
          this.getRootInstanceData(this.liveUsers);
        },
        (error: any) => {
          this.liveUsers = [];
          this.getRootInstanceData(this.liveUsers);
          if (error.error.status == 404) {
            this.totalRecords = 0;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          } else {
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

  deleteConfirm(d: any) {
    this.confirmationService.confirm({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.delete(d.cdrID);
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
  async delete(cdrId) {
    this.liveUsers = this.liveUsers.filter(user => user.cdrId !== cdrId);

    this.liveUserService.delete(cdrId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.liveUsers.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.getAll("");
        } else {
          this.search();
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
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

  liveUserDetailModal: boolean = false;
  async getLiveUserDetail(event) {
    this.liveUserService.getLiveUserDetail(event.cdrID).subscribe(
      (response: any) => {
        this.liveUserDetail = response.liveUserDetail;
        this.liveUserDetailModal = true;
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

  saveShiftLocation() {
    // this.custId =
    const custId = this.custId;

    const data = {
      custId: Number(custId),
      maxconcurrentsession: this.presentGroupForm.get("maxconcurrentsession").value
    };
    this.liveUserService.postLiveUserDetail(data).subscribe(
      (response: any) => {
        this.displayShiftLocationDetails = false;
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

  closeShiftLocation() {
    this.displayShiftLocationDetails = false;
  }

  open(event) {
    this.custId = event.custid;
    this.displayShiftLocationDetails = true;
  }

  openModal(id, custId) {
    this.dialogId = true;
    this.custId.next({
      custId: custId
    });
  }

  closeSelectStaff() {
    this.dialogId = false;
  }

  clearSearchForm() {
    this.currentPage = 1;
    this.searchSubmitted = false;
    this.getAll("");
    this.searchForm.reset();
    this.searchOption = [];
  }

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getAll("");
    } else {
      this.search();
    }
  }
  addAllUser(event) {
    if (event.checked == true) {
      this.allIDs = [];
      let liveUserDetail = this.liveUsers;
      for (let i = 0; i < liveUserDetail.length; i++) {
        this.allIDs.push(this.liveUsers[i].cdrID);
      }

      this.allIDs.forEach((value, index) => {
        liveUserDetail.forEach(element => {
          if (element.cdrID == value) {
            element.isChecked = true;
          }
        });
      });
      this.allIsChecked = true;
    }
    if (event.checked == false) {
      let liveUserDetail = this.liveUsers;
      this.allIDs.forEach((value, index) => {
        liveUserDetail.forEach(element => {
          if (element.cdrID == value) {
            element.isChecked = false;
          }
        });
      });
      this.allIDs = [];
      this.allIsChecked = false;
      this.isChecked = false;
    }
  }

  addUser(id, event: any) {
    if (event.checked) {
      this.allIDs.push(id);
      if (this.allIDs.length === this.liveUsers.length) {
        this.isChecked = true;
      }
    } else {
      let liveUserDetails = this.liveUsers;
      liveUserDetails.forEach(element => {
        if (element.cdrID == id) {
          element.isChecked = false;
        }
      });

      this.allIDs.forEach((value, index) => {
        if (value == id) {
          this.allIDs.splice(index, 1);
        }
      });

      if (this.allIDs.length == 0 || this.allIDs.length !== this.liveUsers.length) {
        this.isChecked = false;
      }
    }
  }

  terminateUsers() {
    let dataIds;
    let userDetails = [];
    userDetails = this.liveUsers;
    let terminateUserData = [];
    if (this.allChecked) {
      dataIds = this.allIDs;
    } else {
      dataIds = this.allIDs;
    }

    dataIds.forEach(id => {
      userDetails.forEach(element => {
        if (element.cdrID == id) {
          terminateUserData.push({
            mvnoId: this.mvnoId,
            userName: element.userName
          });
        }
      });
    });

    this.liveUserService.terminateUser(terminateUserData).subscribe(
      (response: any) => {
        this.allIDs = [];
        this.allChecked = false;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });

        this.getAll("");
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
  manageLocalData(data: any) {
    this.cols = [];
    this.selectedCols = [];
    this.rootInstanceData = data;
    if (data?.[0]) {
      this.cols = Object.keys(data?.[0]).map(ele => ({
        field: ele,
        header: ele,
        customExportHeader: ele
      }));
      this.cols.push({
        field: "Actions",
        header: "Actions"
      });

      Object.keys(data?.[0]).forEach(element => {
        if (
          element === "userName" ||
          element === "framedIpAddress" ||
          element === "acctInputOctets" ||
          element === "acctOutputOctets" ||
          element === "callingStationId" ||
          element === "framedIPv6Prefix" ||
          element === "createDate" ||
          element === "acctSessionTime" ||
          element === "nasIpAddress"
        ) {
          this.selectedCols.push({
            field: element,
            header: element,
            customExportHeader: element
          });
        }
      });
      this.selectedCols.push({
        field: "Actions",
        header: "Actions"
      });
      this.exportColumns = Object.keys(data?.[0]).map(col => ({
        title: col,
        dataKey: col
      }));
    }
  }

  getRootInstanceData(data: any) {
    if (data) {
      this.manageLocalData(data);
    }
  }

  disconnectConfirm(d: any) {
    this.confirmationService.confirm({
      message: "Do you want to disconnect this user ?",
      header: "Disconnect Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.disconnect(d.cdrID);
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
  async disconnect(cdrId) {
    this.liveUserService.disconnect(cdrId).subscribe(
      (response: any) => {
        if (this.liveUsers.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.getAll("");
        } else {
          this.search();
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
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
  selSearchOption(event) {
    this.searchOption = event.value;
  }
}
