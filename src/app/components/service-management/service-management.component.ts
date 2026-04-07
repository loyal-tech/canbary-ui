import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Regex } from "src/app/constants/regex";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ServiceManagement } from "src/app/components/model/service-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ServiceManagementService } from "src/app/service/service-management.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { FieldmappingService } from "src/app/service/fieldmapping.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CountryManagementService } from "src/app/service/country-management.service";
import { ProductCategoryManagementService } from "src/app/service/product-category-management.service";
import { MASTERS, PRODUCTS } from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
declare var $: any;
@Component({
  selector: "app-service-management",
  templateUrl: "./service-management.component.html",
  styleUrls: ["./service-management.component.css"]
})
export class ServiceManagementComponent implements OnInit {
  serviceGroupForm: FormGroup;
  serviceSelectExpire: FormGroup;
  createServiceData: ServiceManagement;
  submitted: boolean = false;
  serviceListData: any = [];
  viewServiceListData: any = [];
  currentPageServiceListdata = 1;
  serviceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  serviceListdatatotalRecords: String;
  isServiceEdit: boolean;
  AclClassConstants;
  AclConstants;
  isDisabled: boolean = true;
  serviceParamArray: FormArray;
  expiryFlag: boolean = false;
  parameterList: any = [];
  parameterOptions: any = [];
  // addServiceParamForms:FormGroup;
  addServiceParamForm: FormGroup;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  totalAreaListLength = 0;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  counterServiceParam: number = 0;
  tableServiceParameter: {} = [];
  serviceModelFlag: boolean = false;
  selectExpireType = [
    { label: "Midnight", value: "at_midnight" },
    { label: "Actual time", value: "actual_time" }
  ];

