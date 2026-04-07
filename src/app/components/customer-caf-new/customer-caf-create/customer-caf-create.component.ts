import { ADDRESS } from "../../../RadiusUtils/RadiusConstants";
import { DatePipe, formatDate } from "@angular/common";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as FileSaver from "file-saver";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { countries } from "src/app/components/model/country";
import { CustomerManagements } from "src/app/components/model/customer";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { CountryManagementService } from "src/app/service/country-management.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { DeactivateService } from "src/app/service/deactivate.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { LocationService } from "src/app/service/location.service";
import { PincodeManagementService } from "src/app/service/pincode-management.service";
import { AreaManagementService } from "src/app/service/area-management.service";
import { BuildingManagementService } from "src/app/service/building-management.service";
import { PartnerService } from "src/app/service/partner.service";
import { Utils } from "src/app/utils/utils";

declare var $: any;

@Component({
  selector: "app-customer-caf-create",
  templateUrl: "./customer-caf-create.component.html",
  styleUrls: ["./customer-caf-create.component.scss"]
})
export class CustomerCafCreateComponent implements OnInit {
  customerVrn = RadiusConstants.CUSTOMER_VRN;
  customerNid = RadiusConstants.CUSTOMER_NID;
  custType: any;
  editCustId: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  AclClassConstants;
  AclConstants;
  custData: any = {};
  custLocationData: any = [];
  dateOfBirth: String;
  customerGroupForm: FormGroup;
  planCategoryForm: FormGroup;
  planGroupForm: FormGroup;
  presentGroupForm: FormGroup;
  paymentGroupForm: FormGroup;
  permanentGroupForm: FormGroup;
  planDataForm: FormGroup;
  chargeGroupForm: FormGroup;
  validityUnitFormGroup: FormGroup;
  ngbBirthcal: NgbDateStruct | any;
  payMappingListFromArray: FormArray;
  addressListFromArray: FormArray;
  paymentDetailsFromArray: FormArray;
  macGroupForm: FormGroup;
  macMapppingListFromArray: FormArray;
  overChargeListFromArray: FormArray;
  custMacMapppingListFromArray: FormArray;
  ipMapppingListFromArray: FormArray;
  plansArray: FormArray;
  validityUnitFormArray: FormArray;
  locationDataByPlan: any = [];
  iscustomerEdit = false;
  submitted = false;
  showPassword = false;
  calTypwDisable = false;
  isCustSubTypeCon = false;
  showParentCustomerModel = false;
  serviceareaCheck = true;
  serviceAreaDisable = false;
  parentFieldEnable = false;
  isBranchAvailable = false;
  isParantExpirenceEdit = false;
  selectAreaList = false;
  selectPincodeList = false;
  selectPincodeListPermanent = false;
  selectPincodeListPayment = false;
  iflocationFill = false;
  macsubmitted = false;
  ifsearchLocationModal = false;
  ifPlanGroup = false;
  ifcustomerDiscountField = false;
  ifplanisSubisuSelect = false;
  ifIndividualPlan = false;
  isTrialCheckDisable = false;
  plansubmitted = false;
  ifdiscounAllow = true;
  isSerialNumberShow: boolean = false;
  serialNumber: any;
  isProductRequired = false;
  parentBillday: number;

  currentPagesearchLocationList = 1;
  planTotalOffetPrice = 0;
  discountValue: any = 0;
  totalAddress = 0;

  _passwordType = "password";
  department = RadiusConstants.DEPARMENT;
  countries: any = countries;
  pincodeTitle = PINCODE;
  addressTitle = ADDRESS;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  areaTitle = AREA;
  subareaTitle = RadiusConstants.SUBAREA;
  buildingTitle = RadiusConstants.BUILDING;

  paymappingItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  payMappinftotalRecords = 0;
  currentPagePayMapping = 1;

  dunningRules: any;
  serviceAreaData: any;
  selectedParentCustId: any;
  departmentListData: any;
  planByServiceArea: any;
  planByPartner: any;
  areaDetails: any;
  pincodeDeatils: any;
  paymentareaDetails: any;
  permanentareaDetails: any;
  planGroupSelectedSubisu: any;
  planGroupSelected: any;
  plantypaSelectData: any;
  filterPlan: any;
  areaAvailableList: any;
  newSubisuPrice: any;
  finalOfferPrice: number;

  inputMobile = "";
  inputMobileSec = "";
  extendDays: any = "";
  trailbtnTypeSelect = "";
  customerSector = "";
  parentCustomerDialogType = "";
  customerSelectType = "";
  ipSubmitted = false;
  customerType: any[];
  customerSubType: any[];
  days = [];
  earlydays = [];
  staffList = [];
  parentCustList = [];
  billableCustList = [];
  pincodeDD: any = [];
  areaListDD: any;
  selectedParentCust: any = [];
  partnerListByServiceArea: any = [];
  serviceData: any = [];
  branchData: any = [];
  filterPlanData: any = [];
  planDropdownInChageData = [];
  discountValueStore: any = [];
  filterNormalPlanGroup = [];
  filterPartnerPlanGroup = [];
  isPartnerSelected: boolean = false;
  planListSubisu = [];
  planIds = [];
  planGroupMapingList: any = [];
  oltDevices = [];
  spliterDevices = [];
  masterDbDevices = [];

  dateTime = new Date();

  createcustomerData: CustomerManagements;
  searchLocationForm: FormGroup;
  ipManagementGroup: FormGroup;
  isWrongHouseholdId: boolean = false;
  macManagementGroup: FormGroup;

