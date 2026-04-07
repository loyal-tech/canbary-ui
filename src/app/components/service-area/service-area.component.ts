import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { Regex } from "src/app/constants/regex";
import { serviceArea, PolyGon } from "src/app/components/model/serviceArea";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Data } from "@angular/router";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { InwardService } from "src/app/service/inward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
declare var $: any;
import {
  COUNTRY,
  CITY,
  STATE,
  PINCODE,
  AREA,
  REGEX,
  LOCATION
} from "src/app/RadiusUtils/RadiusConstants";
import { Observable, Observer } from "rxjs";
import { CityManagementService } from "src/app/service/city-management.service";
import { PincodeManagementService } from "src/app/service/pincode-management.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
import * as FileSaver from "file-saver";
import { LocationService } from "src/app/service/location.service";
import { StaffService } from "src/app/service/staff.service";

declare const google: any;

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable?: boolean;
  visible?: boolean;
  opacity?: number;
}

@Component({
  selector: "app-service-area",
  templateUrl: "./service-area.component.html",
  styleUrls: ["./service-area.component.css"]
})
export class ServiceAreaComponent implements OnInit {
  regex = REGEX;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  locationTitle = LOCATION;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  pincodeOptions: any[] = [];
  locationOptions: any[] = [];
  @ViewChild("closebutton") closebutton;
  serviceAreaGroupForm: FormGroup;
  inventoryAssignForm: FormGroup;
  serviceAreaCategoryList: any;
  submitted: boolean = false;
  taxListData: any;
  createserviceAreaData: serviceArea;
  currentPageserviceAreaListdata = 1;
  serviceAreaListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  serviceAreaListdatatotalRecords: any;
  serviceAreaListData: any = [];
  viewserviceAreaListData: any = [];
  isserviceAreaEdit: boolean = false;
  serviceAreatype = "";
  serviceAreacategory = "";
  searchserviceAreaUrl: any;
  serviceData: any;
  qosPolicyData: any;
  quotaData: any;
  quotaTypeData: any;
  areaNameCategoryList: any;
  isPlanEdit: boolean = false;
  viewPlanListData: any;
  areaIdFromArray: FormArray;
  areaNameitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  areaNametotalRecords: String;
  currentPageareaName = 1;
  selectvalue = "";
  id: any;
  temp = [];
  serviceAreaListData1: any;
  serviceAreaListDataselector: any;
  serviceAreaRulelength = 0;
  searchData: any;
  searchObject: any;
  searchName: any = "";
  searchAddressType: any = "";
  searchCountryName: any = "";
  searchLocationForm: FormGroup;
  currentPagesearchLocationList = 1;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: String;
  ifsearchLocationModal = false;
  searchLocationData: any;
  iflocationFill = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  totalAreaListLength = 0;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  statusOptions = [
    { label: "Active", value: "Y", val: "ACTIVE" },
    { label: "Inactive", value: "N", val: "INACTIVE" },
    { label: "UnderDevelopment", value: "U", val: "UNDERDEVELOPMENT" }
  ];
  AclClassConstants;
  AclConstants;
  areaListData: any;
  public loginService: LoginService;
  pincodeListData: any;
  loginuser: any;
  cityListData: any;
  siteNameListData: any;
  listView: boolean = true;
  createView: boolean = true;
  customerrMyInventoryView: boolean = false;
  assignInventory: boolean;
  assignInventoryModal: boolean;
  serviceAreaId: any;
  macList: any[] = [];
  showQtySelectionError: boolean;
  showQtyError: boolean;
  assignedInventoryList = [];
  customerInventoryListDataCurrentPage = 1;
  customerInventoryListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  assignInventoryWithSerial: boolean;
  customerInventoryListDataTotalRecords: number;
  inventoryStatusDetailsForReplace = [];
  customerInventoryMappingId: any;
  customerInventoryMappingIdForReplace: any;
  inventoryStatusDetails = [];
  inventoryStatusView = false;
  private assignInventoryCustomerId: any;
  assignedInventoryListWithSerial = [];
  customerInventoryDetailsListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerInventoryDetailsListDataCurrentPage = 1;
  customerInventoryDetailsListDataTotalRecords: number;
  rejectInventoryData = [];
  approveInventoryData = [];
  availableQty: number;
  productHasMac: boolean;
  productHasSerial: boolean;
  viewAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  inventoryAccess: boolean = false;
  polygonCreateAccess: boolean = false;
  polygonEditAccess: boolean = false;
  polygonDeleteAccess: boolean = false;
  polygonViewAccess: boolean = false;
  selectedMACAddress = [];
  inwardList: any[];
  assignInwardID: any;
  assignInwardForm: FormGroup;
  rejectInwardForm: FormGroup;
  assignInwardSubmitted: boolean = false;
  rejectInwardSubmitted: boolean = false;
  products = [];
  replaceProducts = [];
  unit: any;
  approveId: any;
  inwardId: any;
  userId: number = +localStorage.getItem("userId");
  MastertotalRecordsI: String;
  approved = false;
  reject = false;
  selectStaffReject: any;
  selectStaff: any;
  private oldMacMappingId: any;
  currentPageMasterSlabI = 1;
  MasteritemsPerPageI = RadiusConstants.ITEMS_PER_PAGE;
  workflowAuditDataI: any = [];
  AllcustApproveList: any = [];
  custChangeStatusConfigitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPagecustChangeStatusConfig = 1;
  custChangeStatusConfigtotalRecords: String;
  changeStatusShowItemPerPage = 1;
  customerId = 9616;
  showReplacementForm = false;
  pincodeDetail: any;
  locationDetail: any;
  locationDetails: any;
  areaInputview: boolean = false;
  inventoryServiceAreaData: any = "";
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  inventoryType: any = "Service Area";
  isMapModelEnable: boolean = false;
  isAllPolygoneModelShow: boolean = false;

  lat = 23.16774596751141;
  lng = 72.39140613721185;
  zoom = 7;
  location: string = "";

  devicesLocations: any = [];

