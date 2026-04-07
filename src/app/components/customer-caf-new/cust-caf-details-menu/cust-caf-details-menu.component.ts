import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from "@angular/common/http";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { LoginService } from "src/app/service/login.service";
import {
  POST_CUST_CONSTANTS,
  PRE_CUST_CONSTANTS,
  CREDIT_NOTES
} from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { CUSTOMER_POSTPAID, CUSTOMER_PREPAID } from "src/app/RadiusUtils/RadiusConstants";
import { StaffService } from "src/app/service/staff.service";
import { MessageService } from "primeng/api";
import { TicketManagementService } from "src/app/service/ticket-management.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Component({
  selector: "app-cust-caf-details-menu",
  templateUrl: "./cust-caf-details-menu.component.html",
  styleUrls: ["./cust-caf-details-menu.component.css"]
})
export class CustCafDetailsMenuComponent implements OnInit {
  custType;
  custId;
  childUrlSegment = "";
  custData: any;
  childCustomerDataList: any = {};
  isCustomerDetailSubMenu = true;
  showChangePassword = false;
  isDetails = false;
  isPlan = false;
  isInvoice = false;
  isLedger = false;
  isPayment = false;
  isInventory = false;
  isChangePlan = false;
  isChangeDiscount = false;
  isChangeStatus = false;
  isWallet = false;
  isServiceManagement = false;
  isSessionHistory = false;
  isTicket = false;
  isChargeManagement = false;
  isCreditNote = false;
  isDBRReport = false;
  isWorkflowAudit = false;
  isAuditDetails = false;
  isDunningManagement = false;
  isNotification = false;
  isChildCustOpen = false;
  isTaskAudit = false;
  isFeedback = false;
  isCustNotes = false;
  isCallDetails = false;
  ifCafFollowUp = false;
  isShiftLocation = false;
  isChildManagement = false;
  PRE_CUST_CONSTANTS = PRE_CUST_CONSTANTS;
  POST_CUST_CONSTANTS = POST_CUST_CONSTANTS;
  CREDIT_NOTES = CREDIT_NOTES;
  title = CUSTOMER_PREPAID;
  isIpManagement = false;
  isMacManagement = false;
  disabledMenu: boolean = false;
  customerPlanView = false;
  isServiceOpen = false;
  ifMyInvoice = false;
  customerUpdateDiscount = false;
  ifUpdateAddress = false;
  viewCustomerPaymentList = false;
  isCustomerLedgerOpen = false;
  customerChangePlan = false;
  chargeUseCustID: any;
  custPlanMapppingId: any = [""];
  isPlanOnDemand = false;
  customerInventoryList: any;
  staffUserData: any;
  activePlanList: any;
  paymentHistoryList: any;
  openVasDetailsByCust = false;
  vasPlan: any;
  servicePackMsg: any;
  tatDetailsData: any;
  customerNetworkLocationDetailData: any;
  invoiceList: any[];
  masterSelected: boolean;
  invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];
  convertedExchangeRate: number;
  custQuotaList: any;
  newCustomerAddressDataForCustometr: any;
  currentPageAuditSlab1 = 1;
  AudititemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  AuditData1: any;
  AudittotalRecords1: any;
  customerStatusView = false;
  customerrMyInventoryView = false;
  ifChargeGetData = false;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public loginService: LoginService,
    public statusCheckService: StatusCheckService,
    private staffService: StaffService,
    private messageService: MessageService,
    private ticketManagementService: TicketManagementService,
    private revenueManagementService: RevenueManagementService,
    private systemService: SystemconfigService
  ) {}
  ngOnInit() {
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.custType == "Prepaid" ? (this.title = CUSTOMER_PREPAID) : (this.title = CUSTOMER_POSTPAID);
    this.custId = this.route.snapshot.firstChild.paramMap.get("customerId")!;
    this.childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    this.checkOpenMenu(this.childUrlSegment);
    this.getCustomersDetail(this.custId);
    // this.getChildCustomers(this.custId);
    this.planCreationType();
    this.systemService.getConfigurationByName("CONVERTED_EXCHANGE_RATE").subscribe((res: any) => {
      this.convertedExchangeRate = parseFloat(res?.data?.value.replace(/,/g, "")) || 1;
    });
  }

  checkOpenMenu(childUrl) {
    switch (childUrl) {
      case "x":
        this.isDetails = true;
        break;
      case "customerCafStatus":
        this.customerStatusView = true;
        break;
      case "customerPlans":
        this.customerPlanView = true;
        break;
      case "invoice":
        this.ifMyInvoice = true;
        break;
      case "ledger":
        this.isCustomerLedgerOpen = true;
        break;
      case "payment":
        this.viewCustomerPaymentList = true;
        break;
      case "inventoryManagement":
        this.customerrMyInventoryView = true;
        break;
      case "changeDiscount":
        this.customerUpdateDiscount = true;
        break;
      case "wallet":
        this.isWallet = true;
        break;
      case "chargeManagement":
        this.ifChargeGetData = true;
        break;
      case "shiftLocation":
        this.ifUpdateAddress = true;
        break;
      case "followup":
        this.ifCafFollowUp = true;
        break;
      case "serviceManagement":
        this.isServiceOpen = true;
        break;
      case "changeplan":
        this.customerChangePlan = true;
        break;
      case "customerNotes":
        this.isCustNotes = true;
        break;
      case "callDetails":
        this.isCallDetails = true;
        break;
      case "ipManagement":
        this.isIpManagement = true;
        break;
      case "macManagement":
        this.isMacManagement = true;
        break;
    }
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      this.disabledMenu = this.custData.planMappingList.some(
        plan => plan.custPlanStatus === "Disable"
      );
    });
  }

  // This method is used to check that customer has any service/plan with invoice type Independent or not
  // returns 'true' if customer has any service/plan with invoice type Independent otherwise returns 'false'
  hasCustInvoiceTypeIndependent() {
    return (
      this.custData.planMappingList.filter(item => item.invoiceType === "Independent").length > 0
    );
  }

  openSubMenu(url) {
    this.router.navigate([url]);
  }

  getBUFromCurrentStaff() {
    const planBindingType = localStorage.getItem("planBindingType");
    const basePath = `/home/customer/details/${this.custType}/serviceManagement/`;
    if (planBindingType === "On-Demand") {
      this.router.navigate([`${basePath}add-service/${this.custId}`]);
    } else {
      this.router.navigate([`${basePath}${this.custId}`]);
    }
  }

  getChildCustomers(id) {
    const url = `/getAllActualChildCustomer?customerId=${id}`;
    const data = {
      page: 1,
      pageSize: 5
    };
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.childCustomerDataList = response;
      },
      (error: any) => {}
    );
  }
  openPassChange() {
    this.showChangePassword = true;
  }
  closePassChange() {
    this.showChangePassword = false;
  }

  clearcustPlanMappping() {
    this.custPlanMapppingId = null;
  }

  planCreationType() {
    const planBindingType = localStorage.getItem("planBindingType");
    this.isPlanOnDemand = planBindingType === "On-Demand";
  }

  openDetailCust(event) {
    this.customerDetailOpen(event);
  }

  customerDetailOpen(custId) {
    this.getAllCustomerInventoryList(custId);
    this.getActivePlanListDetails(custId);
    this.getPaymentHistory(custId);
    this.getCustomersDetail(custId);
    this.getVasPlanByCustId(false, custId);
    this.getCustomerNetworkLocationDetail(custId);
    this.InvoiceListByCustomer(custId);
    // this.isCustomerDetailSubMenu = true;
    this.getCustQuotaList(custId);
    this.getNewCustomerAddressForCustomer(custId);
    this.GetAuditData(custId, "");
  }
  getAllCustomerInventoryList(custId) {
    const url = `/inwards/getAllCustomerInventoryList?custId=${custId}`;
    this.customerManagementService.getCustNetworkLocDetail(url).subscribe(
      (response: any) => {
        this.customerInventoryList = response.dataList;
        const staffId = this.customerInventoryList[0]?.staffId;
        if (staffId) {
          this.staffService.getStaffUserData(staffId).subscribe((response: any) => {
            this.staffUserData = response.Staff;
          });
        }
      },
      (error: any) => {}
    );
  }

  getActivePlanListDetails(custId) {
    const url = `/subscriber/getActivePlanList/${custId}?isNotChangePlan=true`;
    this.customerManagementService.getActivePlanList(url).subscribe(
      (response: any) => {
        this.activePlanList = response.dataList;
      },
      (error: any) => {}
    );
  }

  getPaymentHistory(custId) {
    const url = `/paymentHistory/${custId}`;
    this.customerManagementService.getPaymentHistory(url).subscribe(
      (response: any) => {
        this.paymentHistoryList = response.dataList;
      },
      (error: any) => {}
    );
  }

  getVasPlanByCustId(isOpenFromHtml, custId?) {
    isOpenFromHtml ? (this.openVasDetailsByCust = true) : "";
    let customerId = custId ? custId : this.custId;
    const url = "/vasplan/getVasPlanByCustId?custId=" + customerId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        let vasPlanList = response.vasPlanList;
        if (vasPlanList?.length > 0) {
          for (let item of vasPlanList) {
            if (item.isActive) {
              this.vasPlan = item;
            }
          }
          this.getTatDetails(vasPlanList[0]?.tatId);
        }
        this.servicePackMsg = this.vasPlan
          ? response.msg
          : "There is no active value added services are available for this customer.";
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
  getTatDetails(tatId) {
    let mvnoId = localStorage.getItem("mvnoId");
    const url = `/tickettatmatrix/` + tatId + `?mvnoId=` + mvnoId;
    this.ticketManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.tatDetailsData = response.data;
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
  getCustomerNetworkLocationDetail(custId) {
    if (this.statusCheckService.isActiveInventoryService) {
      const url = `/customer/getCustNetworkDetail?customerId=${custId}`;
      this.customerManagementService.getCustNetworkLocDetail(url).subscribe(
        (response: any) => {
          this.customerNetworkLocationDetailData = response.data;
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

  InvoiceListByCustomer(id) {
    const url = "/invoiceList/byCustomer/" + id;
    this.invoiceList = [];
    const Data = [];
    this.masterSelected = false;

    this.revenueManagementService.getAllInvoiceByCustomer(url).subscribe(
      (response: any) => {
        const invoicedata = [];
        if (response.invoiceList != null && response.invoiceList.length != 0) {
          this.invoiceList.push(...response.invoiceList);
        } else {
          this.invoiceList.push(...this.invoicedropdownValue);
        }
        // this.invoiceList = Data;
        this.invoiceList.forEach(item => {
          item.tdsCheck = 0;
          item.abbsCheck = 0;
          item.tds = 0;
          item.abbs = 0;
          item.includeTds = false;
          item.includeAbbs = false;
          item.testamount = this.getPendingAmount(item);
          item.convertedAmount = item.testamount * this.convertedExchangeRate;
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
  getPendingAmount(item) {
    var amount = 0;
    if (item.adjustedAmount) {
      amount = item.totalamount - item.adjustedAmount;
    } else if (item.pendingAmt) {
      amount = item.totalamount - item.pendingAmt;
    } else if (item.adjustedAmount) {
      amount = item.totalamount - item.adjustedAmount;
    } else {
      amount = item.totalamount;
    }
    if (amount) return amount.toFixed(2);
    else return 0;
  }

  getCustQuotaList(custId) {
    this.customerManagementService.getCustQuotaList(custId).subscribe(
      (response: any) => {
        this.custQuotaList = response.custQuotaList;
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

  getNewCustomerAddressForCustomer(id): void {
    const url = "/newcustomeraddress/" + id;

    this.customerManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.newCustomerAddressDataForCustometr = res.newcustomerAddress;
      },
      (error: any) => {}
    );
  }
  GetAuditData(custId, size) {
    let page = this.currentPageAuditSlab1;
    let page_list;
    if (size) {
      page_list = size;
      this.AudititemsPerPage1 = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.AudititemsPerPage1 = 5;
      } else {
        this.AudititemsPerPage1 = 5;
      }
    }
    this.AuditData1 = [];

    let data = {
      page: page,
      pageSize: this.AudititemsPerPage1,
      sortBy: "id",
      sortOrder: 0
    };
    const url = "/auditLog/getAuditList/" + custId;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.AuditData1 = response.dataList;
        this.AudittotalRecords1 = response.totalRecords;
        //this.auditList = response.dataList;
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
  openServiceDetails(custId) {
    this.isServiceOpen = true;
  }
}