  celendarTypeData = [{ label: "English" }, { label: "Nepali" }];
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  customerTypeValue = [
    { label: "Customer", value: "customer" },
    { label: "Organization", value: "organization" }
  ];
  invoiceType = [
    { label: "Group", value: "Group" },
    { label: "Independent", value: "Independent" }
  ];
  parentExperience = [
    { label: "Single", value: "Single" },
    { label: "Actual", value: "Actual" }
  ];
  valleyType = [
    { label: "Inside Valley", value: "Inside Valley" },
    { label: "Outside valley", value: "Outside valley" }
  ];
  isInvoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];

  quotaSharableData = [
    { label: "shareable", value: "shareable" },
    { label: "individual", value: "individual" }
  ];
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  discountType: any = "One-time";
  serviceAreaList: any = [];
  defualtServiceArea: any = [];
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  showLocationMac: boolean = false;
  locationMacForm: FormGroup;
  overLocationMacArray = this.fb.array([]);
  macData: any = [];
  locationMacData: any = [];
  searchLocationData: any;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: String;
  billToData: any = [];
  isInvoiceTypeAlreadySelected: boolean = false;
  @ViewChild("closebutton") closebutton;
  customerMacCount: number = 0;
  selectMacRetentionUnit: any = [
    { label: "Hours", value: "HOURS" },
    { label: "Days", value: "DAY" }
  ];
  blockNoOptions: number[];
  isMobileAndEmailRequired: boolean = true;
  subAreaListDD: any[];
  buildingListDD: any[];
  buildingNoDD: any[];
  selectedMappingFrom: any;
  isCredentialMatch: boolean = false;
  demographicLabel: any;
  showLoginPassword = false;
  _loginPasswordType = "password";
  currency: any;
  servicePlanId: any;
  mvnoTitle = RadiusConstants.MVNO;
  mvnoId = Number(localStorage.getItem("mvnoId"));
  isAutoGeneratedPassword: boolean = true;
  isValidUsername: boolean = false;
  responseMessage: any;
  isMandatory: boolean = false;
  planAllData: any[];
  isInstallemnt: boolean = false;
  totalInstallments: any = [];
  totalInstallmentsLength: number;
  servicePackSubmitted: boolean;
  servicePackForm: FormGroup;
  overServicePackListFormArray: FormArray;
  overServicePackListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  overServicePackListtotalRecords: String;
  currentPageoverServicePackList = 1;
  offerPrice: number = 0;
  vasData: any;
  discountList: any = [];
  vasDataList: any[];
  planCurrency: any;
  isThisTumil: boolean = false;
  householdId: any = "";
  householdType: any = "residential";
  householdTypeOptions = [
    { label: "Residential", value: "residential" },
    { label: "Non-Residential", value: "non-residential" }
  ];
  AreaListDD: any;
  is_check_enable: boolean = true;
  viewcustomerListData: any = [];
  selectAreaListPayment: boolean = false;
  macSubmitted: boolean = false;
  dropdownOptions: any;
  partnerList: any;
  customerId: any;
  billingCycle: any;
  searchkey: string;
  DiscountValueStore: any[];
  selectAreaListPermanent: boolean = false;
  chargesubmitted: boolean = false;
  selectchargeValueShow = false;
  editCustomerId: any;
  householdData: any;
  planMappingData: any;
  FeasibilityOptions = [
    { label: "N/A", value: "N/A" },
    { label: "Feasibility At Booking", value: "Feasibility At Booking" }
  ];
  disabledDiscExpiryDate: boolean = false;
  isExpiredDate: boolean = false;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private route: ActivatedRoute,
    private router: Router,
    private networkdeviceService: NetworkdeviceService,
    private countryManagementService: CountryManagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private deactivateService: DeactivateService,
    private locationService: LocationService,
    public statusCheckService: StatusCheckService,
    private systemService: SystemconfigService,
    private pincodeManagementService: PincodeManagementService,
    private areaManagementService: AreaManagementService,
    private buildingMangementService: BuildingManagementService,
    public partnerService: PartnerService,
    private utils: Utils
  ) {
    this.custType = this.route.snapshot.paramMap.get("custType")!;
    this.editCustId = this.route.snapshot.paramMap.get("custId")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  async ngOnInit() {
    this.demographicLabel = RadiusConstants.DEMOGRAPHICDATA || [];
    if (this.editCustId != null) {
      this.iscustomerEdit = true;
    }
    this.macGroupForm = this.fb.group({
      macAddress: ["", Validators.required]
    });
    this.macManagementGroup = this.fb.group({
      macAddress: ["", [Validators.required]],
      custid: [""],
      custsermappingid: [""]
    });
    this.partnerId = Number(localStorage.getItem("partnerId"));
    if (this.custType == "Postpaid") {
      this.planDetailsCategory = this.planDetailsCategory.filter(cat => cat.value != "groupPlan");
    }
    this.initData();
    this.customerFormInit();
    this.commondropdownService.getTitle();
    // this.locationService.getAllActiveLocation().subscribe((response: any) => {
    //   this.locationDataByPlan = response.locationMasterList.map(location => ({
    //     name: location.name,
    //     locationMasterId: location.locationMasterId
    //   }));
    // });
    this.getAllLocation();
    const today = new Date();
    this.dateOfBirth = today.toISOString().split("T")[0];
    this.systemService.getConfigurationByName("HOUSE_HOLD_ID_VALIDATION").subscribe((res: any) => {
      this.isThisTumil = res.data.value === "true";
      console.log(this.isThisTumil);
      this.isAutoGeneratedPassword = true;
      if (this.isAutoGeneratedPassword) {
        if (this.isThisTumil) {
          const autoPassword = Math.random().toString(36).slice(-8);
          this.customerGroupForm.get("loginPassword")?.setValue(autoPassword);
        } else {
          this.customerGroupForm.get("loginPassword")?.setValue(null);
        }
        console.log("autoPass", this.customerGroupForm.get("loginPassword")?.value);
        if (!this.iscustomerEdit) {
          this.customerGroupForm.get("password")?.disable();
          this.customerGroupForm.get("password")?.clearValidators();
          this.customerGroupForm.get("password")?.updateValueAndValidity();
        }
        this.customerGroupForm.get("loginPassword")?.disable();
        this.customerGroupForm.get("loginPassword")?.markAsTouched();
        this.customerGroupForm.get("loginPassword")?.updateValueAndValidity();
      }
    });
    this.systemService.getConfigurationByName("IS_CHECKBOX_ENABLE").subscribe((res: any) => {
      if (res?.data?.value) {
        this.is_check_enable = res.data.value === "true";
      }
    });
  }

  canExit() {
    // if (!this.customerGroupForm.dirty) return true;
    // {
    //   return Observable.create((observer: Observer<boolean>) => {
    //     this.confirmationService.confirm({
    //       header: "Alert",
    //       message: "The filled data will be lost. Do you want to continue? (Yes/No)",
    //       icon: "pi pi-info-circle",
    //       accept: () => {
    //         observer.next(true);
    //         observer.complete();
    //       },
    //       reject: () => {
    //         observer.next(false);
    //         observer.complete();
    //       }
    //     });
    //     return false;
    //   });
    // }
    return this.utils.canExit(this.customerGroupForm.dirty);
  }

  getMappingFrom() {
    const url = "/buildingRefrence/all";
    this.buildingMangementService.getMethod(url).subscribe(
      (response: any) => {
        let dunningData = response.dataList;
        if (dunningData?.length > 0) {
          this.selectedMappingFrom = dunningData[0].mappingFrom;
        } else {
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

  getAllPinCodeData() {
    this.pincodeDD = [];
    const url = "/pincode/getAll";
    this.pincodeManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.pincodeDD = response.dataList;
      },
      () => {}
    );
  }

  getALLAreaData() {
    this.AreaListDD = [];
    const url = "/area/all";
    this.areaManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.AreaListDD = response.dataList;
      },
      () => {}
    );
  }

  getAllSubAreaData() {
    this.subAreaListDD = [];
    const url = "/subarea/all";
    this.areaManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.dataList) {
          // Map the response to add '(UnderDeveloped)' for relevant items
          this.subAreaListDD = response.dataList.map((item: any) => ({
            id: item.id,
            name: item.name,
            isUnderDevelopment: item.status === "UnderDevelopment"
          }));
        }
      },
      () => {}
    );
  }

  initData() {
    this.commondropdownService.getInstallmentTypeData();
    this.systemService.getConfigurationByName("TOTAL_INSTALLMENTS").subscribe((res: any) => {
      this.totalInstallmentsLength = +res.data.value;
      for (let i = 0; i < this.totalInstallmentsLength; i++) {
        this.totalInstallments.push({ text: i + 1, value: i + 1 });
      }
    });
    this.getAllPinCodeData();
    this.getALLAreaData();
    this.getAllSubAreaData();
    this.getMappingFrom();
    this.customerFormInit();
    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });

    this.planCategoryForm = this.fb.group({
      planCategory: [""]
    });
    this.planGroupForm = this.fb.group({
      planId: ["", Validators.required],
      service: ["", Validators.required],
      serviceId: ["", Validators.required],
      validity: ["", Validators.required],
      offerprice: [""],
      newAmount: [""],
      discountType: [""],
      discountTypeData: [""],
      discountExpiryDate: [""],
      discount: [""],
      istrialplan: [""],
      serialNumber: [""],
      invoiceType: ["", Validators.required],
      skipQuotaUpdate: [false],
      currency: [""]
    });
    this.planGroupForm.get("discountType")?.valueChanges.subscribe(value => {
      const discountExpiryDateControl = this.planGroupForm.get("discountExpiryDate");

      if (value?.toLowerCase() === "recurring") {
        discountExpiryDateControl?.setValidators(Validators.required);
      } else {
        discountExpiryDateControl?.clearValidators();
      }

      discountExpiryDateControl?.updateValueAndValidity();
    });
    this.planGroupForm.controls.invoiceType.disable();

    this.presentGroupForm = this.fb.group({
      addressType: ["Present", Validators.required],
      landmark: ["", Validators.required],
      areaId: ["", Validators.required],
      pincodeId: ["", Validators.required],
      cityId: ["", Validators.required],
      stateId: ["", Validators.required],
      countryId: ["", Validators.required],
      subareaId: [""],
      building_mgmt_id: [""],
      buildingNumber: [""],
      landmark1: [""]
    });
    this.paymentGroupForm = this.fb.group({
      addressType: ["", Validators.required],
      landmark: [""],
      areaId: [""],
      pincodeId: [""],
      cityId: [""],
      stateId: [""],
      countryId: [""],
      subareaId: [""],
      building_mgmt_id: [""],
      buildingNumber: [""],
      landmark1: [""]
    });
    this.permanentGroupForm = this.fb.group({
      addressType: [""],
      landmark: [""],
      areaId: [""],
      pincodeId: [""],
      cityId: [""],
      stateId: [""],
      countryId: [""],
      subareaId: [""],
      building_mgmt_id: [""],
      buildingNumber: [""],
      landmark1: [""]
    });
    this.planDataForm = this.fb.group({
      offerPrice: [""],
      discountPrice: [0],
      serialNumber: [""]
    });
    this.chargeGroupForm = this.fb.group({
      chargeid: ["", Validators.required],
      validity: ["", Validators.required],
      price: ["", Validators.required],
      actualprice: ["", Validators.required],
      charge_date: ["", Validators.required],
      type: ["Recurring", Validators.required],
      staticIPAdrress: [""],
      planid: ["", Validators.required],
      unitsOfValidity: ["", Validators.required],
      discount: [""],
      billingCycle: [""],
      serialNumber: [""],
      expiry: ["", Validators.required]
    });
    this.ipManagementGroup = this.fb.group({
      ipAddress: [
        "",
        [Validators.required, Validators.pattern("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$")]
      ],
      ipType: ["", Validators.required]
    });
    this.servicePackForm = this.fb.group({
      vasId: ["", Validators.required],
      installmentFrequency: [""],
      totalInstallments: [""],
      installment_no: [1]
    });

    this.locationMacForm = this.fb.group({
      location: [""],
      mac: [""]
    });

    this.validityUnitFormGroup = this.fb.group({
      validityUnit: [""]
    });
    this.validityUnitFormArray = this.fb.array([]);
    this.plansArray = this.fb.array([]);
    this.commondropdownService.getAllPinCodeData();
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
    this.commondropdownService.getValleyTypee();
    this.commondropdownService.getInsideValley();
    this.commondropdownService.getOutsideValley();
    this.commondropdownService.getCustomerCategory();
    this.getCustomerType();
    this.getCustomerSector();
    this.getBillToData();

    if (this.statusCheckService.isActiveInventoryService) {
      this.commondropdownService.getPOPList();
    }
    if (this.editCustId != null) {
      this.iscustomerEdit = true;
      this.getCustomerMacCount();
    }

    this.commondropdownService.getCustomerStatus();
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
    this.systemService.getConfigurationByName("IS_MANDATORY_ALL_REMOVE").subscribe((res: any) => {
      this.isMandatory = res.data.value === "true";
    });
    this.overServicePackListFormArray = this.fb.array([]);
  }

  ipListFormGroup(): FormGroup {
    return this.fb.group({
      ipAddress: [this.ipManagementGroup.value.ipAddress],
      ipType: [this.ipManagementGroup.value.ipType]
    });
  }
  noSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.includes(" ")) {
      return { noSpace: true };
    }
    return null;
  }
  onAddIPList() {
    this.ipSubmitted = true;
    if (this.ipManagementGroup.valid) {
      this.ipMapppingListFromArray.push(this.ipListFormGroup());
      this.ipManagementGroup.reset();
      this.ipSubmitted = false;
    } else {
    }
  }
  editcustomer(chargeid: any) {
    this.commondropdownService.getplanservice();
    this.commondropdownService.getPostpaidplanData();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
    this.commondropdownService.findAllplanGroups();
    this.commondropdownService.getValleyTypee();
    this.commondropdownService.getInsideValley();
    this.commondropdownService.getOutsideValley();
    this.commondropdownService.getCustomerCategory();
    this.commondropdownService.getTitle();
    this.commondropdownService.getserviceAreaListForCafCustomer();

    this.getCustomerSector();
    this.getBillToData();
    this.getpartnerAll();
    this.billingSequence();
    this.getrequiredDepartment();
    this.getAllLocation();
    if (this.statusCheckService.isActiveInventoryService) {
      this.commondropdownService.getPOPList();
    }
    this.commondropdownService.getAllPinCodeData();
    this.getAllPinCodeData();
    this.getALLAreaData();
    this.getAllSubAreaData();
    // this.getAllBuildingData();
    this.getMappingFrom();
    let k = 0;
    this.totalAddress = 0;
    this.DiscountValueStore = [];
    this.discountValue = 0;
    this.planTotalOffetPrice = 0;
    this.planDataForm.reset();
    this.planDropdownInChageData = [];
    let macNumber = 0;
    this.editCustomerId = chargeid;
    this.planDropdownInChageData = [];
    this.serviceareaCheck = false;
    if (this.payMappingListFromArray.controls) {
      this.payMappingListFromArray.controls = [];
    }
    if (this.overChargeListFromArray.controls) {
      this.overChargeListFromArray.controls = [];
    }
    if (this.custMacMapppingListFromArray.controls) {
      this.custMacMapppingListFromArray.controls = [];
    }
    if (this.custType === RadiusConstants.CUSTOMER_TYPE.POSTPAID) {
      this.daySequence();
      this.earlyDaySequence();
    }
    this.paymentGroupForm.reset();
    this.permanentGroupForm.reset();
    this.viewcustomerListData = [];

    if (chargeid) {
      //
      const url = "/customers/" + chargeid;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.iscustomerEdit = true;
          this.viewcustomerListData = response.customers;
          this.getDevicesByType("OLT");
          this.getDevicesByType("SN Splitter");
          this.getDevicesByType("DN Splitter");
          this.getDevicesByType("Master DB/DB");
          if (this.viewcustomerListData.birthDate)
            this.viewcustomerListData.birthDate = moment(
              this.viewcustomerListData.birthDate
            ).format("YYYY-MM-DD");
          this.customerGroupForm.patchValue(this.viewcustomerListData);
          if (
            this.viewcustomerListData?.earlybillday != undefined &&
            this.viewcustomerListData?.earlybillday != null
          ) {
            this.customerGroupForm.patchValue({
              earlybillday: this.viewcustomerListData?.earlybillday?.toString()
            });
          }

          if (this.viewcustomerListData.billableCustomerId) {
            this.getBillableCust(this.viewcustomerListData.billableCustomerId);
          }
          let serviceAreaId = {
            value: Number(this.viewcustomerListData.serviceareaid)
          };
          this.selServiceArea(serviceAreaId, false);
          if (this.viewcustomerListData.isCredentialMatchWithAccountNo) {
            this.customerGroupForm.controls.username.disable();
            this.customerGroupForm.controls.loginUsername.disable();

            this.customerGroupForm.controls.isCredentialMatchWithAccountNo.disable();
          } else {
            this.customerGroupForm.controls.username.enable();
            this.customerGroupForm.controls.loginUsername.enable();
          }
          this.customerGroupForm
            .get("parentQuotaType")
            .setValue(this.viewcustomerListData.parentQuotaType);

          if (this.viewcustomerListData.customerLocations.length > 0) {
            this.customerGroupForm
              .get("isParentLocation")
              .setValue(this.viewcustomerListData.customerLocations[0].isParentLocation);

            var selectedLocation = [];
            this.custLocationData = [];
            this.custLocationData = [...this.viewcustomerListData.customerLocations];

            this.viewcustomerListData.customerLocations.forEach(location => {
              if (selectedLocation.indexOf(location.locationId) === -1) {
                selectedLocation.push(location.locationId);
              }

              this.overLocationMacArray.push(
                this.fb.group({
                  name: [location.locationName],
                  mac: [location.mac],
                  locationId: [location.locationId],
                  isAlreadyAvailable: true,
                  isParentLocation: location.isParentLocation
                })
              );
            });
            if (this.overLocationMacArray.value.length > 0) {
              this.locationMacData = this.overLocationMacArray.value.map(location => ({
                locationId: location.locationId, //location.locationId
                mac: location.mac,
                isParentLocation: location.isParentLocation
              }));
            }
          }
          this.locationChange(selectedLocation);
          this.locationMacForm.get("location").setValue(selectedLocation);

          //this.customerGroupForm.controls.username.disable();

          this.customerGroupForm
            .get("parentQuotaType")
            .setValue(this.viewcustomerListData.parentQuotaType);

          if (this.viewcustomerListData.customerLocations.length > 0) {
            this.customerGroupForm
              .get("isParentLocation")
              .setValue(this.viewcustomerListData.customerLocations[0].isParentLocation);

            var selectedLocation = [];
            this.custLocationData = [];
            this.custLocationData = [...this.viewcustomerListData.customerLocations];

            this.viewcustomerListData.customerLocations.forEach(location => {
              if (selectedLocation.indexOf(location.locationId) === -1) {
                selectedLocation.push(location.locationId);
              }
              this.overLocationMacArray.push(
                this.fb.group({
                  name: [location.locationName],
                  mac: [location.mac],
                  locationId: [location.locationId],
                  isAlreadyAvailable: true,
                  isParentLocation: location.isParentLocation
                })
              );
            });

            if (this.overLocationMacArray.value.length > 0) {
              this.locationMacData = this.overLocationMacArray.value.map(location => ({
                locationId: location.locationId, //location.locationId
                mac: location.mac,
                isParentLocation: location.isParentLocation
              }));
            }
          }

          this.locationChange(selectedLocation);
          this.locationMacForm.get("location").setValue(selectedLocation);

          this.customerGroupForm
            .get("billTo")
            .setValue(this.viewcustomerListData.planMappingList[0].billTo);
          this.customerGroupForm.get("isCustCaf").setValue("yes");
          this.viewcustomerListData.custtype;
          if (this.viewcustomerListData.custtype == this.custType) {
            let obj = {};
            this.filterPlanData = [];
            if (this.commondropdownService.postpaidplanData.length != 0) {
              obj = this.commondropdownService.postpaidplanData.filter(
                key => key.plantype === this.custType
              );
            }
            this.filterPlanData = obj;
            obj = {};
          } else {
            let obj = {};
            this.filterPlanData = [];
            if (this.commondropdownService.postpaidplanData.length != 0) {
              obj = this.commondropdownService.postpaidplanData.filter(
                key => key.plantype === this.custType
              );
            }
            this.filterPlanData = obj;
            obj = {};
          }
          if (this.viewcustomerListData?.creditDocuments?.length) {
            if (this.viewcustomerListData?.creditDocuments?.length > 0) {
              this.customerGroupForm.controls.paymentDetails.patchValue(
                this.viewcustomerListData.creditDocuments[0]
              );
            }
          }
          if (this.viewcustomerListData.parentExperience != null) {
            this.customerGroupForm.controls.parentExperience.enable();
          } else {
            this.customerGroupForm.controls.parentExperience.disable();
          }

          if (this.viewcustomerListData.parentCustomerId) {
            this.parentCustList = [
              {
                id: this.viewcustomerListData.parentCustomerId,
                name: this.viewcustomerListData.parentCustomerName
              }
            ];
          } else {
            this.parentCustList = [];
          }

          if (this.viewcustomerListData.parentCustomerId && this.viewcustomerListData.plangroupid) {
            this.customerGroupForm.controls.invoiceType.enable();
            this.planGroupForm.controls.invoiceType.disable();
            this.isParantExpirenceEdit = true;
            this.customerGroupForm.controls.parentExperience.enable();
            this.customerGroupForm.controls.parentExperience.patchValue(
              this.viewcustomerListData.parentExperience
            );
          } else {
            this.customerGroupForm.controls.invoiceType.disable();
            this.planGroupForm.controls.invoiceType.enable();
          }

          this.payMappingListFromArray.patchValue(this.viewcustomerListData.planMappingList);

          // Address
          if (this.viewcustomerListData.addressList[0].addressType) {
            this.getTempPincodeData(this.viewcustomerListData.addressList[0].pincodeId, "present");
            this.getAreaData(this.viewcustomerListData.addressList[0].areaId, "present");
            this.presentGroupForm.patchValue(this.viewcustomerListData.addressList[0]);
            this.selServiceAreaByParent(Number(this.viewcustomerListData.serviceareaid));
            const data = {
              value: this.viewcustomerListData.addressList[0].pincodeId
            };

            this.selectPINCODEChange(data, "");
            this.presentGroupForm.patchValue({
              pincodeId: Number(this.viewcustomerListData.addressList[0].pincodeId)
            });
            let subAreaEvent = {
              value: this.viewcustomerListData.addressList[0].subareaId
            };

            this.onChangeSubArea(subAreaEvent, "present");
          }
          if (this.viewcustomerListData.addressList != null) {
            this.viewcustomerListData.addressList.forEach(element => {
              if ("Payment" == element.addressType) {
                this.getTempPincodeData(element.pincodeId, "payment");
                this.getAreaData(element.areaId, "payment");
                this.paymentGroupForm.patchValue(element);
                this.selectAreaListPayment = true;
                this.selectPincodeListPayment = true;
              } else if ("Permanent" == element.addressType || "permanent" == element.addressType) {
                this.getTempPincodeData(element.pincodeId, "permanent");
                this.getAreaData(element.areaId, "permanent");
                this.permanentGroupForm.patchValue(element);
                this.selectAreaListPermanent = true;
                this.selectPincodeListPermanent = true;
              }
            });
          }

          if (this.viewcustomerListData.plangroupid) {
            this.ifIndividualPlan = false;
            this.ifPlanGroup = true;
            this.planCategoryForm.patchValue({
              planCategory: "groupPlan"
            });
            this.getPlangroupByPlan(this.viewcustomerListData.plangroupid);
            this.customerGroupForm.patchValue({
              plangroupid: this.viewcustomerListData.plangroupid
            });
          } else {
            this.ifIndividualPlan = true;
            this.ifPlanGroup = false;

            this.planCategoryForm.patchValue({
              planCategory: "individual"
            });

            // plan deatils

            let newAmount = 0;
            let totalAmount = 0;
            this.discountValue = 0;
            this.DiscountValueStore = [];
            this.viewcustomerListData.planMappingList.forEach((element, i) => {
              // this.planGroupForm.patchValue(
              //   this.viewcustomerListData.planMappingList[planlength]
              // );
              this.onAddplanMappingList();

              if (element.planId) {
                let validityUnit = "";
                let mvnoId =
                  localStorage.getItem("mvnoId") == "1"
                    ? this.customerGroupForm.value?.mvnoId
                    : Number(localStorage.getItem("mvnoId"));
                const url = "/postpaidplan/" + element.planId + "?mvnoId=" + mvnoId;
                this.customerManagementService.getMethod(url).subscribe((response: any) => {
                  this.planDropdownInChageData.push(response.postPaidPlan);
                  let postpaidplanData = response.postPaidPlan;
                  validityUnit = response.postPaidPlan.unitsOfValidity;
                  //   const servicename = this.serviceData.find(
                  //     item => item.id == element.service
                  //   ).name;
                  this.payMappingListFromArray.push(
                    this.fb.group({
                      service: element.service,
                      planId: element.planId,
                      validity: element.validity,
                      offerPrice: element.offerPrice,
                      newAmount: element.newAmount,
                      discount: element.discount,
                      discountTypeData: element.discountTypeData,
                      istrialplan: element.istrialplan,
                      invoiceType: element.invoiceType,
                      isInvoiceToOrg: element.isInvoiceToOrg,
                      discountType: element.discountType,
                      discountExpiryDate: [
                        element.discountExpiryDate
                          ? moment(element.discountExpiryDate).utc(true).toDate()
                          : null
                      ],
                      currency: [this.customerGroupForm.get("currency").value]
                    })
                  );
                  this.validityUnitFormArray.push(
                    this.fb.group({
                      validityUnit
                    })
                  );

                  let n = i + 1;
                  newAmount = postpaidplanData.newOfferPrice
                    ? postpaidplanData.newOfferPrice
                    : postpaidplanData.offerprice;
                  totalAmount = Number(totalAmount) + Number(newAmount);

                  if (this.viewcustomerListData.planMappingList.length == n) {
                    this.planDataForm.patchValue({
                      offerPrice: totalAmount,
                      discountPrice: this.viewcustomerListData.flatAmount
                        ? this.viewcustomerListData.flatAmount.toFixed(2)
                        : this.viewcustomerListData.flatAmount
                    });

                    // this.payMappingListFromArray.value.forEach((e, k) => {
                    //   let discountValueNUmber: any = 0;
                    //   let lastvalue: any = 0;
                    //   let m = i + 1;
                    //   let price = Number(this.payMappingListFromArray.value[k].offerPrice);
                    //   let discount = Number(this.payMappingListFromArray.value[k].discount);
                    //   let DiscountV = (price * discount) / 100;
                    //   discountValueNUmber = DiscountV.toFixed(2);
                    //   let discountValue =
                    //     Number(this.payMappingListFromArray.value[k].offerPrice) -
                    //     Number(discountValueNUmber);
                    //   this.discountValue = Number(discountValue);

                    //   this.DiscountValueStore.push({ value: this.discountValue });
                    //   if (this.discountValue == 0) {
                    //     disValue =
                    //       Number(this.payMappingListFromArray.value[k].offerPrice) +
                    //       Number(this.planDataForm.value.discountPrice);
                    //   } else {
                    //     disValue =
                    //       Number(this.discountValue) +
                    //       Number(this.planDataForm.value.discountPrice);
                    //   }

                    //   if (this.viewcustomerListData.planMappingList.length == m) {
                    //     this.planDataForm.patchValue({
                    //       discountPrice: disValue,
                    //     });
                    //   }
                    // });
                  }
                });
              }
            });

            // while (
            //   this.viewcustomerListData.planMappingList.length > planlength
            // ) {
            //   this.planGroupForm.patchValue(
            //     this.viewcustomerListData.planMappingList[planlength]
            //   );
            //   this.onAddplanMappingList();
            //   this.payMappingListFromArray.patchValue(
            //     this.viewcustomerListData.planMappingList
            //   );
            //   planlength++;
            // }
          }

          this.viewcustomerListData.overChargeList = this.viewcustomerListData.indiChargeList;
          // charge
          while (k < this.viewcustomerListData.indiChargeList.length) {
            if (this.viewcustomerListData.indiChargeList[k].charge_date) {
              const format = "yyyy-MM-dd";
              const locale = "en-US";
              const myDate = this.viewcustomerListData.indiChargeList[k].charge_date;
              const formattedDate = formatDate(myDate, format, locale);
              this.viewcustomerListData.indiChargeList[k].charge_date = formattedDate;

              const date = this.viewcustomerListData.indiChargeList[k].charge_date.split("-");
              this.ngbBirthcal = {
                year: Number(date[0]),
                month: Number(date[1]),
                day: Number(date[2])
              };
              this.overChargeListFromArray.patchValue([
                {
                  charge_date: this.viewcustomerListData.indiChargeList[k].charge_date
                }
              ]);
              // console.log(this.viewcustomerListData.indiChargeList[k].charge_date)
            }
            this.chargeGroupForm.patchValue(this.viewcustomerListData.indiChargeList[k]);
            this.onAddoverChargeListField();
            this.overChargeListFromArray.patchValue(this.viewcustomerListData.indiChargeList);
            k++;
          }

          // MAc
          while (this.viewcustomerListData.custMacMapppingList.length > macNumber) {
            this.macGroupForm.patchValue(this.viewcustomerListData.custMacMapppingList[macNumber]);
            this.onAddMACList();
            this.custMacMapppingListFromArray.patchValue(
              this.viewcustomerListData.custMacMapppingList
            );
            macNumber++;
          }
          // this.planGroupForm.controls.service.disable();
          // this.planGroupForm.controls.planId.disable();
          // this.planGroupForm.controls.validity.disable();
          if (this.viewcustomerListData.dunningType != null) {
            const data = {
              value: this.viewcustomerListData.dunningType
            };
            this.customerGroupForm.controls.dunningSubType.enable();
            this.getcustType(data);
          } else {
            this.customerGroupForm.controls.dunningSubType.disable();
          }

          if (this.viewcustomerListData.dunningSector != null) {
            this.customerGroupForm.controls.dunningSubSector.enable();
          } else {
            this.customerGroupForm.controls.dunningSubSector.disable();
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
  }

  getTempPincodeData(id: any, index: any) {
    const url = "/pincode/" + id;

    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      if (index === "present") {
        this.pincodeDeatils = response.data;
        if (response.data.areaList.length !== 0) {
          this.areaAvailableList = response.data.areaList;
        }
      }
    });
  }

  getBillableCust(billableCustomerId) {
    const url = "/customers/" + billableCustomerId;
    if (billableCustomerId) {
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          var name = response.customers.firstname + " " + response.customers.lastname;
          this.billableCustList = [
            {
              name: name,
              id: billableCustomerId
            }
          ];
          this.customerGroupForm.patchValue({ billableCustomerId: billableCustomerId });
        },
        () => {}
      );
    }
  }

  daySequence() {
    for (let i = 0; i < 28; i++) {
      this.days.push({ label: i + 1 });
    }
  }

  earlyDaySequence() {
    for (let i = 0; i <= 28; i++) {
      this.earlydays.push({ label: i.toString() });
    }
    this.customerGroupForm.patchValue({
      earlybillday: this.earlydays[0].label
    });
  }

  getsystemconfigListByName(keyName: string) {
    const url = "/system/configurationListByKey?keyName=" + keyName;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.dunningRules = response.dataList;
      },
      () => {}
    );
  }

  getStaffUserByServiceArea(ids) {
    let data = [];
    data.push(ids);
    let url = "/staffsByServiceAreaId/" + ids;
    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      this.staffList = response.dataList;
    });
  }

  getCustomerType() {
    const url = "/commonList/Customer_Type";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.customerType = response.dataList;
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

  getcustType(event) {
    let value = event.value;
    this.customerGroupForm.controls.customerSubType.enable();
    let actionUrl = `/commonList/${value}`;
    if (event.value == "Barter") {
      this.isCustSubTypeCon = false;
    } else {
      this.isCustSubTypeCon = true;
      this.getCustomerTypeFlow(actionUrl);
    }
  }

  getCustomerTypeFlow(url) {
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.customerSubType = response.dataList;
    });
  }

  getCustomerSector() {
    const url = "/commonList/Customer_Sector";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.customerSector = response.dataList;
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

  getNetworkDevicesByType(deviceType) {
    if (this.statusCheckService.isActiveInventoryService) {
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
  }

  getSelectCustomerSector(event) {
    const value = event.value;
    if (value) {
      this.customerGroupForm.controls.customerSubSector.enable();
    } else {
      this.customerGroupForm.controls.customerSubSector.disable();
    }
  }

  async selectedCustChange(event) {
    this.showParentCustomerModel = false;
    this.selectedParentCust = event;
    if (this.parentCustomerDialogType === "billable") {
      this.billableCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.customerGroupForm.patchValue({
        billableCustomerId: this.selectedParentCust.id
      });
    } else if (this.parentCustomerDialogType === "billable-change-plan") {
      this.billableCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
    } else if (this.parentCustomerDialogType === "billable-shift-location") {
      this.billableCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
    } else {
      this.customerGroupForm.controls.parentExperience.enable();
      this.parentCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.customerGroupForm.patchValue({
        parentCustomerId: this.selectedParentCust.id
      });

      const url = "/customers/" + this.selectedParentCust.id;
      let parentCustServiceAreaId: any;

      await this.customerManagementService.getMethod(url).subscribe((response: any) => {
        parentCustServiceAreaId = response.customers.serviceareaid;
        this.serviceareaCheck = false;
        this.customerGroupForm.patchValue({
          serviceareaid: parentCustServiceAreaId
        });
        // console.log("response2", parentCustServiceAreaId);
        if (parentCustServiceAreaId) {
          this.selServiceAreaByParent(parentCustServiceAreaId);
          this.serviceAreaDisable = true;
        }
        // console.log("response1", parentCustServiceAreaId);
      });
      if (
        this.planCategoryForm.value.planCategory != null &&
        this.planCategoryForm.value.planCategory == "groupPlan"
      ) {
        this.customerGroupForm.controls.invoiceType.enable();
        this.planGroupForm.controls.invoiceType.disable();
      } else if (
        this.planCategoryForm.value.planCategory != null &&
        this.planCategoryForm.value.planCategory == "individual"
      ) {
        this.customerGroupForm.controls.invoiceType.disable();
        this.planGroupForm.controls.invoiceType.enable();
      }
    }
  }

  getParentCust(event) {
    if (event.value) {
      this.customerGroupForm.controls.invoiceType.enable();
      this.customerGroupForm.controls.parentExperience.enable();
    } else {
      this.customerGroupForm.controls.invoiceType.disable();
      this.customerGroupForm.controls.parentExperience.disable();
    }
  }

  removeSelParentCust(type) {
    this.selectedParentCust = [];
    if (type === "billable") {
      this.billableCustList = [];
      this.customerGroupForm.patchValue({
        billableCustomerId: null
      });
    } else if (type === "billable-change-plan") {
      this.billableCustList = [];
    } else if (type === "billable-shift-location") {
      this.billableCustList = [];
    } else {
      this.customerGroupForm.patchValue({
        parentCustomerId: ""
      });
      this.customerGroupForm.controls.invoiceType.setValue("");
      this.customerGroupForm.controls.invoiceType.disable();
      this.customerGroupForm.controls.parentExperience.setValue("");
      this.customerGroupForm.controls.parentExperience.disable();
      this.planGroupForm.controls.invoiceType.setValue("");
      this.planGroupForm.controls.invoiceType.disable();

      this.customerGroupForm.controls.serviceareaid.setValue("");
      this.customerGroupForm.controls.branch.setValue("");
      this.customerGroupForm.controls.partnerid.setValue("");
      this.serviceAreaDisable = false;
      this.parentCustList = [];
    }
  }

  selServiceAreaByParent(id) {
    const serviceAreaId = id;
    this.pincodeDD = [];
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.serviceareaCheck = false;
          this.serviceAreaData = response.data;
          this.serviceAreaData.pincodes.forEach(element => {
            this.commondropdownService.allpincodeNumber.forEach(e => {
              if (e.pincodeid == element) {
                this.pincodeDD.push(e);
              }
            });
          });
          this.getPartnerAllByServiceArea(serviceAreaId);
          this.getServiceByServiceAreaID(serviceAreaId);
          this.getPlanbyServiceArea(serviceAreaId);
          this.getBranchByServiceAreaID(serviceAreaId);
          this.getStaffUserByServiceArea(serviceAreaId);
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

  selServiceArea(event, isFromUI) {
    this.isPartnerSelected = false;
    if (isFromUI) {
      this.pincodeDD = [];
    }
    const serviceAreaId = event.value;
    this.planGroupForm.reset();
    this.planDataForm.reset();
    this.payMappingListFromArray.clear();
    this.planCategoryForm.reset();
    this.planGroupForm.controls.skipQuotaUpdate.setValue(false);
    this.planGroupForm.controls.validity.enable();
    this.planGroupForm.patchValue({
      service: "",
      planId: ""
    });
    this.planDataForm.patchValue({
      discountPrice: 0
    });
    this.payMappingListFromArray.controls = [];
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.serviceareaCheck = false;
          this.serviceAreaData = response.data;
          if (this.serviceAreaData.serviceAreaType != "private") {
            this.customerGroupForm.controls.blockNo.clearValidators();
            this.customerGroupForm.updateValueAndValidity();
          } else {
            this.customerGroupForm.controls.blockNo.setValidators(Validators.required);
            this.customerGroupForm.updateValueAndValidity();
          }
          if (this.serviceAreaData.blockNo && !isNaN(this.serviceAreaData.blockNo)) {
            const maxBlockNo = +this.serviceAreaData.blockNo;
            this.blockNoOptions = Array.from({ length: maxBlockNo }, (_, i) => i + 1);
          } else {
            this.blockNoOptions = []; // Clear options if invalid
          }
          this.plantypaSelectData = [];
          this.filterPlan = [];
          if (isFromUI) {
            this.serviceAreaData.pincodes.forEach(element => {
              this.commondropdownService.allpincodeNumber.forEach(e => {
                if (e.pincodeid == element) {
                  this.pincodeDD.push(e);
                }
              });
            });
          }

          this.getPlanbyServiceArea(serviceAreaId);
          if (!this.iscustomerEdit) {
            if (isFromUI) {
              this.presentGroupForm.reset();
            }
          }
        },
        () => {}
      );
      this.getPartnerAllByServiceArea(serviceAreaId);
      this.getServiceByServiceAreaID(serviceAreaId);
      if (this.partnerId == 1) this.getBranchByServiceAreaID(serviceAreaId);
      this.getStaffUserByServiceArea(serviceAreaId);
    }
  }

  getBranchByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    let url = "/branchManagement/getAllBranchesByServiceAreaId?mvnoId=" + mvnoId;
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      if (this.branchData != null && this.branchData.length > 0) {
        this.isBranchAvailable = true;
        this.customerGroupForm.controls.branch.setValue(response.dataList[0].id);
        this.customerGroupForm.controls.branch.setValidators(Validators.required);
        this.customerGroupForm.controls.partnerid.clearValidators();
        this.customerGroupForm.updateValueAndValidity();
      } else {
        this.isBranchAvailable = false;
        this.customerGroupForm.controls.partnerid.setValidators(Validators.required);
        this.customerGroupForm.controls.branch.clearValidators();
        this.customerGroupForm.controls.branch.updateValueAndValidity();
        this.customerGroupForm.updateValueAndValidity();
      }
    });
  }

  getPartnerAllByServiceArea(serviceAreaId) {
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/getPartnerByServiceAreaId/" + serviceAreaId + "?mvnoId=" + mvnoId;
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.partnerListByServiceArea = response.partnerList.filter(item => item.id != 1);
        this.partnerList = response.partnerList.filter(item => item.id != 1);
      },
      () => {}
    );
  }

  getServiceByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    let url = "/serviceArea/getAllServicesByServiceAreaId" + "?mvnoId=" + mvnoId;
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceData = response.dataList;
    });
  }

  onPartnerCategoryChange() {}

  getPlanbyPartner(serviceAreaId, partnerId) {
    this.isPartnerSelected = true;
    if (serviceAreaId) {
      this.filterPlanData = [];
      const custType = this.custType;
      const url = `/partnerplans/serviceArea?partnerId=${partnerId}&mvnoId=${localStorage.getItem("mvnoId")}&serviceAreaId=${serviceAreaId}&planmode=NORMAL`;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.partnerpostpaidplanList;
          this.filterPlanData = response.partnerpostpaidplanList.filter(
            plan => plan.plantype == custType
          );
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

  getPlangroupByPartner(partnerId) {
    this.isPartnerSelected = true;
    this.planDropdownInChageData = [];
    let partnerGroupurl = `/partnerplanGroupMappings?partnerId=${partnerId}&mode=""`;
    this.customerManagementService.getMethod(partnerGroupurl).subscribe((respose: any) => {
      this.filterPartnerPlanGroup = respose.planGroupList;
      this.filterNormalPlanGroup = respose.planGroupList;
    });
  }

  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.filterPlanData = [];
      const custType = this.custType;
      const url = "/plans/serviceArea?planmode=NORMAL&serviceAreaId=" + serviceAreaId;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.postpaidplanList;
          this.filterPlanData = this.planByServiceArea.filter(plan => plan.plantype == custType);
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
                  if (!this.customerGroupForm.controls.serviceareaid.value) {
                    this.customerGroupForm.controls.serviceareaid.setValue(res.data);
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
                if (index === "payment") {
                  this.paymentareaDetails = response.data;

                  this.selectPincodeListPayment = true;

                  this.paymentGroupForm.patchValue({
                    addressType: "Payment",
                    pincodeId: Number(this.paymentareaDetails.pincodeId),
                    cityId: Number(this.paymentareaDetails.cityId),
                    stateId: Number(this.paymentareaDetails.stateId),
                    countryId: Number(this.paymentareaDetails.countryId)
                  });
                }
                if (index === "permanent") {
                  this.permanentareaDetails = response.data;

                  this.selectPincodeListPermanent = true;
                  this.permanentGroupForm.patchValue({
                    addressType: "Permanent",
                    pincodeId: Number(this.permanentareaDetails.pincodeId),
                    cityId: Number(this.permanentareaDetails.cityId),
                    stateId: Number(this.permanentareaDetails.stateId),
                    countryId: Number(this.permanentareaDetails.countryId)
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

  onKey(event) {
    if (event.key == "Tab") {
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.customerGroupForm.value?.mvnoId
          : Number(localStorage.getItem("mvnoId"));
      const url =
        "/customer/customerUsernameIsAlreadyExists/" +
        this.customerGroupForm.controls.username.value +
        "?mvnoId=" +
        mvnoId;
      this.customerManagementService.getMethod(url).subscribe((response: any) => {
        if (response.isAlreadyExists == true) {
          this.messageService.add({
            severity: "error",
            summary: "Error ",
            detail: "Username already exists!!",
            icon: "far fa-times-circle"
          });
        }
      });
    }
  }

  onKeymobilelength() {
    const str = this.customerGroupForm.value.mobile.toString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (mobilenumberlength === 0 || mobilenumberlength === null) {
      mobilenumberlength = 10;
    }
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobile = `${mobilenumberlength} character required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobile = "";
    } else {
      this.inputMobile = `${mobilenumberlength} character required.`;
    }
  }

  mobileError: boolean = false;

  onInputMobile(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Check if the input starts with 0
    if (inputValue.startsWith("0")) {
      this.mobileError = true;
    } else {
      this.mobileError = false;
    }
  }

  onKeymobilelengthsec() {
    const str = this.customerGroupForm.value.altmobile.toLocaleString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobileSec = `Mobile Number minimum ${mobilenumberlength} character is required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobileSec = "";
    } else {
      this.inputMobileSec = `Mobile Number minimum ${mobilenumberlength} character is required.`;
    }
  }

  discountvaluesetPercentage(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (Number(inputElement.value) > 0) {
      let price = Number(this.planDataForm.value.offerPrice);
      let selDiscount = parseFloat(this.planDataForm.value.discountPrice).toFixed(2);
      let discount = Number(selDiscount);
      let discountPlan = (discount * 100) / price;
      let discountValueNUmber = discountPlan.toFixed(2);
      let value = 100 - Number(discountValueNUmber);

      if (this.ifPlanGroup) {
        if (discount == 0) {
          this.customerGroupForm.patchValue({
            discount: 100
          });
        } else {
          this.customerGroupForm.patchValue({
            discount: value.toFixed(2)
          });
        }
      } else {
        this.payMappingListFromArray.value.forEach((element, i) => {
          let n = i + 1;
          if (discount == 0) {
            element.discount = 99.99;
          } else if (value <= 99.99 && value >= -99.99) {
            element.discount = value.toFixed(2);
          } else {
            if (value > 0) {
              element.discount = 99.99;
            } else {
              element.discount = -99.99;
            }
          }

          if (this.payMappingListFromArray.value.length == n) {
            this.payMappingListFromArray.patchValue(this.payMappingListFromArray.value);
          }
        });
      }
      return true;
    } else {
      return;
    }
  }

  preventNegativeInput(event: KeyboardEvent) {
    if (event.key === "-") {
      event.preventDefault();
    }
  }

  mylocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.iflocationFill = true;
          this.customerGroupForm.patchValue({
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

  parentExperienceSelect() {
    this.planGroupForm.value.invoiceType = "Group";
  }

  onChnagePincode(_event: any) {
    if (_event.value) {
      const url = "/area/pincode?pincodeId=" + _event.value;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.areaListDD = response.areaList;
          if (_event.value) {
            let url = "/pincode/getServicAreaIdByPincode?pincodeid=" + _event.value;
            this.adoptCommonBaseService.get(url).subscribe(
              (res: any) => {
                if (res.data != null) {
                  let serviceAreaId = {
                    value: Number(res.data)
                  };

                  if (!this.customerGroupForm.controls.serviceareaid.value) {
                    this.customerGroupForm.controls.serviceareaid.setValue(res.data);
                    this.selServiceArea(serviceAreaId, false);
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

  planSelectType(event) {
    this.planDropdownInChageData = [];
    this.discountValueStore = [];
    this.discountValue = 0;
    this.planTotalOffetPrice = 0;
    const planaddDetailType = event.value;
    this.ifplanisSubisuSelect = false;
    this.planDataForm.reset();
    this.customerGroupForm.controls.plangroupid.reset();
    this.customerGroupForm.controls.discount.reset();
    this.customerGroupForm.controls.discountType.reset();
    this.customerGroupForm.controls.discountTypeData.reset();
    this.customerGroupForm.controls.discountExpiryDate.reset();

    let partnerId = this.customerGroupForm.controls.partnerid.value;
    let serviceAreaId = this.customerGroupForm.controls.serviceareaid.value;
    if (planaddDetailType == "individual") {
      this.ifIndividualPlan = true;
      this.ifPlanGroup = false;
      this.payMappingListFromArray.controls = [];

      if (partnerId && serviceAreaId && !this.isBranchAvailable) {
        this.getPlanbyPartner(serviceAreaId, partnerId);
      }
      if (
        this.customerGroupForm.value.parentCustomerId != null &&
        this.customerGroupForm.value.parentCustomerId != ""
      ) {
        this.planGroupForm.controls.invoiceType.enable();
        this.customerGroupForm.controls.invoiceType.disable();
        if (this.customerGroupForm.value.parentExperience == "Single")
          this.planGroupForm.patchValue({ invoiceType: "Group" });
        else this.planGroupForm.patchValue({ invoiceType: "" });
      }
    } else if (planaddDetailType == "groupPlan") {
      if (partnerId && serviceAreaId && !this.isBranchAvailable) {
        this.getPlangroupByPartner(partnerId);
      }
      if (this.serviceAreaData) {
        this.filterNormalPlanGroup = [];
        if (this.custType == "Prepaid") {
          this.commondropdownService.PrepaidPlanGroupDetails.forEach(element => {
            if (
              element.planMode == "NORMAL" &&
              (element.planGroupType === "Registration" ||
                element.planGroupType === "Registration and Renewal")
            ) {
              this.filterNormalPlanGroup.push(element);
            }
          });
        }
        if (this.custType == "Postpaid") {
          this.commondropdownService.postPlanGroupDetails.forEach(element => {
            if (
              element.planMode == "NORMAL" &&
              (element.planGroupType === "Registration" ||
                element.planGroupType === "Registration and Renewal")
            ) {
              this.filterNormalPlanGroup.push(element);
            }
          });
        }
        let data1;
        let data2;
        if (this.filterNormalPlanGroup) {
          data1 = this.filterNormalPlanGroup.filter(
            plan => plan.servicearea.id == this.serviceAreaData.id
          );
          data2 = this.filterNormalPlanGroup.filter(plan =>
            plan.servicearea.filter(e => e == this.serviceAreaData.id)
          );
        }
        this.filterNormalPlanGroup = [...data1, ...data2];
        if (
          this.customerGroupForm.value.parentCustomerId != null &&
          this.customerGroupForm.value.parentCustomerId != ""
        ) {
          this.customerGroupForm.controls.invoiceType.enable();
          this.planGroupForm.controls.invoiceType.disable();
          if (this.customerGroupForm.value.parentExperience == "Single")
            this.customerGroupForm.patchValue({ invoiceType: "Group" });
          else this.customerGroupForm.patchValue({ invoiceType: "" });
        }
      }

      this.ifIndividualPlan = false;
      this.ifPlanGroup = true;
      this.customerGroupForm.patchValue({
        plangroupid: ""
      });
    } else {
      this.ifIndividualPlan = false;
      this.ifPlanGroup = false;
    }
  }

  billtoSelectValue() {
    this.payMappingListFromArray.controls = [];
    this.planGroupForm.reset();
    this.planGroupForm.controls.skipQuotaUpdate.setValue(false);
    this.plansArray = this.fb.array([]);
    this.customerGroupForm.patchValue({
      plangroupid: ""
    });
  }

  onChangeArea(_event: any, index: any) {
    this.getAreaData(_event.value, index);
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
                        if (!this.customerGroupForm.controls.serviceareaid.value) {
                          this.customerGroupForm.controls.serviceareaid.setValue(res.data);
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
                          //   subareaId: Number(subarea.data),
                          pincodeId: Number(this.areaDetails.pincodeId),
                          cityId: Number(this.areaDetails.cityId),
                          stateId: Number(this.areaDetails.stateId),
                          countryId: Number(this.areaDetails.countryId)
                        });
                      }
                      if (index === "payment") {
                        this.paymentareaDetails = response.data;

                        this.selectPincodeListPayment = true;

                        this.paymentGroupForm.patchValue({
                          addressType: "Payment",
                          pincodeId: Number(this.paymentareaDetails.pincodeId),
                          cityId: Number(this.paymentareaDetails.cityId),
                          stateId: Number(this.paymentareaDetails.stateId),
                          countryId: Number(this.paymentareaDetails.countryId)
                        });
                      }
                      if (index === "permanent") {
                        this.permanentareaDetails = response.data;

                        this.selectPincodeListPermanent = true;
                        this.permanentGroupForm.patchValue({
                          addressType: "Permanent",
                          pincodeId: Number(this.permanentareaDetails.pincodeId),
                          cityId: Number(this.permanentareaDetails.cityId),
                          stateId: Number(this.permanentareaDetails.stateId),
                          countryId: Number(this.permanentareaDetails.countryId)
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
                        this.buildingListDD = response.dataList;
                        if (this.iscustomerEdit) {
                          let buildingEvent = {
                            value: Number(this.viewcustomerListData.addressList[0].building_mgmt_id)
                          };
                          this.onChangeBuildingArea(buildingEvent);
                        }
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

  onChangeBuildingArea(_event: any) {
    if (_event.value) {
      this.buildingNoDD = [];
      const url = "/buildingmgmt/getBuildingMgmtNumbers?buildingMgmtId=" + _event.value;
      this.areaManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.buildingNoDD = response.dataList.map(buildingNumber => ({ buildingNumber }));
        },
        () => {}
      );
    }
  }

  onChangeInvoiceToOrg(e) {
    if (!this.ifPlanGroup) {
      this.plansArray.value.forEach(element => {
        element.isInvoiceToOrg = e.value;
      });
    }
  }

  planGroupSelectSubisu(e) {
    if (this.ifPlanGroup) {
      this.customerGroupForm.patchValue({
        discount: 0
      });

      this.planDataForm.patchValue({
        discountPrice: 0
      });
    }
    this.ifcustomerDiscountField = false;
    if (e.value) {
      this.planGroupSelected = e.value;
      let mvnoId =
        localStorage.getItem("mvnoId") == "1"
          ? this.customerGroupForm.value?.mvnoId
          : Number(localStorage.getItem("mvnoId"));
      let url = "/findPlanGroupById?planGroupId=" + e.value + "&mvnoId=" + mvnoId;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          const planDetailData = response.planGroup;
          if (response.planGroup.allowDiscount == true) {
            this.ifcustomerDiscountField = true;
          } else {
            this.ifcustomerDiscountField = false;
          }
          if (planDetailData.category == "Business Promotion") {
            this.ifplanisSubisuSelect = true;
            this.customerGroupForm.patchValue({
              billTo: "ORGANIZATION",
              isInvoiceToOrg: planDetailData.invoiceToOrg
            });
            this.planGroupSelectedSubisu = e.value;
            this.getPlanListByGroupIdSubisu();
          } else if (
            this.customerGroupForm.value.billTo == "ORGANIZATION" &&
            planDetailData.category == "Normal" &&
            this.ifplanisSubisuSelect == false
          ) {
            this.ifplanisSubisuSelect = false;
            this.customerGroupForm.patchValue({
              billTo: "ORGANIZATION"
            });
            $("#selectPlanGroup").modal("show");
            this.planGroupSelectedSubisu = e.value;
            this.getPlanListByGroupIdSubisu();
          } else {
            this.ifplanisSubisuSelect = false;
            this.customerGroupForm.patchValue({
              billTo: "CUSTOMER"
            });
            this.planGroupSelectedSubisu = e.value;
          }
          let newAmount = 0;
          let totalAmount = 0;
          this.planIds = [];
          planDetailData.planMappingList.forEach((element, i) => {
            let n = i + 1;
            newAmount =
              element.newofferprice != null && element.newofferprice != 0
                ? element.newofferprice
                : element.plan.offerprice;
            totalAmount = Number(totalAmount) + Number(newAmount);
            if (planDetailData.planMappingList.length == n) {
              this.planDataForm.patchValue({
                offerPrice: totalAmount
              });
            }
            this.planIds.push(element.plan.id);
          });
          this.discountPercentage({}, null);
        },
        () => {}
      );
    }
    if (e.value) {
      this.getPlangroupByPlan(e.value);
      this.planGroupDataById(e.value);
    }
  }

  planGroupDataById(planGroupId) {
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    let url = "/findPlanGroupById?planGroupId=" + planGroupId + "&mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.planGroupMapingList = response.planGroup.planMappingList;
    });
  }

  subisuPrice(e) {
    this.newSubisuPrice = e.target.value;
  }
  modalClosePlanChangeSubisu() {
    $("#selectPlanGroup").modal("hide");
  }

  discountPercentage(e, discountAmount) {
    if (this.planGroupForm.value.discountType === "Recurring") {
      const control = this.planGroupForm.get("discount");
      // ✅ HARD STOP if disabled
      if (control?.disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }

    // event.preventDefault();
    let inputValue = e?.target?.value ?? discountAmount ?? "";
    this.disabledDiscExpiryDate =
      discountAmount == null || discountAmount == undefined ? false : true;
    this.isExpiredDate = true;
    inputValue = String(inputValue);

    let rawValue = inputValue.replace(/,/g, "");
    let newValue = parseFloat(rawValue);

    if (rawValue.includes("-")) {
      if (Math.abs(newValue) > 99) {
        e.target.value = "-99";
      }
    } else {
      if (newValue > 99) {
        e.target.value = "99";
      } else if (newValue < -99) {
        e.target.value = "-99";
      }
    }

    if (this.ifPlanGroup) {
      this.customerManagementService
        .getofferPriceWithTax(
          this.planIds,
          this.customerGroupForm.value.discount,
          this.planGroupSelected
        )
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            this.finalOfferPrice = response.result.finalAmount.toFixed(3);
            this.discountValue = response.result.finalAmount.toFixed(3);
          } else {
            this.finalOfferPrice = 0;
            this.discountValue = 0;
          }
          this.planDataForm.patchValue({
            discountPrice: Number(this.discountValue).toFixed(2)
          });
        });
    } else {
      this.customerManagementService
        .getofferPriceWithTax(this.planGroupForm.value.planId, newValue)
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            this.finalOfferPrice = response.result.finalAmount.toFixed(3);
            this.discountValue = response.result.finalAmount.toFixed(3);
          } else {
            this.finalOfferPrice = 0;
            this.discountValue = 0;
          }
        });
    }
  }

  getPlangroupByPlan(planGroupId) {
    this.planDropdownInChageData = [];
    const MappURL = "/findPlanGroupMappingByPlanGroupId?planGroupId=" + planGroupId;
    this.customerManagementService.getMethod(MappURL).subscribe((response: any) => {
      const attributeList = response.planGroupMappingList;
      attributeList.forEach(element => {
        this.planDropdownInChageData.push(element.plan);
      });

      if (this.ifPlanGroup && this.iscustomerEdit) {
        let newAmount = 0;
        let totalAmount = 0;
        attributeList.forEach((element, i) => {
          let n = i + 1;
          newAmount =
            element.plan.newOfferPrice != null
              ? element.plan.newOfferPrice
              : element.plan.offerprice;
          totalAmount = Number(totalAmount) + Number(newAmount);
          if (attributeList.length == n) {
            this.planDataForm.patchValue({
              offerPrice: totalAmount
            });

            let price = Number(this.planDataForm.value.offerPrice);
            let discount = Number(this.customerGroupForm.value.discount);
            let DiscountV = (price * discount) / 100;
            let discountValueNUmber = DiscountV.toFixed(2);
            this.discountValue = Number(discountValueNUmber);
            let discountfV = Number(this.planDataForm.value.offerPrice) - this.discountValue;
            this.planDataForm.patchValue({
              discountPrice: discountfV.toFixed(2)
            });
          }
        });
      }
    });
  }

  getPlanListByGroupIdSubisu() {
    this.planTotalOffetPrice = 0;
    this.planListSubisu = [];
    this.plansArray.reset();
    this.plansArray = this.fb.array([]);

    const url = `/plansByPlanGroupId?planGroupId=` + this.planGroupSelectedSubisu;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planListSubisu = response.planList;
        this.planListSubisu.forEach(element => {
          let newAmount =
            element.newOfferPrice != null ? element.newOfferPrice : element.offerprice;

          this.plansArray.push(
            this.fb.group({
              planId: element.id,
              name: element.displayName,
              service: element.serviceId,
              validity: element.validity,
              discount: element.discount,
              billTo: "ORGANIZATION",
              offerPrice: element.offerprice,
              newAmount: element.newOfferPrice != null ? element.newOfferPrice : element.offerprice,
              chargeName: element.chargeList[0].charge.name,
              isInvoiceToOrg: this.customerGroupForm.value.isInvoiceToOrg,
              skipQuotaUpdate:
                this.customerGroupForm.value.skipQuotaUpdate == null
                  ? false
                  : this.customerGroupForm.value.skipQuotaUpdate
            })
          );

          this.planTotalOffetPrice = this.planTotalOffetPrice + Number(newAmount);
        });

        this.planDataForm.patchValue({
          offerPrice: this.planTotalOffetPrice
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

  checkIfDiscountPlanGroup(plangroupid) {
    if (plangroupid !== null && plangroupid !== undefined && plangroupid !== "") {
      return !this.filterNormalPlanGroup.find(planGroup => planGroup.planGroupId === plangroupid)
        .allowDiscount;
    } else {
      return false;
    }
  }

  serviceBasePlanDATA(event) {
    this.servicePlanId = event.value;
    const serviceId = event.value;
    const servicename = this.serviceData.find(item => item.id == serviceId).name;
    this.planGroupForm.patchValue({ service: servicename });
    this.planGroupForm.controls.istrialplan.reset();
    this.plantypaSelectData = [];
    if (!this.isBranchAvailable) {
      this.plantypaSelectData = this.filterPlanData.filter(
        id =>
          id.serviceId === this.planGroupForm.controls.serviceId.value &&
          (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
      );
      this.filterPlan = this.filterPlanData.filter(
        id => id.planGroup === "Registration" || id.planGroup === "Registration and Renewal"
      );
    } else {
      let planserviceData;
      let planServiceID = "";
      this.changeTrialCheck();
      let mvnoId =
        localStorage.getItem("mvnoId") == "1"
          ? this.customerGroupForm.value?.mvnoId
          : Number(localStorage.getItem("mvnoId"));
      const planserviceurl = "/planservice/all" + "?mvnoId=" + mvnoId;
      this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
        planserviceData = response.serviceList.filter(service => service.id === serviceId);
        this.isSerialNumberShow = planserviceData[0].serviceParamMappingList.some(
          item => item.serviceParamName !== null && item.serviceParamName === "Product Required"
        );
        if (planserviceData.length > 0) {
          planServiceID = planserviceData[0].id;

          this.plantypaSelectData = this.filterPlanData.filter(
            id =>
              id.serviceId === planServiceID &&
              (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
          );
          this.filterPlan = this.filterPlanData.filter(
            id => id.planGroup === "Registration" || id.planGroup === "Registration and Renewal"
          );
          if (this.payMappingListFromArray?.length > 0) {
            let selectedCurrency = this.payMappingListFromArray?.value[0]?.currency;
            this.plantypaSelectData = this.plantypaSelectData.filter(plan => {
              const chargeCurrency = plan?.currency ?? this.currency;
              return chargeCurrency === selectedCurrency;
            });
          }
          if (this.plantypaSelectData.length === 0) {
            this.messageService.add({
              severity: "info",
              summary: "Note ",
              detail: "Plan not available for this customer type and service ",
              icon: "far fa-times-circle"
            });
          }
        }
      });
    }
  }
  changeTrialCheck() {
    if (
      this.payMappingListFromArray.value != null &&
      this.payMappingListFromArray.value.length > 0 &&
      this.planGroupForm.value.service != null &&
      this.planGroupForm.value.service != ""
    ) {
      var isCheckingDone = false;
      this.payMappingListFromArray.value.forEach(element => {
        if (!isCheckingDone) {
          if (element.service == this.planGroupForm.value.service && element.istrialplan) {
            this.isTrialCheckDisable = true;
            isCheckingDone = true;
          } else this.isTrialCheckDisable = false;
        }
      });
    } else {
      this.isTrialCheckDisable = false;
    }

    return false;
  }

  getPlanValidity(event) {
    const planId = event.value;
    this.checkIfDiscount(planId);
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/postpaidplan/" + planId + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const planDetailData = response.postPaidPlan;
        if (response.postPaidPlan.allowdiscount == true) {
          this.planGroupForm.patchValue({ discount: null });
          this.ifcustomerDiscountField = true;
        } else {
          this.planGroupForm.patchValue({ discount: null });
          this.ifcustomerDiscountField = false;
        }
        this.planGroupForm.patchValue({
          validity: Number(planDetailData.validity),
          offerprice: Number(planDetailData.offerprice),
          currency: planDetailData.currency
        });
        this.validityUnitFormGroup.patchValue({
          validityUnit: planDetailData.unitsOfValidity
        });
        if (planDetailData.category == "Business Promotion") {
          this.ifplanisSubisuSelect = true;
          this.customerGroupForm.patchValue({
            billTo: "ORGANIZATION",
            isInvoiceToOrg: planDetailData.invoiceToOrg
          });
          this.planGroupForm.patchValue({
            newAmount: Number(planDetailData.newOfferPrice)
          });
        } else if (
          this.customerGroupForm.value.billTo == "ORGANIZATION" &&
          planDetailData.category == "Normal" &&
          this.ifplanisSubisuSelect == false
        ) {
          this.ifplanisSubisuSelect = false;
          this.customerGroupForm.patchValue({
            billTo: "ORGANIZATION"
          });
          this.planGroupForm.patchValue({
            newAmount: Number(planDetailData.offerprice)
          });
        } else {
          this.ifplanisSubisuSelect = false;
          this.customerGroupForm.patchValue({
            billTo: "CUSTOMER"
          });
        }
        this.discountValue = planDetailData.offerprice;
        this.planGroupForm.controls.validity.disable();
        this.discountList = planDetailData?.discountList;
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

  checkIfDiscount(planId) {
    let data: any;
    if (planId !== null && planId !== undefined && planId !== "") {
      data = this.plantypaSelectData.find(plan => plan.id === planId);

      if (data.allowdiscount) {
        this.ifdiscounAllow = false;
      } else {
        this.ifdiscounAllow = true;
      }
    } else {
      this.ifdiscounAllow = false;
    }
  }

  onAddplanMappingList() {
    this.plansubmitted = true;
    let disValue = 0;
    if (this.planGroupForm.valid) {
      this.discountValueStore.push({ value: this.discountValue });
      if (this.discountValue == 0) {
        disValue =
          Number(this.planGroupForm.value.offerprice) +
          Number(this.planDataForm.value.discountPrice);
      } else {
        disValue = Number(this.discountValue) + Number(this.planDataForm.value.discountPrice);
      }
      this.planDataForm.patchValue({
        discountPrice: disValue.toFixed(2)
      });
      this.serialNumber = this.planGroupForm.value.serialNumber;
      this.planTotalOffetPrice =
        this.planTotalOffetPrice + Number(this.planGroupForm.value.offerprice);

      this.planDataForm.patchValue({
        offerPrice: this.planTotalOffetPrice
      });

      if (this.planGroupForm.value.planId) {
        this.getChargeUsePlanList(this.planGroupForm.value.planId);
      }
      this.payMappingListFromArray.push(this.planMappingListFormGroup());
      this.validityUnitFormArray.push(this.validityUnitListFormGroup());
      this.validityUnitFormGroup.reset();
      if (this.payMappingListFromArray?.length > 0) {
        this.customerGroupForm
          .get("currency")
          .setValue(this.payMappingListFromArray?.value[0]?.currency);
        this.planCurrency = this.payMappingListFromArray?.value[0]?.currency;

        this.getAllPlanData(this.payMappingListFromArray?.value[0]?.currency);
      }
      this.filterChargesByCurrency(this.planGroupForm.value);

      this.planGroupForm.reset();
      this.planGroupForm.controls.skipQuotaUpdate.setValue(false);
      this.planGroupForm.controls.validity.enable();
      this.plansubmitted = false;
      this.discountType = "One-time";
      this.discountValue = 0;
      if (this.customerGroupForm.value.parentExperience == "Single")
        this.planGroupForm.patchValue({ invoiceType: "Group" });
      else this.planGroupForm.patchValue({ invoiceType: "" });
    } else {
    }
  }

  filterChargesByCurrency(plan) {
    const selectedCurrency = plan?.currency;

    this.plantypaSelectData = this.plantypaSelectData.filter(plan => {
      const chargeCurrency = plan?.currency ?? this.currency;
      return chargeCurrency === selectedCurrency;
    });
  }

  validityUnitListFormGroup(): FormGroup {
    return this.fb.group({
      validityUnit: [this.validityUnitFormGroup.value.validityUnit]
    });
  }

  getChargeUsePlanList(id) {
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/postpaidplan/" + id + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      const data = response.postPaidPlan;
      this.planDropdownInChageData.push(data);
    });
  }

  isDiscountDisabledByIndex(index: number): boolean {
    return (
      this.iscustomerEdit ||
      !this.ifcustomerDiscountField ||
      this.disabledDiscExpiryDate ||
      index > 0
    );
  }

  planMappingListFormGroup(): FormGroup {
    for (const prop in this.planGroupForm.controls) {
      this.planGroupForm.value[prop] = this.planGroupForm.controls[prop].value;
    }

    return this.fb.group({
      planId: [this.planGroupForm.value.planId, Validators.required],
      service: [this.planGroupForm.value.service, Validators.required],
      validity: [this.planGroupForm.value.validity, Validators.required],
      serviceId: [
        this.serviceData
          .filter(data => this.planGroupForm.value.service.includes(data.name))
          .map(data => data.id)[0],
        Validators.required
      ],

      discount: [this.planGroupForm.value.discount ? this.planGroupForm.value.discount : 0],
      billTo: [this.customerGroupForm.value.billTo],
      billableCustomerId: [this.customerGroupForm.value.billableCustomerId],
      newAmount: [this.planGroupForm.value.newAmount],
      invoiceType: [this.planGroupForm.value.invoiceType],
      offerPrice: [this.planGroupForm.value.offerprice],
      isInvoiceToOrg: [this.customerGroupForm.value.isInvoiceToOrg],
      istrialplan: [this.planGroupForm.value.istrialplan],
      discountType: [this.planGroupForm.value.discountType],
      discountTypeData: [this.planGroupForm.value.discountTypeData],
      serialNumber: [this.planGroupForm.value.serialNumber],
      discountExpiryDate: [
        this.planGroupForm.value.discountExpiryDate
          ? moment(this.planGroupForm.value.discountExpiryDate).utc(true).toDate()
          : null
      ],
      skipQuotaUpdate: [this.planGroupForm.value.skipQuotaUpdate],
      currency: [this.planGroupForm.value.currency]
    });
  }
  previousValue: number;
  discountChange(e, index) {
    let newValue = parseFloat(e.target.value);

    if (newValue > 99.99) {
      e.target.value = "99";
    } else if (newValue < -99.99) {
      e.target.value = "-99";
    } else {
      this.previousValue = newValue;

      let lastvalue: any = 0;

      this.customerManagementService
        .getofferPriceWithTax(
          this.payMappingListFromArray.value[index].planId,
          this.payMappingListFromArray.value[index].discount,
          this.payMappingListFromArray.value[index].planGroupId
        )
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            lastvalue = response.result.finalAmount.toFixed(3);
          } else {
            lastvalue = 0;
          }
          this.planDataForm.patchValue({
            discountPrice: Number(
              this.planDataForm.value.discountPrice -
                this.discountValueStore[index].value +
                lastvalue
            ).toFixed(2)
          });

          this.discountValueStore[index].value = lastvalue;
        });
    }
  }

  deleteConfirmonChargeField(chargeFieldIndex: number, name: string) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      const msgTxt: string = "";
      if (name == "paymapping") {
        msgTxt == "Do you want to delete this Payment ?";
      } else if (name == "chargelist") {
        msgTxt == "Do you want to delete this Charge ?";
      } else if (name == "MAC") {
        msgTxt == "Do you want to delete this MAC Address ?";
      } else if (name == "uploadDocument") {
        msgTxt == "Do you want to delete this Document ?";
      }
      this.confirmationService.confirm({
        message: "Do you want to delete this " + name + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          switch (name) {
            case "Plan":
              if (this.ifplanisSubisuSelect == true) {
                this.ifplanisSubisuSelect = false;
                this.customerGroupForm.patchValue({
                  billTo: "CUSTOMER",
                  parentExperience: "Actual"
                });
              }

              this.onRemovePayMapping(chargeFieldIndex);
              break;
          }
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    }
  }

  async onRemovePayMapping(chargeFieldIndex: number) {
    this.planTotalOffetPrice =
      this.planTotalOffetPrice -
      Number(this.payMappingListFromArray.value[chargeFieldIndex].offerPrice);

    this.planDataForm.patchValue({
      offerPrice: this.planTotalOffetPrice,
      discountPrice: Number(
        this.planDataForm.value.discountPrice - this.discountValueStore[chargeFieldIndex].value
      ).toFixed(2)
    });

    this.payMappingListFromArray.removeAt(chargeFieldIndex);
    let obj = {
      value: this.servicePlanId
    };
    this.serviceBasePlanDATA(obj);
    this.discountValueStore.splice(chargeFieldIndex, 1);
    if (this.payMappingListFromArray.value.length == 0) {
      this.discountValueStore = [];
      this.planTotalOffetPrice = 0;
      this.planDataForm.patchValue({
        discountPrice: 0,
        offerPrice: 0
      });
    }
    this.changeTrialCheck();
    this.vasData = "";
    this.servicePackForm.get("vasId").reset();
  }

  pageChangedpayMapping(pageNumber) {
    this.currentPagePayMapping = pageNumber;
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

  closeParentCust() {
    this.showParentCustomerModel = false;
  }

  openSearchModel() {
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
  }

  checkUsernme(customerId) {
    this.submitted = true;
    if (this.isValidUsername) {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: this.responseMessage || "username is already exist",
        icon: "far fa-times-circle"
      });
      return;
    }
    if (this.customerGroupForm.valid) {
      const isCredentialMatch =
        this.customerGroupForm.controls.isCredentialMatchWithAccountNo.value;
      if (isCredentialMatch) {
        if (this.isThisTumil && this.isWrongHouseholdId) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please Enter Valid Household Id.",
            icon: "far fa-times-circle"
          });
        } else {
          if (this.isThisTumil && this.isWrongHouseholdId) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Please Enter Valid Household Id.",
              icon: "far fa-times-circle"
            });
          } else {
            this.addEditcustomer(customerId);
          }
        }
      } else {
        let mvnoId =
          localStorage.getItem("mvnoId") === "1"
            ? this.customerGroupForm.value?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        const url =
          "/customer/customerUsernameIsAlreadyExists/" +
          this.customerGroupForm.controls.username.value +
          "?mvnoId=" +
          mvnoId;
        this.customerManagementService.getMethod(url).subscribe((response: any) => {
          if (response.isAlreadyExists) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Username already exists!!",
              icon: "far fa-times-circle"
            });
          } else {
            this.addEditcustomer(customerId);
          }
        });
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Required",
        detail: "Fields are Mandatory or Invalid. Please fill or update those fields.",
        icon: "far fa-times-circle"
      });
      this.scrollToError();
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector(".ng-invalid[formControlName]");
    this.scrollTo(firstElementWithError);
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  deleteConfirmip(index: number, name: string) {
    if (index || index === 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + name + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          switch (name) {
            case "ipAddress":
              this.ipMapppingListFromArray.removeAt(index);
              break;
            default:
              break;
          }
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    }
  }
  addEditcustomer(customerId) {
    this.submitted = true;
    let i = 0;
    let j = 0;
    let K = 0;
    let x = 0;
    let a = 0;
    let b = 0;
    let c = 0;
    let addressListData: any = [];

    if (this.customerGroupForm.valid && this.presentGroupForm.valid) {
      if (customerId) {
        this.customerGroupForm.value.pan = this.customerGroupForm.value.pan
          ? this.customerGroupForm.value.pan.trim()
          : "";
        if (this.customerGroupForm.value.maxconcurrentsession < this.customerMacCount) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "You can not set max concurrent session less then customer mac.",
            icon: "far fa-check-circle"
          });
          return;
        }
        const url = "/customers/" + customerId;
        this.customerGroupForm.value.flatAmount = this.planDataForm.value.discountPrice;
        this.customerGroupForm.value.discount = this.customerGroupForm.value.discount
          ? this.customerGroupForm.value.discount
          : 0;
        if (this.presentGroupForm.value.addressType) {
          addressListData.push(this.presentGroupForm.value);
        }
        if (this.paymentGroupForm.value.addressType) {
          addressListData.push(this.paymentGroupForm.value);
        }
        if (this.permanentGroupForm.value.addressType) {
          addressListData.push(this.permanentGroupForm.value);
        }
        if (
          this.customerGroupForm.value.countryCode == "" ||
          this.customerGroupForm.value.countryCode == null
        ) {
          this.customerGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
        }
        if (
          this.customerGroupForm.value.calendarType == "" ||
          this.customerGroupForm.value.calendarType == null
        ) {
          this.customerGroupForm.value.calendarType = "English";
        }

        this.customerGroupForm.value.discount = this.customerGroupForm.value.discount
          ? this.customerGroupForm.value.discount
          : 0;
        this.createcustomerData = this.customerGroupForm.value;
        this.createcustomerData.customerLocations = this.locationMacData;
        this.createcustomerData.addressList = addressListData;

        this.createcustomerData.failcount = Number(this.createcustomerData.failcount);
        if (
          this.customerGroupForm.controls.partnerid.value == null ||
          this.customerGroupForm.controls.partnerid.value == ""
        ) {
          this.createcustomerData.partnerid = 1;
        } else {
          this.createcustomerData.partnerid =
            this.partnerId !== 1 ? this.partnerId : this.customerGroupForm.controls.partnerid.value;
        }
        // this.createcustomerData.partnerid = Number(this.createcustomerData.partnerid);
        this.createcustomerData.paymentDetails.amount = Number(
          this.createcustomerData.paymentDetails.amount
        );
        // if (this.viewcustomerListData.parentExperience != null) {
        //   this.customerGroupForm.controls.parentExperience.enable();
        // }
        while (a < this.createcustomerData.addressList.length) {
          this.createcustomerData.addressList[a].areaId = Number(
            this.createcustomerData.addressList[a].areaId
          );
          this.createcustomerData.addressList[a].pincodeId = Number(
            this.createcustomerData.addressList[a].pincodeId
          );
          this.createcustomerData.addressList[a].cityId = Number(
            this.createcustomerData.addressList[a].cityId
          );
          this.createcustomerData.addressList[a].stateId = Number(
            this.createcustomerData.addressList[a].stateId
          );
          this.createcustomerData.addressList[a].countryId = Number(
            this.createcustomerData.addressList[a].countryId
          );

          a++;
        }
        while (b < this.createcustomerData.planMappingList.length) {
          this.createcustomerData.planMappingList[b].planId = Number(
            this.createcustomerData.planMappingList[b].planId
          );
          b++;
        }

        while (c < this.createcustomerData.overChargeList.length) {
          this.createcustomerData.overChargeList[c].chargeid = Number(
            this.createcustomerData.overChargeList[c].chargeid
          );
          this.createcustomerData.overChargeList[c].validity = Number(
            this.createcustomerData.overChargeList[c].validity
          );
          this.createcustomerData.overChargeList[c].price = Number(
            this.createcustomerData.overChargeList[c].price
          );
          this.createcustomerData.overChargeList[c].actualprice = Number(
            this.createcustomerData.overChargeList[c].actualprice
          );
          c++;
        }
        if (
          this.createcustomerData.plangroupid == null ||
          this.createcustomerData.plangroupid == ""
        )
          this.createcustomerData.invoiceType = null;

        //this.createcustomerData.parentExperience = this.customerGroupForm.controls.parentExperience;

        this.createcustomerData.custtype = this.custType;
        // this.createcustomerData.acctno = this.viewcustomerListData.acctno;
        // this.createcustomerData.isDunningEnable = this.viewcustomerListData.isDunningEnable;
        // this.createcustomerData.isNotificationEnable =
        //   this.viewcustomerListData.isNotificationEnable;
        this.createcustomerData.username = this.customerGroupForm.controls.username.value;
        if (this.customerGroupForm.value.plangroupid) {
          // this.createcustomerData.planMappingList = this.planGroupMapingList.value;
          this.createcustomerData.planMappingList = this.plansArray.value;
        }
        this.createcustomerData.planPurchaseType = this.customerGroupForm.value.planCategory;

        this.createcustomerData.parentQuotaType = this.customerGroupForm.value.parentQuotaType;

        while (x < this.createcustomerData.customerLocations.length) {
          this.createcustomerData.customerLocations[x].locationId = Number(
            this.locationMacData[x].locationId
          );
          this.createcustomerData.customerLocations[x].mac = this.locationMacData[x].mac;
          this.createcustomerData.customerLocations[x].isParentLocation =
            this.locationMacData[x].isParentLocation;
          x++;
        }
        if (this.customerGroupForm.value.birthDate) {
          this.createcustomerData.birthDate = new Date(this.customerGroupForm.value.birthDate);
        } else {
          this.createcustomerData.birthDate = this.customerGroupForm.value.birthDate;
        }
        if (
          this.createcustomerData?.mac_provision == null ||
          this.createcustomerData?.mac_provision == undefined
        ) {
          this.createcustomerData.mac_provision = false;
        }
        let departmentId = this.customerGroupForm.value?.departmentId;
        if (departmentId) {
          let departmentData = this.departmentListData?.find(x => x?.id === departmentId);
          this.createcustomerData.department = departmentData?.name;
        }
        const storedMvnoId = localStorage.getItem("mvnoId");
        const mvnoId = storedMvnoId === "1" ? this.customerGroupForm.value?.mvnoId : storedMvnoId;

        this.createcustomerData.mvnoId = mvnoId;
        this.customerManagementService.updateMethod(url, this.createcustomerData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.iscustomerEdit = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.deactivateService.setShouldCheckCanExit(false);
            this.router.navigate(["/home/customer/list/" + this.custType]);
            // this.customerID = "";
            // this.payMappingListFromArray.controls = [];
            // this.overChargeListFromArray.controls = [];
            // this.custMacMapppingListFromArray.controls = [];
            // //   this.uploadDocumentListFromArray.controls = [];

            // this.customerFormReset();
            // this.customerGroupForm.controls.parentExperience.disable();
            // //  this.uploadDocumentGroupForm.reset();
            // this.viewcustomerListData = [];
            // this.planCategoryForm.reset();
            // this.addressListData = [];

            // this.listView = true;
            // this.createView = false;
            // this.selectAreaList = false;
            // this.selectchargeValueShow = false;
            // this.ifIndividualPlan = false;
            // this.ifPlanGroup = false;
            // //    this.listSearchView = false;
            // if (this.searchkey) {
            //   this.searchcustomer();
            // } else {
            //   this.getcustomerList("");
            // }
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
      } else {
        this.customerGroupForm.value.pan = this.customerGroupForm.value.pan
          ? this.customerGroupForm.value.pan.trim()
          : "";
        if (
          this.customerGroupForm.value.planMappingList.length > 0 ||
          this.customerGroupForm.value.plangroupid ||
          this.customerGroupForm.value.custlabel === "organization"
        ) {
          // if (this.presentGroupForm.value.addressType) {
          addressListData.push(this.presentGroupForm.value);
          addressListData[0].version = "NEW";
          // }
          if (this.paymentGroupForm.value.addressType) {
            addressListData.push(this.paymentGroupForm.value);
            // this.addressListData[1].addressType = "Payment";
          }
          if (this.permanentGroupForm.value.addressType) {
            addressListData.push(this.permanentGroupForm.value);
            // this.addressListData[2].addressType = "Permanent";
          }
          if (
            this.customerGroupForm.value.countryCode == "" ||
            this.customerGroupForm.value.countryCode == null
          ) {
            this.customerGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
          }
          if (
            this.customerGroupForm.value.calendarType == "" ||
            this.customerGroupForm.value.calendarType == null
          ) {
            this.customerGroupForm.value.calendarType = "English";
          }

          const url = "/customers";
          this.customerGroupForm.value.flatAmount = this.planDataForm.value.discountPrice;
          this.customerGroupForm.value.discount = this.customerGroupForm.value.discount
            ? this.customerGroupForm.value.discount
            : 0;

          this.customerGroupForm.get("billday").enable();
          this.createcustomerData = this.customerGroupForm.value;
          this.createcustomerData.customerLocations = this.locationMacData;
          this.createcustomerData.birthDate = new Date(this.customerGroupForm.value.birthDate);

          this.createcustomerData.addressList = addressListData;

          this.createcustomerData.failcount = Number(this.createcustomerData.failcount);
          if (
            this.customerGroupForm.controls.partnerid.value == null ||
            this.customerGroupForm.controls.partnerid.value == ""
          ) {
            this.createcustomerData.partnerid = 1;
          } else {
            this.createcustomerData.partnerid =
              this.partnerId !== 1
                ? this.partnerId
                : this.customerGroupForm.controls.partnerid.value;
          }
          // this.createcustomerData.partnerid = Number(this.createcustomerData.partnerid);
          this.createcustomerData.paymentDetails.amount = Number(
            this.createcustomerData.paymentDetails.amount
          );
          while (i < this.createcustomerData.addressList.length) {
            this.createcustomerData.addressList[i].areaId = Number(
              this.createcustomerData.addressList[i].areaId
            );
            this.createcustomerData.addressList[i].pincodeId = Number(
              this.createcustomerData.addressList[i].pincodeId
            );
            this.createcustomerData.addressList[i].cityId = Number(
              this.createcustomerData.addressList[i].cityId
            );
            this.createcustomerData.addressList[i].stateId = Number(
              this.createcustomerData.addressList[i].stateId
            );
            this.createcustomerData.addressList[i].countryId = Number(
              this.createcustomerData.addressList[i].countryId
            );
            i++;
          }
          while (j < this.createcustomerData.planMappingList.length) {
            this.createcustomerData.planMappingList[j].planId = Number(
              this.createcustomerData.planMappingList[j].planId
            );
            if (this.createcustomerData.planMappingList[j].discount == null) {
              this.createcustomerData.planMappingList[j].discount = 0;
            }
            j++;
          }

          // while (l < this.createcustomerData.custDocList.length) {
          //   this.createcustomerData.custDocList[l].filename = this.createcustomerData.custDocList[l].filename;
          //   this.createcustomerData.custDocList[l].docStatus = this.createcustomerData.custDocList[l].docStatus;
          //   this.createcustomerData.custDocList[l].remark = this.createcustomerData.custDocList[l].remark;
          //   l++;
          // }

          while (K < this.createcustomerData.overChargeList.length) {
            this.createcustomerData.overChargeList[K].chargeid = Number(
              this.createcustomerData.overChargeList[K].chargeid
            );
            this.createcustomerData.overChargeList[K].validity = Number(
              this.createcustomerData.overChargeList[K].validity
            );
            this.createcustomerData.overChargeList[K].price = Number(
              this.createcustomerData.overChargeList[K].price
            );
            this.createcustomerData.overChargeList[K].actualprice = Number(
              this.createcustomerData.overChargeList[K].actualprice
            );
            K++;
          }
          this.createcustomerData.custtype = this.custType;
          if (this.customerGroupForm.value.plangroupid) {
            this.createcustomerData.planMappingList = this.plansArray.value;
            // this.createcustomerData.planMappingList = this.planGroupMapingList.value;
          }
          if (
            this.createcustomerData.plangroupid == null ||
            this.createcustomerData.plangroupid == ""
          )
            this.createcustomerData.invoiceType = null;
          this.createcustomerData.planPurchaseType = this.planCategoryForm.value.planCategory;

          this.createcustomerData.parentQuotaType = this.customerGroupForm.value.parentQuotaType;

          while (x < this.createcustomerData.customerLocations.length) {
            this.createcustomerData.customerLocations[x].locationId = Number(
              this.locationMacData[x].locationId
            );
            this.createcustomerData.customerLocations[x].mac = this.locationMacData[x].mac;
            this.createcustomerData.customerLocations[x].isParentLocation =
              this.locationMacData[x].isParentLocation;
            x++;
          }
          if (this.servicePackForm.valid && this.vasData) {
            this.createcustomerData.houseHoldIdList = [
              {
                householdId: this.householdData?.householdId,
                townshipName: this.householdData?.townshipName,
                wardName: this.householdData?.wardName,
                streetName: this.householdData?.streetName,
                houseNo: this.householdData?.houseNo,
                buildingName: this.householdData?.buildingName,
                mvnoId: this.householdData?.mvnoId,
                householdType: this.householdData?.householdType,
                fsrId: this.householdData?.fsrId,
                fsrName: this.householdData?.fsrName
              }
            ];
          }
          if (
            this.createcustomerData?.mac_provision == null ||
            this.createcustomerData?.mac_provision == undefined
          ) {
            this.createcustomerData.mac_provision = false;
          }
          // console.log("this.createcustomerData :::::::: ", this.createcustomerData);
          //
          // return;
          let departmentId = this.customerGroupForm.value?.departmentId;
          if (departmentId) {
            let departmentData = this.departmentListData?.find(x => x?.id === departmentId);
            this.createcustomerData.department = departmentData?.name;
          }
          let mvnoId = localStorage.getItem("mvnoId");
          mvnoId === "1" ? (mvnoId = this.customerGroupForm.value?.mvnoId) : mvnoId;
          this.createcustomerData.mvnoId = mvnoId;
          this.customerManagementService.postMethod(url, this.createcustomerData).subscribe(
            (response: any) => {
              if (response.responseCode == 406) {
                if (this.vasData) {
                  this.createcustomerData.planMappingList.pop();
                }
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else if (response.status == 400) {
                if (this.vasData) {
                  this.createcustomerData.planMappingList.pop();
                }
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: response.ERROR.mobile,
                  icon: "far fa-times-circle"
                });
              } else {
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: "Successfully Created",
                  icon: "far fa-check-circle"
                });
                this.deactivateService.setShouldCheckCanExit(false);
                this.submitted = false;
                this.servicePackForm.reset();
                this.vasData = "";
                this.router.navigate(["/home/customer/list/" + this.custType]);
                if (this.vasData) {
                  this.createcustomerData.planMappingList.pop();
                }
                // this.payMappingListFromArray.controls = [];
                // this.overChargeListFromArray.controls = [];
                // this.custMacMapppingListFromArray.controls = [];
                // // this.uploadDocumentListFromArray.controls = [];
                // this.addressListData = [];
                // this.customerGroupForm.controls.parentExperience.disable();
                // this.customerFormReset();
                // //  this.uploadDocumentGroupForm.reset();
                // this.selectchargeValueShow = false;

                // this.listView = true;
                // this.createView = false;
                // this.ifIndividualPlan = false;
                // this.ifPlanGroup = false;
                // // this.listSearchView = false;

                // this.selectAreaList = false;
                // if (this.searchkey) {
                //   this.searchcustomer();
                // } else {
                //   this.getcustomerList("");
                // }
              }
            },
            (error: any) => {
              // console.log(error, "error")
              if (this.vasData) {
                this.createcustomerData.planMappingList.pop();
              }
              if (error.status == 500) {
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
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Required ",
            detail: "Minimum one Plan Details need to add",
            icon: "far fa-times-circle"
          });
        }
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Fields are Mandatory or Invalid. Please fill or update those field.",
        icon: "far fa-times-circle"
      });
      this.scrollToError();
    }
  }

  anyMatchString(servicearea: any, string: any) {
    const serviceareanameLower = servicearea.name.toLowerCase();
    const searchStringLower = string.toLowerCase();
    return serviceareanameLower.includes(searchStringLower);
  }

  locationMacModelOpen() {
    this.getAllLocation();
    this.showLocationMac = true;
  }

  locationMacModelClose() {
    this.showLocationMac = false;
  }

  locationChange(value: any) {
    let locationUrl = "";
    if (value != null && value.length > 0) {
      value.forEach(location => {
        if (locationUrl == "") {
          locationUrl = locationUrl + "locationId=" + location;
        } else {
          locationUrl = locationUrl + "&locationId=" + location;
        }
      });

      let isParent;
      if (this.customerGroupForm.value.isParentLocation) {
        isParent = this.customerGroupForm.value.isParentLocation;
      } else {
        isParent = false;
      }
      locationUrl = locationUrl + "&isParentLocation=" + isParent;

      this.locationService.getAllMacByLocation(locationUrl).subscribe((response: any) => {
        this.macData = response.msg;
      });
    }
  }

  macChangeChange(dd: any) {
    this.overLocationMacArray = this.fb.array([]);
    if (dd.value.length > 0) {
      dd.value.forEach(mac => {
        let findmatch = this.macData.find(data => data.mac === mac);
        if (findmatch) {
          this.overLocationMacArray.push(
            this.fb.group({
              name: [findmatch.name],
              mac: [findmatch.mac],
              locationId: [findmatch.locationId],
              isAlreadyAvailable: false
            })
          );
        }
      });
    }

    if (this.custLocationData.length > 0) {
      this.custLocationData.forEach(custLocation => {
        this.overLocationMacArray.push(
          this.fb.group({
            name: [custLocation.locationName],
            mac: [custLocation.mac],
            locationId: [custLocation.locationId],
            isAlreadyAvailable: true
          })
        );
      });
    }
  }

  addMacAtEdit() {}

  saveLocationMacData() {
    this.locationMacData = this.overLocationMacArray.value.map(location => ({
      locationId: location.locationId, //location.locationId
      mac: location.mac,
      isParentLocation: this.customerGroupForm.value.isParentLocation
    }));
    this.showLocationMac = false;
  }

  parentLocationCheck(event: any) {
    if (event.checked) {
      this.locationMacData = this.locationMacData.map(location => ({
        locationId: location.locationId, //location.locationId
        mac: location.mac,
        isParentLocation: true
      }));
    } else {
      this.locationMacData = this.locationMacData.map(location => ({
        locationId: location.locationId, //location.locationId
        mac: location.mac,
        isParentLocation: false
      }));
    }
  }

  deleteLocationMapField(locationMapField: any, index: number) {
    const existingIndex = this.custLocationData.findIndex(
      x => x.locationId === locationMapField.value.locationId
    );
    this.custLocationData.splice(existingIndex);
    this.overLocationMacArray.removeAt(index);
  }

  locationMacModelCancel() {
    this.locationMacForm = this.fb.group({
      location: ["", Validators.required],
      mac: ["", Validators.required]
    });
    var selectedLocation = [];
    this.custLocationData = [];
    this.overLocationMacArray = this.fb.array([]);
    this.locationMacForm.get("mac").setValue("");
    this.locationMacData = [];

    this.custLocationData = [...this.custData.customerLocations];

    this.custData.customerLocations.forEach(location => {
      if (selectedLocation.indexOf(location.locationId) === -1) {
        selectedLocation.push(location.locationId);
      }

      this.overLocationMacArray.push(
        this.fb.group({
          name: [location.locationName],
          mac: [location.mac],
          locationId: [location.locationId],
          isAlreadyAvailable: true,
          isParentLocation: this.customerGroupForm.value.isParentLocation
        })
      );
    });
    if (this.overLocationMacArray.value.length > 0) {
      this.locationMacData = this.overLocationMacArray.value.map(location => ({
        locationId: location.locationId, //location.locationId
        mac: location.mac,
        isParentLocation: location.isParentLocation
      }));
    }
    this.locationChange(selectedLocation);
    this.locationMacForm.get("location").setValue(selectedLocation);
    this.showLocationMac = false;
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

        this.customerGroupForm.patchValue({
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

  getBillToData() {
    let url = "/commonList/billTo";
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        if (this.custType == "Postpaid") {
          this.billToData = response.dataList.filter(billto => billto.value != "ORGANIZATION");
        } else {
          this.billToData = response.dataList;
        }
      },
      () => {}
    );
  }

  insertBillDay(event) {
    if (event.value == "Group") {
      this.customerGroupForm.controls.billday.setValue(this.parentBillday);
      this.customerGroupForm.get("billday").disable();
    } else if (event.value == "Independent" && this.isInvoiceTypeAlreadySelected) {
      this.customerGroupForm.controls.billday.setValue("");
      this.customerGroupForm.controls.billday.enable();
    }
  }

  invoiceTypeClick() {
    let invoiceType = this.planGroupForm.value.invoiceType;
    if (invoiceType) {
      this.isInvoiceTypeAlreadySelected = true;
    } else {
      this.isInvoiceTypeAlreadySelected = false;
    }
  }

  getCustomerMacCount() {
    const url = "/customerMacManagement/getMacCount?custId=" + this.editCustId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerMacCount = response.data;
      },
      (error: any) => {
        this.customerMacCount = 0;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  makeEmailAndMobileMandatoryOrNot() {
    this.systemService
      .getConfigurationByName("IS_MOBILE_AND_EMAIL_REQUIRED")
      .subscribe((res: any) => {
        this.isMobileAndEmailRequired = res.data.value == "true" ? true : false;
        if (this.isMobileAndEmailRequired) {
          this.customerGroupForm.get("mobile").setValidators([Validators.required]);
          this.customerGroupForm.get("mobile").updateValueAndValidity();
          this.customerGroupForm.get("email").setValidators([Validators.required]);
          this.customerGroupForm.get("email").updateValueAndValidity();
          this.customerGroupForm.controls.isEmailAndMobileRequired.patchValue(true);
        } else {
          this.customerGroupForm.get("mobile").clearValidators();
          this.customerGroupForm.get("mobile").updateValueAndValidity();
          this.customerGroupForm.get("email").clearValidators();
          this.customerGroupForm.get("email").updateValueAndValidity();
          this.customerGroupForm.controls.isEmailAndMobileRequired.patchValue(false);
        }
      });
  }
  keypressSession(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onCredentialMatchChange(event: any) {
    const isChecked = event.checked;
    this.isCredentialMatch = isChecked;

    if (isChecked) {
      this.customerGroupForm.get("username")?.setValue(null);
      this.customerGroupForm.get("username")?.disable();
      this.customerGroupForm.get("username")?.clearValidators();
      this.customerGroupForm.get("username")?.updateValueAndValidity();
      this.customerGroupForm.get("loginUsername")?.setValue(null);
      this.customerGroupForm.get("loginUsername")?.disable();
      this.customerGroupForm.get("loginUsername")?.clearValidators();
      this.customerGroupForm.get("loginUsername")?.updateValueAndValidity();
    } else {
      this.customerGroupForm.get("username")?.enable();
      this.customerGroupForm.get("username")?.setValidators([Validators.required]);
      this.customerGroupForm.get("username")?.updateValueAndValidity();
      this.customerGroupForm.get("loginUsername")?.enable();
      this.customerGroupForm.get("loginUsername")?.setValidators([Validators.required]);
      this.customerGroupForm.get("loginUsername")?.updateValueAndValidity();
    }
  }

  getDemographicLabel(currentName: string): string {
    if (!this.demographicLabel || this.demographicLabel.length === 0) {
      return currentName;
    }

    const label = this.demographicLabel.find(item => item.currentName === currentName);
    return label ? label.newName : currentName;
  }

  mvnoChange(event) {
    this.customerGroupForm.reset();
    this.customerFormInit();
    this.customerGroupForm.patchValue({
      mvnoId: event.value
    });
    this.planGroupForm.reset();
    this.planDataForm.reset();
    this.payMappingListFromArray.clear();
    this.planCategoryForm.reset();
    this.planGroupForm.controls.skipQuotaUpdate.setValue(false);
    this.planGroupForm.controls.validity.enable();
    this.commondropdownService.getplanservice(event.value);
    this.commondropdownService.getsystemconfigList(event.value);
    this.commondropdownService.findAllplanGroups(event.value);
    this.commondropdownService.getPostpaidplanData(event.value);
    this.systemService
      .getConfigurationByName("DEFAULT_CUSTOMER_CATEGORY", event.value)
      .subscribe((res: any) => {
        if (res?.data?.value) {
          this.customerGroupForm.controls.dunningCategory.setValue(res?.data?.value);
        }
      });
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList(event.value);
    } else {
      this.commondropdownService.getserviceAreaList(event.value);
    }
  }

  onPasswordAuotGenrated(event) {
    const isChecked = event.checked;
    this.isAutoGeneratedPassword = isChecked;
    if (isChecked) {
      if (this.isThisTumil) {
        const autoPassword = this.generateRandomPassword();
        this.customerGroupForm.get("loginPassword")?.setValue(autoPassword);
      } else {
        this.customerGroupForm.get("loginPassword")?.setValue(null);
      }
      if (!this.iscustomerEdit) {
        this.customerGroupForm.get("password")?.disable();
        this.customerGroupForm.get("password")?.clearValidators();
        this.customerGroupForm.get("password")?.updateValueAndValidity();
      }
      this.customerGroupForm.get("loginPassword")?.disable();
      this.customerGroupForm.get("loginPassword")?.markAsTouched();
      this.customerGroupForm.get("loginPassword")?.updateValueAndValidity();
    } else {
      this.customerGroupForm.get("password")?.enable();
      this.customerGroupForm.get("password")?.setValidators([Validators.required]);
      this.customerGroupForm.get("password")?.updateValueAndValidity();
      this.customerGroupForm.get("loginPassword")?.enable();
      this.customerGroupForm.get("loginPassword")?.setValidators([Validators.required]);
      this.customerGroupForm.get("loginPassword")?.updateValueAndValidity();
    }
  }

  onKeyLoginUserName(username) {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/childCustomer/isChildUserExist?username=" + username + "&mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.isValidUsername = response.data;
      this.responseMessage = response.responseMessage;
      if (this.isValidUsername) {
        this.messageService.add({
          severity: "error",
          summary: "Required ",
          detail: this.responseMessage || "username is already exist",
          icon: "far fa-times-circle"
        });
      }
    });
  }

  customerFormInit() {
    this.customerGroupForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", [Validators.required, this.noSpaceValidator]],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      title: [""],
      pan: [""],
      gst: [""],
      aadhar: [""],
      passportNo: [""],
      tinNo: ["", [Validators.minLength(9), Validators.maxLength(9)]],
      contactperson: ["", Validators.required],
      failcount: ["0"],
      // acctno: ['', Validators.required],
      custtype: [this.custType],
      custlabel: ["customer"],
      phone: [""],
      mobile: [""],
      altmobile: [""],
      fax: [""],
      birthDate: [""],
      countryCode: [this.commondropdownService.commonCountryCode],
      customerType: [""],
      customerSubType: [""],
      customerSector: [""],
      customerSubSector: [""],
      cafno: [""],
      voicesrvtype: [""],
      didno: [""],
      calendarType: ["English", Validators.required],
      partnerid: [this.partnerId],
      salesremark: [""],
      servicetype: [""],
      serviceareaid: ["", Validators.required],
      status: ["", Validators.required],
      parentCustomerId: [""],
      invoiceType: ["", Validators.required],
      parentExperience: ["Actual", Validators.required],
      locations: [],
      latitude: [""],
      longitude: [""],
      // id:[],
      billTo: ["CUSTOMER"],
      billableCustomerId: [""],
      isInvoiceToOrg: [false],
      istrialplan: [false],
      popid: [""],
      staffId: [""],
      discount: [""],
      flatAmount: [""],
      plangroupid: [""],
      discountType: [""],
      discountTypeData: [""],
      discountExpiryDate: [""],
      planMappingList: (this.payMappingListFromArray = this.fb.array([])),
      addressList: (this.addressListFromArray = this.fb.array([])),
      overChargeList: (this.overChargeListFromArray = this.fb.array([])),
      custMacMapppingList: (this.custMacMapppingListFromArray = this.fb.array([])),
      custIpMappingList: (this.ipMapppingListFromArray = this.fb.array([])),
      branch: [""],
      oltid: [""],
      masterdbid: [""],
      splitterid: [""],
      framedIpBind: [""],
      ipPoolNameBind: [""],
      valleyType: [""],
      customerArea: [""],
      // custDocList: this.uploadDocumentListFromArray = this.fb.array([ ]),
      paymentDetails: this.fb.group({
        amount: [""],
        paymode: [""],
        referenceno: [""],
        paymentdate: [""]
      }),
      isCustCaf: ["no"],
      dunningCategory: ["", Validators.required],
      billday: [""],
      departmentId: [""],
      parentQuotaType: [""],
      isParentLocation: [""],
      framedIpv6Address: [""],
      vlan_id: [""],
      nasIpAddress: [""],
      nasPort: [""],
      nasPortId: [""],
      framedIp: [""],
      maxconcurrentsession: [""],
      earlybillday: [""],
      delegatedprefix: [""],
      framedroute: [""],
      mac_provision: [true],
      mac_auth_enable: [true],
      addparam1: [""],
      addparam2: [""],
      addparam3: [""],
      addparam4: [""],
      earlybilldate: [""],
      framedIPNetmask: [""],
      framedIPv6Prefix: [""],
      gatewayIP: [""],
      primaryDNS: [""],
      primaryIPv6DNS: [""],
      secondaryIPv6DNS: [""],
      secondaryDNS: [""],
      macRetentionPeriod: [""],
      macRetentionUnit: [""],
      skipQuotaUpdate: [false],
      blockNo: [""],
      drivingLicence: [""],
      customerVrn: [""],
      customerNid: [""],
      isEmailAndMobileRequired: [true],
      renewPlanLimit: [""],
      graceDay: [{ value: 0, disabled: this.iscustomerEdit }, [Validators.max(30)]],
      isCredentialMatchWithAccountNo: [false],
      loginUsername: ["", Validators.required],
      loginPassword: ["", [Validators.required, this.noSpaceValidator]],
      currency: [""],
      mvnoId: [""],
      isPasswordAutoGenerated: [true],
      feasibilityRequired: [""],
      houseNumber: [""],
      secondaryMobile: [""],
      dunningType: [""],
      VLANID: [""],
      dunningSector: [""]
    });
    const mvnoControl = this.customerGroupForm.get("mvnoId");

    if (this.mvnoId === 1) {
      mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();

    this.customerGroupForm.get("isCredentialMatchWithAccountNo")?.valueChanges.subscribe(value => {
      this.isCredentialMatch = value;
    });
    this.customerGroupForm.get("isPasswordAutoGenerated")?.valueChanges.subscribe(value => {
      this.isAutoGeneratedPassword = value;
    });
    if (this.custType == "Postpaid") {
      this.customerGroupForm.controls.billday.setValidators(Validators.required);
      this.customerGroupForm.updateValueAndValidity();
      this.customerGroupForm.controls.earlybillday.setValidators(Validators.required);
      this.customerGroupForm.updateValueAndValidity();
    }

    this.customerGroupForm.controls.invoiceType.disable();
    this.customerGroupForm.controls.parentExperience.disable();
    if (this.custType === RadiusConstants.CUSTOMER_TYPE.POSTPAID) {
      this.daySequence();
      this.earlyDaySequence();
    }

    this.commondropdownService.panNumberLength$.subscribe(panLength => {
      if (panLength) {
        this.customerGroupForm
          .get("pan")
          ?.setValidators([Validators.minLength(panLength), Validators.maxLength(panLength)]);
        this.customerGroupForm.get("pan")?.updateValueAndValidity();
      }
    });
    this.commondropdownService.mobileNumberLengthSubject$.subscribe(len => {
      if (len) {
        this.customerGroupForm
          .get("mobile")
          ?.setValidators([
            Validators.required,
            Validators.minLength(len.min),
            Validators.maxLength(len.max)
          ]);
        this.customerGroupForm
          .get("altmobile")
          ?.setValidators([Validators.minLength(len.min), Validators.maxLength(len.max)]);
        this.customerGroupForm.get("mobile")?.updateValueAndValidity();
        this.customerGroupForm.get("altmobile")?.updateValueAndValidity();
      }
    });
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
    this.mvnoId != 1
      ? this.systemService
          .getConfigurationByName("DEFAULT_CUSTOMER_CATEGORY")
          .subscribe((res: any) => {
            if (res?.data?.value) {
              this.customerGroupForm.controls.dunningCategory.setValue(res?.data?.value);
            }
          })
      : "";
    this.makeEmailAndMobileMandatoryOrNot();
    this.mvnoId != 1 ? this.commondropdownService.getsystemconfigList() : "";
    this.mvnoId != 1 ? this.commondropdownService.getplanservice() : "";
    this.mvnoId != 1 ? this.commondropdownService.findAllplanGroups() : "";
    this.mvnoId != 1 ? this.commondropdownService.getPostpaidplanData() : "";
  }

  discountChangeEvent(event, name: "plan" | "customer", index?: number) {
    const selectedValue = event.value;
    const selectedData = this.discountList.find(item => item.name === selectedValue);
    const discountAmount = selectedData?.amount || 0;
    this.discountPercentage({}, discountAmount);
    const discountexpirydate = selectedData?.validUpto ? new Date(selectedData.validUpto) : null;

    if (name === "plan") {
      // Update plan form
      this.planGroupForm.get("discount")?.setValue(discountAmount);
      this.planGroupForm.get("discountExpiryDate")?.setValue(discountexpirydate);

      if (typeof index === "number") {
        const row = this.payMappingListFromArray.at(index);
        if (row) {
          row.patchValue({ discount: discountAmount });
        }
      }
    } else if (name === "customer") {
      if (typeof index === "number") {
        const row = this.payMappingListFromArray.at(index);
        if (row) {
          row.patchValue({ discount: discountAmount });
        }
      }
    }
  }

  getAllPlanData(currency) {
    this.planAllData = [];
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/currencybasevasplans?currency=" + currency + "&mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planAllData = response.vasPlans;
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

  getPlanFromVasId(event) {
    this.vasData = this.planAllData.find(x => x.id === event.value);
    this.offerPrice = this.vasData?.vasAmount;
  }

  onChangeInstallmentType() {
    if (this.isInstallemnt) {
      this.servicePackForm
        .get("installmentFrequency")
        ?.setValue(this.commondropdownService.installmentTypeData[0]?.value);
      this.servicePackForm.get("installmentFrequency").setValidators([Validators.required]);
      this.servicePackForm.get("totalInstallments").setValidators([Validators.required]);
    } else {
      this.servicePackForm.patchValue({
        installmentFrequency: "",
        totalInstallments: ""
      });
      this.servicePackForm.get("installmentFrequency").clearValidators();
      this.servicePackForm.get("totalInstallments").clearValidators();
      this.servicePackForm.patchValue({
        installmentFrequency: "",
        totalInstallments: ""
      });
    }
    this.servicePackForm.get("installmentFrequency").updateValueAndValidity();
    this.servicePackForm.get("totalInstallments").updateValueAndValidity();
  }

  checkWithHouseHoldId() {
    if (this.isThisTumil) {
      if (!this.householdId || this.householdId === "") {
        this.messageService.add({
          severity: "error",
          summary: "Required",
          detail: "Household Id is required",
          icon: "far fa-times-circle"
        });
        return;
      }
      const isFifteenDigitNumber = /^\d{15}$/.test(String(this.householdId));
      if (!isFifteenDigitNumber) {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Household Id must be exactly 15 digits",
          icon: "far fa-info-circle"
        });
        return;
      }

      if (!this.householdType || this.householdType.trim() === "") {
        this.messageService.add({
          severity: "error",
          summary: "Required",
          detail: "Household Type is required",
          icon: "far fa-times-circle"
        });
        return;
      }
    }
    const url = "/TumilIdValidation";
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));

    let obj = {
      email: this.customerGroupForm.value.email,
      password: this.customerGroupForm.get("loginPassword").value,
      householdId: this.householdId,
      householdType: this.householdType,
      mvnoId: mvnoId
    };

    this.customerManagementService.postMethodForIntegration(url, obj).subscribe((response: any) => {
      if (response.responseCode == 200) {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.responseMessage,
          icon: "far fa-check-circle"
        });
        this.householdData = response.data;
        this.isWrongHouseholdId = false;
      } else if (response.responseCode == 404 || response.responseCode == 422) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
        this.isWrongHouseholdId = true;
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
        this.isWrongHouseholdId = true;
      }
    });
  }
  generateRandomPassword(): string {
    const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#&!";
    const PASSWORD_LENGTH = 10;
    let password = "";

    for (let i = 0; i < PASSWORD_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
      password += CHARACTERS.charAt(randomIndex);
    }

    return password;
  }

  selectPINCODEChange(_event: any, index: any) {
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
                  if (!this.customerGroupForm.controls.serviceareaid.value) {
                    let serviceAreaId = {
                      value: Number(res.data)
                    };
                    this.selServiceArea(serviceAreaId, false);
                    this.customerGroupForm.controls.serviceareaid.setValue(res.data);
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

  getDevicesByType(deviceType) {
    if (this.statusCheckService.isActiveInventoryService) {
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
  }
  getpartnerAll() {
    const url = "/partner/all";
    this.partnerService.getMethodNew(url).subscribe(
      (response: any) => {
        this.partnerList = response.partnerlist.filter(item => item.id != 1);
      },
      () => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: error.error.ERROR,
        //   icon: 'far fa-times-circle',
        // })
      }
    );
  }
  macListFormGroup(): FormGroup {
    const selectedService = this.dropdownOptions.find(
      option => option.value === this.macManagementGroup.value.custid
    );
    return this.fb.group({
      macAddress: [this.macManagementGroup.value.macAddress],
      custsermappingid: [this.macManagementGroup.value.custid],
      service: [selectedService.label],
      customer: {
        id: this.customerId
      }
    });
  }
  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }

  getrequiredDepartment() {
    const url = "/department/all";
    this.countryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.departmentListData = res.departmentList;
        // this.departmenttotalRecords = res.pageDetails.totalRecords;

        this.searchkey = "";
      },
      () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong while fetching lead origin types",
          icon: "far fa-times-circle"
        });
      }
    );
  }
  onAddmacList() {
    this.macSubmitted = true;
    if (this.macManagementGroup.valid) {
      const formGroup = this.macListFormGroup();
      formGroup.addControl("isDeleted", new FormControl(false));
      this.macMapppingListFromArray.push(this.macListFormGroup());
      this.macManagementGroup.reset();
      this.macSubmitted = false;
    }
  }

  getAllLocation() {
    this.locationService.getAllActiveLocation().subscribe((response: any) => {
      this.locationDataByPlan = response.locationMasterList.map(location => ({
        name: location.name,
        locationMasterId: location.locationMasterId
      }));
    });
  }

  onAddMACList() {
    this.macsubmitted = true;
    if (this.macGroupForm.valid) {
      this.custMacMapppingListFromArray.push(this.MACListFormGroup());
      this.macGroupForm.reset();

      this.macsubmitted = false;
    }
  }

  MACListFormGroup(): FormGroup {
    return this.fb.group({
      macAddress: [this.macGroupForm.value.macAddress]
    });
  }

  onAddoverChargeListField() {
    this.chargesubmitted = true;

    if (this.chargeGroupForm.valid) {
      if (this.chargeGroupForm.value.price >= this.chargeGroupForm.value.actualprice) {
        this.overChargeListFromArray.push(this.createoverChargeListFormGroup());
        this.chargeGroupForm.reset();
        this.chargesubmitted = false;
        this.selectchargeValueShow = false;
      }
    } else {
      // console.log("I am not valid");
    }
  }

  createoverChargeListFormGroup(): FormGroup {
    // this.chargeGroupForm.get("billingCycle").clearValidators();
    // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    let billingCycle = this.chargeGroupForm.value.type === "Recurring" ? 1 : "";
    let planName = this.planDropdownInChageData.find(
      plan => plan.id == this.chargeGroupForm.value.planid
    ).planName;
    return this.fb.group({
      // chargeid: [''],
      type: [this.chargeGroupForm.value.type ? this.chargeGroupForm.value.type : "Recurring"],
      chargeid: [this.chargeGroupForm.value.chargeid],
      validity: [this.chargeGroupForm.value.validity],
      price: [this.chargeGroupForm.value.price],
      actualprice: [this.chargeGroupForm.value.actualprice],
      charge_date: [this.chargeGroupForm.value.charge_date],
      planid: [this.chargeGroupForm.value.planid],
      planName: [planName],
      unitsOfValidity: [this.chargeGroupForm.value.unitsOfValidity],
      billingCycle: [billingCycle],
      discount: [this.chargeGroupForm.value.discount],
      staticIPAdrress: [this.chargeGroupForm.value.staticIPAdrress],
      expiry: [moment(this.chargeGroupForm.value.expiry).format("DD-MM-YYYY HH:mm").toString()]
    });
  }

  valueChange(e) {
    if (!this.ifPlanGroup) {
      this.plansArray.value.forEach(element => {
        element.isInvoiceToOrg = e.value;
      });
    }
  }
}
