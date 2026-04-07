import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { IDeactivateGuard } from "src/app/service/deactivate.service";
import { Observable, Observer } from "rxjs";
import { FultyMacManagementService } from "src/app/service/fulty-mac.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { LoginService } from "src/app/service/login.service";

@Component({
  selector: "app-fulty-mac-management",
  templateUrl: "./fulty-mac-management.component.html",
  styleUrls: ["./fulty-mac-management.component.css"]
})
export class FultyMacManagementComponent implements OnInit {
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  fultyMacFormGroup: FormGroup;
  submitted: boolean = false;
  isFullyMacEdit: boolean = false;
  viewFultyMacListData: any;
  currentPageFultyMacSlab = 1;
  fultyMacitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  fultyMactotalRecords: any;
  searchFultyMacName: any = "";
  searchData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  fultyMacData: any;
  fultyMacListData: any;
  selectedFile: any;
  fileName: any;
  isFIleNameDialog: boolean = false;
  selectOptionData = [
    { label: "Single Data", value: "single" },
    { label: "Bulk Data", value: "bulk" }
  ];
  public loginService: LoginService;
  selectAction: string;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fultyMacManagementService: FultyMacManagementService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_FAULTY_MAC_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_FAULTY_MAC_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_FAULTY_MAC_EDIT);
  }

  ngOnInit(): void {
    this.fultyMacFormGroup = this.fb.group({
      id: [""],
      mackId: ["", Validators.required],
      file: ["", Validators.required]
    });

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
    this.getFultyMacListData("");
    this.selectAction = "single";
  }

  canExit() {
    if (!this.fultyMacFormGroup.dirty) return true;
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

  onFileChangeUpload(event) {
    const formData = new FormData();
    let fileArray: FileList;
    this.fultyMacFormGroup.controls.file;
    fileArray = this.fultyMacFormGroup.controls.file.value;
    if (fileArray.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.fultyMacFormGroup.controls.file) {
        if (!this.isValidXLSFile(this.selectedFile)) {
          this.fultyMacFormGroup.controls.file.reset();
          alert("Please upload valid .XLSX file");
        } else {
          this.submitted = true;
        }
      }
    } else {
      alert("Please upload .XLSX file");
    }
  }

  isValidXLSFile(file: any) {
    return file.name.endsWith(".xlsx");
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  addEditFultyMac(fullyMacId) {
    this.submitted = true;
    // if (this.fultyMacFormGroup.valid) {
    if (fullyMacId) {
      const url = "/faultyMack/updateMack";
      let mvnoId = localStorage.getItem("mvnoId");
      let fultyMacData = {
        mackId: this.fultyMacFormGroup.value.mackId,
        mvnoId: mvnoId,
        id: fullyMacId
      };
      this.fultyMacManagementService.updateMethod(url, fultyMacData).subscribe(
        (response: any) => {
          this.submitted = false;
          this.isFullyMacEdit = false;
          this.fultyMacFormGroup.reset();
          this.fultyMacManagementService.clearCache("/faultyMack/list");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.submitted = false;
          if (this.searchkey) {
            this.searchFultyMac();
          } else {
            this.getFultyMacListData("");
          }
        },
        (error: any) => {
          if (error.error.status == 417 || error.error.status == 406) {
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
    } else {
      const url = "/faultyMack/save";
      let mvnoId = localStorage.getItem("mvnoId");
      // this.fultyMacData = this.fultyMacFormGroup.value;
      let fultyMacData = {
        mackId: this.fultyMacFormGroup.value.mackId,
        mvnoId: mvnoId
      };
      this.fultyMacManagementService.postMethod(url, fultyMacData).subscribe(
        (response: any) => {
          this.submitted = false;
          this.fultyMacFormGroup.reset();
          this.fultyMacManagementService.clearCache("/faultyMack/list");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          if (this.searchkey) {
            this.searchFultyMac();
          } else {
            this.getFultyMacListData("");
          }
        },
        (error: any) => {
          if (error.error.status == 417 || error.error.status == 406) {
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
    // }
  }

  uploadDocument() {
    this.submitted = true;
    if (this.fultyMacFormGroup.valid) {
      const formData = new FormData();
      if (this.fultyMacFormGroup.controls.file) {
        if (!this.isValidXLSFile(this.selectedFile)) {
          this.fultyMacFormGroup.controls.file.reset();
          alert("Please upload valid .XLSX file");
        } else {
          formData.append("file", this.selectedFile);
        }
      }
      const url = "/faultyMack/uploadXL";
      let mvnoId = localStorage.getItem("mvnoId");
      formData.append("mvnoId", mvnoId);
      this.fultyMacManagementService.postMethodWithBulkRecord(url, formData).subscribe(
        (response: any) => {
          this.submitted = false;
          this.fultyMacFormGroup.reset();
          this.fultyMacManagementService.clearCache("/faultyMack/list");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          if (this.searchkey) {
            this.searchFultyMac();
          } else {
            this.getFultyMacListData("");
          }
        },
        error => {
          this.fultyMacFormGroup.controls.file.reset();
          if (error.error.status == 400) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
              icon: "far fa-check-circle"
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-check-circle"
            });
          }
        }
      );
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageFultyMacSlab > 1) {
      this.currentPageFultyMacSlab = 1;
    }
    if (!this.searchkey) {
      this.getFultyMacListData(this.showItemPerPage);
    } else {
      this.searchFultyMac();
    }
  }

  getFultyMacListData(list) {
    let size;
    this.searchkey = "";
    let pageList = this.currentPageFultyMacSlab;
    if (list) {
      size = list;
      this.fultyMacitemsPerPage = list;
    } else {
      size = this.fultyMacitemsPerPage;
    }
    let mvnoId = localStorage.getItem("mvnoId");
    const url = "/faultyMack/list?mvnoId=" + mvnoId + "&page=" + pageList + "&size=" + size;
    this.fultyMacManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.fultyMacListData = response.response.content;
        this.fultyMactotalRecords = response.response.totalElements;
        this.searchkey = "";
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

  editFullyMac(fullyMacId) {
    this.selectAction = "single";
    if (fullyMacId) {
      const url = "/faultyMack/findById?macId=" + fullyMacId;
      this.fultyMacManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isFullyMacEdit = true;
          this.viewFultyMacListData = response.response;
          this.fultyMacFormGroup.patchValue(this.viewFultyMacListData);
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

  searchFultyMac() {
    if (!this.searchkey || this.searchkey !== this.searchFultyMacName) {
      this.currentPageFultyMacSlab = 1;
    }
    this.searchkey = this.searchFultyMacName;
    if (this.showItemPerPage) {
      this.fultyMacitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchFultyMacName.trim();
    this.searchData.page = this.currentPageFultyMacSlab;
    this.searchData.pageSize = this.fultyMacitemsPerPage;

    const url = "/country/search";
    this.fultyMacManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.fultyMacListData = response.countryList;
        this.fultyMactotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.fultyMactotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.fultyMacListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.response.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  clearSearchFultyMac() {
    this.searchFultyMacName = "";
    this.searchkey = "";
    this.getFultyMacListData("");
    this.submitted = false;
    this.isFullyMacEdit = false;
    this.fultyMacFormGroup.reset();
  }

  deleteConfirmonFultyMac(fullyMacId: number) {
    if (fullyMacId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Fulty Mac Ip?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteFultyMac(fullyMacId);
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

  deleteFultyMac(fullyMacId) {
    let mvnoId = localStorage.getItem("mvnoId");
    const url = "/faultyMack/deleteMac?mackId=" + fullyMacId + "&mvnoId=" + mvnoId;

    this.fultyMacManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageFultyMacSlab != 1 && this.fultyMacListData.length == 1) {
          this.currentPageFultyMacSlab = this.currentPageFultyMacSlab - 1;
        }
        this.clearSearchFultyMac();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-check-circle"
        });
        if (this.searchkey) {
          this.searchFultyMac();
        } else {
          this.getFultyMacListData("");
        }
      },
      (error: any) => {
        if (error.error.status == 417 || error.error.status == 405 || error.error.status == 406) {
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

  pageChangedFultyMacList(pageNumber) {
    this.currentPageFultyMacSlab = pageNumber;
    if (this.searchkey) {
      this.searchFultyMac();
    } else {
      this.getFultyMacListData("");
    }
  }

  selectActionData(event) {
    this.selectAction = event.value;
  }
}
