import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { InventoryRequestService } from "src/app/service/inventory-request.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { log } from "console";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { InwardService } from "src/app/service/inward.service";
import { OutwardService } from "src/app/service/outward.service";
import { PartnerService } from "src/app/service/partner.service";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { PopManagementsService } from "src/app/service/pop-managements.service";
import { INVENTORYS } from "src/app/constants/aclConstants";
import { forkJoin, of } from "rxjs";
import { catchError, last, map, tap } from "rxjs/operators";
declare var $: any;
@Component({
  selector: "app-inventory-request",
  templateUrl: "./inventory-request.component.html",
  styleUrls: ["./inventory-request.component.css"]
})
export class InventoryRequestComponent implements OnInit {
  @ViewChild("remarks") remarks: ElementRef;
  //rId : any = undefined;
  inventoryRequestFrom: FormGroup;
  inventoryRequestMappingFrom: FormGroup;
  approveRequestRemarkForm: FormGroup;
  rejectRequestRemarkForm: FormGroup;
  requestId: any;
  inventoryReturntFrom: FormGroup;
  fileterGlobal: string;
  inventoryRequestFromArray: FormArray;
  isMyInventoryShow: boolean = true;
  isAssignedInventoryShow: boolean = false;
  submitted: boolean = false;
  inventoryProductMappingSubmitted: boolean = false;
  currentPageReqInventoryProMapping = 1;
  reqInventoryProMappingItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  reqInventoryProMappingTotalRecords: string;
  currentPageAllRequestInventoryListdata = 1;
  allRequestInventoryListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  allRequestInventoryListdatatotalRecords: any;
  currentPageMyRequestInventoryListdata = 1;
  myRequestInventoryListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  myRequestFulfilInventorydataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  myRequestInventoryListdatatotalRecords: any;
  currentPageViewReqInventoryProMapping = 1;
  currentPagefulfilReqInventoryProMapping = 1;
  totalItemsInventoryReqFulfilment: any;
  viewReqInventoryProMappingItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewReqInventoryProMappingTotalRecords: string;
  createReqInventoryData: any;
  createRefundData: any;
  viewReqInventoryData: any;
  onbehalfof: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  productList: any = [];
  requesterList: any = [];
  wareHouseData: any = [];
  groupReturnValue: any;
  ifForwardCase: boolean = false;
  filterWareHouseData: any = [];
  allActiveProduct: any = [];
  allRequestInventory: any = [];
  myRequestInventory: any = [];
  productCategoryList: any = [];
  filterProductCategory: any = [];
  approveRequestSubmitted: boolean = false;
  rejectRequestSubmitted: boolean = false;
  viewInventoryRequestModal: boolean = false;
  inventoryRequestModal: boolean = false;
  approveChangeStatusModal: boolean = false;
  rejectChangeStatusModal: boolean = false;
  viewInventoryFulfillmentModal: boolean = false;
  inventoryReturnModal: boolean = false;
  assignInwardForm: FormGroup;
  editMode: boolean;
  showItemPerPage: any = 5;
  showAllRequestItemPerPage: any = 5;
  requesterFlag: boolean = false;
  requestToFlag: boolean = false;
  types = [
    { label: "New", value: "New" },
    { label: "Refurbished", value: "Refurbished" }
  ];
  behalfListType = [
    { label: "Warehouse", value: "WareHouse" },
    { label: "Pop", value: "Pop" },
    { label: "Service Area", value: "ServiceArea" },
    { label: "Staff User", value: "StaffUser" }
  ];
  qtyErroMsg: string;
  AclClassConstants;
  AclConstants;
  showQtyError: boolean;
  public loginService: LoginService;
  deleteAccess: boolean = false;
  reisedIntReqAccess: boolean = false;
  fullfillmentAccess: boolean = false;
  forwardToWarehouseAccess: boolean = false;
  assignIntReqAccess: boolean = false;
  outwardFormGroup: FormGroup;

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
  warehouses = [];
  destinationStaffList = [];
  productDetailForm: FormGroup;
  // products:FormArray
  productGroup: FormGroup;
  isSinglepaymentChecked = false;
  rejectAccess = false;
  approveAccess = false;
  selectedProducts: any[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private inventoryRequestService: InventoryRequestService,
    loginService: LoginService,
    private inwardService: InwardService,
    private outwardService: OutwardService,
    private partnerService: PartnerService,
    private serviceAreaService: ServiceAreaService,
    private popService: PopManagementsService,
    private cd: ChangeDetectorRef
  ) {
    this.reisedIntReqAccess = loginService.hasPermission(INVENTORYS.RAISED_INVEN_REQUEST);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.INVEN_REQUEST_DELETE);
    this.assignIntReqAccess = loginService.hasPermission(INVENTORYS.ASSIGNED_INVEN_REQUEST);
    this.approveAccess = loginService.hasPermission(INVENTORYS.ASSIGNED_INVEN_REQUEST_APPROVE);
    this.rejectAccess = loginService.hasPermission(INVENTORYS.ASSIGNED_INVEN_REQUEST_REJECT);
    this.forwardToWarehouseAccess = loginService.hasPermission(
      INVENTORYS.ASSIGNED_INVEN_REQUEST_FORWARD
    );
    this.fullfillmentAccess = loginService.hasPermission(
      INVENTORYS.ASSIGNED_INVEN_REQUEST_FULLFILLMENT
    );
    this.loginService = loginService;
    this.inwardService.getAllWareHouse().subscribe((res: any) => {
      this.warehouses = res.dataList;
    });
  }

  ngOnInit(): void {
    this.inventoryRequestFrom = this.fb.group({
      onBehalfOf: ["", Validators.required],
      requestNameId: ["", Validators.required],
      requestToWarehouseId: ["", Validators.required],
      reason: ["", Validators.required]
    });
    this.inventoryReturntFrom = this.fb.group({
      requestInventoryName: ["", Validators.required],
      onBehalfOf: ["", Validators.required],
      requestNameId: ["", Validators.required],
      requestToWarehouseId: ["", Validators.required],
      reason: ["", Validators.required],
      remarks: ["", Validators.required],
      reqId: [""]
    });
    this.productDetailForm = this.fb.group({
      products: this.fb.array([])
    });
    // this.products = this.fb.array([])
    this.outwardFormGroup = this.fb.group({
      product: [""],
      sourceType: ["", Validators.required],
      source: ["", Validators.required],
      sourceId: [""],
      destinationType: ["", Validators.required],
      destination: ["", Validators.required],
      outwardDateTime: [new Date()],
      mvnoId: [""],
      inwardId: [""],
      usedQty: [0],
      unusedQty: [""],
      ispaymentChecked: [],
      inTransitQty: [""],
      outTransitQty: [""],
      rejectedQty: [""],
      requestInventoryId: [""],
      requestInventoryName: [""],
      requestInventoryProductId: [""],
      selectedItems: [0]
    });

    this.inventoryRequestMappingFrom = this.fb.group({
      productCategoryId: ["", Validators.required],
      productId: ["", Validators.required],
      itemType: ["", Validators.required],
      quantity: ["", [Validators.required, Validators.min(1)]],
      id: [""]
    });

    this.outwardService.getAllStaff().subscribe((res: any) => {
      const staffId = localStorage.getItem("userId");
      // this.staffList = res.staffUserlist;
      this.staffList = res.dataList.filter(element => element.id == staffId);
      this.destinationStaffList = res.dataList;
    });

    this.approveRequestRemarkForm = this.fb.group({
      requestRemark: ["", Validators.required]
    });
    this.rejectRequestRemarkForm = this.fb.group({
      requestRemark: ["", Validators.required]
    });
    this.inventoryRequestFromArray = this.fb.array([]);
    // this.commondropdownService.getActiveProductCategoryList();
    this.getAllActiveProductCategory();
    this.getAllRequestInventoryData("");
    this.getMyRequestInventoryData("");
    this.geetAllWarehouseData();
    this.getAllProduct();
    this.inventoryRequestMappingFrom.get("quantity").valueChanges.subscribe(val => {
      const qty: number = val;
      var letters = /^[A-Za-z]+$/;
      this.qtyErroMsg = "";
      this.showQtyError = false;
      if (val != null) {
        if (String(val).match(letters)) {
          this.showQtyError = true;
          this.qtyErroMsg = "Only Numeric value are allowed.";
        } else if (qty < 0) {
          this.showQtyError = true;
          this.qtyErroMsg = "Quantity must be greater than 0.";
        } else {
          this.showQtyError = false;
        }
      }
    });
  }

  getAllRequestInventoryData(list) {
    let size: number;
    if (list) {
      size = list;
      this.allRequestInventoryListdataitemsPerPage = list;
    } else {
      size = this.allRequestInventoryListdataitemsPerPage;
    }
    const pageData = {
      page: this.currentPageAllRequestInventoryListdata,
      pageSize: this.allRequestInventoryListdataitemsPerPage,
      sortBy: "id",
      sortOrder: 0
    };
    const url = "/requestinventory/getAllAssignedRequestInventory";
    this.inventoryRequestService.postMethod(url, pageData).subscribe(
      (response: any) => {
        this.allRequestInventory = response.dataList || [];
        this.allRequestInventoryListdatatotalRecords = response.totalRecords || 0;
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

  getMyRequestInventoryData(list) {
    let size: number;
    if (list) {
      size = list;
      this.myRequestInventoryListdataitemsPerPage = list;
    } else {
      size = this.myRequestInventoryListdataitemsPerPage;
    }
    const pageData = {
      page: this.currentPageMyRequestInventoryListdata,
      pageSize: this.myRequestInventoryListdataitemsPerPage,
      sortBy: "id",
      sortOrder: 0
    };
    const url = "/requestinventory/getAllByCurrentStaff";
    this.inventoryRequestService.postMethod(url, pageData).subscribe(
      (response: any) => {
        this.myRequestInventory = response.dataList;
        this.myRequestInventoryListdatatotalRecords = response.totalRecords;
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
  chakedData: any = [];
  // ispaymentChecked=false
  //   allSelectBatch(event) {
  //     if (event.checked == true) {
  //       this.products.controls.forEach((el: any) => {
  //         el.patchValue({
  //           isSinglepaymentChecked: true
  //         });
  //       });
  //       //  this.ispaymentChecked=true
  //     }
  //     if (event.checked == false) {
  //       this.products.controls.forEach((el: any) => {
  //         el.patchValue({
  //           isSinglepaymentChecked: false
  //         });
  //       });
  //       //  this.ispaymentChecked=false
  //     }
  //   }

  allSelectBatch(event) {
    const isChecked = event.checked;

    this.products.controls.forEach((el: any) => {
      const isDisabled =
        el.get("requestStatus").value === "Close" ||
        el.get("quantity").value > el.get("availableQty").value ||
        el.get("quantity").value == null ||
        el.get("quantity").value == 0;

      // ✅ Only update non-disabled checkboxes
      if (!isDisabled) {
        el.patchValue({
          isSinglepaymentChecked: isChecked
        });
      }
    });
  }

  openReqPresent = false;
  submit(): void {
    let data: any = [];
    this.submitted = true;
    if (this.outwardFormGroup.valid && !this.showQtyError) {
      data = this.products.value;

      data.forEach((obj: any) => {
        if (obj.isSinglepaymentChecked) {
          this.openReqPresent = true;
        }
      });
      if (this.openReqPresent) {
        let outwardSaveData = [];
        (data.forEach((obj: any, index) => {
          if (obj.isSinglepaymentChecked && obj.quantity !== null && obj.quantity !== 0) {
            const outward = {
              id: "",
              productId: "",
              qty: "",
              outwardDateTime: new Date(),
              source: "",
              sourceId: "",
              sourceType: "",
              status: "",
              outwardNumber: "",
              destinationId: null,
              destinationType: "",
              mvnoId: "",
              usedQty: 0,
              unusedQty: "",
              inTransitQty: "",
              outTransitQty: "",
              rejectedQty: 0,
              requestInventoryId: "",
              requestInventoryProductId: "",
              selectedItems: 0
            };
            outward.id = "";
            outward.productId = obj.productId;
            outward.qty = "";
            outward.outwardDateTime = this.outwardFormGroup.get("outwardDateTime").value
              ? this.outwardFormGroup.get("outwardDateTime").value
              : outward.outwardDateTime;
            outward.sourceId = this.outwardFormGroup.get("sourceId").value;
            outward.sourceType = this.outwardFormGroup.get("sourceType").value;
            outward.status = "ACTIVE";
            outward.outwardNumber = "";
            outward.destinationId = this.outwardFormGroup.get("destination").value;
            outward.destinationType = this.outwardFormGroup.get("destinationType").value;
            outward.mvnoId = null;
            outward.usedQty = 0;
            outward.selectedItems = 0;
            outward.unusedQty = obj.availableQty;
            outward.inTransitQty = obj.quantity;
            outward.outTransitQty = "";
            outward.rejectedQty = 0;
            // outward.requestInventoryId = this.reqInventoryList[index]?.inventoryRequestId || "";
            // outward.requestInventoryProductId = this.reqInventoryList[index]?.id || "";
            const matchingReq = this.reqInventoryList.find(
              (req: any) => req.productId === obj.productId
            );

            if (matchingReq) {
              outward.requestInventoryId = matchingReq.inventoryRequestId;
              outward.requestInventoryProductId = matchingReq.id;
            }
            outwardSaveData.push(outward);
          }
        }),
          this.outwardService.saveAllInventoryRequest(outwardSaveData).subscribe(
            (res: any) => {
              if (res.responseCode == 406 || res.responseCode == 417) {
                // this.closefulfillInventoryModal();
                this.messageService.add({
                  severity: "info",
                  summary: "info",
                  detail: res.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else if (res.responseCode == 200) {
                this.submitted = false;
                this.outwardFormGroup.patchValue({
                  outwardDateTime: new Date()
                });
                setTimeout(() => {
                  this.closefulfillInventoryModal();
                  this.messageService.add({
                    severity: "success",
                    summary: "Successfully",
                    detail: res.responseMessage,
                    icon: "far fa-check-circle"
                  });
                }, 100);
              }
            },
            (error: any) => {
              this.closefulfillInventoryModal();
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          ));
      } else {
        this.submitted = false;
        this.closefulfillInventoryModal();
        this.messageService.add({
          severity: "info",
          summary: "info",
          detail: "Please select at least one item to assign/ No Open Request present",
          icon: "far fa-times-circle"
        });
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
      source: "",
      sourceId: "",
      sourceType: "",
      status: "",
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
    // outward.productId = this.;
    outward.qty = outwardValues.qty;
    // outward.isQtyChanged = (outwardValues.qty != this.initialValue);
    outward.status = outwardValues.status;
    outward.outwardDateTime = outwardValues.outwardDateTime;
    outward.sourceId = outwardValues.sourceId;
    outward.sourceType = outwardValues.sourceType;
    outward.outwardNumber = outwardValues.outwardNumber ? outwardValues.outwardNumber : "";
    outward.destinationId = outwardValues.destination;
    outward.destinationType = outwardValues.destinationType;
    outward.mvnoId = null;
    //outward.inwardId = outwardValues.inwardId;
    outward.usedQty = outwardValues.usedQty;
    outward.unusedQty = outwardValues.unusedQty;
    outward.selectedItems = outwardValues.selectedItems;
    outward.inTransitQty = outwardValues.inTransitQty;
    outward.outTransitQty = outwardValues.outTransitQty;
    outward.rejectedQty = outwardValues.rejectedQty;
    outward.requestInventoryId = outwardValues.requestInventoryId;
    outward.requestInventoryProductId = outwardValues.requestInventoryProductId;
    return outward;
  }
  addbatchChecked(ind: number, event) {
    if (!event.value) {
      this.outwardFormGroup.patchValue({
        ispaymentChecked: false
      });
      // this.cd.markForCheck();
    }
  }

  reqInventoryList = [];
  //   openRequestFlag = false;
  dataforwardToOutwardScreen() {
    this.viewInventoryRequestModal = false;
    this.viewInventoryFulfillmentModal = true;
    this.currentPagefulfilReqInventoryProMapping = 1;

    if (this.viewReqInventoryData) {
      this.reqInventoryList = this.viewReqInventoryData.requestInvenotryProductMappings.map(
        (obj: any) => {
          this.outwardService
            .getProductAvailableQTY(
              obj.productId,
              this.viewReqInventoryData.requestToWarehouseId,
              "Warehouse"
            )
            .subscribe((res: any) => {
              if (res.dataList[0]?.unusedQty) {
                obj.availableQty = res.dataList[0].unusedQty;
                const productGroup = this.fb.group({
                  isSinglepaymentChecked: [obj.isSinglepaymentChecked],
                  requestQuantity: [obj.quantity],
                  fulfiledQuantity: [obj.fulfilledQty],
                  inTransitQuantity: [obj.inTransitQty],
                  quantity: [obj.quantity - (obj.fulfilledQty + obj.inTransitQty)],
                  productCategoryName: [obj.productCategoryName],
                  productName: [obj.productName],
                  availableQty: [obj.availableQty],
                  requestStatus: [obj.requestStatus],
                  productId: [obj.productId]
                });

                this.products.push(productGroup);
                this.totalItemsInventoryReqFulfilment = this.products.length;
              } else {
                obj.availableQty = 0;
                const productGroup = this.fb.group({
                  isSinglepaymentChecked: [obj.isSinglepaymentChecked],
                  requestQuantity: [obj.quantity],
                  fulfiledQuantity: [obj.fulfilledQty],
                  inTransitQuantity: [obj.inTransitQty],
                  quantity: [obj.quantity - (obj.fulfilledQty + obj.inTransitQty)],
                  productCategoryName: [obj.productCategoryName],
                  productName: [obj.productName],
                  availableQty: [obj.availableQty],
                  requestStatus: [obj.requestStatus],
                  productId: [obj.productId]
                });

                this.products.push(productGroup);
                this.totalItemsInventoryReqFulfilment = this.products.length;
              }
            });

          return obj;
        }
      );

      // this.reqInventoryList.forEach((reqInventory) => {
      //   const productGroup = this.fb.group({
      //     isSinglepaymentChecked: [reqInventory.isSinglepaymentChecked],
      //     quantity: [reqInventory.quantity],
      //     productCategoryName:[reqInventory.productCategoryName],
      //     productName:[reqInventory.productName],
      //     availableQty:[reqInventory.availableQty],

      //     requestStatus:[reqInventory.requestStatus]

      //   });

      //   this.products.push(productGroup);
      //   console.log('products',this.products)
      // });
      setTimeout(() => {
        let data = this.products.value;
        for (let datus of data) {
          if (datus.quantity > datus.availableQty || datus.requestStatus === "Close") {
            // this.openRequestFlag = true;
            this.cd.markForCheck();
            break;
          }
        }
      }, 500);
      this.sources = this.warehouses;
      this.outwardFormGroup.patchValue({
        requestInventoryName: this.viewReqInventoryData.requestInventoryName,
        sourceType: "Warehouse",
        sourceId: this.viewReqInventoryData.requestToWarehouseId,
        source: this.viewReqInventoryData.requestToName
      });
    }
    if (this.viewReqInventoryData.onBehalfOf === "WareHouse") {
      this.destinationType = [{ label: "Warehouse" }];
    }
    // else if (this.viewReqInventoryData.onBehalfOf === "StaffUser") {
    //   this.destinationType = [{ label: "Staff" }];
    // }
    else {
      this.destinationType = [{ label: "Staff" }];
    }
  }
  get products(): FormArray {
    return this.productDetailForm.get("products") as FormArray;
  }
  isDestAStaffOrCustomer = false;
  destinations = [];
  getDestinations(destinationType): void {
    this.outwardFormGroup.controls.destination.setValue("");
    // this.outwardFormGroup.controls.inTransitQty.setValue("");
    const destinationTypeVal = destinationType;
    const sourceTypeVal = this.outwardFormGroup.controls.sourceType.value;
    const sourceVal = this.outwardFormGroup.controls.source.value;
    if (destinationType == "Warehouse") {
      this.isDestAStaffOrCustomer = false;
      this.destinations = this.warehouses;
      const destinationData = this.destinations;
      if (this.viewReqInventoryData.onBehalfOf === "WareHouse") {
        this.destinations = destinationData.filter(
          item => item.id == this.viewReqInventoryData.requestNameId
        );
      } else if (sourceTypeVal != "" && destinationTypeVal != "") {
        if (sourceTypeVal == destinationTypeVal) {
          if (sourceVal != "") {
            this.destinations = destinationData.filter(item => item.name != sourceVal);
          }
        }
      }
    } else if (destinationType == "Staff") {
      this.isDestAStaffOrCustomer = true;
      this.destinations = this.destinationStaffList.filter(element => element.partnerid == 1);
      const destinationData = this.destinations;
      if (this.viewReqInventoryData.onBehalfOf === "StaffUser") {
        this.destinations = destinationData.filter(
          item => item.id == this.viewReqInventoryData.requestNameId
        );
      } else if (sourceTypeVal != "" && destinationTypeVal != "") {
        if (sourceTypeVal == destinationTypeVal) {
          if (sourceVal != "") {
            this.destinations = destinationData.filter(item => item.id != sourceVal);
          }
        }
      }
    } else if (destinationType == "Partner") {
      const url = "/partner/getAllTypePartner";
      this.isDestAStaffOrCustomer = false;
      this.partnerService.getMethod(url).subscribe(
        (res: any) => {
          this.destinations = res.partnerlist;

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
    }
  }
  sources = [];
  isSourceAStaffOrCustomer = false;
  sourceTypeAsStaffFlag = false;
  staffList = [];
  getSources(sourceType): void {
    this.outwardFormGroup.controls.destinationType.setValue("");
    this.outwardFormGroup.controls.destination.setValue("");
    // this.outwardFormGroup.controls.inTransitQty.setValue("");
    // this.availableQty = 0;
    if (sourceType == "Warehouse") {
      this.isSourceAStaffOrCustomer = false;
      this.sourceTypeAsStaffFlag = false;
      this.sources = this.warehouses;
      this.destinationType = [{ label: "Warehouse" }, { label: "Staff" }, { label: "Partner" }];
    } else if (sourceType == "Staff") {
      this.isSourceAStaffOrCustomer = true;
      this.sourceTypeAsStaffFlag = true;
      this.sources = this.staffList;
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

  openInventoryReqModal(id) {
    this.ifForwardCase = true;
    this.getInventoryRequestDetails(id);
  }
  openInventoryRequestDetails(id) {
    this.ifForwardCase = false;
    this.getInventoryRequestDetails(id);
  }

  getInventoryRequestDetails(id) {
    const url = "/requestinventory/getById?id=" + id;
    this.inventoryRequestService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.viewInventoryRequestModal = true;
          this.viewReqInventoryData = response.data;
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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  myInventoryOpen() {
    this.isMyInventoryShow = true;
    this.isAssignedInventoryShow = false;
    this.getMyRequestInventoryData("");
  }

  assignedInventoryOpen() {
    this.isMyInventoryShow = false;
    this.isAssignedInventoryShow = true;
    this.getAllRequestInventoryData("");
  }

  openRequestInventoryModal() {
    this.inventoryRequestModal = true;
    this.selectedProducts = [];
  }
  openReturnInventoryModal(data) {
    this.inventoryReturntFrom.patchValue({
      requestInventoryName: data.requestInventoryName,
      onBehalfOf: data.onBehalfOf,
      requestNameId: data.requesterName,
      requestToWarehouseId: data.requestToWarehouseId,
      reason: data.reason,
      reqId: data.id
    });
    this.inventoryReturnModal = true;
  }
  saveForwardRequest() {
    this.submitted = true;
    if (this.inventoryReturntFrom.valid) {
      let forwardToReqId = this.inventoryReturntFrom.value.requestToWarehouseId;
      let remarks = this.inventoryReturntFrom.value.remarks;
      let reqId = this.inventoryReturntFrom.value.reqId;
      this.createRefundData = [];
      let data = this.createRefundData;
      this.inventoryRequestService
        .forwardToWarehouse(forwardToReqId, remarks, reqId, data)
        .subscribe(
          (response: any) => {
            if (response.responseCode == 200) {
              this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: response.responseMessage,
                icon: "far fa-check"
              });
              this.closeForwarInventoryModal();
              this.getAllRequestInventoryData("");
              // this.getAllRequestInventoryData();
              // this.getMyRequestInventoryData();
            } else if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "error",
                detail: response.responseMessage,
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
    // else {
    //   this.messageService.add({
    //     severity: "info",
    //     summary: "info",
    //     detail: "Minimum one Product Details need to add",
    //     icon: "far fa-times-circle",
    //   });
    // }
  }

  closefulfillInventoryModal() {
    this.ifForwardCase = false;
    this.viewInventoryFulfillmentModal = false;
    while (this.products.controls.length != 0) {
      this.products.removeAt(0);
    }
    // this.products.value.splice(0,this.products.length)
    this.outwardFormGroup.reset();
    this.openReqPresent = false;
    // this.openRequestFlag = false;
  }

  closeRequestInventoryModal() {
    this.viewInventoryRequestModal = false;
    this.ifForwardCase = false;
    this.submitted = false;
    this.inventoryRequestFrom.reset();
    this.inventoryRequestFromArray = this.fb.array([]);
    this.inventoryRequestFromArray.controls = [];
    this.requesterList = [];
    this.inventoryRequestMappingFrom.reset();
    this.inventoryRequestModal = false;
    this.inventoryReturnModal = false;
    this.requestToFlag = false;
    this.requesterFlag = false;
    this.selectedProducts = [];
    this.getAllActiveProductCategory();
  }

  closeForwarInventoryModal() {
    this.submitted = false;
    this.inventoryReturntFrom.reset();
    this.inventoryReturnModal = false;
  }

  getProductbyCategory(event) {
    let prodCateId = event.value;
    this.inventoryRequestMappingFrom.controls["productId"].reset();
    const url = "/product/getAllActiveProductsByProductCategoryId?pc_id=" + prodCateId;
    this.inventoryRequestService.getMethod(url).subscribe(
      (response: any) => {
        this.productList = response.dataList;
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

  onAddRequestInventoryProductField() {
  this.inventoryProductMappingSubmitted = true;
  if (this.inventoryRequestMappingFrom.valid) {
    const selectedProductId = this.inventoryRequestMappingFrom.get('productId')?.value;
    const isDuplicate = this.selectedProducts.some(p => p.id === selectedProductId);
    if (isDuplicate) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "This product is already in the request list.",
        icon: "far fa-check"
      }); 
      return; 
    }
    const selectedProduct = this.productList.find(p => p.id === selectedProductId);
    if (selectedProduct) {
      this.selectedProducts.push(selectedProduct);
    }
    this.inventoryRequestFromArray.push(this.reqInventoryProductFormGroup());
    this.inventoryRequestMappingFrom.reset();
    this.inventoryProductMappingSubmitted = false;
  }
}

  reqInventoryProductFormGroup(): FormGroup {
    return this.fb.group({
      productCategoryId: [
        this.inventoryRequestMappingFrom.value.productCategoryId,
        Validators.required
      ],
      productId: [this.inventoryRequestMappingFrom.value.productId],
      itemType: [this.inventoryRequestMappingFrom.value.itemType],
      quantity: [this.inventoryRequestMappingFrom.value.quantity, Validators.required],
      id: [""]
    });
  }

  saveInventoryRequest() {
    this.submitted = true;
    if (this.inventoryRequestFrom.valid) {
      if (this.inventoryRequestFromArray.controls.length > 0) {
        const url = "/requestinventory/save";
        this.createReqInventoryData = "";
        this.createReqInventoryData = this.inventoryRequestFrom.value;
        this.createReqInventoryData.status = "Pending";
        this.createReqInventoryData.requestInvenotryProductMappings =
          this.inventoryRequestFromArray.value;
        this.inventoryRequestService.postMethod(url, this.createReqInventoryData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: response.responseMessage,
                icon: "far fa-check"
              });
            } else if (response.responseCode == 200) {
              this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: response.responseMessage,
                icon: "far fa-check"
              });
              this.closeRequestInventoryModal();
              this.getAllRequestInventoryData("");
              this.getMyRequestInventoryData("");
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
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        this.messageService.add({
          severity: "info",
          summary: "info",
          detail: "Minimum one Product Details need to add",
          icon: "far fa-times-circle"
        });
      }
    }
  }

  getRequesterData(event) {
    const data = event.value;
    const url = "/requestinventory/onbehalfoff?onBehalfOf=" + data;
    this.inventoryRequestService.getMethod(url).subscribe(
      (response: any) => {
        this.inventoryRequestFrom.get("requestNameId").reset();
        this.inventoryRequestFrom.get("requestToWarehouseId").reset();
        this.inventoryRequestMappingFrom.get("productCategoryId").reset();
        this.inventoryRequestMappingFrom.controls["productId"].reset();
        this.inventoryRequestFromArray = this.fb.array([]);
        this.inventoryRequestFromArray.controls = [];
        this.requesterFlag = true;
        this.requestToFlag = false;
        if (event.value == "Pop" || event.value == "ServiceArea") {
          this.productCategoryList = this.filterProductCategory.filter(
            item => item.type != "CustomerBind"
          );
        } else {
          this.productCategoryList = this.filterProductCategory;
        }
        this.requesterList = response.dataList;
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

  geetAllWarehouseData() {
    const url = "/requestinventory/getAllWareHouses";
    this.inventoryRequestService.getMethod(url).subscribe(
      (response: any) => {
        this.wareHouseData = response.dataList;
        this.filterWareHouseData = response.dataList;
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

  reqInventoryProductpageChangedData(number) {
    this.currentPageReqInventoryProMapping = number;
  }

  deleteConfirmonReqInventoryProdMapping(
    ReqInventoryProductMappingFieldIndex,
    ReqInventoryProductMappingFieldId,
    ReqInventoryProductId
  ): void {
    this.confirmationService.confirm({
      message: "Do you want to delete this Product Mapping?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.onRemoveReqInventoryProductMapping(
          ReqInventoryProductMappingFieldIndex,
          ReqInventoryProductMappingFieldId,
          ReqInventoryProductId
        );
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

  async onRemoveReqInventoryProductMapping(
    ReqInventoryProductMappingFieldIndex: number,
    ReqInventoryProductMappingFieldId: number,
    ReqInventoryProductId: number
  ): Promise<void> {
    this.inventoryRequestFromArray.removeAt(ReqInventoryProductMappingFieldIndex);
    const totalItems = this.inventoryRequestFromArray.length;
    const totalPages = Math.ceil(totalItems / this.reqInventoryProMappingItemsPerPage);
    if (this.currentPageReqInventoryProMapping > totalPages) {
      this.currentPageReqInventoryProMapping = totalPages > 0 ? totalPages : 1;
    }
    if (this.selectedProducts && Array.isArray(this.selectedProducts)) {
      this.selectedProducts = this.selectedProducts.filter(
        (p: any) => p.id !== ReqInventoryProductId
      );
    }
    if (this.inventoryRequestMappingFrom?.get("productId")) {
      const currentProductId = this.inventoryRequestMappingFrom.get("productId")?.value;
      if (currentProductId === ReqInventoryProductId) {
        this.inventoryRequestMappingFrom.patchValue({ productId: null });
      }
    }
    this.messageService.add({
      severity: "success",
      summary: "Deleted",
      detail: "Product mapping deleted successfully"
    });
  }

  getAllProduct() {
    const url = "/product/getAllActiveProduct";
    this.inventoryRequestService.getMethod(url).subscribe(
      (response: any) => {
        this.allActiveProduct = response.dataList;
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

  pageChangedAllReqInvList(pageNumber): void {
    this.currentPageAllRequestInventoryListdata = pageNumber;
    this.getAllRequestInventoryData("");
  }

  TotalItemPerPageAllReqInv(event): void {
    this.showAllRequestItemPerPage = Number(event.value);
    if (this.currentPageAllRequestInventoryListdata > 1) {
      this.currentPageAllRequestInventoryListdata = 1;
    }
    this.getAllRequestInventoryData(this.showAllRequestItemPerPage);
  }

  pageChangedMyReqInvList(pageNumber): void {
    this.currentPageMyRequestInventoryListdata = pageNumber;
    //this.getAllRequestInventoryData();
    this.getMyRequestInventoryData("");
  }

  TotalItemPerPageMyReqInv(event): void {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageMyRequestInventoryListdata > 1) {
      this.currentPageMyRequestInventoryListdata = 1;
    }
    //this.getAllRequestInventoryData();
    this.getMyRequestInventoryData(this.showItemPerPage);
  }
  showItemReqInventory: any;
  TotalItemPerPageMyReqInvFulfil(event) {
    this.showItemReqInventory = Number(event.value);
    if (this.currentPagefulfilReqInventoryProMapping > 1) {
      this.currentPagefulfilReqInventoryProMapping = 1;
    }
    this.getMyRequestFulfilInventoryData(this.showItemReqInventory);
  }

  getMyRequestFulfilInventoryData(list) {
    //
    let size: number;

    this.myRequestFulfilInventorydataitemsPerPage = list
      ? list
      : this.myRequestFulfilInventorydataitemsPerPage;

    // if (list) {

    //    = list;
    // } else {
    //   this.myRequestFulfilInventorydataitemsPerPage=this.myRequestFulfilInventorydataitemsPerPage
    // }
  }
  deleteConfirmonReqInventory(id): void {
    this.confirmationService.confirm({
      message: "Do you want to delete this Inventory Request?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteInventoryRequest(id);
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

  deleteInventoryRequest(id) {
    const url = "/requestinventory/delete?id=" + id;
    this.inventoryRequestService.deleteMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.getMyRequestInventoryData("");
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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getSelRequester(event) {
    this.requestToFlag = true;
    if (this.inventoryRequestFrom.controls.onBehalfOf.value == "WareHouse") {
      this.wareHouseData = this.filterWareHouseData.filter(item => item.id != event.value);
    } else {
      this.inventoryRequestFrom.get("requestToWarehouseId").reset();
      this.wareHouseData = this.filterWareHouseData;
    }
  }
  closeApproveInventoryModal() {
    this.approveRequestSubmitted = false;
    this.approveRequestRemarkForm.reset();
    this.approveChangeStatusModal = false;
  }
  closeRejectInventoryModal() {
    this.rejectRequestSubmitted = false;
    this.rejectRequestRemarkForm.reset();
    this.rejectChangeStatusModal = false;
  }

  approveChangeStatus(id) {
    this.requestId = id;
    this.approveChangeStatusModal = true;
  }

  rejectChangeStatus(id) {
    this.requestId = id;
    this.rejectChangeStatusModal = true;
  }

  approveRequest() {
    this.approveRequestSubmitted = true;
    let id = this.requestId;
    const status = "Approve";
    const remarks = this.approveRequestRemarkForm.controls.requestRemark.value;

    const url =
      "/requestinventory/approveStatus?id=" + id + "&status=" + status + "&remarks=" + remarks;
    this.inventoryRequestService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.getMyRequestInventoryData("");
          this.getAllRequestInventoryData("");
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        this.approveRequestRemarkForm.reset();
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
    this.approveChangeStatusModal = false;
  }

  rejectRequest() {
    this.rejectRequestSubmitted = true;
    let id = this.requestId;
    const status = "Rejected";
    const remarks = this.rejectRequestRemarkForm.controls.requestRemark.value;

    const url =
      "/requestinventory/approveStatus?id=" + id + "&status=" + status + "&remarks=" + remarks;
    this.inventoryRequestService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.getMyRequestInventoryData("");
          this.getAllRequestInventoryData("");
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        this.rejectRequestRemarkForm.reset();
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
    this.rejectChangeStatusModal = false;
  }

  viewfulfilReqInventoryProductpageChangedData(pageNumber) {
    this.currentPagefulfilReqInventoryProMapping = pageNumber;
  }
  viewReqInventoryProductpageChangedData(pageNumber) {
    this.currentPageViewReqInventoryProMapping = pageNumber;
  }
  quantityInValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }
  getAllActiveProductCategory() {
    const url = "/productCategory/getAllActiveProductCategories";
    this.inventoryRequestService.getMethod(url).subscribe(
      (response: any) => {
        this.productCategoryList = response.dataList;
        this.filterProductCategory = response.dataList;
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

  onProductSelect(selectedProductId: number) {
    const isDuplicate = this.selectedProducts.find(p => p.id === selectedProductId);
    if (isDuplicate) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: `Product "${isDuplicate.name}" is already in the list.`,
        icon: "far fa-times-circle"
      });
      this.inventoryRequestMappingFrom.get("productId")?.reset();
      return;
    }
  }
}