  drawingManager: any;
  mArea: any;
  isClearShow: boolean = false;
  drawnPolygonLatLongList: any[] = [];
  map: any;
  polygonMap: google.maps.Polygon;
  markers: marker[] = [];
  uploadDocForm: FormGroup;
  selectedFileUploadPreview: File[] = [];
  selectedFile: any;
  isBuldUpload: boolean = false;
  serviceAreaType = [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" }
  ];
  isSiteNameAvailable: boolean = false;
  isUploadView: boolean = false;
  loggedInUserMvnoId: number;
  ispListData: any[] = [];
  isViewServiceArea: boolean = false;
  items: any[];
  locationDataByPlan: any = [];
  bulkAssign: boolean = false;
  staffAllData: any = [];
  planAllData: any = [];
  bulkAssignForm: FormGroup;
  bulkSAStaffList: any = [];
  polygonList: any[] = [];
  showPolygonNameDialog: boolean = false;
  polygonNameForm: FormGroup;
  currentPolygonCoordinates: any[] = [];
  assignCustomerInventoryModal = false;
  rejectCustomerInventoryModal = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private serviceAreaService: ServiceAreaService,
    loginService: LoginService,
    private customerInventoryMappingService: CustomerInventoryMappingService,
    private inwardService: InwardService,
    private productService: ProuctManagementService,
    private customerManagementService: CustomermanagementService,
    private citymanagementService: CityManagementService,
    private pincodemanagementService: PincodeManagementService,
    private locationService: LocationService,
    private staffService: StaffService
  ) {
    this.viewAccess = loginService.hasPermission(MASTERS.SERVICE_AREA);
    this.createAccess = loginService.hasPermission(MASTERS.SERVICE_AREA_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.SERVICE_AREA_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.SERVICE_AREA_EDIT);
    this.inventoryAccess = loginService.hasPermission(MASTERS.SERVICE_AREA_INVENTORY);
    this.polygonViewAccess = loginService.hasPermission(MASTERS.POLYGON);
    this.polygonCreateAccess = loginService.hasPermission(MASTERS.POLYGON_CREATE);
    this.polygonEditAccess = loginService.hasPermission(MASTERS.POLYGON_EDIT);
    this.polygonDeleteAccess = loginService.hasPermission(MASTERS.POLYGON_DELETE);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isserviceAreaEdit = !this.createAccess && this.editAccess ? true : false;
    this.availableQty = 0;
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["", [Validators.required, Validators.pattern(Regex.numeric), Validators.min(0)]],
      productId: ["", Validators.required],
      ownerId: [this.id],
      ownertype: ["Service Area"],
      // customerId: [this.serviceAreaId],
      staffId: [""],
      inwardId: ["", Validators.required],
      assignedDateTime: [new Date(), Validators.required],
      status: ["", Validators.required],
      mvnoId: [""]
    });
    this.polygonNameForm = this.fb.group({
      name: ["", Validators.required]
    });

    this.serviceAreaGroupForm = this.fb.group(
      {
        id: [""],
        selectedPincodes: [null],
        name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
        pincodes: ["", Validators.required],
        createdById: [""],
        siteName: ["", Validators.required],
        lastModifiedById: [""],
        status: ["", Validators.required],
        isDeleted: [0],
        latitude: [""],
        longitude: [""],
        radius: [""],
        areaid: [""],
        cityid: ["", Validators.required],
        serviceAreaType: [""],
        blockNo: [""],
        mvnoIds: [[]],
        locationIds: [[]]
      },
      { validator: this.customValidator }
    );

    this.items = [
      {
        label: "CSV",
        command: () => {
          this.downloadCsv();
        }
      },
      {
        label: "KML",
        command: () => {
          this.downloadKML();
        }
      }
    ];
  }

  customValidator(formGroup: FormGroup) {
    const latitude = formGroup.get("latitude");
    const longitude = formGroup.get("longitude");
    const radius = formGroup.get("radius");

    if (latitude.value || longitude.value || radius.value) {
      if (!latitude.value) {
        latitude.setErrors({ required: true });
      }
      if (!longitude.value) {
        longitude.setErrors({ required: true });
      }
    } else {
      latitude.setErrors(null);
      longitude.setErrors(null);
    }
  }

  ngOnInit(): void {
    // this.serviceAreaGroupForm = this.fb.group({
    //   id: [""],
    //   selectedPincodes: [null],
    //   name: ["", Validators.required],
    //   pincodes: ["", Validators.required],
    //   createdById: [""],
    //   lastModifiedById: [""],
    //   status: ["", Validators.required],
    //   isDeleted: [0],
    //   latitude: [""],
    //   longitude: [""],
    //   radius: [""],
    //   areaid: [""],
    //   cityid: ["", Validators.required],
    // });
    this.loggedInUserMvnoId = parseInt(localStorage.getItem("mvnoId"));
    this.productService.getAllNBAndNAProducts().subscribe((res: any) => {
      this.products = res.dataList;
    });
    this.assignInwardForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectInwardForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.inventoryAssignForm.get("qty").valueChanges.subscribe(val => {
      const total = this.availableQty - val;
      if (total < 0) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }

      if (this.productHasMac == true && this.selectedMACAddress.length > val) {
        this.showQtySelectionError = true;
      } else {
        this.showQtySelectionError = false;
      }
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

    this.searchObject = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };
    // this.getAreaList();
    this.getserviceAreaList("");
    this.getPincodeList();
    this.getCityList();
    this.getSiteNameList();

    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });
    this.uploadDocForm = this.fb.group({
      file: ["", Validators.required]
    });
    // this.inventoryAssignForm.get("qty").valueChanges.subscribe(val => {
    //   const total = this.availableQty - val;
    //   if (total < 0) {
    //     this.showQtyError = true;
    //   } else {
    //     this.showQtyError = false;
    //   }

    //   if (this.productHasMac == true && this.selectedMACAddress.length > val) {
    //     this.showQtySelectionError = true;
    //   } else {
    //     this.showQtySelectionError = false;
    //   }
    // });
    if (this.loggedInUserMvnoId === 1) {
      this.getISPList();
    }
    this.bulkAssignForm = this.fb.group({
      staffId: ["", Validators.required],
      planId: ["", Validators.required]
    });
    this.getAllLocation();
  }

  selectActionChange(_event: any) {
    // this.commonservice.addLoader();

    this.selectvalue = _event.value;
  }

  savePolygonName() {
    if (this.polygonNameForm.valid) {
      const coordsWithName = this.currentPolygonCoordinates.map(coord => ({
        ...coord,
        polygoneName: this.polygonNameForm.value.name
      }));
      this.polygonList.push(...coordsWithName);
      this.polygonList = this.flattenPolygonList(this.polygonList);
      this.polygonNameForm.reset();
      this.showPolygonNameDialog = false;
      this.currentPolygonCoordinates = [];
      this.drawingManager.setOptions({
        drawingControl: true
      });
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
  }
  cancelPolygonName() {
    if (this.mArea) {
      this.mArea.setMap(null);
    }
    this.currentPolygonCoordinates = [];
    this.polygonNameForm.reset();
    this.showPolygonNameDialog = false;
    this.drawingManager.setOptions({
      drawingControl: true
    });
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  }

  getAreaList() {
    const url = "/area/all";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.areaListData = response.dataList;
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

  getCityList() {
    const url = "/city/all";
    this.citymanagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.cityListData = response.cityList;
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
  getSiteNameList() {
    const url = "/serviceArea/site/all";
    this.pincodemanagementService.getMethod(url).subscribe(
      (Response: any) => {
        this.siteNameListData = Response.SiteName.map(name => ({ name: name }));
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

  getPincodeList() {
    // const url = "/pincode/all";
    const url = "/pincode/getAll";
    this.pincodemanagementService.getMethod(url).subscribe(
      (response: any) => {
        this.pincodeListData = response.dataList;
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageserviceAreaListdata > 1) {
      this.currentPageserviceAreaListdata = 1;
    }
    if (!this.searchkey) {
      this.getserviceAreaList(this.showItemPerPage);
    } else {
      this.searchserviceArea();
    }
  }

  getserviceAreaList(list) {
    let size;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;

    let page_list = this.currentPageserviceAreaListdata;
    if (list) {
      size = list;
      this.serviceAreaListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.serviceAreaListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.serviceAreaListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.serviceAreaListdataitemsPerPage;
    }
    const url = "/serviceArea/all/activeAndUnderDevelopment";
    let servicearedata = {
      page: this.currentPageserviceAreaListdata,
      pageSize: size
    };
    this.serviceAreaService.postMethod(url, servicearedata).subscribe(
      (response: any) => {
        this.serviceAreaListData = response.dataList;
        this.serviceAreaListDataselector = response.dataList;
        this.serviceAreaListdatatotalRecords = response.totalRecords;
        // if (this.showItemPerPage > this.serviceAreaListdataitemsPerPage) {
        //   this.totalAreaListLength =
        //     this.serviceAreaListData.length % this.showItemPerPage
        // } else {
        //   this.totalAreaListLength =
        //     this.serviceAreaListData.length %
        //     this.serviceAreaListdataitemsPerPage
        // }
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

  private flattenPolygonList(polygonList: any[]): any[] {
    if (!polygonList || polygonList.length === 0) return [];
    if (Array.isArray(polygonList[0])) {
      return polygonList.reduce((acc, curr) => acc.concat(curr), []);
    }
    return polygonList; // Already flat
  }
  addEditserviceArea(serviceAreaId): void {
    this.submitted = true;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    if (this.serviceAreaGroupForm.valid) {
      if (serviceAreaId) {
        const url = "/serviceArea/update";
        this.createserviceAreaData = this.serviceAreaGroupForm.value;
        this.createserviceAreaData.polyGoneList = this.flattenPolygonList(this.polygonList);
        this.createserviceAreaData.isDeleted = false;
        const selectedPincodes = this.serviceAreaGroupForm.value.pincodes || [];
        this.pincodeOptions = this.pincodeDetail.map(pincode => ({
          pincode: pincode.pincode,
          id: pincode.id,
          selected: selectedPincodes.includes(pincode.id)
        }));
        this.serviceAreaService.postMethod(url, this.createserviceAreaData).subscribe(
          (response: any) => {
            if (response.responseCode == 406 || response.responseCode == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.submitted = false;
              this.isserviceAreaEdit = false;
              this.areaInputview = false;
              this.viewserviceAreaListData = [];
              this.loginService.refreshToken();
              this.clearDrawnData();
              this.getSiteNameList();
              this.commondropdownService.clearCache("/serviceArea/all/activeAndUnderDevelopment");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.msg,
                icon: "far fa-check-circle"
              });
              this.serviceAreaGroupForm.reset();
              this.getserviceAreaList("");
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
        const url = "/serviceArea/save";
        const selectedPincodes = this.serviceAreaGroupForm.value.pincodes || [];
        this.pincodeOptions = this.pincodeDetail.map(pincode => ({
          pincode: pincode.pincode,
          id: pincode.id,
          selected: selectedPincodes.includes(pincode.id)
        }));
        this.createserviceAreaData = this.serviceAreaGroupForm.value;
        this.createserviceAreaData.polyGoneList = this.polygonList;
        this.createserviceAreaData.isDeleted = false;
        this.createserviceAreaData.createdById = this.loginuser;
        this.createserviceAreaData.mvnoId = JSON.parse(localStorage.getItem("mvnoId"));
        this.serviceAreaService.postMethod(url, this.createserviceAreaData).subscribe(
          (response: any) => {
            if (response.responseCode == 406 || response.responseCode == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.submitted = false;
              this.areaInputview = false;
              this.serviceAreaGroupForm.reset();
              this.viewserviceAreaListData = [];
              this.clearDrawnData();
              this.commondropdownService.clearCache("/serviceArea/all/activeAndUnderDevelopment");
              this.getSiteNameList();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              this.loginService.refreshToken();
              const serviceArea: any = localStorage.getItem("serviceArea");
              let serviceAreaArray = JSON.parse(serviceArea);
              serviceAreaArray.push(response.data.id);
              localStorage.setItem("serviceArea", JSON.stringify(serviceAreaArray));
              this.getserviceAreaList("");

              this.pincodeDetail = "";
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
    this.pincodeListData = "";
  }

  editserviceArea(serviceAreaId: any): void {
    if (serviceAreaId) {
      this.areaInputview = true;
      this.customerrMyInventoryView = false;
      this.assignInventoryWithSerial = false;
      this.siteNameListData = [];
      this.clearDrawnData();
      const url = "/serviceArea/" + serviceAreaId;
      this.serviceAreaService.getMethod(url).subscribe(
        (response: any) => {
          if (this.isViewServiceArea) {
            this.isserviceAreaEdit = false;
          } else {
            this.isserviceAreaEdit = true;
          }
          this.viewserviceAreaListData = response.data;
          if (this.viewserviceAreaListData.siteName?.length > 0) {
            this.siteNameListData.push({ name: this.viewserviceAreaListData.siteName });
          }
          if (
            this.viewserviceAreaListData.polyGoneList &&
            this.viewserviceAreaListData.polyGoneList.length > 0
          ) {
            const filteredPolyGoneList = this.viewserviceAreaListData.polyGoneList.map(coord => ({
              lat: Number(coord.lat),
              lng: Number(coord.lng),
              polyOrder: Number(coord.polyOrder),
              polygoneName: coord.polygoneName
            }));
            const grouped = _.groupBy(filteredPolyGoneList, "polygoneName");
            this.polygonList = Object.values(grouped);
            this.drawingManager.setDrawingMode(null);
            this.drawPolygon(this.map, this.polygonList);
            this.isClearShow = true;
          } else {
            this.drawingManager.setDrawingMode(null);
            if (this.viewserviceAreaListData.siteName) {
              this.getPolygonListBySiteName(this.viewserviceAreaListData.siteName);
            }
          }
          this.serviceAreaGroupForm.patchValue(this.viewserviceAreaListData);
          let mvnoids = this.viewserviceAreaListData.mvnoIds
            ? this.viewserviceAreaListData.mvnoIds
            : [];
          this.serviceAreaGroupForm.patchValue({
            mvnoIds: mvnoids
          });

          const selectedPincodes = this.viewserviceAreaListData.selectedPincodes || [];

          if (Array.isArray(this.pincodeDetail)) {
            this.pincodeOptions = this.pincodeDetail.map(pincode => ({
              pincode: pincode.pincode,
              id: pincode.id,
              selected: selectedPincodes ? selectedPincodes.includes(pincode.id) : false
            }));
          } else {
            // Handle the case when this.pincodeDetail is not an array
          }

          this.getSelCity({ value: this.serviceAreaGroupForm.value.cityid });
          this.getLocationDetailByServiceArea(serviceAreaId);
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

  canExit() {
    if (!this.serviceAreaGroupForm.dirty) return true;
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

  deleteConfirmonserviceArea(serviceArea: number) {
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    if (serviceArea) {
      this.confirmationService.confirm({
        message: "Do you want to delete this serviceArea?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteserviceArea(serviceArea);
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

  deleteserviceArea(data) {
    const urlforgetData = "/serviceArea/" + data;

    this.serviceAreaService.getMethod(urlforgetData).subscribe((response: any) => {
      this.viewserviceAreaListData = response.data;
      const url = "/serviceArea/delete";
      this.serviceAreaService.postMethod(url, this.viewserviceAreaListData).subscribe(
        (response: any) => {
          if (this.currentPageserviceAreaListdata != 1 && this.totalAreaListLength == 1) {
            this.currentPageserviceAreaListdata = this.currentPageserviceAreaListdata - 1;
          }
          if (
            response.responseCode == 405 ||
            response.responseCode == 406 ||
            response.responseCode == 417
          ) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.loginService.refreshToken();
          }
          this.clearSearchserviceArea();
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
    });
  }

  pageChangedserviceAreaList(pageNumber) {
    this.currentPageserviceAreaListdata = pageNumber;
    if (!this.searchkey) {
      this.getserviceAreaList("");
    } else {
      this.searchserviceArea();
    }
  }

  pageChangedareaName(pageNumber) {
    this.currentPageareaName = pageNumber;
  }

  searchserviceArea() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageserviceAreaListdata = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.pageITEM = this.showItemPerPage;
      this.serviceAreaListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchObject.filters[0].filterValue = this.searchName.trim();

    this.searchObject.page = this.currentPageserviceAreaListdata;
    this.searchObject.pageSize = this.pageITEM;

    const url = "/serviceArea/all/activeAndUnderDevelopment";
    this.serviceAreaService.postMethod(url, this.searchObject).subscribe(
      (response: any) => {
        if (response.responseCode == 404 || response.responseCode == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.serviceAreaListData = [];
          this.serviceAreaListdatatotalRecords = 0;
        } else {
          this.serviceAreaListData = response.dataList;
          this.serviceAreaListDataselector = response.dataList;
          this.serviceAreaListdatatotalRecords = response.totalRecords;
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

  clearSearchserviceArea() {
    this.pincodeDetail = "";
    this.listView = true;
    this.createView = true;
    this.customerrMyInventoryView = false;
    this.searchName = "";
    this.submitted = false;
    this.serviceAreaGroupForm.reset();
    this.isserviceAreaEdit = false;
    this.areaInputview = false;
    this.viewserviceAreaListData = [];
    this.isViewServiceArea = false;
    this.getserviceAreaList("");
    this.clearDrawnData();
    this.getSiteNameList();
  }
  getSAData() {
    this.listView = true;
    this.createView = true;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
  }
  customerDetailOpen() {
    this.listView = true;
    this.createView = true;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
  }

  mylocation() {
    // this.spinner.show()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.serviceAreaGroupForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          this.iflocationFill = true;
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
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
  }
  searchLocation() {
    if (this.searchLocationForm.valid) {
      const url =
        "/serviceArea/getPlaceId?query=" + this.searchLocationForm.value.searchLocationname;
      this.serviceAreaService.getMethod(url).subscribe(
        (response: any) => {
          this.searchLocationData = response.locations;
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

  clearLocationForm() {
    this.searchLocationForm.reset();
    this.searchLocationData = [];
  }

  pageChangedSearchLocationList(currentPage) {
    this.currentPagesearchLocationList = currentPage;
  }

  filedLocation(placeId) {
    const url = "/serviceArea/getLatitudeAndLongitude?placeId=" + placeId;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.ifsearchLocationModal = false;
        this.serviceAreaGroupForm.patchValue({
          latitude: response.location.latitude,
          longitude: response.location.longitude
        });

        this.iflocationFill = true;
        this.closebutton.nativeElement.click();
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

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
    this.searchLocationForm.reset();
  }
  pageChangedMasterListI(pageNumber) {
    this.currentPageMasterSlabI = pageNumber;
  }

  getOutWardList(productID) {
    const staffId = localStorage.getItem("userId");
    this.inwardList = [];
    this.inwardService
      .getAllInwardByProductAndStaffforpopandserivearea(productID, staffId)
      .subscribe(
        (res: any) => {
          this.inwardList = res.dataList;
          this.productHasMac = this.products.find(element => element.id == productID).hasMac;
          this.productHasSerial = this.products.find(element => element.id == productID).hasSerial;
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

  openMyInventory(data): void {
    this.inventoryServiceAreaData = data;
    this.id = data.id;
    this.listView = false;
    this.createView = false;
    this.customerrMyInventoryView = true;
    this.assignInventoryCustomerId = data.id;
    this.assignInventoryWithSerial = false;
  }

  replaceInventorySubmit(): void {
    const mappingList: any[] = this.macList.filter(val => this.selectedMACAddress.includes(val));
    if (mappingList.length < 1) {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: "Please select at least/only one product for replacement.",
        icon: "far fa-check-circle"
      });
      return;
    } else {
      const url = `/inwards/replaceInventoryFromEndOwner?oldMacMappingId=${this.oldMacMappingId}&newMacMappingId=${mappingList[0].id}`;
      this.customerInventoryMappingService.getMethod(url).subscribe(
        (res: any) => {
          this.assignedInventoryListWithSerial = [];
          this.getCustomerAssignedList(this.assignInventoryCustomerId);
          this.assignInventoryWithSerial = false;

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigned inventory successfully.",
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error",
            icon: "far fa-check-circle"
          });
        }
      );
    }
  }

  deleteOldMACMapping(id): void {
    const url = `/inoutWardMacMapping/removeMappingWithCustomerInventory?mappingId=${id}`;
    this.customerInventoryMappingService.getMethod(url).subscribe(
      (res: any) => {
        this.assignInventoryWithSerial = false;

        this.messageService.add({
          severity: "success",
          summary: "success",
          detail: "Replaced Successfully.",
          icon: "far fa-times-circle"
        });
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

  getCustomerAssignedList(id): void {
    const data = {
      filters: [
        {
          filterValue: this.id,
          // filterValue: id,
          filterColumn: "Service Area"
        }
      ],
      page: 1,
      pageSize: 5,
      sortBy: "createdate",
      sortOrder: 0
    };
    data.page = this.customerInventoryListDataCurrentPage;
    data.pageSize = this.customerInventoryListItemsPerPage;

    this.inwardService.getByOwnerId(data).subscribe(
      (res: any) => {
        this.assignInventoryWithSerial = false;
        this.assignedInventoryList = res.dataList;
        this.customerInventoryListDataTotalRecords = res.totalRecords;
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

  replaceInventory(id): void {
    this.macList = [];
    this.inventoryAssignForm.reset();
    this.showReplacementForm = true;
    this.oldMacMappingId = id;
    this.customerId = this.assignInventoryCustomerId;
    this.getProductsToReplace(id);
  }

  getProductsToReplace(id) {
    const url = `/product/getAllProductsByMacSerial?macMappingId=${id}`;

    this.productService.getMethod(url).subscribe(
      (response: any) => {
        this.replaceProducts = response.dataList;
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

  assignToStaff(flag) {
    let url: any;
    let name: string;
    name = "CUSTOMER_INVENTORY_ASSIGN";

    if (flag) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
    } else {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
    }

    this.customerInventoryMappingService.getMethod(url).subscribe(
      response => {
        if (flag) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        this.assignCustomerInventoryModal = false;
        this.rejectCustomerInventoryModal = false;
        this.getCustomerAssignedList(this.assignInventoryCustomerId);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  checkStatus(id, status): void {
    if (status === "Pending") {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Assigned product is not eligible for replace.",
        icon: "far fa-times-circle"
      });
      return;
    }
    const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=CUSTOMER_INVENTORY_ASSIGN`;

    this.customerInventoryMappingService.getMethod(url).subscribe(
      (res: any) => {
        this.inventoryStatusDetails = res.dataList;
        // this.inventoryStatusView = true;
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
    let page = this.currentPageMasterSlabI;
    let page_list;

    if (this.showItemPerPage == 0) {
      this.MasteritemsPerPageI = 5;
    } else {
      this.MasteritemsPerPageI = 5;
    }

    this.workflowAuditDataI = [];

    let data = {
      page: page,
      pageSize: this.MasteritemsPerPageI
    };

    let url1 = "/workflowaudit/list?entityId=" + id + "&eventName=" + "CUSTOMER_INVENTORY_ASSIGN";

    this.customerManagementService.postMethod(url1, data).subscribe(
      (response: any) => {
        this.workflowAuditDataI = response.dataList;
        this.MastertotalRecordsI = response.totalRecords;
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

  approveReplaceInventoryInventory(id, status): void {
    this.approveId = id;
    this.approved = false;
    this.approveInventoryData = [];
    this.selectStaff = null;
    let bool: boolean;
    if (status !== "PENDING") {
      bool = true;
    }
    const url = `/inwards/approveReplaceInventory?isApproveRequest=true&macMappingId=${id}&billAble=${bool}`;

    this.customerInventoryMappingService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedInventoryListWithSerial = [];
        this.getCustomerAssignedList(this.assignInventoryCustomerId);
        this.assignInventoryWithSerial = false;
        if (response.dataList) {
          this.approved = true;
          this.approveInventoryData = response.dataList;
          this.assignCustomerInventoryModal = true;
        } else {
          this.getCustomerAssignedList(this.assignInventoryCustomerId);
        }

        this.getCustomerAssignedList(this.assignInventoryCustomerId);
        // this.customerInventoryListDataTotalRecords = res.totalRecords;
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

  checkStatusForRepalce(id): void {
    const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=CUSTOMER_INVENTORY_ASSIGN`;

    this.customerInventoryMappingService.getMethod(url).subscribe(
      (res: any) => {
        this.inventoryStatusDetailsForReplace = res.dataList;
        // this.inventoryStatusView = true;
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

  rejectInventoryReplaceInventory(id): void {
    this.approveId = id;
    this.reject = false;
    this.selectStaffReject = null;
    this.rejectInventoryData = [];
    let bool: boolean;
    if (status !== "PENDING") {
      bool = true;
    }
    const url = `/inwards/approveReplaceInventory?isApproveRequest=false&macMappingId=${id}&billAble=${bool}`;

    this.customerInventoryMappingService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedInventoryListWithSerial = [];
        this.getCustomerAssignedList(this.assignInventoryCustomerId);
        this.assignInventoryWithSerial = false;
        if (response.dataList) {
          this.reject = true;
          this.rejectInventoryData = response.dataList;
          this.rejectCustomerInventoryModal = true;
        } else {
          this.getCustomerAssignedList(this.assignInventoryCustomerId);
        }

        // this.customerInventoryListDataTotalRecords = res.totalRecords;
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

  getapproveStatusList(size) {
    let page_list;
    if (size) {
      page_list = size;
      this.custChangeStatusConfigitemsPerPage = size;
    } else {
      if (this.changeStatusShowItemPerPage == 1) {
        this.custChangeStatusConfigitemsPerPage = this.pageITEM;
      } else {
        this.custChangeStatusConfigitemsPerPage = this.changeStatusShowItemPerPage;
      }
    }
    this.AllcustApproveList = [];
    const url = `/allCustApprove/${this.customerId}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const list = response.customer;
        // this.AllcustApproveList.push(list);
        for (let i = list.length; i > 0; i--) {
          this.AllcustApproveList.push(list[i - 1]);
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

  getSelCity(event) {
    const selCityId = event.value;
    this.getPincodeDetailbyId(selCityId);
  }

  getPincodeDetailbyId(selCityId) {
    this.pincodeDetail = "";

    const url = "/serviceArea/getPincodefromCity/withSpecificParameter?id=" + selCityId;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.pincodeDetail = response.dataList;
        if (this.pincodeDetail.length > 0) {
          const selectedPincodes = this.serviceAreaGroupForm.value.pincodes || [];
          this.pincodeOptions = this.pincodeDetail.map(pincode => ({
            pincode: pincode.pincode,
            id: pincode.id,
            selected: selectedPincodes.includes(pincode.id)
          }));
          this.areaInputview = true;
        } else {
          this.pincodeOptions = [];
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No " + this.pincodeTitle + " found.",
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

  loadItems(event: any) {
    const startIndex = event.first;
    const endIndex = event.first + event.rows;
    this.items = this.pincodeDetail.slice(startIndex, endIndex);
  }

  // Assuming you have a service called `serviceAreaService` with a method `getMethod` for making GET requests

  getLocationDetailByServiceArea(selServiceAreaId: number) {
    this.locationDetail = "";

    const url = `/serviceArea/getLocationFromServiceArea?id=${selServiceAreaId}`;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.locationDetail = response.dataList;
        const selectedLocations = this.locationDetail.map((item: any) => item.locationId);
        if (this.locationDetail.length > 0) {
          this.locationDataByPlan = this.locationDataByPlan.map(location => ({
            name: location.name,
            locationMasterId: location.locationMasterId,
            selected: selectedLocations.includes(location.locationMasterId)
          }));
          this.serviceAreaGroupForm.patchValue({
            locationIds: selectedLocations
          });

          const selectedPincodes = this.serviceAreaGroupForm.value.pincodes || [];
          this.areaInputview = true;
        } else {
          this.locationOptions = [];
          this.serviceAreaGroupForm.patchValue({
            locationIds: []
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.message || "An error occurred while fetching location details.",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getAllLocation() {
    this.locationService.getAllActiveLocation().subscribe((response: any) => {
      this.locationDataByPlan = response.locationMasterList.map(location => ({
        name: location.name,
        locationMasterId: location.locationMasterId
      }));
    });
  }

  approveChangeStatus(id) {
    $("#approveChangeStatusModal").modal("show");
    this.assignInwardID = id;
  }

  rejectChangeStatus(id) {
    $("#rejectChangeStatusModal").modal("show");
    this.assignInwardID = id;
  }

  closeApproveInventoryModal() {
    this.assignInwardSubmitted = false;
    this.assignInwardForm.reset();
    $("#approveChangeStatusModal").modal("hide");
  }

  closeRejectInventoryModal() {
    this.rejectInwardSubmitted = false;
    this.rejectInwardForm.reset();
    $("#rejectChangeStatusModal").modal("hide");
  }

  radiusKeyPress(input) {
    var num = String.fromCharCode(input.which);
    const charStr = String.fromCharCode(input.which);

    if (
      !/^\d$/.test(charStr) &&
      charStr !== "0" &&
      charStr !== "1" &&
      charStr !== "2" &&
      charStr !== "3" &&
      charStr !== "4" &&
      charStr !== "5" &&
      charStr !== "6" &&
      charStr !== "7" &&
      charStr !== "8" &&
      charStr !== "9" &&
      charStr !== "."
    ) {
      event.preventDefault();
    } else {
    }
  }

  DrawPolygon() {
    this.isMapModelEnable = true;
    if (this.polygonList.length > 0) {
      this.isUploadView = false;
    } else {
      this.isUploadView = true;
    }
  }

  hideMapModel() {
    this.isMapModelEnable = false;
    this.location = "";
  }

  savePolygon() {
    this.isMapModelEnable = false;
  }

  onMapReady(map) {
    this.map = map;
    this.initDrawingManager(map);
  }

  initDrawingManager(map: any) {
    this.drawingManager = "";
    let drawingControl: boolean = false;
    if (this.polygonCreateAccess) {
      drawingControl = true;
    } else {
      drawingControl = false;
    }

    const options = {
      drawingControl: drawingControl,
      drawingControlOptions: {
        drawingModes: ["polygon"]
      },

      polygonOptions: {
        draggable: false,
        editable: false,
        fillColor: "#FF0000", // Set fill color to red
        strokeColor: "#FF0000", // Set stroke color to red
        strokeOpacity: 0.8,
        strokeWeight: 2
      },

      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };

    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);

    if (!this.polygonCreateAccess) {
      this.drawingManager.setDrawingMode(null);
    }

    google.maps.event.addListener(this.drawingManager, "overlaycomplete", event => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        this.drawnPolygonLatLongList = [];

        const len = event.overlay.getPath().getLength();
        this.currentPolygonCoordinates = [];

        for (let i = 0; i < len; i++) {
          const vertex = event.overlay.getPath().getAt(i);
          const vertexLatLng = { lat: vertex.lat(), lng: vertex.lng(), polyOrder: i + 1 };
          this.currentPolygonCoordinates.push(vertexLatLng);
        }

        this.drawingManager.setDrawingMode(null);
        this.mArea = event.overlay;
        this.drawingManager.setOptions({
          drawingControl: false
        });
        this.isClearShow = true;

        // Show dialog for polygon name
        this.showPolygonNameDialog = true;
      }
    });
  }

  private closePolygonPath(points: { lat: number; lng: number }[]): { lat: number; lng: number }[] {
    if (
      points.length > 2 &&
      (points[0].lat !== points[points.length - 1].lat ||
        points[0].lng !== points[points.length - 1].lng)
    ) {
      return [...points, { ...points[0] }];
    }
    return points;
  }
  allDrawnPolygons: any[] = [];
  drawPolygon(map, polygonList) {
    let polygonArrays = [];

    if (Array.isArray(polygonList[0])) {
      // Grouped format
      polygonList.forEach(polygonPoints => {
        let polys = polygonPoints.map(poly => ({
          lat: Number(poly.lat),
          lng: Number(poly.lng)
        }));
        polys = this.closePolygonPath(polys);
        const polygon = new google.maps.Polygon({
          map: map,
          paths: polys,
          strokeColor: "#FF8C00",
          fillColor: "#FF8C00",
          strokeOpacity: 0.8,
          strokeWeight: 2
        });

        polygonArrays.push(polygon);
        this.allDrawnPolygons.push(polygon);
      });
    } else {
      // Flat list, needs grouping
      this.drawingManager.setDrawingMode(null);
      this.drawingManager.setOptions({
        drawingControl: false
      });
      const grouped = {};
      polygonList.forEach(point => {
        if (!grouped[point.polygoneName]) grouped[point.polygoneName] = [];
        grouped[point.polygoneName].push(point);
      });
      Object.values(grouped).forEach((polygonPoints: any[]) => {
        let polys = polygonPoints.map(poly => ({
          lat: Number(poly.lat),
          lng: Number(poly.lng)
        }));
        polys = this.closePolygonPath(polys);
        const polygon = new google.maps.Polygon({
          map: map,
          paths: polys,
          strokeColor: "#FF8C00",
          fillColor: "#FF8C00",
          strokeOpacity: 0.8,
          strokeWeight: 2
        });

        polygonArrays.push(polygon);
        this.allDrawnPolygons.push(polygon);
      });
    }

    // Optional: Click event handler
    polygonArrays.forEach(polygon => {
      google.maps.event.addListener(polygon, "click", function (event) {
        polygonArrays.forEach(p => {
          p.setOptions({ fillColor: "#FF8C00", strokeColor: "#FF8C00" });
        });
        polygon.setOptions({ fillColor: "#000", strokeColor: "#000" });
      });
    });
  }

  clearDrawnData() {
    // Clear all polygons drawn via KML/CSV or drawing
    if (this.allDrawnPolygons && this.allDrawnPolygons.length > 0) {
      this.allDrawnPolygons.forEach(polygon => polygon.setMap(null));
      this.allDrawnPolygons = [];
    }

    // Clear single polygon shape if stored separately
    if (this.mArea && this.mArea.setMap) {
      this.mArea.setMap(null);
      this.mArea = null;
    }

    // Clear extra map overlays if any
    if (this.polygonMap && this.polygonMap.setMap) {
      this.polygonMap.setMap(null);
      this.polygonMap = null;
    }

    // Disable drawing controls (or re-enable based on access)
    if (this.drawingManager) {
      this.drawingManager.setDrawingMode(null);
      this.drawingManager.setMap(null); // fully remove it from the map temporarily

      if (this.polygonCreateAccess) {
        this.drawingManager.setMap(this.map); // reattach if needed
        this.drawingManager.setOptions({ drawingControl: true });
      } else {
        this.drawingManager.setOptions({ drawingControl: false });
      }
    }

    // Reset state variables
    this.isClearShow = false;
    this.polygonList = [];
    this.drawnPolygonLatLongList = [];
    this.isUploadView = true;
  }

  handleAddressChange(address: any) {
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.zoom = 20;
    this.markers = [];
    this.markers.push({
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng(),
      draggable: false
    });
  }

  onKeyName(event) {
    if (!this.isserviceAreaEdit) {
      this.serviceAreaGroupForm.patchValue({
        siteName: this.serviceAreaGroupForm.value.name
      });
      this.checkSiteNameExistOrNot(this.serviceAreaGroupForm.value.siteName);
    }
  }

  downloadCsv() {
    let siteName = this.serviceAreaGroupForm.value.siteName;
    const url = "/serviceArea/getCsvFromPolygon/" + siteName;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        const csvData = this.convertToCSV(response.data);
        this.downloadFile(csvData, siteName + ".csv");
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

  convertToCSV(data: string): string {
    const rows = data.split("\n");
    let csv = "";
    for (const row of rows) {
      csv += row + "\n";
    }
    return csv;
  }

  downloadFile(data: string, filename: string) {
    const file = new Blob([data], { type: "text/csv" });
    const fileURL = URL.createObjectURL(file);
    FileSaver.saveAs(file, filename);
  }

  uploadPolygonDocument() {
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
    this.isBuldUpload = true;
  }

  uploadPolygonFile() {
    this.drawPolygon(this.map, this.drawnPolygonLatLongList);
    this.isClearShow = true;
    this.isBuldUpload = false;
    this.uploadDocForm.patchValue({ file: "" });
    this.selectedFileUploadPreview = [];
    this.isUploadView = false;
    this.drawingManager.setDrawingMode(null);
    if (this.drawnPolygonLatLongList && this.drawnPolygonLatLongList.length > 0) {
      const newPolygons = Array.isArray(this.drawnPolygonLatLongList[0])
        ? this.drawnPolygonLatLongList
        : [this.drawnPolygonLatLongList];

      newPolygons.forEach((polygonCoords, index) => {
        const polygonName = polygonCoords[0]?.polygonName;
        const coordsWithName = polygonCoords.map((coord, idx) => ({
          lat: Number(coord.lat),
          lng: Number(coord.lng),
          polyOrder: idx + 1,
          polygoneName: polygonName
        }));
        this.polygonList.push(...coordsWithName);
      });
      this.polygonList = this.flattenPolygonList(this.polygonList);
    }
  }

  deletUploadedFile(event: any) {
    var temp: File[] = this.selectedFileUploadPreview?.filter((item: File) => item?.name != event);
    this.selectedFileUploadPreview = temp;
    this.uploadDocForm.patchValue({
      file: temp
    });
    this.drawnPolygonLatLongList = [];
  }

  closeUploadDocumentId() {
    this.isBuldUpload = false;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
    this.drawnPolygonLatLongList = [];
  }

  onSiteNameChange(event) {
    let siteName = this.serviceAreaGroupForm.value.siteName;
    if (!this.isserviceAreaEdit) {
      this.checkSiteNameExistOrNot(siteName);
    }
  }

  checkSiteNameExistOrNot(siteName) {
    if (siteName) {
      let url = `/serviceArea/isSiteNameExists/${siteName}`;
      this.serviceAreaService.getMethod(url).subscribe(
        (response: any) => {
          if (response.data) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "Site Name is not available",
              icon: "far fa-times-circle"
            });
            this.isSiteNameAvailable = false;
          } else {
            this.isSiteNameAvailable = true;
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

  getPolygonListBySiteName(siteName) {
    if (siteName) {
      let url = `/serviceArea/getPolygonFromServiceArea/${siteName}`;
      this.serviceAreaService.getMethod(url).subscribe(
        (response: any) => {
          if (response.dataList && response.dataList.length > 0) {
            this.drawnPolygonLatLongList = response.dataList.map(poly => ({
              lat: poly.lat,
              lng: poly.lng,
              polyOrder: poly.polyOrder,
              polygoneName: poly.polygoneName
            }));
            this.drawPolygon(this.map, response.dataList);
          }
        },
        (error: any) => {}
      );
    }
  }

  sieNameChange(event) {
    let siteName = this.serviceAreaGroupForm.value.siteName;
    if (!this.isserviceAreaEdit) {
      this.getPolygonListBySiteName(siteName);
    }
  }

  showAllPolygons() {
    this.isAllPolygoneModelShow = true;
  }

  hideAllPolygonModel() {
    this.isAllPolygoneModelShow = false;
  }

  serviceAreaTypeChange(event: any) {
    let selectedType = event.value;
    if (selectedType === "private") {
      this.serviceAreaGroupForm.get("blockNo").setValidators([Validators.required]);
      this.serviceAreaGroupForm.get("blockNo").updateValueAndValidity();
    } else {
      this.serviceAreaGroupForm.get("blockNo").clearValidators();
      this.serviceAreaGroupForm.get("blockNo").updateValueAndValidity();
    }
  }

  getISPList() {
    let url = `/mvno/getMvnoNameAndIds`;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        let superAdminId = Number(RadiusConstants.SUPERADMINID);
        this.ispListData = response.dataList.filter(isp => isp.id != superAdminId);
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

  handleKeyDown(event: KeyboardEvent) {
    if (
      event.keyCode === 8 ||
      (event.key >= "0" && event.key <= "9") // Allow only one decimal point
    ) {
      return true; // Allow the input
    } else {
      return false; // Prevent the input for other keys
    }
  }

  viewEditServiceArea(serviceAreaId, isServiceAreaView) {
    this.isViewServiceArea = isServiceAreaView;
    this.editserviceArea(serviceAreaId);
  }

  onFileChangeUpload(event: any) {
    this.selectedFileUploadPreview = [];
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const files: FileList = event.target.files;

      for (let i = 0; i < files.length; i++) {
        this.selectedFileUploadPreview.push(files.item(i));
      }

      if (this.selectedFile) {
        const file = this.selectedFile;

        if (this.isValidCSVFile(file)) {
          this.readCSVFile(file);
        } else if (this.isValidKMLFile(file)) {
          this.readKMLFile(file);
        } else {
          this.uploadDocForm.controls.file.reset();
          this.selectedFileUploadPreview = [];
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Please upload a valid .csv or .kml file",
            icon: "far fa-times-circle"
          });
        }
      }
    }
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  isValidKMLFile(file: any) {
    return file.name.endsWith(".kml");
  }

  readCSVFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsText(file);

    reader.onload = e => {
      const csv = reader.result as string;
      this.drawnPolygonLatLongList = this.parseCsvToJson(csv);
    };

    reader.onerror = e => {
      console.error("Error reading CSV file");
    };
  }

  readKMLFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsText(file);

    reader.onload = e => {
      const kmlText = reader.result as string;
      this.drawnPolygonLatLongList = this.parseKmlToJson(kmlText);
    };

    reader.onerror = e => {
      console.error("Error reading KML file");
    };
  }

  parseCsvToJson(csv: string): any[] {
    const lines: string[] = csv.trim().split("\n");
    if (lines.length < 2) return [];

    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const latIndex = header.indexOf("lat");
    const lngIndex = header.indexOf("lng");
    const nameIndex = header.indexOf("polygonename");

    const grouped: { [key: string]: any[] } = {};

    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(",").map(val => val.trim());

      const lat = parseFloat(data[latIndex]);
      const lng = parseFloat(data[lngIndex]);
      const polygonName = nameIndex !== -1 ? data[nameIndex] : `Polygon${i}`;

      if (!grouped[polygonName]) grouped[polygonName] = [];

      grouped[polygonName].push({
        lat,
        lng,
        polyOrder: grouped[polygonName].length + 1,
        polygonName
      });
    }

    return Object.values(grouped); // returns array of polygon point arrays
  }

  parseKmlToJson(kmlText: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, "application/xml");

    const placemarks = xmlDoc.getElementsByTagName("Placemark");
    const allPolygons = [];

    for (let i = 0; i < placemarks.length; i++) {
      const placemark = placemarks[i];

      // Extract the polygon name
      const nameElement = placemark.getElementsByTagName("name")[0];
      const polygonName = nameElement?.textContent || `Polygon ${i + 1}`;

      // Extract coordinate text
      const coordinatesElements = placemark.getElementsByTagName("coordinates");
      if (coordinatesElements.length > 0) {
        const coordText = coordinatesElements[0].textContent;
        if (coordText) {
          const coordArray = coordText.trim().split(/\s+/);
          const polygonCoords = coordArray.map((coord, index) => {
            const [lng, lat, alt] = coord.split(",").map(Number);
            return {
              lat,
              lng,
              polyOrder: index + 1,
              polygonName
            };
          });
          allPolygons.push(polygonCoords);
        }
      }
    }

    return allPolygons;
  }

  downloadKML(): void {
    let siteName = this.serviceAreaGroupForm.value.siteName;
    const flatPolygonList = this.flattenPolygonList(this.polygonList);
    const kmlContent = this.generateKMLContent(flatPolygonList); // Pass the flat list
    const blob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = siteName + ".kml";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  generateKMLContent(coordinates: any[]): string {
    const grouped = _.groupBy(coordinates, "polygoneName");

    let kml = '<?xml version="1.0" encoding="UTF-8"?>';
    kml += '<kml xmlns="http://www.opengis.net/kml/2.2">';
    kml += "<Document>";

    Object.keys(grouped).forEach(name => {
      const points = grouped[name].map(coord => ({
        lat: Number(coord.lat),
        lng: Number(coord.lng)
      }));
      if (
        points.length > 2 &&
        (points[0].lat !== points[points.length - 1].lat ||
          points[0].lng !== points[points.length - 1].lng)
      ) {
        points.push({ ...points[0] });
      }

      kml += `<Placemark><name>${name}</name><Polygon><outerBoundaryIs><LinearRing><coordinates>`;
      points.forEach(coord => {
        kml += `${coord.lng},${coord.lat},0 `;
      });
      kml += `</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>`;
    });

    kml += "</Document></kml>";
    return kml;
  }
  bulkAssignViewData(data) {
    this.serviceAreaId = data.id;
    this.bulkAssign = true;
    this.getStaffData();
    this.getPlanListData();
  }

  getStaffData() {
    const url = "/staffList/serviceArea/notBind/" + this.serviceAreaId;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.bulkSAStaffList = response.dataList;
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

  getPlanListData() {
    const url = "/serviceArea/getAllRemainingPlanForServiceArea/" + this.serviceAreaId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planAllData = response.dataList;
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

  bulkAssignData() {
    this.bulkAssign = false;
    this.bulkAssignToStaff();
    this.bulkAssignToPlan();
  }

  bulkAssignToStaff() {
    let obj = {
      serviceAreaId: this.serviceAreaId,
      staffIds: this.bulkAssignForm.value.staffId
    };
    let url = "/serviceArea/assignToStaff";
    this.serviceAreaService.postMethod(url, obj).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
          icon: "far fa-times-circle"
        });
        this.bulkAssign = false;
        this.bulkAssignForm.reset();
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

  bulkAssignToPlan() {
    let obj = {
      serviceAreaId: this.serviceAreaId,
      planIds: this.bulkAssignForm.value.planId
    };
    let url = "/plan/assignServiceArea";
    this.customerManagementService.postMethod(url, obj).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
          icon: "far fa-times-circle"
        });
        this.bulkAssign = false;
        this.bulkAssignForm.reset();
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

  bulkAssignClose() {
    this.bulkAssign = false;
  }

  closeAssignCustomerInventoryModal(){
    this.assignCustomerInventoryModal = false;
  }

  modalCloseAssignStaff(){
    this.rejectCustomerInventoryModal = false;
  }
}
