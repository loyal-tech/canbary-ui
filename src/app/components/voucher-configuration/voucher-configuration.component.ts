import { status } from "./../../RadiusUtils/RadiusConstants";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { element } from "protractor";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { LoginService } from "src/app/service/login.service";
import { VoucherConfigurationService } from "src/app/service/voucher-configuration.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
import { CommondropdownService } from "src/app/service/commondropdown.service";

@Component({
  selector: "app-voucher-configuration",
  templateUrl: "./voucher-configuration.component.html",
  styleUrls: ["./voucher-configuration.component.css"]
})
export class VoucherConfigurationComponent implements OnInit {
  @ViewChild("searchVoucherForm") searchVoucherForm: NgForm;
  vourcharConfigForm: FormGroup;
  voucherGenerateForm: FormGroup;
  VoucherBatchForm: FormGroup;
  shownVoucherConfig: boolean = false;
  shownVoucherGenerate: boolean = true;
  submitted = false;
  searchSubmitted = false;
  status = [{ label: "ACTIVE" }, { label: "INACTIVE" }];
  voucherTypeOption = [
    { label: "WALLET", value: "WALLET" },
    { label: "PLAN", value: "PLAN" }
  ];

  linkType: string;
  mvnoData: any;
  loggedInUser: any;
  mvnoId = Number(localStorage.getItem("mvnoId"));
  filteredPlanList: Array<any> = [];
  resellerData: any;
  batchPlanId: number;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  showProfile: boolean;
  showBatch: boolean;
  showVoucher: boolean;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  generateAccess: boolean = false;
  voucherBatchAccess: boolean = false;
  voucherManageAccess: boolean = false;
  AclClassConstants;
  AclConstants;
  userId: String;
  superAdminId: string;
  mvnoTitle = RadiusConstants.MVNO;
  //   actualMvnoId = Number(localStorage.getItem("mvnoId"));

