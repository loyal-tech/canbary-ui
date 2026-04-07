import { url } from "inspector";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { StaffService } from "src/app/service/staff.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { AreaManagementService } from "src/app/service/area-management.service";
import { Observable } from "rxjs";
import { LeadManagementService } from "src/app/service/lead-management-service";
import { PartnerService } from "src/app/service/partner.service";

@Component({
  selector: "app-customer-view-details",
  templateUrl: "./customer-view-details.component.html",
  styleUrls: ["./customer-view-details.component.scss"]
})
export class CustomerViewDetailsComponent implements OnInit {
  @Output() closeCustomerViewDetails = new EventEmitter();
  custType: string = "";
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  dialog: boolean = false;
  @Input() custId: string;
  customerLedgerDetailData: any;
  customerNetworkLocationDetailData: any;
  customerId: number;
  customerBill: "";
  serviceAreaDATA: any;
  presentAdressDATA: any = [];
  customerPopName: any = "";
  customerAddress: any;
  macList: string = "";
  locationList: string = "";
  isParentLocation: string = "NO";
  customerInventoryList: any;
  activePlanList: any;
  selectedStaffCust: any;
  paymentHistoryList: any;
  staffUserData: any;
  demographicLabel: any;
  walletValue: number;
  dueValue: number;
  subAreaListDD: any[];
  buildingListDD: any[];
  buildingNoDD: any[];
  presentSubAreaAdressDATA: any = [];
  framedIpAddress: any;
  @Input() sourceType: "customer" | "lead" | "caf" = "customer";
  partnerDATA: any;

  constructor(
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private route: ActivatedRoute,
    public statusCheckService: StatusCheckService,
    private router: Router,
    public revenueManagementService: RevenueManagementService,
    public areaManagementService: AreaManagementService,
    private leadManagementService: LeadManagementService,
    private partnerService: PartnerService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.paramMap.get("custType")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.dialog = true;
    this.demographicLabel = RadiusConstants.DEMOGRAPHICDATA || [];
    if (this.custId) {
      this.customerId = Number(this.custId);
      if (this.sourceType === "lead") {
        this.getLeadDetail(this.customerId);
      } else if (this.sourceType === "customer" || this.sourceType === "caf") {
        this.getWalletData(this.customerId);
        this.getCustomerNetworkLocationDetail(this.customerId);
        this.getActivePlanList(this.customerId);
        this.getPaymentHistory(this.customerId);
        this.getFramedIpAddressIp();
      }
    }
  }
  ngOnDestroy(): void {
    this.custId = null;
  }

  getFramedIpAddressIp() {
    const url = "/liveUser/getFramedIpAddress/" + this.customerId;
    this.customerManagementService.adoptRadius(url).subscribe(
      (response: any) => {
        this.framedIpAddress = response.dataList;
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

  getDemographicLabel(currentName: string): string {
    if (!this.demographicLabel || this.demographicLabel.length === 0) {
      return currentName;
    }

    const label = this.demographicLabel.find(item => item.currentName === currentName);
    return label ? label.newName : currentName;
  }

  getWalletData(custID) {
    const data = {
      CREATE_DATE: "",
      END_DATE: "",
      amount: "",
      balAmount: "",
      custId: custID,
      description: "",
      id: "",
      refNo: "",
      transcategory: "",
      transtype: ""
    };
    const url = "/wallet";
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.walletValue = response.customerWalletDetails;
        this.getCustomerDetailsById(this.customerId);
        if (this.walletValue >= 0) {
          this.dueValue = 0;
        } else {
          this.dueValue = Math.abs(this.walletValue);
        }
      },
      (error: any) => {
        this.getCustomerDetailsById(this.customerId);
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

  getActivePlanList(custId) {
    const url = `/subscriber/getActivePlanList/${custId}?isNotChangePlan=true`;
    this.customerManagementService.getActivePlanList(url).subscribe(
      (response: any) => {
        this.activePlanList = response.dataList;
      },
      () => {}
    );
  }

  getPaymentHistory(custId) {
    const url = `/paymentHistory/${custId}`;
    this.customerManagementService.getPaymentHistory(url).subscribe(
      (response: any) => {
        this.paymentHistoryList = response.dataList;
      },
      () => {}
    );
  }

  closedialog() {
    this.custId = null;
    this.dialog = false;
    this.closeCustomerViewDetails.emit(this.selectedStaffCust);
  }

  roundAmount(amount: number): number {
    return Math.round(amount);
  }

  navigateTicket() {
    this.router.navigate([
      "/home/customer/details/" + this.custType + "/tickets/" + this.customerId
    ]);
  }

  getCustomerDetailsById(custId) {
    const url = `/customerDetails/${custId}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerLedgerDetailData = response.CustomersDetails;
        this.customerAddress = this.customerLedgerDetailData?.addressListPojos?.find(
          address => address.version.toLowerCase() === "new"
        );
        if (
          this.customerLedgerDetailData.addressListPojos?.length > 0 &&
          this.customerLedgerDetailData.addressListPojos[0]?.addressType
        ) {
          const areaurl = "/area/" + this.customerLedgerDetailData.addressListPojos[0]?.areaId;

          this.adoptCommonBaseService.get(areaurl).subscribe((response: any) => {
            this.presentAdressDATA = response.data;
            this.presentAdressDATA.buildingNumber =
              this.customerLedgerDetailData.addressListPojos[0]?.buildingNumber;
            this.serviceAreaAndBuildingNameFromCustomerId();
          });
        }
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

  getLeadDetail(leadId) {
    const url = "/leadMaster/findById?leadId=" + Number(leadId);
    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.customerLedgerDetailData = await response.leadMaster;
        if (
          this.customerLedgerDetailData.addressList?.length > 0 &&
          this.customerLedgerDetailData.addressList[0]?.addressType
        ) {
          const areaurl = "/area/" + this.customerLedgerDetailData.addressList[0]?.areaId;
          this.adoptCommonBaseService.get(areaurl).subscribe((response: any) => {
            this.presentAdressDATA = response.data;
          });
        }
        if (this.customerLedgerDetailData.serviceareaid) {
          let serviceareaurl = "/serviceArea/" + this.customerLedgerDetailData.serviceareaid;
          this.adoptCommonBaseService.get(serviceareaurl).subscribe(async (response: any) => {
            this.serviceAreaDATA = await response.data.name;
          });
        }
        if (this.customerLedgerDetailData.partnerid) {
          let partnerurl = "/partner/" + this.customerLedgerDetailData.partnerid;
          this.partnerService.getMethodNew(partnerurl).subscribe(async (response: any) => {
            this.partnerDATA = await response.partnerlist.name;
          });
        }
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

  serviceAreaAndBuildingNameFromCustomerId() {
    const url = "/BuildingAndSubareaNames/" + this.customerId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.presentAdressDATA.subarea = response?.data?.name;
        this.presentAdressDATA.buildingName = response?.data?.building_name;
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
