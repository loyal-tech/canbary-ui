import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { ChangePlanService } from "./change-plan.service";
import _ from "underscore";
import { DatePipe } from "@angular/common";
import { PaymentModeService } from "./payment_mode.service";
import { RecordPaymentService } from "./record-payment.service";

@Component({
  selector: "app-change-plan",
  templateUrl: "./change-plan.component.html",
  styleUrls: ["./change-plan.component.css"]
})
export class ChangePlanComponent implements OnInit {
  custId: any;
  ui_id: string;
  service: string;
  partnerId: number;
  firstActivePlanName: string = "-";

  taxDetailsByPlanData: number;
  req_message = "This field is required.";
  amount: number;
  addonStart: boolean;
  activatetionDate: boolean;
  submitted: boolean = false;
  isOverhead: boolean = false;
  isIncludingTax: boolean = false;
  subscriberCurrentPlanData: any;
  selectedPlan: any;
  subbmitted: boolean = false;
  displayActivateDate: any;
  displayExpiryDate: any;
  showCurrentPlanDetails: boolean = true;
  showAdvRenewal: boolean = false;
  amountValid: boolean;
  paymentDateValid: boolean;
  tdsAmountValid: boolean;
  chequeNoValid: boolean;
  bankNameValid: boolean;
  chequeDateValid: boolean;
  branchValid: boolean;
  checkeligiblity: any;
  remarksValid: boolean;
  purchaseaddonprice: any;
  paymentModeValid: boolean;
  referenceNoValid: boolean;
  refundShow: boolean = false;
  finalPayableAmount: number = 0;
  planPrice: number = 0;
  advanceRenewFlag: any;
  purchaseType: string;
  purchaseEndDate: Date;
  isaddon: boolean;
  isChecked: boolean = false;
  addonStartDate: any;
  finalAmount: number;
  endDate: string;
  mindate: Date;
  public planList: any;
  isvalideligiblity: Boolean;

  public planPurchaseTypeList: any;
  selected_payment_mode_value: any;
  selected_tds_deducted: any;

  public tdsPendingPaymentsList: any[] = [
    {
      display_text: "",
      id: ""
    }
  ];
  public paymentModeList: any[] = [
    {
      text: "",
      value: ""
    }
  ];

  public advRenewalList: any[] = [
    {
      text: "Yes",
      value: true
    },
    {
      text: "No",
      value: false
    }
  ];

  changePlanForm = new FormGroup({
    planId: new FormControl("", [Validators.required]),
    advRenewal: new FormControl(null),
    isIncludeTax: new FormControl(false),
    isPriceOverride: new FormControl(false),
    sellPrice: new FormControl(""),
    planPurchaseType: new FormControl("", [Validators.required]),
    skip: new FormControl(),
    remarks: new FormControl("", [Validators.required]),
    isPaymentReceived: new FormControl("no", [Validators.required]),
    addonStartDate: new FormControl(new Date()),
    recordPaymentDTO: new FormGroup({
      amount: new FormControl(""),
      payment_date: new FormControl(""),
      payment_mode: new FormControl(""),
      referenceNo: new FormControl(""),
      chequeNo: new FormControl(""),
      bankName: new FormControl(""),
      chequeDate: new FormControl(""),
      branch: new FormControl(""),
      tdsDeducted: new FormControl(false),
      tdsAmount: new FormControl(""),
      remarks: new FormControl(""),
      credit_doc_id: new FormControl("")
    })
  });

