import { Component, ElementRef, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { TimebasepolicyService } from "src/app/service/timebasepolicy.service";
import { TimeBasePolicy } from "../model/time-base-policy";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { QosPolicyService } from "src/app/service/qos-policy.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
  selector: "app-time-base-policy",
  templateUrl: "./time-base-policy.component.html",
  styleUrls: ["./time-base-policy.component.css"]
})
export class TimeBasePolicyComponent implements OnInit {
  basic = true;
  submitted = false;
  searchSubmitted = false;
  policyForm: FormGroup;
  policyName: String;
  policyId: number;
  //Used and required for pagination
  totalRecords: number;
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  createPolicyData: TimeBasePolicy;
  editMode: boolean = false;
  status = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" }
  ];
  access = [
    { label: "Allow", value: true },
    { label: "Not Allow", value: false }
  ];
  showProfile: boolean = false;
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  // new changes
  allTimeBasePolicyList: any[] = [];
  filteredPolicyList: any[] = [];
  showDialogue: boolean = false;
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  weekDaysList = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" }
  ];
  // editPolicyData: TimeBasePolicy
  editPolicyData: any = [];
  fromTime: string;
  toTime: string;
  policyDetailsArray: FormArray;
  showSearch: any;
  showTable: boolean;
  showForm: boolean;

  createtimePolicyFlag = false;
  timePolicyGridFlag = false;
  filteredLocationList: any[];
  searchData: any = [];
  policyDetails: any = [];
  searchName: any = "";
  PolicyMappingDetails: any = [];
  qosPolicyData: any = [];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  mvnoTitle = RadiusConstants.MVNO;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private timeBasePolicyService: TimebasepolicyService,
    private radiusUtility: RadiusUtility,
    loginService: LoginService,
    private commondropdownService: CommondropdownService,
    private qospolicyservice: QosPolicyService
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.TIME_POLICY_CREATE);
    this.deleteAccess = loginService.hasPermission(PRODUCTS.TIME_POLICY_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.TIME_POLICY_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.policyDetailsArray = this.fb.array([]);
    // this.editMode = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = Number(localStorage.getItem("mvnoId"));
    this.policyForm = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required],
      //   mvnoId: [this.mvnoId],
      createdByName: [""],
      lastModifiedByName: [""],
      id: [""],
      mvnoId: [""]
    });
    const mvnoControl = this.policyForm.get("mvnoId");

    if (this.mvnoId === 1) {
      mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();

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
    this.onAddAttribute();
    this.findAllTimeBasedPolicy("");
  }

  CreateUpdatetimePolicy() {
    this.createtimePolicyFlag = true;
    this.timePolicyGridFlag = false;
    this.editMode = false;
    this.searchName = "";
    this.clearFormData();
    this.getQosPolicy();
    // this.radiusUtility.getFocus(this.policyForm, this.el);
  }

  timePolicyListData() {
    this.createtimePolicyFlag = false;
    this.timePolicyGridFlag = true;
    this.editMode = false;
    this.currentPage = 1;
    this.searchName = "";
    this.findAllTimeBasedPolicy("");
  }

  deleteConfirmArray(index) {
    // console.log(product);
    this.policyDetailsArray.removeAt(index);
  }

  onAddAttribute() {
    this.policyDetailsArray.push(this.createPolicyDetailsForm());
  }

  createPolicyDetailsForm(): FormGroup {
    return this.fb.group({
      identityKey: [""],
      detailsid: [""],
      fromDay: ["", Validators.required],
      toDay: ["", Validators.required],
      fromTime: ["", Validators.required],
      toTime: ["", Validators.required],
      // speed: ['', Validators.required],
      qqsid: ["", Validators.required],
      access: [""],
      isFreeQuota: [""]
    });
  }

  async findAllTimeBasedPolicy(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }

    let data = {
      page: page,
      pageSize: size
    };
    this.filteredPolicyList = [];
    this.timeBasePolicyService.getAlltimebasepolicywithpagination(data).subscribe(
      (response: any) => {
        if (response.responseCode == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.filteredPolicyList = [];
          this.totalRecords = 0;
        } else {
          this.filteredPolicyList = response.dataList;
          this.totalRecords = response.totalRecords;
        }
      },
      (error: any) => {
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
        this.filteredPolicyList = [];
      }
    );
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllTimeBasedPolicy(this.showItemPerPage);
    } else {
      this.searchPolicyByName();
    }
  }

  searchPolicyByName() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPage = 1;
    }

    this.searchSubmitted = true;
    this.createtimePolicyFlag = false;
    this.timePolicyGridFlag = true;
    this.filteredPolicyList = [];
    let name = this.searchName ? this.searchName.trim() : "";

    this.searchkey = name;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = name;

    this.timeBasePolicyService
      .searchbasepolicy(this.currentPage, this.itemsPerPage, this.searchData)
      .subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            this.filteredPolicyList = [];
            this.totalRecords = 0;
          } else {
            this.filteredPolicyList = response.dataList;
            this.totalRecords = response.totalRecords;
          }
        },
        (error: any) => {
          this.filteredPolicyList = [];
          this.totalRecords = 0;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.response.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
  }
  clearSearchForm() {
    this.clearFormData();
    this.searchSubmitted = false;
    this.searchName = "";
    this.currentPage = 1;
    this.findAllTimeBasedPolicy("");
    this.createtimePolicyFlag = false;
    this.timePolicyGridFlag = false;
  }

  clearFormData() {
    this.editMode = false;
    this.submitted = false;
    this.policyForm.reset();
    this.policyDetailsArray.reset();
    this.policyDetailsArray = this.fb.array([]);
    this.onAddAttribute();
    this.searchName = "";
  }

  canExit() {
    if (!this.policyForm.dirty) return true;
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
  deleteConfirm(data, selectedMvnoId, index) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Time Base Policy ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deletePolicy(data, index);
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
  async deletePolicy(data, index) {
    data.mvnoId =
      Number(localStorage.getItem("mvnoId")) == 1
        ? data.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    this.timeBasePolicyService.deletePolicy(data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (this.currentPage != 1 && index == 0 && this.filteredPolicyList.length == 1) {
            this.currentPage = this.currentPage - 1;
          }
          if (!this.searchkey) {
            this.findAllTimeBasedPolicy("");
          } else {
            this.searchPolicyByName();
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        } else if (response.responseCode == 405 || response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
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
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  async editPolicyDetailById(id) {
    this.policyDetailsArray = this.fb.array([]);
    this.editMode = true;
    this.createtimePolicyFlag = true;
    this.timePolicyGridFlag = false;
    this.getQosPolicy();
    this.timeBasePolicyService.getPolicyById(id).subscribe(
      (response: any) => {
        let policyData = response.data;
        let policyMappingData = response.data.timeBasePolicyDetailsList;

        this.policyForm.patchValue({
          id: policyData.id,
          name: policyData.name,
          mvnoId: policyData.mvnoId,
          status: policyData.status,
          createdByName: policyData.createdByName,
          lastModifiedByName: policyData.lastModifiedByName
        });

        policyMappingData.forEach(details => {
          this.policyDetailsArray.push(
            this.fb.group({
              fromDay: details.fromDay,
              toDay: details.toDay,
              fromTime: this.formatTime(details.fromTime),
              toTime: this.formatTime(details.toTime),
              // speed: details.speed,
              qqsid: details.qqsid,
              access: details.access,
              detailsid: details.detailsid,
              isFreeQuota: details.isFreeQuota
            })
          );
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

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllTimeBasedPolicy("");
    } else {
      this.searchPolicyByName();
    }
  }
  closeModal() {
    this.showDialogue = false;
  }
  async getPolicyDetails(policyId) {
    this.timeBasePolicyService.getPolicyById(policyId).subscribe(
      (response: any) => {
        this.policyDetails = response.data;
        this.showDialogue = true;
        this.PolicyMappingDetails = response.data.timeBasePolicyDetailsList;
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

  savePolicy() {
    this.submitted = true;

    if (this.policyForm.valid && this.policyDetailsArray.valid) {
      this.policyDetailsArray.value.forEach(details => {
        details.fromTime = this.formatTime(details.fromTime);
        details.toTime = this.formatTime(details.toTime);
      });

      if (this.editMode) {
        this.editPolicyData.lastModifiedBy = this.loggedInUser;
        this.updatePolicy();
      } else {
        this.addNewPolicy();
      }
    }
  }

  updatePolicy() {
    this.createPolicyData = this.policyForm.value;
    this.createPolicyData.mvnoId = Number(localStorage.getItem("mvnoId"));
    this.createPolicyData.lastModifiedByName = this.loggedInUser;
    let mvnoId =
      Number(localStorage.getItem("mvnoId")) === 1
        ? this.policyForm.controls?.mvnoId?.value
        : Number(localStorage.getItem("mvnoId"));
    this.createPolicyData.timeBasePolicyDetailsList = this.policyDetailsArray.value;
    this.timeBasePolicyService.updatePolicyDetails(this.createPolicyData, mvnoId).subscribe(
      (res: any) => {
        if (!this.searchkey) {
          this.findAllTimeBasedPolicy("");
        } else {
          this.searchPolicyByName();
        }
        this.clearFormData();
        this.createtimePolicyFlag = false;
        this.timePolicyGridFlag = true;
        if (res.responseCode == 406 || res.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: res.responseMessage,
            icon: "far fa-check-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: res.responseMessage,
            icon: "far fa-check-circle"
          });
        }
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

  addNewPolicy() {
    this.createPolicyData = this.policyForm.value;
    this.createPolicyData.createdByName = this.loggedInUser;
    this.createPolicyData.mvnoId = Number(localStorage.getItem("mvnoId"));
    this.createPolicyData.timeBasePolicyDetailsList = this.policyDetailsArray.value;
    let mvnoId =
      Number(localStorage.getItem("mvnoId")) === 1
        ? this.policyForm.controls?.mvnoId?.value
        : Number(localStorage.getItem("mvnoId"));
    this.timeBasePolicyService.addNewPolicyDetails(this.createPolicyData, mvnoId).subscribe(
      (res: any) => {
        if (res.responseCode == 200) {
          this.clearFormData();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: res.message,
            icon: "far fa-check-circle"
          });
          this.createtimePolicyFlag = false;
          this.timePolicyGridFlag = true;
          this.findAllTimeBasedPolicy("");
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
          });
        }
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
  formatTime(fromTime) {
    if (typeof fromTime != "string") {
      let hour = new Date(fromTime).getHours();
      let min = new Date(fromTime).getMinutes();
      if (hour < 10) {
        if (min < 10) {
          fromTime = `0${hour}:0${min}`;
        } else {
          fromTime = `0${hour}:${min}`;
        }
      } else {
        if (min < 10) {
          fromTime = `${hour}:0${min}`;
        } else {
          fromTime = `${hour}:${min}`;
        }
      }
      return fromTime;
    } else {
      return fromTime;
    }
  }

  // updateValue() {
  //   let formValues = this.policyForm.getRawValue()

  //   let detailsFormValue: TimeBasePolicyDetails[] = this.policyDetailsArray.getRawValue()
  //   let finalDetailsMapping: TimeBasePolicyDetails[] = []
  //   let newtimebaseLocation = []
  //   if (!this.editMode) {
  //     detailsFormValue.forEach((details) => {
  //       details.fromTime = this.formatTime(details.fromTime)
  //       details.toTime = this.formatTime(details.toTime)
  //       finalDetailsMapping.push(details)
  //     })
  //   } else {
  //     detailsFormValue.forEach((details) => {
  //       details.policyId = this.editPolicyData.policyId
  //       details.fromTime = this.formatTime(details.fromTime)
  //       details.toTime = this.formatTime(details.toTime)
  //       finalDetailsMapping.push(details)
  //     })
  //   }

  //   if (!this.editMode) {
  //     this.editPolicyData = {
  //       policyId: null,
  //       policyName: formValues.policyName,
  //       policyDetailsMapping: finalDetailsMapping,
  //       status: formValues.status,
  //       mvnoId: formValues.mvnoName ? formValues.mvnoName : this.mvnoId,
  //       lastModifiedBy: '',
  //       createdBy: this.loggedInUser,
  //     }
  //   } else {
  //     this.editPolicyData.policyName = formValues.policyName
  //     this.editPolicyData.status = formValues.status
  //     this.editPolicyData.mvnoId = formValues.mvnoName
  //       ? formValues.mvnoName
  //       : this.mvnoId

  //     this.editPolicyData.policyDetailsMapping = finalDetailsMapping
  //     this.editPolicyData.lastModifiedBy = ''
  //     this.editPolicyData.createdBy = this.loggedInUser
  //   }
  // }

  getQosPolicy(mvnoId?) {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    const url = "/qosPolicy/all?mvnoId=" + actualMvnoId;
    this.qospolicyservice.getMethod(url).subscribe(
      (response: any) => {
        this.qosPolicyData = response.dataList;
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
