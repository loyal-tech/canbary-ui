import { debounceTime } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { PER_PAGE_ITEMS, pageLimitOptions } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InwardService } from "src/app/service/inward.service";
import { LoginService } from "src/app/service/login.service";
import { OutwardService } from "src/app/service/outward.service";
import { InventoryRequestService } from "src/app/service/inventory-request.service";
import { PopManagementsService } from "src/app/service/pop-managements.service";
import * as moment from "moment";

import { Table } from "primeng/table";
import { Observable, Observer, Subject } from "rxjs";
import { INVENTORYS } from "src/app/constants/aclConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Component({
  selector: "app-outwards",
  templateUrl: "./outwards.component.html",
  styleUrls: ["./outwards.component.css"]
})
export class OutwardsComponent implements OnInit {
  editInwardId: any = "";
  outwardFormGroup: FormGroup;
  // countryFormArray: FormArray;
  submitted = false;
  currentPageProductListdata = 1;
  productListdataitemsPerPage = PER_PAGE_ITEMS;
  productListdatatotalRecords: any;
  countryPojo: any = {};
  outwardListData: any[] = [];
  searchData: any;
  viewRequestInventoryMappingData: any = [];
  viewSelectedReqInvenData: any = [];
  viewReqInventoryData: any = [];
  searchOutward: any = "";
  fileterGlobal: any = "";
  fileterGlobal1: any = "";
  // searchkey: string;
  AclClassConstants: any;
  AclConstants: any;
  ifRedirectInventoryModule = false;
  pageLimitOptions = pageLimitOptions;
  showItemPerPage: number = 5;
  searchkey: string;

  public loginService: LoginService;
  editMode: boolean;
  sourceTypeAsStaffFlag: boolean = false;
  MACShowModal: boolean = false;
  MACAssignModalOutward: boolean = false;
  selectWareHouseView: boolean;
  pincodeDeatils: any;
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  sourceType = [
    { label: "Warehouse" },
    { label: "Staff" }
    // { label: "Partner" }
  ];
  destinationType = [
    { label: "Warehouse" },
    { label: "Staff" },
    { label: "Partner" }
    // { label: "POP" },
    // { label: "SA" },
  ];
  userTypes = [{ label: "Staff", value: "STAFF" }];
  @ViewChild("closebutton") closebutton;
  @ViewChild("btnClose") btnClose;
  @ViewChild("btnClose1") btnClose1;
  @ViewChild("dt") table: Table;
  @ViewChild("checkbox") checkbox;
  countryList = [];
  stateList = [];
  cityList = [];
  unit = "";
  products: any[] = [];
  warehouses: any[] = [];
  types = [
    { label: "New", value: "New" },
    { label: "Refurbished", value: "Refurbished" },
    { label: "Damage", value: "Damage" }
  ];

  pipe = new DatePipe("en-US");
  // optionUserType: boolean;
  staffList = [];
  destinationStaffList = [];
  inwardList = [];
  sources = [];
  destinations = [];
  availableQty = 0;
  showQtyError: boolean;
  outwardEdit: any = {};
  // initialValue: number = 0;
  qtyErroMsg = "";
  addMACaddress: boolean;
  inwardMacList: any[];
  selectInventryData: any = [];
  inwardIdForMac: any;
  macDetailsArray: FormArray;
  outwardIdForMac: any;
  alreadySelectedCheckBoxes: number[] = [];
  selectedCheckBoxes: number[] = [];
  selectedInwardMACAddress = [];

  listView = true;
  createView: boolean;
  searchOptionSelect = this.commondropdownService.customerSearchOption2;
  hasMac: boolean;
  hasSerial: boolean;
  inwardlength: any;
  viewOutwardDetails: any;
  detailView: boolean = false;
  searchDeatil: string;
  searchOutwardOption: any = "";
  custId: any;
  disableButton: boolean;
  isOutwardView: boolean = false;
  isOutwardEdit: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  showMacAddressAccess: boolean = false;
  addMacAddressAccess: boolean = false;
  checkBoxCount: any[];
  specDetailsShow: boolean;
  inventoryDetailData: any;
  inventorySpecificationDetails: any = [];
  inventoryDetailModal: boolean = false;
  selectedProduct: any;

  currentPageOutwardMapMapping = 1;
  outwardMappingListitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  outwardMappingListdatatotalRecords: any;
  newFirst = 0;