  constructor(
    private loadingService: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private radiusUtility: RadiusUtility,
    private changePlanService: ChangePlanService,
    private paymentModeService: PaymentModeService,
    private recordPaymentService: RecordPaymentService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.custId = id;
      this.getSubscriberBasicDetails();
    }
    this.getSubscriberCurrentPlan();
    this.getPaymentModeListFromGenericApi();
    if (this.ui_id === "purchase-addon-plan") {
      this.purchaseAddon();
    }
  }

  getSubscriberBasicDetails() {
    let subscriber_id = this.custId;
    this.changePlanService.getSubscriberBasicDetails(subscriber_id).subscribe(result => {
      if (result.responseCode !== 200 && result.responseMessage) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: result.responseMessage,
          icon: "far fa-times-circle"
        });
      } else {
        if (result.data.planList && result.data.planList.length) {
          this.service = result.data.planList.service;
          this.partnerId = result.data.partnerId;
          let findActivePlan: any = _.where(result.data.planList, { planstage: "ACTIVE" });
          if (findActivePlan && findActivePlan.length) {
            let activePlans = _.pluck(findActivePlan, "planName");
            this.firstActivePlanName = _.first(activePlans);
          } else {
            this.firstActivePlanName = "-";
          }
        }
      }
    });
  }

  purchaseAddon() {
    if (this.ui_id === "purchase-addon-plan") {
      this.mindate = new Date(Date.now());
      this.changePlanService.checkeligibility(this.custId).subscribe(res => {
        this.checkeligiblity = res.data;
        if (this.checkeligiblity.isConvertToAddon === true) {
          if (this.checkeligiblity.isValidActivePlan === true) {
            console.log;
            this.isvalideligiblity = true;
          }
        } else {
          this.changePlanForm.controls.addonStartDate.setValidators(Validators.required);
          this.isaddon = false;
        }
      });
    }
  }
  getPaymentModeListFromGenericApi() {
    this.paymentModeService.getPaymentModeListFromGenericApi().subscribe(result => {
      this.paymentModeList = result.dataList;
    });
  }

  onChangeTdsDeducted(el) {
    let is_tds_deducted = el;
    this.selected_tds_deducted = is_tds_deducted;
  }

  // paymentReceivedTrue(event) {
  //   if (event.target.value === 'on') {
  //     this.changePlanForm.controls.isPaymentReceived.setValue(true);
  //   }
  // }
  //
  // paymentReceivedFalse(event) {
  //   if (event.target.value === 'on') {
  //     this.changePlanForm.controls.isPaymentReceived.setValue(false);
  //   }
  // }

  onChangePaymentMode(el) {
    if (el) {
      let payment_mode_value = el.value;
      this.selected_payment_mode_value = payment_mode_value;
      if (this.selected_payment_mode_value === "TDS") {
        this.recordPaymentService.getTdsPendingPayments(this.custId).subscribe(result => {
          this.tdsPendingPaymentsList = result.dataList;
        });
      }
    } else {
      this.selected_payment_mode_value = "";
    }
  }

  getSubscriberCurrentPlan() {
    this.getPlanPurchaseType();
    let subscriber_id = this.custId;
    this.changePlanService.getSubscriberCurrentPlan(subscriber_id).subscribe(result => {
      if (result && result.data) {
        this.subscriberCurrentPlanData = result.data;
        if (result.data.currentPlanDTO === null) {
          this.showCurrentPlanDetails = false;
          this.getPlanPurchaseType();
        } else {
          this.purchaseType = "Renew";
          if (this.planPurchaseTypeList && this.planPurchaseTypeList.length > 0) {
            let renew = this.planPurchaseTypeList.find(ls => {
              if (ls.value.toLowerCase() === "renew") {
                return ls;
              }
            });
            this.changePlanForm.get("planPurchaseType").patchValue(this.purchaseType);
            this.onChangePurchaseType(renew);
          }
          this.changePlanForm.get("advRenewal").patchValue(true);
          if (this.advRenewalList) {
            let adv = this.advRenewalList.find(ls => {
              if (ls.value === "true") {
                return ls;
              }
            });
            this.onChangeAdvRenewal(adv);
          }
        }
        if (this.ui_id !== "purchase-addon-plan") {
          this.planList = this.subscriberCurrentPlanData.customPlanDtoList;
          if (this.planList && this.planList.length > 0) {
            let plan = this.planList.find(ls => {
              if (this.subscriberCurrentPlanData.currentPlanDTO) {
                if (ls.planId === this.subscriberCurrentPlanData.currentPlanDTO.custCurrentPlanId) {
                  return ls;
                }
              }
            });
            if (this.subscriberCurrentPlanData.currentPlanDTO) {
              this.changePlanForm
                .get("planId")
                .patchValue(this.subscriberCurrentPlanData.currentPlanDTO.custCurrentPlanId);
              this.onChangePlan(plan);
            }
          }
        }
      }
    });
  }
  onPaymentTypeChange(event) {
    if (event === "YES") {
      this.changePlanForm.get("recordPaymentDTO").get("amount").setValidators(Validators.required);
      this.changePlanForm.get("recordPaymentDTO").get("amount").updateValueAndValidity();
      this.changePlanForm
        .get("recordPaymentDTO")
        .get("payment_date")
        .setValidators(Validators.required);
      this.changePlanForm.get("recordPaymentDTO").get("payment_date").updateValueAndValidity();
      this.changePlanForm
        .get("recordPaymentDTO")
        .get("payment_mode")
        .setValidators(Validators.required);
      this.changePlanForm.get("recordPaymentDTO").get("payment_mode").updateValueAndValidity();
      this.changePlanForm
        .get("recordPaymentDTO")
        .get("referenceNo")
        .setValidators(Validators.required);
      this.changePlanForm.get("recordPaymentDTO").get("referenceNo").updateValueAndValidity();
      // this.changePlanForm.get('recordPaymentDTO').get('amount').setValidators(Validators.required);
      // this.changePlanForm.get('recordPaymentDTO').get('amount').setValidators(Validators.required);
      // this.changePlanForm.get('recordPaymentDTO').get('amount').setValidators(Validators.required);
      // this.changePlanForm.get('recordPaymentDTO').get('amount').setValidators(Validators.required);
    } else {
      this.changePlanForm.get("recordPaymentDTO").get("amount").clearValidators();
      this.changePlanForm.get("recordPaymentDTO").get("amount").updateValueAndValidity();
      this.changePlanForm.get("recordPaymentDTO").get("payment_date").clearValidators();
      this.changePlanForm.get("recordPaymentDTO").get("payment_date").updateValueAndValidity();
      this.changePlanForm.get("recordPaymentDTO").get("payment_mode").clearValidators();
      this.changePlanForm.get("recordPaymentDTO").get("payment_mode").updateValueAndValidity();
      this.changePlanForm.get("recordPaymentDTO").get("referenceNo").clearValidators();
      this.changePlanForm.get("recordPaymentDTO").get("referenceNo").updateValueAndValidity();
    }
  }
  refundCal() {
    if (this.purchaseType !== "New") {
      this.finalAmount =
        this.planPrice +
        this.taxDetailsByPlanData -
        this.subscriberCurrentPlanData.currentPlanDTO.refundableAmount;
      if (this.finalAmount < 0) {
        this.finalAmount = 0;
      }
      return this.finalAmount.toFixed(2);
    }
  }

  getPlanPurchaseType() {
    this.changePlanService.getPlanPurchaseType().subscribe(result => {
      this.planPurchaseTypeList = result.dataList.filter((item: any) => {
        if (this.ui_id == "purchase-addon-plan") {
          this.planList = [];
          this.activatetionDate = false;
          this.addonStart = true;
          return item.value == "Volume Booster";
        } else if (this.showCurrentPlanDetails === false && this.ui_id === "change-plan") {
          if (item.value === "New") {
            return item.value == "New";
          }
        } else if (this.showCurrentPlanDetails !== false && this.ui_id === "change-plan") {
          if (item.value !== "New" && item.value !== "Volume Booster") {
            return item;
          }
        } else {
          this.activatetionDate = true;
          return item;
        }
      });

      this.showAdvRenewal = false;
      // if(this.showCurrentPlanDetails===false){
      //   this.planPurchaseTypeList = result.dataList.filter((item: any) => {
      //     if (item.value==='New') {
      //       return item.value == 'New';
      //     }
      //   });
      // }
      // else{
      //   this.planPurchaseTypeList = result.dataList.filter((item: any) => {
      //     if (item.value!=='New') {
      //       return item;
      //     }
      //   });
      // }

      // if (this.showCurrentPlanDetails === true) {
      //   this.planPurchaseTypeList = result.dataList;
      // } else {
      //   this.planPurchaseTypeList = result.dataList.filter((item: any) => {
      //     alert("condion");
      //     if (this.ui_id == 'purchase-addon-plan') {

      //       this.planList = [];
      //       this.activatetionDate = false;
      //       this.addonStart = true;
      //       return item.value == 'Volume Booster';
      //     } else if (this.ui_id == 'change-plan') {
      //       this.activatetionDate = true;
      //       return item;
      //     }
      //   });
      //   this.showAdvRenewal = false;
      // }
    });
  }

  onChangeAdvRenewal(advRenewalItem) {
    if (advRenewalItem) {
      if (this.selectedPlan) {
        if (advRenewalItem.value === true) {
          this.advanceRenewFlag = true;

          // this.displayActivateDate = this.selectedPlan.activationDate;
          // this.displayExpiryDate = this.selectedPlan.expiryDate;

          this.displayActivateDate = this.selectedPlan.renewalActivationDate;
          this.displayExpiryDate = this.selectedPlan.renewalExpiryDate;

          this.refundShow = false;
        } else if (advRenewalItem.value === false) {
          this.advanceRenewFlag = false;
          this.refundShow = true;
          // this.displayActivateDate = this.selectedPlan.renewalActivationDate;
          // this.displayExpiryDate = this.selectedPlan.renewalExpiryDate;

          this.displayActivateDate = this.selectedPlan.activationDate;
          this.displayExpiryDate = this.selectedPlan.expiryDate;
        }
      }
    } else {
      // if(this.changePlanForm.value.skip === null || this.changePlanForm.value.skip === false ){
      //   console.log(this.selectedPlan)
      //   this.finalPayableAmount = this.planPrice ;
      // }
      this.displayActivateDate = "";
      this.displayExpiryDate = "";
    }
  }
  onSkipCheck() {
    if (this.changePlanForm.value.skip === true) {
      // this.finalPayableAmount= this.planPrice;
      // console.log("skip",this.finalPayableAmount)
    } else {
      // this.finalPayableAmount= this.planPrice - this.subscriberCurrentPlanData.currentPlanDTO.refundableAmount ;
      // console.log("skip else",this.finalPayableAmount)
    }
  }
  onChangePlan(planItem) {
    this.selectedPlan = planItem;
    this.planPrice = this.selectedPlan.price;
    if (this.ui_id === "purchase-addon-plan") {
      this.purchaseaddonprice = this.selectedPlan.offerprice;
    }

    if (planItem) {
      let advRenewal = this.changePlanForm.get("advRenewal").value;
      let purchaseType = this.changePlanForm.get("planPurchaseType").value;
      let data: any = {
        // "chargeId": 0,
        // "locationId": this.presentAddressStateChange.state_id,
        custId: this.custId,
        planId: this.selectedPlan.planId
      };
      this.taxDetailsByPlanData = planItem.taxAmount;
      if (planItem.taxAmount === null) {
        this.taxDetailsByPlanData = 0;
      }
      // this.planService.getTaxDetailsByPlan(data).subscribe((result) => {
      //   this.taxDetailsByPlanData = result.TotalAmount;

      // });
      // if (this.taxDetailsByPlanData && this.taxDetailsByPlanData) {
      //   this.planPrice = this.planPrice + this.taxDetailsByPlanData
      // }

      if (
        purchaseType === "New" ||
        purchaseType === "Upgrade" ||
        purchaseType === "Volume Booster"
      ) {
        this.onChangeAdvRenewal({ value: false });
        if (this.ui_id === "purchase-addon-plan") {
          this.selectedPlan.offerprice = this.selectedPlan.offerprice + this.selectedPlan.taxamount;
        }
      } else {
        if (advRenewal === true || advRenewal === false) {
          this.onChangeAdvRenewal({ value: advRenewal });
        } else {
          this.onChangeAdvRenewal("");
        }
      }
    } else {
      this.onChangeAdvRenewal("");
    }
  }
  // getByPlanAmmount() {
  //   let planId = this.changePlanForm.get("planId").value;
  //   let apiPayload: any = {
  //     "custId": this.custId, "planId": planId,
  //   }
  //   this.changePlanService.getAmountService(apiPayload).subscribe(res => {
  //     this.setPriceWithFinalPayBill(res.TotalAmount);
  //   });
  // }
  // setPriceWithFinalPayBill(txtAmount) {
  //   let planId = this.changePlanForm.get("planId").value;
  //   this.planList.forEach(item => {
  //     if (item.planId == planId) {
  //       let textAmount = +txtAmount.toFixed(2);
  //       this.selectedPlan.price = textAmount + item.offerprice;
  //     }
  //   });
  // }
  onChangePurchaseType(purchaseTypeItem) {
    if (purchaseTypeItem) {
      this.purchaseType = purchaseTypeItem.value;
      if (purchaseTypeItem.value === "Renew") {
        this.changePlanForm.get("advRenewal").setValidators([Validators.required]);
      }
      if (purchaseTypeItem.value !== "Renew") {
        this.changePlanForm.get("advRenewal").clearValidators();
        this.changePlanForm.get("advRenewal").updateValueAndValidity();

        this.showAdvRenewal = false;
        this.onChangeAdvRenewal({ value: false });
        if (purchaseTypeItem.value == "Volume Booster" && this.ui_id == "purchase-addon-plan") {
          this.getPurchaseAddonePlan();
        }
      } else {
        this.showAdvRenewal = true;
        this.onChangeAdvRenewal({ text: "Yes", value: true });
      }
    } else {
      this.onChangeAdvRenewal({ text: "No", value: false });
      this.showAdvRenewal = false;
    }
  }

  getPurchaseAddonePlan() {
    let serviceType: number = 1;
    let purchaseAddonPlan: any = {
      partnerId: this.partnerId,
      planGroup: "Volume Booster",
      serviceType: serviceType
    };
    this.changePlanService.getPurchaseAddonePlanService(purchaseAddonPlan).subscribe(result => {
      this.planList = [];
      result.dataList.forEach(item => {
        let itemData: any = {};
        itemData.planName = item.displayName;
        itemData.planId = item.id;
        itemData.dataQuota = item.quota;
        itemData.validity = item.validity;
        itemData.timeQuota = item.quotatime;
        itemData.quotaType = item.quotatype;
        itemData.offerprice = item.offerprice;
        itemData.quotaUnit = item.quotaUnit;
        itemData.quotaunittime = item.quotaunittime;
        itemData.endDate = item.endDate;
        itemData.minPrice = item.minPrice;
        itemData.maxPrice = item.maxPrice;
        itemData.taxamount = item.taxamount;
        itemData.taxId = item.taxId;
        this.planList.push(itemData);
      });
    });
  }

  get f() {
    return this.changePlanForm.controls;
  }

  onAddonSelect(event) {
    this.purchaseEndDate = new Date(event.value);
    this.addonStartDate = new Date(event.value);
    this.purchaseEndDate.setDate(this.purchaseEndDate.getDate() + this.selectedPlan.validity);
    this.endDate = this.datePipe.transform(this.purchaseEndDate, "dd-MM-yyyy");
  }

  onClickUpdatePaymentForm() {
    if (
      (this.changePlanForm.get("recordPaymentDTO").valid === false &&
        this.ui_id !== "purchase-addon-plan") ||
      (this.changePlanForm.get("recordPaymentDTO").valid === false &&
        this.ui_id === "purchase-addon-plan")
    ) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Fill All payment Details",
        icon: "far fa-times-circle"
      });
    }
    if (this.isOverhead === true) {
      this.changePlanForm.get("sellPrice").setValidators(Validators.required);
      this.changePlanForm.get("sellPrice").updateValueAndValidity();
      if (this.changePlanForm.get("sellPrice").valid === false) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please Enter Override Price!",
          icon: "far fa-times-circle"
        });
      }
    } else {
      this.changePlanForm.get("sellPrice").clearValidators;
      this.changePlanForm.get("sellPrice").updateValueAndValidity();
    }

    if (this.changePlanForm.valid === true) {
      let formAllValue = Object.assign({}, this.changePlanForm.value);
      if (formAllValue.isPaymentReceived && formAllValue.isPaymentReceived == true) {
        if (
          formAllValue.recordPaymentDTO.payment_mode !== "tds" &&
          formAllValue.recordPaymentDTO.tdsDeducted === true
        ) {
          if (formAllValue.recordPaymentDTO.tdsAmount.length === 0) {
            this.tdsAmountValid = false;
            this.submitted = true;
            this.changePlanForm.markAllAsTouched();
            return false;
          } else {
            this.tdsAmountValid = true;
          }
        }

        if (formAllValue.recordPaymentDTO.amount.length === 0) {
          this.amountValid = false;
        } else {
          this.amountValid = true;
        }

        if (formAllValue.recordPaymentDTO.payment_date.length === 0) {
          this.paymentDateValid = false;
        } else {
          this.paymentDateValid = true;
        }

        if (formAllValue.recordPaymentDTO.remarks.length === 0) {
          this.remarksValid = false;
        } else {
          this.remarksValid = true;
        }

        if (formAllValue.recordPaymentDTO.referenceNo.length === 0) {
          this.referenceNoValid = false;
        } else {
          this.referenceNoValid = true;
        }

        let payment_mode_id = formAllValue.recordPaymentDTO.payment_mode;

        if (_.isEmpty(payment_mode_id) === false) {
          this.paymentModeValid = true;
          let selected_payment_mode = _.find(this.paymentModeList, { value: payment_mode_id });
          let payment_mode = selected_payment_mode.value;
          if (payment_mode === "cheque") {
            if (formAllValue.recordPaymentDTO.chequeNo.length === 0) {
              this.chequeNoValid = false;
            } else {
              this.chequeNoValid = true;
            }
            if (formAllValue.recordPaymentDTO.bankName.length === 0) {
              this.bankNameValid = false;
            } else {
              this.bankNameValid = true;
            }
            if (formAllValue.recordPaymentDTO.chequeDate.length === 0) {
              this.chequeDateValid = false;
            } else {
              this.chequeDateValid = true;
            }
            if (formAllValue.recordPaymentDTO.branch.length === 0) {
              this.branchValid = false;
            } else {
              this.branchValid = true;
            }
            if (
              formAllValue.recordPaymentDTO.chequeNo.length === 0 ||
              formAllValue.recordPaymentDTO.bankName.length === 0 ||
              formAllValue.recordPaymentDTO.chequeDate.length === 0 ||
              formAllValue.recordPaymentDTO.branch.length === 0 ||
              formAllValue.recordPaymentDTO.remarks.length === 0
            ) {
              this.submitted = true;
              this.changePlanForm.markAllAsTouched();
              return false;
            } else {
              this.askQuestion();
            }
          } else {
            if (
              formAllValue.recordPaymentDTO.remarks.length === 0 ||
              formAllValue.recordPaymentDTO.amount.length === 0 ||
              formAllValue.recordPaymentDTO.payment_date.length === 0
            ) {
              this.submitted = true;
              this.changePlanForm.markAllAsTouched();
              return false;
            } else {
              this.askQuestion();
            }
          }
        } else {
          this.paymentModeValid = false;
          this.changePlanForm.markAllAsTouched();
          return false;
        }
      } else {
        this.askQuestion();
      }
    } else {
      let addonStartDate = this.changePlanForm.get("addonStartDate").value;
      if (this.ui_id != "purchase-addon-plan") {
        this.changePlanForm.get("addonStartDate").clearValidators();
        this.changePlanForm.get("addonStartDate").updateValueAndValidity();
        //this.onClickUpdatePaymentForm();
        this.submitted = true;
        this.changePlanForm.markAllAsTouched();
      } else {
        this.submitted = true;
        this.changePlanForm.markAllAsTouched();
      }
    }
  }

  insertChangePlanOnDb() {
    let apiInputData = Object.assign({}, this.changePlanForm.value);
    if (apiInputData.skip == true) {
      apiInputData.skip = false;
    } else {
      apiInputData.skip = true;
    }

    let recordPaymentDTO: any = null;
    let advRenewal = apiInputData.advRenewal;
    if (
      advRenewal == null &&
      (this.purchaseType === "Upgrade" ||
        this.purchaseType === "Volume Booster" ||
        this.purchaseType === "New")
    ) {
      advRenewal = false;
    }
    let formatedData: any = {};
    if (this.ui_id != "purchase-addon-plan") {
      formatedData = {
        custId: this.custId,
        isRefund: apiInputData.skip,
        isAdvRenewal: advRenewal,
        planId: apiInputData.planId,
        purchaseType: apiInputData.planPurchaseType,
        remarks: apiInputData.remarks,
        sellPrice: apiInputData.sellPrice,
        isIncludeTax: apiInputData.isIncludeTax,
        isPriceOverride: apiInputData.isPriceOverride
      };
    } else {
      apiInputData.addonStartDate = this.datePipe.transform(this.addonStartDate, "yyyy-MM-dd");
      formatedData = {
        custId: this.custId,
        isRefund: apiInputData.skip,
        isAdvRenewal: advRenewal,
        planId: apiInputData.planId,
        purchaseType: apiInputData.planPurchaseType,
        remarks: apiInputData.remarks,
        addonStartDate: apiInputData.addonStartDate,
        isPaymentReceived: apiInputData.isPaymentReceived,
        sellPrice: apiInputData.sellPrice,
        isIncludeTax: apiInputData.isIncludeTax,
        isPriceOverride: apiInputData.isPriceOverride
      };
    }
    if (apiInputData.advRenewal === "") {
      formatedData.advRenewal = false;
    }
    if (apiInputData.isPaymentReceived && apiInputData.isPaymentReceived == "yes") {
      formatedData.isPaymentReceived = true;

      recordPaymentDTO = {};
      recordPaymentDTO.custId = this.custId;
      recordPaymentDTO.paymentAmount = apiInputData.recordPaymentDTO.amount;
      recordPaymentDTO.paymentDate = this.datePipe.transform(
        apiInputData.recordPaymentDTO.payment_date,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
      recordPaymentDTO.referenceNo = apiInputData.recordPaymentDTO.referenceNo;
      recordPaymentDTO.paymentMode = apiInputData.recordPaymentDTO.payment_mode;

      let selectedPaymentModeData = _.find(this.paymentModeList, {
        value: apiInputData.recordPaymentDTO.payment_mode
      });
      //if paymentMode  cheque
      if (selectedPaymentModeData.value === "cheque") {
        recordPaymentDTO.bankName = apiInputData.recordPaymentDTO.bankName;
        recordPaymentDTO.branch = apiInputData.recordPaymentDTO.branch;
        recordPaymentDTO.chequeDate = apiInputData.recordPaymentDTO.chequeDate;
        recordPaymentDTO.chequeNo = apiInputData.recordPaymentDTO.chequeNo;
      }

      // if paymentMode  TDS
      if (selectedPaymentModeData.value === "TDS") {
        recordPaymentDTO.credit_doc_id = apiInputData.recordPaymentDTO.credit_doc_id;
      }

      recordPaymentDTO.isTdsDeducted = apiInputData.recordPaymentDTO.tdsDeducted;
      // if isTdsDeducted true
      if (recordPaymentDTO.isTdsDeducted === true) {
        recordPaymentDTO.tdsAmount = apiInputData.recordPaymentDTO.tdsAmount;
      }
      recordPaymentDTO.remarks = apiInputData.recordPaymentDTO.remarks;
    } else {
      formatedData.isPaymentReceived = false;
    }
    formatedData.recordPaymentDTO = recordPaymentDTO;
    this.loadingService.show();
    this.changePlanService.changePlan(formatedData).subscribe(
      result => {
        this.loadingService.hide();
        if (result.responseCode !== 200 && result.responseMessage) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: result.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.ui_id == "purchase-addon-plan") {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: result.responseMessage,
              icon: "far fa-check-circle"
            });
            this.changePlanForm.reset();
            this.checkeligiblity = null;
            this.selectedPlan = null;
            this.endDate = null;
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Change Plan Save Successfully.",
              icon: "far fa-check-circle"
            });
            this.changePlanForm.reset();
          }
        }
      },
      err => {
        this.loadingService.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: err.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  checkIncludingTax(event: any) {
    if (event === "true") {
      this.changePlanForm.get("isIncludeTax").setValue(true);
      this.isIncludingTax = true;
      this.changePlanForm.get("sellPrice").setValue(null);
      // this.insertPackagesForm.get('taxId').setValidators([Validators.required]);
    } else {
      this.changePlanForm.get("isIncludeTax").setValue(false);
      this.isIncludingTax = false;
      // this.insertPackagesForm.get('taxId').clearValidators();
      // this.insertPackagesForm.get('taxId').updateValueAndValidity();
    }
  }
  checkOverHead(event: any) {
    if (event === "true") {
      this.changePlanForm.get("isPriceOverride").setValue(true);
      this.isOverhead = true;
    } else {
      this.changePlanForm.get("isPriceOverride").setValue(false);
      this.isOverhead = false;
      this.taxDetailsByPlanData = this.selectedPlan.taxAmount;
      this.planPrice = this.selectedPlan.price;
    }
  }
  onOverridePrice(amount) {
    let event = Number(amount);
    if (this.isOverhead === true) {
      this.taxDetailsByPlanData = 0;
      if (
        (this.selectedPlan.minPrice !== null && this.selectedPlan.maxPrice !== null) ||
        (this.selectedPlan.minPrice === null && this.selectedPlan.maxPrice !== null) ||
        (this.selectedPlan.minPrice !== null && this.selectedPlan.maxPrice === null)
      ) {
        if (this.selectedPlan.minPrice !== null && this.selectedPlan.maxPrice !== null) {
          if (event < this.selectedPlan.minPrice && event > this.selectedPlan.maxPrice) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail:
                "Override price Sholud be between " +
                this.selectedPlan.minPrice +
                " - " +
                this.selectedPlan.maxPrice.ERROR,
              icon: "far fa-times-circle"
            });
            return;
          }
        }
        if (this.selectedPlan.minPrice === null && this.selectedPlan.maxPrice !== null) {
          if (event > this.selectedPlan.maxPrice) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Override price Sholud be less than " + this.selectedPlan.maxPrice,
              icon: "far fa-times-circle"
            });
            return;
          }
        }
        if (this.selectedPlan.minPrice !== null && this.selectedPlan.maxPrice === null) {
          if (event < this.selectedPlan.minPrice) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Override price Sholud be greater than " + this.selectedPlan.minPrice,
              icon: "far fa-times-circle"
            });
            return;
          }
        }
      } else {
        if (this.isIncludingTax === false) {
          if (this.ui_id === "purchase-addon-plan") {
            let obj = {
              amount: Number(event),
              taxId: this.selectedPlan.taxId
            };
            this.changePlanService.getTaxByAmount(obj).subscribe(res => {
              event = Number(event) + res.TaxAmount;
              this.purchaseaddonprice = Number(event);
            });
          }
          if (this.ui_id === "change-plan") {
            let obj = {
              amount: Number(event),
              taxId: this.selectedPlan.planTaxId
            };
            this.changePlanService.getTaxByAmount(obj).subscribe(res => {
              event = Number(event) + res.TaxAmount;
              this.planPrice = Number(event);
            });
          }
        } else {
          if (this.ui_id === "change-plan") {
            this.planPrice = Number(event);
          }
          if (this.ui_id === "purchase-addon-plan") {
            this.purchaseaddonprice = Number(event);
          }
        }
      }
    }
  }

  askQuestion() {
    let self = this;
    this.submitted = false;
    let title: string;
    if (this.ui_id == "purchase-addon-plan") {
      title = "Purchase add on plan";
    } else {
      title = "Change Plan";
    }

    this.confirmationService.confirm({
      message: "Are You Sure You want to " + title + " ?",
      header: title,
      icon: "pi pi-info-circle",
      accept: () => {
        self.insertChangePlanOnDb();
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

  keypress(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
