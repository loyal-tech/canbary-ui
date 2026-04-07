import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import * as moment from "moment";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";

declare var $: any;

@Component({
  selector: "app-invoice-detalis-model",
  templateUrl: "./invoice-detalis-model.component.html",
  styleUrls: ["./invoice-detalis-model.component.css"]
})
export class InvoiceDetalisModelComponent implements OnInit {
  @Input() dialogId: string;
  @Input() invoiceID: any;
  @Input() custID: any;
  @Input() sourceType: any;
  @Input() customerLedgerDetailData: any;
  @Input() InvoiceDATA: Observable<any>;
  @Output() closeInvoiceDetails = new EventEmitter();
  viewbillInvoiceListData: any = {};
  documentDetailId: any = [];
  viewbillInvoiceInventoryListData: any = [];
  debitDocDetails: any = [];
  debitDocumentTAXRels: any = [];
  debitDocumentTAXRelDtos: any = [];
  taxData: any = [];
  taxtype: string = "";
  showInventory: boolean;
  promiseToPay: boolean = false;
  displayInvoiceMasterDetails: boolean = false;
  displayTaxDetails: boolean = false;
  installmentInterestExists: boolean = false;
    presentFullAddress: any;
    presentAdressDATA: any;
    currency: any;

  constructor(
    private customerManagementService: CustomermanagementService,
    private invoiceDetailsService: InvoiceDetailsService,
    private revenueManagementService: RevenueManagementService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private billRunMasterService: BillRunMasterService,
    public commondropdownService: CommondropdownService,
    public customerdetailsilsService: CustomerdetailsilsService,
    private systemService: SystemconfigService,
    
    
    
  ) {}

  ngOnInit(): void {
    // this.invoiceDetailsService.show("InvoiceDetailModal");
    this.displayInvoiceMasterDetails = true;
    const url = "/invoiceDetails/" + this.invoiceID + "/" + this.custID;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewbillInvoiceListData = response.invoiceDetails;
        this.debitDocDetails = response.debitDocDetails;
        this.installmentInterestExists = this.debitDocDetails?.some(
          item => item.installmentInterest != null
        );

        this.debitDocumentTAXRels = response.debitDocumentTAXRels;
        this.documentDetailId = this.debitDocumentTAXRels.map(item => item.documentDetailId);
        this.debitDocumentTAXRelDtos = response.debitDocumentTAXRelDtos;
        this.viewbillInvoiceInventoryListData =
          this.viewbillInvoiceListData.debitDocumentInventoryRels;
        this.viewbillInvoiceListData.dueDateWithGrace = this.calculateDueDateWithGrace(
          this.viewbillInvoiceListData.duedate,
          this.viewbillInvoiceListData.debitDocGraceDays
        );
        if (this.viewbillInvoiceInventoryListData != null) this.showInventory = true;
        else this.showInventory = false;
        if (this.viewbillInvoiceListData.ispromiseToPayInOldCPR) this.promiseToPay = true;
        else this.promiseToPay = false;
      },
      error => {}
    );
  }

  openTaxModal(documentDetailId: number, type: string): void {
    this.taxtype = type;
    this.taxData = [];

    const specificDetail = this.debitDocumentTAXRels.filter(
      detail => detail.documentDetailId === documentDetailId
    );
    if (this.taxtype === "charge") {
      this.taxData = specificDetail;
    } else {
      this.taxData = this.debitDocumentTAXRels;
    }
    if (this.taxData.length > 0) {
      this.displayTaxDetails = true;
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Tax Data Not Found!",
        icon: "far fa-times-circle"
      });
    }
  }

  closeDisplayTaxDetails() {
    this.displayTaxDetails = false;
  }

  openTotalTaxModal(id, type): void {
    this.taxtype = type;

    this.taxData = this.debitDocumentTAXRelDtos;

    if (this.taxData.length > 0) {
      this.displayTaxDetails = true;
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Tax Data Not Found!",
        icon: "far fa-times-circle"
      });
    }
  }

  close() {
    this.closeInvoiceDetails.emit();
    this.displayInvoiceMasterDetails = false;
  }

  calculateDueDateWithGrace(duedate: string, graceday: number): string {
    if (graceday > 0) {
      return moment(duedate).add(graceday, "days").format("YYYY-MM-DD");
    }
    return moment(duedate).format("YYYY-MM-DD");
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
