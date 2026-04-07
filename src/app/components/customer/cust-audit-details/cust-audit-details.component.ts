import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-cust-audit-details",
  templateUrl: "./cust-audit-details.component.html",
  styleUrls: ["./cust-audit-details.component.css"]
})
export class CustAuditDetailsComponent implements OnInit {
  custData: any = {};
  customerId: number;
  custType: string = "";

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  auditData: any = [];
  currentPageAuditSlab1 = 1;
  AudititemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  AudittotalRecords1: number;
  auditList: any = [];
  sortOrder = 0;
  showItemPerPage = 1;
  searchOption: string = "";
  searchData: any;
  searchInput: string = "";
  fromDate = "";
  toDate = "";
  searchOptions = [
    { label: "Employee Name", value: "employeename" },
    { label: "Username", value: "username" },
    { label: "Module", value: "module" },
    { label: "Operation", value: "operation" }
  ];
  remarkDialogVisible: boolean = false;
  selectedRemark: string = "";

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;

    if (history.state.data) this.custData = history.state.data;
    else this.getCustomersDetail(this.customerId);
    this.getAuditData("");

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
      fromDate: "",
      toDate: "",
      sortBy: "id"
    };
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
    });
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getAuditData(size) {
    let page = this.currentPageAuditSlab1;
    let page_list;
    if (size) {
      page_list = size;
      this.AudititemsPerPage1 = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.AudititemsPerPage1 = 5;
      } else {
        this.AudititemsPerPage1 = 5;
      }
    }
    this.auditData = [];

    let data = {
      page: page,
      pageSize: this.AudititemsPerPage1,
      sortBy: "id",
      sortOrder: 0
    };
    const url = "/auditLog/getAuditList/" + this.customerId;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.auditData = response.dataList;
        this.AudittotalRecords1 = response.totalRecords;
        //this.auditList = response.dataList;
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

  pageChangedAuditList(pageNumber) {
    this.currentPageAuditSlab1 = pageNumber;
    if (this.searchOption || this.searchInput || this.fromDate || this.toDate) {
      this.searchAudit();
    } else {
      this.getAuditData(this.AudititemsPerPage1);
    }
  }

  TotalItemPerPageAudit(event) {
    this.showItemPerPage = Number(event.value);
    this.AudititemsPerPage1 = this.showItemPerPage;
    if (this.currentPageAuditSlab1 > 1) {
      this.currentPageAuditSlab1 = 1;
    }
    if (this.searchOption || this.searchInput || this.fromDate || this.toDate) {
      this.searchAudit();
    } else {
      this.getAuditData(this.AudititemsPerPage1);
    }
  }

  searchAudit() {
    if (this.searchOption && this.searchInput) {
      this.searchData.filters[0].filterColumn = this.searchOption;
      this.searchData.filters[0].filterValue = this.searchInput;
    } else {
      this.searchData.filters[0].filterColumn = "any";
      this.searchData.filters[0].filterValue = "";
    }

    this.searchData.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    this.searchData.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    this.searchData.page = this.currentPageAuditSlab1;
    this.searchData.pageSize = this.AudititemsPerPage1;
    this.searchData.sortBy = "id";
    this.searchData.status = "";

    const url = `/auditLog/getSearchAudit/${this.customerId}`;
    this.customerManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response?.auditListData?.length === 0) {
          this.auditData = [];
          this.AudittotalRecords1 = 0;
        } else {
          this.auditData = response.dataList;
          this.AudittotalRecords1 = response.totalRecords;
        }
      },
      (error: any) => {
        this.auditData = [];
        this.AudittotalRecords1 = 0;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.ERROR || "Something went wrong.",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearAuditSearch() {
    this.searchOption = "";
    this.searchInput = "";
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
      filterBy: "",
      fromDate: "",
      toDate: "",
      status: ""
    };
    this.currentPageAuditSlab1 = 1;
    this.showItemPerPage = 5;
    this.AudititemsPerPage1 = 5;
    this.getAuditData(this.AudititemsPerPage1);
  }

  openRemarkDialog(remark: string): void {
    this.selectedRemark = remark;
    this.remarkDialogVisible = true;
  }
}