  isDTV = [
    { label: "TRUE", value: true },
    { label: "FALSE", value: false }
  ];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  reqInventoryList: any = [];
  planInventoryList: any = [];
  serviceParams: any = [];
  public loginService: LoginService;
  finalServiceParamList: any = [];
  parameterOptionOriginalList: any;
  mvnoTitle = RadiusConstants.MVNO;
  mvnoId = Number(localStorage.getItem("mvnoId"));
  viewServiceDialog: boolean = false;
  searchName: any = "";
  searchData: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceManagementService: ServiceManagementService,
    public productCategoryManagementService: ProductCategoryManagementService,
    private countrymanagemntservice: CountryManagementService,
    loginService: LoginService,
    private tempservice: FieldmappingService,
    public commondropdownService: CommondropdownService,
    public statusCheckService: StatusCheckService
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.SERVICE_CREATE);
    this.deleteAccess = loginService.hasPermission(PRODUCTS.SERVICE_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.SERVICE_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }
  isEditService: boolean = false;
  ngOnInit(): void {
    this.serviceGroupForm = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      displayName: [""],
      icname: [""],
      iccode: [""],
      investmentid: [""],
      // isQoSV: [true],
      installation: [""],
      feasibility: [""],
      poc: [""],
      isServiceThroughLead: [""],
      isPriceEditable: [""],
      provisioning: [""],
      ledgerId: [""],
      expiry: [""],
      pcategoryId: [],
      serviceParamMappingList: [],
      is_dtv: [false],
      // stml: ['', Validators.required],
      // validity: ['', [Validators.required, Validators.pattern(Regex.numeric)]],
      mvnoId: [""]
    });
    const mvnoControl = this.serviceGroupForm.get("mvnoId");

    if (this.mvnoId === 1) {
      //   mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      //   mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();

    this.serviceParamArray = this.fb.array([]);

    this.addServiceParamForm = this.fb.group({
      serviceParamId: ["", Validators.required],
      isMandatory: [],
      value: []
    });

    // this.serviceGroupForm.patchValue({
    //   quota: true,
    // })
    this.serviceSelectExpire = this.fb.group({
      expireDropdownValue: [""]
    });
    this.getSelIcName("");
    this.getServiceDataList("");
    this.getReqInventory();
    // this.getServiceParams();
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
  }
  // get serviceForm(){
  //   return this.addServiceParamForms.get('arrayForm') as FormArray
  // }

  // pushFormGroup(){
  //   this.serviceForm.push(this.addServiceParamForm)
  //   console.log("formGroup" , this.addServiceParamForms)
  // }

  getServiceParameter(mvnoId?) {
    if (this.parameterOptions.length == 0) {
      let actualMvnoId = mvnoId ? mvnoId : localStorage.getItem("mvnoId");
      this.serviceManagementService
        .getMethod("/service_parameters/all?mvnoId=" + actualMvnoId)
        .subscribe((res: any) => {
          this.parameterOptionOriginalList = res.dataList;
          this.parameterList = res["dataList"].map((el: any) => {
            el["isSelected"] = false;
            return el;
          });
          if (!this.isEditService) {
            this.parameterOptions = res["dataList"];
          } else if (this.isEditService) {
            this.parameterList = this.parameterList.map((el: any) => {
              this.serviceParamArray.value.forEach((val: any) => {
                if (val.serviceParamId == el.id) {
                  el.isSelected = true;
                }
              });
              return el;
            });
            this.parameterOptions = this.parameterList.filter((el: any) => !el.isSelected);
          }
        });
    }
  }

  addServiceParameter() {
    // $("#exampleModal").modal("show");
    this.serviceModelFlag = true;
    this.getServiceParameter(this.serviceGroupForm?.value?.mvnoId);
  }
  closeModal() {
    this.finalServiceParamList = this.serviceParamArray.value;
    this.serviceModelFlag = false;
  }
  addServiceParam() {
    if (this.addServiceParamForm.valid) {
      this.parameterList = this.parameterList.map((el: any) => {
        if (this.addServiceParamForm.value.serviceParamId == el.id) el.isSelected = true;
        return el;
      });
      // console.log(this.parameterList)
      var selectedParamName = this.parameterOptions.filter(
        item => item.id == this.addServiceParamForm.value.serviceParamId
      );
      this.parameterOptions = this.parameterList.filter((el: any) => !el.isSelected);

      this.serviceParamArray.push(this.createServiceParamFormGroup(selectedParamName));
      this.addServiceParamForm.reset();
    }
  }

  createServiceParamFormGroup(selectedParamName): FormGroup {
    return this.fb.group({
      // isBounded: [this.addServiceParamForm.value.isBounded],
      serviceParamName: selectedParamName != null ? selectedParamName[0].name : "",
      serviceParamId: [this.addServiceParamForm.value.serviceParamId],
      isMandatory: [this.addServiceParamForm.value.isMandatory],
      value: [this.addServiceParamForm.value.value]
    });
  }
  // submitAddParameterModal(form:any){
  //   let serviceParameterOutput:any=[]
  //   this.parameterList.forEach((val:any)=>{
  //     if (val.isBounded) {
  //       serviceParameterOutput.push({

  //         serviceParamId: val.id,

  //         isMandatory: val.isMandatory || false,
  //         value: val.value

  //       });
  //       console.log(serviceParameterOutput)
  //     }

  //   })

  // }
  saveChanges() {
    this.finalServiceParamList = this.serviceParamArray.value;
    this.serviceModelFlag = false;
  }

  addEditService(serviceId) {
    this.submitted = true;
    this.expiryFlag = false;
    if (this.serviceGroupForm.valid) {
      if (serviceId) {
        let mvnoId =
          Number(localStorage.getItem("mvnoId")) === 1
            ? this.serviceGroupForm.value?.mvnoId == null
              ? Number(localStorage.getItem("mvnoId"))
              : this.serviceGroupForm.value?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        const url = "/planservice/" + serviceId + "?mvnoId=" + mvnoId;
        this.serviceGroupForm.value.mvnoId = mvnoId;
        this.createServiceData = this.serviceGroupForm.value;
        this.createServiceData["serviceParamMappingList"] = this.finalServiceParamList;
        this.serviceManagementService.updateMethod(url, this.createServiceData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.reserServiceGroupForm();
              this.messageService.add({
                severity: "success",
                summary: "Successfully Updated",
                detail: response.msg,
                icon: "far fa-check-circle"
              });
            }
          },
          (error: any) => {
            if (error.error.status == 417 || error.error.status == 406) {
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
        let mvnoId =
          Number(localStorage.getItem("mvnoId")) === 1
            ? this.serviceGroupForm.value?.mvnoId == null ||
              this.serviceGroupForm.value?.mvnoId === ""
              ? Number(localStorage.getItem("mvnoId"))
              : this.serviceGroupForm.value?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        const url = "/planservice" + "?mvnoId=" + mvnoId;
        this.serviceGroupForm.value.mvnoId = mvnoId;
        this.createServiceData = this.serviceGroupForm.value;
        this.createServiceData["serviceParamMappingList"] = this.finalServiceParamList;
        this.serviceManagementService.postMethod(url, this.createServiceData).subscribe(
          (response: any) => {
            this.reserServiceGroupForm();
            this.messageService.add({
              severity: "success",
              summary: "Successfully Created",
              // detail: response.msg,
              icon: "far fa-check-circle"
            });
          },
          (error: any) => {
            if (error.error.status == 406) {
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
    }
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageServiceListdata > 1) {
      this.currentPageServiceListdata = 1;
    }
    if (!this.searchkey) {
      this.getServiceDataList(this.showItemPerPage);
    } else {
      this.search();
    }
  }

  getServiceDataList(list) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPageServiceListdata;
    if (list) {
      size = list;
      this.serviceListdataitemsPerPage = list;
    } else {
      size = this.serviceListdataitemsPerPage;
    }

    const url = "/planservice/all" + "?mvnoId=" + localStorage.getItem("mvnoId");
    let data = {
      page: page_list,
      pageSize: size
    };
    this.serviceManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.serviceListData = response.serviceList;
        this.serviceListdatatotalRecords = response.pageDetails.totalRecords;

        this.serviceGroupForm.patchValue({
          isQoSV: false,
          // installation_charge: false,
          installation: false,
          feasibility: false,
          poc: false,
          isPriceEditable: false,
          provisioning: false,
          isServiceThroughLead: false
          // support_charge: false,
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

  editService(serviceId) {
    this.isEditService = true;

    const url = "/planservice/" + serviceId;
    this.serviceManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.isServiceEdit = true;
        this.viewServiceListData = response.servicebyId;
        this.onchangeEventForDTV(this.viewServiceListData.is_dtv);
        if (this.viewServiceListData.icname !== null && this.viewServiceListData.icname !== "") {
          this.ICListdata = [{ icname: this.viewServiceListData.icname }];
        } else {
          this.getSelIcName("");
        }
        this.getPlanServiceInventoryMapping(serviceId);
        this.serviceGroupForm.patchValue(this.viewServiceListData);

        this.serviceParamArray.clear();
        this.viewServiceListData.serviceParamMappingList.forEach(el => {
          this.serviceParamArray.push(
            this.fb.group({
              // isBounded: [this.addServiceParamForm.value.isBounded],
              serviceParamId: [el.serviceParamId],
              isMandatory: [el.isMandatory],
              value: [el.value]
            })
          );
        });

        this.getServiceParameter(this.viewServiceListData?.mvnoId);

        // this.serviceGroupForm.patchValue(this.viewServiceListData);
        let expireType = this.eventExpireData.filter(
          data => data.value === this.viewServiceListData.expiry
        );

        if (expireType.length > 0) {
          if (expireType[0].type == "At_Midnight") {
            this.serviceSelectExpire.patchValue({
              expireDropdownValue: "at_midnight"
            });
          } else {
            if (expireType[1].type == "At_Midnight") {
              this.serviceSelectExpire.patchValue({
                expireDropdownValue: "actual_time"
              });
            }
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

  canExit() {
    if (!this.serviceGroupForm.dirty) return true;
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
  deleteConfirmonService(serviceId) {
    if (serviceId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Service?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteCharge(serviceId);
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

  deleteCharge(serviceId) {
    const url = "/planservice/" + serviceId + "?mvnoId=" + Number(localStorage.getItem("mvnoId"));
    this.serviceManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageServiceListdata != 1 && this.totalAreaListLength == 1) {
          this.currentPageServiceListdata = this.currentPageServiceListdata - 1;
        }
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 406) {
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
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
        this.reserServiceGroupForm();
        this.getServiceDataList("");
        this.serviceSelectExpire.reset();
      },
      (error: any) => {
        if (error.error.responseCode == 417) {
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
    this.serviceGroupForm.reset();
  }

  pageChangedServiceList(pageNumber) {
    this.currentPageServiceListdata = pageNumber;
    if (!this.searchkey) {
      this.getServiceDataList("");
    } else {
      this.search();
    }
  }
  eventExpireData: any = [];
  getExpireDataFunction() {
    let data = {
      value: "at_midnight"
    };
    let data1 = {
      value: "actual_time"
    };
  }
  getExpireTypeType(e) {
    if (e.value == "at_midnight") {
      this.eventExpireData = [];
      let midNighturl = `/commonList/at_midnight`;
      this.commondropdownService.getMethodWithCache(midNighturl).subscribe((response: any) => {
        this.eventExpireData = response.dataList;
      });
    } else if (e.value == "actual_time") {
      this.eventExpireData = [];
      let actualTime = `/commonList/actual_time`;
      this.commondropdownService.getMethodWithCache(actualTime).subscribe((response: any) => {
        this.eventExpireData = response.dataList;
      });
    }
  }

  getReqInventory() {
    if (this.statusCheckService.isActiveInventoryService) {
      let url = "/productCategory/getAllActiveProductCategoriesByCB";
      this.productCategoryManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.reqInventoryList = response.dataList;
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

  getServiceParams() {
    let url = "/service_parameters/all?mvnoId=" + localStorage.getItem("mvnoId");
    this.serviceManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.serviceParams = response.dataList;
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

  onchangeEventForDTV(value: any) {
    if (value) {
      this.serviceGroupForm.controls.expiry.setValue("at_midnight");
      this.expiryFlag = true;
      //this.serviceGroupForm.controls.expiry.disable();
    } else {
      this.serviceGroupForm.controls.expiry.setValue("");
      this.expiryFlag = false;
      //this.serviceGroupForm.controls.expiry.enable();
    }
  }
  ICListdata: any = [];
  iccodedata: any = [];
  Data: any;
  getSelIcName(event) {
    const elist = event.value;
    //console.log("elist",elist)
    let icData = this.ICListdata.find(item => item.icname == elist);
    //console.log("icData",icData)
    if (icData) {
      this.Data = icData.iccode;
      this.serviceGroupForm.controls.investmentid.setValue(icData.id);
      this.serviceGroupForm.controls.iccode.patchValue(this.Data);
    }
    const url = "/investmentCode/getIcNames/";
    this.countrymanagemntservice.getMethod(url).subscribe((response: any) => {
      this.ICListdata = response;
    });
  }

  defaultParamValues = [];
  isMultipleFields: Boolean = false;
  withEndpoint: Boolean = false;
  defultUnitName = "";
  onParamSelect(e) {
    this.defaultParamValues = [];
    this.addServiceParamForm.get("value").setValue("");
    let filterdata = this.parameterOptionOriginalList.filter((el: any) => el.id == e.value);
    if (filterdata.length > 0) {
      let filterName = filterdata[0].name;
      if (
        filterName === "RAM" ||
        filterName === "Storage" ||
        filterName === "No of Additional Storage"
      ) {
        this.defultUnitName = "GB";
      } else if (filterName === "CPU") {
        this.defultUnitName = "Core";
      } else if (filterName === "Event per second") {
        this.defultUnitName = "EPS";
      } else if (filterName === "Distance") {
        this.defultUnitName = "Km";
      } else {
        this.defultUnitName = "";
      }
    }

    const url = "/fieldMapping/fieldDetailsByParam?paramId=" + e.value;
    this.serviceManagementService.getMethod(url).subscribe((response: any) => {
      this.defaultParamValues = response.dataList;
      if (this.defaultParamValues.length == 1) {
        this.isMultipleFields = false;
        if (
          this.defaultParamValues[0].endpoint != null &&
          this.defaultParamValues[0].endpoint.size != 0 &&
          this.defaultParamValues[0].endpoint != ""
        ) {
          this.withEndpoint = true;
          this.tempservice
            .getMethod2(this.defaultParamValues[0].endpoint)
            .subscribe((response: any) => {
              this.defaultParamValues = response.dataList;
            });
        } else this.withEndpoint = false;
      } else this.isMultipleFields = true;
    });
  }

  deleteConfirmonServiceParameter(index: number, serviceParamId) {
    if (index || index == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this action?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveServiceParameter(index, serviceParamId);
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

  async onRemoveServiceParameter(index: number, serviceParamId) {
    this.serviceParamArray.removeAt(index);
    let data = this.parameterOptionOriginalList.filter((el: any) => el.id == serviceParamId);
    this.parameterOptions = this.parameterOptions.concat(data);
  }

  reserServiceGroupForm() {
    this.submitted = false;
    this.serviceGroupForm.reset();
    this.parameterOptions = [];
    this.addServiceParamForm.reset();
    this.finalServiceParamList = [];

    this.serviceParamArray.clear();
    this.serviceSelectExpire.reset();
    this.serviceGroupForm.controls.is_dtv.setValue(false);
    this.isServiceEdit = false;
    this.isEditService = false;
    this.getServiceDataList("");
    this.getSelIcName;
  }

  getPlanServiceInventoryMapping(serviceId) {
    if (this.statusCheckService.isActiveInventoryService) {
      let prductCateId = [];
      let url = `/planserviceinventory/getPlanServiceInventoryByServiceId?serviceId=${serviceId}`;
      this.productCategoryManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planInventoryList = response.dataList;
          if (this.planInventoryList.length > 0) {
            this.planInventoryList.forEach(element => {
              prductCateId.push(element.id);
            });
            this.serviceGroupForm.patchValue({
              pcategoryId: prductCateId
            });
          } else {
            this.reqInventoryList;
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
  viewService(serviceId) {
    this.viewServiceDialog = true;
    this.editService(serviceId);
  }

  closedialog() {
    this.viewServiceDialog = false;
  }

  search() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageServiceListdata = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.serviceListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchName.trim();
    const url = `/planservice/search?page=${this.currentPageServiceListdata}&pageSize=${this.serviceListdataitemsPerPage}&sortBy=id&sortOrder=0&mvnoId=${localStorage.getItem("mvnoId")}`;
    this.serviceManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.serviceListData = response.dataList;
        this.serviceListdatatotalRecords = response.totalRecords;
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.serviceListData = [];
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

  clearSearch() {
    this.currentPageServiceListdata = 1;
    this.searchName = "";
    this.searchkey = "";
    this.getServiceDataList("");
    this.submitted = false;
    this.serviceGroupForm.reset();
  }
}
