import { values } from "lodash";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

import {
  ITEMS_PER_PAGE,
  PER_PAGE_ITEMS,
  pageLimitOptions
} from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InwardService } from "src/app/service/inward.service";
import { LoginService } from "src/app/service/login.service";
import { formatDate } from "@angular/common";
import { Regex } from "src/app/constants/regex";
import { Observable, Observer } from "rxjs";
import { Table } from "primeng/table";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { INVENTORYS } from "src/app/constants/aclConstants";
import { HttpClient } from "@angular/common/http";
import { element } from "protractor";
import { log } from "console";
import * as moment from "moment";

declare var $: any;

@Component({
  selector: "app-inwards",
  templateUrl: "./inwards.component.html",
  styleUrls: ["./inwards.component.css"]
})
export class InwardsComponent implements OnInit {
  inwardsForm: FormControl;
  expiryTime: "";
  expiryTimeUnit: string;
  //   calculatedExpiryDate: string;
  productData: any;
  startDateTime: Date;
  //   expiryDateTime: Date;
  inwardFormGroup: FormGroup;
  specificationParametersDTO: FormGroup;
  specificationParametersDTOList: FormArray;
  submitted = false;
  stateData: any = {};
  countryListData: any;
  currentPageProductListdata = 1;
  productListdataitemsPerPage = PER_PAGE_ITEMS;
  searchOptionSelect = this.commondropdownService.customerSearchOption1;
  macOptionSelect = this.commondropdownService.macSearchOption;
  productListdatatotalRecords: any;
  countryPojo: any = {};
  inwardListData: any[] = [];
  inwardDetails: any = [];
  ifInwardDetails = false;
  IfPersonalInwardDataShow = true;
  viewCountryListData: any;
  viewStateListData: any;
  isStateEdit = false;
  searchData: any;
  // searchKey: string;
  AclClassConstants: any;
  AclConstants: any;
  specificationValue = "";
  specificationValue1 = "";
  mandatory: boolean = false;
  showTable: boolean = false;
  MACShowModal: boolean = false;
  approveChangeStatusModal: boolean = false;
  rejectChangeStatusModal: boolean = false;
  parameterList: any[] = [];
  pageLimitOptions = pageLimitOptions;
  showItemPerPage = 5;
  searchkey: string;
  public loginService: LoginService;
  editMode: boolean;
  selectedProductForEdit: any;
  isEditMode: boolean = false;
  selectWareHouseView: boolean;
  assignInwardForm: FormGroup;
  rejectInwardForm: FormGroup;
  assignInwardSubmitted: boolean = false;
  rejectInwardSubmitted: boolean = false;
  pincodeDeatils: any;
  approveInwardData = [];
  macForm: FormGroup;
  macFormList: FormArray;
  externalItemIdForMac: number;
  externalItemMacList: any[] = [];
  assignInwardID: any;
  inwardIDStatus: any;
  assignInwardProductId: any;
  uniqueIdCounter = 1;
  searchOption: any;
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  createView = false;
  listView = true;
  @ViewChild("closebutton") closebutton;
  @ViewChild("btnClose") btnClose;
  countryList = [];
  stateList = [];
  cityList = [];
  pincodeList = [];
  allpincodeNumber: any = [];
  unit = "";
  hasOEMConsider: boolean = false;
  warrantyDays = "";
  warrantyPeriods = "";
  products: any[] = [];
  warehouses: any[] = [];
  types = [
    { label: "New", value: "New" },
    { label: "Refurbished", value: "Refurbished" },
    { label: "Old", value: "Old" }
  ];
  pipe = new DatePipe("en-US");
  usedQty: number;
  inTransitQty: number;
  showQtyError: boolean;
  addMACaddress: boolean = false;
  inwardIdForMac: number;
  totalMacSerial: number;
  showIntransitQtyError: boolean;
  inwardMacList: any[] = [];
  itemList: any[] = [];
  macAdderessInput = "";
  inwardId = "";
  hasMac: boolean = true;
  hasSerial: boolean = true;
  inwardHasMac: boolean;
  inwardHasSeial: boolean;
  viewInwardsDetails: any;
  paramValue = "";
  detailView: boolean = false;
  qtyErroMsg = "";
  fileterGlobal1: any = "";
  searchDeatil: string;
  searchMacDeatil: string;
  searchkey2: string;
  searchInward: any = "";
  searchInward1: any = "";
  custId: any;
  isInwardView: boolean = false;
  isInwardEdit: boolean = false;
  isInwardDelete: boolean = false;
  showSpecification: boolean = false;
  isMandatory: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  showMacAddressAccess: boolean = false;
  rejectAccess: boolean = false;
  calculatedExpiryDateTime: string;
  inventoryDetailData: any;
  specDetailsShow: boolean = false;
  inventorySpecificationDetails: any[] = [];
  inventoryDetailModal: boolean = false;
  isBuldUpload: boolean = false;
  uploadDocForm: FormGroup;
  selectedFileUploadPreview: File[] = [];
  selectedFile: any;
  uploadInwardId: number;
  macSubmitted: boolean = false;
  inwardDeleteData: any;
  currentPageInwardMapMapping = 1;
  inwardMappingListitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  inwardMappingListdatatotalRecords: any;
  newFirst = 0;
  searchMacData: any;
  optionValue: any;
  today: string;
    maxDate: Date;

