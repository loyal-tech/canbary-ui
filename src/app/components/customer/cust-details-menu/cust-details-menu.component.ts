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

@Component({
  selector: "app-cust-details-menu",
  templateUrl: "./cust-details-menu.component.html",
  styleUrls: ["./cust-details-menu.component.css"]
})
export class CustDetailsMenuComponent implements OnInit {
  custType;
  custId;
  childUrlSegment = "";
  custData: any = {};
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
  isShiftLocation = false;
  isChildManagement = false;
  PRE_CUST_CONSTANTS = PRE_CUST_CONSTANTS;
  POST_CUST_CONSTANTS = POST_CUST_CONSTANTS;
  CREDIT_NOTES = CREDIT_NOTES;
  title = CUSTOMER_PREPAID;
  isIpManagement = false;
  isMacManagement = false;
  disabledMenu: boolean = false;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public loginService: LoginService,
    public statusCheckService: StatusCheckService
  ) {}
  ngOnInit() {
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.custType == "Prepaid" ? (this.title = CUSTOMER_PREPAID) : (this.title = CUSTOMER_POSTPAID);

    this.custId = this.route.snapshot.firstChild.paramMap.get("customerId")!;
    this.childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    this.checkOpenMenu(this.childUrlSegment);
    this.getCustomersDetail(this.custId);
    // this.getChildCustomers(this.custId);
  }

  checkOpenMenu(childUrl) {
    switch (childUrl) {
      case "x":
        this.isDetails = true;
        break;
      case "plans":
        this.isPlan = true;
        break;
      case "invoice":
        this.isInvoice = true;
        break;
      case "ledger":
        this.isLedger = true;
        break;
      case "payment":
        this.isPayment = true;
        break;
      case "inventoryManagement":
        this.isInventory = true;
        break;
      case "changePlan":
        this.isChangePlan = true;
        break;
      case "changeDiscount":
        this.isChangeDiscount = true;
        break;
      case "changeStatus":
        this.isChangeStatus = true;
        break;
      case "wallet":
        this.isWallet = true;
        break;
      case "serviceManagement":
        this.isServiceManagement = true;
        break;
      case "sessionHistory":
        this.isSessionHistory = true;
        break;
      case "tickets":
        this.isTicket = true;
        break;
      case "chargeManagement":
        this.isChargeManagement = true;
        break;
      case "creditNote":
        this.isCreditNote = true;
        break;
      case "revenueReport":
        this.isDBRReport = true;
        break;
      case "workflowAudit":
        this.isWorkflowAudit = true;
        break;
      case "auditDetails":
        this.isAuditDetails = true;
        break;
      case "dunningManagement":
        this.isDunningManagement = true;
        break;
      case "notification":
        this.isNotification = true;
        break;
      case "childCustomers":
        this.isChildCustOpen = true;
        break;
      case "shiftLocation":
        this.isShiftLocation = true;
        break;
      case "taskAudit":
        this.isTaskAudit = true;
        break;
      case "customerNotes":
        this.isCustNotes = true;
        break;
      case "callDetails":
        this.isCallDetails = true;
        break;
      case "feedback":
        this.isFeedback = true;
        break;
      case "childmanagement":
        this.isChildManagement = true;
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
}
