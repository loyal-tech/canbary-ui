import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { PasswordPolicyService } from "src/app/service/password-policy/password-policy.service";

@Component({
  selector: "app-password-list",
  templateUrl: "./password-list.component.html",
  styleUrls: ["./password-list.component.css"],
})
export class PasswordListComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: any;
  passwordListData: any;
  passwordData: any;
  searchName: any;
  searchData: any;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private PasswordPolicyService: PasswordPolicyService
  ) {}

  async ngOnInit() {
    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: "",
      pageSize: "",
    };
    this.getPasswordPolicyData("");
  }

  clearMvno() {
    this.searchName = "";
    this.getPasswordPolicyData("");
  }

  pageChangedList(pageNumber) {
    this.currentPage = pageNumber;
    if (this.searchkey) {
      this.searchPasswordPolicy();
    } else {
      this.getPasswordPolicyData("");
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getPasswordPolicyData(this.showItemPerPage);
    } else {
      this.searchPasswordPolicy();
    }
  }

  searchPasswordPolicy() {
    if (!this.searchkey || this.searchkey != this.searchName) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchName
      ? this.searchName.trim()
      : "";
    this.searchData.page = this.currentPage;
    this.searchData.pageSize = this.itemsPerPage;
    const url = "/passwordPolicy/search";
    this.PasswordPolicyService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.statusCode == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.msg,
            icon: "far fa-times-circle",
          });
          this.passwordListData = [];
          this.totalRecords = 0;
        } else {
          this.passwordListData = response.passwordList;
          this.totalRecords = response.pageDetails.totalRecords;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getPasswordPolicyData(list) {
    let size;
    this.searchkey = "";
    let pageList = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    const url = "/passwordPolicy/getAllWithPagination";
    let params = {
      page: pageList,
      pageSize: size,
    };
    this.PasswordPolicyService.postMethod(url, params).subscribe(
      (response: any) => {
        this.passwordListData = response.passwordList;
        this.totalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  deleteConfirmonMvno(passwordData) {
    if (passwordData) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Password Policy?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteMvno(passwordData);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
        },
      });
    }
  }

  deleteMvno(id) {
    const url = "/passwordPolicy/delete/" + id;
    this.PasswordPolicyService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.passwordListData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        if (this.searchkey) {
          this.searchPasswordPolicy();
        } else {
          this.getPasswordPolicyData("");
        }
      },
      (error: any) => {
        // console.log(error, "error")
        if (error.error.status == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }
}
