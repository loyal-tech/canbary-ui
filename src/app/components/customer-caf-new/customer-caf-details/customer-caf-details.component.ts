import { url } from "inspector";
import { Component, OnInit } from "@angular/core";
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
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { TicketManagementService } from "src/app/service/ticket-management.service";

@Component({
  selector: "app-customer-caf-details",
  templateUrl: "./customer-caf-details.component.html",
  styleUrls: ["./customer-caf-details.component.scss"]
})
export class CustomerCafDetailsComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));

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
  showPassword: boolean = false;
  showLoginPassword: boolean = false;
  passwordVisibility: any;
  cwscPasswordVisible: boolean;
  aaaPasswordVisible: boolean;
  servicePackDetails: any;
  servicePackMsg: string;
  servicePackData: any;
  tatDetailsData: any;
  tatDetailsShowModel: boolean = false;
  activePlanNames: string = "";
  constructor(
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private route: ActivatedRoute,
    public statusCheckService: StatusCheckService,
    private router: Router,
    private staffService: StaffService,
    public revenueManagementService: RevenueManagementService,
    public areaManagementService: AreaManagementService,
    private ticketManagementService: TicketManagementService,
    loginService: LoginService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.passwordVisibility = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PASSWORD_VISIBILITY
        : POST_CUST_CONSTANTS.POST_CUST_PASSWORD_VISIBILITY
    );
    this.cwscPasswordVisible = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CWSC_PASSWORD
        : POST_CUST_CONSTANTS.POST_CUST_CWSC_PASSWORD
    );
    this.aaaPasswordVisible = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CWSC_PASSWORD
        : POST_CUST_CONSTANTS.POST_CUST_AAA_PASSWORD
    );
  }

  async ngOnInit() {
    this.demographicLabel = RadiusConstants.DEMOGRAPHICDATA || [];
    this.getWalletData(this.customerId);
    // this.getCustomersDetail(this.customerId);
    this.getCustomerNetworkLocationDetail(this.customerId);
    this.getAllCustomerInventoryList(this.customerId);
    this.getActivePlanList(this.customerId);
    this.getPaymentHistory(this.customerId);
    this.getServicePackDetails(this.customerId);
    this.getFramedIpAddressIp();
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

  getFramedIpAddressIp() {
    const url = "/liveUser/getFramedIpAddress/" + this.customerId;
    this.customerManagementService.adoptRadius(url).subscribe(
      (response: any) => {
        this.framedIpAddress = response.data;
        // console.log("areaData", this.areaData);
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

  listCustomer() {
    this.router.navigate(["/home/customer-caf-new/list/" + this.custType]);
  }

  getCustomersDetail(custId) {
    let plandatalength = 0;
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerLedgerDetailData = response.customers;
        this.customerAddress = this.customerLedgerDetailData.addressList.find(
          address => address.version.toLowerCase() === "new"
        );

        var macArray = [];
        this.customerLedgerDetailData.customerLocations.forEach(element => {
          if (macArray.indexOf(element.mac) === -1) {
            macArray.push(element.mac);
          }
        });
        this.macList = macArray.join(", ");

        var locationArray = [];
        this.customerLedgerDetailData.customerLocations.forEach(element => {
          if (locationArray.indexOf(element.locationName) === -1) {
            locationArray.push(element.locationName);
          }
        });
        this.locationList = locationArray.join(", ");

        if (this.customerLedgerDetailData.customerLocations.length > 0) {
          var custLocation = this.customerLedgerDetailData.customerLocations.some(
            location => location.isParentLocation == true
          );

          this.isParentLocation = custLocation ? "YES" : "NO";
        }

        // //pop Name
        if (this.customerLedgerDetailData.popid) {
          let partnerurl = "/popmanagement/" + this.customerLedgerDetailData.popid;
          this.customerManagementService.getMethod(partnerurl).subscribe((response: any) => {
            this.customerPopName = response.data.name;
          });
        }

        // serviceArea Name
        if (this.customerLedgerDetailData.serviceareaid) {
          const serviceareaurl = "/serviceArea/" + this.customerLedgerDetailData.serviceareaid;
          this.adoptCommonBaseService.get(serviceareaurl).subscribe((response: any) => {
            this.serviceAreaDATA = response.data.name;
          });
        }

        // Address
        if (this.customerLedgerDetailData.addressList[0].addressType) {
          const areaurl = "/area/" + this.customerLedgerDetailData.addressList[0].areaId;

          this.adoptCommonBaseService.get(areaurl).subscribe((response: any) => {
            this.presentAdressDATA = response.data;
            // let findsubData = this.subAreaListDD?.find(x => x.id == this.customerLedgerDetailData.addressList[0]?.subareaId)
            // this.presentAdressDATA.subarea = findsubData?.name;
            // let findBuildData = this.buildingListDD?.find(x => x.buildingMgmtId == this.customerLedgerDetailData.addressList[0]?.building_mgmt_id)
            // this.presentAdressDATA.buildingName = findBuildData?.buildingName;
            this.presentAdressDATA.buildingNumber =
              this.customerLedgerDetailData.addressList[0]?.buildingNumber;
            this.serviceAreaAndBuildingNameFromCustomerId();
          });
        }
        if (this.customerLedgerDetailData.planMappingList.length > 0) {
          this.customerBill = this.customerLedgerDetailData.planMappingList[0].billTo;
        }

        if (this.customerLedgerDetailData.plangroupid) {
        } else {
          this.customerLedgerDetailData.planMappingList =
            this.customerLedgerDetailData.planMappingList.filter(
              data => data.custPlanStatus == "Active" && data.planId
            );

          while (plandatalength < this.customerLedgerDetailData.planMappingList.length) {
            let discount;
            if (
              this.customerLedgerDetailData.planMappingList[plandatalength].discount == null ||
              this.customerLedgerDetailData.planMappingList[plandatalength].discount == ""
            ) {
              discount = 0;
            } else {
              discount = this.customerLedgerDetailData.planMappingList[plandatalength].discount;
            }
            this.activePlanNames = "";
            if (
              this.customerLedgerDetailData.planMappingList[plandatalength].plangroup !=
                "Volume Booster" &&
              this.customerLedgerDetailData.planMappingList[plandatalength].plangroup !=
                "Bandwidth Booster"
            )
              this.activePlanNames =
                this.activePlanNames +
                this.customerLedgerDetailData.planMappingList[plandatalength].planName +
                ",";
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
        this.getCustomersDetail(this.customerId);
        if (this.walletValue >= 0) {
          this.dueValue = 0;
        } else {
          this.dueValue = Math.abs(this.walletValue);
        }
      },
      (error: any) => {
        this.getCustomersDetail(this.customerId);
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
  getAllCustomerInventoryList(custId) {
    const url = `/inwards/getAllCustomerInventoryList?custId=${custId}`;
    this.customerManagementService.getCustNetworkLocDetail(url).subscribe(
      (response: any) => {
        this.customerInventoryList = response.dataList;
        const staffId = this.customerInventoryList[0]?.staffId;
        if (staffId) {
          this.staffService.getStaffUserData(staffId).subscribe((response: any) => {
            this.staffUserData = response.Staff;
          });
        }
      },
      (error: any) => {}
    );
  }
  getActivePlanList(custId) {
    const url = `/subscriber/getActivePlanList/${custId}?isNotChangePlan=true`;
    this.customerManagementService.getActivePlanList(url).subscribe(
      (response: any) => {
        this.activePlanList = response.dataList;
      },
      (error: any) => {}
    );
  }

  getPaymentHistory(custId) {
    const url = `/paymentHistory/${custId}`;
    this.customerManagementService.getPaymentHistory(url).subscribe(
      (response: any) => {
        this.paymentHistoryList = response.dataList;
      },
      (error: any) => {}
    );
  }

  roundAmount(amount: number): number {
    return Math.round(amount);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleLoginPassword(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  maskPassword(password: string | undefined): string {
    if (!password) return "";
    return "*".repeat(password.length);
  }

  getServicePackDetails(custId) {
    const url = `/vasplan/getVasPlanByCustId?custId=${custId}`;
    this.customerManagementService.getActivePlanList(url).subscribe(
      (response: any) => {
        let vasPlanList = response.vasPlanList;
        this.servicePackDetails = response.vasPlanList;
        if (vasPlanList?.length > 0) {
          for (let item of vasPlanList) {
            if (item.isActive) {
              this.servicePackData = item;
            }
          }
          this.getTatDetails(vasPlanList[0]?.tatId);
        }
        this.servicePackMsg = this.servicePackData
          ? response.msg
          : "There is no active value added services are available for this customer.";
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

  getTatDetails(tatId) {
    let mvnoId = localStorage.getItem("mvnoId");
    const url = `/tickettatmatrix/` + tatId + `?mvnoId=` + mvnoId;
    this.ticketManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.tatDetailsData = response.data;
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
  openTATModel() {
    this.tatDetailsShowModel = true;
  }

  closeTATModel() {
    this.tatDetailsShowModel = false;
  }
}
