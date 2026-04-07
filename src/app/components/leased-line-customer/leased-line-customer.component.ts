import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { LeasedLineCustomerService } from "src/app/service/leased-line-customer.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Regex } from "src/app/constants/regex";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { ThisReceiver } from "@angular/compiler";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-leased-line-customer",
  templateUrl: "./leased-line-customer.component.html",
  styleUrls: ["./leased-line-customer.component.css"]
})
export class LeasedLineCustomerComponent implements OnInit {
  AclClassConstants;
  AclConstants;
  createAccess: boolean = false;
  editAccess: boolean = false;
  deleteAccess: boolean = false;
  public loginService: LoginService;
  llcGroupForm: FormGroup;
  llcDetailArray: FormArray;
  llcDetailForm: FormGroup;
  submitted: boolean = false;
  isLlcEdit: boolean = false;
  createView: boolean = false;
  listView: boolean = true;
  detailView: boolean = false;
  llcDetailSubmitted: boolean = false;
  llcDetailArrayitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  llcDetailArraytotalRecords: String;
  currentPagellcDetailArraydata = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  currentPageLlcListdata = 1;
  LlcListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  LlcListdatatotalRecords: any;
  llcListData: any;
  createLlcData: any;
  viewLlcData: any = {
    llcDetailsList: [{}]
  };
  searchData: any;
  searchLlcName: any = "";
  llcDetailItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  llcDetailtotalRecords: String;
  currentPagellcDetailList = 1;
  planData: any;
  devicetype = [
    { label: "Router", value: "Router" },
    { label: "ONU", value: "ONU" }
  ];

  typeSelect = [
    { label: "L2", value: "L2" },
    { label: "L3", value: "L3" },
    { label: "SIP", value: "SIP" },
    { label: "Internet", value: "Internet" }
  ];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private leasedLineCustomerService: LeasedLineCustomerService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(PRE_CUST_CONSTANTS.PRE_CUST_LEASED_LINE_CREATE);

    this.editAccess = loginService.hasPermission(PRE_CUST_CONSTANTS.PRE_CUST_LEASED_LINE_EDIT);
    this.deleteAccess = loginService.hasPermission(PRE_CUST_CONSTANTS.PRE_CUST_LEASED_LINE_DELETE);

