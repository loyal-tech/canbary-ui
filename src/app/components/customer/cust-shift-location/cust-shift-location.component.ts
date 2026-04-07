import { status } from "./../../../RadiusUtils/RadiusConstants";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { PartnerService } from "src/app/service/partner.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
export declare var $: any;
@Component({
  selector: "app-cust-shift-location",
  templateUrl: "./cust-shift-location.component.html",
  styleUrls: ["./cust-shift-location.component.css"]
})
export class CustShiftLocationComponent implements OnInit {
  loggedInStaffId = localStorage.getItem("userId");
  custData: any = {};
  customerId = 0;
  custType: string = "";

  AclClassConstants;
  AclConstants;

  countryTitle = RadiusConstants.COUNTRY;
  cityTitle = RadiusConstants.CITY;
  stateTitle = RadiusConstants.STATE;
  pincodeTitle = RadiusConstants.PINCODE;
  areaTitle = RadiusConstants.AREA;
  subareaTitle = RadiusConstants.SUBAREA;
  buildingTitle = RadiusConstants.BUILDING;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;

  approvableStaff: any = [];
  oltDevices = [];
  spliterDevices = [];
  masterDbDevices = [];
  partnerList = [];
  pincodeDD: any = [];
  partnerListByServiceArea: any = [];
  staffList: any = [];
  branchData: any = [];
  AreaListDD: any = [];
  areaDetails: any = [];
  staffSelectList: any = [];
  billableCustList: any = [];
  selectedParentCust: any = [];
  assignShiftLocationData: any = [];
  approveInventoryData = [];
  rejectInventoryData = [];
  shiftLocationFlagType = "";
  AppRjecHeader = "";

  assignedShiftLocationid: any;
  newCustomerAddressDataForCustometr: any;
  selectStaff: any;
  requestedByID: number;
  paymentOwnerId: number;
  shiftLocationPopId: number;
  shiftLocationOltId: number;
  branchID: number = 0;
  walletValue: number;
  prepaid: any;
  dueValue: number;
  parentCustomerDialogType: any = "";
  customerSelectType: any = "";
  staffSelectType = "";
  approveId: any;
  selectStaffReject: any;

  shiftlocationFormRemark: FormGroup;
  shiftLocationChargeGroupForm: FormGroup;
  presentGroupForm: FormGroup;
  assignAppRejectShiftLocationForm: FormGroup;

  approved = false;
  reject = false;
  serviceAreaDisable = false;
  isBranchAvailable = false;
  isBranchShiftLocation = false;
  isServiceInShiftLocation: boolean = false;
  submitted = false;
  selectPincodeList = false;
  showParentCustomerModel = false;
  ifUpdateAddressSubmited = false;
  assignShiftLocationsubmitted = false;
  rejectCustomerInventoryModal: boolean = false;
  rejectApproveShiftLocationModal: boolean = false;
  selectedStaff: any = [];
  staffCustList = [];
  isSelectStaff: boolean = false;
  staffid;

