import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BillRunMaster } from "src/app/components/model/billrunMaster";
import { Data } from "@angular/router";
import { Router, ActivatedRoute } from "@angular/router";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";

@Component({
  selector: "app-bill-run-master",
  templateUrl: "./bill-run-master.component.html",
  styleUrls: ["./bill-run-master.component.css"]
})
export class BillRunMasterComponent implements OnInit {
  billRunMasterGroupForm: FormGroup;
  billRunMasterCategoryList: any;
  submitted: boolean = false;
  taxListData: any;
  createbillRunMasterData: BillRunMaster;
  currentPagebillRunMasterListdata = 1;
  billRunMasterListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  billRunMasterListdatatotalRecords: String;
  billRunMasterListData: any = [];
  filterBillRunMasterListData: any = [];
  viewbillRunMasterListData: any = [];
  isbillRunMasterEdit: boolean = false;
  billRunMastertype = "";
  billRunMastercategory = "";
  searchbillRunMasterUrl: any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  totalAreaListLength = 0;

  billData: any = [];
  expoerteddata: any = [];
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  type: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private billRunMasterService: BillRunMasterService,
    private router: Router,
    loginService: LoginService,
    private activateRoute: ActivatedRoute
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.billRunMasterGroupForm = this.fb.group({
      id: [""],
      amount: [""],
      billruncount: ["", Validators.required],
      billrunfinishdate: ["", Validators.required],
      rundate: ["", Validators.required],
      status: ["", Validators.required],
      delete: [""]
      // createdate: [''],
      // errCode:  [''],
      // errMessage:  [''],
    });

    const paramtype = this.activateRoute.snapshot.paramMap.get("type");
    if (paramtype == "prepaid") {
      this.type = "Prepaid";
    } else {
      this.type = "Postpaid";
    }

    this.getbillRunMasterList("");
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagebillRunMasterListdata > 1) {
      this.currentPagebillRunMasterListdata = 1;
    }
    if (!this.searchkey) {
      this.getbillRunMasterList(this.showItemPerPage);
    }
  }

  getbillRunMasterList(list) {
    let size;
    let page_list = this.currentPagebillRunMasterListdata;
    this.searchkey = "";
    if (list) {
      size = list;
      this.billRunMasterListdataitemsPerPage = list;
    } else {
      size = this.billRunMasterListdataitemsPerPage;
    }

    let billrundata = {
      page: page_list,
      pageSize: size
    };
    this.billRunMasterService.getAllBillRunList(this.type, billrundata).subscribe(
      (response: any) => {
        this.filterBillRunMasterListData = response.billrunlist;
        this.billRunMasterListdatatotalRecords = response.pageDetails.totalRecords;
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

  addEditbillRunMaster(billRunMasterId) {
    this.submitted = true;

    if (this.billRunMasterGroupForm.valid) {
      if (billRunMasterId) {
        const url = "/billrun/" + billRunMasterId + "?mvnoId=" + localStorage.getItem("mvnoId");
        this.createbillRunMasterData = this.billRunMasterGroupForm.value;
        this.createbillRunMasterData.delete = false;
        this.billRunMasterService.updateMethod(url, this.createbillRunMasterData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.billRunMasterGroupForm.reset();
            this.isbillRunMasterEdit = false;
            this.viewbillRunMasterListData = [];
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.getbillRunMasterList("");
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
      } else {
        const url = "/billrun";

        const formData = new FormData();

        this.createbillRunMasterData = this.billRunMasterGroupForm.value;
        this.createbillRunMasterData.delete = false;

        this.billRunMasterService.postMethod(url, this.createbillRunMasterData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.billRunMasterGroupForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.getbillRunMasterList("");
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

  generatePDF(billRunMasterId) {
    if (billRunMasterId) {
      const url = "/postpaidbillingprocess/generatepdf/" + billRunMasterId;
      this.billRunMasterService.generateMethod(url).subscribe(
        (response: any) => {
          this.getbillRunMasterList("");

          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
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

  editbillRunMaster(billRunMasterId: any) {
    if (billRunMasterId) {
      const url = "/billrun/" + billRunMasterId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.billRunMasterService.getMethod(url).subscribe(
        (response: any) => {
          this.isbillRunMasterEdit = true;
          this.viewbillRunMasterListData = response.billRun;
          this.billRunMasterGroupForm.patchValue(this.viewbillRunMasterListData);
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

  deleteConfirmonbillRunMaster(billRunMaster: number) {
    if (billRunMaster) {
      this.confirmationService.confirm({
        message: "Do you want to delete this billRunMaster?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deletebillRunMaster(billRunMaster);
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

  deletebillRunMaster(id) {
    const url = "/billrun/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.billRunMasterService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPagebillRunMasterListdata != 1 && this.totalAreaListLength == 1) {
          this.currentPagebillRunMasterListdata = this.currentPagebillRunMasterListdata - 1;
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        this.getbillRunMasterList("");
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

  pageChangedbillRunMasterList(pageNumber) {
    this.currentPagebillRunMasterListdata = pageNumber;
    this.getbillRunMasterList("");
  }

  clearSearchbillRunMaster() {
    this.getbillRunMasterList("");
    // this.searchName = "";
  }

  invoicemasterDetails(billRunId: any) {
    this.router.navigate(["/home/invoiceMaster"], {
      queryParams: { id: billRunId }
    });
  }
}
