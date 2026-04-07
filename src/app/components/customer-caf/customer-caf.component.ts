import { formatDate, DatePipe } from "@angular/common";
import { CustomerService } from "src/app/service/customer.service";
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { CustomerManagements } from "src/app/components/model/customer";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as uuid from "uuid";
import {
  AREA,
  CITY,
  COUNTRY,
  PINCODE,
  STATE,
  CUSTOMER_PREPAID,
  CUSTOMER_POSTPAID
} from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { LoginService } from "src/app/service/login.service";
import { StaffService } from "src/app/service/staff.service";
import { CustomerDocumentService } from "../customer-documents/customer-document.service";
import { Regex } from "src/app/constants/regex";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { OutwardService } from "src/app/service/outward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { BehaviorSubject, Observable, Observer, Subscription, interval } from "rxjs";
import { countries } from "src/app/components/model/country";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { InvoiceDetalisModelComponent } from "../invoice-detalis-model/invoice-detalis-model.component";
import { InvoicePaymentDetailsModalComponent } from "../invoice-payment-details-modal/invoice-payment-details-modal.component";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { PaymentAmountModelComponent } from "src/app/components/payment-amount-model/payment-amount-model.component";
import { ExternalItemManagementService } from "src/app/service/external-item-management.service";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { CustomerplanGroupDetailsModalComponent } from "src/app/components/customerplan-group-details-modal/customerplan-group-details-modal.component";
import { CustomerWithdrawalmodalComponent } from "src/app/components/customer-withdrawalmodal/customer-withdrawalmodal.component";
import { InwardService } from "src/app/service/inward.service";
import * as FileSaver from "file-saver";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { CustomerInventoryDetailsService } from "src/app/service/customer-inventory-details.service";
import { CustomerInventoryManagementService } from "src/app/service/customer-inventory-management.service";
import { RejectedReasonService } from "src/app/service/rejected-reason.service";
import { LeadManagementService } from "src/app/service/lead-management-service";
import { PrepaidRejectedReasonService } from "src/app/service/prepaid-rejected-reason.service";
import { isEqual } from "lodash";
import { ActivatedRoute, Router } from "@angular/router";
import { Utils } from "src/app/utils/utils";
import * as moment from "moment";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { QuotaDetailsModalComponent } from "src/app/components/quota-details-modal/quota-details-modal.component";
import { CountryManagementService } from "src/app/service/country-management.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { PartnerService } from "src/app/service/partner.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { LocationService } from "src/app/service/location.service";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
import { CustNotes } from "../model/CustNotes";
import { PincodeManagementService } from "src/app/service/pincode-management.service";
import { AreaManagementService } from "src/app/service/area-management.service";
import { BuildingManagementService } from "src/app/service/building-management.service";
import { TicketManagementService } from "src/app/service/ticket-management.service";

declare var $: any;

@Component({
  selector: "app-customer-caf",
  templateUrl: "./customer-caf.component.html",
  styleUrls: ["./customer-caf.component.css"]
})
export class CustomerCafComponent implements OnInit {
  @Output() closeNearLocationModal = new EventEmitter();
  customerVrn = RadiusConstants.CUSTOMER_VRN;
  customerNid = RadiusConstants.CUSTOMER_NID;
  custData: any = {};
  customerId: number;
  custType: string = "";
  editmode: boolean = false;
  displaymode: boolean = true;
  ipdisplayManagementGroup: FormGroup;
  ipManagementGroup: FormGroup;
  macManagementGroup: FormGroup;
  ipMapppingListFromArray: FormArray;
  ipMapppingdisplayListFromArray: FormArray;
  macMapppingListFromArray: FormArray;
  notificationusername: string;
  ipData: any = [""];
  custId: any = [""];
  customerid: number;
  service: any[] = [];
  custPlanMapppingId: any = [""];
  ipListData: any = [];
  createIp: boolean = false;
  createMac: boolean = false;
  macSubmitted: boolean = false;
  displayInvoicePaymentDialog: boolean;
  savedConfig: any;
  invoice: any;
  exitBuy: boolean = true;
  paymentstatusCount = RadiusConstants.TIMER_COUNT;
  paymentConfirmationModal: boolean = false;
  subscription2: Subscription;
  obs1$ = interval(1000);
  transactionStatus: boolean = false;
  paymentSucessModel: boolean = false;
  presentAdressDATA: any = [];
  isPaymentGatewayConfigured: boolean = false;
  paymentGateway: any;
  paymentkeyValuePairs: { [key: string]: any } = {};
  changeStatus: string;
  editingRecord: any = {};
  currentEditRecord: any;
  editingIndex: number | null = null;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  cutomerId;
  areaTitle = AREA;
  department = RadiusConstants.DEPARMENT;
  @ViewChild("closebutton") closebutton;
  @ViewChild(InvoiceDetalisModelComponent)
  InvoiceDetailModal: InvoiceDetalisModelComponent;
  @ViewChild(InvoicePaymentDetailsModalComponent)
  invoicePaymentDetailModal: InvoicePaymentDetailsModalComponent;
  @ViewChild(PaymentAmountModelComponent)
  PaymentDetailModal: PaymentAmountModelComponent;
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;
  @ViewChild(CustomerplanGroupDetailsModalComponent)
  custPlanGroupDataModal: CustomerplanGroupDetailsModalComponent;
  //   @ViewChild(CustomerWithdrawalmodalComponent)
  withdrawalAmountModal: CustomerWithdrawalmodalComponent;
  @ViewChild(QuotaDetailsModalComponent)
  quotaModalOpen: QuotaDetailsModalComponent;
  bankDataList: any;
  custLedgerForm: FormGroup;
  fields: any;
  countries: any = countries;
  customerGroupForm: FormGroup;
  assignCustomerCAFForm: FormGroup;
  rejectCustomerCAFForm: FormGroup;
  customerCategoryList: any;
  submitted = false;
  assignCustomerCAFsubmitted: boolean = false;
  displayInvoiceDetails: boolean = false;
  rejectCustomerCAFsubmitted: boolean = false;
  ifModelIsShow: boolean = false;
  assignCustomerCAFId: any;
  nextApproverId: any;
  taxListData: any;
  rejectApproveDiscountModal = false;
  createcustomerData: CustomerManagements;
  displayFailedPaymentDialog = false;
  currentPagecustomerListdata = 1;
  customerListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  customerListdatatotalRecords: any;
  customerListData: any = [];
  viewcustomerListData: any = [];
  earlydays = [];
  iscustomerEdit = false;
  customertype = "";
  CustomerSector = "";
  custDetilsCustId;
  customercategory = "";
  searchcustomerUrl: any;
  chargeCategoryList: any;
  isPlanEdit = false;
  viewPlanListData: any;
  payMappingListFromArray: FormArray;
  addressListFromArray: FormArray;
  paymentDetailsFromArray: FormArray;
  overChargeListFromArray: FormArray;
  custMacMapppingListFromArray: FormArray;
  selectvalue = "";
  displayDialogWithDraw: boolean = false;
  planByServiceArea: any;
  paymappingItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  payMappinftotalRecords: String;
  currentPagePayMapping = 1;
  overChargeListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  overChargeListtotalRecords: String;
  currentPageoverChargeList = 1;
  custMacMapppingListtemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custMacMapppingListtotalRecords: String;
  currentPagecustMacMapppingList = 1;
  custChargeDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custChargeDeatiltotalRecords: String;
  currentPagecustChargeDeatilList = 1;
  custPlanDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custPlanDeatiltotalRecords: String;
  currentPagecustPlanDeatilList = 1;
  custMacAddItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custMacAddtotalRecords: String;
  currentPagecustMacAddList = 1;
  custLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custLedgertotalRecords: String;
  currentPagecustLedgerList = 1;
  customerPaymentdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerPaymentdatatotalRecords: String;
  currentPagecustomerPaymentdata = 1;
  customerFuturePlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerFuturePlanListdatatotalRecords: String;
  currentPagecustomerFuturePlanListdata = 1;
  customerExpiryPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerExpiryPlanListdatatotalRecords: String;
  currentPagecustomerExpiryPlanListdata = 1;
  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCurrentPlanListdatatotalRecords: String;
  currentPagecustomerCurrentPlanListdata = 1;
  cafRemainTimeSubscription: any;
  temp = [];

  customerListData1: any;
  customerListDataselector: any;
  totalAddress = 0;
  macAddresscountNumber = 0;
  searchCustomerName: any;
  searchCustomerType: any = "";
  searchData: any;
  customersListData: any;
  searchOption = "";
  searchDeatil = "";
  // fieldEnable = false;
  addresslength = 0;
  payMappinglength = 0;
  charegelength = 0;
  charge_date: NgbDateStruct | any;
  presentaddress = "";
  require: any;
  ngbBirthcal: NgbDateStruct | any;
  listView = true;
  createView = false;
  areaDetails: any;
  pincodeDeatils: any;
  areaAvailableList: any;
  selectAreaList = false;
  selectPincodeList = false;
  addressListData: any = [];
  macListData: any = [];
  PyamentpincodeDeatils: any;
  permanentpincodeDeatils: any;
  paymentareaDetails: any;
  permanentareaDetails: any;
  paymentareaAvailableList: any;
  permanentareaAvailableList: any;
  planGroupForm: FormGroup;
  chargeGroupForm: FormGroup;
  shiftLocationChargeGroupForm: FormGroup;
  macGroupForm: FormGroup;
  plansubmitted = false;
  chargesubmitted = false;
  presentGroupForm: FormGroup;
  paymentGroupForm: FormGroup;
  permanentGroupForm: FormGroup;
  validPattern = "^[0-9]{3}$";
  selectAreaListPermanent = false;
  selectAreaListPayment = false;
  selectPincodeListPermanent = false;
  selectPincodeListPayment = false;
  ischecked = false;
  macsubmitted = false;
  chargeList: any;
  selectchargeList = false;
  planData: any = [];
  filterPlanData: any = [];
  listSearchView = false;
  isCustomerDetailOpen = false;
  dialog: boolean = false;
  ifcustCaf: boolean = true;
  customerDetailData: any = {
    title: "",
    firstname: "",
    lastname: "",
    contactperson: "",
    gst: "",
    pan: "",
    aadhar: "",
    passportNo: "",
    cafno: "",
    acctno: "",
    username: "",
    mobile: "",
    phone: "",
    email: "",
    serviceareaid: "",
    servicetype: "",
    custtype: "",
    latitude: "",
    longitude: "",
    didno: "",
    voicesrvtype: "",
    partnerid: "",
    salesremark: "",
    paymentDetails: {
      amount: "",
      referenceno: "",
      paymode: "",
      paymentdate: ""
    },
    addressList: [
      {
        fullAddress: "",
        pincodeId: "",
        areaId: "",
        cityId: "",
        stateId: "",
        countryId: ""
      }
    ]
  };
  paymentAddressData: any = [
    {
      fullAddress: "",
      pincodeId: "",
      areaId: "",
      cityId: "",
      stateId: "",
      countryId: "",
      landmark: ""
    }
  ];
  permanentAddressData: any = [
    {
      fullAddress: "",
      pincodeId: "",
      areaId: "",
      cityId: "",
      stateId: "",
      countryId: "",
      landmark: ""
    }
  ];
  custCurrentPlanList: any;
  obs$ = interval(1000);
  custFuturePlanList: any;
  custExpiredPlanList: any;
  partnerDATA: any = [];
  permentAdressDATA: any = [];
  paymentAdressDATA: any = [];
  chargeDATA = [];
  dataPlan = [];
  planserviceData: any;
  serviceAreaDATA: any;
  paymentDataamount: any;
  paymentDatareferenceno: any;
  paymentDatapaymentdate: any;
  paymentDatapaymentMode: any;
  customerApporevedData: any;
  customerRejectedData: any;
  plantypaSelectData: any;
  viewChargeData: any;
  selectchargeValueShow = false;
  currentDate = new Date();
  loggedInUser: any;
  staffUserId: any = [];
  userName: "";
  UserServiceName: "";
  userServiAreaId: any;
  AclClassConstants;
  AclConstants;
  serviceAreaData: any;
  public loginService: LoginService;
  postdata: any = {
    CREATE_DATE: "",
    END_DATE: "",
    id: "",
    amount: "",
    balAmount: "",
    custId: "",
    description: "",
    refNo: "",
    transcategory: "",
    transtype: ""
  };
  customerLedgerData: any = {
    custname: "",
    plan: "",
    status: "",
    username: "",
    customerLedgerInfoPojo: {
      openingAmount: "",
      closingBalance: ""
    }
  };
  searchLocationForm: FormGroup;
  currentPagesearchLocationList = 1;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: String;
  currentPagenearDeviceLocationList = 1;
  nearDeviceLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  nearDeviceLocationtotalRecords: String;
  searchLocationData: any;
  nearDeviceLocationData: any;
  ifsearchLocationModal = false;
  ifNearLocationModal = false;
  iflocationFill = false;
  customerLedgerListData: any;
  isCustomerLedgerOpen = false;
  viewcustomerPaymentData: any;
  customerIdINLocationDevice: string;
  NetworkDeviceData: any;
  customerStatusDetail: any;
  customertotalRecords = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  searchkey: string;
  customerListDatalength = 0;
  custLedgerSubmitted = false;
  customerLedgerSearchKey: string;
  legershowItemPerPage = 1;
  CurrentPlanShowItemPerPage = 1;
  futurePlanShowItemPerPage = 1;
  expiredShowItemPerPage = 1;
  ticketShowItemPerPage = 1;
  paymentShowItemPerPage = 1;
  isInvoiceDetail = false;
  assignInventory: boolean;
  assignExternalInventory: boolean;
  customerrMyInventoryView: boolean;
  assignPlanInventory: boolean;
  serviceList: any[];
  getActivePlanList: any[];
  getFuturePlanList: any[];
  getAllPlanIvnetoryIdOnPlanIdList: any[];
  getProductCategoryList: any[];
  getProductByPlanIdList: any[];
  serviceUnit: any;
  custPackageUnit: any[];
  assignedInventoryList = [];
  currentPageProductListdata = 1;
  productListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  productListdatatotalRecords: any;
  first = 0;
  rows = 10;
  paymentFormGroup: FormGroup;
  viewcustomerFailedPaymentData: any;
  dateOfBirth: String;

  createPaymentData: any;
  customerData: any;
  customerIdRecord: number;
  assignInventoryModal: boolean;
  inventoryAssignForm: FormGroup;
  inwardList: any[];
  Customertype: any[];
  CustomertypeSubtype: any[];
  externalItemList: any[];
  availableQty: number;
  unit: any;
  products = [];
  replaceProducts = [];
  minDiscountValue = 1;
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  invoiceType = [
    { label: "Group", value: "Group" },
    { label: "Independent", value: "Independent" }
  ];
  parentExperience = [
    { label: "Single", value: "Single" },
    { label: "Actual", value: "Actual" }
  ];

  inventoryType = [
    { label: "Permanant Replacement", value: "Permanant Replacement" },
    { label: "Temporary Replacement", value: "Temporary Replacement" }
  ];
  @Input("customerId")
  showQtyError: boolean;
  // userId: number = localStorage.getItem('userId');
  userId: number = +localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  macList = [];
  selectedMACAddress: any = [];
  productHasMac: boolean;
  showQtySelectionError: boolean;
  productHasSerial: boolean;
  ifMyInvoice = false;
  showItemPerPageInvoice = 1;
  InvoiceDATA = new BehaviorSubject({
    InvoiceDATA: ""
  });
  invoiceId = new BehaviorSubject({
    invoiceId: ""
  });
  paymentId = new BehaviorSubject({
    paymentId: ""
  });
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  planGroupcustid = new BehaviorSubject({
    planGroupcustid: ""
  });
  wCustID = new BehaviorSubject({
    wCustID: "",
    WalletAmount: ""
  });

  PlanQuota = new BehaviorSubject({
    custid: "",
    PlanData: ""
  });
  searchInvoiceMasterFormGroup: FormGroup;
  currentPageinvoiceMasterSlab = 1;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMastertotalRecords: String;
  searchInvoiceData: any;
  invoiceMasterListData: any = [];
  isInvoiceSearch = false;
  showPassword = false;
  _passwordType = "password";
  today: string = "";
  searchkey2: string;
  paymentMode: any;
  statusOptions = RadiusConstants.status;
  searchOptionSelect = this.commondropdownService.customerSearchOption;
  //   selectTitile = [
  //     { label: "Mr" },
  //     { label: "Ms" },
  //     { label: "Mrs" },
  //     { label: "Miss" },
  //     { label: "M/S" },
  //     { label: "Dear" }
  //   ];
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  CustomerTypeValue = [
    { label: "Customer", value: "customer" },
    { label: "Organization", value: "organization" }
  ];
  FeasibilityOptions = [
    { label: "N/A", value: "N/A" },
    { label: "Feasibility At Booking", value: "Feasibility At Booking" }
  ];
  totaladjustedAmount = 0;
  celendarTypeData = [{ label: "English" }, { label: "Nepali" }];
  ifIndividualPlan = false;
  ifPlanGroup = false;
  planGroupName: any = "";
  planCategoryForm: FormGroup;
  invoiceList: any;
  prepaidParentCustomerList: any;
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  selectedParentCust: any = [];
  filterPartnerPlanGroup = [];
  closeFollowup = false;
  remarkScheduleFollowup = false;
  selectPlanChange = false;

  //   PlanQuota = new BehaviorSubject({
  //     custid: "",
  //     PlanData: ""
  //   });
  //   searchInvoiceMasterFormGroup: FormGroup;
  //   currentPageinvoiceMasterSlab = 1;
  //   invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  //   invoiceMastertotalRecords: String;
  //   searchInvoiceData: any;
  //   invoiceMasterListData: any = [];
  //   isInvoiceSearch = false;
  //   showPassword = false;
  //   _passwordType = "password";
  //   searchkey2: string;
  //   paymentMode: any;
  //   statusOptions = RadiusConstants.status;
  //   searchOptionSelect = this.commondropdownService.customerSearchOption;
  //   selectTitile = [
  //     { label: "Mr" },
  //     { label: "Ms" },
  //     { label: "Mrs" },
  //     { label: "Miss" },
  //     { label: "M/S" },
  //     { label: "Dear" }
  //   ];
  //   planDetailsCategory = [
  //     { label: "Individual", value: "individual" },
  //     { label: "Plan Group", value: "groupPlan" }
  //   ];
  //   CustomerTypeValue = [
  //     { label: "Customer", value: "customer" },
  //     { label: "Organization", value: "organization" }
  //   ];
  //   FeasibilityOptions = [
  //     { label: "Not Service Ready (NSR)", value: "Not Service Ready (NSR)" },
  //     { label: "Maintenance", value: "Maintenance" }
  //   ];
  //   totaladjustedAmount = 0;
  //   celendarTypeData = [{ label: "English" }, { label: "Nepali" }];
  //   ifIndividualPlan = false;
  //   ifPlanGroup = false;
  //   planGroupName: any = "";
  //   planCategoryForm: FormGroup;
  //   prepaidParentCustomerList: any;
  //   currentPageParentCustomerListdata = 1;
  //   parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  //   parentCustomerListdatatotalRecords: any;
  //   selectedParentCust: any = [];
  //   filterPartnerPlanGroup = [];

  selectedParentCustId: any;
  parentCustList: any;
  editCustomerId: any;
  newFirst = 0;
  searchParentCustOption = "";
  searchParentCustValue = "";
  serviceAreaDisable = false;
  parentFieldEnable = false;
  validityUnitFormGroup: FormGroup;
  validityUnitFormArray: FormArray;
  // discount
  customerCustDiscountListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCustDiscountListdatatotalRecords: String;
  currentPagecustomerCustDiscountListdata = 1;
  CustDiscountShowItemPerPage = 1;
  custCustDiscountList: any = [];
  eventActionData: any = [];
  oldDiscValue = 0;
  newDiscValue = 0;
  customerUpdateDiscount = false;
  shiftLocationEvent = false;
  FinalAmountList: any = [];
  planMappingList = [];
  planDiscount: number;
  finalOfferPrice: number;
  offerPrice: number;
  groupOfferPrices = {};
  maxDiscountValue = 99;
  maxLength = 250;
  isInvoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];
  ifWalletMenu = false;
  getWallatData = [];
  planDropdownInChageData = [];

  dataChargePlan: any = [];
  billingCycle: any = [];
  customerInventoryListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerInventoryListDataCurrentPage = 1;
  customerInventoryListDataTotalRecords: number;
  assignInventoryCustomerId: any;
  assignedInventoryListWithSerial = [];
  assignInventoryWithSerial: boolean;
  customerInventoryDetailsListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerInventoryDetailsListDataCurrentPage = 1;
  customerInventoryDetailsListDataTotalRecords: number;
  customerInventoryMappingId: any;
  customerInventoryMappingIdForReplace: any;
  showReplacementForm: boolean;
  inventoryStatusDetails: any;
  inventoryStatusView: boolean;
  isCustomerDetailSubMenu = false;
  staffUser: any;
  // isAdmin = false;
  isCaf = false;
  viewCustomerPaymentList = false;
  customerPlanView = false;
  customerStatusView = false;
  ipManagementView = false;
  macManagementView = false;
  customerCafNotes = false;
  ifUpdateAddress = false;
  ifCafFollowUp = false;
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
    shiftPartnerid: ""
  };
  ifUpdateAddressSubmited = false;
  ifCafFollowupSubmited = false;
  partnerListByServiceArea: any = [];
  OlddiscountData = [];
  AreaListDD: any;
  inputMobile = "";
  inputMobileSec = "";
  filterNormalPlanGroup = [];
  serviceareaCheck = true;
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  pincodeDD: any = [];
  invoicePaymentData = [];
  invoiceID = "";
  invoicePaymentItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageinvoicePaymentList = 1;
  invoicePaymenttotalRecords: number;
  ifInvoicePayment = false;
  allchakedPaymentData = [];
  ispaymentChecked = false;
  allIsChecked = false;
  isSinglepaymentChecked = false;
  invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];
  planGroupSelectedSubisu: any;
  planListSubisu: any;
  plansArray: FormArray;
  newPrice: any;
  isInvoiceToOrg: any = false;
  customerBill: "";
  custInvoiceToOrg: boolean;
  ifChargeGetData = false;
  chargeUseCustID = "";
  inventoryStatusDetailsForReplace = [];
  assignAppRejectDiscountForm: FormGroup;
  assignAppRejectShiftLocationForm: FormGroup;
  Inventoryreject = false;
  rejectInventoryData = [];
  InventoryselectStaffReject: any;
  Inventoryapproved = false;
  approveInventoryData = [];
  InventoryselectStaff: any;
  approveId: any;
  workflowID: number;
  reject = false;
  rejectCAF = [];
  selectStaffReject: any;
  approved = false;
  approveCAF = [];
  reassigndata = [];
  selectStaff: any;
  ifplanisSubisuSelect = false;
  WalletAmount: any = "";
  workflowAuditDataI: any = [];
  currentPageMasterSlabI = 1;
  MasteritemsPerPageI = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecordsI: String;
  assignDiscountData: any = [];
  assignShiftLocationData: any = [];
  dropdownOptions: any[] = [];
  shiftLocationFlagType = "";
  assignShiftLocationsubmitted = false;
  buid: any;
  mvnoid: any;
  staffid: any;
  departmentListData: any;
  departmenttotalRecords: any;
  departmentitemsPerPage: any;
  blockNoOptions: number[];
  invoicePaymentModal = false;
  chequeToday: string;

  // deleteMACMapping(mapping) {
  //
  //   mapping.customerId = null;
  //   this.customerInventoryMappingService
  //     .deleteMacForCustomer(mapping)
  //     .subscribe(
  //       (res: any) => {
  //         this.deleteMacMappInCustomer(mapping.macAddress);
  //         this.getMacMappingsByOutwardId(mapping.outwardId);
  //
  //       },
  //       (error: any) => {
  //
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     );
  // }
  discountFlageType = "";

  // saveCustomerMACMapping() {
  //   let custMacMapping = [];
  //
  //   this.selectedMACAddress.forEach((element) => {
  //     custMacMapping.push({
  //       macAddress: element.macAddress,
  //       customer: this.customerId,
  //     });
  //   });
  //
  //   this.outwardService.saveCustomerMACMapping(custMacMapping).subscribe(
  //     (res: any) => {
  //       this.macList = [];
  //       // this.messageService.add({
  //       //   severity: 'success',
  //       //   summary: 'Successfully',
  //       //   detail: "Assigend inventory successfully.",
  //       //   icon: 'far fa-check-circle',
  //       // });
  //     },
  //     (error: any) => {
  //
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.msg,
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  // deleteMacMappInCustomer(macMaddress) {
  //   this.outwardService
  //     .deleteMacMapInCustomer(this.customerId, macMaddress)
  //     .subscribe((res: any) => {});
  AppRjecHeader = "";
  assignDiscounsubmitted = false;
  workflowAuditData: any = [];
  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: String;
  searchDBRFormDate: any = "";
  searchDBREndDate: any = "";
  dbrListData: any = [];
  currentPageDBRListdata = 1;
  DBRListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  showItemDBRPerPage = 0;
  DBRListdatatotalRecords: any;
  ifShowDBRReport = false;
  private oldMacMappingId: any;
  loggedInStaffId = localStorage.getItem("userId");
  fileName: any;
  file: any = "";

  planDataForm: FormGroup;
  customerPopName: any = "";
  tdsInclude: boolean = true;
  abbsInclude: boolean = true;
  tdsPercent: number;
  abbsPercent: number;
  masterSelected: boolean;
  checklist: any;
  checkedList: any = [];
  currency: string;
  systemConfigCurrency: string;
  isCustSubTypeCon: boolean = false;
  inventoryData = new BehaviorSubject({
    inventoryData: ""
  });
  ifcustomerDiscountField = false;
  serviceData: any;
  branchData: any;
  staffList: any;
  customerChangePlan = false;
  childPlanRenewArray: FormArray = new FormArray([]);
  changePlanForm: FormGroup;
  currentData = this.datePipe.transform(Date(), "yyyy-MM-dd");
  chargenewPlanForm: FormGroup;
  filterPlanListCust: any;
  selPlanData: any = {
    quotatype: "",
    quotatime: "",
    quota: "",
    quotaUnit: "",
    quotaunittime: "",
    validity: "",
    offerprice: "",
    taxamount: "",
    activationDate: "",
    expiryDate: "",
    finalAmount: ""
  };
  changePlanDate: any = [];
  newAdddiscountdata: any = [];
  pageNumberForChildsPageForChangePlan = 1;
  pageSizeForChildsPageForChangePlan = RadiusConstants.ITEMS_PER_PAGE;
  filterPlanGroupListCust: any;
  newPlanGroupData: any;
  serviceAreaId: any;
  lastRenewalPlanGroupID = "";
  customerChargeDataShowChangePlan = [];
  parentChargeRecurringCustList: number;
  childChargeRecurringCustList: number;
  addChargeForm: FormGroup;
  chargeChildGroupForm: FormGroup;
  overChargeChildListFromArray: FormArray;
  custServiceData: any = [];
  planSelected: any;
  planByService: any = [];
  changePlanRemark: string;
  planGroupSelected: any;
  customerNetworkLocationDetailData: any;
  childCustomerDataListForChangePlan: any = [];
  childPlanGroupFlag = false;
  childPlan_PLANGROUPID = [];
  UpdateParentCustPlans = true;
  childCustomerDataTotalRecordsForChangePlan: number;
  staffDataList: any = [];
  data: any = [];
  newPlanSelectArray: FormArray;
  planList: any;
  planChangeListdatatotalRecords: any;
  graceNumberDays = "";
  days = [];
  isPlanTypeAddon = false;
  changeplanGroupFlag = false;
  planGroupFlag = false;
  filterSelectedPlanGroupListCust: any;
  changenewPlanForm: FormGroup;
  subisuChange = false;
  ifPlanSelectChanePlan = false;
  changePlansubmitted = false;
  selectPlan0Rplangroup = "";
  selectPlanListIDs = [];
  paymentOwnerError: boolean;
  changePlanData: any = {};
  changePlanBindigNewPlan = [];
  childPlanType: any;
  childCustID: any = "";
  changePlanBindigChildNewPlan = [];
  isPartnerSelected: boolean = false;

  selectedPlanChildList = [];
  selectPlanChildListIDs = [];
  planGroupChildSelected: any;
  chargeAllData: any = [];
  childChargeData = [];
  lastRenewal_CHILDPlanGroupID = "";
  planListChild: any;
  serviceWisePlansData = [];
  selectedPlanList = [];
  planListByType: any = [];
  groupPlanListByType: any = [];
  dateTime = new Date();
  billableCustList: any;
  parentCustomerDialogType: any = "";
  rejectedReasonId: any;
  leadId: number;
  rejectedReasonList: any = [];
  // close lead related variables....
  rejectLeadFormGroup: FormGroup;
  rejectedLeadFormSubmitted: boolean = false;
  discountType: any = "One-time";
  plansByServiceArr = [];
  remarks: any;
  planIds = [];
  enableChangePlanGroup: boolean = false;
  selectedCustService: any = null;
  promiseToPayData = [];
  isPromiseToPayModelOpen: boolean = false;
  customerSelectType: any = "";
  showParentCustomerModel = false;

  isServiceOpen = false;
  isPlanOnDemand: boolean = false;
  planGroupMapingList: any = [];

  partnerList: any = [];
  isBranchAvailable = false;

  oltDevices = [];
  spliterDevices = [];
  masterDbDevices = [];

  isTrialCheckDisable = false;
  custQuotaList: any[];
  custQuotaListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custQuotaListtotalRecords: String;
  currentPagecustQuotaList = 1;
  chequeDateName = "Cheque Date";
  custID: number;
  visibleQuotaDetails: boolean = false;

  PRE_CUST_CONSTANTS;
  POST_CUST_CONSTANTS;
  createAccess: boolean = false;
  editAccess: boolean = false;
  closeCafAccess: boolean = false;
  uploadDocAccess: boolean = false;
  nearByDeviceAccess: boolean = false;
  sendPaymentAccess: boolean = false;
  recordPaymentAccess: boolean = false;
  generatePdfAccess: boolean = false;
  reprintAccess: boolean = false;
  viewInvoiceAccess: boolean = false;
  discountAuditLogAccess: boolean = false;
  scheduleFollowUpAccess: boolean = false;
  rescheduleFollowUpAccess: boolean = false;
  closeFollowUpAccess: boolean = false;
  remarkFollowUpAccess: boolean = false;
  callFollowUpAccess: boolean = false;
  addChargeAccess: boolean = false;
  locationDataByPlan: any = [];
  showLocationMac: boolean = false;
  locationMacForm: FormGroup;
  overLocationMacArray = this.fb.array([]);
  macData: any = [];
  locationMacData: any = [];
  custLocationData: any = [];
  quotaSharableData = [
    { label: "shareable", value: "shareable" },
    { label: "individual", value: "individual" }
  ];
  billToData: any = [];
  custTitle: any = CUSTOMER_PREPAID;
  CustomerStatusValue: any[] = [];
  cols = [
    {
      field: "name",
      header: "Name",
      customExportHeader: "Name"
    },
    {
      field: "username",
      header: "Username",
      customExportHeader: "Username"
    },
    {
      field: "serviceArea",
      header: "Service Area",
      customExportHeader: "Service Area"
    },
    {
      field: "mobile",
      header: "Mobile Number",
      customExportHeader: "Mobile Number"
    },
    {
      field: "acctno",
      header: "Account No",
      customExportHeader: "Account No"
    },
    {
      field: "status",
      header: "	Status",
      customExportHeader: "Status"
    },
    {
      field: "remainTime",
      header: "	Remaining Time",
      customExportHeader: "Remaining Time"
    },
    {
      field: "mvnoName",
      header: "ISP Name",
      customExportHeader: "ISP Name"
    }
  ];
  fromDate = "";
  toDate = "";

  // changes for Shift Location

  newShiftPageLimitOptions = RadiusConstants.pageLimitOptions;
  newShiftshowItemPerPage = 1;

  newShiftapprovableStaff: any = [];
  newShiftoltDevices = [];
  newShiftspliterDevices = [];
  newShiftmasterDbDevices = [];
  newShiftpartnerList = [];
  newShiftpincodeDD: any = [];
  newShiftpartnerListByServiceArea: any = [];
  newShiftstaffList: any = [];
  newShiftbranchData: any = [];
  newShiftAreaListDD: any = [];
  newShiftareaDetails: any = [];
  newShiftstaffSelectList: any = [];
  newShiftbillableCustList: any = [];
  newShiftselectedParentCust: any = [];
  newShiftassignShiftLocationData: any = [];
  newShiftapproveInventoryData = [];
  newShiftrejectInventoryData = [];
  newShiftshiftLocationFlagType = "";
  newShiftAppRjecHeader = "";

  newShiftassignedShiftLocationid: any;
  newShiftCustomerAddressDataForCustometr: any;
  newShiftselectStaff: any;
  newShiftrequestedByID: number;
  newShiftpaymentOwnerId: number;
  newShiftLocationPopId: number;
  newShiftLocationOltId: number;
  newShiftbranchID: number = 0;
  newShiftwalletValue: number;
  newShiftprepaid: any;
  newShiftdueValue: number;
  newShiftparentCustomerDialogType: any = "";
  newShiftcustomerSelectType: any = "";
  newShiftstaffSelectType = "";
  newShiftapproveId: any;
  newShiftselectStaffReject: any;

  newShiftlocationFormRemark: FormGroup;
  newShiftLocationChargeGroupForm: FormGroup;
  newShiftpresentGroupForm: FormGroup;
  newShiftassignAppRejectShiftLocationForm: FormGroup;

  newShiftapproved = false;
  newShiftreject = false;
  newShiftserviceAreaDisable = false;
  newShiftisBranchAvailable = false;
  newShiftisBranchShiftLocation = false;
  newShiftisServiceInShiftLocation: boolean = false;
  newShiftsubmitted = false;
  newShiftselectPincodeList = false;
  newShiftshowParentCustomerModel = false;
  newShiftifUpdateAddressSubmited = false;
  newShiftassignShiftLocationsubmitted = false;
  newShiftrejectCustomerInventoryModal: boolean = false;
  newShiftrejectApproveShiftLocationModal: boolean = false;
  newShiftselectedStaff: any = [];
  newShiftstaffCustList = [];
  newShiftisSelectStaff: boolean = false;
  newShiftstaffid;

  newShiftcurrentDate = new Date();
  newShiftselectchargeValueShow = false;

  newShiftauditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });

  newShiftchargeType = [{ label: "One-time" }, { label: "Recurring" }];
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
  newShiftdisplayShiftLocationDetails: boolean = false;
  newShiftaddShiftLocationAccess: boolean = false;
  newShiftifModelIsShow: boolean = false;
  newShiftprepaidValue: number;
  newShiftassignDocSubmitted: boolean;
  newShiftremark: any;
  newShiftassignDocForm: any;
  customerInventoryList: any;
  activePlanList: any;
  paymentHistoryList: any;
  staffUserData: any;
  demographicLabel: any;
  mpinModal: boolean = false;
  mpinForm: FormGroup;
  momoPayinvoice: any;
  isMpinFormSubmitted: boolean = false;
  inputMobileNumber: string = "";
  payMethod: string;
  activePlanNames: string = "";
  showNotes: boolean = false;
  addNotes: boolean = false;
  invoicePaymentAccess: boolean = false;
  invoicesPaymentAccess: boolean = false;
  reassigncafAccess: boolean = false;
  updateDiscountcafAccess: boolean = false;
  subAreaListDD: any[];
  buildingListDD: any[];
  buildingNoDD: any[];
  areaListDD: any[];
  selectedMappingFrom: any;
  failureReasonDialog: boolean = false;
  searchStaffDeatil = "";
  searchReassignStaffDeatil = "";
  currentPageApproveStaffListdata: any;
  approveStaffListdataitemsPerPageForStaff: number = 5;
  approvestaffListdatatotalRecords: number = 0;
  approvestaffReassignListdatatotalRecords: number = 0;
  approveCAFData: any[];
  approveReassignCAFData: any[];
  reassignDataRefresh: any;
  newStaffFirst: number = 0;
  isCredentialMatch: boolean = false;
  transModal: boolean = false;
  transactionNo: any;
  addToWalletOrderId: any;
  failureReason: string = "";
  retryPaymentAccess: boolean = false;
  manuallySettlement: boolean = false;
  framedIpAddress: any;
  isCallDetails: boolean = false;
  newShiftbuildingListDD: any;
  newShiftsubAreaListDD: any;
  newShiftbuildingNoDD: any[];
  subareaTitle = RadiusConstants.SUBAREA;
  buildingTitle = RadiusConstants.BUILDING;
  rejectCafData: any[];
  bankDestination: any;
  selectedInvoice: any = [];
  displayRecordPaymentDialog: boolean = false;
  isShowInvoiceList: boolean;
  destinationbank: boolean;
  isSelectedInvoice = true;
  isAbbsFlag: boolean = false;
  isTdsFlag: boolean = false;
  displaySelectInvoiceDialog: boolean = false;
  //   invoiceList = [];
  onlineSourceData = [];
  disableShiftButton: boolean = false;
  assignCustomerCAFModal: boolean = false;
  rejectCustomerCAFModal: boolean = false;
  reAssignCustomerCAFModal: boolean = false;
  showLoginPassword = false;
  _loginPasswordType = "password";
  istrialplan: boolean = false;
  custTrailPlanItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  TrailPlanList = [];
  custShowTrailPlanShow = 1;
  currentTrailPlanListdata = 1;
  servicePlanId: any;
  customerAddressDetails: any;
  displayMpesaOptionsDialog: boolean;
  selectedMpesaOption: string = "";
  invoiceForMpesa: any;

  isDisplayConvertedAmount: boolean = false;
  convertedExchangeRate: any;
  collectedCurrency: string;
  isAutoGeneratedPassword: boolean = true;
  showAAAPasswordDetail: boolean = false;
  showLoginPasswordDetail: boolean = false;
  staffWalletLimit: number = 0;
  WalletDataAmount: number = 0;

  mvnoTitle = RadiusConstants.MVNO;
  mvnoId = Number(localStorage.getItem("mvnoId"));
  isValidUsername: boolean = false;
  responseMessage: any;
  passwordVisibility: boolean;
  isMandatory: boolean = false;
  cwscPasswordVisible: boolean;
  aaaPasswordVisible: boolean;
  discountList: any = [];

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
  vasOfferPrice: number = 0;
  vasData: any;

  isVasPlan: boolean = true;
  oldVasPackId: any;
  newVasPackId: any;
  oldVasPackData: any;

  shiftLocationMsg: string;
  isDisplayShiftLocationMsg: boolean = false;
  vasPlan: any;
  openVasDetailsByCust: boolean = false;
  servicePackMsg: string;

  servicePackingMsg: string;
  servicePackData: any;
  planCurrency: any;
  cafChangePlanType: any[] = [];
  isThisTumil: boolean = false;
  householdId: any = "";
  householdType: any = "";
  householdTypeOptions = [
    { label: "Residential", value: "residential" },
    { label: "Non-Residential", value: "non-residential" }
  ];
  tatDetailsData: any;
  tatDetailsShowModel: boolean = false;

  availableOutPorts: any;
  viewPort: any;
  showViewAttachDeviceModal = false;
  viewPortDialog: boolean = false;
  isEditEnable: boolean = false;
  editMacSerialBtn: any = "";
  inFlag: boolean = false;
  nearLocationModal: boolean = false;
  attachDeviceData = [];
  is_check_enable: boolean = true;
  isWrongHouseholdId: boolean = false;
  householdData: any;
  planMappingData: any;
  isInstallmentAllowed: boolean = false;
  disabledDiscExpiryDate: boolean = false;
  isExpiredDate: boolean = false;
  openRejectLeadPopup: boolean = false;
  selectPlanGroup = false;
  rejectApproveShiftLocationModal = false;
  assignCustomerInventoryModal = false;
  modalCloseRejectInventoryModal = false;
  rejectCustomerInventoryModal = false;
  scheduleFollowup = false;
  reScheduleFollowup = false;
  selectPlanChildChange = false;
  isnewDiscount: boolean = true;
  minToday: string;
  paymentApprovalHeader: boolean = false;
  paymentMsg: any;
  apiExchangeRate: number;
  secondarySearchOption: string = "";
  secondarySearchValue: string = "";
  secondaryOptions = [
    { label: "CAF Number", value: "cafNo" },
    { label: "Username", value: "username" },
    { label: "Any", value: "any" }
  ];
  availableDiscountTypes = [{ label: "Plan" }, { label: "Service" }];
  isDiscountTypeDisabled: boolean = false;
  isDiscountDisabled: boolean = false;
  discountData: any[];
  planSelectedId: number = 0;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public customerManagementService: CustomermanagementService,
    private revenueManagementService: RevenueManagementService,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    public partnerService: PartnerService,
    public serviceAreaService: ServiceAreaService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private staffService: StaffService,
    loginService: LoginService,
    private customerDocumentService: CustomerDocumentService,
    private customerInventoryMappingService: CustomerInventoryMappingService,
    private recordPaymentService: RecordPaymentService,
    private externalItemManagementService: ExternalItemManagementService,
    private outwardService: OutwardService,
    private inwardService: InwardService,
    private productService: ProuctManagementService,
    private invoiceDetailsService: InvoiceDetailsService,
    public invoicePaymentListService: InvoicePaymentListService,
    private invoiceMasterService: InvoiceMasterService,
    private systemService: SystemconfigService,
    public customerdetailsilsService: CustomerdetailsilsService,
    public CustomerInventoryDetailsService: CustomerInventoryDetailsService,
    private customerInventoryManagementService: CustomerInventoryManagementService,
    public datePipe: DatePipe,
    private rejectedReasonService: RejectedReasonService,
    private leadManagementService: LeadManagementService,
    private prepaidRejectedReasonService: PrepaidRejectedReasonService,
    private networkdeviceService: NetworkdeviceService,
    private utils: Utils,
    private route: ActivatedRoute,
    private router: Router,
    private countryManagementService: CountryManagementService,
    public statusCheckService: StatusCheckService,
    public locationService: LocationService,
    private pincodeManagementService: PincodeManagementService,
    private areaManagementService: AreaManagementService,
    private buildingMangementService: BuildingManagementService,
    private ticketManagementService: TicketManagementService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.systemService.getConfigurationByName("TDS").subscribe((res: any) => {
      this.tdsPercent = res.data.value;
    });
    this.systemService.getConfigurationByName("ABBS").subscribe((res: any) => {
      this.abbsPercent = res.data.value;
    });
    this.today = new Date().toISOString().split("T")[0];
    this.PRE_CUST_CONSTANTS = PRE_CUST_CONSTANTS;
    this.POST_CUST_CONSTANTS = POST_CUST_CONSTANTS;
    this.custType = this.route.snapshot.paramMap.get("custType")!;
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.newShiftaddShiftLocationAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_SHIFT_LOCATION_ADD
        : POST_CUST_CONSTANTS.POST_CUST_SHIFT_LOCATION_ADD
    );
    this.createAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.CREATE_PRE_CUST_CAF_LIST
        : POST_CUST_CONSTANTS.CREATE_POST_CUST_CAF
    );

    this.editAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.EDIT_PRE_CUST_CAF_LIST
        : POST_CUST_CONSTANTS.EDIT_POST_CUST_CAF
    );

    this.closeCafAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.CLOSE_PRE_CUST_CAF_LIST
        : POST_CUST_CONSTANTS.CLOSE_POST_CUST_CAF
    );
    this.uploadDocAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.UPLOAD_DOCS_PRE_CUST
        : POST_CUST_CONSTANTS.UPLOAD_DOCUMENTS_POST_CUST_CAF
    );
    this.nearByDeviceAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_NEAR_BY_DEVICE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_NEARBY_DEVICE
    );
    this.sendPaymentAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PAYMENT_LINK_PRE_CUST_CAF
        : POST_CUST_CONSTANTS.PAYMENT_LINK_POST_CUST_CAF
    );
    this.recordPaymentAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PAYMENT_RECORD
        : POST_CUST_CONSTANTS.POST_CUST_PAYMENT_RECORD
    );
    this.generatePdfAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICES_GENERATE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_INVOICES_GENERATE
    );
    this.reprintAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICES_REPRINT
        : POST_CUST_CONSTANTS.POST_CUST_CAF_INVOICES_REPRINT
    );
    this.viewInvoiceAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICES_VIEW
        : POST_CUST_CONSTANTS.POST_CUST_CAF_INVOICES_VIEW
    );

    this.discountAuditLogAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_CHANGE_DISCOUNT_AUDIT_DETAILS
        : POST_CUST_CONSTANTS.POST_CUST_CAF_CHANGE_DISCOUNT_AUDIT
    );
    this.scheduleFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_SCHEDULE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_SCHEDULE
    );
    this.rescheduleFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_RESCHEDULE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_RESCHEDULE
    );
    this.closeFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_CLOSE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_FOLLOW_UP_CLOSE
    );

    this.remarkFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_CLOSE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_FOLLOW_UP_CLOSE
    );
    this.callFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_CALL
        : POST_CUST_CONSTANTS.POST_CUST_CAF_CALL
    );
    this.addChargeAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_CHARGE_CREATE_CHARGE
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.showNotes = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.CUSTOMER_CAF_NOTES
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.addNotes = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.ADD_NOTES_PRE_CUST_CAF
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.invoicePaymentAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICE_PAYMENT
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.invoicesPaymentAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICES_PAYMENT
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.reassigncafAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.REASSIGN_PRE_CUST_CAF
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.updateDiscountcafAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_CHANGE_UPDATE_DISCOUNT
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.retryPaymentAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.RETRY_CAF_PAYMENTSTATUS
        : POST_CUST_CONSTANTS.POST_RETRY_CAF_PAYMENTSTATUS
    );
    this.manuallySettlement = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.MANUALLY_CAF_SETTLEMENT
        : POST_CUST_CONSTANTS.POST_MANUALLY_CAF_SETTLEMENT
    );
    this.availableQty = 0;
    this.custType == "Prepaid"
      ? (this.custTitle = CUSTOMER_PREPAID)
      : (this.custTitle = CUSTOMER_POSTPAID);
    this.passwordVisibility = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_PASSWORD_VISIBILITY
        : POST_CUST_CONSTANTS.POST_CUST_CAF_PASSWORD_VISIBILITY
    );
    this.cwscPasswordVisible = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_CWSC_PASSWORD
        : POST_CUST_CONSTANTS.POST_CUST_CAF_CWSC_PASSWORD
    );
    this.aaaPasswordVisible = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_AAA_PASSWORD
        : POST_CUST_CONSTANTS.POST_CUST_CAF_AAA_PASSWORD
    );
    // this.inventoryAssignForm.reset();
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["1"],
      productId: ["", Validators.required],
      customerId: [this.customerId],
      serviceId: ["", Validators.required],
      inventoryType: [""],
      staffId: [""],
      inwardId: [""],
      assignedDateTime: [new Date(), Validators.required],
      status: ["", Validators.required],
      mvnoId: [""],
      externalItemId: [""]
    });

    this.macList = [];
    // this.systemService.getConfigurationByName("TDS").subscribe((res: any) => {
    //     this.tdsPercent = res.data != null ? res.data.value : "";
    // });this api will removed by shivam
    // this.systemService.getConfigurationByName("ABBS").subscribe((res: any) => {
    //     this.abbsPercent = res.data != null ? res.data.value : "";
    // });this api will removed by shivam
    // this api will removed and go to Customer Ledger
    // this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
    //     this.currency = res.data != null ? res.data.value : "";
    // });

    this.cafremaingTime();
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
  getActivePlanListDetails(custId) {
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

  openAddressDetails(customerData) {
    this.ifUpdateAddressSubmited = false;
    this.newShiftifUpdateAddressSubmited = false;
    this.ifUpdateAddress = true;
    this.ifCafFollowUp = false;
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.newShiftselectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.iflocationFill = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.customerUpdateDiscount = false;
    this.isCallDetails = false;
    // if (customerData.serviceareaid) {
    //     this.shiftLocationDTO.updateAddressServiceAreaId = customerData.serviceareaid;
    //     this.getPartnerAllByServiceArea(customerData.serviceareaid);
    //     this.getStaffDetailById(customerData.serviceareaid);
    // }
    // if (customerData.partnerid) {
    //     this.shiftLocationDTO.shiftPartnerid = customerData.partnerid;
    // }
    // this.shiftLocationDTO.isPermanentAddress = false;
    // this.shiftLocationDTO.isPaymentAddresSame = false;
    // this.presentGroupForm.patchValue(customerData.addressList[0]);
    // this.shiftLocationEvent = false;

    if (customerData.serviceareaid) {
      this.newShiftshiftLocationDTO.updateAddressServiceAreaId = customerData.serviceareaid;
      this.newShiftgetPartnerAllByServiceArea(customerData.serviceareaid);
      this.getStaffDetailById(customerData.serviceareaid);
    }
    if (customerData.partnerid) {
      this.newShiftshiftLocationDTO.shiftPartnerid = customerData.partnerid;
    }
    this.newShiftshiftLocationDTO.isPermanentAddress = false;
    this.newShiftshiftLocationDTO.isPaymentAddresSame = false;
    this.newShiftpresentGroupForm.patchValue(customerData.addressList[0]);
    this.shiftLocationEvent = false;

    this.getStaffDetailId();
    this.getMappingFrom();
    this.commondropdownService.getAllPinCodeData();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
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
  staffData: any = [];
  displayAmountModel = false;
  customerChangePlanDueAmount: any;
  custPackRelId: any;
  oldPlanId: any;

  getStaffDetailId() {
    const data = {};
    const url = "/staffuser/list";
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.staffData = response.staffUserlist;
    });
  }
  modalOpenAmount() {
    this.displayAmountModel = true;
    this.getCustomerChangePlanDueAmount();
  }
  closeDisplayPlanAmountDetails() {
    this.displayAmountModel = false;
  }

  getCustomerChangePlanDueAmount() {
    this.custServiceData.forEach(element => {
      this.custPackRelId = element.planmapid;
      this.oldPlanId = element.planId;
    });
    let pojo = {
      custId: this.custDetilsCustId,
      custPackRelId: this.custPackRelId,
      oldPlanId: this.oldPlanId,
      newPlanId: this.selPlanData.id
    };

    const url = "/customers/getCustomerChangePlanDueAmount";
    this.customerManagementService
      .getCustomerChangePlanDueAmount(url, pojo)
      .subscribe((response: any) => {
        this.customerChangePlanDueAmount = response;
      });
  }

  saveShiftLocation() {
    this.ifUpdateAddressSubmited = true;

    if (this.shiftLocationDTO.shiftPartnerid === "") {
      return this;
    }

    if (this.shiftLocationChargeGroupForm.valid) {
      this.shiftLocationDTO.addressDetails = this.presentGroupForm.getRawValue();

      this.shiftLocationDTO.custChargeOverrideDTO = {
        billableCustomerId: this.shiftLocationChargeGroupForm.value.billableCustomerId,
        custChargeDetailsPojoList: [this.shiftLocationChargeGroupForm.value],
        custid: this.customerDetailData.id,
        paymentOwnerId: this.shiftLocationChargeGroupForm.value.paymentOwnerId
      };

      const url = "/shiftCustomerLocation/" + this.customerDetailData.id;
      this.commondropdownService.postMethod(url, this.shiftLocationDTO).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Shift customer location successfully.",
            icon: "far fa-check-circle"
          });
          this.getCustomersDetail(this.customerDetailData.id);
          this.getCustomerNetworkLocationDetail(this.customerDetailData.id);
          this.getNewCustomerAddressForCustomer(this.customerDetailData.id);
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

  getPlanbyPartner(serviceAreaId, partnerId) {
    this.isPartnerSelected = true;
    if (serviceAreaId) {
      this.filterPlanData = [];
      const url = `/partnerplans/serviceArea?partnerId=${partnerId}
        &mvnoId=${localStorage.getItem("mvnoId")}
        &serviceAreaId=${serviceAreaId}
        &planmode=NORMAL`;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.partnerpostpaidplanList;
          this.filterPlanData = response.partnerpostpaidplanList;
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

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  followupData: any;
  customersId: any;
  followupScheduleForm: FormGroup;
  followupPopupOpen: boolean;
  followupMinimumDate = new Date();

  closeFollowupForm: FormGroup;
  closeFollowupFormsubmitted: boolean = false;

  remarkFollowupForm: FormGroup;
  remarkFollowupFormsubmitted: boolean = false;

  reFollowupScheduleForm: FormGroup;
  reFollowupFormsubmitted: boolean = false;

  requiredFollowupInfo: any;
  scheduleFollowupPopupOpen() {
    this.followupPopupOpen = true;
    this.generatedNameOfTheFollowUp(this.customersId);
    this.scheduleFollowup = true;
  }

  closeFolloupPopup() {
    this.followupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: ["", Validators.required],
      //status: ["", Validators.required],
      isMissed: [false],
      leadMasterId: [""]
    });
    this.scheduleFollowup = false;
  }

  openCafFollowup(customerData) {
    this.customersId = customerData.id;
    this.getCafFollowupList("");
    this.ifCafFollowupSubmited = false;
    this.ifCafFollowUp = true;
    this.ifUpdateAddress = false;
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.iflocationFill = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.customerUpdateDiscount = false;
    this.isCallDetails = false;
  }

  saveCafFollowup() {
    this.ifCafFollowupSubmited = true;
    if (this.followupScheduleForm.valid) {
      let mvnoId =
        localStorage.getItem("mvnoId") == "1"
          ? this.customerGroupForm.value?.mvnoId
          : Number(localStorage.getItem("mvnoId"));
      const url = "/cafFollowUp/save?mvnoId=" + mvnoId;
      this.followupData = this.followupScheduleForm.value;
      this.followupData.customersId = this.customersId;
      this.followupData.staffUserId = this.staffid;
      this.followupData.mvnoId = this.mvnoid;
      this.followupData.isMissed = false;
      this.followupData.isSend = false;
      this.followupData.status = "Pending";
      const myFormattedDate = this.datePipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      this.customerManagementService.postMethod(url, this.followupData).subscribe(
        (response: any) => {
          this.ifCafFollowupSubmited = false;
          this.followupScheduleForm.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.scheduleFollowup = false;
          this.getCafFollowupList("");
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
      this.ifCafFollowupSubmited = false;
    }
  }

  rescheduleFollowUp(followUpDetails) {
    this.followUpId = followUpDetails.id;
    this.generatedNameOfTheReFollowUp(this.customersId);
    this.reFollowupFormsubmitted = false;
    this.reScheduleFollowup = true;
  }

  saveReFollowup() {
    this.followupData = {};
    this.reFollowupFormsubmitted = true;
    if (this.reFollowupScheduleForm.valid) {
      this.followupData = this.reFollowupScheduleForm.value;
      this.followupData.customersId = this.customersId;
      this.followupData.staffUserId = this.staffid;
      this.followupData.mvnoId = this.mvnoid;
      this.followupData.isSend = false;
      this.followupData.status = "Pending";
      const myFormattedDate = this.datePipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      const url =
        "/cafFollowUp/reSchedulefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.followupData.remarksTemp;
      this.customerManagementService.postMethod(url, this.followupData).subscribe(
        (response: any) => {
          this.reFollowupFormsubmitted = false;
          this.reFollowupScheduleForm.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.reScheduleFollowup = false;
          this.reFollowupFormsubmitted = false;
          this.getCafFollowupList("");
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
      this.reFollowupFormsubmitted = false;
    }
  }

  closeReFolloupPopup() {
    this.reFollowupFormsubmitted = false;
    this.reScheduleFollowup = false;
    this.reFollowupScheduleForm.reset();
  }

  rescheduleFollowupRemarks = [
    "Confirm Later",
    "Do Not Call",
    "Expensive Package",
    "Call rejected by Client"
  ];
  cafFollowupList: any = [];
  cafFollowupDatalength = 0;
  cafFollowupPage = 1;
  cafFollowupItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  followupListTotalRecordsForUserAndTeam: any;
  followupListForUserAndTeam: any;

  getCafFollowupList(list) {
    let size;
    let page = this.cafFollowupPage;
    if (list) {
      size = list;
      this.cafFollowupItemsPerPage = list;
    } else {
      size = this.cafFollowupItemsPerPage;
    }
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerDetailData?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url =
      "/cafFollowUp/findAll?customerId=" +
      this.customersId +
      "&page=" +
      page +
      "&pageSize=" +
      size +
      "&mvnoId=" +
      mvnoId;

    this.customerManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.cafFollowupList = await response?.dataList;

        this.followupListTotalRecordsForUserAndTeam = await response?.totalRecords;

        if (this.showItemPerPage > this.cafFollowupItemsPerPage) {
          this.cafFollowupDatalength = this.cafFollowupList?.length % this.showItemPerPage;
        } else {
          this.cafFollowupDatalength = this.cafFollowupList?.length % this.cafFollowupItemsPerPage;
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

  pageChangedCafFollowup(pageNumber): void {
    this.cafFollowupPage = pageNumber;
    this.getCafFollowupList("");
  }

  totalCafFollowupItems(event): void {
    this.showItemPerPage = Number(event.value);
    if (this.cafFollowupPage > 1) {
      this.cafFollowupPage = 1;
    }
    this.getCafFollowupList(this.showItemPerPage);
  }

  generateNameOfFollowUp: any;
  generatedNameOfTheFollowUp(customersId) {
    const url = "/cafFollowUp/generateNameOfTheCafFollowUp/" + customersId;

    this.customerManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.generateNameOfFollowUp = await response.data;
        this.generateNameOfFollowUp
          ? this.followupScheduleForm.controls["followUpName"].setValue(this.generateNameOfFollowUp)
          : "";
      },
      async (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong with 'followup name.' Generation",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  generateNameOfReFollowUp: any;
  generatedNameOfTheReFollowUp(customersId) {
    const url = "/cafFollowUp/generateNameOfTheCafFollowUp/" + customersId;

    this.customerManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.generateNameOfReFollowUp = await response.data;
        this.generateNameOfReFollowUp
          ? this.reFollowupScheduleForm.controls["followUpName"].setValue(
              this.generateNameOfReFollowUp
            )
          : "";
      },
      async (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong with 'followup name.' Generation",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  checkFollowUpDatetimeOutDate(obj) {
    if (obj != null && obj != undefined) {
      if (obj.status && obj.status === "Pending") {
        if (obj.followUpDatetime && new Date(obj.followUpDatetime) < new Date()) {
          return true;
        }
      }
    } else {
      return false;
    }
  }

  followUpId: any;
  closeFollowUp(followUpDetails) {
    this.closeFollowupFormsubmitted = false;
    this.followUpId = followUpDetails.id;
    this.closeFollowup = true;
  }

  closeActionFolloupPopup() {
    this.closeFollowup = false;
  }

  saveCloseFollowUp() {
    this.closeFollowupFormsubmitted = true;
    if (this.closeFollowupForm.valid) {
      const url =
        "/cafFollowUp/closefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.closeFollowupForm.get("remarks").value;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.closeFollowup = false;
          this.closeFollowupForm.reset();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.getCafFollowupList("");
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
      this.closeFollowupFormsubmitted = false;
    }
  }

  rejectLeadPopupOpen(leadId) {
    if (this.rejectCustomerCAFForm.invalid) {
      return;
    }
    this.rejectCustomerCAFForm.reset();
    this.rejectedReasonList = [];
    // console.log("Lead Id from rejectLeadPopupOpen function() => ", leadId);
    this.leadId = leadId;
    this.rejectedReasonId = null;
    this.openRejectLeadPopup = true;
    this.prepaidRejectedReasonService.getMethod("/rejectReason/all").subscribe(
      async (response: any) => {
        if (response.rejectReasonList && response.rejectReasonList.content.length > 0) {
          response.rejectReasonList.content.forEach((item: any) =>
            item?.status === "Active" ? this.rejectedReasonList.push(item) : ""
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

  rejectLead(leadId: any) {
    this.rejectedLeadFormSubmitted = true;
    if (this.rejectLeadFormGroup.valid) {
      if (leadId !== "") {
        let rejectDTOObj = {
          cafId: leadId,
          rejectReasonId: this.rejectLeadFormGroup.controls.rejectReasonId.value,
          rejectSubReasonId: this.rejectLeadFormGroup.controls.rejectSubReasonId.value,
          remark: this.rejectLeadFormGroup.controls.remark.value
        };

        const url = "/close";

        this.prepaidRejectedReasonService.postMethod(url, rejectDTOObj).subscribe(
          async (response: any) => {
            this.rejectedLeadFormSubmitted = false;
            this.getcustomerList("");
            if ((await response.status) === 200) {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-times-circle"
              });
              // this.getLeadList("");
              this.openRejectLeadPopup = false;

              this.rejectLeadFormGroup.reset();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.message,
                icon: "far fa-times-circle"
              });
              // this.getLeadList("");
              this.openRejectLeadPopup = false;
              this.rejectLeadFormGroup.reset();
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
            // this.getLeadList("");
            this.openRejectLeadPopup = false;
            this.rejectLeadFormGroup.reset();
          }
        );
      } else {
        this.openRejectLeadPopup = false;
        // this.getLeadList("");

        this.rejectLeadFormGroup.reset();
      }
    } else {
      this.openRejectLeadPopup = true;
    }
  }

  rejectedSubReasonArr: any;

  selectRejectedReason(id: any) {
    this.rejectedSubReasonArr = [];
    this.rejectedReasonId = id;
    this.rejectedReasonList?.forEach(source =>
      source.rejectSubReasonDtoList?.forEach(subreason =>
        subreason.rejectReasonId === this.rejectedReasonId
          ? this.rejectedSubReasonArr.push(subreason)
          : ""
      )
    );
  }

  closeRejectLeadPopup() {
    this.openRejectLeadPopup = false;
    this.rejectLeadFormGroup.reset();
  }

  followUpDetailsObj: any;
  remarkFollowUp(followUpDetails) {
    this.followUpDetailsObj = followUpDetails;
    this.remarkFollowupFormsubmitted = false;
    this.followUpId = followUpDetails.id;
    this.getfollowUpRemarkList(this.followUpId);
    this.remarkScheduleFollowup = true;
  }

  closeRemarkPopup() {
    this.remarkFollowupForm.reset();
    this.remarkFollowupFormsubmitted = false;
    this.remarkScheduleFollowup = false;
  }

  saveRemarkFollowUp() {
    this.remarkFollowupFormsubmitted = true;
    this.remarkFollowupForm.get("cafFollowUpId").setValue(this.followUpId);
    if (this.remarkFollowupForm.valid) {
      var data = this.remarkFollowupForm.value;
      data.cafFollowUpId = this.followUpId;
      data.mvnoId = this.mvnoid;

      const url = "/cafFollowUp/cafFollowUp/remark";
      this.customerManagementService.postMethod(url, data).subscribe(
        async (response: any) => {
          this.remarkScheduleFollowup = false;
          this.remarkFollowupForm.reset();
          await this.getCafFollowupList("");

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
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
      this.remarkFollowupFormsubmitted = false;
    }
  }

  followUpRemarkList: any = [];
  tableWrapperRemarks: any = "";
  scrollIdRemarks: any = "";
  getfollowUpRemarkList(id) {
    this.tableWrapperRemarks = "";
    this.scrollIdRemarks = "";

    const url = "/cafFollowUp/findAll/cafFollowUpRemark/" + id;
    this.customerManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.followUpRemarkList = await response.dataList;
        if (this.followUpRemarkList && this.followUpRemarkList?.length > 3) {
          this.tableWrapperRemarks = "table-wrapper";
          this.scrollIdRemarks = "table-scroll-remark";
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

  makeACall() {
    this.messageService.add({
      severity: "info",
      summary: "Call configure",
      detail: "Sorry! Please configure call client first..",
      icon: ""
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
        this.partnerListByServiceArea = response.partnerList;
        this.partnerList = response.partnerList.filter(item => item.id != 1);
        // this.customerGroupForm.get("partnerid").setValue(this.partnerList[0].id);
      },
      (error: any) => {}
    );
  }

  isCustDocPending(cafId, nextApproverId) {
    // this.customerDocumentService.isCustDocPending(cafId).subscribe(
    //   (response: any) => {
    //     if (response.data) {
    //       this.messageService.add({
    //         severity: "info",
    //         summary: "Info",
    //         detail: "Customer cannot activate. Document Verification Pending",
    //         icon: "far fa-times-circle"
    //       });
    //     } else {
    this.approved = false;
    this.selectStaff = null;
    this.assignCustomerCAFModal = true;
    this.assignCustomerCAFId = cafId;
    this.nextApproverId = nextApproverId;
    //     }
    //   },
    //   (error: any) => {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: error.error.errorMessage,
    //       icon: "far fa-times-circle"
    //     });
    //   }
    // );
  }

  ngOnInit(): void {
    // this.getBankDestinationDetail();
    this.customerFormInit();
    this.commondropdownService.getAllCurrencyData();
    this.demographicLabel = RadiusConstants.DEMOGRAPHICDATA || [];
    this.addNotesForm = this.fb.group({
      id: [""],
      notes: ["", Validators.required]
    });
    this.macManagementGroup = this.fb.group({
      macAddress: ["", [Validators.required]],
      custid: [""],
      custsermappingid: [""]
    });
    this.rejectedSubReasonArr = [];
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
    this.chequeToday = new Date().toISOString().split("T")[0];

    if (this.custType == "Postpaid") {
      this.planDetailsCategory = this.planDetailsCategory.filter(cat => cat.value != "groupPlan");
    }
    this.getLoggedinUserData();
    this.custLedgerForm = this.fb.group({
      startDateCustLedger: ["", Validators.required],
      endDateCustLedger: ["", Validators.required]
    });
    window.scroll(0, 0);
    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });

    this.planCategoryForm = this.fb.group({
      planCategory: [""]
    });

    this.planDataForm = this.fb.group({
      offerPrice: [""],
      discountPrice: [0]
    });

    this.assignAppRejectDiscountForm = this.fb.group({
      remark: ["", Validators.required]
    });
    // this.customerGroupForm = this.fb.group({
    //   username: ["", Validators.required],
    //   password: ["", [Validators.required, this.noSpaceValidator]],
    //   firstname: ["", Validators.required],
    //   lastname: ["", Validators.required],
    //   email: ["", [Validators.required, Validators.email]],
    //   title: [""],
    //   pan: [""],
    //   gst: [""],
    //   aadhar: [""],
    //   passportNo: [""],
    //   tinNo: ["", [Validators.minLength(9), Validators.maxLength(9)]],
    //   contactperson: ["", Validators.required],
    //   failcount: ["0"],
    //   // acctno: ['', Validators.required],
    //   custtype: [this.custType],
    //   custlabel: ["customer"],
    //   feasibilityRequired: [""],
    //   feasibilityRemark: [""],
    //   phone: ["", [Validators.pattern("^[0-9]*$")]],
    //   mobile: ["", [Validators.required, Validators.minLength(3)]],
    //   secondaryMobile: ["", Validators.minLength(3)],
    //   countryCode: [this.commondropdownService.commonCountryCode],
    //   dunningType: [""],
    //   dunningSubType: [""],
    //   dunningSector: [""],
    //   dunningSubSector: [""],
    //   cafno: [""],
    //   voicesrvtype: [""],
    //   didno: [""],
    //   calendarType: ["English", Validators.required],
    //   partnerid: [""],
    //   salesremark: [""],
    //   servicetype: [""],
    //   serviceareaid: ["", Validators.required],
    //   status: [""],
    //   parentCustomerId: [""],
    //   invoiceType: ["", Validators.required],
    //   parentExperience: ["Actual", Validators.required],
    //   latitude: [""],
    //   longitude: [""],
    //   houseNumber: [""],
    //   birthDate: [""],
    //   discount: [""],
    //   plangroupid: [""],
    //   discountType: [""],
    //   discountExpiryDate: [""],
    //   flatAmount: [""],
    //   // id:[],
    //   billTo: ["CUSTOMER"],
    //   billableCustomerId: [""],
    //   isInvoiceToOrg: [false],
    //   istrialplan: [false],
    //   popid: [""],
    //   staffId: [""],
    //   branch: [""],
    //   planMappingList: (this.payMappingListFromArray = this.fb.array([])),
    //   addressList: (this.addressListFromArray = this.fb.array([])),
    //   overChargeList: (this.overChargeListFromArray = this.fb.array([])),
    //   custMacMapppingList: (this.custMacMapppingListFromArray = this.fb.array([])),
    //   custdisplayIpMappingList: (this.ipMapppingdisplayListFromArray = this.fb.array([])),
    //   custIpMappingList: (this.ipMapppingListFromArray = this.fb.array([])),
    //   paymentDetails: this.fb.group({
    //     amount: [""],
    //     paymode: [""],
    //     referenceno: [""],
    //     paymentdate: [""]
    //   }),
    //   isCustCaf: ["yes"],
    //   valleyType: [""],
    //   customerArea: [""],
    //   framedIpBind: [""],
    //   ipPoolNameBind: [""],
    //   dunningCategory: ["", Validators.required],
    //   billday: [""],
    //   oltid: [""],
    //   masterdbid: [""],
    //   splitterid: [""],
    //   departmentId: [""],
    //   locations: [],
    //   parentQuotaType: [""],
    //   isParentLocation: [""],
    //   isCredentialMatchWithAccountNo: [false],
    //   framedIpv6Address: [""],
    //   VLANID: [""],
    //   nasIpAddress: [""],
    //   nasPort: [""],
    //   framedIp: [""],
    //   maxconcurrentsession: ["", Validators.pattern(Regex.numeric)],
    //   addparam1: [""],
    //   addparam2: [""],
    //   addparam3: [""],
    //   addparam4: [""],
    //   earlybillday: [""],
    //   blockNo: [""],
    //   drivingLicence: [""],
    //   customerVrn: [""],
    //   customerNid: [""],
    //   renewPlanLimit: [""],
    //   graceDay: [{ value: 0, disabled: this.iscustomerEdit }, [Validators.max(30)]],
    //   loginUsername: ["", Validators.required],
    //   loginPassword: ["", [Validators.required, this.noSpaceValidator]],
    //   currency: [""],
    //   mvnoId: [""],
    //   isPasswordAutoGenerated: [true]
    // });
    // const mvnoControl = this.customerGroupForm.get("mvnoId");

    // if (this.mvnoId === 1) {
    //   mvnoControl?.setValidators([Validators.required]);
    //   this.commondropdownService.getmvnoList();
    // } else {
    //   mvnoControl?.clearValidators();
    // }

    // mvnoControl?.updateValueAndValidity();
    // this.customerGroupForm.get("isCredentialMatchWithAccountNo")?.valueChanges.subscribe(value => {
    //   this.isCredentialMatch = value;
    // });

    this.locationMacForm = this.fb.group({
      location: [""],
      mac: [""]
    });

    // if (this.isAutoGeneratedPassword) {
    //   this.customerGroupForm.get("password")?.disable();
    //   this.customerGroupForm.get("password")?.markAsTouched();
    //   this.customerGroupForm.get("password")?.updateValueAndValidity();
    //   this.customerGroupForm.get("loginPassword")?.disable();
    //   this.customerGroupForm.get("loginPassword")?.markAsTouched();
    //   this.customerGroupForm.get("loginPassword")?.updateValueAndValidity();
    // }

    // if (this.custType === "Postpaid") {
    //   this.customerGroupForm.controls["billday"].setValidators(Validators.required);
    //   this.customerGroupForm.controls["billday"].updateValueAndValidity();
    //   this.customerGroupForm.controls.earlybillday.setValidators(Validators.required);
    // }
    // this.customerGroupForm.controls.invoiceType.disable();
    // this.customerGroupForm.controls.parentExperience.disable();
    this.planGroupForm = this.fb.group({
      planId: ["", Validators.required],
      service: ["", Validators.required],
      serviceId: ["", Validators.required],
      validity: ["", Validators.required],
      offerprice: [""],
      newAmount: [""],
      discount: [""],
      discountType: [""],
      discountTypeData: [""],
      discountExpiryDate: [""],
      istrialplan: [""],
      invoiceType: ["", Validators.required],
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
      expiry: ["", Validators.required]
    });

    this.macGroupForm = this.fb.group({
      macAddress: ["", Validators.required]
    });
    this.ipdisplayManagementGroup = this.fb.group({
      ipAddress: [
        "",
        [Validators.required, Validators.pattern("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$")]
      ],
      ipType: ["", Validators.required]
    });
    this.ipManagementGroup = this.fb.group({
      ipAddress: [
        "",
        [Validators.required, Validators.pattern("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$")]
      ],
      ipType: ["", Validators.required],
      custid: [""],
      custsermappingid: [""]
    });
    this.validityUnitFormArray = this.fb.array([]);
    this.plansArray = this.fb.array([]);
    this.validityUnitFormGroup = this.fb.group({
      validityUnit: [""]
    });
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
      landmark1: [""],
      version: ["New"]
    });
    this.paymentGroupForm = this.fb.group({
      addressType: ["Payment", Validators.required],
      landmark: [""],
      areaId: [""],
      pincodeId: [""],
      cityId: [""],
      stateId: [""],
      countryId: [""],
      landmark1: [""],
      subareaId: [""],
      building_mgmt_id: [""],
      buildingNumber: [""],
      version: ["New"]
    });
    this.permanentGroupForm = this.fb.group({
      addressType: ["Permanent"],
      landmark: [""],
      areaId: [""],
      pincodeId: [""],
      cityId: [""],
      stateId: [""],
      countryId: [""],
      subareaId: [""],
      building_mgmt_id: [""],
      buildingNumber: [""],
      landmark1: [""],
      version: ["New"]
    });

    this.assignCustomerCAFForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectCustomerCAFForm = this.fb.group({
      remark: ["", Validators.required]
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
    // this.paymentFormGroup.controls.onlinesource.disable();
    // this.paymentFormGroup.controls.bank.disable();
    // this.paymentFormGroup.controls.branch.disable();
    // this.paymentFormGroup.controls.chequedate.disable();
    // this.paymentFormGroup.controls.bankManagement.disable();
    // this.paymentFormGroup.controls.chequeno.disable();
    // this.paymentFormGroup.controls.paymentreferenceno.disable();
    // this.paymentFormGroup.controls.barteramount.disable();
    this.resetPayMode();

    // this.customerGroupForm.controls.dunningSubType.disable();
    // this.customerGroupForm.controls.dunningSubSector.disable();
    this.searchInvoiceMasterFormGroup = this.fb.group({
      billfromdate: [""],
      billrunid: [""],
      billtodate: [""],
      custMobile: ["", Validators.minLength(3)],
      custname: [""],
      docnumber: [""],
      customerid: [""]
    });

    this.followupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: ["", Validators.required],
      isMissed: [false],
      customersId: []
    });

    this.closeFollowupForm = this.fb.group({
      followUpId: [""],
      remarks: ["", Validators.required]
    });

    this.remarkFollowupForm = this.fb.group({
      cafFollowUpId: [""],
      remark: ["", Validators.required]
    });

    this.reFollowupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: [""],
      isMissed: [false],
      customersId: [],
      remarksTemp: ["", Validators.required]
    });

    // Change Plan
    this.changePlanForm = this.fb.group({
      purchaseType: ["", Validators.required],
      planId: ["", Validators.required],
      planGroupId: ["", Validators.required],
      planList: [""],
      isPaymentReceived: ["false"],
      remarks: ["", Validators.required],
      paymentOwnerId: [""],
      billableCustomerId: [""],
      discountTypeData: [""],
      discount: [""],
      recordPaymentDTO: this.fb.group({
        paymentAmount: ["", Validators.required],
        paymentDate: ["", Validators.required],
        paymentMode: ["", Validators.required],
        referenceNo: ["", Validators.required],
        chequeNo: ["", Validators.required],
        bankName: ["", Validators.required],
        chequeDate: ["", Validators.required],
        branch: ["", Validators.required],
        remarks: ["", Validators.required]
        // tdsDeducted: ['', Validators.required],
        // tdsAmount: ['', Validators.required],
      }),
      addonStartDate: [this.currentData],
      ChangePlanCategory: [""]
    });
    this.staffSelectList.push({
      id: Number(localStorage.getItem("userId")),
      name: localStorage.getItem("loginUserName")
    });
    this.changePlanForm.patchValue({
      paymentOwnerId: Number(localStorage.getItem("userId"))
    });
    this.childPlanRenewArray = this.fb.array([]);
    this.changePlanForm.get("planGroupId").disable();
    this.changePlanForm.get("planList").disable();
    this.changePlanForm.get("recordPaymentDTO").disable();

    this.chargenewPlanForm = this.fb.group({
      plancharge: ["", Validators.required]
    });

    this.chargeChildGroupForm = this.fb.group({
      chargeid: ["", Validators.required],
      validity: ["", Validators.required],
      price: ["", Validators.required],
      actualprice: ["", Validators.required],
      charge_date: ["", Validators.required],
      type: ["", Validators.required],
      planid: ["", Validators.required],
      unitsOfValidity: ["", Validators.required],
      billingCycle: [""],
      id: [""]
    });
    this.addChargeForm = this.fb.group({
      chargeAdd: [""]
    });
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
    this.overChargeChildListFromArray = this.fb.array([]);
    this.newPlanSelectArray = this.fb.array([]);
    this.changenewPlanForm = this.fb.group({
      ChangePlanCategory: ["", Validators.required]
    });
    // dropdown
    // if (this.statusCheckService.isActiveInventoryService) this.commondropdownService.getPOPList();
    // this.commondropdownService.getplanservice();this api will removed and go to customer create and edit
    // this.commondropdownService.getAllPinCodeNumber();
    // this.commondropdownService.getAllPinCodeData(); this api will removed and go to customer create and edit and shiftlocation
    // this.commondropdownService.getALLArea();
    // this.commondropdownService.getCommonListTitleData(); this api will removed by shivam
    // this.commondropdownService.getCommonListPaymentData();
    // this.commondropdownService.getIppoolData();this api will removed by shivam
    // this.commondropdownService.getPostpaidplanData(); this api will removed and go to customer create and edit and shiftlocation
    // this.commondropdownService.getCountryList();this api will removed and go to customer create and edit and shiftlocation
    // this.commondropdownService.getStateList();this api will removed and go to customer create and edit and shiftlocation
    // this.commondropdownService.getCityList();this api will removed and go to customer create and edit and shiftlocation
    // this.commondropdownService.getChargeForCustomer();this api will removed by shivam

    // this.commondropdownService.getchargeAll(); this api will removed by shivam
    //this.commondropdownService.getChargeTypeByList(); this api will removed and go to customer changeplan
    this.getCustomerStatus();
    // this.commondropdownService.findAllplanGroups(); this api will removed and go to customer create and edit
    // this.commondropdownService.getBillToData();
    // this.commondropdownService.getAllActiveBranch();
    // this.commondropdownService.getValleyTypee(); this api will removed and go to customer create and edit
    // this.commondropdownService.getInsideValley(); this api will removed and go to customer create and edit
    // this.commondropdownService.getOutsideValley(); this api will removed and go to customer create and edit
    // this.commondropdownService.getBankDetail();
    // this.commondropdownService.getBankDestinationDetail();
    // this.commondropdownService.getPlanPurchaseType(); this api will removed and go to customer change plan
    this.commondropdownService.getAllActiveStaff();
    this.commondropdownService.getTeamList();
    this.getCustomerType();
    // this.getCustomerSector(); this api will removed and go to customer create and edit
    // this.getBankDetail();
    // this.getBillToData();this api will removed and go to customer create and edit

    this.planCreationType();

    // this.commondropdownService.panNumberLength$.subscribe(panLength => {
    //   if (panLength) {
    //     this.customerGroupForm
    //       .get("pan")
    //       ?.setValidators([Validators.minLength(panLength), Validators.maxLength(panLength)]);
    //     this.customerGroupForm.get("pan")?.updateValueAndValidity();
    //   }
    // });

    // const serviceArea = localStorage.getItem("serviceArea");
    // const serviceAreaArray = JSON.parse(serviceArea);
    // if (serviceAreaArray.length !== 0) {
    //   this.mvnoId != 1 ? this.commondropdownService.getserviceAreaListForCafCustomer() : "";
    //   // this.commondropdownService.filterPartnerAll();
    // } else {
    //   this.mvnoId != 1 ? this.commondropdownService.getserviceAreaListForCafCustomer() : "";
    //   // this.commondropdownService.getpartnerAll();
    // }
    // this.mvnoId != 1 ? this.commondropdownService.getsystemconfigList() : "";
    // this.mvnoId != 1 ? this.getBankDestinationDetail() : "";

    // this.getpartnerAll();this api will removed and go to customer create and edit
    // this.productService.getAllProductByServiceId().subscribe((res: any) => {
    //   this.products = res.dataList;
    // });

    this.inventoryAssignForm.get("qty").valueChanges.subscribe(val => {
      const total = this.availableQty - val;
      if (total < 0) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }

      if (this.productHasMac == true && this.selectedMACAddress.length > val) {
        this.showQtySelectionError = true;
      } else {
        this.showQtySelectionError = false;
      }
    });

    // customer get data
    // this.billingSequence();this api will removed and go to customer create and edit
    // this.getcustomerList("");
    setTimeout(() => {
      this.selCustType();
    }, 3000);

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: "",
      status: RadiusConstants.CUSTOMER_STATUS.NEW_ACTIVATION,
      fromDate: "",
      toDate: ""
    };

    this.assignAppRejectShiftLocationForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.rejectLeadFormGroup = this.fb.group({
      leadMasterId: [""],
      rejectReasonId: ["", Validators.required],
      rejectSubReasonId: [""],
      remark: ["", Validators.required],
      leadStatus: ["Closed"]
    });
    // this.getrequiredDepartment();this api will removed and go to customer create and edit

    // this.customerStatusDetail = [
    //   {
    //     teamName: 'Opration',
    //     status: 'approved',
    //   },
    //   {
    //     teamName: 'Qa',
    //     status: 'approved',
    //   },
    //   {
    //     teamName: 'Payment',
    //     status: 'approved',
    //   },
    //   {
    //     teamName: 'Customer Care',
    //     status: 'inprogress',
    //   },
    //   {
    //     teamName: 'Parent Team',
    //     status: 'pending',
    //   },
    // ]

    // this.getAllLocation(); this api will removed and go to customer create and edit and location
    this.macMapppingListFromArray = this.fb.array([]);

    // Changes for Shift Location

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
    this.newShiftassignAppRejectShiftLocationForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.newShiftassignDocForm = this.fb.group({
      remark: ["", Validators.required]
    });
    // this.newShiftgetpartnerAll();this api will removed by shivam
    // if (this.statusCheckService.isActiveInventoryService) {
    //     this.commondropdownService.getPOPList();
    // }this api will removed and go to customer create and edit
    // this.commondropdownService.getCityList();
    // this.commondropdownService.getStateList();
    // this.commondropdownService.getCountryList();
    // this.commondropdownService.getChargeTypeByList();
    // this.commondropdownService.getChargeTypeByList();
    // this.commondropdownService.getAllPinCodeNumber();
    // this.commondropdownService.getAllPinCodeData();
    this.newShiftlocationFormRemark = this.fb.group({
      remark: [""]
    });
    // this.newShiftgetNewCustomerAddressForCustomer();

    const today = new Date();
    this.dateOfBirth = today.toISOString().split("T")[0];
    // this.checkPaymentGatewayConfiguration();this api will removed and go to customer invoice
    this.mpinForm = this.fb.group({
      countryCode: [""],
      mobileNumber: ["", [Validators.required, Validators.maxLength(10)]]
    });

    this.route.queryParams.subscribe(params => {
      let mobileno = params["mobilenumber"];
      if (mobileno) {
        this.searchOption = "mobile";
        this.searchDeatil = mobileno;
      } else {
        this.searchOption = "currentAssigneeName";
        this.searchDeatil = localStorage.getItem("loginUserName");
      }
      this.searchcustomer();
    });
    // this.getAllActiveStaffData();
    // this.getAllSubAreaData();this api will removed and go to customer create and edit
    // this.getAllBuildingData();this api will removed and go to customer create and edit
    // this.getMappingFrom();
    this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
      if (lengthObj) {
        this.mpinForm
          .get("mobileNumber")
          ?.setValidators([
            Validators.required,
            Validators.minLength(lengthObj.min),
            Validators.maxLength(lengthObj.max)
          ]);
        this.mpinForm.get("mobileNumber")?.updateValueAndValidity();
      }
    });
    // this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
    //   if (lengthObj) {
    //     this.customerGroupForm
    //       .get("mobile")
    //       ?.setValidators([
    //         Validators.required,
    //         Validators.minLength(lengthObj.min),
    //         Validators.maxLength(lengthObj.max)
    //       ]);
    //     this.customerGroupForm.get("mobile")?.updateValueAndValidity();
    //   }
    // });
    // this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
    //   if (lengthObj) {
    //     this.customerGroupForm
    //       .get("secondaryMobile")
    //       ?.setValidators([
    //         Validators.minLength(lengthObj.min),
    //         Validators.maxLength(lengthObj.max)
    //       ]);
    //     this.customerGroupForm.get("secondaryMobile")?.updateValueAndValidity();
    //   }
    // });
  }

  noSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.includes(" ")) {
      return { noSpace: true };
    }
    return null;
  }

  checkPaymentGatewayConfiguration() {
    this.spinner.show();
    this.customerdetailsilsService.getActivePaymentConfiguration().subscribe(
      (response: any) => {
        this.savedConfig = [];
        if (response.status == 204) {
          this.isPaymentGatewayConfigured = false;
        } else {
          var activeConfig = response.activePaymentConfig;
          var config = activeConfig.some(config => config.paymentConfigName == this.paymentGateway);
          this.savedConfig = activeConfig;
          const keyValuePairs: { [key: string]: any } = {};
          for (const config of this.savedConfig) {
            for (const mappingItem of config.paymentConfigMappingList) {
              keyValuePairs[mappingItem.paymentParameterName] = mappingItem.paymentParameterValue;
            }
          }
          this.paymentkeyValuePairs = keyValuePairs;
          this.isPaymentGatewayConfigured = config;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
        this.spinner.hide();
      }
    );
  }
  openPaymentGatewaysforInvoicePayment(invoice: any) {
    this.displayInvoicePaymentDialog = false;
    if (this.savedConfig.length === 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Payment Gateway Configuration Not Found!!!",
        icon: "far fa-times-circle"
      });
    } else if (this.savedConfig.length === 1) {
      if (this.savedConfig[0].paymentConfigName === "MoMo Pay") {
        this.spinner.show();
        this.buyMomoInvoicePayment(invoice);
      } else if (this.savedConfig[0].paymentConfigName === "AIRTEL") {
        this.spinner.show();
        this.airtelPayPlan(invoice);
      } else if (this.savedConfig[0].paymentConfigName === "MPESA") {
        this.displayMpesaOptionsDialog = true;
        this.invoiceForMpesa = invoice;
      } else if (this.savedConfig[0].paymentConfigName === "SELCOM") {
        this.spinner.show();
        this.selcomPayPlan(invoice);
      } else if (this.savedConfig[0].paymentConfigName === "Wave Pay") {
        this.spinner.show();
        this.buyWaveMoneyPayPlan(invoice);
      } else if (this.savedConfig[0].paymentConfigName == "ONEPAY") {
        this.spinner.show();
        this.buyOnePayInvoicePayment(this.invoice);
      } else if (this.savedConfig[0].paymentConfigName == "TRANSACTEASE") {
        this.spinner.show();
        this.getCustomerAddressDetails(this.invoice);
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Invoice payment is not available for this gateway.",
          icon: "far fa-times-circle"
        });
      }
    } else if (this.savedConfig.length >= 1) {
      this.invoice = invoice;
      this.displayInvoicePaymentDialog = true;
    }
  }
  invoicePayment(savedConfig: any) {
    this.invoicePaymentpaymentGateway(savedConfig);
  }
  invoicePaymentpaymentGateway(selectedConfig: any) {
    this.payMethod = selectedConfig.paymentConfigName;
    if (this.payMethod === "Wave Pay") {
      this.spinner.show();
      this.buyWaveMoneyPayPlan(this.invoice);
    } else if (this.payMethod === "KBZPAY") {
      this.spinner.show();
      this.buyKbzInvoicePayment(this.invoice);
    } else if (this.payMethod == "ONEPAY") {
      this.spinner.show();
      //   this.buyOnePayInvoicePayment(this.invoice);
      this.showMpinModal(this.invoice);
    } else if (this.payMethod == "TRANSACTEASE") {
      this.spinner.show();
      this.getCustomerAddressDetails();
    } else {
      this.showMpinModal(this.invoice);
    }
  }
  buyOnePayInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      //   isBuyPlan: true,
      merchantName: "ONEPAY",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      payerMobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerDetailData.buId
    };
    this.customerdetailsilsService.buyPlanUsingOnePay(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        // localStorage.setItem("transactionId", response.data.data.orderId),
        this.paymentConfirmationModal = true;
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.exitBuy = false;
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.responseCode === 200 && response.data) {
          const paymentLink = response.data;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.data.message,
            icon: "far fa-times-circle"
          });
          //   window.open(paymentLink, "_blank");
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }
  invoicePaymentGateway() {
    if (this.payMethod === "MoMo Pay") {
      this.spinner.show();
      this.buyMomoInvoicePayment(this.invoice);
    } else if (this.payMethod === "AIRTEL") {
      this.spinner.show();
      this.airtelPayPlan(this.invoice);
    } else if (this.payMethod === "MPESA") {
      this.displayMpesaOptionsDialog = true;
      this.invoiceForMpesa = this.invoice;
    } else if (this.payMethod === "SELCOM") {
      this.spinner.show();
      this.selcomPayPlan(this.invoice);
    } else if (this.payMethod === "ONEPAY") {
      this.spinner.show();
      this.buyOnePayInvoicePayment(this.invoice);
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Invoice payment is not available for this gateway.",
        icon: "far fa-times-circle"
      });
    }
  }

  onKeymobileNumberlength(event) {
    const str = this.mpinForm.value.mobileNumber.toString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (mobilenumberlength === 0 || mobilenumberlength === null) {
      mobilenumberlength = 10;
    }
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobileNumber = `${mobilenumberlength} character required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobileNumber = "";
    } else {
      this.inputMobileNumber = `${mobilenumberlength} character required.`;
    }
  }

  mobileError: boolean = false;

  onInputMobile(event: any) {
    const inputElement = event.target as HTMLInputElement;

    inputElement.value = inputElement.value.replace(/[^0-9]/g, "");

    if (inputElement.value.startsWith("0")) {
      this.mobileError = true;
    } else {
      this.mobileError = false;
    }
  }

  showMpinModal(invoice) {
    this.spinner.hide();
    this.displayInvoicePaymentDialog = false;
    this.mpinModal = true;
    this.momoPayinvoice = invoice;
    this.mpinForm.controls.countryCode.setValue(this.customerDetailData.countryCode);
    this.mpinForm.controls.mobileNumber.setValue(this.customerDetailData.mobile);
    // this.mpinForm.controls.mobileNumber.reset();
  }

  hideMpinModal() {
    this.isMpinFormSubmitted = false;
    this.mpinForm.reset();
    this.mpinForm.controls.countryCode.setValue("");
    this.mpinForm.controls.mobileNumber.setValue("");
    // this.mpinForm.updateValueAndValidity();
    this.mpinModal = false;
    this.mobileError = false;
    this.inputMobileNumber = "";
  }
  buyMomoInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      merchantName: "MoMo Pay",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      planId: null,
      hash: null
    };
    this.customerdetailsilsService.buyPlanUsingMomoInvoice(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        (localStorage.setItem("transactionId", response.data.data.orderId),
          (this.paymentConfirmationModal = true));
        this.isMpinFormSubmitted = false;
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.mobileError = false;
        this.inputMobileNumber = "";
        this.exitBuy = false;

        // this.subscription2 = this.obs1$.subscribe(d => {
        //   if (this.paymentstatusCount > 0) {
        //     this.paymentstatusCount = this.paymentstatusCount - 1;
        //     this.getStatusSuccessByMomo("SUCCESSFUL");
        //     if (this.transactionStatus === true) {
        //       this.subscription2.unsubscribe();
        //     }
        //   }
        //   if (this.paymentstatusCount == 0) {
        //     this.subscription2.unsubscribe();
        //   }
        // });
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }
  getStatusSuccessByMomo(status) {
    this.spinner.hide();
    let data = {
      orderId: localStorage.getItem("transactionId"),
      status: status
    };
    this.customerdetailsilsService.getIntigrationTransactionstatusInvoice(data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (response.data.istransactionsuccess === "true") {
            this.transactionStatus = response.istransactionsuccess;
            let data = {
              userName: this.customerLedgerData.username,
              password: this.customerLedgerData.password
            };
            // this.getDevice(data);
            this.paymentConfirmationModal = false;
            this.subscription2.unsubscribe();
            this.paymentSucessModel = true;
          }
        }
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
  hidepaymentConfirmDialog() {
    this.paymentConfirmationModal = false;
    this.displayInvoicePaymentDialog = false;
  }
  hidepaymentSucessDialog() {
    this.paymentSucessModel = false;
  }
  airtelPayPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      merchantName: "AIRTEL",
      customerUserName: this.customerDetailData.username,
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber: this.mpinForm.value.mobileNumber ?? "",
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      planId: null,
      hash: null,
      accountNumber: this.customerDetailData?.acctno ?? ""
    };
    this.customerdetailsilsService.buyPlanUsingAirtelInvoice(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.isMpinFormSubmitted = false;
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.mobileError = false;
        this.inputMobileNumber = "";
        //localStorage.setItem("transactionId"),
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        }
        (localStorage.setItem("transactionId", response.data.data.transaction.id),
          (this.paymentConfirmationModal = true));
        this.exitBuy = false;

        // this.subscription2 = this.obs1$.subscribe(d => {
        //     if (this.paymentstatusCount > 0) {
        //         this.paymentstatusCount = this.paymentstatusCount - 1;
        //         this.getStatusSuccessByMomo("SUCCESSFUL");
        //         if (this.transactionStatus === true) {
        //             this.subscription2.unsubscribe();
        //         }
        //     }
        //     if (this.paymentstatusCount == 0) {
        //         this.subscription2.unsubscribe();
        //     }
        // });
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }
  selcomPayPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let customerPaymentDTO = {
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      buid: this.customerDetailData.buId,
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      customerId: this.customerDetailData.id,
      customerUUID: uuid.v4(),
      customerUserName: this.customerDetailData.username,
      invoiceId: invoice.id,
      isBuyPlan: true,
      isFromCaptive: true,
      merchantName: "SELCOM",
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      mvnoId: this.customerDetailData.mvnoId,
      orderId: null,
      partnerId: this.customerDetailData.partnerid,
      partnerPaymentId: this.customerDetailData.partnerPaymentId ?? null,
      planId: this.customerDetailData.planMappingList[0].planId,
      requestFor: this.customerDetailData.requestFor ?? null,
      status: this.customerDetailData.status
    };
    let selcomPayPayment = {
      vendor: "",
      order_id: null,
      buyer_email: this.customerDetailData.email,
      buyer_name: this.customerDetailData.username,
      buyer_phone:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      gateway_buyer_uuid: "",
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      currency: "",
      payment_methods: "",
      "billing.firstname": this.customerDetailData.firstname ?? "",
      "billing.lastname": this.customerDetailData.lastname ?? "",
      "billing.address_1": this.customerDetailData?.addressList[0]?.landmark ?? "",
      "billing.city": this.presentAdressDATA.cityName ?? "",
      "billing.state_or_region": this.presentAdressDATA.stateName ?? "",
      "billing.country": this.presentAdressDATA.countryName ?? "",
      "billing.phone":
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      no_of_items: 1,
      webhook: ""
    };
    let data = {
      customerPaymentDTO: customerPaymentDTO,
      selcomPayPayment: selcomPayPayment
    };
    this.customerdetailsilsService.buyPlanUsingSelcom(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.isMpinFormSubmitted = false;
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.mobileError = false;
        this.inputMobileNumber = "";
        //localStorage.setItem("transactionId"),
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.responseCode === 200 && response.data && response.data.data) {
          const paymentLink = response.data.data;
          window.open(paymentLink, "_blank");
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  buyWaveMoneyPayPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      isBuyPlan: true,
      merchantName: "Wave Pay",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerDetailData.buId,
      //   planId: this.customerDetailData.planMappingList[0].planId
      planId: null //as per keval suggested
    };
    this.customerdetailsilsService.buyPlanUsingWaveMoney(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        // localStorage.setItem("transactionId", response.data.data.orderId),
        this.paymentConfirmationModal = true;
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.exitBuy = false;
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.responseCode === 200 && response.data) {
          const paymentLink = response.data;
          window.open(paymentLink, "_blank");
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getAllLocation() {
    this.locationService.getAllActiveLocation().subscribe((response: any) => {
      this.locationDataByPlan = response.locationMasterList.map(location => ({
        name: location.name,
        locationMasterId: location.locationMasterId
      }));
    });
  }

  getBankDetail() {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerGroupForm.value.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/bankManagement/searchByStatus?mvnoId=" + mvnoId;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
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
  getCustomerPaymentRecord() {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerDetailData?.mvnoId
          ? this.customerDetailData?.mvnoId
          : localStorage.getItem("mvnoId")
        : localStorage.getItem("mvnoId");
    this.displayRecordPaymentDialog = true;
    this.minToday = new Date().toISOString().split("T")[0];
    const url = "/customers/list?mvnoId=" + mvnoId;
    const custerlist = {};
    this.recordPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        this.paymentFormGroup.patchValue({
          customerid: this.customerIdRecord
        });
        this.openStaffWallet();
        this.systemService.getConfigurationByName("STAFF_WALLET_LIMIT").subscribe((res: any) => {
          this.staffWalletLimit = res?.data ? Number(res?.data?.value) : 0;
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

  modalOpenInvoice(id) {
    this.displaySelectInvoiceDialog = true;
    this.isDisplayConvertedAmount = false;
    this.collectedCurrency = this.customerDetailData?.currency
      ? this.customerDetailData?.currency
      : this.systemConfigCurrency;
    if (id) {
      this.InvoiceListByCustomer(id);
    }
    this.newFirst = 0;
  }
  Amount: any = 0;

  bindInvoice() {
    this.convertedExchangeRate = this.apiExchangeRate;
    this.selectedInvoice = this.checkedList;
    if (this.selectedInvoice.length >= 1) {
      this.isShowInvoiceList = true;
      this.Amount = 0;
      this.selectedInvoice.forEach(element => {
        if (element.testamount !== null) {
          this.Amount += parseFloat(element.testamount);
        }
      });
      this.paymentFormGroup.patchValue({
        invoiceId: this.selectedInvoice.map(item => item.id),
        amount: this.Amount.toFixed(2)
      });
      this.onChangeOFAmountTest(this.selectedInvoice);
      this.destinationbank = true;
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Please select at least one invoice or advance mode.",
        icon: "far fa-check-circle"
      });
    }
    if (this.selectedInvoice.length == 2) {
      this.selectedInvoice.forEach(element => {
        if (element.docnumber == "Advance") {
          this.selectedInvoice = [];
          this.invoiceList.forEach(element => {
            element.isSelected = false;
          });
          this.masterSelected = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please select advance mode value only.",
            icon: "far fa-check-circle"
          });
        }
      });
    }
    this.getPaymentApproval(this.selectedInvoice);
    this.displaySelectInvoiceDialog = false;
  }
  calculateTDS(event) {
    if (!event.target.checked) {
      this.paymentFormGroup.controls.tdsAmount.disable();
      this.paymentFormGroup.controls.tdsAmount.setValue(0);
    } else {
      this.paymentFormGroup.controls.tdsAmount.enable();
      this.onChangeOFAmount(this.paymentFormGroup.controls.amount.value);
    }
  }
  calculateABBS(event) {
    if (!event.target.checked) {
      this.paymentFormGroup.controls.abbsAmount.disable();
      this.paymentFormGroup.controls.abbsAmount.setValue(0);
    } else {
      this.paymentFormGroup.controls.abbsAmount.enable();
      this.onChangeOFAmount(this.paymentFormGroup.controls.amount.value);
    }
  }
  onChangeOFTDS(event) {
    let tdsAmount = event;
    let abbsAmount = this.paymentFormGroup.controls.abbsAmount.value;
    let totalAmount = this.paymentFormGroup.controls.amount.value;
    let diff = totalAmount - abbsAmount - tdsAmount;

    if (diff < 0 && tdsAmount != 0) {
      this.paymentFormGroup.controls.tdsAmount.setValue(0);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "TDS/ABBS total can not be greater than amount.",
        icon: "far fa-check-circle"
      });
    }
  }
  onChangeOFABBS(event) {
    let abbsAmount = event;
    let tdsAmount = this.paymentFormGroup.controls.tdsAmount.value;
    let totalAmount = this.paymentFormGroup.controls.amount.value;
    let diff = totalAmount - abbsAmount - tdsAmount;

    if (diff < 0 && abbsAmount != 0) {
      this.paymentFormGroup.controls.abbsAmount.setValue(0);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "TDS/ABBS total can not be greater than amount.",
        icon: "far fa-check-circle"
      });
    }
  }

  onChangeOFAmount(event) {
    let tdsAmount = (event * this.tdsPercent) / 100;
    let abbsAmount = (event * this.abbsPercent) / 100;

    // let tdsAmount = 0;
    // let abbsAmount = 0;
    // this.checkedList.forEach(element => {
    //   tdsAmount += element.includeTds ? (element.totalamount * this.tdsPercent) / 100 : 0;
    //   abbsAmount += element.includeAbbs ? (element.totalamount * this.abbsPercent) / 100 : 0;
    // });
    if (!this.paymentFormGroup.controls.abbsAmount.disabled) {
      this.paymentFormGroup.controls.abbsAmount.setValue(abbsAmount);
    }
    if (!this.paymentFormGroup.controls.tdsAmount.disabled) {
      this.paymentFormGroup.controls.tdsAmount.setValue(tdsAmount);
    }
  }
  isAllSelectedInvoice() {
    this.masterSelected = this.invoiceList.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemListInvoice();
  }
  checkUncheckAllInvoice() {
    for (let i = 0; i < this.invoiceList.length; i++) {
      this.invoiceList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemListInvoice();
  }
  getCheckedItemListInvoice() {
    this.checkedList = [];
    for (let i = 0; i < this.invoiceList.length; i++) {
      if (this.invoiceList[i].isSelected) {
        this.checkedList.push(this.invoiceList[i]);
      }
    }
  }

  resetPayMode() {
    this.paymentFormGroup.get("chequeno")?.reset();
    this.paymentFormGroup.get("chequedate")?.reset();
    this.paymentFormGroup.get("bankManagement")?.reset();
    this.paymentFormGroup.get("branch")?.reset();
    this.paymentFormGroup.get("destinationBank")?.reset();
    this.paymentFormGroup.controls.chequeno.disable();
    this.paymentFormGroup.controls.chequedate.disable();
    this.paymentFormGroup.controls.bankManagement.disable();
    this.paymentFormGroup.controls.branch.disable();
    this.paymentFormGroup.controls.destinationBank.disable();
    this.paymentFormGroup.controls.reciptNo.enable();
    this.chequeDateName = "Cheque Date";
    this.paymentFormGroup.controls.referenceno.setValidators([]);
    this.paymentFormGroup.controls.chequedate.setValidators([]);
    this.paymentFormGroup.controls.destinationBank.setValidators([]);
    this.paymentFormGroup.controls.bankManagement.setValidators([]);
    this.paymentFormGroup.controls.chequeno.setValidators([]);
    this.paymentFormGroup.controls.onlinesource.setValidators([]);
    this.paymentFormGroup.updateValueAndValidity();
  }

  selPayModeRecord(event) {
    this.resetPayMode();
    this.paymentFormGroup.patchValue({
      chequeno: null,
      chequedate: null,
      branch: null
    });
    const payMode = event.value.toLowerCase();
    if (payMode == "POS".toLowerCase() || payMode == "VatReceiveable".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "Online".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.referenceno.setValidators([Validators.required]);
      this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "Direct Deposit".toLowerCase()) {
      this.paymentFormGroup.controls.branch.enable();
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.destinationBank.enable();
      this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
      this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
      this.paymentFormGroup.get("reciptNo")?.reset();
      this.paymentFormGroup.controls.reciptNo.disable();
      this.paymentFormGroup.controls.reciptNo.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "NEFT_RTGS".toLowerCase()) {
      this.paymentFormGroup.controls.bankManagement.enable();
      this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
      this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
      this.paymentFormGroup.controls.destinationBank.enable();
      this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
      this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
    } else if (payMode == "Cheque".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.bankManagement.enable();
      this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
      this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
      this.paymentFormGroup.controls.chequeno.enable();
      this.paymentFormGroup.controls.chequeno.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
      this.paymentFormGroup.controls.branch.enable();
    }
    this.commondropdownService.getOnlineSourceData(payMode.toLowerCase());
    if (this.commondropdownService.onlineSourceData.length > 0) {
      this.paymentFormGroup.controls.onlinesource.setValidators([Validators.required]);
      this.paymentFormGroup.controls.onlinesource.updateValueAndValidity();
    }
    const url = "/commonList/generic/" + payMode;
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.onlineSourceData = response.dataList;
        this.paymentFormGroup.patchValue({
          onlinesource: ""
        });
        if (this.onlineSourceData.length > 0) {
          this.paymentFormGroup.controls.onlinesource.setValidators([Validators.required]);
          this.paymentFormGroup.controls.onlinesource.updateValueAndValidity();
        } else {
          this.paymentFormGroup.controls.onlinesource.clearValidators();
          this.paymentFormGroup.controls.onlinesource.updateValueAndValidity();
        }
        this.paymentFormGroup.updateValueAndValidity();
      },
      (error: any) => {
        this.onlineSourceData = [];
      }
    );
    this.paymentFormGroup.updateValueAndValidity();
    let isAbbsTdsMode = this.checkPaymentMode(payMode);
    if (isAbbsTdsMode) {
      this.paymentFormGroup.patchValue({
        tdsAmount: 0,
        abbsAmount: 0
      });
      if (this.selectedInvoice.length > 0) {
        this.selectedInvoice.map(element => {
          element.tds = 0;
          element.abbs = 0;
        });
      }
    }
  }

  selPaySourceRecord(event) {
    const paySource = event.value.toLowerCase();

    switch (paySource) {
      case "cash_via_bank":
        this.paymentFormGroup.controls.destinationBank.enable();
        this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
        this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
        this.paymentFormGroup.controls.branch.enable();
        break;
      case "cash_in_hand":
        this.paymentFormGroup.get("destinationBank")?.reset();
        this.paymentFormGroup.controls.destinationBank.disable();
        this.paymentFormGroup.controls.destinationBank.clearValidators();
        this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
        this.paymentFormGroup.get("branch")?.reset();
        this.paymentFormGroup.controls.branch.disable();
        this.paymentFormGroup.controls.branch.clearValidators();
        this.paymentFormGroup.controls.branch.updateValueAndValidity();
        break;
      case "cheque_in_hand":
        this.paymentFormGroup.controls.chequedate.enable();
        this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
        this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
        this.paymentFormGroup.controls.bankManagement.enable();
        this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
        this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
        this.paymentFormGroup.controls.chequeno.enable();
        this.paymentFormGroup.controls.chequeno.setValidators([Validators.required]);
        // this.paymentFormGroup.controls.referenceno.clearValidators();
        // this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
        this.paymentFormGroup.controls.reciptNo.enable();
        this.paymentFormGroup.controls.branch.enable();
        this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
        break;
    }
  }
  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  addPayment(paymentId) {
    this.submitted = true;
    if (this.paymentFormGroup.valid) {
      let totalAmount = Number(this.WalletDataAmount) + Number(this.paymentFormGroup?.value.amount);
      if (this.paymentFormGroup.value.invoiceId == 0) {
        this.paymentFormGroup.value.paytype = "advance";
      } else {
        this.paymentFormGroup.value.paytype = "invoice";
      }

      if (this.selectedInvoice.length == 0) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please select atleat one invoice or advance mode.",
          icon: "far fa-check-circle"
        });
        return;
      }
      const maxSize = 1048576; // 1MB
      if (this.file && this.file.size > maxSize) {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "File size cannot exceed 1MB.",
          icon: "far fa-info-circle"
        });
        return;
      } else {
        if (this.staffWalletLimit < totalAmount) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Staff balance exceeds the threshold. Please clear the balance first",
            icon: "far fa-check-circle"
          });
          return;
        } else {
          let mvnoId =
            localStorage.getItem("mvnoId") == "1"
              ? this.customerGroupForm.value?.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          const url = "/record/payment?mvnoId=" + mvnoId;
          this.paymentFormGroup.value.customerid = this.customerDetailData.id;
          this.paymentFormGroup.value.type = "Payment";
          this.createPaymentData = this.paymentFormGroup.value;
          this.createPaymentData.onlinesource = this.paymentFormGroup.controls.onlinesource.value;
          if (this.paymentFormGroup.controls.chequedate.value) {
            this.createPaymentData.chequedate = this.paymentFormGroup.controls.chequedate.value;
            this.createPaymentData.chequedatestr = this.paymentFormGroup.controls.chequedate.value;
          }
          this.createPaymentData.filename = this.fileName;
          let invoiceId = [];
          this.selectedInvoice.forEach(element => {
            invoiceId.push(element.id);
          });
          this.createPaymentData.invoiceId = invoiceId;
          // this.createPaymentData.invoices = invoices;
          delete this.createPaymentData.file;
          const formData = new FormData();
          var paymentListPojos = [];
          this.selectedInvoice.forEach(element => {
            let data = {
              tdsAmountAgainstInvoice: element.tds,
              abbsAmountAgainstInvoice: element.abbs,
              amountAgainstInvoice: element.testamount,
              invoiceId: element.id
            };
            paymentListPojos.push(data);
          });
          this.createPaymentData.paymentListPojos = paymentListPojos;
          formData.append("file", this.file);
          formData.append("spojo", JSON.stringify(this.createPaymentData));
          this.revenueManagementService.postMethod(url, formData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.destinationbank = false;
              this.paymentFormGroup.reset();
              this.openCustomersPaymentData(this.customerId, "");
              this.currentPagecustomerPaymentdata = 1;
              this.invoiceList = [];
              this.file = "";
              this.fileName = null;
              this.isShowInvoiceList = false;
              this.messageService.add({
                severity: "success",
                summary: "Payment Created Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.displayRecordPaymentDialog = false;
              this.selectedInvoice = [];
            },
            (error: any) => {
              if (error.error.status === 409) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: error.error.ERROR,
                  icon: "far fa-times-circle"
                });
              } else {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: error.error.ERROR,
                  icon: "far fa-times-circle"
                });
              }
            }
          );
        }
      }
    }
    this.displayRecordPaymentDialog = false;
  }

  getPendingAmount(item) {
    var amount = 0;
    if (item.adjustedAmount) {
      amount = item.totalamount - item.adjustedAmount;
    } else if (item.pendingAmt) {
      amount = item.totalamount - item.pendingAmt;
    } else if (item.adjustedAmount) {
      amount = item.totalamount - item.adjustedAmount;
    } else {
      amount = item.totalamount;
    }
    if (amount) return amount.toFixed(2);
    else return 0;
  }
  getLoggedinUserData() {
    const staffId = localStorage.getItem("userId");
    this.staffUserId = Number(localStorage.getItem("userId"));

    this.loggedInUser = localStorage.getItem("loggedInUser");

    this.staffService.getById(staffId).subscribe(
      (response: any) => {
        this.staffUser = response.Staff;
        this.userName = this.staffUser.username;
        //  this.customerGroupForm.value.username = this.staffUser.username;

        // console.log("username", this.staffUser.username);
        // if (["Admin"].some(role => this.staffUser.roleName.includes(role))) {
        //   this.isAdmin = true;
        // } else {
        //   // this.customerGroupForm.get('serviceAreaId').setValue(response.Staff.servicearea.id);
        //   this.isAdmin = false;
        // }
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
  isParantExpirenceEdit: boolean;
  createCustomerCaf() {
    // this.commondropdownService.getplanservice();
    // this.commondropdownService.getPostpaidplanData();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
    this.commondropdownService.getValleyTypee();
    this.commondropdownService.getInsideValley();
    this.commondropdownService.getOutsideValley();
    this.commondropdownService.getCustomerCategory();
    this.commondropdownService.getTitle();
    this.getCustomerSector();
    this.getBillToData();
    this.getpartnerAll();
    this.billingSequence();
    this.getrequiredDepartment();
    this.getAllLocation();
    if (this.statusCheckService.isActiveInventoryService) {
      this.commondropdownService.getPOPList();
    }
    this.listView = false;
    this.createView = true;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    // this.listSearchView = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = false;
    this.customerChangePlan = false;
    this.submitted = false;
    this.plansubmitted = false;
    this.iscustomerEdit = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.iflocationFill = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.ifcustomerDiscountField = false;
    this.isParantExpirenceEdit = false;
    this.payMappingListFromArray.controls = [];
    this.overChargeListFromArray.controls = [];
    this.custMacMapppingListFromArray.controls = [];
    this.isCallDetails = false;

    this.ifIndividualPlan = false;
    this.ifPlanGroup = false;
    this.planCategoryForm.reset();
    this.customerFormReset();

    this.planGroupForm.controls.service.enable();
    this.planGroupForm.controls.planId.enable();
    this.planGroupForm.controls.validity.enable();
    this.customerGroupForm.controls.username.enable();
    this.customerGroupForm.controls.loginUsername.enable();
    this.customerGroupForm.controls.invoiceType.disable();
    this.customerGroupForm.controls.parentExperience.disable();
    this.planGroupForm.controls.invoiceType.disable();
    this.customerGroupForm.controls.dunningSubType.disable();
    this.customerGroupForm.controls.dunningSubSector.disable();
    this.serviceAreaDisable = false;
    this.viewcustomerListData = [];
    this.addressListData = [];
    this.shiftLocationEvent = false;
    this.customerGroupForm.controls.calendarType.setValue("English");
    this.customerGroupForm.controls.custlabel.setValue("customer");
    this.householdType = "residential";
    this.customerGroupForm.patchValue({
      countryCode: this.commondropdownService.commonCountryCode
    });
    this.serviceareaCheck = true;
    this.selCustType();
    if (this.custType === RadiusConstants.CUSTOMER_TYPE.POSTPAID) {
      this.daySequence();
      this.earlyDaySequence();
    }
    // if (!this.isAdmin) {
    //   this.customerGroupForm.patchValue({
    //     serviceareaid: this.staffUser.serviceAreaId,
    //   });
    // }

    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.FinalAmountList = [];
    this.ifplanisSubisuSelect = false;
    // this.getDevicesByType("OLT");
    // this.getDevicesByType("SN Splitter");
    // this.getDevicesByType("DN Splitter");
    // this.getDevicesByType("Master DB/DB");
    this.commondropdownService.getAllPinCodeData();
    this.getAllPinCodeData();
    this.getALLAreaData();
    this.getAllSubAreaData();
    // this.getAllBuildingData();
    this.getMappingFrom();
    this.customerGroupForm.get("isPasswordAutoGenerated")?.setValue(true);
    this.customerGroupForm.get("isPasswordAutoGenerated")?.valueChanges.subscribe(value => {
      this.isAutoGeneratedPassword = value;
    });
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
    this.AreaListDD = [];
    const url = "/area/all";
    this.areaManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.AreaListDD = response.dataList;
        // console.log("areaData", this.areaData);
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
          // this.subAreaListDD = response.dataList;
        }
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

  // getAllBuildingData() {
  //     this.buildingListDD = [];
  //     const url = "/buildingmgmt/all";
  //     this.areaManagementService.getMethod(url).subscribe(
  //         (response: any) => {
  //             this.buildingListDD = response.dataList;
  //             // console.log("areaData", this.areaData);
  //         },
  //         (error: any) => {
  //             // this.messageService.add({
  //             //   severity: 'error',
  //             //   summary: 'Error',
  //             //   detail: error.error.ERROR,
  //             //   icon: 'far fa-times-circle',
  //             // })
  //         }
  //     );
  // }

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

  onAddIPList() {
    if (this.ipManagementGroup.valid) {
      this.ipMapppingListFromArray.push(this.ipListFormGroup());
      this.ipManagementGroup.reset();
    }
  }
  onAdddisplayIPList() {
    if (this.ipdisplayManagementGroup.valid) {
      this.ipMapppingdisplayListFromArray.push(this.ipListFormGroup());
      this.ipdisplayManagementGroup.reset();
    } else {
    }
  }
  addMac() {
    this.onAddIPList();
    this.createMac = true;
  }
  closeaddMac() {
    this.createMac = false;
  }
  saveIp() {
    this.createIp = false;
    const url = "/customerIpManagement/save";
    const formArrayData = this.flattenFormArray(this.ipMapppingListFromArray);
    this.customerService.saveIps(url, formArrayData).subscribe(
      (response: any) => {
        this.ipMapppingListFromArray = this.fb.array([]);
        this.getAllIp();
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

  editIpById(record, index: number) {
    this.editmode = true;
    this.displaymode = false;
    this.editingIndex = index;
    this.currentEditRecord = record;
    this.editingRecord = { ...this.ipListData[index] };
  }

  saveChanges() {
    if (this.editingRecord) {
      const updatedRecords: { custid: any; ipAddress: any; ipType: any; custsermappingid: any }[] =
        [
          {
            custid: this.editingRecord.custid,
            ipAddress: this.editingRecord.ipAddress,
            ipType: this.editingRecord.ipType,
            custsermappingid: this.editingRecord.custsermappingid
          }
        ];

      const url = "/customerIpManagement/update";
      this.customerService.updateIps(url, updatedRecords).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "IP Address updated successfully",
              icon: "far fa-check-circle"
            });
            this.getAllIp();
          }
          //   const index = this.ipListData.findIndex(
          //     ip => ip.custsermappingid === updatedRecords[0].custsermappingid
          //   );
          //   if (index !== -1) {
          //     this.ipListData[index] = updatedRecords[0];
          //   }
        },
        (error: any) => {
          // Handle error
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
      this.displaymode = true;
      this.editingIndex = null;
    }

    this.editmode = false;
    this.editingRecord = {};
  }
  cancelChangesMac() {
    this.displaymode = true;
    this.editingRecord = {};
    this.editingIndex = null;
  }

  getAllIp() {
    const url = "/customerIpManagement/getIpsByCustId?custId=" + this.customerId;
    this.customerService.getAllIps(url).subscribe(
      (response: any) => {
        this.ipListData = response.customerIps;
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

  deleteConfirmMac(id) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Mac?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteMac(id);
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
  addIp() {
    this.onAddmacList();
    this.createIp = true;
    this.macSubmitted = false;
  }
  closeaddIp() {
    this.createIp = false;
    this.macMapppingListFromArray = this.fb.array([]);
  }
  flattenFormArray(formArray: FormArray): any[] {
    return formArray.controls.map((group: FormGroup) => {
      const formData = {};
      Object.keys(group.controls).forEach(key => {
        formData[key] = group.controls[key].value;
      });
      return formData;
    });
  }
  saveMac() {
    this.createIp = false;
    const url = "/customerMacManagement/save";
    const formArrayData = this.flattenFormArray(this.macMapppingListFromArray);
    this.customerService.saveMacs(url, formArrayData).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.macMapppingListFromArray = this.fb.array([]);
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.macMapppingListFromArray = this.fb.array([]);
          this.createMac = false;
          this.getAllMac();
        }
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

  editMacById(record, index: number) {
    this.editmode = true;
    this.displaymode = false;
    this.editingIndex = index;
    this.currentEditRecord = record;
    this.editingRecord = { ...this.macListData[index] };
  }

  saveChangesMac() {
    if (this.editingRecord) {
      const updatedRecords: {
        customer: any;
        macAddress: any;
        custsermappingid: any;
        id: any;
        isDeleted: any;
      } = {
        macAddress: this.editingRecord.macAddress,
        custsermappingid: this.editingRecord.custsermappingid,
        customer: {
          id: this.customerId
        },
        id: this.editingRecord.id,
        isDeleted: false
      };
      const url = "/customerMacManagement/update";
      this.customerService.updateMacs(url, updatedRecords).subscribe(
        (response: any) => {
          this.getAllMac();
          if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "MAC Address updated successfully",
              icon: "far fa-check-circle"
            });
          }

          //   const index = this.macListData.findIndex(
          //     mac => mac.custsermappingid === updatedRecords[0].custsermappingid
          //   );
          //   if (index !== -1) {
          //     this.macListData[index] = updatedRecords[0];
          //   }
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
      this.displaymode = true;
      this.editingIndex = null;
    }

    this.editmode = false;
    this.editingRecord = {};
  }
  cancelChanges() {
    this.displaymode = true;
    this.editingRecord = {};
    this.editingIndex = null;
  }

  getAllMac() {
    const url = "/customerMacManagement/findByCustId?custId=" + this.customerId;
    this.customerService.getAllMacs(url).subscribe(
      (response: any) => {
        this.macListData = response.dataList;
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

  deleteConfirm(id) {
    this.confirmationService.confirm({
      message: "Do you want to delete this IP?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteIp(id);
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

  deleteIp(id) {
    const url = "/customerIpManagement/delete?id=" + id;
    this.customerService.deleteIps(url).subscribe(
      (response: any) => {
        if (response.responseCode) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.getAllIp();
        }
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

  deleteMac(id) {
    const url = "/customerMacManagement/delete?custMacMapppingId=" + id;
    this.customerService.deleteMacs(url).subscribe(
      (response: any) => {
        this.getAllMac();
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Deleted Successfully",
          icon: "far fa-check-circle"
        });
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

  getService() {
    const url =
      "/subscriber/getPlanByCustService/" +
      this.customerId +
      "?isAllRequired=true&isNotChangePlan=true";
    this.customerService.getMethod(url).subscribe(
      (response: any) => {
        this.custId = response.dataList;
        this.service = response.dataList.map(item => item.service);
        this.custPlanMapppingId = response.dataList[0].customerServiceMappingId;
        this.dropdownOptions = response.dataList.map(item => ({
          label: item.service,
          value: item.customerServiceMappingId
        }));
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

  listCustomer() {
    this.listView = true;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    // this.listSearchView = true;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = false;
    this.customerChangePlan = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.iflocationFill = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.editCustomerId = "";
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
    if (this.searchOption) {
      this.searchOption = "currentAssigneeName";
      this.searchDeatil = localStorage.getItem("loginUserName");
      this.searchcustomer();
    } else {
      this.getcustomerList("");
    }
  }

  listdetalisCostomer() {
    this.listView = true;
    //  this.listSearchView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = false;
    this.customerChangePlan = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
  }

  customerDetailOpen(custId) {
    // this.getAllSubAreaData();
    // this.getAllBuildingData();
    this.custDetilsCustId = custId;
    this.listView = false;
    //  this.listSearchView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = true;
    // this.getCustomersLedger(custId);
    this.customerIdRecord = custId;
    this.getAllCustomerInventoryList(custId);
    this.getActivePlanListDetails(custId);
    this.getPaymentHistory(custId);
    this.getCustomersDetail(custId);
    this.getCustomerNetworkLocationDetail(custId);
    this.InvoiceListByCustomer(custId);
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.auditData = custId;
    this.isCallDetails = false;
    this.getCustQuotaList(custId);
    this.getNewCustomerAddressForCustomer(custId);
    this.GetAuditData(custId, "");
    // this.getFramedIpAddressIp();
    // this.commondropdownService.getAllPinCodeData();
    // this.getAllPinCodeData();
    // this.getALLAreaData();
    // this.getMappingFrom();
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

  customerLedgerOpen() {
    this.customerDetailData?.currency
      ? (this.currency = this.customerDetailData?.currency)
      : this.systemService
          .getConfigurationByName("CURRENCY_FOR_PAYMENT", this.customerDetailData?.mvnoId)
          .subscribe((res: any) => {
            this.currency = res.data.value;
          });
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.isCustomerLedgerOpen = true;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
  }

  openCustorUpdateDiscount(id) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = true;
    this.getcustDiscountDetails(id, "");
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
  }

  openCustomersPlan(id) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = true;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.getcustFuturePlan(id, "");
    this.getcustExpiredPlan(id, "");
    this.getcustCurrentPlan(id, "");
    this.getcustDiscountDetails(id, "");
    this.getTrailPlanList(this.customerId, "");
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
  }

  openCustomerStatus(id) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.getCustomerTeamHierarchy(id);
    this.workflowID = id;
    this.getworkflowAuditDetails("", id, "CAF");
    this.customerStatusView = true;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
  }
  openipManagement(id) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.workflowID = id;
    this.customerStatusView = false;
    this.ipManagementView = true;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
    this.getAllIp();
    this.getService();
  }

  openCustomerCafNotes(id) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.workflowID = id;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = true;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
    this.getAllCustomerNotes();
    // this.getService();
  }
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  staffDetailModal: boolean = false;
  addNotesForm: FormGroup;

  custIdForNotes: any;
  addNotesPopup: boolean = false;
  notesSubmitted: boolean = false;
  addNotesData: CustNotes;
  addNotesSetFunction(custId: any) {
    this.addNotesPopup = true;
    this.custIdForNotes = custId;
    this.addNotesForm.reset();
    this.notesSubmitted = false;
  }
  closeNotesModal() {
    this.addNotesPopup = false;
    this.addNotesForm.reset();
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
                  this.getcustomerList("");
                } else {
                  this.searchcustomer();
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
        severity: "info",
        summary: "Info",
        detail: "Required column is missing!",
        icon: "far fa-times-circle"
      });
      this.addNotesPopup = true;
    }
  }

  getAllCustomerNotes() {
    const url = `/findAllCustomerNotesWithPagination/${this.customerId}?page=${this.currentPage}&pageSize=${this.itemsPerPage}`;
    this.customerNotesList = [];
    this.customerManagementService.getMethodForCustomerNotes(url).subscribe(
      async (response: any) => {
        if (response?.customerNotesList?.length === 0) {
          this.customerNotesList = [];
          this.totalRecords = 0;
        } else {
          this.customerNotesList = (await response.customerNotesList?.content) || [];
          this.totalRecords = (await response?.customerNotesList?.totalElements) || 0;
        }
      },
      (error: any) => {
        this.customerNotesList = [];
        this.totalRecords = 0;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.msg || "Failed to fetch customer notes",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangeEventForChildCustomers(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getAllCustomerNotes();
  }

  itemPerPageChangeEvent(event) {
    this.currentPage = 1;
    this.itemsPerPage = Number(event.value);
    this.getAllCustomerNotes();
  }

  closeModalStaff() {
    this.staffDetailModal = false;
  }

  serviceAreaDetailModal: boolean = false;
  serviceAreaList: any = [];
  branchId: any;

  getServiceByBranch(e) {
    this.branchId = e.value;
    this.serviceareaCheck = false;
    const url = "/findServiceAreaByBranchId?BranchId=" + this.branchId;
    this.adoptCommonBaseService.getConnection(url).subscribe((response: any) => {
      this.serviceAreaList = response.serviceAreaList;
      //$("#PlanDetailsShow").modal("show");
    });
  }

  onClickServiceArea() {
    this.serviceAreaList = this.staffData.serviceAreasNameList;
    this.serviceAreaDetailModal = true;
  }

  closeModalOfArea() {
    this.serviceAreaDetailModal = false;
  }

  openStaffDetailModal(staffId) {
    this.staffDetailModal = true;

    const url = "/getStaffUser/" + staffId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.staffData = response.Staff;
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

  openmacManagement(id) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.workflowID = id;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = true;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
    this.getAllMac();
    this.getService();
  }
  openMyInvoice(id) {
    this.checkPaymentGatewayConfiguration();
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = true;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.searchinvoiceMaster(id, "");
    this.customerUpdateDiscount = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
  }

  openInvoiceModal(invoice) {
    // this.invoiceDetailsService.show(id);

    this.isInvoiceDetail = true;
    this.invoiceID = invoice.id;
    this.custID = invoice.custid;
  }
  closeInvoiceDetails() {
    this.isInvoiceDetail = false;
    this.invoiceID = "";
    this.custID = 0;
  }
  closeInvoiceModel() {
    this.invoiceList = [];
    this.masterSelected = false;
    this.displaySelectInvoiceDialog = false;
  }

  openInvoicePaymentModal(id, invoiceId) {
    this.invoicePaymentListService.show(id);
    this.invoiceId.next({
      invoiceId
    });
  }

  pageChangedinvoiceMasterList(pageNumber) {
    this.currentPageinvoiceMasterSlab = pageNumber;
    this.searchinvoiceMaster("", "");
  }

  TotalItemPerPageInvoice(event) {
    this.showItemPerPageInvoice = Number(event.value);
    if (this.currentPageinvoiceMasterSlab > 1) {
      this.currentPageinvoiceMasterSlab = 1;
    }
    this.searchinvoiceMaster("", this.showItemPerPageInvoice);
  }

  searchinvoiceMaster(id, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.invoiceMasteritemsPerPage = size;
    } else {
      if (this.showItemPerPageInvoice == 1) {
        this.invoiceMasteritemsPerPage = this.pageITEM;
      } else {
        this.invoiceMasteritemsPerPage = this.showItemPerPageInvoice;
      }
    }

    let dtoData = {
      page: this.currentPageinvoiceMasterSlab,
      pageSize: this.invoiceMasteritemsPerPage
    };
    let url;

    // if (id) {
    //   this.searchInvoiceMasterFormGroup.value.billrunid = id
    //   this.searchInvoiceMasterFormGroup.patchValue({
    //     billrunid: Number(id),
    //   })
    // }

    this.searchInvoiceMasterFormGroup.value.custMobile = "";
    this.searchInvoiceMasterFormGroup.value.customerid = this.customerDetailData.id;

    url =
      "/trial/invoice/search?billrunid=" +
      this.searchInvoiceMasterFormGroup.value.billrunid +
      "&docnumber=" +
      this.searchInvoiceMasterFormGroup.value.docnumber.trim() +
      "&customerid=" +
      this.searchInvoiceMasterFormGroup.value.customerid +
      "&billfromdate=" +
      this.searchInvoiceMasterFormGroup.value.billfromdate +
      "&billtodate=" +
      this.searchInvoiceMasterFormGroup.value.billtodate +
      "&custmobile=" +
      this.searchInvoiceMasterFormGroup.value.custMobile.trim() +
      "&isInvoiceVoid=true";
    this.revenueManagementService.postMethod(url, dtoData).subscribe(
      (response: any) => {
        const invoiceMasterListData = response.invoicesearchlist;
        // .filter(
        //   invoice => invoice.custType == "Prepaid"
        // );
        this.invoiceMasterListData = response.invoicesearchlist;

        this.invoiceMastertotalRecords = response.pageDetails.totalRecords;
        // this.invoiceMasterListData = response.invoicesearchlist;

        this.isInvoiceSearch = true;
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

  clearSearchinvoiceMaster() {
    this.isInvoiceSearch = false;
    this.searchInvoiceMasterFormGroup.reset();
    this.searchInvoiceMasterFormGroup.controls.billrunid.setValue("");
    this.searchInvoiceMasterFormGroup.controls.docnumber.setValue("");
    this.searchInvoiceMasterFormGroup.controls.custname.setValue("");
    this.searchInvoiceMasterFormGroup.controls.billfromdate.setValue("");
    this.searchInvoiceMasterFormGroup.controls.billtodate.setValue("");
    this.searchInvoiceMasterFormGroup.controls.customerid.setValue("");
    this.invoiceMasterListData = [];
    this.currentPageinvoiceMasterSlab = 1;
    this.invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.showItemPerPageInvoice = 1;
    this.searchinvoiceMaster("", "");
  }

  samepresentAddress(event, data) {
    if (event.checked == true) {
      if ("payment" == data) {
        this.getTempPincodeData(this.presentGroupForm.value.pincodeId, "payment");
        this.getAreaData(this.presentGroupForm.value.areaId, "payment");
        this.paymentGroupForm = this.fb.group({
          addressType: ["Payment"],
          landmark: [this.presentGroupForm.value.landmark],
          areaId: [this.presentGroupForm.value.areaId],
          pincodeId: [this.presentGroupForm.value.pincodeId],
          cityId: [this.presentGroupForm.value.cityId],
          stateId: [this.presentGroupForm.value.stateId],
          countryId: [this.presentGroupForm.value.countryId],
          landmark1: [this.presentGroupForm.value.landmark1],
          version: [this.presentGroupForm.value.version]
        });
      }
      if ("permanet" == data) {
        this.getTempPincodeData(this.presentGroupForm.value.pincodeId, "permanent");
        this.getAreaData(this.presentGroupForm.value.areaId, "permanent");
        this.permanentGroupForm = this.fb.group({
          addressType: ["Permanent"],
          landmark: [this.presentGroupForm.value.landmark],
          areaId: [this.presentGroupForm.value.areaId],
          pincodeId: [this.presentGroupForm.value.pincodeId],
          cityId: [this.presentGroupForm.value.cityId],
          stateId: [this.presentGroupForm.value.stateId],
          countryId: [this.presentGroupForm.value.countryId],
          landmark1: [this.presentGroupForm.value.landmark1],
          version: [this.presentGroupForm.value.version]
        });
      }
    }

    if (event.checked == false) {
      if ("payment" == data) {
        this.paymentGroupForm.reset();
      }
      if ("permanet" == data) {
        this.permanentGroupForm.reset();
      }
    }
  }

  validityUnitListFormGroup(): FormGroup {
    return this.fb.group({
      validityUnit: [this.validityUnitFormGroup.value.validityUnit]
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

  planMappingListFormGroup(index): FormGroup {
    for (const prop in this.planGroupForm.controls) {
      this.planGroupForm.value[prop] = this.planGroupForm.controls[prop].value;
    }
    const isDisabled = this.isDiscountDisabledByIndex(index);
    return this.fb.group({
      planId: [this.planGroupForm.value.planId, Validators.required],
      service: [this.planGroupForm.value.service, Validators.required],
      validity: [this.planGroupForm.value.validity, Validators.required],
      discount: [
        {
          value: this.planGroupForm.getRawValue().discount
            ? this.planGroupForm.getRawValue().discount
            : 0,
          disabled: isDisabled
        }
      ],
      billTo: [this.customerGroupForm.value.billTo],
      billableCustomerId: [this.customerGroupForm.value.billableCustomerId],
      newAmount: [this.planGroupForm.value.newAmount],
      offerPrice: [this.planGroupForm.value.offerprice],
      isInvoiceToOrg: [this.customerGroupForm.value.isInvoiceToOrg],
      istrialplan: [this.planGroupForm.value.istrialplan],
      discountType: [
        {
          value: this.planGroupForm.getRawValue().discountType
            ? this.planGroupForm.getRawValue().discountType
            : 0,
          disabled: isDisabled
        }
      ],
      discountTypeData: [
        {
          value: this.planGroupForm.getRawValue().discountTypeData
            ? this.planGroupForm.getRawValue().discountTypeData
            : 0,
          disabled: isDisabled
        }
      ],
      discountExpiryDate: [
        {
          value:
            this.planGroupForm.value.discountType === "One-time"
              ? moment().utc(true).toDate()
              : this.planGroupForm.getRawValue().discountExpiryDate
                ? moment(this.planGroupForm.getRawValue().discountExpiryDate).utc(true).toDate()
                : null,
          disabled: isDisabled
        }
      ],

      invoiceType: [this.planGroupForm.value.invoiceType],
      currency: [this.planGroupForm.value.currency]
      // id:[]
    });
    return;
  }

  discountValue: any = 0;

  discountvaluesetPercentage(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (
      event.keyCode === 8 ||
      (event.key >= "0" && event.key <= "9") ||
      (event.key === "." && inputElement.value.indexOf(".") === -1) // Allow only one decimal point
    ) {
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
      return false;
    }
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

  DiscountValueStore: any = [];
  discountChange(e, index) {
    if (this.planGroupForm.value.discountType === "Recurring") {
      let date = new Date();
      let expiryDate = moment(date).utc(true).toDate();
      this.planGroupForm.get("discountExpiryDate").setValue(expiryDate);
    }
    let rawValue = e.target.value.replace(/,/g, "");
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
            this.planDataForm.value.discountPrice - this.DiscountValueStore[index].value + lastvalue
          ).toFixed(2)
        });

        this.DiscountValueStore[index].value = lastvalue;
      });
  }
  planTotalOffetPrice = 0;
  onAddplanMappingList() {
    if (this.planGroupForm.value.discountType === "Recurring" && this.isExpiredDate == false) {
      this.messageService.add({
        severity: "info",
        summary: "Discount!",
        detail: "Please add discount for this plan.",
        icon: "far fa-times-circle"
      });
      return;
    }
    this.plansubmitted = true;
    let offerP = 0;
    let disValue = 0;
    if (this.planGroupForm.valid) {
      this.DiscountValueStore.push({ value: this.discountValue });
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

      this.planTotalOffetPrice =
        this.planTotalOffetPrice + Number(this.planGroupForm.value.offerprice);

      this.planDataForm.patchValue({
        offerPrice: this.planTotalOffetPrice
      });

      if (this.planGroupForm.value.planId) {
        this.getChargeUsePlanList(this.planGroupForm.value.planId);
      }
      this.filterChargesByCurrency(this.planGroupForm.value);
      const index = this.payMappingListFromArray.length;
      this.payMappingListFromArray.push(this.planMappingListFormGroup(index));
      if (this.payMappingListFromArray?.length > 0) {
        this.customerGroupForm.get("currency").setValue(this.planGroupForm.value?.currency);
        this.planCurrency = this.planGroupForm.value?.currency;
        this.getAllPlanData(this.planGroupForm.value?.currency);
      }
      this.validityUnitFormArray.push(this.validityUnitListFormGroup());
      this.validityUnitFormGroup.reset();
      this.planGroupForm.reset();
      this.planGroupForm.controls.validity.enable();
      this.planGroupForm.controls.discountType.setValue("One-time");
      this.plansubmitted = false;
      this.discountType = "One-time";
      this.planGroupForm.get("discountType")?.setValue("One-time");
      this.discountValue = 0;
      if (this.customerGroupForm.value.parentExperience == "Single")
        this.planGroupForm.patchValue({ invoiceType: "Group" });
      else this.planGroupForm.patchValue({ invoiceType: "" });
    } else {
      // console.log("I am not valid");
    }
  }

  filterChargesByCurrency(plan) {
    const selectedCurrency = plan?.currency;

    this.plantypaSelectData = this.plantypaSelectData.filter(plan => {
      const chargeCurrency = plan?.currency ?? this.currency;
      return chargeCurrency === selectedCurrency;
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

  MACListFormGroup(): FormGroup {
    return this.fb.group({
      macAddress: [this.macGroupForm.value.macAddress]
    });
  }
  ipdisplayListFormGroup(): FormGroup {
    return this.fb.group({
      ipAddress: [this.ipdisplayManagementGroup.value.ipAddress],
      ipType: [this.ipdisplayManagementGroup.value.ipType]
    });
  }
  ipListFormGroup(): FormGroup {
    const selectedService = this.dropdownOptions.find(
      option => option.value === this.ipManagementGroup.value.custid
    );
    return this.fb.group({
      ipAddress: [this.ipManagementGroup.value.ipAddress],
      ipType: [this.ipManagementGroup.value.ipType],
      custsermappingid: [this.ipManagementGroup.value.custid],
      custid: [this.customerId],
      service: [selectedService.label]
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

  TotalCurrentPlanItemPerPage(event) {
    this.CurrentPlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerCurrentPlanListdata > 1) {
      this.currentPagecustomerCurrentPlanListdata = 1;
    }
    this.getcustCurrentPlan(this.customerDetailData.id, this.CurrentPlanShowItemPerPage);
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

  pageChangedcustomerDiscountCustListData(pageNumber) {
    this.currentPagecustomerCustDiscountListdata = pageNumber;
    this.getcustDiscountDetails(this.customerDetailData.id, "");
  }

  TotalCustDiscountItemPerPage(event) {
    this.CustDiscountShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerCustDiscountListdata > 1) {
      this.currentPagecustomerCustDiscountListdata = 1;
    }
    this.getcustDiscountDetails(this.customerDetailData.id, this.CustDiscountShowItemPerPage);
  }

  getcustDiscountDetails(custId, size) {
    let page_list;
    this.OlddiscountData = [];
    if (size) {
      page_list = size;
      this.customerCustDiscountListdataitemsPerPage = size;
    } else {
      if (this.CustDiscountShowItemPerPage == 1) {
        this.customerCustDiscountListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerCustDiscountListdataitemsPerPage = this.CustDiscountShowItemPerPage;
      }
    }

    let custDiscountdatalength = 0;
    const url =
      "/subscriber/fetchCustomerDiscountDetailServiceLevel/" + custId + "?custStatus=newactivation";
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode === 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.msg,
            icon: "far fa-times-circle"
          });
          this.custCustDiscountList = [];
          return;
        }
        this.custCustDiscountList = response.discountDetails;
        while (custDiscountdatalength < this.custCustDiscountList.length) {
          if (
            this.custCustDiscountList[custDiscountdatalength].discount === null ||
            this.custCustDiscountList[custDiscountdatalength].discount === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discount = 0;
          }
          this.custCustDiscountList[custDiscountdatalength].discount = parseFloat(
            this.custCustDiscountList[custDiscountdatalength].discount
          ).toFixed(2);

          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscount === null ||
            this.custCustDiscountList[custDiscountdatalength].newDiscount === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscount = 0;
          }
          this.custCustDiscountList[custDiscountdatalength].newDiscount = parseFloat(
            this.custCustDiscountList[custDiscountdatalength].newDiscount
          ).toFixed(2);

          if (
            this.custCustDiscountList[custDiscountdatalength].discountType === null ||
            this.custCustDiscountList[custDiscountdatalength].discountType === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discountType = "One-time";
          }
          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscountType === null ||
            this.custCustDiscountList[custDiscountdatalength].newDiscountType === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscountType = "One-time";
          }

          if (
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate !== null &&
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate !== ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate = moment(
              this.custCustDiscountList[custDiscountdatalength].discountExpiryDate
            )
              .utc(true)
              .toDate();
          }

          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate !== null &&
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate !== ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate = moment(
              this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate
            )
              .utc(true)
              .toDate();
          }
          custDiscountdatalength++;
        }
        this.custCustDiscountList = this.custCustDiscountList?.map(item => ({
          ...item,
          isSelected: false,
          isDiscountTypeChanged: false
        }));
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

  TotalFuturePlanItemPerPage(event) {
    this.futurePlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerFuturePlanListdata > 1) {
      this.currentPagecustomerFuturePlanListdata = 1;
    }
    this.getcustFuturePlan(this.customerDetailData.id, this.futurePlanShowItemPerPage);
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

  TotalExpiredPlanItemPerPage(event) {
    this.expiredShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerExpiryPlanListdata > 1) {
      this.currentPagecustomerExpiryPlanListdata = 1;
    }
    this.getcustExpiredPlan(this.customerDetailData.id, this.expiredShowItemPerPage);
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagecustomerListdata > 1) {
      this.currentPagecustomerListdata = 1;
    }
    if (!this.searchkey) {
      this.getcustomerList(this.showItemPerPage);
    } else {
      this.searchcustomer();
    }
  }

  getcustomerList(list) {
    this.searchkey = "";
    this.searchkey2 = "";

    let size;
    this.searchkey = "";
    const page = this.currentPagecustomerListdata;
    if (list) {
      size = list;
      this.customerListdataitemsPerPage = list;
    } else {
      size = this.customerListdataitemsPerPage;
    }
    let mvnoId = Number(localStorage.getItem("mvnoId"));
    const url = `/customers/list/` + this.custType + "?orgcusttype=false&mvnoId=" + mvnoId;

    const custerlist = {
      page,
      pageSize: size,
      status: RadiusConstants.CUSTOMER_STATUS.NEW_ACTIVATION
    };
    this.customerManagementService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerListData = response.customerList;
        this.customerListDataselector = response.customerList;
        this.customerListdatatotalRecords = response.pageDetails.totalRecords;

        if (this.showItemPerPage > this.customerListdataitemsPerPage) {
          this.customerListDatalength = this.customerListData.length % this.showItemPerPage;
        } else {
          this.customerListDatalength =
            this.customerListData.length % this.customerListdataitemsPerPage;
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

  selectAreaChange(_event: any, index: any) {
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
                          this.onChangeBuildingArea(buildingEvent, "");
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

  onChangeBuildingArea(_event: any, index: any) {
    if (_event.value) {
      this.buildingNoDD = [];
      const url = "/buildingmgmt/getBuildingMgmtNumbers?buildingMgmtId=" + _event.value;
      this.areaManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.buildingNoDD = response.dataList.map(buildingNumber => ({ buildingNumber }));
          if (this.iscustomerEdit) {
            this.presentGroupForm.patchValue({
              buildingNumber: this.viewcustomerListData.addressList[0].buildingNumber
            });
          }
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

  selectPINCODEChange(_event: any, index: any) {
    // const url = "/area/pincode?pincodeId=" + _event.value;
    // this.adoptCommonBaseService.get(url).subscribe(
    //   (response: any) => {
    //     this.AreaListDD = response.areaList;
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
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
    // this.getpincodeData(_event.value, index);
  }

  getTempPincodeData(id: any, index: any) {
    const url = "/pincode/" + id;

    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      if (index === "present") {
        this.pincodeDeatils = response.data;
        if (response.data.areaList && response.data.areaList.length !== 0) {
          this.areaAvailableList = response.data.areaList;
        }
      }
      if (index === "payment") {
        this.PyamentpincodeDeatils = response.data;
        if (response.data.areaList.length !== 0) {
          this.paymentareaAvailableList = response.data.areaList;
        }
      }
      if (index === "permanent") {
        this.permanentpincodeDeatils = response.data;
        if (response.data.areaList.length !== 0) {
          this.permanentareaAvailableList = response.data.areaList;
        }
      }
    });
  }

  getpincodeData(id: any, index: any) {
    const url = "/pincode/" + id;

    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      if (index === "present") {
        this.areaAvailableList = [];
        this.areaDetails = [];
        this.presentGroupForm.patchValue({
          cityId: "",
          stateId: "",
          countryId: ""
        });
        this.selectAreaList = true;
        this.selectPincodeList = false;
        this.pincodeDeatils = response.data;
        if (response.data.areaList.length !== 0) {
          this.areaAvailableList = response.data.areaList;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Area detals are not available, please select correct pincode. "
          });
        }

        // this.presentGroupForm.patchValue({
        //   cityId: Number(this.pincodeDeatils.cityId),
        //   stateId: Number(this.pincodeDeatils.stateId),
        //   countryId: Number(this.pincodeDeatils.countryId),
        // });
      }
      if (index === "payment") {
        this.paymentareaAvailableList = [];
        this.paymentGroupForm.patchValue({
          cityId: "",
          stateId: "",
          countryId: ""
        });
        this.selectAreaListPayment = true;
        this.selectPincodeListPayment = false;
        this.PyamentpincodeDeatils = response.data;
        if (response.data.areaList.length !== 0) {
          this.paymentareaAvailableList = response.data.areaList;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Area detals are not available, please select correct pincode. "
          });
        }

        // this.paymentGroupForm.patchValue({
        //   cityId: Number(this.PyamentpincodeDeatils.cityId),
        //   stateId: Number(this.PyamentpincodeDeatils.stateId),
        //   countryId: Number(this.PyamentpincodeDeatils.countryId),
        // });
      }
      if (index === "permanent") {
        this.permanentareaAvailableList = [];
        this.permanentGroupForm.patchValue({
          cityId: "",
          stateId: "",
          countryId: ""
        });
        this.selectAreaListPermanent = true;
        this.selectPincodeListPermanent = false;
        this.permanentpincodeDeatils = response.data;
        if (response.data.areaList.length !== 0) {
          this.permanentareaAvailableList = response.data.areaList;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Area detals are not available, please select correct pincode. "
          });
        }

        // this.permanentGroupForm.patchValue({
        //   cityId: Number(this.permanentpincodeDeatils.cityId),
        //   stateId: Number(this.permanentpincodeDeatils.stateId),
        //   countryId: Number(this.permanentpincodeDeatils.countryId),
        // });
      }
    });
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
                    // this.getPlanbyServiceArea(res.data);
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
            // this.subAreaListDD = subarea.dataList;
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

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector(".ng-invalid[formControlName]");
    this.scrollTo(firstElementWithError);
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
          this.addEditcustomer(customerId);
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
  onKeymobilelengthsec(event) {
    const str = this.customerGroupForm.value.secondaryMobile.toLocaleString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobileSec = `${mobilenumberlength} character required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobileSec = "";
    } else {
      this.inputMobileSec = `${mobilenumberlength} character required.`;
    }
  }

  addEditcustomer(customerId) {
    this.submitted = true;
    let i = 0;
    let j = 0;
    let K = 0;
    let a = 0;
    let b = 0;
    let c = 0;
    let x = 0;
    let checkServicePack = true;
    if (this.servicePackForm.value?.vasId) {
      this.servicePackSubmitted = true;
      checkServicePack = this.servicePackForm.valid;
    }
    if (this.customerGroupForm.valid && this.presentGroupForm.valid && checkServicePack) {
      if (
        this.customerGroupForm.value.planMappingList.length > 0 ||
        this.customerGroupForm.value.plangroupid ||
        this.customerGroupForm.value.custlabel === "organization"
      ) {
        if (this.customerGroupForm.value.pan) {
          this.customerGroupForm.value.pan = this.customerGroupForm.value.pan.trim();
        }
        if (customerId) {
          this.customerGroupForm.value.status = "NewActivation";

          const url = "/customers/" + customerId;
          this.customerGroupForm.value.flatAmount = this.planDataForm.value.discountPrice;
          this.customerGroupForm.value.discount = this.customerGroupForm.value.discount
            ? this.customerGroupForm.value.discount
            : 0;

          if (this.presentGroupForm.value.addressType) {
            this.addressListData.push(this.presentGroupForm.value);
            // this.addressListData[0].addressType = "Present";
            // this.addressListData[0].version = "NEW";
          }
          if (this.paymentGroupForm.value.addressType) {
            this.addressListData.push(this.paymentGroupForm.value);
            // this.addressListData[1].addressType = "Payment";
          }
          if (this.permanentGroupForm.value.addressType) {
            this.addressListData.push(this.permanentGroupForm.value);
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

          this.customerGroupForm.value.flatAmount = this.planDataForm.value.discountPrice;
          this.customerGroupForm.value.discount = this.customerGroupForm.value.discount
            ? this.customerGroupForm.value.discount
            : 0;
          const customerData = {
            ...this.customerGroupForm.value,
            planMappingList: this.payMappingListFromArray.getRawValue()
          };
          this.createcustomerData = customerData;
          this.createcustomerData.customerLocations = this.locationMacData;
          this.createcustomerData.addressList = this.addressListData;

          // this.createcustomerData.username = this.staffUser.username;
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
          if (this.viewcustomerListData.parentCustomerId != null) {
            this.customerGroupForm.controls.parentExperience.enable();
          } else {
            this.customerGroupForm.controls.parentExperience.disable();
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
          this.createcustomerData.custtype = this.custType;
          this.createcustomerData.acctno = this.viewcustomerListData.acctno;
          this.createcustomerData.username = this.customerGroupForm.controls.username.value;
          if (this.customerGroupForm.value.plangroupid) {
            this.createcustomerData.planMappingList = this.plansArray.value;
          }
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
          if (this.createcustomerData.birthDate != null) {
            this.createcustomerData.birthDate = new Date(this.customerGroupForm.value.birthDate);
          } else {
            this.createcustomerData.birthDate = null;
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
          let mvnoId = localStorage.getItem("mvnoId");
          mvnoId === "1" ? (mvnoId = this.customerGroupForm.value?.mvnoId) : mvnoId;
          this.createcustomerData.mvnoId = mvnoId;
          // return
          this.customerManagementService.updateMethod(url, this.createcustomerData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.iscustomerEdit = false;

              this.payMappingListFromArray.controls = [];
              this.overChargeListFromArray.controls = [];
              this.custMacMapppingListFromArray.controls = [];

              this.customerFormReset();

              this.viewcustomerListData = [];
              this.addressListData = [];
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });

              this.listView = true;
              this.createView = false;
              this.selectAreaList = false;
              this.listSearchView = false;
              this.selectchargeValueShow = false;
              this.ifMyInvoice = false;
              this.isServiceOpen = false;
              this.ifShowDBRReport = false;
              this.ifChargeGetData = false;
              this.ifWalletMenu = false;
              this.ifUpdateAddress = false;
              this.ifCafFollowUp = false;
              this.customerUpdateDiscount = false;
              this.shiftLocationEvent = false;
              this.isCallDetails = false;
              this.planCategoryForm.reset();
              if (this.searchkey) {
                this.searchcustomer();
              } else {
                this.getcustomerList("");
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
              this.addressListData = [];
            }
          );
        } else {
          // this.customerGroupForm.value.username = this.staffUser.username;
          // if (this.presentGroupForm.value.addressType) {
          this.presentGroupForm.patchValue({ version: "New" });
          this.addressListData.push(this.presentGroupForm.value);
          // this.addressListData[0].addressType = "Present";
          // }
          if (this.paymentGroupForm.value.addressType) {
            this.paymentGroupForm.patchValue({ version: "New" });
            this.addressListData.push(this.paymentGroupForm.value);
            // this.addressListData[1].addressType = "Payment";
          }
          if (this.permanentGroupForm.value.addressType) {
            this.paymentGroupForm.patchValue({ version: "New" });
            this.addressListData.push(this.permanentGroupForm.value);
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

          this.customerGroupForm.value.flatAmount = this.planDataForm.value.discountPrice;
          this.customerGroupForm.value.discount = this.customerGroupForm.value.discount
            ? this.customerGroupForm.value.discount
            : 0;
          this.customerGroupForm.value.status = "NewActivation";
          const customerData = {
            ...this.customerGroupForm.value,
            planMappingList: this.payMappingListFromArray.getRawValue()
          };
          this.createcustomerData = customerData;
          this.createcustomerData.customerLocations = this.locationMacData;

          this.createcustomerData.addressList = this.addressListData;

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
          if (
            this.createcustomerData.plangroupid == null ||
            this.createcustomerData.plangroupid == ""
          )
            this.createcustomerData.invoiceType = null;
          this.createcustomerData.custtype = this.custType;
          this.createcustomerData.isCustCaf = "yes";
          this.createcustomerData.acctno = this.viewcustomerListData.acctno;
          if (this.customerGroupForm.value.plangroupid) {
            this.createcustomerData.planMappingList = this.plansArray.value;
          }
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
          if (this.customerGroupForm.value.birthDate) {
            this.createcustomerData.birthDate = new Date(this.customerGroupForm.value.birthDate);
          } else {
            this.createcustomerData.birthDate = null;
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
          if (this.servicePackForm.valid && this.vasData) {
            const data = {
              vasId: this.servicePackForm.value.vasId,
              service: this.vasData.serviceId,
              validity: this.vasData.validity,
              discount: this.vasData.discount,
              billTo: this.vasData.billTo,
              billableCustomerId: this.vasData.billableCustomerId,
              newAmount: this.vasData.newAmount,
              invoiceType: this.vasData.invoiceType,
              offerPrice: this.vasData.vasAmount,
              isInvoiceToOrg: this.vasData.isInvoiceToOrg,
              istrialplan: this.vasData.istrialplan,
              discountType: this.vasData.discountType,
              serialNumber: this.vasData.serialNumber,
              discountExpiryDate: this.vasData.discountExpiryDate,
              skipQuotaUpdate: this.vasData.skipQuotaUpdate,
              currency: this.vasData.currency,
              installmentFrequency: this.servicePackForm.value.installmentFrequency,
              installment_no: this.servicePackForm.value.installment_no,
              totalInstallments: this.servicePackForm.value.totalInstallments
            };

            this.createcustomerData.planMappingList?.push(data);
          }
          if (this.isThisTumil) {
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
          this.createcustomerData.mvnoId =
            localStorage.getItem("mvnoId") === "1"
              ? this.customerGroupForm.value?.mvnoId
              : localStorage.getItem("mvnoId");

          this.customerManagementService.postMethod(url, this.createcustomerData).subscribe(
            (response: any) => {
              if (response.responseCode == 406) {
                if (this.vasData) {
                  this.createcustomerData.planMappingList.pop();
                }
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
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
                this.submitted = false;

                this.payMappingListFromArray.controls = [];
                this.overChargeListFromArray.controls = [];
                this.custMacMapppingListFromArray.controls = [];
                this.addressListData = [];

                this.customerFormReset();
                this.servicePackForm.reset();
                this.vasData = "";
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle"
                });

                this.listView = true;
                this.createView = false;
                this.listSearchView = false;
                this.planCategoryForm.reset();
                this.selectchargeValueShow = false;
                this.ifMyInvoice = false;
                this.isServiceOpen = false;
                this.ifShowDBRReport = false;
                this.ifChargeGetData = false;
                this.ifWalletMenu = false;
                this.ifUpdateAddress = false;
                this.ifCafFollowUp = false;
                this.selectAreaList = false;
                this.customerUpdateDiscount = false;
                this.shiftLocationEvent = false;
                this.isCallDetails = false;
                if (this.vasData) {
                  this.createcustomerData.planMappingList.pop();
                }
                if (this.searchkey) {
                  this.searchcustomer();
                } else {
                  this.getcustomerList("");
                }
              }
            },
            (error: any) => {
              // console.log(error, "error")
              this.addressListData = [];
              if (this.vasData) {
                this.createcustomerData.planMappingList.pop();
              }
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          );
        }
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Info ",
          detail:
            "At least one Plan Detail must be added before creating a " +
            this.custType +
            " CAF customer.",
          icon: "far fa-times-circle"
        });
      }
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info ",
        detail: "Fields are Mandatory or Invalid. Please fill or update those field.",
        icon: "far fa-times-circle"
      });
      this.scrollToError();
    }
  }

  //TODO Need to get billable customer object in customer by id api and remove below api code for quick fix did this
  getBillableCust(billableCustomerId) {
    const url = "/customers/" + billableCustomerId;
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

  editcustomer(chargeid: any) {
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
    this.commondropdownService.getValleyTypee();
    this.commondropdownService.getInsideValley();
    this.commondropdownService.getOutsideValley();
    this.commondropdownService.getCustomerCategory();
    this.commondropdownService.getTitle();
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
    const j = 1;
    let k = 0;
    this.totalAddress = 0;

    this.DiscountValueStore = [];
    this.discountValue = 0;
    this.planTotalOffetPrice = 0;
    this.planDataForm.reset();
    this.planDropdownInChageData = [];
    let addres1;
    const planlength = 0;
    let macNumber = 0;
    this.editCustomerId = chargeid;
    this.listView = false;
    this.createView = true;
    this.listSearchView = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.planDropdownInChageData = [];
    this.serviceareaCheck = false;
    this.isCallDetails = false;
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
          let mvnoId =
            localStorage.getItem("mvnoId") == "1"
              ? this.viewcustomerListData?.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          this.commondropdownService.getplanservice(mvnoId);
          this.commondropdownService.getPostpaidplanData(mvnoId);
          this.commondropdownService.findAllplanGroups(mvnoId);
          this.commondropdownService.getserviceAreaListForCafCustomer(mvnoId);

          //   this.getDevicesByType("OLT");
          //   this.getDevicesByType("SN Splitter");
          //   this.getDevicesByType("DN Splitter");
          //   this.getDevicesByType("Master DB/DB");
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
            if (!this.iscustomerEdit) {
              this.customerGroupForm.controls.username.disable();
            }
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
            // this.presentGroupForm.patchValue({
            //     buildingNumber: Number(this.viewcustomerListData.addressList[0].buildingNumber)
            // })
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
            let disValue = 0;
            this.discountValue = 0;
            this.DiscountValueStore = [];
            this.viewcustomerListData.planMappingList.forEach((element, i) => {
              // this.planGroupForm.patchValue(
              //   this.viewcustomerListData.planMappingList[planlength]
              // );
              this.onAddplanMappingList();

              if (element.planId) {
                const planAmount = "";
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
          this.isMandatory = true;
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

  planSelectType(event) {
    this.planDropdownInChageData = [];
    const planaddDetailType = event.value;

    this.DiscountValueStore = [];
    this.ifplanisSubisuSelect = false;
    this.DiscountValueStore = [];
    this.discountValue = "";
    this.planTotalOffetPrice = 0;
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
            if (element.planMode == "NORMAL") {
              this.filterNormalPlanGroup.push(element);
            }
          });
        }
        if (this.custType == "Postpaid") {
          this.commondropdownService.postPlanGroupDetails.forEach(element => {
            if (element.planMode == "NORMAL") {
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
      }
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

  deleteConfirmoncustomer(customerId: number) {
    if (customerId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this customer?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deletecustomer(customerId);
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

  deletecustomer(customerId) {
    //
    const url = "/customers/" + customerId;
    this.customerManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPagecustomerListdata != 1 && this.customerListDatalength == 1) {
          this.currentPagecustomerListdata = this.currentPagecustomerListdata - 1;
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        if (this.searchkey) {
          this.searchcustomer();
        } else {
          this.getcustomerList("");
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

  pageChangedcustomerList(pageNumber) {
    this.currentPagecustomerListdata = pageNumber;
    if (this.searchkey) {
      this.searchcustomer();
    } else {
      this.getcustomerList("");
    }
  }

  pageChangedpayMapping(pageNumber) {
    this.currentPagePayMapping = pageNumber;
  }

  pageChangedOverChargeList(pageNumber) {
    this.currentPageoverChargeList = pageNumber;
  }
  deleteConfirmIp(index: number, name: string) {
    if (index || index === 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + name + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          switch (name) {
            case "ipAddress":
              this.ipMapppingdisplayListFromArray.removeAt(index);
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
  deleteConfirmonChargeField(chargeFieldIndex: number, name: string) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
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
                  billTo: "CUSTOMER"
                });
              }

              this.onRemovePayMapping(chargeFieldIndex);
              break;
            case "Charge":
              this.onRemoveChargelist(chargeFieldIndex);
              break;
            case "MAC":
              this.onRemoveMACaddress(chargeFieldIndex);
              break;
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

      // this.confirmationService.confirm({
      //   message: "Do you want to delete this charge?",
      //   header: "Delete Confirmation",
      //   icon: "pi pi-info-circle",
      //   accept: () => {
      //     //
      //     // console.log(name);
      //     switch (name) {
      //       case "paymapping":
      //         this.onRemovePayMapping(chargeFieldIndex);
      //         break;

      //       case "chargelist":
      //         this.onRemoveChargelist(chargeFieldIndex);
      //         break;
      //       case "MAC":
      //         this.onRemoveMACaddress(chargeFieldIndex);
      //         break;
      //     }
      //   },
      //   reject: () => {
      //     this.messageService.add({
      //       severity: "info",
      //       summary: "Rejected",
      //       detail: "You have rejected",
      //     });
      //   },
      // });
    }
  }

  async onRemovePayMapping(chargeFieldIndex: number) {
    this.planTotalOffetPrice =
      this.planTotalOffetPrice -
      Number(this.payMappingListFromArray.value[chargeFieldIndex].offerPrice);

    this.planDataForm.patchValue({
      offerPrice: this.planTotalOffetPrice,
      discountPrice: Number(
        this.planDataForm.value.discountPrice - this.DiscountValueStore[chargeFieldIndex].value
      ).toFixed(2)
    });

    this.payMappingListFromArray.removeAt(chargeFieldIndex);
    let obj = {
      value: this.servicePlanId
    };
    this.serviceBasePlanDATA(obj);
    this.DiscountValueStore.splice(chargeFieldIndex, 1);

    if (this.payMappingListFromArray.value.length == 0) {
      this.DiscountValueStore = [];
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

  async onRemoveChargelist(chargeFieldIndex: number) {
    this.overChargeListFromArray.removeAt(chargeFieldIndex);
  }

  async onRemoveMACaddress(chargeFieldIndex: number) {
    this.custMacMapppingListFromArray.removeAt(chargeFieldIndex);
  }

  pageChangedcustChargeDetailList(pageNumber) {
    this.currentPagecustChargeDeatilList = pageNumber;
  }

  pageChangedcustPlanDetailList(pageNumber) {
    this.currentPagecustPlanDeatilList = pageNumber;
  }

  pageChangedcustMacAddDetailList(pageNumber) {
    this.currentPagecustMacAddList = pageNumber;
  }

  pageChangedcustledgerList(pageNumber) {
    this.currentPagecustLedgerList = pageNumber;
    this.getCustomersLedger(this.customerDetailData.id, "");
  }

  pageChangedcustomerPaymentList(pageNumber) {
    this.currentPagecustomerPaymentdata = pageNumber;
    this.openCustomersPaymentData(this.customerDetailData.id, "");
  }

  pageChangedcustFuturePlanListData(pageNumber) {
    this.currentPagecustomerFuturePlanListdata = pageNumber;
    this.getcustFuturePlan(this.customerDetailData.id, "");
  }

  pageChangedcustomerExpiryPlanListData(pageNumber) {
    this.currentPagecustomerExpiryPlanListdata = pageNumber;
    this.getcustExpiredPlan(this.customerDetailData.id, "");
  }

  pageChangedcustomerCurrentPlanListData(pageNumber) {
    this.currentPagecustomerCurrentPlanListdata = pageNumber;
    this.getcustCurrentPlan(this.customerDetailData.id, "");
  }

  searchcustomer() {
    if (this.searchOption !== "cafCreatedDate" && this.searchOption !== "firstactivationdate") {
      if (
        !this.searchkey ||
        this.searchkey !== this.searchDeatil.trim() ||
        !this.searchkey2 ||
        this.searchkey2 !== this.searchOption.trim()
      ) {
        this.currentPagecustomerListdata = 1;
      }
      this.searchkey = this.searchDeatil.trim();
      this.searchkey2 = this.searchOption.trim();

      this.searchData.filters[0].filterValue = this.searchDeatil.trim();
      this.searchData.filters[0].filterColumn = this.searchOption.trim();
    } else {
      if (
        !this.searchkey ||
        this.searchkey !== this.searchDeatil ||
        !this.searchkey2 ||
        this.searchkey2 !== this.searchOption
      ) {
        this.currentPagecustomerListdata = 1;
      }
      let searchDeatil = this.datePipe.transform(this.searchDeatil, "yyyy-MM-dd");
      this.searchkey = searchDeatil;
      this.searchkey2 = this.searchOption;

      this.searchData.filters[0].filterValue = searchDeatil;
      this.searchData.filters[0].filterColumn = this.searchOption;
    }

    // ✅ Add secondary filter if searchOption is 'status'
    if (
      this.searchOption === "status" &&
      this.secondarySearchOption &&
      this.secondarySearchValue &&
      this.secondarySearchValue.trim() !== ""
    ) {
      this.searchData.filters.push({
        filterDataType: "",
        filterValue: this.secondarySearchValue.trim(),
        filterColumn: this.secondarySearchOption.trim(),
        filterOperator: "equalto",
        filterCondition: "and"
      });
    }
    this.searchData.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    this.searchData.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    if (this.showItemPerPage !== 1) {
      this.customerListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.page = this.currentPagecustomerListdata;
    this.searchData.pageSize = this.customerListdataitemsPerPage;
    let mvnoId = Number(localStorage.getItem("mvnoId"));
    const url = "/customers/search/" + this.custType + "?mvnoId=" + mvnoId;
    // console.log("this.searchData", this.searchData)
    this.customerManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.msg,
            icon: "far fa-times-circle"
          });
          this.customerListData = [];
          this.customerListdatatotalRecords = 0;
        } else {
          this.customerListData = response?.customerList;
          this.customerListdatatotalRecords = response?.pageDetails?.totalRecords;
        }

        if (this.showItemPerPage > this.customerListdataitemsPerPage) {
          this.customerListDatalength = this.customerListData.length % this.showItemPerPage;
        } else {
          this.customerListDatalength =
            this.customerListData.length % this.customerListdataitemsPerPage;
        }
      },
      (error: any) => {
        this.customerListdatatotalRecords = 0;
        this.customerListData = [];
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearSearchcustomer() {
    this.getcustomerList("");
    this.searchDeatil = "";
    this.searchOption = "";
    // this.fieldEnable = false;
    this.secondarySearchOption = "";
    this.secondarySearchValue = "";
    this.currentPagecustomerListdata = 1;
    this.fromDate = "";
    this.toDate = "";
  }

  selSearchOption(event) {
    // console.log("value", event.value);
    this.searchDeatil = "";
    // if (this.searchOption == "currentAssigneeName" || this.searchOption == "activationbyname" || this.searchOption == "createbyname") {
    //     this.searchDeatil = localStorage.getItem("loginUserName");
    // }
    //   if (this.searchOption == "currentAssigneeName") {

    // if (event.value) {
    //   this.fieldEnable = true;
    // } else {
    //   this.fieldEnable = false;
    // }
  }

  serviceBasePlanDATA(event) {
    this.servicePlanId = event.value;
    this.disabledDiscExpiryDate = false;
    this.isExpiredDate = false;
    const serviceId = event.value;
    console.group("event ::::: ", event);
    const servicename = this.serviceData.find(item => item.id == serviceId).name;
    this.planGroupForm.patchValue({ service: servicename });
    this.planGroupForm.controls.istrialplan.reset();
    if (!this.isBranchAvailable) {
      this.plantypaSelectData = this.filterPlanData.filter(
        id =>
          id.serviceId === this.planGroupForm.controls.serviceId.value &&
          (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal") &&
          id.plantype == this.custType
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
        if (planserviceData.length > 0) {
          planServiceID = planserviceData[0].id;

          // if (this.customerGroupForm.value.custtype) {
          this.plantypaSelectData = this.filterPlanData.filter(
            id =>
              id.serviceId === planServiceID &&
              (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
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
              detail: "Plan not available for this customer type and service "
            });
          }
          // }
          // else {
          //   this.messageService.add({
          //     severity: 'info',
          //     summary: 'Required',
          //     detail: 'Customer Type Field Required',
          //   });
          // }
        }
      });
    }
  }

  selCustType() {
    let obj: any = [];
    this.filterPlanData = [];
    if (this.commondropdownService.postpaidplanData.length != 0) {
      obj = this.commondropdownService.postpaidplanData.filter(
        key => key.plantype === this.custType
      );
    }
    this.filterPlanData = obj;
    if (this.planGroupForm.value) {
      this.planGroupForm.reset();
      this.plantypaSelectData = [];
    }
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
        this.getVasPlanByCustId(false, custId);
        this.planMappingData = this.customerDetailData.planMappingList?.filter(x => x.planId);
        this.customerId = response.customers.id;
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
        this.customerDetailData?.currency
          ? (this.currency = this.customerDetailData?.currency)
          : this.systemService
              .getConfigurationByName("CURRENCY_FOR_PAYMENT", this.customerDetailData?.mvnoId)
              .subscribe((res: any) => {
                this.currency = res.data.value;
              });

        this.isDisplayConvertedAmount =
          this.currency !=
          (this.customerDetailData?.currency
            ? this.customerDetailData?.currency
            : this.systemConfigCurrency);

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
        if (this.customerDetailData.serviceareaid) {
          const serviceareaurl = "/serviceArea/" + this.customerDetailData.serviceareaid;
          this.adoptCommonBaseService.get(serviceareaurl).subscribe((response: any) => {
            this.serviceAreaDATA = response.data.name;

            // console.log("partnerDATA", this.serviceAreaDATA);
          });
        }

        // Address
        if (
          this.customerDetailData.addressList.length > 0 &&
          this.customerDetailData.addressList[0].addressType
        ) {
          const areaurl = "/area/" + this.customerDetailData.addressList[0].areaId;

          this.adoptCommonBaseService.get(areaurl).subscribe((response: any) => {
            this.presentAdressDATA = response.data;
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

        if (this.customerDetailData.planMappingList.length > 0) {
          this.customerBill = this.customerDetailData.planMappingList[0].billTo;
          this.custInvoiceToOrg = this.customerDetailData.planMappingList[0].isInvoiceToOrg;
        }

        if (this.customerDetailData.plangroupid) {
          this.ifIndividualPlan = false;
          this.ifPlanGroup = true;
          let mvnoId =
            localStorage.getItem("mvnoId") == "1"
              ? this.customerGroupForm.value?.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          const planGroupurl =
            "/findPlanGroupById?planGroupId=" +
            this.customerDetailData.plangroupid +
            "&mvnoId=" +
            mvnoId;

          this.customerManagementService.getMethod(planGroupurl).subscribe((response: any) => {
            this.planGroupName = response.planGroup.planGroupName;
          });
        } else {
          this.ifIndividualPlan = true;
          this.ifPlanGroup = false;
          this.customerDetailData.planMappingList = this.customerDetailData.planMappingList.filter(
            data => data.custPlanStatus == "Active" && data.planId
          );

          this.planMappingList = this.customerDetailData.planMappingList;
          while (plandatalength < this.customerDetailData.planMappingList.length) {
            const planId = this.customerDetailData.planMappingList[plandatalength].planId;
            let discount;
            if (
              this.customerDetailData.planMappingList[plandatalength].discount == null ||
              this.customerDetailData.planMappingList[plandatalength].discount == ""
            ) {
              discount = 0;
            } else {
              discount = this.customerDetailData.planMappingList[plandatalength].discount;
            }
            this.activePlanNames = "";
            if (
              this.customerDetailData.planMappingList[plandatalength].plangroup !=
                "Volume Booster" &&
              this.customerDetailData.planMappingList[plandatalength].plangroup !=
                "Bandwidth Booster"
            )
              this.activePlanNames =
                this.activePlanNames +
                this.customerDetailData.planMappingList[plandatalength].planName +
                ",";
            let mvnoId =
              localStorage.getItem("mvnoId") == "1"
                ? this.customerDetailData?.mvnoId
                : Number(localStorage.getItem("mvnoId"));
            const planurl = "/postpaidplan/" + planId + "?mvnoId=" + mvnoId;
            this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
              this.dataPlan.push(response.postPaidPlan);
              // console.log("dataPlan", this.dataPlan);
            });

            this.customerManagementService
              .getofferPriceWithTax(planId, discount)
              .subscribe((response: any) => {
                if (response.result.finalAmount) {
                  this.FinalAmountList.push(response.result.finalAmount);
                } else {
                  this.FinalAmountList.push(0);
                }
              });
            plandatalength++;
          }
          // charger Data
          if (this.customerDetailData.indiChargeList.length > 0) {
            this.addChargeForm.patchValue({
              chargeAdd: true
            });
          }

          // let checkCustTypeurl = `/isCustomerPrimeOrNot?custId=${custId}`;
          // this.customerManagementService
          //   .getMethod(checkCustTypeurl)
          //   .subscribe((response: any) => {
          //     //plan deatils
          //     let planurl;
          //     if (response.isCustomerPrime) {
          //       planurl = `/premierePlan/all?custId=${custId}&isPremiere=true&serviceAreaId=${this.customerDetailData.serviceareaid}`;
          //     } else {
          //       planurl =
          //         "/plans/serviceArea?serviceAreaId=" +
          //         this.customerDetailData.serviceareaid;
          //     }
          //     while (
          //       plandatalength <
          //       this.customerDetailData.planMappingList.length
          //     ) {
          //       this.customerManagementService
          //         .getMethod(planurl)
          //         .subscribe((response: any) => {
          //           this.dataPlan.push(response.postpaidplanList.name);
          //           // console.log("dataPlan", this.dataPlan);
          //         });
          //       plandatalength++;
          //     }
          //   });
        }

        // charger Data
        if (this.customerDetailData.indiChargeList.length > 0) {
          this.customerDetailData.indiChargeList.forEach(element => {
            if (element.planid) {
              let mvnoId =
                localStorage.getItem("mvnoId") == "1"
                  ? this.customerDetailData?.mvnoId
                  : Number(localStorage.getItem("mvnoId"));
              const url = "/postpaidplan/" + element.planid + "?mvnoId=" + mvnoId;
              this.customerManagementService.getMethod(url).subscribe((response: any) => {
                this.dataChargePlan.push(response.postPaidPlan);
              });
            }
          });
        }

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

  rejectCustomerCAFOpen(cafId, nextApproverId) {
    this.reject = false;
    this.rejectCustomerCAFModal = true;
    this.assignCustomerCAFId = cafId;
    this.nextApproverId = nextApproverId;
  }

  assignToStaff(flag) {
    let url: any;

    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.assignCustomerCAFId}&eventName=${"CAF"}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.assignCustomerCAFId}&eventName=${"CAF"}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.assignCustomerCAFId}&eventName=${"CAF"}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.assignCustomerCAFId}&eventName=${"CAF"}&isApproveRequest=${flag}`;
      }
    }

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.assignCustomerCAFModal = false;
        this.rejectCustomerCAFModal = false;
        this.reAssignCustomerCAFModal = false;
        this.getcustomerList("");
        // this.getCustomer();

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          //   this.getCustomer();

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

  assignCustomerCAF() {
    this.assignCustomerCAFsubmitted = true;
    if (this.assignCustomerCAFForm.valid) {
      const url = "/approveCaf?mvnoId=" + localStorage.getItem("mvnoId");
      const assignCAFData = {
        custcafId: this.assignCustomerCAFId,
        nextStaffId: null,
        flag: "approved",
        remark: this.assignCustomerCAFForm.controls.remark.value,
        staffId: Number(localStorage.getItem("userId"))
      };
      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.getcustomerList("");
          //   this.getCustomer();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.assignCustomerCAFForm.reset();
          this.assignCustomerCAFsubmitted = false;
          if (response?.result && response?.result?.dataList != null) {
            this.approveCAF = [];
            this.approveCAFData = [];
            this.approveCAF = response?.result?.dataList;
            this.approveCAFData = this.approveCAF;
            this.approved = true;
          } else {
            this.assignCustomerCAFModal = false;
          }
        },
        (error: any) => {
          // console.log(error, "error")
          if (error.error.status == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.message,
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
          this.assignCustomerCAFModal = false;
          this.getcustomerList("");
          //   this.getCustomer();
          this.assignCustomerCAFForm.reset();
          this.assignCustomerCAFsubmitted = false;
        }
      );
    }
  }

  rejectCustomerCAF() {
    this.rejectCustomerCAFsubmitted = true;
    if (this.rejectCustomerCAFForm.valid) {
      const url = "/approveCaf?mvnoId=" + localStorage.getItem("mvnoId");
      const assignCAFData = {
        custcafId: this.assignCustomerCAFId,
        nextStaffId: null,
        flag: "rejected",
        remark: this.rejectCustomerCAFForm.controls.remark.value,
        staffId: Number(localStorage.getItem("userId"))
      };
      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.getcustomerList("");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.rejectCustomerCAFModal = true;
          this.rejectCustomerCAFForm.reset();
          this.rejectCustomerCAFsubmitted = false;
          if (response.result.dataList != null) {
            this.rejectCAF = response.result.dataList;
            this.rejectCafData = this.rejectCAF;
            this.reject = true;
          } else {
            this.rejectCustomerCAFModal = false;
          }
        },
        (error: any) => {
          // console.log(error, "error")
          if (error.error.status == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.message,
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

  customerApporeved(id: any) {
    const url = "/customerCaf/approve/" + id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getcustomerList("");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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

  customerRejected(id: any) {
    const url = "/customerCaf/reject/" + id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getcustomerList("");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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
          newAmount = element.plan.newOfferPrice
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

  getPlanValidityForChagre(event) {
    const planId = event.value;
    // const url = "/postpaidplan/" + planId;
    // this.customerManagementService.getMethod(url).subscribe((response: any) => {
    //   const planDetailData = response.postPaidPlan;
    this.chargeGroupForm.patchValue({
      validity: Number(this.planDropdownInChageData.find(plan => plan.id == planId).validity),
      unitsOfValidity: this.planDropdownInChageData.find(plan => plan.id == planId).unitsOfValidity,
      expiry: this.planDropdownInChageData.find(plan => plan.id == planId).expiryDate
    });
    let planData = null;
    if (this.customerChangePlan) {
      planData = this.custCustDiscountList.find(element => element.id === this.custPlanMapppingId);
    } else {
      planData = this.payMappingListFromArray.value.find(element => element.planId === planId);
    }
    this.chargeGroupForm.patchValue({
      discount: planData ? planData.discount : 0
    });
    this.updateDiscountFromService(event.value, "");
    //
    // });
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
    //
    // console.log(this.currentDate);
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/charge/" + chargeId + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      viewChargeData = response.chargebyid;
      this.selectchargeValueShow = true;
      if (type === "shiftLocation") {
        this.shiftLocationChargeGroupForm.patchValue({
          actualprice: Number(viewChargeData.actualprice),
          charge_date: formattedDate,
          type: "One-time"
        });
      } else {
        this.chargeGroupForm.patchValue({
          actualprice: Number(viewChargeData.actualprice),
          charge_date: formattedDate,
          type: "One-time"
        });
      }
    });
  }

  customerFormReset() {
    this.customerGroupForm.reset();
    this.presentGroupForm.reset();
    this.paymentGroupForm.reset();
    this.permanentGroupForm.reset();
    this.chargeGroupForm.reset();
    this.planGroupForm.reset();
    this.macGroupForm.reset();
    this.planDataForm.reset();
    this.validityUnitFormGroup.reset();
    this.validityUnitFormGroup.controls.validityUnit.setValue("");
    this.planGroupForm.controls.planId.setValue("");
    this.planGroupForm.controls.service.setValue("");
    this.planGroupForm.controls.validity.setValue("");
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
    this.customerGroupForm.controls.billTo.setValue("CUSTOMER");
    this.customerGroupForm.controls.countryCode.setValue("");
    this.customerGroupForm.controls.calendarType.setValue("");
    this.customerGroupForm.controls.isInvoiceToOrg.setValue(false);
    this.customerGroupForm.controls.istrialplan.setValue(false);
    this.customerGroupForm.controls.status.setValue("");
    this.customerGroupForm.controls.serviceareaid.setValue("");
    this.customerGroupForm.controls.title.setValue("");

    this.chargeGroupForm.controls.chargeid.setValue("");
    this.chargeGroupForm.controls.charge_date.setValue("");
    this.chargeGroupForm.controls.planid.setValue("");
    this.chargeGroupForm.controls.type.setValue("");

    this.presentGroupForm.controls.areaId.setValue("");
    this.presentGroupForm.controls.pincodeId.setValue("");
    this.presentGroupForm.controls.cityId.setValue("");
    this.presentGroupForm.controls.stateId.setValue("");
    this.presentGroupForm.controls.countryId.setValue("");

    this.paymentGroupForm.controls.areaId.setValue("");
    this.paymentGroupForm.controls.pincodeId.setValue("");
    this.paymentGroupForm.controls.cityId.setValue("");
    this.paymentGroupForm.controls.stateId.setValue("");
    this.paymentGroupForm.controls.countryId.setValue("");

    this.permanentGroupForm.controls.areaId.setValue("");
    this.permanentGroupForm.controls.pincodeId.setValue("");
    this.permanentGroupForm.controls.cityId.setValue("");
    this.permanentGroupForm.controls.stateId.setValue("");
    this.permanentGroupForm.controls.countryId.setValue("");

    this.discountValue = "";
    this.planTotalOffetPrice = 0;

    this.servicePackForm.reset();
    this.vasData = "";
    this.systemService.getConfigurationByName("HOUSE_HOLD_ID_VALIDATION").subscribe((res: any) => {
      this.isThisTumil = res.data.value === "true";
      this.isAutoGeneratedPassword = true;
      if (this.isAutoGeneratedPassword) {
        if (this.isThisTumil) {
          const autoPassword = Math.random().toString(36).slice(-8);
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
      }
    });
  }

  selServiceArea(event, isFromUI) {
    this.isPartnerSelected = false;
    if (isFromUI) {
      this.pincodeDD = [];
    }
    this.planGroupForm.reset();
    this.planDataForm.reset();
    this.payMappingListFromArray.clear();
    this.planCategoryForm.reset();
    this.planGroupForm.controls.validity.enable();
    this.planGroupForm.patchValue({
      service: "",
      planId: ""
    });
    this.planDataForm.patchValue({
      discountPrice: 0
    });
    this.payMappingListFromArray.controls = [];
    const serviceAreaId = event.value;
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
          if (isFromUI) {
            this.serviceAreaData.pincodes.forEach(element => {
              this.commondropdownService.allpincodeNumber.forEach(e => {
                if (e.pincodeid == element) {
                  this.pincodeDD.push(e);
                }
              });
              // this.pincodeDD.push(this.commondropdownService.allpincodeNumber.filter((e)=>e.pincodeid==element))
            });
          }

          this.getPlanbyServiceArea(serviceAreaId);

          if (!this.iscustomerEdit) {
            if (isFromUI) {
              this.presentGroupForm.reset();
            }
          }
          // this.getAreaData(this.serviceAreaData.areaid, "present");
        },
        (error: any) => {}
      );
      if (this.partnerId !== 1) this.getPartnerAllByServiceArea(serviceAreaId);
      this.getServiceByServiceAreaID(serviceAreaId);
      if (this.partnerId == 1) this.getBranchByServiceAreaID(serviceAreaId);
      this.getStaffUserByServiceArea(serviceAreaId);
      this.shiftLocationDTO.shiftPartnerid = "";
    }
  }
  onPartnerCategoryChange(event: any) {}
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
        this.customerGroupForm.controls.partnerid.setValue(
          this.partnerId !== 1 ? this.partnerId : ""
        );
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

  getStaffUserByServiceArea(ids) {
    let data = [];
    data.push(ids);
    let url = "/staffsByServiceAreaId/" + ids;
    this.serviceAreaService.getMethod(url).subscribe((response: any) => {
      //
      this.staffList = response.dataList;
    });
  }

  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.filterPlanData = [];
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.customerGroupForm.value?.mvnoId
          : Number(localStorage.getItem("mvnoId"));
      const url =
        "/plans/serviceArea?planmode=ALL&serviceAreaId=" + serviceAreaId + "&mvnoId=" + mvnoId;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.postpaidplanList;
          this.filterPlanData = this.planByServiceArea.filter(
            plan => plan.plantype == this.custType
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

  TotalLedgerItemPerPage(event) {
    this.legershowItemPerPage = Number(event.value);
    if (this.currentPagecustLedgerList > 1) {
      this.currentPagecustLedgerList = 1;
    }
    if (!this.customerLedgerSearchKey) {
      this.getCustomersLedger(this.customerDetailData.id, this.legershowItemPerPage);
    } else {
      this.searchCustomerLedger();
    }
  }

  getCustomersLedger(custId, size) {
    let page_list;
    this.customerLedgerSearchKey = "";
    if (size) {
      page_list = size;
      this.custLedgerItemPerPage = size;
    } else {
      if (this.legershowItemPerPage == 1) {
        this.custLedgerItemPerPage = this.pageITEM;
      } else {
        this.custLedgerItemPerPage = this.legershowItemPerPage;
      }
    }

    const url = "/customerLedgers";
    this.postdata.custId = custId;
    this.customerManagementService.postMethod(url, this.postdata).subscribe(
      (response: any) => {
        this.customerLedgerData = response.customerLedgerDtls;
        this.customerLedgerListData =
          response.customerLedgerDtls.customerLedgerInfoPojo.debitCreditDetail;
        // console.log("this.customerLedgerData", this.customerLedgerData);
        this.customerLedgerOpen();
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

  searchCustomerLedger() {
    if (
      !this.customerLedgerSearchKey ||
      this.customerLedgerSearchKey !== this.custLedgerForm.value
    ) {
      this.currentPagecustLedgerList = 1;
    }
    this.customerLedgerSearchKey = this.custLedgerForm.value;

    if (this.legershowItemPerPage == 1) {
      this.custLedgerItemPerPage = this.pageITEM;
    } else {
      this.custLedgerItemPerPage = this.legershowItemPerPage;
    }

    this.custLedgerSubmitted = true;
    if (this.custLedgerForm.valid) {
      this.postdata.CREATE_DATE = this.custLedgerForm.controls.startDateCustLedger.value;
      this.postdata.END_DATE = this.custLedgerForm.controls.endDateCustLedger.value;
    }
    this.getCustomersLedger(this.customerDetailData.id, "");
  }

  // getCustomerAssignedList(id) {
  //
  //   this.customerInventoryMappingService.getByCustomerId(id).subscribe(
  //     (res: any) => {
  //       this.assignedInventoryList = res.dataList;
  //
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.msg,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }
  // searchProduct() {}
  // clearSearchProduct() {}
  //
  // next() {
  //   this.first = this.first + this.rows;
  // }
  //
  // prev() {
  //   this.first = this.first - this.rows;
  // }
  //
  // reset() {
  //   this.first = 0;
  // }
  //
  // isLastPage(): boolean {
  //   return this.assignedInventoryList
  //     ? this.first === this.assignedInventoryList.length - this.rows
  //     : true;
  // }
  //
  // isFirstPage(): boolean {
  //   return this.assignedInventoryList ? this.first === 0 : true;
  // }

  clearSearchCustomerLedger() {
    this.postdata.CREATE_DATE = "";
    this.postdata.END_DATE = "";
    this.custLedgerForm.controls.startDateCustLedger.setValue("");
    this.custLedgerForm.controls.endDateCustLedger.setValue("");
    this.custLedgerSubmitted = false;
    this.getCustomersLedger(this.customerDetailData.id, "");
  }

  TotalPaymentItemPerPage(event) {
    this.paymentShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerPaymentdata > 1) {
      this.currentPagecustomerPaymentdata = 1;
    }
    this.openCustomersPaymentData(this.customerDetailData.id, this.paymentShowItemPerPage);
  }

  openCustomersPaymentData(id, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.customerPaymentdataitemsPerPage = size;
    } else {
      if (this.paymentShowItemPerPage == 1) {
        this.customerPaymentdataitemsPerPage = this.pageITEM;
      } else {
        this.customerPaymentdataitemsPerPage = this.paymentShowItemPerPage;
      }
    }

    const url = "/paymentHistory/" + id;
    this.revenueManagementService.paymentData(url).subscribe((response: any) => {
      this.viewcustomerPaymentData = response.dataList;
      this.viewCustomerPaymentList = true;
      this.listView = false;
      this.createView = false;
      this.selectAreaList = false;
      this.selectPincodeList = false;
      this.isCustomerDetailOpen = false;
      this.isCustomerLedgerOpen = false;
      this.customerPlanView = false;
      this.isCustomerDetailSubMenu = true;
      this.customerChangePlan = false;
      this.customerrMyInventoryView = false;
      this.assignInventoryWithSerial = false;
      this.ifMyInvoice = false;
      this.isServiceOpen = false;
      this.ifShowDBRReport = false;
      this.ifChargeGetData = false;
      this.customerUpdateDiscount = false;
      this.customerStatusView = false;
      this.ipManagementView = false;
      this.macManagementView = false;
      this.customerCafNotes = false;
      this.ifWalletMenu = false;
      this.ifUpdateAddress = false;
      this.ifCafFollowUp = false;
      this.shiftLocationEvent = false;
      this.isCallDetails = false;
    });
    // this.getPaymentHistory(id);
    // this.revenueManagementService.paymentData(url).subscribe((response: any) => {
    //   this.viewcustomerPaymentData = response.dataList;
    //   this.InvoiceListByCustomer(id);
    // });
    this.paymentModeData();
    // this.getCustomersDetail(id);
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerDetailData?.mvnoId
          ? this.customerDetailData?.mvnoId
          : localStorage.getItem("mvnoId")
        : localStorage.getItem("mvnoId");
    this.systemService.getConfigurationByName("TDS", mvnoId).subscribe((res: any) => {
      this.tdsPercent = res.data.value;
    });
    this.systemService.getConfigurationByName("ABBS", mvnoId).subscribe((res: any) => {
      this.abbsPercent = res.data.value;
    });
    this.getBankDetailType(mvnoId);
    this.getBankDestinationDetail(mvnoId);
    this.customerDetailData?.currency
      ? (this.currency = this.customerDetailData?.currency)
      : this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
          this.currency = res.data.value;
        });
  }
  getBankDetailType(mvnoId) {
    const url = `/bankManagement/searchByStatus?banktype=other&mvnoId=${mvnoId}`;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
        // this.bankDestination = response.dataList.banktype
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

  getBankDestinationDetail(mvnoId?: any): void {
    let actualMvnoId: number | null = null;

    if (mvnoId !== undefined && mvnoId !== null) {
      actualMvnoId = mvnoId;
    } else {
      const storedMvnoId = localStorage.getItem("mvnoId");

      if (storedMvnoId === "1") {
        // If mvnoId in localStorage is "1", fallback to form value
        actualMvnoId = this.customerDetailData?.mvnoId || localStorage.getItem("mvnoId");
      } else if (storedMvnoId !== null) {
        // Otherwise use mvnoId from localStorage
        actualMvnoId = Number(storedMvnoId);
      }
    }

    // if (actualMvnoId !== null || isNaN(actualMvnoId)) {
    //   this.messageService.add({
    //     severity: "warn",
    //     summary: "Missing MVNO ID",
    //     detail: "MVNO ID could not be determined.",
    //     icon: "far fa-exclamation-triangle"
    //   });
    //   return;

    const url = `/bankManagement/searchByStatus?banktype=operator&mvnoId=${actualMvnoId}`;

    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDestination = response.dataList;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.ERROR || "Failed to fetch bank details.",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  closePaymentForm() {
    this.paymentFormGroup.reset();
    this.displayRecordPaymentDialog = false;
    this.submitted = false;
    this.isShowInvoiceList = false;
    this.selectedInvoice = [];
    this.file = "";
    this.fileName = null;
  }
  // ........location Data..............
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
          this.customerGroupForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
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

  filedLocation(placeId) {
    const url = "/serviceArea/getLatitudeAndLongitude?placeId=" + placeId;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.ifsearchLocationModal = false;
        this.customerGroupForm.patchValue({
          latitude: response.location.latitude,
          longitude: response.location.longitude
        });
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

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
    this.searchLocationForm.reset();
  }

  nearMyLocation(custID) {
    this.nearLocationModal = true;
    const url = "/customers/" + custID;

    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.viewcustomerListData = response.customers;
      this.customerIdINLocationDevice = this.viewcustomerListData.id;
      this.nearLocation(this.viewcustomerListData);
    });
  }

  nearLocation(data) {
    const deviceData = {
      latitude: data.latitude,
      longitude: data.longitude
    };
    const url = "/NetworkDevice/getNearbyDevices?customerId=" + this.customerIdINLocationDevice;
    this.customerManagementService.postMethodInventory(url, deviceData).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.nearDeviceLocationData = response.locations;
        }
      },
      (error: any) => {
        if (error.error.status == 500) {
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
            detail: error.error.error,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  pageChangedNearDeviceList(pageNumber) {
    this.currentPagenearDeviceLocationList = pageNumber;
  }

  //   nearsearchClose() {
  //     this.ifNearLocationModal = false;
  //     this.nearDeviceLocationData = [];
  //   }

  getParentCust(event) {
    if (event.value) {
      this.customerGroupForm.controls.invoiceType.enable();
      this.customerGroupForm.controls.parentExperience.enable();
    } else {
      this.customerGroupForm.controls.invoiceType.disable();
      this.customerGroupForm.controls.parentExperience.disable();
    }
  }

  //   bindNetworkDevice(networkdeviceID) {
  //     const deviceData = {};

  //     const url =
  //       "/NetworkDevice/bindNetworkDevice?customerId=" +
  //       this.customerIdINLocationDevice +
  //       "&networkDeviceId=" +
  //       networkdeviceID;

  //     this.customerManagementService.updateInventoryMethod(url, deviceData).subscribe(
  //       (response: any) => {
  //         this.NetworkDeviceData = response.locations;

  //         this.getcustomerList("");
  //         this.closebutton.nativeElement.click();
  //         this.nearsearchClose();

  //         this.messageService.add({
  //           severity: "success",
  //           summary: "Successfully",
  //           detail: response.customer,
  //           icon: "far fa-check-circle"
  //         });
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle"
  //         });
  //       }
  //     );
  //   }

  getPlanValidity(event) {
    const planId = event.value;
    this.checkIfDiscount(planId);
    this.planGroupForm.patchValue({
      discountType: "One-time"
    });

    this.discountType = "One-time";
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/postpaidplan/" + planId + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const planDetailData = response.postPaidPlan;

        if (planDetailData.allowdiscount === false) {
          this.planGroupForm.patchValue({
            discount: null,
            discountType: "One-time",
            discountExpiryDate: null
          });
        }

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
          this.payMappingListFromArray.controls = [];
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

  billtoSelectValue(e) {
    this.payMappingListFromArray.controls = [];
    this.planGroupForm.reset();
    this.customerGroupForm.patchValue({
      plangroupid: ""
    });
  }

  // Paytm Link
  getPaytmLink(custId) {
    this.customerManagementService.getPaytmLink(custId).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-check-circle"
        });
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

  getCustomerTeamHierarchy(custId) {
    const url = `/teamHierarchy/getApprovalProgress?entityId=${custId}&eventName=CAF`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerStatusDetail = response.dataList;
        // const newList = [];
        // let parentId = null;
        // for (const item of this.customerStatusDetail) {
        //   for (const item1 of this.customerStatusDetail) {
        //     if (parentId === item1.parentTeamsId) {
        //       newList.push(item1);
        //       parentId = item1.teamsId;
        //     }
        //   }
        // }
        // const list = [];
        // for (let i = newList.length - 1; i >= 0; i--) {
        //   list.push(newList[i]);
        // }
        // console.log(list);
        // this.customerStatusDetail = list;
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

  assigneInventory(customerId) {
    this.assignInventory = true;
    this.customerId = customerId;
  }

  openMyInventory(id) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.customerrMyInventoryView = true;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerUpdateDiscount = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.assignInventoryCustomerId = id;
    this.assignInventoryWithSerial = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
  }

  onKeyAdhar(event) {
    let adharnum = this.customerGroupForm.value.aadhar.replace(/\s/g, "");

    let v = adharnum.match(/(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (v) {
      v = v[1] ? v[1] + (v[2] ? " " + v[2] + (v[3] ? " " + v[3] : "") : "") : "";
      adharnum = v;
    }

    // if(this.customerGroupForm.value.aadhar.length == 14){
    //   let prefix = adharnum.substr(0, adharnum.length - 6);
    //   let suffix = adharnum.substr(-6);
    //   let masked = prefix.replace(/[A-Z\d]/g, '*');
    //   let a = masked + suffix;
    //   this.customerGroupForm.patchValue({
    //     aadhar: a,
    //   })
    // } else{
    this.customerGroupForm.patchValue({
      aadhar: adharnum
    });
    // }
  }

  onKeyPan(e) {
    let panNum = this.customerGroupForm.value.pan.replace(/\s/g, "");
    let v = panNum.match(/([A-Z]{1,5})?([0-9]{1,4})?([A-Z]{1,1})?/);
    if (v) {
      v = v[1] ? v[1] + (v[2] ? " " + v[2] + (v[3] ? v[3] : "") : "") : "";
      panNum = v;
    }

    // if(this.customerGroupForm.value.pan.length == 11){
    //     let prefix = panNum.substr(0, panNum.length - 4);
    //     let suffix = panNum.substr(-4);
    //     let masked = prefix.replace(/[A-Z\d]/g, '*');
    //     let a = masked + suffix;
    //     this.customerGroupForm.patchValue({
    //       pan: a,
    //     })
    // }
    // else{
    this.customerGroupForm.patchValue({
      pan: panNum
    });
    // }
  }

  onKeyGST(e) {
    let gstNum = this.customerGroupForm.value.gst.replace(/\s/g, "");
    let v = gstNum.match(
      /(\d{1,2})?([A-Z]{1,3})?([A-Z]{1,2})?(\d{1,3})?(\d{1,1})?([A-Z]{1,1})?([A-Z\d]{1,1})?([Z]{1,1})?([A-Z\d]{1,1})?/
    );
    if (v) {
      v = v[1]
        ? v[1] +
          (v[2]
            ? v[2] +
              (v[3]
                ? " " +
                  v[3] +
                  (v[4]
                    ? v[4] +
                      (v[5]
                        ? " " +
                          v[5] +
                          (v[6]
                            ? v[6] + (v[7] ? v[7] + (v[8] ? v[8] + (v[9] ? v[9] : "") : "") : "")
                            : "")
                        : "")
                    : "")
                : "")
            : "")
        : "";
      gstNum = v;
    }

    // if(this.customerGroupForm.value.gst.length == 17){
    //   let prefix = gstNum.substr(0, gstNum.length - 6);
    //   let suffix = gstNum.substr(-6);
    //   let masked = prefix.replace(/[A-Z\d]/g, '*');
    //   let a = masked + suffix;
    //   this.customerGroupForm.patchValue({
    //     gst: a,
    //   })
    // }
    // else
    // {
    this.customerGroupForm.patchValue({
      gst: gstNum
    });
    // }
  }

  pageChangedInvoicePaymentList(pageNumber) {
    this.currentPageinvoicePaymentList = pageNumber;
  }

  invoicePaymentCloseModal() {
    this.ifInvoicePayment = false;
    this.ispaymentChecked = false;
    this.allIsChecked = false;
    this.invoicePaymentModal = false;
    this.isSinglepaymentChecked = false;
    this.invoicePaymentData = [];
    this.allchakedPaymentData = [];
  }

  InvoiceReprint(docnumber, custname) {
    const url = "/regeneratePdfForTrail/" + docnumber;
    this.invoiceMasterService.downloadPDF(url).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        FileSaver.saveAs(file, custname);

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

  cancelRegenrateInvoice(invoice) {
    const data = {};

    const url = "/invoiceV2/cancelAndRegenerate/" + invoice.id + "?isCaf=true";
    this.customerManagementService.postMethodPasssHeader(url, data).subscribe(
      (response: any) => {
        // this.closebutton.nativeElement.click();
        this.ifInvoicePayment = false;
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.isSinglepaymentChecked = false;
        this.invoicePaymentData = [];
        this.allchakedPaymentData = [];
        this.searchinvoiceMaster("", "");

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
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

  invicePaymentList(invoice) {
    this.invoiceID = invoice.id;

    this.invoicePaymentData = [];
    if (invoice.adjustedAmount >= invoice.totalamount) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Total payment is already adjusted",
        icon: "far fa-times-circle"
      });
    } else {
      this.invoicePaymentModal = false;
      const url = "/paymentmapping/" + this.invoiceID;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.invoicePaymentData = response.Paymentlist;
          this.invoicePaymenttotalRecords = this.invoicePaymentData.length;

          this.invoicePaymentData.forEach((value, index) => {
            this.invoicePaymentData[index].isSinglepaymentChecked = false;
            this.totaladjustedAmount =
              this.totaladjustedAmount + this.invoicePaymentData[index].adjustedAmount;
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

  checkInvoicePaymentAll(event) {
    if (event.checked == true) {
      this.allchakedPaymentData = [];
      const checkedData = this.invoicePaymentData;
      for (let i = 0; i < checkedData.length; i++) {
        this.allchakedPaymentData.push({
          id: this.invoicePaymentData[i].id,
          amount: this.invoicePaymentData[i].amount
        });
      }
      this.allchakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.id) {
            element.isSinglepaymentChecked = true;
          }
        });
      });
      this.ispaymentChecked = true;
      // console.log(this.allchakedPaymentData);
    }
    if (event.checked == false) {
      const checkedData = this.invoicePaymentData;
      this.allchakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.id) {
            element.isSinglepaymentChecked = false;
          }
        });
      });
      this.allchakedPaymentData = [];
      // console.log(this.allchakedPaymentData);
      this.ispaymentChecked = false;
      this.allIsChecked = false;
    }
  }

  addInvoicePaymentChecked(id, event) {
    if (event.checked) {
      this.invoicePaymentData.forEach((value, i) => {
        if (value.id == id) {
          this.allchakedPaymentData.push({
            id: value.id,
            amount: value.amount
          });
        }
      });

      if (this.invoicePaymentData.length === this.allchakedPaymentData.length) {
        this.ispaymentChecked = true;
        this.allIsChecked = true;
      }
      // console.log(this.allchakedPaymentData);
    } else {
      const checkedData = this.invoicePaymentData;
      checkedData.forEach(element => {
        if (element.id == id) {
          element.isSinglepaymentChecked = false;
        }
      });
      this.allchakedPaymentData.forEach((value, index) => {
        if (value.id == id) {
          this.allchakedPaymentData.splice(index, 1);
          // console.log(this.allchakedPaymentData);
        }
      });

      if (
        this.allchakedPaymentData.length == 0 ||
        this.allchakedPaymentData.length !== this.invoicePaymentData.length
      ) {
        this.ispaymentChecked = false;
      }
    }
  }

  invoicePaymentAdjsment() {
    const data = {
      invoiceId: this.invoiceID,
      creditDocumentList: this.allchakedPaymentData
    };

    const url = "/invoicePaymentAdjust";
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        // this.closebutton.nativeElement.click();
        this.ifInvoicePayment = false;
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.isSinglepaymentChecked = false;
        this.invoicePaymentData = [];
        this.allchakedPaymentData = [];
        this.searchinvoiceMaster(this.customerDetailData.id, "");
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

  // InvoiceListByCustomer(id) {
  //     const url = "/invoiceList/byCustomer/" + id;
  //     this.invoiceList = [];

  //     this.revenueManagementService.getAllInvoiceByCustomer(url).subscribe(
  //         (response: any) => {
  //             const invoiceList = response.invoiceList;
  //             this.invoiceList.push(...this.invoicedropdownValue);
  //             this.invoiceList.push(...invoiceList);
  //         }
  //         //   (error: any) => {
  //         //     // console.log(error, "error")
  //         //     this.messageService.add({
  //         //       severity: "error",
  //         //       summary: "Error",
  //         //       detail: error.error.ERROR,
  //         //       icon: "far fa-times-circle",
  //         //     });
  //         //
  //         //   }
  //     );
  // }
  InvoiceListByCustomer(id) {
    const url = "/invoiceList/byCustomer/" + id;
    this.invoiceList = [];
    const Data = [];
    this.masterSelected = false;

    this.revenueManagementService.getAllInvoiceByCustomer(url).subscribe(
      (response: any) => {
        const invoicedata = [];
        if (response.invoiceList != null && response.invoiceList.length != 0) {
          this.invoiceList.push(...response.invoiceList);
        } else {
          this.invoiceList.push(...this.invoicedropdownValue);
        }
        // this.invoiceList = Data;
        this.invoiceList.forEach(item => {
          item.tdsCheck = 0;
          item.abbsCheck = 0;
          item.tds = 0;
          item.abbs = 0;
          item.includeTds = false;
          item.includeAbbs = false;
          item.testamount = this.getPendingAmount(item);
          item.convertedAmount = item.testamount * this.convertedExchangeRate;
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

  modalOpenParentCustomer(type) {
    this.parentCustomerDialogType = type;
    this.showParentCustomerModel = true;
    this.customerSelectType = "Billable To";
    if (type === "parent") {
      this.customerSelectType = "Parent";
    }
    this.selectedParentCust = [];
  }

  getParentCustomerData() {
    //
    let currentPage;
    // if (pageData) {
    //   currentPage = pageData + 1;
    // } else {
    currentPage = this.currentPageParentCustomerListdata;
    // }

    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerDetailData?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/parentCustomers/list/" + this.custType + "?mvnoId=" + mvnoId;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.parentCustomerList;
        const list = this.prepaidParentCustomerList;
        const filterList = list.filter(cust => cust.id !== this.editCustomerId);

        this.prepaidParentCustomerList = filterList;

        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
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
      this.changePlanForm.patchValue({
        billableCustomerId: this.selectedParentCust.id
      });
    } else if (this.parentCustomerDialogType === "billable-shift-location") {
      this.billableCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.shiftLocationChargeGroupForm.patchValue({
        billableCustomerId: this.selectedParentCust.id
      });
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

  removeSelParentCust(type) {
    this.selectedParentCust = [];
    if (type === "billable") {
      this.billableCustList = [];
      this.customerGroupForm.patchValue({
        billableCustomerId: null
      });
    } else if (type === "billable-change-plan") {
      this.billableCustList = [];
      this.changePlanForm.patchValue({
        billableCustomerId: null
      });
    } else if (type === "billable-shift-location") {
      this.billableCustList = [];
      this.shiftLocationChargeGroupForm.patchValue({
        billableCustomerId: null
      });
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
          // if(this.serviceAreaData.latitude && this.serviceAreaData.longitude){
          //   this.customerGroupForm.patchValue({
          //     latitude: this.serviceAreaData.latitude,
          //     longitude: this.serviceAreaData.longitude,
          //   })
          // }

          // this.getAreaData(this.serviceAreaData.areaid, "present");
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
  }

  selParentSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  searchParentCustomer() {
    this.prepaidParentCustomerList = [];
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
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerDetailData?.mvnoId
          ? this.customerDetailData?.mvnoId
          : localStorage.getItem("mvnoId")
        : localStorage.getItem("mvnoId");
    const url = "/parentCustomers/search/" + this.custType + "?mvnoId=" + mvnoId;
    // console.log("this.searchData", this.searchData)
    this.customerManagementService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.msg,
            icon: "far fa-times-circle"
          });
          // this.customerListData = [];
          this.parentCustomerListdatatotalRecords = 0;
        } else {
          this.prepaidParentCustomerList = response.parentCustomerList;
          const list = this.prepaidParentCustomerList;
          const filterList = list.filter(cust => cust.id !== this.editCustomerId);
          this.prepaidParentCustomerList = filterList;
          this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        }
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.customerListData = [];
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

  openPaymentInvoiceModal(id, paymentId) {
    this.displayInvoiceDetails = true;
    this.PaymentamountService.show(id);
    this.paymentId.next({
      paymentId
    });
  }

  closeParentCust() {
    this.displayInvoiceDetails = false;
  }

  closeParentCusttt() {
    this.showParentCustomerModel = false;
  }

  closeModel() {
    this.visibleQuotaDetails = false;
    this.PlanQuota = new BehaviorSubject({
      custid: "",
      PlanData: ""
    });
  }

  // update Discount
  async updateDiscount() {
    const data = [];
    let hasError = false;

    for (let index = 0; index < this.custCustDiscountList.length; index++) {
      const row = this.custCustDiscountList[index];
      if (!row.isSelected) continue;
      if (!row.newDiscount || row.newDiscount > 99 || row.newDiscount < 1) {
        hasError = true;
        continue;
      }

      if (
        row.discount !== row.newDiscount ||
        row.discountType !== row.newDiscountType ||
        row.discountExpiryDate !== row.newDiscountExpiryDate
      ) {
        data.push({
          id: row.id,
          custId: row.custId,
          connectionNo: row.connectionNo,
          serviceName: row.serviceName,
          serviceId: row.serviceId,
          invoiceType: row.invoiceType,
          discount: row.discount,
          newDiscount: row.newDiscount,
          discountType: row.discountType ?? "One-time",
          newDiscountType: row.newDiscountType ?? "One-time",
          discountExpiryDate: row.discountExpiryDate
            ? moment(row.discountExpiryDate).utc(true).toDate()
            : null,
          newDiscountExpiryDate:
            row.newDiscountType === null || row.newDiscountType === "One-time"
              ? null
              : moment(row.newDiscountExpiryDate).utc(true).toDate()
        });
      }
    }

    if (hasError) {
      return;
    }

    if (data.length === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "No record selected",
        detail: "Please select at least one record"
      });
      return;
    }

    const url = "/subscriber/changeCustomerDiscountServiceLevel/" + this.customerDetailData.id;

    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.getcustDiscountDetails(this.customerDetailData.id, "");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: error.error.errorMessage,
          detail: error.error.errorMessage
        });
      }
    );
  }

  oldDiscValueEdit(id) {
    this.oldDiscValue = id;
    this.newDiscValue = 0;
  }

  newDiscValueEdit(id) {
    this.newDiscValue = id;
    this.oldDiscValue = 0;
  }

  planGroupSelectSubisu(e) {
    if (e.value) {
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
          }
          if (planDetailData.category == "Business Promotion") {
            this.ifplanisSubisuSelect = true;
            this.customerGroupForm.patchValue({
              billTo: "ORGANIZATION",
              isInvoiceToOrg: planDetailData.invoiceToOrg
            });

            // $('#selectPlanGroup').modal('show')
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

            let newAmount = 0;
            let totalAmount = 0;
            this.planIds = [];
            planDetailData.planMappingList.forEach((element, i) => {
              let n = i + 1;
              newAmount = element.plan.newOfferPrice
                ? element.plan.newOfferPrice
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
            // if (this.customerChangePlan) {
            //   $("#selectPlanGroup").modal("show");
            //   this.planGroupSelectedSubisu = e;
            //   console.log(this.planGroupSelectedSubisu);
            //   this.getPlanListByGroupIdSubisu();
            // }
          }
        },
        (error: any) => {}
      );
    }

    this.getPlangroupByPlan(e.value);
    this.planGroupDataById(e.value);
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
          let newAmount = element.newOfferPrice ? element.newOfferPrice : element.offerprice;

          this.plansArray.push(
            this.fb.group({
              planId: element.id,
              name: element.displayName,
              service: element.serviceId,
              validity: element.validity,
              discount: element.discount,
              billTo: "ORGANIZATION",
              offerPrice: element.offerprice,
              newAmount: element.newOfferPrice ? element.newOfferPrice : element.offerprice,
              chargeName: element.chargeList[0].charge.name,
              isInvoiceToOrg: this.customerGroupForm.value.isInvoiceToOrg
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

  modalClosePlanChangeSubisu() {
    this.selectPlanGroup = false;
  }

  valueChange(e) {
    if (!this.ifPlanGroup) {
      this.plansArray.value.forEach(element => {
        element.isInvoiceToOrg = e.value;
      });
    }
  }

  valueChangetrailPlan(e) {
    if (e.checked == true) {
      this.plansArray.value.forEach(element => {
        element.istrialplan = true;
      });
    } else {
      this.plansArray.value.forEach(element => {
        element.istrialplan = false;
      });
    }
  }

  addWalletIncustomer(id) {
    let custID = "";
    if (id.value) {
      custID = id.value;
    } else {
      custID = id;
    }
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;

    this.ifWalletMenu = true;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.ifChargeGetData = false;
    this.isCallDetails = false;
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
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.getWallatData = response;
      this.WalletAmount = response.customerWalletDetails;
    });
  }

  openchargeDetails(custId) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerUpdateDiscount = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.ifChargeGetData = true;
    this.chargeUseCustID = custId;
    this.shiftLocationEvent = false;
    this.isCallDetails = false;
  }

  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }

  selectTypecharge(e) {
    this.chargeGroupForm.get("connection_no").reset();
    this.chargeGroupForm.get("planid").reset();
    this.chargeGroupForm.get("expiry").reset();
    if (e.value == "Recurring") {
      // this.chargeGroupForm.get("billingCycle").setValidators([Validators.required]);
      // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    } else {
      this.chargeGroupForm.value.billingCycle = 0;
      // this.chargeGroupForm.get("billingCycle").clearValidators();
      // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    }
  }

  isStaticIPAdrress(chargeid) {
    if (chargeid !== null && chargeid !== undefined && chargeid !== "") {
      return (
        this.commondropdownService.chargeByTypeData.filter(
          charge => charge.id === chargeid && charge.chargecategory === "IP"
        ).length > 0
      );
    } else {
      return false;
    }
  }

  assignToStaffInventory(flag) {
    let url: any;
    let name: string;

    if (this.customerUpdateDiscount) {
      name = "CUSTOMER_DISCOUNT";
    } else if (this.shiftLocationEvent) {
      name = "SHIFT_LOCATION";
    } else {
      name = "CUSTOMER_INVENTORY_ASSIGN";
    }
    if (flag) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.InventoryselectStaff}&isApproveRequest=${flag}`;
    } else {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.InventoryselectStaffReject}&isApproveRequest=${flag}`;
    }

    this.customerManagementService.getMethod(url).subscribe(
      response => {
        if (flag) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        this.assignCustomerInventoryModal = false;
        this.rejectCustomerInventoryModal = false;
        if (this.customerUpdateDiscount) {
          this.openCustorUpdateDiscount(this.customerDetailData.id);
        } else if (this.shiftLocationEvent) {
          this.openCustomerAddress;
        } else {
          this.getCustomerAssignedList(this.assignInventoryCustomerId);
        }

        // this.getCustomer();
        this.getcustomerList("");
        // this.newCustomerAddressDataForCustometr(this.customerDetailData.id);
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

  custWorkflowAuditopen(id, auditcustid) {
    this.getworkflowAuditDetails("", auditcustid, "CAF");
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid,
      checkHierachy: "CAF",
      planId: ""
    });
  }

  custTerminationWorkflowAuditopen(id, auditcustid) {
    this.getworkflowAuditDetails("", auditcustid, "CAF");
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid,
      checkHierachy: "CAF",
      planId: ""
    });
  }

  getCustPlanGroupDataopen(id, planGroupcustid) {
    this.PaymentamountService.show(id);
    this.planGroupcustid.next({
      planGroupcustid
    });
  }

  promiseToPayDetailsClick(id, startDate, endDate, days) {
    this.promiseToPayData = [{ startDate: startDate, endDate: endDate, days: days }];
    this.isPromiseToPayModelOpen = true;
    this.PaymentamountService.show(id);
  }

  custDiscountWorkflowAuditopen(id, auditcustid, planID) {
    this.ifModelIsShow = true;
    this.getworkflowAuditDetails("", auditcustid, "CUSTOMER_DISCOUNT");
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid,
      checkHierachy: "CUSTOMER_DISCOUNT",
      planId: planID
    });
  }

  // DBR

  discountRejected(data) {
    this.rejectApproveDiscountModal = true;
    this.assignDiscountData = data;
    this.discountFlageType = "Rejected";
    this.AppRjecHeader = "Reject";
    this.assignAppRejectDiscountForm.reset();
  }

  discountApporeved(data) {
    this.rejectApproveDiscountModal = true;
    this.assignDiscountData = data;
    this.discountFlageType = "approved";
    this.AppRjecHeader = "Approve";
    this.assignAppRejectDiscountForm.reset();
  }

  assignDiscountApprove() {
    this.assignDiscounsubmitted = true;
    if (this.assignAppRejectDiscountForm.valid) {
      let url = "/approveChangeDiscountServiceLevel";

      let assignCAFData = {
        // assignedDate: '',
        // credDocId: '',
        custPackageId: this.assignDiscountData.id,
        // custcafId: '',
        flag: this.discountFlageType,
        // newDiscount: this.assignDiscountData.newDiscount,
        nextStaffId: 0,
        planId: this.assignDiscountData.planId,
        remark: this.assignAppRejectDiscountForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
        // status: ''
      };

      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.rejectApproveDiscountModal = false;
          if (response.dataList) {
            this.staffList = response.dataList;
            if (this.discountFlageType == "approved") {
              this.approved = true;
              this.approveInventoryData = response.dataList;
              this.assignCustomerInventoryModal = true;
            } else {
              this.reject = true;
              this.rejectInventoryData = response.dataList;
              this.rejectCustomerInventoryModal = true;
            }
            $("#customerDiscount").modal("show");
          } else {
            this.openCustorUpdateDiscount(this.customerDetailData.id);
          }
          this.assignAppRejectDiscountForm.reset();
          this.assignDiscounsubmitted = false;
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
    this.getworkflowAuditDetails(this.showItemPerPage, this.workflowID, "CAF");
  }

  TotalItemPerPageWorkFlow(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageMasterSlab > 1) {
      this.currentPageMasterSlab = 1;
    }
    this.getworkflowAuditDetails(this.showItemPerPage, this.workflowID, "CAF");
  }

  withdrawalAmountModel(modelID, wCustID, WalletAmount) {
    this.displayDialogWithDraw = true;

    // this.PaymentamountService.show(modelID);
    this.wCustID.next({
      wCustID,
      WalletAmount
    });
  }

  closeSelectStaff() {
    this.displayDialogWithDraw = false;
  }

  selectedStaffChangee(event) {
    this.displayDialogWithDraw = false;
  }

  openDBRReportDetails() {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifChargeGetData = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerUpdateDiscount = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.ifShowDBRReport = true;
    this.shiftLocationEvent = false;
    this.currentPageDBRListdata = 1;
    this.showItemDBRPerPage = 0;
    this.DBRListdatatotalRecords = RadiusConstants.ITEMS_PER_PAGE;
    this.dbrListData = [];
    this.searchDBR();
    this.isCallDetails = false;
  }

  TotalItemDBRPerPage(event) {
    this.showItemDBRPerPage = Number(event.value);
    if (this.currentPageDBRListdata > 1) {
      this.currentPageDBRListdata = 1;
    }
    if (!this.searchkey) {
      this.searchDBR();
    }
  }

  searchDBR() {
    let page_list;
    let size = this.showItemDBRPerPage;
    if (size != 0) {
      page_list = size;
      this.DBRListdataitemsPerPage = size;
    } else {
      if (this.showItemDBRPerPage == 0) {
        this.DBRListdataitemsPerPage = this.pageITEM;
      } else {
        this.DBRListdataitemsPerPage = this.showItemDBRPerPage;
      }
    }
    let firstDay;
    let lastDay;
    firstDay = this.searchDBRFormDate;
    lastDay = this.searchDBREndDate;
    const url =
      "/getCustomer?custid=" +
      this.customerDetailData.id +
      "&startdate=" +
      firstDay +
      "&endate=" +
      lastDay;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.dbrListData = response;
        this.DBRListdatatotalRecords = this.dbrListData.length;

        this.searchDBRFormDate = "";
        this.searchDBREndDate = "";
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

  searchClearDBR() {
    this.searchDBRFormDate = "";
    this.searchDBREndDate = "";
    this.searchDBR();
  }

  pageChangedDbrList(pageNumber) {
    this.currentPageDBRListdata = pageNumber;
  }

  downloadInvoice(docId, custId, fileName) {
    const url = "/documentForInvoice/download/" + docId + "/" + custId;
    this.customerManagementService.downloadInvoice(url).subscribe(
      (response: any) => {
        var fileType = "";
        // if (fileName.includes(".png")) {
        //   fileType =
        // }
        var file = new Blob([response]);
        var fileURL = URL.createObjectURL(file);
        FileSaver.saveAs(file, fileName);
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

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = "";
      this.fileName = event.target.files[0].name;
      this.file = event.target.files[0];
      // this.paymentFormGroup.patchValue({
      //   file: file,
      // });
    }
  }

  newCustomerAddressDataForCustometr: any;
  getNewCustomerAddressForCustomer(id): void {
    const url = "/newcustomeraddress/" + id;

    this.customerManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.newCustomerAddressDataForCustometr = res.newcustomerAddress;
      },
      (error: any) => {}
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
    this.shiftLocationFlagType = "approved";
    this.AppRjecHeader = "Approve";
    this.assignAppRejectShiftLocationForm.reset();
  }

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
          if (response.result.dataList) {
            if (this.shiftLocationFlagType == "approved") {
              this.approved = true;
              this.approveInventoryData = response.result.dataList;
              this.assignCustomerInventoryModal = true;
            } else {
              this.reject = true;
              this.rejectInventoryData = response.result.dataList;
              this.rejectCustomerInventoryModal = true;
            }
          }
          this.openCustomerAddress();
          this.assignAppRejectShiftLocationForm.reset();
          this.assignShiftLocationsubmitted = false;

          // this.newCustomerAddressDataForCustometr(this.customerDetailData.id);
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

  openCustomerAddress() {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = true;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = true;
    this.isCallDetails = false;
  }

  generatePDFInvoice(custId) {
    if (custId) {
      const url = "/generateTrialPdfByInvoiceId/" + custId;
      this.customerManagementService.generateMethodInvoice(url).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            // this.searchInvoiceData("", "");
            this.searchinvoiceMaster("", "");
          } else {
            response.responseCode == 417;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          }
          //   this.messageService.add({
          //     severity: "success",
          //     summary: "Success",
          //     detail: response.responseMessage,
          //     icon: "far fa-times-circle"
          //   });
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
  getCustomerType() {
    const url = "/commonList/Customer_Type";
    const custerlist = {};
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.Customertype = response.dataList;
        // console.log(this.customerGroupForm.value.subType,"this.customerGroupForm.value.subType");

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
  getSelectCustomerType(event) {
    const selCustomerType = event.value;
    if (selCustomerType == "Paid") {
      this.customerGroupForm.controls.subType.enable();
    }
  }
  getCustomerSector() {
    const url = "/commonList/Customer_Sector";
    const custerlist = {};
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.CustomerSector = response.dataList;
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
  getSelectCustomerSector(event) {
    const value = event.value;
    if (value) {
      this.customerGroupForm.controls.dunningSubSector.enable();
    } else {
      this.customerGroupForm.controls.dunningSubSector.disable();
    }
  }

  downloadPDFINvoice(docNo, customerName) {
    if (docNo) {
      const downloadUrl = "/trialinvoicePdf/download/" + docNo;
      this.customerManagementService.downloadPDFInvoice(downloadUrl).subscribe(
        (response: any) => {
          const file = new Blob([response], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          FileSaver.saveAs(file, customerName + docNo);
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

  canExit() {
    return this.utils.canExit(this.customerGroupForm.dirty);
  }

  checkExit(type) {
    // this.getcustomerList("");
    this.currentPagecustomerListdata = 1;
    this.customerListdataitemsPerPage = 20;
    if (this.isCustomerDetailSubMenu || !this.customerGroupForm.dirty) {
      this.customerGroupForm.markAsPristine();
      if (type === "create") {
        this.createCustomerCaf();
      } else {
        this.listCustomer();
      }
    } else {
      this.confirmationService.confirm({
        header: "Alert",
        message: "The filled data will be lost. Do you want to continue? (Yes/No)",
        icon: "pi pi-info-circle",
        accept: () => {
          this.customerGroupForm.markAsPristine();
          if (type === "create") {
            this.createCustomerCaf();
          } else {
            this.listCustomer();
          }
        },
        reject: () => {
          return false;
        }
      });
    }
  }
  openInventoryDetailModal(modalId, data) {
    this.CustomerInventoryDetailsService.show(modalId);
    this.inventoryData.next({
      inventoryData: data
    });
  }

  getCustomerAssignedList(id): void {
    const data = {
      filters: [
        {
          filterValue: id,
          filterColumn: "customerId"
        }
      ],
      page: 1,
      pageSize: 5,
      sortBy: "createdate",
      sortOrder: 0
    };
    data.page = this.customerInventoryListDataCurrentPage;
    data.pageSize = this.customerInventoryListItemsPerPage;

    this.customerInventoryMappingService.getByCustomerId(data).subscribe(
      (res: any) => {
        this.assignInventoryWithSerial = false;
        this.assignedInventoryList = res.dataList;
        this.customerInventoryListDataTotalRecords = res.totalRecords;
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
  pickModalOpen(data) {
    let url = "/workflow/pickupworkflow?eventName=CAF&entityId=" + data.id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.getcustomerList("");
        if (this.searchkey) {
          this.searchcustomer();
        } else {
          this.getcustomerList("");
        }

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
  viewInvoice(docnumber, custname) {
    const url = "/regeneratePdfForTrail/" + docnumber;
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
  AuditData1: any = [];
  currentPageAuditSlab1 = 1;
  AudititemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  AudittotalRecords1: String;
  auditList: any = [];
  sortOrder = 0;
  auditData: any;
  GetAuditData(custId, size) {
    let page = this.currentPageAuditSlab1;
    let page_list;
    if (size) {
      page_list = size;
      this.AudititemsPerPage1 = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.AudititemsPerPage1 = 5;
      } else {
        this.AudititemsPerPage1 = 5;
      }
    }
    this.AuditData1 = [];

    let data = {
      page: page,
      pageSize: this.AudititemsPerPage1,
      sortBy: "id",
      sortOrder: 0
    };
    const url = "/auditLog/getAuditList/" + custId;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.AuditData1 = response.dataList;
        this.AudittotalRecords1 = response.totalRecords;
        //this.auditList = response.dataList;
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
  pageChangedAuditList(pageNumber) {
    this.currentPageAuditSlab1 = pageNumber;
    this.GetAuditData(this.auditData, "");
  }
  TotalItemPerPageAudit(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAuditSlab1 > 1) {
      this.currentPageAuditSlab1 = 1;
    }
    this.GetAuditData(this.showItemPerPage, this.auditData);
  }

  openCustomersChangePlan(data) {
    this.paymentModeData();
    let mvnoId =
      localStorage.getItem("mvnoId") == "1" ? data?.mvnoId : localStorage.getItem("mvnoId");
    data?.currency
      ? (this.currency = data?.currency)
      : this.systemService
          .getConfigurationByName("CURRENCY_FOR_PAYMENT", mvnoId)
          .subscribe((res: any) => {
            this.currency = res.data.value;
          });
    this.commondropdownService.getChargeTypeByList("", this.currency, mvnoId);
    // this.commondropdownService.getChargeTypeByList();
    this.getPlanPurchaseType();
    this.childPlanRenewArray = this.fb.array([]);
    this.changePlanForm.reset();
    this.chargenewPlanForm.reset();
    this.changePlanForm.controls.planId.setValue("");
    this.changePlanForm.controls.planGroupId.setValue("");
    this.changePlanForm.controls.purchaseType.setValue("Changeplan");
    this.changePlanForm.controls.remarks.setValue("");
    this.filterPlanListCust = [];
    this.planListByType = [];
    this.selPlanData = [];
    this.changePlanDate = [];
    this.newAdddiscountdata = [];
    this.planDiscount = 0;
    this.finalOfferPrice = 0;
    this.pageNumberForChildsPageForChangePlan = 1;
    this.pageSizeForChildsPageForChangePlan = RadiusConstants.ITEMS_PER_PAGE;
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = true;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.customerUpdateDiscount = false;
    this.shiftLocationEvent = false;
    this.isPlanTypeAddon = false;
    this.changeplanGroupFlag = true;
    this.ifPlanSelectChanePlan = false;
    this.changeplanGroupFlag = false;
    this.isCallDetails = false;
    this.staffSelectList.push({
      id: Number(localStorage.getItem("userId")),
      name: localStorage.getItem("loginUserName")
    });

    this.changePlanForm.patchValue({
      paymentOwnerId: Number(localStorage.getItem("userId"))
    });
    if (data.plangroupid) {
      this.lastRenewalPlanGroup(data.id);
      this.getplanChangeforplanGroup(data.id);
    }

    this.getcustDiscountDetails(data.id, "");
    this.customerchargeDATA(data.id, "parent");
    const checkCustTypeurl = `/isCustomerPrimeOrNot?custId=${data.id}`;
    this.customerManagementService.getMethod(checkCustTypeurl).subscribe((responsePrime: any) => {
      // plan deatils
      let specialPlanURL;
      let planurl;
      let planGroupurl;
      let planCategory;
      let PlanGroupCatogry;
      let plandata1: any = [];
      let plandata2: any = [];
      if (responsePrime.isCustomerPrime) {
        planurl = `/premierePlan/all?custId=${data.id}&isPremiere=true&serviceAreaId=${this.customerDetailData.serviceareaid}`;
        let mvnoId =
          localStorage.getItem("mvnoId") == "1"
            ? this.customerDetailData?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        planGroupurl = `/planGroupMappings?mode=""` + "&mvnoId=" + mvnoId;
        specialPlanURL = `/plansByServiceAreaCustId?custId=${data.id}&planmode=SPECIAL&serviceAreaId=${this.customerDetailData.serviceareaid}`;
      }
      if (this.customerDetailData.plangroupid != null) {
        let mvnoId =
          localStorage.getItem("mvnoId") == "1"
            ? this.customerDetailData?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        let url =
          "/findPlanGroupById?planGroupId=" +
          this.customerDetailData.plangroupid +
          "&mvnoId=" +
          mvnoId;

        this.customerManagementService.getMethod(url).subscribe((response: any) => {
          PlanGroupCatogry = response.planGroup.category;

          if (!responsePrime.isCustomerPrime) {
            let mvnoId =
              localStorage.getItem("mvnoId") == "1"
                ? this.customerGroupForm.value?.mvnoId
                : Number(localStorage.getItem("mvnoId"));
            planGroupurl =
              `/planGroupMappings?mode=NORMAL` +
              "&planCategory=" +
              PlanGroupCatogry +
              "&custId=" +
              this.customerDetailData.id +
              "&mvnoId=" +
              mvnoId;
            planurl =
              "/plans/serviceArea?planCategory=" +
              "NORMAL" +
              "&serviceAreaId=" +
              this.customerDetailData.serviceareaid +
              "&planmode=NORMAL" +
              "&mvnoId=" +
              this.customerDetailData.mvnoId;
          }
          this.customerManagementService.getMethod(planGroupurl).subscribe((response: any) => {
            this.filterPlanGroupListCust = response.planGroupList.filter(
              plan => plan.plantype === this.customerDetailData.custtype
            );
            let data1;
            let data2;
            if (this.filterPlanGroupListCust) {
              data1 = this.filterPlanGroupListCust.filter(
                plan => plan.servicearea.id == this.customerDetailData.serviceareaid
              );
              data2 = this.filterNormalPlanGroup.filter(plan =>
                plan.servicearea.forEach(e => e == this.customerDetailData.serviceareaid)
              );
            }
            setTimeout(() => {
              this.filterPlanGroupListCust = [...data1, ...data2];
            }, 1000);
            this.filterPlanGroupListCust.forEach((element, index) => {
              // if (
              //   element.planGroupId == this.customerDetailData.plangroupid
              // ) {
              //   this.filterPlanGroupListCust.splice(index, 1)
              // }

              if (element.planMode == "SPECIAL") {
                element.planGroupName = element.planGroupName + " - (SP)";
              }
            });
            this.newPlanGroupData = this.filterPlanGroupListCust;
            this.changePlanType("Changeplan", null);
          });
          this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
            this.planListByType = response.postpaidplanList.filter(
              plan => plan.plantype === this.customerDetailData.custtype
            );

            this.planListByType.forEach(element => {
              if (element.mode == "SPECIAL") {
                element.name = element.name + " - (SP)";
              }
            });
          });
        });
      } else {
        if (this.customerDetailData.planMappingList.length > 0 && !responsePrime.isCustomerPrime) {
          let mvnoId =
            localStorage.getItem("mvnoId") == "1"
              ? this.customerDetailData?.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          const url = "/postpaidplan/" + this.planMappingData[0].planId + "?mvnoId=" + mvnoId;
          this.customerManagementService.getMethod(url).subscribe((response: any) => {
            planCategory = response.postPaidPlan.category;

            if (!responsePrime.isCustomerPrime) {
              planurl =
                "/plans/serviceArea?planCategory=" +
                planCategory +
                "&serviceAreaId=" +
                this.customerDetailData.serviceareaid +
                "&planmode=NORMAL" +
                "&custId=" +
                this.customerDetailData.id +
                "&mvnoId=" +
                this.customerDetailData.mvnoId;
            }
            this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
              this.filterPlanListCust = response.postpaidplanList.filter(
                plan => plan.plantype === this.customerDetailData.custtype
              );

              this.filterPlanListCust.forEach(element => {
                if (element.mode == "SPECIAL") {
                  element.name = element.name + " - (SP)";
                }
              });
              //console.log(this.filterPlanListCust, "DataList plan");
              this.changePlanType("Changeplan", null);
            });
          });
        } else {
          if (!responsePrime.isCustomerPrime) {
            planurl =
              "/plans/serviceArea?planCategory=" +
              "Normal" +
              "&serviceAreaId=" +
              this.customerDetailData.serviceareaid +
              "&planmode=NORMAL" +
              "&custId=" +
              this.customerDetailData.id +
              "&mvnoId=" +
              this.customerDetailData.mvnoId;
          }
          this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
            plandata1 = response.postpaidplanList.filter(
              plan => plan.plantype === this.customerDetailData.custtype
            );

            if (plandata1.length > 0) {
              plandata1.forEach((element, i) => {
                let n = i + 1;
                if (element.mode == "SPECIAL") {
                  element.name = element.name + " - (SP)";
                }
              });
            }

            if (responsePrime.isCustomerPrime) {
              this.customerManagementService
                .getMethod(specialPlanURL)
                .subscribe((response: any) => {
                  plandata2 = response.postpaidplanList.filter(
                    plan => plan.plantype === this.customerDetailData.custtype
                  );

                  if (plandata2.length > 0) {
                    plandata2.forEach((element1, j) => {
                      let m = j + 1;
                      if (element1.mode == "SPECIAL") {
                        element1.name = element1.name + " - (SP)";
                      }
                      if (plandata2.length == m) {
                        plandata2.forEach((e1, i) => {
                          plandata1.forEach((e2, j) => {
                            if (e1.id == e2.id) {
                              plandata2.splice(i, 1);
                            }
                            let k = i + 1;
                          });
                        });
                        this.filterPlanListCust = plandata1.concat(plandata2);
                        this.changePlanType("Changeplan", null);
                      }
                    });
                  } else if (plandata2.length == 0) {
                    this.filterPlanListCust = plandata1;
                    this.changePlanType("Changeplan", null);
                  }
                });
            } else {
              this.filterPlanListCust = plandata1;
              this.changePlanType("Changeplan", null);
            }
            // console.log(this.filterPlanListCust, "DataList plan");
          });
        }
      }
    });

    this.changePlanForm.get("isPaymentReceived").setValue("false");
    // this.customerChildsView = false; --zulfin
    this.getserviceData("");
    this.getChildCustomersForChangePlan(data.id);
    this.assignInventoryWithSerial = false;
    this.getcustCurrentPlan(data.id, "");
    //this.staffId=serviceAreaId
    this.serviceAreaId = data.serviceareaid;
    this.getStaffDetailById(this.serviceAreaId);
    this.getOldPackData(data.id, mvnoId);
    this.getAllPlanData(this.currency, data);
    this.commondropdownService.getInstallmentTypeData();
    this.isInstallemnt = false;
    this.servicePackForm.reset();
    this.systemService
      .getConfigurationByName("is_installment_allowed", mvnoId)
      .subscribe((res: any) => {
        if (res?.data?.value) {
          this.isInstallmentAllowed = res.data.value === "true";
        }
      });
  }
  lastRenewalPlanGroup(id) {
    const url = "/subscriber/lastrenewalplangroupid/" + id;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.lastRenewalPlanGroupID = response.lastRenewalPlanGroupId;
    });
  }
  getplanChangeforplanGroup(id) {
    const url = "/findPlanGroupMappingByCustId?custId=" + id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.filterPlanGroupListCust = response.planGroupMappingList;

        // this.messageService.add({
        //   severity: "success",
        //   summary: "Success",
        //   detail: response.responseMessage,
        //   icon: "far fa-times-circle",
        // });
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
  customerchargeDATA(id, custtype) {
    const data = [];
    this.chargeGroupForm.reset();
    this.overChargeListFromArray = this.fb.array([]);
    let i = 0;
    const chargedata = [];
    this.customerChargeDataShowChangePlan = [];
    const url = "/getAllCustomerDirectChargeByCustomer/" + id;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        const ChargeCustList = response.custChargeOverrideList;
        if (ChargeCustList.length > 0) {
          this.addChargeForm.patchValue({
            chargeAdd: true
          });
        }

        ChargeCustList.forEach((element, k) => {
          if (element.type == "Recurring") {
            chargedata.push(element);
            this.customerChargeDataShowChangePlan = chargedata;
            if (custtype == "parent") {
              this.parentChargeRecurringCustList = i;
              this.chargeGroupForm.patchValue(element);
              this.onAddoverChargeListField();

              this.overChargeListFromArray.patchValue(chargedata);
            } else {
              this.childChargeRecurringCustList = i;
              this.chargeChildGroupForm.patchValue(element);
              this.onAddoverChargeChildListField();

              this.overChargeChildListFromArray.patchValue(chargedata);
            }
            i++;
          }
          // console.log('kkk' ,this.ChargeRecurringCustList)
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
  getserviceData(groupId) {
    let services = [];
    const url =
      "/subscriber/getPlanByCustService/" +
      this.customerDetailData.id +
      "?isNotChangePlan=false" +
      "&status=NewActivation";
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custServiceData = response.dataList;

        // services = [...new Set(services)];
        if (this.custServiceData.length >= 1) {
          if (groupId) {
            this.planSelected = null;
            this.changePlanRemark = null;
            this.planGroupSelected = groupId;
            this.getPlanListByGroupId();
            $("#selectPlanGroupChangeService").modal("show");
            this.enableChangePlanGroup = false;
          } else {
            this.planSelected = null;
            this.changePlanRemark = null;
            // $("#selectPlanChangeService").modal("show");
          }
        }
        this.filterplan();
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
  getChildCustomersForChangePlan(id) {
    let chargeAvailable: Boolean = false;
    const url = `/getAllChildCustomer?customerId=${id}&invoiceType=Group`;
    const data = {
      page: this.pageNumberForChildsPageForChangePlan,
      pageSize: this.pageSizeForChildsPageForChangePlan
    };
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.childCustomerDataListForChangePlan = response.customerList;
        this.childCustomerDataListForChangePlan.forEach(element => {
          if (element.indiChargeList.length == 0) {
            chargeAvailable = false;
          } else {
            chargeAvailable = true;
          }
          const url = "/subscriber/getActivePlanList/" + element.id + "?isNotChangePlan=false";
          let planList = [];
          this.customerManagementService.getMethod(url).subscribe((response: any) => {
            planList = response.dataList;
            if (planList.length < 2) {
              this.childPlanGroupFlag = false;
              this.childPlan_PLANGROUPID.push({
                id: planList.length > 0 ? [planList[planList.length - 1].planId] : ""
              });
              this.childPlanRenewArray.push(
                this.fb.group({
                  custId: [element.id],
                  planId: planList.length > 0 ? [planList[planList.length - 1].planId] : "",
                  planType: ["Renew"],
                  changePlan: [false],
                  chargeAblSele: [chargeAvailable]
                })
              );
            } else if (planList.length >= 2) {
              this.childPlanGroupFlag = true;
              let groupId;
              setTimeout(() => {
                this.filterPlanGroupListCust.forEach(e => {
                  if (e.planGroupName == planList[0].planGroupName) {
                    groupId = e.planGroupId;
                  }
                });
                this.childPlan_PLANGROUPID.push({ id: groupId });
                this.childPlanRenewArray.push(
                  this.fb.group({
                    custId: [element.id],
                    planGroupId: groupId,
                    planType: ["Renew"],
                    changePlan: [false],
                    chargeAblSele: [chargeAvailable]
                  })
                );
              }, 1000);
            }
          });
        });

        if (this.childCustomerDataListForChangePlan.length > 0) {
          this.UpdateParentCustPlans = false;
        }
        this.childCustomerDataTotalRecordsForChangePlan = response.pageDetails.totalRecords;
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
  onAddoverChargeChildListField() {
    this.chargesubmitted = true;

    if (this.chargeChildGroupForm.valid) {
      if (this.chargeChildGroupForm.value.price >= this.chargeChildGroupForm.value.actualprice) {
        this.overChargeChildListFromArray.push(this.createoverChargeChildListFormGroup());
        this.chargeChildGroupForm.reset();
        this.chargesubmitted = false;
        this.selectchargeValueShow = false;
      }
    } else {
      // console.log("I am not valid");
    }
  }

  getPlanListByGroupId() {
    this.newPlanSelectArray.reset();
    this.newPlanSelectArray = this.fb.array([]);

    const url = `/plansByPlanGroupId?planGroupId=` + this.planGroupSelected;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planList = response.planList;
        if (this.custServiceData) {
          if (this.changenewPlanForm.value.ChangePlanCategory == "groupPlan")
            this.groupPlanListByType = this.planList;
          // this.planListByType = this.planList;
        }
        if (this.lastRenewalPlanGroupID != this.planGroupSelected) {
          this.planList.forEach(element => {
            this.onNewBindingPlanMapping();
          });
        }
        this.planChangeListdatatotalRecords = this.planList.length;
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
  createoverChargeChildListFormGroup(): FormGroup {
    this.chargeChildGroupForm.get("billingCycle").clearValidators();
    this.chargeChildGroupForm.get("billingCycle").updateValueAndValidity();
    return this.fb.group({
      // chargeid: [''],
      type: [this.chargeChildGroupForm.value.type],
      chargeid: [this.chargeChildGroupForm.value.chargeid],
      validity: [this.chargeChildGroupForm.value.validity],
      price: [this.chargeChildGroupForm.value.price],
      actualprice: [this.chargeChildGroupForm.value.actualprice],
      charge_date: [this.chargeChildGroupForm.value.charge_date],
      planid: [this.chargeChildGroupForm.value.planid],
      unitsOfValidity: [this.chargeChildGroupForm.value.unitsOfValidity],
      billingCycle: [this.chargeChildGroupForm.value.billingCycle],
      id: [this.chargeChildGroupForm.value.id]
    });
  }
  onNewBindingPlanMapping() {
    this.newPlanSelectArray.push(this.createteamConditionForm());
  }
  createteamConditionForm(): FormGroup {
    return this.fb.group({
      newPlan: [""]
    });
  }

  savegraceDays() {
    const url = `/subscriber/promiseToPay/${this.customerDetailData.id}?promise_to_pay_remarks=""`;

    this.customerManagementService.getMethod(url).subscribe(
      (res: any) => {
        if (res.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: res.message,
            icon: "far fa-check-circle"
          });
          // $("#IdgraceDays").modal("hide");
          this.graceNumberDays = "";
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
          });
        }
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
  onUpdateParentChange(e) {
    if (e.checked == true) {
      this.UpdateParentCustPlans = true;
    } else {
      this.UpdateParentCustPlans = false;
    }
  }
  filterplan() {
    let i: number;
    this.custServiceData.forEach(element => {
      if (element.customerServiceMappingId == this.custPlanMapppingId) {
        i = element.serviceId;
        this.selectedCustService = element;
      }
    });
    this.getParentCustomerData();
    if (this.selectedCustService?.billablecust != null) {
      this.billableCustList = [
        {
          id: this.selectedCustService.billablecust.id,
          name: this.selectedCustService.billablecust.name
        }
      ];
      this.changePlanForm.patchValue({
        billableCustomerId: this.selectedCustService.billablecust.id
      });
    }
    this.planByService = [];
    this.planListByType.forEach(element => {
      if (element.serviceId == i && element.isDelete == false) {
        this.planByService.push(element);
      }
    });
  }

  changePlanType(purchaseType, selected) {
    let purchaseValue = purchaseType.value || purchaseType;
    if (selected) {
      this.custPlanMapppingId = selected.value;
    }

    this.chargenewPlanForm.reset();
    if (this.customerDetailData.plangroupid) {
      this.filterPlanListCust = [];
      this.newPlanGroupData.forEach(planGroup => {
        planGroup.planMappingList.forEach(planMapping => {
          this.filterPlanListCust.push(planMapping.plan);
        });
      });
    }
    this.changePlanForm.reset(this.changePlanForm.value);
    this.changeplanGroupFlag = false;
    this.selPlanData = [];
    this.finalOfferPrice = 0;
    this.changePlanForm.patchValue({
      purchaseType: purchaseValue,
      planGroupId: "",
      isPaymentReceived: "false",
      planId: "",
      plancharge: ""
    });
    if (purchaseValue) {
      purchaseValue == "vaspack" ? (this.isVasPlan = false) : (this.isVasPlan = true);
    }
    this.isPlanTypeAddon = false;
    if (!this.customerDetailData.plangroupid) {
      this.planListByType = [];
    }
    this.custServiceData = this.custServiceData.filter(
      element => element.planstage?.toLowerCase() !== "future"
    );

    if (purchaseType != null && purchaseType != undefined) {
      if (purchaseType === "Addon") {
        this.isPlanTypeAddon = true;
        this.changeplanGroupFlag = false;
        if (!this.customerDetailData.plangroupid) {
          this.planListByType = this.filterPlanListCust.filter(
            plan =>
              plan.planGroup === "Volume Booster" ||
              plan.planGroup === "Bandwidthbooster" ||
              plan.planGroup === "DTV Addon"
          );
          this.filterplan();
        } else {
          this.planListByType = this.filterPlanListCust.filter(
            plan =>
              plan.planGroup === "Volume Booster" ||
              plan.planGroup === "Bandwidthbooster" ||
              plan.planGroup === "DTV Addon"
          );
        }
        this.changePlanForm.get("planGroupId").disable();
        this.changePlanForm.get("planList").disable();
        this.changePlanForm.get("planId").enable();
        this.planGroupFlag = false;
        if (!this.customerDetailData.plangroupid) {
          this.getserviceData("");
        } else {
          this.getserviceData(this.customerDetailData.planGroupId);
        }
        this.planByService = this.planListByType;
      } else if (purchaseType === "Changeplan") {
        if (this.customerDetailData.plangroupid) {
          this.planListByType = this.filterPlanListCust.filter(
            plan =>
              plan.planGroup === "Registration" || plan.planGroup === "Registration and Renewal"
          );
          this.changePlanForm.get("planGroupId").enable();
          this.changePlanForm.get("planList").enable();
          this.changePlanForm.get("planId").disable();
          this.changePlanForm.get("discountTypeData").disable();
          this.changePlanForm.get("discount").disable();
          this.planGroupFlag = true;
          this.getPlangroupByPlan(this.customerDetailData.plangroupid);
          // if (this.custCurrentPlanList.length > 1) this.changeplanGroupFlag = true;
          // else this.changeplanGroupFlag = false;
          this.changeplanGroupFlag = true;
        }
        if (!this.customerDetailData.plangroupid) {
          this.changePlanForm.get("planGroupId").disable();
          this.changePlanForm.get("planList").disable();
          this.changePlanForm.get("planId").enable();
          this.changePlanForm.get("discountTypeData").enable();
          this.changePlanForm.get("discount").enable();
          this.planListByType = this.filterPlanListCust.filter(
            plan =>
              plan.planGroup === "Registration" || plan.planGroup === "Registration and Renewal"
          );
          this.planGroupFlag = false;
          // if (this.custCurrentPlanList.length > 1) this.changeplanGroupFlag = true;
          // else this.changeplanGroupFlag = false;
          this.changeplanGroupFlag = false;
          this.filterplan();
        } else {
          this.filterSelectedPlanGroupListCust = this.newPlanGroupData.filter(
            plan =>
              plan.planGroupType === "Registration" ||
              plan.planGroupType === "Registration and Renewal"
          );
        }
        this.isPlanTypeAddon = false;
      } else if (purchaseType === "Renew") {
        if (this.customerDetailData.plangroupid) {
          this.planListByType = this.filterPlanListCust.filter(
            plan => plan.planGroup === "Renew" || plan.planGroup === "Registration and Renewal"
          );
          this.changePlanForm.get("planGroupId").enable();
          this.changePlanForm.get("planList").enable();
          this.changePlanForm.get("planId").disable();
          this.planGroupFlag = true;
          this.getPlangroupByPlan(this.customerDetailData.plangroupid);
          this.filterSelectedPlanGroupListCust = this.newPlanGroupData.filter(
            plan =>
              plan.planGroupType === "Renew" || plan.planGroupType === "Registration and Renewal"
          );
          // if (this.custCurrentPlanList.length > 1) this.changeplanGroupFlag = true;
          // else this.changeplanGroupFlag = false;
          this.changeplanGroupFlag = true;
        } else {
          this.changePlanForm.get("planGroupId").disable();
          this.changePlanForm.get("planList").disable();
          this.changePlanForm.get("planId").enable();
          this.planListByType = this.filterPlanListCust.filter(
            plan => plan.planGroup === "Renew" || plan.planGroup === "Registration and Renewal"
          );
          this.planGroupFlag = false;
          this.changeplanGroupFlag = true;
          this.filterplan();
        }
        this.isPlanTypeAddon = false;
      }
    }
    this.planListByType.forEach(e => {
      if (e.quotatype == "Data") {
        e.label =
          e.name +
          ` (${e.quota} ${e.quotaUnit}
          ${e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval}
            - ${e.validity} ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""})`;
      } else if (e.quotatype == "Time") {
        e.label =
          e.name +
          ` (${e.quotatime} ${e.quotaunittime}${
            e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval
          }  - ${e.validity} ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""})`;
      } else if (e.quotatype == "Both") {
        e.label =
          e.name +
          ` (${e.quota} ${e.quotaUnit}${
            e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval
          }  and ${e.quotatime} ${e.quotaunittime}${
            e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval
          }  - ${e.validity} ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""})`;
      } else {
        e.label = e.name;
      }
    });
  }

  getChangePlan($event, custid) {
    if (this.changenewPlanForm.value.ChangePlanCategory == "groupPlan") {
      this.changePlanForm.get("planGroupId").setValidators([Validators.required]);
      this.changePlanForm.get("planGroupId").updateValueAndValidity();
      this.confirmationService.confirm({
        message: "Do you want Change Plan to continue?",
        header: "Change Plan Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          // this.subisuChange = true;
          this.planGroupFlag = true;
          // this.customerDetailData.plangroupid = 0;
          this.getplanChangeforplanGroup(this.custDetilsCustId);
        },
        reject: () => {
          // this.subisuChange = false;
          this.planGroupFlag = false;
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
          // $("#selectPlanChange").modal("show");
        }
      });
    } else if (
      this.changenewPlanForm.value.ChangePlanCategory !== "groupPlan" &&
      this.customerDetailData.plangroupid !== null
    ) {
      this.changePlanForm.get("planGroupId").setValue(null);
      this.changePlanForm.get("planGroupId").clearValidators();
      this.changePlanForm.get("planGroupId").updateValueAndValidity();
      this.getplanChangeforplanGroup(this.custDetilsCustId);
      this.modalOpenPlanChange({ value: this.customerDetailData.plangroupid });
    } else if (this.changenewPlanForm.value.ChangePlanCategory !== "groupPlan") {
      this.planGroupFlag = false;
    }
  }
  modalOpenPlanChange(e) {
    this.planGroupSelected =
      this.changePlanForm.value.planGroupId !== undefined &&
      this.changePlanForm.value.planGroupId !== "" &&
      this.changePlanForm.value.planGroupId !== 0 &&
      this.changePlanForm.value.planGroupId !== null
        ? this.changePlanForm.value.planGroupId
        : e.value;
    this.getPlangroupByPlan(this.planGroupSelected);

    if (this.customerDetailData.planMappingList[0].billTo == "ORGANIZATION") {
      this.confirmationService.confirm({
        message: "The customer is bill_to organization, do you want to continue?",
        header: "Change Plan Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.subisuChange = true;
          this.planGroupSelectSubisu(this.planGroupSelected);
          this.getserviceData(e.value);
        },
        reject: () => {
          this.subisuChange = false;
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
          this.getserviceData(e.value);
          this.getPlanListByGroupId();
        }
      });
    } else {
      this.getserviceData(e.value);
      this.getPlanListByGroupId();
    }
  }
  getPlanDetailById($event) {
    this.planDropdownInChageData = [];
    this.plansArray = this.fb.array([]);
    this.ifPlanSelectChanePlan = true;
    this.planSelected = $event.value;
    this.planSelectedId = $event.index;
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
          ? this.customerGroupForm.value?.mvnoId
          : this.customerDetailData?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/postpaidplan/" + this.planSelected + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.selPlanData = response.postPaidPlan;
        this.planDropdownInChageData.push(response.postPaidPlan);

        // console.log("this.selPlanData", this.selPlanData);
        const date = new Date();
        this.selPlanData.activationDate = this.datePipe.transform(date, "dd-MM-yyyy");
        this.selPlanData.expiryDate = date.setDate(date.getDate() + this.selPlanData.validity);
        this.selPlanData.expiryDate = this.datePipe.transform(
          this.selPlanData.expiryDate,
          "dd-MM-yyyy"
        );
        this.selPlanData.finalAmount = this.selPlanData.offerprice + this.selPlanData.taxamount;
        this.changePlanStartEndDate();

        if ((this.customerChangePlan = true)) {
          const planDiscountList = this.selPlanData?.discountList || [];

          const serviceDiscounts = this.custCustDiscountList.filter(
            x => x.custId === this.selPlanData.custId && x.discountType === "Recurring"
          );
          if (planDiscountList.length === 0 && serviceDiscounts.length === 0) {
            this.isDiscountTypeDisabled = true;
            this.isDiscountDisabled = true;
            this.planDiscount = 0;
            this.changePlanForm.get("discountTypeData").setValue("");
            this.changePlanForm.get("discount").setValue(0);
            this.updateDiscountFromService(this.planSelected, this.planSelectedId);
            this.messageService.add({
              severity: "info",
              summary: "No Discount",
              detail: "No discount available"
            });
          } else {
            this.availableDiscountTypes = [{ label: "Plan" }, { label: "Service" }];
            this.changePlanForm.get("discountTypeData").setValue("");
            this.changePlanForm.get("discount").setValue(0);
            this.planDiscount = 0;
            this.isDiscountTypeDisabled = false;
          }
        } else {
          let discountData = this.custCustDiscountList.find(
            element => element.id === this.custPlanMapppingId
          );
          this.planDiscount = discountData.discount ? discountData.discount : 0;
          this.updateDiscountFromService($event.value, $event.index);
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

  onChangeDiscountTypeData(event) {
    if (event.value === "Plan") {
      const list = this.selPlanData?.discountList || [];

      if (list.length === 0) {
        this.messageService.add({
          severity: "info",
          summary: "No Plan Discount",
          detail: "No plan discount available"
        });
        this.discountData = [];
        this.isDiscountDisabled = true;
        this.planDiscount = 0;
        this.changePlanForm.get("discount").setValue(0);
        return;
      }

      this.setPlanDiscount();
    } else if (event.value === "Service") {
      const list = this.custCustDiscountList.filter(
        x =>
          x.custId === this.customerDetailData.id &&
          x.discountType === "Recurring" &&
          Number(x.discount) != 0
      );

      if (list.length === 0) {
        this.messageService.add({
          severity: "info",
          summary: "No Service Discount",
          detail: "No service discount available"
        });
        this.discountData = [];
        this.isDiscountDisabled = true;
        this.planDiscount = 0;
        this.changePlanForm.get("discount").setValue(0);
        return;
      }

      this.setServiceDiscount(list);
    }
  }

  setPlanDiscount() {
    this.discountData = [];
    this.discountData = (this.selPlanData?.discountList || []).map(item => {
      const amount = Number(item.amount);
      return {
        label: (isNaN(amount) ? 0 : amount) + "%",
        value: amount
      };
    });

    this.isDiscountDisabled = false;
  }

  setServiceDiscount(serviceDiscounts) {
    this.discountData = [];
    this.discountData = serviceDiscounts.map(item => {
      const amount = Number(item.discount);
      return {
        label: (isNaN(amount) ? 0 : amount) + "%",
        value: amount
      };
    });

    this.isDiscountDisabled = false;
  }

  onChangeDiscountData(event) {
    this.confirmationService.confirm({
      message: "Do you want to apply " + event.value + " % of  Discount?",
      header: "Change Discount Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.planDiscount = event.value;
        this.updateDiscountFromService(this.planSelected, this.planSelectedId);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
        this.planDiscount = 0;
        this.changePlanForm.get("discount").setValue(0);
        this.updateDiscountFromService(this.planSelected, this.planSelectedId);
      }
    });
  }

  updateDiscountFromService(id, index) {
    if (
      (this.ifPlanGroup || this.changenewPlanForm.value.ChangePlanCategory === "groupPlan") &&
      this.changePlanForm.value.purchaseType !== "Addon"
    ) {
      this.custServiceData.find(serviceData => serviceData.newplan === id).discount =
        this.planDiscount;
      this.finalOfferPrice = 0;
      this.offerPrice = 0;
      this.custServiceData.forEach(custChild => {
        if (index !== "") {
          this.groupOfferPrices[index] = Number(this.selPlanData.offerprice);
        }
        if (custChild.newplan) {
          this.customerManagementService
            .getofferPriceWithTax(
              custChild.newplan,
              custChild.discount,
              this.changenewPlanForm.value.ChangePlanCategory === "groupPlan"
                ? this.planGroupSelected
                : ""
            )
            .subscribe((response: any) => {
              if (response.result.finalAmount) {
                this.finalOfferPrice += Number(response.result.finalAmount.toFixed(3));
              } else {
                this.finalOfferPrice = 0;
              }
            });
        }
      });
      this.offerPrice = 0;
      for (let obj of Object.keys(this.groupOfferPrices)) {
        this.offerPrice += Number(this.groupOfferPrices[obj]);
      }
    } else {
      this.changePlanForm.value.discount = this.planDiscount;
      this.finalOfferPrice = 0;
      this.offerPrice = this.selPlanData.offerprice;
      let planId = this.changePlanForm.value.planId
        ? this.changePlanForm.value.planId
        : this.planSelected;
      this.customerManagementService
        .getofferPriceWithTax(planId, this.planDiscount)
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            this.finalOfferPrice = Number(response.result.finalAmount.toFixed(3));
          } else {
            this.finalOfferPrice = 0;
          }
        });
    }
    if (
      this.customerDetailData.planMappingList[0]?.billTo == "ORGANIZATION" ||
      this.customerDetailData.planMappingList[0]?.billTo == "Organization"
    ) {
      this.confirmationService.confirm({
        message: "The customer is bill_to organization, do you want to continue?",
        header: "Change Plan Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.subisuChange = true;
          this.plansArray.push(
            this.fb.group({
              planId: this.selPlanData.id,
              name: this.selPlanData.displayName,
              service: this.selPlanData.serviceId,
              validity: this.selPlanData.validity,
              discount: this.selPlanData.discount,
              billTo: "ORGANIZATION",
              offerPrice: this.selPlanData.offerprice,
              newAmount:
                this.selPlanData.newAmount != null
                  ? this.selPlanData.newAmount
                  : this.selPlanData.offerprice,
              chargeName: this.selPlanData.chargeList[0].charge.name,
              isInvoiceToOrg: this.customerGroupForm.value.isInvoiceToOrg,
              istrialplan: this.customerGroupForm.value.istrialplan
              // invoiceType: this.customerGroupForm.value.invoiceType,
            })
          );
          // }
          this.selectPlanGroup = true;
        },
        reject: () => {
          this.subisuChange = false;
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
          // $("#selectPlanChange").modal("show");
        }
      });
    }
    // }
  }

  getSelectCustomerPlanType(e, plant) {
    this.selectPlan0Rplangroup = plant;
    if (this.selectPlan0Rplangroup == "PlanGroup") {
      this.getserviceData(e.value);
      this.changePlanForm.get("planGroupId").disable();
      this.changePlanForm.get("planList").disable();
      this.changePlanForm.get("planId").disable();
    } else {
      this.changePlanForm.get("planGroupId").disable();
      this.changePlanForm.get("planList").disable();
      this.changePlanForm.get("planId").disable();
      let data = {
        value: e.value,
        index: ""
      };
      this.getPlanDetailById(data);
    }
  }
  onPaymentTypeChange(data) {
    if (data === "YES") {
      this.changePlanForm.controls.recordPaymentDTO.enable();
      this.changePlanForm.get("recordPaymentDTO").get("chequeDate").disable();
      this.changePlanForm.get("recordPaymentDTO").get("bankName").disable();
      this.changePlanForm.get("recordPaymentDTO").get("branch").disable();
      this.changePlanForm.get("recordPaymentDTO").get("referenceNo").disable();
      this.changePlanForm.get("recordPaymentDTO").get("chequeNo").disable();
    } else {
      this.changePlanForm.controls.recordPaymentDTO.disable();
    }
  }
  selPayMode(event) {
    const payMode = event.value;
    if (payMode == "Cheque") {
      this.changePlanForm.get("recordPaymentDTO").get("chequeDate").enable();
      this.changePlanForm.get("recordPaymentDTO").get("bankName").enable();
      this.changePlanForm.get("recordPaymentDTO").get("branch").disable();
      this.changePlanForm.get("recordPaymentDTO").get("referenceNo").disable();
      this.changePlanForm.get("recordPaymentDTO").get("chequeNo").enable();
      // this.changePlanForm.controls.recordPaymentDTO.chequeDate.enable();

      // this.changePlanForm.controls.recordPaymentDTO.referenceNo.disable();
    } else if (payMode == "Online") {
      this.changePlanForm.get("recordPaymentDTO").get("chequeDate").disable();
      this.changePlanForm.get("recordPaymentDTO").get("bankName").enable();
      this.changePlanForm.get("recordPaymentDTO").get("branch").enable();
      this.changePlanForm.get("recordPaymentDTO").get("referenceNo").enable();
      this.changePlanForm.get("recordPaymentDTO").get("chequeNo").disable();
    } else if (payMode == "Cash") {
      this.changePlanForm.get("recordPaymentDTO").get("chequeDate").disable();
      this.changePlanForm.get("recordPaymentDTO").get("bankName").disable();
      this.changePlanForm.get("recordPaymentDTO").get("branch").disable();
      this.changePlanForm.get("recordPaymentDTO").get("referenceNo").disable();
      this.changePlanForm.get("recordPaymentDTO").get("chequeNo").disable();
    } else if (payMode == "EFTs") {
      this.changePlanForm.get("recordPaymentDTO").get("chequeDate").disable();
      this.changePlanForm.get("recordPaymentDTO").get("bankName").enable();
      this.changePlanForm.get("recordPaymentDTO").get("branch").enable();
      this.changePlanForm.get("recordPaymentDTO").get("referenceNo").enable();
      this.changePlanForm.get("recordPaymentDTO").get("chequeNo").disable();
    }
  }
  changePlan() {
    const newPlan = [];
    this.changePlansubmitted = true;

    if (this.subisuChange) {
      this.changePlanForm.patchValue({
        planMappingList: this.plansArray.value
      });
      this.plansArray.value.forEach((element, i) => {
        newPlan.push(element.planId);
      });
    } else {
      this.changePlanForm.patchValue({
        newPlanList: this.selectPlanListIDs,
        planMappingList: null
      });
    }
    // this.changePlanForm.value.remarks = this.changePlanForm.value.remarks
    //   ? this.changePlanForm.value.remarks
    //   : this.changePlanRemark;
    // this.changePlanForm.value.planId = this.changePlanForm.value.planId
    //   ? this.changePlanForm.value.planId
    //   : this.planSelected;

    this.changePlanForm.patchValue({
      planId: this.changePlanForm.value.planId
        ? this.changePlanForm.value.planId
        : this.planSelected,
      remarks: this.changePlanForm.value.remarks
        ? this.changePlanForm.value.remarks
        : this.changePlanRemark
    });

    if (this.changePlanForm.valid) {
      if (
        this.changePlanForm.value.paymentOwnerId === null ||
        this.changePlanForm.value.paymentOwnerId === ""
      ) {
        this.paymentOwnerError = true;
      } else {
        if (this.changePlanForm.value.purchaseType !== "Changeplan") {
          this.changePlanData = this.changePlanForm.value;
          this.changePlanData.isAdvRenewal = false;
          this.changePlanData.custId = this.customerDetailData.id;

          if (!this.changePlanData.recordPaymentDTO) {
            this.changePlanData.recordPaymentDTO = {};
          } else {
            this.changePlanData.recordPaymentDTO.isTdsDeducted = false;
            this.changePlanData.recordPaymentDTO.custId = this.customerDetailData.id;
          }
          this.changePlanData.isRefund = false;

          this.changePlanData.discount = this.planDiscount;
          if (this.changePlanBindigNewPlan.length == 0) {
            this.changePlanData.planBindWithOldPlans = null;
          } else {
            this.changePlanData.planBindWithOldPlans = this.changePlanBindigNewPlan;
          }
          // this.changePlanData.planList = null;

          if (this.selectPlanListIDs.length !== 0 && !this.subisuChange) {
            this.changePlanData.newPlanList = this.selectPlanListIDs;
          } else if (this.subisuChange) {
            this.changePlanData.newPlanList = newPlan;
            this.changePlanData.planMappingList = this.plansArray.value;
          } else {
            this.changePlanData.newPlanList = null;
            this.changePlanData.planMappingList = null;
          }
          if (this.changePlanForm.value.purchaseType == "Addon") {
            this.changePlanData.addonStartDate = this.currentData;
          }

          this.changePlanData.custServiceMappingId = this.custPlanMapppingId
            ? this.custPlanMapppingId
            : this.childCustomerDataListForChangePlan[0].planMappingList[0].custServiceMappingId;

          const CustChangePlan = {
            changePlanRequestDTOList: [this.changePlanData]
          };
          let mvnoId =
            localStorage.getItem("mvnoId") == "1"
              ? this.customerGroupForm.value?.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          const url = "/subscriber/changePlan01?mvnoId=" + mvnoId;

          //  console.log("this.changePlanData", this.changePlanData);
          this.customerManagementService.postMethod(url, CustChangePlan).subscribe(
            (response: any) => {
              if (response.responseCode == 200) {
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle"
                });
                $("#selectPlanGroupChangeService").modal("hide");
                $("#addRemark").modal("hide");
                this.changePlansubmitted = false;
                this.planDiscount = 0;
                this.finalOfferPrice = 0;
                this.groupOfferPrices = {};
                this.selPlanData = [];
                this.changePlanBindigNewPlan = [];
                this.changePlanForm.reset();
                this.selectPlanListIDs = [];
                this.changePlanDate = [];
                if (this.addChargeForm.value.chargeAdd == true) {
                  this.createNewChargeData(this.customerDetailData.id);
                }
                this.changePlanForm.get("isPaymentReceived").setValue("false");
                this.openCustomersChangePlan(this.customerDetailData);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle"
                });

                this.changePlanForm.get("isPaymentReceived").setValue("false");
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
              this.changePlanForm.get("isPaymentReceived").setValue("false");
            }
          );
        } else {
          if (this.changePlanForm.value.purchaseType == "Changeplan") {
            this.newchangePlanfunctionality(this.chargenewPlanForm.value.plancharge);
          }
        }
      }
    }
  }
  changePlanTypeForChangePlan($event) {
    this.childPlanType = $event.value;
    // this.isPlanTypeAddon = false;
    this.planListByType = [];
    if ($event.value != null && $event.value != undefined) {
      if ($event.value === "Addon") {
        // this.isPlanTypeAddon = true;
        this.planListByType = this.filterPlanListCust.filter(
          plan => plan.planGroup === "Volume Booster" || plan.planGroup === "Bandwidthbooster"
        );
      } else if ($event.value === "Renew") {
        // this.isPlanTypeAddon = false;
        this.planListByType = this.filterPlanListCust.filter(plan => plan.planGroup === "Renew");
      }
    }
  }

  modalOpenPlanChildChange(e, custId) {
    this.lastRenewalChildPlanGroup(custId);
    this.childCustID = custId;
    this.changePlanBindigChildNewPlan = [];
    this.selectedPlanChildList = [];
    this.selectPlanChildListIDs = [];
    this.selectPlanChildChange = true;
    this.planGroupChildSelected = e;
    this.getPlanListByGroupIdChild();
    this.serviceWisePlansValue(custId);
  }
  checkChargeevent(event, data) {
    this.chargeAllData = [];
    this.planDropdownInChageData = [];
    if (event.checked == true) {
      this.chargeAllData = data.value;
      this.customerchargeDATA(this.chargeAllData.custId, "child");
      this.overChargeChildListFromArray.reset();
      this.overChargeChildListFromArray = this.fb.array([]);
      $("#addChildChargeId").modal("show");
      if (this.chargeAllData.planGroupId) {
        this.getPlangroupByPlan(this.chargeAllData.planGroupId);
      }
      if (this.chargeAllData.planId) {
        let mvnoId =
          localStorage.getItem("mvnoId") == "1"
            ? this.customerGroupForm.value?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        const url = "/postpaidplan/" + this.chargeAllData.planId + "?mvnoId=" + mvnoId;
        this.customerManagementService.getMethod(url).subscribe((response: any) => {
          this.planDropdownInChageData.push(response.postPaidPlan);
        });
      }
    } else {
      this.chargeAllData = [];
      this.overChargeChildListFromArray.reset();
      this.overChargeChildListFromArray = this.fb.array([]);
    }
  }
  pageChangeEventForChildCustomersForChangePlan(pageNumber: number) {
    this.pageNumberForChildsPageForChangePlan = pageNumber;
    this.getChildCustomersForChangePlan(this.customerDetailData.id);
  }
  itemPerPageChangeEventForChangePlan(event) {
    this.childPlanRenewArray = this.fb.array([]);
    this.pageSizeForChildsPageForChangePlan = Number(event.value);
    this.getChildCustomersForChangePlan(this.customerDetailData.id);
  }
  changePlanFromParent() {
    const newPlan = [];
    let PlanData: any = {};
    let CustChangePlan: any = [];
    const pareChildPojo: any = [];

    if (this.subisuChange) {
      this.changePlanForm.patchValue({
        planMappingList: this.plansArray.value
      });
      this.plansArray.value.forEach((element, i) => {
        newPlan.push(element.planId);
      });
    } else {
      this.changePlanForm.patchValue({
        newPlanList: this.selectPlanListIDs,
        planMappingList: null
      });
    }

    if (this.UpdateParentCustPlans == true) {
      this.changePlansubmitted = true;
    }
    this.changePlanForm.patchValue({
      planGroupId: this.changePlanForm.value.planGroupId
        ? this.changePlanForm.value.planGroupId
        : this.planGroupSelected,
      remarks: this.changePlanForm.value.remarks
        ? this.changePlanForm.value.remarks
        : this.changePlanRemark
    });

    if (
      (this.changePlanForm.valid && this.UpdateParentCustPlans == true) ||
      (!this.changePlanForm.valid && this.UpdateParentCustPlans == false)
    ) {
      if (this.changePlanForm.value.purchaseType == "Addon") {
        this.changePlanData.addonStartDate = this.currentData;
      }
      //  this.changePlanData.bindWithOldPlanId = null
      //  this.changePlanData.createdById = null
      //  this.changePlanData.createdByName= null
      //  this.changePlanData.createdate= null
      this.changePlanData.custId = this.customerDetailData.id;
      this.changePlanData.discount = this.planDiscount;
      this.changePlanData.isAdvRenewal = false;
      this.changePlanData.isPaymentReceived = this.changePlanForm.value.isPaymentReceived;
      this.changePlanData.isRefund = false;
      //  this.changePlanData.lastModifiedById =null
      //  this.changePlanData.lastModifiedByName =null
      //  this.changePlanData.onlinePurType=null

      if (!this.custServiceData) {
        if (this.changePlanBindigNewPlan.length == 0) {
          this.changePlanData.planBindWithOldPlans = null;
        } else {
          this.changePlanData.planBindWithOldPlans = this.changePlanBindigNewPlan;
        }
      } else {
        let updatedData = [];
        this.custServiceData.forEach(e => {
          if (e.newplan) {
            let data = {
              newPlanId: e.newplan,
              custServiceMappingId: e.custPlanMapppingId,
              discount: e.discount
            };
            updatedData.push(data);
          }
        });
        this.changePlanData.planBindWithOldPlans = updatedData;
      }

      if (
        this.changenewPlanForm.value.ChangePlanCategory !== "groupPlan" &&
        this.customerDetailData.plangroupid !== null
      ) {
        this.changePlanData.planGroupId = this.customerDetailData.plangroupid;
      } else {
        this.changePlanData.planGroupId = this.changePlanForm.value.planGroupId;
      }
      this.changePlanData.planId = this.changePlanForm.value.planId;

      if (this.selectPlanListIDs.length !== 0 && !this.subisuChange) {
        this.changePlanData.newPlanList = this.selectPlanListIDs;
      } else if (this.selectPlanListIDs.length == 0 && this.subisuChange) {
        this.changePlanData.newPlanList = newPlan;
        this.changePlanData.planMappingList = this.plansArray.value;
      } else {
        this.changePlanData.newPlanList = null;
        this.changePlanData.planMappingList = null;
      }

      // if (this.selectPlanListIDs.length !== 0) {
      //   this.changePlanData.newPlanList = this.selectPlanListIDs;
      // } else {
      //   this.changePlanData.newPlanList = null;
      // }

      // this.changePlanData.newPlanList= this.selectPlanListIDs
      // this.changePlanData.planList=null
      // this.changePlanData.planMappingList=null
      // this.changePlanData.purchaseFrom =null
      // this.changePlanData.purchaseId =null
      if (this.childPlanType) this.changePlanData.purchaseType = this.childPlanType;
      else this.changePlanData.purchaseType = this.changePlanForm.value.purchaseType;
      // this.changePlanData = this.changePlanForm.value;
      if (!this.changePlanData.recordPaymentDTO) {
        this.changePlanData.recordPaymentDTO = {};
      } else {
        this.changePlanData.recordPaymentDTO.isTdsDeducted = false;
        this.changePlanData.recordPaymentDTO.custId = this.customerDetailData.id;
      }

      this.changePlanData.custServiceMappingId = this.custPlanMapppingId
        ? this.custPlanMapppingId
        : this.childCustomerDataListForChangePlan[0].planMappingList[0].custServiceMappingId;
      this.changePlanData.remarks = this.changePlanForm.value.remarks;
      // this.changePlanData.updatedate = null
      // this.changePlanData.walletBalUsed =null
      // this.changePlanData.discount = this.planDiscount;
      if (this.changePlanForm.valid && this.UpdateParentCustPlans == true) {
        pareChildPojo.push(this.changePlanData);
      }

      this.childPlanRenewArray.value.forEach(element => {
        PlanData = {};
        if (element.changePlan == true) {
          PlanData.addonStartDate =
            this.changePlanForm.value.purchaseType == "Addon" ? this.currentData : null;
          // PlanData.bindWithOldPlanId = null
          // PlanData.createdById = null
          // PlanData.createdByName= null
          // PlanData.createdate= null
          PlanData.custId = element.custId;
          PlanData.discount = this.planDiscount;
          PlanData.isAdvRenewal = false;
          PlanData.isPaymentReceived = this.changePlanData.isPaymentReceived;
          PlanData.isRefund = false;

          // PlanData.lastModifiedById =null
          // PlanData.lastModifiedByName =null
          // PlanData.onlinePurType=null
          if (this.changePlanBindigChildNewPlan.length == 0) {
            PlanData.planBindWithOldPlans = null;
          } else {
            PlanData.planBindWithOldPlans = this.changePlanBindigChildNewPlan;
          }

          if (!this.planGroupFlag) {
            PlanData.planId = element.planId;
          } else {
            PlanData.planId = null;
            PlanData.planGroupId = element.planGroupId;
          }
          if (element.planGroupId) {
            PlanData.planGroupId = element.planGroupId;
          } else {
            PlanData.planId = element.planId;
          }
          // PlanData.purchaseFrom = null
          // PlanData.purchaseId = null
          if (this.selectPlanChildListIDs.length !== 0) {
            PlanData.newPlanList = this.selectPlanChildListIDs;
          } else {
            PlanData.newPlanList = null;
          }
          // PlanData.newPlanList = this.selectPlanChildListIDs;
          PlanData.purchaseType = this.changePlanData.purchaseType;

          if (!PlanData.recordPaymentDTO) {
            PlanData.recordPaymentDTO = {};
          } else {
            PlanData.recordPaymentDTO.isTdsDeducted = false;
            PlanData.recordPaymentDTO.custId = this.customerDetailData.id;
          }
          PlanData.remarks = this.changePlanData.remarks;
          // PlanData.updatedate =null
          // PlanData.walletBalUsed =null

          PlanData.custServiceMappingId = this.custPlanMapppingId
            ? this.custPlanMapppingId
            : this.childCustomerDataListForChangePlan[0].planMappingList[0].custServiceMappingId;

          pareChildPojo.push(PlanData);
        }
      });

      CustChangePlan = {
        changePlanRequestDTOList: pareChildPojo
      };

      if (this.changePlanForm.value.purchaseType !== "Changeplan") {
        if (CustChangePlan.changePlanRequestDTOList.length !== 0) {
          let mvnoId =
            localStorage.getItem("mvnoId") == "1"
              ? this.customerGroupForm.value?.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          const url = "/subscriber/changePlan01?mvnoId=" + mvnoId;

          this.customerManagementService.postMethod(url, CustChangePlan).subscribe(
            (response: any) => {
              if (response.responseCode == 200) {
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle"
                });
                $("#selectPlanGroupChangeService").modal("hide");
                $("#addRemark").modal("hide");
                if (this.addChargeForm.value.chargeAdd == true) {
                  this.createNewChargeData(this.customerDetailData.id);
                }
                this.childChargeData.forEach((element, i) => {
                  const n = i + 1;
                  this.childPlanRenewArray.value.forEach((chData, i) => {
                    if (chData.custId == element.data.custid && chData.chargeAblSele == true) {
                      const url = "/createCustChargeOverride";
                      this.customerManagementService
                        .postMethod(url, element.data)
                        .subscribe((response: any) => {});
                    }
                  });

                  if (n == this.childChargeData.length) {
                  }
                });

                this.changePlansubmitted = false;
                this.changePlanForm.reset();
                this.changePlanForm.get("isPaymentReceived").setValue("false");
                this.changePlanBindigNewPlan = [];
                this.changePlanBindigChildNewPlan = [];
                this.planDiscount = 0;
                this.changePlanForm.reset();
                this.selectPlanListIDs = [];
                this.selectPlanChildListIDs = [];
                this.changePlansubmitted = false;
                this.finalOfferPrice = 0;
                this.groupOfferPrices = {};
                this.offerPrice = 0;
                this.selPlanData = [];
                this.changePlanDate = [];
                this.chargeGroupForm.reset();
                this.addChargeForm.reset();
                this.overChargeListFromArray = this.fb.array([]);
                this.openCustomersChangePlan(this.customerDetailData);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle"
                });

                this.changePlanForm.get("isPaymentReceived").setValue("false");
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
              this.changePlanForm.get("isPaymentReceived").setValue("false");
              this.UpdateParentCustPlans == false;
            }
          );
        }
      } else {
        if (this.changePlanForm.value.purchaseType == "Changeplan") {
          this.newchangePlanfunctionality(this.chargenewPlanForm.value.plancharge);
        }
      }
    }
    // console.log(this.childPlanRenewArray.value);
    // console.log(this.changePlanForm.valid);
    // console.log(this.changePlanForm.value);
    // this.changePlanForm.patchValue({ planList: this.selectedPlanList });

    // this.changePlansubmitted = true;
    // if (this.changePlanForm.valid) {
    //   this.changePlanData = this.changePlanForm.value;
    //   this.changePlanData.isAdvRenewal = false;
    //   this.changePlanData.custId = this.customerDetailData.id;
    //   if (!this.changePlanData.recordPaymentDTO) {
    //     this.changePlanData.recordPaymentDTO = {};
    //   } else {
    //     this.changePlanData.recordPaymentDTO.isTdsDeducted = false;
    //     this.changePlanData.recordPaymentDTO.custId =
    //       this.customerDetailData.id;
    //   }
    //   this.changePlanData.isRefund = false;
    //   const url = "/subscriber/changePlan";
    //   this.customerManagementService
    //     .postMethod(url, this.changePlanData)
    //     .subscribe(
    //       (response: any) => {
    //         if (response.responseCode == 200) {
    //           this.childPlanRenewArray.value.forEach((element) => {
    //             this.changePlanData.custId = element.custId;
    //             if (!this.planGroupFlag) {
    //               this.changePlanData.planId = element.planId;
    //             } else {
    //               this.changePlanData.planGroupId = element.planGroupId;
    //               this.changePlanData.planList = this.selectPlanChildListIDs;
    //             }
    //             this.customerManagementService
    //               .postMethod(url, this.changePlanData)
    //               .subscribe((response: any) => {});
    //           });
    //           this.messageService.add({
    //             severity: "success",
    //             summary: "Successfully",
    //             detail: response.responseMessage,
    //             icon: "far fa-check-circle",
    //           });
    //           this.changePlansubmitted = false;
    //           this.changePlanForm.reset();
    //           this.changePlanForm.get("isPaymentReceived").setValue("false");
    //           // this.childPlanRenewArray=this.fb.array([]);
    //         } else {
    //           this.messageService.add({
    //             severity: "error",
    //             summary: "Error",
    //             detail: response.responseMessage,
    //             icon: "far fa-check-circle",
    //           });
    //           this.changePlanForm.get("isPaymentReceived").setValue("false");
    //         }
    //       },
    //       (error: any) => {
    //         // console.log(error, "error")
    //         this.messageService.add({
    //           severity: "error",
    //           summary: "Error",
    //           detail: error.error.ERROR,
    //           icon: "far fa-times-circle",
    //         });
    //         this.changePlanForm.get("isPaymentReceived").setValue("false");
    //
    //       }
    //     );
    // }
  }
  changePlanStartEndDate() {
    const newPlan = [];

    if (this.subisuChange) {
      this.changePlanForm.patchValue({
        planMappingList: this.plansArray.value
      });
      this.plansArray.value.forEach((element, i) => {
        newPlan.push(element.planId);
      });
    } else {
      this.changePlanForm.patchValue({
        newPlanList: this.selectPlanListIDs,
        planMappingList: null
      });
    }

    this.changePlanData = this.changePlanForm.value;
    this.changePlanData.isAdvRenewal = false;
    this.changePlanData.custId = this.customerDetailData.id;
    if (!this.changePlanData.recordPaymentDTO) {
      this.changePlanData.recordPaymentDTO = {};
    } else {
      this.changePlanData.recordPaymentDTO.isTdsDeducted = false;
      this.changePlanData.recordPaymentDTO.custId = this.customerDetailData.id;
    }
    this.changePlanData.isRefund = false;
    this.changePlanData.custServiceMappingId = this.custPlanMapppingId;

    this.changePlanData.discount = this.planDiscount;
    if (this.changePlanBindigNewPlan.length == 0) {
      this.changePlanData.planBindWithOldPlans = null;
    } else {
      this.changePlanData.planBindWithOldPlans = this.changePlanBindigNewPlan;
    }
    // this.changePlanData.planList = null;

    if (this.selectPlanListIDs.length !== 0 && !this.subisuChange) {
      this.changePlanData.newPlanList = this.selectPlanListIDs;
    } else if (this.selectPlanListIDs.length !== 0 && this.subisuChange) {
      this.changePlanData.newPlanList = newPlan;
      this.changePlanData.planMappingList = this.plansArray.value;
    } else {
      this.changePlanData.newPlanList = null;
      this.changePlanData.planMappingList = null;
    }

    if (this.chargenewPlanForm.value.plancharge) {
      this.changePlanData.planId = this.chargenewPlanForm.value.plancharge;
    }
    if (this.changePlanForm.value.purchaseType == "Addon") {
      this.changePlanData.addonStartDate = this.currentData;
    }

    // this.changePlanData.newPlanList= this.selectPlanListIDs
    const CustChangePlan = {
      changePlanRequestDTOList: [this.changePlanData]
    };

    const url = "/subscriber/getStartAndEndDate";
    //  console.log("this.changePlanData", this.changePlanData);
    this.customerManagementService.postMethod(url, CustChangePlan).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.changePlanDate = response.data;
        } else {
          this.changePlanForm.get("isPaymentReceived").setValue("false");
        }
      },
      (error: any) => {
        this.changePlanForm.get("isPaymentReceived").setValue("false");
      }
    );
  }
  createNewChargeData(customerid) {
    let chargeData = [];
    let pojo = [];
    chargeData = this.overChargeListFromArray.value;
    if (this.customerChargeDataShowChangePlan.length == 0) {
      pojo = this.overChargeListFromArray.value;
    } else {
      chargeData.forEach((element, index) => {
        if (index > this.parentChargeRecurringCustList) {
          pojo.push(element);
        }
      });
    }

    const url = "/createCustChargeOverride";
    const chargeDta = {
      custChargeDetailsPojoList: pojo,
      custid: customerid
    };
    this.customerManagementService.postMethod(url, chargeDta).subscribe(
      (response: any) => {
        this.addChargeForm.reset();
        this.chargeGroupForm.reset();
        this.overChargeListFromArray = this.fb.array([]);
      },
      (error: any) => {}
    );
  }
  newchangePlanfunctionality(newPlanID) {
    let newplanGroup = "";
    let newplan = "";
    let planGroup = "";
    let plan = "";
    let planGroupdiscount = 0;
    let planDiscount = Number(this.planDiscount);
    if (this.selectPlan0Rplangroup == "PlanGroup") {
      newplanGroup = newPlanID ? newPlanID : this.planGroupSelected;
      planGroup = this.customerDetailData.plangroupid;
      planGroupdiscount = this.customerDetailData.discount;
    } else {
      newplan = newPlanID ? newPlanID : this.planSelected;

      if (this.customerDetailData.planMappingList.length > 0) {
        let length = this.customerDetailData.planMappingList.length;
        for (let lastListNum = length - 1; lastListNum > -1; lastListNum--) {
          if (
            this.customerDetailData.planMappingList[lastListNum].plangroup != "Bandwidthbooster" &&
            this.customerDetailData.planMappingList[lastListNum].plangroup != "Volume Booster"
          ) {
            plan = this.customerDetailData.planMappingList[lastListNum].planId;
            planDiscount = Number(this.planDiscount); //this.customerDetailData.planMappingList[lastListNum].discount;
            break;
          }
        }
      }
    }

    let newChangePlan = [];
    let planList: any;
    let staffIdData: any;
    staffIdData = this.staffDataList.id;

    //console.log("staffIdData",staffIdData
    if (this.customerDetailData.plangroupid || this.planGroupFlag) {
      let updatedData = [];
      if (this.filterPlanGroupListCust.length > 0)
        newplan = newplan ? newplan : this.filterPlanGroupListCust[0].planMappingList[0].plan.id;

      let secondryData = [
        {
          newPlanGroupId: newplanGroup,
          newPlanId: newplan,
          planGroupId: planGroup,
          planId: plan,
          custServiceMappingId: this.custPlanMapppingId,
          discount: planGroupdiscount
        }
      ];
      this.custServiceData.forEach(e => {
        let data;
        if (e.newplan) {
          if (this.subisuChange) {
            data = {
              billToOrg: true,
              newPlanGroupId:
                this.changenewPlanForm.value.ChangePlanCategory !== "groupPlan" &&
                this.customerDetailData.plangroupid !== null
                  ? ""
                  : this.planGroupSelected,
              planGroupId: this.planGroupSelected,
              newPlanId: e.newplan,
              custServiceMappingId: e.custServiceMappingId,
              discount: e.discount
            };
          } else {
            data = {
              billToOrg: false,
              newPlanGroupId:
                this.changenewPlanForm.value.ChangePlanCategory !== "groupPlan" &&
                this.customerDetailData.plangroupid !== null
                  ? ""
                  : this.planGroupSelected,
              planGroupId: this.planGroupSelected,
              newPlanId: e.newplan,
              custServiceMappingId: e.custServiceMappingId,
              discount: e.discount
            };
          }
          updatedData.push(data);
        }
      });
      setTimeout(() => {
        const deactivatePlanReqModels = updatedData.length > 0 ? updatedData : secondryData;
        if (
          this.changenewPlanForm.value.ChangePlanCategory !== "groupPlan" &&
          this.customerDetailData.plangroupid !== null
        ) {
          deactivatePlanReqModels.forEach(models => {
            planList = {
              custId: this.customerDetailData.id,
              deactivatePlanReqModels: [models],
              planGroupChange: false,
              planGroupFullyChanged: false
            };
            newChangePlan.push(planList);
          });
        } else {
          planList = {
            custId: this.customerDetailData.id,
            deactivatePlanReqModels: updatedData.length > 0 ? updatedData : secondryData,
            planGroupChange: true,
            planGroupFullyChanged: true
          };
          newChangePlan.push(planList);
        }
      }, 300);
    } else {
      if (this.subisuChange) {
        planList = {
          custId: this.customerDetailData.id,
          deactivatePlanReqModels: [
            {
              billToOrg: true,
              newPlanGroupId: newplanGroup,
              newPlanId: newplan,
              planGroupId: planGroup,
              planId: plan,
              custServiceMappingId: this.custPlanMapppingId,
              discount: planDiscount
            }
          ],
          planGroupChange: false,
          planGroupFullyChanged: false,
          paymentOwner:
            this.staffData != null &&
            this.staffData.length > 0 &&
            this.changePlanForm.value.paymentOwnerId != null
              ? this.staffData.filter(
                  staff => staff.id === this.changePlanForm.value.paymentOwnerId
                )[0].fullName
              : "",
          paymentOwnerId: this.changePlanForm.value.paymentOwnerId,
          billableCustomerId: this.changePlanForm.value.billableCustomerId
        };
      } else {
        planList = {
          custId: this.customerDetailData.id,
          deactivatePlanReqModels: [
            {
              newPlanGroupId: newplanGroup,
              oldCustPlanMappingId: this.selectedCustService?.custPlanMapppingId,
              newPlanId: newplan,
              planGroupId: planGroup,
              planId: plan,
              custServiceMappingId: this.custPlanMapppingId,
              discount: planDiscount
            }
          ],
          planGroupChange: false,
          planGroupFullyChanged: false,
          paymentOwner:
            this.staffData != null &&
            this.staffData.length > 0 &&
            this.changePlanForm.value.paymentOwnerId != null
              ? this.staffData.filter(
                  staff => staff.id === this.changePlanForm.value.paymentOwnerId
                )[0].fullName
              : "",
          paymentOwnerId: this.changePlanForm.value.paymentOwnerId,
          billableCustomerId: this.changePlanForm.value.billableCustomerId
        };
      }
      newChangePlan.push(planList);
    }
    setTimeout(() => {
      const url = "/subscriber/deactivatePlan";
      //  console.log("this.changePlanData", this.changePlanData);
      newChangePlan.forEach(newCP => {
        this.customerManagementService.postMethod(url, newCP).subscribe(
          (response: any) => {
            if (newChangePlan.indexOf(newCP) === newChangePlan.length - 1) {
              this.chargenewPlanForm.reset();
              this.changePlanForm.reset();
              this.changenewPlanForm.controls.ChangePlanCategory.reset();
              this.changePlansubmitted = false;
              this.getCustomersDetail(this.customerDetailData.id);
              this.getCustomerNetworkLocationDetail(this.customerDetailData.id);
              this.openCustomersChangePlan(this.customerDetailData);
              this.selectPlan0Rplangroup = "";
              $("#addRemark").modal("hide");
              $("#selectPlanGroupChangeService").modal("hide");
            }

            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.responseMessage,
              icon: "far fa-check-circle"
            });
          },
          (error: any) => {
            if (error.status === 404) {
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
      });
    }, 500);
  }
  lastRenewalChildPlanGroup(id) {
    const url = "/subscriber/lastrenewalplangroupid/" + id;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.lastRenewal_CHILDPlanGroupID = response.lastRenewalPlanGroupId;
    });
  }
  getPlanListByGroupIdChild() {
    this.newPlanSelectArray.reset();
    this.newPlanSelectArray = this.fb.array([]);

    const url = `/plansByPlanGroupId?planGroupId=` + this.planGroupChildSelected;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planListChild = response.planList;
        if (this.lastRenewal_CHILDPlanGroupID != this.planGroupChildSelected) {
          this.planListChild.forEach(element => {
            this.onNewBindingPlanMapping();
          });
        }

        // console.log(this.planListChild);
        this.planChangeListdatatotalRecords = this.planListChild.length;
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
  serviceWisePlansValue(id) {
    //   this.serviceWisePlansData =[
    //     {
    //       serviceId:24,
    //       planList:[{
    //         planId:2,
    //         planName: '100Mbs'
    //       }]
    //     },
    //     {
    //       serviceId:25,
    //       planList:[
    //         {
    //         planId:3,
    //         planName: 'DTH'
    //       },
    //       {
    //         planId:43,
    //         planName: 'DTH1'
    //       }
    //     ]
    //   }
    // ]
    const url = `/subscriber/serviceWisePlans/` + id;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.serviceWisePlansData = response.serviceWisePlans;
    });
  }
  resetnewBindingPlan(id) {
    this.newPlanSelectArray.reset();
    this.newPlanSelectArray = this.fb.array([]);
    this.planList.forEach(element => {
      this.onNewBindingPlanMapping();
    });
    this.serviceWisePlansValue(id);
  }
  removeSelectServiceWisePlan(event, index) {
    const planId = event.value;
    const servicePlandata = this.serviceWisePlansData[index].planList;
    servicePlandata.forEach((element, i) => {
      if (element.planId == planId) {
        servicePlandata.splice(i, 1);
      }
    });
  }
  modalClosePlanChange() {
    this.changePlanBindigNewPlan = [];
    this.selectPlanListIDs = [];

    if (this.selectedPlanList.length == 0) {
      this.selectPlanListIDs = null;
    }

    if (this.lastRenewalPlanGroupID != this.planGroupSelected) {
      this.selectedPlanList.forEach((element, i) => {
        this.selectPlanListIDs.push(element.id);
        this.changePlanStartEndDate();
        this.newPlanSelectArray.value.forEach((data, j) => {
          if (i == j) {
            const newId = data.newPlan ? data.newPlan : null;
            this.changePlanBindigNewPlan.push({
              newPlanId: newId,
              oldPlanId: element.id
            });
          }
        });
      });
    } else {
      this.selectedPlanList.forEach((element, i) => {
        this.selectPlanListIDs.push(element.id);
        this.changePlanStartEndDate();
      });
    }
    this.selectPlanChange = false;
  }
  resetnewBindingPlansChild(id) {
    this.newPlanSelectArray.reset();
    this.newPlanSelectArray = this.fb.array([]);
    this.planListChild.forEach(element => {
      this.onNewBindingPlanMapping();
    });
    this.serviceWisePlansValue(id);
  }
  modalClosePlanChildChange() {
    this.changePlanBindigChildNewPlan = [];
    this.selectPlanChildListIDs = [];

    if (this.selectedPlanChildList.length == 0) {
      this.selectPlanChildListIDs = null;
    }

    if (this.lastRenewal_CHILDPlanGroupID != this.planGroupChildSelected) {
      this.selectedPlanChildList.forEach((element, i) => {
        this.selectPlanChildListIDs.push(element.id);
        this.newPlanSelectArray.value.forEach((data, j) => {
          if (i == j) {
            const newId = data.newPlan ? data.newPlan : null;
            this.changePlanBindigChildNewPlan.push({
              newPlanId: newId,
              oldPlanId: element.id
            });
          }
        });
      });
    } else {
      this.selectedPlanChildList.forEach((element, i) => {
        this.selectPlanChildListIDs.push(element.id);
      });
    }
    this.selectPlanChildChange = false;
  }
  filterplanGroup(id, custPlanMapppingId, index) {
    this.custPlanMapppingId = custPlanMapppingId;
    this.planByService = [];

    if (this.changenewPlanForm.value.ChangePlanCategory == "groupPlan") {
      this.planByService = this.groupPlanListByType;
      this.planByService.forEach(element => {
        element.disabled = true;
      });
      this.planByService.forEach((element, i) => {
        if (element.serviceId == id) {
          // this.planByService.push(element);
          this.planByService[i].disabled = false;
        }
      });
    } else {
      this.planByService = this.planListByType;
      this.planByService = this.planByService.filter(item => item.serviceId == id);
      var uniqueItems = [];
      for (const item of this.planByService) {
        const found = uniqueItems.some(value => isEqual(value, item));
        if (!found) {
          uniqueItems.push(item);
        }
      }
      this.plansByServiceArr[index] = uniqueItems;
    }
  }
  addRemark() {
    this.changePlanRemark = null;
    $("#addRemark").modal("show");
  }
  closeSelectPlanGroupChangeService() {
    $("#selectPlanGroupChangeService").modal("hide");
  }
  selectedPlan(e, i) {
    let data = {
      value: e.value,
      index: i
    };
    this.getPlanDetailById(data);

    this.custServiceData[i].newplan = e.value;
    this.enableChangePlanGroup = true;
    this.custServiceData.forEach(element => {
      if (!(element.newplan && element.newplan !== null && element.newplan !== "")) {
        this.enableChangePlanGroup = false;
      }
    });
  }

  StaffReasignList(data) {
    this.reassignDataRefresh = data;
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=CAF`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Success",
          //   detail: response.responseMessage,
          //   icon: "far fa-times-circle",
          // });
        }
        if (response.dataList != null) {
          this.assignCustomerCAFId = data.id;
          this.approveCAF = response.dataList;
          this.reassigndata = this.approveCAF;
          this.approved = true;
          this.reAssignCustomerCAFModal = true;
        } else {
          this.reAssignCustomerCAFModal = false;
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
  NewStaffReasignList() {
    let url =
      "/teamHierarchy/reassignWorkflowGetStaffList?entityId=" +
      this.reassignDataRefresh.id +
      "&eventName=CAF";
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Success",
          //   detail: response.responseMessage,
          //   icon: "far fa-times-circle",
          // });
        }
        if (response.dataList != null) {
          this.assignCustomerCAFId = this.reassignDataRefresh.id;
          this.approveCAF = response.dataList;
          this.reassigndata = this.approveCAF;
          this.approved = true;
          // $("#reAssignCustomerCAFModal").modal("show");
        } else {
          // $("#reAssignCustomerCAFModal").modal("hide");
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

  reassignWorkflow() {
    let url: any;
    this.remarks = this.assignCustomerCAFForm.controls.remark;
    if (this.assignCustomerCAFId != null) {
      url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignCustomerCAFId}&eventName=CAF&assignToStaffId=${this.selectStaff}&remark=${this.remarks.value}`;

      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.reAssignCustomerCAFModal = false;
          this.getcustomerList("");
          //   this.getCustomer();
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            // this.getCustomer();
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Aprove Before Reassigne",
        icon: "far fa-times-circle"
      });
    }
  }
  assignDiscountToStaffInventory(flag) {
    let url: any;
    let name: string;
    if (this.customerUpdateDiscount) {
      name = "CUSTOMER_DISCOUNT";
    } else if (this.shiftLocationEvent) {
      name = "SHIFT_LOCATION";
    }
    if (flag) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.assignDiscountData.id}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
    } else {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.assignDiscountData.id}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
    }

    this.customerManagementService.getMethod(url).subscribe(
      response => {
        if (flag) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });

          $("#customerDiscount").modal("hide");
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });

          $("#customerDiscount").modal("hide");
        }
        // this.getCustomer();
        this.getcustomerList("");
        // this.newCustomerAddressDataForCustometr(this.customerDetailData.id);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });

        //$("#customerDiscount").modal("hide");
      }
    );
    $("#customerDiscount").modal("hide");
  }
  assignCustDiscountApprove() {
    this.assignDiscounsubmitted = true;
    if (this.assignAppRejectDiscountForm.valid) {
      let url = "/approveChangeDiscountServiceLevel";
      //   this.getCustomer();
      let assignCAFData = {
        // assignedDate: '',
        // credDocId: '',
        custPackageId: this.assignDiscountData.id,
        // custcafId: '',
        flag: this.discountFlageType,
        // newDiscount: this.assignDiscountData.newDiscount,
        nextStaffId: 0,
        planId: this.assignDiscountData.planId,
        remark: this.assignAppRejectDiscountForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
        // status: ''
      };

      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.rejectApproveDiscountModal = false;
          if (response.dataList) {
            this.staffList = response.dataList;
            // if (this.discountFlageType == "approved") {
            //   this.approved = true;
            //   this.approveInventoryData = response.dataList;
            //   $("#assignCustomerInventoryModal").modal("show");
            // } else {
            //   this.reject = true;
            //   this.rejectInventoryData = response.dataList;
            //   $("#rejectCustomerInventoryModal").modal("show");
            // }
            $("#customerDiscount").modal("show");
          } else {
            this.openCustorUpdateDiscount(this.customerDetailData.id);
          }
          this.assignAppRejectDiscountForm.reset();
          this.assignDiscounsubmitted = false;
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

  onAddShiftLocationCharge() {
    this.submitted = true;
    if (this.shiftLocationChargeGroupForm.valid) {
      if (
        this.shiftLocationChargeGroupForm.value.price >=
        this.shiftLocationChargeGroupForm.value.actualprice
      ) {
        // this.overChargeListFromArray.push(this.createoverChargeListFormGroup());
        this.shiftLocationChargeGroupForm.reset();
        this.submitted = false;
        this.selectchargeValueShow = false;
      }
    } else {
    }
  }

  openServiceDetails(custId) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifMyInvoice = false;
    this.ifShowDBRReport = false;
    this.isServiceOpen = true;
    this.customerUpdateDiscount = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifChargeGetData = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.chargeUseCustID = custId;
    this.shiftLocationEvent = false;
    this.ifCafFollowUp = false;
    this.isCallDetails = false;
  }

  clearcustPlanMappping() {
    this.custPlanMapppingId = null;
  }

  planCreationType() {
    const planBindingType = localStorage.getItem("planBindingType");
    this.isPlanOnDemand = planBindingType === "On-Demand";
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
    if (this.createView) {
      this.customerGroupForm.patchValue({
        earlybillday: this.earlydays[0].label
      });
    }
  }
  parentExperienceSelect(e) {
    this.planGroupForm.value.invoiceType = "Group";
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

  getCustQuotaList(custId) {
    this.customerManagementService.getCustQuotaList(custId).subscribe(
      (response: any) => {
        this.custQuotaList = response.custQuotaList;
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

  pageChangedCustQuotaList(pageNumber) {
    this.currentPagecustQuotaList = pageNumber;
  }
  ifdiscounAllow = true;
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

  checkIfDiscountPlanGroup(plangroupid) {
    if (plangroupid !== null && plangroupid !== undefined && plangroupid !== "") {
      return !this.filterNormalPlanGroup.find(planGroup => planGroup.planGroupId === plangroupid)
        ?.allowDiscount;
    } else {
      return false;
    }
  }

  quotaPlanDetailsModel(modelID, custid, PlanData) {
    this.PaymentamountService.show(modelID);
    this.PlanQuota.next({
      custid,
      PlanData
    });
  }

  openDetailCust(event) {
    this.customerDetailOpen(event);
  }

  getrequiredDepartment() {
    const url = "/department/all";
    this.countryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.departmentListData = res.departmentList;
        // this.departmenttotalRecords = res.pageDetails.totalRecords;

        this.searchkey = "";
      },
      (err: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong while fetching lead origin types",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  selectedStaff: any = [];
  selectStaffType = "";
  staffSelectList: any = [];
  showSelectStaffModel = false;
  modalOpenSelectStaff(type) {
    this.parentCustomerDialogType = type;
    this.showSelectStaffModel = true;
    this.selectedStaff = [];
    this.selectStaffType = type;
    this.selectedStaff.push({
      id: Number(localStorage.getItem("userId")),
      name: localStorage.getItem("loginUserName")
    });
  }

  selectedStaffChange(event) {
    this.showSelectStaffModel = false;
    let data = event;
    this.staffSelectList.push({
      id: Number(data.id),
      name: data.username
    });

    if (this.selectStaffType == "paymentCharge") {
      this.shiftLocationChargeGroupForm.patchValue({
        paymentOwnerId: data.id
      });
    } else if (this.selectStaffType == "changePlanCharge") {
      this.changePlanForm.patchValue({
        paymentOwnerId: data.id
      });
    }
  }

  removeSelectStaff() {
    this.staffSelectList = [];
  }

  closeSelectStafff() {
    this.showParentCustomerModel = false;
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

  macChangeChange(event: any, dd: any) {
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

  deleteLocationMapField(locationMapField: any, index: number) {
    const existingIndex = this.custLocationData.findIndex(
      x => x.locationId === locationMapField.value.locationId
    );
    this.custLocationData.splice(existingIndex);
    this.overLocationMacArray.removeAt(index);
  }

  saveLocationMacData() {
    this.locationMacData = this.overLocationMacArray.value.map(location => ({
      locationId: location.locationId, //location.locationId
      mac: location.mac,
      isParentLocation: this.customerGroupForm.value.isParentLocation
    }));
    this.showLocationMac = false;
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

  parentLocationCheck(event: any) {
    if (event.checked) {
      this.locationMacData = this.locationMacData.map(location => ({
        locationId: location.locationId, //location.locationId
        mac: location.mac,
        isParentLocation: true
      }));
    } else {
      this.locationMacData = this.locationMacData.map(location => ({
        mac: location.mac,
        locationId: location.locationId, //location.locationId
        isParentLocation: false
      }));
    }
  }

  reActivate(id) {
    const url = `/reactivateService?custId=${id}`;
    let data = {};
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (response.data) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Re-activate Sucessfully",
              icon: "far fa-check-circle"
            });
            this.getcustomerList("");
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong!!!",
              icon: "far fa-times-circle"
            });
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
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

  cafremaingTime() {
    this.cafRemainTimeSubscription = this.obs$.subscribe(e => {
      this.customerListData.forEach(element => {
        if (element.status != "Active") {
          if (element.currentStaff == null || element.currentStaff !== null) {
            const newYearsDate: any = new Date(
              element.nextfollowupdate + " " + element.nextfollowuptime
            );

            const currentDate: any = new Date();
            if (newYearsDate > currentDate) {
              const totalSeconds = (newYearsDate - currentDate) / 1000;
              const minutes = Math.floor(totalSeconds / 60) % 60;
              const hours = Math.floor(totalSeconds / 3600) % 24;
              const days = Math.floor(totalSeconds / 3600 / 24);
              const seconds = Math.floor(totalSeconds) % 60;
              const remainTime =
                ("0" + days).slice(-2) +
                ":" +
                ("0" + hours).slice(-2) +
                ":" +
                ("0" + minutes).slice(-2) +
                ":" +
                ("0" + seconds).slice(-2);

              element.remainTime = remainTime;
            } else {
              element.remainTime = "00:00:00:00";
            }
          }
        }
      });
    });
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
      error => {}
    );
  }

  getFailedPayments() {
    this.viewcustomerFailedPaymentData = [];
    const url = "/onlinePayAudit/allByCustId?custId=" + this.customerId;
    this.customerManagementService.getMethodForIntegration(url).subscribe(
      (response: any) => {
        this.viewcustomerFailedPaymentData = response.onlineAuditData;
        if (this.viewcustomerFailedPaymentData.length !== 0) {
          this.displayFailedPaymentDialog = true;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Payment Found !! ",
            icon: "far fa-times-circle"
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
  closeFailedPaymentForm() {
    this.displayFailedPaymentDialog = false;
  }

  getCustomerStatus() {
    const url = "/commonList/generic/custStatus";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.CustomerStatusValue = response.dataList.filter(
          status =>
            status.value !== "Active" &&
            status.value !== "InActive" &&
            // status.value !== "NewActivation" &&
            // status.value !== "Reject" &&
            status.value !== "Suspend" &&
            status.value !== "Terminate"
        );
      },
      (error: any) => {}
    );
  }
  exportCustomerCAF() {
    import("xlsx").then(xlsx => {
      let z = this.customerListData.map((ele: any) => {
        let x = {};
        this.cols.forEach((d: any) => {
          x = { ...x, [d.customExportHeader]: ele?.[d.field] };
        });
        return x;
      });
      const worksheet = xlsx.utils.json_to_sheet(z);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "Customer_CAF");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + "_Export_" + new Date().getTime() + EXCEL_EXTENSION);
  }
  keypressSession(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Changes For Shift Location

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

  // newShiftcustomerDetailOpen() {
  //     this.router.navigate(["/home/customer-caf/details/" + this.custType + "/x/" + this.customerId]);
  // }

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

  newShiftgetpartnerAll() {
    const url = "/partner/all";
    this.partnerService.getMethodNew(url).subscribe(
      (response: any) => {
        this.newShiftpartnerList = response.partnerlist.filter(item => item.id != 1);
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

  newShiftopenShiftLocationForm() {
    // this.callCheckShiftLocation();
    this.newShiftdisplayShiftLocationDetails = true;
    this.newShiftstaffCustList = [];
    this.newShiftstaffCustList.push({
      id: Number(localStorage.getItem("userId")),
      name: localStorage.getItem("loginUserName")
    });
    this.newShiftrequestedByID = Number(localStorage.getItem("userId"));
    // this.newShiftgetNetworkDevicesByType("OLT");
    this.newShiftLocationChargeGroupForm.reset();
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

  newShiftreassignWorkflowShiftLocation() {
    let url: any;
    // this.remark = this.shiftlocationFormRemark.value.remark;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.newShiftassignedShiftLocationid}&eventName=SHIFT_LOCATION&assignToStaffId=${this.selectStaff}&remark=${this.newShiftlocationFormRemark.value.remark}`;

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
        ? this.customerDetailData?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/getPartnerByServiceAreaId/" + serviceAreaId + "?mvnoId=" + mvnoId;
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.newShiftpartnerListByServiceArea = response.partnerList.filter(item => item.id != 1);
        // console.log("partnerList", response);
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
        ? this.custData?.mvnoId
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

  newShiftmodalOpenStaff(type) {
    this.newShiftstaffSelectType = type;
    this.newShiftisSelectStaff = true;
    this.newShiftselectedStaff = [];
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

  newShiftremoveSelStaff(type) {
    if (type == "paymentCharge") {
      this.newShiftpaymentOwnerId = 0;
      this.newShiftLocationChargeGroupForm.patchValue({
        paymentOwnerId: ""
      });
    } else if (type == "requestedBy") this.newShiftrequestedByID = 0;
    this.newShiftstaffid = null;
  }

  newShiftmodalOpenParentCustomer(type) {
    this.newShiftparentCustomerDialogType = type;
    this.newShiftshowParentCustomerModel = true;
    this.newShiftcustomerSelectType = "Billable To";
    if (type === "parent") {
      this.newShiftcustomerSelectType = "Parent";
    }
    this.newShiftselectedParentCust = [];
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

  newShiftremoveSelParentCust(type) {
    this.newShiftselectedParentCust = [];
    this.newShiftbillableCustList = [];
    this.newShiftLocationChargeGroupForm.patchValue({
      billableCustomerId: null
    });
    this.newShiftisBranchAvailable = false;
  }

  newShiftselectcharge(_event: any, type) {
    const chargeId = _event.value;
    let viewChargeData;
    let date;

    date = this.newShiftcurrentDate.toISOString();
    const format = "yyyy-MM-dd";
    const locale = "en-US";
    const myDate = date;
    const formattedDate = formatDate(myDate, format, locale);
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerGroupForm.value?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url = "/charge/" + chargeId + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      viewChargeData = response.chargebyid;
      this.newShiftselectchargeValueShow = true;
      this.newShiftLocationChargeGroupForm.patchValue({
        actualprice: Number(viewChargeData.actualprice),
        charge_date: formattedDate,
        type: "One-time"
      });
    });
  }

  newShiftselectTypecharge(e) {
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
      if (
        this.newShiftLocationChargeGroupForm.value.discount == null ||
        this.newShiftLocationChargeGroupForm.value.discount == undefined ||
        this.newShiftLocationChargeGroupForm.value.discount == ""
      ) {
        this.newShiftLocationChargeGroupForm.value.discount = 0;
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

  newShiftcloseShiftLocation() {
    this.newShiftsubmitted = false;
    this.newShiftifUpdateAddressSubmited = false;
    this.newShiftLocationChargeGroupForm.reset();
    this.newShiftifUpdateAddressSubmited = false;
    this.newShiftrequestedByID = 0;
    this.newShiftbranchID = 0;
    this.newShiftdisplayShiftLocationDetails = false;
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

  newShiftshiftLocationRejected(data) {
    this.newShiftapproveId = data.id;
    this.newShiftrejectApproveShiftLocationModal = true;
    this.newShiftassignShiftLocationData = data;
    this.newShiftshiftLocationFlagType = "Rejected";
    this.newShiftAppRjecHeader = "Reject";
    this.newShiftassignAppRejectShiftLocationForm.reset();
  }

  newShiftshiftLocationApproved(data) {
    this.newShiftapproveId = data.id;
    this.newShiftrejectApproveShiftLocationModal = true;
    this.newShiftassignShiftLocationData = data;
    this.newShiftshiftLocationFlagType = "approved";
    this.newShiftAppRjecHeader = "Approve";
    this.newShiftassignAppRejectShiftLocationForm.reset();
  }

  newShiftcloseDisplayShiftLocationDetails() {
    this.newShiftrejectApproveShiftLocationModal = false;
  }

  newShiftassignShiftLocation1: boolean = false;
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

  newShiftshiftWorkflow(data) {
    this.newShiftifModelIsShow = true;
    this.PaymentamountService.show("custauditWorkflowModal");
    this.newShiftauditcustid.next({
      auditcustid: data.id,
      checkHierachy: "SHIFT_LOCATION",
      planId: ""
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

  newShiftcloseStaffModel(arg0: boolean) {
    this.newShiftassignShiftLocation1 = false;
  }

  getDemographicLabel(currentName: string): string {
    if (!this.demographicLabel || this.demographicLabel.length === 0) {
      return currentName;
    }

    const label = this.demographicLabel.find(item => item.currentName === currentName);
    return label ? label.newName : currentName;
  }

  openPaymentGateways(custId) {
    const url = "/generatePaymentLink/" + custId;
    this.customerManagementService.postMethod(url, null).subscribe(
      (response: any) => {
        let payData = response.data;
        if (response.data == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Unpaid Invoice Found for this Customer",
            icon: "far fa-times-circle"
          });
        } else {
          let isRenew = false;
          window.open(`${window.location.origin}/#/customer/payMethod/${payData}`);
          //   this.router.navigate(["/customer/payMethod/" + payData]);
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

  addToWallet(orderId) {
    this.transModal = true;
    this.addToWalletOrderId = orderId;
  }

  paymentData: any;
  retryPayment(orderId) {
    this.paymentData = [];
    const url = "/ByOrderId?orderId=" + orderId;
    this.customerManagementService.getMethodForIntegration(url).subscribe(
      (response: any) => {
        // this.paymentData = response.onlineAuditData;
        this.getFailedPayments();
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

  searchStaffByName(searchText: string) {
    const trimmedSearchText = searchText.trim().replace(/\s+/g, " ");
    this.searchStaffDeatil = searchText;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;

    const normalizedSearchText = trimmedSearchText.toLowerCase();

    if (normalizedSearchText) {
      this.approveCAFData = this.approveCAF.filter(
        staff =>
          staff.fullName.toLowerCase().includes(normalizedSearchText) ||
          staff.username.toLowerCase().includes(normalizedSearchText)
      );
    } else {
      this.approveCAFData = this.approveCAF;
    }
  }

  clearSearchForm() {
    this.searchStaffDeatil = "";
    this.approveCAFData = this.approveCAF;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;
  }

  openFailureReason(data) {
    this.failureReason = data;
    this.failureReasonDialog = true;
  }
  closeFailureReason() {
    this.failureReasonDialog = false;
    this.failureReason = "";
  }
  paginateStaff(event: any) {
    this.newStaffFirst = event.first;
    this.approveStaffListdataitemsPerPageForStaff = event.rows;
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

  addToWalletAPI() {
    const url =
      "/addToWalletByOrderId?orderId=" +
      this.addToWalletOrderId +
      "&transactionId=" +
      this.transactionNo;
    this.recordPaymentService.postMethodForIntegration(url, null).subscribe(
      (response: any) => {
        if (response?.responseCode === 500) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response?.data,
            icon: "far fa-times-circle"
          });
          return;
        }
        if ([405, 406, 417, 415].includes(response?.responseCode)) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response?.data,
            icon: "far fa-info-circle"
          });
          return;
        }
        this.customerData = response.customerList;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response?.data,
          icon: "far fa-check-circle"
        });
        this.transModal = false;
        this.addToWalletOrderId = "";
        this.transactionNo = "";
        this.getFailedPayments();
      },
      (error: any) => {
        console.error("Error:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  ConfirmonTransactionNumber() {
    if (this.addToWalletOrderId) {
      this.confirmationService.confirm({
        message: "Do you want to confirm this transaction no?",
        header: "Transaction No Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.addToWalletAPI();
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

  transactionModal() {
    this.transModal = false;
    this.addToWalletOrderId = "";
    this.transactionNo = "";
  }

  paymentModeData() {
    const url = "/commonList/paymentMode";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.paymentMode = response.dataList;
      },
      (error: any) => {}
    );
  }
  openModal(custId) {
    this.dialog = true;
    this.customerid = custId;
  }

  close() {
    this.dialog = false;
  }
  searchReassignStaffByName(searchText: string) {
    // if (this.searchReassignStaffDeatil) {
    //   this.approveCAF = this.reassigndata.filter(
    //     staff =>
    //       staff.fullName.toLowerCase().includes(this.searchReassignStaffDeatil.toLowerCase()) ||
    //       staff.username.toLowerCase().includes(this.searchReassignStaffDeatil.toLowerCase())
    //   );
    // } else {
    //   this.approveCAF = this.reassigndata;
    // }
    // this.approvestaffReassignListdatatotalRecords = this.reassigndata?.length;
    this.searchReassignStaffDeatil = searchText;
    this.newStaffFirst = 0;
    if (searchText && searchText.trim()) {
      const value = searchText.toLowerCase();

      this.approveCAF = this.reassigndata.filter(
        staff =>
          staff.fullName?.toLowerCase().includes(value) ||
          staff.username?.toLowerCase().includes(value)
      );
    } else {
      this.approveCAF = this.reassigndata;
    }
    this.approvestaffReassignListdatatotalRecords = this.approveCAF?.length;
    this.cdr.detectChanges();
  }

  paginateReassignStaff(event: any) {
    this.newStaffFirst = event.first;
    this.approveStaffListdataitemsPerPageForStaff = event.rows;
    this.approveCAF = this.reassigndata;
    this.getReassignPaginatedData();
  }
  getReassignPaginatedData() {
    const start = this.newStaffFirst;
    const end = start + this.approveStaffListdataitemsPerPageForStaff;
    if (!this.searchReassignStaffDeatil) {
      this.approveCAF = this.reassigndata.slice(start, end);
    }
  }

  clearReassignSearchForm() {
    this.searchReassignStaffDeatil = "";
    this.approveCAF = this.reassigndata;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;
    this.NewStaffReasignList();
  }

  openMyCallDetails(id) {
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.customerPlanView = false;
    this.viewCustomerPaymentList = false;
    this.isCustomerDetailSubMenu = true;
    this.customerChangePlan = false;
    this.ifMyInvoice = false;
    this.isServiceOpen = false;
    this.ifShowDBRReport = false;
    this.ifChargeGetData = false;
    this.customerStatusView = false;
    this.ipManagementView = false;
    this.macManagementView = false;
    this.customerCafNotes = false;
    this.customerUpdateDiscount = false;
    this.ifWalletMenu = false;
    this.ifUpdateAddress = false;
    this.ifCafFollowUp = false;
    this.assignInventoryCustomerId = id;
    this.assignInventoryWithSerial = false;
    this.shiftLocationEvent = false;
    this.isCallDetails = true;
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

  searchStaffByNameReject(searchText: string) {
    const trimmedSearchText = searchText.trim().replace(/\s+/g, " ");
    this.searchStaffDeatil = searchText;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;
    const normalizedSearchText = trimmedSearchText.toLowerCase();

    if (trimmedSearchText) {
      this.rejectCAF = this.rejectCafData.filter(
        staff =>
          staff.fullName.toLowerCase().includes(normalizedSearchText) ||
          staff.username.toLowerCase().includes(normalizedSearchText)
      );
    } else {
      this.rejectCAF = this.rejectCafData;
    }
  }

  clearSearchFormReject() {
    this.searchStaffDeatil = "";
    this.rejectCAF = this.rejectCafData;
    this.newStaffFirst = 0;
    this.approveStaffListdataitemsPerPageForStaff = 5;
  }

  closeApproveCustomer() {
    this.assignCustomerCAFModal = false;
  }

  closeRejectCustomer() {
    this.rejectCustomerCAFModal = false;
  }

  closeReassignCustomer() {
    this.reAssignCustomerCAFModal = false;
  }
  closeRejectApproveCustomer() {
    this.rejectApproveDiscountModal = false;
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

  buyKbzInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      //   isBuyPlan: true,
      merchantName: "KBZPAY",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerDetailData.buId
    };

    this.customerdetailsilsService.buyPlanUsingKbz(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.paymentConfirmationModal = false;
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.exitBuy = false;
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.responseCode === 200 && response.data) {
          const paymentLink = response.data;
          this.messageService.add({
            severity: "info",
            summary: "KBZPay Not Supported on Web",
            detail: "Please open the payment link on your mobile device using the KBZPay app.",
            icon: "pi pi-info-circle"
          });

          //   const kbzurl = paymentLink.split("?kbzurl=")[1];
          //   this.router.navigate(["/kbz-pay"], {
          //     queryParams: { kbzurl: kbzurl }
          //   });
          //   window.open(paymentLink, "_blank");
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  buyTransacteasePayment(invoice) {
    const newTab = window.open("", "_blank");
    // this.getCustomerAddressDetails(this.customerDetailData.id);
    this.spinner.show();
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      //   amount: (this.amountsData + (this.amountsData * this.commissionPer) / 100).toString(),
      //   commission: (invoice.totalamount * this.commissionPer) / 100,
      billAddressLine1: this.customerAddressDetails?.landmark,
      billAddressLine2: this.customerAddressDetails?.landmark,
      billToAddressCity: this.customerAddressDetails?.cityName,
      billToAddressState: this.customerAddressDetails?.stateName,
      billToAddressZip: this.customerAddressDetails?.pincode,
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      email: this.customerDetailData?.email,
      isBuyPlan: true,
      isFromCaptive: true,
      actualAmount: invoice.totalamount.toString(),
      isAdvancePayment: true,
      merchantName: "TRANSACTEASE",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      payerMobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerDetailData.buId
    };
    this.customerdetailsilsService.buyPlanUsingTransactease(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.paymentConfirmationModal = true;
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.exitBuy = false;
        if (response) {
          //   let paymentUrl = response.data;
          //   window.open(paymentUrl, "_blank");
          //   //   this.messageService.add({
          //   //     severity: "info",
          //   //     summary: "KBZPay Not Supported on Web",
          //   //     detail: "Please open the payment link on your mobile device using the KBZPay app.",
          //   //     icon: "pi pi-info-circle"
          //   //   });
          //   this.messageService.add({
          //     severity: "success",
          //     summary: "Successfully",
          //     detail: response.data.message,
          //     icon: "far fa-times-circle"
          //   });
          const htmlString = response;
          if (typeof htmlString === "string" && htmlString.trim().startsWith("<!DOCTYPE html")) {
            if (newTab) {
              newTab.document.open();
              newTab.document.write(htmlString);
              newTab.document.close();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Popup Blocked",
                detail: "Please allow popups for this site."
              });
            }
          }
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getCustomerAddressDetails(invoice?: any) {
    try {
      this.customerdetailsilsService
        .getCustomerAddressDetails(this.customerDetailData.id)
        .subscribe(
          (result: any) => {
            this.customerAddressDetails =
              result.dataList && result.dataList?.length > 0 ? result.dataList[0] : [];
            this.buyTransacteasePayment(this.invoice);
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
    } catch (error) {
      console.error("ERror in api", error);
    }
  }

  handleMpesaPaymentOption(option: string) {
    this.spinner.hide();
    this.displayMpesaOptionsDialog = false;
    if (option === "Mpesa-Express") {
      this.buyMpesaExpressPlan(this.invoiceForMpesa);
    } else if (option === "Mpesa-B2C") {
      this.spinner.show();
      this.buyMpesaInvoicePayment(this.invoiceForMpesa);
    }
  }
  // Add method to close MPESA options dialog
  closeMpesaOptionsDialog() {
    this.displayMpesaOptionsDialog = false;
  }
  buyMpesaInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice?.totalamount - invoice?.adjustedAmount).toString(),
      isFromCaptive: false,
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      buid: this.customerDetailData?.buId,
      orderId: "",
      //   planId: this.customerDetailData.planMappingList[0].planId
      planId: null
    };
    this.customerdetailsilsService.buyPlanUsingMpesa(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.responseCode == 200) {
          this.paymentConfirmationModal = true;
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.data.ResponseDescription,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response?.data?.errorMessage,
            icon: "far fa-times-circle"
          });
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }
  buyMpesaExpressPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice?.totalamount - invoice?.adjustedAmount).toString(),
      isFromCaptive: true,
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      payerMobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      merchantName: null,
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      buid: this.customerDetailData?.buId,
      orderId: "",
      //   planId: this.customerDetailData.planMappingList[0].planId,
      planId: null,
      hash: null,
      isAdvancePayment: false,
      isBuyPlan: true,
      partnerPaymentId: this.customerDetailData.partnerid,
      status: "PENDING"
    };
    this.customerdetailsilsService.buyPlanUsingMpesaExpress(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.responseCode == 200) {
          this.paymentConfirmationModal = true;
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.data.ResponseDescription,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response?.data?.errorMessage,
            icon: "far fa-times-circle"
          });
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  onCurrencyChange(event: any, invoice: any) {
    // invoice.selectedCurrency = event.value;
    // invoice.isDisplayConvertedAmount = event.value !== this.customerLedgerDetailData?.currency;
    this.isDisplayConvertedAmount =
      event.value !=
      (this.customerDetailData?.currency ? this.customerDetailData?.currency : this.currency);
  }

  onConvertedRateChange() {
    this.invoiceList.forEach(element => {
      element.convertedAmount = element.testamount * this.convertedExchangeRate;
    });
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

  togglePassword(): void {
    this.showAAAPasswordDetail = !this.showAAAPasswordDetail;
  }

  toggleLoginPassword(): void {
    this.showLoginPasswordDetail = !this.showLoginPasswordDetail;
  }

  maskPassword(password: string | undefined): string {
    if (!password) return "";
    return "*".repeat(password.length);
  }

  mvnoChange(event) {
    this.customerGroupForm.reset();
    this.customerFormInit(event.value);
    this.customerGroupForm.patchValue({
      mvnoId: event.value
    });
    this.getBankDestinationDetail(event.value);
    this.commondropdownService.getsystemconfigList(event.value);
    this.commondropdownService.getserviceAreaListForCafCustomer(event.value);
    this.planGroupForm.reset();
    this.planDataForm.reset();
    this.payMappingListFromArray.clear();
    this.planCategoryForm.reset();
    // this.planGroupForm.controls.skipQuotaUpdate.setValue(false);
    this.planGroupForm.controls.validity.enable();
  }

  openStaffWallet() {
    let staffId = localStorage.getItem("userId");
    const url =
      "/staff_ledger_details/walletAmount/" + staffId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.staffService.getFromCMS(url).subscribe((response: any) => {
      this.WalletDataAmount = response.availableAmount;
    });
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

  customerFormInit(mvnoId?) {
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
      feasibilityRequired: [""],
      feasibilityRemark: [""],
      phone: ["", [Validators.pattern("^[0-9]*$")]],
      mobile: ["", [Validators.required, Validators.minLength(3)]],
      secondaryMobile: ["", Validators.minLength(3)],
      countryCode: [this.commondropdownService.commonCountryCode],
      dunningType: [""],
      dunningSubType: [""],
      dunningSector: [""],
      dunningSubSector: [""],
      cafno: [""],
      voicesrvtype: [""],
      didno: [""],
      calendarType: ["English", Validators.required],
      partnerid: [this.partnerId !== 1 ? this.partnerId : ""],
      salesremark: [""],
      servicetype: [""],
      serviceareaid: ["", Validators.required],
      status: [""],
      parentCustomerId: [""],
      invoiceType: ["", Validators.required],
      parentExperience: ["Actual", Validators.required],
      latitude: [""],
      longitude: [""],
      houseNumber: [""],
      birthDate: [""],
      discount: [""],
      plangroupid: [""],
      discountType: [""],
      discountTypeData: [""],
      discountExpiryDate: [""],
      flatAmount: [""],
      // id:[],
      billTo: ["CUSTOMER"],
      billableCustomerId: [""],
      isInvoiceToOrg: [false],
      istrialplan: [false],
      popid: [""],
      staffId: [""],
      branch: [""],
      planMappingList: (this.payMappingListFromArray = this.fb.array([])),
      addressList: (this.addressListFromArray = this.fb.array([])),
      overChargeList: (this.overChargeListFromArray = this.fb.array([])),
      custMacMapppingList: (this.custMacMapppingListFromArray = this.fb.array([])),
      custdisplayIpMappingList: (this.ipMapppingdisplayListFromArray = this.fb.array([])),
      custIpMappingList: (this.ipMapppingListFromArray = this.fb.array([])),
      paymentDetails: this.fb.group({
        amount: [""],
        paymode: [""],
        referenceno: [""],
        paymentdate: [""]
      }),
      isCustCaf: ["yes"],
      valleyType: [""],
      customerArea: [""],
      framedIpBind: [""],
      ipPoolNameBind: [""],
      dunningCategory: ["", Validators.required],
      billday: [""],
      oltid: [""],
      masterdbid: [""],
      splitterid: [""],
      departmentId: [""],
      locations: [],
      parentQuotaType: [""],
      isParentLocation: [""],
      isCredentialMatchWithAccountNo: [false],
      framedIpv6Address: [""],
      VLANID: [""],
      nasIpAddress: [""],
      nasPort: [""],
      framedIp: [""],
      maxconcurrentsession: ["", Validators.pattern(Regex.numeric)],
      addparam1: [""],
      addparam2: [""],
      addparam3: [""],
      addparam4: [""],
      earlybillday: [""],
      blockNo: [""],
      drivingLicence: [""],
      customerVrn: [""],
      customerNid: [""],
      renewPlanLimit: [""],
      graceDay: [{ value: 0, disabled: this.iscustomerEdit }, [Validators.max(30)]],
      loginUsername: ["", Validators.required],
      loginPassword: ["", [Validators.required, this.noSpaceValidator]],
      currency: [""],
      mvnoId: [""],
      isPasswordAutoGenerated: [true],
      onuInterface: [""]
    });

    this.servicePackForm = this.fb.group({
      vasId: [""],
      installmentFrequency: [""],
      totalInstallments: [""],
      installment_no: [1]
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

    let actualMvnoId = mvnoId ? mvnoId : localStorage.getItem(mvnoId);
    this.commondropdownService.getplanservice(actualMvnoId);
    this.commondropdownService.getPostpaidplanData(actualMvnoId);
    this.commondropdownService.findAllplanGroups(actualMvnoId);
    this.systemService
      .getConfigurationByName("HOUSE_HOLD_ID_VALIDATION", actualMvnoId)
      .subscribe((res: any) => {
        this.isThisTumil = res.data.value === "true";
        this.isAutoGeneratedPassword = true;
        if (this.isAutoGeneratedPassword) {
          if (this.isThisTumil) {
            const autoPassword = Math.random().toString(36).slice(-8);
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
        }
      });

    if (this.custType === "Postpaid") {
      this.customerGroupForm.controls["billday"].setValidators(Validators.required);
      this.customerGroupForm.controls["billday"].updateValueAndValidity();
      this.customerGroupForm.controls.earlybillday.setValidators(Validators.required);
    }
    this.customerGroupForm.controls.invoiceType.disable();
    this.customerGroupForm.controls.parentExperience.disable();

    this.customerGroupForm.controls.dunningSubType.disable();
    this.customerGroupForm.controls.dunningSubSector.disable();
    this.commondropdownService.panNumberLength$.subscribe(panLength => {
      if (panLength) {
        this.customerGroupForm
          .get("pan")
          ?.setValidators([Validators.minLength(panLength), Validators.maxLength(panLength)]);
        this.customerGroupForm.get("pan")?.updateValueAndValidity();
      }
    });

    this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
      if (lengthObj) {
        this.customerGroupForm
          .get("mobile")
          ?.setValidators([
            Validators.required,
            Validators.minLength(lengthObj.min),
            Validators.maxLength(lengthObj.max)
          ]);
        this.customerGroupForm.get("mobile")?.updateValueAndValidity();
      }
    });
    this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
      if (lengthObj) {
        this.customerGroupForm
          .get("secondaryMobile")
          ?.setValidators([
            Validators.minLength(lengthObj.min),
            Validators.maxLength(lengthObj.max)
          ]);
        this.customerGroupForm.get("secondaryMobile")?.updateValueAndValidity();
      }
    });
    const serviceArea = localStorage.getItem("serviceArea");
    const serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.getserviceAreaListForCafCustomer(actualMvnoId);
      // this.commondropdownService.filterPartnerAll();
    } else {
      this.commondropdownService.getserviceAreaListForCafCustomer(actualMvnoId);
      // this.commondropdownService.getpartnerAll();
    }
    this.commondropdownService.getsystemconfigList(actualMvnoId);
    this.getBankDestinationDetail(actualMvnoId);
    this.commondropdownService.getInstallmentTypeData();
    this.systemService
      .getConfigurationByName("TOTAL_INSTALLMENTS", actualMvnoId)
      .subscribe((res: any) => {
        this.totalInstallmentsLength = +res.data.value;
        for (let i = 1; i < this.totalInstallmentsLength; i++) {
          this.totalInstallments.push({ text: i + 1, value: i + 1 });
        }
      });
    this.systemService
      .getConfigurationByName("CURRENCY_FOR_PAYMENT", actualMvnoId)
      .subscribe((res: any) => {
        this.currency = res.data.value;
        this.systemConfigCurrency = res.data.value;
      });

    this.systemService
      .getConfigurationByName("CONVERTED_EXCHANGE_RATE", actualMvnoId)
      .subscribe((res: any) => {
        this.apiExchangeRate = parseFloat(res?.data?.value.replace(/,/g, "")) || 1;
        this.convertedExchangeRate = this.apiExchangeRate;
      });

    this.systemService
      .getConfigurationByName("IS_MANDATORY_ALL_REMOVE", actualMvnoId)
      .subscribe((res: any) => {
        this.isMandatory = res.data.value === "true";
        if (this.isMandatory) {
          this.customerGroupForm.get("dunningType").setValidators([Validators.required]);
          this.customerGroupForm.get("dunningType").updateValueAndValidity();
        } else {
          this.customerGroupForm.get("dunningType").clearValidators();
          this.customerGroupForm.get("dunningType").updateValueAndValidity();
        }
      });
    this.systemService
      .getConfigurationByName("IS_CHECKBOX_ENABLE", actualMvnoId)
      .subscribe((res: any) => {
        if (res?.data?.value) {
          this.is_check_enable = res.data.value === "true";
        }
      });
    this.systemService
      .getConfigurationByName("is_installment_allowed", actualMvnoId)
      .subscribe((res: any) => {
        if (res?.data?.value) {
          this.isInstallmentAllowed = res.data.value === "true";
        }
      });
    this.systemService
      .getConfigurationByName("DEFAULT_CUSTOMER_CATEGORY", actualMvnoId)
      .subscribe((res: any) => {
        if (res?.data?.value) {
          this.customerGroupForm.controls.dunningCategory.setValue(res?.data?.value);
        }
      });
    this.overServicePackListFormArray = this.fb.array([]);
  }

  discountChangeEvent(event, name: "plan" | "customer", index?: number) {
    const selectedValue = event.value;
    const selectedData = this.discountList.find(item => item.name === selectedValue);
    const discountAmount = selectedData?.amount || 0;
    this.discountPercentage({}, discountAmount);
    const discountexpirydate = selectedData?.validUpto ? new Date(selectedData.validUpto) : null;
    // this.disabledDiscExpiryDate = discountexpirydate ? true : false;

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

  getAllPlanData(currency, data?) {
    this.planAllData = [];
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerGroupForm.value?.mvnoId
          ? this.customerGroupForm.value?.mvnoId
          : data?.mvnoId
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
    this.vasData = this.planAllData?.find(x => x.id === event.value);
    this.vasOfferPrice = this.vasData.vasAmount;
    this.newVasPackId = event.value;
    this.servicePackForm.controls.vasId.setValue(event.value);
  }

  onChangeInstallmentType() {
    if (this.isInstallemnt) {
      this.servicePackForm
        .get("installmentFrequency")
        ?.setValue(this.commondropdownService.installmentTypeData[0]?.value);
      this.servicePackForm.get("installmentFrequency").setValidators([Validators.required]);
      this.servicePackForm.get("totalInstallments").setValidators([Validators.required]);
    } else {
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
  //   callCheckShiftLocation() {
  //     const url = "/vasplan/checkShiftLocation?custId=" + this.customerId;
  //     this.customerManagementService.getMethod(url).subscribe(
  //       (response: any) => {
  //         let isAllow = response.isAllowed;
  //         if (isAllow) {
  //           this.newShiftdisplayShiftLocationDetails = true;
  //           this.newShiftgetNetworkDevicesByType("OLT");
  //           this.newShiftLocationChargeGroupForm.reset();
  //         } else {
  //           this.shiftLocationMsg = response.msg;
  //           this.isDisplayShiftLocationMsg = true;
  //         }
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle"
  //         });
  //       }
  //     );
  //   }

  closeShiftLocationMsg() {
    this.isDisplayShiftLocationMsg = false;
  }

  addVasPackData() {
    // if (this.overServicePackListFormArray.value?.length >= 1) {
    //   const data = {
    //     vasId: this.overServicePackListFormArray.value[0].vasId,
    //     installmentFrequency: this.overServicePackListFormArray.value[0].installmentFrequency,
    //     installment_no: this.overServicePackListFormArray.value[0].installment_no,
    //     totalInstallments: this.overServicePackListFormArray.value[0].totalInstallments,
    //     oldVasId: this.oldVasPackId,
    //     newVasId: this.newVasPackId,
    //     custId: this.customerId
    //   };
    this.servicePackSubmitted = true;
    if (this.servicePackForm.valid) {
      const data = {
        vasId: this.servicePackForm.value.vasId,
        installmentFrequency: this.servicePackForm.value.installmentFrequency,
        installment_no: this.servicePackForm.value.installment_no,
        totalInstallments: this.servicePackForm.value.totalInstallments,
        oldVasId: this.oldVasPackId,
        newVasId: this.newVasPackId,
        custId: this.customerId
      };
      let mvnoId = localStorage.getItem("mvnoId");
      const url = "/vasplan/updateVas" + "?mvnoId=" + mvnoId;
      this.customerManagementService.postMethod(url, data).subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-times-circle"
            });
            // this.isVasPlan = false;
            this.changePlanForm.reset();
            this.servicePackSubmitted = false;
            this.changePlanForm.controls.planId.setValue("");
            this.changePlanForm.controls.planGroupId.setValue("");
            this.changePlanForm.controls.purchaseType.setValue("Changeplan");
            this.changePlanForm.controls.remarks.setValue("");
            this.changePlanForm.patchValue({
              paymentOwnerId: Number(localStorage.getItem("userId"))
            });
            this.changePlanForm.updateValueAndValidity();
            this.isVasPlan = true;
            this.newVasPackId = "";
          }
        },
        (error: any) => {}
      );
    }
  }

  getOldPackData(custId: any, mvnoId) {
    const url = "/vasplan/getCustVasPlan?custId=" + custId + "&mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.oldVasPackData = response.vasPlanList;
        if (this.oldVasPackData?.length > 0) {
          this.oldVasPackId = this.oldVasPackData[0]?.id;
        }
      },
      (error: any) => {}
    );
  }

  getVasPlanByCustId(isOpenFromHtml, custId?) {
    isOpenFromHtml ? (this.openVasDetailsByCust = true) : "";
    let customerId = custId ? custId : this.customerId;
    const url = "/vasplan/getVasPlanByCustId?custId=" + customerId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        let vasPlanList = response.vasPlanList;
        if (vasPlanList?.length > 0) {
          for (let item of vasPlanList) {
            if (item.isActive) {
              this.vasPlan = item;
            }
          }
          this.getTatDetails(vasPlanList[0]?.tatId);
        } else {
          this.vasPlan = "";
        }
        this.servicePackMsg = this.vasPlan
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
  closedialog() {
    this.openVasDetailsByCust = false;
  }

  checkPaymentMode(formPayModeValue) {
    if (
      formPayModeValue &&
      (formPayModeValue == "vatreceiveable" ||
        formPayModeValue == "tds" ||
        formPayModeValue == "abbs")
    ) {
      return true;
    } else {
      return false;
    }
  }

  onChangeOFAmountTest(event) {
    if (this.selectedInvoice.length >= 1) {
      let isAbbsTdsMode: boolean = false;
      if (this.paymentFormGroup.controls.paymode.value) {
        let formPayModeValue = this.paymentFormGroup.controls.paymode.value.toLowerCase();
        isAbbsTdsMode = this.checkPaymentMode(formPayModeValue);
      }
      let totaltdsAmount = 0;
      let totalabbsAmount = 0;
      this.selectedInvoice.forEach(element => {
        let tds = 0;
        let abbs = 0;
        if (element.includeTds) {
          if (element.includeTds === true) {
            tds = Number(element.tdsCheck);
            totaltdsAmount = Number(element.tdsCheck) + Number(totaltdsAmount);
            this.isTdsFlag = true;
          }
        }
        if (element.includeAbbs) {
          if (element.includeAbbs === true) {
            abbs = Number(element.abbsCheck);
            totalabbsAmount = Number(element.abbsCheck) + Number(totalabbsAmount);
            this.isAbbsFlag = true;
          }
        }
        if (isAbbsTdsMode) {
          element.tds = 0;
          element.abbs = 0;
        } else {
          element.tds = tds;
          element.abbs = abbs;
        }
      });
      const tdsAmount = totaltdsAmount;
      const abbsAmount = totalabbsAmount;
      if (isAbbsTdsMode) {
        this.paymentFormGroup.controls.abbsAmount.setValue(0);
        this.paymentFormGroup.controls.tdsAmount.setValue(0);
      } else {
        // if (this.isAbbsFlag) {
        this.paymentFormGroup.controls.abbsAmount.setValue(abbsAmount);
        // }
        // if (this.isTdsFlag) {
        this.paymentFormGroup.controls.tdsAmount.setValue(tdsAmount);
        // }
      }
    }
  }
  modalCloseInvoiceList() {
    this.convertedExchangeRate = this.apiExchangeRate;
    this.displaySelectInvoiceDialog = false;
  }

  getPlanPurchaseType() {
    const url = "/commonList/generic/planPurchaseType";
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        if (this.custType === "Postpaid") {
          this.cafChangePlanType = response.dataList.filter(
            type =>
              type.text !== "New" &&
              type.text !== "Upgrade" &&
              type.text !== "Renew" &&
              type.text !== "Addon"
          );
        } else {
          this.cafChangePlanType = response.dataList.filter(
            type => type.text !== "New" && type.text !== "Upgrade"
          );
        }
      },
      (error: any) => {}
    );
  }

  checkWithHouseHoldId() {
    if (this.isThisTumil) {
      if (!this.householdId || this.householdId.trim() === "") {
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
      //   email: this.customerGroupForm.value.email,
      //   password: this.customerGroupForm.get("loginPassword")?.value,
      householdId: this.householdId,
      householdType: this.householdType,
      mvnoId: mvnoId
    };
    this.customerManagementService.postMethodForIntegration(url, obj).subscribe((response: any) => {
      if (response.responseCode == 200) {
        // this.presentGroupForm.get("areaId").setValue(response?.data?.wardId);
        // this.getAreaData(response?.data?.wardId, "present");
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

  getTatDetails(tatId) {
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerDetailData?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
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

  checkAvailblePort(deviceId) {
    this.isEditEnable = true;
    this.editMacSerialBtn = deviceId;

    // Find the current row object
    const selectedDevice = this.nearDeviceLocationData.find(d => d.networkDeviceId === deviceId);

    if (selectedDevice) {
      this.currentParentPorts(selectedDevice, "OUT");
    }
  }

  currentParentPorts(device: any, type: string) {
    const url = `/NetworkDevice/checkPortAvailability?parentDeviceId=${device.networkDeviceId}&parentPortType=${type}`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.availableOutPorts =
          response.dataList != null
            ? response.dataList
                .filter((item: string) => item.includes("OUT-Port"))
                .map(port => ({ label: port, value: port })) // format for p-dropdown
            : [];

        this.spinner.hide();
      },
      (error: any) => this.spinner.hide()
    );
  }

  confirmAttachDeviceUpdate(networkdeviceID: number, portNumber: number) {
    if (!portNumber) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select an Out Port before adding."
      });
      return;
    }
    if (networkdeviceID && portNumber) {
      this.confirmationService.confirm({
        message: `If the SN Splitter is changed, all associated device mappings—such as downgrade hierarchy bindings between the SN Splitter and Customer Inventory—linked to the previous SN Splitter will be automatically removed.
        <br><br>
        <strong>Confirmation Required:</strong> Are you sure you want to proceed with updating the attached configuration?`,
        acceptLabel: "Yes",
        rejectLabel: "No",
        icon: "pi pi-question-circle",
        accept: () => {
          this.bindNetworkDevice(networkdeviceID, portNumber);
        },
        reject: () => {}
      });
    }
  }

  bindNetworkDevice(networkdeviceID: number, portNumber: number) {
    const deviceData = {};
    const url =
      "/NetworkDevice/bindNetworkDevice?customerId=" +
      this.customerIdINLocationDevice +
      "&networkDeviceId=" +
      networkdeviceID +
      "&portBlockNumber=" +
      portNumber;

    this.customerManagementService.updateInventoryMethod(url, deviceData).subscribe(
      (response: any) => {
        this.NetworkDeviceData = response.locations;
        this.nearsearchClose();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.customer,
          icon: "far fa-check-circle"
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

  nearsearchClose() {
    this.nearDeviceLocationData = [];
    this.closeNearLocationModal.emit();
    this.newFirst = 0;
    this.nearLocationModal = false;
  }
  viewPortBlock(data: any, isParent: boolean) {
    // Get single device object instead of array
    this.viewPort = this.nearDeviceLocationData.find(
      (device: any) => device.portBlockNumber === data.portBlockNumber
    );
    this.viewPortDialog = true; // Open dialog
  }
  closePortDetailsModel() {
    this.viewPortDialog = false;
  }
  openViewAttachDeviceModal(custId: number) {
    this.showViewAttachDeviceModal = true;
    const bindUrl = `/customer/viewCustomerNetworkBindByCustId?custId=${custId}`;
    this.customerInventoryManagementService.getMethod(bindUrl).subscribe(
      (bindRes: any) => {
        this.attachDeviceData = bindRes?.data || null;
      },
      error => {
        console.error("Error loading attach device data", error);
        this.attachDeviceData = null;
      }
    );
  }

  closeViewAttachDeviceModal() {
    this.showViewAttachDeviceModal = false;
    this.attachDeviceData = null;
  }
  onDiscountTypeChange(data: any) {
    if (data.newDiscountType === "One-time") {
      data.newDiscount = null;
    }
  }

  changeValue(value) {
    if (!value.dirty) {
      this.isnewDiscount = false;
      let msg = "value required";
    }
  }

  allowNumbersOnly(event: any) {
    const value = event.target.value;
    event.target.value = value.replace(/[^0-9]/g, "");
    this.paymentFormGroup.controls.chequeno.setValue(event.target.value);
  }

  modalCloseShiftLocation() {
    this.rejectApproveShiftLocationModal = false;
  }

  modalCloseInventoryModal() {
    this.assignCustomerInventoryModal = false;
  }

  modalCloseRejectInventory() {
    this.rejectCustomerInventoryModal = false;
  }

  getPaymentApproval(selectedInvoiceIds) {
    let invoiceIds = selectedInvoiceIds.map(x => x.id);
    let obj = { invoiceId: invoiceIds, customerid: this.customerId };
    const url = "/recordPaymentStatusByInvoiceIds";
    this.revenueManagementService.postMethod(url, obj).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.paymentApprovalHeader = true;
          this.paymentMsg = response.responseMessage;
        } else if (response.responseCode == 204) {
          this.paymentApprovalHeader = false;
          this.displayRecordPaymentDialog = true;
          //   this.paymentMsg = response.responseMessage;
        }
      },
      (error: any) => {
        this.paymentApprovalHeader = false;
        this.displayRecordPaymentDialog = true;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  paymentApproval() {
    this.paymentApprovalHeader = false;
  }

  closePyamentApproval() {
    this.displayRecordPaymentDialog = false;
    this.paymentApprovalHeader = false;
  }
}
