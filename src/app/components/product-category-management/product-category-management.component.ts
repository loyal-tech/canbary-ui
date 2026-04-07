import { url } from "inspector";
import { Component, DebugElement, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { LoginService } from "src/app/service/login.service";
import * as fs from "fs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { ITEMS_PER_PAGE, pageLimitOptions } from "src/app/RadiusUtils/RadiusConstants";
import { ProductCategoryManagementService } from "src/app/service/product-category-management.service";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { HttpClient } from "@angular/common/http";
declare var $: any;
import { rest } from "lodash";
import { CheckboxModule } from "primeng/checkbox";
import { ResponseData } from "./../radius-role/base-save-update-response";
import { INVENTORYS } from "src/app/constants/aclConstants";
@Component({
  selector: "app-product-category-management",
  templateUrl: "./product-category-management.component.html",
  styleUrls: ["./product-category-management.component.css"]
})
export class ProductCategoryManagementComponent implements OnInit {
  paramName = "";
  isMandatory: boolean = false;
  showTable: boolean = false;
  showSearchBar: boolean = true;
  parameterList: any;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  productCategoryFormGroup: FormGroup;
  specificationParametersDTO: FormGroup;
  specificationParametersDTOList: FormArray;
  addParamForm: FormGroup;
  submitted = false;
  countryListData: any;
  currentPageProductListdata = 1;
  duplicateErrorMessage: string = "";
  productListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  productListdatatotalRecords: any;
  productListData: any[] = [];
  searchData: any;
  searchProductCatName: any = "";
  // searchKey: string;
  pageLimitOptions = pageLimitOptions;
  showItemPerPage: any = 5;
  viewProductCategoryDetails: any;
  searchkey: string;
  editMode: boolean;
  checked: boolean = true;
  productDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  productPageChargeDeatilList = 1;
  productDeatiltotalRecords: String;
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  // dtvCategory = [
  //   { label: "STB", value: "STB" },
  //   { label: "Card", value: "Card" },
  // ];
  // charges: any[] = [];
  productCatType: any[] = [];
  createView: boolean = false;
  listView: boolean = true;
  detailView: boolean = false;
  uomType: any[] = [];
  dtvCategory: any[] = [];
  timeUnitData = [
    { label: "Day", value: "Day" },
    { label: "Month", value: "Month" }
  ];

  inputTypeList = [
    { label: "Input", value: "Input" },
    { label: "List", value: "List" }
  ];
  ifDTVCateShow = false;
  isEditService: boolean = false;
  mandatoryList: any;
  mvnoId: number;
  myForm: FormGroup;
  showDelete: boolean = false;
  editedValue: string | null = null;
  isEditMode: boolean;
  searchOptionSelect = this.commondropdownService.productCategorySearchOption;
  searchProductCat: any = "";
  editAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  specificationListForm: FormGroup;
  showSpecificationListPopup: boolean = false;
  isFromList: boolean = false;
  currentIndexForEditList: any;
  specificationListArray = this.fb.array([]);
  specificationListData: any = [];
  isButtonDisabled: boolean;
  addValueSubmit: boolean = false;
  networkDeviceData: any = [];
  selectedTypes: any[] = [];
  isDeviceTypeVisible: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ProductCategoryManagementService: ProductCategoryManagementService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(INVENTORYS.PRODUCT_CATEGORY_CREATE);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.PRODUCT_CATEGORY_DELETE);
    this.editAccess = loginService.hasPermission(INVENTORYS.PRODUCT_CATEGORY_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    // this.editMode = !createAccess && editAccess ? true : false;
    this.specificationParametersDTOList = this.formBuilder.array([]);

    this.getAllProductType();
    // this.getAllUOMType();
    // this.getAllDTVCategory();
  }

  ngOnInit(): void {
    this.specificationParametersDTO = this.formBuilder.group({
      id: [""],
      inputType: ["", Validators.required],
      paramName: ["", Validators.required],
      isMandatory: [false]
    });
    this.productCategoryFormGroup = this.formBuilder.group({
      id: [""],
      name: ["", Validators.required],
      productId: [""],
      status: ["", Validators.required],
      type: ["", Validators.required],
      unit: ["", Validators.required],
      deviceType: [""],
      specificationParametersDTOList: this.formBuilder.array([]),
      hasMac: [false],
      hasSerial: [false],
      hasTrackable: [false],
      hasPort: [false],
      hasCas: [false],
      expiryTime: [""],
      expiryTimeUnit: [""],
      dtvCategory: [""]
    });

    this.specificationListForm = this.fb.group({
      value: ["", [Validators.minLength(1), Validators.maxLength(40)]]
    });
    this.specificationParametersDTO.get("isMandatory")?.valueChanges.subscribe(value => {
      this.isMandatory = value;
    });
    this.specificationParametersDTOList = this.productCategoryFormGroup.get(
      "specificationParametersDTOList"
    ) as FormArray;
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
    this.getProductList("");
  }

  createProductCategory() {
    this.specificationParametersDTOList.clear();
    this.productCategoryFormGroup.value.specificationParametersDTOList = [];
    this.productCategoryFormGroup.value.specificationParametersDTOList = "";
    this.showTable = this.productCategoryFormGroup.value.specificationParametersDTOList.length > 0;
    this.showSearchBar = false;
    this.editMode = false;
    this.listView = false;
    this.detailView = false;
    this.createView = true;
    this.submitted = false;
    this.productCategoryFormGroup.reset();
    this.productCategoryFormGroup.get("specificationParametersDTOList").reset([]);
    this.productCategoryFormGroup.reset();
    this.showDelete = true;
    this.isDeviceTypeVisible = false;
    this.productCategoryFormGroup.get("deviceType").clearValidators;
    this.productCategoryFormGroup.get("deviceType").updateValueAndValidity();
    this.specificationListArray = this.fb.array([]);
    this.getAllDTVCategory();
    this.commonGenericData();
    this.getAllProductType();
    this.getAllUOMType();
  }

  TotalItemPerPage(event): void {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageProductListdata > 1) {
      this.currentPageProductListdata = 1;
    }
    if (!this.searchkey) {
      this.getProductList(this.showItemPerPage);
    } else {
      this.searchProduct();
    }
  }

  TotalItemPerPageParameter(event: any): void {
    this.productDeatilItemPerPage = Number(event.value);
    this.productPageChargeDeatilList = 1;
    if (!this.searchkey) {
      this.getProductListt(this.productDeatilItemPerPage);
    } else {
      this.searchProduct();
    }
  }

  getProductListt(pageSize: number): void {
    this.productListData = [];
    this.searchkey = "";
    const page = this.currentPageProductListdata;
    const plandata = {
      page,
      pageSize
    };
    this.ProductCategoryManagementService.getAll(plandata).subscribe(
      (response: any) => {
        this.productListData = response.dataList;
        this.productListdatatotalRecords = response.totalRecords;
        this.showItemPerPage = pageSize;
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

  getProductList(list): void {
    this.productListData = [];
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
    this.ProductCategoryManagementService.getAll(plandata).subscribe(
      (response: any) => {
        this.productListData = response.dataList;
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

  deleteRaw(index: number) {
    this.showDelete = true;
    const parametersArray = this.productCategoryFormGroup.get(
      "specificationParametersDTOList"
    ) as FormArray;
    if (index >= 0 && index < parametersArray.length) {
      parametersArray.removeAt(index);
    }
    this.showTable = parametersArray.length > 0;
  }

  editRaw(item: any, index: number) {
    if (item.value.isEditing) {
      return;
    }
    item.patchValue({
      isEditing: true
    });
  }

  saveChanges(item: any) {
    if (item.invalid) {
      return;
    }
    item.patchValue({
      isEditing: false
    });
  }

  checkForDuplicates(paramName: string): void {
    if (paramName.trim() === "") {
      this.duplicateErrorMessage = "";
    } else if (this.isDuplicate(paramName)) {
      this.duplicateErrorMessage = "Duplicate Parameter found";
    } else {
      this.duplicateErrorMessage = "";
    }
  }

  saveParameter() {
    let paramName;
    let inputType = this.specificationParametersDTO.value.inputType;
    if (this.specificationParametersDTO.value.paramName)
      paramName = this.specificationParametersDTO.value.paramName.trim();
    if (inputType === "Input") {
      this.specificationParametersDTOList.push(
        this.formBuilder.group({
          paramName: paramName,
          isMandatory: this.specificationParametersDTO.value.isMandatory || false,
          isEditing: false,
          paramMultiValues: null,
          isMultiValueParam: false
        })
      );
      this.productCategoryFormGroup.updateValueAndValidity();
      this.specificationParametersDTO.reset();
      this.showTable = true;
      this.showDelete = true;
      this.paramName = "";
    } else {
      let listData = this.fb.array([]);

      this.specificationListData.forEach(data => {
        listData.push(
          this.formBuilder.group({
            value: data.value
          })
        );
      });
      this.specificationParametersDTOList.push(
        this.formBuilder.group({
          paramName: paramName,
          isMandatory: this.specificationParametersDTO.value.isMandatory || false,
          isEditing: false,
          isMultiValueParam: true,
          paramMultiValues: listData
        })
      );
      this.productCategoryFormGroup.updateValueAndValidity();
      this.specificationParametersDTO.reset();
      this.showTable = true;
      this.showDelete = true;
      this.paramName = "";
      this.isMandatory = false;
      this.specificationListData = [];
      this.specificationListArray = this.fb.array([]);
    }
  }

  isDuplicate(paramName: string): boolean {
    const trimmedParamName = paramName.trim();
    return this.specificationParametersDTOList.controls.some(
      control => control.get("paramName").value.trim() === trimmedParamName
    );
  }

  submit(): void {
    if (this.productCategoryFormGroup.valid) {
      if (this.editMode) {
        this.showDelete = false;
        this.ProductCategoryManagementService.update(this.mapObject()).subscribe(
          (res: any) => {
            if (res.responseCode === 406 || res.responseCode === 417) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            } else if (res.data.responseCode === 406 || res.data.responseCode == 417) {
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
              this.clearSearchProduct();
              this.editMode = false;
              this.submitted = false;
              this.checked = true;
              this.productCategoryFormGroup.reset();
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
        this.ProductCategoryManagementService.save(this.mapObject()).subscribe(
          (res: any) => {
            if (res.responseCode == 200) {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: res.responseMessage,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              this.checked = true;
              this.clearSearchProduct();
              this.productCategoryFormGroup.reset();
            }
            if (res.responseCode == 406 || res.responseCode == 417) {
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
    }
  }

  mapObject = () => {
    const productValues = this.productCategoryFormGroup.getRawValue();
    const product = {
      id: null,
      name: "",
      productId: "",
      unit: "",
      type: "",
      status: "",
      specificationParametersDTOList: "",
      hasMac: false,
      hasSerial: false,
      hasTrackable: false,
      hasPort: false,
      hasCas: false,
      expiryTime: "",
      expiryTimeUnit: "",
      dtvCategory: "",
      deviceType: ""
    };

    this.productCategoryFormGroup.value.specificationParametersDTOList =
      this.productCategoryFormGroup.value.specificationParametersDTOList.map(item => {
        if (item.isMultiValueParam) {
          return {
            ...item,
            paramMultiValues: item.paramMultiValues.map(innerItem => innerItem.value)
          };
        }
        return item;
      });

    product.id = productValues.id ? productValues.id : null;
    product.productId = productValues.productId;
    product.unit = productValues.unit;
    product.status = productValues.status;
    product.specificationParametersDTOList =
      this.productCategoryFormGroup.value.specificationParametersDTOList;
    product.name = productValues.name;
    product.hasMac = productValues.hasMac;
    product.hasSerial = productValues.hasSerial;
    product.hasTrackable = productValues.hasTrackable;
    product.hasPort = productValues.hasPort;
    product.hasCas = productValues.hasCas;
    product.expiryTime = productValues.expiryTime;
    product.expiryTimeUnit = productValues.expiryTimeUnit;
    product.dtvCategory = productValues.dtvCategory;
    product.deviceType = productValues.deviceType;
    if (!this.editMode) {
      if (productValues.type.length == 1) {
        if (productValues.type[0] == "CustomerBind") {
          productValues.type = "CustomerBind";
          product.type = productValues.type;
          return product;
        } else if (productValues.type[0] == "NetworkBind") {
          productValues.type = "NetworkBind";
          product.type = productValues.type;
          return product;
        } else if (productValues.type[0] == "NA") {
          productValues.type = "NA";
          product.type = productValues.type;
          return product;
        }
      } else if (productValues.type.length == 2) {
        if (
          (productValues.type[0] == "CustomerBind" && productValues.type[1] == "NetworkBind") ||
          (productValues.type[0] == "NetworkBind" && productValues.type[1] == "CustomerBind")
        ) {
          productValues.type = "CustomerBind, NetworkBind";
          product.type = productValues.type;
          return product;
        } else if (
          (productValues.type[0] == "NA" && productValues.type[1] == "NetworkBind") ||
          (productValues.type[0] == "NetworkBind" && productValues.type[1] == "NA")
        ) {
          productValues.type = "NA, NetworkBind";
          product.type = productValues.type;
          return product;
        } else if (
          (productValues.type[0] == "NA" && productValues.type[1] == "CustomerBind") ||
          (productValues.type[0] == "CustomerBind" && productValues.type[1] == "NA")
        ) {
          productValues.type = "CustomerBind, NA";
          product.type = productValues.type;
          return product;
        }
      } else if (productValues.type.length == 3) {
        productValues.type = "CustomerBind, NA, NetworkBind";
        product.type = productValues.type;
        return product;
      }
    } else {
      if (this.editMode) {
        product.type = productValues.type;
        return product;
      }
    }
  };

  onCheckboxChange(event: any) {
    this.productCategoryFormGroup.get("isMandatory")?.setValue(!!event);
  }

  editProduct(id): void {
    this.isEditMode = true;

    this.showDelete = false;
    this.showTable = true;
    this.editMode = true;
    this.createView = true;
    this.listView = false;
    this.detailView = false;
    this.getAllDTVCategory();
    this.commonGenericData();
    this.getAllProductType();
    this.getAllUOMType();
    const productEditData = this.productListData.find(element => element.id === id);
    if (productEditData.hasCas == true) {
      this.ifDTVCateShow = true;
    } else {
      this.ifDTVCateShow = false;
    }
    this.specificationParametersDTOList.clear();
    productEditData.specificationParametersDTOList.forEach((param: any) => {
      let listData = this.fb.array([]);
      if (param.isMultiValueParam) {
        param.paramMultiValues.forEach(data => {
          listData.push(
            this.formBuilder.group({
              value: data
            })
          );
        });
      } else {
        listData = null;
      }
      const newParameter = this.formBuilder.group({
        id: [param.id],
        paramName: [param.paramName, Validators.required],
        isMandatory: [param.isMandatory],
        isEditing: false,
        isNew: true,
        isMultiValueParam: [param.isMultiValueParam],
        paramMultiValues: listData
      });
      this.specificationParametersDTOList.push(newParameter);
    });
    let isPresent = productEditData.type.includes("NetworkBind");
    if (isPresent) {
      this.isDeviceTypeVisible = true;
    } else {
      this.isDeviceTypeVisible = false;
    }
    this.productCategoryFormGroup.patchValue({
      id: productEditData.id,
      name: productEditData.name,
      productId: productEditData.productId,
      unit: productEditData.unit,
      type: productEditData.type,
      status: productEditData.status,
      hasMac: productEditData.hasMac,
      hasSerial: productEditData.hasSerial,
      hasTrackable: productEditData.hasTrackable,
      hasPort: productEditData.hasPort,
      hasCas: productEditData.hasCas,
      dtvCategory: productEditData.dtvCategory,
      deviceType: productEditData.deviceType
    });
    this.productCategoryFormGroup.updateValueAndValidity();
  }

  searchProduct(): void {
    if (!this.searchkey || this.searchkey !== this.searchProductCatName) {
      this.currentPageProductListdata = 1;
    }
    this.searchkey = this.searchProductCatName;
    if (this.showItemPerPage) {
      this.productListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchProductCatName;
    this.searchData.filter[0].filterColumn = this.searchProductCat.trim();
    const page = {
      page: this.currentPageProductListdata,
      pageSize: this.productListdataitemsPerPage
    };
    this.ProductCategoryManagementService.searchProduct(page, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode === 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.productListData = [];
          this.productListdatatotalRecords = 0;
        } else {
          this.productListData = response.dataList;
          this.productListdatatotalRecords = response.totalRecords;
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

  clearSearchProduct(): void {
    this.showSearchBar = true;
    this.searchProductCatName = "";
    this.searchProductCat = "";
    this.editMode = false;
    this.submitted = false;
    this.createView = false;
    this.listView = true;
    this.detailView = false;
    // this.checked = true;
    this.searchkey = "";
    this.getProductList("");
    this.productCategoryFormGroup.reset();
    this.specificationParametersDTO.reset();
    this.ifDTVCateShow = false;
    // this.productCategoryFormGroup.controls.hasSerial.setValue(true);
    // this.checked = true;
  }

  deleteConfirmProduct(pcid: number): void {
    if (pcid) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Product Category?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteProduct(pcid);
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
    this.productCategoryFormGroup.reset();
  }

  getProductDetails(id) {
    const url = "/productCategory/" + id;
    this.ProductCategoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.viewProductCategoryDetails = res.data;
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
  pageChangedProductPlanMappingDetailList(pageNumber) {
    this.productPageChargeDeatilList = pageNumber;
  }
  ProductCategoryList() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }
  deleteProduct(pcid): void {
    const url = "/productCategory/delete/" + pcid;
    // const productEditData = this.productListData.find(element => element.id === pcid);
    this.ProductCategoryManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode === 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.getProductList("");
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
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedProductList(pageNumber): void {
    this.currentPageProductListdata = pageNumber;
    if (!this.searchkey) {
      this.getProductList("");
    } else {
      this.searchProduct();
    }
  }

  macAction(): void {
    this.productCategoryFormGroup.controls.hasSerial.setValue(
      this.productCategoryFormGroup.controls.hasMac.value
    );
    this.productCategoryFormGroup.controls.hasTrackable.setValue(
      this.productCategoryFormGroup.controls.hasMac.value
    );
  }

  serialAction(): void {
    this.productCategoryFormGroup.controls.hasTrackable.setValue(
      this.productCategoryFormGroup.controls.hasSerial.value
    );
  }

  getAllProductType(): void {
    // let url = "";
    const url = "/commonList/generic/PRODUCT_TYPE";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        // this.productListData = response.dataList;ad
        this.productCatType = response.dataList;
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
  getAllDTVCategory(): void {
    const url = "/commonList/generic/dtvCategory";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.dtvCategory = response.dataList;
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
  getAllUOMType(): void {
    // let url = "";
    const url = "/commonList/generic/UOM_TYPE";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        // this.productListData = response.dataList;ad
        this.uomType = response.dataList;
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

  canExit() {
    if (!this.productCategoryFormGroup.dirty) return true;
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
  checkHasCas(event) {
    if (event.checked == true) {
      this.ifDTVCateShow = true;
    }
    if (event.checked == false) {
      this.ifDTVCateShow = false;
      this.productCategoryFormGroup.controls["dtvCategory"].reset();
    }
  }

  onInputTypeChange(event: any) {
    this.specificationListData = [];
    if (event.value === "List") {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
      this.showSpecificationListPopup = false;
    }
  }

  openDialogOnClick() {
    this.openDialog();
    this.specificationListArray = this.fb.array([]);
  }

  openDialog() {
    this.showSpecificationListPopup = true;
  }

  addValue() {
    this.addValueSubmit = true;
    if (this.specificationListForm.valid) {
      this.specificationListArray.push(
        this.fb.group({
          value: this.specificationListForm.value.value,
          isEdit: false
        })
      );
      this.specificationListForm.reset();
    }
  }

  deleteValueFromArray(locationMapField: any, index: number) {
    this.specificationListArray.removeAt(index);
  }

  specificationListModelClose() {
    this.showSpecificationListPopup = false;
    this.specificationListForm.reset();
  }

  specificationModelClose() {
    this.showSpecificationListPopup = false;
    this.specificationListForm.reset();
    this.specificationListArray = this.fb.array([]);
  }

  saveSpecificationListData() {
    this.specificationListData = this.specificationListArray.value.map(value => ({
      value: value.value,
      isEdit: false
    }));
    this.showSpecificationListPopup = false;
  }

  showSpecificationListData() {
    this.showSpecificationListPopup = true;
  }

  particularSpecificationListView(item: any, index: any) {
    this.specificationListArray = this.fb.array([]);
    this.isFromList = true;
    this.currentIndexForEditList = index;
    this.showSpecificationListPopup = true;
    this.specificationParametersDTOList.value[index].paramMultiValues.forEach(data => {
      this.specificationListArray.push(
        this.fb.group({
          value: data.value,
          isEdit: true
        })
      );
    });
  }

  saveSpecificationListDataFromList() {
    this.isFromList = false;
    if (this.currentIndexForEditList || this.currentIndexForEditList == 0) {
      let listData = this.fb.array([]);
      this.specificationListArray.value.forEach(data => {
        listData.push(
          this.formBuilder.group({
            value: data.value,
            isEdit: false
          })
        );
      });

      this.specificationParametersDTOList.value[this.currentIndexForEditList].paramMultiValues =
        listData.value;
      this.specificationListArray = this.fb.array([]);
    }
    this.showSpecificationListPopup = false;
  }

  commonGenericData() {
    const url = "/commonList/generic/networkDeviceType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.networkDeviceData = response.dataList;
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

  typeChange(event: any) {
    let isPresent = this.selectedTypes.some(type => type === "NetworkBind");
    if (isPresent) {
      this.isDeviceTypeVisible = true;
      this.productCategoryFormGroup.get("deviceType").setValidators(Validators.required);
      this.productCategoryFormGroup.get("deviceType").updateValueAndValidity();
    } else {
      this.isDeviceTypeVisible = false;
      this.productCategoryFormGroup.get("deviceType").clearAsyncValidators();
      this.productCategoryFormGroup.get("deviceType").clearValidators;
      this.productCategoryFormGroup.get("deviceType").setValidators(null);
      this.productCategoryFormGroup.get("deviceType").updateValueAndValidity();
    }
  }
  selSearchOption(event: any) {
  this.searchProductCatName = null;
}
}
