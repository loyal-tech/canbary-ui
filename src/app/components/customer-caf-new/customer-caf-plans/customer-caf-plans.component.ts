import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";

@Component({
  selector: "app-customer-caf-plans",
  templateUrl: "./customer-caf-plans.component.html",
  styleUrls: ["./customer-caf-plans.component.css"]
})
export class CustomerCafPlansComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  customerDetailData: any;
  staffData: any = [];
  staffDetailModal: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  custTrailPlanItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custShowTrailPlanShow = 1;
  TrailPlanList = [];
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  istrialplan: boolean = false;
  currentTrailPlanListdata = 1;
  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCurrentPlanListdatatotalRecords: String;
  currentPagecustomerCurrentPlanListdata = 1;
  CurrentPlanShowItemPerPage = 1;
  custCurrentPlanList: any;
  customerFuturePlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerFuturePlanListdatatotalRecords: String;
  currentPagecustomerFuturePlanListdata = 1;
  futurePlanShowItemPerPage = 1;
  custFuturePlanList: any;
  customerExpiryPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerExpiryPlanListdatatotalRecords: String;
  currentPagecustomerExpiryPlanListdata = 1;
  expiredShowItemPerPage = 1;
  custExpiredPlanList: any;

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
    this.getcustFuturePlan(this.customerId, "");
    this.getcustExpiredPlan(this.customerId, "");
    this.getcustCurrentPlan(this.customerId, "");
    this.getTrailPlanList(this.customerId, "");
  }
  customerDetailOpen() {
    this.router.navigate([
      "/home/customer-caf-new/details/" + this.custType + "/x/" + this.customerId
    ]);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerDetailData = response.customers;
    });
  }

  getTrailPlanList(custId, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.custTrailPlanItemPerPage = size;
    } else {
      if (this.custShowTrailPlanShow == 1) {
        this.custTrailPlanItemPerPage = this.pageITEM;
      } else {
        this.custTrailPlanItemPerPage = this.custShowTrailPlanShow;
      }
    }
    const url = "/getTrialPlanList/" + custId;
    this.customerManagementService.getProtalMethod(url).subscribe(
      (response: any) => {
        this.TrailPlanList = response.dataList;

        if (this.TrailPlanList.length > 0) {
          this.istrialplan = true;
        }
        this.custTrailPlanItemPerPage = this.TrailPlanList.length;
        if (this.TrailPlanList.length > 0) {
          this.istrialplan = true;
        }
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageCustTrailPlanListData(pageNumber) {
    this.currentTrailPlanListdata = pageNumber;
    this.getTrailPlanList(this.customerDetailData.id, "");
  }

  TotalTrailPlanItemPerPage(event) {
    this.custShowTrailPlanShow = Number(event.value);
    if (this.currentTrailPlanListdata > 1) {
      this.currentTrailPlanListdata = 1;
    }
    this.getTrailPlanList(this.customerDetailData.id, this.custShowTrailPlanShow);
  }

  getcustCurrentPlan(custId, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.customerCurrentPlanListdataitemsPerPage = size;
    } else {
      if (this.CurrentPlanShowItemPerPage == 1) {
        this.customerCurrentPlanListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerCurrentPlanListdataitemsPerPage = this.CurrentPlanShowItemPerPage;
      }
    }
    this.custCurrentPlanList = [];

    const url = "/subscriber/getActivePlanList/" + custId + "?isNotChangePlan=true";
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custCurrentPlanList = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedcustomerCurrentPlanListData(pageNumber) {
    this.currentPagecustomerCurrentPlanListdata = pageNumber;
    this.getcustCurrentPlan(this.customerDetailData.id, "");
  }

  TotalCurrentPlanItemPerPage(event) {
    this.CurrentPlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerCurrentPlanListdata > 1) {
      this.currentPagecustomerCurrentPlanListdata = 1;
    }
    this.getcustCurrentPlan(this.customerDetailData.id, this.CurrentPlanShowItemPerPage);
  }

  getcustFuturePlan(custId, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.customerFuturePlanListdataitemsPerPage = size;
    } else {
      if (this.futurePlanShowItemPerPage == 1) {
        this.customerFuturePlanListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerFuturePlanListdataitemsPerPage = this.futurePlanShowItemPerPage;
      }
    }

    const url = "/subscriber/getFuturePlanList/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custFuturePlanList = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedcustFuturePlanListData(pageNumber) {
    this.currentPagecustomerFuturePlanListdata = pageNumber;
    this.getcustFuturePlan(this.customerDetailData.id, "");
  }

  TotalFuturePlanItemPerPage(event) {
    this.futurePlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerFuturePlanListdata > 1) {
      this.currentPagecustomerFuturePlanListdata = 1;
    }
    this.getcustFuturePlan(this.customerDetailData.id, this.futurePlanShowItemPerPage);
  }

  getcustExpiredPlan(custId, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.customerExpiryPlanListdataitemsPerPage = size;
    } else {
      if (this.expiredShowItemPerPage == 1) {
        this.customerExpiryPlanListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerExpiryPlanListdataitemsPerPage = this.expiredShowItemPerPage;
      }
    }

    const url = "/subscriber/getExpiredPlanList/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custExpiredPlanList = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedcustomerExpiryPlanListData(pageNumber) {
    this.currentPagecustomerExpiryPlanListdata = pageNumber;
    this.getcustExpiredPlan(this.customerDetailData.id, "");
  }

  TotalExpiredPlanItemPerPage(event) {
    this.expiredShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerExpiryPlanListdata > 1) {
      this.currentPagecustomerExpiryPlanListdata = 1;
    }
    this.getcustExpiredPlan(this.customerDetailData.id, this.expiredShowItemPerPage);
  }
}
