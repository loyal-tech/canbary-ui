import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomerInventoryManagementService } from "src/app/service/customer-inventory-management.service";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { CustomerInventoryDetailsService } from "src/app/service/customer-inventory-details.service";
import { element } from "protractor";
import { Table } from "primeng/table";
import { LoginService } from "src/app/service/login.service";
import { INVENTORYS, MASTERS } from "src/app/constants/aclConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InwardService } from "src/app/service/inward.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
declare var $: any;
@Component({
  selector: "app-common-inventory-management",
  templateUrl: "./common-inventory-management.component.html",
  styleUrls: ["./common-inventory-management.component.css"]
})
export class CommonInventoryManagementComponent implements OnInit {
  @Input() data: any;
  @Input() type: any;
  @Input() openFrom: string = "";
  inventoryListDataCurrentPage = 1;
  inventoryListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  inventoryListDataTotalRecords: number;
  assignedInventoryList = [];
  loggedInStaffId = localStorage.getItem("userId");
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  private assignInventoryCustomerId: any;
  assignedInventoryListWithSerial = [];
  viewAssignInventoryWithSerial: boolean = false;

  isOltNo: boolean = false;
  isChassisNo: boolean = false;
  isLineCardNo: boolean = false;
  isDnSplitterNo: boolean = false;
  isDnSplitterPairNo: boolean = false;
  isSnSplitterNo: boolean = false;
  isSnSplitterPairNo: boolean = false;

