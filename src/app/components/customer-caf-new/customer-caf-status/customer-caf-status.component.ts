import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";

@Component({
  selector: "app-customer-caf-status",
  templateUrl: "./customer-caf-status.component.html",
  styleUrls: ["./customer-caf-status.component.css"]
})
export class CustomerCafStatusComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  customerDetailData: any;
  customerStatusDetail: any;
  workflowAuditData: any = [];
  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: String;
  showItemPerPage = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
  }

  ngOnInit() {
    this.getCustomersDetail(this.customerId);
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer-caf-new/details/" + this.custType + "/x/" + this.customerId]);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerDetailData = response.customers;
      this.getCustomerTeamHierarchy(custId);
      this.getworkflowAuditDetails("", custId, "CAF");
    });
  }

  getCustomerTeamHierarchy(custId) {
    const url = `/teamHierarchy/getApprovalProgress?entityId=${custId}&eventName=CAF`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerStatusDetail = response.dataList;
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
  getworkflowAuditDetails(size, id, name) {
    let page = this.currentPageMasterSlab;
    let page_list;
    if (size) {
      page_list = size;
      this.MasteritemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.MasteritemsPerPage = 5;
      } else {
        this.MasteritemsPerPage = 5;
      }
    }

    this.workflowAuditData = [];

    let data = {
      page: page,
      pageSize: this.MasteritemsPerPage
    };

    let url = "/workflowaudit/list?entityId=" + id + "&eventName=" + name;

    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.workflowAuditData = response.dataList;
        this.MastertotalRecords = response.totalRecords;
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
            icon: "far fa-times-circle"
          });
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

  pageChangedMasterList(pageNumber) {
    this.currentPageMasterSlab = pageNumber;
    this.getworkflowAuditDetails("", this.customerId, "CAF");
  }

  TotalItemPerPageWorkFlow(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageMasterSlab > 1) {
      this.currentPageMasterSlab = 1;
    }
    this.getworkflowAuditDetails(this.showItemPerPage, this.customerId, "CAF");
  }
}
