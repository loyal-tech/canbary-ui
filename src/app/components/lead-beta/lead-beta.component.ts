import { DatePipe, formatDate } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService, Spinner } from "ngx-spinner";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { LoginService } from "src/app/service/login.service";
import { StaffService } from "src/app/service/staff.service";
import { FieldmappingService } from "src/app/service/fieldmapping.service";
import { countries } from "src/app/components/model/country";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";

declare var $: any;

@Component({
  selector: "app-lead-beta",
  templateUrl: "./lead-beta.component.html",
  styleUrls: ["./lead-beta.component.css"]
})
export class LeadBetaComponent implements OnInit {
  countries: any = countries;
  basicLeadArr: any = [];
  fieldsArr: any = [];
  planArr: any = [];
  customerGroupForm!: FormGroup;

  cities: any = [];
  // exampleGroupForm!: FormGroup;
  showDependantDropdown: boolean = false;
  dependantOptionList: any = [];
  allFieldsArr: any = [];
  form: any = {};
  optionList: any = [];
  multiOptionList: any = [];
  customerSave: any = [];
  childOptionList: any = [];
  submitted: boolean = false;
  filteredArray: any = [];
  presentAddressArr: any[] = [];
  testAddressArr: any[] = [];
  permanentAddressArr: any = [];
  paymentAddressArr: any = [];
  addressList: FormArray[] = [];
  planDataForm: FormGroup;
  planGroupForm: FormGroup;
  ifPlanGroup = false;
  payMappingListFromArray: FormArray;
  plansubmitted = false;
  validityUnitFormArray: FormArray;
  validityUnitFormGroup: FormGroup;
  planDropdownInChageData: any = [];
  ifcustomerDiscountField: boolean = false;
  ifplanisSubisuSelect = false;
  planGroupSelectedSubisu: any;
  customerChangePlan = false;
  planListSubisu: any;
  plansArray: FormArray;
  iscustomerEdit: boolean = false;
  planCategoryForm: FormGroup;
  ifIndividualPlan: boolean = false;
  serviceAreaDATA: any;
  serviceAreaData: any;
  filterNormalPlanGroup = [];
  serviceareaCheck = true;
  // totalAddress = 0;
  // customerID: any;
  // editCustomerId: any;
  // listView = true;
  // createView = false;
  // custCurrentPlanList: any;
  // custFuturePlanList: any;
  // CurrentPlanShowItemPerPage = 1;
  // futurePlanShowItemPerPage = 1;
  // currentPagecustomerCurrentPlanListdata = 1;
  // pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  // customerLedgerDetailData: any
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  invoiceType = [
    { label: "Group", value: "Group" },
    { label: "Independent", value: "Independent" }
  ];
  filterPlanData: any;
  planByServiceArea: any;
  pincodeDD: any = [];
  staffUserId: any;
  staffUser: any;
  userName: "";
  isAdmin = false;
  isInvoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];
  serviceData: any;
  plantypaSelectData: any;
  isPlanDetails: boolean = false;
  presentGroupForm: FormGroup;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  AreaListDD: any;
  areaDetails: any;
  paymentareaDetails: any;
  leadNumber: any;
  planGroupMapingList: any = [];

  searchExtingcustomerOption = [
    { label: "User Name", value: "username" },
    { label: "Email", value: "email" },
    { label: "PAN", value: "pan" },
    { label: "Mobile Number", value: "mobile" }
  ];
  ifReadonlyExtingInput = false;
  currentPageextingCustomerListdata = 1;
  extingCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  extingCustomerListdatatotalRecords: any;
  selectedextingCust: any = [];
  selectedextingCustId: any;
  extingCustList: any;
  newFirstexting = 0;
  searchextingCustType = "Prepaid";
  searchextingCustOption = "";
  searchextingCustValue = "";
  extingFieldEnable = false;
  ifextingSaveBtn = false;
  extingCustomerList: any = [];

  redirectCustomerId: any;
  ifcutomerToLeadRedirectService: boolean = false;
  selectextingCustomer : boolean = false;

  constructor(
    private tempservice: FieldmappingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private custService: FieldmappingService,
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public commondropdownService: CommondropdownService,
    private staffService: StaffService,
    private recordPaymentService: RecordPaymentService
  ) {}
  ngAfterViewInit(): void {}

  async ngOnInit() {
    this.planCreationType();

    this.planDataForm = this.fb.group({
      offerPrice: [""],
      discountPrice: [0]
    });

    this.planGroupForm = this.fb.group({
      planId: ["", Validators.required],
      service: ["", Validators.required],
      validity: ["", Validators.required],
      offerprice: [""],
      newAmount: [""],
      discount: ["", [Validators.max(99)]],
      istrialplan: [""],
      invoiceType: [null]
    });

    this.presentGroupForm = this.fb.group({
      addressType: ["Present"],
      landmark: [""],
      areaId: [""],
      pincodeId: [""],
      cityId: [""],
      stateId: [""],
      countryId: [""],
      landmark1: [""]
    });

    this.validityUnitFormArray = this.fb.array([]);

    this.validityUnitFormGroup = this.fb.group({
      validityUnit: [""]
    });

    this.planCategoryForm = this.fb.group({
      planCategory: [""]
    });

    this.getLoggedinUserData();
    this.commondropdownService.getsystemconfigList();
    this.commondropdownService.getBillToData();
    this.commondropdownService.findAllplanGroups();
    // this.commondropdownService.getAllPinCodeNumber();
    this.commondropdownService.getAllPinCodeData();
    this.commondropdownService.getCityList();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getplanservice();
    this.commondropdownService.getPostpaidplanData();
  }

  // Submit() {
  //   console.log(this.exampleGroupForm.value);
  // }

  optionSelected(ev: any, field: string) {
    if (field === "serviceareaid" || field === "servicearea") {
      this.getPlanbyServiceArea(ev.value);
      this.selServiceArea(ev.value);
    }
    this.fieldsArr.forEach((el1: any) => {
      el1.fields.forEach((el2: any) => {
        if (el2.isdependant == true && el2.dependantfieldName == field) {
          this.tempservice.getMethod2(el2.endpoint + ev.value).subscribe((res: any) => {
            if (this.dependantOptionList != null) {
              const foundIndex = this.dependantOptionList.findIndex(
                ({ fieldname }) => fieldname == el2.fieldname
              );
              if (foundIndex != -1) {
                this.dependantOptionList.splice(foundIndex, 1);
              }
              this.dependantOptionList.push({
                fieldname: el2.fieldname,
                options: res
              });
            } else {
              this.dependantOptionList.push({
                fieldname: el2.fieldname,
                options: res
              });
            }
          });
        }
      });
    });

    if (field == "leadCategory") {
      if (ev.value == "Existing Customer") {
        this.modalOpenextingCustomer();
        this.planGroupForm.patchValue({
          quantity: 1
        });
      } else {
        this.customerGroupForm.reset();
        this.customerGroupForm.patchValue({
          countryCode: this.commondropdownService.commonCountryCode,
          leadNo: this.leadNumber,
          billTo: "CUSTOMER",
          isInvoiceToOrg: false,
          isCustCaf: "yes",
          durationUnits: "Days",
          failcount: 0,
          leadCategory: "New Lead"
        });
      }
    }
  }

  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.serviceareaCheck = false;
      this.filterPlanData = [];
      const custType = "Prepaid";
      const url =
        "/plans/serviceArea?planmode=ALL&serviceAreaId=" +
        serviceAreaId +
        "&mvnoId=" +
        localStorage.getItem("mvnoId");
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.postpaidplanList;
          this.filterPlanData = this.planByServiceArea.filter(plan => plan.plantype == custType);
          //  console.log("this.filterPlanData", this.filterPlanData);
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

  selectPINCODEChange(_event: any, index: any) {
    const url = "/area/pincode?pincodeId=" + _event.value;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.AreaListDD = response.areaList;
      },
      (error: any) => {}
    );
    // this.getpincodeData(_event.value, index);
  }

  selectAreaChange(_event: any, index: any) {
    this.getAreaData(_event.value, index);
  }
  selectPincodeList = false;
  selectPincodeListPayment = false;

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
  selServiceArea(id) {
    this.pincodeDD = [];
    const serviceAreaId = id;
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
            // this.pincodeDD.push(this.commondropdownService.allpincodeNumber.filter((e)=>e.pincodeid==element))
          });
        },
        (error: any) => {}
      );
      this.getServiceByServiceAreaID(serviceAreaId);
    }
  }

  getServiceByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url =
      "/serviceArea/getAllServicesByServiceAreaId" +
      "?mvnoId=" +
      Number(localStorage.getItem("mvnoId"));
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceData = response.dataList;
    });
  }

  serviceBasePlanDATA(event) {
    let planserviceData;
    let planServiceID = "";
    this.plantypaSelectData = [];
    const servicename = event.value;
    const planserviceurl = "/planservice/all" + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
      //
      planserviceData = response.serviceList.filter(service => service.name === servicename);
      if (planserviceData.length > 0) {
        planServiceID = planserviceData[0].id;

        // if (this.customerGroupForm.value.custtype) {
        this.plantypaSelectData = this.filterPlanData.filter(
          id =>
            id.serviceId === planServiceID &&
            (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
        );

        //console.log("this.plantypaSelectData", this.plantypaSelectData);
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

  getList() {
    this.fieldsArr.forEach((el1: any) => {
      el1.fields.forEach((el2: any) => {
        this.allFieldsArr.push(el2);
        if (el2.fieldType == "select" && !el2.isdependant) {
          this.custService.getMethod2(el2.endpoint).subscribe((res: any) => {
            // console.log("response",res)

            this.optionList.push({
              moduleName: el1.moduleName,
              fieldname: el2.fieldname,
              options: res
            });
          });
        } else if (el2.fieldType == "multi-select" && !el2.isdependant) {
          this.custService.getMethod2(el2.endpoint).subscribe((res: any) => {
            this.multiOptionList.push({
              moduleName: el1.moduleName,
              fieldname: el2.fieldname,
              options: res
            });
          });
        } else if (el2.fieldType == "object") {
          el2.child.forEach((el3: any) => {
            if (el3.fieldType == "select") {
              this.custService.getMethod2(el3.endpoint).subscribe((res: any) => {
                this.childOptionList.push({
                  moduleName: el1.moduleName,
                  parentfieldname: el2.fieldname,
                  fieldname: el3.fieldname,
                  options: res
                });
              });
            }
          });
        } else if (el2.fieldType == "objectList") {
          el2.child.forEach((el3: any) => {
            if (el3.fieldType == "select") {
              this.custService.getMethod2(el3.endpoint).subscribe((res: any) => {
                this.childOptionList.push({
                  moduleName: el1.moduleName,
                  parentfieldname: el2.fieldname,
                  fieldname: el3.fieldname,
                  options: res
                });
              });
            }
          });
        }
      });
    });
    //
  }

  getOptions(module, field) {
    this.optionList.forEach((el: any) => {
      if (el.moduleName == module && el.fieldname == field) {
        this.allFieldsArr.filter(val => {
          if (val.fieldname == field) {
            return this.custService.getMethod2(val.endpoint).subscribe(res => {
              el.options = res;
            });
          }
        });
      }
    });
  }

  isPlanOnDemand: boolean = false;
  planCreationType() {
    const planBindingType = localStorage.getItem("planBindingType");
    if (planBindingType === "On-Demand") {
      this.isPlanOnDemand = true;
    } else if (planBindingType === "Predefined" || !planBindingType) {
      this.isPlanOnDemand = false;
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Staff with multiple BU cannot create Customer.",
        icon: "far fa-check-circle"
      });
      return;
    }
    this.getFields();
    this.getLeadNumber();
  }

  createleadData: any = [];
  saveLead() {
    this.submitted = true;

    this.customerGroupForm.value["presentAddress"].addressType = "Present";
    this.customerGroupForm.value["permanentAddress"].addressType = "Permanent";
    this.customerGroupForm.value["paymentAddress"].addressType = "Payment";
    //  if(this.customerGroupForm.valid){
    this.customerGroupForm.value["department"] = this.customerGroupForm.value["department"];
    this.customerGroupForm.value["addressList"] = [
      this.customerGroupForm.value["presentAddress"],
      this.customerGroupForm.value["permanentAddress"],
      this.customerGroupForm.value["paymentAddress"]
    ];
    // console.log(this.customerGroupForm.value);
    this.customerGroupForm.value.partnerid = this.customerGroupForm.value.partnerid
      ? this.customerGroupForm.value.partnerid
      : 1;
    delete this.customerGroupForm.value.presentAddress;
    delete this.customerGroupForm.value.permanentAddress;
    delete this.customerGroupForm.value.paymentAddress;
    this.customerGroupForm.value.mvnoId = localStorage.getItem("mvnoId");
    if (this.customerGroupForm.valid) {
      const url = "/leadMaster/save";
      this.custService.postLeadMethod(url, this.customerGroupForm.value).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Customer Created Successfully",
              icon: "far fa-check-circle"
            });
            this.submitted = false;
            this.filteredArray = [];
            this.customerGroupForm.reset();
            this.filteredArray = [];
            this.testAddressArr = [];
            this.fieldsArr = [];
            this.getFields();
            this.getLeadNumber();
          } else if (res.status == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Customer Creation Failed",
              icon: "far fa-check-circle"
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Customer Creation Failed",
            icon: "far fa-times-circle"
          });
        }
      );
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill all the required fields.",
        icon: "far fa-check-circle"
      });
    }
    //  }
  }

  getLeadNumber() {
    this.tempservice
      .getleadMethod("/leadMaster/generateLeadNo?mvnoId=" + localStorage.getItem("mvnoId"))
      .subscribe((reslead: any) => {
        this.leadNumber = reslead.leadNo;
      });
  }
  isShowTemplate: boolean;
  getFields() {
    this.filteredArray = [];
    this.testAddressArr = [];
    this.fieldsArr = [];
    const presentForm1 = {};
    const permanentForm = {};
    const paymentForm = {};
    this.optionList = [];
    this.dependantOptionList = [];
    this.multiOptionList = [];
    this.tempservice
      .getleadMethod("/fieldMapping/getModuleWiseTemplate?screen=lead")
      // .getMethod3("dataList")
      .subscribe((res: any) => {
        if (res.responseCode == 200 && res.dataList?.length != 0) {
          this.isShowTemplate = true;
          this.filteredArray = res.dataList.filter((val: any) => {
            return (
              val.moduleName !== "Payment Address Details" &&
              val.moduleName !== "Present Address Details" &&
              val.moduleName !== "Permanent Address Details" &&
              val.moduleName !== "Plan Details" &&
              val.moduleName !== "Charge Details" &&
              val.moduleName !== "Mac Mapping details"
            );
          });

          this.presentAddressArr = res.dataList.filter((val: any) => {
            return val.moduleName == "Present Address Details";
          });
          this.permanentAddressArr = res.dataList.filter((val: any) => {
            return val.moduleName == "Permanent Address Details";
          });
          this.paymentAddressArr = res.dataList.filter((val: any) => {
            return val.moduleName == "Payment Address Details";
          });

          this.testAddressArr.push(this.presentAddressArr);
          this.testAddressArr.push(this.permanentAddressArr);
          this.testAddressArr.push(this.paymentAddressArr);
          this.fieldsArr = res.dataList;
          this.fieldsArr.forEach((module: any) => {
            if (module.moduleName == "Plan Details" && module.fields.length != 0) {
              this.isPlanDetails = true;
            }
          });

          // this.createList();
          this.getList();

          if (this.filteredArray.length >= 1) {
            this.filteredArray.forEach((el1: any) => {
              el1.fields.forEach((el2: any) => {
                if (el2.fieldType != "object") {
                  if (el2.isMandatory == true) {
                    this.form[el2.fieldname] = new FormControl("", [Validators.required]);
                  } else this.form[el2.fieldname] = new FormControl("");
                } else if (el2.fieldType == "object") {
                  const childForm = {};
                  el2.child.forEach((el3: any) => {
                    if (el2.isMandatory == true) {
                      childForm[el3.fieldname] = new FormControl("", [Validators.required]);
                    } else childForm[el3.fieldname] = new FormControl("");
                  });
                  this.form[el2.fieldname] = childForm;
                }
              });
            });
          }

          this.presentAddressArr[0].fields[0].child.forEach((val: any) => {
            if (val.isMandatory == true) {
              presentForm1[val.fieldname] = new FormControl("", [Validators.required]);
            } else presentForm1[val.fieldname] = new FormControl("");
          });
          this.permanentAddressArr[0].fields[0].child.forEach((val: any) => {
            if (val.isMandatory == true) {
              permanentForm[val.fieldname] = new FormControl("", [Validators.required]);
            } else permanentForm[val.fieldname] = new FormControl("");
          });
          this.paymentAddressArr[0].fields[0].child.forEach((val: any) => {
            if (val.isMandatory == true) {
              paymentForm[val.fieldname] = new FormControl("", [Validators.required]);
            } else paymentForm[val.fieldname] = new FormControl("");
          });
          // this.form["presentAddress"] = this.fb.group(presentForm1)
          this.form["presentAddress"] = this.presentGroupForm;
          this.form["permanentAddress"] = this.fb.group(permanentForm);
          this.form["paymentAddress"] = this.fb.group(paymentForm);
          if (!this.isPlanOnDemand) {
            this.form["billTo"] = this.fb.control("CUSTOMER");
            this.form["billTo"] = this.fb.control("CUSTOMER");
            this.form["billTo"] = this.fb.control("CUSTOMER");
            this.form["invoiceType"] = this.fb.control(null);
            this.form["plangroupid"] = this.fb.control("");
            this.form["discount"] = this.fb.control("", Validators.max(99));
            this.form["isInvoiceToOrg"] = this.fb.control(false);
            this.form["istrialplan"] = this.fb.control(false);
            this.form["planMappingList"] = this.payMappingListFromArray = this.fb.array([]);
          }
          this.customerGroupForm = this.fb.group(this.form);
          // this.customerGroupForm
          //   .get("countryCode")
          //   .setValue(this.commondropdownService.commonCountryCode);
          // this.customerGroupForm.get("leadNo").setValue(leadNumber);
          this.customerGroupForm.patchValue({
            countryCode: this.commondropdownService.commonCountryCode,
            leadNo: this.leadNumber,
            billTo: "CUSTOMER",
            isInvoiceToOrg: false,
            isCustCaf: "yes",
            durationUnits: "Days",
            failcount: 0,
            leadCategory: "New Lead"
          });
        } else {
          this.isShowTemplate = false;

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
          });
        }
      });
  }

  billtoSelectValue(e) {
    this.payMappingListFromArray.controls = [];
    this.planGroupForm.reset();
    this.customerGroupForm.patchValue({
      plangroupid: ""
    });
  }

  planSelectType(event) {
    this.planDropdownInChageData = [];
    this.DiscountValueStore = [];
    this.discountValue = 0;
    this.planTotalOffetPrice = 0;
    const planaddDetailType = event.value;
    this.DiscountValueStore = [];
    this.ifplanisSubisuSelect = false;
    this.planDataForm.reset();
    this.customerGroupForm.controls.discount.reset();
    if (planaddDetailType == "individual") {
      this.ifIndividualPlan = true;
      this.ifPlanGroup = false;
      this.payMappingListFromArray.controls = [];
    } else if (planaddDetailType == "groupPlan") {
      if (this.serviceAreaData) {
        this.filterNormalPlanGroup = [];
        this.commondropdownService.PrepaidPlanGroupDetails.forEach(element => {
          if (
            element.planMode == "NORMAL" &&
            (element.planGroupType === "Registration" ||
              element.planGroupType === "Registration and Renewal")
          ) {
            this.filterNormalPlanGroup.push(element);
          }
        });
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
  getLoggedinUserData() {
    const staffId = localStorage.getItem("userId");
    this.staffUserId = localStorage.getItem("userId");
    this.staffService.getById(staffId).subscribe(
      (response: any) => {
        this.staffUser = response.Staff;
        this.userName = this.staffUser.username;
        if (["Admin"].some(role => this.staffUser.roleName.includes(role))) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
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

  // TotalCurrentPlanItemPerPage(event) {
  //   this.CurrentPlanShowItemPerPage = Number(event.value);
  //   if (this.currentPagecustomerCurrentPlanListdata > 1) {
  //     this.currentPagecustomerCurrentPlanListdata = 1;
  //   }
  //   this.getcustCurrentPlan(this.customerLedgerDetailData.id, this.CurrentPlanShowItemPerPage);
  // }

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
            let discountValueNUmber = DiscountV.toFixed(3);
            this.discountValue = Number(discountValueNUmber);
            let discountfV = Number(this.planDataForm.value.offerPrice) - this.discountValue;
            this.planDataForm.patchValue({
              discountPrice: discountfV
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
      let url =
        "/findPlanGroupById?planGroupId=" + e.value + "&mvnoId=" + localStorage.getItem("mvnoId");
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

            // $("#selectPlanGroup").modal("show");
            // plansArray.controls = response.planGroup
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

            if (this.customerChangePlan) {
              $("#selectPlanGroup").modal("show");
              this.planGroupSelectedSubisu = e;
              this.getPlanListByGroupIdSubisu();
            }
          }
          let newAmount = 0;
          let totalAmount = 0;
          planDetailData.planMappingList.forEach((element, i) => {
            let n = i + 1;
            newAmount =
              element.plan.newOfferPrice != null
                ? element.plan.newOfferPrice
                : element.plan.offerprice;
            totalAmount = Number(totalAmount) + Number(newAmount);
            if (planDetailData.planMappingList.length == n) {
              this.planDataForm.patchValue({
                offerPrice: totalAmount
              });
            }
          });
        },
        (error: any) => {}
      );
    } else if (this.customerChangePlan) {
      $("#selectPlanGroup").modal("show");
      this.planGroupSelectedSubisu = e;
      this.getPlanListByGroupIdSubisu();
    }

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
    let url =
      "/findPlanGroupById?planGroupId=" + planGroupId + "&mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.planGroupMapingList = response.planGroup.planMappingList;
    });
  }
  // getcustCurrentPlan(custId, size) {
  //   let page_list;
  //   if (size) {
  //     page_list = size;
  //     this.customerCurrentPlanListdataitemsPerPage = size;
  //   } else {
  //     if (this.CurrentPlanShowItemPerPage == 1) {
  //       this.customerCurrentPlanListdataitemsPerPage = this.pageITEM;
  //     } else {
  //       this.customerCurrentPlanListdataitemsPerPage = this.CurrentPlanShowItemPerPage;
  //     }
  //   }
  //
  //   const url = "/subscriber/getActivePlanList/" + custId;
  //   this.customerManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.custCurrentPlanList = response.dataList;
  //       console.log(" this.custCurrentPlanList", this.custCurrentPlanList);
  //
  //     },
  //     (error: any) => {
  //       // console.log(error, "error")
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }

  // getcustFuturePlan(custId, size) {
  //   let page_list;
  //   if (size) {
  //     page_list = size;
  //     this.customerFuturePlanListdataitemsPerPage = size;
  //   } else {
  //     if (this.futurePlanShowItemPerPage == 1) {
  //       this.customerFuturePlanListdataitemsPerPage = this.pageITEM;
  //     } else {
  //       this.customerFuturePlanListdataitemsPerPage = this.futurePlanShowItemPerPage;
  //     }
  //   }
  //   const url = "/subscriber/getFuturePlanList/" + custId;
  //   this.customerManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.custFuturePlanList = response.dataList;
  //       console.log(" this.custFuturePlanList", this.custFuturePlanList);
  //
  //     },
  //     (error: any) => {
  //       // console.log(error, "error")
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }

  calTypwDisable: boolean = false;

  getPlanValidity(event) {
    const planId = event.value;
    //console.log("planId", planId);
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
          offerprice: Number(planDetailData.offerprice)
        });
        this.validityUnitFormGroup.patchValue({
          validityUnit: planDetailData.unitsOfValidity
        });
        if (planDetailData.category == "Business Promotion") {
          this.ifplanisSubisuSelect = true;
          // this.payMappingListFromArray.controls = [];
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

  discountValue: any = 0;

  discountvaluesetPercentage(e) {
    let data = [];
    let price = Number(this.planDataForm.value.offerPrice);
    let selDiscount = parseFloat(this.planDataForm.value.discountPrice).toFixed(2);
    // let discount = Number(selDiscount);
    //let selDiscount = parseFloat(this.planDataForm.value.discountPrice).toFixed(2);
    let discount = Number(selDiscount);
    // let DisValue = this.planDataForm.value.offerPrice - this.planDataForm.value.discountPrice;
    let discountPlan = (discount * 100) / price;
    let discountValueNUmber = discountPlan.toFixed(3);
    let value = 100 - Number(discountValueNUmber);

    if (this.ifPlanGroup) {
      if (discount == 0) {
        this.customerGroupForm.patchValue({
          discount: 0
        });
      } else {
        this.customerGroupForm.patchValue({
          discount: value.toFixed(3)
        });
      }
    } else {
      this.payMappingListFromArray.value.forEach((element, i) => {
        let n = i + 1;
        if (discount == 0) {
          element.discount = 0;
        } else {
          element.discount = value.toFixed(3);
        }

        if (this.payMappingListFromArray.value.length == n) {
          this.payMappingListFromArray.patchValue(this.payMappingListFromArray.value);
        }
      });
    }
  }

  discountPercentage(e) {
    if (this.ifPlanGroup) {
      let price = Number(this.planDataForm.value.offerPrice);
      let discount = Number(this.customerGroupForm.value.discount);
      let DiscountV = (price * discount) / 100;
      let discountValueNUmber = DiscountV.toFixed(3);
      let discountValue = Number(this.planDataForm.value.offerPrice) - Number(discountValueNUmber);
      this.discountValue = Number(discountValue);

      this.planDataForm.patchValue({
        discountPrice: this.discountValue
      });
    } else {
      let price = Number(this.planGroupForm.value.offerprice);
      let discount = Number(this.planGroupForm.value.discount);
      let DiscountV = (price * discount) / 100;
      let discountValueNUmber = DiscountV.toFixed(3);
      let discountValue = Number(this.planGroupForm.value.offerprice) - Number(discountValueNUmber);
      this.discountValue = Number(discountValue);
    }
  }

  DiscountValueStore: any = [];

  discountChange(e, index) {
    let discountValueNUmber: any = 0;
    let lastvalue: any = 0;

    let price = Number(this.payMappingListFromArray.value[index].offerPrice);

    let discount = Number(this.payMappingListFromArray.value[index].discount);

    if (this.planDataForm.value.offerPrice > this.payMappingListFromArray.value[index].offerPrice) {
      this.planDataForm.value.discountPrice =
        Number(this.planDataForm.value.discountPrice) -
        Number(this.DiscountValueStore[index].value);
    } else {
      this.planDataForm.value.discountPrice = Number(this.planDataForm.value.discountPrice);
    }

    let DiscountV = (price * discount) / 100;

    discountValueNUmber = DiscountV.toFixed(3);

    let discountVal =
      Number(this.payMappingListFromArray.value[index].offerPrice) - Number(discountValueNUmber);

    if (this.planDataForm.value.offerPrice > this.payMappingListFromArray.value[index].offerPrice) {
      lastvalue = Number(this.planDataForm.value.discountPrice) + Number(discountVal);
      if (this.planDataForm.value.offerPrice < lastvalue) {
        lastvalue = this.planDataForm.value.offerPrice;
      }
    } else {
      lastvalue = Number(discountVal);
    }

    this.planDataForm.patchValue({
      discountPrice: lastvalue
    });

    this.DiscountValueStore[index].value = discountVal;
  }

  planTotalOffetPrice = 0;

  onAddplanMappingList() {
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
        discountPrice: disValue
      });

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

      this.planGroupForm.reset();
      this.planGroupForm.controls.validity.enable();
      this.plansubmitted = false;
    } else {
      // console.log("I am not valid");
    }
  }

  planMappingListFormGroup(): FormGroup {
    for (const prop in this.planGroupForm.controls) {
      this.planGroupForm.value[prop] = this.planGroupForm.controls[prop].value;
    }

    return this.fb.group({
      planId: [this.planGroupForm.value.planId, Validators.required],
      service: [this.planGroupForm.value.service, Validators.required],
      validity: [this.planGroupForm.value.validity, Validators.required],

      discount: [this.planGroupForm.value.discount ? this.planGroupForm.value.discount : 0],
      billTo: [this.customerGroupForm.value.billTo],
      newAmount: [this.planGroupForm.value.newAmount],
      invoiceType: [this.customerGroupForm.value.invoiceType],
      offerPrice: [this.planGroupForm.value.offerprice],
      isInvoiceToOrg: [this.customerGroupForm.value.isInvoiceToOrg],
      istrialplan: [this.planGroupForm.value.istrialplan]
      // id:[]
    });
    return;
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

  canExit() {
    return true;
  }

  // exting customer

  async modalOpenextingCustomer() {
    this.selectextingCustomer = true;
    this.newFirstexting = 1;
    this.selectedextingCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  modalCloseextingCustomer() {
    this.currentPageextingCustomerListdata = 1;
    if (!this.ifReadonlyExtingInput) {
      if (!this.selectedextingCust.id) {
        this.customerGroupForm.patchValue({ leadCategory: "New Lead" });
      }
    }
    this.extingCustomerList = [];
    this.selectedextingCust = [];
    this.newFirstexting = 1;
    this.searchextingCustValue = "";
    this.searchextingCustOption = "";
    this.searchextingCustType = "";
    this.extingFieldEnable = false;
    this.selectextingCustomer = false;
    // console.log("this.newFirst1", this.newFirst)
  }
  extingPaginate(event) {
    this.currentPageextingCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchextingCustValue) {
      this.searchextingCustomer();
    }
  }

  clearSearchextingCustomer() {
    this.currentPageextingCustomerListdata = 1;
    this.searchextingCustValue = "";
    this.searchextingCustOption = "";
    this.searchextingCustType = "";
    this.extingCustomerList = [];
    this.selectedextingCust = [];
    this.extingFieldEnable = false;
  }

  selextingSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.extingFieldEnable = true;
    } else {
      this.extingFieldEnable = false;
    }
  }

  searchextingCustomer() {
    // this.currentPageextingCustomerListdata = 1;
    const searchextingData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageextingCustomerListdata,
      pageSize: this.extingCustomerListdataitemsPerPage
    };

    searchextingData.filters[0].filterValue = this.searchextingCustValue
      ? this.searchextingCustValue.trim()
      : "";
    searchextingData.filters[0].filterColumn = this.searchextingCustOption;

    const url =
      "/customers/search/" +
      this.searchextingCustType +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.recordPaymentService.postMethod(url, searchextingData).subscribe(
      (response: any) => {
        this.extingCustomerList = response.customerList;
        this.extingCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.extingCustomerListdatatotalRecords = 0;
        this.extingCustomerList = [];
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

  selectAreaListPayment: boolean = false;
  async SelExtingCustomer(id) {
    let customerData: any;

    let custId = id ? id : this.selectedextingCust.id;
    if (this.redirectCustomerId || this.selectedextingCust.id) {
      const url = "/customers/" + custId;
      this.customerManagementService.getMethod(url).subscribe((response: any) => {
        customerData = response.customers;
        this.modalCloseextingCustomer();
        this.ifReadonlyExtingInput = true;

        if (customerData.serviceareaid) {
          let serviceAreaId = {
            value: Number(customerData.serviceareaid)
          };
          this.selServiceArea(serviceAreaId);
        }
        // this.selectLeadSource(customerData.leadSourceId);
        this.getServiceByServiceAreaID(customerData.serviceareaid);

        this.customerGroupForm.patchValue(customerData);
        // Address
        if (customerData.addressList[0].addressType) {
          // this.getTempPincodeData(customerData.addressList[0].pincodeId, "present");
          this.getAreaData(customerData.addressList[0].areaId, "present");
          this.presentGroupForm.patchValue(customerData.addressList[0]);

          this.selServiceAreaByParent(Number(customerData.serviceareaid));
          const data = {
            value: Number(customerData.addressList[0].pincodeId)
          };
          this.selectPINCODEChange(data, "");
          this.presentGroupForm.patchValue({
            pincodeId: Number(customerData.addressList[0].pincodeId)
          });
        }
        if (customerData.addressList != null) {
          customerData.addressList.forEach(element => {
            // console.log("element", element);
            if ("Permanent" == element.addressType || "permanent" == element.addressType) {
              // this.getTempPincodeData(element.pincodeId, "permanent");
              this.getAreaData(element.areaId, "permanent");
            }
          });
        }

        this.customerGroupForm.patchValue({
          customerId: customerData.id ? Number(customerData.id) : "",
          existingCustomerId: customerData.id ? Number(customerData.id) : "",
          branchId: customerData.branch ? Number(customerData.branch) : "",
          id: null,
          serviceareaid: customerData.serviceareaid ? Number(customerData.serviceareaid) : "",
          custtype: customerData.custtype,
          popManagementId: customerData.popid ? Number(customerData.popid) : "",
          leadCategory: "Existing Customer",
          leadNo: this.leadNumber
        });
      });
    } else {
      this.customerGroupForm.patchValue({ leadCategory: "New Lead" });
      this.ifextingSaveBtn = false;
      this.ifReadonlyExtingInput = false;
    }
  }

  selServiceAreaByParent(id) {
    const serviceAreaId = id;
    this.pincodeDD = [];
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.customerManagementService.getMethod(url).subscribe(
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
}
