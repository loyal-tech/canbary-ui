import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ProfileService } from "src/app/service/profile.service";

@Component({
  selector: "app-profile-list",
  templateUrl: "./profile-list.component.html",
  styleUrls: ["./profile-list.component.scss"]
})
export class ProfileListComponent implements OnInit {
  profileTitle = RadiusConstants.PROFILE;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: any;
  profileListData: any;
  profileData: any;
  searchProfileName: any;
  searchData: any;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  mvnoIdData: any;
  mvnoNameList: any;
  mvnoOptions: any;
  mvnoMasterOptions: any[];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private profileService: ProfileService
  ) {}

  async ngOnInit() {
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
    this.getProfileData("");
  }

  clearProfile() {
    this.searchProfileName = "";
    this.getProfileData("");
  }

  pageChangedMvnoList(pageNumber) {
    this.currentPage = pageNumber;
    if (this.searchkey) {
      this.searchProfile();
    } else {
      this.getProfileData("");
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getProfileData(this.showItemPerPage);
    } else {
      this.searchProfile();
    }
  }

  searchProfile(): void {
    if (!this.searchkey || this.searchkey != this.searchProfileName) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchProfileName;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchProfileName
      ? this.searchProfileName.trim()
      : "";
    this.searchData.page = this.currentPage;
    this.searchData.pageSize = this.itemsPerPage;
    const url = "/custAccountProfile/search";
    this.profileService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (
          response.responseCode === 404 ||
          !response.CustAccountProfile ||
          response.CustAccountProfile.length === 0
        ) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "No records found",
            icon: "far fa-times-circle"
          });
          this.profileListData = [];
          this.totalRecords = 0;
        } else {
          this.profileListData = response.CustAccountProfile;
          this.totalRecords = response.pageDetails.totalRecords;
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

  getProfileData(list) {
    let size;
    this.searchkey = "";
    let pageList = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    const url = "/custAccountProfile/getAllWithPagination";
    let mvnodata = {
      page: pageList,
      pageSize: size
    };
    this.profileService.postMethod(url, mvnodata).subscribe(
      (response: any) => {
        this.profileListData = response.custAccountProfilesList;
        this.totalRecords = response.pageDetails.totalRecords;
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

  deleteConfirmonProfile(profileData) {
    if (profileData) {
      this.confirmationService.confirm({
        message: "Do you want to delete this MVNO?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteProfile(profileData);
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

  deleteProfile(id) {
    const url = "/custAccountProfile/delete/" + id;
    this.profileService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.profileListData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "deleted Successfully",
          icon: "far fa-check-circle"
        });
        if (this.searchkey) {
          this.searchProfile();
        } else {
          this.getProfileData("");
        }
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
