import { Component, OnInit } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as FileSaver from "file-saver";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { countries } from "src/app/components/model/country";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { LeadManagementService } from "src/app/service/lead-management-service";
import { error } from "console";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { ServiceAreaService } from "src/app/service/service-area.service";

declare var $: any;

@Component({
  selector: "app-quick-invoice",
  templateUrl: "./quick-invoice.component.html",
  styleUrls: ["./quick-invoice.component.css"]
})
export class QuickInvoiceComponent implements OnInit {
  countries: any = countries;
  loggedInStaffId = "";
  partnerId: any;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;

  // pipe = new DatePipe("en-US");
  custType: any;

  custmilestoneitemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custmilestonetotalRecords: String;
  currentPagecustmilestone = 1;
  chargeIemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  chargeDatatotalRecords: String;
  currentPageChargeData = 1;

  presentGroupForm: FormGroup;
  customerGroupForm: FormGroup;
  chargeGroupForm: FormGroup;
  milestoneGroupForm: FormGroup;

  addressListFromArray: FormArray;
  milestoneFormArray: FormArray;
  chargeGroupFormArray: FormArray;
  chargesubmitted = false;
  milestonesubmitted = false;
  submitted = false;

  CustomerTypeValue = [
    { label: "Customer", value: "customer" },
    { label: "Organization", value: "organization" }
  ];
  celendarTypeData = [{ label: "English" }, { label: "Nepali" }];
  selectedCategory = "Silver";
  selectTitile = [
    { label: "Mr" },
    { label: "Ms" },
    { label: "Mrs" },
    { label: "Miss" },
    { label: "M/S" },
    { label: "Dear" }
  ];

  leadcustTypeList = [
    { label: "Prepaid", value: "Prepaid" },
    { label: "Postpaid", value: "Postpaid" }
  ];

  addressListData = [];
  createcustomerData: any = [];

  totalAmount: number = 0;
  adjustedAmount: number = 0;
  count: number = 0;

  searchLocationForm: FormGroup;
  currentPagesearchLocationList = 1;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: String;
  ifsearchLocationModal = false;
  searchLocationData: any;
  iflocationFill = false;

  chargeCategoryList = [];
  mainChargeList = [];

  selectedParentCust: any = [];
  selectedParentCustId: any;
  showParentCustomerModel = false;
  parentCustomerDialogType: any = "";
  billableCustList: any;
  customerSelectType: any;
  customerLedgerDetailData = [];
  days: any = [];
  isCustSubTypeCon: boolean = false;
  CustomertypeSubtype: any = [];

  isBranchAvailable = false;
  isBranchShiftLocation = false;
  isServiceInShiftLocation: boolean = false;
  pincodeDD = [];
  branchData = [];
  partnerListByServiceArea = [];
  staffList = [];
  serviceData = [];
  serviceAreaData: any = [];
  filterPlanData = [];
  planByServiceArea = [];
  serviceareaCheck = true;
  areaDetails: any = [];
  AreaListDD = [];
  selectPincodeList = false;

  statusOptions = RadiusConstants.status;

  billingCycle: any = [];
  dunningRules: any = [];
  Customertype: any = [];
  taxUpRange: any;
  planGroupForm: FormGroup;
  planMappingList: any = {};

  planProductMappingFromArray: FormArray;
  planProductfromgroup: FormGroup;
  planProductSubmitted: boolean = false;
  qtyErroMsg = "";
  showQtyError: boolean;
  productFlag: boolean = false;
  productTypeFlag: boolean = false;
  ownershipTypeFlag: boolean = false;
  productChargeFlag: boolean = false;
  revisedChargeFlag: boolean = false;
  currentPagePlanProductMapping = 1;
  planProductMappingTotalRecords: number;
  planProductMappingItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  productType = [
    { label: "New", value: "New" },
    { label: "Refurbished", value: "Refurbished" }
  ];
  ownershipType = [
    { label: "Sold", value: "Sold" },
    { label: "Organization Owned", value: "Organization Owned" }
  ];
  allActiveProduct: any = [];
  getProductDetailsById: any = [];
  chargeAmount: any;
  revicedAmount: any;
  productList: any = [];

  validityUnit = [{ label: "Hours" }, { label: "Days" }, { label: "Months" }, { label: "Years" }];
  date: Date = new Date();
  endDateVal: any;
  inputMobile: any;