  currentDate = new Date();
  selectchargeValueShow = false;

  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });

  chargeType = [{ label: "One-time" }];
  shiftLocationDTO: any = {
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
  displayShiftLocationDetails: boolean = false;
  addShiftLocationAccess: boolean = false;
  ifModelIsShow: boolean = false;
  prepaidValue: number;
  assignDocSubmitted: boolean;
  remark: any;
  assignDocForm: any;
  paymentareaDetails: any;
  selectPincodeListPayment: boolean = false;
  permanentareaDetails: any;
  selectPincodeListPermanent: boolean = false;
  selectedMappingFrom: string;
  buildingListDD: any = [];
  subAreaListDD: any = [];
  buildingNoDD: any = [];
  viewcustomerListData: any;
  assignShiftLocation: any;
  searchStaffDeatil: any;
  approveInventory: any[];
  disableShiftButton: boolean = false;
  selectedChangeStaff: any;
  iflocationFill = false;
  ifsearchLocationModal = false;
  searchLocationForm: FormGroup;
  searchLocationData: any;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: String;
  currentPagesearchLocationList = 1;
  @ViewChild("closebutton") closebutton;
  shiftLocationMsg: string;
  isDisplayShiftLocationMsg: boolean = false;
  isFreeShift: boolean = false;
  reAssignPLANModal: boolean = false;
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
    public loginService: LoginService,
    private networkdeviceService: NetworkdeviceService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public commondropdownService: CommondropdownService,
    public partnerService: PartnerService,
    public serviceAreaService: ServiceAreaService,
    public revenueManagementService: RevenueManagementService,
    public statusCheckService: StatusCheckService,
    private systemService: SystemconfigService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.addShiftLocationAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_SHIFT_LOCATION_ADD
        : POST_CUST_CONSTANTS.POST_CUST_SHIFT_LOCATION_ADD
    );

    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.shiftLocationChargeGroupForm = this.fb.group({
      chargeid: ["", Validators.required],
      price: ["", Validators.required],
      actualprice: ["", Validators.required],
      charge_date: ["", Validators.required],
      type: ["", Validators.required],
      discount: [""],
      billingCycle: [""],
      id: [""],
      billableCustomerId: [""],
      paymentOwnerId: ["", Validators.required]
    });
    this.presentGroupForm = this.fb.group({
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
    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });
    this.assignAppRejectShiftLocationForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.assignDocForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.getpartnerAll();
    // if (this.statusCheckService.isActiveInventoryService) {
    //   this.commondropdownService.getPOPList();
    // }
    this.commondropdownService.getCityList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCountryList();
    // this.commondropdownService.getChargeTypeByList();
    // this.commondropdownService.getChargeTypeByList();
    // this.commondropdownService.getAllPinCodeNumber();
    this.commondropdownService.getAllPinCodeData();
    this.getNewCustomerAddressForCustomer();
    if (history.state.data) {
      this.custData = history.state.data;
      if (this.custData.serviceareaid) {
        this.isServiceInShiftLocation = true;
        this.shiftLocationDTO.updateAddressServiceAreaId = this.custData.serviceareaid;
        this.shiftLocationPopId = this.custData.popid;
        this.shiftLocationOltId = this.custData.oltid;

        this.getPartnerAllByServiceArea(this.custData.serviceareaid);
        this.branchByServiceAreaID(this.custData.serviceareaid);
        // let serviceAreaId = {
        //     value: Number(this.custData.serviceareaid)
        // };
        // this.selServiceArea(serviceAreaId, false);
        var customerAddress = this.custData.addressList.find(address => address.version === "NEW");
        // // this.getStaffDetailById(customerData.serviceareaid)
        // const data = {
        //     value: Number(customerAddress.pincodeId)
        // };
        // this.selectPINCODEChange(data, "");
        if (customerAddress.addressType) {
          this.shiftLocationDTO.updateAddressServiceAreaId = customerAddress.serviceareaid;
          this.getAreaData(customerAddress.areaId, "present");
          this.presentGroupForm.patchValue(customerAddress);

          this.selServiceAreaByParent(Number(this.custData.serviceareaid));
          const data = {
            value: this.viewcustomerListData.pincodeId
          };

          this.selectPINCODEChange(data, "");
          this.presentGroupForm.patchValue({
            pincodeId: Number(this.viewcustomerListData.pincodeId)
          });
          let subAreaEvent = {
            value: this.viewcustomerListData.subareaId
          };

          this.onChangeSubArea(subAreaEvent, "present");
        }

        this.branchID = this.custData.branch;
      }
      if (this.custData.partnerid) {
        this.shiftLocationDTO.shiftPartnerid = this.custData.partnerid;
      }
      this.shiftLocationDTO.isPermanentAddress = false;
      this.shiftLocationDTO.isPaymentAddresSame = false;

      this.presentGroupForm.patchValue(customerAddress);

      this.staffSelectList = [];
    } else this.getCustomersDetail(this.customerId);

    this.shiftlocationFormRemark = this.fb.group({
      remark: [""]
    });

    // this.getAllPinCodeData();
    // this.getALLAreaData();
    // this.getAllSubAreaData();
    this.getMappingFrom();
  }

  getAllPinCodeData() {
    this.pincodeDD = [];
    const url = "/pincode/getAll";
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.pincodeDD = response.dataList;
      },
      (error: any) => {}
    );
  }

  getALLAreaData() {
    this.AreaListDD = [];
    const url = "/area/all";
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.AreaListDD = response.dataList;
      },
      (error: any) => {}
    );
  }

  getAllSubAreaData() {
    this.subAreaListDD = [];
    const url = "/subarea/all";
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        if (response.dataList) {
          // Map the response to add '(UnderDeveloped)' for relevant items
          this.subAreaListDD = response.dataList.map((item: any) => ({
            id: item.id,
            name: item.name,
            isUnderDevelopment: item.status === "UnderDevelopment"
          }));
        }
        // this.subAreaListDD = response.dataList;
      },
      (error: any) => {}
    );
  }

  getMappingFrom() {
    const url = "/buildingRefrence/all";
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        let dunningData = response.dataList;
        if (dunningData?.length > 0) {
          this.selectedMappingFrom = dunningData[0].mappingFrom;
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

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.custData?.mvnoId
          : localStorage.getItem("mvnoId");
      const serviceArea = localStorage.getItem("serviceArea");
      let serviceAreaArray = JSON.parse(serviceArea);
      if (serviceAreaArray.length !== 0) {
        this.commondropdownService.filterserviceAreaList(mvnoId);
      } else {
        this.commondropdownService.getserviceAreaList(mvnoId);
      }
      let currency;
      this.custData?.currency
        ? (currency = this.custData?.currency)
        : this.systemService
            .getConfigurationByName("CURRENCY_FOR_PAYMENT")
            .subscribe((res: any) => {
              currency = res.data.value;
              this.commondropdownService.getChargeTypeByList("", currency, mvnoId);
            });
      this.commondropdownService.getChargeTypeByList("", currency, mvnoId);
      if (this.custData.serviceareaid) {
        this.isServiceInShiftLocation = true;
        // this.shiftLocationDTO.updateAddressServiceAreaId = this.custData.serviceareaid;
        this.shiftLocationPopId = this.custData.popid;
        this.shiftLocationOltId = this.custData.oltid;
        // this.getPartnerAllByServiceArea(this.custData.serviceareaid);
        // this.branchByServiceAreaID(this.custData.serviceareaid);
        this.getWalletData(custId);
        // let serviceAreaId = {
        //     value: Number(this.custData.serviceareaid)
        // };
        // this.selServiceArea(serviceAreaId, false);
        var customerAddress = this.custData.addressList.find(address => address.version === "NEW");
        this.viewcustomerListData = customerAddress;
        if (customerAddress.addressType) {
          this.shiftLocationDTO.updateAddressServiceAreaId = customerAddress.serviceareaid;
          this.getAreaData(customerAddress.areaId, "present");
          this.presentGroupForm.patchValue(customerAddress);

          this.selServiceAreaByParent(Number(this.custData.serviceareaid));
          const data = {
            value: this.viewcustomerListData.pincodeId
          };

          this.selectPINCODEChange(data, "");
          this.presentGroupForm.patchValue({
            pincodeId: Number(this.viewcustomerListData.pincodeId)
          });
          let subAreaEvent = {
            value: this.viewcustomerListData.subareaId
          };

          this.onChangeSubArea(subAreaEvent, "present");
        }

        this.branchID = this.custData.branch;
      }
      if (this.custData.partnerid) {
        this.shiftLocationDTO.shiftPartnerid = this.custData.partnerid;
      }
      this.shiftLocationDTO.isPermanentAddress = false;
      this.shiftLocationDTO.isPaymentAddresSame = false;

      this.presentGroupForm.patchValue(customerAddress);

      this.staffSelectList = [];
      this.requestedByID = Number(localStorage.getItem("userId"));
    });
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
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
    this.revenueManagementService.postMethod(url, data).subscribe((response: any) => {
      this.walletValue = response.customerWalletDetails;
      if (this.walletValue >= 0) {
        this.dueValue = 0;
      } else {
        this.dueValue = Math.abs(this.walletValue);
      }
    });
  }

  getpartnerAll() {
    const url = "/partner/all";
    this.partnerService.getMethodNew(url).subscribe(
      (response: any) => {
        this.partnerList = response.partnerlist.filter(item => item.id != 1);
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

  getNewCustomerAddressForCustomer(): void {
    const url = "/newcustomeraddress/" + this.customerId;
    this.customerManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.newCustomerAddressDataForCustometr = res.newcustomerAddress;
        if (this.newCustomerAddressDataForCustometr?.length > 0)
          this.disableShiftButton = this.newCustomerAddressDataForCustometr.some(
            item => item.version === "IN_TRANSIT"
          );
      },
      (error: any) => {}
    );
  }

  getNetworkDevicesByType(deviceType) {
    const url = "/NetworkDevice/getNetworkDevicesByDeviceType?deviceType=" + deviceType;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        switch (deviceType) {
          case "OLT":
            this.oltDevices = response.dataList;
            break;
          case "SN Splitter":
            this.spliterDevices = response.dataList;
            break;
          case "DN Splitter":
            this.spliterDevices = response.dataList;
            break;
          case "Master DB/DB":
            this.masterDbDevices = response.dataList;
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

  StaffReasignListShiftLocation(data) {
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=SHIFT_LOCATION`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedShiftLocationid = data.id;
        this.approvableStaff = [];
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
          this.approvableStaff = response.dataList;
          this.approved = true;
          this.reAssignPLANModal = true;
        } else {
          this.reAssignPLANModal = false;
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

  reassignWorkflowShiftLocation() {
    let url: any;
    // this.remark = this.shiftlocationFormRemark.value.remark;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignedShiftLocationid}&eventName=SHIFT_LOCATION&assignToStaffId=${this.selectStaff}&remark=${this.shiftlocationFormRemark.value.remark}`;

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        $("#reAssignSHIFTLOCATIONModal").modal("hide");
        // this.getcustomerList("");
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          // this.getcustomerList("");
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

  selServiceArea(event, isFromUI) {
    if (isFromUI) {
      this.pincodeDD = [];
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
                  this.pincodeDD.push(e);
                }
              });
              // this.pincodeDD.push(this.commondropdownService.allpincodeNumber.filter((e)=>e.pincodeid==element))
            });
          }

          // if (!this.iscustomerEdit) {
          if (isFromUI) {
            this.presentGroupForm.reset();
            this.presentGroupForm.markAllAsTouched();
          }
          // }
          // this.getAreaData(this.serviceAreaData.areaid, "present");
        },
        (error: any) => {}
      );
      this.getPartnerAllByServiceArea(serviceAreaId);
      //   this.getStaffUserByServiceArea(serviceAreaId);
      this.branchByServiceAreaID(serviceAreaId);
      this.getStaffUserByServiceArea(serviceAreaId);
      this.shiftLocationDTO.shiftPartnerid = "";
    }
  }

  getPartnerAllByServiceArea(serviceAreaId) {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");

    const url = "/getPartnerByServiceAreaId/" + serviceAreaId + "?mvnoId=" + mvnoId;
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.partnerListByServiceArea = response.partnerList.filter(item => item.id != 1);
        // console.log("partnerList", response);
      },
      (error: any) => {}
    );
  }

  getStaffUserByServiceArea(ids) {
    let data = [];
    data.push(ids);
    let url = "/staffsByServiceAreaId/" + ids;
    this.serviceAreaService.getMethod(url).subscribe((response: any) => {
      //
      this.staffList = response.dataList;
    });
  }

  branchByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    let url = "/branchManagement/getAllBranchesByServiceAreaId?mvnoId=" + mvnoId;
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      if (this.branchData != null && this.branchData.length > 0) {
        this.isBranchShiftLocation = true;
        this.branchID = response.dataList[0].id;
        // this.isBranchAvailable = true;
      } else {
        this.isBranchShiftLocation = false;
        // this.isBranchAvailable = false;
      }
    });
  }

  selectPINCODEChange(_event: any, index: any) {
    // const url = "/area/pincode?pincodeId=" + _event.value;
    // this.adoptCommonBaseService.get(url).subscribe(
    //     (response: any) => {
    //         this.AreaListDD = response.areaList;
    //     },
    //     (error: any) => {
    //         console.log(error);
    //     }
    // );
    // // this.getpincodeData(_event.value, index);
    if (_event.value) {
      const url = "/area/pincode?pincodeId=" + _event.value;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.AreaListDD = response.areaList;
          if (_event.value) {
            let url = "/pincode/getServicAreaIdByPincode?pincodeid=" + _event.value;
            this.adoptCommonBaseService.get(url).subscribe(
              (res: any) => {
                if (res.data != null) {
                  // this.getBranchByServiceAreaID(response.data);
                  // this.getPlanbyServiceArea(response.data);
                  if (!this.shiftLocationDTO.updateAddressServiceAreaId) {
                    let serviceAreaId = {
                      value: Number(res.data)
                    };
                    this.selServiceArea(serviceAreaId, false);
                    this.shiftLocationDTO.updateAddressServiceAreaId = res.data;
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
            this.buildingListDD = response.dataList;
          } else {
            this.buildingListDD = [];
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

  selectAreaChange(_event: any, index: any) {
    this.getAreaData(_event.value, index);
  }

  getAreaData(id: any, index: any) {
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
                  if (!this.shiftLocationDTO.updateAddressServiceAreaId) {
                    this.shiftLocationDTO.updateAddressServiceAreaId = res.data;
                    // this.getBranchByServiceAreaID(res.data);
                    let serviceAreaId = {
                      value: Number(res.data)
                    };
                    this.selServiceArea(serviceAreaId, false);
                  }
                }

                if (index === "present") {
                  this.areaDetails = response.data;

                  this.selectPincodeList = true;

                  this.presentGroupForm.patchValue({
                    addressType: "Present",
                    areaId: Number(this.areaDetails.id),
                    pincodeId: Number(this.areaDetails.pincodeId),
                    cityId: Number(this.areaDetails.cityId),
                    stateId: Number(this.areaDetails.stateId),
                    countryId: Number(this.areaDetails.countryId)
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
                  this.buildingListDD = response.dataList;
                } else {
                  this.buildingListDD = [];
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
          if (subarea.dataList) {
            // Map the response to add '(UnderDeveloped)' for relevant items
            this.subAreaListDD = subarea.dataList.map((item: any) => ({
              id: item.id,
              name: item.name,
              isUnderDevelopment: item.status === "UnderDevelopment"
            }));
          }
          // this.subAreaListDD = subarea.dataList;
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

  onChangeSubArea(_event: any, index: any) {
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
                        if (!this.shiftLocationDTO.updateAddressServiceAreaId) {
                          this.shiftLocationDTO.updateAddressServiceAreaId = res.data;
                          let serviceAreaId = {
                            value: Number(res.data)
                          };
                          this.selServiceArea(serviceAreaId, false);
                        }
                      }
                      if (index === "present") {
                        this.areaDetails = response.data;

                        this.selectPincodeList = true;

                        this.presentGroupForm.patchValue({
                          addressType: "Present",
                          areaId: Number(this.areaDetails.id),
                          pincodeId: Number(this.areaDetails.pincodeId),
                          cityId: Number(this.areaDetails.cityId),
                          stateId: Number(this.areaDetails.stateId),
                          countryId: Number(this.areaDetails.countryId)
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
                        this.buildingListDD = response.dataList;
                        // if (this.iscustomerEdit) {
                        let buildingEvent = {
                          value: Number(this.viewcustomerListData.building_mgmt_id)
                        };
                        this.onChangeBuildingArea(buildingEvent, "");
                        // }
                      } else {
                        this.buildingListDD = [];
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

  onChangeBuildingArea(_event: any, index: any) {
    if (_event.value) {
      this.buildingNoDD = [];
      const url = "/buildingmgmt/getBuildingMgmtNumbers?buildingMgmtId=" + _event.value;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.buildingNoDD = response.dataList.map(buildingNumber => ({ buildingNumber }));
          // if (this.iscustomerEdit) {
          this.presentGroupForm.patchValue({
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

  openShiftLocationForm() {
    this.callCheckShiftLocation();
  }

  callCheckShiftLocation() {
    const url = "/vasplan/checkShiftLocation?custId=" + this.customerId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        let isAllow = response.isAllowed;
        this.isFreeShift = isAllow;
        this.shiftLocationMsg = response.msg;
        this.isDisplayShiftLocationMsg = true;
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

  clickToProceed() {
    if (this.isFreeShift) {
      this.displayShiftLocationDetails = true;
      this.getNetworkDevicesByType("OLT");
      this.shiftLocationChargeGroupForm.reset();
      this.getCustomersDetail(this.customerId);
      this.staffCustList = [];
      this.staffCustList.push({
        id: Number(localStorage.getItem("userId")),
        name: localStorage.getItem("loginUserName")
      });
      this.shiftLocationChargeGroupForm.patchValue({
        paymentOwnerId: Number(localStorage.getItem("userId"))
      });
      this.shiftLocationChargeGroupForm.get("chargeid").clearValidators();
      this.shiftLocationChargeGroupForm.get("price").clearValidators();
      this.shiftLocationChargeGroupForm.get("actualprice").clearValidators();
      this.shiftLocationChargeGroupForm.get("type").clearValidators();
      this.shiftLocationChargeGroupForm.get("paymentOwnerId").clearValidators();
      this.shiftLocationChargeGroupForm.get("charge_date").clearValidators();
      this.shiftLocationChargeGroupForm.get("chargeid").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("price").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("actualprice").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("type").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("paymentOwnerId").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("charge_date").updateValueAndValidity();
    } else {
      this.displayShiftLocationDetails = true;
      //   this.getNetworkDevicesByType("OLT");
      this.shiftLocationChargeGroupForm.reset();
      this.getCustomersDetail(this.customerId);
      this.staffCustList = [];
      this.staffCustList.push({
        id: Number(localStorage.getItem("userId")),
        name: localStorage.getItem("loginUserName")
      });
      this.shiftLocationChargeGroupForm.patchValue({
        paymentOwnerId: Number(localStorage.getItem("userId"))
      });
      this.requestedByID = Number(localStorage.getItem("userId"));
      this.shiftLocationChargeGroupForm.get("chargeid").setValidators([Validators.required]);
      this.shiftLocationChargeGroupForm.get("price").setValidators([Validators.required]);
      this.shiftLocationChargeGroupForm.get("actualprice").setValidators([Validators.required]);
      this.shiftLocationChargeGroupForm.get("type").setValidators([Validators.required]);
      this.shiftLocationChargeGroupForm.get("paymentOwnerId").setValidators([Validators.required]);
      this.shiftLocationChargeGroupForm.get("charge_date").setValidators([Validators.required]);
      this.shiftLocationChargeGroupForm.get("chargeid").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("price").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("actualprice").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("type").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("paymentOwnerId").updateValueAndValidity();
      this.shiftLocationChargeGroupForm.get("charge_date").updateValueAndValidity();
    }
  }

  closeShiftLocationMsg() {
    this.isDisplayShiftLocationMsg = false;
  }

  modalOpenStaff(type) {
    this.staffSelectType = type;
    this.isSelectStaff = true;
    if (this.commondropdownService.isChangeStaff) {
      this.selectedStaff = [];
      this.selectedStaff.push({
        id: Number(this.selectedChangeStaff.id),
        name: this.selectedChangeStaff.username
      });
    } else {
      this.selectedStaff = [];
      this.selectedStaff.push({
        id: Number(localStorage.getItem("userId")),
        name: localStorage.getItem("loginUserName")
      });
    }
  }

  selectedStaffChange(selectedStaff) {
    this.selectedChangeStaff = selectedStaff;
    this.staffCustList.push({
      id: Number(selectedStaff.id),
      name: selectedStaff.username
    });
    this.isSelectStaff = false;
    if (this.staffSelectType == "paymentCharge") {
      this.paymentOwnerId = Number(selectedStaff.id);
      this.shiftLocationChargeGroupForm.patchValue({
        paymentOwnerId: Number(selectedStaff.id)
      });
    } else if (this.staffSelectType == "requestedBy") this.requestedByID = Number(selectedStaff.id);
    this.staffSelectType = "";
  }

  closeStaff() {
    this.isSelectStaff = false;
    this.staffSelectType = "";
  }

  removeSelStaff(type) {
    if (type == "paymentCharge") {
      this.paymentOwnerId = 0;
      this.shiftLocationChargeGroupForm.patchValue({
        paymentOwnerId: ""
      });
    } else if (type == "requestedBy") this.requestedByID = 0;
    this.staffid = null;
  }

  modalOpenParentCustomer(type) {
    this.parentCustomerDialogType = type;
    this.showParentCustomerModel = true;
    this.customerSelectType = "Billable To";
    if (type === "parent") {
      this.customerSelectType = "Parent";
    }
    this.selectedParentCust = [];
  }

  async selectedCustChange(event) {
    this.showParentCustomerModel = false;
    this.selectedParentCust = event;
    if (this.parentCustomerDialogType === "billable-shift-location") {
      this.billableCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.shiftLocationChargeGroupForm.patchValue({
        billableCustomerId: this.selectedParentCust.id
      });
    }
  }

  closeParentCust() {
    this.showParentCustomerModel = false;
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  removeSelParentCust(type) {
    this.selectedParentCust = [];
    this.billableCustList = [];
    this.shiftLocationChargeGroupForm.patchValue({
      billableCustomerId: null
    });
    this.isBranchAvailable = false;
  }

  selectcharge(_event: any, type) {
    const chargeId = _event.value;
    let viewChargeData;
    let date;

    date = this.currentDate.toISOString();
    const format = "yyyy-MM-dd";
    const locale = "en-US";
    const myDate = date;
    const formattedDate = formatDate(myDate, format, locale);
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/charge/" + chargeId + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      viewChargeData = response.chargebyid;
      this.selectchargeValueShow = true;
      this.shiftLocationChargeGroupForm.patchValue({
        actualprice: Number(viewChargeData.actualprice),
        price: Number(viewChargeData.actualprice),
        charge_date: formattedDate,
        type: "One-time"
      });
    });
  }

  selectTypecharge(e) {
    // this.chargeGroupForm.get("connection_no").reset();
    // this.chargeGroupForm.get("planid").reset();
    // this.chargeGroupForm.get("expiry").reset();
    // if (e.value == "Recurring") {
    //   // this.chargeGroupForm.get("billingCycle").setValidators([Validators.required]);
    //   // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    // } else {
    //   this.chargeGroupForm.value.billingCycle = 0;
    //   // this.chargeGroupForm.get("billingCycle").clearValidators();
    //   // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    // }
  }

  saveShiftLocation() {
    this.submitted = true;
    this.ifUpdateAddressSubmited = true;
    if (
      (this.shiftLocationDTO.shiftPartnerid === "" && this.isBranchShiftLocation == false) ||
      (this.branchID == 0 && this.isBranchShiftLocation) ||
      this.shiftLocationChargeGroupForm.value.price <
        this.shiftLocationChargeGroupForm.value.actualprice ||
      this.requestedByID == 0 ||
      this.presentGroupForm.invalid
    ) {
      return this;
    }

    if (this.shiftLocationChargeGroupForm.valid) {
      if (this.shiftLocationChargeGroupForm.value.type == "Recurring") {
        this.shiftLocationChargeGroupForm.value.billingCycle = 1;
      }
      if (
        this.shiftLocationChargeGroupForm.value.discount == null ||
        this.shiftLocationChargeGroupForm.value.discount == undefined ||
        this.shiftLocationChargeGroupForm.value.discount == ""
      ) {
        this.shiftLocationChargeGroupForm.value.discount = 0;
      }
      this.shiftLocationDTO.addressDetails = this.presentGroupForm.getRawValue();
      this.shiftLocationDTO.custChargeOverrideDTO = {
        billableCustomerId: this.shiftLocationChargeGroupForm.value.billableCustomerId,
        custChargeDetailsPojoList: [this.shiftLocationChargeGroupForm.value],
        custid: this.customerId,
        paymentOwnerId: this.shiftLocationChargeGroupForm.value.paymentOwnerId
      };
      this.shiftLocationDTO.popid = this.shiftLocationPopId;
      this.shiftLocationDTO.oltid = this.shiftLocationOltId;
      this.shiftLocationDTO.requestedById = this.requestedByID;
      this.shiftLocationDTO.branchID = this.branchID;
      if (this.shiftLocationDTO.shiftPartnerid === "") {
        this.shiftLocationDTO.shiftPartnerid = 1;
      }
      if (this.shiftLocationDTO.branchID == 0 || !this.isBranchShiftLocation) {
        this.shiftLocationDTO.branchID = null;
      }
      if (this.shiftLocationDTO.popid == 0) {
        this.shiftLocationDTO.popid = null;
      }

      //   const url = "/balanceAndCommissionInfoForShiftLocation/" + this.customerId;
      //   this.revenueManagementService.getMethod(url).subscribe(
      //     (response: any) => {
      //       console.log("response ::::::::: ", response);
      //       this.shiftLocationDTO.isInvoiceCleared = response.balanceAndCommissionInfo.isInvoiceClear;
      //       this.shiftLocationDTO.transferableCommission =
      //         response.balanceAndCommissionInfo.transferCommission;
      //       this.shiftLocationDTO.transferableBalance =
      //         response.balanceAndCommissionInfo.transferBalance;
      const url = "/shiftCustomerLocation/" + this.customerId;
      this.commondropdownService.postMethod(url, this.shiftLocationDTO).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Shift customer location successfully.",
            icon: "far fa-check-circle"
          });
          this.getCustomersDetail(this.customerId);
          this.getNewCustomerAddressForCustomer();
          this.closeShiftLocation();
          this.isDisplayShiftLocationMsg = false;
        },
        (error: any) => {
          if (error.error.status == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
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
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      };
      //   );
    }
    // this.closeShiftLocation();
  }

  closeShiftLocation() {
    this.submitted = false;
    this.ifUpdateAddressSubmited = false;
    this.shiftLocationChargeGroupForm.reset();
    this.presentGroupForm.reset();
    this.ifUpdateAddressSubmited = false;
    this.requestedByID = 0;
    this.branchID = 0;
    this.displayShiftLocationDetails = false;
  }

  pickModalOpen(data) {
    let name;
    let entityID;
    name = "SHIFT_LOCATION";
    entityID = data.id;
    let url = "/workflow/pickupworkflow?eventName=" + name + "&entityId=" + entityID;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.openCustomerAddress();
        this.getNewCustomerAddressForCustomer();

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

  shiftLocationRejected(data) {
    this.approveId = data.id;
    this.rejectApproveShiftLocationModal = true;
    this.assignShiftLocationData = data;
    this.shiftLocationFlagType = "Rejected";
    this.AppRjecHeader = "Reject";
    this.assignAppRejectShiftLocationForm.reset();
  }

  shiftLocationApproved(data) {
    this.approveId = data.id;
    this.rejectApproveShiftLocationModal = true;
    this.assignShiftLocationData = data;
    this.assignShiftLocation = this.assignShiftLocationData;
    this.shiftLocationFlagType = "approved";
    this.AppRjecHeader = "Approve ";
    this.assignAppRejectShiftLocationForm.reset();
  }

  closeDisplayShiftLocationDetails() {
    this.rejectApproveShiftLocationModal = false;
  }
  assignShiftLocation1: boolean = false;
  assignAddressApprove() {
    this.assignShiftLocationsubmitted = true;
    if (this.assignAppRejectShiftLocationForm.valid) {
      let url = "/approveCustomerAddress";

      let assignCAFData = {
        addressId: this.assignShiftLocationData.id,
        flag: this.shiftLocationFlagType,
        nextStaffId: 0,
        remark: this.assignAppRejectShiftLocationForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };

      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.rejectApproveShiftLocationModal = false;
          this.approveInventoryData = null;
          this.rejectInventoryData = null;
          if (response.result.dataList) {
            if (this.shiftLocationFlagType == "approved") {
              this.approved = true;
              this.approveInventoryData = response.result.dataList;
              this.approveInventory = this.approveInventoryData;
              this.assignShiftLocation1 = true;
              //   $("#assignCustomerInventoryModal").modal("show");
            } else {
              this.reject = true;
              this.rejectInventoryData = response.result.dataList;
              this.rejectCustomerInventoryModal = true;
            }
          } else {
            this.getNewCustomerAddressForCustomer();
          }
          this.assignAppRejectShiftLocationForm.reset();
          this.assignShiftLocationsubmitted = false;
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

  assignToStaff(flag) {
    let url: any;
    let name: string;
    name = "SHIFT_LOCATION";
    if (!this.selectStaff && !this.selectStaffReject) {
      url = `/teamHierarchy/assignEveryStaff?entityId=${this.approveId}&eventName=${name}&isApproveRequest=${flag}`;
    } else {
      if (flag) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
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
        this.assignShiftLocation1 = false;
        this.rejectCustomerInventoryModal = false;
        this.getNewCustomerAddressForCustomer();
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

  shiftWorkflow(data) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show("custauditWorkflowModal");
    this.auditcustid.next({
      auditcustid: data.id,
      checkHierachy: "SHIFT_LOCATION",
      planId: ""
    });
  }
  reassignWorkflow() {
    this.assignDocSubmitted = false;
    this.remark = this.assignDocForm.value.remark;
    let url: any;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignedShiftLocationid}&eventName=SHIFT_LOCATION&assignToStaffId=${this.selectStaff}&remark=${this.remark}`;

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.reAssignPLANModal = false;
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
  closeStaffModel(arg0: boolean) {
    this.assignShiftLocation1 = false;
  }

  selServiceAreaByParent(id) {
    const serviceAreaId = id;
    this.pincodeDD = [];
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          let serviceAreaData = response.data;
          serviceAreaData.pincodes.forEach(element => {
            this.commondropdownService.allpincodeNumber.forEach(e => {
              if (e.pincodeid == element) {
                this.pincodeDD.push(e);
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

  searchStaffByName() {
    if (this.searchStaffDeatil) {
      this.approveInventoryData = this.approveInventory.filter(
        staff =>
          staff.fullName.toLowerCase().includes(this.searchStaffDeatil.toLowerCase()) ||
          staff.username.toLowerCase().includes(this.searchStaffDeatil.toLowerCase())
      );
    } else {
      this.approveInventoryData = this.approveInventory;
    }
  }

  clearSearchForm() {
    this.searchStaffDeatil = "";
    this.approveInventoryData = this.approveInventory;
  }

  mylocation() {
    //
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.iflocationFill = true;
          this.presentGroupForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          this.presentGroupForm.updateValueAndValidity();
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

  filedLocation(placeId) {
    const url = "/serviceArea/getLatitudeAndLongitude?placeId=" + placeId;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.ifsearchLocationModal = false;

        this.presentGroupForm.patchValue({
          latitude: response.location.latitude,
          longitude: response.location.longitude
        });
        this.presentGroupForm.updateValueAndValidity();
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
  searchLocation() {
    if (this.searchLocationForm.valid) {
      const url =
        "/serviceArea/getPlaceId?query=" + this.searchLocationForm.value.searchLocationname;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.searchLocationData = response.locations;
        },
        (error: any) => {
          if (error.error.code == 422) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
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

  pageChangedSearchLocationList(currentPage) {
    this.currentPagesearchLocationList = currentPage;
  }

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
    this.searchLocationForm.reset();
  }

  openSearchModel() {
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
  }

  closeRessignModal() {
    this.reAssignPLANModal = false;
  }
}
