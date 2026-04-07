import { Component, OnInit } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { TacacsDeviceGroupService } from "src/app/service/tacacs-device-group.service";

@Component({
  selector: "app-tacacs-authentication-audit",
  templateUrl: "./tacacs-authentication-audit.component.html",
  styleUrls: ["./tacacs-authentication-audit.component.css"],
})
export class TacacsAuthenticationAuditComponent implements OnInit {
  title = "Tacacs";
  currentPageAuditlogListdata = 1;
  AuditlogListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  AuditlogListdatatotalRecords: any;
  AuditlogListData: any = [];
  viewAuditlogListData: any = [];
  searchAuditlogUrl: any;
  bodyType = "";
  dataMessage = "";
  deviceGroup = "";
  deviceIp = "";
  endTime = "";
  eventTime = "";
  packetType = "";
  replyMessage = "";
  startTime = "";
  username = "";
  searchData: any;
  searchKey: any;
  AuditlogCategoryList: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private AuditlogService: TacacsDeviceGroupService
  ) {}

  ngOnInit(): void {
    this.searchData = {
      filters: [
        {
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      bodyType: "",
      dataMessage: "",
      deviceGroup: "",
      deviceIp: "",
      endTime: "",
      eventTime: "",
      packetType: "",
      replyMessage: "",
      startTime: "",
      username: "",
      page: "",
      pageSize: "",
    };
    this.getAuditlogList("");
  }

  getAuditlogList(list) {
    this.searchkey = "";
    const url = "/tacacs-authentication-audit/get-authentication-audits";
    let size;
    let pageList = this.currentPageAuditlogListdata - 1;
    if (list) {
      size = list;
      this.AuditlogListdataitemsPerPage = list;
    } else {
      size = this.AuditlogListdataitemsPerPage;
    }

    let plandata = {
      page: pageList,
      pageSize: size,
    };

    this.AuditlogService.getMethod(url, { params: plandata }).subscribe(
      (response: any) => {
        this.AuditlogListData = response.data["Authenticate-Audit"].content;
        this.AuditlogListdatatotalRecords = response.data["Authenticate-Audit"].totalElements;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.message,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  searchAuditlog() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPageAuditlogListdata = 1;
    }
    if (this.showItemPerPage) {
      this.AuditlogListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchData.username = this.username;
    this.searchData.packetType = this.packetType;
    this.searchData.bodyType = this.bodyType;
    this.searchData.deviceIp = this.deviceIp;
    this.searchData.deviceGroup = this.deviceGroup;
    this.searchData.replyMessage = this.replyMessage;
    this.searchData.dataMessage = this.dataMessage;
    if (this.startTime) {
      this.searchData.startTime = this.getTheDateFormat(this.startTime);
    }
    if (this.endTime) {
      this.searchData.endTime = this.getTheDateFormat(this.endTime);
    }
    this.searchData.eventTime = this.eventTime;
    this.searchkey = this.searchData;

    this.searchData.page = this.currentPageAuditlogListdata;
    this.searchData.pageSize = this.AuditlogListdataitemsPerPage;
    let url =
      "/tacacs-authentication-audit/search-tacacs-audit?page=" +
      (this.currentPageAuditlogListdata - 1) +
      "&pageSize=" +
      this.AuditlogListdataitemsPerPage;
    this.AuditlogService.searchTax(url, this.searchData).subscribe(
      (response: any) => {
        this.AuditlogListData = response.data["Search-Authenticate-Audit"].content;
        this.AuditlogListdatatotalRecords =
          response.data["Search-Authenticate-Audit"].totalElements;
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.AuditlogListData = [];
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.message,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }
  getTheDateFormat(dateString: string): string {
    let event = new Date(dateString);
    let ye = event.getFullYear();
    let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(event);
    let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(event);
    let hr = String(event.getHours()).padStart(2, "0");
    let mn = String(event.getMinutes()).padStart(2, "0");
    let sc = String(event.getSeconds()).padStart(2, "0");
    let fDate = `${ye}-${mo}-${da}T${hr}:${mn}:${sc}`;
    return fDate;
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAuditlogListdata > 1) {
      this.currentPageAuditlogListdata = 1;
    }
    if (!this.searchkey) {
      this.getAuditlogList(this.showItemPerPage);
    } else {
      this.searchAuditlog();
    }
  }

  pageChangedAuditlogList(pageNumber) {
    this.currentPageAuditlogListdata = pageNumber;
    if (!this.searchkey) {
      this.getAuditlogList("");
    } else {
      this.searchAuditlog();
    }
  }
  clearSearchAuditlog() {
    this.username = "";
    this.bodyType = "";
    this.dataMessage = "";
    this.deviceGroup = "";
    this.deviceIp = "";
    this.endTime = "";
    this.packetType = "";
    this.replyMessage = "";
    this.startTime = "";
    this.eventTime = "";
    this.getAuditlogList("");
  }
}
