import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { AreaManagementService } from "src/app/service/area-management.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { WorkflowAuditDetailsModalComponent } from "../../workflow-audit-details-modal/workflow-audit-details-modal.component";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { BuildingManagementService } from "src/app/service/building-management.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { Regex } from "src/app/constants/regex";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { PartnerService } from "src/app/service/partner.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
declare var $: any;

@Component({
  selector: "app-customer-caf-shiftlocation",
  templateUrl: "./customer-caf-shiftlocation.component.html",
  styleUrls: ["./customer-caf-shiftlocation.component.css"]
})
export class CustomerCafShiftLocationComponent implements OnInit {
  customerId: number;
  custType: string = "";
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  customerDetailData: any;
  staffData: any = [];
  staffDetailModal: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  newShiftaddShiftLocationAccess: boolean = false;
  newShiftdisplayShiftLocationDetails: boolean = false;
  newShiftLocationChargeGroupForm: FormGroup;
  newShiftoltDevices = [];
  newShiftspliterDevices = [];
  newShiftmasterDbDevices = [];
  disableShiftButton: boolean = false;
  newShiftCustomerAddressDataForCustometr: any;
  newShiftapproveId: any;
  newShiftrejectApproveShiftLocationModal: boolean = false;
  newShiftassignShiftLocationData: any = [];
  newShiftshiftLocationFlagType = "";
  newShiftAppRjecHeader = "";
  newShiftassignAppRejectShiftLocationForm: FormGroup;
  newShiftifModelIsShow: boolean = false;
  newShiftauditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  newShiftapprovableStaff: any = [];
  newShiftapproved = false;
  newShiftassignedShiftLocationid: any;
  newShiftapproveInventoryData = [];
  newShiftrejectInventoryData = [];
  newShiftassignShiftLocation1: boolean = false;
  newShiftreject = false;
  newShiftassignShiftLocationsubmitted = false;
  newShiftrejectCustomerInventoryModal: boolean = false;
  newShiftselectStaffReject: any;
  newShiftselectStaff: any;
  newShiftsubmitted = false;
  newShiftifUpdateAddressSubmited = false;
  newShiftrequestedByID: number;
  newShiftbranchID: number = 0;
  newShiftpincodeDD: any = [];
  iscustomerEdit = false;
  newShiftpresentGroupForm: FormGroup;
  newShiftselectPincodeList = false;
  paymentFormGroup: FormGroup;

  newShiftshiftLocationDTO: any = {
    addressDetails: {
      id: "",
      addressType: "",
      landmark: "",
      areaId: "",
      pincodeId: "",
      cityId: "",
      stateId: "",
      countryId: "",
      isDelete: false
    },
    updateAddressServiceAreaId: "",
    isPaymentAddresSame: "true",
    isPermanentAddress: "true",
    shiftPartnerid: "",
    popid: "",
    oltid: "",
    requestedById: "",
    branchID: ""
  };
  newShiftpartnerListByServiceArea: any = [];
  newShiftbranchData: any = [];
  newShiftisBranchShiftLocation = false;
  custData: any = {};
  customerIdRecord: number;

