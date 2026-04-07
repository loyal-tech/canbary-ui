import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import {
  AREA,
  CITY,
  COUNTRY,
  PINCODE,
  STATE,
  CUSTOMER_PREPAID,
  CUSTOMER_POSTPAID
} from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { CustomerInventoryManagementService } from "src/app/service/customer-inventory-management.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import * as FileSaver from "file-saver";
import jsPDF from "jspdf";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustNotes } from "../../model/CustNotes";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

declare var $: any;

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.scss"]
})
export class CustomerListComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  custTitle = CUSTOMER_PREPAID;
  currentPagecustomerListdata = 1;
  customerListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  customerListdatatotalRecords: any;

  secondarySearchOption: string = "";
  secondarySearchValue: string = "";
  secondaryOptions = [
    { label: "CAF Number", value: "cafNo" },
    { label: "Username", value: "username" },
    { label: "Any", value: "any" }
  ];

  serviceStatusOptions = [
    { label: "InActive", value: "username" },
    { label: "Terminate", value: "terminate" },
    { label: "Suspend", value: "suspend" },
    { label: "Hold", value: "hold" },
    { label: "InGrace", value: "ingrace" },
    { label: "STOP", value: "stop" },
    { label: "Disable", value: "disable" }
  ];

  customerListData: any = [];
  viewcustomerListData: any = [];
  searchOption = "";
  searchDeatil = "";
  searchData;
  AclClassConstants;
  AclConstants;
  searchkey2: string;
  searchkey: string;
  searchOptionSelect = this.commondropdownService.customerSearchOption;
  isPlanOnDemand = false;
  showNearLocationModal = false;
  showViewAttachDeviceModal = false;
  showChangeStatusModal = false;
  uploadAccess: boolean = false;
  notesAccess: boolean = false;
  editAccess: boolean = false;
  nearByDeviceAccess: boolean = false;
  sendPaymentLinkAccess: boolean = false;
  changeStatusAccess: boolean = false;
  selectedCustId = 0;
  custStatus = "";
  fromDate = "";
  toDate = "";
  addNotesForm: FormGroup;
  dialog: boolean = false;
  demographicLabel: any;

  cols = [
    {
      field: "name",
      header: "Name",
      customExportHeader: "Name"
    },
    {
      field: "username",
      header: "Username",
      customExportHeader: "Username"
    },
    {
      field: "serviceArea",
      header: "Service Area",
      customExportHeader: "Service Area"
    },
    {
      field: "mobile",
      header: "Mobile Number",
      customExportHeader: "Mobile Number"
    },
    {
      field: "acctno",
      header: "Account No",
      customExportHeader: "Account No"
    },
    {
      field: "connectionMode",
      header: "	Connection Status",
      customExportHeader: "	Connection Status"
    },
    {
      field: "mvnoName",
      header: "ISP Name",
      customExportHeader: "ISP Name"
    }
  ];
  customerType: any;
  mvnoid: number;
  staffid: number;
  renewPaymentLinkAccess: boolean = false;
  addNotesAccess: boolean = false;
  custId: number;
  attachDeviceData = [];
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    private customerInventoryManagementService: CustomerInventoryManagementService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private liveUserService: LiveUserService,
    public adoptCommonBaseService: AdoptCommonBaseService
  ) {
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
    this.custType = this.route.snapshot.paramMap.get("custType")!;
    let staffID = localStorage.getItem("userId");
    let loggedInUser = localStorage.getItem("loggedInUser");
    this.partnerId = Number(localStorage.getItem("partnerId"));
    this.editAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.EDIT_PRE_CUST
        : POST_CUST_CONSTANTS.EDIT_POST_CUST_LIST
    );
    this.uploadAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.UPLOAD_DOCS_PRE_CUST
        : POST_CUST_CONSTANTS.UPLOAD_DOCUMENTS_POST_CUST_LIST
    );
    this.nearByDeviceAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_NEAR_BY_DEVICE
        : POST_CUST_CONSTANTS.POST_CUST_NEAR_BY_DEVICE
    );
    this.sendPaymentLinkAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.SEND_PAYMENT_LINK_PRE_CUST
        : POST_CUST_CONSTANTS.SEND_PAYMENT_LINK_POST_CUST
    );
    this.changeStatusAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.CHANGE_STATUS_PRE_CUST
        : POST_CUST_CONSTANTS.CHANGE_STATUS_POST_CUST
    );
    this.custType == "Prepaid"
      ? (this.custTitle = CUSTOMER_PREPAID)
      : (this.custTitle = CUSTOMER_POSTPAID);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.renewPaymentLinkAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.RENEW_PAYMENT_PRE_CUST
        : POST_CUST_CONSTANTS.SEND_PAYMENT_LINK_POST_CUST
    );
    this.addNotesAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.ADD_NOTES_PRE_CUST
        : POST_CUST_CONSTANTS.SEND_PAYMENT_LINK_POST_CUST
    );
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  async ngOnInit() {
    this.demographicLabel = RadiusConstants.DEMOGRAPHICDATA || [];
    // customer get data
    this.commondropdownService.getAllActiveStaff();
    this.commondropdownService.getTeamList();
    this.commondropdownService.getCustomerStatus();
    // this.getCustomerList("");
    this.getCustomerType();

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: "",
      fromDate: "",
      toDate: "",
      status: ""
    };
    this.addNotesForm = this.fb.group({
      id: [""],
      notes: ["", Validators.required]
    });
    this.route.queryParams.subscribe(params => {
      let mobileno = params["mobilenumber"];
      if (mobileno) {
        this.searchOption = "mobile";
        this.searchDeatil = mobileno;
      } else {
        this.searchOption = "any";
      }
      this.searchCustomer(true);
    });
  }
  custIdForNotes: any;
  addNotesPopup: boolean = false;
  notesSubmitted: boolean = false;
  addNotesData: CustNotes;

  addNotesSetFunction(custId: any) {
    this.addNotesPopup = true;
    this.custIdForNotes = custId;
  }

  closeNotesModal() {
    this.addNotesPopup = false;
    this.addNotesForm.reset();
  }

  saveNotes(leadId: any) {
    this.notesSubmitted = true;
    if (this.addNotesForm.valid) {
      if (leadId) {
        const url = "/add/notes";
        this.addNotesData = {
          id: 0,
          custId: leadId,
          notes: this.addNotesForm.controls.notes.value
        };
        this.customerManagementService
          .postMethodForCustNotes(url, this.addNotesData, this.mvnoid, this.staffid)
          .subscribe(
            (response: any) => {
              this.notesSubmitted = false;
              if (response.status == 406) {
                this.addNotesPopup = false;
                this.addNotesForm.reset();

                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.message,
                  icon: "far fa-times-circle"
                });
              } else {
                if (
                  (this.searchkey && this.searchkey.toString().trim() !== "") ||
                  (this.searchkey2 && this.searchkey2.toString().trim() !== "")
                ) {
                  this.searchCustomer(true);
                } else {
                  this.getCustomerList("");
                }
                this.addNotesPopup = false;
                this.addNotesForm.reset();

                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle"
                });
              }
            },
            (error: any) => {
              this.addNotesPopup = false;
              this.addNotesForm.reset();

              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            }
          );
      } else {
        this.addNotesForm.reset();
        this.addNotesPopup = false;

        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Lead Id is missing!",
          icon: "far fa-times-circle"
        });
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Required column is missing!",
        icon: "far fa-times-circle"
      });
      this.addNotesPopup = true;
    }
  }

  getCustomerList(list) {
    //
    let size;
    this.searchkey = "";
    this.searchkey2 = "";
    const page = this.currentPagecustomerListdata;
    // if (list) {
    //   size = list;
    //   this.customerListdataitemsPerPage = list;
    // } else {
    //   size = this.customerListdataitemsPerPage;
    // }
    const url =
      `/customers/list/` +
      this.custType +
      "?orgcusttype=false&mvnoId=" +
      localStorage.getItem("mvnoId");

    const custerlist = {
      page,
      pageSize: this.customerListdataitemsPerPage,
      status: "Active"
    };
    this.customerManagementService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.msg,
            icon: "far fa-times-circle"
          });
          this.customerListData = [];
          this.customerListdatatotalRecords = 0;
        } else {
          this.customerListData = response.customerList;
          const usernameList: string[] = [];
          this.customerListData.forEach(element => {
            usernameList.push(element.username);
          });
          this.liveUserService
            .postMethod("/liveUser/isCustomersOnlineOrOffline", {
              users: usernameList
            })
            .subscribe((res: any) => {
              const liveUsers: string[] = res.liveusers;
              this.customerListData.forEach(element => {
                if (liveUsers.findIndex(e => e == element.username) < 0) {
                  element.connectionMode = "Offline";
                } else {
                  element.connectionMode = "Online";
                }
              });
            });
          this.customerListdatatotalRecords = response.pageDetails.totalRecords;
        }
        // this.customerListdataitemsPerPage = response.pageDetails.totalRecordsPerPage;
        // this.currentPagecustomerListdata = response.pageDetails.currentPageNumber;
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

  clearSearchcustomer() {
    this.currentPagecustomerListdata = 1;
    this.getCustomerList("");
    this.searchDeatil = "";
    this.searchOption = "";
    this.secondarySearchOption = "";
    this.secondarySearchValue = "";
    this.fromDate = "";
    this.toDate = "";
  }

  selSearchOption(event) {
    // console.log("value", event.value);
    this.searchDeatil = "";
    // if (event.value) {
    //   this.fieldEnable = true;
    // } else {
    //   this.fieldEnable = false;
    // }
  }

  searchCustomer(isPageChange: boolean = false) {
    // Reset filters
    this.searchData.filters = [
      {
        filterDataType: "",
        filterValue: "",
        filterColumn: "any",
        filterOperator: "equalto",
        filterCondition: "and"
      }
    ];

    if (
      this.searchOption !== "cafCreatedDate" &&
      this.searchOption !== "expiryDate" &&
      this.searchOption !== "firstactivationdate"
    ) {
      if (
        !isPageChange && // ✅ Only reset page when NOT triggered by pagination
        (!this.searchkey ||
          this.searchkey !== this.searchDeatil.trim() ||
          !this.searchkey2 ||
          this.searchkey2 !== this.searchOption.trim())
      ) {
        this.currentPagecustomerListdata = 1;
      }

      this.searchkey = this.searchDeatil.trim();
      this.searchkey2 = this.searchOption.trim();

      this.searchData.filters[0].filterValue = this.searchDeatil.trim();
      this.searchData.filters[0].filterColumn = this.searchOption.trim();
    } else {
      if (
        !isPageChange &&
        (!this.searchkey ||
          this.searchkey !== this.searchDeatil ||
          !this.searchkey2 ||
          this.searchkey2 !== this.searchOption)
      ) {
        this.currentPagecustomerListdata = 1;
      }
      let searchDeatil = this.datePipe.transform(this.searchDeatil, "yyyy-MM-dd");
      this.searchkey = searchDeatil;
      this.searchkey2 = this.searchOption;

      this.searchData.filters[0].filterValue = searchDeatil;
      this.searchData.filters[0].filterColumn = this.searchOption;
    }

    // ✅ Add secondary filter if searchOption is 'status'
    if (
      this.searchOption === "status" &&
      this.secondarySearchOption &&
      this.secondarySearchValue &&
      this.secondarySearchValue.trim() !== ""
    ) {
      this.searchData.filters.push({
        filterDataType: "",
        filterValue: this.secondarySearchValue.trim(),
        filterColumn: this.secondarySearchOption.trim(),
        filterOperator: "equalto",
        filterCondition: "and"
      });
    }

    this.searchData.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    this.searchData.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    this.searchData.status = RadiusConstants.CUSTOMER_STATUS.ACTIVE;

    if (this.searchOption == "service") {
      this.getSearchCustomerByService();
    } else {
      this.searchData.page = this.currentPagecustomerListdata;
      this.searchData.pageSize = this.customerListdataitemsPerPage;
      const url =
        "/customers/search/" + this.custType + "?mvnoId=" + localStorage.getItem("mvnoId");

      this.customerManagementService.postMethod(url, this.searchData).subscribe(
        (response: any) => {
          if (response.status == 204) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.msg,
              icon: "far fa-times-circle"
            });
            this.customerListData = [];
            this.customerListdatatotalRecords = 0;
          } else {
            this.customerListData = response.customerList;
            const usernameList: string[] = [];

            this.customerListData.forEach(element => {
              usernameList.push(element.username);
            });

            this.liveUserService
              .postMethod("/liveUser/isCustomersOnlineOrOffline", {
                users: usernameList
              })
              .subscribe((res: any) => {
                const liveUsers: string[] = res.liveusers;
                this.customerListData.forEach(element => {
                  if (liveUsers.findIndex(e => e == element.username) < 0) {
                    element.connectionMode = "Offline";
                  } else {
                    element.connectionMode = "Online";
                  }
                });
              });
            this.customerListdatatotalRecords = response.pageDetails.totalRecords;
          }
        },
        (error: any) => {
          this.customerListdatatotalRecords = 0;
          if (error.error.status == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.msg,
              icon: "far fa-times-circle"
            });
            this.customerListData = [];
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
  }

  pageChangedcustomerList(pageNumber: number) {
    this.currentPagecustomerListdata = pageNumber;
    if (
      (this.searchkey && this.searchkey.toString().trim() !== "") ||
      (this.searchkey2 && this.searchkey2.toString().trim() !== "")
    ) {
      this.searchCustomer(true); // ✅ pass true to avoid resetting page
    } else {
      this.getCustomerList("");
    }
  }

  TotalItemPerPage(event) {
    this.customerListdataitemsPerPage = Number(event.value);
    if (this.currentPagecustomerListdata > 1) {
      this.currentPagecustomerListdata = 1;
    }
    if (
      (this.searchkey && this.searchkey.toString().trim() !== "") ||
      (this.searchkey2 && this.searchkey2.toString().trim() !== "")
    ) {
      this.searchCustomer(true);
    } else {
      this.getCustomerList(this.customerListdataitemsPerPage);
    }
  }

  getSearchCustomerByService() {
    const url =
      "/getByCustomerService?page=" +
      this.currentPagecustomerListdata +
      "&pageSize=" +
      this.customerListdataitemsPerPage +
      "&service=" +
      this.searchDeatil +
      "&customerType=" +
      this.custType;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerListData = response.customers.content;
        const usernameList: string[] = [];
        this.customerListData.forEach(element => {
          usernameList.push(element.username);
        });

        this.liveUserService
          .postMethod("/liveUser/isCustomersOnlineOrOffline", {
            users: usernameList
          })
          .subscribe((res: any) => {
            const liveUsers: string[] = res.liveusers;
            this.customerListData.forEach(element => {
              if (liveUsers.findIndex(e => e == element.username) < 0) {
                element.connectionMode = "Offline";
              } else {
                element.connectionMode = "Online";
              }
            });
          });
        this.customerListdatatotalRecords = response.customers.totalElements;

        this.customerListdataitemsPerPage = response.pageDetails.totalRecordsPerPage;
        this.currentPagecustomerListdata = response.pageDetails.currentPageNumber;
      },
      (error: any) => {
        this.customerListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.customerListData = [];
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

  getPaytmLink(custId) {
    this.customerManagementService.getPaytmLink(custId).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-check-circle"
        });
      },

      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  stopBilling(id) {
    const url = "/invoiceV2/stop/billing/" + id;
    let data = {};
    this.customerManagementService.postMethodPasssHeader(url, data).subscribe(
      (response: any) => {
        if (
          (this.searchkey && this.searchkey.toString().trim() !== "") ||
          (this.searchkey2 && this.searchkey2.toString().trim() !== "")
        ) {
          this.searchCustomer(true);
        } else {
          this.getCustomerList("");
        }
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
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

  playstartBilling(id) {
    const url = "/invoiceV2/start/billing/" + id;
    let data = {};
    this.customerManagementService.postMethodPasssHeader(url, data).subscribe(
      (response: any) => {
        if (
          (this.searchkey && this.searchkey.toString().trim() !== "") ||
          (this.searchkey2 && this.searchkey2.toString().trim() !== "")
        ) {
          this.searchCustomer(true);
        } else {
          this.getCustomerList("");
        }
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
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

  openChangeStatus(id, status) {
    this.selectedCustId = id;
    this.custStatus = status;
    this.showChangeStatusModal = true;
  }

  closeChangeStatusEvent() {
    this.selectedCustId = 0;
    this.custStatus = "";
    this.showChangeStatusModal = false;
    this.getCustomerList("");
  }

  openNearLocationModal(custId) {
    this.selectedCustId = custId;
    this.showNearLocationModal = true;
  }

  closeNearLocationModal() {
    this.showNearLocationModal = false;
    this.selectedCustId = 0;
  }

  exportCustomer() {
    import("xlsx").then(xlsx => {
      let z = this.customerListData.map((ele: any) => {
        let x = {};
        this.cols.forEach((d: any) => {
          x = { ...x, [d.customExportHeader]: ele?.[d.field] };
        });
        return x;
      });
      const worksheet = xlsx.utils.json_to_sheet(z);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "Customer");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + "_Export_" + new Date().getTime() + EXCEL_EXTENSION);
  }

  getCustomerType() {
    const url = "/commonList/Customer_Type";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.customerType = response.dataList;
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

  openPaymentGateways(custId, isRenew) {
    const url = "/generatePaymentLink/" + custId;
    this.customerManagementService.postMethod(url, null).subscribe(
      (response: any) => {
        let payData = response.data;
        if (response.data == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Unpaid Invoice Found for this Customer",
            icon: "far fa-times-circle"
          });
        } else {
          window.open(`${window.location.origin}/#/customer/payMethod/${payData}`);
          //   this.router.navigate(["/customer/payMethod/" + payData]);
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

  openRenewPaymentGateways(custId, isRenew) {
    const url = "/generatePaymentLink/" + custId;
    this.customerManagementService.postMethod(url, null).subscribe(
      (response: any) => {
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          let payData = response.data;
          if (response.data == null) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "Something went wrong!",
              icon: "far fa-times-circle"
            });
          } else {
            window.open(`${window.location.origin}/#/customer/payMethod/${payData}`);
            //   this.router.navigate(["/customer/payMethod/" + payData]);
          }
        }
      },
      (error: any) => {
        if (error.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.responseMessage,
            icon: "far fa-times-circle"
          });
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

  openModal(custId) {
    this.dialog = true;
    this.custId = custId;
  }

  openViewAttachDeviceModal(custId: number) {
    this.showViewAttachDeviceModal = true;
    const bindUrl = `/customer/viewCustomerNetworkBindByCustId?custId=${custId}`;
    this.customerInventoryManagementService.getMethod(bindUrl).subscribe(
      (bindRes: any) => {
        this.attachDeviceData = bindRes?.data || null;
      },
      error => {
        console.error("Error loading attach device data", error);
        this.attachDeviceData = null;
      }
    );
  }

  closeViewAttachDeviceModal() {
    this.showViewAttachDeviceModal = false;
    this.attachDeviceData = null;
  }

  closeSelectStaff() {
    this.custId = null;
    this.dialog = false;
  }

  getDemographicLabel(currentName: string): string {
    if (!this.demographicLabel || this.demographicLabel.length === 0) {
      return currentName;
    }

    const label = this.demographicLabel.find(item => item.currentName === currentName);
    return label ? label.newName : currentName;
  }
}
