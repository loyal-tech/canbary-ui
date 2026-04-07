import { Component, OnInit, ViewChild } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { countries } from "src/app/components/model/country";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ADDRESS, AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { CustomerManagements } from "../model/customer";
import { ActivatedRoute, Router } from "@angular/router";
import { AreaManagementService } from "src/app/service/area-management.service";
import { BuildingManagementService } from "src/app/service/building-management.service";
import { CountryManagementService } from "src/app/service/country-management.service";
import { DeactivateService } from "src/app/service/deactivate.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { LocationService } from "src/app/service/location.service";
import { LoginService } from "src/app/service/login.service";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { PincodeManagementService } from "src/app/service/pincode-management.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as moment from "moment";
import { Observable, Observer } from "rxjs";
import { TaxManagementService } from "src/app/service/tax-management.service";
import { Regex } from "src/app/constants/regex";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { PlanManagementService } from "src/app/service/plan-management.service";
import { CustNotes } from "../model/CustNotes";
import * as FileSaver from "file-saver";
import { CustomerDetailsComponent } from "../common/customer-details/customer-details.component";
import { CustomerDetailsService } from "src/app/service/customer-details.service";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";

declare var $: any;

@Component({
  selector: "app-proforma-invoice",
  templateUrl: "./proforma-invoice.component.html",
  styleUrls: ["./proforma-invoice.component.css"]
})
export class ProformaInvoiceComponent implements OnInit {
  custType: any;
  editCustId: any;
  //   loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  AclClassConstants;
  AclConstants;
  custData: any = {};
  custLocationData: any = [];
  //   dateOfBirth: String;
  customerGroupForm: FormGroup;
  planCategoryForm: FormGroup;
  planGroupForm: FormGroup;
  presentGroupForm: FormGroup;
  paymentGroupForm: FormGroup;
  permanentGroupForm: FormGroup;
  planDataForm: FormGroup;
  chargeGroupForm: FormGroup;
  validityUnitFormGroup: FormGroup;
  chargefromgroup: FormGroup;
  payMappingListFromArray: FormArray;
  addressListFromArray: FormArray;
  //   paymentDetailsFromArray: FormArray;
  //   overChargeListFromArray: FormArray;
  //   custMacMapppingListFromArray: FormArray;
  //   ipMapppingListFromArray: FormArray;
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
  //   ifsearchLocationModal = false;
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

  //   dunningRules: any;
  serviceAreaData: any;
  selectedParentCustId: any;
  //   departmentListData: any;
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
  //   customerSector = "";
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
  //   searchLocationForm: FormGroup;
  //   ipManagementGroup: FormGroup;

