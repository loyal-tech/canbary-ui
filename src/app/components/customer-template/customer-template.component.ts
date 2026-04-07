import { DatePipe, formatDate } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as FileSaver from "file-saver";
import { NgxSpinnerService, Spinner } from "ngx-spinner";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { countries } from "src/app/components/model/country";
import { CustomerManagements } from "src/app/components/model/customer";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import { OutwardService } from "src/app/service/outward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { StaffService } from "src/app/service/staff.service";
import * as XLSX from "xlsx";
import { InvoiceDetalisModelComponent } from "../invoice-detalis-model/invoice-detalis-model.component";
import { InvoicePaymentDetailsModalComponent } from "../invoice-payment-details-modal/invoice-payment-details-modal.component";
import { ExternalItemManagementService } from "src/app/service/external-item-management.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { PaymentAmountModelComponent } from "src/app/components/payment-amount-model/payment-amount-model.component";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { CustomerplanGroupDetailsModalComponent } from "src/app/components/customerplan-group-details-modal/customerplan-group-details-modal.component";
import { CustomerWithdrawalmodalComponent } from "src/app/components/customer-withdrawalmodal/customer-withdrawalmodal.component";
import { InwardService } from "src/app/service/inward.service";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { FieldmappingService } from "src/app/service/fieldmapping.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";

declare var $: any;

@Component({
  selector: "app-customer-template",
  templateUrl: "./customer-template.component.html",
  styleUrls: ["./customer-template.component.css"]
})
export class CustomerTemplateComponent implements OnInit, AfterViewInit {
  countries: any = countries;
  basicLeadArr: any = [];
  fieldsArr: any = [];
  planArr: any = [];
  customerGroupForm!: FormGroup;

  cities: any = [];
  exampleGroupForm!: FormGroup;
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
  totalAddress = 0;
  customerID: any;
  editCustomerId: any;
  listView = true;
  createView = false;
  custCurrentPlanList: any;
  custFuturePlanList: any;
  customerFuturePlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerExpiryPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  CurrentPlanShowItemPerPage = 1;
  futurePlanShowItemPerPage = 1;
  currentPagecustomerCurrentPlanListdata = 1;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  customerLedgerDetailData: any = {
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
    invoiceType: "",
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
  planGroupMapingList: any = [];

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
    private staffService: StaffService
  ) {
    // this.myForm = this.fb.group({
    //   inputs: this.fb.array([])
    // });
    //   const form = {};
    //   this.cities = [
    //     {name: 'New York', code: 'NY',id:1},
    //     {name: 'Rome', code: 'RM'},
    //     {name: 'London', code: 'LDN'},
    //     {name: 'Istanbul', code: 'IST'},
    //     {name: 'Paris', code: 'PRS'}
    // ];
    // this.exampleGroupForm=new FormGroup({
    //   selectedValues:new FormControl()
    //  })
  }
  ngAfterViewInit(): void {
    //
  }