  newShiftstaffList: any = [];
  newShiftserviceAreaDisable = false;
  newShiftareaDetails: any;
  selectedMappingFrom: any;
  newShiftbuildingListDD: any;
  newShiftsubAreaListDD: any;
  viewcustomerListData: any = [];
  newShiftbuildingNoDD: any[];
  iflocationFill = false;
  ifsearchLocationModal = false;
  currentPagesearchLocationList = 1;
  newShiftstaffCustList = [];
  newShiftstaffSelectType = "";
  newShiftisSelectStaff: boolean = false;
  newShiftselectedStaff: any = [];
  reject = false;
  newShiftassignDocForm: any;
  newShiftpaymentOwnerId: number;
  newShiftstaffid;
  newShiftwalletValue: number;
  newShiftprepaid: any;
  newShiftdueValue: number;
  newShiftLocationPopId: number;
  newShiftLocationOltId: number;
  newShiftAreaListDD: any;
  newShiftstaffSelectList: any = [];
  newShiftassignDocSubmitted: boolean;
  newShiftisServiceInShiftLocation: boolean;
  newShiftremark: any;
  newShiftshowParentCustomerModel = false;
  newShiftselectedParentCust: any = [];
  newShiftparentCustomerDialogType: any = "";
  newShiftbillableCustList: any = [];
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;
  searchLocationForm: FormGroup;
  searchLocationData: any;
  @ViewChild("closebutton") closebutton;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  shiftLocationEvent = false;
  newShiftprepaidValue: number;
  staffDataList: any;
  data: any = [];
  customerData: any;
  serviceAreaDATA: any;
  paymentAdressDATA: any;
  permentAdressDATA: any;
  presentAdressDATA: any;
  partnerDATA: any[];
  chargeDATA: any[];
  paymentDataamount: string;
  paymentDatareferenceno: string;
  paymentDatapaymentdate: string;
  paymentDatapaymentMode: string;
  FinalAmountList: any[];
  paymentAddressData: any;
  permanentAddressData: any;
  currency: any;
  systemConfigCurrency: any;
  customerPopName: any;
  activePlanNames: string;
  customerBill: any;
  custInvoiceToOrg: any;
  ifIndividualPlan: boolean;
  ifPlanGroup: boolean;
  planGroupName: any;
  planMappingList: any;
  dataPlan: any;
  areaTitle = AREA;
  countryTitle = COUNTRY;
  subareaTitle = RadiusConstants.SUBAREA;
  buildingTitle = RadiusConstants.BUILDING;
  branchId: any;
  serviceareaCheck = true;
  serviceAreaList: any;
  loggedInStaffId = localStorage.getItem("userId");

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    loginService: LoginService,
    private networkdeviceService: NetworkdeviceService,
    private fb: FormBuilder,
    public paymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    public serviceAreaService: ServiceAreaService,
    private areaManagementService: AreaManagementService,
    private revenueManagementService: RevenueManagementService,
    private buildingMangementService: BuildingManagementService,
    public datePipe: DatePipe,
    private recordPaymentService: RecordPaymentService,
    public statusCheckService: StatusCheckService,
    public partnerService: PartnerService,
    private systemService: SystemconfigService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.newShiftaddShiftLocationAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_SHIFT_LOCATION_ADD
        : POST_CUST_CONSTANTS.POST_CUST_SHIFT_LOCATION_ADD
    );
  }

  ngOnInit() {
    this.newShiftpresentGroupForm = this.fb.group({
      addressType: ["Present", Validators.required],
      landmark: ["", Validators.required],
      areaId: ["", Validators.required],
      pincodeId: ["", Validators.required],
      cityId: ["", Validators.required],
      stateId: ["", Validators.required],
      countryId: ["", Validators.required],
      landmark1: [""],
      subareaId: [""],
      building_mgmt_id: [""],
      buildingNumber: [""],
      latitude: [""],
      longitude: [""]
    });
    this.paymentFormGroup = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      bank: [""],
      branch: [""],
      chequedate: ["", Validators.required],
      chequeno: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      customerid: ["", Validators.required],
      paymode: ["", Validators.required],
      referenceno: ["", Validators.required],
      remark: ["", Validators.required],
      bankManagement: ["", Validators.required],
      destinationBank: ["", Validators.required],
      reciptNo: [""],
      type: ["Payment"],
      paytype: [""],
      file: [""],
      tdsAmount: [0],
      abbsAmount: [0],
      invoiceId: ["", Validators.required],
      onlinesource: [""]
    });
    this.newShiftassignAppRejectShiftLocationForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.newShiftassignDocForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });
    this.newShiftLocationChargeGroupForm = this.fb.group({
      chargeid: [""],
      price: [""],
      actualprice: [""],
      charge_date: [""],
      type: [""],
      discount: [""],
      billingCycle: [""],
      id: [""],
      billableCustomerId: [""],
      paymentOwnerId: [""]
    });
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
      this.systemConfigCurrency = res.data.value;
    });
    this.getCustomersDetail(this.customerId);
    this.newShiftshiftLocationDTO.isPermanentAddress = false;
    this.newShiftshiftLocationDTO.isPaymentAddresSame = false;
    this.shiftLocationEvent = false;

    this.getStaffDetailId();
    this.newShiftsearchPrepaidValue();
    this.getMappingFrom();
    this.commondropdownService.getAllPinCodeData();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
    this.commondropdownService.getserviceAreaList();
    console.log("serviceAreaList", this.commondropdownService.serviceAreaList);
    if (history.state.data) {
      this.custData = history.state.data;
      if (this.custData.serviceareaid) {
        this.newShiftisServiceInShiftLocation = true;
        this.newShiftshiftLocationDTO.updateAddressServiceAreaId = this.custData.serviceareaid;
        this.newShiftLocationPopId = this.custData.popid;
        this.newShiftLocationOltId = this.custData.oltid;
        this.newShiftgetPartnerAllByServiceArea(this.custData.serviceareaid);
        this.newShiftbranchByServiceAreaID(this.custData.serviceareaid);
        let serviceAreaId = {
          value: Number(this.custData.serviceareaid)
        };
        this.newShiftselServiceArea(serviceAreaId, false);
        var customerAddress = this.custData.addressList.find(address => address.version === "NEW");
        // this.getStaffDetailById(customerData.serviceareaid)
        const data = {
          value: Number(customerAddress.pincodeId)
        };
        this.newShiftselectPINCODEChange(data, "");
        this.newShiftgetAreaData(customerAddress.areaId, "present");
        // const data = {
        //     value: Number(customerAddress.pincodeId)
        // };
        // this.newShiftselectPINCODEChange(data, "");
        this.newShiftpresentGroupForm.patchValue({
          pincodeId: Number(customerAddress.pincodeId)
        });
        let subAreaEvent = {
          value: customerAddress.subareaId
        };
        this.newShiftonChangeSubArea(subAreaEvent, "present");
        this.newShiftbranchID = this.custData.branch;
      }
      if (this.custData.partnerid) {
        this.newShiftshiftLocationDTO.shiftPartnerid = this.custData.partnerid;
      }
      this.newShiftshiftLocationDTO.isPermanentAddress = false;
      this.newShiftshiftLocationDTO.isPaymentAddresSame = false;

      this.newShiftpresentGroupForm.patchValue(customerAddress);

      this.newShiftstaffSelectList = [];
    } else this.newShiftgetCustomersDetail(this.customerId);
    this.newShiftgetNewCustomerAddressForCustomer();
  }
  getMappingFrom() {
    const url = "/buildingRefrence/all";
    this.buildingMangementService.getMethod(url).subscribe(
      (response: any) => {
        let dunningData = response.dataList;
        if (dunningData?.length > 0) {
          this.selectedMappingFrom = dunningData[0].mappingFrom;
        }
        // else {
        //     this.messageService.add({
        //         severity: "info",
        //         summary: "Info",
        //         detail: "Please Select First Building Reference Management.",
        //         icon: "far fa-times-circle"
        //     });
        // }
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
  newShiftsearchPrepaidValue() {
    this.newShiftprepaid = "";
    this.newShiftprepaidValue = 0;
    const now = new Date();
    let firstDay;
    let lastDay;
    firstDay = this.datePipe.transform(now, "yyyy-MM-dd");
    lastDay = this.datePipe.transform(new Date(now.setDate(now.getDate() + 1)), "yyyy-MM-dd");
    const url =
      "/getCustomer?custid=" + this.customerId + "&startdate=" + firstDay + "&endate=" + firstDay;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        response.customerDBRPojos.forEach(dbr => {
          var DBRDate = moment(dbr.month, "DD/MM/YYYY").toDate();
          var today = moment(new Date(), "DD/MM/YYYY").toDate();
          if (moment(DBRDate.setHours(0, 0, 0, 0)).isSame(moment(today.setHours(0, 0, 0, 0)))) {
            this.newShiftprepaidValue = this.newShiftprepaidValue + dbr.pendingamt;
          }
        });
        this.newShiftprepaid = this.newShiftprepaidValue.toFixed(2);
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
  getStaffDetailId() {
    const data = {};
    const url = "/staffuser/list";
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.staffData = response.staffUserlist;
    });
  }
  customerDetailOpen() {
    this.router.navigate([
      "/home/customer-caf-new/details/" + this.custType + "/x/" + this.customerId
    ]);
  }

  getCustomersDetail(custId) {
    this.presentAdressDATA = [];
    this.permentAdressDATA = [];
    this.paymentAdressDATA = [];
    this.partnerDATA = [];
    this.chargeDATA = [];
    let plandatalength = 0;
    const chargeLength = 0;
    this.paymentDataamount = "";
    this.paymentDatareferenceno = "";
    this.paymentDatapaymentdate = "";
    this.paymentDatapaymentMode = "";
    this.FinalAmountList = [];
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerDetailData = response.customers;

        this.customerId = response.customers.id;
        if (this.customerDetailData.serviceareaid) {
          this.newShiftshiftLocationDTO.updateAddressServiceAreaId =
            this.customerDetailData.serviceareaid;
          this.newShiftgetPartnerAllByServiceArea(this.customerDetailData.serviceareaid);
          this.getStaffDetailById(this.customerDetailData.serviceareaid);
        }
        if (this.customerDetailData.partnerid) {
          this.newShiftshiftLocationDTO.shiftPartnerid = this.customerDetailData.partnerid;
        }
        if (response.customers?.creditDocuments?.length) {
          this.paymentDataamount = response.customers.creditDocuments[0].amount;
          this.paymentDatareferenceno = response.customers.creditDocuments[0].referenceno;
          this.paymentDatapaymentdate = response.customers.creditDocuments[0].paymentdate;
          this.paymentDatapaymentMode = response.customers.creditDocuments[0].paymode;
        }
        const paymentaddressType = response.customers.addressList.filter(
          key => key.addressType === "Payment"
        );
        if (paymentaddressType) {
          this.paymentAddressData = paymentaddressType;
        } else {
          this.paymentAddressData = {
            fullAddress: ""
          };
        }
        const permanentaddressType = response.customers.addressList.filter(
          key => key.addressType === "Permanent"
        );
        if (permanentaddressType) {
          this.permanentAddressData = permanentaddressType;
        } else {
          this.permanentAddressData = {
            fullAddress: ""
          };
        }

        //currency
        // this.customerDetailData?.currency
        //   ? (this.currency = this.customerDetailData?.currency)
        //   : this.systemService
        //       .getConfigurationByName("CURRENCY_FOR_PAYMENT")
        //       .subscribe((res: any) => {
        //         this.currency = res.data.value;
        //       });

        // this.isDisplayConvertedAmount =
        //   this.currency !=
        //   (this.customerDetailData?.currency
        //     ? this.customerDetailData?.currency
        //     : this.systemConfigCurrency);

        //pop Name
        if (this.customerDetailData.popid) {
          if (this.statusCheckService.isActiveInventoryService) {
            let partnerurl = "/popmanagement/" + this.customerDetailData.popid;
            this.customerManagementService.getMethod(partnerurl).subscribe((response: any) => {
              this.customerPopName = response.data.name;

              // console.log("partnerDATA", this.partnerDATA);
            });
          }
        }

        // partner Name
        if (this.customerDetailData.partnerid) {
          const partnerurl = "/partner/" + this.customerDetailData.partnerid;
          this.partnerService.getMethodNew(partnerurl).subscribe((response: any) => {
            this.partnerDATA = response.partnerlist.name;

            // console.log("partnerDATA", this.partnerDATA);
          });
        }

        // serviceArea Name
        // if (this.customerDetailData.serviceareaid) {
        //   const serviceareaurl = "/serviceArea/" + this.customerDetailData.serviceareaid;
        //   this.adoptCommonBaseService.get(serviceareaurl).subscribe((response: any) => {
        //     this.serviceAreaDATA = response.data.name;

        //     // console.log("partnerDATA", this.serviceAreaDATA);
        //   });
        // }

        // Address
        if (
          this.customerDetailData.addressList.length > 0 &&
          this.customerDetailData.addressList[0].addressType
        ) {
          const areaurl = "/area/" + this.customerDetailData.addressList[0].areaId;

          this.adoptCommonBaseService.get(areaurl).subscribe((response: any) => {
            this.presentAdressDATA = response.data;
            this.newShiftpresentGroupForm.patchValue(this.customerDetailData.addressList[0]);

            // // let findsubData = this.subAreaListDD?.find(
            // //     x => x.id == this.customerDetailData.addressList[0]?.subareaId
            // // );
            // // this.presentAdressDATA.subarea = findsubData?.name;
            // // let findBuildData = this.buildingListDD?.find(
            // //     x => x.buildingMgmtId == this.customerDetailData.addressList[0]?.building_mgmt_id
            // // );
            // this.presentAdressDATA.buildingName = findBuildData?.buildingName;
            this.presentAdressDATA.buildingNumber =
              this.customerDetailData.addressList[0]?.buildingNumber;
            this.serviceAreaAndBuildingNameFromCustomerId();
            // console.log("presentAdressDATA", this.presentAdressDATA);
          });
        }
        if (this.customerDetailData.addressList.length > 1) {
          let j = 0;
          while (j < this.customerDetailData.addressList.length) {
            const addres1 = this.customerDetailData.addressList[j].addressType;
            if (addres1) {
              if ("Payment" == addres1) {
                const areaurl = "/area/" + this.customerDetailData.addressList[j].areaId;
                this.adoptCommonBaseService.get(areaurl).subscribe((response: any) => {
                  this.paymentAdressDATA = response.data;

                  // console.log("paymentAdressDATA", this.paymentAdressDATA);
                });
              } else {
                const areaurl = "/area/" + this.customerDetailData.addressList[j].areaId;
                this.adoptCommonBaseService.get(areaurl).subscribe((response: any) => {
                  this.permentAdressDATA = response.data;

                  // console.log("permentAdressDATA", this.permentAdressDATA);
                });
              }
            }
            j++;
          }
        }

        // if (this.customerDetailData.planMappingList.length > 0) {
        //   this.customerBill = this.customerDetailData.planMappingList[0].billTo;
        //   this.custInvoiceToOrg = this.customerDetailData.planMappingList[0].isInvoiceToOrg;
        // }

        // if (this.customerDetailData.plangroupid) {
        //   this.ifIndividualPlan = false;
        //   this.ifPlanGroup = true;
        //   let mvnoId =
        //     localStorage.getItem("mvnoId") == "1"
        //       ? this.customerDetailData.mvnoId
        //       : Number(localStorage.getItem("mvnoId"));
        //   const planGroupurl =
        //     "/findPlanGroupById?planGroupId=" +
        //     this.customerDetailData.plangroupid +
        //     "&mvnoId=" +
        //     mvnoId;

        //   this.customerManagementService.getMethod(planGroupurl).subscribe((response: any) => {
        //     this.planGroupName = response.planGroup.planGroupName;
        //   });
        // } else {
        //   this.ifIndividualPlan = true;
        //   this.ifPlanGroup = false;
        //   this.customerDetailData.planMappingList = this.customerDetailData.planMappingList.filter(
        //     data => data.custPlanStatus == "Active"
        //   );

        //   this.planMappingList = this.customerDetailData.planMappingList;
        //   while (plandatalength < this.customerDetailData.planMappingList.length) {
        //     const planId = this.customerDetailData.planMappingList[plandatalength].planId;
        //     let discount;
        //     if (
        //       this.customerDetailData.planMappingList[plandatalength].discount == null ||
        //       this.customerDetailData.planMappingList[plandatalength].discount == ""
        //     ) {
        //       discount = 0;
        //     } else {
        //       discount = this.customerDetailData.planMappingList[plandatalength].discount;
        //     }
        //     this.activePlanNames = "";
        //     if (
        //       this.customerDetailData.planMappingList[plandatalength].plangroup !=
        //         "Volume Booster" &&
        //       this.customerDetailData.planMappingList[plandatalength].plangroup !=
        //         "Bandwidth Booster"
        //     )
        //       this.activePlanNames =
        //         this.activePlanNames +
        //         this.customerDetailData.planMappingList[plandatalength].planName +
        //         ",";
        //     let mvnoId =
        //       localStorage.getItem("mvnoId") == "1"
        //         ? this.customerDetailData.mvnoId
        //         : Number(localStorage.getItem("mvnoId"));
        //     const planurl = "/postpaidplan/" + planId + "?mvnoId=" + mvnoId;
        //     this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
        //       this.dataPlan.push(response.postPaidPlan);
        //       // console.log("dataPlan", this.dataPlan);
        //     });

        //     this.customerManagementService
        //       .getofferPriceWithTax(planId, discount)
        //       .subscribe((response: any) => {
        //         if (response.result.finalAmount) {
        //           this.FinalAmountList.push(response.result.finalAmount);
        //         } else {
        //           this.FinalAmountList.push(0);
        //         }
        //       });
        //     plandatalength++;
        //   }
        //   // charger Data
        // //   if (this.customerDetailData.indiChargeList.length > 0) {
        // //     this.addChargeForm.patchValue({
        // //       chargeAdd: true
        // //     });
        // //   }

        //   // let checkCustTypeurl = `/isCustomerPrimeOrNot?custId=${custId}`;
        //   // this.customerManagementService
        //   //   .getMethod(checkCustTypeurl)
        //   //   .subscribe((response: any) => {
        //   //     //plan deatils
        //   //     let planurl;
        //   //     if (response.isCustomerPrime) {
        //   //       planurl = `/premierePlan/all?custId=${custId}&isPremiere=true&serviceAreaId=${this.customerDetailData.serviceareaid}`;
        //   //     } else {
        //   //       planurl =
        //   //         "/plans/serviceArea?serviceAreaId=" +
        //   //         this.customerDetailData.serviceareaid;
        //   //     }
        //   //     while (
        //   //       plandatalength <
        //   //       this.customerDetailData.planMappingList.length
        //   //     ) {
        //   //       this.customerManagementService
        //   //         .getMethod(planurl)
        //   //         .subscribe((response: any) => {
        //   //           this.dataPlan.push(response.postpaidplanList.name);
        //   //           // console.log("dataPlan", this.dataPlan);
        //   //         });
        //   //       plandatalength++;
        //   //     }
        //   //   });
        // }

        // charger Data
        // if (this.customerDetailData.indiChargeList.length > 0) {
        //   this.customerDetailData.indiChargeList.forEach(element => {
        //     if (element.planid) {
        //       let mvnoId =
        //         localStorage.getItem("mvnoId") == "1"
        //           ? this.customerDetailData.mvnoId
        //           : Number(localStorage.getItem("mvnoId"));
        //       const url = "/postpaidplan/" + element.planid + "?mvnoId=" + mvnoId;
        //       this.customerManagementService.getMethod(url).subscribe((response: any) => {
        //         this.dataChargePlan.push(response.postPaidPlan);
        //       });
        //     }
        //   });
        // }

        // console.log("this.paymentAddressData", this.paymentAddressData);
        // console.log("this.permanentAddressData", this.permanentAddressData);
        // console.log("this.customerDetailData", this.customerDetailData);
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

  newShiftopenShiftLocationForm() {
    // this.callCheckShiftLocation();
    this.newShiftdisplayShiftLocationDetails = true;
    this.newShiftgetNetworkDevicesByType("OLT");
    this.newShiftLocationChargeGroupForm.reset();
  }

  getStaffDetailById(serviceAreaId) {
    const url = "/getstaffuserbyserviceareaid/" + serviceAreaId;
    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      this.staffDataList = response.dataList;
      //console.log("staffDataList", this.data);
      this.staffDataList.forEach((element, i) => {
        element.displayLabel = element.fullName + " (Ph: " + element.phone + ")";
        this.data.push(element.id);
      });
    });
    // this.serviceAreaId = this.serviceAreaData.id;
  }

  newShiftgetNetworkDevicesByType(deviceType) {
    const url = "/NetworkDevice/getNetworkDevicesByDeviceType?deviceType=" + deviceType;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        switch (deviceType) {
          case "OLT":
            this.newShiftoltDevices = response.dataList;
            break;
          case "SN Splitter":
            this.newShiftspliterDevices = response.dataList;
            break;
          case "DN Splitter":
            this.newShiftspliterDevices = response.dataList;
            break;
          case "Master DB/DB":
            this.newShiftmasterDbDevices = response.dataList;
            break;
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

  newShiftgetNewCustomerAddressForCustomer(): void {
    const url = "/newcustomeraddress/" + this.customerId;

    this.customerManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.newShiftCustomerAddressDataForCustometr = res.newcustomerAddress;
        if (this.newShiftCustomerAddressDataForCustometr?.length > 0) {
          this.disableShiftButton = this.newShiftCustomerAddressDataForCustometr.some(
            item => item.version === "IN_TRANSIT"
          );
        }
      },
      (error: any) => {}
    );
  }
  newShiftpickModalOpen(data) {
    let name;
    let entityID;
    name = "SHIFT_LOCATION";
    entityID = data.id;
    let url = "/workflow/pickupworkflow?eventName=" + name + "&entityId=" + entityID;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.openCustomerAddress();
        this.newShiftgetNewCustomerAddressForCustomer();

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  newShiftshiftLocationApproved(data) {
    this.newShiftapproveId = data.id;
    this.newShiftrejectApproveShiftLocationModal = true;
    this.newShiftassignShiftLocationData = data;
    this.newShiftshiftLocationFlagType = "approved";
    this.newShiftAppRjecHeader = "Approve";
    this.newShiftassignAppRejectShiftLocationForm.reset();
  }

  newShiftshiftLocationRejected(data) {
    this.newShiftapproveId = data.id;
    this.newShiftrejectApproveShiftLocationModal = true;
    this.newShiftassignShiftLocationData = data;
    this.newShiftshiftLocationFlagType = "Rejected";
    this.newShiftAppRjecHeader = "Reject";
    this.newShiftassignAppRejectShiftLocationForm.reset();
  }

  newShiftshiftWorkflow(data) {
    this.newShiftifModelIsShow = true;
    this.paymentamountService.show("custauditWorkflowModal");
    this.newShiftauditcustid.next({
      auditcustid: data.id,
      checkHierachy: "SHIFT_LOCATION",
      planId: ""
    });
  }

  newShiftStaffReasignListShiftLocation(data) {
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=SHIFT_LOCATION`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.newShiftassignedShiftLocationid = data.id;
        this.newShiftapprovableStaff = [];
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        if (response.dataList != null) {
          // this.getCustomer();
          this.newShiftapprovableStaff = response.dataList;
          this.newShiftapproved = true;
          $("#reAssignPLANModal").modal("show");
        } else {
          $("#reAssignPLANModal").modal("hide");
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  newShiftassignAddressApprove() {
    this.newShiftassignShiftLocationsubmitted = true;
    if (this.newShiftassignAppRejectShiftLocationForm.valid) {
      let url = "/approveCustomerAddress";

      let assignCAFData = {
        addressId: this.newShiftassignShiftLocationData.id,
        flag: this.newShiftshiftLocationFlagType,
        nextStaffId: 0,
        remark: this.newShiftassignAppRejectShiftLocationForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };

      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.newShiftrejectApproveShiftLocationModal = false;
          this.newShiftapproveInventoryData = null;
          this.newShiftrejectInventoryData = null;
          if (response.result.dataList) {
            if (this.newShiftshiftLocationFlagType == "approved") {
              this.newShiftapproved = true;
              this.newShiftapproveInventoryData = response.result.dataList;
              this.newShiftassignShiftLocation1 = true;
              //   $("#assignCustomerInventoryModal").modal("show");
            } else {
              this.newShiftreject = true;
              this.newShiftrejectInventoryData = response.result.dataList;
              this.newShiftrejectCustomerInventoryModal = true;
            }
          } else {
            this.newShiftgetNewCustomerAddressForCustomer();
          }
          this.newShiftassignAppRejectShiftLocationForm.reset();
          this.newShiftassignShiftLocationsubmitted = false;
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

  newShiftcloseDisplayShiftLocationDetails() {
    this.newShiftrejectApproveShiftLocationModal = false;
  }
  newShiftassignToStaff(flag) {
    let url: any;
    let name: string;
    name = "SHIFT_LOCATION";
    if (!this.newShiftselectStaff && !this.newShiftselectStaffReject) {
      url = `/teamHierarchy/assignEveryStaff?entityId=${this.newShiftapproveId}&eventName=${name}&isApproveRequest=${flag}`;
    } else {
      if (flag) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.newShiftapproveId}&eventName=${name}&nextAssignStaff=${this.newShiftselectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.newShiftapproveId}&eventName=${name}&nextAssignStaff=${this.newShiftselectStaffReject}&isApproveRequest=${flag}`;
      }
    }

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (flag) {
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Approved Successfully.",
              icon: "far fa-times-circle"
            });
          }
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        // $("#assignCustomerInventoryModal").modal("hide");
        this.newShiftassignShiftLocation1 = false;
        this.newShiftrejectCustomerInventoryModal = false;
        this.newShiftgetNewCustomerAddressForCustomer();
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  newShiftcloseStaffModel(arg0: boolean) {
    this.newShiftassignShiftLocation1 = false;
  }

  newShiftcloseShiftLocation() {
    this.newShiftsubmitted = false;
    this.newShiftifUpdateAddressSubmited = false;
    this.newShiftLocationChargeGroupForm.reset();
    this.newShiftifUpdateAddressSubmited = false;
    this.newShiftrequestedByID = 0;
    this.newShiftbranchID = 0;
    this.newShiftdisplayShiftLocationDetails = false;
  }

  newShiftselServiceArea(event, isFromUI) {
    if (isFromUI) {
      this.newShiftpincodeDD = [];
    }
    const serviceAreaId = event.value;
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          // this.serviceareaCheck = false;
          let serviceAreaData = response.data;
          if (isFromUI) {
            serviceAreaData.pincodes.forEach(element => {
              this.commondropdownService.allpincodeNumber.forEach(e => {
                if (e.pincodeid == element) {
                  this.newShiftpincodeDD.push(e);
                }
              });
            });
          }
          if (!this.iscustomerEdit) {
            if (isFromUI) {
              this.newShiftpresentGroupForm.reset();
            }
          }
        },
        (error: any) => {}
      );
      this.newShiftgetPartnerAllByServiceArea(serviceAreaId);
      this.newShiftgetStaffUserByServiceArea(serviceAreaId);
      this.newShiftbranchByServiceAreaID(serviceAreaId);
      // this.getStaffDetailById(serviceAreaId);
      this.newShiftshiftLocationDTO.shiftPartnerid = "";
    }
  }

  newShiftgetPartnerAllByServiceArea(serviceAreaId) {
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerDetailData.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/getPartnerByServiceAreaId/" + serviceAreaId + "?mvnoId=" + mvnoId;
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.newShiftpartnerListByServiceArea = response.partnerList.filter(item => item.id != 1);
        console.log("partnerList", response);
      },
      (error: any) => {}
    );
  }

  newShiftgetStaffUserByServiceArea(ids) {
    let data = [];
    data.push(ids);
    let url = "/staffsByServiceAreaId/" + ids;
    this.serviceAreaService.getMethod(url).subscribe((response: any) => {
      //
      this.newShiftstaffList = response.dataList;
    });
  }

  newShiftbranchByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerDetailData.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    let url = "/branchManagement/getAllBranchesByServiceAreaId?mvnoId=" + mvnoId;
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.newShiftbranchData = response.dataList;
      if (this.newShiftbranchData != null && this.newShiftbranchData.length > 0) {
        this.newShiftisBranchShiftLocation = true;
        if (this.custData.branch) {
          this.newShiftbranchID = this.custData.branch;
        }
        // this.isBranchAvailable = true;
      } else {
        this.newShiftisBranchShiftLocation = false;
        // this.isBranchAvailable = false;
      }
    });
  }

  newShiftselectAreaChange(_event: any, index: any) {
    this.newShiftgetAreaData(_event.value, index);
  }

  newShiftgetAreaData(id: any, index: any) {
    // const url = "/area/" + id;

    // this.adoptCommonBaseService.get(url).subscribe((response: any) => {
    //     if (index === "present") {
    //         this.newShiftareaDetails = response.data;

    //         this.newShiftselectPincodeList = true;

    //         this.newShiftpresentGroupForm.patchValue({
    //             addressType: "Present",
    //             areaId: Number(this.areaDetails.id),
    //             pincodeId: Number(this.areaDetails.pincodeId),
    //             cityId: Number(this.areaDetails.cityId),
    //             stateId: Number(this.areaDetails.stateId),
    //             countryId: Number(this.areaDetails.countryId)
    //         });
    //     }
    // });
    if (id) {
      const url = "/area/" + id;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          if (response.data?.pincodeId) {
            const pincodeUrl =
              "/pincode/getServicAreaIdByPincode?pincodeid=" + response.data?.pincodeId;
            this.adoptCommonBaseService.get(pincodeUrl).subscribe(
              (res: any) => {
                if (res.data) {
                  if (!this.newShiftshiftLocationDTO.serviceareaid) {
                    // this.getBranchByServiceAreaID(res.data);
                    // this.getPlanbyServiceArea(res.data);
                    let serviceAreaId = {
                      value: Number(res.data)
                    };
                    this.newShiftselServiceArea(serviceAreaId, false);
                    this.newShiftshiftLocationDTO.serviceareaid = res.data;
                  }
                }
                if (index === "present") {
                  this.newShiftareaDetails = response.data;

                  this.newShiftselectPincodeList = true;

                  this.newShiftpresentGroupForm.patchValue({
                    addressType: "Present",
                    areaId: Number(this.newShiftareaDetails.id),
                    pincodeId: Number(this.newShiftareaDetails.pincodeId),
                    cityId: Number(this.newShiftareaDetails.cityId),
                    stateId: Number(this.newShiftareaDetails.stateId),
                    countryId: Number(this.newShiftareaDetails.countryId)
                  });
                }
                // if (index === "payment") {
                //     this.paymentareaDetails = response.data;

                //     this.selectPincodeListPayment = true;

                //     this.paymentGroupForm.patchValue({
                //         addressType: "Payment",
                //         pincodeId: Number(this.paymentareaDetails.pincodeId),
                //         cityId: Number(this.paymentareaDetails.cityId),
                //         stateId: Number(this.paymentareaDetails.stateId),
                //         countryId: Number(this.paymentareaDetails.countryId)
                //     });
                // }
                // if (index === "permanent") {
                //     this.permanentareaDetails = response.data;

                //     this.selectPincodeListPermanent = true;
                //     this.permanentGroupForm.patchValue({
                //         addressType: "Permanent",
                //         pincodeId: Number(this.permanentareaDetails.pincodeId),
                //         cityId: Number(this.permanentareaDetails.cityId),
                //         stateId: Number(this.permanentareaDetails.stateId),
                //         countryId: Number(this.permanentareaDetails.countryId)
                //     });
                // }
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
            let idData = this.selectedMappingFrom === "Pin Code" ? response.data?.pincodeId : id;
            let building_url =
              "/buildingmgmt/getBuildingMgmt?entityname=" +
              this.selectedMappingFrom +
              "&entityid=" +
              idData;
            this.adoptCommonBaseService.get(building_url).subscribe(
              (response: any) => {
                if (response.dataList?.length > 0) {
                  this.newShiftbuildingListDD = response.dataList;
                } else {
                  this.newShiftbuildingListDD = [];
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
      const subAreaurl = "/subarea/getSubAreaFromArea?areaId=" + id;
      this.adoptCommonBaseService.get(subAreaurl).subscribe(
        (subarea: any) => {
          // this.newShiftsubAreaListDD = subarea.dataList;
          if (subarea.dataList) {
            // Map the response to add '(UnderDeveloped)' for relevant items
            this.newShiftsubAreaListDD = subarea.dataList.map((item: any) => ({
              id: item.id,
              name: item.name,
              isUnderDevelopment: item.status === "UnderDevelopment"
            }));
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
  }
  newShiftonChangeSubArea(_event: any, index: any) {
    if (_event.value) {
      const subAreaurl = "/subarea/getAreaIdFromSubAreaId?subAreaId=" + _event.value;
      this.adoptCommonBaseService.get(subAreaurl).subscribe(
        (subarea: any) => {
          if (subarea.data) {
            const url = "/area/" + subarea.data;
            this.adoptCommonBaseService.get(url).subscribe(
              (response: any) => {
                if (response.data?.pincodeId) {
                  const pincodeUrl =
                    "/pincode/getServicAreaIdByPincode?pincodeid=" + response.data?.pincodeId;
                  this.adoptCommonBaseService.get(pincodeUrl).subscribe(
                    (res: any) => {
                      if (res?.data) {
                        if (!this.newShiftshiftLocationDTO.serviceareaid) {
                          let serviceAreaId = {
                            value: Number(res.data)
                          };
                          this.newShiftshiftLocationDTO.serviceareaid = res.data;
                          this.newShiftselServiceArea(serviceAreaId, false);
                        }
                      }
                      if (index === "present") {
                        this.newShiftareaDetails = response.data;

                        this.newShiftselectPincodeList = true;

                        this.newShiftpresentGroupForm.patchValue({
                          addressType: "Present",
                          areaId: Number(this.newShiftareaDetails.id),
                          pincodeId: Number(this.newShiftareaDetails.pincodeId),
                          cityId: Number(this.newShiftareaDetails.cityId),
                          stateId: Number(this.newShiftareaDetails.stateId),
                          countryId: Number(this.newShiftareaDetails.countryId)
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
                  let idData;
                  if (this.selectedMappingFrom === "Pin Code") {
                    idData = response.data?.pincodeId;
                  } else if (this.selectedMappingFrom === "Area") {
                    idData = subarea?.data;
                  } else {
                    idData = _event?.value;
                  }
                  let building_url =
                    "/buildingmgmt/getBuildingMgmt?entityname=" +
                    this.selectedMappingFrom +
                    "&entityid=" +
                    idData;
                  this.adoptCommonBaseService.get(building_url).subscribe(
                    (response: any) => {
                      if (response.dataList?.length > 0) {
                        this.newShiftbuildingListDD = response.dataList;
                        // if (this.iscustomerEdit) {
                        let buildingEvent = {
                          value: Number(this.viewcustomerListData.building_mgmt_id)
                        };
                        this.newShiftonChangeBuildingArea(buildingEvent, "");
                        // }
                      } else {
                        this.newShiftbuildingListDD = [];
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

  newShiftonChangeBuildingArea(_event: any, index: any) {
    if (_event.value) {
      this.newShiftbuildingNoDD = [];
      const url = "/buildingmgmt/getBuildingMgmtNumbers?buildingMgmtId=" + _event.value;
      this.areaManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.newShiftbuildingNoDD = response.dataList.map(buildingNumber => ({ buildingNumber }));
          // if (this.iscustomerEdit) {
          this.newShiftpresentGroupForm.patchValue({
            buildingNumber: this.viewcustomerListData.buildingNumber
          });
          // }
        },
        (error: any) => {
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: error.error.ERROR,
          //   icon: 'far fa-times-circle',
          // })
        }
      );
    }
  }

  mylocation() {
    //
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          // console.log(
          //   'Latitude: ' +
          //     position.coords.latitude +
          //     'Longitude: ' +
          //     position.coords.longitude,
          // )

          this.iflocationFill = true;
          //   this.customerDetailData.patchValue({
          //     latitude: position.coords.latitude,
          //     longitude: position.coords.longitude
          //   });
          this.newShiftpresentGroupForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Geolocation is not supported by this browser.",
        icon: "far fa-times-circle"
      });
    }
  }

  openSearchModel() {
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
  }
  newShiftmodalOpenStaff(type) {
    this.newShiftstaffSelectType = type;
    this.newShiftisSelectStaff = true;
    this.newShiftselectedStaff = [];
  }

  newShiftremoveSelStaff(type) {
    if (type == "paymentCharge") {
      this.newShiftpaymentOwnerId = 0;
      this.newShiftLocationChargeGroupForm.patchValue({
        paymentOwnerId: ""
      });
    } else if (type == "requestedBy") this.newShiftrequestedByID = 0;
    this.newShiftstaffid = null;
  }

  newShiftsaveShiftLocation() {
    this.newShiftsubmitted = true;
    this.newShiftifUpdateAddressSubmited = true;
    if (
      (this.newShiftshiftLocationDTO.shiftPartnerid === "" &&
        this.newShiftisBranchShiftLocation == false) ||
      (this.newShiftbranchID == 0 && this.newShiftisBranchShiftLocation) ||
      this.newShiftLocationChargeGroupForm.value.price <
        this.newShiftLocationChargeGroupForm.value.actualprice ||
      this.newShiftrequestedByID == 0 ||
      this.newShiftpresentGroupForm.invalid
    ) {
      return this;
    }

    if (this.newShiftLocationChargeGroupForm.valid) {
      if (this.newShiftLocationChargeGroupForm.value.type == "Recurring") {
        this.newShiftLocationChargeGroupForm.value.billingCycle = 1;
      }
      this.newShiftshiftLocationDTO.addressDetails = this.newShiftpresentGroupForm.getRawValue();
      this.newShiftshiftLocationDTO.custChargeOverrideDTO = {
        billableCustomerId: this.newShiftLocationChargeGroupForm.value.billableCustomerId,
        custChargeDetailsPojoList: [this.newShiftLocationChargeGroupForm.value],
        custid: this.customerId,
        paymentOwnerId: this.newShiftLocationChargeGroupForm.value.paymentOwnerId
      };
      this.newShiftshiftLocationDTO.popid = this.newShiftLocationPopId;
      this.newShiftshiftLocationDTO.oltid = this.newShiftLocationOltId;
      this.newShiftshiftLocationDTO.requestedById = this.newShiftrequestedByID;
      this.newShiftshiftLocationDTO.branchID = this.newShiftbranchID;
      if (this.newShiftshiftLocationDTO.shiftPartnerid === "") {
        this.newShiftshiftLocationDTO.shiftPartnerid = 1;
      }
      if (this.newShiftshiftLocationDTO.branchID == 0 || !this.newShiftisBranchShiftLocation) {
        this.newShiftshiftLocationDTO.branchID = null;
      }
      if (this.newShiftshiftLocationDTO.popid == 0) {
        this.newShiftshiftLocationDTO.popid = null;
      }

      // const url = "/balanceAndCommissionInfoForShiftLocation/" + this.customerId;
      // this.revenueManagementService.getMethod(url).subscribe(
      //     (response: any) => {
      // console.log("response ::::::::: ", response);
      this.newShiftshiftLocationDTO.isInvoiceCleared = true;
      this.newShiftshiftLocationDTO.transferableCommission = 0;
      this.newShiftshiftLocationDTO.transferableBalance = 0;
      const url = "/shiftCustomerLocation/" + this.customerId;
      this.commondropdownService.postMethod(url, this.newShiftshiftLocationDTO).subscribe(
        (response: any) => {
          $("#openAddressForm").modal("hide");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Shift customer location successfully.",
            icon: "far fa-check-circle"
          });
          this.newShiftgetCustomersDetail(this.customerId);
          this.newShiftgetNewCustomerAddressForCustomer();
          this.newShiftcloseShiftLocation();
        },
        (error: any) => {
          if (error.error.status == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
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
      // },
      //     (error: any) => {
      //         this.messageService.add({
      //             severity: "error",
      //             summary: "Error",
      //             detail: error.error.ERROR,
      //             icon: "far fa-times-circle"
      //         });
      //     }
      // );
    }
    // this.closeShiftLocation();
  }
  newShiftgetCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      if (this.custData.serviceareaid) {
        this.newShiftisServiceInShiftLocation = true;
        this.newShiftshiftLocationDTO.updateAddressServiceAreaId = this.custData.serviceareaid;
        this.newShiftLocationPopId = this.custData.popid;
        this.newShiftLocationOltId = this.custData.oltid;
        this.newShiftgetPartnerAllByServiceArea(this.custData.serviceareaid);
        this.newShiftbranchByServiceAreaID(this.custData.serviceareaid);
        this.newShiftgetWalletData(custId);
        // let serviceAreaId = {
        //     value: Number(this.custData.serviceareaid)
        // };
        var customerAddress = this.custData.addressList.find(address => address.version === "NEW");
        this.viewcustomerListData = customerAddress;
        if (customerAddress.addressType) {
          // this.newShiftselServiceArea(serviceAreaId, false);
          // const data = {
          //     value: Number(customerAddress.pincodeId)
          // };
          // this.newShiftselectPINCODEChange(data, "");
          this.newShiftgetAreaData(customerAddress.areaId, "present");
          this.newShiftpresentGroupForm.patchValue(customerAddress);

          this.newShiftselServiceAreaByParent(Number(this.custData.serviceareaid));
          const data = {
            value: Number(customerAddress.pincodeId)
          };
          this.newShiftselectPINCODEChange(data, "");
          this.newShiftpresentGroupForm.patchValue({
            pincodeId: Number(customerAddress.pincodeId)
          });
          let subAreaEvent = {
            value: customerAddress.subareaId
          };
          this.newShiftonChangeSubArea(subAreaEvent, "present");
        }
        this.newShiftbranchID = this.custData.branch;
      }
      if (this.custData.partnerid) {
        this.newShiftshiftLocationDTO.shiftPartnerid = this.custData.partnerid;
      }
      this.newShiftshiftLocationDTO.isPermanentAddress = false;
      this.newShiftshiftLocationDTO.isPaymentAddresSame = false;

      this.newShiftpresentGroupForm.patchValue(customerAddress);

      this.newShiftstaffSelectList = [];
    });
  }
  newShiftselServiceAreaByParent(id) {
    const serviceAreaId = id;
    this.newShiftpincodeDD = [];
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          let serviceAreaData = response.data;
          serviceAreaData.pincodes.forEach(element => {
            this.commondropdownService.allpincodeNumber.forEach(e => {
              if (e.pincodeid == element) {
                this.newShiftpincodeDD.push(e);
              }
            });
          });
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
  newShiftselectPINCODEChange(_event: any, index: any) {
    // const url = "/area/pincode?pincodeId=" + _event.value;
    // this.adoptCommonBaseService.get(url).subscribe(
    //     (response: any) => {
    //         this.newShiftAreaListDD = response.areaList;
    //     },
    //     (error: any) => {
    //         console.log(error);
    //     }
    // );
    if (_event.value) {
      const url = "/area/pincode?pincodeId=" + _event.value;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.newShiftAreaListDD = response.areaList;
          if (_event.value) {
            let url = "/pincode/getServicAreaIdByPincode?pincodeid=" + _event.value;
            this.adoptCommonBaseService.get(url).subscribe(
              (res: any) => {
                if (res.data != null) {
                  // this.getBranchByServiceAreaID(response.data);
                  // this.getPlanbyServiceArea(response.data);
                  if (!this.newShiftshiftLocationDTO.serviceareaid) {
                    let serviceAreaId = {
                      value: Number(res.data)
                    };
                    this.newShiftselServiceArea(serviceAreaId, false);
                    this.newShiftshiftLocationDTO.serviceareaid = res.data;
                  }
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
      let building_url =
        "/buildingmgmt/getBuildingMgmt?entityname=" +
        this.selectedMappingFrom +
        "&entityid=" +
        _event.value;
      this.adoptCommonBaseService.get(building_url).subscribe(
        (response: any) => {
          if (response.dataList?.length > 0) {
            this.newShiftbuildingListDD = response.dataList;
          } else {
            this.newShiftbuildingListDD = [];
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
    // this.getpincodeData(_event.value, index);
  }

  newShiftgetWalletData(custID) {
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
    this.revenueManagementService.postMethod(url, data).subscribe((response: any) => {
      this.newShiftwalletValue = response.customerWalletDetails;
      if (this.newShiftwalletValue >= 0) {
        this.newShiftdueValue = 0;
      } else {
        this.newShiftdueValue = Math.abs(this.newShiftwalletValue);
      }
    });
  }

  newShiftreassignWorkflow() {
    this.newShiftassignDocSubmitted = false;
    this.newShiftremark = this.newShiftassignDocForm.value.remark;
    let url: any;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.newShiftassignedShiftLocationid}&eventName=SHIFT_LOCATION&assignToStaffId=${this.newShiftselectStaff}&remark=${this.newShiftremark}`;

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        $("#reAssignPLANModal").modal("hide");
        //  this.getAll();
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigned to the next staff successfully.",
            icon: "far fa-times-circle"
          });
        }
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  newShiftselectedStaffChange(selectedStaff) {
    this.newShiftstaffCustList.push({
      id: Number(selectedStaff.id),
      name: selectedStaff.firstname
    });
    this.newShiftisSelectStaff = false;
    if (this.newShiftstaffSelectType == "paymentCharge") {
      this.newShiftpaymentOwnerId = Number(selectedStaff.id);
      this.newShiftLocationChargeGroupForm.patchValue({
        paymentOwnerId: Number(selectedStaff.id)
      });
    } else if (this.newShiftstaffSelectType == "requestedBy")
      this.newShiftrequestedByID = Number(selectedStaff.id);
    this.newShiftstaffSelectType = "";
  }

  newShiftcloseStaff() {
    this.newShiftisSelectStaff = false;
    this.newShiftstaffSelectType = "";
  }

  async newShiftselectedCustChange(event) {
    this.newShiftshowParentCustomerModel = false;
    this.newShiftselectedParentCust = event;
    if (this.newShiftparentCustomerDialogType === "billable-shift-location") {
      this.newShiftbillableCustList = [
        {
          id: this.newShiftselectedParentCust.id,
          name: this.newShiftselectedParentCust.name
        }
      ];
      this.newShiftLocationChargeGroupForm.patchValue({
        billableCustomerId: this.newShiftselectedParentCust.id
      });
    }
  }
  newShiftcloseParentCust() {
    this.newShiftshowParentCustomerModel = false;
  }

  newShiftcloseParentCustt() {
    this.newShiftifModelIsShow = false;
  }
  searchLocation() {
    if (this.searchLocationForm.valid) {
      const url =
        "/serviceArea/getPlaceId?query=" + this.searchLocationForm.value.searchLocationname.trim();
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.searchLocationData = response.locations;
        },
        (error: any) => {
          if (error.error.code == 422) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.error,
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
  }
  clearLocationForm() {
    this.searchLocationForm.reset();
    this.searchLocationData = [];
  }

  filedLocation(placeId) {
    const url = "/serviceArea/getLatitudeAndLongitude?placeId=" + placeId;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.ifsearchLocationModal = false;
        // this.customerDetailData.patchValue({
        //   latitude: response.location.latitude,
        //   longitude: response.location.longitude
        // });
        this.newShiftpresentGroupForm.patchValue({
          latitude: response.location.latitude,
          longitude: response.location.longitude
        });
        this.iflocationFill = true;
        this.closebutton.nativeElement.click();
        this.searchLocationData = [];
        this.searchLocationForm.reset();
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedSearchLocationList(currentPage) {
    this.currentPagesearchLocationList = currentPage;
  }

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
    this.searchLocationForm.reset();
  }

  getCustomer() {
    // this.displayRecordPaymentDialog = true;
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    const custerlist = {};
    this.recordPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        this.paymentFormGroup.patchValue({
          customerid: this.customerIdRecord
        });
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
  getServiceByBranch(e) {
    this.branchId = e.value;
    this.serviceareaCheck = false;
    const url = "/findServiceAreaByBranchId?BranchId=" + this.branchId;
    this.adoptCommonBaseService.getConnection(url).subscribe((response: any) => {
      this.serviceAreaList = response.serviceAreaList;
      //$("#PlanDetailsShow").modal("show");
    });
  }
}
