import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { DiscountManagementService } from "src/app/service/discount-management.service";
import { Regex } from "src/app/constants/regex";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
@Component({
  selector: "app-discount-management",
  templateUrl: "./discount-management.component.html",
  styleUrls: ["./discount-management.component.css"]
})
export class DiscountManagementComponent implements OnInit {
  discountGroupForm: FormGroup;
  discountMapping: FormArray;
  discountPlanMapping: FormArray;
  submitted: boolean = false;
  planListData: any;
  currentPageDiscountMapping = 1;
  discountMappingitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  discountMappingtotalRecords: String;
  currentPageDiscountPlanMapping = 1;
  discountPlanMappingitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  discountPlanMappingtotalRecords: String;
  currentPageDiscount = 1;
  discountitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  discounttotalRecords: any;
  createDiscountData: any;
  discountListData: any;
  isDiscountEdit: boolean = false;
  viewDiscountListData: any;
  searchData: any;
  searchDiscountName: any = "";

  searchView: boolean = false;
  createView: boolean = false;
  discountDeatilsShow: boolean = true;
  discountMappingDatashow: boolean = false;

  discountPersonalData: any = [];
  discountMappingItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  discountMappingLISTtotalRecords: String;
  currentPagediscountMappingList = 1;
  DiscountMappingSubmitted: boolean = false;
  DiscountPlanMappingSubmitted: boolean = false;
  DiscountPlanMappingfromgroup: FormGroup;
  DiscountMappingfromgroup: FormGroup;
  AclClassConstants;
  AclConstants;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;
  discountType = [
    // { label: "Flat", value: "Flat" },
    { label: "Percentage", value: "Percentage" }
  ];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  statusOptions = RadiusConstants.status;
  public loginService: LoginService;
  dataPlanMappingList: any = [];
  planGroupData: any;
  planAllListData: any;
  mvnoTitle = RadiusConstants.MVNO;
  mvnoId = Number(localStorage.getItem("mvnoId"));
  selectedMvnoId: any;
  selectedPlan: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private discountManagementService: DiscountManagementService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.DISCOUNT_CREATE);
    this.deleteAccess = loginService.hasPermission(PRODUCTS.DISCOUNT_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.DISCOUNT_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isDiscountEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.discountGroupForm = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required],
      desc: ["", [Validators.required, Validators.pattern(Regex.characterlength255)]],
      mvnoId: [""]
    });
    const mvnoControl = this.discountGroupForm.get("mvnoId");

    if (this.mvnoId === 1) {
      mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();

    this.discountMapping = this.fb.array([]);
    this.discountPlanMapping = this.fb.array([]);

    this.DiscountMappingfromgroup = this.fb.group({
      amount: ["", [Validators.required, Validators.pattern(Regex.decimalNumber)]],
      discountType: ["", Validators.required],
      validFrom: ["", Validators.required],
      validUpto: ["", Validators.required],
      id: [""]
    });

    this.DiscountPlanMappingfromgroup = this.fb.group({
      planId: ["", Validators.required],
      id: [""]
    });

    this.getPlanListData();
    // this.onAddDiscountMappingField();
    // this.onAddDiscountPlanMappingField();
    this.getDiscountListData("");
    this.getPlanGroup();
    this.searchData = {
      filters: [
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

  createDiscount() {
    this.searchView = false;
    this.createView = true;
    this.discountDeatilsShow = false;
    this.discountMappingDatashow = false;

    this.submitted = false;
    this.isDiscountEdit = false;
    this.discountGroupForm.reset();
    this.discountMapping.reset();
    this.discountPlanMapping.reset();
    this.DiscountPlanMappingfromgroup.reset();
    this.DiscountMappingfromgroup.reset();
    this.discountPlanMapping.controls = [];
    this.discountMapping.controls = [];
    this.discountGroupForm.controls.status.setValue("");
    this.DiscountMappingfromgroup.controls.discountType.setValue("");
    this.DiscountPlanMappingfromgroup.controls.planId.setValue("");
  }

  listDiscount() {
    this.searchView = true;
    this.createView = false;
    this.discountDeatilsShow = true;
    this.discountMappingDatashow = false;
  }

  createDiscountMappingFormGroup(): FormGroup {
    return this.fb.group({
      amount: [
        this.DiscountMappingfromgroup.value.amount,
        [Validators.pattern(Regex.decimalNumber)]
      ],
      discountType: [this.DiscountMappingfromgroup.value.discountType],
      validFrom: [this.DiscountMappingfromgroup.value.validFrom],
      validUpto: [this.DiscountMappingfromgroup.value.validUpto],
      id: [""]
    });
  }

  createDiscountPlanMappingFormGroup(): FormGroup {
    return this.fb.group({
      planId: [this.DiscountPlanMappingfromgroup.value.planId],
      id: [""]
    });
  }

  onAddDiscountMappingField() {
    this.DiscountMappingSubmitted = true;
    if (this.DiscountMappingfromgroup.valid) {
      let newData = this.DiscountMappingfromgroup.value;
      const isDuplicate = this.discountMapping.value?.some(
        item =>
          item.amount === newData.amount &&
          item.discountType === newData.discountType &&
          item.validFrom === newData.validFrom &&
          item.validUpto === newData.validUpto
      );

      if (isDuplicate) {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "This discount already exists.",
          icon: "far fa-times-circle"
        });
      } else {
        this.discountMapping.push(this.createDiscountMappingFormGroup());
        this.DiscountMappingfromgroup.reset();
        this.DiscountMappingSubmitted = false;
      }
    } else {
      // console.log('I am not valid')
    }
  }

  onAddDiscountPlanMappingField() {
    this.DiscountPlanMappingSubmitted = true;
    if (this.DiscountPlanMappingfromgroup.valid) {
      let newData = this.DiscountPlanMappingfromgroup.value;

      const existingPlans = this.discountPlanMapping.value;

      const isDuplicate = existingPlans?.some((item: any) => item.planId === newData.planId);

      if (isDuplicate) {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "This discount plan already exists.",
          icon: "far fa-times-circle"
        });
      } else {
        this.discountPlanMapping.push(this.createDiscountPlanMappingFormGroup());
        this.DiscountPlanMappingfromgroup.reset();
        this.DiscountPlanMappingSubmitted = false;
      }
    } else {
      // console.log('I am not valid')
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageDiscount > 1) {
      this.currentPageDiscount = 1;
    }
    if (!this.searchkey) {
      this.getDiscountListData(this.showItemPerPage);
    } else {
      this.searchDiscount();
    }
  }

  getDiscountListData(size) {
    let page_list;
    this.searchkey = "";
    if (size) {
      page_list = size;
      this.discountitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 1) {
        this.discountitemsPerPage = this.pageITEM;
      } else {
        this.discountitemsPerPage = this.showItemPerPage;
      }
    }
    const url = "/discounts/all?mvnoId=" + localStorage.getItem("mvnoId");
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.discountListData = response.discountList;
        if (this.showItemPerPage > this.discountitemsPerPage) {
          this.totalDataListLength = this.discountListData.length % this.showItemPerPage;
        } else {
          this.totalDataListLength = this.discountListData.length % this.discountitemsPerPage;
        }
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

  getPlanListData() {
    const url = `/postpaidplan/all?mvnoId=${localStorage.getItem("mvnoId")}`;
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.planAllListData = response.postpaidplanList;
        // console.log('this.planListData', this.planListData)
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

  addEditDiscount(discountId) {
    this.submitted = true;

    if (this.discountGroupForm.valid) {
      if (discountId) {
        this.createDiscountData = this.discountGroupForm.value;
        this.createDiscountData.discoundMappingList = this.discountMapping.value;
        this.createDiscountData.discoundPlanMappingList = this.discountPlanMapping.value;
        // console.log('this.createDiscountData', this.createDiscountData)
        const url = "/discounts/" + discountId;
        if (this.createDiscountData.discoundMappingList.length > 0) {
          let mvnoId =
            localStorage.getItem("mvnoId") === "1"
              ? this.discountGroupForm.value?.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          this.createDiscountData.mvnoId = mvnoId;
          this.discountManagementService.updateMethod(url, this.createDiscountData).subscribe(
            (response: any) => {
              this.discountGroupForm.reset();
              this.discountMapping.reset();
              this.discountPlanMapping.reset();
              this.DiscountPlanMappingfromgroup.reset();
              this.DiscountMappingfromgroup.reset();
              this.discountPlanMapping.controls = [];
              this.discountMapping.controls = [];
              if (!this.searchkey) {
                this.getDiscountListData("");
              } else {
                this.searchDiscount();
              }
              this.isDiscountEdit = false;
              this.discountDeatilsShow = true;
              this.searchView = false;
              this.createView = false;
              this.discountMappingDatashow = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
            },
            (error: any) => {
              // console.log(error, 'error')
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
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Required ",
            detail: "Minimum one  Discount Mapping Details need to add",
            icon: "far fa-times-circle"
          });
        }
      } else {
        this.createDiscountData = this.discountGroupForm.value;
        this.createDiscountData.discoundMappingList = this.discountMapping.value;
        this.createDiscountData.discoundPlanMappingList = this.discountPlanMapping.value;
        // console.log('this.createDiscountData', this.createDiscountData)
        const url = "/discounts";
        let mvnoId =
          localStorage.getItem("mvnoId") === "1"
            ? this.discountGroupForm.value?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        if (this.createDiscountData.discoundMappingList.length > 0) {
          this.createDiscountData.mvnoId = mvnoId;
          this.discountManagementService.postMethod(url, this.createDiscountData).subscribe(
            (response: any) => {
              this.discountGroupForm.reset();
              this.discountMapping.reset();
              this.discountPlanMapping.reset();
              this.DiscountPlanMappingfromgroup.reset();
              this.DiscountMappingfromgroup.reset();
              if (!this.searchkey) {
                this.getDiscountListData("");
              } else {
                this.searchDiscount();
              }
              this.discountPlanMapping.controls = [];
              this.discountMapping.controls = [];

              this.discountDeatilsShow = true;
              this.searchView = false;
              this.createView = false;
              this.discountMappingDatashow = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
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
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Required ",
            detail: "Minimum one  Discount Mapping Details need to add",
            icon: "far fa-times-circle"
          });
        }
      }
    }
  }

  editDiscount(discountId) {
    this.discountDeatilsShow = false;
    this.searchView = false;
    this.createView = true;
    this.discountMappingDatashow = false;
    if (discountId) {
      const url = "/discounts/" + discountId;
      this.discountManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isDiscountEdit = true;
          this.viewDiscountListData = response.discountList;
          // console.log(' this.viewCountryListData', response)
          this.discountGroupForm.patchValue(this.viewDiscountListData);

          this.discountMapping = this.fb.array([]);
          this.viewDiscountListData.discoundMappingList.forEach(element => {
            this.discountMapping.push(this.fb.group(element));
            this.DiscountMappingfromgroup.patchValue(this.fb.group(element));
          });

          this.discountPlanMapping = this.fb.array([]);

          this.viewDiscountListData.discoundPlanMappingList.forEach(element => {
            this.discountPlanMapping.push(this.fb.group(element));
            this.DiscountPlanMappingfromgroup.patchValue(this.fb.group(element));
          });

          this.discountPlanMapping.patchValue(this.viewDiscountListData.discoundPlanMappingList);
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

  searchDiscount() {
    if (!this.searchkey || this.searchkey !== this.searchDiscountName) {
      this.currentPageDiscount = 1;
    }
    this.searchkey = this.searchDiscountName;
    if (this.showItemPerPage == 1) {
      this.discountitemsPerPage = this.pageITEM;
    } else {
      this.discountitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchDiscountName.trim();
    const url = "/discounts/search?mvnoId=" + localStorage.getItem("mvnoId");
    // console.log('this.searchData', this.searchData)
    this.discountManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.discountListData = response.discountList;
        if (this.showItemPerPage > this.discountitemsPerPage) {
          this.totalDataListLength = this.discountListData.length % this.showItemPerPage;
        } else {
          this.totalDataListLength = this.discountListData.length % this.discountitemsPerPage;
        }
      },
      (error: any) => {
        this.discounttotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.discountListData = [];
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

  clearSearchDiscount() {
    this.searchDiscountName = "";
    this.getDiscountListData("");
  }

  canExit() {
    if (
      !this.discountGroupForm.dirty &&
      !this.DiscountMappingfromgroup.dirty &&
      !this.DiscountPlanMappingfromgroup.dirty
    )
      return true;
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
  deleteConfirmonDiscountMappingField(
    discountMappingFieldIndex: number,
    discountMappingFieldId: number
  ) {
    if (discountMappingFieldIndex || discountMappingFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Discount Mapping Attribute?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemovediscountMapping(discountMappingFieldIndex, discountMappingFieldId);
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

  async onRemovediscountMapping(discountMappingFieldIndex: number, discountMappingFieldId: number) {
    this.discountMapping.removeAt(discountMappingFieldIndex);
  }

  deleteConfirmonDiscountPlanMappingField(
    discountPlanMappingFieldIndex: number,
    discountPlanMappingFieldId: number
  ) {
    if (discountPlanMappingFieldIndex || discountPlanMappingFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Discount Plan Mapping Attribute?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemovediscountPlanMapping(
            discountPlanMappingFieldIndex,
            discountPlanMappingFieldId
          );
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

  async onRemovediscountPlanMapping(
    discountPlanMappingFieldIndex: number,
    discountPlanMappingFieldId: number
  ) {
    this.discountPlanMapping.removeAt(discountPlanMappingFieldIndex);
  }

  deleteConfirmonCountry(discountId: number) {
    if (discountId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Discount?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteDiscount(discountId);
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

  deleteDiscount(discountId) {
    const url = "/discounts/" + discountId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.discountManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageDiscount != 1 && this.totalDataListLength == 1) {
          this.currentPageDiscount = this.currentPageDiscount - 1;
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        if (!this.searchkey) {
          this.getDiscountListData("");
        } else {
          this.searchDiscount();
        }
      },
      (error: any) => {
        // console.log(error, 'error')
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
  }

  pageChangedDiscountMapping(pageNumber) {
    this.currentPageDiscountMapping = pageNumber;
  }

  pageChangedDiscountPlanMapping(pageNumber) {
    this.currentPageDiscountPlanMapping = pageNumber;
  }

  pageChangedDiscount(pageNumber) {
    this.currentPageDiscount = pageNumber;
    if (!this.searchkey) {
      this.getDiscountListData("");
    } else {
      this.searchDiscount();
    }
  }

  discountPersonaDetails(data) {
    this.dataPlanMappingList = [];
    let plandatalength = 0;
    this.discountMappingDatashow = true;
    this.discountDeatilsShow = false;
    this.createView = false;
    this.searchView = false;

    this.discountPersonalData = data;

    //discoundPlanMappingList deatils
    while (plandatalength < this.discountPersonalData.discoundPlanMappingList.length) {
      let planurl =
        "/postpaidplan/" +
        this.discountPersonalData.discoundPlanMappingList[plandatalength].planId +
        "?mvnoId=" +
        localStorage.getItem("mvnoId");
      this.discountManagementService.getMethod(planurl).subscribe((response: any) => {
        this.dataPlanMappingList.push(response.postPaidPlan.name);
      });
      plandatalength++;
    }
  }
  pageChangedDiscountPersonaList(pageNumber) {
    this.currentPagediscountMappingList = pageNumber;
  }

  getPlanGroup() {
    const url = "/commonList/planGroup";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.planGroupData = response.dataList;
        let data = {
          text: "All",
          value: "All"
        };
        this.planGroupData.unshift(data);
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

  selPlanGroup(event) {
    this.getPlanListbyGroup(event.value, this.selectedMvnoId);
    this.selectedPlan = event.value;
  }

  getPlanListbyGroup(group: any, mvnoId: any) {
    let actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    const url = "/postpaidplan/all?planGroup=" + group + "&mvnoId=" + actualMvnoId;
    this.discountManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planListData = response.postpaidplanList;
        // console.log('this.planListData', this.planListData)
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

  amountValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }

  mvnoChange(event) {
    this.selectedMvnoId = event.value;
    this.getPlanListbyGroup(this.selectedPlan, this.selectedMvnoId);
  }
}
