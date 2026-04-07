import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StaffService } from "src/app/service/staff.service";
import { RoleService } from "src/app/service/role.service";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { IStaff } from "src/app/components/model/staff";
import { countries } from "src/app/components/model/country";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { BranchManagementService } from "../branch-management/branch-management.service";
import { Observable, Observer } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { isEqual } from "lodash";
import { TacacsDeviceGroupService } from "src/app/service/tacacs-device-group.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { SETTINGS, TACACS } from "src/app/constants/aclConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
import { ActivatedRoute, Router } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-radius-staff",
  templateUrl: "./radius-staff.component.html",
  styleUrls: ["./radius-staff.component.css"]
})
export class RadiusStaffComponent implements OnInit {
  profile_picture: any;
  fileToUpload: any;
  imageUrl: any;
  createAccess: boolean = false;
  changePassAccess: boolean = false;
  createReceiptAccess: boolean = false;
  tacacsAccess: boolean = false;
  editAccess: boolean = false;
  profileImg: any;
  currentUserIdentityKey: any;
  staffUserList: any;
  profileChange: any = [];
  departmentData: any;
  isDepartment: boolean = false;
  viewMvnoData: any;
  usernameEditable:boolean = false ;
  changePasswordModal = false;
  staffWalletModal = false;
  constructor(
    private staffService: StaffService,
    private roleService: RoleService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commondropdownService: CommondropdownService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public branchManagementService: BranchManagementService,
    private sanitizer: DomSanitizer,
    private tacacsService: TacacsDeviceGroupService,
    private customerManagementService: CustomermanagementService,
    public statusCheckService: StatusCheckService,
    loginService: LoginService,
  
  ) {
    this.createAccess = loginService.hasPermission(SETTINGS.STAFF_CREATE);
    this.changePassAccess = loginService.hasPermission(SETTINGS.STAFF_CHANGE_PASSWORD);
    this.editAccess = loginService.hasPermission(SETTINGS.STAFF_EDIT);
    this.createReceiptAccess = loginService.hasPermission(SETTINGS.STAFF_CREATE_RECEIPT);
    this.tacacsAccess = loginService.hasPermission(TACACS.TACACS);
    this.loginService = loginService;
    this.editMode = !this.createAccess && this.editAccess ? true : false;
  }

  staffImg: SafeResourceUrl;
  countries: any = countries;
  radiusWalletGroupForm: FormGroup;
  paymentReciptForm: FormGroup;
  staffGroupForm: FormGroup;
  searchStaffForm: FormGroup;
  changePasswordForm: FormGroup;
  submitted = false;
  mobileError: boolean = false;
  searchSubmitted = false;
  staffData: any = [];
  //   isUserAdmin: boolean = false;
  currentPage = 1;
  itemsPerPage: number = RadiusConstants.PER_PAGE_ITEMS;
  totalRecords: number;

  editStaffId: number = null;
  editData: IStaff;
  editMode = false;
  changeStatusData: any = [];
  statusMsg = "";
  roles: any[];
  selectedRoles: any[];
  loggedInUser = "";
  currentPageMvno = 1;
  mvnoitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  mvnototalRecords: any;
  parentStaffView = false;
  parentStaffList: any = [];
  searchData: any = [];
  searchDeatil: any = "";
  UserData: any;
  userName: "";
  AclClassConstants;
  AclConstants;

  pageITEM = RadiusConstants.PER_PAGE_ITEMS;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;

  public loginService: LoginService;
  staffListDatalength = 0;

  showPassword = false;
  _passwordType = "password";
  showNewPassword = false;
  showOLDPassword = false;
  _passwordOLDType = "password";
  _passwordNewType = "password";
  businessUnitIdsList: any = [];
  selServiceAreaId: any;

  satffUserData: any = [];
  isStaffPersonalData = false;
  isStaffReceiptData = false;

  currentReceiptPage = 1;
  itemsReceiptPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalReceiptRecords: number;

  searchOptionSelect = [
    { label: "Global Search Filter", value: "globalsearch" },
    { label: "Reciept No", value: "reciept" }
  ];
  inputMobile: string;
  enteredMobilelength: string;
  ifgenerateOtpField = true;
  userNameForPasswordUpdate = "";
  mvnoIdForPwdChange = "";
  staffPhoneNumber = "";
  staffCountryCode = "";
  staffOTPValue = "";
  branchData: any;
  TacacsDeviceList: any[];

  uploadDocForm: FormGroup;

  isShowStaffMenu = false;
  isStaffList = true;
  isStaffCreateOrEdit = false;
  ifWalletStaffShow = false;

  isPasswordShow = false;