  constructor(
    private voucherConfigService: VoucherConfigurationService,
    private radiusUtility: RadiusUtility,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    loginService: LoginService,
    private commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.VOUCHER_CREATE);
    this.deleteAccess = loginService.hasPermission(PRODUCTS.VOUCHER_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.VOUCHER_EDIT);
    this.generateAccess = loginService.hasPermission(PRODUCTS.VOUCHER_GENERATE);
    this.voucherBatchAccess = loginService.hasPermission(PRODUCTS.SHOW_VOUCHER_BATCH);
    this.voucherManageAccess = loginService.hasPermission(PRODUCTS.SHOW_MANAGE_VOUCHERS);
    this.showProfile = true;
    this.getAllVouchers("");
    this.getAllPlans();
    //this.getAllReseller();
  }

  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.userId = localStorage.getItem("userId");
    this.superAdminId = RadiusConstants.SUPERADMINID;
    // if (this.userId == this.superAdminId) {
    //   this.vourcharConfigForm = this.fb.group({
    //     voucherName: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
    //     voucherCodeFormat: ["", Validators.required],
    //     noOfVoucher: ["", [Validators.required, Validators.min(1), Validators.max(10000)]],
    //     voucherCodeLength: ["", [Validators.required, Validators.min(1), Validators.max(16)]],
    //     linkType: ["", Validators.required],
    //     planName: [""],
    //     validity: ["", [Validators.required, Validators.min(-1)]],
    //     prefix: [""],
    //     suffix: [""],
    //     status: ["", Validators.required],
    //     // mvnoName: ["", Validators.required],
    //     createdBy: "",
    //     lastModifiedBy: "",
    //     voucherAmount: ["", Validators.required],
    //     mvnoId: [""]
    //   });
    //   const mvnoControl = this.vourcharConfigForm.get("mvnoId");

    //   if (this.mvnoId === 1) {
    //     mvnoControl?.setValidators([Validators.required]);
    //     this.commondropdownService.getmvnoList();
    //   } else {
    //     mvnoControl?.clearValidators();
    //   }

    //   mvnoControl?.updateValueAndValidity();
    //   this.vourcharConfigForm.get("linkType")?.valueChanges.subscribe(value => {
    //     const planControl = this.vourcharConfigForm.get("planId");
    //     const voucherAmountControl = this.vourcharConfigForm.get("voucherAmount");

    //     if (value === "PLAN") {
    //       planControl?.setValidators([Validators.required]);
    //       voucherAmountControl?.clearValidators();
    //       voucherAmountControl?.setValue(null);
    //     } else {
    //       voucherAmountControl?.setValidators([Validators.required]);
    //       planControl?.clearValidators();
    //       planControl?.setValue(null);
    //     }

    //     planControl?.updateValueAndValidity();
    //     voucherAmountControl?.updateValueAndValidity();
    //   });
    // } else {
    this.vourcharConfigForm = this.fb.group({
      voucherName: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      voucherCodeFormat: ["", Validators.required],
      noOfVoucher: ["", [Validators.required, Validators.min(1), Validators.max(10000)]],
      voucherCodeLength: ["", [Validators.required, Validators.min(1), Validators.max(16)]],
      planId: [""],
      linkType: ["", Validators.required],
      planName: [""],
      validity: ["", [Validators.required, Validators.min(-1)]],
      prefix: [""],
      suffix: [""],
      status: ["", Validators.required],
      // mvnoName: [""],
      createdBy: "",
      lastModifiedBy: "",
      voucherAmount: [""],
      mvnoId: [""]
    });

    const mvnoControl = this.vourcharConfigForm.get("mvnoId");

    if (this.mvnoId === 1) {
      mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();

    this.vourcharConfigForm.get("linkType")?.valueChanges.subscribe(value => {
      const planControl = this.vourcharConfigForm.get("planId");
      const voucherAmountControl = this.vourcharConfigForm.get("voucherAmount");

      if (value === "PLAN") {
        planControl?.setValidators([Validators.required]);
        voucherAmountControl?.clearValidators();
        voucherAmountControl?.setValue(null);
      } else {
        voucherAmountControl?.setValidators([Validators.required]);
        planControl?.clearValidators();
        planControl?.setValue(null);
      }

      planControl?.updateValueAndValidity();
      voucherAmountControl?.updateValueAndValidity();
    });
    // }
    this.vourcharConfigForm.patchValue({
      status: "Active"
    });

    this.hideGeneateVoucherForm();

    this.voucherGenerateForm = this.fb.group({
      batchName: ["", Validators.required],
      voucherProfileId: [""],
      configName: ["", Validators.required],
      configId: [""],
      reseller: [""],
      lastModifiedBy: [""],
      linkType: [""],
      voucherAmount: [""]
    });
    this.VoucherBatchForm = this.fb.group({
      batchName: ["", Validators.required],
      voucherProfileId: [""],
      linkType: ["", Validators.required],
      planId: [""],
      resellerId: [""],
      voucherQuantity: ["", Validators.required],
      voucherAmount: [""]
      //createdBy: [''],
    });
  }

  //Used for pagination
  totalRecords: number;
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;

  pageChanged(pageNumber) {
    // this.hideGeneateVoucherForm();
    //this.reset();
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getAllVouchers("");
    } else {
      this.searchVoucher("");
    }
  }

  voucherTypeValue: String[] = ["UPPER_CASE", "NUMBER", "LOWER_CASE"];
  //   voucherTypeValue: String[] = ["UPPER_CASE", "NUMBER", "LOWER_CASE", "SYMBOL"];
  voucherData: any = [];

  editMode: boolean = false;
  changeStatusData: any[] = [];
  accessData: any = JSON.parse(localStorage.getItem("accessData"));

  getAllVouchers(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.voucherConfigService.getAllVouchers(page, size).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        } else {
          this.voucherData = response.voucherConfigurationList.data;
          this.totalRecords = response.voucherConfigurationList.totalRecords;
        }
      },
      error => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
        this.totalRecords = 0;
        this.voucherData = [];
      }
    );
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAllVouchers(this.showItemPerPage);
    }
    if (this.searchkey && this.currentPage == 1) {
      this.currentPage = 1;
      this.itemsPerPage = this.showItemPerPage;
    } else {
      this.searchVoucher("");
    }
  }

  getAllReseller() {
    this.voucherConfigService.getAllReseller().subscribe(
      (response: any) => {
        this.resellerData = response.resellers.data;
      },
      (error: any) => {
        if (error.status == 500) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
  selectedVoucherTypeValueForSearch = "";
  searchVoucher(searchData) {
    var f = "";
    var t = "";
    if (this.searchVoucherForm.value.fromDate) {
      f = this.datePipe.transform(this.searchVoucherForm.controls.fromDate.value, "yyyy-MM-dd");
    }
    if (this.searchVoucherForm.value.toDate) {
      t = this.datePipe.transform(this.searchVoucherForm.controls.toDate.value, "yyyy-MM-dd");
    }
    // this.currentPage = 1;

    this.searchSubmitted = true;
    this.hideGeneateVoucherForm();

    if (this.selectedVouchersForSearch != null) {
      this.selectedVoucherTypeValueForSearch = this.selectedVouchersForSearch.map(
        ({ name }) => name
      );
    }

    if (!this.searchkey || this.searchkey !== this.searchVoucherForm.value.voucherName) {
      this.currentPage = 1;
    }
    // this.currentPage = 1;
    //this.searchkey = 'keysearch';
    // this.voucherData = searchData;
    if (this.searchVoucherForm.valid) {
      this.voucherData = [];
      let userNameForSearch = this.searchVoucherForm.value.voucherName
        ? this.searchVoucherForm.value.voucherName
        : "";

      this.searchkey = userNameForSearch;
      this.voucherConfigService
        .searchVoucher(
          userNameForSearch,
          this.selectedVoucherTypeValueForSearch,
          f,
          t,
          this.currentPage,
          this.itemsPerPage
        )
        .subscribe(
          (response: any) => {
            //this.reset();
            this.voucherData = response.voucherConfigurationList.data;
            this.totalRecords = response.voucherConfigurationList.totalRecords;
            this.selectedVouchersForSearch = [];
          },
          (error: any) => {
            this.reset();
            this.totalRecords = 0;
            this.voucherData = [];
            if (error.error.status == 404) {
              this.totalRecords = 0;
              this.voucherData = [];
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            }
            this.selectedVouchersForSearch = [];
          }
        );
    }
  }

  selectedVoucherData: any = [];
  voucherConfig = {
    name: "",
    noOfVoucher: "",
    planName: "",
    validity: "",
    voucherCodeLength: "",
    prefix: "",
    status: "",
    suffix: "",
    voucherCodeFormat: [],
    createdBy: "",
    lastModifiedBy: "",
    voucherAmount: "",
    selectedVoucherType: "",
    linkType: ""
  };
  planDetail = {
    planName: ""
  };

  showVoucherDetail(voucherId, mvnoId) {
    this.modalToggle = true;

    this.hideGeneateVoucherForm();
    this.voucherConfigService.viewVoucherConfigDetail(voucherId, mvnoId).subscribe(
      response => {
        this.selectedVoucherData = response;
        this.voucherConfig = this.selectedVoucherData.voucherConfiguration;
        this.planDetail = this.selectedVoucherData.voucherConfiguration.plan;
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  voucherConfigIdForUpdate = "";
  editVoucherById(voucherId, index) {
    this.voucherConfigIdForUpdate = voucherId;
    this.hideGeneateVoucherForm();

    this.editMode = true;
    // index = this.radiusUtility.getIndexOfSelectedRecord(
    //   index,
    //   this.currentPage,
    //   this.itemsPerPage
    // );

    if (this.validateUserToPerformOperations(this.voucherData[index].mvnoId)) {
      let selectedValueArray = [];
      let type = this.voucherData[index].voucherCodeFormat;
      type.forEach(voucherCodeFormat => {
        let voucherType = this.voucherTypes.filter(x => x.name == voucherCodeFormat);
        selectedValueArray.push({
          id: voucherType[0].id,
          name: voucherType[0].name
        });
      });
      const plan = {
        //id: this.voucherData[index].plan.id,
        // name: this.voucherData[index].plan.name
      };
      this.vourcharConfigForm.patchValue({
        voucherName: this.voucherData[index].name,
        voucherCodeFormat: selectedValueArray,
        noOfVoucher: this.voucherData[index].noOfVoucher,
        voucherCodeLength: this.voucherData[index].voucherCodeLength,
        planId: this.voucherData[index].plan?.id,
        validity: this.voucherData[index].validity,
        prefix: this.voucherData[index].prefix,
        suffix: this.voucherData[index].suffix,
        status: this.voucherData[index].status,
        linkType: this.voucherData[index].linkType,
        voucherAmount: this.voucherData[index].voucherAmount,
        mvnoId: this.voucherData[index].mvnoId
      });
    }
  }

  modalToggle: boolean = true;
  validateUserToPerformOperations(selectedMvnoId) {
    let loggedInUserMvnoId = localStorage.getItem("mvnoId");
    let userId = localStorage.getItem("userId");
    if (userId != RadiusConstants.SUPERADMINID && selectedMvnoId != loggedInUserMvnoId) {
      this.reset();
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You are not authorized to do this operation. Please contact to the administrator",
        icon: "far fa-check-circle"
      });
      this.modalToggle = false;
      return false;
    }
    return true;
  }

  deleteConfirm(voucherId, index) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Voucher?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteVoucherById(voucherId, index);
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
        this.modalToggle = true;
        this.confirmationService.close();
      }
    });
  }

  deleteVoucherById(voucherId, index) {
    this.hideGeneateVoucherForm();
    this.voucherConfigService.deleteById(voucherId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && index == 0 && this.voucherData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.getAllVouchers("");
        }
        this.reset();
        this.voucherData = response;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      error => {
        if (error.error.status == 417) {
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
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
        this.clearFormData();
      }
    );
  }

  clearSearchForm() {
    this.clearFormData();
    this.hideGeneateVoucherForm();
    this.reset();
    this.currentPage = 1;
    this.searchVoucherForm.reset();
    this.getAllVouchers("");
  }

  clearFormData() {
    this.submitted = false;
    this.editMode = false;
    this.vourcharConfigForm.reset();
    this.vourcharConfigForm.patchValue({
      status: "Active"
    });
  }

  changeStatusToInActive(id, mvnoId, event) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(mvnoId)) {
      this.hideGeneateVoucherForm();
      this.voucherConfigService.changeVoucherConfigStatus(id, "Inactive", mvnoId).subscribe(
        (response: any) => {
          this.getAllVouchers("");
          this.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.changeStatusData = response;
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });

          this.reset();
        }
      );
    }
  }

  changeStatusToActive(id, mvnoId, event) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(mvnoId)) {
      this.hideGeneateVoucherForm();
      this.voucherConfigService.changeVoucherConfigStatus(id, "Active", mvnoId).subscribe(
        (response: any) => {
          this.getAllVouchers("");
          this.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.changeStatusData = response;
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });

          this.reset();
        }
      );
    }
  }

  reset() {
    this.clearFormData();
  }

  selectedVouchersForSearch: any = [];
  selectedVouchers: any = [];
  voucherTypes = [
    { id: 1, name: "UPPER_CASE" },
    { id: 2, name: "NUMBER" },
    { id: 3, name: "LOWER_CASE" }
    // { id: 4, name: "SYMBOL" }
  ];

  newVoucherData = {
    name: "",
    noOfVoucher: "",
    planId: "",
    validity: "",
    voucherCodeLength: "",
    prefix: "",
    status: "",
    suffix: "",
    voucherCodeFormat: [],
    mvnoId: "",
    createdBy: "",
    lastModifiedBy: "",
    linkType: "",
    voucherAmount: ""
  };

  newVoucherDataForUpdate = {
    id: "",
    name: "",
    noOfVoucher: "",
    planId: "",
    validity: "",
    voucherCodeLength: "",
    prefix: "",
    status: "",
    suffix: "",
    voucherCodeFormat: [],
    mvnoId: "",
    createdBy: "",
    lastModifiedBy: "",
    linkType: "",
    voucherAmount: ""
  };

  mapFormDataWithObject() {
    if (this.editMode) {
      this.newVoucherDataForUpdate.id = this.voucherConfigIdForUpdate;
      this.newVoucherDataForUpdate.name = this.vourcharConfigForm.value.voucherName;
      this.newVoucherDataForUpdate.noOfVoucher = this.vourcharConfigForm.value.noOfVoucher;
      this.newVoucherDataForUpdate.voucherCodeLength =
        this.vourcharConfigForm.value.voucherCodeLength;
      this.newVoucherDataForUpdate.planId = this.vourcharConfigForm.value.planId;
      this.newVoucherDataForUpdate.validity = this.vourcharConfigForm.value.validity;
      this.newVoucherDataForUpdate.suffix = this.vourcharConfigForm.value.suffix;
      this.newVoucherDataForUpdate.prefix = this.vourcharConfigForm.value.prefix;
      this.newVoucherDataForUpdate.status = this.vourcharConfigForm.value.status;
      this.newVoucherDataForUpdate.linkType = this.vourcharConfigForm.value.linkType;
      this.newVoucherDataForUpdate.voucherAmount = this.vourcharConfigForm.value.voucherAmount;
      if (this.vourcharConfigForm.value.voucherCodeFormat != null) {
        const selectedVoucherType = this.vourcharConfigForm.value.voucherCodeFormat.map(
          ({ name }) => name
        );
        this.newVoucherDataForUpdate.voucherCodeFormat = selectedVoucherType;
      }
      //   this.newVoucherDataForUpdate.mvnoId = this.vourcharConfigForm.value.mvnoName;
      this.newVoucherDataForUpdate.mvnoId = this.vourcharConfigForm.value.mvnoId;

      this.newVoucherDataForUpdate.createdBy = this.vourcharConfigForm.value.loggedInUser;
    } else {
      this.newVoucherData.name = this.vourcharConfigForm.value.voucherName;
      this.newVoucherData.noOfVoucher = this.vourcharConfigForm.value.noOfVoucher;
      this.newVoucherData.voucherCodeLength = this.vourcharConfigForm.value.voucherCodeLength;
      this.newVoucherData.planId = this.vourcharConfigForm.value.planId;
      this.newVoucherData.validity = this.vourcharConfigForm.value.validity;
      this.newVoucherData.suffix = this.vourcharConfigForm.value.suffix;
      this.newVoucherData.prefix = this.vourcharConfigForm.value.prefix;
      this.newVoucherData.status = this.vourcharConfigForm.value.status;
      this.newVoucherData.linkType = this.vourcharConfigForm.value.linkType;
      this.newVoucherData.voucherAmount = this.vourcharConfigForm.value.voucherAmount;
      let code = this.vourcharConfigForm.value.voucherCodeFormat;
      if (this.vourcharConfigForm.value.voucherCodeFormat) {
        const selectedVoucherType = code.map(({ name }) => name);
        this.newVoucherData.voucherCodeFormat = selectedVoucherType;
      }
      //   this.newVoucherData.mvnoId = this.vourcharConfigForm.value.mvnoName;
      this.newVoucherData.mvnoId = this.vourcharConfigForm.value.mvnoId;
    }
  }

  saveVoucherConfig() {
    this.submitted = true;
    if (this.vourcharConfigForm.valid) {
      this.mapFormDataWithObject();
      if (!this.editMode) {
        this.addVoucher();
      } else {
        this.updateVoucher();
      }
    }
  }

  addVoucher() {
    let userId = localStorage.getItem("userId");
    // if (userId == RadiusConstants.SUPERADMINID) {
    //   this.vourcharConfigForm.get("mvnoName").setValidators([Validators.required]);
    //   this.vourcharConfigForm.get("mvnoName").updateValueAndValidity();
    // }

    this.newVoucherData.createdBy = this.loggedInUser;
    this.newVoucherData.lastModifiedBy = "";
    let mvnoId = this.newVoucherData.mvnoId
      ? this.newVoucherData.mvnoId
      : localStorage.getItem("mvnoId");
    this.voucherConfigService.saveVoucherConfig(this.newVoucherData, mvnoId).subscribe(
      (response: any) => {
        this.reset();
        this.getAllVouchers("");
        this.voucherData = response;
        // this.vourcharConfigForm.get("mvnoName").clearValidators();
        // this.vourcharConfigForm.get("mvnoName").updateValueAndValidity();
        this.vourcharConfigForm.get("mvnoId").clearValidators();
        this.vourcharConfigForm.get("mvnoId").updateValueAndValidity();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  updateVoucher() {
    this.newVoucherDataForUpdate.lastModifiedBy = this.loggedInUser;
    this.voucherConfigService.updateVoucherConfig(this.newVoucherDataForUpdate).subscribe(
      (response: any) => {
        this.reset();
        this.getAllVouchers("");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        this.voucherData = response;
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  planData: any;

  getAllPlans(mvnoId?) {
    this.voucherConfigService.getValidPlans(mvnoId).subscribe(
      (response: any) => {
        this.planData = response.postpaidplanList;
        //this.getDetailsByMVNO(JSON.parse(localStorage.getItem('mvnoId')));
      },
      (error: any) => {
        if (error.status == 500) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  hideGeneateVoucherForm() {
    this.shownVoucherGenerate = true;
    this.shownVoucherConfig = false;
  }

  voucherConfigurationId = "";
  mvnoIdToGenerateVoucher: any;
  batchNoVoucher: number;
  voucherConfigId: number;
  resellerDropDown: any;
  generateVoucher(voucherConfigId, voucherConfigName, planId, noVoucher) {
    this.voucherGenerateForm.reset();
    this.voucherGenerateForm.patchValue({
      configName: voucherConfigName
    });
    this.voucherConfigId = voucherConfigId;
    this.shownVoucherConfig = true;
    this.shownVoucherGenerate = false;

    this.resellerDropDown = [];
    let selectedVoucherPlan;
    this.resellerDropDown = this.resellerData;
    this.batchPlanId = planId;
    this.batchNoVoucher = noVoucher;
    if (planId != null) {
      selectedVoucherPlan = this.planData.postpaidplanList.filter(
        element => element.planId == planId
      );

      let resellerFilterDataNew: any = [];
      let isMappedLocationFound: boolean = false;
      selectedVoucherPlan.forEach(item => {
        this.resellerData = this.resellerData.filter(element => element.status == "Active");
        if (item.planLocationsMapping != null) {
          item.planLocationsMapping.forEach(locationData => {
            this.resellerDropDown = [];
            this.resellerData.filter(element => {
              if (element.locationMaster.locationMasterId == locationData.locationId) {
                isMappedLocationFound = true;
                resellerFilterDataNew.push(element);
              }
            });
          });
        }
      });
      if (isMappedLocationFound) {
        this.resellerDropDown = resellerFilterDataNew;
      }
    }
  }

  generateVoucherData: any = [];
  generateSubmitted: boolean = false;
  submitToGenerateVoucher() {
    this.generateSubmitted = true;
    let batchName = this.voucherGenerateForm.value.batchName;

    if (this.voucherGenerateForm.valid) {
      // this.voucherConfigService
      //   .generateVoucher(
      //     this.voucherConfigurationId,
      //     batchName,
      //     this.mvnoIdToGenerateVoucher
      //   )
      //   .subscribe(
      //     (response: any) => {
      //       this.generateVoucherData = response;
      //       this.messageService.add({
      //         severity: 'success',
      //         summary: 'Successfully',
      //         detail: response.message,
      //         icon: 'far fa-check-circle',
      //       });
      //       this.generateSubmitted = false;
      //       this.VoucherBatchForm.reset();
      //       this.VoucherBatchForm.patchValue({
      //         batchName: this.voucherGenerateForm.value.batchName,
      //         planId: this.batchPlanId,
      //         voucherQuantity: this.batchNoVoucher,
      //         resellerId: this.voucherGenerateForm.value.reseller,
      //       });
      //       this.addVoucherBatch(this.mvnoIdToGenerateVoucher);
      //       this.currentPage = 1;
      //       this.voucherGenerateForm.reset();
      //
      // setTimeout(() => {
      //   this.currentPage = 1;
      //   this.hideGeneateVoucherForm();
      //   this.voucherGenerateForm.reset();
      // }, 1000);
      //   },
      //   (error) => {
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: error.error.errorMessage,
      //       icon: 'far fa-times-circle',
      //     });
      //
      //   }
      // );
      // console.log('check this : ', this.voucherConfigId);
      this.VoucherBatchForm.reset();
      this.VoucherBatchForm.patchValue({
        batchName: this.voucherGenerateForm.value.batchName,
        voucherProfileId: this.voucherConfigId,
        planId: this.batchPlanId,
        voucherQuantity: this.batchNoVoucher,
        resellerId: this.voucherGenerateForm.value.reseller
      });
      this.addVoucherBatch();
    }
  }

  addVoucherBatch() {
    this.VoucherBatchForm.value.createdBy = this.loggedInUser;
    this.voucherConfigService.generateVoucherBatch(this.VoucherBatchForm.value).subscribe(
      response => {
        this.currentPage = 1;

        this.voucherGenerateForm.reset();
        this.router.navigate(["/home/voucherBatch"]);
      },
      error => {
        if (error.error.status == 402) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
        this.currentPage = 1;
      }
    );
  }

  //   getDetailsByMVNO(mvnoId) {
  //     let allPlanList: Array<any> = this.planData.planList;
  //     this.filteredPlanList = [];
  //     if (mvnoId == RadiusConstants.SUPER_ADMIN_MVNO) {
  //       this.filteredPlanList = allPlanList;
  //     } else {
  //       this.filteredPlanList = allPlanList.filter(
  //         element => element.mvnoId == mvnoId || element.mvnoId == 1
  //       );
  //     }
  //   }

  mvnoChange(event) {
    this.getAllPlans(event.value);
  }

  changeToProfile() {
    this.showProfile = true;
  }
}