  generatedLeadNo: any;
  countryCode: string;
  mvnoId: string;
  staffBUID: any;
  totalPriceData: any = [];
  taxDetails: any = [];
  taxAmount: number = 0;
  pricePerTax: any;
  countTotalOfferPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public commondropdownService: CommondropdownService,
    public serviceAreaService: ServiceAreaService,
    private productManagementService: ProuctManagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public customermanagementservice: CustomermanagementService,
    private DatePipe: DatePipe,
    private leadManagementService: LeadManagementService
  ) {}

  ngOnInit(): void {
    this.loggedInStaffId = localStorage.getItem("userId");
    this.partnerId = Number(localStorage.getItem("partnerId"));
    this.mvnoId = localStorage.getItem("mvnoId");
    this.date.setDate(this.date.getDate() + 5000);
    this.endDateVal = this.DatePipe.transform(this.date, "yyyy-MM-dd");
    this.customerGroupForm = this.fb.group({
      username: [""],
      password: [""],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      title: ["", Validators.required],
      pan: ["", [Validators.minLength(9), Validators.maxLength(9)]],
      gst: [""],
      aadhar: [""],
      passportNo: [""],
      tinNo: ["", [Validators.minLength(9), Validators.maxLength(9)]],
      contactperson: [""],
      failcount: ["0"],
      // acctno: ['', Validators.required],
      custtype: ["Prepaid"],
      custlabel: ["customer"],
      phone: [""],
      mobile: ["", [Validators.required, Validators.minLength(3)]],
      secondaryMobile: ["", Validators.minLength(3)],
      faxNumber: [""],
      dateOfBirth: [""],
      countryCode: [this.commondropdownService.commonCountryCode],
      dunningType: [""],
      dunningSubType: [""],
      dunningSector: [""],
      dunningSubSector: [""],
      cafno: [""],
      voicesrvtype: [""],
      didno: [""],
      calendarType: ["English", Validators.required],
      partnerid: [""],
      salesremark: [""],
      servicetype: [""],
      serviceareaid: ["", Validators.required],
      status: [""],
      leadStatus: [""],
      parentCustomerId: [""],
      invoiceType: [""],
      parentExperience: ["Actual"],
      latitude: [""],
      longitude: [""],
      // id:[],
      billTo: ["CUSTOMER"],
      billableCustomerId: [""],
      isInvoiceToOrg: [false],
      istrialplan: [false],
      popid: [""],
      staffId: [null],
      discount: ["", [Validators.max(99)]],
      flatAmount: [""],
      plangroupid: [""],
      discountType: [""],
      discountExpiryDate: [""],
      planMappingList: [],
      addressList: (this.addressListFromArray = this.fb.array([])),
      overChargeList: (this.chargeGroupFormArray = this.fb.array([])),
      custMacMapppingList: [],
      branch: [""],
      oltid: [null],
      masterdbid: [null],
      splitterid: [null],
      nasPort: [""],
      framedIp: [""],
      framedIpBind: [""],
      ipPoolNameBind: [""],
      valleyType: [""],
      customerArea: [""],
      // custDocList: this.uploadDocumentListFromArray = this.fb.array([ ]),
      paymentDetails: [null],
      isCustCaf: ["Yes"],
      dunningCategory: ["Silver"],
      billday: [""],
      leadNo: ["", Validators.required],
      leadSourceId: [null],
      leadCategory: ["New Lead", Validators.required],
      heardAboutSubisuFrom: ["", Validators.maxLength(600)],
      durationUnits: ["Days"],
      presentCheckForPayment: [false],
      presentCheckForPermanent: [false],
      isLeadQuickInv: [true],
      leadIdentity: ["project"]
    });
    if (this.custType === "Postpaid") {
      this.customerGroupForm.controls["billday"].setValidators(Validators.required);
      this.customerGroupForm.controls["billday"].updateValueAndValidity();
    }

    this.countryCode = this.commondropdownService.commonCountryCode;
    this.planGroupForm = this.fb.group({
      serviceId: ["", Validators.required],
      validity: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      unitsOfValidity: ["Days", Validators.required]
    });
    this.presentGroupForm = this.fb.group({
      addressType: ["Present", Validators.required],
      landmark: ["", Validators.required],
      areaId: ["", Validators.required],
      pincodeId: ["", Validators.required],
      cityId: ["", Validators.required],
      stateId: ["", Validators.required],
      countryId: ["", Validators.required],
      landmark1: [""]
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
      billingCycle: [1, Validators.required],
      taxamount: [""]
    });

    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });

    this.milestoneFormArray = this.fb.array([]);
    this.milestoneGroupForm = this.fb.group({
      milestoneName: ["", Validators.required],
      amount: ["", Validators.required],
      dueDate: ["", Validators.required],
      customerId: [null],
      id: [null],
      leadId: [null]
    });

    this.planProductfromgroup = this.fb.group({
      revisedCharge: [""],
      ownershipType: ["", Validators.required],
      productCategoryId: ["", Validators.required],
      productId: ["", Validators.required],
      product_type: ["", Validators.required],
      productQuantity: [1, [Validators.required, Validators.min(1)]],
      name: [""],
      id: [""]
    });

    this.planProductMappingFromArray = this.fb.array([]);
    this.chargeGroupFormArray = this.fb.array([]);
    // this.commondropdownService.getAllPinCodeNumber();
    this.commondropdownService.getAllPinCodeData();
    // this.commondropdownService.getALLArea();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getsystemconfigList();
    this.commondropdownService.getValleyTypee();
    this.commondropdownService.getInsideValley();
    this.commondropdownService.getOutsideValley();
    this.commondropdownService.getplanservice();
    this.commondropdownService.getTaxAllListAll();
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getCustomer();
    this.commondropdownService.getActiveProductCategoryList();
    this.commondropdownService.getAllActiveProduct();
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
      // this.commondropdownService.filterPartnerAll();
    } else {
      this.commondropdownService.getserviceAreaList();
      // this.commondropdownService.getpartnerAll();
    }
    this.daySequence();
    this.getChargeCategory();
    this.getChargeType();
    this.billingSequence();
    this.getsystemconfigListByName("DUNNING_CATEGORY");
    this.getCustomerType();
    // this.getAllProduct();
    this.customerFormReset();
    this.generateLeadNo();
  }
  daySequence() {
    for (let i = 0; i < 28; i++) {
      this.days.push({ label: i + 1 });
    }
  }

  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
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

  pageChangedCharge(pageNumber) {
    this.currentPageChargeData = pageNumber;
  }
  milestoneListFormGroup(): FormGroup {
    return this.fb.group({
      milestoneName: [this.milestoneGroupForm.value.milestoneName],
      amount: [Number(this.milestoneGroupForm.value.amount)],
      dueDate: [this.milestoneGroupForm.value.dueDate],
      customerId: [null],
      id: [null],
      leadId: [null]
    });
  }
  deleteConfirmonChargeField(attributeIndex, price) {
    let totalPrice = 0;
    this.chargeGroupFormArray.removeAt(attributeIndex);
    totalPrice = Number(this.countTotalOfferPrice) - Number(this.totalPriceData[attributeIndex]);
    this.countTotalOfferPrice = Number(totalPrice);
    this.totalPriceData.splice(attributeIndex, 1);

    // let productPrice = price ? Number(price) : 0;
    // this.countTotalOfferPrice = Number(this.countTotalOfferPrice) - productPrice;
  }
  deleteConfirmmilestone(attributeIndex: number, price) {
    this.milestoneFormArray.removeAt(attributeIndex);
    let productPrice = price ? Number(price) : 0;
    this.countTotalOfferPrice = Number(this.countTotalOfferPrice) - Number(productPrice);
  }
  onAddmilestoneList() {
    let orderN = 0;
    this.milestonesubmitted = true;
    if (this.milestoneGroupForm.valid) {
      let remPrice =
        Number(this.countTotalOfferPrice) -
        Number(this.adjustedAmount) -
        Number(this.milestoneGroupForm.value.amount);
      if (Number(remPrice) >= 0) {
        this.milestoneFormArray.push(this.milestoneListFormGroup());
        this.adjustedAmount =
          Number(this.adjustedAmount) + Number(this.milestoneGroupForm.value.amount);
        this.milestoneGroupForm.reset();
        this.milestonesubmitted = false;
        // setTimeout(() => {
        //   this.milestonesubmitted = false;
        //   orderN = Number(this.milestoneFormArray.value.length) + 1;
        //   this.milestoneGroupForm.controls.milestoneNumber.setValue(orderN);
        // }, 500);
      } else {
        if (this.milestoneFormArray.value.length == 0) {
          this.messageService.add({
            severity: "info",
            summary: "Required ",
            detail: "Please first add charge deatils",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Required ",
            detail: "Total Charge Amount greater than to Milestone Amounts",
            icon: "far fa-times-circle"
          });
        }
      }
    }
  }
  serviceName = "";
  timeStamp = new Date().toISOString();
  addPlanInCustomer() {
    this.submitted = true;
    let chargeData = [];
    let newChargeData = [];
    let chargeDataLength = this.chargeGroupFormArray.value.length;
    let postpaidPlanPojo: any = {};
    let totalActualPrice = 0;
    let serviceName = "";
    this.commondropdownService.planserviceData.filter(item => {
      if (item.id == this.planGroupForm.value.serviceId) {
        this.serviceName = item.name;
      }
    });

    if (
      this.customerGroupForm.valid &&
      this.presentGroupForm.valid &&
      this.planGroupForm.valid &&
      this.chargeGroupFormArray.controls.length > 0
    ) {
      chargeData = this.chargeGroupFormArray.value;
      chargeData.forEach((element, i) => {
        let n = i + 1;
        totalActualPrice = Number(totalActualPrice) + Number(element.actualprice);
        newChargeData.push({
          chargeprice: element.actualprice,
          billingCycle: element.billingCycle,
          charge: {
            actualprice: element.actualprice,
            chargecategory: element.chargecategory,
            chargetype: element.chargetype,
            desc: element.desc,
            ledgerId: element.ledgerId,
            name: element.name,
            royalty_payable: false,
            saccode: element.saccode,
            serviceNameList: element.serviceNameList,
            billingCycle: element.billingCycle,
            status: "Active",
            taxid: element.taxid,
            id: "",
            serviceid: [element.serviceId]
          }
        });
        if (n == chargeDataLength) {
          postpaidPlanPojo = {
            name: "ePlan" + this.timeStamp,
            displayName: "eDPlan" + this.timeStamp,
            code: "eplanCode" + this.timeStamp,
            saccode: null,
            plantype: this.customerGroupForm.value.custtype,
            category: "Normal",
            serviceId: this.planGroupForm.value.serviceId,
            serviceAreaIds: [this.customerGroupForm.value.serviceareaid],
            planGroup: "Registration and Renewal",
            qospolicyid: "",
            timebasepolicyId: "",
            startDate: this.DatePipe.transform(new Date(), "yyyy-MM-dd"),
            endDate: this.endDateVal,
            validity: this.planGroupForm.value.validity,
            unitsOfValidity: this.planGroupForm.value.unitsOfValidity,
            param1: null,
            param2: null,
            param3: null,
            accessibility: "Both",
            quotaUnit: "GB",
            allowdiscount: "false",
            quotatype: "Data",
            allowOverUsage: "false",
            maxconcurrentsession: "1",
            status: "INACTIVE",
            quotaunittime: null,
            quotatime: null,
            quota: 1,
            quotaResetInterval: "Total",
            desc: "eplandesc" + this.timeStamp,
            mode: "NORMAL",
            requiredApproval: true,
            offerprice: totalActualPrice,
            newOfferPrice: totalActualPrice,
            invoiceToOrg: false,
            product_category: null,
            product_type: null,
            ProductsType: null,
            planCasMappingList: [],
            planQosMappingEntityList: [],
            productplanmappingList: this.planProductMappingFromArray.value,
            chargeList: newChargeData
          };
        }
      });

      if (postpaidPlanPojo.plantype) {
        const urlPlan = "/postpaidplan";
        this.customerManagementService.postMethod(urlPlan, postpaidPlanPojo).subscribe(
          (response: any) => {
            this.planMappingList = response.postpaidplan;
            // this.planMappingList = [
            //   {
            //     planId: response.postpaidplan.id,
            //     service: serviceName,
            //     validity: response.postpaidplan.validity,
            //     discount: 0,
            //     billTo: "CUSTOMER",
            //     billableCustomerId: this.customerGroupForm.value.billableCustomerId,
            //     offerPrice: response.postpaidplan.offerPrice,
            //     newAmount: response.postpaidplan.newAmount,
            //     isInvoiceToOrg: false,
            //     istrialplan: false,
            //     serviceId: this.planGroupForm.value.serviceId,
            //     discountType: "One-time",
            //     discountExpiryDate: null,
            //   },
            // ];
            setTimeout(() => {
              this.addcustomer();
              this.openStaffDetailModal(this.loggedInStaffId);
            }, 500);
          },
          error => {
            if (error.error.status === 406) {
              this.addcustomer();
              this.openStaffDetailModal(this.loggedInStaffId);
            }
          }
        );
      }
    } else {
      if (this.customerGroupForm.valid && this.presentGroupForm.valid) {
        this.messageService.add({
          severity: "error",
          summary: "Required ",
          detail: "Fields are Mandatory or Invalid. Please fill or update those field.",
          icon: "far fa-times-circle"
        });
      } else if (this.chargeGroupFormArray.controls.length > 0) {
        this.messageService.add({
          severity: "error",
          summary: "Required ",
          detail: "Minimum one chatge Details need to add",
          icon: "far fa-times-circle"
        });
      } else if (this.milestoneFormArray.controls.length > 0) {
        this.messageService.add({
          severity: "error",
          summary: "Required ",
          detail: "Minimum one Milestone Details need to add",
          icon: "far fa-times-circle"
        });
      }
      this.scrollToError();
    }
  }

  openStaffDetailModal(staffId) {
    let data = [];
    const url = "/staffuser/" + staffId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        data = response.Staff;
        if (data.length > 0) {
          this.staffBUID = data[0].businessunitids[0];
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

  addcustomer() {
    let i = 0;
    let checkRemainingamount = this.countTotalOfferPrice - this.adjustedAmount;
    let millstoneData = [];
    let millstoneLength = this.milestoneFormArray.value.length;
    millstoneData = this.milestoneFormArray.value;

    if (checkRemainingamount == 0) {
      this.customerGroupForm.value.isLeadQuickInv = true;
      this.addressListData.push(this.presentGroupForm.value);
      // this.addressListData[0].version = "NEW";
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

      this.createcustomerData.addressList = this.addressListData;
      this.createcustomerData.custMacMapppingList = [];
      this.createcustomerData.planMappingList = [];

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

      this.createcustomerData.leadIdentity = "project";
      this.createcustomerData.isLeadQuickInv = true;
      this.createcustomerData.isCustCaf = "yes";
      this.createcustomerData.createdBy = Number(this.loggedInStaffId);
      this.createcustomerData.buId = Number(this.staffBUID);
      this.createcustomerData.mvnoId = Number(this.mvnoId);
      this.createcustomerData.id = null;
      this.createcustomerData.overChargeList = [];
      const url = "/leadMaster/save";

      this.leadManagementService
        .postMethod(url, this.createcustomerData, this.mvnoId, this.loggedInStaffId)
        .subscribe(
          (response: any) => {
            millstoneData.forEach(element => {
              element.leadId = response.leadMaster.id;
            });

            setTimeout(() => {
              this.addService(response.leadMaster);
              let data = {
                leadMasterPojo: response.leadMaster,
                custMileStoneDetailsList: millstoneData
              };
              let url2 = "/milestone/quickInvoiceCreationWithMilestones";
              this.leadManagementService
                .postMethod(url2, data, this.mvnoId, this.loggedInStaffId)
                .subscribe((response: any) => {
                  this.customerGroupForm.controls.parentExperience.disable();
                  this.customerFormReset();
                  this.submitted = false;
                  this.messageService.add({
                    severity: "success",
                    summary: "Successfully",
                    detail: "Add Successfully",
                    icon: "far fa-check-circle"
                  });

                  this.addressListData = [];
                });
            }, 1000);
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
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Remaining Payment is not zero",
        icon: "far fa-times-circle"
      });
    }
  }

  addService(leadData) {
    let data: any = [];
    data = {
      id: leadData.id,
      failcount: 0,
      custtype: leadData.custtype,
      countryCode: leadData.countryCode,
      cafno: leadData.cafno,
      calendarType: leadData.calendarType,
      partnerid: leadData.partnerid,
      serviceareaid: leadData.serviceareaid,
      status: "New Activation",
      billableCustomerId: leadData.billableCustomerId,
      planMappingList: [
        {
          planId: this.planMappingList.id,
          service: this.serviceName,
          discount: 0,
          billTo: "CUSTOMER",
          billableCustomerId: this.customerGroupForm.value.billableCustomerId,
          offerprice: this.planMappingList.offerPrice,
          newAmount: this.planMappingList.newAmount,
          isInvoiceToOrg: false,
          istrialplan: false,
          validity: this.planMappingList.validity,
          validityUnit: this.planMappingList.unitsOfValidity,
          planName: this.planMappingList.name,
          linkAcceptanceDTO: {
            circuitName: this.serviceName,
            cafNumber: "",
            customerName: "",
            typeOfLink: " ",
            connectionType: "",
            circuitStatus: "Inactive",
            uploadCaf: "",
            acctNumber: "",
            serviceType: this.serviceName,
            circleName: "",
            partner: "1",
            serviceAreaType: "",
            location: "",
            distance: "",
            linkRouterLocation: "",
            linkRouterIp: "",
            vlanId: "",
            linkRouterName: "",
            linkPortType: "",
            linkPortOnRouter: "",
            circuitBillingId: "",
            pop: "",
            organisation: null,
            associatedLevel: "",
            locationLevel1: "",
            locationLevel2: "",
            locationLevel3: "",
            locationLevel4: "",
            baseStationId1: "",
            baseStationId2: "",
            originationCircle: "",
            terminationCircle: "",
            originationAddress: "",
            terminationAddress: "",
            originationAddress2: "",
            terminationAddress2: "",
            note: "",
            contactPerson: "",
            contactPerson1: "",
            mobileNo: leadData.mobile,
            countryCode: leadData.countryCode,
            mobileNo1: "",
            landlineNo: "",
            landlineNo1: "",
            email: leadData.email,
            email1: "",
            remark: "",
            valleyType: "",
            insideValley: "",
            serviceName: this.serviceName,
            startDate: this.DatePipe.transform(new Date(), "yyyy-MM-dd"),
            endDate: this.endDateVal,
            status: "INACTIVE"
          },
          postpaidPlanPojo: this.planMappingList
        }
      ],
      addressList: leadData.addressList,
      paymentDetails: leadData.paymentDetails,
      dunningCategory: leadData.dunningCategory,
      service: this.serviceName
    };
    let url = "/AdoptSalesCrmsBss/leadMaster/addNewService";
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceName = "";
      this.planMappingList = [];
    });
  }
  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  scrollToError(): void {
    const firstElementWithError = document.querySelector(".ng-invalid[formControlName]");
    this.scrollTo(firstElementWithError);
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
  openSearchModel() {
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
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

  pageChangedSearchLocationList(currentPage) {
    this.currentPagesearchLocationList = currentPage;
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
        $("#searchLocationModal").modal("hide");
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

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
    this.searchLocationForm.reset();
  }

  customerFormReset() {
    this.countTotalOfferPrice = 0;
    this.adjustedAmount = 0;
    this.addressListData = [];
    this.commondropdownService.getsystemconfigList();
    this.customerGroupForm.reset();
    this.presentGroupForm.reset();
    this.chargeGroupForm.reset();
    this.planGroupForm.reset();
    this.milestoneGroupForm.reset();
    this.planProductfromgroup.reset();
    this.planGroupForm.reset();
    this.milestoneFormArray = this.fb.array([]);
    this.chargeGroupFormArray = this.fb.array([]);
    this.planProductMappingFromArray = this.fb.array([]);
    this.customerGroupForm.controls.pan.setValue("");
    this.customerGroupForm.controls.gst.setValue("");
    this.customerGroupForm.controls.failcount.setValue("");
    this.customerGroupForm.controls.aadhar.setValue("");
    this.customerGroupForm.controls.passportNo.setValue("");
    this.customerGroupForm.controls.voicesrvtype.setValue("");
    this.customerGroupForm.controls.didno.setValue("");
    this.customerGroupForm.controls.salesremark.setValue("");
    this.customerGroupForm.controls.servicetype.setValue("");
    this.customerGroupForm.controls.partnerid.setValue(this.partnerId !== 1 ? this.partnerId : "");
    this.customerGroupForm.controls.billday.setValue("");
    this.customerGroupForm.controls.phone.setValue("");
    this.customerGroupForm.controls.mobile.setValue("");
    this.presentGroupForm.controls.areaId.setValue("");
    this.presentGroupForm.controls.pincodeId.setValue("");
    this.presentGroupForm.controls.cityId.setValue("");
    this.presentGroupForm.controls.stateId.setValue("");
    this.presentGroupForm.controls.countryId.setValue("");
    this.customerGroupForm.controls.billday.disable();
    this.chargeGroupForm.controls.billingCycle.disable();
    this.customerGroupForm.controls.status.setValue("");
    this.customerGroupForm.controls.serviceareaid.setValue("");
    this.customerGroupForm.controls.title.setValue("");
    this.customerGroupForm.controls.billTo.setValue("CUSTOMER");
    this.customerGroupForm.controls.parentExperience.setValue("Actual");
    this.customerGroupForm.controls.custtype.setValue("Prepaid");
    this.customerGroupForm.controls.custlabel.setValue("customer");
    this.customerGroupForm.controls.calendarType.setValue("English");
    this.customerGroupForm.controls.isInvoiceToOrg.setValue(false);
    this.customerGroupForm.controls.istrialplan.setValue(false);
    this.customerGroupForm.controls.presentCheckForPayment.setValue(false);
    this.customerGroupForm.controls.presentCheckForPermanent.setValue(false);
    this.customerGroupForm.controls.isCustCaf.setValue("yes");
    this.customerGroupForm.controls.durationUnits.setValue("Days");
    this.customerGroupForm.controls.leadCategory.setValue("New Lead");
    this.customerGroupForm.controls.isLeadQuickInv.setValue(true);
    this.planGroupForm.controls.unitsOfValidity.setValue("Days");
    this.customerGroupForm.controls.leadIdentity.setValue("project");

    this.customerGroupForm.controls.countryCode.setValue(
      this.commondropdownService.commonCountryCode
    );

    this.generateLeadNo();
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
      this.customerGroupForm.patchValue({
        billableCustomerId: this.selectedParentCust.id
      });
    }
  }

  modalOpenParentCustomer(type) {
    this.parentCustomerDialogType = type;
    this.showParentCustomerModel = true;
    this.customerSelectType = "Billable To";
    this.selectedParentCust = [];
  }

  removeSelParentCust(type) {
    this.selectedParentCust = [];
    if (type === "billable") {
      this.billableCustList = [];
      this.customerGroupForm.patchValue({
        billableCustomerId: null
      });
    } else {
      this.customerGroupForm.patchValue({
        parentCustomerId: ""
      });
    }
  }
  closeParentCust() {
    this.showParentCustomerModel = false;
  }
  getcustType(event) {
    let value = event.value;
    this.customerGroupForm.controls.dunningSubType.enable();
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
      this.CustomertypeSubtype = response.dataList;
    });
  }

  selServiceArea(event) {
    this.pincodeDD = [];
    const serviceAreaId = event.value;
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
      this.getPartnerAllByServiceArea(serviceAreaId);
      this.getServiceByServiceAreaID(serviceAreaId);
      this.getBranchByServiceAreaID(serviceAreaId);
      this.getStaffUserByServiceArea(serviceAreaId);
      this.branchByServiceAreaID(serviceAreaId);
    }
  }
  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.filterPlanData = [];
      const custType = this.custType;
      const url =
        "/plans/serviceArea?planmode=ALL&serviceAreaId=" +
        serviceAreaId +
        "&mvnoId=" +
        localStorage.getItem("mvnoId");
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
  getServiceByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url =
      "/serviceArea/getAllServicesByServiceAreaId" +
      "?mvnoId=" +
      Number(localStorage.getItem("mvnoId"));
    this.adoptCommonBaseService.postMethod(url, data).subscribe((response: any) => {
      this.serviceData = response.dataList;
    });
  }
  getStaffUserByServiceArea(ids) {
    let data = [];
    data.push(ids);
    let url = "/staffsByServiceAreaId/" + ids;
    this.serviceAreaService.getMethod(url).subscribe((response: any) => {
      this.staffList = response.dataList;
    });
  }
  staffDataList: any = [];
  requestedByList: any = [];
  serviceAreaId: any;
  data: any = [];
  getStaffDetailById(serviceAreaId) {
    const url = "/getstaffuserbyserviceareaid/" + serviceAreaId;
    this.serviceAreaService.getMethod(url).subscribe((response: any) => {
      this.staffDataList = response.dataList;

      this.staffDataList.forEach((element, i) => {
        element.displayLabel = element.fullName + " (Ph: " + element.phone + ")";
        this.data.push(element.id);
      });
    });
  }
  getBranchByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url =
      "/branchManagement/getAllBranchesByServiceAreaId?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      if (this.branchData != null && this.branchData.length > 0) {
        this.isBranchAvailable = true;
        this.customerGroupForm.controls.branch.setValidators(Validators.required);
        this.customerGroupForm.controls.partnerid.clearValidators();
        this.customerGroupForm.updateValueAndValidity();
      } else {
        this.isBranchAvailable = false;
        this.isServiceInShiftLocation = false;
        this.customerGroupForm.controls.partnerid.setValidators(Validators.required);
        this.customerGroupForm.controls.branch.clearValidators();
        this.customerGroupForm.controls.branch.updateValueAndValidity();
        this.customerGroupForm.updateValueAndValidity();
      }
    });
  }
  branchByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url =
      "/branchManagement/getAllBranchesByServiceAreaId?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      if (this.branchData != null && this.branchData.length > 0) {
        this.isBranchShiftLocation = true;
      } else {
        this.isBranchShiftLocation = false;
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
  selectPINCODEChange(_event: any, index: any) {
    const url = "/area/pincode?pincodeId=" + _event.value;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.AreaListDD = response.areaList;
      },
      (error: any) => {}
    );
  }
  selectAreaChange(_event: any, index: any) {
    this.getAreaData(_event.value, index);
  }
  getAreaData(id: any, index: any) {
    const url = "/area/" + id;

    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
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
    });
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

  chargeType: any = [];
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

  getsystemconfigListByName(keyName: string) {
    const url = "/system/configurationListByKey?keyName=" + keyName;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.dunningRules = response.dataList;
      },
      (error: any) => {}
    );
  }

  getCustomerType() {
    const url = "/commonList/Customer_Type";
    const custerlist = {};
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.Customertype = response.dataList;

        if (this.customerGroupForm.value.subType) {
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

  custTypeEvent(value) {
    if (value === "Postpaid") {
      this.customerGroupForm.controls.billday.enable();
      this.chargeGroupForm.controls.billingCycle.enable();
      this.customerGroupForm.controls["billday"].setValidators(Validators.required);
      this.customerGroupForm.controls["billday"].updateValueAndValidity();
      this.chargeGroupForm.controls["billingCycle"].setValidators(Validators.required);
      this.chargeGroupForm.controls["billingCycle"].updateValueAndValidity();
    } else {
      this.customerGroupForm.controls.billday.disable();
      this.chargeGroupForm.controls.billingCycle.disable();
      this.customerGroupForm.controls["billday"].clearValidators;
      this.customerGroupForm.controls["billday"].updateValueAndValidity();
      this.chargeGroupForm.controls["billingCycle"].clearValidators;
      this.chargeGroupForm.controls["billingCycle"].updateValueAndValidity();
    }
  }

  createPlanProductFormGroup(): FormGroup {
    return this.fb.group({
      revisedCharge: [this.planProductfromgroup.value.revisedCharge],
      ownershipType: [this.planProductfromgroup.value.ownershipType, Validators.required],
      productCategoryId: [this.planProductfromgroup.value.productCategoryId, Validators.required],
      productId: [this.planProductfromgroup.value.productId],
      product_type: [this.planProductfromgroup.value.product_type, Validators.required],
      productQuantity: [
        this.planProductfromgroup.value.productQuantity,
        [Validators.required, Validators.min(1)]
      ],
      id: [this.planProductfromgroup.value.id],
      name: [null]
    });
  }

  onAddProductField() {
    this.planProductSubmitted = true;
    this.showQtyError = false;
    if (this.planProductfromgroup.valid) {
      if (
        this.planProductfromgroup.controls.revisedCharge.value == null &&
        this.planProductfromgroup.controls.ownershipType.value == "Sold"
      ) {
        this.showQtyError = true;
        this.qtyErroMsg = "Do not add product with charge null and ownership type is Sold..";
      } else {
        if (this.planProductfromgroup.value.revisedCharge > 0) {
          this.countTotalOfferPrice =
            Number(this.countTotalOfferPrice) +
            Number(this.planProductfromgroup.value.revisedCharge);
        }
        this.showQtyError = false;
        this.planProductMappingFromArray.push(this.createPlanProductFormGroup());
        this.planProductfromgroup.reset();
        this.planProductfromgroup.controls.productQuantity.setValue(1);
        this.planProductSubmitted = false;
        this.productFlag = false;
        this.productTypeFlag = false;
        this.ownershipTypeFlag = false;
        this.revisedChargeFlag = false;
        this.productChargeFlag = false;
      }
    }
  }

  pageChangePlanProductData(number) {
    this.currentPagePlanProductMapping = number;
  }

  async onRemovePlanProductMap(productFieldIndex: number, price: any) {
    this.planProductMappingFromArray.removeAt(productFieldIndex);
    let productPrice = price ? Number(price.value) : 0;
    this.countTotalOfferPrice = Number(this.countTotalOfferPrice) - Number(productPrice);
  }

  deleteConfirmonPlanProductField(productFieldIndex: number, price: number) {
    if (productFieldIndex || productFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Product?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemovePlanProductMap(productFieldIndex, price);
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

  getAllProduct() {
    const url = "/product/getAllActiveProduct";
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.allActiveProduct = response.dataList;
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

  getProductbyCategory(event) {
    let prodCateId = event.value;
    this.getProductDetailsById = [];
    this.productChargeFlag = false;
    this.showQtyError = false;
    this.planProductfromgroup.get("productId").reset();
    const url = "/product/getAllProductsByProductCategoryId?pc_id=" + prodCateId;
    this.productManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.productList = response.dataList;
        this.productFlag = true;
        this.productTypeFlag = true;
        this.ownershipTypeFlag = false;
        this.revisedChargeFlag = false;
        this.productChargeFlag = false;
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

  getProductDetails(event) {
    this.ownershipTypeFlag = false;
    this.revisedChargeFlag = false;
    this.productChargeFlag = false;
    this.showQtyError = false;
    this.planProductfromgroup.get("product_type").reset();
    this.getProductDetailsById = this.productList.filter(element => element.id == event.value);
  }

  getChargeAmount(event) {
    this.ownershipTypeFlag = true;
    this.revisedChargeFlag = true;
    this.productChargeFlag = true;
    this.showQtyError = false;
    this.planProductfromgroup.get("ownershipType").reset();
    if (this.getProductDetailsById.length != 0) {
      if (event.value == "New") {
        this.chargeAmount = this.getProductDetailsById.find(element => element).newProductAmount;
        this.revicedAmount = this.chargeAmount;
        if (this.chargeAmount != null) {
          this.planProductfromgroup.controls.revisedCharge.enable();
        } else {
          this.planProductfromgroup.controls.revisedCharge.disable();
        }
      }
      if (event.value == "Refurbished") {
        this.chargeAmount = this.getProductDetailsById.find(
          element => element
        ).refurburshiedProductAmount;
        this.revicedAmount = this.chargeAmount;
        if (this.chargeAmount != null) {
          this.planProductfromgroup.controls.revisedCharge.enable();
        } else {
          this.planProductfromgroup.controls.revisedCharge.disable();
        }
      }
    } else {
      this.chargeAmount = null;
      this.revicedAmount = null;
      this.planProductfromgroup.controls.revisedCharge.disable();
    }
  }

  checkOwnership(e) {
    this.showQtyError = false;
    if (e.value == "Organization Owned") {
      this.planProductfromgroup.controls.revisedCharge.disable();
      this.revicedAmount = null;
    } else {
      if (this.chargeAmount != null) {
        this.planProductfromgroup.controls.revisedCharge.enable();
        this.revicedAmount = this.chargeAmount;
      } else {
        this.planProductfromgroup.controls.revisedCharge.disable();
      }
    }
  }

  revicedChargeValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }

  onKeymobilelength(event) {
    const str = this.customerGroupForm.value.mobile.toLocaleString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobile = `${mobilenumberlength} character required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobile = "";
    } else {
      this.inputMobile = `${mobilenumberlength} character required.`;
    }
  }

  generateLeadNo() {
    const url = "/leadMaster/generateLeadNo?mvnoId=" + localStorage.getItem("mvnoId");

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.generatedLeadNo = await response.leadNo;

        this.generatedLeadNo
          ? this.customerGroupForm.controls["leadNo"].setValue(this.generatedLeadNo)
          : "";
      },
      async (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong with 'Lead No.' Generation",
          icon: "far fa-times-circle"
        });
      }
    );
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
}
