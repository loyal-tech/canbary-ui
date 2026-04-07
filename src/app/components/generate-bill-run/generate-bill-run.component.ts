import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { GenerateBillRunService } from "src/app/service/generate-bill-run.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { DatePipe } from "@angular/common";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
@Component({
  selector: "app-generate-bill-run",
  templateUrl: "./generate-bill-run.component.html",
  styleUrls: ["./generate-bill-run.component.css"]
})
export class GenerateBillRunComponent implements OnInit {
  searchGenerateBillRunFormGroup: FormGroup;
  submitted: boolean = false;
  searchData;
  billRunData: any;
  isGenerateBillSearch: boolean = false;
  AclClassConstants;
  exportInvoicePageChildSlab = 1;
  exportInvoicePerPage = RadiusConstants.ITEMS_PER_PAGE;
  AclConstants;
  public loginService: LoginService;
  maxDate: Date = new Date();
  exportInvoiceAuditList: any;
  exportInvoicetotalRecords: any;
  searchkey: string;
  showItemPerPage: number;
  searchOption: string;
  searchDeatil: string;
  searchkey2: string;
  searchOptions = [{ label: "Status", value: "status" }];
  statusOptions = [
    { label: "Started ", value: "Started" },
    { label: "Pending ", value: "Pending" },
    { label: "Inprogress", value: "Inprogress" },
    { label: "Completed", value: "Completed" },
    { label: "Failed", value: "Failed" }
  ];
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  searchName: string;
  isExportTab: boolean = true;
  activeTabIndex: number = 0;
  searchDataDistibution: any;
  searchDitributionName: any;
  searchDataDistribution: any;
  searchDistribution: string;
  searchOptionDistribution: string;
  searchkeyDistrubution: string;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private generateBillRunService: GenerateBillRunService,
    private datePipe: DatePipe,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.searchGenerateBillRunFormGroup = this.fb.group({
      billGenerateDate: ["", Validators.required]
    });

