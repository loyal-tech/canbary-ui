import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerDetailsService } from "src/app/service/customer-details.service";
import { BehaviorSubject } from "rxjs";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import * as FileSaver from "file-saver";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";

declare var $: any;

@Component({
  selector: "app-trial-invoice",
  templateUrl: "./trial-invoice.component.html",
  styleUrls: ["./trial-invoice.component.css"]
})
export class TrialInvoiceComponent implements OnInit {
  billrunid: any = "";
  docnumber: any = "";
  custName: any = "";
  custMobile: any = "";
  billfromdate: any = "";
  billtodate: any = "";
  customerid: any = "";
  isTrialInvoiceSearch: boolean = false;
  trialInvoiceListData: any;
  customerListData: any;
  currentPagecustomerListdata = 1;

  currentPageinvoiceMasterSlab = 1;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMastertotalRecords: String;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  isInvoiceDetail = false;
  custID: number;
  invoiceID = "";

  custId = new BehaviorSubject({
    custId: ""
  });

  InvoiceDATA = new BehaviorSubject({
    InvoiceDATA: ""
  });
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  dialogId: boolean = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private trailinvoiceService: InvoiceMasterService,
    private customerDetailsService: CustomerDetailsService,
    private invoiceDetailsService: InvoiceDetailsService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
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
    // this.getcustomerList()
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageinvoiceMasterSlab > 1) {
      this.currentPageinvoiceMasterSlab = 1;
    }
    this.searchTrialInvoice(this.showItemPerPage);
  }

  searchTrialInvoice(size) {
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

    const url =
      "/trial/invoice/search?billrunid=" +
      this.billrunid +
      "&docnumber=" +
      this.docnumber.trim() +
      "&customerid=" +
      this.customerid +
      "&billfromdate=" +
      this.billfromdate +
      "&billtodate=" +
      this.billtodate +
      "&custmobile=" +
      this.custMobile.trim();
    const data = {
      page: this.currentPagecustomerListdata,
      pageSize: this.invoiceMasteritemsPerPage
    };
    // const url = "/trial/invoice/search";
    // const data = {
    //   billrunid: this.billrunid,
    //   docnumber: this.docnumber.trim(),
    //   customerid: this.customerid,
    //   billfromdate: this.billfromdate,
    //   billtodate: this.billtodate,
    //   custmobile: this.custMobile.trim(),
    // };
    this.trailinvoiceService.updateMethod(url, data).subscribe(
      (response: any) => {
        this.trialInvoiceListData = response.dataList;

        this.isTrialInvoiceSearch = true;
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

  clearTrialInvoice() {
    this.isTrialInvoiceSearch = false;
    this.billrunid = "";
    this.docnumber = "";
    this.custName = "";
    this.custMobile = "";
    this.billfromdate = "";
    this.billtodate = "";
    this.customerid = "";
  }

  getcustomerList() {
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    let custerlist = {
      page: this.currentPagecustomerListdata,
      pageSize: 10000
    };
    this.trailinvoiceService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerListData = response.customerList;
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

  pageChangedinvoiceMasterList(pageNumber) {
    this.currentPageinvoiceMasterSlab = pageNumber;
    this.searchTrialInvoice("");
  }

  openCustomerModal(id, custId) {
    this.customerDetailsService.show(id);
    this.custId.next({
      custId: custId
    });
  }

  openInvoiceModal(invoice) {
    // this.invoiceDetailsService.show(id);
    this.isInvoiceDetail = true;
    this.invoiceID = invoice.id;
    this.custID = invoice.custid;
  }
  closeInvoiceDetails() {
    this.isInvoiceDetail = false;
    this.invoiceID = "";
    this.custID = 0;
  }

  downloadPDF(docNo) {
    if (docNo) {
      const downloadUrl = "/trialbillingprocess/download/" + docNo;
      this.trailinvoiceService.downloadPDF(downloadUrl).subscribe(
        (response: any) => {
          var file = new Blob([response], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
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
    this.trailinvoiceService.postMethod(url, data).subscribe(
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

  openModal(id, custId) {
    this.dialogId = true;
    this.custId.next({
      custId: custId
    });
  }

  closeSelectStaff() {
    this.dialogId = false;
  }
  selectParentCustomer: boolean = false;
  async modalOpenParentCustomer() {
    this.selectParentCustomer = true;
    // $("#selectParentCustomer").modal("show");
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
    this.trailinvoiceService.postMethod(url, searchParentData).subscribe(
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

  // ......................
}
