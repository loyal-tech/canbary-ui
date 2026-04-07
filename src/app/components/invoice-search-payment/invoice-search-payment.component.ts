import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { SearchPaymentService } from "src/app/service/search-payment.service";
import { CustomerDetailsService } from "src/app/service/customer-details.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomerDetailsComponent } from "../common/customer-details/customer-details.component";
import { BehaviorSubject } from "rxjs";
import * as FileSaver from "file-saver";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PaymentAmountModelComponent } from "src/app/components/payment-amount-model/payment-amount-model.component";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { CREDIT_NOTES } from "src/app/constants/aclConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
declare var $: any;

@Component({
  selector: "app-invoice-search-payment",
  templateUrl: "./invoice-search-payment.component.html",
  styleUrls: ["./invoice-search-payment.component.css"]
})
export class InvoiceSearchPaymentComponent implements OnInit {
  @ViewChild(CustomerDetailsComponent)
  customerDetailModal: CustomerDetailsComponent;
  @ViewChild(PaymentAmountModelComponent)
  PaymentDetailModal: PaymentAmountModelComponent;
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;
  dialogId: boolean = false;
  searchPaymentFormGroup: FormGroup;
  submitted: boolean = false;
  displayInvoiceDetails: boolean = false;
  customerData: any;
  searchPaymentData: any;
  currentPagePaymentSlab = 1;
  paymentitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  paymenttotalRecords: number;
  isPaymentSearch: boolean = false;
  customerid: any = "";
  payfromdate = "";
  paytodate = "";
  creditDocumentNumber = "";
  paystatus = "";
  recepit: any;
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
  showItemPerPage = 0;
  searchkey: string;
  totalAreaListLength = 0;
  payStatus = [
    { label: "Adjusted", value: "Fully Adjusted" },
    { label: "Generated", value: "pending" },
    { label: "Partially Adjusted", value: "Partially Adjusted" },
    { label: "Approved", value: "approved" }
  ];

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  staffID: number;
  reject = false;
  rejectCAF = [];
  selectStaffReject: any;
  approved = false;
  approveCAF = [];
  selectStaff: any;
  approveId: any;
  mobileNumber = "";
  invoiceNumber = "";
  referenceno = "";
  remarks: any;
  currency: string;
  ifModelIsShow: boolean = false;
  downloadAccess: boolean = false;
  reprintAccess: boolean = false;
  reassignAccess: boolean = false;