  currentPageOutwardMacMapping = 1;
  outwardMappingMacListitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  outwardMappingMacListdatatotalRecords: any;
  newFirstMac = 0;
  outwardData: any;
  macOptionSelect = this.commondropdownService.macSearchOption;
  searchOption: any;
  searchMacDeatil: string;
  searchMacData: any;
  optionValue: any;
  outwardId: any;
  private customRowsSubject = new Subject<number>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activetedroute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private outwardService: OutwardService,
    private inventoryRequestService: InventoryRequestService,
    private popService: PopManagementsService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService,
    private inwardService: InwardService
  ) {
    this.createAccess = loginService.hasPermission(INVENTORYS.INVEN_OUTWARDS_CREATE);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.INVEN_OUTWARDS_DELETE);
    this.editAccess = loginService.hasPermission(INVENTORYS.INVEN_OUTWARDS_EDIT);
    this.showMacAddressAccess = loginService.hasPermission(INVENTORYS.INVEN_OUTWARDS_SHOW_MAC);
    this.addMacAddressAccess = loginService.hasPermission(INVENTORYS.INVEN_OUTWARDS_ADD_MAC);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.isOutwardEdit = this.editAccess;
    this.editMode = !this.createAccess && this.editAccess ? true : false;

    // this.outwardService.getAllProducts().subscribe((res: any) => {
    //     this.products = res.dataList;
    // });
    // this.inwardService.getAllWareHouse().subscribe((res: any) => {
    //     this.warehouses = res.dataList;
    // });
    this.macDetailsArray = this.fb.array([]);
    this.customRowsSubject.pipe(debounceTime(1000)).subscribe(value => {
      this.updateRowsPerPage(value);
    });
  }

  onCustomRowsChange(value: number) {
    this.customRowsSubject.next(value);
  }

  ngOnInit(): void {
    // this.outwardService.getAllStaff().subscribe((res: any) => {
    //     const staffId = localStorage.getItem("userId");
    //     this.staffList = res.dataList.filter(element => element.id == staffId);
    //     this.destinationStaffList = res.dataList;
    // });

    this.outwardFormGroup = this.fb.group({
      id: [""],
      outwardNumber: [""],
      qty: [""],
      status: ["", Validators.required],
      product: ["", Validators.required],
      sourceType: ["", Validators.required],
      source: ["", Validators.required],
      description: ["", Validators.required],
      destinationType: ["", Validators.required],
      destination: ["", Validators.required],
      outwardDateTime: [new Date(), Validators.required],
      mvnoId: [""],
      //inwardId: ["", Validators.required],
      usedQty: [0],
      unusedQty: [""],
      inTransitQty: ["", Validators.min(1)],
      outTransitQty: [""],
      rejectedQty: [""],
      requestInventoryId: [""],
      requestInventoryName: [""],
      requestInventoryProductId: [""],
      selectedItems: [0]
    });
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };
    this.searchMacData = {
      filterBy: "",
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
      pageSize: "",
      entityId: null,
      productId: "",
      ownerId: "",
      ownerType: "",
      entityType: "outward"
    };
    this.getOutwardList("");
    if (this.activetedroute.snapshot.queryParamMap.get("mapId")) {
      this.ifRedirectInventoryModule = true;
      this.outwardFormGroup.patchValue({
        id: Number(this.selectInventryData.value)
      });
      setTimeout(() => {
        this.getSources("Warehouse");
      }, 1000);
      this.listView = false;
      this.createView = true;
      // this.getInventoryRequestDetails(value, mapId);
    }
    this.outwardFormGroup.get("inTransitQty").valueChanges.subscribe(val => {
      const qty: number = val;
      this.showQtyError = false;
      this.qtyErroMsg = "";
      if (!this.editMode) {
        if (val !== null && val !== "") {
          if (typeof qty === "number") {
            if (qty < 0 || qty === 0) {
              this.showQtyError = true;
              this.qtyErroMsg = "Quantity must be greater than 0.";
              this.disableButton = true;
            } else if (qty > this.availableQty) {
              this.showQtyError = true;
              this.qtyErroMsg =
                "Please enter a quantity less than or equal to the available quantity.";
              this.disableButton = true;
            } else {
              this.disableButton = false;
            }
          } else {
            this.showQtyError = true;
            this.qtyErroMsg = "Quantity must be a number.";
            this.disableButton = true;
          }
        } else {
          this.disableButton = true;
        }
      }
    });
  }

  getInventoryRequestDetails(id: any, mapId: any) {
    const url = "/requestinventory/getById?id=" + id;
    this.inventoryRequestService.getMethod(url).subscribe((response: any) => {
      this.viewReqInventoryData = response.data;
      this.viewRequestInventoryMappingData =
        this.viewReqInventoryData.requestInvenotryProductMappings.find(
          element => element.id == mapId
        );
      setTimeout(() => {
        this.outwardFormGroup.patchValue({
          //product: this.viewReqInventoryData.requestInvenotryProductMappings[0].productId,
          product: this.viewRequestInventoryMappingData.productId,
          description: this.viewRequestInventoryMappingData.description,
          status: "Active",
          sourceType: "Warehouse",
          source: this.viewReqInventoryData.requestToWarehouseId,
          destinationType: this.viewReqInventoryData.requestNameId,
          destination: this.viewReqInventoryData.requestNameId,
          //inTransitQty: this.viewReqInventoryData.requestInvenotryProductMappings[0].quantity,
          inTransitQty: this.viewRequestInventoryMappingData.quantity,
          requestInventoryName: this.viewReqInventoryData.requestInventoryName,
          requestInventoryId: this.viewReqInventoryData.id,
          requestInventoryProductId: this.viewRequestInventoryMappingData.id
        });
        this.getAvailableQtyByProductAndSourceInventoryRequestDetails(
          this.viewRequestInventoryMappingData.productId,
          this.viewReqInventoryData.requestToWarehouseId,
          "Warehouse",
          this.viewRequestInventoryMappingData.quantity
        );
      }, 1500);
    });
  }
  selectedRow(event: any, ind: number) {
    const foundIndex = this.selectedCheckBoxes.findIndex(val => val === ind);
    if (event == true) {
      this.selectedCheckBoxes.push(1);
    } else {
      this.selectedCheckBoxes.splice(foundIndex, 1);
    }
  }

  toggleSelectAll(inwardLength: number, sel: number) {
    if (inwardLength !== sel) {
      this.selectedCheckBoxes.length = this.inwardlength;
    } else {
      this.selectedCheckBoxes = [];
    }
  }

  // saveSelectedCheckBoxes() {
  //   // Store the currently selected checkboxes in the alreadySelectedCheckBoxes array
  //   this.alreadySelectedCheckBoxes = [...this.selectedCheckBoxes];
  //   this.selectedCheckBoxes = [];
  // }

  getAvailableQtyByProductAndSourceInventoryRequestDetails(
    productId,
    sourceId,
    sourceType,
    requestQty
  ): void {
    this.getSources(sourceType);
    this.getDestinations(this.destType);
    if (productId && sourceId) {
      this.inwardList = [];
      this.outwardService.getProductAvailableQTY(productId, sourceId, sourceType).subscribe(
        (res: any) => {
          this.inwardList = res.dataList;
          if (res.dataList.length == 0) {
            this.availableQty = 0;
          } else {
            this.availableQty = res.dataList.find(element => element).unusedQty;
          }
          if (requestQty > this.availableQty) {
            this.showQtyError = true;
            this.qtyErroMsg = "The requested quantity is greater than available quantity";
          } else {
            this.showQtyError = false;
          }
          // this.getAvailableQty(this.inwardList);
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
    }
  }
  TotalItemPerPage(event): void {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageProductListdata > 1) {
      this.currentPageProductListdata = 1;
    }
    if (!this.searchkey) {
      this.getOutwardList(this.showItemPerPage);
    } else {
      this.searchOutwardData();
    }
  }

  getOutwardList(list): void {
    this.outwardListData = [];
    let size: number;
    this.searchkey = "";
    const List = this.currentPageProductListdata;
    if (list) {
      size = list;
      this.productListdataitemsPerPage = list;
    } else {
      size = this.productListdataitemsPerPage;
    }
    const plandata = {
      page: List,
      pageSize: this.productListdataitemsPerPage
    };
    this.outwardService.getAll(plandata).subscribe(
      (response: any) => {
        this.outwardListData = response.dataList;
        this.productListdatatotalRecords = response.totalRecords;
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

  submit(): void {
    this.submitted = true;
    if (this.outwardFormGroup.valid && !this.showQtyError) {
      if (this.editMode) {
        this.outwardService.update(this.mapObject()).subscribe(
          (res: any) => {
            if (res.responseCode === 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: res.responseMessage,
                icon: "far fa-check-circle"
              });
              this.clearSearchOutward();
              // this.availableQty = 0;
              // this.outwardFormGroup.patchValue({
              //   outwarddDateTime: new Date()
              // });
              // this.editMode = false;
              // this.submitted = false;
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
      } else {
        let data = this.mapObject();
        this.outwardService.save(data).subscribe(
          (res: any) => {
            if (res.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: res.responseMessage,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              this.clearSearchOutward();
              // this.outwardFormGroup.patchValue({
              //   outwardDateTime: new Date(),
              // });
              this.availableQty = 0;
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
    }
  }

  mapObject(): {} {
    const outwardValues = this.outwardFormGroup.getRawValue();
    const outward = {
      id: "",
      productId: "",
      qty: 0,
      outwardDateTime: "",
      sourceId: "",
      sourceType: "",
      status: "",
      description: "",
      outwardNumber: "",
      destinationId: null,
      destinationType: "",
      mvnoId: "",
      //inwardId: "",
      // isQtyChanged: false,
      usedQty: "",
      unusedQty: "",
      inTransitQty: "",
      outTransitQty: "",
      rejectedQty: "",
      requestInventoryId: "",
      requestInventoryProductId: "",
      selectedItems: ""
    };
    outward.id = outwardValues.id ? outwardValues.id : null;
    outward.productId = outwardValues.product;
    outward.qty = outwardValues.qty;
    // outward.isQtyChanged = (outwardValues.qty != this.initialValue);
    outward.status = outwardValues.status;
    outward.outwardDateTime = outwardValues.outwardDateTime;
    outward.sourceId = outwardValues.source;
    outward.description = outwardValues.description;
    outward.sourceType = outwardValues.sourceType;
    outward.outwardNumber = outwardValues.outwardNumber ? outwardValues.outwardNumber : "";
    outward.destinationId = outwardValues.destination;
    outward.destinationType = outwardValues.destinationType;
    outward.mvnoId = null;
    //outward.inwardId = outwardValues.inwardId;
    outward.usedQty = outwardValues.usedQty;
    outward.unusedQty = outwardValues.unusedQty;
    outward.inTransitQty = outwardValues.inTransitQty;
    outward.outTransitQty = outwardValues.outTransitQty;
    outward.rejectedQty = outwardValues.rejectedQty;
    outward.requestInventoryId = outwardValues.requestInventoryId;
    outward.requestInventoryProductId = outwardValues.requestInventoryProductId;
    outward.selectedItems = outwardValues.selectedItems;
    return outward;
  }

  destType: any;
  editOutward(id): void {
    this.sourceType = [{ label: "Warehouse" }, { label: "Staff" }, { label: "Partner" }];

    this.editMode = true;
    this.createView = true;
    this.listView = false;
    this.detailView = false;
    this.sourceType = [{ label: "Warehouse" }, { label: "Staff" }];
    this.outwardService.getAllProducts().subscribe((res: any) => {
      this.products = res.dataList;
    });
    this.inwardService.getAllWareHouse().subscribe((res: any) => {
      this.warehouses = res.dataList;
    });
    this.outwardService.getAllStaff().subscribe((res: any) => {
      const staffId = localStorage.getItem("userId");
      this.staffList = res.dataList.filter(element => element.id == staffId);
      this.destinationStaffList = res.dataList;
    });
    // let outwardEdit = this.outwardListData.find(element => element.id === id);
    // console.log(outwardEdit, "outwardEdit");
    const url = "/outwards/" + id;
    this.outwardService.getMethod(url).subscribe((res: any) => {
      this.outwardEdit = res.data;
      this.destType = this.outwardEdit.destinationType;
      // this.getInwardList(
      //   this.outwardEdit.productId.id,
      //   this.outwardEdit.sourceId,
      //   this.outwardEdit.sourceType
      // );
      this.getSources(this.outwardEdit.sourceType);
      this.getDestinations(this.outwardEdit.destinationType);
      if (this.outwardEdit.sourceType == "Staff" || this.outwardEdit.sourceType == "Customer")
        // this.isSourceAStaffOrCustomer = true;
        this.sourceTypeAsStaffFlag = true;
      else this.sourceTypeAsStaffFlag = false;
      if (
        this.outwardEdit.destinationType == "Staff" ||
        this.outwardEdit.destinationType == "Customer"
      )
        this.isDestAStaffOrCustomer = true;
      else this.isDestAStaffOrCustomer = false;
      this.outwardFormGroup.patchValue({
        id: this.outwardEdit.id,
        product: this.outwardEdit.productId.id,
        description: this.outwardEdit.description,
        qty: this.outwardEdit.qty,
        status: this.outwardEdit.status,
        outwardDateTime: new Date(this.outwardEdit.outwardDateTime),
        sourceType: this.outwardEdit.sourceType,
        source: this.outwardEdit.sourceId,
        destinationType: this.outwardEdit.destinationType,
        destination: this.outwardEdit.destinationId,
        // type: this.outwardEdit.userType,
        outwardNumber: this.outwardEdit.outwardNumber,
        mvnoId: [""],
        unusedQty: this.outwardEdit.unusedQty,
        usedQty: this.outwardEdit.usedQty,
        selectedItems: this.outwardEdit.selectedItems,
        //inwardId: this.outwardEdit.inwardId.id,
        inTransitQty: this.outwardEdit.inTransitQty,
        requestInventoryId: this.outwardEdit.requestInventoryId
      });
      // if (this.outwardEdit.staffId != null) {
      //   this.optionUserType = true;
      // }
      // this.outwardFormGroup.controls.inwardId.setValue(this.outwardEdit.inwardId.id);
    });
  }

  selSearchOption() {
    this.searchDeatil = "";
    this.searchOutward = null;
  }

  searchOutwardData() {
    if (!this.searchkey || this.searchkey !== this.searchOutward) {
      this.currentPageProductListdata = 1;
    }
    this.searchkey = this.searchOutward;
    if (this.showItemPerPage) {
      this.productListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchOutward;
    this.searchData.filter[0].filterColumn = this.searchOutwardOption.trim();
    const page = {
      page: this.currentPageProductListdata,
      pageSize: this.productListdataitemsPerPage,
      sortBy: "id",
      sortOrder: 0
    };
    const url =
      "/outwards/search?page=" +
      page.page +
      "&pageSize=" +
      page.pageSize +
      "&sortBy=" +
      page.sortBy +
      "&sortOrder=" +
      page.sortOrder;
    this.outwardService.postMethod(url, this.searchData).subscribe(
      (res: any) => {
        if (res.responseCode === 200) {
          this.outwardListData = res.dataList;
          const list = this.outwardListData;
          const filterList = list.filter(cust => cust.id !== this.custId);
          this.outwardListData = filterList;
          this.productListdatatotalRecords = res.totalRecords;
        } else {
          this.productListdatatotalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
          });
          this.outwardListData = [];
        }
      },
      (error: any) => {
        this.productListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.outwardListData = [];
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

  clearSearchOutward(): void {
    {
    }
    this.listView = true;
    this.createView = false;
    this.editMode = false;
    this.submitted = false;
    this.showQtyError = false;
    this.disableButton = false;
    this.detailView = false;
    this.searchDeatil = "";
    this.availableQty = 0;
    this.searchOutward = "";
    this.searchOutwardOption = "";
    this.searchkey = "";
    this.getOutwardList("");
    this.router.navigate(["/home/outwards"], {});
    this.ifRedirectInventoryModule = false;
    this.outwardFormGroup.reset();
    this.outwardFormGroup.patchValue({
      outwardDateTime: new Date()
    });
  }
  ResetField() {
    this.outwardFormGroup.controls.destinationType.reset();
    this.outwardFormGroup.controls.destination.reset();
    this.outwardFormGroup.controls.inTransitQty.reset();
    // this.refreshTimeValue(this.outwardFormGroup.controls.outwardDateTime);
    // this.outwardFormGroup.controls.status.reset();
  }
  ResetFieldDestination() {
    this.outwardFormGroup.controls.destination.reset();
    this.outwardFormGroup.controls.inTransitQty.reset();
  }
  deleteConfirmOutward(id: number): void {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this outward?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteOutward(id);
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

  deleteOutward(productId): void {
    // const productEditData = this.outwardListData.find(element => element.id === productId);
    this.outwardService.delete(productId).subscribe(
      (response: any) => {
        if (response.responseCode === 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.getOutwardList("");
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
  // getUserType(event) {
  //   this.outwardFormGroup.controls.userId.setValue('');
  //   if (event.value == "STAFF") {
  //     this.optionUserType = true;
  //     // this.outwardFormGroup.controls.staffId.enable();
  //   } else {
  //     this.optionUserType = false;
  //     // this.outwardFormGroup.controls.custId.enable();
  //   }
  // }
  getUnit(event, dd: any): void {
    this.selectedProduct = dd.selectedOption;
    this.unit = this.products.find(element => element.id === event.value).unit;
    this.outwardFormGroup.controls.sourceType.setValue("");
    this.outwardFormGroup.controls.source.setValue("");
    this.outwardFormGroup.controls.description.setValue("");
    this.outwardFormGroup.controls.destinationType.setValue("");
    this.outwardFormGroup.controls.destination.setValue("");
    this.outwardFormGroup.controls.inTransitQty.setValue("");
    this.availableQty = 0;
  }
  selectSourceEvent(e) {
    let sourceID = e.value;
    this.getAvailableQtyByProductAndSource(
      this.outwardFormGroup.controls.productId.value,
      sourceID,
      this.outwardFormGroup.controls.sourceType.value
    );
  }

  getAvailableQtyByProductAndSource(productId, sourceId, sourceType): void {
    this.outwardFormGroup.get("destinationType").reset();
    this.outwardFormGroup.get("destination").reset();
    this.getSources(sourceType);
    this.getDestinations(this.destType);
    if (productId && sourceId) {
      this.inwardList = [];
      this.outwardService.getProductAvailableQTY(productId, sourceId, sourceType).subscribe(
        (res: any) => {
          this.inwardList = res.dataList;
          if (res.dataList.length == 0) {
            this.availableQty = 0;
          } else {
            this.availableQty = res.dataList.find(element => element).unusedQty;
          }
          // this.getAvailableQty(this.inwardList);
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
    }
  }

  isSourceAStaffOrCustomer = false;
  getSources(sourceType): void {
    this.outwardFormGroup.controls.destinationType.setValue("");
    this.outwardFormGroup.controls.destination.setValue("");
    this.outwardFormGroup.controls.inTransitQty.setValue("");
    this.availableQty = 0;
    if (sourceType == "Warehouse") {
      this.isSourceAStaffOrCustomer = false;
      this.sourceTypeAsStaffFlag = false;
      this.sources = this.warehouses;
      this.destinationType = [{ label: "Warehouse" }, { label: "Staff" }, { label: "Partner" }];
    } else if (sourceType == "Staff") {
      this.isSourceAStaffOrCustomer = true;
      this.sourceTypeAsStaffFlag = true;
      if (this.selectedProduct && this.selectedProduct.hasAssetConsider) {
        this.sources = this.destinationStaffList.filter(element => element.partnerid == 1);
      } else {
        this.sources = this.staffList;
      }
      this.destinationType = [{ label: "Warehouse" }];
    } else if (sourceType == "Partner") {
      const url = "/partner/allActive";
      this.isSourceAStaffOrCustomer = false;
      this.destinationType = [{ label: "POP" }, { label: "Service Area" }];
      this.outwardService.getMethod(url).subscribe(
        (res: any) => {
          this.sources = res.dataList;
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
    } else if (sourceType == "Service Area") {
      const url = "/serviceArea/all";
      this.isSourceAStaffOrCustomer = false;
      this.commondropdownService.getMethodWithCache(url).subscribe(
        (res: any) => {
          this.sources = res.dataList;
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
    } else if (sourceType == "POP") {
      const url = "/popmanagement/all";
      this.isSourceAStaffOrCustomer = false;
      this.popService.getMethodWithCache(url).subscribe(
        (res: any) => {
          this.sources = res.dataList;
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

  isDestAStaffOrCustomer = false;
  getDestinations(destinationType): void {
    this.outwardFormGroup.controls.destination.setValue("");
    this.outwardFormGroup.controls.inTransitQty.setValue("");
    const destinationTypeVal = destinationType;
    const sourceTypeVal = this.outwardFormGroup.controls.sourceType.value;
    const sourceVal = this.outwardFormGroup.controls.source.value;
    if (destinationType == "Warehouse") {
      this.isDestAStaffOrCustomer = false;
      this.destinations = this.warehouses;
      const destinationData = this.destinations;
      if (sourceTypeVal != "" && destinationTypeVal != "") {
        if (sourceTypeVal == destinationTypeVal) {
          if (sourceVal != "") {
            this.destinations = destinationData.filter(item => item.id != sourceVal);
          }
        }
      }
    } else if (destinationType == "Staff") {
      this.isDestAStaffOrCustomer = true;
      this.destinations = this.destinationStaffList.filter(element => element.partnerid == 1);
      const destinationData = this.destinations;
      if (sourceTypeVal != "" && destinationTypeVal != "") {
        if (sourceTypeVal == destinationTypeVal) {
          if (sourceVal != "") {
            this.destinations = destinationData.filter(item => item.id != sourceVal);
          }
        }
      }
    } else if (destinationType == "Partner") {
      const url = "/partner/getAllTypePartner";
      this.isDestAStaffOrCustomer = false;
      this.outwardService.getMethod(url).subscribe(
        (res: any) => {
          this.destinations = res.dataList;

          const destinationData = this.destinations;
          if (sourceTypeVal != "" && destinationTypeVal != "") {
            if (sourceTypeVal == destinationTypeVal) {
              if (sourceVal != "") {
                this.destinations = destinationData.filter(item => item.id != sourceVal);
              }
            }
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
    } else if (destinationType == "Service Area") {
      const url = "/serviceArea/all";
      this.isDestAStaffOrCustomer = false;
      this.commondropdownService.getMethodWithCache(url).subscribe(
        (res: any) => {
          this.destinations = res.dataList;
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
    } else if (destinationType == "POP") {
      const url = "/popmanagement/all";
      this.isDestAStaffOrCustomer = false;
      this.popService.getMethodWithCache(url).subscribe(
        (res: any) => {
          this.destinations = res.dataList;
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
    } else if (destinationType == "Customer") {
      const url = `/customers/getActiveCustomersList`;
      this.isDestAStaffOrCustomer = true;
      this.popService.getMethod(url).subscribe(
        (res: any) => {
          this.destinations = res.dataList;
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

  // getAvailableQty(): void {
  //   this.availableQty = this.inwardList.find(element => element).unusedQty;
  // }

  createOutward(): void {
    this.createView = true;
    this.listView = false;
    this.detailView = false;
    this.editMode = false;
    this.submitted = false;
    this.showQtyError = false;
    this.availableQty = 0;
    this.searchOutward = "";
    this.searchkey = "";
    this.outwardFormGroup.reset();
    this.ifRedirectInventoryModule = false;
    this.outwardFormGroup.patchValue({
      outwardDateTime: new Date()
    });
    this.outwardEdit = null;
    this.sourceType = [{ label: "Warehouse" }, { label: "Staff" }];
    this.outwardService.getAllProducts().subscribe((res: any) => {
      this.products = res.dataList;
    });
    this.inwardService.getAllWareHouse().subscribe((res: any) => {
      this.warehouses = res.dataList;
    });
    this.outwardService.getAllStaff().subscribe((res: any) => {
      const staffId = localStorage.getItem("userId");
      this.staffList = res.dataList.filter(element => element.id == staffId);
      this.destinationStaffList = res.dataList;
    });
  }
  inTransQty: number;
  selectedItemsCount: number;

  addMAC(outward) {
    this.selectedInwardMACAddress = [];

    //this.inwardIdForMac = outward.inwardId.id;
    this.hasMac = outward.productId.productCategory.hasMac;
    this.hasSerial = outward.productId.productCategory.hasSerial;
    this.inTransQty = outward.inTransitQty;
    this.selectedItemsCount = outward.selectedItems;
    this.outwardIdForMac = outward.id;
    if (!this.hasMac && !this.hasSerial) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Product type does not allow to add Mac/Serial Number..",
        icon: "far fa-times-circle"
      });
      this.addMACaddress = false;
    } else {
      this.MACAssignModalOutward = true;
      this.outwardData = outward;
      this.getItems(outward.productId.id, outward.sourceId, outward.sourceType);
      this.addMACaddress = true;
    }
  }

  getItems(productId, sourceId, sourceType) {
    let currentPage;
    currentPage = this.currentPageOutwardMacMapping;
    let body = {
      page: currentPage,
      pageSize: this.outwardMappingMacListitemsPerPage
    };
    this.inwardMacList = [];

    this.macDetailsArray = this.fb.array([]);
    this.outwardService.postItems(productId, sourceId, sourceType, body).subscribe(
      (res: any) => {
        this.inwardlength = res.dataList.length;
        this.inwardMacList = res.dataList;
        this.outwardMappingMacListdatatotalRecords = res.totalRecords;
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

  mapMACOutward(): void {
    const selectedMAC = this.inwardMacList.filter(val =>
      this.selectedInwardMACAddress.includes(val)
    );
    if (this.selectedInwardMACAddress.length === 0) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: `Please select atleast one item.`,
        icon: "far fa-times-circle"
      });
      this.MACAssignModalOutward = true;
      this.selectedInwardMACAddress = [];
      return;
    }
    // this.checkBoxCount=[]
    this.selectedInwardMACAddress.forEach(element => {
      element.outwardId = this.outwardIdForMac;
    });

    this.saveMACMapping(this.selectedInwardMACAddress);
  }
  saveMACMapping(selectedMAC: any[]): void {
    this.outwardService.updateMACMappingList(selectedMAC).subscribe(
      (res: any) => {
        // this.selectedInwardMACAddress = null;
        // this.addMACaddress = false;
        if (res.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Items are added successfully.",
            life: 3000
          });
          this.checkBoxCount = [];
          this.MACAssignModalOutward = false;
          this.selectedCheckBoxes = [];
          // this.saveSelectedCheckBoxes();
          this.getOutwardList("");
        }
        if (res.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
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
  pageChangedProductList(pageNumber): void {
    this.currentPageProductListdata = pageNumber;
    if (!this.searchkey) {
      this.getOutwardList("");
    } else {
      this.searchOutwardData();
    }
  }

  getFilterDestioan(event) {
    if (this.outwardFormGroup.controls.destinationType.value) {
      this.getDestinations(this.outwardFormGroup.controls.destinationType.value);
      const destinationData = this.destinations;
      const destinationTypeVal = this.outwardFormGroup.controls.destinationType.value;
      const sourceTypeVal = this.outwardFormGroup.controls.sourceType.value;
      const sourceVal = event.value;
      if (sourceTypeVal != "" && destinationTypeVal != "") {
        if (sourceTypeVal == destinationTypeVal) {
          if (sourceVal != "") {
            this.destinations = destinationData.filter(item => item.id != sourceVal);
          }
        }
      }
    }
  }

  canExit() {
    if (!this.outwardFormGroup.dirty) return true;
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
  getOutwardDetails(id) {
    const url = "/outwards/" + id;
    this.outwardService.getMethod(url).subscribe(
      (res: any) => {
        this.viewOutwardDetails = res.data;
        this.listView = false;
        this.createView = false;
        this.detailView = true;
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

  outwardList() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }

  showMac(outward): void {
    this.selectedInwardMACAddress = [];
    //this.inwardIdForMac = outward.inwardId.id;
    this.hasMac = outward.productId.productCategory.hasMac;
    this.hasSerial = outward.productId.productCategory.hasSerial;
    this.outwardIdForMac = outward.id;
    if (!this.hasMac && !this.hasSerial) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Product type does not allow to add Mac/Serial Number..",
        icon: "far fa-times-circle"
      });
      this.addMACaddress = false;
    } else {
      this.MACShowModal = true;
      this.outwardData = outward;
      this.showItem(
        outward.id,
        outward.productId.id,
        outward.destinationId,
        outward.destinationType
      );
      this.addMACaddress = true;
    }
  }

  showItem(outwardId, productId, destinationId, destinationType) {
    let currentPage;
    currentPage = this.currentPageOutwardMapMapping;
    let body = {
      page: currentPage,
      pageSize: this.outwardMappingListitemsPerPage
    };
    this.inwardMacList = [];
    this.outwardId = outwardId;
    this.macDetailsArray = this.fb.array([]);
    this.outwardService
      .showItems(outwardId, destinationId, destinationType, productId, body)
      .subscribe(
        (res: any) => {
          this.inwardlength = res.dataList.length;
          this.inwardMacList = res.dataList;
          this.outwardMappingListdatatotalRecords = res.totalRecords;
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

  quantityOutValidation(event: any) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }

  clearFilterGlobal(table: Table) {
    this.fileterGlobal = "";
    table.clear();
  }
  clearFilterGlobal1(table: Table) {
    this.fileterGlobal1 = "";
    table.clear();
  }
  onclosed() {
    this.currentPageOutwardMapMapping = 1;
    this.outwardMappingListitemsPerPage = 20;
    this.currentPageOutwardMacMapping = 1;
    this.outwardMappingMacListitemsPerPage = 20;
    this.newFirst = 0;
    this.customRows = 20;
    this.newFirstMac = 0;
    this.fileterGlobal1 = "";
    this.fileterGlobal = "";
    this.checkBoxCount = [];
    this.selectedCheckBoxes = [];
    this.MACShowModal = false;
    this.MACAssignModalOutward = false;
    this.searchOption = "";
    this.searchMacDeatil = "";
  }
  InventoryDetails(itemId) {
    this.inwardService.getByItemId(itemId).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.specDetailsShow = true;
          this.inventorySpecificationDetails = response.dataList;
          this.inventoryDetailModal = true;
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
  closeInventoryDetailModal() {
    this.inventoryDetailModal = false;
    this.specDetailsShow = false;
    this.searchOption = "";
    this.searchMacDeatil = "";
  }

  paginate(event) {
    this.newFirst = event.first;
    this.outwardMappingListitemsPerPage = event.rows;
    this.currentPageOutwardMapMapping = event.page + 1;
    this.searchMacDeatil
      ? this.searchMac()
      : this.showItem(
          this.outwardData.id,
          this.outwardData.productId.id,
          this.outwardData.destinationId,
          this.outwardData.destinationType
        );
  }
  paginateOutwardMapping(event) {
    this.newFirstMac = event.first;
    this.outwardMappingMacListitemsPerPage = event.rows;
    this.currentPageOutwardMacMapping = event.page + 1;
    this.searchMacDeatil
      ? this.searchMac()
      : this.getItems(
          this.outwardData.productId.id,
          this.outwardData.sourceId,
          this.outwardData.sourceType
        );
  }

  customRows = 20;
  rowsPerPageOptions = [5, 10, 20, 50, 100, 1000, 5000];

  updateRowsPerPage(value: number) {
    if (value === null || value < 1) {
      value = 1;
    }
    if (value > 5000) {
      this.messageService.add({
        severity: "warn",
        summary: "Limit Exceeded",
        detail: "Maximum allowed rows per page is 5000"
      });
      value = 5000;
    }
    this.customRows = value;
    if (!this.rowsPerPageOptions.includes(value)) {
      this.rowsPerPageOptions = [...this.rowsPerPageOptions, value].sort((a, b) => a - b);
    }
    this.outwardMappingMacListitemsPerPage = value;
    const totalRecords = this.outwardMappingMacListdatatotalRecords;
    const previousFirst = this.newFirstMac;
    const newPage = Math.floor(previousFirst / value);
    const totalPages = Math.ceil(totalRecords / value);
    const validPage = Math.min(newPage, totalPages - 1);
    this.newFirstMac = validPage * value;
    this.currentPageOutwardMacMapping = validPage + 1;
    this.getItems(
      this.outwardData.productId.id,
      this.outwardData.sourceId,
      this.outwardData.sourceType
    );
  }

  searchMac() {
    this.searchMacData.filters[0].filterValue = this.searchMacDeatil;
    this.searchMacData.filters[0].filterColumn = this.searchOption;
    this.searchMacData.productId = this.outwardData.productId.id;
    this.searchMacData.ownerId = this.outwardData.destinationId;
    this.searchMacData.ownerType = this.outwardData.destinationType;
    this.searchMacData.entityId = this.outwardId;
    this.searchMacData.page = this.currentPageOutwardMapMapping;
    this.searchMacData.pageSize = this.outwardMappingMacListitemsPerPage;
    const url = "/inwards/searchInwardOutwardItem";
    this.inwardService.postMethod(url, this.searchMacData).subscribe(
      (response: any) => {
        this.inwardMacList = response.dataList;
        this.outwardMappingListdatatotalRecords = response.totalRecords;
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
    this.searchOption = "";
    this.searchMacDeatil = "";
    this.currentPageOutwardMapMapping = 1;
    this.outwardMappingListitemsPerPage = 20;
    this.showItem(
      this.outwardData.id,
      this.outwardData.productId.id,
      this.outwardData.destinationId,
      this.outwardData.destinationType
    );
  }
  searchAddMac() {
    this.searchMacData.filters[0].filterValue = this.searchMacDeatil;
    this.searchMacData.filters[0].filterColumn = this.searchOption;
    this.searchMacData.productId = this.outwardData.productId.id;
    this.searchMacData.ownerId = this.outwardData.sourceId;
    this.searchMacData.ownerType = this.outwardData.sourceType;
    this.searchMacData.page = this.currentPageOutwardMacMapping;
    this.searchMacData.pageSize = this.outwardMappingListitemsPerPage;
    const url = "/inwards/searchInwardOutwardItem";
    this.inwardService.postMethod(url, this.searchMacData).subscribe(
      (response: any) => {
        this.inwardMacList = response.dataList;
        this.outwardMappingMacListdatatotalRecords = response.totalRecords;
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

  clearAddMac() {
    this.searchOption = "";
    this.searchMacDeatil = "";
    this.currentPageOutwardMapMapping = 1;
    this.outwardMappingListitemsPerPage = 20;
    this.outwardMappingMacListitemsPerPage = 20;
    this.getItems(
      this.outwardData.productId.id,
      this.outwardData.sourceId,
      this.outwardData.sourceType
    );
  }

  selMacSearchOption(event) {
    this.searchMacDeatil = "";
    this.optionValue = event;
  }
}
