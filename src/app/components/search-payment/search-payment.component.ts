import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { SearchPaymentService } from "src/app/service/search-payment.service";
import { CustomerDetailsService } from "src/app/service/customer-details.service";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomerDetailsComponent } from "../common/customer-details/customer-details.component";
import { BehaviorSubject } from "rxjs";
import * as FileSaver from "file-saver";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { StaffService } from "src/app/service/staff.service";
import { PaymentAmountModelComponent } from "src/app/components/payment-amount-model/payment-amount-model.component";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
declare var $: any;

import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { CountryManagementService } from "src/app/service/country-management.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { PAYMENT_SYSTEMS } from "src/app/constants/aclConstants";
import { CustomerService } from "src/app/service/customer.service";
import { DatePipe } from "@angular/common";
import * as XLSX from "xlsx";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
@Component({
  selector: "app-search-payment",
  templateUrl: "./search-payment.component.html",
  styleUrls: ["./search-payment.component.css"]
})
export class SearchPaymentComponent implements OnInit {
  @ViewChild(CustomerDetailsComponent)
  customerDetailModal: CustomerDetailsComponent;

  @ViewChild(PaymentAmountModelComponent)
  PaymentDetailModal: PaymentAmountModelComponent;

  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;

  assignPaymentStaffForm: FormGroup;
  searchPaymentFormGroup: FormGroup;
  submitted: boolean = false;
  ifModelIsShow: boolean = false;
  customerData: any;
  searchPaymentData: any;
  currentPagePaymentSlab = 1;
  paymentitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  paymenttotalRecords = 0;
  isPaymentSearch: boolean = false;
  staffsubmmitted: boolean = false;
  displayInvoiceDetails: boolean = false;
  customerid: any = "";
  staffid: any = "";
  batchStaffid: any = "";
  loginStaffid: any = "";
  approveId: any = "";
  payfromdate = "";
  paytodate = "";
  batchPayfromdate = "";
  batchPaytodate = "";
  paystatus = "";
  recepit: any;
  searchData: any;
  bankDataList: any;
  bankDestination: any;
  masterSelected: any;
  checkedList: any = [];
  selectedInvoiceIdList: any = [];
  custId = new BehaviorSubject({
    custId: ""
  });
  paymentId = new BehaviorSubject({
    paymentId: ""
  });
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalAreaListLength = 0;
  payStatus = [
    { label: "Pending (Collected/Submitted)", value: "Pending" },
    { label: "Verified", value: "Approved" },
    { label: "Rejected", value: "Rejected" }
  ];

  invoiceStatusList = [
    { label: "Unpaid", value: "Unpaid" },
    { label: "Clear", value: "Clear" },
    { label: "Cancelled", value: "Cancelled" },
    { label: "Partial Pending", value: "Partial Pending" },
    { label: "Pending", value: "Pending" }
  ];

  batchStatus = [
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" }
  ];

  auditSearchOption = [
    { label: "Customer Name", value: "customerUsername" },
    { label: "Reference", value: "orderid" },
    { label: "Status", value: "status" },
    { label: "Merchant Name", value: "merchantName" },
    { label: "Transaction No", value: "pgTransactionId" },
    { label: "Account No", value: "accountNumber" },
    { label: "Transaction Date", value: "transactionDate" }
  ];
  merchantList = [
    { label: "9MOBILE", value: "9mobile" },
    { label: "BUDPAY", value: "budpay" }
  ];

  selectedAuditSearchOption: any = "";
  selectedAuditSearchValue: any = "";

  searchStaffOptionSelect = [{ label: "Global Search Filter", value: "globalsearch" }];
  searchOption: any = "";
  searchDeatil: any = "";

  ifPaymentList = true;
  ifOnlinePaymentAuditList = false;
  ifBatchList = false;
  chakedPaymentData = [];
  ispaymentChecked: boolean = false;
  allIsChecked: boolean = false;
  isSinglepaymentChecked = false;

  batchitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPagebatch = 1;
  batchtotalRecords: number;
  showItemPerPageBatch = 0;

  batchMappingitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPagebatchMapping = 0;
  batchMappingtotalRecords: number;
  batchMappingData: any = [];

  showItemPerPageBatchAudit = 0;
  batchAudititemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPagebatchAudit = 1;
  batchAudittotalRecords: number;

  onlinePayAudititemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageOnlinePayAudit = 1;
  onlinePayAuditotalRecords: number;
  showItemPerPageOnlinePayAudit = 0;

  onlinePaymentAudititemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  currentPageOnlinePaymentAudit = 1;
  onlinePaymentAuditotalRecords: number;
  showItemPerPageOnlinePaymentAudit = 0;

  newBatchName = "";
  batchPaymentList = [];
  batchPaymentAuditList = [];
  staffList = [];
  chequeDetail = [];
  staffID = 0;
  approveID = 0;
  AssignbatchId = "";
  batchApporve = false;
  batchReject = false;
  batchAssignStaff = false;
  ifAddbatchData = false;
  batchId = "";

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  BatchName: any = "";
  batchSingleData: any = [];
  paymentMode: any = [];
  reject = false;
  rejectCAF = [];
  selectStaffReject: any;
  approved = false;
  approveCAF = [];
  selectStaff: any;
  workflowApproveId: any;
  chequeNumber = "";
  invoiceNumber = "";
  staff = "";
  paymode = "";
  branchname = "";
  buid = "";
  referenceno = "";
  branchName = "";
  remark: any;
  selectApprove: any;
  receiptNo = "";
  chequedate = "";
  paydetails1 = "";
  destinationBank = "";
  batchDestinationBank = "";

  partnerName = "";
  serviceAreaId = "";

  onlinePaymentAuditList: any;

