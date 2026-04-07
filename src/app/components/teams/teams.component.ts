import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { TeamsService } from "./teams.service";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { TreeNode } from "primeng/api";
import { WORKFLOWS } from "src/app/constants/aclConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";

declare var $: any;

@Component({
  selector: "app-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.css"]
})
export class TeamsComponent implements OnInit {
  teamHierarchyData: TreeNode[];
  selectedNode: TreeNode;

  teamFormGroup: FormGroup;
  teamListData: any;
  submitted: boolean = false;
  currentPageTeamListdata = 1;
  teamListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  teamListdatatotalRecords: any;
  searchData: any;
  teamId: any;
  team: any;
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: any;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any = 5;
  searchkey: string;
  totalAreaListLength = 0;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  listView: boolean = false;
  teamtypedata: any;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  statusList: any[] = [
    { value_field: "active", display_field: "Active" },
    { value_field: "inactive", display_field: "InActive" }
  ];
  searchTeamName: any = "";
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  hirearchyAccess: boolean = false;
  pageSize;
  staffUserData: any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private teamsService: TeamsService,
    private radiusUtility: RadiusUtility,
    public adoptCommonBaseService: AdoptCommonBaseService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(WORKFLOWS.TEAMS_CREATE);
    this.deleteAccess = loginService.hasPermission(WORKFLOWS.TEAMS_DELETE);
    this.editAccess = loginService.hasPermission(WORKFLOWS.TEAMS_EDIT);
    // this.hirearchyAccess = loginService.hasPermission(WORKFLOWS.TEAMS_HIERARCHY);
    this.loginService = loginService;
    this.editMode = !this.createAccess && this.editAccess ? true : false;
  }

  editMode: boolean = false;
  isTeamList: boolean = true;
  isTeamCreateOrEdit: boolean = false;
  teamHierarchyModal: boolean = false;
  openTeamListMenu() {
    this.isTeamCreateOrEdit = false;
    this.isTeamList = true;
    this.currentPage = 1;
    this.itemsPerPage = this.showItemPerPage;
    this.getTeamList("");
  }

  openTeamCreateMenu() {
    this.submitted = false;
    this.editMode = false;
    this.isTeamList = false;
    this.isTeamCreateOrEdit = true;
    this.teamFormGroup.reset();
    this.teamFormGroup.controls.product.setValue("BSS");
  }

  ngOnInit(): void {
    this.teamFormGroup = new FormGroup({
      name: new FormControl("", [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      teamType: new FormControl(""),
      product: new FormControl("BSS"),
      staffUserIds: new FormControl("")
    });

    this.searchData = {
      filters: [
        {
          filterValue: "",
          filterColumn: "any"
        }
      ],
      page: "",
      pageSize: "",
      sortBy: "createdate",
      sortOrder: 0
    };
    this.listView = true;
    this.getTeamList("");
    this.getTeamType();
    this.getStaffUser();
  }

  clearFormData() {
    this.teamFormGroup.reset();
    this.teamFormGroup.controls.product.setValue("BSS");
    this.editMode = false;
    this.submitted = false;
  }
  /**
   * Total Item Per Page
   * @param event
   */
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getTeamList(this.showItemPerPage);
    } else {
      this.searchTrc();
    }
  }
  getTeamList(list) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.itemsPerPage = this.pageITEM
      // } else {
      //   this.itemsPerPage = this.showItemPerPage
      // }
      size = this.itemsPerPage;
    }
    let teamdata = {
      page: page_list,
      pageSize: size,
      sortBy: "createdate"
    };
    this.teamsService.getAllTeam(teamdata).subscribe(
      (response: any) => {
        this.teamListData = response.dataList;
        // if (this.showItemPerPage > this.itemsPerPage) {
        //   this.totalAreaListLength =
        //     this.teamListData.length % this.showItemPerPage
        // } else {
        //   this.totalAreaListLength =
        //     this.teamListData.length % this.itemsPerPage
        // }
        this.totalRecords = response.totalRecords;
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

  addUpdateTeam() {
    this.submitted = true;
    if (this.teamFormGroup.valid) {
      if (this.editMode) {
        this.updateTeam();
      } else {
        this.addNewTeam();
      }
    }
  }

  private addNewTeam() {
    if (this.teamFormGroup.valid) {
      var request = this.teamFormGroup.value;
      request.product = "BSS";
      this.teamsService.createTeam(this.teamFormGroup.value).subscribe(
        (response: any) => {
          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getTeamList("");
            this.clearFormData();
            this.openTeamListMenu();
            this.messageService.add({
              severity: "success",
              summary: " ",
              detail: response.responseMessage,
              icon: "far fa-check-circle"
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
  }

  private updateTeam() {
    if (this.teamFormGroup.valid) {
      var request = this.teamFormGroup.value;
      request.product = "BSS";

      this.team = this.teamFormGroup.value;
      this.team.id = this.teamId;
      this.teamsService.updateTeam(this.team).subscribe(
        (response: any) => {
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            
          }
          else if(response.responseCode == 406){
              this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getTeamList("");
            this.clearFormData();
            this.openTeamListMenu();
            this.messageService.add({
              severity: "success",
              summary: " ",
              detail: response.responseMessage,
              icon: "far fa-check-circle"
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
  }

  editTeamById(teamId, index) {
    this.editMode = true;
    this.isTeamList = false;
    this.isTeamCreateOrEdit = true;
    this.teamId = teamId;
    // index = this.radiusUtility.getIndexOfSelectedRecord(
    //   index,
    //   this.currentPage,
    //   this.itemsPerPage,
    // )
    // this.team = this.teamListData[index]

    this.teamsService.getTeamById(teamId).subscribe(
      (response: any) => {
        let teamListData = response.data;
        this.teamFormGroup.patchValue(teamListData);
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

  deleteConfirmonTeam(team) {
    if (team) {
      this.confirmationService.confirm({
        message: "Do you want to delete this team?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTeam(team);
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

  deleteTeam(team) {
    this.team = team;
    this.teamsService.deleteTeam(this.team).subscribe(
      (response: any) => {
        if (response.responseCode == 406 || response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPage != 1 && this.totalAreaListLength == 1) {
            this.currentPage = this.currentPage - 1;
          }
          this.getTeamList("");
          this.openTeamListMenu();

          this.messageService.add({
            severity: "success",
            summary: " ",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
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
  /**
   * Page Changed
   * @param pageNumber
   */
  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getTeamList("");
    } else {
      this.searchTrc();
    }
  }

  /**
   * Search Team
   */
  searchTrc() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPage = 1;
      // this.itemsPerPage = 5;
      // this.pageSize = 5;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }

    this.searchData.filters[0].filterColumn = "any";
    this.searchData.filters[0].filterValue = this.searchTeamName.trim();
    this.searchData.page = this.currentPage;
    this.searchData.pageSize = this.itemsPerPage;
    const url = "/teams/searchAll?mvnoId=" + localStorage.getItem("mvnoId");
    this.teamsService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response?.responseCode == 200 && response?.dataList?.length > 0) {
          this.teamListData = response.dataList;
          this.totalRecords = response.totalRecords;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail:
              response.responseMessage == "OK" ? "No Record Found." : response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.teamListData = [];
          this.totalRecords = 0;
        }
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.teamListData = [];
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

  clearSearchTrc() {
    this.searchTeamName = "";
    this.searchkey = "";

    this.teamFormGroup.reset();
    this.showItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.currentPage = 1;
    this.getTeamList(this.itemsPerPage);
    this.teamFormGroup.controls.product.setValue("BSS");
  }

  canExit() {
    if (!this.teamFormGroup.dirty) return true;
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

  teamHierarchyModalOpen(data) {
    this.teamHierarchyData = []; // destroy old chart
    this.selectedNode = null;

    let staffHierarchy = data.staffNameList.map(element => ({
      label: element,
      type: "person",
      styleClass: "p-person"
    }));

    const hierarchy = [
      {
        label: data.name,
        type: "person",
        styleClass: "p-person",
        expanded: true,
        children: staffHierarchy
      }
    ];

    setTimeout(() => {
      this.teamHierarchyData = hierarchy;
      this.teamHierarchyModal = true;
    });
  }

  getTeamType() {
    const url = "/commonList/teamType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.teamtypedata = response.dataList;
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

  getStaffUser() {
    const url = "/staffuser/allActive";
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.staffUserData = response.staffUserlist;
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

  modalCloseTeamModal() {
    this.teamHierarchyModal = false;
    this.teamHierarchyData = [];
    this.selectedNode = null;
  }
}
