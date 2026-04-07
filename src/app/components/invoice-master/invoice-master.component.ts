import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { ActivatedRoute, Router } from "@angular/router";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { BehaviorSubject } from "rxjs";
import { CustomerDetailsComponent } from "../common/customer-details/customer-details.component";
import { CustomerDetailsService } from "src/app/service/customer-details.service";
import * as FileSaver from "file-saver";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { InvoiceDetalisModelComponent } from "../invoice-detalis-model/invoice-detalis-model.component";
import { InvoicePaymentDetailsModalComponent } from "../invoice-payment-details-modal/invoice-payment-details-modal.component";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { INVOICE_SYSTEMS } from "src/app/constants/aclConstants";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
declare var $: any;
@Component({
  selector: "app-invoice-master",
  templateUrl: "./invoice-master.component.html",
  styleUrls: ["./invoice-master.component.css"]
})
export class InvoiceMasterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private Activatedroute: ActivatedRoute,
    private messageService: MessageService,
    private invoiceMasterService: InvoiceMasterService,
    private revenueManagementService: RevenueManagementService,
    private customerDetailsService: CustomerDetailsService,
    private invoiceDetailsService: InvoiceDetailsService,
    public invoicePaymentListService: InvoicePaymentListService,
    public customerdetailsilsService: CustomerdetailsilsService,
    loginService: LoginService
  ) {
    this.generateAccess = loginService.hasPermission(
      INVOICE_SYSTEMS.POST_BILL_RUN_INVOICE_GENERATE
    );
    this.invoiceAccess = loginService.hasPermission(INVOICE_SYSTEMS.POST_BILL_RUN_INVOICE_PAY_LIST);
    this.voidAccess = loginService.hasPermission(INVOICE_SYSTEMS.POST_BILL_RUN_INVOICE_VOID);
    this.reprintAccess = loginService.hasPermission(INVOICE_SYSTEMS.POST_BILL_RUN_INVOICE_REPRINT);
    this.cancelRegenerateAccess = loginService.hasPermission(
      INVOICE_SYSTEMS.POST_BILL_RUN_INVOICE_CR
    );
    this.viewInvoiceAccess = loginService.hasPermission(INVOICE_SYSTEMS.POST_BILL_RUN_INVOICE_VIEW);
    this.loginService = loginService;
  }
  @ViewChild("closebutton") closebutton;
  @ViewChild(CustomerDetailsComponent)
  customerDetailModal: CustomerDetailsComponent;
  @ViewChild(InvoiceDetalisModelComponent)
  InvoiceDetailModal: InvoiceDetalisModelComponent;
  @ViewChild(InvoicePaymentDetailsModalComponent)
  invoicePaymentDetailModal: InvoicePaymentDetailsModalComponent;
  searchInvoiceMasterFormGroup: FormGroup;
  invoiceAccess: boolean = false;
  viewInvoiceAccess: boolean = false;
  cancelRegenerateAccess: boolean = false;
  generateAccess: boolean = false;
  reprintAccess: boolean = false;
  voidAccess: boolean = false;
  dialogId: boolean = false;
  invoiceMasterCategoryList: any;
  invoiceMasterListData: any = [];
  viewinvoiceMasterListData: any = [];
  searchinvoiceMasterUrl: any;
  currentPageinvoiceMasterSlab = 1;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMastertotalRecords: String;
  searchInvoiceData: any;
  isInvoiceSearch = false;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  custID: number;
  InvoiceDATA = new BehaviorSubject({
    InvoiceDATA: ""
  });
  invoiceId = new BehaviorSubject({
    invoiceId: ""
  });
  custId = new BehaviorSubject({
    custId: ""
  });
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  customerListData: any;
  totaladjustedAmount = 0;
  invoicePaymentData = [];
  invoiceID = "";
  invoicePaymentItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageinvoicePaymentList = 1;
  invoicePaymenttotalRecords: number;
  ifInvoicePayment = false;
  isInvoiceDetail = false;
  allchakedPaymentData = [];
  ispaymentChecked = false;
  allIsChecked = false;
  isSinglepaymentChecked = false;
  invoicePayment = false;
  invoiceCancelRemarksModal = false;
  ngOnInit(): void {
    this.searchInvoiceMasterFormGroup = this.fb.group({
      billfromdate: [""],
      billrunid: [""],
      billtodate: [""],
      custMobile: ["", Validators.minLength(3)],
      custname: [""],
      docnumber: [""],
      customerid: [""]
    });
    if (this.Activatedroute.snapshot.queryParamMap.get("id")) {
      this.searchinvoiceMaster(this.Activatedroute.snapshot.queryParamMap.get("id"), "");
    }
    this.commondropdownService.getBillRunMasterList();
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getPostpaidplanData();
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
    // this.commondropdownService.getCustomer();
    // this.getcustomerList();
  }

  getcustomerList() {
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    const custerlist = {
      page: 1,
      pageSize: 10000
    };
    this.invoiceMasterService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        const customerListData = response.customerList.filter(cust => cust.custtype == "Postpaid");
        this.customerListData = customerListData;
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

  openCustomerModal(id, custId) {
    this.dialogId = true;
    this.custId.next({
      custId: custId
    });
  }

  openInvoiceModal(invoice) {
    this.isInvoiceDetail = true;
    this.invoiceID = invoice.id;
    this.custID = invoice.custid;
  }
  closeInvoiceDetails() {
    this.isInvoiceDetail = false;
    this.invoiceID = "";
    this.custID = 0;
  }

  openInvoicePaymentModal(id, invoiceId) {
    this.invoicePaymentListService.show(id);
    this.invoiceId.next({
      invoiceId
    });
  }

  pageChangedinvoiceMasterList(pageNumber) {
    this.currentPageinvoiceMasterSlab = pageNumber;
    this.searchinvoiceMaster("", "");
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageinvoiceMasterSlab > 1) {
      this.currentPageinvoiceMasterSlab = 1;
    }
    this.searchinvoiceMaster("", this.showItemPerPage);
  }

  searchInvoices() {
    this.currentPageinvoiceMasterSlab = 1;
    this.searchinvoiceMaster("", "");
  }

  searchinvoiceMaster(id, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.invoiceMasteritemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.invoiceMasteritemsPerPage = this.pageITEM;
      } else {
        this.invoiceMasteritemsPerPage = this.showItemPerPage;
      }
    }

    if (this.searchInvoiceMasterFormGroup.value.docnumber == null) {
      this.searchInvoiceMasterFormGroup.value.docnumber = "";
    }
    if (this.searchInvoiceMasterFormGroup.value.custMobile == null) {
      this.searchInvoiceMasterFormGroup.value.custMobile = "";
    }

    const searchList = [];
    let url;
    let baseUrl;

    if (id) {
      this.searchInvoiceMasterFormGroup.value.billrunid = id;
      this.searchInvoiceMasterFormGroup.patchValue({
        billrunid: Number(id)
      });
      baseUrl = "/trial/invoice/search?billrunid=";
    } else {
      baseUrl = "/invoice/search?billrunid=";
    }

    let dtoData = {
      page: this.currentPageinvoiceMasterSlab,
      pageSize: this.invoiceMasteritemsPerPage
    };
    url =
      baseUrl +
      this.searchInvoiceMasterFormGroup.value.billrunid +
      "&docnumber=" +
      this.searchInvoiceMasterFormGroup.value.docnumber.trim() +
      "&customerid=" +
      this.searchInvoiceMasterFormGroup.value.customerid +
      "&billfromdate=" +
      this.searchInvoiceMasterFormGroup.value.billfromdate +
      "&billtodate=" +
      this.searchInvoiceMasterFormGroup.value.billtodate +
      "&custmobile=" +
      this.searchInvoiceMasterFormGroup.value.custMobile +
      "&type=Postpaid" +
      "&isInvoiceVoid=false";
    this.revenueManagementService.postMethod(url, dtoData).subscribe(
      (response: any) => {
        this.invoiceMasterListData = response.invoicesearchlist;

        this.isInvoiceSearch = true;
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

  clearSearchinvoiceMaster() {
    this.isInvoiceSearch = false;
    this.searchInvoiceMasterFormGroup.reset();
    this.searchInvoiceMasterFormGroup.controls.billrunid.setValue("");
    this.searchInvoiceMasterFormGroup.controls.docnumber.setValue("");
    this.searchInvoiceMasterFormGroup.controls.custname.setValue("");
    this.searchInvoiceMasterFormGroup.controls.billfromdate.setValue("");
    this.searchInvoiceMasterFormGroup.controls.billtodate.setValue("");
    this.searchInvoiceMasterFormGroup.controls.customerid.setValue("");
    this.invoiceMasterListData = [];
  }

  downloadPDF(docNo) {
    if (docNo) {
      const downloadUrl = "/invoicePdf/download/" + docNo;
      this.invoiceMasterService.downloadPDF(downloadUrl).subscribe(
        (response: any) => {
          const file = new Blob([response], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          FileSaver.saveAs(file);
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

  pageChangedInvoicePaymentList(pageNumber) {
    this.currentPageinvoicePaymentList = pageNumber;
  }
  invoicePaymentCloseModal() {
    this.invoicePayment = false;
    this.ifInvoicePayment = false;
    this.ispaymentChecked = false;
    this.allIsChecked = false;
    this.isSinglepaymentChecked = false;
    this.invoicePaymentData = [];
    this.allchakedPaymentData = [];
  }

  invoicePaymentList(invoice) {
    this.invoiceID = invoice.id;

    this.invoicePaymentData = [];
    if (invoice.adjustedAmount >= invoice.totalamount) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Total payment is already adjusted",
        icon: "far fa-times-circle"
      });
    } else {
      this.invoicePayment = true;
      const url = "/paymentmapping/" + this.invoiceID;
      this.invoiceMasterService.getMethod(url).subscribe(
        (response: any) => {
          this.invoicePaymentData = response.Paymentlist;
          this.invoicePaymenttotalRecords = this.invoicePaymentData.length;

          this.invoicePaymentData.forEach((value, index) => {
            this.invoicePaymentData[index].isSinglepaymentChecked = false;
            this.totaladjustedAmount =
              this.totaladjustedAmount + this.invoicePaymentData[index].adjustedAmount;
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

  checkInvoicePaymentAll(event) {
    if (event.checked == true) {
      this.allchakedPaymentData = [];
      const checkedData = this.invoicePaymentData;
      for (let i = 0; i < checkedData.length; i++) {
        this.allchakedPaymentData.push({
          id: this.invoicePaymentData[i].id,
          amount: this.invoicePaymentData[i].amount
        });
      }
      this.allchakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.id) {
            element.isSinglepaymentChecked = true;
          }
        });
      });
      this.ispaymentChecked = true;
      // console.log(this.allchakedPaymentData);
    }
    if (event.checked == false) {
      const checkedData = this.invoicePaymentData;
      this.allchakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.id) {
            element.isSinglepaymentChecked = false;
          }
        });
      });
      this.allchakedPaymentData = [];
      // console.log(this.allchakedPaymentData);
      this.ispaymentChecked = false;
      this.allIsChecked = false;
    }
  }

  addInvoicePaymentChecked(id, event): void {
    if (event.checked) {
      this.invoicePaymentData.forEach((value, i) => {
        if (value.id === id) {
          this.allchakedPaymentData.push({
            id: value.id,
            amount: value.amount
          });
        }
      });

      if (this.invoicePaymentData.length === this.allchakedPaymentData.length) {
        this.ispaymentChecked = true;
        this.allIsChecked = true;
      }
      // console.log(this.allchakedPaymentData);
    } else {
      const checkedData = this.invoicePaymentData;
      checkedData.forEach(element => {
        if (element.id === id) {
          element.isSinglepaymentChecked = false;
        }
      });
      this.allchakedPaymentData.forEach((value, index) => {
        if (value.id === id) {
          this.allchakedPaymentData.splice(index, 1);
          // console.log(this.allchakedPaymentData);
        }
      });

      if (
        this.allchakedPaymentData.length == 0 ||
        this.allchakedPaymentData.length !== this.invoicePaymentData.length
      ) {
        this.ispaymentChecked = false;
      }
    }
  }

  invoicePaymentAdjsment(): void {
    const data = {
      invoiceId: this.invoiceID,
      creditDocumentList: this.allchakedPaymentData
    };

    const url = "/invoicePaymentAdjust";
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        // this.closebutton.nativeElement.click();
        this.ifInvoicePayment = false;
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.isSinglepaymentChecked = false;
        this.invoicePaymentData = [];
        this.allchakedPaymentData = [];
        this.searchinvoiceMaster("", "");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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

  voidInvoice(): void {
    // if (invoice) {
    this.confirmationService.confirm({
      message: "Do you wish to VOID this invoice?",
      header: "VOID Invoice Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        const url = `/voidInvoice?invoiceId=${this.invoiceID}&invoiceCancelRemarks=${this.invoiceCancelRemarks}`;
        this.revenueManagementService.getMethod(url).subscribe(
          (response: any) => {
            // this.closebutton.nativeElement.click();
            this.ifInvoicePayment = false;
            this.ispaymentChecked = false;
            this.allIsChecked = false;
            this.isSinglepaymentChecked = false;
            this.invoiceCancelRemarks = null;
            this.invoiceCancelRemarksType = null;
            this.invoicePaymentData = [];
            this.allchakedPaymentData = [];
            this.searchinvoiceMaster("", "");
            $("#invoiceCancelRemarks").modal("hide");
            this.invoiceCancelRemarksModal = false;
            if (response.responseCode == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
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
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
      }
    });
    // }
  }

  invoiceCancelRemarks = null;
  invoiceCancelRemarksType = null;
  showdata: any = [];

  displayNote() {
    this.showdata = this.invoiceMasterListData.filter(
      invoice => invoice.billrunstatus === "Cancelled" || invoice.billrunstatus === "VOID"
    );
  }

  invoiceRemarks(invoice, type) {
    this.invoiceID = invoice.id;
    this.invoiceCancelRemarksType = type;
    this.invoiceCancelRemarksModal = true;
  }

  addInvoiceRemarks() {
    if (this.invoiceCancelRemarksType === "void") {
      this.voidInvoice();
    } else if (this.invoiceCancelRemarksType === "cancelRegenerate") {
      this.cancelRegenrateInvoice();
    }
  }

  cancelRegenrateInvoice() {
    const data = {};

    const url =
      "/cancelAndRegenerate/" +
      this.invoiceID +
      "?isCaf=false&invoiceCancelRemarks=" +
      this.invoiceCancelRemarks;
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        // this.closebutton.nativeElement.click();
        this.ifInvoicePayment = false;
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.isSinglepaymentChecked = false;
        this.invoiceCancelRemarks = null;
        this.invoiceCancelRemarksType = null;
        this.invoicePaymentData = [];
        this.allchakedPaymentData = [];
        this.searchinvoiceMaster("", "");
        this.invoiceCancelRemarksModal = false;

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
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
  viewInvoice(docnumber, custname) {
    const url = "/regeneratepdfsub/" + docnumber;
    this.invoiceMasterService.downloadPDF(url).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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
  InvoiceReprint(docnumber, custname) {
    const url = "/regeneratepdfsub/" + docnumber;
    this.invoiceMasterService.downloadPDF(url).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        FileSaver.saveAs(file, custname);

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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

  generatePDFInvoice(custId) {
    if (custId) {
      const url = "/generatePdfByInvoiceId/" + custId;
      this.invoiceMasterService.generateMethod(url).subscribe(
        (response: any) => {
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
  }

  closeSelectStaff() {
    this.dialogId = false;
  }

  downloadPDFINvoice(docNo, customerName) {
    if (docNo) {
      const downloadUrl = "/invoicePdf/download/" + docNo;
      this.invoiceMasterService.downloadPDF(downloadUrl).subscribe(
        (response: any) => {
          const file = new Blob([response], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          FileSaver.saveAs(file, customerName + docNo);
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
    // const url = "/customers/list";
    const url =
      `/customers/list/` +
      RadiusConstants.CUSTOMER_TYPE.POSTPAID +
      "?orgcusttype=false&mvnoId=" +
      localStorage.getItem("mvnoId");
    this.invoiceMasterService.postMethod(url, data).subscribe(
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
    this.newFirst = 1;
    this.selectedParentCust = [];
    //  console.log("this.newFirst2", this.newFirst)
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

    this.searchInvoiceMasterFormGroup.patchValue({
      customerid: Number(this.selectedParentCust.id)
    });
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
  }

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  searchParentCustomer() {
    // this.currentPageParentCustomerListdata = 1;
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
      "/customers/search/" +
      RadiusConstants.CUSTOMER_TYPE.POSTPAID +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.invoiceMasterService.postMethod(url, searchParentData).subscribe(
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
  }

  sendemailinvoice(docNo) {
    if (docNo) {
      const downloadUrl = "/invoice/send/" + docNo;
      this.customerdetailsilsService.getmethodforrevenue(downloadUrl).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          this.spinner.hide();
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

  modalCloseRemark(){
    this.invoiceCancelRemarksModal = false;
  }
  // ......................
}
