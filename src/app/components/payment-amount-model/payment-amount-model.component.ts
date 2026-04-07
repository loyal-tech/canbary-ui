import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-payment-amount-model",
  templateUrl: "./payment-amount-model.component.html",
  styleUrls: ["./payment-amount-model.component.css"]
})
export class PaymentAmountModelComponent implements OnInit {
  @Input() dialogId: string;
  @Input() paymentId: Observable<any>;
  @Input() currency: string;
  @Output() closeParentCustt = new EventEmitter();
  viewPaymentListData: any;

  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: number;
  customerId: number;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  PaymentList: any = [];
  paymentID: any = "";
  totaladjustedAmount = 0;
  displayInvoiceDetails: boolean = false;
  customerLedgerDetailData: any;
  presentFullAddress: any;
  presentAdressDATA: any;

  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private revenueManagementService: RevenueManagementService,
    private billRunMasterService: BillRunMasterService,
    private customerManagementService: CustomermanagementService,
    public commondropdownService: CommondropdownService,
    public customerdetailsilsService: CustomerdetailsilsService,
    private systemService: SystemconfigService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.displayInvoiceDetails = true;
    this.paymentId.subscribe(value => {
      if (value.paymentId) {
        this.paymentID = value.paymentId;
        this.getpaymentDetail("");
      }
    });
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.getCustomersDetail(this.customerId);
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageMasterSlab > 1) {
      this.currentPageMasterSlab = 1;
    }
    this.getpaymentDetail(this.showItemPerPage);
  }

  getpaymentDetail(size) {
    let page_list;
    if (size) {
      page_list = size;
      this.MasteritemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.MasteritemsPerPage = this.pageITEM;
      } else {
        this.MasteritemsPerPage = this.showItemPerPage;
      }
    }
    this.totaladjustedAmount = 0;
    this.PaymentList = [];

    let url = "/invoicemapping/" + this.paymentID;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.PaymentList = response.Invoicelist;

        this.PaymentList.forEach((value, index) => {
          this.totaladjustedAmount =
            this.totaladjustedAmount + Number(this.PaymentList[index].adjustedAmount);
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

  pageChangedMasterList(pageNumber) {
    this.currentPageMasterSlab = pageNumber;
    this.getpaymentDetail("");
  }

  closeDisplayInvoiceDetails() {
    this.closeParentCustt.emit();
    this.displayInvoiceDetails = false;
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