  selectTitile = [
    { label: "Mr" },
    { label: "Ms" },
    { label: "Mrs" },
    { label: "Miss" },
    { label: "M/S" },
    { label: "Dear" }
  ];
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
  invoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];

  quotaSharableData = [
    { label: "shareable", value: "shareable" },
    { label: "individual", value: "individual" }
  ];
  chargeType = [];
  discountTypeData = [{ label: "One-time" }, { label: "Recurring" }];
  //   { label: "One-time" }, { label: "Recurring" }
  discountType: any = "One-time";
  serviceAreaList: any = [];
  defualtServiceArea: any = [];
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  //   showLocationMac: boolean = false;
  //   locationMacForm: FormGroup;
  //   overLocationMacArray = this.fb.array([]);
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
  listView: boolean = true;
  createView: boolean;
  showItemPerPage: number;
  currentPageListdata: number = 1;
  searchkey: any;
  totalRecords: any;
  proformaListData: any = [];
  searchData: any;
  searchName: any;
  searchType: any;
  custTypeList = [
    { name: "Prepaid", id: "Prepaid" },
    { name: "Postpaid", id: "Postpaid" }
  ];
  searchOptionSelect = [
    { label: "Invoice number", value: "invoiceNumber" },
    { label: "Name", value: "name" },
    { label: "Account number", value: "accountNumber" }
  ];
  searchOptionSelects = this.commondropdownService.performaInvoiceCustomerSearch;
  newFirst: number;
  currentPageParentCustomerListdata: number = 1;
  searchParentCustValue: string;
  searchParentCustOption = "";
  customerList: any[];
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  selectedParentCusts: any = [];
  parentCustLists = [];
  chargeGroupFormArray: FormArray;
  chargesubmitted: boolean = false;
  taxDetails: any = [];
  taxAmount: number = 0;
  pricePerTax: any;
  countTotalOfferPrice: number = 0;
  totalPriceData: any = [];
  chargeCategoryList = [];
  mainChargeList: any;
  taxUpRange: string;
  billingCycle: any = [];
  currentPageChargeData = 1;
  chargeDatatotalRecords: String;
  chargeIemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  chargeServiceData: any = [];
  chargeServiceId: string = "";
  advanceListData: any = [];
  chargeFromArray: FormArray;
  chargeSubmitted = false;
  addNotesPopup: boolean = false;
  custIdForNotes: any;
  notesSubmitted: boolean = false;
  addNotesForm: FormGroup;
  addNotesData: CustNotes;
  mvnoid: number;
  staffid: number;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  selectPlanGroup :boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public customerManagementService: CustomermanagementService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private networkdeviceService: NetworkdeviceService,
    private liveUserService: LiveUserService,
    private countryManagementService: CountryManagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private deactivateService: DeactivateService,
    private locationService: LocationService,
    public statusCheckService: StatusCheckService,
    private systemService: SystemconfigService,
    private pincodeManagementService: PincodeManagementService,
    private areaManagementService: AreaManagementService,
    private buildingMangementService: BuildingManagementService,
    public revenueManagementService: RevenueManagementService,
    private planManagementService: PlanManagementService,
    private customerdetailsilsService: CustomerdetailsilsService,
    private invoiceMasterService: InvoiceMasterService
  ) {
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
    this.custType = "Prepaid";
    this.editCustId = this.route.snapshot.paramMap.get("custId")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.demographicLabel = RadiusConstants.DEMOGRAPHICDATA || [];
    // if (this.editCustId != null) {
    //   this.iscustomerEdit = true;
    // }
    // let staffID = localStorage.getItem("userId");
    // let loggedInUser = localStorage.getItem("loggedInUser");
    this.partnerId = Number(localStorage.getItem("partnerId"));
    if (this.custType == "Postpaid") {
      this.planDetailsCategory = this.planDetailsCategory.filter(cat => cat.value != "groupPlan");
    }
    this.initData();
    this.addNotesForm = this.fb.group({
      id: [""],
      notes: ["", Validators.required]
    });
    this.getProformaInvoiceList("");
    // const url = "/getlocationbyplanid";
    // this.locationService.getAllActiveLocation().subscribe((response: any) => {
    //   console.log("adsf", response);
    //   this.locationDataByPlan = response.locationMasterList.map(location => ({
    //     name: location.name,
    //     locationMasterId: location.locationMasterId
    //   }));
    // });
    // const today = new Date();
    // this.dateOfBirth = today.toISOString().split("T")[0];
  }

  createProformaInvoice() {
    this.listView = false;
    this.createView = true;
  }

  listProformaInvoice() {
    this.listView = true;
    this.createView = false;

    this.getProformaInvoiceList("");
    this.searchName = "";
    this.searchType = "";
  }

  getRefresh() {
    this.getProformaInvoiceList("");
  }

  pageChangedList(pageNumber) {
    this.currentPageListdata = pageNumber;
    if (!this.searchkey) {
      this.getProformaInvoiceList("");
    } else {
      this.searchProformaInvoice();
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageListdata > 1) {
      this.currentPageListdata = 1;
    }
    if (!this.searchkey) {
      this.getProformaInvoiceList(this.showItemPerPage);
    } else {
      this.searchProformaInvoice();
    }
  }

  getProformaInvoiceList(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPageListdata;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }

    let plandata = {
      page: page,
      pageSize: size,
      sortBy: "createdate",
      sortOrder: 2
    };
    let url = "/proformaInvoiceList";
    this.revenueManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.proformaListData = response.dataList;
        this.totalRecords = response.totalRecords;
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

  searchProformaInvoice() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPageListdata = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchName.trim();
    this.searchData.filters[0].filterDataType = this.searchType;

    this.searchData.page = this.currentPageListdata;
    this.searchData.pageSize = this.itemsPerPage;
    let url = "proformaInvoiceList";
    this.revenueManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response?.taxlist?.length > 0) {
          this.proformaListData = response;
          this.totalRecords = response.pageDetails.totalRecords;
        } else {
          this.proformaListData = [];
          this.totalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Record Found",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.proformaListData = [];
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

  clearSearchProformaInvoice() {
    this.searchName = "";
    this.searchType = "";
    this.getProformaInvoiceList("");
  }

  canExit() {
    if (!this.customerGroupForm.dirty) return true;
    {
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          header: "Alert",
          message: "The filled data will be lost. Do you want to continue? (Yes/No)",
          icon: "pi pi-info-circle",
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          }
        });
        return false;
      });
    }
  }

  getMappingFrom() {
    const url = "/buildingRefrence/all";
    this.buildingMangementService.getMethod(url).subscribe(
      (response: any) => {
        let dunningData = response.dataList;
        if (dunningData?.length > 0) {
          this.selectedMappingFrom = dunningData[0].mappingFrom;
        } else {
          //   this.messageService.add({
          //     severity: "info",
          //     summary: "Info",
          //     detail: "Please Select First Building Reference Management.",
          //     icon: "far fa-times-circle"
          //   });
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
      (error: any) => {}
    );
  }

  getALLAreaData() {
    this.areaListDD = [];
    const url = "/area/all";
    this.areaManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.areaListDD = response.dataList;
      },
      (error: any) => {}
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
        // this.subAreaListDD = response.dataList;
      },
      (error: any) => {}
    );
  }

  initData() {
    this.getAllPinCodeData();
    this.getALLAreaData();
    this.getAllSubAreaData();
    this.getMappingFrom();
    this.commondropdownService.getchargeAll();
    // this.searchLocationForm = this.fb.group({
    //   searchLocationname: ["", Validators.required]
    // });

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
      discountExpiryDate: [""],
      discount: ["", [Validators.min(-99), Validators.max(99)]],
      istrialplan: [""],
      serialNumber: [""],
      invoiceType: [""],
      skipQuotaUpdate: [false],
      currency: [""],
      isTaxCalculate: [false]
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
      actualprice: ["", Validators.required],
      chargecategory: ["", Validators.required],
      chargetype: ["", Validators.required],
      desc: ["", [Validators.required, Validators.pattern(Regex.characterlength225)]],
      name: ["", Validators.required],
      saccode: [""],
      taxid: ["", Validators.required],
      serviceId: [this.planGroupForm.value.serviceId],
      status: ["Active"],
      ledgerId: [""],
      serviceNameList: [null],
      royalty_payable: [false],
      billingCycle: [""],
      taxamount: [""]
    });
    this.chargefromgroup = this.fb.group({
      id: ["", Validators.required],
      billingCycle: ["", Validators.required],
      actualprice: [""],
      taxamount: [""],
      chargeprice: [""],
      price: [""],
      currency: [""],
      isTaxCalculate: [false]
    });

    this.chargefromgroup.controls.billingCycle.setValue("");
    this.chargefromgroup.controls.billingCycle.enable();
    this.chargeGroupFormArray = this.fb.array([]);
    this.chargeFromArray = this.fb.array([]);
    // this.ipManagementGroup = this.fb.group({
    //   ipAddress: [
    //     "",
    //     [Validators.required, Validators.pattern("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$")]
    //   ],
    //   ipType: ["", Validators.required]
    // });
    this.customerGroupForm = this.fb.group({
      customerid: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", [Validators.required, this.noSpaceValidator]],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      title: [""],
      //   pan: [""],
      //   gst: [""],
      //   aadhar: [""],
      //   passportNo: [""],
      //   tinNo: ["", [Validators.minLength(9), Validators.maxLength(9)]],
      contactperson: ["", Validators.required],
      //   failcount: ["0"],
      // acctno: ['', Validators.required],
      custtype: [this.custType],
      //   custlabel: ["customer"],
      //   phone: [""],
      mobile: ["", [Validators.required, Validators.maxLength(10)]],
      altmobile: ["", Validators.maxLength(10)],
      //   fax: [""],
      //   birthDate: [""],
      countryCode: [this.commondropdownService.commonCountryCode],
      //   customerType: [""],
      //   customerSubType: [""],
      //   customerSector: [""],
      //   customerSubSector: [""],
      //   cafno: [""],
      //   voicesrvtype: [""],
      //   didno: [""],
      //   calendarType: ["English", Validators.required],
      partnerid: [this.partnerId],
      //   salesremark: [""],
      //   servicetype: [""],
      serviceareaid: ["", Validators.required],
      //   status: ["", Validators.required],
      //   parentCustomerId: [""],
      //   invoiceType: [""],
      //   parentExperience: ["Actual", Validators.required],
      //   locations: [],
      //   latitude: [""],
      //   longitude: [""],
      // id:[],
      billTo: ["CUSTOMER"],
      billableCustomerId: [""],
      //   isInvoiceToOrg: [false],
      //   istrialplan: [false],
      //   popid: [""],
      //   staffId: [""],
      discount: ["", [Validators.min(-99), Validators.max(99)]],
      //   flatAmount: [""],
      plangroupid: [""],
      discountType: [""],
      discountExpiryDate: [""],
      planMappingList: (this.payMappingListFromArray = this.fb.array([])),
      addressList: (this.addressListFromArray = this.fb.array([])),
      //   overChargeList: (this.overChargeListFromArray = this.fb.array([])),
      //   custMacMapppingList: (this.custMacMapppingListFromArray = this.fb.array([])),
      //   custIpMappingList: (this.ipMapppingListFromArray = this.fb.array([])),
      branch: [""],
      //   oltid: [""],
      //   masterdbid: [""],
      //   splitterid: [""],
      //   framedIpBind: [""],
      //   ipPoolNameBind: [""],
      valleyType: [""],
      customerArea: [""],
      // custDocList: this.uploadDocumentListFromArray = this.fb.array([ ]),
      //   paymentDetails: this.fb.group({
      //     amount: [""],
      //     paymode: [""],
      //     referenceno: [""],
      //     paymentdate: [""]
      //   }),
      //   isCustCaf: ["no"],
      //   dunningCategory: ["", Validators.required],
      //   billday: [""],
      //   departmentId: [""],
      //   parentQuotaType: [""],
      //   isParentLocation: [""],
      //   framedIpv6Address: [""],
      //   vlan_id: [""],
      //   nasIpAddress: [""],
      //   nasPort: [""],
      //   nasPortId: [""],
      //   framedIp: [""],
      //   maxconcurrentsession: [""],
      //   earlybillday: [""],
      //   delegatedprefix: [""],
      //   framedroute: [""],
      //   mac_provision: [true],
      //   mac_auth_enable: [true],
      //   addparam1: [""],
      //   addparam2: [""],
      //   addparam3: [""],
      //   addparam4: [""],
      //   earlybilldate: [""],
      //   framedIPNetmask: [""],
      //   framedIPv6Prefix: [""],
      //   gatewayIP: [""],
      //   primaryDNS: [""],
      //   primaryIPv6DNS: [""],
      //   secondaryIPv6DNS: [""],
      //   secondaryDNS: [""],
      //   macRetentionPeriod: [""],
      //   macRetentionUnit: [""],
      //   skipQuotaUpdate: [false],
      blockNo: [""],
      //   drivingLicence: [""],
      //   customerVrn: [""],
      //   customerNid: [""],
      isEmailAndMobileRequired: [true],
      //   renewPlanLimit: [""],
      //   graceDay: [{ value: 0, disabled: this.iscustomerEdit }, [Validators.max(30)]],
      isCredentialMatchWithAccountNo: [false],
      loginUsername: ["", Validators.required],
      loginPassword: ["", [Validators.required, this.noSpaceValidator]],
      currency: [""]
    });
    this.customerGroupForm.get("isCredentialMatchWithAccountNo")?.valueChanges.subscribe(value => {
      this.isCredentialMatch = value;
    });
    // if (this.custType == "Postpaid") {
    //   this.customerGroupForm.controls.billday.setValidators(Validators.required);
    //   this.customerGroupForm.updateValueAndValidity();
    //   this.customerGroupForm.controls.earlybillday.setValidators(Validators.required);
    //   this.customerGroupForm.updateValueAndValidity();
    // }

    // this.locationMacForm = this.fb.group({
    //   location: [""],
    //   mac: [""]
    // });

    this.validityUnitFormGroup = this.fb.group({
      validityUnit: [""]
    });
    this.validityUnitFormArray = this.fb.array([]);
    this.plansArray = this.fb.array([]);

    // this.customerGroupForm.controls.invoiceType.disable();
    // this.customerGroupForm.controls.parentExperience.disable();
    // if (this.custType === RadiusConstants.CUSTOMER_TYPE.POSTPAID) {
    //   this.daySequence();
    //   this.earlyDaySequence();
    // }

    this.makeEmailAndMobileMandatoryOrNot();
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
    // this.commondropdownService.getAllPinCodeNumber();
    this.commondropdownService.getAllPinCodeData();
    // this.commondropdownService.getALLAreaData();
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
    this.commondropdownService.getValleyTypee();
    this.commondropdownService.getInsideValley();
    this.commondropdownService.getOutsideValley();
    // this.commondropdownService.getBillToData();
    this.commondropdownService.getplanservice();
    // this.setDefualtServiceArea();
    // this.getsystemconfigListByName("DUNNING_CATEGORY");
    // this.commondropdownService.getCustomerCategory();
    this.commondropdownService.getsystemconfigList();
    this.getCustomerType();
    // this.getCustomerSector();
    // this.getDepartmentList();
    // this.getBillToData();
    this.commondropdownService.getTaxAllListAll();

    if (this.statusCheckService.isActiveInventoryService) {
      this.commondropdownService.getPOPList();
    }
    this.commondropdownService.findAllplanGroups();
    this.commondropdownService.getPostpaidplanData();
    // this.getNetworkDevicesByType("OLT");
    // this.getNetworkDevicesByType("SN Splitter");
    // this.getNetworkDevicesByType("DN Splitter");
    // this.getNetworkDevicesByType("Master DB");
    if (this.editCustId != null) {
      this.iscustomerEdit = true;
      this.editCustomer();
      this.getCustomerMacCount();
    }
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.panNumberLength$.subscribe(panLength => {
      if (panLength) {
        this.customerGroupForm
          .get("pan")
          ?.setValidators([Validators.minLength(panLength), Validators.maxLength(panLength)]);
        this.customerGroupForm.get("pan")?.updateValueAndValidity();
      }
    });
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
    // this.systemService.getConfigurationByName("DEFAULT_CUSTOMER_CATEGORY").subscribe((res: any) => {
    //   if (res?.data?.value) {
    //     this.customerGroupForm.controls.dunningCategory.setValue(res?.data?.value);
    //   }
    // });

    this.getChargeCategory();
    this.getChargeType();
    this.billingSequence();
  }

  //   ipListFormGroup(): FormGroup {
  //     return this.fb.group({
  //       ipAddress: [this.ipManagementGroup.value.ipAddress],
  //       ipType: [this.ipManagementGroup.value.ipType]
  //     });
  //   }
  noSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.includes(" ")) {
      return { noSpace: true };
    }
    return null;
  }
  //   onAddIPList() {
  //     this.ipSubmitted = true;
  //     if (this.ipManagementGroup.valid) {
  //       this.ipMapppingListFromArray.push(this.ipListFormGroup());
  //       this.ipManagementGroup.reset();
  //       console.log("Arr", this.ipMapppingListFromArray);
  //       this.ipSubmitted = false;
  //     } else {
  //       console.log("I am not valid");
  //     }
  //   }
  editCustomer() {
    this.customerMacCount = 0;
    const url = "/customers/" + this.editCustId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.iscustomerEdit = false;
        this.custData = response.customers;
        if (this.custData.birthDate)
          this.custData.birthDate = moment(this.custData.birthDate).format("YYYY-MM-DD");
        this.customerGroupForm.patchValue(this.custData);
        // this.getBillableCust(this.custData.billableCustomerId);
        let serviceAreaId = {
          value: Number(this.custData.serviceareaid)
        };
        this.custType = this.custData.custtype;
        this.selServiceArea(serviceAreaId, false);
        //this.customerGroupForm.controls.username.disable();

        // this.customerGroupForm.get("parentQuotaType").setValue(this.custData.parentQuotaType);
        if (this.custData.isCredentialMatchWithAccountNo) {
          this.customerGroupForm.controls.username.disable();
          this.customerGroupForm.controls.isCredentialMatchWithAccountNo.disable();
        } else {
          this.customerGroupForm.controls.username.enable();
        }

        // if (this.custData.customerLocations.length > 0) {
        //   this.customerGroupForm
        //     .get("isParentLocation")
        //     .setValue(this.custData.customerLocations[0].isParentLocation);

        //   var selectedLocation = [];
        //   this.custLocationData = [];
        //   this.custLocationData = [...this.custData.customerLocations];

        //   this.custData.customerLocations.forEach(location => {
        //     if (selectedLocation.indexOf(location.locationId) === -1) {
        //       selectedLocation.push(location.locationId);
        //     }

        //     this.overLocationMacArray.push(
        //       this.fb.group({
        //         name: [location.locationName],
        //         mac: [location.mac],
        //         locationId: [location.locationId],
        //         isAlreadyAvailable: true
        // isParentLocation: location.isParentLocation
        //       })
        //     );
        //   });
        //   if (this.overLocationMacArray.value.length > 0) {
        //     this.locationMacData = this.overLocationMacArray.value.map(location => ({
        //       locationId: location.locationId, //location.locationId
        //       mac: location.mac
        //   isParentLocation: location.isParentLocation
        //     }));
        //   }
        // }
        // this.locationChange(selectedLocation);
        // this.locationMacForm.get("location").setValue(selectedLocation);

        // if (this.custData.planMappingList && this.custData.planMappingList.length > 0) {
        //   this.customerGroupForm.get("billTo").setValue(this.custData.planMappingList[0].billTo);
        //   this.customerGroupForm
        //     .get("isInvoiceToOrg")
        //     .setValue(this.custData.planMappingList[0].isInvoiceToOrg);
        // }

        // this.customerGroupForm.get("isCustCaf").setValue("no");

        this.custData.custtype;
        // if (this.custData.custtype == this.custType) {
        //   let obj = {};
        //   this.filterPlanData = [];
        //   if (this.commondropdownService.postpaidplanData.length != 0) {
        //     obj = this.commondropdownService.postpaidplanData.filter(
        //       key => key.plantype === this.custType
        //     );
        //   }
        //   this.filterPlanData = obj;
        //   obj = {};
        // } else {
        //   let obj = {};
        //   this.filterPlanData = [];
        //   if (this.commondropdownService.postpaidplanData.length != 0) {
        //     obj = this.commondropdownService.postpaidplanData.filter(
        //       key => key.plantype === this.custType
        //     );
        //   }
        //   this.filterPlanData = obj;
        //   obj = {};
        // }

        if (this.custData.creditDocuments?.length > 0) {
          this.customerGroupForm.controls.paymentDetails.patchValue(
            this.custData.creditDocuments[0]
          );
        }
        // if (this.custData.parentCustomerId != null) {
        //   this.isParantExpirenceEdit = true;
        //   this.customerGroupForm.controls.parentExperience.enable();
        //   this.customerGroupForm.controls.parentExperience.patchValue(
        //     this.custData.parentExperience
        //   );
        // } else {
        //   this.customerGroupForm.controls.parentExperience.disable();
        // }

        // if (this.custData.parentCustomerId) {
        //   this.parentCustList = [
        //     {
        //       id: this.custData.parentCustomerId,
        //       name: this.custData.parentCustomerName
        //     }
        //   ];
        // } else {
        //   this.parentCustList = [];
        // }

        // if (this.custData.parentCustomerId && this.custData.plangroupid) {
        //   this.customerGroupForm.controls.invoiceType.enable();
        //   this.planGroupForm.controls.invoiceType.disable();
        // } else {
        //   this.customerGroupForm.controls.invoiceType.disable();
        //   this.planGroupForm.controls.invoiceType.enable();
        // }

        // if (this.custData.plangroupid) {
        //   this.ifIndividualPlan = false;
        //   this.ifPlanGroup = true;
        //   this.planCategoryForm.patchValue({
        //     planCategory: "groupPlan"
        //   });
        //   this.getPlangroupByPlan(this.custData.plangroupid);
        //   this.customerGroupForm.patchValue({
        //     plangroupid: this.custData.plangroupid
        //   });
        // } else {
        //   this.ifIndividualPlan = true;
        //   this.ifPlanGroup = false;

        //   this.planCategoryForm.patchValue({
        //     planCategory: "individual"
        //   });

        //   // plan deatils

        //   let newAmount = 0;
        //   let totalAmount = 0;
        //   let disValue = 0;
        //   this.discountValue = 0;
        //   this.discountValueStore = [];
        //   this.custData.planMappingList.forEach((element, i) => {
        //     // this.planGroupForm.patchValue(
        //     //   this.viewcustomerListData.planMappingList[planlength]
        //     // );
        //     this.onAddplanMappingList();

        //     if (element.planId) {
        //       const planAmount = "";
        //       let validityUnit = "";
        //       const url = "/postpaidplan/" + element.planId;
        //       this.customerManagementService.getMethod(url).subscribe((response: any) => {
        //         this.planDropdownInChageData.push(response.postPaidPlan);
        //         let postpaidplanData = response.postPaidPlan;
        //         validityUnit = response.postPaidPlan.unitsOfValidity;
        //         this.payMappingListFromArray.push(
        //           this.fb.group({
        //             service: element.service,
        //             planId: element.planId,
        //             validity: element.validity,
        //             offerPrice: element.offerPrice,
        //             newAmount: element.newAmount,
        //             discount: element.discount,
        //             istrialplan: element.istrialplan,
        //             invoiceType: element.invoiceType,
        //             isInvoiceToOrg: element.isInvoiceToOrg,
        //             discountType: element.discountType,
        //             discountExpiryDate: [
        //               element.discountExpiryDate
        //                 ? moment(element.discountExpiryDate).utc(true).toDate()
        //                 : null
        //             ],
        //             skipQuotaUpdate: element.skipQuotaUpdate,
        //             currency: [this.customerGroupForm.get("currency").value]
        //           })
        //         );
        //         this.validityUnitFormArray.push(
        //           this.fb.group({
        //             validityUnit
        //           })
        //         );

        //         let n = i + 1;
        //         newAmount =
        //           postpaidplanData.newOfferPrice != null
        //             ? postpaidplanData.newOfferPrice
        //             : postpaidplanData.offerprice;
        //         totalAmount = Number(totalAmount) + Number(newAmount);

        //         if (this.custData.planMappingList.length == n) {
        //           this.planDataForm.patchValue({
        //             offerPrice: totalAmount,
        //             discountPrice: this.custData.flatAmount
        //               ? this.custData.flatAmount.toFixed(2)
        //               : 0
        //           });
        //         }
        //       });
        //     }
        //   });
        // }

        // this.payMappingListFromArray.patchValue(this.custData.planMappingList);

        // Address
        if (this.custData?.addressList[0]?.addressType) {
          this.getAreaData(this.custData.addressList[0].areaId, "present");
          this.presentGroupForm.patchValue(this.custData.addressList[0]);

          this.selServiceAreaByParent(Number(this.custData.serviceareaid));
          const data = {
            value: Number(this.custData.addressList[0].pincodeId)
          };
          this.onChnagePincode(data, "");
          this.presentGroupForm.patchValue({
            pincodeId: Number(this.custData.addressList[0].pincodeId)
          });
        }

        // this.custData.overChargeList = this.custData.indiChargeList;
        // charge
        let k = 0;
        // while (k < this.custData.indiChargeList.length) {
        //   if (this.custData.indiChargeList[k].charge_date) {
        //     const format = "yyyy-MM-dd";
        //     const locale = "en-US";
        //     const myDate = this.custData.indiChargeList[k].charge_date;
        //     const formattedDate = formatDate(myDate, format, locale);
        //     this.custData.indiChargeList[k].charge_date = formattedDate;

        //     const date = this.custData.indiChargeList[k].charge_date.split("-");

        //     this.overChargeListFromArray.patchValue([
        //       {
        //         charge_date: this.custData.indiChargeList[k].charge_date
        //       }
        //     ]);
        //   }

        //   this.chargeGroupForm.patchValue(this.custData.indiChargeList[k]);

        //   this.overChargeListFromArray.patchValue(this.custData.indiChargeList);
        //   k++;
        // }

        // MAc
        // let macNumber = 0;

        // this.selectAreaList = true;
        // this.selectPincodeList = true;
        // if (this.custData.customerType != null) {
        //   const data = {
        //     value: this.custData.customerType
        //   };
        //   this.customerGroupForm.controls.customerSubType.enable();
        //   this.getcustType(data);
        // } else {
        //   this.customerGroupForm.controls.customerSubType.disable();
        // }

        // if (this.custData.customerSector != null) {
        //   this.customerGroupForm.controls.customerSubSector.enable();
        // } else {
        //   this.customerGroupForm.controls.customerSubSector.disable();
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
      // if (index === "payment") {
      //   this.PyamentpincodeDeatils = response.data;
      //   if (response.data.areaList.length !== 0) {
      //     this.paymentareaAvailableList = response.data.areaList;
      //   }
      //
      // }
      // if (index === "permanent") {
      //   this.permanentpincodeDeatils = response.data;
      //   if (response.data.areaList.length !== 0) {
      //     this.permanentareaAvailableList = response.data.areaList;
      //   }
      //
      // }
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
        error => {}
      );
    }
  }

  //   daySequence() {
  //     for (let i = 0; i < 31; i++) {
  //       this.days.push({ label: i + 1 });
  //     }
  //   }

  //   earlyDaySequence() {
  //     for (let i = 0; i <= 31; i++) {
  //       this.earlydays.push({ label: i.toString() });
  //     }
  //     this.customerGroupForm.patchValue({
  //       earlybillday: this.earlydays[0].label
  //     });
  //   }

  //   getsystemconfigListByName(keyName: string) {
  //     const url = "/system/configurationListByKey?keyName=" + keyName;
  //     this.customerManagementService.getMethod(url).subscribe(
  //       (response: any) => {
  //         this.dunningRules = response.dataList;
  //       },
  //       (error: any) => {}
  //     );
  //   }

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
        // console.log("this.customerType ::::: ", this.customerType);
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
    // this.customerGroupForm.controls.customerSubType.enable();
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

  //   getCustomerSector() {
  //     const url = "/commonList/Customer_Sector";
  //     const custerlist = {};
  //     this.commondropdownService.getMethodWithCache(url).subscribe(
  //       (response: any) => {
  //         this.customerSector = response.dataList;
  //       },
  //       (error: any) => {
  //         console.log(error, "error");
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle"
  //         });
  //       }
  //     );
  //   }

  //   getDepartmentList() {
  //     const url = "/department/all";
  //     this.countryManagementService.getMethod(url).subscribe(
  //       (res: any) => {
  //         this.departmentListData = res.departmentList;
  //       },
  //       (err: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: "Something went wrong while fetching lead origin types",
  //           icon: "far fa-times-circle"
  //         });
  //       }
  //     );
  //   }