  loggedInUserObj;
  partnerId = 1;
  status: any = [];
  staffId: number;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  assignAccess: boolean = false;
  batchAuditDetailsAccess: boolean = false;
  createBatchAccess: boolean = false;
  batchPaymentAccess: boolean = false;
  downloadAccess: boolean = false;
  reassignAccess: boolean = false;
  currency: string;
  dialogId: boolean = false;
  isBatchNameModelVisible: boolean = false;
  isSelectTeamModelVisible: boolean = false;
  isAssignbatchModelVisible: boolean = false;
  paymentData: any[];
  failureReasonDialog: boolean = false;
  selectedFailureDescription: string;
  transModal: boolean = false;
  transactionNo: any;
  addToWalletOrderId: any;
  searchFromDate: any;
  searchTodate: any;
  cols = [
    {
      field: "orderId",
      header: "Reference No",
      customExportHeader: "Reference No"
    },
    {
      field: "pgTransactionId",
      header: "Transaction No",
      customExportHeader: "Transaction No"
    },
    {
      field: "accountNumber",
      header: "Account Number",
      customExportHeader: "Account Number"
    },
    {
      field: "customerUsername",
      header: "Customer Username",
      customExportHeader: "Customer Username"
    },
    {
      field: "payment",
      header: "Payment Amount",
      customExportHeader: "Payment Amount"
    },
    {
      field: "status",
      header: "Status",
      customExportHeader: "Status"
    },
    {
      field: "gatewayStatus",
      header: "Gateway Status",
      customExportHeader: "Gateway Status"
    },
    {
      field: "failureDescription",
      header: "Failure reason",
      customExportHeader: "Failure reason"
    },
    {
      field: "paymentDate",
      header: "Payment Date",
      customExportHeader: "Payment Date"
    },
    {
      field: "merchantName",
      header: "Merchant Name",
      customExportHeader: "Merchant Name"
    },
    {
      field: "transactionDate",
      header: "Transaction Date",
      customExportHeader: "Transaction Date"
    },
    {
      field: "payerMobileNumber",
      header: "Payer Mobile Number",
      customExportHeader: "Payer Mobile Number"
    },
    {
      field: "autoPaymentInitiator",
      header: "Auto Payment Initiator",
      customExportHeader: "Auto Payment Initiator"
    }
  ];
  approveCAFData: any[];
  searchStaffDeatil: any;
    customerLedgerDetailData: any;
    presentFullAddress: any;
    presentAdressDATA: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private searchPaymentService: SearchPaymentService,
    private customerService: CustomerService,
    private revenueManagementService: RevenueManagementService,
    private customerDetailsService: CustomerDetailsService,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    private recordPaymentService: RecordPaymentService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private staffService: StaffService,
    loginService: LoginService,
    private customerManagementService: CustomermanagementService,
    private systemService: SystemconfigService,
    private countryManagementService: CountryManagementService,
    public datePipe: DatePipe,
    public customerdetailsilsService: CustomerdetailsilsService,
    
  ) {
    this.batchStaffid = Number(localStorage.getItem("userId"));
    this.loginStaffid = this.batchStaffid;
    this.partnerId = Number(localStorage.getItem("partnerId"));
    this.createAccess = loginService.hasPermission(PAYMENT_SYSTEMS.PAY_BATCH_PAY_CREATE);
    this.deleteAccess = loginService.hasPermission(PAYMENT_SYSTEMS.PAY_BATCH_PAY_DELETE);
    this.assignAccess = loginService.hasPermission(PAYMENT_SYSTEMS.PAY_BATCH_PAY_ASSIGN);
    this.batchAuditDetailsAccess = loginService.hasPermission(PAYMENT_SYSTEMS.PAYMENT_BATCH_AUDIT);
    this.createBatchAccess = loginService.hasPermission(PAYMENT_SYSTEMS.PAYMENT_CREATE_BATCH);
    this.batchPaymentAccess = loginService.hasPermission(PAYMENT_SYSTEMS.PAY_BATCH_PAYMENT);
    this.downloadAccess = loginService.hasPermission(PAYMENT_SYSTEMS.PAYMENT_DOWNLOAD);
    this.reassignAccess = loginService.hasPermission(PAYMENT_SYSTEMS.PAYMENT_REASSIGN);
    this.loginService = loginService;
  }
  assignPaymentForm: FormGroup;
  ngOnInit(): void {
    let staffID = localStorage.getItem("userId");
    let loggedInUser = localStorage.getItem("loggedInUser");
    this.staffCustList = [
      {
        id: Number(staffID),
        name: loggedInUser
      }
    ];
    this.selectApproveList = [
      {
        id: Number(staffID),
        name: loggedInUser
      }
    ];
    this.approveId = Number(staffID);
    this.staffid = Number(staffID);
    this.staffID = Number(staffID);
    this.getPaymentMode();
    this.getBusinessUnit();
    this.getBankDetail();
    this.getBankDestinationDetail();
    this.commondropdownService.filterserviceAreaList();
    this.commondropdownService.getpartnerAll();
    // this.commondropdownService.branchByServiceAreaID();
    // this.searchPaymentFormGroup = this.fb.group({
    //   customerid: [""],
    //   payfromdate: [""],
    //   paytodate: [""],
    //   paystatus: [""],
    // });
    this.assignPaymentStaffForm = this.fb.group({
      batchId: [""],
      nextStaffId: [""],
      remark: [""],
      staffId: [""],
      approveId: [""]
    });

    this.searchData = {
      filters: [
        {
          filterDataType: "string",
          filterValue: "string",
          filterColumn: "any",
          filterOperator: "string",
          filterCondition: "string"
        }
      ],
      page: "",
      pageSize: ""
    };
    this.commondropdownService.getAllActiveBranch();
    //this. getStaff()
    // this.getCustomer();
    this.ifPaymentList = true;
    this.ifBatchList = false;
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getPostpaidplanData();
    this.commondropdownService.getAllActiveStaff();
    const serviceArea = localStorage.getItem("serviceArea");

    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
    this.assignPaymentForm = this.fb.group({
      remark: [""]
    });

    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
    this.SearchPayment();
  }

  selSearchOption() {
    this.selectedAuditSearchValue = "";
  }

  openPaymentInvoiceModal(id, paymentId) {
    this.displayInvoiceDetails = true;
    this.PaymentamountService.show(id);
    this.paymentId.next({
      paymentId: paymentId
    });
  }

  getCustomer() {
    let customerListData = [];
    // let customerRespone=[]
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    let custerlist = {};
    this.searchPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        const serviceArea = localStorage.getItem("serviceArea");
        if (serviceArea != "null") {
          let customerListData = response.customerList.filter(
            cust => cust.networkDetails.serviceareaid == localStorage.getItem("serviceArea")
          );
          this.customerData = customerListData;
        } else {
          this.customerData = response.customerList;
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

  openModal(id, custId) {
    this.dialogId = true;
    this.custId.next({
      custId: custId
    });
  }

  closeSelectStaff() {
    this.dialogId = false;
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  closeParentCust() {
    this.displayInvoiceDetails = false;
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagePaymentSlab > 1) {
      this.currentPagePaymentSlab = 1;
    }
    if (!this.searchkey) {
      this.searchPayment(this.showItemPerPage);
    }
  }

  searchPayment(size) {
    // this.searchPaymentData = [];
    this.totalCheckedPayments = {
      totalSelPayments: 0,
      totalAmount: 0
    };
    let page_list;
    if (size) {
      page_list = size;
      this.paymentitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.paymentitemsPerPage = this.pageITEM;
      } else {
        this.paymentitemsPerPage = this.showItemPerPage;
      }
    }

    let url;
    if (this.batchSingleData.length !== 0) {
      this.paystatus = "Pending";
      url =
        "/paymentGateway/payment/search?customerid=" +
        this.customerid +
        "&paystatus=" +
        this.paystatus +
        "&paytodate=" +
        this.paytodate +
        "&payfromdate=" +
        this.payfromdate +
        "&type=Payment" +
        "&invoiceNumber=" +
        this.invoiceNumber +
        "&chequeNo=" +
        this.chequeNumber +
        "&staff=" +
        this.staffid +
        "&paymode=" +
        this.paymode +
        "&branchname=" +
        this.branchname +
        "&buID=" +
        this.buid +
        "&referenceno=" +
        this.referenceno +
        "&approveId =" +
        this.approveId +
        "&receiptNo=" +
        this.receiptNo +
        "&chequedate=" +
        this.chequedate +
        "& paydetails1=" +
        this.paydetails1 +
        "&destinationBank=" +
        this.destinationBank +
        "&partnerName=" +
        this.partnerName +
        "&serviceAreaId=" +
        this.serviceAreaId +
        "&page=" +
        this.currentPagePaymentSlab +
        "&pageSize=" +
        this.paymentitemsPerPage +
        "&mvnoId=" +
        localStorage.getItem("mvnoId");
    } else {
      url =
        "/paymentGateway/payment/search?customerid=" +
        this.customerid +
        "&paystatus=" +
        this.paystatus +
        "&paytodate=" +
        this.paytodate +
        "&payfromdate=" +
        this.payfromdate +
        "&type=Payment" +
        "&invoiceNumber=" +
        this.invoiceNumber +
        "&chequeNo=" +
        this.chequeNumber +
        "&staff=" +
        this.staffid +
        "&paymode=" +
        this.paymode +
        "&branchname=" +
        this.branchName +
        "&buID=" +
        this.buid +
        "&referenceno=" +
        this.referenceno +
        "&approveId=" +
        this.approveId +
        "&receiptNo=" +
        this.receiptNo +
        "&chequedate=" +
        this.chequedate +
        "&paydetails1=" +
        this.paydetails1 +
        "&destinationBank=" +
        this.destinationBank +
        "&partnerName=" +
        this.partnerName +
        "&serviceAreaId=" +
        this.serviceAreaId +
        "&page=" +
        this.currentPagePaymentSlab +
        "&pageSize=" +
        this.paymentitemsPerPage +
        "&mvnoId=" +
        localStorage.getItem("mvnoId");
    }
    this.payfromdate;
    this.searchPaymentData = [];
    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        if (response.creditDocumentPojoList.length > 0) {
          let serviceArea: any = [];
          let searchPaymentData: any;
          serviceArea = JSON.parse(localStorage.getItem("serviceArea"));
          this.searchPaymentData = response.creditDocumentPojoList;
          if (response.pageDetails) {
            this.paymenttotalRecords = response.pageDetails.totalRecords;
            if (this.showItemPerPage > this.paymentitemsPerPage) {
              this.totalAreaListLength = this.searchPaymentData.length % this.showItemPerPage;
            } else {
              this.totalAreaListLength = this.searchPaymentData.length % this.paymentitemsPerPage;
            }
          }
          this.isPaymentSearch = true;
          this.ispaymentChecked = false;
          this.allIsChecked = false;
          this.isSinglepaymentChecked = false;
          this.chakedPaymentData = [];
          if (this.batchSingleData.length !== 0) {
            this.searchPaymentData.forEach((element, index) => {
              this.batchSingleData.forEach(data => {
                if (element.id == data.creditDocumentId || element.batchAssigned == true) {
                  this.searchPaymentData.splice(index, 1);
                }
              });
            });
          }

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Records fetched successfully.",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No records found",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });

          // this.taxListData.taxlist = [];
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
  getPaymentMode() {
    const url = "/commonList/paymentMode";
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.paymentMode = response.dataList;
      // console.log("paymentMode", this.paymentMode);
    });
  }
  businessUnit: any = [];
  businessUnitList: any = [];
  getBusinessUnit() {
    const url = "/businessUnit/all";
    this.countryManagementService.getMethodWithCache(url).subscribe((response: any) => {
      this.businessUnit = response.dataList;
    });
  }
  clearPayment() {
    this.isPaymentSearch = false;
    this.customerid = "";
    this.payfromdate = "";
    this.paytodate = "";
    this.paystatus = "";
    this.chequeNumber = "";
    this.invoiceNumber = "";
    this.paymode = "";
    this.branchName = "";
    this.referenceno = "";
    this.buid = "";
    this.staffid = "";
    this.approveId = "";
    this.searchPaymentData = [];
    this.batchSingleData = [];
    this.ifAddbatchData = false;
    this.receiptNo = "";
    this.chequedate = "";
    this.paydetails1 = "";
    this.destinationBank = "";
    this.serviceAreaId = "";
    this.partnerName = "";
    this.totalCheckedPayments = {
      totalSelPayments: 0,
      totalAmount: 0
    };
  }

  clearAuditSearch() {
    this.selectedAuditSearchOption = "";
    this.selectedAuditSearchValue = "";
    // this.onlinePayAudititemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    // this.currentPageOnlinePaymentAudit = 1;
    this.searchFromDate = "";
    this.searchTodate = "";
    this.searchOnlineAuditPayment(false);
  }

  clearBatch() {
    // this.isPaymentSearch = false;
    this.status = "";
    this.branchName = "";
    this.batchStaffid = "";
    this.batchDestinationBank = "";
    this.serviceAreaId = "";
    this.partnerName = "";
    this.batchPayfromdate = "";
    this.batchPaytodate = "";
  }

  pageChangedPaymentList(pageNumber) {
    this.currentPagePaymentSlab = pageNumber;
    this.searchPayment("");
  }

  downloadreceipt(id: any) {
    const url = "/payment/generatereceipt/" + id;
    this.searchPaymentService.downloadPDF(url).subscribe(
      (response: any) => {
        // this.recepit = response;
        // console.log("this.recepit", this.recepit);
        // if (this.recepit.responseCode == 200) {
        //   const downloadUrl = "/payment/download/" + id;
        //   this.searchPaymentService.downloadPDF(downloadUrl).subscribe(
        //     (response: any) => {
        var file = new Blob([response], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);

        // if you want to open PDF in new tab
        //window.open(fileURL);
        FileSaver.saveAs(file, "bill.pdf");
        // var a = document.createElement('a');
        // a.href = fileURL;
        // a.target = '_blank';
        // a.download = 'bill.pdf';
        // document.body.appendChild(a);
        // a.setAttribute("download", 'bill');
        // a.click();
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Successfully',
        //   detail: response.message,
        //   icon: 'far fa-check-circle',
        // });

        //     },
        //     (error: any) => {
        //
        //       console.log(error, "error");
        //       this.messageService.add({
        //         severity: "error",
        //         summary: "Error",
        //         detail: error.error.ERROR,
        //         icon: "far fa-times-circle",
        //       });
        //     }
        //   );
        // } else {
        //
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "Error",
        //     detail: "Payemnt receipt not generate successfully.",
        //     icon: "far fa-times-circle",
        //   });
        // }
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

  ifApproveStatus = false;
  approveHeader: any;
  approveRejectRemark = "";
  ticketApprRejectData: any = [];
  ApproveRejectModal: boolean = false;
  approveModalOpen(data) {
    this.approveRejectRemark = "";
    this.ifApproveStatus = true;
    this.approveHeader = "Approve Payment";
    this.ticketApprRejectData = data;
    this.ApproveRejectModal = true;
  }

  rejectModalOpen(data) {
    this.approveRejectRemark = "";
    this.ifApproveStatus = false;
    this.approveHeader = "Reject Payment";
    this.ticketApprRejectData = data;
    this.ApproveRejectModal = true;
  }
  rejectCustomerCAFModal: boolean = false;
  statusRejected() {
    this.workflowApproveId = this.ticketApprRejectData.id;
    this.reject = false;
    this.selectStaffReject = null;
    this.rejectCAF = [];
    let rejectdata = {
      customerid: this.ticketApprRejectData.custId,
      // emailreceipt: this.ticketApprRejectData.,
      idlist: Number(this.ticketApprRejectData.id),
      // partnerid: this.ticketApprRejectData,
      // payfromdate: this.ticketApprRejectData.,
      paymode: this.ticketApprRejectData.paymode,
      paystatus: this.ticketApprRejectData.status,
      paytodate: this.ticketApprRejectData.paymentdate,
      // recordfromdate: this.ticketApprRejectData.,
      // recordtodate: this.ticketApprRejectData.,
      referenceno: this.ticketApprRejectData.referenceno,
      remarks: this.approveRejectRemark
    };
    const url = "/payment/reject?mvnoId=" + localStorage.getItem("mvnoId");
    this.searchPaymentService.postMethod(url, rejectdata).subscribe(
      (response: any) => {
        this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Payment Rejected Successfully",
        icon: "far fa-check-circle"
      });
        // this.recepit = response.data;
        this.ApproveRejectModal = false;
        if (response.payment.dataList) {
          this.reject = true;
          this.rejectCAF = response.payment.dataList;
          this.rejectCustomerCAFModal = true;
        } else {
          this.searchPayment("");
        }
        this.ifApproveStatus = false;
        this.ticketApprRejectData = [];
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
  assignCustomerCAFModal: boolean = false;
  statusApporeved() {
    this.workflowApproveId = this.ticketApprRejectData.id;
    this.approved = false;
    this.approveCAF = [];
    this.selectStaff = null;
    let approvedData = {
      customerid: this.ticketApprRejectData.custId,
      // emailreceipt: this.ticketApprRejectData.,
      idlist: Number(this.ticketApprRejectData.id),
      invoiceNumber: this.ticketApprRejectData.invoiceNumber,
      // partnerid: this.ticketApprRejectData,
      // payfromdate: this.ticketApprRejectData.,
      paymode: this.ticketApprRejectData.paymode,
      paystatus: this.ticketApprRejectData.status,
      paytodate: this.ticketApprRejectData.paymentdate,
      // recordfromdate: this.ticketApprRejectData.,
      // recordtodate: this.ticketApprRejectData.,
      referenceno: this.ticketApprRejectData.referenceno,
      remarks: this.approveRejectRemark
    };
    const url = "/payment/approve?mvnoId=" + localStorage.getItem("mvnoId");
    this.searchPaymentService.postMethod(url, approvedData).subscribe(
      (response: any) => {
        // this.recepit = response.data;
        this.ApproveRejectModal = false;
        if (response.payment.dataList) {
          this.approved = true;
          this.approveCAF = response.payment.dataList;
          this.approveCAFData = this.approveCAF;
          this.assignCustomerCAFModal = true;
        } else {
          this.searchPayment("");
        }
        this.ifApproveStatus = false;
        this.ticketApprRejectData = [];
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
  assignToStaff(flag) {
    let url: any;
    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${
          this.workflowApproveId
        }&eventName=${"PAYMENT"}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.workflowApproveId
        }&eventName=${"PAYMENT"}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${
          this.workflowApproveId
        }&eventName=${"PAYMENT"}&nextAssignStaff=${
          this.selectStaffReject
        }&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.workflowApproveId
        }&eventName=${"PAYMENT"}&isApproveRequest=${flag}`;
      }
    }

    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        this.assignCustomerCAFModal = false;
        this.rejectCustomerCAFModal = false;
        this.searchPayment("");

        if (response.status == 200) {
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

  batchList() {
    this.ifOnlinePaymentAuditList = false;
    this.ifPaymentList = false;
    this.ifBatchList = true;
    this.ifAddbatchData = false;
    this.ispaymentChecked = false;
    this.allIsChecked = false;
    this.isSinglepaymentChecked = false;
    this.chakedPaymentData = [];
    // this.batchPaymentDetailsList("");
    this.searchBatch("");
    this.batchId = "";
    this.BatchName = "";
    this.newBatchName = "";
    this.batchSingleData = [];
    this.isPaymentSearch = false;
  }

  SearchPayment() {
    this.ifOnlinePaymentAuditList = false;
    this.ifPaymentList = true;
    this.ifBatchList = false;
    this.ifAddbatchData = false;
    this.ispaymentChecked = false;
    this.allIsChecked = false;
    this.isSinglepaymentChecked = false;
    this.chakedPaymentData = [];
    this.batchId = "";
    this.BatchName = "";
    this.newBatchName = "";
    this.batchSingleData = [];
    this.searchPayment("");
  }

  batchSaveOnly() {
    let data = {
      assignedStatus: "Assigned",
      batchPaymentMappingList: this.chakedPaymentData,
      batchName: this.newBatchName,
      id: ""
    };

    const url = "/createBatchPayment";
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.newBatchName = "";
        let checkedData = this.searchPaymentData;
        this.chakedPaymentData.forEach((value, index) => {
          checkedData.forEach(element => {
            if (element.id == value.credit_doc_id) {
              element.isSinglepaymentChecked = false;
            }
          });
        });
        this.chakedPaymentData = [];

        // console.log(this.chakedPaymentData);
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.newBatchName = "";
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-check-circle"
        });
        this.isBatchNameModelVisible = false;
        setTimeout(() => {
          this.searchPayment("");
        }, 100);
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

  clearBatchName() {
    this.newBatchName = "";
    this.isBatchNameModelVisible = true;
  }

  closeBatchName() {
    this.newBatchName = "";
    this.isBatchNameModelVisible = false;
  }

  TotalItemPerPageBatchList(event) {
    this.showItemPerPageBatch = Number(event.value);
    if (this.currentPagebatch > 1) {
      this.currentPagebatch = 1;
    }
    this.searchBatch(this.showItemPerPageBatch);
  }

  TotalItemPerPageAuditList(event) {
    this.onlinePaymentAudititemsPerPage = Number(event.value);
    if (this.currentPageOnlinePaymentAudit > 1) {
      this.currentPageOnlinePaymentAudit = 1;
    }
    this.searchOnlineAuditPayment(false);
  }

  batchPaymentDetailsList(size) {
    let staffId = this.staffID;

    let page_list;

    if (size) {
      page_list = size;
      this.batchitemsPerPage = size;
    } else {
      if (this.showItemPerPageBatch == 0) {
        this.batchitemsPerPage = this.pageITEM;
      } else {
        this.batchitemsPerPage = this.showItemPerPageBatch;
      }
    }

    this.batchPaymentList = [];
    const url = "/batchPaymentDetailList?staffId=" + staffId;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.batchPaymentList = response.batchPaymentDetailList;
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

  searchBatch(size) {
    let staffId = this.staffID;

    let page_list;

    if (size) {
      page_list = size;
      this.batchitemsPerPage = size;
    } else {
      if (this.showItemPerPageBatch == 0) {
        this.batchitemsPerPage = this.pageITEM;
      } else {
        this.batchitemsPerPage = this.showItemPerPageBatch;
      }
    }

    const pagedata = {
      page: this.currentPagebatch,
      pageSize: this.batchitemsPerPage
    };

    //
    const url =
      "/batchPayment/search?" +
      "status=" +
      this.status +
      "&staff=" +
      this.batchStaffid +
      "&serviceArea=" +
      this.serviceAreaId +
      "&branch=" +
      this.branchName +
      "&partner=" +
      this.partnerName +
      "&destinationBank=" +
      this.batchDestinationBank +
      "&fromDate=" +
      this.batchPayfromdate +
      "&toDate=" +
      this.batchPaytodate +
      "&type=Prepaid" +
      "&isInvoiceVoid=false";
    this.batchPaymentList = [];
    this.revenueManagementService.postMethod(url, pagedata).subscribe(
      (response: any) => {
        this.batchPaymentList = response.batchPaymentList.content;
        this.batchtotalRecords = response.batchPaymentList.totalElements;
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

  searchOnlinePayAudit(size) {
    let page_list;

    if (size) {
      page_list = size;
      this.onlinePayAudititemsPerPage = size;
    } else {
      if (this.showItemPerPageOnlinePayAudit == 0) {
        this.onlinePayAudititemsPerPage = this.pageITEM;
      } else {
        this.onlinePayAudititemsPerPage = this.showItemPerPageBatch;
      }
    }

    const pagedata = {
      page: this.currentPageOnlinePayAudit,
      pageSize: this.onlinePayAudititemsPerPage,
      sortBy: "orderid"
      //   filters: [{
      //     filterValue :
      //     filterColumn :
      //     filterOperator :
      //   }
      //   ]
    };

    //
    let url = "/onlinePayAudit/all";
    this.customerManagementService.postMethodForIntegration(url, pagedata).subscribe(
      (response: any) => {
        this.batchPaymentList = response.batchPaymentList.content;
        this.batchtotalRecords = response.batchPaymentList.totalElements;
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

  pageChangedPaymentBatchList(page) {
    this.currentPagebatch = page;
    this.searchBatch("");
  }

  pageChangedOnlinePayAuditList(page) {
    this.currentPageOnlinePaymentAudit = page;
    this.searchOnlineAuditPayment(false);
  }

  pageChangedPaymentBatchAuditList(page) {
    this.currentPagebatchAudit = page;
    this.batchPaymentDetailsList("");
  }

  TotalItemPerPageBatchAuditList(event) {
    this.showItemPerPageBatchAudit = Number(event.value);
    if (this.currentPagebatchAudit > 1) {
      this.currentPagebatchAudit = 1;
    }
    this.batchPaymentAuditDetails(this.batchId, this.showItemPerPageBatchAudit);
  }
  batchPaymentAudit: boolean = false;
  batchPaymentAuditDetails(id, size) {
    this.batchPaymentAudit = true;
    let page_list;
    this.batchId = id;
    if (size) {
      page_list = size;
      this.batchAudititemsPerPage = size;
    } else {
      if (this.showItemPerPageBatchAudit == 0) {
        this.batchAudititemsPerPage = this.pageITEM;
      } else {
        this.batchAudititemsPerPage = this.showItemPerPageBatchAudit;
      }
    }

    const url = "/batchPaymentAuditDetail?batchId=" + id;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.batchPaymentAuditList = response.batchPaymentAuditDetails;
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

  closeBatchpaymentAuditModel() {
    this.batchPaymentAudit = false;
  }

  batchMappingPersonalData = [];
  batchMapping: boolean = false;
  batchMappingList(id) {
    this.batchMapping = true;
    let mappingData = [];
    this.batchId = id;

    mappingData = this.batchPaymentList.filter(data => data.batchId == this.batchId);
    if (mappingData.length > 0) {
      this.batchMappingPersonalData = mappingData[0];
    }

    const url = "/batchPaymentMappingList?batchId=" + id;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.batchMappingData = response.mappingList;
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

  pageChangedPaymentBatchMappingtList(page) {
    this.currentPagebatchMapping = page;
  }

  newADDbatch(data) {
    this.ifPaymentList = true;
    this.ifBatchList = false;
    this.ifAddbatchData = true;
    this.batchSingleData = data.creditDocumentList;
    this.batchId = data.batchId;
    this.BatchName = data.batchName;
    this.searchPayment("");
  }

  addBatchPaymentMapping() {
    if (this.chakedPaymentData.length == 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Please select a Mapping Data",
        icon: "far fa-times-circle"
      });
    } else {
      let data = {
        assignedStatus: "Assigned",
        batchPaymentMappingList: this.chakedPaymentData,
        batchname: this.BatchName,
        id: this.batchId
      };

      this.ifPaymentList = false;
      this.ifBatchList = true;
      this.ifAddbatchData = false;

      const url = "/addBatchPaymentMappingInExistingBatch";
      this.revenueManagementService.postMethod(url, data).subscribe(
        (response: any) => {
          this.newBatchName = "";
          this.BatchName = "";
          this.ifAddbatchData = true;
          this.batchSingleData = [];
          //   $("#batchMapping").modal("show");
          //   this.batchMappingList(this.batchId);
          this.searchBatch("");
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
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  deleteBatchPaymentMapping(id) {
    const url = "/deleteBatchPaymentMappingById?id=" + id;
    this.searchPaymentService.deleteMethod(url).subscribe(
      (response: any) => {
        this.batchMappingList(this.batchId);
        this.batchPaymentDetailsList("");
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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  deleteBatchPayment(id) {
    const url = "/deleteBatchPaymentById?batchId=" + id;
    this.searchPaymentService.deleteMethod(url).subscribe(
      (response: any) => {
        this.batchPaymentDetailsList("");
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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  //  apporve , reject, Assign
  openBatchAssignStaff(id, staffName) {
    this.AssignbatchId = id;
    this.assignPaymentStaffForm.reset();
    this.batchApporve = false;
    this.batchReject = false;
    this.batchAssignStaff = true;
    this.staffUserList(id);
  }

  openBatchReject(id) {
    this.getAllTeams();
    this.AssignbatchId = id;
    this.assignPaymentStaffForm.reset();
    this.batchApporve = false;
    this.batchReject = true;
    this.batchAssignStaff = false;
    this.isAssignbatchModelVisible = true;
  }

  openBatchApporve(id, batchdata) {
    this.getAllTeams();
    this.AssignbatchId = id;
    this.assignPaymentStaffForm.reset();
    this.assignPaymentStaffForm.controls.nextStaffId.setValue("");
    this.batchApporve = true;
    this.batchReject = false;
    this.batchAssignStaff = false;
    if (batchdata.nextStaffId) {
      //   $("#teamModal").modal("show");
      this.isSelectTeamModelVisible = true;
    } else {
      //   $("#assignbatchModal").modal("show");
      this.isAssignbatchModelVisible = true;
    }
  }

  assignBatchModelVisible() {
    // this.isSelectTeamModelVisible = false;
    this.isAssignbatchModelVisible = true;
  }

  batchModelVisibleClose() {
    this.isSelectTeamModelVisible = false;
    this.teamToggle = false;
    this.teamselected = null;
    this.staffselected = null;
    this.isAssignbatchModelVisible = false;
  }

  batchPaymentAssignStaff() {
    let data = {
      batchId: this.AssignbatchId,
      nextStaffId: this.assignPaymentStaffForm.value.nextStaffId,
      remark: this.assignPaymentStaffForm.value.remark,
      staffId: this.staffID
    };

    const url = "/batchPaymentAssignByStaffId";
    this.searchPaymentService.postMethod(url, data).subscribe(
      (response: any) => {
        this.assignPaymentStaffForm.reset();
        this.batchPaymentDetailsList("");

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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  AssignApporveStaff() {
    let data = {
      batchId: this.AssignbatchId,
      nextStaffId: this.staffselected ? this.staffselected.id : null,
      remark: this.assignPaymentStaffForm.value.remark,
      staffId: this.staffID
    };

    const url = "/batchPaymentApprove";
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.assignPaymentStaffForm.reset();
        this.batchPaymentDetailsList("");
        this.isSelectTeamModelVisible = false;
        this.isAssignbatchModelVisible = false;

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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  AssignRejectedStaff() {
    let data = {
      batchId: this.AssignbatchId,
      nextStaffId: this.staffselected ? this.staffselected.id : null,
      remark: this.assignPaymentStaffForm.value.remark,
      staffId: this.staffID
    };
    const url = "/batchPaymentReject";
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.assignPaymentStaffForm.reset();
        this.batchPaymentDetailsList("");
        this.isAssignbatchModelVisible = false;

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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  staffUserList(id) {
    let url = "/nextStaffListByBatchId?batchId=" + id;
    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        this.staffList = response.nextStaffList;
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

  totalCheckedPayments = {
    totalSelPayments: 0,
    totalAmount: 0
  };
  ////..........////
  allSelectBatch(event) {
    if (event.checked == true) {
      this.chakedPaymentData = [];
      let checkedData = this.searchPaymentData;
      for (let i = 0; i < checkedData.length; i++) {
        if (
          this.searchPaymentData[i].status !== "approved" &&
          this.searchPaymentData[i].status !== "rejected"
        ) {
          this.chakedPaymentData.push({
            credit_doc_id: this.searchPaymentData[i].id
          });
        }
      }
      this.chakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.credit_doc_id) {
            element.isSinglepaymentChecked = true;
          }
        });
      });

      this.ispaymentChecked = true;
      // console.log(this.chakedPaymentData);
    }
    if (event.checked == false) {
      let checkedData = this.searchPaymentData;
      this.chakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.credit_doc_id) {
            element.isSinglepaymentChecked = false;
          }
        });
      });
      this.chakedPaymentData = [];
      // console.log(this.chakedPaymentData);
      this.ispaymentChecked = false;
      this.allIsChecked = false;
    }
    this.totalCheckedPayments.totalSelPayments = this.chakedPaymentData.length;
    const commonObjects = this.searchPaymentData.filter(obj1 =>
      this.chakedPaymentData.some(obj2 => obj1.id === obj2.credit_doc_id)
    );
    this.totalCheckedPayments.totalAmount = 0;
    commonObjects.forEach(item => {
      this.totalCheckedPayments.totalAmount += item.amount;
    });
  }

  addbatchChecked(id, event) {
    if (event.checked) {
      this.searchPaymentData.forEach((value, i) => {
        if (value.id == id) {
          this.chakedPaymentData.push({
            credit_doc_id: value.id
          });
        }
      });

      if (this.searchPaymentData.length === this.chakedPaymentData.length) {
        this.ispaymentChecked = true;
        this.allIsChecked = true;
      }
      // console.log(this.chakedPaymentData);
    } else {
      let checkedData = this.searchPaymentData;
      checkedData.forEach(element => {
        if (element.id == id) {
          element.isSinglepaymentChecked = false;
        }
      });
      this.chakedPaymentData.forEach((value, index) => {
        if (value.credit_doc_id == id) {
          this.chakedPaymentData.splice(index, 1);
          // console.log(this.chakedPaymentData);
        }
      });

      if (
        this.chakedPaymentData.length == 0 ||
        this.chakedPaymentData.length !== this.searchPaymentData.length
      ) {
        this.ispaymentChecked = false;
      }
    }
    this.totalCheckedPayments.totalSelPayments = this.chakedPaymentData.length;
    const commonObjects = this.searchPaymentData.filter(obj1 =>
      this.chakedPaymentData.some(obj2 => obj1.id === obj2.credit_doc_id)
    );
    this.totalCheckedPayments.totalAmount = 0;
    commonObjects.forEach(item => {
      this.totalCheckedPayments.totalAmount += item.amount;
    });
  }

  openPaymentWorkFlow(id, auditcustid) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "PAYMENT",
      planId: ""
    });
  }

  paymentModal: boolean = false;
  openPaymentModal(id) {
    this.paymentModal = true;
    this.searchData.filters[0].filterValue = "";
    this.searchData.filters[0].filterColumn = "";
    this.searchData.page = "";
    this.searchData.pageSize = "";

    let url = "/getChequeDetail/" + id;
    this.searchPaymentService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.chequeDetail = response.dataList;
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

  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  selectedParentCust: any = [];
  selectedParentCustId: any;
  parentCustList: any;
  newFirst = 1;
  searchParentCustOption = "";
  searchParentCustValue = "";
  parentFieldEnable = false;
  customerList = [];

  currentPage = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  searchOptionSelect = this.commondropdownService.customerSearchOption;

  // customer dropdown

  getParentCustomerData() {
    let currentPage;
    currentPage = this.currentPageParentCustomerListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    this.searchPaymentService.postMethod(url, data).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        this.newFirst = 1;
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
  selectParentCustomer: boolean = false;
  async modalOpenParentCustomer() {
    this.selectParentCustomer = true;
    await this.getParentCustomerData();
    this.newFirst = 0;
    this.selectedParentCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  removeSelParentCust() {
    this.parentCustList = [];
    // this.customerid = null;
  }

  modalCloseParentCustomer() {
    this.selectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 1;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];
    // console.log("this.newFirst1", this.newFirst)
  }
  async saveSelCustomer() {
    this.parentCustList = [
      {
        id: Number(this.selectedParentCust.id),
        name: this.selectedParentCust.name
      }
    ];

    this.customerid = Number(this.selectedParentCust.id);
    this.modalCloseParentCustomer();
  }

  paginate(event) {
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
    this.searchParentCustValue = null
  }

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  searchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    const searchParentData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageParentCustomerListdata,
      pageSize: this.parentCustomerListdataitemsPerPage
    };

    searchParentData.filters[0].filterValue = this.searchParentCustValue;
    searchParentData.filters[0].filterColumn = this.searchParentCustOption.trim();

    const url =
      "/subscriber/getByInvoiceType/search/Group?mvnoId=" + localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.searchPaymentService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
        if (error.error.status == 400 || error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          // this.customerListData = [];
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

  selParentSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
    this.searchParentCustValue = null;
  }

  // ......................
  staffData = [];
  staffCustList: any = [];
  selectApproveList: any = [];
  selectedStaffCust: any = [];
  selectedApprove: any = [];
  parentstaffListdatatotalRecords: any;
  parentStaffListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageParentStaffListdata = 1;
  getStaff() {
    let currentPage;
    currentPage = this.currentPageParentStaffListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentStaffListdataitemsPerPage
    };
    const url = "/staffuser/list?product=BSS";
    this.adoptCommonBaseService.post(url, data).subscribe(
      (response: any) => {
        this.staffData = response.staffUserlist;
        this.parentstaffListdatatotalRecords = response.pageDetails.totalRecords;

        //   console.log("staff", this.staffData);
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
  selectStaffModal: boolean = false;
  async modalOpenStaff() {
    this.selectStaffModal = true;
    await this.getStaff();
    this.newFirst = 1;
    this.selectedStaffCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  removeSelStaff() {
    this.staffCustList = [];
    if (this.ifBatchList) {
      this.batchStaffid = "";
    } else {
      this.staffid = "";
    }
  }

  removeSelAssigned() {
    this.selectApproveList = [];
    this.approveId = "";
  }

  modalCloseStaff() {
    this.selectStaffModal = false;
    this.currentPageParentStaffListdata = 1;
    this.newFirst = 1;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];
    // console.log("this.newFirst1", this.newFirst)
  }

  async saveSelstaff() {
    this.staffCustList = [
      {
        id: Number(this.selectedStaffCust.id),
        name: this.selectedStaffCust.firstname
      }
    ];
    this.staffid = Number(this.selectedStaffCust.id);
    this.batchStaffid = Number(this.selectedStaffCust.id);
    this.modalCloseStaff();
  }
  paginateStaff(event) {
    this.currentPageParentStaffListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchStaffByName();
    } else {
      this.getStaff();
    }
  }
    clearSearchForm() {
    this.searchDeatil = "";
    this.searchOption = "";
    this.currentPage = 1;
    this.searchData.filters[0].filterValue = "";
    this.searchData.page = 0;
    this.getStaff();
    }
  searchStaffByName() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage == 1) {
      this.itemsPerPage = this.pageITEM;
    } else {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.page = this.currentPage; 
   this.searchData.pageSize = this.itemsPerPage;
    this.searchData.filters[0].filterValue = this.searchDeatil.trim();
    this.staffService.staffSearch(this.searchData).subscribe(
      (response: any) => {
        //
        this.staffData = response.dataList;
        this.totalRecords = response.totalRecords;
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.staffData = [];
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

  pickModalOpen(data) {
    let url = "/workflow/pickupworkflow?eventName=PAYMENT&entityId=" + data.id;
    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
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
        this.searchPayment("");
        //
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
  teams: any[];
  teamToggle: boolean = false;
  teamselected: any;
  staffDataList: any;
  staffselected: any;
  getAllTeams() {
    let url = "/teams/getAllFinanceTeam";
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.teams = response.dataList;
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
  selectedTeam() {
    this.staffDataList = [];
    this.teamToggle = true;
    const staffName = this.teamselected.staffNameList;
    const staffId = this.teamselected.staffUserIds;
    staffId.forEach((e: any, i: any) => {
      this.staffDataList.push({ id: e, name: staffName[i] });
    });
  }

  tdsAmount(data) {
    let total = 0;
    for (let datas of data.creditDocumentList) {
      total += datas.tdsAmount;
    }
    return total;
  }
  abbsAmount(data) {
    let total = 0;
    for (let datas of data.creditDocumentList) {
      total += datas.abbsAmount;
    }
    return total;
  }
  reassignWorkflow() {
    let url: any;
    this.remark = this.assignPaymentForm.value.remark;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.paymentIdforAssigned}&eventName=PAYMENT&assignToStaffId=${this.selectStaff}&remark=${this.remark}`;

    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        $("#reasignPlanGroup").modal("hide");
        this.batchPaymentDetailsList("");

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.searchPayment("");

          this.reasignpayment = false;
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

        this.reasignpayment = false;
      }
    );
  }
  paymentIdforAssigned: any;
  reasignpayment: boolean = false;
  StaffReasignList(id) {
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${id}&eventName=PAYMENT`;
    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        this.paymentIdforAssigned = id;
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }

        if (response.dataList != null) {
          this.staffDataList = response.dataList;
          this.approved = true;

          this.reasignpayment = true;
        } else {
          this.reasignpayment = false;
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
  selectApproveModal: boolean = false;
  async modalOpenApprove() {
    this.selectApproveModal = true;
    await this.getStaff();
    this.newFirst = 1;

    this.selectedApprove = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  modalCloseApprove() {
    this.selectApproveModal = false;
    this.currentPageParentStaffListdata = 1;
    this.newFirst = 1;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];
    // console.log("this.newFirst1", this.newFirst)
  }
  async saveSelstaffApprove() {
    this.selectApproveList = [
      {
        id: Number(this.selectedApprove.id),
        name: this.selectedApprove.firstname
      }
    ];
    this.approveId = Number(this.selectedApprove.id);
    this.modalCloseApprove();
  }
  getBankDestinationDetail() {
    const url =
      "/bankManagement/searchByStatus?banktype=operator&mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        // this.bankDataList = response.dataList.banktype;
        this.bankDestination = response.dataList;
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
  getBankDetail() {
    const url = `/bankManagement/searchByStatus?banktype=other&mvnoId=${localStorage.getItem("mvnoId")}`;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
        // this.bankDestination = response.dataList.banktype
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

  checkUncheckAllInvoice() {
    for (let i = 0; i < this.batchMappingData.length; i++) {
      this.batchMappingData[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemListInvoice();
  }

  isAllSelectedInvoice() {
    this.masterSelected = this.batchMappingData.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemListInvoice();
  }

  getCheckedItemListInvoice() {
    this.checkedList = [];
    for (let i = 0; i < this.batchMappingData.length; i++) {
      if (this.batchMappingData[i].isSelected) {
        this.checkedList.push(this.batchMappingData[i]);
        if (this.selectedInvoiceIdList.indexOf(this.batchMappingData[i]) === -1) {
          this.selectedInvoiceIdList.push(this.batchMappingData[i]);
        }
      } else {
        let isElementAlreadyExist = this.selectedInvoiceIdList.find(
          obj => obj.id === this.batchMappingData[i].id
        );
        if (
          isElementAlreadyExist != undefined &&
          isElementAlreadyExist &&
          !this.batchMappingData[i].isSelected
        ) {
          const index: number = this.selectedInvoiceIdList.findIndex(
            obj => obj.id === this.batchMappingData[i].id
          );
          this.selectedInvoiceIdList.splice(index, 1);
        }
      }
    }
  }

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  updateBatch() {
    var request = [];
    this.checkedList.forEach(invoice => {
      let data = {
        amount: invoice.amount,
        creditDocId: invoice.creditDocumentId
      };
      request.push(data);
    });
    this.masterSelected = false;
    const url = "/paymentGateway/editbatchpayment";
    this.searchPaymentService.postMethod(url, request).subscribe(
      (response: any) => {
        this.closeBatchDetailsDialog();
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

  downloadInvoice(docId, custId, fileName) {
    const url = "/documentForInvoice/download/" + docId + "/" + custId;
    this.revenueManagementService.downloadInvoice(url).subscribe(
      (response: any) => {
        var fileType = "";
        var file = new Blob([response], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);
        FileSaver.saveAs(file, fileName);
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

  // pendingStatusValue: any;
  checkPendingStatus(assignmentStatus, batchStatus) {
    var pendingStatusValue = batchStatus;
    if (assignmentStatus.toLowerCase() == "assignedtootherteam") pendingStatusValue = "Submitted";
    else if (assignmentStatus.toLowerCase() == "pending") pendingStatusValue = "Collected";
    return pendingStatusValue;
  }

  downloadFile(filename, docid, custId) {
    const url = "/documentForInvoice/download/" + docid + "/" + custId;
    this.revenueManagementService.downloadInvoice(url).subscribe(
      (response: any) => {
        var fileType = "";
        var file = new Blob([response], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);
        FileSaver.saveAs(file, filename);
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

  approveRejectModelClose() {
    this.ApproveRejectModal = false;
  }

  SearchOnlinePaymentAudit() {
    this.ifPaymentList = false;
    this.ifOnlinePaymentAuditList = true;
    this.ifBatchList = false;
    this.ifAddbatchData = false;
    this.ispaymentChecked = false;
    this.allIsChecked = false;
    this.isSinglepaymentChecked = false;
    this.chakedPaymentData = [];
    this.batchId = "";
    this.BatchName = "";
    this.newBatchName = "";
    this.batchSingleData = [];
    this.searchOnlineAuditPayment(false);
  }

  searchOnlineAuditPayment(isSerach) {
    let data;
    //  if(isSerach){
    //     this.currentPageOnlinePayAudit =1;
    //     this.onlinePayAudititemsPerPage =5;
    //     data = {
    //     page: this.currentPageOnlinePayAudit,
    //     pageSize: this.onlinePayAudititemsPerPage,
    //     sortBy: "id",
    //     filters: [
    //         {
    //         filterValue: this.selectedAuditSearchValue,
    //         filterColumn: "any",
    //         filterCondition: "and",
    //         filterDataType: this.selectedAuditSearchOption,
    //         filterOperator: "equalsTo",
    //         },
    //     ],
    // };
    // }else{
    data = {
      page: this.currentPageOnlinePaymentAudit,
      pageSize: this.onlinePaymentAudititemsPerPage,
      sortBy: "id",
      filters: [
        {
          filterValue: this.selectedAuditSearchValue,
          filterColumn: "any",
          filterCondition: "and",
          filterDataType: this.selectedAuditSearchOption,
          filterOperator: "equalto",
          fromDate: "",
          toDate: ""
        }
      ]
    };
    // }

    if (this.selectedAuditSearchOption !== "transactionDate") {
      this.searchkey = this.selectedAuditSearchValue.trim();
      // this.searchkey2 = this.selectedAuditSearchOption.trim();

      data.filters[0].filterValue = this.selectedAuditSearchValue.trim();
      data.filters[0].filterDataType = this.selectedAuditSearchOption.trim();
    } else {
      let searchDeatil = this.datePipe.transform(this.selectedAuditSearchValue, "yyyy-MM-dd");
      this.searchkey = searchDeatil;
      // this.searchkey2 = this.selectedAuditSearchOption;

      data.filters[0].filterValue = searchDeatil;
      data.filters[0].filterDataType = this.selectedAuditSearchOption;
    }
    data.filters[0].fromDate = this.datePipe.transform(this.searchFromDate, "yyyy-MM-dd");
    data.filters[0].toDate = this.datePipe.transform(this.searchTodate, "yyyy-MM-dd");
    let url;
    url = "/onlinePayAudit/all";

    this.customerManagementService.postMethodForIntegration(url, data).subscribe(
      (response: any) => {
        this.onlinePaymentAuditList = response.onlineAuditData;
        this.onlinePaymentAuditotalRecords = response.totalRecords;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Records fetched successfully.",
          icon: "far fa-times-circle"
        });
      },
      (error: any) => {
        if (error.error.status == "Failed") {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.message,
            icon: "far fa-times-circle"
          });

          // this.taxListData.taxlist = [];
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

  retryPayment(orderId) {
    this.paymentData = [];
    const url = "/ByOrderId?orderId=" + orderId;
    this.customerManagementService.getMethodForIntegration(url).subscribe(
      (response: any) => {
        this.searchOnlineAuditPayment(false);
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

  closeBatchDetailsDialog() {
    this.batchMapping = false;
  }

  closeAssignCustomerModel() {
    this.assignCustomerCAFModal = false;
  }

  closeReassignModel() {
    this.reasignpayment = false;
  }

  closePaymentModal() {
    this.paymentModal = false;
  }

  addToWallet(orderId: number) {
    this.transModal = true;
    this.addToWalletOrderId = orderId;
  }
  openFailureReason(data: any) {
    this.selectedFailureDescription = data.failureDescription; // Store the clicked row's failureDescription
    this.failureReasonDialog = true; // Open the dialog
  }

  closeFailureReason() {
    this.failureReasonDialog = false; // Close the dialog
    this.selectedFailureDescription = ""; // Clear the selected failure description when the dialog is closed
  }

  addToWalletAPI() {
    const url =
      "/addToWalletByOrderId?orderId=" +
      this.addToWalletOrderId +
      "&transactionId=" +
      this.transactionNo;
    this.recordPaymentService.postMethodForIntegration(url, null).subscribe(
      (response: any) => {
        if (response?.responseCode === 500) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response?.data,
            icon: "far fa-times-circle"
          });
          return;
        }
        if ([405, 406, 417, 415].includes(response?.responseCode)) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response?.data,
            icon: "far fa-info-circle"
          });
          return;
        }
        this.customerData = response.customerList;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response?.data,
          icon: "far fa-check-circle"
        });
        this.transModal = false;
        this.addToWalletOrderId = "";
        this.transactionNo = "";
        this.searchOnlineAuditPayment(false);
      },
      (error: any) => {
        console.error("Error:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  ConfirmonTransactionNumber() {
    if (this.addToWalletOrderId) {
      this.confirmationService.confirm({
        message: "Do you want to confirm this transaction no?",
        header: "Transaction No Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.addToWalletAPI();
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

  transactionModal() {
    this.transModal = false;
    this.addToWalletOrderId = "";
    this.transactionNo = "";
  }

  async exportExcel() {
    let searchFromDate = this.searchFromDate
      ? this.datePipe.transform(this.searchFromDate, "yyyy-MM-dd")
      : null;
    let searchTodate = this.searchTodate
      ? this.datePipe.transform(this.searchTodate, "yyyy-MM-dd")
      : null;
    let selectedAuditSearchValue;
    if (this.selectedAuditSearchOption === "transactionDate") {
      selectedAuditSearchValue = this.selectedAuditSearchValue
        ? this.datePipe.transform(this.selectedAuditSearchValue, "yyyy-MM-dd")
        : null;
    } else {
      selectedAuditSearchValue = this.selectedAuditSearchValue;
    }
    let obj = [
      {
        filterColumn: "any",
        filterDataType: this.selectedAuditSearchOption,
        filterValue: selectedAuditSearchValue,
        fromDate: searchFromDate,
        toDate: searchTodate
      }
    ];

    this.recordPaymentService.getDataTOExport(obj).subscribe(
      (res: any) => {
        if (res.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: res.msg,
            icon: "far fa-times-circle"
          });
        } else {
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res.dataToExport);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "PaymentAudit");
          const fileName = `Payment audit${searchFromDate ? " " + searchFromDate : ""}${searchTodate ? " to " + searchTodate : ""}.xlsx`;
          XLSX.writeFile(wb, fileName);
        }
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error?.error?.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
  searchStaffName() {
    if (this.searchStaffDeatil) {
      this.approveCAF = this.approveCAFData.filter(
        staff =>
          staff.fullName.toLowerCase().includes(this.searchStaffDeatil.toLowerCase()) ||
          staff.username.toLowerCase().includes(this.searchStaffDeatil.toLowerCase())
      );
       if (this.approveCAF.length === 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "No data found",
        icon: "far fa-times-circle"
      });
    }

    } else {
      this.approveCAF = this.approveCAFData;
    }
  }

  clearSearch() {
    this.searchStaffDeatil = "";
    this.approveCAF = this.approveCAFData;
  }

   getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerLedgerDetailData = response.customers;
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.customerLedgerDetailData?.mvnoId
          : localStorage.getItem("mvnoId");
      this.commondropdownService.getsystemconfigList(mvnoId);

      //Address
      if (this.customerLedgerDetailData.addressList.length > 0) {
        if (this.customerLedgerDetailData.addressList[0].addressType) {
          this.presentFullAddress = this.customerLedgerDetailData.addressList[0].fullAddress;
          let areaurl = "/area/" + this.customerLedgerDetailData.addressList[0].areaId;

          this.customerdetailsilsService.commonGetMethod(areaurl).subscribe((response: any) => {
            this.presentAdressDATA = response.data;
          });
        }
      }
      this.customerLedgerDetailData?.currency
        ? (this.currency = this.customerLedgerDetailData?.currency)
        : this.systemService
            .getConfigurationByName("CURRENCY_FOR_PAYMENT", mvnoId)
            .subscribe((res: any) => {
              this.currency = res.data.value;
            });
    });
  }
  
}
