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
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";

@Component({
  selector: "app-trial-bill",
  templateUrl: "./trial-bill.component.html",
  styleUrls: ["./trial-bill.component.css"]
})
export class TrialBillComponent implements OnInit {
  searchtrailBillFormGroup: FormGroup;

  trailBillCategoryList: any;
  trailBillListData: any = [];
  viewtrailBillListData: any = [];
  searchtrailBillUrl: any;

  currentPagetrailBillSlab = 1;
  trailBillitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  trailBilltotalRecords: String;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchTrialBillData: any;
  isInvoiceSearch: boolean = false;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private trailBillService: InvoiceMasterService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.searchtrailBillFormGroup = this.fb.group({
      billfromdate: [""],
      billrunid: [""],
      billtodate: [""],
      billrunstatus: [""]
    });

    this.commondropdownService.getBillRunMasterList();
  }

  pageChangedtrailBillList(pageNumber) {
    this.currentPagetrailBillSlab = pageNumber;
    this.searchtrailBill("");
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagetrailBillSlab > 1) {
      this.currentPagetrailBillSlab = 1;
    }
    this.searchtrailBill(this.showItemPerPage);
  }
  searchtrailBill(size) {
    let page_list;
    if (size) {
      page_list = size;
      this.trailBillitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.trailBillitemsPerPage = this.pageITEM;
      } else {
        this.trailBillitemsPerPage = this.showItemPerPage;
      }
    }
    let searchList = [];
    let url;

    this.spinner.show();
    if (this.searchtrailBillFormGroup.value) {
      if (this.searchtrailBillFormGroup.value.billrunid) {
        searchList.push(`billrunid=${this.searchtrailBillFormGroup.value.billrunid}`);
      }
      if (this.searchtrailBillFormGroup.value.billrunstatus) {
        searchList.push(`billrunstatus=${this.searchtrailBillFormGroup.value.billrunstatus}`);
      }
      if (this.searchtrailBillFormGroup.value.billfromdate) {
        searchList.push(`billfromdate=${this.searchtrailBillFormGroup.value.billfromdate}`);
      }
      if (this.searchtrailBillFormGroup.value.billtodate) {
        searchList.push(`billtodate=${this.searchtrailBillFormGroup.value.billtodate}`);
      }
      if (searchList.length > 0) {
        url = `/trial/billrun/search?${searchList.join("&")}`;
      } else {
        url = "/trial/billrun/search";
      }
    }

    this.spinner.show();
    this.trailBillService.getMethod(url).subscribe(
      (response: any) => {
        this.searchTrialBillData = response.trialBillRunList;
        this.isInvoiceSearch = true;
        this.spinner.hide();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
        this.spinner.hide();
      }
    );
  }

  clearSearchtrailBill() {
    this.isInvoiceSearch = false;
    this.searchTrialBillData = [];
    this.searchtrailBillFormGroup.reset();
    this.searchtrailBillFormGroup.controls.billrunid.setValue("");
    this.searchtrailBillFormGroup.controls.billrunstatus.setValue("");
    this.searchtrailBillFormGroup.controls.billfromdate.setValue("");
    this.searchtrailBillFormGroup.controls.billtodate.setValue("");
  }

  generatePDF(trialBillRunMasterId) {
    if (trialBillRunMasterId) {
      this.spinner.show();
      const url = "/trialbillingprocess/generatepdf/" + trialBillRunMasterId;
      this.trailBillService.generateMethod(url).subscribe(
        (response: any) => {
          this.searchtrailBill("");
          this.spinner.hide();
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
          this.spinner.hide();
        }
      );
    }
  }
}