//   getNetworkDevicesByType(deviceType) {
//     if (this.statusCheckService.isActiveInventoryService) {
//       const url = "/NetworkDevice/getNetworkDevicesByDeviceType?deviceType=" + deviceType;
//       this.networkdeviceService.getMethod(url).subscribe(
//         (response: any) => {
//           switch (deviceType) {
//             case "OLT":
//               this.oltDevices = response.dataList;
//               break;
//             case "SN Splitter":
//               this.spliterDevices = response.dataList;
//               break;
//             case "DN Splitter":
//               this.spliterDevices = response.dataList;
//               break;
//             case "Master DB":
//               this.masterDbDevices = response.dataList;
//               break;
//           }
//         },
//         (error: any) => {
//           this.messageService.add({
//             severity: "error",
//             summary: "Error",
//             detail: error.error.ERROR,
//             icon: "far fa-times-circle"
//           });
//         }
//       );
//     }
//   }

  //   getSelectCustomerSector(event) {
  //     const value = event.value;
  //     if (value) {
  //       this.customerGroupForm.controls.customerSubSector.enable();
  //     } else {
  //       this.customerGroupForm.controls.customerSubSector.disable();
  //     }
  //   }

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
    } else {
      this.parentCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      //   this.customerGroupForm.patchValue({
      //     parentCustomerId: this.selectedParentCust.id
      //   });

      //TODO remove below api call once we done fetching service area id in in parent customer api
      const url = "/customers/" + this.selectedParentCust.id;
      let parentCustServiceAreaId: any;

      await this.customerManagementService.getMethod(url).subscribe((response: any) => {
        parentCustServiceAreaId = response.customers.serviceareaid;
        this.parentBillday = response.customers.billday;
        this.serviceareaCheck = false;
        this.customerGroupForm.patchValue({
          serviceareaid: parentCustServiceAreaId
        });
        if (parentCustServiceAreaId) {
          this.selServiceAreaByParent(parentCustServiceAreaId);
          this.serviceAreaDisable = true;
        }
        this.customerGroupForm.controls.parentExperience.setValue("Actual");
        this.customerGroupForm.controls.parentExperience.enable();
      });
      // setTimeout(() => {

      // }, 5000);
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

  removeSelParentCust(type) {
    this.selectedParentCust = [];
    if (type === "billable") {
      this.billableCustList = [];
      this.customerGroupForm.patchValue({
        billableCustomerId: null
      });
    } else {
      //   this.customerGroupForm.patchValue({
      //     parentCustomerId: ""
      //   });
      this.customerGroupForm.controls.invoiceType.setValue("");
      this.customerGroupForm.controls.invoiceType.disable();
      this.planGroupForm.controls.invoiceType.setValue("");
      this.planGroupForm.controls.invoiceType.disable();
      this.customerGroupForm.controls.parentExperience.setValue("");
      this.customerGroupForm.controls.parentExperience.disable();
      //   this.customerGroupForm.controls.billday.setValue("");
      //   this.customerGroupForm.controls.billday.enable();
      this.customerGroupForm.controls.serviceareaid.setValue("");
      this.serviceAreaDisable = false;
      this.parentCustList = [];
    }
    this.isBranchAvailable = false;
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
    this.planGroupForm.patchValue({
      service: "",
      planId: ""
    });

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
        (error: any) => {}
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
    let url = "/branchManagement/getAllBranchesByServiceAreaId";
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
    const url = "/getPartnerByServiceAreaId/" + serviceAreaId;
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.partnerListByServiceArea = response.partnerList.filter(item => item.id != 1);
      },
      (error: any) => {}
    );
  }

  getServiceByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url = "/serviceArea/getAllServicesByServiceAreaId";
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceData = response.dataList;
    });
  }

  onPartnerCategoryChange(event: any) {}

  getPlanbyPartner(serviceAreaId, partnerId) {
    this.isPartnerSelected = true;
    if (serviceAreaId) {
      this.filterPlanData = [];
      const custType = this.custType;
        const url = `/partnerplans/serviceArea?partnerId=${partnerId}
        &mvnoId=${localStorage.getItem("mvnoId")}
        &serviceAreaId=${serviceAreaId}
        &planmode=NORMAL`;
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
      //   partnerGroupList.forEach(element => {
      //     this.filterPartnerPlanGroup.push(element.push);
      //     this.filterNormalPlanGroup.push(element.push);
      //   });
    });
  }

  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.filterPlanData = [];
      const custType = this.custType;
      const url = "/plans/serviceArea?planmode=NORMAL&serviceAreaId=" + serviceAreaId + "&mvnoId=" + localStorage.getItem("mvnoId");;
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
            // this.subAreaListDD = response.dataList;
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

    // this.areaTitle
  }

  onKey(event) {
    if (event.key == "Tab") {
      const url =
        "/customer/customerUsernameIsAlreadyExists/" +
        this.customerGroupForm.controls.username.value;
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

  onKeymobilelength(event) {
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

  onKeymobilelengthsec(event) {
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
      let data = [];
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
    //
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

  parentExperienceSelect(e) {
    this.planGroupForm.value.invoiceType = "Group";
  }

  onChnagePincode(_event: any, index: any) {
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
                  // this.getBranchByServiceAreaID(response.data);
                  // this.getPlanbyServiceArea(response.data);
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
      //   if (
      //     this.customerGroupForm.value.parentCustomerId != null &&
      //     this.customerGroupForm.value.parentCustomerId != ""
      //   ) {
      //     this.planGroupForm.controls.invoiceType.enable();
      //     this.customerGroupForm.controls.invoiceType.disable();
      //     if (this.customerGroupForm.value.parentExperience == "Single")
      //       this.planGroupForm.patchValue({ invoiceType: "Group" });
      //     else this.planGroupForm.patchValue({ invoiceType: "" });
      //   }
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
        // if (
        //   this.customerGroupForm.value.parentCustomerId != null &&
        //   this.customerGroupForm.value.parentCustomerId != ""
        // ) {
        //   this.customerGroupForm.controls.invoiceType.enable();
        //   this.planGroupForm.controls.invoiceType.disable();
        //   if (this.customerGroupForm.value.parentExperience == "Single")
        //     this.customerGroupForm.patchValue({ invoiceType: "Group" });
        //   else this.customerGroupForm.patchValue({ invoiceType: "" });
        // }
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

  billtoSelectValue(e) {
    this.payMappingListFromArray.controls = [];
    this.planGroupForm.reset();
    // this.planGroupForm.controls.skipQuotaUpdate.setValue(false);
    this.plansArray = this.fb.array([]);
    this.customerGroupForm.patchValue({
      plangroupid: ""
    });
  }

  onChangeArea(_event: any, index: any) {
    this.getAreaData(_event.value, index);
  }

  onChangeSubArea(_event: any, index: any) {
    if (_event?.value) {
      const subAreaurl = "/subarea/getAreaIdFromSubAreaId?subAreaId=" + _event.value;
      this.adoptCommonBaseService.get(subAreaurl).subscribe(
        (subarea: any) => {
          if (subarea?.data) {
            const url = "/area/" + subarea.data;
            this.adoptCommonBaseService.get(url).subscribe(
              (response: any) => {
                if (response.data?.pincodeId) {
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
                  const pincodeUrl =
                    "/pincode/getServicAreaIdByPincode?pincodeid=" + response.data?.pincodeId;

                  this.adoptCommonBaseService.get(pincodeUrl).subscribe(
                    (res: any) => {
                      if (!this.customerGroupForm.controls.serviceareaid.value) {
                        this.customerGroupForm.controls.serviceareaid.setValue(res.data);
                        let serviceAreaId = {
                          value: Number(res.data)
                        };
                        this.selServiceArea(serviceAreaId, false);
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
      this.areaManagementService.getMethod(url).subscribe(
        (response: any) => {
          //   this.buildingNoDD = response.dataList;
          this.buildingNoDD = response.dataList.map(buildingNumber => ({ buildingNumber }));
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

  //   onChangeInvoiceToOrg(e) {
  //     if (!this.ifPlanGroup) {
  //       this.plansArray.value.forEach(element => {
  //         element.isInvoiceToOrg = e.value;
  //       });
  //     }
  //   }

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
      let url = "/findPlanGroupById?planGroupId=" + e.value;
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
              billTo: "ORGANIZATION"
              //   isInvoiceToOrg: planDetailData.invoiceToOrg
            });

            // $("#selectPlanGroup").modal("show");
            // this.plansArray.controls = response.planGroup
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
            this.selectPlanGroup = true;
            this.planGroupSelectedSubisu = e.value;
            this.getPlanListByGroupIdSubisu();
          } else {
            this.ifplanisSubisuSelect = false;
            this.customerGroupForm.patchValue({
              billTo: "CUSTOMER"
            });

            // if (this.customerChangePlan) {
            //   $("#selectPlanGroup").modal("show");
            //   this.planGroupSelectedSubisu = e.value;
            //   console.log(this.planGroupSelectedSubisu);
            //   this.getPlanListByGroupIdSubisu();
            // } else {
            this.planGroupSelectedSubisu = e.value;
            // }
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
          this.discountPercentage({ planGroupId: e.value });
        },
        (error: any) => {}
      );
    }
    // else if (this.customerChangePlan) {
    //   $("#selectPlanGroup").modal("show");
    //   this.planGroupSelectedSubisu = e;
    //   console.log(this.planGroupSelectedSubisu);
    //   this.getPlanListByGroupIdSubisu();
    // }

    // if (this.customerGroupForm.value.billTo == "ORGANIZATION") {
    //   $("#selectPlanGroup").modal("show");
    //   this.planGroupSelectedSubisu = e.value;
    //   console.log(this.planGroupSelectedSubisu);
    //   this.getPlanListByGroupIdSubisu();
    // } else if (this.customerChangePlan) {
    //   $("#selectPlanGroup").modal("show");
    //   this.planGroupSelectedSubisu = e;
    //   console.log(this.planGroupSelectedSubisu);
    //   this.getPlanListByGroupIdSubisu();
    // }
    if (e.value) {
      this.getPlangroupByPlan(e.value);
      this.planGroupDataById(e.value);
    }
  }

  planGroupDataById(planGroupId) {
    let url = "/findPlanGroupById?planGroupId=" + planGroupId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.planGroupMapingList = response.planGroup.planMappingList;
    });
  }

  subisuPrice(e) {
    this.newSubisuPrice = e.target.value;
  }
  modalClosePlanChangeSubisu() {
    this.selectPlanGroup = false;
  }

  discountKeyDown(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    let maxValue: number = Number(99.99);
    let minValue: number = Number(-99.99);
    if (
      event.keyCode === 8 ||
      (event.key >= "0" && event.key <= "9") ||
      event.key === "-" ||
      (event.key === "." && inputElement.value.indexOf(".") === -1) // Allow only one decimal point
    ) {
      if (event.key !== "-" && event.keyCode !== 8) {
        let value = inputElement.value + event.key;

        if (parseFloat(value) <= maxValue && parseFloat(value) >= minValue) {
          this.discountPercentage(value);
          return true;
        } else {
          return false;
        }
      } else if (event.keyCode === 8) {
        const updatedValue = currentValue.slice(0, -1);

        if (parseFloat(updatedValue) <= maxValue && parseFloat(updatedValue) >= minValue) {
          this.discountPercentage(updatedValue);
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  discountPercentage(value) {
    // let rawValue = e.target.value.replace(/,/g, "");
    // let newValue = parseFloat(rawValue);

    // if (rawValue.includes("-")) {
    //   if (Math.abs(newValue) > 99) {
    //     e.target.value = "-99";
    //   }
    // } else {
    //   if (newValue > 99) {
    //     e.target.value = "99";
    //   } else if (newValue < -99) {
    //     e.target.value = "-99";
    //   }
    // }

    this.previousValue = value;
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
        .getofferPriceWithTax(this.planGroupForm.value.planId, value)
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
        this.planListSubisu.forEach((element, i) => {
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
              //   isInvoiceToOrg: this.customerGroupForm.value.isInvoiceToOrg,
              skipQuotaUpdate:
                this.customerGroupForm.value.skipQuotaUpdate == null
                  ? false
                  : this.customerGroupForm.value.skipQuotaUpdate
            })
          );

          this.planTotalOffetPrice = this.planTotalOffetPrice + Number(newAmount);
        });

        // console.log(this.planListSubisu);

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
      // console.log(
      //   plangroupid,
      //   this.filterNormalPlanGroup.find(planGroup => planGroup.planGroupId === plangroupid)
      // );
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
    // this.planGroupForm.controls.istrialplan.reset();
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
      const planserviceurl = "/planservice/all";
      this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
        planserviceData = response.serviceList.filter(service => service.id === serviceId);
        // console.log("planserviceData", planserviceData);
        this.isSerialNumberShow = planserviceData[0].serviceParamMappingList.some(
          item => item.serviceParamName !== null && item.serviceParamName === "Product Required"
        );
        // console.log("isNull ::::: ", this.isSerialNumberShow);
        if (planserviceData.length > 0) {
          planServiceID = planserviceData[0].id;

          // if (this.customerGroupForm.value.custtype) {
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
          //console.log("this.plantypaSelectData", this.plantypaSelectData);
          if (this.plantypaSelectData.length === 0) {
            this.messageService.add({
              severity: "info",
              summary: "Note ",
              detail: "Plan not available for this customer type and service ",
              icon: "far fa-times-circle"
            });
          }

          // }
          // else {
          //   this.messageService.add({
          //     severity: 'info',
          //     summary: 'Required ',
          //     detail: 'Customer Type Field Required',
          //     icon: 'far fa-times-circle',
          //   });
          // }
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
    const url = "/postpaidplan/" + planId + "?mvnoId=" + localStorage.getItem("mvnoId");
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
        // console.log("this.planDetailData", planDetailData);
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
          // this.payMappingListFromArray.controls = [];
          this.customerGroupForm.patchValue({
            billTo: "ORGANIZATION"
            // isInvoiceToOrg: planDetailData.invoiceToOrg
          });
          this.planGroupForm.patchValue({
            newAmount: Number(planDetailData.newOfferPrice)
          });
        } else if (
          this.customerGroupForm.value.billTo == "ORGANIZATION" &&
          planDetailData.category == "Normal" &&
          this.ifplanisSubisuSelect == false
        ) {
          // this.payMappingListFromArray.controls = [];
          this.ifplanisSubisuSelect = false;
          this.customerGroupForm.patchValue({
            billTo: "ORGANIZATION"
          });
          this.planGroupForm.patchValue({
            newAmount: Number(planDetailData.offerprice)
          });
        } else {
          this.ifplanisSubisuSelect = false;
          // this.payMappingListFromArray.controls = [];
          this.customerGroupForm.patchValue({
            billTo: "CUSTOMER"
          });
        }
        this.discountValue = planDetailData.offerprice;
        this.planGroupForm.controls.validity.disable();
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
      // return !this.plantypaSelectData.find(plan => plan.id === planId).allowdiscount;

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
    let offerP = 0;
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
      this.chargeServiceData = this.payMappingListFromArray.controls.map((control: FormGroup) => {
        return {
          name: control.get("service")?.value
        };
      });
      this.validityUnitFormArray.push(this.validityUnitListFormGroup());
      this.validityUnitFormGroup.reset();
      if (this.payMappingListFromArray?.length > 0) {
        this.customerGroupForm
          .get("currency")
          .setValue(this.payMappingListFromArray?.value[0]?.currency);
      }
      this.filterPlanByCurrency(this.planGroupForm.value);

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
      // console.log("I am not valid");
    }
  }
  filterPlanByCurrency(plan) {
    const selectedCurrency = plan?.currency;

    this.plantypaSelectData = this.plantypaSelectData.filter(plan => {
      const chargeCurrency = plan?.currency ?? this.currency;
      return chargeCurrency === selectedCurrency;
    });
  }

  filterChargesByCurrency(plan) {
    const selectedCurrency = plan?.currency;

    this.plantypaSelectData = this.commondropdownService.chargeList.filter(plan => {
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
    const url = "/postpaidplan/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      const data = response.postPaidPlan;
      this.planDropdownInChageData.push(data);
    });
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
      //   isInvoiceToOrg: [this.customerGroupForm.value.isInvoiceToOrg],
      istrialplan: [this.planGroupForm.value.istrialplan],
      discountType: [this.planGroupForm.value.discountType],
      serialNumber: [this.planGroupForm.value.serialNumber],
      discountExpiryDate: [
        this.planGroupForm.value.discountExpiryDate
          ? moment(this.planGroupForm.value.discountExpiryDate).utc(true).toDate()
          : null
      ],
      skipQuotaUpdate: [this.planGroupForm.value.skipQuotaUpdate],
      currency: [this.planGroupForm.value.currency],
      isTaxCalculate: [this.planGroupForm.value.isTaxCalculate]
      // id:[]
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
          // console.log(name);
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
            // case "Charge":
            //   this.onRemoveChargelist(chargeFieldIndex);
            //   break;
            // case "MAC":
            //   this.onRemoveMACaddress(chargeFieldIndex);
            //   break;
            // case 'uploadDocument':
            //   this.onRemoveUploadDocument(chargeFieldIndex);
            //   break;
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

  //   openSearchModel() {
  //     this.ifsearchLocationModal = true;
  //     this.currentPagesearchLocationList = 1;
  //   }

  checkUsernme(customerId) {
    this.submitted = true;

    if (this.customerGroupForm.valid) {
      const isCredentialMatch =
        this.customerGroupForm.controls.isCredentialMatchWithAccountNo.value;
      if (isCredentialMatch) {
        this.addEditcustomer(customerId);
      } else {
        const url =
          "/customer/customerUsernameIsAlreadyExists/" +
          this.customerGroupForm.controls.username.value;
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
        severity: "info",
        summary: "Info",
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

  //   deleteConfirmip(index: number, name: string) {
  //     if (index || index === 0) {
  //       this.confirmationService.confirm({
  //         message: "Do you want to delete this " + name + "?",
  //         header: "Delete Confirmation",
  //         icon: "pi pi-info-circle",
  //         accept: () => {
  //           switch (name) {
  //             case "ipAddress":
  //               this.ipMapppingListFromArray.removeAt(index);
  //               break;
  //             default:
  //               break;
  //           }
  //         },
  //         reject: () => {
  //           this.messageService.add({
  //             severity: "info",
  //             summary: "Rejected",
  //             detail: "You have rejected"
  //           });
  //         }
  //       });
  //     }
  //   }
  addEditcustomer(customerId) {
    this.submitted = true;
    let i = 0;
    let j = 0;
    let K = 0;
    let x = 0;
    const l = 0;
    let a = 0;
    let b = 0;
    let c = 0;
    let addressListData: any = [];

    if (this.customerGroupForm.valid && this.presentGroupForm.valid) {
      //   if (
      //     this.customerGroupForm.value.planMappingList.length > 0 ||
      //     this.customerGroupForm.value.plangroupid ||
      //     this.customerGroupForm.value.custlabel === "organization"
      //   ) {

      if (customerId) {
        this.customerGroupForm.value.pan = this.customerGroupForm.value.pan
          ? this.customerGroupForm.value.pan.trim()
          : "";
        // if (this.customerGroupForm.value.maxconcurrentsession < this.customerMacCount) {
        //   this.messageService.add({
        //     severity: "info",
        //     summary: "Info",
        //     detail: "You can not set max concurrent session less then customer mac.",
        //     icon: "far fa-check-circle"
        //   });
        //   return;
        // }
        const url = "/customers/" + customerId;
        // this.customerGroupForm.value.flatAmount = this.planDataForm.value.discountPrice;
        this.customerGroupForm.value.discount = this.customerGroupForm.value.discount
          ? this.customerGroupForm.value.discount
          : 0;
        if (this.presentGroupForm.value.addressType) {
          addressListData.push(this.presentGroupForm.value);
          // this.addressListData[0].addressType = "Present";
        }
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

        // this.createcustomerData.parentQuotaType = this.customerGroupForm.value.parentQuotaType;

        while (x < this.createcustomerData.customerLocations.length) {
          this.createcustomerData.customerLocations[x].locationId = Number(
            this.locationMacData[x].locationId
          );
          this.createcustomerData.customerLocations[x].mac = this.locationMacData[x].mac;
          //   this.createcustomerData.customerLocations[x].isParentLocation =
          //     this.locationMacData[x].isParentLocation;
          x++;
        }
        if (this.customerGroupForm.value.birthDate) {
          this.createcustomerData.birthDate = new Date(this.customerGroupForm.value.birthDate);
        } else {
          this.createcustomerData.birthDate = this.customerGroupForm.value.birthDate;
        }
        // if (
        //   this.createcustomerData?.mac_provision == null ||
        //   this.createcustomerData?.mac_provision == undefined
        // ) {
        //   this.createcustomerData.mac_provision = false;
        // }
        // let departmentId = this.customerGroupForm.value?.departmentId;
        // if (departmentId) {
        //   let departmentData = this.departmentListData?.find(x => x?.id === departmentId);
        //   this.createcustomerData.department = departmentData?.name;
        // }
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
        this.customerGroupForm.value.pan = this.customerGroupForm.value.pan.trim();
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
          //   this.customerGroupForm.value.flatAmount = this.planDataForm.value.discountPrice;
          this.customerGroupForm.value.discount = this.customerGroupForm.value.discount
            ? this.customerGroupForm.value.discount
            : 0;

          //   this.customerGroupForm.get("billday").enable();
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

          //   this.createcustomerData.parentQuotaType = this.customerGroupForm.value.parentQuotaType;

          while (x < this.createcustomerData.customerLocations.length) {
            this.createcustomerData.customerLocations[x].locationId = Number(
              this.locationMacData[x].locationId
            );
            this.createcustomerData.customerLocations[x].mac = this.locationMacData[x].mac;
            // this.createcustomerData.customerLocations[x].isParentLocation =
            //   this.locationMacData[x].isParentLocation;
            x++;
          }
          //   if (
          //     this.createcustomerData?.mac_provision == null ||
          //     this.createcustomerData?.mac_provision == undefined
          //   ) {
          //     this.createcustomerData.mac_provision = false;
          //   }
          // console.log("this.createcustomerData :::::::: ", this.createcustomerData);
          //
          // return;
          //   let departmentId = this.customerGroupForm.value?.departmentId;
          //   if (departmentId) {
          //     let departmentData = this.departmentListData?.find(x => x?.id === departmentId);
          //     this.createcustomerData.department = departmentData?.name;
          //   }
          this.customerManagementService.postMethod(url, this.createcustomerData).subscribe(
            (response: any) => {
              if (response.responseCode == 406) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else if (response.status == 400) {
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
                this.getProformaInvoiceList("");
                // this.router.navigate(["/home/customer/list/" + this.custType]);

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

  setDefualtServiceArea() {
    this.serviceAreaList = this.commondropdownService.serviceAreaList;
    const anyMatch = this.serviceAreaList.some(obj => this.anyMatchString(obj, "Default"));
    if (anyMatch === true) {
      this.serviceAreaList.filter((el: any) => {
        if (el.name === "Default") {
          this.pincodeDD = [];
          const serviceAreaId = el.id;
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

                this.getPlanbyServiceArea(serviceAreaId);
              },
              (error: any) => {}
            );
            this.getServiceByServiceAreaID(serviceAreaId);
            let data = [];
            data.push(serviceAreaId);
            let url3 = "/branchManagement/getAllBranchesByServiceAreaId";
            this.adoptCommonBaseService.postMethod(url3, data).subscribe((response: any) => {
              this.branchData = response.dataList;
              if (this.branchData.length > 0) {
                this.customerGroupForm.patchValue({
                  branch: this.branchData[0].id
                });
              }
            });
            // this.shiftLocationDTO.shiftPartnerid = "";
          }
          this.isBranchAvailable = true;
          this.customerGroupForm.patchValue({
            serviceareaid: el.id
          });
          this.presentGroupForm.controls.landmark.setValue(el.name);

          const url = "/area/pincode?pincodeId=" + el.pincodes[el.pincodes.length - 1];
          this.adoptCommonBaseService.get(url).subscribe(
            (response: any) => {
              this.areaListDD = response.areaList;

              setTimeout(() => {
                this.presentGroupForm.patchValue({
                  addressType: "Present",
                  pincodeId: Number(el.pincodes[el.pincodes.length - 1]),
                  cityId: Number(this.areaListDD[0].cityId),
                  stateId: Number(this.areaListDD[0].stateId),
                  countryId: Number(this.areaListDD[0].countryId)
                });
              }, 500);
              const url4 = "/pincode/" + this.areaListDD[0].id;

              setTimeout(() => {
                this.adoptCommonBaseService.get(url4).subscribe((response: any) => {
                  this.presentGroupForm.patchValue({
                    areaId: this.areaListDD[0].id
                  });
                });
              }, 500);
            },
            (error: any) => {}
          );
        }
      });
    }
  }

  anyMatchString(servicearea: any, string: any) {
    const serviceareanameLower = servicearea.name.toLowerCase();
    const searchStringLower = string.toLowerCase();
    return serviceareanameLower.includes(searchStringLower);
  }

  //   locationMacModelOpen() {
  //     this.showLocationMac = true;
  //   }

  //   locationMacModelClose() {
  //     this.showLocationMac = false;
  //   }

  //   locationChange(value: any) {
  //     let locationUrl = "";
  //     if (value != null && value.length > 0) {
  //       value.forEach(location => {
  //         if (locationUrl == "") {
  //           locationUrl = locationUrl + "locationId=" + location;
  //         } else {
  //           locationUrl = locationUrl + "&locationId=" + location;
  //         }
  //       });

  //       let isParent;
  //       if (this.customerGroupForm.value.isParentLocation) {
  //         isParent = this.customerGroupForm.value.isParentLocation;
  //       } else {
  //         isParent = false;
  //       }
  //       locationUrl = locationUrl + "&isParentLocation=" + isParent;

  //       this.locationService.getAllMacByLocation(locationUrl).subscribe((response: any) => {
  //         console.log("adsf", response.msg);
  //         this.macData = response.msg;
  //       });
  //     }
  //   }

  //   macChangeChange(event: any, dd: any) {
  //     this.overLocationMacArray = this.fb.array([]);
  //     if (dd.value.length > 0) {
  //       dd.value.forEach(mac => {
  //         let findmatch = this.macData.find(data => data.mac === mac);
  //         if (findmatch) {
  //           this.overLocationMacArray.push(
  //             this.fb.group({
  //               name: [findmatch.name],
  //               mac: [findmatch.mac],
  //               locationId: [findmatch.locationId],
  //               isAlreadyAvailable: false
  //             })
  //           );
  //         }
  //       });
  //     }

  //     if (this.custLocationData.length > 0) {
  //       this.custLocationData.forEach(custLocation => {
  //         this.overLocationMacArray.push(
  //           this.fb.group({
  //             name: [custLocation.locationName],
  //             mac: [custLocation.mac],
  //             locationId: [custLocation.locationId],
  //             isAlreadyAvailable: true
  //           })
  //         );
  //       });
  //     }
  //   }

  addMacAtEdit() {}

  //   saveLocationMacData() {
  //     this.locationMacData = this.overLocationMacArray.value.map(location => ({
  //       locationId: location.locationId, //location.locationId
  //       mac: location.mac,
  //       isParentLocation: this.customerGroupForm.value.isParentLocation
  //     }));
  //     this.showLocationMac = false;
  //   }

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

  //   deleteLocationMapField(locationMapField: any, index: number) {
  //     const existingIndex = this.custLocationData.findIndex(
  //       x => x.locationId === locationMapField.value.locationId
  //     );
  //     this.custLocationData.splice(existingIndex);
  //     this.overLocationMacArray.removeAt(index);
  //   }

  //   locationMacModelCancel() {
  // this.locationMacForm = this.fb.group({
  //   location: ["", Validators.required],
  //   mac: ["", Validators.required]
  // });
  // var selectedLocation = [];
  // this.custLocationData = [];
  // this.overLocationMacArray = this.fb.array([]);
  // this.locationMacForm.get("mac").setValue("");
  // this.locationMacData = [];
  // this.custLocationData = [...this.custData.customerLocations];
  // this.custData.customerLocations.forEach(location => {
  //   if (selectedLocation.indexOf(location.locationId) === -1) {
  //     selectedLocation.push(location.locationId);
  //   }
  //   this.overLocationMacArray.push(
  //     this.fb.group({
  //       name: [location.locationName],
  //       mac: [location.mac],
  //       locationId: [location.locationId],
  //       isAlreadyAvailable: true,
  //       isParentLocation: this.customerGroupForm.value.isParentLocation
  //     })
  //   );
  // });
  // if (this.overLocationMacArray.value.length > 0) {
  //   this.locationMacData = this.overLocationMacArray.value.map(location => ({
  //     locationId: location.locationId, //location.locationId
  //     mac: location.mac,
  //     isParentLocation: location.isParentLocation
  //   }));
  // }
  // this.locationChange(selectedLocation);
  // this.locationMacForm.get("location").setValue(selectedLocation);
  // this.showLocationMac = false;
  //   }

  //   searchLocation() {
  //     if (this.searchLocationForm.valid) {
  //       const url =
  //         "/serviceArea/getPlaceId?query=" + this.searchLocationForm.value.searchLocationname;
  //       this.adoptCommonBaseService.get(url).subscribe(
  //         (response: any) => {
  //           this.searchLocationData = response.locations;
  //         },
  //         (error: any) => {
  //           if (error.error.code == 422) {
  //             this.messageService.add({
  //               severity: "error",
  //               summary: "Error",
  //               detail: error.error.error,
  //               icon: "far fa-times-circle"
  //             });
  //           } else {
  //             this.messageService.add({
  //               severity: "error",
  //               summary: "Error",
  //               detail: error.error.ERROR,
  //               icon: "far fa-times-circle"
  //             });
  //           }
  //         }
  //       );
  //     }
  //   }

  //   clearLocationForm() {
  //     this.searchLocationForm.reset();
  //     this.searchLocationData = [];
  //   }

  //   filedLocation(placeId) {
  //     const url = "/serviceArea/getLatitudeAndLongitude?placeId=" + placeId;
  //     this.adoptCommonBaseService.get(url).subscribe(
  //       (response: any) => {
  //         this.ifsearchLocationModal = false;

  //         this.customerGroupForm.patchValue({
  //           latitude: response.location.latitude,
  //           longitude: response.location.longitude
  //         });

  //         this.iflocationFill = true;
  //         this.closebutton.nativeElement.click();
  //         this.searchLocationData = [];
  //         this.searchLocationForm.reset();
  //       },
  //       (error: any) => {
  //         // console.log(error, 'error')
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle"
  //         });
  //       }
  //     );
  //   }

  pageChangedSearchLocationList(currentPage) {
    this.currentPagesearchLocationList = currentPage;
  }

  //   clearsearchLocationData() {
  //     this.searchLocationData = [];
  //     this.ifsearchLocationModal = false;
  //     this.searchLocationForm.reset();
  //   }

  //   getBillToData() {
  //     let url = "/commonList/billTo";
  //     this.adoptCommonBaseService.get(url).subscribe(
  //       (response: any) => {
  //         if (this.custType == "Postpaid") {
  //           this.billToData = response.dataList.filter(billto => billto.value != "ORGANIZATION");
  //         } else {
  //           this.billToData = response.dataList;
  //         }
  //       },
  //       error => {}
  //     );
  //   }

  insertBillDay(event, invoiceType) {
    if (event.value == "Group") {
      //   this.customerGroupForm.controls.billday.setValue(this.parentBillday);
      //   this.customerGroupForm.get("billday").disable();
    } else if (event.value == "Independent" && this.isInvoiceTypeAlreadySelected) {
      //   this.customerGroupForm.controls.billday.setValue("");
      //   this.customerGroupForm.controls.billday.enable();
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
        this.isMobileAndEmailRequired = res?.data?.value == "true" ? true : false;
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
      //   this.customerGroupForm.get("username")?.setValue(null);
      //   this.customerGroupForm.get("password")?.setValue(null);

      this.customerGroupForm.get("username")?.disable();
      this.customerGroupForm.get("password")?.disable();

      this.customerGroupForm.get("username")?.clearValidators();
      this.customerGroupForm.get("password")?.clearValidators();

      this.customerGroupForm.get("username")?.updateValueAndValidity();
      this.customerGroupForm.get("password")?.updateValueAndValidity();
    } else {
      this.customerGroupForm.get("username")?.enable();
      this.customerGroupForm.get("password")?.enable();

      this.customerGroupForm.get("username")?.setValidators([Validators.required]);
      this.customerGroupForm.get("password")?.setValidators([Validators.required]);

      this.customerGroupForm.get("username")?.updateValueAndValidity();
      this.customerGroupForm.get("password")?.updateValueAndValidity();
    }
  }

  getDemographicLabel(currentName: string): string {
    if (!this.demographicLabel || this.demographicLabel.length === 0) {
      return currentName;
    }

    const label = this.demographicLabel.find(item => item.currentName === currentName);
    return label ? label.newName : currentName;
  }

  selectParentCustomer: boolean = false;
  async modalOpenParentCustomers() {
    this.selectParentCustomer = true;
    await this.getParentCustomerData();
    this.newFirst = 1;
    this.selectedParentCusts = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  modalCloseParentCustomer() {
    this.selectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];

    // console.log("this.newFirst1", this.newFirst)
  }

  getParentCustomerData() {
    let currentPage;
    currentPage = this.currentPageParentCustomerListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };

    const url =
      "/parentCustomers/list/" + this.custType + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.customerList = response.parentCustomerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        this.newFirst = 1;
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

  async saveSelCustomer() {
    this.parentCustLists = [
      {
        id: Number(this.selectedParentCusts.id),
        name: this.selectedParentCusts.name
      }
    ];
    this.editCustId = this.selectedParentCusts.id;
    this.editCustomer();

    this.customerGroupForm.patchValue({
      customerid: Number(this.selectedParentCusts.id)
    });
    this.modalCloseParentCustomer();
    // if (this.selectedParentCusts.id) {
    //   this.changeCustomer(this.selectedParentCusts.id);
    // }
  }

  paginated(event) {
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
  }

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  searchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    const searchParentData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageParentCustomerListdata,
      pageSize: this.parentCustomerListdataitemsPerPage
    };

    searchParentData.filters[0].filterValue = this.searchParentCustValue;
    searchParentData.filters[0].filterColumn = this.searchParentCustOption.trim();

    const url = "/subscriber/getByInvoiceType/search/Group";
    // console.log("this.searchData", this.searchData)
    this.customerManagementService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
        if (error.error.status == 400 || error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          // this.customerListData = [];
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

  selParentSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  createoverChargeListFormGroup(): FormGroup {
    return this.fb.group({
      actualprice: [this.chargeGroupForm.value.actualprice, Validators.required],
      chargecategory: [this.chargeGroupForm.value.chargecategory, Validators.required],
      chargetype: [this.chargeGroupForm.controls.chargetype.value, Validators.required],
      desc: [
        this.chargeGroupForm.value.desc,
        [Validators.required, Validators.pattern(Regex.characterlength225)]
      ],
      name: [this.chargeGroupForm.value.name, Validators.required],
      saccode: [this.chargeGroupForm.value.saccode],
      taxid: [this.chargeGroupForm.value.taxid, Validators.required],
      serviceId: [this.planGroupForm.value.serviceId],
      status: ["Active"],
      ledgerId: [this.chargeGroupForm.value.ledgerId],
      billingCycle: [this.chargeGroupForm.controls.billingCycle.value, Validators.required],
      serviceNameList: [null],
      royalty_payable: [false],
      taxamount: [this.chargeGroupForm.value.taxamount]
    });
  }

  onAddChargeArray() {
    this.chargesubmitted = true;
    if (this.chargeGroupForm.valid) {
      if (this.chargeGroupForm.value.actualprice) {
        this.proceIncudingTax(this.chargeGroupForm.value.actualprice);
      }
      setTimeout(() => {
        this.chargeGroupFormArray.push(this.createoverChargeListFormGroup());
        this.chargeGroupForm.reset();
        this.chargeGroupForm.controls.billingCycle.setValue("1");
        this.chargeGroupForm.controls.serviceId.setValue(this.planGroupForm.value.serviceId);
        this.chargesubmitted = false;
      }, 500);
    } else {
    }
  }

  proceIncudingTax(addPrice) {
    let taxData: any = [];
    let slabList: any = [];
    let tireList: any = [];
    let slabPrice: any = [];
    let taxAmount: any = [];
    let taxAmountAray: any = [];
    let amount = 0;
    let totalslebPrice = 0;
    let price = Number(addPrice);
    let url = "/taxes/" + Number(this.chargeGroupForm.value.taxid);
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      response.taxData.tieredList.forEach(element => {
        this.taxDetails.push(element);
      });
      this.taxAmount;
      taxData = response.taxData;
      if (taxData.taxtype == "SLAB") {
        slabList = taxData.slabList;
        if (slabList.length > 0) {
          for (let i = 0; i < slabList.length; i++) {
            if (price >= slabList[i].rangeUpTo) {
              if (i == 0) {
                amount = slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                price = price - slabList[i].rangeUpTo;
              } else {
                let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                price = price - NewAmount;
              }
              slabPrice.push(amount);
              if (slabList.length == i + 1) {
                slabPrice.forEach(element => {
                  totalslebPrice = totalslebPrice + Number(element);
                });
                this.pricePerTax = totalslebPrice.toFixed(2);

                this.totalPriceData.push(Number(this.pricePerTax));
                this.countTotalOfferPrice =
                  Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                this.planGroupForm.patchValue({
                  offerprice: this.countTotalOfferPrice.toFixed(2)
                });
              }
            } else {
              amount = price + (price * slabList[i].rate) / 100;
              slabPrice.push(amount);
              slabPrice.forEach(element => {
                totalslebPrice = totalslebPrice + Number(element);
              });
              this.pricePerTax = totalslebPrice.toFixed(2);
              this.totalPriceData.push(Number(this.pricePerTax));
              this.countTotalOfferPrice =
                Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
              this.planGroupForm.patchValue({
                offerprice: this.countTotalOfferPrice.toFixed(2)
              });

              slabList.length = 0;
            }
          }
        }
      } else if (taxData.taxtype == "TIER") {
        let ifsameTire = false;
        if (taxData.tieredList.length > 0) {
          tireList = taxData.tieredList;
          if (tireList.length > 0) {
            let newAmount = 0;
            let totalAmountTire = 0;
            let totalPricetire = 0;
            let tireAmountList = [];

            amount = price + (price * tireList[0].rate) / 100;
            newAmount = (price * tireList[0].rate) / 100;
            totalAmountTire = amount;
            if (tireList.length == 1) {
              this.taxAmountCal(price, tireList[0].rate);
              taxAmountAray.push(this.taxAmount);
              this.pricePerTax = amount.toFixed(2);

              this.countTotalOfferPrice =
                Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
              this.chargeGroupForm.patchValue({
                taxamount: Number(this.pricePerTax)
              });
              this.totalPriceData.push(Number(this.pricePerTax));
              taxAmount.push(this.taxAmount);
            } else {
              // amount = newAmount
              for (let i = 1; i < tireList.length; i++) {
                let AcTiNo = i;
                while (AcTiNo > 0) {
                  let TI_NO = AcTiNo - 1;
                  if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                    ifsameTire = true;
                    AcTiNo = 0;
                  } else {
                    amount = newAmount;
                    ifsameTire = false;
                  }
                  AcTiNo--;
                }

                if (ifsameTire) {
                  amount = amount + (amount * tireList[i].rate) / 100;

                  if (tireList.length == i + 1 || amount < 0) {
                    totalAmountTire = amount;
                    this.pricePerTax = totalAmountTire.toFixed(2);
                    tireList.length = 0;

                    this.countTotalOfferPrice =
                      Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                    this.chargeGroupForm.patchValue({
                      taxamount: Number(this.pricePerTax)
                    });
                    let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
                    taxAmountAray.push(NewTaxAmountCount);
                    this.totalPriceData.push(Number(this.pricePerTax));

                    taxAmount.push(NewTaxAmountCount);
                  }
                } else {
                  amount = (amount * tireList[i].rate) / 100;
                  tireAmountList.push(amount);
                  if (tireList.length == i + 1 || amount < 0) {
                    tireAmountList.forEach(element => {
                      totalPricetire = totalPricetire + Number(element);
                    });
                    totalAmountTire = Number(totalAmountTire) + Number(totalPricetire);
                    this.pricePerTax = totalAmountTire.toFixed(2);
                    tireList.length = 0;

                    let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
                    taxAmountAray.push(NewTaxAmountCount);
                    this.countTotalOfferPrice =
                      Number(this.countTotalOfferPrice) + Number(this.pricePerTax);

                    this.chargeGroupForm.patchValue({
                      taxamount: Number(this.pricePerTax)
                    });
                    this.totalPriceData.push(Number(this.pricePerTax));

                    taxAmount.push(NewTaxAmountCount);
                  }
                }
              }
            }

            // this.totalPriceData.forEach((element, i) => {
            //   let nn = i + 1;
            //   this.chargeGroupFormArray.value.forEach((elem, j) => {
            //     let mm = j + 1;
            //     if (i == j) {
            //       elem.taxamount = element.toFixed(2);
            //     }
            //     if (this.chargeGroupFormArray.value.length == mm && taxAmount.length == nn) {
            //       this.chargeGroupFormArray.patchValue(this.chargeGroupFormArray.value);
            //     }
            //   });
            // });
          }
        }
      }
    });
  }

  taxAmountCal(price, rate) {
    this.taxAmount = (price * rate) / 100;
    return this.taxAmount.toFixed(2);
  }

  deleteConfirmonChargedField(attributeIndex, price) {
    let totalPrice = 0;
    this.chargeGroupFormArray.removeAt(attributeIndex);
    totalPrice = Number(this.countTotalOfferPrice) - Number(this.totalPriceData[attributeIndex]);
    this.countTotalOfferPrice = Number(totalPrice);
    this.totalPriceData.splice(attributeIndex, 1);

    // let productPrice = price ? Number(price) : 0;
    // this.countTotalOfferPrice = Number(this.countTotalOfferPrice) - productPrice;
  }

  getChargeCategory() {
    const url = "/commonList/chargeCategory";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.chargeCategoryList = response.dataList;
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

  finalChargeType: any;
  getSelChargeCategory(event) {
    if (event.value == "INSTALLATION") {
      this.chargeGroupForm.controls.chargetype.setValue("NON_RECURRING");
      this.chargeGroupForm.controls.chargetype.disable();
      this.chargeType = this.finalChargeType;
    } else {
      this.chargeGroupForm.controls.chargetype.setValue("");
      this.chargeGroupForm.controls.chargetype.enable();
      this.chargeType = this.chargeType.filter(object => {
        return object.id !== 44;
      });
    }
  }

  getChargeType() {
    let url = "/commonList/generic/chargetype";
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      const data = response.dataList;
      this.mainChargeList = response.dataList;
      const newArr = data.filter(object => {
        return object.id !== 46;
      });
      const newArr1 = newArr.filter(object => {
        return object.id !== 47;
      });
      this.chargeType = newArr1;

      this.finalChargeType = this.chargeType;
    });
  }

  taxRang(event) {
    let taxData: any = [];
    let slabList: any = [];
    this.taxUpRange = "";
    let id = event.value;

    let url = "/taxes/" + id;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      taxData = response.taxData;
      if (taxData.taxtype == "SLAB") {
        slabList = taxData.slabList;
        let index = slabList.length - 1;
        this.taxUpRange = slabList[index].rangeUpTo;
      }
    });
  }

  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }

  pageChangedCharge(pageNumber) {
    this.currentPageChargeData = pageNumber;
  }

  addPerformaInvoice() {
    let url = "/ProformaInvoice";
    let obj = {
      custId: this.editCustId,
      mvnoId: localStorage.getItem("mvnoId"),
      planMapping: this.customerGroupForm.value.planMappingList,
      custChargeDetailsPojoList: this.chargeFromArray.value
    };
    this.revenueManagementService.postMethod(url, obj).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.status == 400) {
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
          this.submitted = false;
          this.listView = true;
          this.createView = false;
          this.customerGroupForm.reset();
          this.planGroupForm.reset();
          this.chargeGroupForm.reset();
        }
      },
      (error: any) => {
        if (error.status === 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (error.status === 500) {
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
  }

  selCustTypeData(event) {
    this.getParentCustomerData();
  }

  createChargeFormGroup(): FormGroup {
    for (const prop in this.chargefromgroup.controls) {
      this.chargefromgroup.value[prop] = this.chargefromgroup.controls[prop].value;
    }

    if (this.chargefromgroup.value.billingCycle == null) {
      this.chargefromgroup.value.billingCycle = 1;
    }
    if (!this.chargefromgroup.value.isTaxCalculate) {
      this.chargefromgroup.value.taxamount = 0;
    }

    return this.fb.group({
      billingCycle: [this.chargefromgroup.value.billingCycle],
      id: [this.chargefromgroup.value.id],
      actualprice: [this.chargefromgroup.value.actualprice],
      taxamount: [this.chargefromgroup.value.taxamount.toFixed(2)],
      chargeprice: [
        this.chargefromgroup.value.chargeprice
        // this.planGroupForm.value.category === "Business Promotion"
        //   ? Validators.compose([Validators.max(this.chargefromgroup.value.chargeprice)])
        //   : null
      ],
      price: [this.chargefromgroup.value.price],
      currency: [this.chargefromgroup.value.currency],
      isTaxCalculate: [this.chargefromgroup.value.isTaxCalculate]
    });
  }

  onAddChargeField() {
    if (this.planGroupForm) {
      this.chargeSubmitted = true;
      if (this.chargefromgroup.valid) {
        this.countTotalOfferPrice = 0;
        this.totalPriceData.push(Number(this.pricePerTax));
        for (let j = 0; j < this.totalPriceData.length; j++) {
          this.countTotalOfferPrice = this.countTotalOfferPrice + Number(this.totalPriceData[j]);
        }
        this.planGroupForm.patchValue({
          offerprice: this.countTotalOfferPrice.toFixed(2),
          newOfferPrice: this.countTotalOfferPrice
        });
        this.filterChargesByCurrency(this.chargefromgroup.value);
        this.chargeFromArray.push(this.createChargeFormGroup());

        this.chargefromgroup.reset();
        // if (this.planGroupForm.controls.plantype.value == "Prepaid") {
        //   this.chargefromgroup.controls.billingCycle.setValue("1");
        //   this.chargefromgroup.controls.billingCycle.disable();
        // }
        if (this.chargeFromArray?.length > 0) {
          this.planGroupForm.controls?.currency.setValue(this.chargeFromArray?.value[0]?.currency);
        }

        this.chargeSubmitted = false;
      } else {
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Service Field Required",
        icon: "far fa-times-circle"
      });
    }
  }

  changeActualPrice(price, id, index, actualprice, isTaxCalculate, event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (Number(inputElement.value) > 0 && isTaxCalculate === true) {
      if (this.planGroupForm.value.category == "Business Promotion" && price > actualprice) {
        this.planGroupForm.patchValue({
          newOfferPrice: ""
        });
        return;
      }
      let taxData: any = [];
      let slabList: any = [];
      let tireList: any = [];
      let slabPrice: any = [];
      let amount = 0;
      let totalslebPrice = 0;
      let noTaxPrice = 0;
      const url1 = "/charge/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.planManagementService.getMethod(url1).subscribe((res: any) => {
        let url = "/taxes/" + res.chargebyid.taxid;
        this.planManagementService.getMethod(url).subscribe((response: any) => {
          taxData = response.taxData;
          if (taxData.taxtype == "SLAB") {
            slabList = taxData.slabList;
            if (slabList.length > 0) {
              for (let i = 0; i < slabList.length; i++) {
                if (price >= slabList[i].rangeUpTo) {
                  if (i == 0) {
                    amount =
                      slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                    price = price - slabList[i].rangeUpTo;
                  } else {
                    let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                    amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                    price = price - NewAmount;
                  }
                  slabPrice.push(amount);

                  if (slabList.length == i + 1) {
                    slabPrice.forEach(element => {
                      totalslebPrice = totalslebPrice + Number(element);
                    });
                    this.pricePerTax = totalslebPrice.toFixed(2);
                  }
                } else {
                  amount = price + (price * slabList[i].rate) / 100;
                  slabPrice.push(amount);
                  slabPrice.forEach(element => {
                    totalslebPrice = totalslebPrice + Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);
                  slabList.length = 0;
                }
              }
            }
          } else if (taxData.taxtype == "TIER") {
            let ifsameTire = false;
            if (taxData.tieredList.length > 0) {
              tireList = taxData.tieredList;
              if (tireList.length > 0) {
                let newAmount = 0;
                let totalAmountTire = 0;
                let totalPricetire = 0;
                let tireAmountList = [];

                amount = price + (price * tireList[0].rate) / 100;
                newAmount = (price * tireList[0].rate) / 100;
                totalAmountTire = amount;
                if (tireList.length == 1) {
                  this.taxAmountCal(price, tireList[0].rate);
                  this.pricePerTax = Number(amount).toFixed(2);
                  this.totalPriceData.forEach((element, j) => {
                    if (j == index) {
                      this.totalPriceData[j] = this.pricePerTax;
                      let count: number = 0;
                      for (let j = 0; j < this.totalPriceData.length; j++) {
                        let n = this.totalPriceData[j];
                        count = Number(count) + Number(n);
                        this.countTotalOfferPrice = Number(count.toFixed(2));
                      }
                      this.chargeFromArray.value.forEach((elem, indexCharge) => {
                        let nn = indexCharge + 1;
                        if (indexCharge == index) {
                          elem.taxamount = this.taxAmount.toFixed(2);
                        }
                        if (this.chargeFromArray.value.length == nn) {
                          this.chargeFromArray.patchValue(this.chargeFromArray.value);
                        }
                      });
                      if (this.planGroupForm.value.category == "Business Promotion") {
                        this.planGroupForm.patchValue({
                          // offerprice: count.toFixed(2),
                          newOfferPrice: count.toFixed(2)
                        });
                      } else {
                        this.planGroupForm.patchValue({
                          offerprice: count.toFixed(2)
                          // newOfferPrice: count.toFixed(2),
                        });
                      }
                    }
                  });
                } else {
                  for (let i = 1; i < tireList.length; i++) {
                    let AcTiNo = i;
                    while (AcTiNo > 0) {
                      let TI_NO = AcTiNo - 1;
                      if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                        ifsameTire = true;
                        AcTiNo = 0;
                      } else {
                        amount = newAmount;
                        ifsameTire = false;
                      }
                      AcTiNo--;
                    }

                    if (ifsameTire) {
                      amount = amount + (amount * tireList[i].rate) / 100;
                      if (tireList.length == i + 1 || amount < 0) {
                        tireAmountList.forEach(element => {
                          totalPricetire = totalPricetire + Number(element);
                        });

                        totalAmountTire = amount;
                        this.pricePerTax = totalAmountTire.toFixed(2);
                        this.totalPriceData.forEach((element, j) => {
                          if (j == index) {
                            this.totalPriceData[j] = this.pricePerTax;
                            let count = 0;
                            for (let j = 0; j < this.totalPriceData.length; j++) {
                              let n = this.totalPriceData[j];
                              count = Number(count) + Number(n);
                              this.countTotalOfferPrice = Number(count.toFixed(2));
                            }

                            this.chargeFromArray.value.forEach((elem, indexCharge) => {
                              let nn = indexCharge + 1;
                              if (indexCharge == index) {
                                elem.taxamount = (Number(this.pricePerTax) - Number(price)).toFixed(
                                  2
                                );
                              }
                              if (this.chargeFromArray.value.length == nn) {
                                this.chargeFromArray.patchValue(this.chargeFromArray.value);
                              }
                            });
                            if (this.planGroupForm.value.category == "Business Promotion") {
                              this.planGroupForm.patchValue({
                                // offerprice: count.toFixed(2),
                                newOfferPrice: count.toFixed(2)
                              });
                            } else {
                              this.planGroupForm.patchValue({
                                offerprice: count.toFixed(2)
                                // newOfferPrice: count.toFixed(2),
                              });
                            }
                          }
                        });
                        tireList.length = 0;
                      }
                    } else {
                      amount = (amount * tireList[i].rate) / 100;
                      tireAmountList.push(amount.toFixed(2));

                      if (tireList.length == i + 1 || amount < 0) {
                        tireAmountList.forEach(element => {
                          totalPricetire = totalPricetire + Number(element);
                        });

                        totalAmountTire = totalAmountTire + totalPricetire;
                        this.pricePerTax = totalAmountTire.toFixed(2);

                        this.totalPriceData.forEach((element, j) => {
                          if (j == index) {
                            this.totalPriceData[j] = this.pricePerTax;
                            let count = 0;
                            for (let j = 0; j < this.totalPriceData.length; j++) {
                              let n = this.totalPriceData[j];
                              count = Number(count) + Number(n);
                              this.countTotalOfferPrice = Number(count.toFixed(2));
                            }

                            this.chargeFromArray.value.forEach((elem, indexCharge) => {
                              let nn = indexCharge + 1;
                              if (indexCharge == index) {
                                elem.taxamount = Number(this.pricePerTax) - Number(price);
                                elem.taxamount = elem.taxamount.toFixed(2);
                              }
                              if (this.chargeFromArray.value.length == nn) {
                                this.chargeFromArray.patchValue(this.chargeFromArray.value);
                              }
                            });
                            if (this.planGroupForm.value.category == "Business Promotion") {
                              this.planGroupForm.patchValue({
                                // offerprice: count.toFixed(2),
                                newOfferPrice: count.toFixed(2)
                              });
                            } else {
                              this.planGroupForm.patchValue({
                                offerprice: count.toFixed(2)
                                // newOfferPrice: count.toFixed(2),
                              });
                            }
                          }
                        });
                        tireList.length = 0;
                      }
                    }
                  }
                }
              }
            }
          } else if (taxData.taxtype == "Compound") {
            let finalAmount = price;

            // Apply each tax tier
            taxData.tieredList.forEach(tax => {
              finalAmount += finalAmount * (tax.rate / 100);
            });
            this.pricePerTax = finalAmount;
            this.totalPriceData.forEach((element, j) => {
              if (j == index) {
                this.totalPriceData[j] = this.pricePerTax;
                let count = 0;
                for (let j = 0; j < this.totalPriceData.length; j++) {
                  let n = this.totalPriceData[j];
                  count = Number(count) + Number(n);
                  this.countTotalOfferPrice = Number(count.toFixed(2));
                }

                this.chargeFromArray.value.forEach((elem, indexCharge) => {
                  let nn = indexCharge + 1;
                  if (indexCharge == index) {
                    elem.taxamount = Number(this.pricePerTax) - Number(price);
                    elem.taxamount = elem.taxamount.toFixed(2);
                  }
                  if (this.chargeFromArray.value.length == nn) {
                    this.chargeFromArray.patchValue(this.chargeFromArray.value);
                  }
                });
                if (this.planGroupForm.value.category == "Business Promotion") {
                  this.planGroupForm.patchValue({
                    // offerprice: count.toFixed(2),
                    newOfferPrice: count.toFixed(2)
                  });
                } else {
                  this.planGroupForm.patchValue({
                    offerprice: count.toFixed(2)
                    // newOfferPrice: count.toFixed(2),
                  });
                }
              }
            });
          }
        });
      });
      return true;
    } else {
      return;
    }
  }

  getofferPrice(event) {
    let chargeId = event.value;
    let price = "";

    const url = "/charge/" + chargeId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        price = response.chargebyid.price;
        this.chargefromgroup.patchValue({
          actualprice: response.chargebyid.actualprice,
          taxamount: response.chargebyid.taxamount,
          chargeprice: response.chargebyid.actualprice,
          price: response.chargebyid.price,
          currency: response.chargebyid.currency
        });
        if (response.chargebyid.taxid) {
          this.getamountPerTaxCount(response.chargebyid.taxid, price);
        }
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

  getamountPerTaxCount(id, price) {
    let taxData: any = [];
    let slabList: any = [];
    let tireList: any = [];
    let slabPrice: any = [];
    let amount = 0;
    let totalslebPrice = 0;
    let noTaxPrice = 0;

    let url = "/taxes/" + id;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        taxData = response.taxData;
        if (taxData.taxtype == "SLAB") {
          slabList = taxData.slabList;
          if (slabList.length > 0) {
            for (let i = 0; i < slabList.length; i++) {
              if (price >= slabList[i].rangeUpTo) {
                if (i == 0) {
                  amount = slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                  price = price - slabList[i].rangeUpTo;
                } else {
                  let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                  amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                  price = price - NewAmount;
                }
                slabPrice.push(amount);

                if (slabList.length == i + 1) {
                  slabPrice.forEach(element => {
                    totalslebPrice = totalslebPrice + Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);
                }
              } else {
                amount = price + (price * slabList[i].rate) / 100;
                slabPrice.push(amount);
                slabPrice.forEach(element => {
                  totalslebPrice = totalslebPrice + Number(element);
                });
                this.pricePerTax = totalslebPrice.toFixed(2);
                slabList.length = 0;
              }
            }
          }
        } else if (taxData.taxtype == "TIER") {
          let ifsameTire = false;
          if (taxData.tieredList.length > 0) {
            tireList = taxData.tieredList;
            if (tireList.length > 0) {
              let newAmount = 0;
              let totalAmountTire = 0;
              let totalPricetire = 0;
              let tireAmountList = [];

              amount = price + (price * tireList[0].rate) / 100;
              newAmount = (price * tireList[0].rate) / 100;
              totalAmountTire = amount;
              if (tireList.length == 1) {
                this.pricePerTax = amount.toFixed(2);
              } else {
                for (let i = 1; i < tireList.length; i++) {
                  let AcTiNo = i;
                  while (AcTiNo > 0) {
                    let TI_NO = AcTiNo - 1;
                    if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                      ifsameTire = true;
                      AcTiNo = 0;
                    } else {
                      amount = newAmount;
                      ifsameTire = false;
                    }
                    AcTiNo--;
                  }

                  if (ifsameTire) {
                    amount = amount + (price * tireList[i].rate) / 100;

                    if (tireList.length == i + 1 || amount < 0) {
                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });

                      totalAmountTire = amount;
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      tireList.length = 0;
                    }
                  } else {
                    amount = (amount * tireList[i].rate) / 100;
                    tireAmountList.push(amount.toFixed(2));

                    if (tireList.length == i + 1 || amount < 0) {
                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });

                      totalAmountTire = totalAmountTire + totalPricetire;
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      tireList.length = 0;
                    }
                  }
                }
              }
            }
          }
        } else if (taxData.taxtype == "Compound") {
          let finalAmount = price;

          // Apply each tax tier
          taxData.tieredList.forEach(tax => {
            finalAmount += finalAmount * (tax.rate / 100);
          });
          this.pricePerTax = finalAmount;
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

  addNotesSetFunction(custId: any) {
    this.addNotesPopup = true;
    this.custIdForNotes = custId;
  }

  saveNotes(leadId: any) {
    this.notesSubmitted = true;
    if (this.addNotesForm.valid) {
      if (leadId) {
        const url = "/add/notes";
        this.addNotesData = {
          id: 0,
          custId: leadId,
          notes: this.addNotesForm.controls.notes.value
        };
        this.customerManagementService
          .postMethodForCustNotes(url, this.addNotesData, this.mvnoid, this.staffid)
          .subscribe(
            (response: any) => {
              this.notesSubmitted = false;
              if (response.status == 406) {
                this.addNotesPopup = false;
                this.addNotesForm.reset();

                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.message,
                  icon: "far fa-times-circle"
                });
              } else {
                if (!this.searchkey) {
                  this.getRefresh();
                } else {
                  this.searchProformaInvoice();
                }
                this.addNotesPopup = false;
                this.addNotesForm.reset();

                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle"
                });
              }
            },
            (error: any) => {
              this.addNotesPopup = false;
              this.addNotesForm.reset();
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            }
          );
      } else {
        this.addNotesForm.reset();
        this.addNotesPopup = false;

        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Lead Id is missing!",
          icon: "far fa-times-circle"
        });
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Required column is missing!",
        icon: "far fa-times-circle"
      });
      this.addNotesPopup = true;
    }
  }

  closeNotesModal() {
    this.addNotesPopup = false;
    this.addNotesForm.reset();
  }

  generatePDFInvoice(proformadebitdocumentid) {
    if (proformadebitdocumentid) {
      const url = "/generateProformaInvoicePdfByInvoiceId/" + proformadebitdocumentid;
      this.customerManagementService.generateMethodInvoice(url).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            this.searchProformaInvoice();
          } else {
            response.responseCode == 417;
          }
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
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

  downloadPDFINvoice(docNo, customerName) {
    if (docNo) {
      const downloadUrl = "/proformaInvoicePdf/download/" + docNo;
      this.customerManagementService.downloadPDFInvoice(downloadUrl).subscribe(
        (response: any) => {
          const file = new Blob([response], { type: "application/pdf" });
          // var fileURL = URL.createObjectURL(file,customerName + docNo);
          // FileSaver.saveAs(file);
          const fileURL = URL.createObjectURL(file);
          FileSaver.saveAs(file, customerName + docNo);
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

  sendemailinvoice(docNo) {
    if (docNo) {
      const downloadUrl = "/invoice/send/" + docNo;
      this.customerdetailsilsService.getmethodforrevenue(downloadUrl).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          this.spinner.hide();
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
  navigateCustomer(id) {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + id]);
  }

  viewInvoice(docnumber, custname) {
    const url = "/regenerateProformapdfsub/" + docnumber;
    this.invoiceMasterService.downloadPDF(url).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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
}