  userForm: FormGroup;
  statusList: any[] = [
    { value_field: "ACTIVE", display_field: "Active" },
    // { value_field: "BLOCKED", display_field: "Blocked" },
    { value_field: "INACTIVE", display_field: "In Active" },
    // { value_field: "REGISTERED", display_field: "Registered" },
    { value_field: "TERMINATED", display_field: "Terminated" }
  ];
  teams: any[] = [];
  roleList: any;
  loggedInUserRoleList: any[] = [{ id: "", rolename: "" }];

  staffreciptMappingList: any = [];
  openStaffID = "";

  getWallatData: any;
  WalletAmount: any;

  searchOption = "globalsearch";
  prefikx = "";

  branchList: any = [];

  passwordData = {
    username: "",
    newPassword: "",
    confirmNewPassword: ""
  };
  businessData: any;

  staffRecepetId = "";

  searchReceptNumber = "";

  bankDataList: any = [];

  itemsLegderPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentLegderPage = 1;
  totalLegderRecords: string;
  staffLegderData: any = [];
  staffEmail = "";
  userId = localStorage.getItem("userId");
  mvnoId = localStorage.getItem("userId");
  paymentReciptModal = false;
  usernamee: string = "";
  serviceareaModal = false;
  bussinessModal = false;
  teamModal = false;
  ngOnInit(): void {
    this.commondropdownService.getsystemconfigList();
    this.usernamee = "@" + localStorage.getItem("mvnoName");
    this.getAll("");
    this.staffUserData(this.userId);
    // this.getBankDetail();
    this.searchOption = "globalsearch";

    this.searchStaffForm = this.fb.group({
      username: [""]
    });

    // this.staffGroupForm = new FormGroup({
    //   username: new FormControl('', [Validators.required]),
    //   password: new FormControl(''),
    //   email: new FormControl('', [Validators.required]),
    //   roleIds: new FormControl(null, [Validators.required]),
    //   serviceAreaId: new FormControl(null, [Validators.required]),
    //   firstname: new FormControl('', [Validators.required]),
    //   lastname: new FormControl('', [Validators.required]),
    //   teamIds: new FormControl(null, [Validators.required]),
    //   status: new FormControl(null, [Validators.required]),
    //   phone: new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    //   parentStaffId: new FormControl(''),
    //   partnerid: new FormControl(''),
    //   mvnoid: new FormControl('', [Validators.required]),
    // });

    this.paymentReciptForm = this.fb.group({
      prefix: ["", Validators.required],
      receiptFrom: ["", Validators.required],
      receiptTo: ["", Validators.required]
    });

    this.staffGroupForm = this.fb.group({
      username: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      password: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      email: ["", [Validators.required, Validators.email]],
      roleIds: ["", Validators.required],
      // serviceAreaId: [''],
      serviceAreaIdsList: [],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      teamIds: [""],
      status: ["", Validators.required],
      parentStaffId: [""],
      partnerid: ["", Validators.required],
      phone: ["", Validators.required],
      businessUnitIdsList: [""],
      mvnoid: [""],
      countryCode: [""],
      branchId: [""],
      staffUserServiceMappingList: [],
      file: [""],
      hrmsId: [""],
      tacacsAccessLevelGroup: [""],
      assignableRoleIds: [""],
      department: [""]
    });

    this.radiusWalletGroupForm = this.fb.group({
      date: ["", Validators.required],
      amount: ["", Validators.required],
      bankId: ["", Validators.required],
      remarks: ["", Validators.required]
    });

    this.loggedInUser = localStorage.getItem("loggedInUser");

    this.changePasswordForm = this.fb.group({
      userName: [""],
      // oldPassword: ["", Validators.required],
      newPassword: ["", [Validators.required]]
    });
    this.searchData = {
      filters: [
        {
          filterColumn: "any",
          filterCondition: "and",
          filterDataType: "",
          filterOperator: "equalto",
          filterValue: "",
          port: "",
          salesRepresentative: "",
          serviceArea: "",
          serviceNetwork: "",
          slot: ""
        }
      ],
      page: this.currentPage,
      pageSize: this.itemsPerPage
    };
    this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
      if (lengthObj) {
        this.staffGroupForm
          .get("phone")
          ?.setValidators([
            Validators.required,
            Validators.minLength(lengthObj.min),
            Validators.maxLength(lengthObj.max)
          ]);
        this.staffGroupForm.get("phone")?.updateValueAndValidity();
      }
    });
  }
  openStaffListMenu() {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = true;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;
    this.isShowStaffMenu = false;
    this.ifWalletStaffShow = false;
    // this.getAll("");
  }

  openStaffCreateMenu() {
    this.getMvnoById(this.mvnoId);
    this.usernameEditable = true;
    this.parentStaffList = [];
    this.staffGroupForm.controls.password.enable();
    this.editMode = false;
    this.isStaffList = false;
    this.isStaffCreateOrEdit = true;
    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;
    this.isShowStaffMenu = false;
    this.ifWalletStaffShow = false;

    this.imageUrl = "";
    this.clearFormData();
    this.submitted = false;
    this.staffGroupForm.reset();
    this.staffGroupForm.patchValue({
      countryCode: this.commondropdownService.commonCountryCode
    });
    // this.staffGroupForm.controls.roleIds.setValue(this.loggedInUserRoleList[0]?.id);
    // this.staffGroupForm.patchValue({
    //   roleIds: this.loggedInUserRoleList[0].id
    // });
    this.businessData.forEach(element => {
      element.flag = false;
    });
    this.staffGroupForm.controls.firstname.enable();
    this.staffGroupForm.controls.lastname.enable();
    this.staffGroupForm.controls.username.enable();
    this.staffGroupForm.controls.parentStaffId.disable();
    this.getAllRole();
    this.getBankDetail();
    this.staffService.getAllRoleData().subscribe(result => {
      this.roleList = result.dataList;
    });
    this.staffService.getAllRoleDataForLoggedInUser().subscribe(result => {
      this.loggedInUserRoleList = result.dataList;
    });
    this.staffService.getTeamsData().subscribe(result => {
      this.teams = result.dataList;
    });
    if (this.statusCheckService.isActiveTacacs) {
      this.gettacacsALGData();
    }
    this.getAllBranch();
    this.getAllDepartments();
    const serviceArea = localStorage.getItem("serviceArea");
    const serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.getserviceAreaListForCafCustomer();
      this.commondropdownService.filterPartnerAll();
    } else {
      this.commondropdownService.getserviceAreaListForCafCustomer();
      this.commondropdownService.getpartnerAll();
    }
    if (
      this.UserData?.department != null &&
      this.UserData?.department != undefined &&
      this.UserData?.department != ""
    ) {
      this.staffGroupForm.controls.department.setValue(this.UserData?.department);
      this.usernamee = this.UserData?.department;
      console.log("usernamee", this.usernamee)
      this.isDepartment = true;
    } else {
      this.staffGroupForm.controls.department.setValue("");
      this.isDepartment = false;
     this.usernamee = "@" + localStorage.getItem("mvnoName");


    }
  }

  staffDetialsOpen(id) {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = false;
    this.isStaffPersonalData = true;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffReceiptData = false;
    this.isShowStaffMenu = true;
    this.ifWalletStaffShow = false;

    this.openStaffID = id;
    this.staffService.getStaffUserData(id).subscribe((response: any) => {
      this.satffUserData = response.Staff;
      this.staffreciptMappingList = this.satffUserData.staffUserServiceMappingList;

      this.staffImg = this.sanitizer.bypassSecurityTrustResourceUrl(
        `data:image/png;base64, ${this.satffUserData.profileImage}`
      );
    });
  }

  openStaffStaffReceipt() {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = true;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isShowStaffMenu = true;
    this.ifWalletStaffShow = false;
  }
  openStaffWallet() {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isShowStaffMenu = true;
    this.ifWalletStaffShow = true;

    const url =
      "/staff_ledger_details/walletAmount/" +
      this.openStaffID +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    this.staffService.getFromCMS(url).subscribe((response: any) => {
      this.getWallatData = response;
      this.WalletAmount = response.availableAmount;
    });

    this.getstaffLegderData();
  }

  serviceAreaEvent(event) {
    this.parentStaffList = [];
    this.staffGroupForm.value.parentStaffId = "";
    this.parentStaffView = false;
    const serviceArea_ID = event.value;
    const seviceAreaData: any = [];
    //
    if (serviceArea_ID.length > 0) {
      this.staffGroupForm.controls.parentStaffId.enable();
    } else {
      this.staffGroupForm.controls.parentStaffId.disable();
    }
    if (serviceArea_ID != null && serviceArea_ID.length > 0) {
      let serviceAreaIds = {
        serviceAreaIds: serviceArea_ID
      };
      this.staffService.getAllActiveByServiceArea(serviceArea_ID).subscribe((response: any) => {
        const staffData = response.staffUserlist;
        this.parentStaffList = staffData;
        if (this.parentStaffList.length !== 0) {
          this.parentStaffView = true;
        }
        //   serviceArea_ID.forEach(element => {
        //     staffData.forEach(data => {
        //       data.serviceAreaIdsList.forEach(serviceAreaID => {
        //         if (element == serviceAreaID) {
        //           seviceAreaData.push(data);
        //           this.parentStaffList = seviceAreaData.filter(
        //             staf => staf.username !== this.staffGroupForm.value.username
        //           );
        //         }
        //         if (this.parentStaffList.length !== 0) {
        //           this.parentStaffView = true;
        //         }
        //       });
        //     });
        //   });
        //       const uniqueNames = [];
        //       for (let i = 0; i < this.parentStaffList.length; i++) {
        //         if (uniqueNames.indexOf(this.parentStaffList[i]) === -1) {
        //           uniqueNames.push(this.parentStaffList[i]);
        //         }
        //       }
        var uniqueNames = [];
        for (const item of this.parentStaffList) {
          const found = uniqueNames.some(value => isEqual(value, item));
          if (!found) {
            uniqueNames.push(item);
          }
        }
        this.parentStaffList = uniqueNames;
      });
    }
    this.getbranchByServiceAreaID(serviceArea_ID);
  }

  staffAutofieldValue(data) {
    this.parentStaffList = [];
    this.staffGroupForm.value.parentStaffId = "";
    this.parentStaffView = false;
    const serviceArea_ID = data;
    const seviceAreaData: any = [];
    if (serviceArea_ID.length > 0) {
      this.staffGroupForm.controls.parentStaffId.enable();
    } else {
      this.staffGroupForm.controls.parentStaffId.disable();
    }
    this.parentStaffView = false;
    if (serviceArea_ID != null && serviceArea_ID.length > 0) {
      let serviceAreaIds = {
        serviceAreaIds: serviceArea_ID
      };
      this.staffService.getAllActiveByServiceArea(serviceArea_ID).subscribe((response: any) => {
        const staffData = response.staffUserlist;
        this.parentStaffList = staffData;
        if (this.parentStaffList.length !== 0) {
          this.parentStaffView = true;
        }
        //   serviceArea_ID.forEach(element => {
        //     staffData.forEach(data => {
        //       data.serviceAreaIdsList.forEach(serviceAreaID => {
        //         if (element == serviceAreaID) {
        //           seviceAreaData.push(data);
        //           this.parentStaffList = seviceAreaData.filter(
        //             staf => staf.username !== this.staffGroupForm.value.username
        //           );
        //         }

        //         if (this.parentStaffList.length !== 0) {
        //           this.parentStaffView = true;
        //         }
        //       });
        //     });
        //   });
        var uniqueNames = [];
        for (const item of this.parentStaffList) {
          const found = uniqueNames.some(value => isEqual(value, item));
          if (!found && item.id != this.editStaffId) {
            uniqueNames.push(item);
          }
        }
        this.parentStaffList = uniqueNames;
        // console.log("ParentStaff :::: ", this.parentStaffList);
      });
    }
  }
  getbranchByServiceAreaID(ids) {
    let data = [];
    data = ids;
    const url = "/branchManagement/getAllBranchesByServiceAreaId/withSpecificParam";
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
    });
  }
  getAllDepartments() {
    const url = "/department/all";
    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      this.departmentData = response.departmentList;
      const department = this.departmentData.find(
      (dept: any) => dept.id === this.UserData?.department
     );
     this.usernamee = department ?  "@" + department.name : "@" + localStorage.getItem("mvnoName");
    });
  }
  searchStaffData() {
    if (this.searchOption == "reciept") {
      this.searchReceiptName();
    } else {
      this.searchStaffByName();
    }
  }
  async searchStaffByName() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage == 1) {
      this.itemsPerPage = this.pageITEM;
    } else {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.page = this.currentPage;
    this.searchData.pageSize = this.itemsPerPage;
    this.searchData.filters[0].filterValue = this.searchDeatil.trim();
    this.staffService.staffSearch(this.searchData).subscribe(
      (response: any) => {
        //
        this.staffData = response.dataList;
        this.totalRecords = response.totalRecords;
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
          this.staffData = [];
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

  searchReceiptName() {
    if (!this.searchkey || this.searchkey !== this.searchDeatil) {
      this.currentPage = 1;
    }
    if (this.itemsPerPage == 1) {
      this.itemsPerPage = this.pageITEM;
    }

    const receNo = this.searchDeatil;
    const prefix = this.prefikx ? this.prefikx.trim() : "";
    const data = {};
    this.staffService.staffReceiptSearch(receNo, prefix, data).subscribe(
      (response: any) => {
        this.staffData = response.dataList;
        this.totalReceiptRecords = this.staffreciptMappingList.length;
        this.searchData = [];
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
          this.staffData = [];
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

  addStaff() {
    this.submitted = true;
    if (this.enteredMobilelength != this.inputMobile) {
      this.submitted = false;
      this.mobileError = true;
    }
    if (this.staffGroupForm.valid && this.submitted) {
      //   const mvno = localStorage.getItem("mvnoName");

      if (this.editMode) {
        this.updateStaff();
      } else {
        this.addNewStaff();
      }
    } else {
    }
  }

  private addNewStaff() {
    this.staffGroupForm.controls.password.enable();
    if (this.staffGroupForm.valid) {
      if (
        this.staffGroupForm.value.countryCode == "" ||
        this.staffGroupForm.value.countryCode == null
      ) {
        this.staffGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
      }
      const data = this.staffGroupForm.value;
      data.roleIds = [];
      data.roleIds.push(this.staffGroupForm.controls.roleIds.value);
      data.username = this.staffGroupForm.controls.username.value + this.usernamee;
      this.staffService.add(data).subscribe(
        (response: any) => {
          this.uploadDocuments(response.staffuser.id);
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll("");
          }

          this.imageUrl = "";
          this.clearFormData();
          this.parentStaffList = [];
         
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.loginService.refreshToken();
          this.loginService.getAclEntry();
          this.staffGroupForm.controls.password.enable();
          this.isStaffCreateOrEdit = false;
          this.isStaffList = true;
          this.parentStaffView = false;
          this.isPasswordShow = false;
          this.submitted = false;
        },
        (error: any) => {
        if(error.status === 500 || error.status === 400){
            this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }else{
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
  }

  private updateStaff() {
    this.staffGroupForm.controls.password.disable();
    if (this.staffGroupForm.valid) {
      if (
        this.staffGroupForm.value.countryCode == "" ||
        this.staffGroupForm.value.countryCode == null
      ) {
        this.staffGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
      }
      this.editData = this.staffGroupForm.getRawValue();
      this.editData.staffId = this.editStaffId;
      this.editData.roleIds = [];
      this.editData.roleIds.push(this.staffGroupForm.controls.roleIds.value);
      this.staffService.update(this.editData, this.editData.staffId).subscribe(
        (response: any) => {
          this.uploadDocuments(this.editStaffId);

          this.imageUrl = "";
          this.openStaffListMenu();
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll("");
          }
          this.loginService.refreshToken();
          this.loginService.getAclEntry();
          this.parentStaffList = [];
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.clearFormData();
          this.parentStaffView = false;
          this.isPasswordShow = false;
          this.editMode = false;

          this.businessData.forEach(element => {
            this.editData.businessUnitIdsList.forEach(id => {
              if (element.id == id) {
                element.flag = false;
              }
            });
          });
          this.submitted = false;
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
  editStaffById(staff) {
    this.parentStaffList = [];
    this.imageUrl = "";
    this.editMode = true;
    this.isStaffList = false;
    this.isStaffCreateOrEdit = true;
    this.staffGroupForm.controls.password.disable();
    this.isPasswordShow = true;
    this.getAllRole();
    this.getBankDetail();
    this.staffService.getAllRoleData().subscribe(result => {
      this.roleList = result.dataList;
    });
    this.staffService.getAllRoleDataForLoggedInUser().subscribe(result => {
      this.loggedInUserRoleList = result.dataList;
    });
    this.staffService.getTeamsData().subscribe(result => {
      this.teams = result.dataList;
    });
    if (this.statusCheckService.isActiveTacacs) {
      this.gettacacsALGData();
    }
    this.getAllBranch();
    this.getAllDepartments();
    const serviceArea = localStorage.getItem("serviceArea");
    const serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.getserviceAreaListForCafCustomer();
      this.commondropdownService.filterPartnerAll();
    } else {
      this.commondropdownService.getserviceAreaListForCafCustomer();
      this.commondropdownService.getpartnerAll();
    }

    this.editStaffId = staff.id;
    this.staffService.getById(this.editStaffId).subscribe((response: any) => {
        
      let staff = response.Staff;
      if (staff) this.setBranchInEditStaff(staff.serviceAreaIdsList, staff);
      if (staff.serviceAreaIdsList == null) {
        staff.serviceAreaIdsList = [];
        staff.serviceAreaNameList.forEach(element => {
          staff.serviceAreaIdsList.push(element.id);
        });
      }
      if (staff.parentStaffId) {
        this.staffGroupForm.patchValue({
          parentStaffId: staff.parentStaffId,
          partnerid: staff.partnerid,
          file: staff.profileImage ? [{}] : ""
        });
        this.parentStaffView = true;
        this.staffAutofieldValue(staff.serviceAreaIdsList);
      } else {
        staff.parentStaffId = "";
        this.staffAutofieldValue(staff.serviceAreaIdsList);
      }
      const servicAreaId = staff.serviceAreaIdsList;
      if (staff.profileImage) {
        this.imageUrl = `data:image/jpeg;base64,${staff.profileImage}`;
      }
      staff.password = "";
      this.editData = staff;
      this.staffGroupForm.patchValue(this.editData);
      staff.password = "";
      if (this.editData.businessUnitIdsList == null) {
        if (staff.businessUnitNameList != null) {
          staff.businessUnitIdsList = [];
          staff.businessUnitNameList.forEach(element => {
            staff.businessUnitIdsList.push(element.id);
          });
        }
      }
      this.editData = staff;
      this.staffGroupForm.patchValue(this.editData);
      this.staffGroupForm.controls.roleIds.patchValue(this.editData.roleIds[0]);
      this.staffGroupForm.patchValue({ serviceAreaIdsList: servicAreaId });
      //   this.getbranchByServiceAreaID(servicAreaId);
      this.staffGroupForm.controls.firstname.enable();
      this.staffGroupForm.controls.lastname.enable();
    //   this.staffGroupForm.controls.username.disable();
      this.businessData.forEach(element => {
        if (this.editData.businessUnitIdsList != null) {
          this.editData.businessUnitIdsList.forEach(id => {
            if (element.id == id) {
              element.flag = true;
            }
          });
        } else {
          element.flag = false;
        }
      });
      if (staff?.department != null && staff?.department != undefined && staff?.department != "") {
        this.staffGroupForm.controls.department.setValue(staff?.department);
        if (
          this.UserData?.department != null &&
          this.UserData?.department != undefined &&
          this.UserData?.department != ""
        ) {
          this.isDepartment = true;
        } else {
          this.isDepartment = false;
        }
      } else {
        this.staffGroupForm.controls.department.setValue("");
        this.isDepartment = false;
      }
    });
  }

  deleteConfirm(staffId) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Staff member?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteStaffById(staffId);
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
  deleteStaffById(staffId) {
    this.staffService.delete(staffId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.staffData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }

        if (this.staffData != 1 && this.staffListDatalength == 1) {
          this.staffData = this.staffData - 1;
        }

        if (this.searchkey) {
          this.searchStaffData();
        } else {
          this.getAll("");
        }
        this.openStaffListMenu();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });

        this.clearFormData();
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

  clearSearchForm() {
    this.getAll("");
    this.searchDeatil = "";
    this.prefikx = "";
    this.searchOption = "globalsearch";
   this.currentPage = 1;
    this.openStaffListMenu();
  }

  clearFormData() {
    this.staffGroupForm.reset();
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAll(this.showItemPerPage);
    } else {
      this.searchStaffData();
    }
  }

  getAll(list) {
    let size;
    this.searchkey = "";
    const pageList = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      if (this.showItemPerPage == 1) {
        this.itemsPerPage = this.pageITEM;
      } else {
        this.itemsPerPage = this.showItemPerPage;
      }
    }

    const data = {
      page: this.currentPage,
      pageSize: this.itemsPerPage
    };
    // this.staffService.getAllStaff().subscribe(
    this.staffService.getAllStaffList(data).subscribe(
      (response: any) => {
        var mvnoId = Number(localStorage.getItem("mvnoId"));
        this.staffData = response.staffUserlist;
        this.totalRecords = response.pageDetails.totalRecords;
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
  getAllBranch() {
    this.commondropdownService.getMethodWithCache("/branchManagement/all").subscribe(
      (response: any) => {
        this.branchList = response.dataList;
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

  getAllRole() {
    this.roleService.getAll().subscribe(
      (response: any) => {
        this.roles = response.roleList;
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
    this.clearFormData();
    this.currentPage = pageNumber;
    if (this.searchkey) {
      this.searchStaffData();
    } else {
      this.getAll("");
    }
  }

  getCustomerDataForPasswordChange(staff) {
    this.changePasswordModal = true;
    this.ifgenerateOtpField = true;
    this.staffOTPValue = "";
    this.mvnoIdForPwdChange = staff.mvnoId;
    this.userNameForPasswordUpdate = staff.username;
    this.staffPhoneNumber = staff.phone;
    this.staffCountryCode = staff.countryCode;
    this.staffEmail = staff.email;
    this.changePasswordForm.patchValue({
      userName: this.userNameForPasswordUpdate
    });
  }

  mapChangePasswordFormDataWithObject() {
    this.passwordData.newPassword = this.changePasswordForm.value.newPassword;
    this.passwordData.confirmNewPassword = this.changePasswordForm.value.confirmNewPassword;
    this.passwordData.username = this.userNameForPasswordUpdate;
  }

  changePassword() {
    this.changePasswordForm.value.userName = this.userNameForPasswordUpdate;
    this.staffService.changePassword(this.changePasswordForm.value).subscribe(
      (response: any) => {
        this.changePasswordModal = false;
        this.clearChangePasswordForm();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearChangePasswordForm() {
    this.ifgenerateOtpField = true;
    this.staffOTPValue = "";
    this.changePasswordForm.controls.otp.reset();
    //this.changePasswordForm.reset();
  }
  staffUserData(id) {
    if (id) {
      this.staffService.getStaffUserData(id).subscribe((response: any) => {
        this.UserData = response.Staff;
        this.userName = this.UserData.username;
        this.changePasswordForm.value.userName = this.userName;
        this.businessUnitIdsList = response.Staff.businessUnitIdsList;
        this.getALlBUData();
        // console.log("Username", this.UserData.username);
      });
    }
  }

  gettacacsALGData() {
    const url = "/tacacs-access-level-group/get-access-level-groups";
    let plandata = {
      page: 0,
      pageSize: 100
    };
    this.tacacsService.getMethod(url, { params: plandata }).subscribe((res: any) => {
      this.TacacsDeviceList = res.data.accessLevelGroup.content;
    });
  }

  getALlBUData() {
    this.staffService.getBUFromStaff().subscribe(
      (response: any) => {
        this.businessData = response.dataList;
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
  addNewReceipt(data) {
    this.paymentReciptModal = true;
    this.staffRecepetId = data.id;
    this.staffGroupForm.patchValue(data);
  }

  clearpaymentReciptForm() {
    this.staffRecepetId == "";
    this.paymentReciptForm.reset();
    
  }
  closepaymentReciptForm(){
    this.paymentReciptModal = false;
  }

  saveNewRecipt() {
    const staffUserServiceMappingList = {
      fromreceiptnumber: this.paymentReciptForm.value.receiptFrom,
      id: "",
      identityKey: "",
      isActive: true,
      isDeleted: true,
      mvnoId: "",
      prefix: this.paymentReciptForm.value.prefix,
      stfmappingId: this.staffRecepetId,
      toreceiptnumber: this.paymentReciptForm.value.receiptTo
    };

    this.customerManagementService.addNewReceipt(staffUserServiceMappingList).subscribe(
      (response: any) => {
        if (this.searchkey) {
          this.searchStaffData();
        } else {
          this.getAll("");
        }
        this.paymentReciptModal = false;
        this.clearFormData();
        this.parentStaffList = [];
        this.clearpaymentReciptForm();
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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageReceiptChanged(pageNumber) {
    this.currentReceiptPage = pageNumber;
  }
  clearReceiptForm() {
    this.searchReceptNumber = "";
    this.staffreciptMappingList = this.satffUserData.staffUserServiceMappingList;
  }
  getBankDetail() {
    const url = "/bankManagement/searchByStatus?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
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

  showWithdrawalAmountModel() {
    this.staffWalletModal = true;
  }

  clearWalletStaffForm() {
    this.staffWalletModal = false;
    this.radiusWalletGroupForm.reset();
  }
  saveManageBalance() {
    let data: any = [];
    const data1 = this.radiusWalletGroupForm.value;

    data = {
      action: "",
      amount: this.radiusWalletGroupForm.value.amount,
      bankId: this.radiusWalletGroupForm.value.bankId,
      date: this.radiusWalletGroupForm.value.date,
      remarks: this.radiusWalletGroupForm.value.remarks,
      // transactionType: "DR",
      buId: "",
      creditDocId: "",
      custId: "",
      id: this.openStaffID,
      identityKey: "",
      mvnoId: "",
      paymentMode: ""
      // staffUser: {
      //   id: this.openStaffID,
      // },
    };

    const url = "/staff_ledger_details/transferredToBank";
    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 405) {
          this.radiusWalletGroupForm.reset();
          this.staffWalletModal = false;

          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.radiusWalletGroupForm.reset();
          this.staffWalletModal = false;
          this.openStaffWallet();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
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

  pageLegderChanged(e) {
    this.currentLegderPage = e;
  }
  getstaffLegderData() {
    const url = "/staff_ledger_details/getStaffLedgerDetailsbyStaffId/" + this.openStaffID;
    this.staffService.getFromCMS(url).subscribe(
      (response: any) => {
        this.staffLegderData = response.dataList;
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

  canExit() {
    if (!this.staffGroupForm.dirty) {
      return true;
    }
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

  // generate OTP
  genrateOtp() {
    this.staffOTPValue = "";
    const data = {
      countryCode: this.staffCountryCode,
      mobileNumber: this.staffPhoneNumber,
      emailId: this.staffEmail,
      profile: "OTP"
    };

    const url = "/otp/generate?mvnoId=" + localStorage.getItem("mvnoId");

    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 405) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.otp,
            icon: "far fa-check-circle"
          });
        }
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
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

  // Validate OTP
  ValidOtp() {
    const data = {
      mobileNumber: this.staffPhoneNumber,
      emailId: this.staffEmail,
      otp: this.staffOTPValue
    };

    const url = "/otp/validate";

    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.ifgenerateOtpField = true;

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.ifgenerateOtpField = false;

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
            icon: "far fa-times-circle"
          });
        } 
        else if(error.error.status == 417){
            this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        }else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  uploadDocuments(uploadDocStaffId: any) {
    this.submitted = true;
    const formData = new FormData();
    let fileArray: FileList;

    if (this.staffGroupForm.value.file) {
      // if (this.staffGroupForm.controls.file.value.length > 0) {

      fileArray = this.staffGroupForm.controls.file.value;
      formData.append("file", fileArray[0]);
      const url = `/staff/uploadProfileImage?staffId=${uploadDocStaffId}`;
      this.staffService.postApiMethod(url, formData).subscribe(
        (response: any) => {
          this.submitted = false;
          //   this.messageService.add({
          //     severity: "success",
          //     summary: "Successfully",
          //     detail: response.message,
          //     icon: "far fa-check-circle",
          //   });
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll("");
          }
          $("#uploadDocumentId").modal("hide");
          this.staffService.getStaffUserProfile(this.userId).subscribe((response: any) => {
            this.profileImg = response.data;
            this.staffService.staffImg = this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${response.data}`
            );
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
      // }
    } else {
    }
  }

  onFileChangeUpload(files: FileList) {
    const selectedFile = files.item(0);
    if (!selectedFile) {
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only JPEG and PNG files are allowed.");
      return;
    }
    const maxSize = 2097152;
    if (selectedFile.size > maxSize) {
      alert("File size cannot exceed 2MB.");
      return;
    }
    this.staffGroupForm.patchValue({
      file: files
    });
    this.fileToUpload = selectedFile;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  }

  setBranchInEditStaff(ids, staffBranch: any) {
    let data = [];
    data = ids;
    const url = "/branchManagement/getAllBranchesByServiceAreaId/withSpecificParam";
    this.staffService.postcallMethod(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      this.branchData.forEach((element1, i) => {
        if (staffBranch.branchName.length > 0) {
          if (staffBranch.branchName === element1.name) {
            this.staffGroupForm.patchValue({
              branchId: element1.id
            });
          }
        }
      });
    });
  }


getMvnoById(id) {
  if (!id) {
    id = Number(localStorage.getItem("mvnoId"));
  }

  const url = "/mvno/" + id;
  this.adoptCommonBaseService.get(url).subscribe(
    (response: any) => {
      this.viewMvnoData = response.data;
      
      // set editable flag from API
      this.usernameEditable = !!this.viewMvnoData?.isDefualtUsernameEditable;

      // set username (either from API or localStorage)
      if (this.viewMvnoData?.username) {
        this.usernamee = '@' + this.viewMvnoData.username;
        localStorage.setItem('mvnoName', this.viewMvnoData.username);
      } else {
        const mvnoName = localStorage.getItem('mvnoName');
        this.usernamee = mvnoName ? '@' + mvnoName : '';
    }
    },
    (error: any) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error?.ERROR || 'Something went wrong',
        icon: 'far fa-times-circle'
      });
    }
  );
}

onUsernameChange() {
  const cleanName = this.usernamee.startsWith('@')
    ? this.usernamee.substring(1)
    : this.usernamee;
  localStorage.setItem('mvnoName', cleanName);
}

closePasswordModal(){
    this.changePasswordModal = false;
}

openServiceArea(){
    this.serviceareaModal = true;
}

closeServiceArea(){
    this.serviceareaModal = false;
}

openBussinessModal(){
    this.bussinessModal = true;
}

closeBussinessModal(){
    this.bussinessModal = false;
}

openTeamModal(){
    this.teamModal = true;
}

closeTeamModal(){
    this.teamModal = false;
}

allowNumbersOnly(event: any) {
  const value = event.target.value;
  event.target.value = value.replace(/[^0-9]/g, '');
  this.staffGroupForm.controls.phone.setValue(event.target.value);
}

}