  async ngOnInit() {
    this.getLoggedinUserData();
    this.commondropdownService.getCountryList();
    this.commondropdownService.getsystemconfigList();
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
      addressType: ["Present", Validators.required],
      landmark: ["", Validators.required],
      areaId: ["", Validators.required],
      pincodeId: ["", Validators.required],
      cityId: ["", Validators.required],
      stateId: ["", Validators.required],
      countryId: ["", Validators.required],
      landmark1: [""]
    });

    this.validityUnitFormArray = this.fb.array([]);

    this.validityUnitFormGroup = this.fb.group({
      validityUnit: [""]
    });

    this.planCategoryForm = this.fb.group({
      planCategory: [""]
    });

    this.commondropdownService.getBillToData();

    this.commondropdownService.findAllplanGroups();
    // this.commondropdownService.getAllPinCodeNumber();
    this.commondropdownService.getAllPinCodeData();
    this.commondropdownService.getCityList();

    this.commondropdownService.getStateList();
  }

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
  }

  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.serviceareaCheck = false;
      this.filterPlanData = [];
      const custType = "Prepaid";
      let mvnoId = Number(localStorage.getItem("mvnoId"));
      const url =
        "/plans/serviceArea?planmode=ALL&serviceAreaId=" + serviceAreaId + "&mvnoId=" + mvnoId;
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
      // if (index === "payment") {
      //   this.paymentareaDetails = response.data;

      //   this.selectPincodeListPayment = true;

      //   this.paymentGroupForm.patchValue({
      //     addressType: "Payment",
      //     pincodeId: Number(this.paymentareaDetails.pincodeId),
      //     cityId: Number(this.paymentareaDetails.cityId),
      //     stateId: Number(this.paymentareaDetails.stateId),
      //     countryId: Number(this.paymentareaDetails.countryId),
      //   });
      //
      // }
      // if (index === "permanent") {
      //   this.permanentareaDetails = response.data;

      //   this.selectPincodeListPermanent = true;
      //   this.permanentGroupForm.patchValue({
      //     addressType: "Permanent",
      //     pincodeId: Number(this.permanentareaDetails.pincodeId),
      //     cityId: Number(this.permanentareaDetails.cityId),
      //     stateId: Number(this.permanentareaDetails.stateId),
      //     countryId: Number(this.permanentareaDetails.countryId),
      //   });
      //
      // }
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

          // if (!this.iscustomerEdit) {
          //   this.presentGroupForm.reset();
          // }
          // this.getAreaData(this.serviceAreaData.areaid, "present");
        },
        (error: any) => {}
      );
      this.getServiceByServiceAreaID(serviceAreaId);

      // this.shiftLocationDTO.shiftPartnerid = "";
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
  // getList() {
  //   this.fieldsArr.forEach((el1: any) => {
  //     el1.fields.forEach((el2: any) => {
  //       this.allFieldsArr.push(el2);
  //       if (el2.fieldType == "select" && el2.isdependant == false) {
  //         this.custService.getMethod2(el2.endpoint).subscribe((res: any) => {
  //           // console.log("response",res)
  //           this.optionList.push({
  //             moduleName: el1.moduleName,
  //             fieldname: el2.fieldname,
  //             options: res,
  //           });
  //         });
  //       } else if (el2.fieldType == "multi-select" && el2.isdependant == false) {
  //         this.custService.getMethod2(el2.endpoint).subscribe((res: any) => {
  //           this.multiOptionList.push({
  //             moduleName: el1.moduleName,
  //             fieldname: el2.fieldname,
  //             options: res,
  //           });
  //         });
  //       } else if (el2.fieldType == "object") {
  //         el2.child.forEach((el3: any) => {
  //           if (el3.fieldType == "select") {
  //             this.custService.getMethod2(el3.endpoint).subscribe((res: any) => {
  //               this.childOptionList.push({
  //                 moduleName: el1.moduleName,
  //                 parentfieldname: el2.fieldname,
  //                 fieldname: el3.fieldname,
  //                 options: res,
  //               });
  //             });
  //           }
  //         });
  //       } else if (el2.fieldType == "objectList") {
  //         el2.child.forEach((el3: any) => {
  //           if (el3.fieldType == "select") {
  //             this.custService.getMethod2(el3.endpoint).subscribe((res: any) => {
  //               this.childOptionList.push({
  //                 moduleName: el1.moduleName,
  //                 parentfieldname: el2.fieldname,
  //                 fieldname: el3.fieldname,
  //                 options: res,
  //               });
  //             });
  //           }
  //         });
  //       }
  //     });
  //   });
  //   console.log("optionList", this.optionList);
  //   console.log("allFieldsArr", this.allFieldsArr);
  //   console.log("childOptionList", this.childOptionList);
  //   //
  // }

  // addresses taken out of iteration

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

  // getList() {
  //   this.fieldsArr.forEach((el1: any) => {
  //     el1.fields.forEach((el2: any) => {
  //       this.allFieldsArr.push(el2);
  //       if (el2.fieldType == "select" && el2.isdependant == false) {

  //           // console.log("response",res)
  //           this.optionList.push({
  //             moduleName: el1.moduleName,
  //             fieldname: el2.fieldname,
  //             options: []
  //           });

  //       } else if (el2.fieldType == "multi-select" && el2.isdependant == false) {
  //         this.custService.getMethod2(el2.endpoint).subscribe((res: any) => {
  //           this.multiOptionList.push({
  //             moduleName: el1.moduleName,
  //             fieldname: el2.fieldname,
  //             options: res,
  //           });
  //         });
  //       } else if (el2.fieldType == "object") {
  //         el2.child.forEach((el3: any) => {
  //           if (el3.fieldType == "select") {
  //             this.custService.getMethod2(el3.endpoint).subscribe((res: any) => {
  //               this.childOptionList.push({
  //                 moduleName: el1.moduleName,
  //                 parentfieldname: el2.fieldname,
  //                 fieldname: el3.fieldname,
  //                 options: res,
  //               });
  //             });
  //           }

  //         });
  //       } else if(el2.fieldType == "objectList"){
  //         el2.child.forEach((el3: any) => {
  //           if (el3.fieldType == "select") {
  //             this.custService.getMethod2(el3.endpoint).subscribe((res: any) => {
  //               this.childOptionList.push({
  //                 moduleName: el1.moduleName,
  //                 parentfieldname: el2.fieldname,
  //                 fieldname: el3.fieldname,
  //                 options: res,
  //               });
  //             });
  //           }

  //         });
  //       }
  //     });
  //   });
  //   console.log("optionList", this.optionList);
  //   console.log("allFieldsArr", this.allFieldsArr);
  //   console.log("childOptionList", this.childOptionList);
  //   //
  // }

  // myForm: FormGroup;
  // regexValidations:any={
  //   "mobile_number":'[6-9][0-9]{9}',
  //   'lastname':'[a-zA-Z]',
  // }

  // {
  isPlanOnDemand: boolean = false;
  planCreationType() {
    const planBindingType = localStorage.getItem("planBindingType");
    if (planBindingType === "On-Demand") {
      this.isPlanOnDemand = true;
      this.getFields();
    } else if (planBindingType === "Predefined") {
      this.isPlanOnDemand = false;
      this.getFields();
    }
  }

  saveCustomer() {
    this.submitted = true;
    this.customerGroupForm.value["presentAddress"].addressType = "Present";
    this.customerGroupForm.value["permanentAddress"].addressType = "Permanent";
    this.customerGroupForm.value["paymentAddress"].addressType = "Payment";
    //  if(this.customerGroupForm.valid){
    this.customerGroupForm.value["addressList"] = [
      this.customerGroupForm.value["presentAddress"],
      this.customerGroupForm.value["permanentAddress"],
      this.customerGroupForm.value["paymentAddress"]
    ];

    if (this.customerGroupForm.valid) {
      this.custService.postMethod("/customers", this.customerGroupForm.value).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Customer Created Successfully",
              icon: "far fa-check-circle"
            });
            this.submitted = false;
            this.customerGroupForm.reset();
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

  // createList(){
  //   this.basicLeadArr=this.fieldsArr.filter(el=>el.module=="Basic Lead Details" )
  //   this.planArr=this.fieldsArr.filter(el=>el.module=="Plan Details" )
  //   console.log("basicArr",this.basicLeadArr)
  // }
  //endPoint:/fieldMapping/getAvailableAndBoundedFields?screen=customer
  // fieldMapping/getModuleWiseTemplate
  // getFields() {
  //
  //   this.tempservice
  //     .getMethod("/fieldMapping/getAvailableAndBoundedFields?screen=customer")
  //     .subscribe((res: any) => {
  //       this.fieldsArr = res["dataList"];
  //       // this.createList();
  //       this.getList();
  //       console.log("fieldsArr", this.fieldsArr);
  //       if (this.fieldsArr.length >= 1) {
  //         const form = {};
  //         this.fieldsArr.forEach(field => {
  //           form[field.fieldname] = new FormControl("");
  //         });
  //         this.customerGroupForm = this.fb.group(form);
  //         console.log(this.customerGroupForm);
  //       }
  //     });

  // getFields() {
  //

  //   this.tempservice
  //     .getMethod("/fieldMapping/getModuleWiseTemplate?screen=customer")
  //     .subscribe((res: any) => {
  //       this.fieldsArr = res["dataList"];
  //       // this.createList();
  //       this.getList();
  //       console.log("fieldsArr", this.fieldsArr);
  //       if (res.responseCode==200 && this.fieldsArr.length >= 1) {

  //         this.fieldsArr.forEach((el1:any) => {
  //           el1.fields.forEach((el2:any)=>{
  //             if(el2.fieldType!='object'){
  //               this.form[el2.fieldname]= new FormControl('')

  //             }else{
  //              this.form[el2.fieldname]= new FormControl('')

  //             }
  //           })

  //         });
  //         this.customerGroupForm = this.fb.group(this.form);
  //         console.log(this.customerGroupForm);
  //       }
  //     });

  //    }
  isShowTemplate: boolean;
  selectedCountry: any = +91;
  getFields() {
    this.tempservice
      .getMethod("/fieldMapping/getModuleWiseTemplate?screen=customer")
      // .getMethod3("dataList")
      .subscribe(
        (res: any) => {
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
            const presentForm1 = {};
            const permanentForm = {};
            const paymentForm = {};
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
              // (this.form["countryCode"] = this.fb.control(
              //   this.commondropdownService.commonCountryCode
              // )),
              this.form["invoiceType"] = this.fb.control(null);
              this.form["plangroupid"] = this.fb.control("");
              this.form["discount"] = this.fb.control("", Validators.max(99));
              this.form["isInvoiceToOrg"] = this.fb.control(false);
              this.form["istrialplan"] = this.fb.control(false);
              this.form["planMappingList"] = this.payMappingListFromArray = this.fb.array([]);
            }
            this.customerGroupForm = this.fb.group(this.form);
            // this.customerGroupForm.patchValue({
            //   countryCode: this.commondropdownService.commonCountryCode,
            // });
            this.customerGroupForm
              .get("countryCode")
              .setValue(this.commondropdownService.commonCountryCode);
          } else {
            this.isShowTemplate = false;
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
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );

    // const addressListFormArray =this.fb.array([
    //   this.createFormArray(this.presentAddressArr),
    //   this.createFormArray(this.permanentAddressArr),
    //   this.createFormArray(this.paymentAddressArr)

    // ])
    // this.form['addressList']=addressListFormArray
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

  TotalCurrentPlanItemPerPage(event) {
    this.CurrentPlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerCurrentPlanListdata > 1) {
      this.currentPagecustomerCurrentPlanListdata = 1;
    }
    this.getcustCurrentPlan(this.customerLedgerDetailData.id, this.CurrentPlanShowItemPerPage);
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

    const url = "/subscriber/getActivePlanList/" + custId + "?isNotChangePlan=false";
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

  // createFormArray(arr:any,groupname:FormGroup){
  //   arr.fields.child.forEach((val:any)=>{

  //     groupname[val.fieldname]=new FormControl('')

  //     return groupname

  //   })

  // }

  // createFormArray(arr:any): FormGroup {
  //   const formGroup = new FormGroup({});

  //   arr[0].fields[0].child.forEach((val: any) => {
  //     if (val.isMandatory) {

  //       formGroup[val.fieldname]=new FormControl('',Validators.required)
  //     } else {
  //       formGroup[val.fieldname]=new FormControl('')
  //     }
  //   });

  //   return formGroup;
  // }

  canExit() {
    return true;
  }
}
