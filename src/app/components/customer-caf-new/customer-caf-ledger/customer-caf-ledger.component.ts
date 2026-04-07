import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SystemconfigService } from "src/app/service/systemconfig.service";

@Component({
  selector: "app-customer-caf-ledger",
  templateUrl: "./customer-caf-ledger.component.html",
  styleUrls: ["./customer-caf-ledger.component.css"]
})
export class CustomerCafLedgerComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  customerDetailData: any;
  staffData: any = [];
  staffDetailModal: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  custLedgerForm: FormGroup;
  custLedgerSubmitted = false;
  customerLedgerSearchKey: string;
  currentPagecustLedgerList = 1;
  legershowItemPerPage = 1;
  custLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  postdata: any = {
    CREATE_DATE: "",
    END_DATE: "",
    id: "",
    amount: "",
    balAmount: "",
    custId: "",
    description: "",
    refNo: "",
    transcategory: "",
    transtype: ""
  };
  customerLedgerData: any = {
    custname: "",
    plan: "",
    status: "",
    username: "",
    customerLedgerInfoPojo: {
      openingAmount: "",
      closingBalance: ""
    }
  };
  customerLedgerListData: any;
  currency: any;
  custLedgertotalRecords: String;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public fb: FormBuilder,
    private systemService: SystemconfigService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
  }

  ngOnInit() {
    this.custLedgerForm = this.fb.group({
      startDateCustLedger: ["", Validators.required],
      endDateCustLedger: ["", Validators.required]
    });
    this.getCustomersDetail(this.customerId);
  }
  customerDetailOpen() {
    this.router.navigate([
      "/home/customer-caf-new/details/" + this.custType + "/x/" + this.customerId
    ]);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerDetailData = response.customers;
      this.customerDetailData?.currency
        ? (this.currency = this.customerDetailData?.currency)
        : this.systemService
            .getConfigurationByName("CURRENCY_FOR_PAYMENT")
            .subscribe((res: any) => {
              this.currency = res.data.value;
            });
    });
  }

  searchCustomerLedger() {
    if (
      !this.customerLedgerSearchKey ||
      this.customerLedgerSearchKey !== this.custLedgerForm.value
    ) {
      this.currentPagecustLedgerList = 1;
    }
    this.customerLedgerSearchKey = this.custLedgerForm.value;

    if (this.legershowItemPerPage == 1) {
      this.custLedgerItemPerPage = this.pageITEM;
    } else {
      this.custLedgerItemPerPage = this.legershowItemPerPage;
    }

    this.custLedgerSubmitted = true;
    if (this.custLedgerForm.valid) {
      this.postdata.CREATE_DATE = this.custLedgerForm.controls.startDateCustLedger.value;
      this.postdata.END_DATE = this.custLedgerForm.controls.endDateCustLedger.value;
    }
    this.getCustomersLedger(this.customerDetailData.id, "");
  }

  getCustomersLedger(custId, size) {
    let page_list;
    this.customerLedgerSearchKey = "";
    if (size) {
      page_list = size;
      this.custLedgerItemPerPage = size;
    } else {
      if (this.legershowItemPerPage == 1) {
        this.custLedgerItemPerPage = this.pageITEM;
      } else {
        this.custLedgerItemPerPage = this.legershowItemPerPage;
      }
    }

    const url = "/customerLedgers";
    this.postdata.custId = custId;
    this.customerManagementService.postMethod(url, this.postdata).subscribe(
      (response: any) => {
        this.customerLedgerData = response.customerLedgerDtls;
        this.customerLedgerListData =
          response.customerLedgerDtls.customerLedgerInfoPojo.debitCreditDetail;
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

  clearSearchCustomerLedger() {
    this.postdata.CREATE_DATE = "";
    this.postdata.END_DATE = "";
    this.custLedgerForm.controls.startDateCustLedger.setValue("");
    this.custLedgerForm.controls.endDateCustLedger.setValue("");
    this.custLedgerSubmitted = false;
    this.getCustomersLedger(this.customerDetailData.id, "");
  }

  pageChangedcustledgerList(pageNumber) {
    this.currentPagecustLedgerList = pageNumber;
    this.getCustomersLedger(this.customerDetailData.id, "");
  }

  TotalLedgerItemPerPage(event) {
    this.legershowItemPerPage = Number(event.value);
    if (this.currentPagecustLedgerList > 1) {
      this.currentPagecustLedgerList = 1;
    }
    if (!this.customerLedgerSearchKey) {
      this.getCustomersLedger(this.customerDetailData.id, this.legershowItemPerPage);
    } else {
      this.searchCustomerLedger();
    }
  }
}