  constructor(
    private customerManagementService: CustomermanagementService,
    private http: HttpClient,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private inwardService: InwardService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(INVENTORYS.INVEN_INWARDS_CREATE);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.INVEN_INWARDS_DELETE);
    this.editAccess = loginService.hasPermission(INVENTORYS.INVEN_INWARDS_EDIT);
    this.rejectAccess = loginService.hasPermission(INVENTORYS.INWARD_REJECT);
    this.showMacAddressAccess = loginService.hasPermission(INVENTORYS.INVEN_INWARDS_SHOW_MAC);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.isInwardEdit = this.editAccess;
    this.editMode = !this.createAccess && this.editAccess ? true : false;
    // this.inwardService.getAllProducts().subscribe((res: any) => {
    //     this.products = res.dataList;
    // });
    // this.inwardService.getAllWareHouse().subscribe((res: any) => {
    //     this.warehouses = res.dataList;
    // });
    this.specificationParametersDTOList = this.formBuilder.array([]);
    this.macFormList = this.fb.array([]);
    this.inwardsForm = new FormControl();
    // this.expiryTime = 17;
    // this.expiryTimeUnit = "day";
    // this.calculatedExpiryDateTime = "";
  }

  ngOnInit(): void {
   this.maxDate = new Date(); 
    this.today = new Date().toISOString().split("T")[0];
    this.specificationParametersDTO = this.formBuilder.group({
      defaultValue: [""],
      paramValue: ["", Validators.required],
      id: [""],
      identityKey: [""],
      isMandatory: [false],
      mvnoId: [""],
      paramName: [""],
      pcid: [""]
    });
    this.macForm = this.fb.group({
      macAddress: [""],
      serialNumber: [""]
    });
    this.inwardFormGroup = this.formBuilder.group({
      id: [""],
      productId: ["", Validators.required],
      specificationParametersDTOList: this.specificationParametersDTOList,
      macFormList: this.macFormList,
      qty: [""],
      inwardDateTime: [new Date(), Validators.required],
      destinationId: ["", Validators.required],
      destinationType: [""],
      status: ["", Validators.required],
      type: ["", Validators.required],
      description: ["", Validators.required],
      startDateTime: [""],
      expiryDateTime: [""],
      inwardNumber: [""],
      mvnoId: [""],
      unusedQty: [""],
      usedQty: [""],
      inTransitQty: [
        "",
        [Validators.required, Validators.pattern(Regex.numeric), Validators.min(1)]
      ],
      outTransitQty: [""],
      rejectedQty: [""],
      totalMacSerial: [""],
      purchaseNumber: [""],
      supplierName: [""]
    });
    this.macFormList = this.macForm.get("macFormList") as FormArray;
    this.assignInwardForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectInwardForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.uploadDocForm = this.fb.group({
      file: ["", Validators.required]
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
      entityType: "inward"
    };

    this.calculateExpiryDateTime();
    this.getInwardList("");
    // this.inwardFormGroup.get("qty").valueChanges.subscribe(val => {
    //   const total = val - this.usedQty;
    //   if (total < 0) {
    //     this.showQtyError = true;
    //   } else {
    //     this.showQtyError = false;
    //   }
    // });
    // this.inwardFormGroup.get("inTransitQty").valueChanges.subscribe(val => {
    //   const total = val - this.totalMacSerial;
    //   if (total < 0) {
    //     this.showIntransitQtyError = true;
    //   } else {
    //     this.showIntransitQtyError = false;
    //   }
    // });
    this.inwardFormGroup.get("inTransitQty").valueChanges.subscribe(val => {
      const qty: number = val;
      const totalMacSerial = this.inwardFormGroup.get("totalMacSerial").value;
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
        } else if (qty === 0) {
          this.showQtyError = true;
          this.qtyErroMsg = "Quantity must not be 0.";
        } else if (qty < totalMacSerial) {
          this.showQtyError = true;
          this.qtyErroMsg = "Quantity must be greater than total added mac serial.";
        } else {
          this.showQtyError = false;
        }
      } else {
        if (this.editMode) {
          this.showQtyError = true;
          this.qtyErroMsg = "Please enter quantity.";
        }
      }
    });
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageProductListdata > 1) {
      this.currentPageProductListdata = 1;
    }
    if (!this.searchkey) {
      this.getInwardList(this.showItemPerPage);
    } else {
      this.searchInwardData();
    }
  }

  getInwardList(list) {
    this.inwardListData = [];
    let size: number;
    this.searchkey = "";
    const page = this.currentPageProductListdata;
    if (list) {
      size = list;
      this.productListdataitemsPerPage = list;
    } else {
      size = this.productListdataitemsPerPage;
    }

    const plandata = {
      page,
      pageSize: this.productListdataitemsPerPage
    };
    this.inwardService.getAll(plandata).subscribe(
      (response: any) => {
        this.inwardListData = response.dataList;
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

  submit() {
    this.submitted = true;
    if (this.inwardFormGroup.valid && !this.showQtyError && !this.showIntransitQtyError) {
      if (this.editMode) {
        this.inwardService.update(this.mapObject()).subscribe(
          (res: any) => {
            if (res.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
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
              this.clearSearchInward();
              this.inwardFormGroup.patchValue({
                inwardDateTime: new Date()
              });
              this.editMode = false;
              this.submitted = false;
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
        this.inwardService.save(this.mapObject()).subscribe(
          (res: any) => {
            if (res.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
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
              this.clearSearchInward();
              this.inwardFormGroup.patchValue({
                inwardDateTime: new Date()
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
    }
  }

  selSearchOption(event) {
    this.searchDeatil = "";
    this.searchMacDeatil = "";
  }

  mapObject = () => {
    const inwardValues = this.inwardFormGroup.getRawValue();
    const inward = {
      id: "",
      productId: "",
      qty: 0,
      inwardDateTime: "",
      destinationId: "",
      destinationType: "Warehouse",
      type: "",
      description: "",
      startDateTime: "",
      expiryDateTime: "",
      status: "",
      inwardNumber: "",
      inTransitQty: "",
      mvnoId: "",
      usedQty: "",
      unusedQty: "",
      outTransitQty: "",
      rejectedQty: "",
      totalMacSerial: 0,
      specificationParametersDTOList: "",
      purchaseNumber: "",
      supplierName: ""
    };
    // macFormList: "",
    inward.id = inwardValues.id ? inwardValues.id : null;
    inward.productId = inwardValues.productId;
    inward.qty = inwardValues.qty;
    inward.status = inwardValues.status;
    inward.inwardDateTime = inwardValues.inwardDateTime;
    inward.destinationId = inwardValues.destinationId;
    inward.specificationParametersDTOList = this.specificationParametersDTOList.value.map(
      ({ paramValues, ...rest }) => rest
    );
    inward.type = inwardValues.type;
    inward.description = inwardValues.description;
    inward.startDateTime = inwardValues.startDateTime;
    inward.expiryDateTime = inwardValues.expiryDateTime;
    inward.inwardNumber = inwardValues.inwardNumber ? inwardValues.inwardNumber : "";
    inward.mvnoId = null;
    inward.usedQty = inwardValues.usedQty;
    inward.unusedQty = inwardValues.unusedQty;
    inward.inTransitQty = inwardValues.inTransitQty;
    inward.outTransitQty = inwardValues.outTransitQty;
    inward.rejectedQty = inwardValues.rejectedQty;
    inward.totalMacSerial = inwardValues.totalMacSerial;
    inward.purchaseNumber = inwardValues.purchaseNumber;
    inward.supplierName = inwardValues.supplierName;
    // console.log(" this.inwardFormGroup.value.inwardDateTime", this.inwardFormGroup.value.inwardDateTime )
    // const format = 'dd-MM-yyyy';
    // const locale = 'en-US';
    // const myDate = this.inwardFormGroup.value.inwardDateTime;

    // const hh =myDate.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

    // const formattedDate = formatDate(myDate, format, locale) +' '+ hh;
    // console.log("date time",formattedDate )
    return inward;
  };

  clearMacMapping() {
    this.addMACaddress = false;
    this.inwardMacList = [];
  }

  addMacMapping() {
    const macList = [];
    this.inwardMacList.forEach(item => {
      macList.push({
        macAddress: item.macAddress,
        serialNumber: item.serialNumber
      });
    });
    let data = {
      inwardId: this.inwardId,
      macSerialListDTOList: macList
    };
    this.inwardService.postMethod("/inwards/saveManualMacSerial", data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
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
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.clearMacMapping();

          this.macForm.reset();
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

  editInward(id) {
    this.editMode = true;
    this.createView = true;
    this.listView = false;
    this.detailView = false;
    this.inwardService.getAllProducts().subscribe((res: any) => {
      this.products = res.dataList;
    });
    this.inwardService.getAllWareHouse().subscribe((res: any) => {
      this.warehouses = res.dataList;
    });
    // const inwardEdit = this.inwardListData.find(element => element.id == id);
    this.inwardDetails = [];
    this.ifInwardDetails = true;
    this.IfPersonalInwardDataShow = true;
    if (id) {
      const url = "/inwards/" + id;
      this.inwardService.getMethod(url).subscribe(
        (response: any) => {
          const inwardEdit = response.data;
          this.inwardFormGroup.patchValue({
            id: inwardEdit.id,
            productId: inwardEdit.productId.id,
            qty: inwardEdit.qty,
            status: inwardEdit.status,
            inwardDateTime: new Date(inwardEdit.inwardDateTime),
            // inwardDateTime: inwardEdit.inwardDateTime,
            destinationId: inwardEdit.destinationId,
            destinationType: inwardEdit.destinationType,
            type: inwardEdit.type,
            description: inwardEdit.description,
            startDateTime: inwardEdit.startDateTime,
            expiryDateTime: inwardEdit.expiryDateTime,
            inwardNumber: inwardEdit.inwardNumber,
            mvnoId: [""],
            usedQty: inwardEdit.usedQty,
            unusedQty: inwardEdit.unusedQty,
            inTransitQty: inwardEdit.inTransitQty,
            totalMacSerial: inwardEdit.totalMacSerial,
            purchaseNumber: inwardEdit.purchaseNumber,
            supplierName: inwardEdit.supplierName
          });
          this.hasOEMConsider = this.products.find(
            element => element.id == inwardEdit.productId.id
          ).hasOEMConsider;
          this.specificationParametersDTOList = this.formBuilder.array([]);
          inwardEdit.specificationParametersDTOList?.forEach(element => {
            let newArray;
            let listData = this.fb.array([]);
            if (element.paramMultiValues && element.paramMultiValues.length > 0) {
              //   newArray = element.paramValues
              //     .split(",")
              //     .map(value => ({ label: +value, value: +value }));

              element.paramMultiValues.forEach(data => {
                listData.push(
                  this.formBuilder.group({
                    value: data,
                    label: data
                  })
                );
              });
            }

            this.specificationParametersDTOList.push(
              this.formBuilder.group({
                defaultValue: [element.defaultValue],
                paramValue: [element.paramValue],
                // paramValue: [element.paramValue, element.isMandatory ? Validators.required : null],
                id: [element.id],
                identityKey: [element.identityKey],
                isMandatory: [element.isMandatory],
                mvnoId: [element.mvnoId],
                paramName: [element.paramName],
                pcid: [element.pcid],
                isMultiValueParam: [element.isMultiValueParam],
                paramValues: listData
              })
            );
          });

          this.showSpecification = this.specificationParametersDTOList.value.length > 0;
          //   this.showSpecification = true;
          this.usedQty = inwardEdit.usedQty;
          this.inTransitQty = inwardEdit.inTransitQty;
          this.totalMacSerial = inwardEdit.totalMacSerial;
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

  searchInwardData() {
    if (!this.searchkey || this.searchkey !== this.searchInward) {
      this.currentPageProductListdata = 1;
    }
    this.searchkey = this.searchInward;
    if (this.showItemPerPage) {
      this.productListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchInward;
    this.searchData.filter[0].filterColumn = this.searchInward1.trim();
    const page = {
      page: this.currentPageProductListdata,
      pageSize: this.productListdataitemsPerPage,
      sortBy: "id",
      sortOrder: 0
    };
    const url =
      "/inwards/search?page=" +
      page.page +
      "&pageSize=" +
      page.pageSize +
      "&sortBy=" +
      page.sortBy +
      "&sortOrder=" +
      page.sortOrder;

    this.inwardService.postMethod(url, this.searchData).subscribe(
      (res: any) => {
        if (res.responseCode === 200) {
          this.inwardListData = res.dataList;
          const list = this.inwardListData;
          const filterList = list.filter(cust => cust.id !== this.custId);
          this.inwardListData = filterList;
          this.productListdatatotalRecords = res.totalRecords;
        } else {
          this.productListdatatotalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
          });
          this.inwardListData = [];
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
          this.inwardListData = [];
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

  clearSearchInward() {
    {
    }
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.editMode = false;
    this.submitted = false;
    this.searchInward1 = "";
    this.searchInward = "";
    this.searchkey = "";
    this.getInwardList("");
    this.inwardFormGroup.reset();
    this.inwardFormGroup.patchValue({
      inwardDateTime: new Date()
    });
    this.specificationParametersDTOList = this.formBuilder.array([]);
  }

  deleteConfirmInward(productId: number) {
    if (productId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this inward ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteProduct(productId);
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

  deleteProduct(productId) {
    // const productEditData = this.inwardListData.find(element => element.id == productId);
    this.inwardService.delete(productId).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
        this.getInwardList("");
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

  createWareHouse() {
    this.specificationParametersDTOList = this.formBuilder.array([]);
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.editMode = false;
    this.inwardFormGroup.reset();
    this.inwardFormGroup.patchValue({
      inwardDateTime: new Date()
    });
    this.hasOEMConsider = false;
    this.inwardService.getAllProducts().subscribe((res: any) => {
      this.products = res.dataList;
    });
    this.inwardService.getAllWareHouse().subscribe((res: any) => {
      this.warehouses = res.dataList;
    });
  }

  getUnit(event) {
    this.hasOEMConsider = this.products.find(element => element.id == event.value).hasOEMConsider;
    this.unit = this.products.find(element => element.id == event.value).unit;
    this.expiryTime = this.products.find(element => element.id == event.value).expiryTime;

    this.expiryTimeUnit = this.products
      .find(element => element.id == event.value)
      .expiryTimeUnit.toString();

    this.optionProductCategoryParameter();
    // this.onStartDateChange();
  }

  optionProductCategoryParameter() {
    // this.specificationParametersDTOList.reset;
    const productId = this.inwardFormGroup.get("productId").value;
    const url = "/specificationParameters/getSpecificParametersByid?product_id=" + productId;
    this.inwardService.getAllParameter(url).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.specificationParametersDTOList = this.formBuilder.array([]);
          response.dataList.forEach(element => {
            let newArray;
            let listData = this.fb.array([]);
            if (element.paramMultiValues && element.paramMultiValues.length > 0) {
              //   newArray = element.paramValues
              //     .split(",")
              //     .map(value => ({ label: +value, value: +value }));

              element.paramMultiValues.forEach(data => {
                listData.push(
                  this.formBuilder.group({
                    value: data,
                    label: data
                  })
                );
              });
            }
            this.specificationParametersDTOList.push(
              this.formBuilder.group({
                defaultValue: [element.defaultValue],
                paramValue: [element.defaultValue],
                // paramValue: [element.paramValue, element.isMandatory ? Validators.required : null],
                id: [element.id],
                identityKey: [element.identityKey],
                isMandatory: [element.isMandatory],
                mvnoId: [element.mvnoId],
                paramName: [element.paramName],
                pcid: [element.pcid],
                isMultiValueParam: [element.isMultiValueParam],
                paramValues: listData
              })
            );
          });
          this.showSpecification = this.specificationParametersDTOList.value.length > 0;
        }

        // this.macForm.reset();
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

  pageChangedProductList(pageNumber) {
    this.currentPageProductListdata = pageNumber;
    if (!this.searchkey) {
      this.getInwardList("");
    } else {
      this.searchInwardData();
    }
  }

  addMACC(inward) {
    // this.MACShowModal = true;
    this.inwardId = inward.id;
    this.hasMac = this.inwardListData.find(
      element => element.id == inward.id
    ).productId.productCategory.hasMac;
    this.hasSerial = this.inwardListData.find(
      element => element.id == inward.id
    ).productId.productCategory.hasSerial;

    if (!this.hasMac && !this.hasSerial) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Product type does not allow to add Mac/Serial Number..",
        icon: "far fa-times-circle"
      });
      this.addMACaddress = false;
      return;
    } else {
      this.inwardIdForMac = inward.id;
      this.macForm = this.fb.group({
        id: [""],
        inwardId: [this.inwardIdForMac],
        outwardId: [null],
        status: ["ACTIVE"],
        macAddress: this.hasMac ? ["", Validators.required] : [null],
        serialNumber: this.hasSerial ? ["", Validators.required] : [null]
      });
      this.addMACaddress = true;
      this.inwardMacList = [];
      // this.showItem(inward.id, inward.productId.id, inward.destinationId, inward.destinationType);
    }
  }
  addMAC(inward) {
    // this.MACShowModal = true;
    this.hasMac = this.inwardListData.find(
      element => element.id == inward.id
    ).productId.productCategory.hasMac;
    this.hasSerial = this.inwardListData.find(
      element => element.id == inward.id
    ).productId.productCategory.hasSerial;

    if (!this.hasMac && !this.hasSerial) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Product type does not allow to add Mac/Serial Number..",
        icon: "far fa-times-circle"
      });
      this.addMACaddress = false;
      return;
    } else {
      this.inwardIdForMac = inward.id;
      this.macForm = this.fb.group({
        id: [""],
        inwardId: [this.inwardIdForMac],
        outwardId: [null],
        status: ["ACTIVE"],
        macAddress: this.hasMac ? ["", Validators.required] : [null],
        serialNumber: this.hasSerial ? ["", Validators.required] : [null]
      });
      this.MACShowModal = true;
      // this.addMACaddress = true;
      this.inwardDeleteData = inward;
      this.showItem(inward.id, inward.productId.id, inward.destinationId, inward.destinationType);
    }
  }

  createPolicyDetailsForm(): FormGroup {
    return this.fb.group({
      id: [""],
      inwardId: [this.inwardIdForMac],
      outwardId: [null],
      status: ["ACTIVE"],
      macAddress: ["", Validators.required],
      serialNumber: ["", Validators.required]
    });
  }

  calculateExpiryDateTime(): void {
    const startDateTime = new Date(this.inwardFormGroup.value.startDateTime);

    if (!isNaN(startDateTime.getTime()) && this.expiryTime && this.expiryTimeUnit) {
      switch (this.expiryTimeUnit.toLowerCase()) {
        case "day":
          startDateTime.setDate(startDateTime.getDate() + this.expiryTime);
          break;
        case "month":
          startDateTime.setMonth(startDateTime.getMonth() + this.expiryTime);
          break;
        case "year":
          startDateTime.setFullYear(startDateTime.getFullYear() + this.expiryTime);
          break;
        default:
          // Handle unsupported units or default to days
          startDateTime.setDate(startDateTime.getDate() + this.expiryTime);
          break;
      }
      this.inwardFormGroup.patchValue({
        expiryDateTime: moment(startDateTime).format("yyyy-MM-DD")
      });
    }
  }

  onStartDateChange(): void {
    this.calculateExpiryDateTime();
  }

  approved = false;
  approveChangeStatus(id, productId, outwardId, inward) {
    this.inwardHasMac = inward.productId.productCategory.hasMac;
    this.inwardHasSeial = inward.productId.productCategory.hasSerial;
    if (outwardId != null) {
      if (this.inwardHasMac || this.inwardHasSeial) {
        if (inward.inTransitQty != inward.totalMacSerial) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: "Serial numbers are not fulfilled from outward.",
            icon: "far fa-times-circle"
          });
        } else {
          this.approveChangeStatusModal = true;
          this.assignInwardID = id;
          this.assignInwardProductId = productId;
        }
      } else {
        this.approveChangeStatusModal = true;
        this.assignInwardID = id;
        this.assignInwardProductId = productId;
      }
    } else {
      this.approveChangeStatusModal = true;
      this.assignInwardID = id;
      this.assignInwardProductId = productId;
    }
  }
  rejectChangeStatus(id, productId) {
    this.rejectChangeStatusModal = true;
    this.assignInwardID = id;
    this.assignInwardProductId = productId;
  }

  performAction(item: any) {
    const index = this.parameterList.indexOf(item);
    if (index !== -1) {
      this.parameterList.splice(index, 1);
      this.showTable = this.parameterList.length > 0;
    }
  }

  open() {
    this.specificationValue = "";
    this.mandatory = false;
    $("#approveOpenStatusModal").modal("show");
  }

  saveParameter() {
    this.showTable = true;
    if (!this.specificationValue) {
      return;
    }
    this.parameterList.push({
      specificationValue: this.specificationValue,
      mandatory: this.mandatory
    });
    this.specificationValue = "";
    this.mandatory = false;
    this.showTable = this.parameterList.length > 0;
  }

  saveParametersAndClose() {
    this.saveParameter();
    $("#approveOpenStatusModal").modal("hide");
  }

  cancelAndClose() {
    $("#approveOpenStatusModal").modal("hide");
  }

  onAddAttributee() {
    this.macSubmitted = true;
    const macAddress = this.macForm.get("macAddress").value;
    const serialNumber = this.macForm.get("serialNumber").value;
    if (macAddress && serialNumber) {
      const newItem = {
        itemId: this.uniqueIdCounter++,
        macAddress: macAddress,
        serialNumber: serialNumber
      };
      this.inwardMacList.push(newItem);
      this.macForm.reset();
      this.macSubmitted = false;
    } else if (serialNumber) {
      const newItem = {
        itemId: this.uniqueIdCounter++,
        macAddress: macAddress,
        serialNumber: serialNumber
      };
      this.inwardMacList.push(newItem);
      this.macForm.reset();
      this.macSubmitted = false;
    }
  }

  editMACMapping(product: any) {
    this.selectedProductForEdit = { ...product };
    this.isEditMode = true;
  }

  deleteMACMapping(itemId: any) {
    const index = this.inwardMacList.findIndex(item => item.itemId === itemId);
    if (index !== -1) {
      this.inwardMacList.splice(index, 1);
    }
  }

  deleteShowMACMapping(product: any) {
    if (product) {
      this.confirmationService.confirm({
        message: "Do you want to delete this inward item ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteMACMap(product);
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

  deleteMACMap(inward) {
    this.inwardService.deleteMapMac(inward.id).subscribe(
      (response: any) => {
        if (response.responseCode == 406 || response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
        this.showItem(
          this.inwardDeleteData.id,
          this.inwardDeleteData.productId.id,
          this.inwardDeleteData.destinationId,
          this.inwardDeleteData.destinationType
        );
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

  saveEdit() {
    this.isEditMode = false;
    this.selectedProductForEdit = null;
  }

  approveInward(): void {
    this.assignInwardSubmitted = true;
    this.approveInwardData = [];
    if (this.assignInwardForm.valid) {
      let url = `/inwards/inwardApproval`;
      let approvalInwardData = {
        id: this.assignInwardID,
        productId: this.assignInwardProductId.id,
        approvalStatus: "Approve",
        approvalRemark: this.assignInwardForm.controls.remark.value
      };
      this.inwardService.updateMethod(url, approvalInwardData).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.closeApproveInventoryModal();
            this.approveInwardData = response.data;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            this.getInwardList("");
          } else {
            this.messageService.add({
              severity: "info",
              summary: "info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          }
          //
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

  rejectInward(): void {
    this.rejectInwardSubmitted = true;
    this.approveInwardData = [];
    if (this.rejectInwardForm.valid) {
      let url = `/inwards/inwardApproval`;
      let approvalInwardData = {
        id: this.assignInwardID,
        productId: this.assignInwardProductId.id,
        approvalStatus: "Rejected",
        approvalRemark: this.rejectInwardForm.controls.remark.value
      };

      this.inwardService.updateMethod(url, approvalInwardData).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.closeRejectInventoryModal();
            this.approveInwardData = response.data;
            this.getInwardList("");
          } else {
            this.messageService.add({
              severity: "info",
              summary: "info",
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

  // rejectInward() {
  //   this.approveInwardData = [];
  //   $("#rejectChangeStatusModal").modal("hide");
  //   if (this.assignInwardForm.valid) {
  //
  //     let url = `/inwards/inwardApproval`;
  //     let approvalInwardData = {
  //       id: this.assignInwardID,
  //       approvalStatus: "Rejected",
  //       approvalRemark: this.assignInwardForm.controls.remark.value,
  //     };

  //     this.inwardService.updateMethod(url, approvalInwardData).subscribe(
  //       (response: any) => {
  //         this.approveInwardData = response.data;
  //
  //         this.assignInwardForm.reset();
  //         this.getInwardList("");
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.msg,
  //           icon: "far fa-times-circle",
  //         });
  //
  //       }
  //     );
  //   }
  // }

  getInwardData(inwardId: any) {
    this.inwardDetails = [];
    this.ifInwardDetails = true;
    this.IfPersonalInwardDataShow = true;
    if (inwardId) {
      const url = "/inwards/" + inwardId;
      this.inwardService.getMethod(url).subscribe(
        (response: any) => {
          this.inwardDetails = response.data;
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

  inwardDeatilsClear() {
    this.IfPersonalInwardDataShow = false;
  }
  personalInwardData() {
    this.IfPersonalInwardDataShow = true;
  }

  onclosed() {
    this.fileterGlobal1 = "";
    this.searchOption = "";
    this.searchMacDeatil = "";
    this.getInwardList("");
    this.MACShowModal = false;
    this.currentPageInwardMapMapping = 1;
    this.inwardMappingListitemsPerPage = 20;
  }

  closeApproveInventoryModal() {
    this.assignInwardSubmitted = false;
    this.assignInwardForm.reset();
    this.approveChangeStatusModal = false;
  }

  closeRejectInventoryModal() {
    this.rejectInwardSubmitted = false;
    this.rejectInwardForm.reset();
    this.rejectChangeStatusModal = false;
  }

  canExit() {
    if (!this.inwardFormGroup.dirty) return true;
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
  getInwardDetails(id) {
    const url = "/inwards/" + id;
    this.inwardService.getMethod(url).subscribe(
      (res: any) => {
        this.viewInwardsDetails = res.data;
        this.listView = false;
        this.createView = false;
        this.detailView = true;

        this.showSpecification = true;
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

  inwardList() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }

  showItem(inwardId, productId, sourceId, sourceType) {
    let currentPage;
    currentPage = this.currentPageInwardMapMapping;
    let body = {
      page: currentPage,
      pageSize: this.inwardMappingListitemsPerPage
    };
    this.inwardId = inwardId;

    //this.macDetailsArray = this.fb.array([]);
    this.inwardService.postItems(inwardId, productId, sourceId, sourceType, body).subscribe(
      (res: any) => {
        this.inwardMacList = res.dataList;
        this.inwardMappingListdatatotalRecords = res.totalRecords;
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
  quantityInValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }
  clearFilterGlobal1(table: Table) {
    this.fileterGlobal1 = "";
    table.clear();
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
  }

  uploadDocument(inward) {
    this.inwardId = inward.id;
    this.hasMac = this.inwardListData.find(
      element => element.id == inward.id
    ).productId.productCategory.hasMac;
    this.hasSerial = this.inwardListData.find(
      element => element.id == inward.id
    ).productId.productCategory.hasSerial;

    if (!this.hasMac && !this.hasSerial) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Product type does not allow to add Mac/Serial Number..",
        icon: "far fa-times-circle"
      });
      this.addMACaddress = false;
      return;
    } else {
      this.uploadInwardId = inward.id;
      this.uploadDocForm.patchValue({
        file: ""
      });
      this.selectedFileUploadPreview = [];
      this.isBuldUpload = true;
    }
  }

  onFileChangeUpload(event: any) {
    this.selectedFileUploadPreview = [];
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.selectedFileUploadPreview.push(files.item(i));
      }
      if (!this.isValidCSVFile(this.selectedFile)) {
        this.uploadDocForm.controls.file.reset();
        this.selectedFileUploadPreview = [];
        alert("Please upload valid .csv file");
      } else {
        const file = event.target.files;
        this.uploadDocForm.patchValue({
          file: file
        });
      }
    }
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  deletUploadedFile(event: any) {
    var temp: File[] = this.selectedFileUploadPreview?.filter((item: File) => item?.name != event);
    this.selectedFileUploadPreview = temp;
    this.uploadDocForm.patchValue({
      file: temp
    });
  }

  uploadDocuments() {
    this.submitted = true;
    if (this.uploadDocForm.valid) {
      const formData = new FormData();
      let fileArray: FileList;
      if (this.uploadDocForm.controls.file) {
        if (!this.isValidCSVFile(this.selectedFile)) {
          this.uploadDocForm.controls.file.reset();
          alert("Please upload valid .csv file");
        } else {
          fileArray = this.uploadDocForm.controls.file.value;
          Array.from(fileArray).forEach(file => {
            formData.append("file", file);
          });
        }
      }

      const url = `/inwards/saveManualMacSerial/upload/${this.uploadInwardId}`;
      this.inwardService.postMethod(url, formData).subscribe(
        (response: any) => {
          if (response.responseCode === 406) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else if (response.responseCode === 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.submitted = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.isBuldUpload = false;
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

  closeUploadDocumentId() {
    this.isBuldUpload = false;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
  }

  paginate(event) {
    this.newFirst = event.first;
    this.inwardMappingListitemsPerPage = event.rows;
    this.currentPageInwardMapMapping = event.page + 1;
    this.searchMacDeatil
      ? this.searchMac()
      : this.showItem(
          this.inwardDeleteData.id,
          this.inwardDeleteData.productId.id,
          this.inwardDeleteData.destinationId,
          this.inwardDeleteData.destinationType
        );
  }

  searchMac() {
    this.searchMacData.filters[0].filterValue = this.searchMacDeatil;
    this.searchMacData.filters[0].filterColumn = this.searchOption;
    this.searchMacData.productId = this.inwardDeleteData.productId.id;
    this.searchMacData.ownerId = this.inwardDeleteData.destinationId;
    this.searchMacData.ownerType = this.inwardDeleteData.destinationType;
    this.searchMacData.entityId = this.inwardId;
    this.searchMacData.page = this.currentPageInwardMapMapping;
    this.searchMacData.pageSize = this.inwardMappingListitemsPerPage;
    const url = "/inwards/searchInwardOutwardItem";
    this.inwardService.postMethod(url, this.searchMacData).subscribe(
      (response: any) => {
        this.inwardMacList = response.dataList;
        this.inwardMappingListdatatotalRecords = response.totalRecords;
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
    this.currentPageInwardMapMapping = 1;
    this.inwardMappingListitemsPerPage = 20;
    this.showItem(
      this.inwardDeleteData.id,
      this.inwardDeleteData.productId.id,
      this.inwardDeleteData.destinationId,
      this.inwardDeleteData.destinationType
    );
  }

  selMacSearchOption(event) {
    this.searchMacDeatil = "";
    this.optionValue = event;
  }
  allowOnlyCharacters(event: any) {
  event.target.value = event.target.value.replace(/[^A-Za-z ]/g, '');
}
}
