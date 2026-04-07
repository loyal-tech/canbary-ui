import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { LoginService } from "src/app/service/login.service";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_ITEMS,
  pageLimitOptions
} from "src/app/RadiusUtils/RadiusConstants";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { ProductCategoryManagementService } from "src/app/service/product-category-management.service";
import { type } from "os";
import { Regex } from "src/app/constants/regex";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { INVENTORYS } from "src/app/constants/aclConstants";
import { saveAs as importedSaveAs } from "file-saver";

declare var $: any;
@Component({
  selector: "app-product-management",
  templateUrl: "./product-management.component.html",
  styleUrls: ["./product-management.component.css"]
})
export class ProductManagementComponent implements OnInit {
  productFormGroup: FormGroup;
  submitted = false;
  allVendor: any = [];
  countryListData: any;
  currentPageProductListdata = 1;
  productListdataitemsPerPage = PER_PAGE_ITEMS;
  productListdatatotalRecords: any;
  productListData: any[] = [];
  viewproductDeviceListData: any = [];
  searchData: any;
  searchProductName: any = "";
  // searchKey: string;
  AclClassConstants: any;
  AclConstants: any;
  showSpecification: boolean = false;
  pageLimitOptions = pageLimitOptions;
  showItemPerPage: any = 5;
  viewProductManagementDetails: any;
  searchkey: string;
  isproductDeviceEdit: boolean = false;
  ifSpliterInputShow = false;
  ifSpliterCASDropdownShow = false;
  taxFlag: boolean = false;
  editMode: boolean;
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  taxs: any[] = [];
  charges: any[] = [];
  productCatagorys: any = [];
  vendorId: any = [];
  casePacakeges: any = [];
  // timeUnitData = [
  //   { label: "Day", value: "Day" },
  //   { label: "Month", value: "Month" },
  // ];
  timeUnitData: any[] = [];
  public loginService: LoginService;
  listview: boolean = true;
  createView: boolean = false;
  warrentyError: boolean;
  // thresholdQtyError: boolean;
  //   UOM: "";
  newProductRefAmountInWarrantyError: boolean;
  newProductRefAmountPostWarrantyError: boolean;
  refurburshiedProductRefAmountInWarrantyError: boolean;
  refurburshiedProductRefAmountPostWarrantyError: boolean;
  detailView: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  specificationParametersDTOList: FormArray;
  specificationParametersDTO: FormGroup;
  selectedFileUploadPreview: File[] = [];
  selectedFile: any;
  uploadDocForm: FormGroup;
  isValidFile: boolean = true;
  existingFileName: any;
  today: string;
    actualpricenewProductError: boolean;
    actualpricerefurbishedProductError: boolean;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productManagementService: ProuctManagementService,
    loginService: LoginService,
    private productCatagoryService: ProductCategoryManagementService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(INVENTORYS.INVEN_PRODUCT_CREATE);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.INVEN_PRODUCT_DELETE);
    this.editAccess = loginService.hasPermission(INVENTORYS.INVEN_PRODUCT_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    // this.editMode = !createAccess && editAccess ? true : false;

    //    this.getAllCustomerDirectTypeCharge();
    this.specificationParametersDTOList = this.fb.array([]);
  }

  ngOnInit(): void {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split("T")[0];
    this.productFormGroup = this.fb.group({
      id: [""],
      name: ["", Validators.required],
      specificationParametersDTOList: this.specificationParametersDTOList,
      productId: [""],
      navLedgerId: [""],
      status: ["", Validators.required],
      productCategory: ["", Validators.required],
      availableInPorts: ["", Validators.required],
      availableOutPorts: ["", Validators.required],
      totalInPorts: ["", Validators.required],
      totalOutPorts: ["", Validators.required],
      vendorId: ["", Validators.required],
      licenseDate: [""],
      file: [""],
      fileSource: [""],
      description: ["", [Validators.required, Validators.pattern(Regex.characterlength255)]],
      //   thresholdQty: [""],
      actualpricenewProduct: [],
      newPrice: [""],
      newProductCharge: [""],
      newProductTax: [""],
      newProductRefAmountInWarranty: [
        "",
        [Validators.required, Validators.pattern(Regex.decimalNumber)]
      ],
      newProductRefAmountPostWarranty: [
        "",
        [Validators.required, Validators.pattern(Regex.decimalNumber)]
      ],
      refurburshiedPrice: [""],
      actualpricerefurbishedProduct: [""],
      refurburshiedProductCharge: [""],
      refurburshiedProductTax: [""],
      refurburshiedProductRefAmountInWarranty: [
        "",
        [Validators.required, Validators.pattern(Regex.decimalNumber)]
      ],
      refurburshiedProductRefAmountPostWarranty: [
        "",
        [Validators.required, Validators.pattern(Regex.decimalNumber)]
      ],
      expiryTime: ["", Validators.required],
      hasOEMConsider: [false],
      hasAssetConsider: [false],
      expiryTimeUnit: ["", Validators.required],
      caseId: [""]
      // refundAmount: [""],
    });

    this.specificationParametersDTO = this.fb.group({
      defaultValue: [""],
      paramValue: [""],
      id: [""],
      // identityKey: [""],
      isMandatory: [false],
      mvnoId: [""],
      paramName: [""],
      pcid: [""]
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

    this.getProductList("");
    this.productFormGroup.get("expiryTime").valueChanges.subscribe(val => {
      if (val < 0) {
        this.warrentyError = true;
      } else {
        this.warrentyError = false;
      }
    });
    // this.productFormGroup.get("thresholdQty").valueChanges.subscribe(val => {
    //   if (val <= 0 && val != null) {
    //     this.thresholdQtyError = true;
    //   } else {
    //     this.thresholdQtyError = false;
    //   }
    // });
    this.productFormGroup.get("newProductRefAmountInWarranty").valueChanges.subscribe(val => {
      if (val < 0) {
        this.newProductRefAmountInWarrantyError = true;
      } else {
        this.newProductRefAmountInWarrantyError = false;
      }
    });
     this.productFormGroup.get("actualpricenewProduct").valueChanges.subscribe(val => {
      if (val < 0) {
        this.actualpricenewProductError = true;
      } else {
        this.actualpricenewProductError = false;
      }
    });
    this.productFormGroup.get("actualpricerefurbishedProduct").valueChanges.subscribe(val => {
      if (val < 0) {
        this.actualpricerefurbishedProductError = true;
      } else {
        this.actualpricerefurbishedProductError = false;
      }
    });
    this.productFormGroup.get("newProductRefAmountPostWarranty").valueChanges.subscribe(val => {
      if (val < 0) {
        this.newProductRefAmountPostWarrantyError = true;
      } else {
        this.newProductRefAmountPostWarrantyError = false;
      }
    });
    this.productFormGroup
      .get("refurburshiedProductRefAmountInWarranty")
      .valueChanges.subscribe(val => {
        if (val < 0) {
          this.refurburshiedProductRefAmountInWarrantyError = true;
        } else {
          this.refurburshiedProductRefAmountInWarrantyError = false;
        }
      });
    this.productFormGroup
      .get("refurburshiedProductRefAmountPostWarranty")
      .valueChanges.subscribe(val => {
        if (val < 0) {
          this.refurburshiedProductRefAmountPostWarrantyError = true;
        } else {
          this.refurburshiedProductRefAmountPostWarrantyError = false;
        }
      });
    this.productFormGroup.get("file")?.valueChanges.subscribe(file => {
      if (file) {
        this.productFormGroup.get("licenseDate")?.enable();
      } else {
        this.productFormGroup.get("licenseDate")?.disable();
      }
    });
  }

  createProduct() {
    this.specificationParametersDTOList = this.fb.array([]);
    this.editMode = false;
    this.listview = false;
    this.createView = true;
    this.submitted = false;
    // this.UOM = "";
    this.productFormGroup.reset();
    this.taxFlag = false;
    this.ifSpliterCASDropdownShow = false;
    this.ifSpliterInputShow = false;
    this.detailView = false;
    this.showSpecification = false;
    this.getTaxDataList();
    this.getAllProductCategory();
    this.getAllCASPackage();
    this.getAllWarrantyTimeUnit();
    this.getAllVendor();
    this.selectedFileUploadPreview = null;
  }

  getProductManagementDetails(id) {
    const url = "/product/" + id;
    this.productManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.viewProductManagementDetails = res.data;
        this.listview = false;
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

  optionProductCategoryParameter() {
    // this.specificationParametersDTOList.reset;
    const productCategoryId = this.productFormGroup.value.productCategory;
    const url =
      "/specificationParameters/getSpecificParametersByProductCategoryId?product_category_id=" +
      productCategoryId;
    this.productCatagoryService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.specificationParametersDTOList = this.fb.array([]);
          response.dataList.forEach(element => {
            let newArray;
            let listData = this.fb.array([]);
            if (element.paramMultiValues && element.paramMultiValues.length > 0) {
              //   newArray = element.paramValues
              //     .split(",")
              //     .map(value => ({ label: +value, value: +value }));

              element.paramMultiValues.forEach(data => {
                listData.push(
                  this.fb.group({
                    value: data,
                    label: data
                  })
                );
              });
            }

            let defaultParamValue = this.fb.control(element.defaultValue);

            if (element.isMandatory) {
              defaultParamValue.setValidators([Validators.required]);
            } else {
              defaultParamValue.clearValidators();
            }
            defaultParamValue.setValidators([Validators.minLength(1), Validators.maxLength(40)]);
            defaultParamValue.updateValueAndValidity();

            this.specificationParametersDTOList.push(
              this.fb.group({
                defaultValue: defaultParamValue,
                paramValue: null,
                // paramValue: [element.paramValue, element.isMandatory ? Validators.required : null],
                id: [element.id],
                // identityKey: [element.identityKey],
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

  ProductManagementList() {
    this.listview = true;
    this.createView = false;
    this.detailView = false;
  }
  productListView() {
    this.specificationParametersDTOList = this.fb.array([]);
    this.listview = true;
    this.detailView = false;
    this.createView = false;
    this.searchProductName = "";
    this.searchkey = "";
    this.taxFlag = false;
    this.ifSpliterCASDropdownShow = false;
    this.ifSpliterInputShow = false;
    this.getProductList("");
    this.productFormGroup.reset();
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
      // filters:filter
    };
    this.productManagementService.getAll(plandata).subscribe(
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

  submit(): void {
    this.submitted = true;
    if (this.productFormGroup.valid) {
      if (this.editMode) {
        const productValues = this.mapObject();
        let formData = new FormData();
        let newFormData = Object.assign({}, this.productFormGroup.value);
        formData.append("file", newFormData.fileSource);
        formData.append("productDetailList", JSON.stringify(productValues));
        this.productManagementService.update(formData).subscribe(
          (res: any) => {
            if (res.responseCode === 406 || res.responseCode === 417) {
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
              this.productListView();
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
        const productValues = this.mapObject();
        let formData = new FormData();
        let newFormData = Object.assign({}, this.productFormGroup.value);
        formData.append("file", newFormData.fileSource);
        formData.append("productDetailList", JSON.stringify(productValues));
        this.productManagementService.save(formData).subscribe(
          (res: any) => {
            if (res.responseCode === 406 || res.responseCode === 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: res.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              this.clearSearchProduct();
              this.productListView();
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
    const productValues = this.productFormGroup.getRawValue();

    const product = {
      id: null,
      name: "",
      productId: "",
      navLedgerId: "",
      unit: "",
      description: "",
      //   thresholdQty: "",
      productCategory: "",
      status: "",
      // hasMac: false,
      // hasSerial: false,
      newPrice: "",
      actualpricenewProduct: "",
      actualpricerefurbishedProduct: "",
      newProductCharge: "",
      newProductTax: "",
      newProductRefAmountInWarranty: "",
      newProductRefAmountPostWarranty: "",
      refurburshiedPrice: "",
      refurburshiedProductCharge: "",
      refurburshiedProductTax: "",
      refurburshiedProductRefAmountInWarranty: "",
      refurburshiedProductRefAmountPostWarranty: "",
      expiryTime: "",
      hasOEMConsider: this.productFormGroup.value.hasOEMConsider || false,
      hasAssetConsider: this.productFormGroup.value.hasAssetConsider || false,
      expiryTimeUnit: "",
      //refundAmount: "",
      totalInPorts: "",
      totalOutPorts: "",
      availableInPorts: "",
      availableOutPorts: "",
      caseId: "",
      vendorId: "",
      filename: "",
      licenseDate: "",
      specificationParametersDTOList: ""
      // isDeleted:''
    };
    product.id = productValues.id ? productValues.id : null;
    product.productId = productValues.productId;
    product.navLedgerId = productValues.navLedgerId;
    product.unit = productValues.unit;
    product.description = productValues.description;
    // product.thresholdQty = productValues.thresholdQty;
    product.status = productValues.status;
    product.name = productValues.name;
    product.productCategory = productValues.productCategory;
    product.vendorId = productValues.vendorId;
    // product.hasMac = productValues.hasMac;
    // product.hasSerial = productValues.hasSerial;
    product.expiryTime = productValues.expiryTime;
    product.hasOEMConsider = this.productFormGroup.value.hasOEMConsider || false;
    product.expiryTimeUnit = productValues.expiryTimeUnit;
    product.newPrice = productValues.newPrice;
    product.actualpricenewProduct = productValues.actualpricenewProduct;
    product.actualpricerefurbishedProduct = productValues.actualpricerefurbishedProduct;
    product.newProductCharge = productValues.newProductCharge;
    product.newProductTax = productValues.newProductTax;
    product.newProductRefAmountInWarranty = productValues.newProductRefAmountInWarranty;
    product.newProductRefAmountPostWarranty = productValues.newProductRefAmountPostWarranty;
    product.refurburshiedPrice = productValues.refurburshiedPrice;
    product.refurburshiedProductCharge = productValues.refurburshiedProductCharge;
    product.refurburshiedProductTax = productValues.refurburshiedProductTax;
    product.refurburshiedProductRefAmountInWarranty =
      productValues.refurburshiedProductRefAmountInWarranty;
    product.refurburshiedProductRefAmountPostWarranty =
      productValues.refurburshiedProductRefAmountPostWarranty;
    product.totalInPorts = productValues.totalInPorts;
    product.totalOutPorts = productValues.totalOutPorts;
    product.availableInPorts = productValues.availableInPorts;
    product.availableOutPorts = productValues.availableOutPorts;
    product.caseId = productValues.caseId;
    product.filename = productValues.file?.split("\\").pop();
    product.licenseDate = productValues.licenseDate;
    product.specificationParametersDTOList = this.specificationParametersDTOList.value.map(
      ({ paramValues, ...rest }) => rest
    );
    // product.productCategory.name= productValues.productCategory.name
    return product;
  };

  editProduct(id): void {
    this.showSpecification = true;
    this.createProduct();

    this.editMode = true;
    const productEditData = this.productListData.find(element => element.id === id);
    // this.UOM = productEditData.productCategory.unit;
    this.ifSpliterInputShow = productEditData.productCategory.type == "NA" ? false : true;
    this.ifSpliterCASDropdownShow = productEditData.productCategory.type == "NA" ? false : true;
    this.productFormGroup.patchValue({
      id: productEditData.id,
      name: productEditData.name,
      productId: productEditData.productId,
      navLedgerId: productEditData.navLedgerId,
      // unit: productEditData.unit,
      productCategory: productEditData.productCategory.id,
      description: productEditData.description,
      //   thresholdQty: productEditData.thresholdQty,
      status: productEditData.status,
      vendorId: productEditData.vendorId,
      // hasMac: productEditData.hasMac,
      // hasSerial: productEditData.hasSerial,
      expiryTime: productEditData.expiryTime,
      hasOEMConsider: productEditData.hasOEMConsider,
      hasAssetConsider: productEditData.hasAssetConsider,
      expiryTimeUnit: productEditData.expiryTimeUnit,
      newPrice: productEditData.newPrice,
      actualpricenewProduct: productEditData.actualpricenewProduct,
      newProductCharge: productEditData.newProductCharge,
      newProductTax: productEditData.newProductTax,
      newProductRefAmountInWarranty: Number(productEditData.newProductRefAmountInWarranty),
      newProductRefAmountPostWarranty: Number(productEditData.newProductRefAmountPostWarranty),
      refurburshiedPrice: productEditData.refurburshiedPrice,
      actualpricerefurbishedProduct: productEditData.actualpricerefurbishedProduct,
      refurburshiedProductTax: productEditData.refurburshiedProductTax,
      refurburshiedProductCharge: productEditData.refurburshiedProductCharge,
      refurburshiedProductRefAmountInWarranty: Number(
        productEditData.refurburshiedProductRefAmountInWarranty
      ),
      refurburshiedProductRefAmountPostWarranty: Number(
        productEditData.refurburshiedProductRefAmountPostWarranty
      ),
      totalInPorts: productEditData.totalInPorts,
      totalOutPorts: productEditData.totalOutPorts,
      availableInPorts: productEditData.availableInPorts,
      availableOutPorts: productEditData.availableOutPorts,
      caseId: productEditData.caseId,
      filename: productEditData?.filename,
      file: productEditData?.file,
      licenseDate: productEditData.licenseDate
    });

    this.existingFileName = productEditData.filename;
    this.productFormGroup.patchValue({ file: this.existingFileName });
    if (productEditData.totalInPorts < 0) {
      this.ifSpliterInputShow = false;
    }
    if (productEditData.totalOutPorts < 0) {
      this.ifSpliterInputShow = false;
    }
    if (productEditData.availableInPorts < 0) {
      this.ifSpliterInputShow = false;
    }
    if (productEditData.availableInPorts < 0) {
      this.ifSpliterInputShow = false;
    }
    if (productEditData.caseId == null) {
      this.ifSpliterCASDropdownShow = false;
    }

    this.specificationParametersDTOList = this.fb.array([]);
    productEditData.specificationParametersDTOList?.forEach(element => {
      let newArray;
      let listData = this.fb.array([]);
      if (element.paramValues) {
        //   newArray = element.paramValues
        //     .split(",")
        //     .map(value => ({ label: +value, value: +value }));

        element.paramMultiValues.forEach(data => {
          listData.push(
            this.fb.group({
              value: data,
              label: data
            })
          );
        });
      }

      this.specificationParametersDTOList.push(
        this.fb.group({
          defaultValue: [element.paramValue ? element.paramValue : element.defaultValue],
          paramValue: [element.paramValue],
          // paramValue: [element.paramValue, element.isMandatory ? Validators.required : null],
          id: [element.id],
          // identityKey: [element.identityKey],
          isMandatory: [element.isMandatory],
          mvnoId: [element.mvnoId],
          paramName: [element.paramName],
          pcid: [element.pcid],
          isMultiValueParam: [element.isMultiValueParam],
          paramValues: listData
        })
      );
      this.showSpecification = this.specificationParametersDTOList.value.length > 0;
    });
  }

  searchProduct(): void {
    if (!this.searchkey || this.searchkey !== this.searchProductName) {
      this.currentPageProductListdata = 1;
    }
    this.searchkey = this.searchProductName;
    if (this.showItemPerPage) {
      this.productListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchProductName.trim();
    const page = {
      page: this.currentPageProductListdata,
      pageSize: this.productListdataitemsPerPage
    };
    this.productManagementService.searchProduct(page, this.searchData).subscribe(
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
  editproductDevice(productDeviceId: any) {
    if (productDeviceId) {
      const url = "/product/" + productDeviceId;
      this.productManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isproductDeviceEdit = true;
          this.viewproductDeviceListData = response.data;

          this.productFormGroup.patchValue(this.viewproductDeviceListData);

          let serviceAreaId = [];
          for (let k = 0; k < this.viewproductDeviceListData.serviceAreaNameList.length; k++) {
            serviceAreaId.push(this.viewproductDeviceListData.serviceAreaNameList[k].id);
          }
          this.productFormGroup.patchValue({
            serviceAreaIdsList: serviceAreaId
          });

          //   if (
          //     this.viewproductDeviceListData.devicetype == "Splitter" ||
          //     this.viewproductDeviceListData.devicetype === "ONU"
          //   ) {
          //     this.ifSpliterInputShow = true;
          //   } else {
          //     this.ifSpliterInputShow = false;
          //   }
          //
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

  clearSearchProduct(): void {
    this.searchProductName = "";
    this.editMode = false;
    this.submitted = false;
    this.searchkey = "";
    this.getProductList("");
    // this.getAllProductCategory();
    // this.getAllCASPackage();
    this.ifSpliterCASDropdownShow = false;
    this.ifSpliterInputShow = false;
    this.taxFlag = false;
    this.productFormGroup.reset();
    this.specificationParametersDTOList = this.fb.array([]);
  }

  deleteConfirmProduct(pid: number): void {
    if (pid) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Product?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteProduct(pid);
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

  deleteProduct(pid): void {
    const url = "/product/delete/" + pid;
    this.productManagementService.deleteMethod(url).subscribe(
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
    this.productFormGroup.controls.hasSerial.setValue(this.productFormGroup.controls.hasMac.value);
    // console.log("called")
  }

  getAllCustomerDirectTypeCharge(): void {
    // let url = "";
    const url = "/product/getAllChargeType/CUSTOMER_DIRECT";
    this.productManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.charges = response.dataList;
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

  getTaxDataList() {
    const url = "/taxes/all" + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.taxs = response.taxlist;
        // console.log(' this.taxListData', this.taxListData)
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  onKeyTotalInPort(e: any) {
    if (this.productFormGroup.value.totalInPorts >= 0) {
      this.productFormGroup.patchValue({
        availableInPorts: this.productFormGroup.value.totalInPorts
      });
    }
  }
  onKeyTotalOutPort(e: any) {
    if (this.productFormGroup.value.totalOutPorts >= 0) {
      this.productFormGroup.patchValue({
        availableOutPorts: this.productFormGroup.value.totalOutPorts
      });
    }
  }

  productDeviceTypeEvent(event) {
    let Id = event.value;
    let selectCatagoryData = this.productCatagorys.filter(data => data.id == Id);
    const pcId = event.value;
    // this.UOM = selectCatagoryData.find(element => element.id == pcId).unit;
    if (selectCatagoryData.length !== 0) {
      if (selectCatagoryData[0].type != "NA" && selectCatagoryData[0].hasPort == true) {
        this.ifSpliterInputShow = true;
        this.productFormGroup.get("availableInPorts").patchValue("");
        this.productFormGroup.get("availableOutPorts").patchValue("");
        this.productFormGroup.get("totalInPorts").patchValue("");
        this.productFormGroup.get("totalOutPorts").patchValue("");
      } else {
        this.ifSpliterInputShow = false;
        this.productFormGroup.get("availableInPorts").patchValue(-1);
        this.productFormGroup.get("availableOutPorts").patchValue(-1);
        this.productFormGroup.get("totalInPorts").patchValue(-1);
        this.productFormGroup.get("totalOutPorts").patchValue(-1);
      }
      if (selectCatagoryData[0].hasCas == true) {
        this.ifSpliterCASDropdownShow = true;
      } else {
        this.ifSpliterCASDropdownShow = false;
      }
      this.optionProductCategoryParameter();
      // if (
      //   selectCatagoryData[0].type == "CustomerBind" ||
      //   selectCatagoryData[0].type == "CustomerBind, NetworkBind"
      // ) {
      //   this.taxFlag = true;
      // } else {
      //   this.taxFlag = false;
      //   this.productFormGroup.get("newProductCharge").reset();
      //   this.productFormGroup.get("refurburshiedProductCharge").reset();
      // }
    }
  }

  getAllProductCategory(): void {
    // let url = "";
    const url = "/productCategory/getAllActiveProductCategories";
    this.productCatagoryService.getMethod(url).subscribe(
      (response: any) => {
        this.productCatagorys = response.dataList;
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
    if (!this.productFormGroup.dirty) return true;
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

  getAllCASPackage(): void {
    // let url = "";
    const url = "/casepackage/all?mvnoId=" + localStorage.getItem("mvnoId");
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.casePacakeges = response.dataList;
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
  refundAmountValidation(input) {
    var num = String.fromCharCode(input.which);
    if (!/^\d*\.?\d{0,2}$/g.test(num)) {
      input.preventDefault();
    }
  }

  priceValidation(input) {
    var num = String.fromCharCode(input.which);
    if (!/^\d*\.?\d{0,2}$/g.test(num)) {
      input.preventDefault();
    }
  }

  warrantyTimeValidation(event: any) {
  const input = event.target.value;
  if (input.length >= 5) {
    event.preventDefault();
    return;
  }

  const num = String.fromCharCode(event.which);
  if (!/[0-9]/.test(num)) {
    event.preventDefault();
  }
}

  getAllVendor(): void {
    // let url = "";
    const url = "/vendor/findAll";
    this.productCatagoryService.getMethod(url).subscribe(
      (response: any) => {
        this.allVendor = response.dataList;
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
  getAllWarrantyTimeUnit(): void {
    const url = "/commonList/generic/warrantyTimeUnit";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.timeUnitData = response.dataList;
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

  onFileChangeUpload(event: any): void {
    this.selectedFileUploadPreview = [];
    if (event.target.files.length > 0) {
      const files: FileList = event.target.files;
      this.isValidFile = true;

      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);

        if (file) {
          const fileType = file.type;
          const filename = file.name.toLowerCase();
          const validTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
          const validExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

          const isFileValid =
            (fileType === "" && validExtensions.some(ext => filename.endsWith(ext))) ||
            validTypes.includes(fileType);

          if (!isFileValid) {
            this.isValidFile = false;
            this.messageService.add({
              severity: "info",
              summary: "Invalid File Type.",
              detail: "Only PNG, JPG, JPEG, and PDF files are allowed.",
              icon: "far fa-times-circle"
            });
            break;
          }
          this.selectedFileUploadPreview.push(file);
        }
      }

      if (this.isValidFile) {
        const fileData = event.target.files[0];
        this.productFormGroup.patchValue({
          fileSource: fileData
        });

        this.productFormGroup.controls.file.setErrors(null);
        this.productFormGroup.get("licenseDate").setValidators(Validators.required);
        this.productFormGroup.get("licenseDate").updateValueAndValidity();
        this.productFormGroup.get("licenseDate").enable();
      } else {
        this.productFormGroup.controls.file.reset();
        this.productFormGroup.controls.file.setErrors({ fileInvalid: true });
        this.productFormGroup.get("licenseDate").clearValidators();
        this.productFormGroup.get("licenseDate").updateValueAndValidity();
        this.productFormGroup.get("licenseDate").reset();
        this.productFormGroup.get("licenseDate").disable();
      }
    } else {
      this.productFormGroup.get("licenseDate").clearValidators();
      this.productFormGroup.get("licenseDate").updateValueAndValidity();
      this.productFormGroup.get("licenseDate").reset();
      this.productFormGroup.get("licenseDate").disable();
    }
  }

  onDateChanged(event: any) {
    if (event.target.value) {
      this.productFormGroup.get("file").setValidators(Validators.required);
      this.productFormGroup.get("file").updateValueAndValidity();
    } else {
      this.productFormGroup.get("file").clearValidators();
      this.productFormGroup.get("file").updateValueAndValidity();
    }
  }

  downloadDoc(fileName, productId) {
    this.productCatagoryService.downloadFile(productId).subscribe(blob => {
      importedSaveAs(blob, fileName);
    });
  }
}
