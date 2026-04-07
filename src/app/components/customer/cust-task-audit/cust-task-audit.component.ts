import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ActivatedRoute, Router } from "@angular/router";
import { TaskManagementService } from "src/app/service/task-management.service";
@Component({
  selector: "app-cust-task-audit",
  templateUrl: "./cust-task-audit.component.html",
  styleUrls: ["./cust-task-audit.component.css"]
})
export class CustTaskAuditComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  pageNumberForTaskAuditPage = 1;
  pageSizeForTaskAuditPage = RadiusConstants.ITEMS_PER_PAGE;
  taskAuditList: any = [];
  taskAuditTotalRecords: number;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  custData: any = {};
  taskDetailsData: any = {};
  isTaskDetail: boolean = false;

  constructor(
    private messageService: MessageService,
    public datePipe: DatePipe,
    private taskManagementService: TaskManagementService,
    private customerManagementService: CustomermanagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
  }

  ngOnInit(): void {
    this.getCustomersDetail(this.customerId);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      this.getChildCustomers();
    });
  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getChildCustomers() {
    const url = `/case/casehistory?customerId=${this.customerId}`;
    const data = {
      page: this.pageNumberForTaskAuditPage,
      pageSize: this.pageSizeForTaskAuditPage
    };
    this.taskManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.taskAuditList = response.dataList;
        this.taskAuditTotalRecords = response.totalRecords;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangeEventForChildCustomers(pageNumber: number) {
    this.pageNumberForTaskAuditPage = pageNumber;
    this.getChildCustomers();
  }

  itemPerPageChangeEvent(event) {
    this.pageSizeForTaskAuditPage = Number(event.value);
    this.getChildCustomers();
  }

  getTaskDetails(ticketId) {
    const url = "/case/" + ticketId;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.taskDetailsData = response.data;
        this.isTaskDetail = true;
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

  closeTaskDetail() {
    this.isTaskDetail = false;
  }
}
