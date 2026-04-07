import { Component, NgZone, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { LoginService } from "src/app/service/login.service";
import { RoleService } from "src/app/service/role.service";
import { Acl } from "../generic-component/acl/acl-gerneric-component/model/acl";
import { AclOperationsList } from "../generic-component/acl/acl-gerneric-component/model/acl-operations-list";
import { AclSave } from "../generic-component/acl/acl-gerneric-component/model/acl-save";
import { Aclsaveoperationlist } from "../generic-component/acl/acl-gerneric-component/model/aclsaveoperationlist";
@Component({
  selector: "app-radius-role",
  templateUrl: "./radius-role.component.html",
  styleUrls: ["./radius-role.component.css"]
})
export class RadiusRoleComponent implements OnInit {
  public isUpdateComponent: boolean = false;
  public entity: AclSave = new AclSave();
  dataList: Array<Acl>;
  temp: Array<Acl>;
  saveSelectedPermission: AclSave;
  check: boolean;
  allOpgetFlag: boolean = false;
  searchData: any;
  roleSearchData: any = [];

  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;

  editRoleId: number = null;
  editMode: boolean = false;
  editData: any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;
  roleGroupForm: FormGroup;
  searchRoleForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  commonStatusList: any;
  AclClassConstants;
  AclConstants;
  dataListAccess: any;

  accessAll: boolean;

  readAccess: boolean;
  public loginService: LoginService;
  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private radiusUtility: RadiusUtility,
    private ngZone: NgZone,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    // this.editMode = !createAccess && editAccess ? true : false;
  }

  isRoleList: boolean = true;
  isRoleCreateOrEdit: boolean = false;
  openRoleListMenu() {
    this.isRoleCreateOrEdit = false;
    this.isRoleList = true;
  }

  openRoleCreateMenu() {
    this.allOpgetFlag = false;
    this.editMode = false;
    this.isRoleList = false;
    this.submitted = false;
    this.isRoleCreateOrEdit = true;
    this.roleGroupForm.reset();
    this.setData(new AclSave());
    this.saveSelectedPermission = new AclSave();
    this.setAccessData();
    this.saveSelectedPermission.aclEntryPojoList = new Array<Aclsaveoperationlist>();
    this.getAll("");
    this.roleService.getCommonList().subscribe(res => {
      this.commonStatusList = res.dataList;
    });
  }

  setData(data: AclSave) {
    if (this.allOpgetFlag === false) {
      this.roleService.getAllOperation().subscribe(res => {
        this.dataList = res.dataList;
        this.allOpgetFlag = true;
      });
    }
    this.roleService.getCommonList().subscribe(res => {
      this.commonStatusList = res.dataList;
    });
    setTimeout(() => {
      if (this.allOpgetFlag === true) {
        if (
          this.isUpdateComponent &&
          this.saveSelectedPermission &&
          this.saveSelectedPermission.aclEntryPojoList &&
          this.saveSelectedPermission.aclEntryPojoList.length > 0
        ) {
          if (this.dataList) {
            this.dataList.forEach(res => {
              res.SelectOperationsList = new Array<AclOperationsList>();
              this.saveSelectedPermission.aclEntryPojoList.forEach(sdata => {
                if (res.operallid === sdata.permit) {
                  let temp = sdata.classid - 1;
                  this.dataList[temp].fullaccess = true;
                }
                if (res.id === sdata.classid) {
                  res.aclOperationsList.forEach(ls => {
                    if (ls.id === sdata.permit) {
                      res.SelectOperationsList.push(ls);
                    }
                  });
                }
              });
            });
          }
        }
      }
    }, 1000);

    if (data) {
      this.saveSelectedPermission = data;
    }
  }

  getData(): AclSave {
    return this.saveSelectedPermission;
  }

  onDataSave(event) {
    this.dataList = event;
  }

  onAllAccessClick(event) {
    this.saveSelectedPermission.isAllOperation = event;
  }

  onPermitIDCheck(temp) {
    this.check = true;
    this.saveSelectedPermission.aclEntryPojoList.forEach(res => {
      if (temp.permit === res.permit) {
        this.check = false;
        return;
      }
    });
  }
  setAccessData() {
    this.roleService.getAllACLMenu().subscribe(
      (response: any) => {
        this.dataListAccess = response.dataList;
      },
      (error: any) => {}
    );
  }

  getAclOperation(row, operation) {
    const op = row.aclOperationsList.find(acl => acl.opName.toLowerCase().includes(operation));
    if (op === undefined) {
    }
    return op;
  }

  ngOnInit(): void {
    this.setAccessData();
    this.setData(new AclSave());
    this.saveSelectedPermission = new AclSave();
    this.saveSelectedPermission.aclEntryPojoList = new Array<Aclsaveoperationlist>();
    this.getAll("");
    this.roleService.getCommonList().subscribe(res => {
      this.commonStatusList = res.dataList;
    });

    this.searchRoleForm = this.fb.group({
      name: [""]
    });

    this.roleGroupForm = new FormGroup({
      rolename: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
      aclEntryPojoList: new FormControl(this.saveSelectedPermission.aclEntryPojoList)
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
  }

  searchRoleByName() {
    // this.currentPage = 1
    this.searchSubmitted = true;
    if (this.searchRoleForm.valid && this.searchRoleForm.value.name != "") {
      // if (this.searchRoleForm.value.name == null) {
      //   this.searchRoleForm.value.name = "";
      // }

      if (!this.searchkey || this.searchkey !== this.searchRoleForm.value.name) {
        this.currentPage = 1;
      }
      this.searchkey = this.searchRoleForm.value.name;
      if (this.showItemPerPage !== 1) {
        this.itemsPerPage = this.showItemPerPage;
      }

      this.searchData.filters[0].filterValue = this.searchRoleForm.value.name.trim();
      (this.searchData.page = this.currentPage),
        (this.searchData.pageSize = this.itemsPerPage),
        this.roleService.getByName(this.searchData).subscribe(
          (response: any) => {
            if (response.responseCode == 404) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
              this.roleSearchData.dataList = [];
              this.totalRecords = 0;
            } else {
              this.roleSearchData = response;
              this.totalRecords = response.totalRecords;
              if (response.currentPageNumber > response.totalPages) {
                this.currentPage = 1;
                this.searchRoleByName();
              }
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
  clearSearchForm() {
    this.searchRoleForm.reset();
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.getAll("");
    this.submitted = false;
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.itemsPerPage > 1) {
      this.itemsPerPage = 1;
    }
    if (!this.searchkey) {
      this.getAll(this.showItemPerPage);
    } else {
      this.searchRoleByName();
    }
  }

  getAll(list) {
    let size;
    this.searchkey = "";
    let pageList = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }

    let rolData = {
      page: pageList,
      pageSize: size
    };
    // this.roleService.getAll().subscribe(
    this.roleService.getDataPostAPI(rolData).subscribe(
      (response: any) => {
        this.roleSearchData = response;
        this.totalRecords = response.totalRecords;
        if (response.currentPageNumber > response.totalPages) {
          this.currentPage = 1;
          this.getAll("");
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

  addRole() {
    this.submitted = true;
    if (this.roleGroupForm.valid) {
      if (this.editMode) {
        this.updateRole();
      } else {
        this.addNewRole();
      }
    }
  }

  async addNewRole() {
    // if (this.dataList) {
    //   this.saveSelectedPermission.aclEntryPojoList =
    //     new Array<Aclsaveoperationlist>();
    //   this.dataList.forEach((res) => {
    //     if (res.SelectOperationsList) {
    //       res.SelectOperationsList.forEach((sres) => {
    //         let temp = new Aclsaveoperationlist();
    //         temp.classid = sres.classid;
    //         temp.permit = sres.id;
    //         console.log("temp::", temp);
    //         this.saveSelectedPermission.aclEntryPojoList.push(temp);
    //         console.log("save::", this.saveSelectedPermission.aclEntryPojoList);
    //       });
    //     }
    //   });
    // }

    let accessData = [];
    this.dataListAccess.forEach(element => {
      element.submenu.forEach(menu => {
        menu.aclOperationsList.forEach(data => {
          if (data.accessible) {
            let d = {
              classid: data.classid,
              permit: data.id
            };
            accessData.push(d);
          }
        });
      });
    });
    let foundIndexCust = accessData.findIndex((val: any) => {
      return val.permit == 31;
    });
    let foundIndexTicket = accessData.findIndex((val: any) => {
      return val.permit == 99;
    });
    if (foundIndexTicket !== -1) {
      accessData.push(
        { classid: 22, permit: 88 },
        { classid: 54, permit: 398 },
        { classid: 59, permit: 408 },
        { classid: 61, permit: 418 },
        { classid: 7, permit: 32 }
      );
    }
    if (foundIndexCust !== -1) {
      accessData.push(
        { classid: 29, permit: 116 },
        { classid: 29, permit: 117 },
        { classid: 14, permit: 67 },
        { classid: 6, permit: 26 },
        { classid: 6, permit: 27 },
        { classid: 49, permit: 370 },
        { classid: 49, permit: 371 },
        { classid: 5, permit: 21 },
        { classid: 5, permit: 22 },
        { classid: 55, permit: 276 },
        { classid: 55, permit: 277 },
        { classid: 9, permit: 42 }
      );
    }

    this.roleGroupForm.get("aclEntryPojoList").setValue(accessData);

    if (this.roleGroupForm.value.aclEntryPojoList) {
      this.roleService.add(this.roleGroupForm.value).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            if (this.searchkey) {
              this.searchRoleByName();
            } else {
              this.getAll("");
            }
            this.loginService.refreshToken();
            this.openRoleListMenu();
            this.submitted = false;
            this.readAccess = false;
            this.accessAll = false;
            this.roleGroupForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select atleat one permission",
        icon: "far fa-times-circle"
      });
    }
  }

  async updateRole() {
    if (this.dataList) {
      // this.saveSelectedPermission.aclEntryPojoList =
      //   new Array<Aclsaveoperationlist>();
      // if (this.dataList) {
      //   this.dataList.forEach((res) => {
      //     if (res.SelectOperationsList) {
      //       res.SelectOperationsList.forEach((sres) => {
      //         let temp = new Aclsaveoperationlist();
      //         temp.classid = sres.classid;
      //         temp.permit = sres.id;
      //         this.onPermitIDCheck(temp);
      //         if (this.check === true) {
      //           this.saveSelectedPermission.aclEntryPojoList.push(temp);
      //         }
      //       });
      //     }
      //   });
      // }

      let accessData = [];
      this.dataListAccess.forEach(element => {
        element.submenu.forEach(menu => {
          menu.aclOperationsList.forEach(data => {
            if (data.accessible) {
              let d = {
                classid: data.classid,
                permit: data.id
              };
              accessData.push(d);
            }
          });
        });
      });
      let foundIndexCust = accessData.findIndex((val: any) => {
        return val.permit == 31;
      });
      let foundIndexTicket = accessData.findIndex((val: any) => {
        return val.permit == 99;
      });
      let permitList = this.editData.aclEntryPojoList;
      let foundindexTicketInPermitList = permitList.findIndex((val: any) => {
        return val.permit === 99;
      });
      let foundindexCustInPermitList = permitList.findIndex((val: any) => {
        return val.permit === 31;
      });
      if (foundindexTicketInPermitList === -1) {
        if (foundIndexTicket !== -1) {
          accessData.push(
            { classid: 22, permit: 88 },
            { classid: 54, permit: 398 },
            { classid: 59, permit: 408 },
            { classid: 61, permit: 418 },
            { classid: 7, permit: 32 }
          );
        }
      }
      if (foundindexCustInPermitList === -1) {
        if (foundIndexCust !== -1) {
          accessData.push(
            { classid: 29, permit: 116 },
            { classid: 29, permit: 117 },
            { classid: 14, permit: 67 },
            { classid: 6, permit: 26 },
            { classid: 6, permit: 27 },
            { classid: 49, permit: 370 },
            { classid: 49, permit: 371 },
            { classid: 5, permit: 21 },
            { classid: 5, permit: 22 },
            { classid: 55, permit: 276 },
            { classid: 55, permit: 277 },
            { classid: 9, permit: 42 }
          );
        }
      }

      this.roleGroupForm.get("aclEntryPojoList").setValue(accessData);
      if (this.roleGroupForm.value.aclEntryPojoList) {
        //
        // this.roleGroupForm
        //   .get("aclEntryPojoList")
        //   .setValue(this.saveSelectedPermission.aclEntryPojoList);
        let obj = new AclSave();
        obj = this.roleGroupForm.value;
        obj.id = this.editRoleId;
        this.roleService.update(obj).subscribe(
          (response: any) => {
            if (response.responseCode == 200) {
              if (this.searchkey) {
                this.searchRoleByName();
              } else {
                this.getAll("");
              }
              this.loginService.refreshToken();
              this.openRoleListMenu();
              this.editMode = false;
              this.roleGroupForm.reset();
              this.submitted = false;
              this.readAccess = false;
              this.accessAll = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
            } else if (response.responseCode == 406) {
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
                detail: "Please select atleat one permission",
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "Please select atleat one permission",
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Please select atleat one permission",
          icon: "far fa-times-circle"
        });
      }
    }
  }

  editRoleById(roleId, index) {
    this.isUpdateComponent = true;

    this.editMode = true;
    this.isRoleList = false;
    this.isRoleCreateOrEdit = true;
    this.editRoleId = roleId;
    this.roleService.getById(roleId).subscribe(
      (response: any) => {
        this.editData = response.data;
        // this.setAccessData();
        this.editData.aclEntryPojoList.forEach(access => {
          this.dataListAccess.forEach(element => {
            element.submenu.forEach(menu => {
              menu.aclOperationsList.forEach(data => {
                if (access.classid == data.classid && access.permit == data.id)
                  data.accessible = true;
              });
            });
          });
        });

        this.setData(this.editData);
        this.roleGroupForm.patchValue(this.editData);
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
  deleteConfirm(role) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Role?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteRoleById(role);
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
  deleteRoleById(role) {
    this.roleService.delete(role).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.roleSearchData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (this.searchkey) {
          this.searchRoleByName();
        } else {
          this.getAll("");
        }
        this.loginService.refreshToken();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (this.searchkey) {
      this.searchRoleByName();
    } else {
      this.getAll("");
    }
  }

  checkRead(aclList: any, op: any) {
    this.ngZone.run(() => {
      if (op === "view" && aclList.find(acl => acl.opName.toLowerCase().includes(op)).accessible) {
      } else if (
        op === "add" &&
        aclList.find(acl => acl.opName.toLowerCase().includes(op)).accessible
      ) {
        aclList.find(acl => acl.opName.toLowerCase().includes("view")).accessible = true;
      } else if (
        op === "edit" &&
        aclList.find(acl => acl.opName.toLowerCase().includes(op)).accessible
      ) {
        aclList.find(acl => acl.opName.toLowerCase().includes("view")).accessible = true;
        aclList.find(acl => acl.opName.toLowerCase().includes("add")).accessible = true;
      } else if (
        op === "delete" &&
        aclList.find(acl => acl.opName.toLowerCase().includes(op)).accessible
      ) {
        aclList.find(acl => acl.opName.toLowerCase().includes("view")).accessible = true;
        aclList.find(acl => acl.opName.toLowerCase().includes("add")).accessible = true;
        aclList.find(acl => acl.opName.toLowerCase().includes("edit")).accessible = true;
      } else if (
        op === "all" &&
        aclList.find(acl => acl.opName.toLowerCase().includes(op)).accessible
      ) {
        this.ngZone.run(() => {
          aclList.find(acl => acl.opName.toLowerCase().includes("view")).accessible = true;
          aclList.find(acl => acl.opName.toLowerCase().includes("add")).accessible = true;
          aclList.find(acl => acl.opName.toLowerCase().includes("edit")).accessible = true;
          aclList.find(acl => acl.opName.toLowerCase().includes("delete")).accessible = true;
        });
      } else {
        this.ngZone.run(() => {
          aclList.find(acl => acl.opName.toLowerCase().includes("view")).accessible = false;
          aclList.find(acl => acl.opName.toLowerCase().includes("add")).accessible = false;
          aclList.find(acl => acl.opName.toLowerCase().includes("edit")).accessible = false;
          aclList.find(acl => acl.opName.toLowerCase().includes("delete")).accessible = false;
        });
      }

      if (
        aclList.find(acl => acl.opName.toLowerCase().includes("view")).accessible &&
        aclList.find(acl => acl.opName.toLowerCase().includes("add")).accessible &&
        aclList.find(acl => acl.opName.toLowerCase().includes("edit")).accessible &&
        aclList.find(acl => acl.opName.toLowerCase().includes("delete")).accessible
      ) {
        aclList.find(acl => acl.opName.toLowerCase().includes("all")).accessible = true;
      } else {
        aclList.find(acl => acl.opName.toLowerCase().includes("all")).accessible = false;
      }
    });
  }

  accessAllCheck() {
    if (this.accessAll) {
      this.dataListAccess.forEach(element => {
        element.submenu.forEach(menu => {
          menu.aclOperationsList.forEach(data => {
            // data.accessible = true;
            let searchData = data.opName;
            let sData = searchData.includes("DISPLAY");
            let s1Data = searchData.includes("Display");
            let s2Data = searchData.includes("display");
            if (sData == true || s1Data == true || s2Data == true) {
              data.accessible = false;
            } else {
              data.accessible = true;
            }
          });
        });
      });
    } else {
      this.dataListAccess.forEach(element => {
        element.submenu.forEach(menu => {
          menu.aclOperationsList.forEach(data => {
            data.accessible = false;
          });
        });
      });
    }
  }
  readAccessCheck() {
    if (this.readAccess) {
      this.dataListAccess.forEach(element => {
        element.submenu.forEach(menu => {
          menu.aclOperationsList[1].accessible = true;
        });
      });
    } else {
      this.dataListAccess.forEach(element => {
        element.submenu.forEach(menu => {
          menu.aclOperationsList[1].accessible = false;
        });
      });
    }
  }
  accessServiceCheck(e, name) {
    if (e.checked) {
      this.dataListAccess.forEach(element => {
        element.submenu.forEach(menu => {
          menu.aclOperationsList.forEach(data => {
            if (element.name == name) {
              data.accessible = true;
              // console.log(element.name, name);
              // console.log(menu.aclOperationsList);
            }
          });
        });
      });
    } else {
      this.dataListAccess.forEach(element => {
        element.submenu.forEach(menu => {
          menu.aclOperationsList.forEach(data => {
            if (element.name == name) {
              data.accessible = false;
            }
          });
        });
      });
    }
  }
  canExit() {
    if (!this.roleGroupForm.dirty) return true;
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
