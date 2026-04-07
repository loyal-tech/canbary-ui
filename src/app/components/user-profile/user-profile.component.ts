import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { BehaviorSubject } from "rxjs";
import { partnerManagement } from "src/app/components/model/partner";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomerDetailsService } from "src/app/service/customer-details.service";
import { LoginService } from "src/app/service/login.service";
import { PartnerService } from "src/app/service/partner.service";
import { CustomerDetailsComponent } from "../common/customer-details/customer-details.component";
import { countries } from "src/app/components/model/country";
import { Router } from "@angular/router";
import { COUNTRY, CITY, STATE, PINCODE, AREA } from "src/app/RadiusUtils/RadiusConstants";
import { AreaManagementService } from "src/app/service/area-management.service";
import { TreeNode } from "primeng/api";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import * as FileSaver from "file-saver";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  @ViewChild(CustomerDetailsComponent)
  customerDetailModal: CustomerDetailsComponent;
  modalToggle: boolean = false;

  custId = new BehaviorSubject({
    custId: ""
  });

  countries: any = countries;
  partnerCategoryList: any;
  submitted: boolean = false;
  serviceareaModal: boolean = false;
  partnerModal: boolean = false;
  taxListData: any;
  createpartnerData: partnerManagement;
  currentPagepartnerListdata = 1;
  currentInvoicePagepartnerListdata = 1;
  partnerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  partnerInvoiceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  partnerListdatatotalRecords: any;
  partnerListData: any = [];
  childListData: any = [];
  partnerInvoiceListData: any = [];
  parenetpartnerList: any = [];
  viewpartnerListData: any = [];
  ispartnerEdit: boolean = false;
  partnertype = "";
  partnercategory = "";
  searchpartnerUrl: any;
  dayArray: any = [];
  serviceData: any;
  qosPolicyData: any;
  quotaData: any;
  quotaTypeData: any;
  areaNameCategoryList: any;
  isPlanEdit: boolean = false;
  viewPlanListData: any;

  areaNameitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  areaNametotalRecords: String;
  currentPageareaName = 1;
  selectvalue = "";

  temp = [];
  partnerListData1: any;
  partnerListDataselector: any;
  partnerRulelength = 0;

  searchData: any;
  searchName: any = "";
  searchAddressType: any = "";
  searchServiceAreaName: any = "";

  myselectedArea = "";

  date1 = new Date();

  ngbBirthcal: NgbDateStruct | any;
  pincodeDeatils: any;

  selectPartnerView: boolean = false;
  partnerrALLDeatilsShow: boolean = false;
  childpartnerShow: boolean = false;
  balanceDetailsView = false;
  isBalanceSubMenu = false;
  partnerDATA: any = [];
  childPartnerDATA: any = [];
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  filterPartnerListData: any = [];
  partnerLedgerInfoPojo: any = [];

  balanceLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerDetailsItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerServiceDetailsItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  balanceLedgertotalRecords: String;
  customerDetailsTotalRecords: any;
  customerServiceDetailsTotalRecords: any;
  currentPagebalanceLedgerList = 1;
  customerDetailsCurrentPage = 1;
  customerServiceDetailsCurrentPage = 1;
  balanceData: any = [];
  showDialogue: boolean = false;
  BalanceAllData: any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;
  showItemBalance = 1;
  partnerIDSelectBalance: any;
  statusOptions = RadiusConstants.status;
  commissionShareType = [
    { label: "Balance", value: "Balance" },
    { label: "Revenue", value: "Revenue" }
  ];
  celendarTypeData = [{ label: "English" }, { label: "Nepali" }];
  viewPincodeNumber: any = "";
  filterPincodeData: any = [];
  loginPartner: any;
  currency: string;
  CommissionLabel = "Commission";
  PartnerPayableCommission = "Partner Payable commission";
  PartnerCommission = "Partner Commission";
  inputMobile: string;
  partnerFlag = false;
  isInvoiceSubMenu: boolean = false;
  isPaymentSubMenu: boolean = false;

  PaymentdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  PaymentdatatotalRecords: String;
  currentPagePaymentdata = 1;
  paymentShowItemPerPage = 1;
  viewPaymentData: any = [];

  currentPageinvoiceMasterSlab = 1;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMastertotalRecords: String;
  showItemPerPageInvoice = 1;
  invoiceMasterListData: any = [];
  partnerServiceDropdownData: any = [];
  partnerDetails: any = [];
  id: number;
  editServiceAreaList: any = [];
  ifmobileValidation: boolean = false;

  serviceBranches: any = [];
  branchRegions: any = [];
  regionVerticals: any = [];
  custLedgerForm: FormGroup;
  custLedgerSubmitted = false;
  customerLedgerSearchKey: string;
  currentPagecustLedgerList = 1;
  legershowItemPerPage = 1;
  custLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  childDetailsModel: boolean = false;

  data: any = {
    END_DATE: "",
    START_DATE: "",
    end_DATE: "",
    partner_id: "",
    start_DATE: ""
  };
  dialogId: boolean = false;
  partnerHierarchy: TreeNode[];
  isPartnerInvoiceList: boolean = false;
  isOnlinePaymentAudit: boolean = false;
  isCustomerCountDetailsModel: boolean = false;
  customerLedgerDetailsList: any[] = [];
  isCustomerRevenueDetailsModel: boolean = false;
  isCustomerCommissionDetailsModel: boolean = false;
  isCustomerNetCommissionDetailsModel: boolean = false;
  planCommissionDetailsList: any[] = [];
  isNetTotalCommissionOfServiceDetailsModelForServiceLevel: boolean = false;
  netCommissionDetailsListForService = {};
  customerCommissionDetailsList: any[] = [];
  isCustomerTotalCommissionDetailsModelForServiceLevel: boolean = false;
  partnerOnlinePaymentAuditListData: any[] = [];
  partnerOnlinePaymentdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  partnerpaymentCurrentPagepartnerListdata = 1;
  partnerOnlinePaymentListdatatotalRecords: any;
  invoice: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private partnerService: PartnerService,
    loginService: LoginService,
    private areaManagementService: AreaManagementService,
    private router: Router,
    private customerDetailsService: CustomerDetailsService,
    private revenueService: RevenueManagementService,
    private systemService: SystemconfigService,
    private customerManagementService: CustomermanagementService,
    private invoiceMasterService: InvoiceMasterService
  ) {
    this.loginService = loginService;
  }

  ngOnInit(): void {
    this.custLedgerForm = this.fb.group({
      startDateCustLedger: ["", Validators.required],
      endDateCustLedger: ["", Validators.required]
    });
    this.searchData = {
      currentPageNumber: this.currentPagepartnerListdata,
      dataList: [{}]
    };

    this.loginPartner = localStorage.getItem("partnerId");
    window.scroll(0, 0);
    this.getPartnerDetails();
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  serviceAreaListWherePartnerNotBind: any = [];

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
      this.data.start_DATE = this.custLedgerForm.controls.startDateCustLedger.value;
      this.data.end_DATE = this.custLedgerForm.controls.endDateCustLedger.value;
    }
    this.PartnerBalnceData(this.partnerIDSelectBalance, "");
  }

  clearSearchCustomerLedger() {
    this.data.start_DATE = "";
    this.data.end_DATE = "";
    this.custLedgerForm.controls.startDateCustLedger.setValue("");
    this.custLedgerForm.controls.endDateCustLedger.setValue("");
    this.custLedgerSubmitted = false;
    this.PartnerBalnceData(this.partnerIDSelectBalance, "");
  }

  getPartnerDetails() {
    const url = "/partner/" + this.loginPartner;
    this.partnerListData = [];
    this.partnerService.getMethodNew(url).subscribe((response: any) => {
      this.particularALLDatashow(response.partnerlist);
    });
  }

  pageChangedpartnerList(pageNumber) {
    this.currentPagepartnerListdata = pageNumber;
    this.getChildPartnerList();
  }

  invoicePageChangedpartnerList(pageNumber) {
    this.currentInvoicePagepartnerListdata = pageNumber;
    this.getPartnerInvoiceList();
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagepartnerListdata > 1) {
      this.currentPagepartnerListdata = 1;
    }
  }

  invoiceTotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentInvoicePagepartnerListdata > 1) {
      this.currentInvoicePagepartnerListdata = 1;
    }
  }

  getChildPartnerList() {
    const url = "/getChildPartnerList/" + this.loginPartner;
    this.partnerService.postMethodNew(url, this.data).subscribe(
      (response: any) => {
        this.childListData = response.partnerlist;
        this.partnerrALLDeatilsShow = false;
        this.balanceDetailsView = false;
        this.isInvoiceSubMenu = false;
        this.isPaymentSubMenu = false;
        this.isPartnerInvoiceList = false;
        this.isOnlinePaymentAudit = false;
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
  particularALLDatashow(data: any) {
    if (data != "") {
      this.partnerDATA = data;
      if (this.partnerDATA.partnerType == "LCO") {
        this.partnerFlag = true;
        this.CommissionLabel = "Revenue Share to Operator";
        this.PartnerPayableCommission = "Payable Revenue Share to Operator";
        this.PartnerCommission = "Revenue Share to Operator";
      } else {
        this.partnerFlag = false;
        this.CommissionLabel = "Commission";
        this.PartnerPayableCommission = "Partner Payable commission";
        this.PartnerCommission = "Partner Commission";
      }
      if (data.pincode) {
        const url = "/pincode/" + data.pincode;

        this.areaManagementService.getMethod(url).subscribe((response: any) => {
          this.viewPincodeNumber = response.data.pincode;
        });
      }
    }
    this.childListData = false;
    this.partnerrALLDeatilsShow = true;
    this.balanceDetailsView = false;
    this.isBalanceSubMenu = true;
    this.isInvoiceSubMenu = false;
    this.isPaymentSubMenu = false;
    this.isPartnerInvoiceList = false;
    this.isOnlinePaymentAudit = false;
  }

  tempPartnerId: any;

  TotalItemPerPageBalnce(event) {
    this.showItemBalance = Number(event.value);
    if (this.currentPagebalanceLedgerList > 1) {
      this.currentPagebalanceLedgerList = 1;
    }
    this.PartnerBalnceData(this.partnerIDSelectBalance, this.showItemBalance);
  }

  PartnerBalnceData(PartnerId, size) {
    let page_list;
    this.searchkey = "";
    this.partnerIDSelectBalance = PartnerId;
    if (size) {
      page_list = size;
      this.balanceLedgerItemPerPage = size;
    } else {
      if (this.showItemBalance == 1) {
        this.balanceLedgerItemPerPage = this.pageITEM;
      } else {
        this.balanceLedgerItemPerPage = this.showItemBalance;
      }
    }

    this.partnerrALLDeatilsShow = false;
    this.balanceDetailsView = true;
    this.isInvoiceSubMenu = false;
    this.isPaymentSubMenu = false;
    this.childListData = false;
    this.isPartnerInvoiceList = false;
    this.isOnlinePaymentAudit = false;
    this.data.partner_id = PartnerId;
    this.partnerService.balanaceData(this.data).subscribe(
      (response: any) => {
        this.BalanceAllData = response.partnerLedgerDtls;
        this.partnerLedgerInfoPojo = response.partnerLedgerDtls.partnerLedgerInfoPojo;
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

  openModal(id, custId) {
    this.dialogId = true;
    this.custId.next({
      custId: custId
    });
  }

  closeSelectStaff() {
    this.dialogId = false;
  }

  pageChangedbalanceLedgerList(pageNumber) {
    this.currentPagebalanceLedgerList = pageNumber;
  }

  async balanceAllDetails(data) {
    // if (data.transcategory == 'Commision') {
    this.balanceData = data;
    this.showDialogue = true;
    // }
  }

  balanceDetailsColse() {
    this.showDialogue = false;
  }

  gotoManageBalance(partnerid) {
    this.router.navigate(["/home/manageBalance"], {
      queryParams: { id: partnerid }
    });
  }

  showListPaymentData() {
    this.partnerrALLDeatilsShow = false;
    this.balanceDetailsView = false;
    this.isBalanceSubMenu = true;
    this.isInvoiceSubMenu = false;
    this.isPaymentSubMenu = true;
    this.isPartnerInvoiceList = false;
    this.isOnlinePaymentAudit = false;
    this.openCustomersPaymentData(this.partnerDATA.id, "");
  }

  showListInvoiceData() {
    this.partnerrALLDeatilsShow = false;
    this.balanceDetailsView = false;
    this.isBalanceSubMenu = true;
    this.isInvoiceSubMenu = true;
    this.isPaymentSubMenu = false;
    this.isPartnerInvoiceList = false;
    this.isOnlinePaymentAudit = false;
    this.searchinvoiceMaster(this.partnerDATA.id, "");
  }

  pageChangedPaymentList(pageNumber) {
    this.currentPagePaymentdata = pageNumber;
    this.openCustomersPaymentData(this.partnerDATA.id, "");
  }

  TotalPaymentItemPerPage(event) {
    this.paymentShowItemPerPage = Number(event.value);
    if (this.currentPagePaymentdata > 1) {
      this.currentPagePaymentdata = 1;
    }
    this.openCustomersPaymentData(this.partnerDATA.id, this.paymentShowItemPerPage);
  }

  openCustomersPaymentData(id, size) {
    if (size) {
      this.PaymentdataitemsPerPage = size;
    } else {
      if (this.paymentShowItemPerPage == 1) {
        this.PaymentdataitemsPerPage = this.pageITEM;
      } else {
        this.PaymentdataitemsPerPage = this.paymentShowItemPerPage;
      }
    }

    const url =
      "/partnerDoc/partnerPaymentHistory/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.partnerService.getMethod(url).subscribe((response: any) => {
      this.viewPaymentData = response.dataList;
      this.PaymentdatatotalRecords = this.viewPaymentData.length;
    });
  }

  pageChangedinvoiceMasterList(pageNumber) {
    this.currentPageinvoiceMasterSlab = pageNumber;
    this.searchinvoiceMaster(this.partnerDATA.id, "");
  }

  TotalItemPerPageInvoice(event) {
    this.showItemPerPageInvoice = Number(event.value);
    if (this.currentPageinvoiceMasterSlab > 1) {
      this.currentPageinvoiceMasterSlab = 1;
    }
    this.searchinvoiceMaster(this.partnerDATA.id, this.showItemPerPageInvoice);
  }

  searchinvoiceMaster(id, size) {
    if (size) {
      this.invoiceMasteritemsPerPage = size;
    } else {
      if (this.showItemPerPageInvoice == 1) {
        this.invoiceMasteritemsPerPage = this.pageITEM;
      } else {
        this.invoiceMasteritemsPerPage = this.showItemPerPageInvoice;
      }
    }

    let url =
      "/partnerDoc/partnerInvoiceHistory/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.partnerService.getMethod(url).subscribe(
      (response: any) => {
        this.invoiceMasterListData = response.dataList;
        this.invoiceMastertotalRecords = response.dataList.length;
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

  getPartnerHierarchy(parentpartnerid) {
    this.partnerHierarchy = [];

    const url = "/getPartnerHierarchyByChildPartnerId/" + parentpartnerid;
    this.partnerService.getMethodNew(url).subscribe((response: any) => {
      this.partnerHierarchy = response.partnerHierarchyList;
    });
  }

  partnerCommissionPercentage(balanceData, partnerFlag) {
    let commissionPer;
    if (partnerFlag) {
      commissionPer =
        ((balanceData.tds_amount +
          balanceData.amount -
          balanceData.partnerTax +
          balanceData.royalty) /
          (balanceData.offerprice - balanceData.tax - balanceData.agr_amount)) *
        100;
    } else {
      commissionPer =
        ((balanceData.tds_amount +
          balanceData.commission -
          balanceData.partnerTax +
          balanceData.royalty) /
          (balanceData.offerprice - balanceData.tax - balanceData.agr_amount)) *
        100;
    }
    return commissionPer.toFixed(2);
  }

  openServiceareaModal() {
    this.serviceareaModal = true;
  }
  closeServiceareaModal() {
    this.serviceareaModal = false;
  }

  openPartnerModal(parentpartnerid) {
    this.partnerModal = true;
    this.getPartnerHierarchy(parentpartnerid);
  }
  closePartnerModal() {
    this.partnerModal = false;
  }

  openChildData(data) {
    this.childDetailsModel = true;
    this.childPartnerDATA = data;
  }

  closeChildDetailModal() {
    this.childDetailsModel = false;
  }

  getPartnerInvoiceList() {
    this.isPartnerInvoiceList = true;
    this.partnerrALLDeatilsShow = false;
    this.balanceDetailsView = false;
    this.isInvoiceSubMenu = false;
    this.isPaymentSubMenu = false;
    this.isOnlinePaymentAudit = false;
    this.partnerInvoiceListData = [];
    const url = "/getAllPartnerDebitDocument/" + this.loginPartner;
    this.revenueService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        } else {
          this.partnerInvoiceListData = response.partnerDebitDocs;
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

  openCustomerCountDetailsModel(isPlanGroup, planOrPlanGroupId, transcategory, transType) {
    this.isCustomerCountDetailsModel = true;
    this.customerLedgerDetailsList = [];
    if (isPlanGroup) {
      this.customerLedgerDetailsList =
        transcategory == "Commision"
          ? this.partnerLedgerInfoPojo.debitCreditDetail.filter(
              debit =>
                debit.transcategory == transcategory &&
                debit.planGroupId == planOrPlanGroupId &&
                debit.transtype == transType
            )
          : this.partnerLedgerInfoPojo.debitCreditDetail.filter(
              debit => debit.transcategory == transcategory && debit.transtype == transType
            );
    } else {
      this.customerLedgerDetailsList =
        transcategory == "Commision"
          ? this.partnerLedgerInfoPojo.debitCreditDetail.filter(
              debit =>
                debit.transcategory == transcategory &&
                debit.planid == planOrPlanGroupId &&
                debit.planGroupId == null &&
                debit.transtype == transType
            )
          : this.partnerLedgerInfoPojo.debitCreditDetail.filter(
              debit => debit.transcategory == transcategory && debit.transtype == transType
            );
    }
    this.customerDetailsTotalRecords = this.customerLedgerDetailsList.length;
  }

  closeCustomerCountDetailsModel() {
    this.isCustomerCountDetailsModel = false;
  }

  customerDetailsPageChanged(pageNumber) {
    this.customerDetailsCurrentPage = Number(pageNumber);
  }

  customerServiceDetailsPageChanged(pageNumber) {
    this.customerServiceDetailsCurrentPage = Number(pageNumber);
  }

  customerDetailsTotalItemPerPage(event) {
    this.showItemBalance = Number(event.value);
    if (this.customerDetailsCurrentPage > 1) {
      this.customerDetailsCurrentPage = 1;
    }
  }

  customerServiceDetailsTotalItemPerPage(event) {
    this.showItemBalance = Number(event.value);
    if (this.customerServiceDetailsCurrentPage > 1) {
      this.customerServiceDetailsCurrentPage = 1;
    }
  }

  openCustomerRevenueDetailsModel(ledger) {
    this.isCustomerRevenueDetailsModel = true;
    this.getPlanCommissionDetails(ledger);
  }

  closeCustomerRevenueDetailsModel() {
    this.isCustomerRevenueDetailsModel = false;
  }

  openCustomerCommissionDetailsModel(ledger) {
    this.isCustomerCommissionDetailsModel = true;
    this.getPlanCommissionDetails(ledger);
  }

  closeCustomerCommissionDetailsModel() {
    this.isCustomerCommissionDetailsModel = false;
  }

  openCustomerNetCommissionDetailsModel(ledger) {
    this.isCustomerNetCommissionDetailsModel = true;
    this.getPlanCommissionDetails(ledger);
  }

  closeCustomerNetCommissionDetailsModel() {
    this.isCustomerNetCommissionDetailsModel = false;
  }

  getPlanCommissionDetails(ledger) {
    this.planCommissionDetailsList = [];
    let request = {
      id: ledger.planOrPlanGroupId,
      isPlanGroup: ledger.isPlanGroup,
      agrPercentage: ledger.agrPercentage,
      revenueSharePercentage: ledger.commissionSharePercentage,
      partnerTaxId: ledger.partnerTaxId,
      tdsPercentage: ledger.tdsPercentage
    };
    let url = "/getPlanCommissionDetailList";
    this.revenueService.postMethod(url, request).subscribe(
      (response: any) => {
        this.planCommissionDetailsList = response.planCommissionDetails.planCommissionDetailList;
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

  getTotal(data) {
    return data.reduce(
      (item, { baseOfferPriceExcludeAgr }) => (item += +(baseOfferPriceExcludeAgr || 0)),
      0
    );
  }

  downloadPDFINvoice(docNo, customerName) {
    if (docNo) {
      const downloadUrl = "/partnerInvoicePdf/download/" + docNo;
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

  generatePDFInvoice(custId) {
    if (custId) {
      const url = "/generatePdfByPartnerInvoiceId/" + custId;
      this.customerManagementService.generateMethodInvoice(url).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
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

  viewInvoice(docnumber, custname) {
    const url = "/regeneratepartnerpdfsub/" + docnumber;
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

  openCustomerCountDetailsModelForServiceLevel(serviceId, transcategory, transType) {
    this.isCustomerCountDetailsModel = true;
    this.customerLedgerDetailsList = [];
    this.customerLedgerDetailsList =
      transcategory == "Commision"
        ? this.partnerLedgerInfoPojo.debitCreditDetail.filter(
            debit =>
              debit.transcategory == transcategory &&
              debit.serviceId == serviceId &&
              debit.transtype == transType
          )
        : this.partnerLedgerInfoPojo.debitCreditDetail.filter(
            debit => debit.transcategory == transcategory && debit.transtype == transType
          );
    this.customerDetailsTotalRecords = this.customerLedgerDetailsList.length;
  }

  openNetTotalCommissionOfServiceDetailsModelForServiceLevel(ledger) {
    this.isNetTotalCommissionOfServiceDetailsModelForServiceLevel = true;
    let totalBaseRevenue = ledger.commissionDetailList.planCommissionDetailList.reduce(
      (total, revenue) => total + revenue.baseOfferPriceExcludeAgr * revenue.customerCount,
      0
    );
    let totalCommission = ledger.commissionDetailList.planCommissionDetailList.reduce(
      (total, revenue) => total + revenue.netCommission * revenue.customerCount,
      0
    );

    this.netCommissionDetailsListForService = {
      serviceName: ledger.serviceName,
      totalBaseRevenue: totalBaseRevenue,
      commission: totalCommission
    };
  }

  closeNetTotalCommissionOfServiceDetailsModelForServiceLevel() {
    this.isNetTotalCommissionOfServiceDetailsModelForServiceLevel = false;
  }

  openCustomerTotalCommissionDetailsModel(ledger) {
    this.isCustomerTotalCommissionDetailsModelForServiceLevel = true;
    this.getCustomerTotalCommissionDetails(ledger);
  }

  closeCustomerTotalCommissionDetailsModelForServiceLevel() {
    this.isCustomerTotalCommissionDetailsModelForServiceLevel = false;
  }

  getCustomerTotalCommissionDetails(ledger) {
    this.customerCommissionDetailsList = [];

    this.customerCommissionDetailsList = ledger.serviceLevelCommissions;
    this.customerServiceDetailsTotalRecords = this.customerCommissionDetailsList.length;
  }

  getPartnerOnlinePaymentAudit() {
    this.isPartnerInvoiceList = false;
    this.partnerrALLDeatilsShow = false;
    this.balanceDetailsView = false;
    this.isInvoiceSubMenu = false;
    this.isPaymentSubMenu = false;
    this.isOnlinePaymentAudit = true;
    this.partnerInvoiceListData = [];
    const url = "/onlinePayAudit/allByPartnerId?partnerId=" + this.loginPartner;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.partnerOnlinePaymentAuditListData = response.onlineAuditData;
        if (response?.onlineAuditData && response?.onlineAuditData.length == 0) {
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

  partnerPaymentPageChanged(pageNumber) {
    this.partnerpaymentCurrentPagepartnerListdata = pageNumber;
  }

  partnerPaymentTotalItemPerPage(event) {
    if (this.partnerpaymentCurrentPagepartnerListdata > 1) {
      this.partnerpaymentCurrentPagepartnerListdata = 1;
    }
  }

  showInvoiceDetail(id) {
    this.modalToggle = true;
    this.revenueService.getInvoiceDataById(id).subscribe(
      (response: any) => {
        this.invoice = response.message;
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
  closeInvoiceDetailsModel() {
    this.modalToggle = false;
  }
}
