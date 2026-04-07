import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { ChargeManagementService } from "src/app/service/charge-management.service";
import { Regex } from "src/app/constants/regex";
import { ChargeManagement } from "src/app/components/model/charge-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Observable, Observer } from "rxjs";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
@Component({
  selector: "app-charge-management",
  templateUrl: "./charge-management.component.html",
  styleUrls: ["./charge-management.component.css"]
})
export class ChargeManagementComponent implements OnInit {
  chargeGroupForm: FormGroup;
  chargeCategoryList: any;
  submitted: boolean = false;
  taxListData: any = [];
  createChargeData: ChargeManagement;
  currentPageChargeListdata = 1;
  ChargeListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  ChargeListdatatotalRecords: any;
  chargeListData: any = [];
  viewChargeListData: any = [];
  isChargeEdit: boolean = false;
  searchChargeUrl: any;
  detailView: boolean = false;
  listView: boolean = true;
  createView: boolean = false;
  searchdataview: boolean = false;
  chargeDetailData: any = {
    name: "",
    chargetype: "",
    chargecategory: "",
    price: "",
    taxName: "",
    taxamount: "",
    saccode: "",
    desc: "",
    ledgerId: "",
    currency: ""
  };
  chargeType = [];
  chargeTaxDetails: boolean = false;
  searchOptionSelect = [
    { label: "Any", value: "any" },
    { label: "Name", value: "name" },
    { label: "Category", value: "chargecategory" },
    { label: "Type", value: "chargetype" }
  ];