  customerInventoryMappingId: any;
  assignProduct: any;
  assignInwardID: any;
  assignInwardForm: FormGroup;
  rejectInwardForm: FormGroup;
  inventoryAssignForm: FormGroup;
  inventoryReplaceForm: FormGroup;
  assignInwardSubmitted: boolean = false;
  approveChangeStatusModal: boolean = false;
  rejectChangeStatusModal: boolean = false;
  assignInventory: boolean = false;
  rejectInwardSubmitted: boolean = false;
  inventoryAssignSubmitted: boolean = false;
  inventoryReplaceSubmitted: boolean = false;
  allActiveProducts: any = [];
  macAddressList: any = [];
  selectedMACAddress: any = [];
  staffUserId: any;
  approved: boolean = false;
  reject: boolean = false;
  approveInventoryData: any = [];
  rejectInventoryData: any = [];
  selectStaffReject: any;
  selectStaff: any;
  getAllSerializedProductFlag: boolean = false;
  getItemSelctionFlag: boolean = false;
  getAllNonSerializedProductFlag: boolean = false;
  serializedItemAssignFlag: boolean = false;
  nonSerializedItemAssignFlag: boolean = false;
  allActiveNonTrackableProducts: any = [];
  getNonTrackableProductQtyList: any = [];
  availableQtyFlag: boolean = false;
  assignInventoryAccess: boolean = false;
  editAccess: boolean = false;
  approveProgressAccess: boolean = false;
  deleteAccess: boolean = false;
  showQtyError: boolean;
  negativeAssignQtyError: boolean;
  availableQty = 0;
  hasMac: boolean;
  hasSerial: boolean;
  enterMacSerial: any = "";
  editMacSerialBtn: any = "";
  fileterGlobal: any = "";
  replaceInventory: boolean = false;
  isEditEnable: boolean = false;
  @ViewChild("dt") table: Table;
  inventoryStatus = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  ItemSelectionType = [
    { label: "Serialized Item", value: "Serialized Item" },
    { label: "Non Serialized Item", value: "Non Serialized Item" }
  ];
  replacementreasonList = [
    { label: "Defective", value: "Defective" },
    { label: "Upgrade", value: "Upgrade" }
  ];
  productTotalInPorts: number = 0;
  productAvailableInPorts: number = 0;
  productTotalOutPorts: number = 0;
  productavailableOutPorts: number = 0;
  deviceTotalInPorts: number = 0;
  deviceAvailableInPorts: number = 0;
  deviceTotalOutPorts: number = 0;
  deviceAvailableOutPorts: number = 0;
  isProductSelected: boolean = false;
  deviceName: string = "";
  currentDate: Date = new Date();
  currentMacAddressListdata = 1;
  macAddressListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  macAddressListtotalRecords: any;
  newFirstMacAddress: number = 0;
  productMacAddressId: any;
  optionValue: any;
  searchMacData: any;
  macOptionSelect = this.commondropdownService.searchInventoryOption;
  searchOption: any;
  searchMacDeatil: string;
  staffId: string;
  searchForm: FormGroup;
  ifsearchLocationModal = false;
  currentPagesearchLocationList = 1;
  searchLocationForm: FormGroup;
  searchLocationData: any;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: String;
  iflocationFill = false;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private customerInventoryManagementService: CustomerInventoryManagementService,
    public CustomerInventoryDetailsService: CustomerInventoryDetailsService,
    public loginService: LoginService,
    public commondropdownService: CommondropdownService,
    private inwardService: InwardService,
    public adoptCommonBaseService: AdoptCommonBaseService
  ) {}

  ngOnInit(): void {
    this.assignInventoryAccess = this.loginService.hasPermission(
      this.openFrom == "service_area"
        ? MASTERS.SA_INVENTORY_ASSIGN
        : INVENTORYS.POP_INVEN_LIST_ASSIGN_INVENTORY
    );
    this.editAccess = this.loginService.hasPermission(
      this.openFrom == "service_area" ? MASTERS.SA_INVENTORY_EDIT : INVENTORYS.INVEN_LIST_EDIT
    );
    this.deleteAccess = this.loginService.hasPermission(
      this.openFrom == "service_area" ? MASTERS.SA_INVENTORY_DELETE : INVENTORYS.INVEN_LIST_DELETE
    );
    this.approveProgressAccess = this.loginService.hasPermission(
      this.openFrom == "service_area"
        ? MASTERS.SA_INVENTORY_APPROVE
        : INVENTORYS.INVEN_LIST_PROGRESS
    );
    this.staffUserId = localStorage.getItem("userId");
    this.getAssignedInventoryList();
    this.assignInwardForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectInwardForm = this.fb.group({
      remark: ["", Validators.required]
    });

    // this.initInventoryAssignForm();
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["1"],
      productId: ["", Validators.required],
      //customerId: [this.customerId],
      staffId: [""],
      inwardId: [""],
      assignedDateTime: [this.currentDate, Validators.required],
      status: [""],
      mvnoId: [""],
      ownerId: [this.data.id],
      ownerType: [this.type],
      itemTypeFlag: ["", Validators.required],
      nonSerializedQty: [""],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      oltNo: [""],
      chassisNo: [""],
      lineCardNo: [""],
      dnSplitterNo: [""],
      dnSplitterPairNo: [""],
      snSplitterNo: [""],
      snSplitterPairNo: [""]
    });

    this.inventoryReplaceForm = this.fb.group({
      macMappingId: [""],
      id: [""],
      qty: ["1"],
      productId: ["", Validators.required],
      staffId: [""],
      inwardId: [""],
      assignedDateTime: [this.currentDate, Validators.required],
      status: [""],
      mvnoId: [""],
      ownerId: [this.data.id],
      ownerType: [this.type],
      itemTypeFlag: ["", Validators.required],
      nonSerializedQty: [""],
      replacementReason: ["", Validators.required]
    });

    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });

    this.inventoryReplaceForm.get("nonSerializedQty").valueChanges.subscribe(val => {
      const total = val;
      if (total > this.availableQty) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }
      if (total < 0 || total == 0) {
        this.negativeAssignQtyError = true;
      } else {
        this.negativeAssignQtyError = false;
      }
    });

    this.inventoryAssignForm.get("nonSerializedQty").valueChanges.subscribe(val => {
      const total = val;
      if (total > this.availableQty) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }
      if (total < 0 || total == 0) {
        this.negativeAssignQtyError = true;
      } else {
        this.negativeAssignQtyError = false;
      }
    });
    this.searchForm = this.fb.group({
      searchOption: [""],
      searchMacDeatil: [""]
    });
    this.searchMacData = {
      filterBy: "",
      paginationRequestDTO: {
        page: "",
        pageSize: "",
        filters: [
          {
            filterDataType: "",
            filterValue: "",
            filterColumn: "any",
            filterOperator: "equalto",
            filterCondition: "and"
          }
        ]
      },
      productId: "",
      ownerId: "",
      ownerType: ""
    };
  }
  selMacSearchOption(event) {
    this.searchForm.patchValue({
      searchMacDeatil: ""
    });

    this.selectedMACAddress = "";
    this.currentMacAddressListdata = 1;
    this.newFirstMacAddress = 0;

    this.optionValue = event;
  }
  searchMac() {
    const staffId = localStorage.getItem("userId");
    this.searchMacData.paginationRequestDTO.filters[0].filterValue =
      this.searchForm.value.searchMacDeatil;
    this.searchMacData.paginationRequestDTO.filters[0].filterColumn =
      this.searchForm.value.searchOption;
    this.searchMacData.productId = this.productMacAddressId;
    this.searchMacData.ownerId = Number(staffId);
    this.searchMacData.ownerType = "staff";
    this.searchMacData.paginationRequestDTO.page = this.currentMacAddressListdata;
    this.searchMacData.paginationRequestDTO.pageSize = this.macAddressListdataitemsPerPage;
    const url = "/outwards/searchItemHistoryByProduct";
    this.inwardService.postMethod(url, this.searchMacData).subscribe(
      (response: any) => {
        this.macAddressList = response.dataList;
        this.macAddressListtotalRecords = response.totalRecords;
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
  clearMac() {
    this.searchForm.reset();
    this.newFirstMacAddress = 0;
    this.currentMacAddressListdata = 1;
    this.macAddressListdataitemsPerPage = 20;
    let obj = {
      value: this.productMacAddressId
    };
    this.getMacAddressList(obj);
  }

  getAssignedInventoryList(): void {
    const data = {
      filters: [
        {
          filterValue: this.data.id,
          filterColumn: this.type
        }
      ],
      page: this.inventoryListDataCurrentPage,
      pageSize: this.inventoryListItemsPerPage,
      sortBy: "createdate",
      sortOrder: 0
    };
    const url = "/inwards/getByOwnerIdAndType";
    this.customerInventoryManagementService.postMethod(url, data).subscribe(
      (res: any) => {
        this.assignedInventoryList = res.dataList;
        this.inventoryListDataTotalRecords = res.totalRecords;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedEventAssignInventory(pageNumber): void {
    this.inventoryListDataCurrentPage = pageNumber;
    this.getAssignedInventoryList();
  }

  itemPerPageChangedEventAssignInventory(event): void {
    this.inventoryListItemsPerPage = Number(event.value);
    if (this.inventoryListDataCurrentPage > 1) {
      this.inventoryListDataCurrentPage = 1;
    }
    this.getAssignedInventoryList();
  }

  editCustomerInventory(mappingId, assignInventory): void {
    this.assignProduct = assignInventory;
    this.customerInventoryMappingId = mappingId;
    const invenoryDetailsMapping: any[] = this.assignedInventoryList.find(
      inventory => inventory.id === mappingId
    ).inOutWardMACMapping;
    if (invenoryDetailsMapping.length === 0) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Assigned product is not eligible for replace.",
        icon: "far fa-times-circle"
      });
    } else {
      this.viewAssignInventoryWithSerial = true;
      this.assignedInventoryListWithSerial = invenoryDetailsMapping;
    }
  }

  removeConfirmationInventory(assignedInventoryId: number) {
    if (assignedInventoryId) {
      this.confirmationService.confirm({
        message: "Do you want to remove inventory " + "?",
        header: "Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.removeInventory(assignedInventoryId, "true");
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

  removeInventory(id, type): void {
    // const url = `/inoutWardMacMapping/removeInventory?macMappingId=${id}&customerInventoryId=${this.customerInventoryMappingId}`;
    const url = `/inoutWardMacMapping/removeInventoryfromowner?macMappingId=${id}&isflag=` + type;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        if (res.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.viewAssignInventoryWithSerial = false;
          this.getAssignedInventoryList();

          this.messageService.add({
            severity: "success",
            summary: "success",
            detail: "Removed Successfully.",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  approveChangeStatus(id) {
    this.approveChangeStatusModal = true;
    this.assignInwardID = id;
  }
  rejectChangeStatus(id) {
    this.rejectChangeStatusModal = true;
    this.assignInwardID = id;
  }

  closeApproveInventoryModal() {
    this.assignInwardSubmitted = false;
    this.assignInwardForm.reset();
    this.assignInwardID = "";
    this.approveChangeStatusModal = false;
  }

  closeRejectInventoryModal() {
    this.rejectInwardSubmitted = false;
    this.assignInwardID = "";
    this.rejectInwardForm.reset();
    this.rejectChangeStatusModal = false;
  }

  getAllProducts() {
    const url = "/product/getAllNetworkandNaBindProduct";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.allActiveProducts = res.dataList;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getMacAddressList(event) {
    if (event && event.value !== this.productMacAddressId) {
      this.currentMacAddressListdata = 1;
      this.newFirstMacAddress = 0;
    }
    const staffId = localStorage.getItem("userId");
    this.productMacAddressId = event.value;
    let product = this.allActiveProducts.find(element => element.id == this.productMacAddressId);
    this.hasMac = product.productCategory.hasMac;
    this.hasSerial = product.productCategory.hasSerial;
    let currentPage = this.currentMacAddressListdata;
    this.macAddressList = [];
    this.isOltNo = false;
    this.isChassisNo = false;
    this.isLineCardNo = false;
    this.isDnSplitterNo = false;
    this.isDnSplitterPairNo = false;
    this.isSnSplitterNo = false;
    this.isSnSplitterPairNo = false;
    this.inventoryAssignForm.get("oltNo").reset();
    this.inventoryAssignForm.get("chassisNo").reset();
    this.inventoryAssignForm.get("lineCardNo").reset();
    this.inventoryAssignForm.get("dnSplitterNo").reset();
    this.inventoryAssignForm.get("dnSplitterPairNo").reset();
    this.inventoryAssignForm.get("snSplitterNo").reset();
    this.inventoryAssignForm.get("snSplitterPairNo").reset();
    const requestData = {
      productId: this.productMacAddressId,
      ownerId: staffId,
      ownerType: "staff",
      paginationRequestDTO: {
        page: currentPage,
        pageSize: this.macAddressListdataitemsPerPage
      }
    };

    const url = "/outwards/getItemHistoryByProduct";

    this.customerInventoryManagementService.postMethod(url, requestData).subscribe(
      (res: any) => {
        if (res?.dataList?.length > 0) {
          this.macAddressList = res.dataList;
          this.macAddressListtotalRecords = res.totalRecords;
          this.getItemSelctionFlag = true;
          if (product.productCategory.deviceType == "OLT") {
            this.isOltNo = true;
          } else if (product.productCategory.deviceType == "Line Cards") {
            this.isOltNo = true;
            this.isChassisNo = true;
            this.isLineCardNo = true;
          } else if (product.productCategory.deviceType == "DN Splitter") {
            this.isOltNo = true;
            this.isChassisNo = true;
            this.isLineCardNo = true;
            this.isDnSplitterNo = true;
            this.isDnSplitterPairNo = true;
          } else if (product.productCategory.deviceType == "SN Splitter") {
            this.isOltNo = true;
            this.isChassisNo = true;
            this.isLineCardNo = true;
            this.isDnSplitterNo = true;
            this.isDnSplitterPairNo = true;
            this.isSnSplitterNo = true;
            this.isSnSplitterPairNo = true;
          }

          const oltNoCtrl = this.inventoryAssignForm.get("oltNo");
          const chassisNoCtrl = this.inventoryAssignForm.get("chassisNo");
          const lineCardNoCtrl = this.inventoryAssignForm.get("lineCardNo");
          const dnSplitterNoCtrl = this.inventoryAssignForm.get("dnSplitterNo");
          const snSplitterNoCtrl = this.inventoryAssignForm.get("snSplitterNo");

          if (this.isOltNo) {
            oltNoCtrl?.setValidators([Validators.required]);
          } else {
            oltNoCtrl?.clearValidators();
          }
          oltNoCtrl?.updateValueAndValidity();

          if (this.isChassisNo) {
            chassisNoCtrl?.setValidators([Validators.required]);
          } else {
            chassisNoCtrl?.clearValidators();
          }
          chassisNoCtrl?.updateValueAndValidity();

          if (this.isLineCardNo) {
            lineCardNoCtrl?.setValidators([Validators.required]);
          } else {
            lineCardNoCtrl?.clearValidators();
          }
          lineCardNoCtrl?.updateValueAndValidity();
          if (this.isDnSplitterNo) {
            dnSplitterNoCtrl?.setValidators([Validators.required]);
          } else {
            dnSplitterNoCtrl?.clearValidators();
          }
          dnSplitterNoCtrl?.updateValueAndValidity();
          if (this.isSnSplitterNo) {
            snSplitterNoCtrl?.setValidators([Validators.required]);
          } else {
            snSplitterNoCtrl?.clearValidators();
          }
          snSplitterNoCtrl?.updateValueAndValidity();
          // this.newFirstMacAddress = 1;
        } else {
          this.macAddressList = [];
          this.newFirstMacAddress = 0;
          this.macAddressListtotalRecords = 0;
          this.getItemSelctionFlag = false;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Product MAC address not available",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  paginateMacAddress(event) {
    this.newFirstMacAddress = event.first;
    this.macAddressListdataitemsPerPage = event.rows;
    this.currentMacAddressListdata = event.page + 1;
    let obj = {
      value: this.productMacAddressId
    };
    this.getMacAddressList(obj);
  }
  assigneInventory(): void {
    this.inventoryAssignSubmitted = true;
    let assigneInventoryData: any = "";
    assigneInventoryData = this.inventoryAssignForm.value;
    assigneInventoryData.qty = "1";
    assigneInventoryData.itemId = this.selectedMACAddress?.itemId;
    assigneInventoryData.staffId = this.staffUserId;
    assigneInventoryData.inOutWardMACMapping = [];
    if (this.selectedMACAddress != "") {
      assigneInventoryData.inOutWardMACMapping.push(this.selectedMACAddress);
    }

    if (this.inventoryAssignForm.valid) {
      if (assigneInventoryData.inOutWardMACMapping.length > 0) {
        const url = "/inwards/assignToEndOwner";
        this.customerInventoryManagementService
          .postMethod(url, assigneInventoryData)
          .subscribe((res: any) => {
            if (res.responseCode == 200) {
              this.assignInventoryModalClose();
              this.getAssignedInventoryList();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Assigned inventory successfully.",
                icon: "far fa-check-circle"
              });
            } else if (res.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            }
          });
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Please Select One Mac Address",
          icon: "far fa-check-circle"
        });
      }
    }
  }

  assignInventoryModalOpen() {
    this.assignInventory = true;
    this.inventoryAssignForm.get("assignedDateTime").setValue(this.currentDate);
  }

  assignInventoryModalClose() {
    this.inventoryAssignSubmitted = false;
    //this.inventoryAssignForm.reset();
    this.inventoryAssignForm.get("id").reset();
    this.inventoryAssignForm.get("qty").reset();
    this.inventoryAssignForm.get("productId").reset();
    this.inventoryAssignForm.get("staffId").reset();
    this.inventoryAssignForm.get("inwardId").reset();
    this.inventoryAssignForm.get("assignedDateTime").reset();
    this.inventoryAssignForm.get("status").reset();
    this.inventoryAssignForm.get("mvnoId").reset();
    this.inventoryAssignForm.get("itemTypeFlag").reset();
    this.inventoryAssignForm.get("latitude").reset();
    this.inventoryAssignForm.get("longitude").reset();
    this.inventoryAssignForm.get("oltNo").reset();
    this.inventoryAssignForm.get("chassisNo").reset();
    this.inventoryAssignForm.get("lineCardNo").reset();
    this.inventoryAssignForm.get("dnSplitterNo").reset();
    this.inventoryAssignForm.get("dnSplitterPairNo").reset();
    this.inventoryAssignForm.get("snSplitterNo").reset();
    this.inventoryAssignForm.get("snSplitterPairNo").reset();
    this.selectedMACAddress = "";
    this.fileterGlobal = "";
    this.macAddressList = [];
    this.isOltNo = false;
    this.isChassisNo = false;
    this.isLineCardNo = false;
    this.isDnSplitterNo = false;
    this.isDnSplitterPairNo = false;
    this.isSnSplitterNo = false;
    this.isSnSplitterPairNo = false;
    // this.initInventoryAssignForm();
    this.getAllNonSerializedProductFlag = false;
    this.getAllSerializedProductFlag = false;
    this.serializedItemAssignFlag = false;
    this.nonSerializedItemAssignFlag = false;
    this.availableQtyFlag = false;
    this.getItemSelctionFlag = false;
    this.showQtyError = false;
    this.negativeAssignQtyError = false;
    this.assignInventory = false;
    this.currentMacAddressListdata = 1;
    this.newFirstMacAddress = 0;
  }

  approveInventory(): void {
    this.assignInwardSubmitted = true;
    if (this.assignInwardForm.valid) {
      this.approved = false;
      this.approveInventoryData = [];
      this.selectStaff = null;
      let approvalInwardData = {
        id: this.assignInwardID,
        approvalStatus: "Approve",
        approvalRemark: this.assignInwardForm.controls.remark.value
      };
      const url = `/inwards/approveInventoryFromOwner?inventoryApprovalRemark=${approvalInwardData.approvalRemark}&inventoryMappingId=${approvalInwardData.id}&isApproveRequest=true`;
      this.customerInventoryManagementService.getMethod(url).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.closeApproveInventoryModal();
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            if (response.dataList) {
              this.approved = true;
              this.approveInventoryData = response.dataList;
            } else {
              this.getAssignedInventoryList();
            }
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
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }
  rejectInventory(): void {
    this.rejectInwardSubmitted = true;
    if (this.rejectInwardForm.valid) {
      this.reject = false;
      this.selectStaffReject = null;
      this.rejectInventoryData = [];
      let approvalInwardData = {
        id: this.assignInwardID,
        approvalStatus: "Rejected",
        approvalRemark: this.rejectInwardForm.controls.remark.value
      };
      const url = `/inwards/approveInventoryFromOwner?inventoryApprovalRemark=${approvalInwardData.approvalRemark}&inventoryMappingId=${approvalInwardData.id}&isApproveRequest=false`;

      this.customerInventoryManagementService.getMethod(url).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.closeRejectInventoryModal();
            if (response.dataList) {
              this.reject = true;
              this.rejectInventoryData = response.dataList;
            } else {
              this.getAssignedInventoryList();
            }
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Successfully",
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
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }
  getSelItemType(event) {
    // console.log("event", event.value);
    this.inventoryAssignForm.get("productId").reset();
    if (event.value == "Non Serialized Item") {
      this.getAllNonSerializedProductFlag = true;
      this.getAllSerializedProductFlag = false;
      this.getItemSelctionFlag = false;
      this.serializedItemAssignFlag = false;
      this.nonSerializedItemAssignFlag = true;
      this.availableQtyFlag = false;
      this.getProductSelection();
    } else {
      this.getAllNonSerializedProductFlag = false;
      this.getAllSerializedProductFlag = true;
      this.getItemSelctionFlag = false;
      this.serializedItemAssignFlag = true;
      this.nonSerializedItemAssignFlag = false;
      this.availableQtyFlag = false;
      this.getAllProducts();
    }
  }

  getProductSelection(): void {
    const url = "/product/getAllNetworkAndNABindNonSerializedProduct";
    this.customerInventoryManagementService.getMethod(url).subscribe((response: any) => {
      this.allActiveNonTrackableProducts = response.dataList;
    });
  }

  getNonTrackableProductQty(event) {
    this.showQtyError = false;
    this.negativeAssignQtyError = false;
    this.inventoryAssignForm.get("nonSerializedQty").reset();
    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    const url =
      "/outwards/getNonTrackableProductQty?productId=" +
      productId +
      "&ownerId=" +
      staffId +
      "&ownerType=Staff";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.availableQtyFlag = true;
        this.getNonTrackableProductQtyList = res.dataList;
        if (res.dataList.length == 0) {
          this.availableQty = 0;
        } else {
          this.availableQty = res.dataList.find(element => element).unusedQty;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  assigneOtherInventoryForNonSerializedItem(): void {
    this.inventoryAssignSubmitted = true;
    let data: any = "";
    data = this.inventoryAssignForm.value;
    data.itemId = data.productId;
    // data.customerId = this.custData.id;
    data.staffId = this.staffUserId;
    data.itemAssemblyStatus = "Pending";
    if (this.inventoryAssignForm.valid && !this.showQtyError && !this.negativeAssignQtyError) {
      data.qty = data.nonSerializedQty;
      if (data.qty == null || data.qty == "") {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Please Enter Assign Quantity",
          icon: "far fa-check-circle"
        });
      } else {
        const url = "/inwards/assignNonSerializedItemToEndOwner";
        this.customerInventoryManagementService.postMethod(url, data).subscribe(
          (res: any) => {
            if (res.responseCode == 200) {
              this.assignInventoryModalClose();
              this.getAssignedInventoryList();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Assigned inventory successfully.",
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.msg,
              icon: "far fa-times-circle"
            });
          }
        );
      }
    }
  }
  saveMacidMapping(id, data) {
    let url = `/item/updateItemMacAndSerial?itemId=${id}&macAddress=${data.macAddress}&serialNumber=${data.serialNumber}`;
    this.customerInventoryManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.enterMacSerial = "";
          this.isEditEnable = true;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }

        // this.workflowAuditData1 = response.dataList;
        // this.MastertotalRecords1 = response.totalRecords;
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
  editMacMapping(id) {
    this.editMacSerialBtn = id;
    this.isEditEnable = true;
  }
  editMac(id) {
    this.enterMacSerial = id;
    this.isEditEnable = false;
  }
  assignQuantityValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }
  clearFilterGlobal(table: Table) {
    this.fileterGlobal = "";
    table.clear();
  }

  InventoryReplace(assignInventory) {
    this.replaceInventory = true;
    let url = `/NetworkDevice/getNetworkDeviceByInventoryMappingId?id=${assignInventory.inventoryMappingId}`;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.inventoryReplaceForm.controls.macMappingId.setValue(assignInventory.id);
        this.deviceName = response.data.name;
        this.inventoryReplaceForm.controls.id.setValue(response.data.id);
        this.setPortValue(response.data);
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

  setPortValue(product) {
    let availableInPorts = 0;
    let availableOutPorts = 0;
    let totalInPorts = 0;
    let totalOutPorts = 0;

    if (product.availableInPorts > 0) {
      availableInPorts = product.availableInPorts;
    }

    if (product.availableOutPorts > 0) {
      availableOutPorts = product.availableOutPorts;
    }

    if (product.totalInPorts > 0) {
      totalInPorts = product.totalInPorts;
    }

    if (product.totalOutPorts > 0) {
      totalOutPorts = product.totalOutPorts;
    }

    this.deviceAvailableInPorts = availableInPorts;
    this.deviceAvailableOutPorts = availableOutPorts;
    this.deviceTotalInPorts = totalInPorts;
    this.deviceTotalOutPorts = totalOutPorts;
  }

  getAllProductByDeviceId() {
    let deviceId = this.inventoryReplaceForm.value.id;
    let url = "";
    if (deviceId) {
      url = `/product/getAllNetworkandNaBindProductBasedOnDeviceId/${deviceId}/${this.assignProduct.productId}`;
    } else {
      url = `/product/getAllNetworkandNaBindProductBasedOnDeviceId/-1/${this.assignProduct.productId}`;
    }
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.allActiveProducts = response.dataList;
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

  onItemChange(event) {
    this.inventoryAssignForm.get("productId").reset();
    if (event.value == "Non Serialized Item") {
      this.getAllNonSerializedProductFlag = true;
      this.getAllSerializedProductFlag = false;
      this.getItemSelctionFlag = false;
      this.serializedItemAssignFlag = false;
      this.nonSerializedItemAssignFlag = true;
      this.availableQtyFlag = false;
      this.getNonSerializedProductByDeviceId();
    } else {
      this.getAllNonSerializedProductFlag = false;
      this.getAllSerializedProductFlag = true;
      this.getItemSelctionFlag = false;
      this.serializedItemAssignFlag = true;
      this.nonSerializedItemAssignFlag = false;
      this.availableQtyFlag = false;
      this.getAllProductByDeviceId();
    }
  }

  onReplaceInventory(): void {
    this.inventoryReplaceSubmitted = true;
    let assigneInventoryData: any = "";
    assigneInventoryData = this.inventoryReplaceForm.value;
    assigneInventoryData.id = "";
    assigneInventoryData.qty = "1";
    assigneInventoryData.itemId = this.selectedMACAddress?.itemId;
    assigneInventoryData.staffId = this.staffUserId;
    assigneInventoryData.inOutWardMACMapping = [];
    if (this.selectedMACAddress != "") {
      assigneInventoryData.inOutWardMACMapping.push(this.selectedMACAddress);
    }

    if (this.inventoryReplaceForm.valid) {
      if (assigneInventoryData.inOutWardMACMapping.length > 0) {
        const url = "/inwards/assignToEndOwner";
        this.customerInventoryManagementService.postMethod(url, assigneInventoryData).subscribe(
          (res: any) => {
            if (res.responseCode == 200) {
              this.replaceInventoryModalClose();
              this.getAssignedInventoryList();
              setTimeout(() => {
                this.editCustomerInventory(this.customerInventoryMappingId, this.assignProduct);
              }, 1000);
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Assigned inventory successfully.",
                icon: "far fa-check-circle"
              });
            } else if (res.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.msg,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Please Select One Mac Address",
          icon: "far fa-check-circle"
        });
      }
    }
  }

  replaceInventoryModalClose() {
    this.inventoryReplaceSubmitted = false;
    this.replaceInventory = false;
    this.inventoryReplaceForm.reset();
    this.inventoryReplaceForm.updateValueAndValidity();
    this.selectedMACAddress = "";
    this.fileterGlobal = "";
    this.macAddressList = [];
    this.getAllNonSerializedProductFlag = false;
    this.getAllSerializedProductFlag = false;
    this.serializedItemAssignFlag = false;
    this.nonSerializedItemAssignFlag = false;
    this.availableQtyFlag = false;
    this.getItemSelctionFlag = false;
    this.showQtyError = false;
    this.negativeAssignQtyError = false;
    this.assignInventory = false;
    this.isProductSelected = false;
    this.currentMacAddressListdata = 1;
    this.newFirstMacAddress = 0;
  }

  onProductChange(event: any, dd: any) {
    this.isProductSelected = true;
    this.productTotalInPorts = dd.selectedOption.totalInPorts;
    this.productAvailableInPorts = dd.selectedOption.availableInPorts;
    this.productTotalOutPorts = dd.selectedOption.totalOutPorts;
    this.productavailableOutPorts = dd.selectedOption.availableOutPorts;
    this.getMacAddressList(event);
    this.newFirstMacAddress = 1;
  }

  getNonSerializedProductByDeviceId(): void {
    let deviceId = this.inventoryReplaceForm.value.id;
    const url = `/product/getAllNetworkAndNABindNonSerializedProduct?deviceId=${deviceId}`;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.allActiveNonTrackableProducts = response.dataList;
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

  mylocation() {
    // this.spinner.show()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.inventoryAssignForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Geolocation is not supported by this browser.",
        icon: "far fa-times-circle"
      });
    }
  }

  openSearchModel() {
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
  }

  clearLocationForm() {
    this.searchLocationForm.reset();
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
  }

  searchLocation() {
    if (this.searchLocationForm.valid) {
      const url =
        "/serviceArea/getPlaceId?query=" + this.searchLocationForm.value.searchLocationname;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            this.searchLocationData = [];
          } else {
            this.searchLocationData = response.locations;
          }
        },
        (error: any) => {
          if (error.error.code == 422) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.error,
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
  }

  filedLocation(placeId) {
    const url = "/serviceArea/getLatitudeAndLongitude?placeId=" + placeId;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.ifsearchLocationModal = false;
        this.inventoryAssignForm.patchValue({
          latitude: response.location.latitude,
          longitude: response.location.longitude
        });

        this.iflocationFill = true;
        this.searchLocationData = [];
        this.searchLocationForm.reset();
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

  pageChangedSearchLocationList(currentPage) {
    this.currentPagesearchLocationList = currentPage;
  }
}
