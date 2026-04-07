import { url } from "inspector";
import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { CustomerService } from "src/app/service/customer.service";
import { PartnerService } from "src/app/service/partner.service";

@Component({
  selector: "app-net-conf-details",
  templateUrl: "./net-conf-details.component.html",
  styleUrls: ["./net-conf-details.component.css"]
})
export class NetConfDetailsComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));

  customerLedgerDetailData: any;
  customerNetworkLocationDetailData: any;
  customerId: number;
  customerBill: "";
  serviceAreaDATA: any;
  presentAdressDATA = [];
  permentAdressDATA = [];
  paymentAdressDATA = [];
  partnerDATA = [];
  chargeDATA = [];
  mvnoId;
  customerPopName: any = "";
  customerAddress: any;
  macList: string = "";
  locationList: string = "";
  isParentLocation: string = "NO";
  ifIndividualPlan = true;
  ifPlanGroup = false;
  planGroupName: any = [];
  dataPlan: any = [];

  constructor(
    private customerService: CustomerService,
    private partnerService: PartnerService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private route: ActivatedRoute,
    public statusCheckService: StatusCheckService,
    private router: Router
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("custId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.mvnoId = localStorage.getItem("mvnoId");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.getCustomersDetail(this.customerId);

    this.getCustomerNetworkLocationDetail(this.customerId);
  }

  listCustomer() {
    this.router.navigate(["/home/net-Conf/list"]);
  }

  getCustomersDetail(custId) {
    this.presentAdressDATA = [];
    this.permentAdressDATA = [];
    this.paymentAdressDATA = [];
    this.partnerDATA = [];
    this.chargeDATA = [];
    let plandatalength = 0;

    const url = "/customer/customerById?custid=" + custId + "&mvnoId=" + this.mvnoId;
    this.customerManagementService.getByIdMethodForNetConf(url).subscribe(
      (response: any) => {
        this.customerLedgerDetailData = response.customer;

        //partner Name
        if (this.customerLedgerDetailData.partner) {
          let partnerurl = "/partner/" + Number(this.customerLedgerDetailData.partner);
          this.partnerService.getMethodNew(partnerurl).subscribe((response: any) => {
            this.partnerDATA = response.partnerlist.name;

            // console.log("partnerDATA", this.partnerDATA);
          });
        }

        //serviceArea Name
        if (this.customerLedgerDetailData.servicearea) {
          let serviceareaurl = "/serviceArea/" + Number(this.customerLedgerDetailData.servicearea);
          this.adoptCommonBaseService.get(serviceareaurl).subscribe((response: any) => {
            this.serviceAreaDATA = response.data.name;

            // console.log("partnerDATA", this.serviceAreaDATA);
          });
        }

        if (this.customerLedgerDetailData.plangroupid) {
          this.ifIndividualPlan = false;
          this.ifPlanGroup = true;
          //plan group
          let planGroupurl =
            "/findPlanGroupById?planGroupId=" +
            this.customerLedgerDetailData.plangroupid +
            "&mvnoId=" +
            localStorage.getItem("mvnoId");

          this.customerManagementService.getMethod(planGroupurl).subscribe((response: any) => {
            this.planGroupName = response.planGroup.planGroupName;
          });
        } else {
          this.ifIndividualPlan = true;
          this.ifPlanGroup = false;
          //plan detials
          while (plandatalength < this.customerLedgerDetailData.planMappingList.length) {
            let planurl =
              "/postpaidplan/" +
              this.customerLedgerDetailData.planMappingList[plandatalength].planId +
              "?mvnoId=" +
              localStorage.getItem("mvnoId");
            this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
              this.dataPlan.push(response.postPaidPlan.name);
            });
            plandatalength++;
          }
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

  getCustomerNetworkLocationDetail(custId) {
    if (this.statusCheckService.isActiveInventoryService) {
      const url = `/customer/getCustNetworkDetail?customerId=${custId}`;
      this.customerManagementService.getCustNetworkLocDetail(url).subscribe(
        (response: any) => {
          this.customerNetworkLocationDetailData = response.data;
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
  }
}
