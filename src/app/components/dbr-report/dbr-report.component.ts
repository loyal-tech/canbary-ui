import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { DbrService } from "src/app/service/dbr.service";
import { DatePipe } from "@angular/common";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
@Component({
  selector: "app-dbr-report",
  templateUrl: "./dbr-report.component.html",
  styleUrls: ["./dbr-report.component.css"],
})
export class DbrReportComponent implements OnInit {
  public loginService: LoginService;
  AclClassConstants;
  AclConstants;

  searchType: any = "";
  searchFormDate: any = "";
  searchEndDate: any = "";
  searchStartMonth: any = "";
  searchEndMonth: any = "";
  searchTypeList: any = [
    { label: "Date", value: "Date" },
    { label: "Month", value: "Month" },
  ];
  isDateRangeShow: boolean = false;
  isMonthShow: boolean = false;
  dbrListData: any = [];
  currentPageDBRListdata = 1;
  DBRListdataitemsPerPage = 20;
  DBRListdatatotalRecords: any;
  titleText: string = "Daywise";
  gridDateDisplay: boolean = true;
  gridMonthDisplay: boolean = false;
  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private revenueManagementService: RevenueManagementService,
    private dbrService: DbrService,
    private datePipe: DatePipe,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.searchDBR();
  }

  getSearchType(event) {
    this.searchFormDate = "";
    this.searchEndDate = "";
    this.searchStartMonth = "";
    const selSearchTypeVal = event.value;
    if (selSearchTypeVal == "Date") {
      this.isDateRangeShow = true;
      this.isMonthShow = false;
    } else {
      this.isDateRangeShow = false;
      this.isMonthShow = true;
    }
  }
  searchDBR() {
    this.currentPageDBRListdata = 1;
    let firstDay;
    let lastDay;
    if (this.searchType != "") {
      if (this.searchStartMonth != "" && this.searchEndMonth != "") {
        this.titleText = "Monthwise";
        let startMonthDate: any = new Date(this.searchStartMonth + "-20");
        let endMonthDate: any = new Date(this.searchEndMonth + "-20");
        firstDay = this.datePipe.transform(
          new Date(startMonthDate.getFullYear(), startMonthDate.getMonth(), 1),
          "yyyy-MM-dd"
        );
        lastDay = this.datePipe.transform(
          new Date(endMonthDate.getFullYear(), endMonthDate.getMonth() + 1, 0),
          "yyyy-MM-dd"
        );

        this.monthWiseDBR(firstDay, lastDay);
      } else if (this.searchFormDate != "" && this.searchEndDate != "") {
        this.titleText = "Daywise";
        firstDay = this.searchFormDate;
        lastDay = this.searchEndDate;
        this.dayWiseDBR(firstDay, lastDay);
      } else if (
        (this.searchStartMonth == "" || this.searchEndMonth == "") &&
        this.searchType == "Month"
      ) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please select Month",
          icon: "far fa-times-circle",
        });
        return;
      } else if (this.searchFormDate == "" || this.searchEndDate == "") {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please select Date",
          icon: "far fa-times-circle",
        });
        return;
      }
    } else {
      this.titleText = "Daywise";
      const now = new Date();
      lastDay = this.datePipe.transform(now, "yyyy-MM-dd");
      firstDay = this.datePipe.transform(new Date(now.setDate(now.getDate() - 30)), "yyyy-MM-dd");
      this.dayWiseDBR(firstDay, lastDay);
    }
    // const url = "/monthwisdebr?startdate=" + firstDay + "&endate=" + lastDay;
    //     this.dbrService.getMethod(url).subscribe(
    //       (response: any) => {
    //         this.dbrListData = response;
    //   const res = response;
    //   if (res.dbr.length > 0) {
    //     this.dbrListData = []
    //     res.dbr.forEach((element: any, index) => {
    //        const obj:any = {
    //       dbr: "",
    //       pendingAmount:"",
    //     };
    //       console.log(element);
    //       obj.dbr = res.dbr[index];
    //       obj.pendingAmount = res.PendingAmount[index];
    //       this.dbrListData.push(obj);
    //     });
    //   } else {
    //     this.dbrListData = []
    //  }
    //
    //   },
    //   (error: any) => {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: error.error.errorMessage,
    //       icon: "far fa-times-circle",
    //     });
    //
    //   }
    // );
  }

  dayWiseDBR(firstDay, lastDay) {
    this.gridDateDisplay = true;
    this.gridMonthDisplay = false;
    const url = "/daywisedbr?endate=" + lastDay + "&startdate=" + firstDay;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.dbrListData = response;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  monthWiseDBR(firstDay, lastDay) {
    this.gridDateDisplay = false;
    this.gridMonthDisplay = true;
    const url = "/monthlywisedbr1?endate=" + lastDay + "&startdate=" + firstDay;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.dbrListData = response;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  searchClearDBR() {
    this.searchType = "";
    this.searchFormDate = "";
    this.searchEndDate = "";
    this.searchStartMonth = "";
    this.searchEndMonth = "";
    this.isDateRangeShow = false;
    this.isMonthShow = false;
    this.searchDBR();
  }

  pageChangedDbrList(pageNumber) {
    this.currentPageDBRListdata = pageNumber;
  }
}