  royaltyPayableData = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ];
  isChargeName = false;
  isChargeCatogorey = false;
  isChargeType = false;

  searchData: any = [];
  chargetype = "";
  chargecategory = "";
  chargename = "";
  searchOption: "";
  chargeOptionname: "";

  statusOptions = RadiusConstants.status;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: any = [];
  totalDataListLength = 0;
  serviceListFlag: boolean = false;
  chargeTaxData: any = [];
  chargeTypeGetDataData: any = [];

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  chargeTypeText: any;
  currency: string;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  mvnoTitle = RadiusConstants.MVNO;
  mvnoId = Number(localStorage.getItem("mvnoId"));

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private chargeManagementService: ChargeManagementService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService,
    private systemService: SystemconfigService
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.CHARGE_CREATE);
    this.deleteAccess = loginService.hasPermission(PRODUCTS.CHARGE_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.CHARGE_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isChargeEdit = !this.createAccess && this.editAccess ? true : false;
    this.getChargeType();
    this.getChargeCategory();
    this.getTaxDataList();
  }

  ngOnInit(): void {
    this.chargeGroupForm = this.fb.group({
      actualprice: ["", Validators.required],
      chargecategory: ["", Validators.required],
      chargetype: ["", Validators.required],
      desc: ["", [Validators.required, Validators.pattern(Regex.characterlength225)]],
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      saccode: [""],
      taxid: ["", Validators.required],
      serviceid: ["", Validators.required],
      status: ["", Validators.required],
      currency: ["", Validators.required],
      ledgerId: [""],
      serviceNameList: [""],
      royalty_payable: [""],
      pushableLedgerId: [""],
      mvnoId: [""]
    });
    const mvnoControl = this.chargeGroupForm.get("mvnoId");

    if (this.mvnoId === 1) {
      //   mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      //   mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();
    this.mvnoId != 1 ? this.commondropdownService.getTaxAllListAll() : "";
    this.commondropdownService.getAllCurrencyData();

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
      pageSize: ""
    };

    this.getChargeList("");
    //  this.mvnoId != 1 ? : ""
    this.searchOption = "";
    this.selchargeOption({ value: "any" });

    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.mvnoId != 1 ? this.commondropdownService.filterserviceAreaList() : "";
    } else {
      this.mvnoId != 1 ? this.commondropdownService.getserviceAreaList() : "";
    }

    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  openServiceModal() {
    this.serviceListFlag = true;
  }

  closeModalOfService() {
    this.serviceListFlag = false;
  }

  createCharge() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.searchdataview = false;

    this.submitted = false;
    this.isChargeEdit = false;
    this.viewChargeListData = [];
    this.chargeGroupForm.reset();

    this.chargeGroupForm.controls.chargecategory.setValue("");
    this.chargeGroupForm.controls.chargetype.setValue("");
    this.chargeGroupForm.controls.taxid.setValue("");
    this.commondropdownService.planserviceData = [];
  }

  searchChargedata() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.searchdataview = true;
  }

  listCharge() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.searchdataview = false;
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageChargeListdata > 1) {
      this.currentPageChargeListdata = 1;
    }
    if (!this.searchkey) {
      this.getChargeList(this.showItemPerPage);
    } else {
      this.searchCharge();
    }
  }
  closeModal() {
    this.chargeTaxDetails = false;
  }
  getChargeList(list, mvnoId?) {
    this.chargeTypeGetDataData = [];
    let size;
    let page_list = this.currentPageChargeListdata;
    this.searchkey = "";
    if (list) {
      size = list;
      this.ChargeListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 1) {
      //   this.ChargeListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.ChargeListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.ChargeListdataitemsPerPage;
    }
    let actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    const url = "/charge/list" + "?mvnoId=" + actualMvnoId;
    let chargedata = {
      page: page_list,
      pageSize: size
    };
    this.chargeManagementService.postMethod(url, chargedata).subscribe(
      (response: any) => {
        this.chargeListData = response.chargelist;
        let chargeData = response.chargelist;
        // if (this.showItemPerPage > this.ChargeListdataitemsPerPage) {
        //   this.totalDataListLength = chargeData.length % this.showItemPerPage
        // } else {
        //   this.totalDataListLength =
        //     chargeData.length % this.ChargeListdataitemsPerPage
        // }
        this.ChargeListdatatotalRecords = response.pageDetails.totalRecords;

        this.chargeListData.forEach((element, index) => {
          this.chargeType.forEach((data, j) => {
            if (element.chargetype == data.value) {
              this.chargeTypeGetDataData.push(data.text);
            } else if (element.chargetype == "ADVANCE_RECURRING") {
              this.chargeTypeGetDataData.push("Advance Recurring");
            }
          });
        });
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

  getChargeCategory() {
    const url = "/commonList/chargeCategory";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.chargeCategoryList = response.dataList;
        // console.log('this.chargeCategoryList', this.chargeCategoryList)
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

  getTaxDataList(mvnoId?) {
    let actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    const url = "/taxes/all" + "?mvnoId=" + actualMvnoId;
    this.chargeManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.taxListData = response.taxlist;
        // console.log(' this.taxListData', this.taxListData)
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

  onKey(event: any) {
    let enteredValue = event.target.value;
    if (isNaN(enteredValue) || parseFloat(enteredValue) < 0) {
      event.target.value = "";
    } else {
      if (this.taxUpRange && parseFloat(enteredValue) > parseFloat(this.taxUpRange)) {
        this.chargeValueSentence = "The charge value is not in range with added tax.";
      } else {
        this.chargeValueSentence = "";
      }
    }
  }
  addEditCharge(chargeId) {
    this.submitted = true;
    if (this.chargeGroupForm.valid) {
      if (this.chargeValueSentence == "") {
        if (chargeId) {
          let mvnoId =
            Number(localStorage.getItem("mvnoId")) === 1
              ? this.chargeGroupForm.value?.mvnoId == null
                ? Number(localStorage.getItem("mvnoId"))
                : this.chargeGroupForm.value?.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          const url = "/charge/" + chargeId + "?mvnoId=" + mvnoId;

          if (
            this.chargeGroupForm.value.royalty_payable == null ||
            this.chargeGroupForm.value.royalty_payable == ""
          ) {
            this.chargeGroupForm.value.royalty_payable = false;
          }
          this.createChargeData = this.chargeGroupForm.value;
          this.createChargeData.mvnoId = mvnoId;
          this.createChargeData.price = this.chargeGroupForm.controls.actualprice.value;
          // console.log('this.createChargeData', this.createChargeData)
          this.chargeManagementService.updateMethod(url, this.createChargeData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.chargeGroupForm.reset();
              this.isChargeEdit = false;
              this.viewChargeListData = [];
              this.listView = true;
              this.createView = false;
              this.commondropdownService.clearCacheCMS("/charge/all");
              if (!this.searchkey) {
                this.getChargeList("");
              } else {
                this.searchCharge();
              }
              this.messageService.add({
                severity: "success",
                summary: " ",
                detail: response.msg,
                icon: "far fa-check-circle"
              });
            },
            (error: any) => {
              // console.log(error, 'error')
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
          const url = "/charge";
          if (
            this.chargeGroupForm.value.royalty_payable == null ||
            this.chargeGroupForm.value.royalty_payable == ""
          ) {
            this.chargeGroupForm.value.royalty_payable = false;
          }
          this.createChargeData = this.chargeGroupForm.value;
          let mvnoId =
            Number(localStorage.getItem("mvnoId")) === 1
              ? this.chargeGroupForm.value?.mvnoId == null
                ? Number(localStorage.getItem("mvnoId"))
                : this.chargeGroupForm.value?.mvnoId
              : Number(localStorage.getItem("mvnoId"));

          this.createChargeData.mvnoId = mvnoId;
          this.createChargeData.price = this.chargeGroupForm.controls.actualprice.value;
          // console.log('this.createChargeData', this.createChargeData)
          this.chargeManagementService.postMethod(url, this.createChargeData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.chargeGroupForm.reset();
              this.listView = true;
              this.createView = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              if (!this.searchkey) {
                this.getChargeList("");
              } else {
                this.searchCharge();
              }
            },
            (error: any) => {
              // console.log(error, 'error')
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
  }

  editCharge(chargeId) {
    this.listView = false;
    this.createView = true;
    this.searchdataview = false;
    this.chargeGroupForm.reset();
    let taxData: any = [];
    let slabList: any = [];
    this.viewChargeListData = [];
    this.chargeValueSentence = "";
    this.taxUpRange = "";
    if (chargeId) {
      let mvnoId = Number(localStorage.getItem("mvnoId"));

      const url = "/charge/" + chargeId + "?mvnoId=" + mvnoId;
      this.chargeManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isChargeEdit = true;
          this.viewChargeListData = response.chargebyid;

          this.commondropdownService.getplanservice();
          this.chargeGroupForm.patchValue(this.viewChargeListData);
          this.chargeGroupForm.patchValue({
            serviceid: this.viewChargeListData.servicesid,
            mvnoId: this.viewChargeListData.mvnoId
          });
          var event = {
            value: this.chargeGroupForm.value.chargecategory
          };
          this.eventChargeCategory(event);
          let url = "/taxes/" + this.viewChargeListData.taxid;
          this.chargeManagementService.getMethod(url).subscribe((response: any) => {
            taxData = response.taxData;
            if (taxData.taxtype == "SLAB") {
              slabList = taxData.slabList;
              let index = slabList.length - 1;
              this.taxUpRange = slabList[index].rangeUpTo;
              if (this.viewChargeListData.price > this.taxUpRange) {
                this.chargeValueSentence = "The charge value is not in range with added tax.";
              } else {
                this.chargeValueSentence = "";
              }
            }
            if (!this.viewChargeListData?.currency) {
              this.chargeGroupForm.get("currency").setValue(this.currency);
            }
          });
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

  canExit() {
    if (!this.chargeGroupForm.dirty) return true;
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

  deleteConfirmonCharge(chargeId: number) {
    if (chargeId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Charge?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteCharge(chargeId);
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

  deleteCharge(chargeId) {
    const url = "/charge/" + chargeId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.chargeManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageChargeListdata != 1 && this.totalDataListLength == 1) {
          this.currentPageChargeListdata = this.currentPageChargeListdata - 1;
        }
        if (response.responseCode == 405) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
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
        this.commondropdownService.clearCacheCMS("/charge/all");
        if (!this.searchkey) {
          this.getChargeList("");
        } else {
          this.searchCharge();
        }
      },
      (error: any) => {
        if (error.error.responseCode == 405 || error.error.responseCode == 417) {
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

  selchargeOption(event) {
    let selOption = event.value;
    if (selOption == "name") {
      this.isChargeName = true;
      this.isChargeCatogorey = false;
      this.isChargeType = false;
      this.chargeOptionname = "";
    } else if (selOption == "chargecategory") {
      this.isChargeName = false;
      this.isChargeCatogorey = true;
      this.isChargeType = false;
      this.chargeOptionname = "";
    } else if (selOption == "chargetype") {
      this.isChargeName = false;
      this.isChargeCatogorey = false;
      this.isChargeType = true;
      this.chargeOptionname = "";
    } else if (selOption == "any") {
      this.isChargeName = true;
      this.isChargeCatogorey = false;
      this.isChargeType = false;
      this.chargeOptionname = "";
    } else {
      this.isChargeName = false;
      this.isChargeCatogorey = false;
      this.isChargeType = false;
      this.chargeOptionname = "";
    }
  }

  searchCharge() {
    this.chargeTypeGetDataData = [];
    if (!this.searchkey || this.searchkey !== this.chargeOptionname.trim()) {
      this.currentPageChargeListdata = 1;
    }
    this.searchkey = this.chargeOptionname;
    if (this.showItemPerPage == 1) {
      this.ChargeListdataitemsPerPage = this.pageITEM;
    } else {
      this.ChargeListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchData.filters[0].filterValue = this.chargeOptionname.trim();
    this.searchData.filters[0].filterColumn = this.searchOption.trim();
    this.searchData.filters[0].filterDataType = "";
    this.searchData.page = this.currentPageChargeListdata;
    this.searchData.pageSize = this.ChargeListdataitemsPerPage;

    const url = "/charge/search?mvnoId=" + localStorage.getItem("mvnoId");
    this.chargeManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.chargeListData = response.chargelist;
        let chargeData = response.chargelist;
        this.ChargeListdatatotalRecords = response.pageDetails.totalRecords;

        if (this.showItemPerPage > this.ChargeListdataitemsPerPage) {
          this.totalDataListLength = chargeData.length % this.showItemPerPage;
        } else {
          this.totalDataListLength = chargeData.length % this.ChargeListdataitemsPerPage;
        }

        this.chargeListData.forEach((element, index) => {
          this.chargeType.forEach((data, j) => {
            if (element.chargetype == data.value) {
              this.chargeTypeGetDataData.push(data.text);
            }
          });
        });
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.chargeListData = [];
          this.ChargeListdatatotalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
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
    // } else {
    //   this.getChargeList('')
    // }
  }

  clearSearchCharge() {
    this.getChargeList("");
    this.chargecategory = "";
    this.chargetype = "";
    this.chargeOptionname = "";
    this.searchOption = "";
    this.isChargeName = false;
    this.isChargeCatogorey = false;
    this.isChargeType = false;
    this.selchargeOption({ value: "any" });
  }

  pageChangedChargeList(pageNumber) {
    this.currentPageChargeListdata = pageNumber;
    if (!this.searchkey) {
      this.getChargeList("");
    } else {
      this.searchCharge();
    }
  }

  openChargeDetail(chargeId) {
    this.detailView = true;
    this.createView = false;
    this.listView = false;
    this.searchdataview = false;
    this.getChargeDetailById(chargeId);
  }
  //   viewServiceName = "";
  getChargeDetailById(chargeId) {
    const url = "/charge/" + chargeId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.chargeManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.chargeDetailData = response.chargebyid;

        this.chargeType.forEach((data, j) => {
          if (this.chargeDetailData.chargetype == data.value) {
            this.chargeTypeText = data.text;
          }
        });

        // const url = "/planservice/" + this.chargeDetailData.service;
        // this.chargeManagementService.getMethod(url).subscribe((response: any) => {
        //   this.viewServiceName = response.servicebyId.name;
        // });
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

  chargeValueSentence = "";
  taxUpRange = "";

  taxRang(event) {
    let taxData: any = [];
    let slabList: any = [];
    this.taxUpRange = "";
    this.chargeValueSentence = "";
    let id = event.value;

    let url = "/taxes/" + id;
    this.chargeManagementService.getMethod(url).subscribe((response: any) => {
      taxData = response.taxData;
      if (taxData.taxtype == "SLAB") {
        slabList = taxData.slabList;
        let index = slabList.length - 1;
        this.taxUpRange = slabList[index].rangeUpTo;
        if (this.viewChargeListData.price > this.taxUpRange) {
          this.chargeValueSentence = "The charge value is not in range with added tax.";
        } else {
          this.chargeValueSentence = "";
        }
      }
    });
  }

  getChargeType() {
    let url = "/commonList/generic/chargetype";
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.chargeType = response.dataList;
    });
  }

  eventChargeType(e) {
    if (e.value == "ADVANCE" || e.value == "RECURRING") {
      this.chargeGroupForm.get("royalty_payable").setValidators([Validators.required]);
      this.chargeGroupForm.get("royalty_payable").updateValueAndValidity();
    } else {
      this.chargeGroupForm.get("royalty_payable").clearValidators();
      this.chargeGroupForm.get("royalty_payable").updateValueAndValidity();
    }
  }

  eventChargeCategory(e) {
    if (e.value == "IP") {
      const url = "/getAllServicesforIPCharge";
      this.commondropdownService.getMethod(url).subscribe(
        (response: any) => {
          this.commondropdownService.planserviceData = response.dataList;
        },
        (error: any) => {}
      );
    } else {
      this.commondropdownService.getplanservice();
    }
  }

  openChargeTAxDetail(taxId) {
    let url = "/taxes/" + taxId;
    this.chargeManagementService.getMethod(url).subscribe((response: any) => {
      this.chargeTaxData = response.taxData;
      this.chargeTaxDetails = true;
    });
  }

  mvnoChange(event) {
    this.getTaxDataList(event.value);
    this.getChargeList("", event.value);
    this.commondropdownService.getTaxAllListAll(event.value);
    this.commondropdownService.getplanservice(event.value);
    this.commondropdownService.getserviceAreaList(event.value);
    this.commondropdownService.filterserviceAreaList(event.value);
  }
}