    this.searchData = {
      filters: [
        {
          filterColumn: "any",
          filterValue: ""
        }
      ],
      page: "",
      pageSize: "",
      sortOrder: "",
      sortBy: "",
      fromDate: "",
      toDate: "",
      status: "",
      filterBy: "Invoice_Export"
    };
    this.searchDataDistribution = {
      filters: [
        {
          filterColumn: "any",
          filterValue: ""
        }
      ],
      page: "",
      pageSize: "",
      sortOrder: "",
      sortBy: "",
      fromDate: "",
      toDate: "",
      status: "",
      filterBy: "Invoice_Distribution"
    };
  }

  async searchBillRun() {
    this.submitted = true;
    if (this.searchGenerateBillRunFormGroup.valid) {
      const Date = this.datePipe.transform(
        this.searchGenerateBillRunFormGroup.controls.billGenerateDate.value,
        "yyyyMMdd"
      );
      const url = "/postPaid/generatebill/" + Date;
      this.generateBillRunService.searchMethod(url).subscribe(
        (response: any) => {
          //  this.billRunData = response.responseObject;
          this.isGenerateBillSearch = true;

          this.clearBillRun();
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
            detail: error.message,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  async earlyBillRun() {
    this.submitted = true;
    if (this.searchGenerateBillRunFormGroup.valid) {
      const Date = this.datePipe.transform(
        this.searchGenerateBillRunFormGroup.controls.billGenerateDate.value,
        "yyyyMMdd"
      );
      const url = "/postPaid/generateEarlybill/" + Date;
      this.generateBillRunService.searchMethod(url).subscribe(
        (response: any) => {
          //  this.billRunData = response.responseObject;
          this.isGenerateBillSearch = true;

          this.clearBillRun();
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
            detail: error.message,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  async clearBillRun() {
    this.submitted = false;
    this.isGenerateBillSearch = false;
    this.searchGenerateBillRunFormGroup.controls.billGenerateDate.setValue("");
  }

  generateExportDistribution() {
    const url = "/sendBulkInvoiceNotication";
    this.generateBillRunService.generateExport(url).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        this.clearDistributionInvoiceAuditSearch();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.message,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  generateExport() {
    const url = "/generateBulkInvoicePdf";
    this.generateBillRunService.generateExport(url).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        this.clearExportInvoiceAuditSearch();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.message,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getAllexportinvoiceaudit(list: any) {
    let page = this.exportInvoicePageChildSlab;
    if (list) {
      this.exportInvoicePerPage = list;
    }
    let size = this.exportInvoicePerPage;
    this.searchkey = "";
    const url = `/getAllexportinvoiceaudit?page=${page}&pageSize=${size}&isExport=${this.isExportTab}`;
    this.generateBillRunService.get(url).subscribe(
      (response: any) => {
        this.exportInvoiceAuditList = response.exportinvoiceaudit.content;
        this.exportInvoicetotalRecords = response.exportinvoiceaudit?.totalElements || 0;
      },
      (error: any) => {
         if (error?.status === 400) {
         this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: error.error?.ERROR || "Something went wrong.",
          icon: "far fa-times-circle"
        });
     }else{
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.ERROR || "Something went wrong.",
          icon: "far fa-times-circle"
        });
     }
       
      }
    );
  }

  pageChangedInvoiceExport(pageNumber) {
    this.exportInvoicePageChildSlab = pageNumber;
    if (this.searchkey) {
      this.searchExportInvoiceAudit();
    } else {
      this.getAllexportinvoiceaudit("");
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.exportInvoicePageChildSlab > 1) {
      this.exportInvoicePageChildSlab = 1;
    }
    if (!this.searchkey) {
      this.getAllexportinvoiceaudit(this.showItemPerPage);
    } else {
      this.searchExportInvoiceAudit();
    }
  }

  searchExportInvoiceAudit() {
    if (!this.searchData.filters || this.searchData.filters.length === 0) {
      this.searchData.filters = [{ filterValue: "", filterColumn: "" }];
    }
    if (this.searchOption === "status") {
      this.searchData.filters[0].filterValue = this.searchName;
      this.searchData.filters[0].filterColumn = "status";
    } else {
      this.searchData.filters[0].filterValue = null;
      this.searchData.filters[0].filterColumn = null;
    }
    this.searchData.fromDate = this.searchData.fromDate
      ? this.datePipe.transform(this.searchData.fromDate, "yyyy-MM-dd")
      : null;
    this.searchData.toDate = this.searchData.toDate
      ? this.datePipe.transform(this.searchData.toDate, "yyyy-MM-dd")
      : null;
    this.searchData.filterBy = "Invoice_Export";
    this.searchData.page = this.exportInvoicePageChildSlab;
    this.searchData.pageSize = this.exportInvoicePerPage;
    const url = "/getsearchexportinvoiceaudit";
    this.generateBillRunService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response?.exportinvoiceaudit?.content?.length === 0) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No data found.",
            icon: "far fa-times-circle"
          });
          this.exportInvoiceAuditList = [];
          this.exportInvoicetotalRecords = 0;
        } else {
          this.exportInvoiceAuditList = response.exportinvoiceaudit.content;
          this.exportInvoicetotalRecords = response.exportinvoiceaudit.totalElements;
        }
      },
      (error: any) => {
        this.exportInvoicetotalRecords = 0;
        this.exportInvoiceAuditList = [];
        if(error.status === 400){
         this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: error.error?.ERROR || "Something went wrong",
          icon: "far fa-times-circle"
        });
        }
        else{
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.ERROR || "Something went wrong",
          icon: "far fa-times-circle"
        });
}
       
      }
    );
  }
  clearExportInvoiceAuditSearch() {
    this.searchName = "";
    this.searchOption = "";
    this.searchData = {
      filters: [
        {
          filterColumn: "any",
          filterValue: ""
        }
      ],
      page: "",
      pageSize: "",
      sortOrder: "",
      sortBy: "",
      fromDate: "",
      toDate: "",
      status: "",
      filterBy: ""
    };
    this.searchkey = "";
    this.searchkey2 = "";
    this.exportInvoiceAuditList = [];
    this.exportInvoicetotalRecords = 0;
    this.exportInvoicePageChildSlab = 1;
    this.getAllexportinvoiceaudit("");
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    if (this.activeTabIndex == 1) {
      this.isExportTab = true;
      this.clearExportInvoiceAuditSearch();
    } else if (this.activeTabIndex == 2) {
      this.isExportTab = false;
      this.clearDistributionInvoiceAuditSearch();
    }
  }

  searchDistributionInvoiceAudit() {
    if (!this.searchDataDistribution.filters || this.searchDataDistribution.filters.length === 0) {
      this.searchDataDistribution.filters = [{ filterValue: "", filterColumn: "" }];
    }
    if (this.searchOptionDistribution === "status") {
      this.searchDataDistribution.filters[0].filterValue = this.searchDistribution;
      this.searchDataDistribution.filters[0].filterColumn = "status";
    } else {
      this.searchDataDistribution.filters[0].filterValue = null;
      this.searchDataDistribution.filters[0].filterColumn = null;
    }
    // Format date range
    this.searchDataDistribution.fromDate = this.searchDataDistribution.fromDate
      ? this.datePipe.transform(this.searchDataDistribution.fromDate, "yyyy-MM-dd")
      : null;
    this.searchDataDistribution.toDate = this.searchDataDistribution.toDate
      ? this.datePipe.transform(this.searchDataDistribution.toDate, "yyyy-MM-dd")
      : null;
    this.searchDataDistribution.filterBy = "Invoice_Distribution";
    this.searchDataDistribution.page = this.exportInvoicePageChildSlab;
    this.searchDataDistribution.pageSize = this.exportInvoicePerPage;
    const url = "/getsearchexportinvoiceaudit";
    this.generateBillRunService.postMethod(url, this.searchDataDistribution).subscribe(
      (response: any) => {
        if (response?.exportinvoiceaudit?.content?.length === 0) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No data found.",
            icon: "far fa-times-circle"
          });
          this.exportInvoiceAuditList = [];
          this.exportInvoicetotalRecords = 0;
        } else {
          this.exportInvoiceAuditList = response.exportinvoiceaudit.content;
          this.exportInvoicetotalRecords = response.exportinvoiceaudit.totalElements;
        }
      },
      (error: any) => {
        this.exportInvoicetotalRecords = 0;
        this.exportInvoiceAuditList = [];
         if(error.status === 400){
         this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: error.error?.ERROR || "Something went wrong",
          icon: "far fa-times-circle"
        });
        }
        else{
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.ERROR || "Something went wrong",
          icon: "far fa-times-circle"
        });
}
       
      }
    );
  }

  clearDistributionInvoiceAuditSearch() {
    this.searchDistribution = "";
    this.searchOptionDistribution = "";
    this.searchDataDistribution = {
      filters: [
        {
          filterColumn: "any",
          filterValue: ""
        }
      ],
      page: "",
      pageSize: "",
      sortOrder: "",
      sortBy: "",
      fromDate: "",
      toDate: "",
      status: "",
      filterBy: ""
    };
    this.searchkeyDistrubution = "";
    this.searchkey2 = "";
    this.exportInvoiceAuditList = [];
    this.exportInvoicetotalRecords = 0;
    this.exportInvoicePageChildSlab = 1;
    this.getAllexportinvoiceaudit("");
  }
}
