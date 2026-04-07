import { DatePipe } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
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
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import * as FileSaver from "file-saver";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustNotes } from "../../model/CustNotes";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { Regex } from "src/app/constants/regex";
import { PrepaidRejectedReasonService } from "src/app/service/prepaid-rejected-reason.service";
import { CustomerInventoryManagementService } from "src/app/service/customer-inventory-management.service";
import { StaffService } from "src/app/service/staff.service";
declare var $: any;

@Component({
  selector: "app-customer-caf-list",
  templateUrl: "./customer-caf-list.component.html",
  styleUrls: ["./customer-caf-list.component.scss"]
})
export class CustomerCafListComponent implements OnInit {
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
  customerListDatalength = 0;
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
  approved = false;
  selectStaff: any;
  assignCustomerCAFModal: boolean = false;
  assignCustomerCAFId: any;
  nextApproverId: any;
  assignCustomerCAFsubmitted: boolean = false;
  approveCAF = [];
  rejectCustomerCAFModal: boolean = false;
  rejectCAF = [];
  reject = false;
  customerData: any;
  reAssignCustomerCAFModal: boolean = false;
  selectStaffReject: any;
  searchStaffDeatil = "";
  newStaffFirst: number = 0;
  approveStaffListdataitemsPerPageForStaff: number = 5;
  searchReassignStaffDeatil = "";
  approvestaffReassignListdatatotalRecords: number = 0;
  remarks: any;
  nearDeviceLocationData: any;
  rejectedReasonList: any = [];
  leadId: number;
  rejectedReasonId: any;
  rejectedSubReasonArr: any;
  rejectedLeadFormSubmitted: boolean = false;
  newFirst = 0;
  isEditEnable: boolean = false;
  staffUserId: any = [];
  showViewAttachDeviceModal = false;
  attachDeviceData = [];
  addNotes: boolean = false;

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
      field: "status",
      header: "Status",
      customExportHeader: "Status"
    },
    {
      field: "remainTime",
      header: "Remaining Time",
      customExportHeader: "Remaining Time"
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
  customerListDataselector: any;
  showItemPerPage = 1;
  assignCustomerCAFForm: FormGroup;
  rejectCustomerCAFForm: FormGroup;
  rejectCustomerCAFsubmitted: boolean = false;
  approveCAFData: any[];
  rejectCafData: any[];
  paymentFormGroup: FormGroup;
  customerIdRecord: number;
  reassigndata = [];
  nearLocationModal: boolean = false;
  customerIdINLocationDevice: string;
  reassignDataRefresh: any;
  rejectLeadFormGroup: FormGroup;
  @Output() closeNearLocationModal = new EventEmitter();
  currentPagenearDeviceLocationList = 1;
  availableOutPorts: any;
  editMacSerialBtn: any = "";
  NetworkDeviceData: any;
  loggedInUser: any;
  staffUser: any;
  userName: "";
  closeCafAccess: boolean = false;
  uploadDocAccess: boolean = false;
  custIdForNotes: any;
  addNotesPopup: boolean = false;
  notesSubmitted: boolean = false;
  addNotesData: CustNotes;
  CustomerStatusValue: any[] = [];
  openRejectLeadPopup: boolean = false;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private liveUserService: LiveUserService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private recordPaymentService: RecordPaymentService,
    private prepaidRejectedReasonService: PrepaidRejectedReasonService,
    private customerInventoryManagementService: CustomerInventoryManagementService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private staffService: StaffService
  ) {
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
    this.custType = this.route.snapshot.paramMap.get("custType")!;
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
    this.addNotes = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.ADD_NOTES_PRE_CUST_CAF
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.closeCafAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.CLOSE_PRE_CUST_CAF_LIST
        : POST_CUST_CONSTANTS.CLOSE_POST_CUST_CAF
    );
    this.uploadDocAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.UPLOAD_DOCS_PRE_CUST
        : POST_CUST_CONSTANTS.UPLOAD_DOCUMENTS_POST_CUST_CAF
    );
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  async ngOnInit() {
    this.demographicLabel = RadiusConstants.DEMOGRAPHICDATA || [];
    // customer get data
    this.commondropdownService.getAllActiveStaff();
    this.commondropdownService.getTeamList();
    this.getCustomerStatus();
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
    this.assignCustomerCAFForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectCustomerCAFForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.paymentFormGroup = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      bank: [""],
      branch: [""],
      chequedate: ["", Validators.required],
      chequeno: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      customerid: ["", Validators.required],
      paymode: ["", Validators.required],
      referenceno: ["", Validators.required],
      remark: ["", Validators.required],
      bankManagement: ["", Validators.required],
      destinationBank: ["", Validators.required],
      reciptNo: [""],
      type: ["Payment"],
      paytype: [""],
      file: [""],
      tdsAmount: [0],
      abbsAmount: [0],
      invoiceId: ["", Validators.required],
      onlinesource: [""]
    });
    this.rejectLeadFormGroup = this.fb.group({
      leadMasterId: [""],
      rejectReasonId: ["", Validators.required],
      rejectSubReasonId: [""],
      remark: ["", Validators.required],
      leadStatus: ["Closed"]
    });
    this.route.queryParams.subscribe(params => {
      let mobileno = params["mobilenumber"];
      if (mobileno) {
        this.searchOption = "mobile";
        this.searchDeatil = mobileno;
      } else {
        this.searchOption = "currentAssigneeName";
      }
      this.searchcustomer();
    });
    if (this.searchOption) {
      this.searchOption = "currentAssigneeName";
      this.searchDeatil = localStorage.getItem("loginUserName");
      this.searchcustomer();
    } else {
      this.getcustomerList("");
    }
  }

  getCustomerStatus() {
    const url = "/commonList/generic/custStatus";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.CustomerStatusValue = response.dataList.filter(
          status =>
            status.value !== "Active" &&
            status.value !== "InActive" &&
            status.value !== "Suspend" &&
            status.value !== "Terminate"
        );
      },
      (error: any) => {}
    );
  }

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
                if (!this.searchkey) {
                  this.getcustomerList("");
                } else {
                  this.searchcustomer();
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

  editcustomer(customerId: any) {
    this.router.navigate(["/home/customer-caf/edit/" + this.custType + customerId]);
  }

  getcustomerList(list) {
    this.searchkey = "";
    this.searchkey2 = "";

    let size;
    this.searchkey = "";
    const page = this.currentPagecustomerListdata;
    if (list) {
      size = list;
      this.customerListdataitemsPerPage = list;
    } else {
      size = this.customerListdataitemsPerPage;
    }
    let mvnoId = Number(localStorage.getItem("mvnoId"));
    const url = `/customers/list/` + this.custType + "?orgcusttype=false&mvnoId=" + mvnoId;

    const custerlist = {
      page,
      pageSize: size,
      status: RadiusConstants.CUSTOMER_STATUS.NEW_ACTIVATION
    };
    this.customerManagementService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerListData = response.customerList;
        this.customerListDataselector = response.customerList;
        this.customerListdatatotalRecords = response.pageDetails.totalRecords;

        if (this.showItemPerPage > this.customerListdataitemsPerPage) {
          this.customerListDatalength = this.customerListData.length % this.showItemPerPage;
        } else {
          this.customerListDatalength =
            this.customerListData.length % this.customerListdataitemsPerPage;
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

  clearSearchcustomer() {
    this.currentPagecustomerListdata = 1;
    this.getcustomerList("");
    this.searchDeatil = "";
    this.searchOption = "";
    this.fromDate = "";
    this.toDate = "";
  }

  selSearchOption() {
    this.searchDeatil = "";
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagecustomerListdata > 1) {
      this.currentPagecustomerListdata = 1;
    }
    if (!this.searchkey) {
      this.getcustomerList(this.showItemPerPage);
    } else {
      this.searchcustomer();
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

  //   stopBilling(id) {
  //     const url = "/invoiceV2/stop/billing/" + id;
  //     let data = {};
  //     this.customerManagementService.postMethodPasssHeader(url, data).subscribe(
  //       (response: any) => {
  //         if (
  //           (this.searchkey && this.searchkey.toString().trim() !== "") ||
  //           (this.searchkey2 && this.searchkey2.toString().trim() !== "")
  //         ) {
  //           this.searchCustomer(true);
  //         } else {
  //           this.getcustomerList("");
  //         }
  //         this.messageService.add({
  //           severity: "success",
  //           summary: "Success",
  //           detail: response.responseMessage,
  //           icon: "far fa-times-circle"
  //         });
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle"
  //         });
  //       }
  //     );
  //   }

  //   playstartBilling(id) {
  //     const url = "/invoiceV2/start/billing/" + id;
  //     let data = {};
  //     this.customerManagementService.postMethodPasssHeader(url, data).subscribe(
  //       (response: any) => {
  //         if (
  //           (this.searchkey && this.searchkey.toString().trim() !== "") ||
  //           (this.searchkey2 && this.searchkey2.toString().trim() !== "")
  //         ) {
  //           this.searchcustomer(true);
  //         } else {
  //           this.getcustomerList("");
  //         }
  //         this.messageService.add({
  //           severity: "success",
  //           summary: "Success",
  //           detail: response.responseMessage,
  //           icon: "far fa-times-circle"
  //         });
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle"
  //         });
  //       }
  //     );
  //   }

  openChangeStatus(id, status) {
    this.selectedCustId = id;
    this.custStatus = status;
    this.showChangeStatusModal = true;
  }

  closeChangeStatusEvent() {
    this.selectedCustId = 0;
    this.custStatus = "";
    this.showChangeStatusModal = false;
    this.getcustomerList("");
  }

  openNearLocationModal(custId) {
    this.selectedCustId = custId;
    this.showNearLocationModal = true;
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

  openPaymentGateways(custId) {
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

  openRenewPaymentGateways(custId) {
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

  searchcustomer() {
    if (this.searchOption !== "cafCreatedDate" && this.searchOption !== "firstactivationdate") {
      if (
        !this.searchkey ||
        this.searchkey !== this.searchDeatil.trim() ||
        !this.searchkey2 ||
        this.searchkey2 !== this.searchOption.trim()
      ) {
        this.currentPagecustomerListdata = 1;
      }
      this.searchkey = this.searchDeatil.trim();
      this.searchkey2 = this.searchOption.trim();

      this.searchData.filters[0].filterValue = this.searchDeatil.trim();
      this.searchData.filters[0].filterColumn = this.searchOption.trim();
    } else {
      if (
        !this.searchkey ||
        this.searchkey !== this.searchDeatil ||
        !this.searchkey2 ||
        this.searchkey2 !== this.searchOption
      ) {
        this.currentPagecustomerListdata = 1;
      }
      let searchDeatil = this.datePipe.transform(this.searchDeatil, "yyyy-MM-dd");
      this.searchkey = searchDeatil;
      this.searchkey2 = this.searchOption;

      this.searchData.filters[0].filterValue = searchDeatil;
      this.searchData.filters[0].filterColumn = this.searchOption;
    }
    this.searchData.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    this.searchData.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    if (this.showItemPerPage !== 1) {
      this.customerListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.page = this.currentPagecustomerListdata;
    this.searchData.pageSize = this.customerListdataitemsPerPage;
    let mvnoId = Number(localStorage.getItem("mvnoId"));
    const url = "/customers/search/" + this.custType + "?mvnoId=" + mvnoId;
    // console.log("this.searchData", this.searchData)
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
          this.customerListData = response?.customerList;
          this.customerListdatatotalRecords = response?.pageDetails?.totalRecords;
        }

        if (this.showItemPerPage > this.customerListdataitemsPerPage) {
          this.customerListDatalength = this.customerListData.length % this.showItemPerPage;
        } else {
          this.customerListDatalength =
            this.customerListData.length % this.customerListdataitemsPerPage;
        }
      },
      (error: any) => {
        this.customerListdatatotalRecords = 0;
        this.customerListData = [];
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  exportCustomerCAF() {
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
      this.saveAsExcelFile(excelBuffer, "Customer_CAF");
    });
  }

  pageChangedcustomerList(pageNumber) {
    this.currentPagecustomerListdata = pageNumber;
    if (this.searchkey) {
      this.searchcustomer();
    } else {
      this.getcustomerList("");
    }
  }

  pickModalOpen(data) {
    let url = "/workflow/pickupworkflow?eventName=CAF&entityId=" + data.id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (this.searchkey) {
          this.searchcustomer();
        } else {
          this.getcustomerList("");
        }

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  isCustDocPending(cafId, nextApproverId) {
    this.approved = false;
    this.selectStaff = null;
    this.assignCustomerCAFModal = true;
    this.assignCustomerCAFId = cafId;
    this.nextApproverId = nextApproverId;
  }

  assignCustomerCAF() {
    this.assignCustomerCAFsubmitted = true;
    if (this.assignCustomerCAFForm.valid) {
      const url = "/approveCaf?mvnoId=" + localStorage.getItem("mvnoId");
      const assignCAFData = {
        custcafId: this.assignCustomerCAFId,
        nextStaffId: null,
        flag: "approved",
        remark: this.assignCustomerCAFForm.controls.remark.value,
        staffId: Number(localStorage.getItem("userId"))
      };
      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.getcustomerList("");
          //   this.getCustomer();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.assignCustomerCAFForm.reset();
          this.assignCustomerCAFsubmitted = false;
          if (response?.result && response?.result?.dataList != null) {
            this.approveCAF = response?.result?.dataList;
            this.approveCAFData = this.approveCAF;
            this.approved = true;
          } else {
            this.assignCustomerCAFModal = false;
          }
        },
        (error: any) => {
          // console.log(error, "error")
          if (error.error.status == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.message,
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
          this.assignCustomerCAFModal = false;
          this.getcustomerList("");
          this.getCustomer();
          this.assignCustomerCAFForm.reset();
          this.assignCustomerCAFsubmitted = false;
        }
      );
    }
  }

  rejectCustomerCAF() {
    this.rejectCustomerCAFsubmitted = true;
    if (this.rejectCustomerCAFForm.valid) {
      const url = "/approveCaf?mvnoId=" + localStorage.getItem("mvnoId");
      const assignCAFData = {
        custcafId: this.assignCustomerCAFId,
        nextStaffId: null,
        flag: "rejected",
        remark: this.rejectCustomerCAFForm.controls.remark.value,
        staffId: Number(localStorage.getItem("userId"))
      };
      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.getcustomerList("");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.rejectCustomerCAFModal = true;
          this.rejectCustomerCAFForm.reset();
          this.rejectCustomerCAFsubmitted = false;
          if (response.result.dataList != null) {
            this.rejectCAF = response.result.dataList;
            this.rejectCafData = this.rejectCAF;
            this.reject = true;
          } else {
            this.rejectCustomerCAFModal = false;
          }
        },
        (error: any) => {
          // console.log(error, "error")
          if (error.error.status == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.message,
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
  }

  getCustomer() {
    // this.displayRecordPaymentDialog = true;
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    const custerlist = {};
    this.recordPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        this.paymentFormGroup.patchValue({
          customerid: this.customerIdRecord
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

  closeApproveCustomer() {
    this.assignCustomerCAFModal = false;
  }

  assignToStaff(flag) {
    let url: any;

    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.assignCustomerCAFId}&eventName=${"CAF"}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.assignCustomerCAFId}&eventName=${"CAF"}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.assignCustomerCAFId}&eventName=${"CAF"}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.assignCustomerCAFId}&eventName=${"CAF"}&isApproveRequest=${flag}`;
      }
    }

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.assignCustomerCAFModal = false;
        this.rejectCustomerCAFModal = false;
        this.reAssignCustomerCAFModal = false;
        this.getcustomerList("");
        this.getCustomer();

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.getCustomer();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigned to the next staff successfully.",
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

  closeRejectCustomer() {
    this.rejectCustomerCAFModal = false;
  }

  closeReassignCustomer() {
    this.reAssignCustomerCAFModal = false;
  }

  searchStaffByName(searchText: string) {
    const trimmedSearchText = searchText.trim().replace(/\s+/g, " ");
    this.searchStaffDeatil = searchText;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;

    const normalizedSearchText = trimmedSearchText.toLowerCase();

    if (normalizedSearchText) {
      this.approveCAFData = this.approveCAF.filter(
        staff =>
          staff.fullName.toLowerCase().includes(normalizedSearchText) ||
          staff.username.toLowerCase().includes(normalizedSearchText)
      );
    } else {
      this.approveCAFData = this.approveCAF;
    }
  }

  clearSearchForm() {
    this.searchStaffDeatil = "";
    this.approveCAFData = this.approveCAF;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;
  }

  paginateStaff(event: any) {
    this.newStaffFirst = event.first;
    this.approveStaffListdataitemsPerPageForStaff = event.rows;
  }

  searchStaffByNameReject(searchText: string) {
    const trimmedSearchText = searchText.trim().replace(/\s+/g, " ");
    this.searchStaffDeatil = searchText;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;
    const normalizedSearchText = trimmedSearchText.toLowerCase();

    if (trimmedSearchText) {
      this.rejectCAF = this.rejectCafData.filter(
        staff =>
          staff.fullName.toLowerCase().includes(normalizedSearchText) ||
          staff.username.toLowerCase().includes(normalizedSearchText)
      );
    } else {
      this.rejectCAF = this.rejectCafData;
    }
  }

  clearSearchFormReject() {
    this.searchStaffDeatil = "";
    this.rejectCAF = this.rejectCafData;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;
  }

  searchReassignStaffByName() {
    if (this.searchReassignStaffDeatil) {
      this.approveCAF = this.reassigndata.filter(
        staff =>
          staff.fullName.toLowerCase().includes(this.searchReassignStaffDeatil.toLowerCase()) ||
          staff.username.toLowerCase().includes(this.searchReassignStaffDeatil.toLowerCase())
      );
    } else {
      this.approveCAF = this.reassigndata;
    }
    this.approvestaffReassignListdatatotalRecords = this.reassigndata?.length;
  }

  paginateReassignStaff(event: any) {
    this.newStaffFirst = event.first;
    this.approveStaffListdataitemsPerPageForStaff = event.rows;
    this.approveCAF = this.reassigndata;
    this.getReassignPaginatedData();
  }

  getReassignPaginatedData() {
    const start = this.newStaffFirst;
    const end = start + this.approveStaffListdataitemsPerPageForStaff;
    if (!this.searchReassignStaffDeatil) {
      this.approveCAF = this.reassigndata.slice(start, end);
    }
  }

  reassignWorkflow() {
    let url: any;
    this.remarks = this.assignCustomerCAFForm.controls.remark;
    if (this.assignCustomerCAFId != null) {
      url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignCustomerCAFId}&eventName=CAF&assignToStaffId=${this.selectStaff}&remark=${this.remarks.value}`;

      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.reAssignCustomerCAFModal = false;
          this.getcustomerList("");
          this.getCustomer();
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getCustomer();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Assigned to the next staff successfully.",
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Aprove Before Reassigne",
        icon: "far fa-times-circle"
      });
    }
  }

  nearMyLocation(custID) {
    this.nearLocationModal = true;
    const url = "/customers/" + custID;

    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.viewcustomerListData = response.customers;
      this.customerIdINLocationDevice = this.viewcustomerListData.id;
      this.nearLocation(this.viewcustomerListData);
    });
  }

  StaffReasignList(data) {
    this.reassignDataRefresh = data;
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=CAF`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
        }
        if (response.dataList != null) {
          this.assignCustomerCAFId = data.id;
          this.approveCAF = response.dataList;
          this.reassigndata = this.approveCAF;
          this.approved = true;
          this.reAssignCustomerCAFModal = true;
        } else {
          this.reAssignCustomerCAFModal = false;
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  nearLocation(data) {
    const deviceData = {
      latitude: data.latitude,
      longitude: data.longitude
    };
    const url = "/NetworkDevice/getNearbyDevices?customerId=" + this.customerIdINLocationDevice;
    this.customerManagementService.postMethodInventory(url, deviceData).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.nearDeviceLocationData = response.locations;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.error,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  rejectCustomerCAFOpen(cafId, nextApproverId) {
    this.reject = false;
    this.rejectCustomerCAFModal = true;
    this.assignCustomerCAFId = cafId;
    this.nextApproverId = nextApproverId;
  }

  rejectLeadPopupOpen(leadId) {
    this.rejectCustomerCAFForm.reset();

    this.rejectedReasonList = [];
    // console.log("Lead Id from rejectLeadPopupOpen function() => ", leadId);
    this.leadId = leadId;
    this.rejectedReasonId = null;
    this.openRejectLeadPopup = true;
    this.prepaidRejectedReasonService.getMethod("/rejectReason/all").subscribe(
      async (response: any) => {
        if (response.rejectReasonList && response.rejectReasonList.content.length > 0) {
          response.rejectReasonList.content.forEach((item: any) =>
            item?.status === "Active" ? this.rejectedReasonList.push(item) : ""
          );
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

  selectRejectedReason(id: any) {
    this.rejectedSubReasonArr = [];
    this.rejectedReasonId = id;
    this.rejectedReasonList?.forEach(source =>
      source.rejectSubReasonDtoList?.forEach(subreason =>
        subreason.rejectReasonId === this.rejectedReasonId
          ? this.rejectedSubReasonArr.push(subreason)
          : ""
      )
    );
  }

  rejectLead(leadId: any) {
    this.rejectedLeadFormSubmitted = true;
    if (this.rejectLeadFormGroup.valid) {
      if (leadId !== "") {
        let rejectDTOObj = {
          cafId: leadId,
          rejectReasonId: this.rejectLeadFormGroup.controls.rejectReasonId.value,
          rejectSubReasonId: this.rejectLeadFormGroup.controls.rejectSubReasonId.value,
          remark: this.rejectLeadFormGroup.controls.remark.value
        };

        const url = "/close";

        this.prepaidRejectedReasonService.postMethod(url, rejectDTOObj).subscribe(
          async (response: any) => {
            this.rejectedLeadFormSubmitted = false;
            this.getcustomerList("");
            if ((await response.status) === 200) {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-times-circle"
              });
              this.openRejectLeadPopup = false;

              this.rejectLeadFormGroup.reset();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.message,
                icon: "far fa-times-circle"
              });
              this.openRejectLeadPopup = false;
              this.rejectLeadFormGroup.reset();
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
            this.openRejectLeadPopup = false;
            this.rejectLeadFormGroup.reset();
          }
        );
      } else {
        this.openRejectLeadPopup = false;
        this.rejectLeadFormGroup.reset();
      }
    } else {
      this.openRejectLeadPopup = true;
    }
  }

  closeRejectLeadPopup() {
    this.openRejectLeadPopup = false;
    this.rejectLeadFormGroup.reset();
  }

  nearsearchClose() {
    this.nearDeviceLocationData = [];
    this.closeNearLocationModal.emit();
    this.newFirst = 0;
    this.nearLocationModal = false;
  }

  pageChangedNearDeviceList(pageNumber) {
    this.currentPagenearDeviceLocationList = pageNumber;
  }

  checkAvailblePort(deviceId) {
    this.isEditEnable = true;
    this.editMacSerialBtn = deviceId;

    // Find the current row object
    const selectedDevice = this.nearDeviceLocationData.find(d => d.networkDeviceId === deviceId);

    if (selectedDevice) {
      this.currentParentPorts(selectedDevice, "OUT");
    }
  }

  currentParentPorts(device: any, type: string) {
    const url = `/NetworkDevice/checkPortAvailability?parentDeviceId=${device.networkDeviceId}&parentPortType=${type}`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.availableOutPorts =
          response.dataList != null
            ? response.dataList
                .filter((item: string) => item.includes("OUT-Port"))
                .map(port => ({ label: port, value: port })) // format for p-dropdown
            : [];

        this.spinner.hide();
      },
      (error: any) => this.spinner.hide()
    );
  }

  confirmAttachDeviceUpdate(networkdeviceID: number, portNumber: number) {
    if (!portNumber) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select an Out Port before adding."
      });
      return;
    }
    if (networkdeviceID && portNumber) {
      this.confirmationService.confirm({
        message: `If the SN Splitter is changed, all associated device mappings—such as downgrade hierarchy bindings between the SN Splitter and Customer Inventory—linked to the previous SN Splitter will be automatically removed.
        <br><br>
        <strong>Confirmation Required:</strong> Are you sure you want to proceed with updating the attached configuration?`,
        acceptLabel: "Yes",
        rejectLabel: "No",
        icon: "pi pi-question-circle",
        accept: () => {
          this.bindNetworkDevice(networkdeviceID, portNumber);
        },
        reject: () => {}
      });
    }
  }

  bindNetworkDevice(networkdeviceID: number, portNumber: number) {
    const deviceData = {};
    const url =
      "/NetworkDevice/bindNetworkDevice?customerId=" +
      this.customerIdINLocationDevice +
      "&networkDeviceId=" +
      networkdeviceID +
      "&portBlockNumber=" +
      portNumber;

    this.customerManagementService.updateInventoryMethod(url, deviceData).subscribe(
      (response: any) => {
        this.NetworkDeviceData = response.locations;
        this.nearsearchClose();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.customer,
          icon: "far fa-check-circle"
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

  getLoggedinUserData() {
    const staffId = localStorage.getItem("userId");
    this.staffUserId = Number(localStorage.getItem("userId"));

    this.loggedInUser = localStorage.getItem("loggedInUser");

    this.staffService.getById(staffId).subscribe(
      (response: any) => {
        this.staffUser = response.Staff;
        this.userName = this.staffUser.username;
        //  this.customerGroupForm.value.username = this.staffUser.username;

        // console.log("username", this.staffUser.username);
        // if (["Admin"].some(role => this.staffUser.roleName.includes(role))) {
        //   this.isAdmin = true;
        // } else {
        //   // this.customerGroupForm.get('serviceAreaId').setValue(response.Staff.servicearea.id);
        //   this.isAdmin = false;
        // }
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

  reActivate(id) {
    const url = `/reactivateService?custId=${id}`;
    let data = {};
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (response.data) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Re-activate Sucessfully",
              icon: "far fa-check-circle"
            });
            this.getcustomerList("");
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong!!!",
              icon: "far fa-times-circle"
            });
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

  closeViewAttachDeviceModal() {
    this.showViewAttachDeviceModal = false;
    this.attachDeviceData = null;
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
}
