import { Component, OnInit, Input, ElementRef, EventEmitter, Output } from "@angular/core";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { formatDate, DatePipe } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { filter } from "lodash";
// import { StaffSelectModelComponent } from 'StaffSelectModelComponent';
import { StaffSelectModelComponent } from "./../../staff-select-model/staff-select-model.component";
import { StaffService } from "../../radius-staff/staff.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { CustomerService } from "src/app/service/customer.service";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { LoginService } from "src/app/service/login.service";

declare var $: any;

@Component({
  selector: "app-cust-charge-management",
  templateUrl: "./cust-charge-management.component.html",
  styleUrls: ["./cust-charge-management.component.css"]
})
export class CustChargeManagementComponent implements OnInit {
  custid = 0;
  custData: any = {};
  customerId = 0;
  custType: string = "";
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  currentCustChargePageSlab = 1;
  itemsCustChargePerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalCustChargeRecords: String;
  showItemCustChargePerPage = 0;
  ChargeCustList = [];
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  overChargeListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  overChargeListtotalRecords: String;
  currentPageoverChargeList = 1;
  overChargeListFromArray: FormArray;
  chargeGroupForm: FormGroup;
  newCalculatedPrice: any;
  currentDate = new Date();
  billingCycle: any = [];
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  custmerType: any = "";
  viewcustomerListData: any = [];
  filterPlanData = [];
  planDropdownInChageData: any = [];
  selectchargeValueShow: boolean = false;
  chargesubmitted = false;
  endData: any = "";
  deleteChargeID: any = "";
  planChageData: any;
  dateTime = new Date();
  todayDate: any;
  selectedParentCust: any = [];
  billableCusList: any = [];
  searchOptionSelect = this.commondropdownService.customerSearchOptionBill;
  newFirst = 0;
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  prepaidParentCustomerList: any;
  parentCustomerListdatatotalRecords: any;
  parentFieldEnable = false;
  searchParentCustValue = "";
  searchParentCustOption = "";
  billableCustomerId = null;
  planMappingList: any = [];
  paymentOwnerId = null;
  customerPlanMappingList: any = [];
  currency: string;
  searchkey: string;
  searchkey2: string;
  searchDeatil: string;
  searchData: any;
  staffDataList: any = [];
  requestedByList: any = [];
  serviceAreaId: any;
  data: any = [];
  staffData: any = [];
  serviceAreaDisable = false;
  showItemPerPage = 1;
  selectedStaffCust: any = [];
  staffCustList: any = [];
  staffid: any = "";
  searchOption = "";
  selectCustomerDialogVisible: boolean = false;
  addChargeAccess: boolean = false;
  isInstallemnt: boolean = false;
  totalInstallments: any = [];
  totalInstallmentsLength: number;
  isDisableConn: boolean = false;
  installmentPrice: any;
  displayPrice: boolean = false;
  chargeData: any;
  isInstallmentAllowed: boolean = false;
  deleteChargeId: boolean = false;
  updateStaticIP: boolean = false;
  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    public serviceAreaService: ServiceAreaService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private staffService: StaffService,
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemconfigService,
    private liveUserService: LiveUserService,
    public invoicePaymentListService: InvoicePaymentListService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private customerService: CustomerService,
    public loginService: LoginService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custid = this.customerId;
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.addChargeAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CHARGE_CREATE
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
  }

  ngOnInit(): void {
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
      billingCycle: [""],
      connection_no: ["", Validators.required],
      paymentOwnerId: ["", Validators.required],
      discount: [""],
      expiry: ["", Validators.required],
      expiryDate: [""],
      installmentFrequency: [""],
      totalInstallments: [""],
      installment_no: [1]
    });
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };
    this.overChargeListFromArray = this.fb.array([]);
    this.getSingleCustomerData(this.custid);
    this.getserviceData();
    this.dateTime.setDate(this.dateTime.getDate());
    this.todayDate = this.dateTime.getTime();
    this.commondropdownService.getInstallmentTypeData();
  }

  displayDialog: boolean = false;

  showDialog() {
    this.displayDialog = true;
    const userId = Number(localStorage.getItem("userId"));
    const userName = localStorage.getItem("loginUserName");
    const exists = this.staffSelectList.some(staff => staff.id === userId);
    if (!exists) {
      this.staffSelectList.push({
        id: userId,
        name: userName
      });
    }
    this.paymentOwnerId = userId;
    this.chargeGroupForm.patchValue({
      paymentOwnerId: userId
    });
    this.getServiceSerialNumber();
  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  TotalItemCustChargePerPage(event) {
    this.showItemCustChargePerPage = Number(event.value);
    if (this.currentCustChargePageSlab > 1) {
      this.currentCustChargePageSlab = 1;
    }
    this.getCustChargeDetails(this.showItemCustChargePerPage, this.custid);
  }

  getCustChargeDetails(size, id) {
    this.planChageData = [];
    let page_list;
    if (size) {
      page_list = size;
      this.itemsCustChargePerPage = size;
    } else {
      if (this.showItemCustChargePerPage == 0) {
        this.itemsCustChargePerPage = this.pageITEM;
      } else {
        this.itemsCustChargePerPage = this.showItemCustChargePerPage;
      }
    }
    this.ChargeCustList = [];

    let data = [];

    let url = "/getAllCustomerDirectChargeByCustomer/" + id;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.ChargeCustList = response.custChargeOverrideList;
        response.custChargeOverrideList.forEach(element => {
          if (element.planid) {
            let mvnoId =
              localStorage.getItem("mvnoId") === "1"
                ? this.custData?.mvnoId
                : localStorage.getItem("mvnoId");
            const url = "/postpaidplan/" + element.planid + "?mvnoId=" + mvnoId;
            this.customerManagementService.getMethod(url).subscribe((response: any) => {
              this.planChageData.push(response.postPaidPlan);
            });
          }
        });
        this.ChargeCustList = this.ChargeCustList.filter(value => value.isDeleted == false);
        // this.ChargeCustList.forEach((element, i) => {
        //   let SDate = new Date(element.startdate);
        //   let EDate = new Date(element.enddate);
        //   this.ChargeCustList[i].startdate = SDate.getTime();
        //   this.ChargeCustList[i].enddate = EDate.getTime();
        // });
        // console.log(this.ChargeCustList);
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

  pageChangedList(pageNumber) {
    this.currentCustChargePageSlab = pageNumber;
    this.getCustChargeDetails("", this.customerId);
  }

  // add charge
  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }

  getSingleCustomerData(id) {
    this.planDropdownInChageData = [];
    this.customerPlanMappingList = [];
    let url = "/customers/" + id;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custmerType = response.customers.custtype;
      this.custData = response.customers;
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.custData?.mvnoId
          : localStorage.getItem("mvnoId");
      this.custData?.currency
        ? (this.currency = this.custData?.currency)
        : this.systemService
            .getConfigurationByName("CURRENCY_FOR_PAYMENT", mvnoId)
            .subscribe((res: any) => {
              this.currency = res.data.value;
            });

      this.systemService
        .getConfigurationByName("is_installment_allowed", mvnoId)
        .subscribe((res: any) => {
          if (res?.data?.value) {
            this.isInstallmentAllowed = res.data.value === "true";
            this.systemService
              .getConfigurationByName("TOTAL_INSTALLMENTS", mvnoId)
              .subscribe((res: any) => {
                this.totalInstallmentsLength = +res.data.value;
                for (let i = 1; i < this.totalInstallmentsLength; i++) {
                  this.totalInstallments.push({ text: i + 1, value: i + 1 });
                }
              });
          }
        });
      this.getCustChargeDetails("", this.custid);
      //   this.getStaffDetailById(response.customers.serviceareaid);
      // this.chargeGroupForm.get("billingCycle").clearValidators();
      // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
      this.chargeGroupForm.patchValue({
        type: "Recurring"
      });
      this.billingSequence();
      // if (response.customers.plangroupid) {
      //   this.getPlangroupByPlan(response.customers.plangroupid);
      // } else {
      this.customerPlanMappingList = response.customers.planMappingList;
      // response.customers.planMappingList.forEach(element => {
      //   if (element.planId) {
      //     const url = "/postpaidplan/" + element.planId;
      //     this.customerManagementService.getMethod(url).subscribe((response: any) => {
      //       this.planDropdownInChageData.push(response.postPaidPlan);
      //     });
      //   }
      // });
      // }
      const url = "/subscriber/fetchCustomerDiscountDetailServiceLevel/" + id;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planMappingList = response.discountDetails;
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
    });
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

  onBillingCycleChange(e) {
    this.chargeGroupForm.get("connection_no").reset();
    this.chargeGroupForm.get("planid").reset();
    this.chargeGroupForm.get("expiry").reset();
  }

  deleteConfirmonChargeField(chargeFieldIndex: number, name: string) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + name + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveChargelist(chargeFieldIndex);
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

  onRemoveChargelist(index: number) {
    this.overChargeListFromArray.removeAt(index);
    this.isInstallemnt = false;
  }

  pageChangedOverChargeList(pageNumber) {
    this.currentPageoverChargeList = pageNumber;
  }

  createoverChargeListFormGroup(newPrice?): FormGroup {
    // this.chargeGroupForm.get("billingCycle").clearValidators();
    // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    let billingCycle = this.chargeGroupForm.value.type === "Recurring" ? 1 : "";
    let planName = this.planByService
      .filter(el => el.planId.split("-")[0] === this.chargeGroupForm.value.planid.split("-")[0])[0]
      .planName.split("(")[0];
    return this.fb.group({
      // chargeid: [''],
      type: [this.chargeGroupForm.value.type ? this.chargeGroupForm.value.type : "Recurring"],
      chargeid: [this.chargeGroupForm.value.chargeid],
      validity: [this.chargeGroupForm.value.validity],
      price: [newPrice ?? this.chargeGroupForm.value.price],
      originalPrice: [this.chargeGroupForm.value.price],
      actualprice: [this.chargeGroupForm.value.actualprice],
      charge_date: [this.chargeGroupForm.value.charge_date],
      planid: [this.chargeGroupForm.value.planid.split("-")[0]],
      planName: [planName],
      unitsOfValidity: [this.chargeGroupForm.value.unitsOfValidity],
      billingCycle: [billingCycle],
      paymentOwnerId: [this.paymentOwnerId],
      discount: [this.chargeGroupForm.value.discount],
      staticIPAdrress: [this.chargeGroupForm.value.staticIPAdrress],
      expiry: [this.chargeGroupForm.value.expiry],
      expiryDate: [moment(this.chargeGroupForm.value.expiry).format("DD-MM-YYYY HH:mm").toString()],
      connection_no: [this.chargeGroupForm.value.connection_no],
      installment_no: [1],
      installmentFrequency: [this.chargeGroupForm.value.installmentFrequency],
      totalInstallments: [this.chargeGroupForm.value.totalInstallments]
    });
  }

  staticIPCharge = null;
  staticIPExpiryDate = null;

  editStaticIP(charge) {
    this.staticIPCharge = charge;
    this.staticIPCharge.enddate = moment(charge.enddate).toDate();
    this.staticIPCharge.startdate = moment(charge.startdate).toDate();
    this.staticIPExpiryDate = moment(charge.enddate).toDate();
    this.updateStaticIP = true;
  }

  updateStaticIPAddress() {
    const url = `/updateStaticIpAddress?custChargeId=${this.staticIPCharge.id}&staticIPAddress=${
      this.staticIPCharge.staticIPAdrress
    }&staticIPExpiryDate=${this.datePipe.transform(this.staticIPExpiryDate, "yyyy-MM-dd")}`;
    this.customerManagementService.updateMethod(url, {}).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        this.updateStaticIP = false;
        this.staticIPCharge = null;
        this.staticIPExpiryDate = null;
        this.getCustChargeDetails("", this.custid);
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

  getNewPrice(price) {
    const url = `/getAmountPerInstallment/${price}/${this.chargeGroupForm.value.totalInstallments}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.newCalculatedPrice = response.data;
        this.overChargeListFromArray.push(
          this.createoverChargeListFormGroup(this.newCalculatedPrice)
        );
        this.chargeGroupForm.reset();
        this.chargeGroupForm.patchValue({
          type: "Recurring"
        });
        this.chargesubmitted = false;
        this.selectchargeValueShow = false;
        this.planByService = [];
        this.isInstallemnt = false;
        this.onChangeInstallmentType();
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

  onAddoverChargeListField() {
    this.chargesubmitted = true;
    this.chargeGroupForm.patchValue({
      paymentOwnerId: this.paymentOwnerId,
      type: "Recurring"
    });
    if (this.chargeGroupForm.valid) {
      if (this.chargeGroupForm.value.price >= this.chargeGroupForm.value.actualprice) {
        if (this.isInstallemnt) {
          if (this.chargeGroupForm.value.discount > 0) {
            let installmentPrice =
              (this.chargeGroupForm.value.price * this.chargeGroupForm.value.discount) / 100;
            this.installmentPrice = this.chargeGroupForm.value.price - installmentPrice;
            this.getNewPrice(this.installmentPrice);
          } else {
            this.getNewPrice(this.chargeGroupForm.value.price);
          }
        } else {
          if (this.chargeGroupForm.value.discount > 0) {
            let installmentPrice =
              (this.chargeGroupForm.value.price * this.chargeGroupForm.value.discount) / 100;
            this.installmentPrice = this.chargeGroupForm.value.price - installmentPrice;
            this.overChargeListFromArray.push(
              this.createoverChargeListFormGroup(this.installmentPrice)
            );
          } else {
            this.overChargeListFromArray.push(this.createoverChargeListFormGroup());
          }
          this.chargeGroupForm.reset();
          this.chargeGroupForm.patchValue({
            type: "Recurring"
          });
          this.chargesubmitted = false;
          this.selectchargeValueShow = false;
          this.planByService = [];
          this.isInstallemnt = false;
          this.onChangeInstallmentType();
        }
      }
    }
  }

  getPlangroupByPlan(planGroupId) {
    // this.planDropdownInChageData = [];
    this.customerPlanMappingList = [];
    let MappURL = "/findPlanGroupMappingByPlanGroupId?planGroupId=" + planGroupId;
    this.customerManagementService.getMethod(MappURL).subscribe((response: any) => {
      let attributeList = response.planGroupMappingList;
      attributeList.forEach(element => {
        this.customerPlanMappingList.push(element.plan);
      });
    });
  }

  getPlanValidityForChagre(event) {
    const planId = event.value.split("-")[0];
    const id = event.value.split("-")[1];
    let customerPlanMappingListPlanId = this.customerPlanMappingList.find(
      plan => Number(plan.planId) == Number(planId)
    );
    let expiry = this.planByService.find(
      plan =>
        Number(plan.planId.split("-")[0]) == Number(planId) &&
        Number(plan.planId.split("-")[1] == id)
    ).expiryDate;

    // let expiryDate = moment(expiry).format("DD-MM-YYYY HH:mm").toString();

    this.chargeGroupForm.patchValue({
      validity: Number(customerPlanMappingListPlanId.validity),
      unitsOfValidity: customerPlanMappingListPlanId.unitsOfValidity,
      expiry: expiry
    });
    // this.chargeGroupForm.get('expiry')?.disable();
    let planData = this.planMappingList.find(
      element => element.connectionNo === this.chargeGroupForm.value.connection_no
    );
    if (
      planData.discountType === "Recurring" &&
      new Date(planData.discountExpiryDate) > this.dateTime &&
      planData.discount > 0
    ) {
      this.confirmationService.confirm({
        message: "Do you want to apply " + planData.discount + " % of  Discount?",
        header: "Change Discount Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.chargeGroupForm.patchValue({
            discount: planData.discount
          });
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
          this.chargeGroupForm.patchValue({
            discount: 0
          });
        }
      });
    } else if (
      planData.discountType === "Recurring" &&
      new Date(planData.discountExpiryDate) > this.dateTime &&
      planData.discount < 0
    ) {
      this.confirmationService.confirm({
        message: "Do you want to over charge customer " + planData.discount + " % ?",
        header: "Change Discount Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.chargeGroupForm.patchValue({
            discount: planData.discount
          });
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
          this.chargeGroupForm.patchValue({
            discount: 0
          });
        }
      });
    }
    //
    // });
  }

  selectcharge(_event: any) {
    let chargeId = _event.value;
    let viewChargeData;
    let date;

    date = this.currentDate.toISOString();
    const format = "yyyy-MM-dd";
    const locale = "en-US";
    const myDate = date;
    const formattedDate = formatDate(myDate, format, locale);
    //
    // console.log(this.currentDate);
    let data = this.commondropdownService.chargeByTypeData.find(charge => charge.id === chargeId);
    if (data.chargetype === "REFUNDABLE") {
      this.isInstallemnt = false;
      this.isDisableConn = true;
    } else {
      this.isDisableConn = false;
    }
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/charge/" + chargeId + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      viewChargeData = response.chargebyid;
      this.selectchargeValueShow = true;
      if (viewChargeData.chargecategory === "IP") {
        this.chargeGroupForm.get("staticIPAdrress").setValidators([Validators.required]);
        this.chargeGroupForm.get("staticIPAdrress").updateValueAndValidity();
      } else {
        this.chargeGroupForm.get("staticIPAdrress").clearValidators();
        this.chargeGroupForm.get("staticIPAdrress").updateValueAndValidity();
      }
      this.chargeGroupForm.patchValue({
        actualprice: Number(viewChargeData.actualprice),
        price: Number(viewChargeData.actualprice),
        charge_date: formattedDate
      });
    });
  }

  closeChargeModal() {
    this.chargeGroupForm.reset();
    this.overChargeListFromArray = this.fb.array([]);
    this.removeSelParentCust();
    this.removeSelectStaff();
    this.displayDialog = false;
    this.isInstallemnt = false;
  }

  saveChargeData() {
    const url = "/createCustChargeOverride";
    var request = [];
    request = this.overChargeListFromArray.value;
    request.forEach(charge => {
      // var dateParts = charge.expiry.substring(0, 10).split("-");
      // var newDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      charge.expiry = moment(charge.expiry).format("YYYY-MM-DD");
      charge.price = charge.originalPrice;
    });
    let chargeDta = {
      custChargeDetailsPojoList: request,
      custid: this.custid,
      billableCustomerId: this.billableCustomerId,
      paymentOwnerId: this.paymentOwnerId
    };
    this.customerManagementService.postMethod(url, chargeDta).subscribe(
      (response: any) => {
        setTimeout(() => {
          this.getCustChargeDetails("", this.custid);
        }, 3000);
        this.closeChargeModal();
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
  }

  deleteConfirmCharge(id, startdate, enddate) {
    this.deleteChargeID = id;

    if (this.todayDate < enddate && this.todayDate > startdate) {
      this.confirmationService.confirm({
        message: "Do you want to Delete of  Charge?",
        header: "Delete Charge Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteChargeId = true;
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    } else if (this.todayDate < enddate && this.todayDate < startdate) {
      this.deletechargeData("softDel");
    }
  }

  deletecloseModel() {
    this.deleteChargeId = false;
  }

  deletechargeData(SID) {
    let data;
    if (SID == "softDel") {
      data = {
        endDate: "",
        id: this.deleteChargeID,
        softDelete: true
      };
    } else {
      data = {
        endDate: this.endData,
        id: this.deleteChargeID,
        softDelete: false
      };
    }
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/deleteCustomerDirectCharge?mvnoId=" + mvnoId;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.getCustChargeDetails("", this.custid);
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
  }
  custServiceData: any = [];
  planByService: any = [];
  isShowConnection = true;
  serviceSerialNumbers = [];
  async getserviceData() {
    // const url = "/subscriber/getPlanByCustService/" + this.custid;
    // this.customerManagementService.getMethod(url).subscribe(
    //   (response: any) => {
    //     this.custServiceData = response.dataList;
    //
    //   },
    //   (error: any) => {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: error.error.ERROR,
    //       icon: "far fa-times-circle",
    //     });
    //
    //   }
    // );
    // const url = "/subscriber/getFuturePlanList/" + this.custid;
    // await this.customerManagementService.getMethod(url).subscribe(
    //   (response: any) => {
    //     if (response.dataList != null) {
    //       response.dataList.forEach(data => {
    //         if (this.custServiceData.length > 0) {
    //           let isElementAlreadyExist = this.custServiceData.find(
    //             el => el.serviceId === data.serviceId
    //           )
    //             ? true
    //             : false;
    //           if (!isElementAlreadyExist) {
    //             this.custServiceData.push(data);
    //           }
    //         } else {
    //           this.custServiceData.push(data);
    //         }
    //       });
    //     }
    //
    //   },
    //   (error: any) => {
    //     // console.log(error, "error")
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: error.error.ERROR,
    //       icon: "far fa-times-circle",
    //     });
    //
    //   }
    // );

    const url1 = "/subscriber/getActivePlanList/" + this.custid + "?isNotChangePlan=true";
    await this.customerManagementService.getMethod(url1).subscribe(
      (response: any) => {
        if (response.dataList != null) {
          this.custServiceData = response.dataList.filter(
            item =>
              item.plangroup !== "Volume Booster" &&
              item.plangroup !== "Bandwidthbooster" &&
              item.plangroup !== "DTV Addon"
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
  getServiceSerialNumber() {
    var keepGping = false;
    this.serviceSerialNumbers = [];
    this.overChargeListFromArray = this.fb.array([]);
    this.chargeGroupForm.reset();
    if (this.custServiceData.length > 0) {
      this.custServiceData.forEach(item => {
        if (!keepGping) {
          var filteredItem = item.customerInventorySerialnumberDtos.filter(item => item.primary);
          if (filteredItem.length > 0) {
            this.isShowConnection = false;
            this.serviceSerialNumbers.push({
              serialNumber: filteredItem[0].serialNumber,
              custPlanMapppingId: item.custPlanMapppingId,
              connection_no: item.connection_no
            });
          } else {
            this.isShowConnection = true;
            this.serviceSerialNumbers = [];
            keepGping = true;
          }
        }
      });
    }
  }

  filterPlan(e) {
    //---new comment for new api data for plan
    // this.planByService = [];
    // let expiryDate;
    // this.customerPlanMappingList.filter(element => {
    //   let isElementAlreadyExist = this.planByService.filter(el => el.planId === element.planId);
    //   if (
    //     element.serviceId ==
    //       this.planMappingList.find(plan => plan.connectionNo === e.value).serviceId &&
    //     (element.plangroup === "Renew" || element.plangroup === "Registration and Renewal") &&
    //     element.custPlanStatus.toLowerCase() === "active"
    //   ) {
    //     expiryDate = new Date(element.expiryDate);
    // let date = new Date(expiryDate);
    // let extendValue = 1 * element.validity;
    // if (this.chargeGroupForm.value.type === this.chargeType[1].label) {
    // var unitsOfValidity = element.unitsOfValidity;
    // switch (unitsOfValidity) {
    //   case "Days": {
    //     date.setDate(date.getDate() + extendValue);
    //     break;
    //   }

    //   case "Hours": {
    //     date.setHours(date.getHours() + extendValue);
    //     break;
    //   }

    //   case "Months": {
    //     date.setMonth(date.getMonth() + extendValue);
    //     break;
    //   }

    //   case "Years": {
    //     date.setFullYear(date.getFullYear() + extendValue);
    //     break;
    //   }
    // }
    // expiryDate = date;
    // }
    //---new comment for new api data for plan
    //     if (isElementAlreadyExist.length > 0 && isElementAlreadyExist.id !== element.id) {
    //       this.planByService.push({
    //         planId: element.planId,
    //         planName: element.planName,
    //         expiryDate: expiryDate
    //       });
    //     } else {
    //       this.planByService.push({
    //         planId: element.planId,
    //         planName: element.planName,
    //         expiryDate: expiryDate
    //       });
    //     }
    //   }
    // });
    this.planByService = [];
    this.planByService = this.custServiceData;
    this.planByService.map(plan => {
      plan.planId =
        plan.id != null || plan.id != undefined ? `${plan.planId}-${plan.id}` : `${plan.planId}`;
      if (typeof plan.expiryDate === "string") {
        const parsedDate = moment(plan.expiryDate, ["DD-MM-YYYY hh:mm A", moment.ISO_8601], true);

        plan.expiryDate = parsedDate.isValid() ? parsedDate.toDate() : null;
      }
      if (plan.expiryDate) {
        const formattedDate = moment(plan.expiryDate).format("DD-MM-YYYY");
        plan.planName = plan.planName.replace(/\(\d{2}-\d{2}-\d{4}\)$/g, "");
        plan.planName = `${plan.planName} (${formattedDate})`;
      }

      return plan;
    });

    this.commondropdownService.getChargeTypeByList(
      this.planMappingList.find(plan => plan.connectionNo === e.value).serviceId,
      this.currency
    );
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

  modalOpenParentCustomer() {
    this.selectCustomerDialogVisible = true;
    // $("#selectParentCustomerFromCharge").modal("show");
    this.newFirst = 0;
    this.getParentCustomerData();
    this.selectedParentCust = [];
  }

  getParentCustomerData() {
    let currentPage;
    currentPage = this.currentPageParentCustomerListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/parentCustomers/list/" + this.custType + "?mvnoId=" + mvnoId;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.parentCustomerList;
        const list = this.prepaidParentCustomerList;
        const filterList = list.filter(cust => cust.id !== this.custid);

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

  selParentSearchOption(event) {
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  getSearchCustomerByService() {
    const url =
      "/getByCustomerService?page=" +
      this.currentPageParentCustomerListdata +
      "&pageSize=" +
      this.parentCustomerListdataitemsPerPage +
      "&service=" +
      this.searchDeatil +
      "&customerType=" +
      this.custType;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.customers.content;
        const usernameList: string[] = [];
        this.prepaidParentCustomerList.forEach(element => {
          usernameList.push(element.username);
        });

        this.liveUserService
          .postMethod("/liveUser/isCustomersOnlineOrOffline", {
            users: usernameList
          })
          .subscribe((res: any) => {
            const liveUsers: string[] = res.liveusers;
            this.prepaidParentCustomerList.forEach(element => {
              if (liveUsers.findIndex(e => e == element.username) < 0) {
                element.connectionMode = "Offline";
              } else {
                element.connectionMode = "Online";
              }
            });
          });
        this.parentCustomerListdatatotalRecords = response.customers.totalElements;

        this.parentCustomerListdataitemsPerPage = response.pageDetails.totalRecordsPerPage;
        this.currentPageParentCustomerListdata = response.pageDetails.currentPageNumber;
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
          this.prepaidParentCustomerList = [];
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

  searchParentCustomer() {
    const searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "id",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageParentCustomerListdata,
      pageSize: this.parentCustomerListdataitemsPerPage,
      sortBy: "id",
      sortOrder: 0
    };
    if (this.searchParentCustOption !== "UserName" && this.searchParentCustOption !== "Name") {
      if (
        !this.searchkey ||
        this.searchkey !== this.searchParentCustValue.trim() ||
        !this.searchkey2 ||
        this.searchkey2 !== this.searchParentCustOption.trim()
      ) {
        this.currentPageParentCustomerListdata = 1;
      }
      this.searchkey = this.searchParentCustValue.trim();
      this.searchkey2 = this.searchParentCustOption.trim();
      searchData.filters[0].filterValue = this.searchParentCustValue.trim();
      searchData.filters[0].filterColumn = this.searchParentCustOption.trim();
    } else {
      if (
        !this.searchkey ||
        this.searchkey !== this.searchParentCustValue ||
        !this.searchkey2 ||
        this.searchkey2 !== this.searchParentCustOption
      ) {
        this.currentPageParentCustomerListdata = 1;
      }
      let searchParentCustValue = this.datePipe.transform(this.searchParentCustValue, "yyyy-MM-dd");
      this.searchkey = searchParentCustValue;
      this.searchkey2 = this.searchParentCustOption;
      this.searchData.filters[0].filterValue = searchParentCustValue;
      this.searchData.filters[0].filterColumn = this.searchParentCustOption;
    }
    if (this.searchParentCustOption == "UserName") {
      this.getSearchCustomerByService();
    } else {
      this.searchData.page = this.currentPageParentCustomerListdata;
      this.searchData.pageSize = this.parentCustomerListdataitemsPerPage;
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.custData?.mvnoId
          : localStorage.getItem("mvnoId");
      const url = "/customers/search/" + this.custType + "?mvnoId=" + mvnoId;
      this.customerManagementService.postMethod(url, searchData).subscribe(
        (response: any) => {
          this.prepaidParentCustomerList = response.customerList;
          const usernameList: string[] = [];
          this.prepaidParentCustomerList.forEach(element => {
            usernameList.push(element.username);
          });
          this.liveUserService
            .postMethod("/liveUser/isCustomersOnlineOrOffline", {
              users: usernameList
            })
            .subscribe((res: any) => {
              const liveUsers: string[] = res.liveusers;
              this.prepaidParentCustomerList.forEach(element => {
                if (liveUsers.findIndex(e => e == element.username) < 0) {
                  element.connectionMode = "Offline";
                } else {
                  element.connectionMode = "Online";
                }
              });
            });
          this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
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
            this.prepaidParentCustomerList = [];
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

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  paginate(event) {
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
  }

  async saveSelCustomer() {
    this.billableCusList = [
      {
        id: this.selectedParentCust.id,
        name: this.selectedParentCust.name
      }
    ];
    this.billableCustomerId = this.selectedParentCust.id;
    this.modalCloseParentCustomer();
    this.selectCustomerDialogVisible = false;
  }

  modalCloseParentCustomer() {
    $("#selectParentCustomerFromCharge").modal("hide");
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.selectCustomerDialogVisible = false;
  }

  removeSelParentCust() {
    this.selectedParentCust = [];
    this.billableCusList = [];
    this.billableCustomerId = null;
  }

  getStaffDetailById(serviceAreaId) {
    const url = "/getstaffuserbyserviceareaid/" + serviceAreaId;
    this.serviceAreaService.getMethod(url).subscribe((response: any) => {
      this.staffDataList = response.dataList;
      //console.log("staffDataList", this.data);
      this.staffDataList.forEach((element, i) => {
        element.displayLabel = element.fullName + " (Ph: " + element.phone + ")";
      });
    });
  }

  selectedStaff: any = [];
  selectStaffType = "";
  staffSelectList: any = [];
  selectStaff: boolean = false;
  showSelectStaffModel: boolean = false;
  parentCustomerDialogType = "";
  modalOpenSelectStaff(type) {
    this.selectStaff = true;
    this.parentCustomerDialogType = type;
    this.selectedStaff = [];
    this.selectStaffType = type;
    this.selectedStaff.push({
      id: Number(localStorage.getItem("userId")),
      name: localStorage.getItem("loginUserName")
    });
  }

  selectedStaffChange(event) {
    this.selectStaff = false;
    let data = event;
    this.staffSelectList = [
      {
        id: Number(data.id),
        name: data.username
      }
    ];
    this.paymentOwnerId = Number(data.id);
  }

  saveSelstaff() {
    this.selectStaff = false;
  }

  modalCloseStaff() {
    this.selectStaff = false;
  }

  closeSelectStaff() {
    this.selectStaff = false;
  }

  removeSelectStaff() {
    this.staffSelectList = [];
    this.paymentOwnerId = null;
  }

  onChangeInstallmentType() {
    if (this.isInstallemnt === true) {
      this.chargeGroupForm
        .get("installmentFrequency")
        ?.setValue(this.commondropdownService.installmentTypeData[0]?.value);
      this.chargeGroupForm.get("installmentFrequency").setValidators([Validators.required]);
      this.chargeGroupForm.get("installmentFrequency").updateValueAndValidity();
      this.chargeGroupForm.get("totalInstallments").setValidators([Validators.required]);
      this.chargeGroupForm.get("totalInstallments").updateValueAndValidity();
    } else {
      this.chargeGroupForm.patchValue({
        installmentFrequency: "",
        totalInstallments: ""
      });
      this.chargeGroupForm.get("installmentFrequency").clearValidators();
      this.chargeGroupForm.get("installmentFrequency").updateValueAndValidity();
      this.chargeGroupForm.get("totalInstallments").clearValidators();
      this.chargeGroupForm.get("totalInstallments").updateValueAndValidity();
    }
  }

  openChargeDetails(charge) {
    this.chargeData = [];
    this.chargeData.push(charge);
    this.displayPrice = true;
  }

  close() {
    this.displayPrice = false;
  }

  closeUpdateCharge() {
    this.updateStaticIP = false;
  }
}