    // this.isLlcEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.llcGroupForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      businessName: ["", Validators.required],
      billingAddress: ["", Validators.required],
      technicalPersonName: ["", Validators.required],
      technicalPersonContactNo: ["", [Validators.required, Validators.pattern(Regex.numeric)]]
    });
    this.llcDetailForm = this.fb.group({
      llcIdentifier: [""],
      llcLabel: ["", [Validators.required]],
      llcType: ["", Validators.required],
      packageId: ["", Validators.required],
      llcStaticIP: ["", Validators.required],
      llcDeviceType: ["", Validators.required]
    });
    this.llcDetailArray = this.fb.array([]);
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
    // this.getLlcDataList("");
    this.getPlan();
  }

  createLlc() {
    this.listView = false;
    this.createView = true;
    this.submitted = false;
    this.isLlcEdit = false;
    this.detailView = false;
    this.llcGroupForm.reset();
    this.llcDetailArray.controls = [];
  }

  listLlc() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.getLlcDataList("");
  }

  getLlcDataList(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPageLlcListdata;
    if (list) {
      size = list;
      this.LlcListdataitemsPerPage = list;
    } else {
      size = this.LlcListdataitemsPerPage;
    }

    let data = {
      page: page,
      pageSize: size
    };
    const url = "/leasedlinecustomers/list";
    this.leasedLineCustomerService.postMethod(url, data).subscribe(
      (response: any) => {
        this.llcListData = response.leasedlinecustomersList;
        this.LlcListdatatotalRecords = response.pageDetails.totalRecords;
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

  getPlan() {
    const url = `/postpaidplan/all?mvnoId=${localStorage.getItem("mvnoId")}`;
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        // this.planData = response.postpaidplanList;
        if (response.postpaidplanList) {
          this.planData = response.postpaidplanList.filter(
            plan =>
              (plan.serviceId =
                plan.planGroup === "Registration" || plan.planGroup === "Registration and Renewal")
          );
        } else {
          this.planData = [];
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

  searchLlc() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPageLlcListdata = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage) {
      this.LlcListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchLlcName.trim();
    this.searchData.page = this.currentPageLlcListdata;
    this.searchData.pageSize = this.LlcListdataitemsPerPage;
    const url = "/leasedlinecustomers/search?mvnoId=" + localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.leasedLineCustomerService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.llcListData = response.leasedlinecustomersList;
        this.LlcListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.LlcListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.llcListData = [];
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

  clearSearchLlc() {
    this.searchLlcName = "";
    this.getLlcDataList("");
  }

  detailLlc(id) {
    this.listView = false;
    this.createView = false;
    this.detailView = true;
    this.getLlcById(id);
  }

  addEditLlc(id) {
    this.submitted = true;
    if (this.llcGroupForm.valid) {
      if (id) {
        this.createLlcData = this.llcGroupForm.value;
        this.createLlcData.llcDetailsList = this.llcDetailArray.value;
        //console.log(" this.createLlcData", this.createLlcData);
        const url = "/leasedlinecustomers/" + id;
        this.leasedLineCustomerService.updateMethod(url, this.createLlcData).subscribe(
          (response: any) => {
            this.llcGroupForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.submitted = false;
            if (!this.searchkey) {
              this.getLlcDataList("");
            } else {
              this.searchLlc();
            }
            this.listView = true;
            this.createView = false;
            this.detailView = false;
            this.isLlcEdit = false;
            this.llcDetailArray.controls = [];
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
      } else {
        this.createLlcData = this.llcGroupForm.value;
        this.createLlcData.llcDetailsList = this.llcDetailArray.value;
        //console.log(" this.createLlcData", this.createLlcData);
        const url = "/leasedlinecustomers";
        this.leasedLineCustomerService.postMethod(url, this.createLlcData).subscribe(
          (response: any) => {
            this.llcGroupForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.submitted = false;
            if (!this.searchkey) {
              this.getLlcDataList("");
            } else {
              this.searchLlc();
            }
            this.listView = true;
            this.createView = false;
            this.detailView = false;
            this.llcDetailArray.controls = [];
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
    }
  }

  createllcDetailFormGroup(): FormGroup {
    return this.fb.group({
      llcIdentifier: [this.llcDetailForm.value.llcIdentifier],
      llcLabel: [this.llcDetailForm.value.llcLabel],
      llcType: [this.llcDetailForm.value.llcType],
      packageId: [this.llcDetailForm.value.packageId],
      llcStaticIP: [this.llcDetailForm.value.llcStaticIP],
      llcDeviceType: [this.llcDetailForm.value.llcDeviceType],
      id: [""]
    });
  }

  onAddllcDetailField() {
    this.llcDetailSubmitted = true;
    if (this.llcDetailForm.valid) {
      this.llcDetailArray.push(this.createllcDetailFormGroup());
      this.llcDetailForm.reset();
      this.llcDetailSubmitted = false;
    } else {
      // console.log("I am not valid");
    }
  }

  editLlc(id) {
    this.getLlcById(id);
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.llcGroupForm.reset();
    this.llcDetailForm.reset();

    this.isLlcEdit = true;
  }

  getLlcById(id) {
    const url = "/leasedlinecustomers/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.leasedLineCustomerService.getMethod(url).subscribe(
      (response: any) => {
        this.viewLlcData = response.leasedLineCustomersData;
        this.llcGroupForm.patchValue({
          name: this.viewLlcData.name,
          email: this.viewLlcData.email,
          businessName: this.viewLlcData.businessName,
          billingAddress: this.viewLlcData.billingAddress,
          technicalPersonName: this.viewLlcData.technicalPersonName,
          technicalPersonContactNo: this.viewLlcData.technicalPersonContactNo
        });
        this.llcDetailArray = this.fb.array([]);
        this.viewLlcData.llcDetailsList.forEach(element => {
          this.llcDetailArray.push(this.fb.group(element));
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

  deleteConfirmonLlcDetailField(llcDetailFieldIndex: number, llcDetailFieldId: number) {
    if (llcDetailFieldIndex || llcDetailFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Lease Line Customer details?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveTaxTypeTiered(llcDetailFieldIndex, llcDetailFieldId);
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

  async onRemoveTaxTypeTiered(llcDetailFieldIndex: number, llcDetailFieldId: number) {
    this.llcDetailArray.removeAt(llcDetailFieldIndex);
  }

  deleteConfirmonLlc(id) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Leased Line Customer?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteLlc(id);
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

  deleteLlc(id) {
    const url = "/leasedlinecustomers/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.leasedLineCustomerService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageLlcListdata != 1 && this.llcListData.length == 1) {
          this.currentPageLlcListdata = this.currentPageLlcListdata - 1;
        }
        if (!this.searchkey) {
          this.getLlcDataList("");
        } else {
          this.searchLlc();
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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

  pageChangedTaxTiered(pageNumber) {
    this.currentPagellcDetailArraydata = pageNumber;
  }

  pageChangedllcDetailbList(pageNumber) {
    this.currentPagellcDetailList = pageNumber;
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageLlcListdata > 1) {
      this.currentPageLlcListdata = 1;
    }
    if (!this.searchkey) {
      this.getLlcDataList(this.showItemPerPage);
    } else {
      this.searchLlc();
    }
  }

  pageChangedTaxList(pageNumber) {
    this.currentPageLlcListdata = pageNumber;
    if (!this.searchkey) {
      this.getLlcDataList("");
    } else {
      this.searchLlc();
    }
  }
  canExit() {
    if (!this.llcGroupForm.dirty && !this.llcDetailForm.dirty) return true;
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
}