  showParentCustomerModel = false;
  custType = "both";
  searchStaffDeatil: any;
  approveCafData: any[];
  assignCustomerCAFModal: boolean = false;
  rejectCustomerCAFModal: boolean = false;
  ApproveRejectModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private searchPaymentService: SearchPaymentService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService,
    private systemService: SystemconfigService
  ) {
    this.downloadAccess = loginService.hasPermission(CREDIT_NOTES.CREDIT_NOTE_DOWNLOAD);
    this.reprintAccess = loginService.hasPermission(CREDIT_NOTES.CREDIT_NOTE_REPRINT);
    this.reassignAccess = loginService.hasPermission(CREDIT_NOTES.CREDIT_NOTE_REASSIGN);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }
  assignPLANForm: FormGroup;
  ngOnInit(): void {
    let staffID = localStorage.getItem("userId");
    this.staffID = Number(staffID);
    // this.searchPaymentFormGroup = this.fb.group({
    //   customerid: [""],
    //   payfromdate: [""],
    //   paytodate: [""],
    //   paystatus: [""],
    // });
    // this.getCustomer();this api will remove by shivam
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getPostpaidplanData();
    const serviceArea = localStorage.getItem("serviceArea");

    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
    this.assignPLANForm = this.fb.group({
      remark: [""]
    });
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  openPaymentInvoiceModal(id, paymentId) {
    this.displayInvoiceDetails = true;
    this.PaymentamountService.show(id);
    this.paymentId.next({
      paymentId: paymentId
    });
  }
  getCustomer() {
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    let custerlist = {
      page: 1,
      pageSize: 10000
    };
    this.searchPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        let serviceArea: any = [];
        serviceArea = JSON.parse(localStorage.getItem("serviceArea"));
        if (serviceArea.length > 0) {
          let customerListData = [];
          for (var idx = 0; idx < response.customerList.length; idx++) {
            var custobj = response.customerList[idx];
            if (serviceArea.includes(custobj.networkDetails.serviceareaid)) {
              customerListData.push(custobj);
            }
          }
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagePaymentSlab > 1) {
      this.currentPagePaymentSlab = 1;
    }
    if (!this.searchkey) {
      this.searchPayment(this.showItemPerPage);
    }
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

  searchPayment(size) {
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

    let url: any = "";
    url =
      "/paymentGateway/payment/search?type=CreditNote&page=" +
      this.currentPagePaymentSlab +
      "&pageSize=" +
      this.paymentitemsPerPage +
      "&mvnoId=" +
      localStorage.getItem("mvnoId");
    if (this.customerid) {
      url = url + "&customerid=" + this.customerid;
    }
    if (this.paystatus) {
      url = url + "&paystatus=" + this.paystatus;
    }
    if (this.paytodate) {
      url = url + "&paytodate=" + this.paytodate;
    }
    if (this.invoiceNumber) {
      url = url + "&invoiceNumber=" + this.invoiceNumber;
    }
    if (this.referenceno) {
      url = url + "&referenceno=" + this.referenceno;
    }
    if (this.mobileNumber) {
      url = url + "&mobileNumber=" + this.mobileNumber;
    }
    if (this.payfromdate) {
      url = url + "&payfromdate=" + this.payfromdate;
    }
    if (this.creditDocumentNumber) {
      url = url + "&creditDocumentNumber=" + this.creditDocumentNumber;
    }
    // const url =
    //   "/payment/search?customerid=" +
    //   this.customerid +
    //   "&paystatus=" +
    //   this.paystatus +
    //   "&paytodate=" +
    //   this.paytodate +
    //   "&invoiceNumber=" +
    //   this.invoiceNumber +
    //   "&referenceno=" +
    //   this.referenceno +
    //   "&mobileNumber=" +
    //   this.mobileNumber +
    //   "&payfromdate=" +
    //   this.payfromdate +
    //   "&type=CreditNote";
    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        if (response.creditDocumentPojoList?.length > 0) {
          this.searchPaymentData = response.creditDocumentPojoList;
          if (this.showItemPerPage > this.paymentitemsPerPage) {
            this.totalAreaListLength = this.searchPaymentData.length % this.showItemPerPage;
          } else {
            this.totalAreaListLength = this.searchPaymentData.length % this.paymentitemsPerPage;
          }
          this.paymenttotalRecords = response.pageDetails?.totalRecords;
          this.isPaymentSearch = true;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Record fetched successfully",
            icon: "far fa-times-circle"
          });
        } else {
          this.searchPaymentData = response.creditDocumentPojoList;
          if (this.showItemPerPage > this.paymentitemsPerPage) {
            this.totalAreaListLength = this.searchPaymentData.length % this.showItemPerPage;
          } else {
            this.totalAreaListLength = this.searchPaymentData.length % this.paymentitemsPerPage;
          }
          this.paymenttotalRecords = response.pageDetails?.totalRecords;
          this.isPaymentSearch = true;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Record Found",
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

  clearPayment() {
    this.isPaymentSearch = false;
    this.customerid = "";
    this.payfromdate = "";
    this.paytodate = "";
    this.paystatus = "";
    this.mobileNumber = "";
    this.invoiceNumber = "";
    this.referenceno = "";
    this.creditDocumentNumber = "";
    this.searchPaymentData = [];
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
  approveRejectRemark = "";
  ticketApprRejectData: any = [];

  approveModalOpen(data) {
    this.approveRejectRemark = "";
    this.ifApproveStatus = true;
    this.ticketApprRejectData = data;
    this.ApproveRejectModal = true;
  }

  rejectModalOpen(data) {
    this.approveRejectRemark = "";
    this.ifApproveStatus = false;
    this.ticketApprRejectData = data;
    this.ApproveRejectModal = true;
  }

  statusRejected() {
    this.approveId = this.ticketApprRejectData.id;
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

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  closeParentCust() {
    this.displayInvoiceDetails = false;
  }

  statusApporeved() {
    this.approveId = this.ticketApprRejectData.id;
    this.approved = false;
    this.approveCAF = [];
    this.selectStaff = null;
    let approvedData = {
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

    const url = "/payment/approve?mvnoId=" + localStorage.getItem("mvnoId");
    this.searchPaymentService.postMethod(url, approvedData).subscribe(
      (response: any) => {
        // this.recepit = response.data;

        this.ApproveRejectModal = false;
        if (response.payment.dataList) {
          this.approved = true;

          this.approveCAF = response.payment.dataList;
          this.approveCafData = this.approveCAF;
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
      // this.spinner.hide() ;
      //   }
    );
  }
  assignToStaff(flag) {
    let url: any;
    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${
          this.approveId
        }&eventName=${"PAYMENT"}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.approveId
        }&eventName=${"PAYMENT"}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${
          this.approveId
        }&eventName=${"PAYMENT"}&nextAssignStaff=${
          this.selectStaffReject
        }&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.approveId
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

  assignCreditnoteToStaff(flag) {
    let url: any;
    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${
          this.approveId
        }&eventName=${"CREDIT_NOTE"}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.approveId
        }&eventName=${"CREDIT_NOTE"}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${
          this.approveId
        }&eventName=${"CREDIT_NOTE"}&nextAssignStaff=${
          this.selectStaffReject
        }&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.approveId
        }&eventName=${"CREDIT_NOTE"}&isApproveRequest=${flag}`;
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

  openPaymentWorkFlow(id, auditcustid) {
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "PAYMENT",
      planId: ""
    });
  }
  openCreditNoteWorkFlow(id, auditcustid) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "CREDIT_NOTE",
      planId: ""
    });
  }
  creditNoteReprint(id) {
    const url = "/payment/generatereceipt/" + id;
    this.searchPaymentService.downloadPDF(url).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        FileSaver.saveAs(file, id);
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

  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  selectedParentCust: any = [];
  selectedParentCustId: any;
  parentCustList: any;
  newFirst = 0;
  searchParentCustOption = "";
  searchParentCustValue = "";
  parentFieldEnable = false;
  customerList = [];
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

  async modalOpenParentCustomer() {
    // $("#selectParentCustomer").modal("show");
    // await this.getParentCustomerData();
    // this.newFirst = 1;
    this.showParentCustomerModel = true;
    this.selectedParentCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  //   modalCloseParentCustomer() {
  //     $("#selectParentCustomer").modal("hide");
  //     this.currentPageParentCustomerListdata = 1;
  //     this.newFirst = 1;
  //     this.searchParentCustValue = "";
  //     this.searchParentCustOption = "";
  //     this.parentFieldEnable = false;
  //     this.customerList = [];

  //     // console.log("this.newFirst1", this.newFirst)
  //   }
  async selectedCustChange(event) {
    this.showParentCustomerModel = false;
    this.selectedParentCust = event;

    this.parentCustList = [
      {
        id: Number(this.selectedParentCust.id),
        name: this.selectedParentCust.name
      }
    ];
    this.customerid = Number(this.selectedParentCust.id);
  }
  closeCust() {
    this.showParentCustomerModel = false;
  }

  //   async saveSelCustomer() {
  //     this.parentCustList = [
  //       {
  //         id: Number(this.selectedParentCust.id),
  //         name: this.selectedParentCust.name,
  //       },
  //     ];
  //     this.customerid = Number(this.selectedParentCust.id);
  //     this.modalCloseParentCustomer();
  //   }

  paginate(event) {
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
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
      "/parentCustomers/search/" +
      RadiusConstants.CUSTOMER_TYPE.PREPAID +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.searchPaymentService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.msg,
            icon: "far fa-times-circle"
          });
          // this.customerListData = [];
          this.parentCustomerListdatatotalRecords = 0;
        } else {
          this.customerList = response.customerList;
          this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        }
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
  }

  pickModalOpen(data) {
    let url = "/workflow/pickupworkflow?eventName=CREDIT_NOTE&entityId=" + data.id;
    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        this.searchPayment("");
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
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

  approvableStaff: any = [];
  reAssignPLANModalApprove: boolean = false;
  assignedCreditNoteid: any;
  StaffReasignList1(data) {
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=CREDIT_NOTE`;
    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedCreditNoteid = data.id;
        this.approvableStaff = [];
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
        if (response.dataList != null) {
          this.approvableStaff = response.dataList;
          this.approved = true;
          this.reAssignPLANModalApprove = true;
        } else {
          this.reAssignPLANModalApprove = false;
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
  closeStaffReasignListForTermination() {
    this.reAssignPLANModalApprove = false;
  }
  reassignWorkflow() {
    let url: any;
    if (this.assignedCreditNoteid == null) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Approve Before reasign",
        icon: "far fa-times-circle"
      });
    } else {
      this.remarks = this.assignPLANForm.value.remark;
      url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignedCreditNoteid}&eventName=CREDIT_NOTE&assignToStaffId=${this.selectStaff}&remark=${this.remarks}`;

      this.searchPaymentService.getMethod(url).subscribe(
        (response: any) => {
          this.reAssignPLANModalApprove = false;
          this.searchPayment("");
          this.getCustomer();
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
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
  }

  searchStaffByName() {
    if (this.searchStaffDeatil) {
      this.approveCAF = this.approveCafData.filter(
        staff =>
          staff.fullName.toLowerCase().includes(this.searchStaffDeatil.toLowerCase()) ||
          staff.username.toLowerCase().includes(this.searchStaffDeatil.toLowerCase())
      );
    } else {
      this.approveCAF = this.approveCafData;
    }
  }

  clearSearchForm() {
    this.searchStaffDeatil = "";
    this.approveCAF = this.approveCafData;
  }

  closeCreditNote() {
    this.assignCustomerCAFModal = false;
  }

  closeCreditReject() {
    this.rejectCustomerCAFModal = false;
  }

  closeApproveRejectModal() {
    this.ApproveRejectModal = false;
  }
}
