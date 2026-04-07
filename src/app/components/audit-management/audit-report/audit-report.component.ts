import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { CustomerService } from "src/app/service/customer.service";
import { IntegrationAuditService } from "src/app/service/integration-audit.service";
import { PartnerService } from "src/app/service/partner.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AuditReportService } from "src/app/service/audit-report.service";

@Component({
  selector: "app-audit-report",
  templateUrl: "./audit-report.component.html",
  styleUrls: ["./audit-report.component.css"]
})
export class AuditReportComponent implements OnInit {
  auditData: any = [];
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  //   searchOptionSelect = this.commondropdownService.radiusSearchOptionBill;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any = 5;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  viewAccess: any;
  isViewDetails: boolean = false;
  detailsHeader: any;
  detailsBody: any;
  searchkey: string;
  searchView: boolean = true;
  searchName: string;
  searchData: any;
  apiAuditData: any;
  constructor(
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public partnerService: PartnerService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public datepipe: DatePipe,
    // public commondropdownService: CommondropdownService,
    public auditReportService: AuditReportService
  ) {}

  ngOnInit(): void {
    this.getAllAuditData("");
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };
  }

  async getAllAuditData(list) {
    // let size;
    // let page = this.currentPage;
    // if (list) {
    //   size = list;
    //   this.itemsPerPage = list;
    // } else {
    //   size = this.itemsPerPage;
    // }

    let request = {
      page: this.currentPage,
      pageSize: this.itemsPerPage
    };

    this.auditReportService.getAuditData(request).subscribe(
      (response: any) => {
        this.auditData = response.dataList;
        // this.auditData = this.auditData.map(item => {
        //   item.responsePayload = JSON.parse(item.responsePayload);
        //   return item;
        // });

        this.auditData = this.auditData.map(item => {
          item.responsePayload = item.responsePayload.slice(0, item.responsePayload.length);
          return item;
        });
        this.totalRecords = response.totalRecords;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  TotalItemPerPage(event) {
    // this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    this.getAllAuditData(this.showItemPerPage);
  }

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    this.getAllAuditData("");
  }

  openDetailsModel(audit, header) {
    this.isViewDetails = true;
    this.detailsHeader = header;
    try {
      const parsed = typeof audit === "string" ? JSON.parse(audit) : audit;
      this.detailsBody = JSON.stringify(parsed, null, 3);
    } catch (error) {
      this.detailsBody = audit;
    }
  }

  search() {
    this.currentPage = 1;
    this.searchData.filter[0].filterValue = this.searchName ? this.searchName.trim() : "";

    const url = `/search?page=${this.currentPage}&pageSize=${this.itemsPerPage}&sortBy=id&sortOrder=0`;
    this.auditReportService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.auditData = response.dataList;
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
          this.apiAuditData = [];
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
  clearSearch() {
    this.searchName = "";
    this.searchData.filter[0].filterValue = "";
    this.getAllAuditData("");
  }

  formatTimestamp(timestamp: string): string {
    return timestamp.replace("T", " ");
  }
}
