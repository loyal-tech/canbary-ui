import { ServiceAreaComponent } from "./../service-area/service-area.component";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { TreeNode } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { BranchManagementService } from "../branch-management/branch-management.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { NETWORKS } from "src/app/constants/aclConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { error } from "console";
declare var $: any;
import panzoom from "panzoom";
import * as FileSaver from "file-saver";

interface Tree {
  key: string;
  children?: Record<string, Tree>;
}

@Component({
  selector: "app-network-device",
  templateUrl: "./network-device.component.html",
  styleUrls: ["./network-device.component.css"]
})
export class NetworkDeviceComponent implements OnInit, AfterViewInit {
  @ViewChild("closebutton") closebutton;
  @ViewChild("zoomWrapper", { static: false }) zoomWrapper!: ElementRef;
  zoomInstance: any;
  networkDeviceGroupForm: FormGroup;
  networkDeviceCategoryList: any;
  submitted: boolean = false;

  // createnetworkDeviceData: NetworkDevice
  createnetworkDeviceData: any = [];
  currentPagenetworkDeviceListdata = 1;
  networkDeviceListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  networkDeviceListdatatotalRecords: any;
  parentNetworkDeviceList: any = [];
  networkDeviceListData: any = [];
  viewnetworkDeviceListData: any = [];
  isnetworkDeviceEdit: boolean = false;
  isTotalPort: boolean;
  networkDevicetype = "";
  networkDevicecategory = "";
  searchnetworkDeviceUrl: any;

  serviceData: any;
  areaNameCategoryList: any;

  areaIdFromArray: FormArray;
  areaNameitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  areaNametotalRecords: String;
  currentPageareaName = 1;
  selectvalue = "";

  temp = [];
  networkDeviceListData1: any;
  networkDeviceListDataselector: any;
  networkDeviceRulelength = 0;

  searchData: any;
  searchDeviceType: any = "";
  searchDeatil: any = "";
  viewserviceAreaListData: any;

  searchLocationForm: FormGroup;
  currentPagesearchLocationList = 1;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: String;
  ifsearchLocationModal = false;
  searchLocationData: any;
  iflocationFill = false;

  ifSpliterInputShow = false;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  networkDeviceData: any = [];
  searchNetworkDeviceData: any = [];
  networkDeviceDetails: any = [];
  parentnetwork: any = [];
  ifNetwortDetails = false;
  parentDeviceData: any = [];
  productDeviceData: any = [];
  SelectInwardData: any = [];
  childrenDeviceData: any = [];
  ifPersonalPerentDeviceShow = false;
  isHierarchyDiagramVisible = false;
  netWorkHierarchyName: any = "";
  IfPersonalNetworkDataShow = true;
  serviceAreaList: any = [];
  branchesByServiceArea: any = [];
  serviceAreaName: any = "";
  children1DeviceData: any = [];
  data1: TreeNode[];
  data2: TreeNode[];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  parentMappingAccess: boolean = false;
  selectedNode: TreeNode;
  index: any = 1;
  da: any;
  show = true;
  ifServiceAreaListShow = false;
  ifChildListShow = false;
  statusOptions = RadiusConstants.status;
  parentChildPortModal: boolean = false;
  childPortData: any[] = [];
  parentPortData: any[] = [];
  isParent: boolean = false;
  editedRowIndex: number = -1;
  updateParentInPortdata: any[] = [];
  updateParentOutPortdata: any[] = [];
  updateChildInPortdata: any[] = [];
  updateChildOutPortdata: any[] = [];
  selectedParentInPortdata: any;
  selectedParentOutPortdata: any;
  selectedChildInPortdata: any;
  selectedChildOutPortdata: any;
  isparentChildDeviceModelOpen: boolean = false;
  deviceType: string = "";
  selectedDevice: any = [];
  isHierarchyMappingVisible: boolean = false;
  hierarchyMappingList: any[] = [];
  networkDeviceId: any;
  selectParentModal = false;
  cols = [
    // Parent Device Details
    { field: "parentDeviceName", header: "Name", customExportHeader: "Parent Device Name" },
    {
      field: "parentDevicePortNumber",
      header: "Port Number",
      customExportHeader: "Parent Device Port Number"
    },
    {
      field: "parentDeviceType",
      header: "Device Type",
      customExportHeader: "Parent Device Device Type"
    },
    {
      field: "parentDeviceOwnerType",
      header: "Owner Type",
      customExportHeader: "Parent Device Owner Type"
    },
    {
      field: "parentDeviceMacAddress",
      header: "MAC Address",
      customExportHeader: "Parent Device MAC Address"
    },
    {
      field: "parentDeviceSerialNumber",
      header: "Serial Number",
      customExportHeader: "Parent Device Serial Number"
    },

    // Child Device Details
    { field: "childDeviceName", header: "Name", customExportHeader: "Child Device Name" },
    {
      field: "childDevicePortNumber",
      header: "Port Number",
      customExportHeader: "Child Device Port Number"
    },
    {
      field: "childDeviceType",
      header: "Device Type",
      customExportHeader: "Child Device Device Type"
    },
    {
      field: "childDeviceOwnerType",
      header: "Owner Type",
      customExportHeader: "Child Device Owner Type"
    },
    {
      field: "childDeviceMacAddress",
      header: "MAC Address",
      customExportHeader: "Child Device MAC Address"
    },
    {
      field: "childDeviceSerialNumber",
      header: "Serial Number",
      customExportHeader: "Child Device Serial Number"
    }
  ];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private networkdeviceService: NetworkdeviceService,
    private serviceAreaService: ServiceAreaService,
    private productManagementService: ProuctManagementService,
    private BranchManagementService: BranchManagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private customerManagementService: CustomermanagementService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(NETWORKS.NETWORK_DEVICE_CREATE);
    this.deleteAccess = loginService.hasPermission(NETWORKS.NETWORK_DEVICE_DELETE);
    this.editAccess = loginService.hasPermission(NETWORKS.NETWORK_DEVICE_EDIT);
    this.parentMappingAccess = loginService.hasPermission(NETWORKS.NETWORK_DEVICE_PARENT_MAPPING);
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isnetworkDeviceEdit = !this.createAccess && this.editAccess ? true : false;
    this.getAllProducttype();
    // this.getInwardList();
    // this.getInwardList();
    // this.getAllInward();
  }

  ngAfterViewInit(): void {
    this.zoomInstance = panzoom(this.zoomWrapper.nativeElement, {
      bounds: true,
      boundsPadding: 0.1,
      minZoom: 0.5,
      maxZoom: 2
    });
  }

  zoomIn() {
    if (this.zoomInstance) this.zoomInstance.zoomIn();
  }

  zoomOut() {
    if (this.zoomInstance) this.zoomInstance.zoomOut();
  }

  resetZoom() {
    if (this.zoomInstance) this.zoomInstance.moveTo(0, 0);
  }
  ngOnInit(): void {
    this.networkDeviceGroupForm = this.fb.group({
      id: [""],
      name: ["", Validators.required],
      displayname: ["", Validators.required],
      status: ["", Validators.required],
      productId: ["", Validators.required],
      staffId: [""],
      inwardId: [""],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      isDeleted: [0],
      devicetype: [""],
      serviceAreaIdsList: ["", Validators.required],
      availableInPorts: [0],
      availableOutPorts: [0],
      totalInPorts: [0],
      totalOutPorts: [0],
      totalPorts: [""],
      availablePorts: [""]
    });

    this.searchData = {
      currentPageNumber: this.currentPagenetworkDeviceListdata,
      dataList: [{}]
    };

    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });

    this.totalInPorts = this.fb.array([]);
    this.totalOutPorts = this.fb.array([]);
    this.inForm = this.fb.group({
      inBind: ["", Validators.required],
      outBind: ["", Validators.required],
      parentDeviceId: ["", Validators.required]
    });
    this.outForm = this.fb.group({
      inBind: ["", Validators.required],
      outBind: ["", Validators.required],
      parentDeviceId: ["", Validators.required]
    });
    this.getServiceArea();
    // const serviceArea = localStorage.getItem("serviceArea");
    // let serviceAreaArray = JSON.parse(serviceArea);
    // if (serviceAreaArray.length !== 0) {
    //   this.filterserviceAreaList();
    // } else {
    //   this.getAllActiveServiceAreaList();
    // }

    // this.getnetworkDeviceList("");
    // this.commonGenericData();

    // this.commondropdownService.getserviceAreaList();
    this.getnetworkDeviceList("");
    this.commonGenericData();
  }

  selectServiceAreaChange(_event: any) {
    const url = "/serviceArea/" + _event.value;
    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      this.viewserviceAreaListData = response.data;

      this.networkDeviceGroupForm.patchValue({
        servicearea: {
          createdById: this.viewserviceAreaListData.createdById,
          createdByName: this.viewserviceAreaListData.createdByName,
          createdate: this.viewserviceAreaListData.createdate,
          isDeleted: this.viewserviceAreaListData.isDeleted,
          lastModifiedById: this.viewserviceAreaListData.lastModifiedById,
          lastModifiedByName: this.viewserviceAreaListData.lastModifiedByName,
          name: this.viewserviceAreaListData.name,
          status: this.viewserviceAreaListData.status,
          updatedate: this.viewserviceAreaListData.updatedate,
          availableInPorts: this.viewnetworkDeviceListData.availableInPorts,
          availableOutPorts: this.viewnetworkDeviceListData.availableOutPorts,
          totalInPorts: this.viewnetworkDeviceListData.totalInPorts,
          totalOutPorts: this.viewnetworkDeviceListData.totalOutPorts
        }
      });
    });
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagenetworkDeviceListdata > 1) {
      this.currentPagenetworkDeviceListdata = 1;
    }
    if (this.searchDeviceType && this.searchDeatil) {
      this.searchnetworkDevice();
    } else {
      this.getnetworkDeviceList(this.showItemPerPage);
    }
  }

  getnetworkDeviceList(list) {
    let size;
    let page_list = this.currentPagenetworkDeviceListdata;
    this.searchkey = "";
    if (list) {
      size = list;
      this.networkDeviceListdataitemsPerPage = list;
    } else {
      size = this.networkDeviceListdataitemsPerPage;
    }

    const url = "/NetworkDevice/list";
    let networkdevicedata = {
      page: page_list,
      pageSize: size
    };
    this.networkdeviceService.postMethod(url, networkdevicedata).subscribe(
      (response: any) => {
        this.networkDeviceListData = response.dataList;
        this.networkDeviceListDataselector = response.dataList;
        this.networkDeviceListdatatotalRecords = response.totalRecords;
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

  addEditnetworkDevice(networkDeviceId) {
    this.submitted = true;

    if (this.networkDeviceGroupForm.valid) {
      if (networkDeviceId) {
        const url = "/NetworkDevice/update?mvnoId=" + localStorage.getItem("mvnoId");

        this.createnetworkDeviceData = this.networkDeviceGroupForm.value;
        this.createnetworkDeviceData.isDeleted = false;

        this.networkdeviceService.postMethod(url, this.createnetworkDeviceData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Rejected",
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
              if (!this.searchkey) {
                this.getnetworkDeviceList("");
              } else {
                this.searchnetworkDevice();
              }

              this.clearNetworkDevice();
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
        const url = "/NetworkDevice/save?mvnoId=" + localStorage.getItem("mvnoId");

        this.createnetworkDeviceData = this.networkDeviceGroupForm.value;
        this.createnetworkDeviceData.isDeleted = false;

        if (
          //   this.networkDeviceGroupForm.value.devicetype === "Splitter/DB" ||
          //   this.networkDeviceGroupForm.value.devicetype == "ONU"
          this.networkDeviceGroupForm.value.devicetype != "Fiber"
        ) {
          if (this.networkDeviceGroupForm.value.totalPorts == "") {
            this.networkDeviceGroupForm.value.totalPorts = null;
          }
          if (this.networkDeviceGroupForm.value.availablePorts == "") {
            this.networkDeviceGroupForm.value.availablePorts = null;
          }
        } else {
          this.networkDeviceGroupForm.value.totalPorts = -1;
          this.networkDeviceGroupForm.value.availablePorts = -1;
        }
        this.networkdeviceService.postMethod(url, this.createnetworkDeviceData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Rejected",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              if (!this.searchkey) {
                this.getnetworkDeviceList("");
              } else {
                this.searchnetworkDevice();
              }

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.clearNetworkDevice();
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

  editnetworkDevice(networkDeviceId: any) {
    if (networkDeviceId) {
      const url = "/NetworkDevice/" + networkDeviceId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.networkdeviceService.getMethod(url).subscribe(
        (response: any) => {
          this.isnetworkDeviceEdit = true;
          this.isTotalPort = false;
          this.viewnetworkDeviceListData = response.data;

          this.networkDeviceGroupForm.patchValue(this.viewnetworkDeviceListData);
          this.setPortValue(this.viewnetworkDeviceListData);

          let serviceAreaId = [];
          for (let k = 0; k < this.viewnetworkDeviceListData.serviceAreaNameList.length; k++) {
            serviceAreaId.push(this.viewnetworkDeviceListData.serviceAreaNameList[k].id);
          }
          this.networkDeviceGroupForm.patchValue({
            serviceAreaIdsList: serviceAreaId
          });

          if (
            // this.viewnetworkDeviceListData.devicetype === "Splitter/DB" ||
            // this.viewnetworkDeviceListData.devicetype === "ONU"
            this.viewnetworkDeviceListData.devicetype !== "Fiber"
          ) {
            this.ifSpliterInputShow = true;
          } else {
            this.ifSpliterInputShow = false;
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

  deleteConfirmonnetworkDevice(networkDevice: number) {
    if (networkDevice) {
      this.confirmationService.confirm({
        message: "Do you want to delete this networkDevice?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deletenetworkDevice(networkDevice);
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

  deletenetworkDevice(data) {
    let networkDeviceData = {
      id: data.id,
      name: data.name,
      displayname: data.displayname,
      status: data.status,
      latitude: data.latitude,
      longitude: data.longitude,
      isDeleted: data.isDeleted,
      devicetype: data.devicetype,
      servicearea: {
        createdById: data.createdById,
        createdByName: data.createdByName,
        createdate: data.createdate,
        id: data.id,
        isDeleted: data.isDeleted,
        lastModifiedById: data.lastModifiedById,
        lastModifiedByName: data.lastModifiedByName,
        name: data.name,
        status: data.status,
        updatedate: data.updatedate
      },
      updatedate: data.updatedate,
      createdById: data.createdById,
      createdByName: data.createdByName,
      createdate: data.createdate,
      lastModifiedById: data.lastModifiedById,
      lastModifiedByName: data.lastModifiedByName,
      // parentNetworkDeviceId: data.parentNetworkDeviceId,
      availablePorts: data.availablePorts,
      totalPorts: data.totalPorts,
      mvnoId: data.mvnoId
    };

    const url = "/NetworkDevice/delete";
    this.networkdeviceService.postMethod(url, networkDeviceData).subscribe(
      (response: any) => {
        if (this.currentPagenetworkDeviceListdata != 1 && this.totalDataListLength == 1) {
          this.currentPagenetworkDeviceListdata = this.currentPagenetworkDeviceListdata - 1;
        }
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
        if (!this.searchkey) {
          this.getnetworkDeviceList("");
        } else {
          this.searchnetworkDevice();
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

  pageChangednetworkDeviceList(pageNumber) {
    this.currentPagenetworkDeviceListdata = pageNumber;
    if (this.searchDeviceType && this.searchDeatil) {
      this.searchnetworkDevice();
    } else {
      this.getnetworkDeviceList("");
    }
  }

  pageChangedareaName(pageNumber) {
    this.currentPageareaName = pageNumber;
  }

  searchnetworkDevice() {
    const trimmedSearch = this.searchDeatil?.trim();
    const trimmedColumn = this.searchDeviceType?.trim();
    if (!trimmedSearch || !trimmedColumn) {
      return;
    }
    const searchOwnerData = {
      filter: [
        {
          filterDataType: "",
          filterValue: trimmedSearch,
          filterColumn: trimmedColumn,
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPagenetworkDeviceListdata,
      pageSize: this.networkDeviceListdataitemsPerPage,
      sortBy: "createdate",
      sortOrder: 0
    };
    searchOwnerData.filter[0].filterValue = this.searchDeatil.trim();
    searchOwnerData.filter[0].filterColumn = this.searchDeviceType.trim();
    const url =
      "/NetworkDevice/search?page=" +
      searchOwnerData.page +
      "&pageSize=" +
      searchOwnerData.pageSize +
      "&sortBy=" +
      searchOwnerData.sortBy +
      "&sortOrder=" +
      searchOwnerData.sortOrder +
      "&mvnoId=" +
      localStorage.getItem("mvnoId");
    this.networkdeviceService.postMethod(url, searchOwnerData).subscribe(
      (response: any) => {
        this.networkDeviceListData = response.dataList;
        this.networkDeviceListDataselector = response.dataList;
        this.networkDeviceListdatatotalRecords = response.totalRecords;
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

  clearSearchnetworkDevice() {
    this.currentPagenetworkDeviceListdata = 1;
    this.getnetworkDeviceList("");
    this.searchDeviceType = "";
    this.searchDeatil = "";
    this.submitted = false;
    this.isnetworkDeviceEdit = false;
    this.networkDeviceGroupForm.reset();
    this.ifSpliterInputShow = false;

    // this.getnetworkDeviceList("");
    // this.searchDeviceType = "";
    // this.ifNetwortDetails = false;
    // this.networkDeviceGroupForm.reset();
    // this.clearNetworkDevice();
  }

  mylocation() {
    // this.spinner.show()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.networkDeviceGroupForm.patchValue({
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
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
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
              severity: "error",
              summary: "Error",
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
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.ifsearchLocationModal = false;

        this.networkDeviceGroupForm.patchValue({
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

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.clearNetworkDevice();
    this.ifsearchLocationModal = false;
  }

  clearNetworkDevice() {
    this.networkDeviceGroupForm.reset();
    this.isTotalPort = true;
    this.isnetworkDeviceEdit = false;
    this.submitted = false;
    this.iflocationFill = false;
    this.ifSpliterInputShow = false;

    this.networkDeviceGroupForm.controls.devicetype.setValue("");
    this.networkDeviceGroupForm.controls.status.setValue("");
  }

  commonGenericData() {
    const url = "/commonList/generic/networkDeviceType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.networkDeviceData = response.dataList;
        this.searchNetworkDeviceData = response.dataList.map(item => ({
          text: item.text
        }));
        this.searchNetworkDeviceData.unshift({ text: "DISPLAY NAME" });
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

  networkDeviceTypeEvent(event) {
    const deviceType = event.value;
    this.filterProductsByDeviceType(deviceType);
    if (event.value != "Fiber") {
      this.ifSpliterInputShow = true;
      this.isTotalPort = true;
      //   this.networkDeviceGroupForm.patchValue({
      //     availableInPorts: "",
      //     availableOutPorts: "",
      //     totalInPorts: "",
      //     totalOutPorts: "",
      //   });
    } else {
      this.ifSpliterInputShow = false;
      //   this.networkDeviceGroupForm.get("availableInPorts").patchValue(0);
      //   this.networkDeviceGroupForm.get("availableOutPorts").patchValue(0);
      //   this.networkDeviceGroupForm.get("totalInPorts").patchValue(0);
      //   this.networkDeviceGroupForm.get("totalOutPorts").patchValue(0);
    }
  }

  filterProductsByDeviceType(deviceType) {
    const url = `/product/filterProductsByDeviceType?deviceType=${deviceType}`;
    this.productManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.productDeviceData = response.dataList; // Assuming `dataList` holds the filtered products
        if (deviceType !== "Fiber") {
          this.ifSpliterInputShow = true;
          this.isTotalPort = true;
          // You can reset or modify form fields here if needed
        } else {
          this.ifSpliterInputShow = false;
          // Optionally patch form fields for "Fiber" type
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

  getnetworkData(networkDeviceId: any) {
    this.networkDeviceDetails = [];
    this.ifNetwortDetails = true;
    this.ifPersonalPerentDeviceShow = false;
    this.IfPersonalNetworkDataShow = true;

    if (networkDeviceId) {
      const url = "/NetworkDevice/" + networkDeviceId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.networkdeviceService.getMethod(url).subscribe(
        (response: any) => {
          this.networkDeviceDetails = response.data;
          // this.serviceAreaName = response.data.servicearea.name
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

  onKeyTotalPort(e: any) {
    if (this.networkDeviceGroupForm.value.totalPorts >= 0) {
      this.networkDeviceGroupForm.patchValue({
        availablePorts: this.networkDeviceGroupForm.value.totalPorts
      });
    }
  }

  onKeyTotalInPort(e: any) {
    if (this.networkDeviceGroupForm.value.totalInPorts >= 0) {
      this.networkDeviceGroupForm.patchValue({
        availableInPorts: this.networkDeviceGroupForm.value.totalInPorts
      });
    }
  }
  onKeyTotalOutPort(e: any) {
    if (this.networkDeviceGroupForm.value.totalOutPorts >= 0) {
      this.networkDeviceGroupForm.patchValue({
        availableOutPorts: this.networkDeviceGroupForm.value.totalOutPorts
      });
    }
  }
  NetworkDeatilsClear() {
    this.ifPersonalPerentDeviceShow = false;
    this.IfPersonalNetworkDataShow = false;
    this.ifServiceAreaListShow = false;
    this.ifChildListShow = false;
  }

  personalNetworkData() {
    this.ifPersonalPerentDeviceShow = false;
    this.IfPersonalNetworkDataShow = true;
    this.ifServiceAreaListShow = false;
    this.ifChildListShow = false;
  }

  serviceareListShow() {
    this.ifServiceAreaListShow = true;
    this.ifPersonalPerentDeviceShow = false;
    this.IfPersonalNetworkDataShow = false;
    this.ifChildListShow = false;
  }
  childDeviceListShow() {
    this.ifServiceAreaListShow = false;
    this.ifPersonalPerentDeviceShow = false;
    this.IfPersonalNetworkDataShow = false;
    this.ifChildListShow = true;
  }
  networkHierarchyDevice(data) {
    this.data1 = [];
    this.parentDeviceData = [];
    this.childrenDeviceData = [];
    this.children1DeviceData = [];
    this.networkDeviceId = data.id;
    let childAllData: any = [];
    let childCount: any = [];
    let childrenlength: any = [];
    const url = "/NetworkDevice/deviceHierarchy?id=" + data.id;
    this.netWorkHierarchyName = data.name;
    this.isHierarchyDiagramVisible = true;
    this.showDiagram = true;
    this.ifPersonalPerentDeviceShow = true;
    this.IfPersonalNetworkDataShow = true;
    this.ifServiceAreaListShow = false;
    this.ifChildListShow = false;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        this.data1 = response.data;
        // let parentDeviceData = response.data.parent;
        // childrenlength = response.data.children;
        // if (childrenlength.length > 0) {
        //   for (let i = 0; childrenlength.length > i; i++) {
        //     childCount = {
        //       type: "person",
        //       expanded: true,
        //       key: this.index.toString(),
        //       data: {
        //         // name: childrenlength[i].otherDevicePort,
        //         // id: childrenlength[i].otherDeviceId,
        //         name: childrenlength[i].currentDevicePort,
        //         id: childrenlength[i].currentDeviceId,
        //       },
        //     };
        //     this.index++;
        //     childAllData.push(childCount);
        //   }
        //   this.data1 = [
        //     {
        //       type: "person",
        //       expanded: true,
        //       key: "0",
        //       data: {
        //         // name: childrenlength[0].currentDevicePort,
        //         // id: childrenlength[0].currentDeviceId,
        //         name: childrenlength[0].otherDevicePort,
        //         id: childrenlength[0].otherDeviceId,
        //       },
        //       children: childAllData,
        //     },
        //   ];
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
    let getDeviceHierarchyMappingUrl = "/NetworkDevice/getDeviceHierarchyMappingById?id=" + data.id;
  }

  findPathBykey(tree: any, key: string, curPath: string[] = []): string[] | undefined {
    if (tree.key === key) return curPath;
    const children = tree.children ?? {};
    for (let k in children) {
      const possibleAnswer = this.findPathBykey(children[k], key, [...curPath, k]);
      if (possibleAnswer) return possibleAnswer;
    }
    return undefined;
  }

  onNodeSelect(event) {
    this.show = false;
    let indexArray = this.findPathBykey(this.data1[0], event.node.key);

    this.addNewHierarchy(event.node, indexArray, event.node.key);
  }

  addNewHierarchy(node, indexArray, key) {
    let childAllData: any = [];
    let childCount: any = [];
    let childrenlength: any = [];
    let parentDeviceData = [];

    const url = "/NetworkDevice/hierarchy?id=" + node.data.id;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        parentDeviceData = response.data.parent;
        childrenlength = response.data.children;
        if (childrenlength.length == 0) {
          this.show = true;

          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Children data is not available",
            icon: "far fa-times-circle"
          });
        } else {
          for (let i = 0; childrenlength.length > i; i++) {
            childCount = {
              type: "person",
              expanded: true,
              key: this.index.toString(),
              data: {
                name: childrenlength[i].currentDevicePort,
                id: childrenlength[i].currentDeviceId
                // name: childrenlength[i].otherDevicePort,
                // id: childrenlength[i].otherDeviceId,
              }
            };
            this.index++;

            childAllData.push(childCount);
          }
          let node = `this.data1[0]` as any;
          let a = "";
          for (let index = 0; index < indexArray.length; index++) {
            a = a + `.children[${indexArray[Number(index)]}]`;
          }

          node = `${node}${a}`;

          this.da = eval(node);
          this.da["children"] = childAllData;

          this.data1[0].children[Number(indexArray[key])] = this.da;

          this.data1 = [this.data1[0]];
          this.show = true;
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
  totalInPorts: FormArray;
  totalOutPorts: FormArray;
  inForm: FormGroup;
  outForm: FormGroup;
  getAvailableParentData: any = [];
  availableParentList: any = [];
  selectedDeviceId: number;
  allNetworkDeviceData: any;
  selecetedData: any;
  availableInPorts: any;
  availableOutPorts: any;
  basicInPorts: any = [];
  basicOutPorts: any = [];
  inFlag: boolean = false;
  outFlag: boolean = false;
  submittedIn: boolean = false;
  submittedOut: boolean = false;
  deviceName: string;
  deviceId: any;

  clearParentDeviceMapping() {
    this.inForm.reset();
    this.outForm.reset();
  }
  parentDeviceMapping(data: any) {
    this.inForm.reset();
    this.outForm.reset();
    this.selecetedData = data;
    this.selectedDeviceId = data.id;
    this.inFlag = false;
    this.outFlag = false;
    this.submittedIn = false;
    this.submittedOut = false;
    this.deviceName = data.name;
    this.deviceId = data.id;
    this.currentParentPorts(data.id, "IN");
    this.currentParentPorts(data.id, "OUT");
    this.getChildParentPortDetails(data.id);
    this.totalInPorts = this.fb.array([]);
    this.totalOutPorts = this.fb.array([]);
    const url = `/NetworkDevice/boundParents?id=${data.id}`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        if (response.dataList.length > 0) {
          for (let index = 0; index < data.totalPorts + 1; index++) {
            response.dataList.forEach(element => {
              if (element.portType == "IN") {
                if (element.inBind == `I${index}`) {
                  this.totalInPorts.push(
                    this.fb.group({
                      inBind: `I${index}`,
                      outBind: element.outBind,
                      parentDeviceId: element.parentDeviceId,
                      flag: true
                    })
                  );
                }
                if (element.outBind == `I${index}`) {
                  this.totalInPorts.push(
                    this.fb.group({
                      inBind: element.outBind,
                      outBind: element.inBind,
                      parentDeviceId: element.parentDeviceId,
                      flag: true
                    })
                  );
                }
                //  else {
                //   this.totalInPorts.push(
                //     this.fb.group({
                //       inBind: `I${index}`,
                //       outBind: "",
                //       parentDeviceId: "",
                //       flag: false,
                //     })
                //   );
                // }
              }
            });
          }
          for (let index = 0; index < data.totalPorts + 1; index++) {
            response.dataList.forEach(element => {
              if (element.portType == "OUT") {
                if (element.outBind == `O${index}`) {
                  this.totalOutPorts.push(
                    this.fb.group({
                      inBind: element.inBind,
                      outBind: `O${index}`,
                      parentDeviceId: element.parentDeviceId,
                      flag: true
                    })
                  );
                }
                if (element.inBind == `O${index}`) {
                  this.totalOutPorts.push(
                    this.fb.group({
                      inBind: element.outBind,
                      outBind: element.inBind,
                      parentDeviceId: element.parentDeviceId,
                      flag: true
                    })
                  );
                }
                // else {
                //   this.totalOutPorts.push(
                //     this.fb.group({
                //       inBind: "",
                //       outBind: `O${index}`,
                //       parentDeviceId: "",
                //       flag: false,
                //     })
                //   );
                // }
              }
            });
          }
        }
        // else {
        //   for (let index = 1; index < data.totalInPorts; index++) {
        //     this.totalInPorts.push(
        //       this.fb.group({
        //         inBind: `I${index}`,
        //         outBind: "",
        //         parentDeviceId: "",
        //         flag: false,
        //       })
        //     );
        //   }
        //   for (let index = 1; index < data.totalOutPorts; index++) {
        //     this.totalOutPorts.push(
        //       this.fb.group({
        //         inBind: "",
        //         outBind: `O${index}`,
        //         parentDeviceId: "",
        //         flag: false,
        //       })
        //     );
        //   }
        // }
        // this.totalInPorts.value.forEach((e: any, i) => {
        //   response.dataList.forEach((element) => {
        //     if (element.portType == "IN") {
        //       if (element.inBind == element.inbind) {
        //         this.totalInPorts.at(i).patchValue(
        //           this.fb.group({
        //             inBind: element.inBind,
        //             outBind: element.outBind,
        //             parentDeviceId: element.parentDeviceId,
        //             flag: true,
        //           })
        //         );
        //       }
        //     }
        //   });
        // });
        // this.totalOutPorts.value.forEach((e: any, i) => {
        //   response.dataList.forEach((element) => {
        //     if (element.portType == "OUT") {
        //       if (element.outBind == element.outBind) {
        //         this.totalOutPorts.at(i).patchValue(
        //           this.fb.group({
        //             inBind: element.inBind,
        //             outBind: element.outBind,
        //             parentDeviceId: element.parentDeviceId,
        //             flag: true,
        //           })
        //         );
        //       }
        //     }
        //   });
        // });

        this.getAllParent();
        this.getAvailableParent();
        this.selectParentModal = true;
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

  getAllParent() {
    const url = `/NetworkDevice/all?mvnoId=${localStorage.getItem("mvnoId")}`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        this.allNetworkDeviceData = response.dataList;
        // this.availableParentList = this.networkDeviceListData;
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
  getAllProducttype() {
    const url = `/product/getAllNetworkDeviceProduct`;
    this.productManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.productDeviceData = response.dataList;
        // this.availableParentList = this.networkDeviceListData;
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
  getInwardList(productID) {
    const staffId = localStorage.getItem("userId");
    this.SelectInwardData = [];

    this.networkdeviceService.getAllInwardByProduct(productID).subscribe(
      (res: any) => {
        this.SelectInwardData = res.dataList;
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

  productTypeEvent(event) {
    // this.ifSpliterInputShow = true;

    // this.unit = this.products.find((element) => element.id == event.value).unit;
    // this.getInwardList(event.value);
    this.getproductById(event.value);
  }

  // getAllInward() {
  //
  //   const url = `/NetworkDevice/getAllInwardByProductAndStaff`;
  //   this.networkdeviceService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.SelectInwardData= response.dataList;
  //       // this.availableParentList = this.networkDeviceListData;
  //
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }
  getAvailableParent() {
    const url = `/NetworkDevice/availableParents?id=${this.selectedDeviceId}&mvnoId=${localStorage.getItem("mvnoId")}`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        this.availableParentList = response.dataList;
        // this.availableParentList = this.networkDeviceListData;
        // this.checkPorts();
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
  checkPorts() {
    this.totalInPorts.value.forEach(element => {
      this.availableParentList.forEach((e, index) => {
        if (e.id == element.parentDeviceId) {
          this.availableParentList.splice(index, 1);
        }
      });
    });
    this.totalOutPorts.value.forEach(element => {
      this.availableParentList.forEach((e, index) => {
        if (e.id == element.parentDeviceId) {
          this.availableParentList.splice(index, 1);
        }
      });
    });
  }
  selectParent(e, type) {
    const url = `/NetworkDevice/checkPortAvailability?parentDeviceId=${e.value}&parentPortType=${type}`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        if (type == "IN") {
          this.availableInPorts =
            response.dataList != null
              ? response.dataList.filter((item: string) => item.includes("IN-Port"))
              : response.dataList;
          this.outFlag = true;
        } else {
          this.availableOutPorts =
            response.dataList != null
              ? response.dataList.filter((item: string) => item.includes("OUT-Port"))
              : response.dataList;
          this.inFlag = true;
        }
      },
      (error: any) => this.spinner.hide()
    );
  }
  currentParentPorts(e, type) {
    const url = `/NetworkDevice/checkPortAvailability?parentDeviceId=${e}&parentPortType=${type}`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        if (type == "IN") {
          this.basicInPorts =
            response.dataList != null
              ? response.dataList.filter((item: string) => item.includes("IN-Port"))
              : response.dataList;

          this.updateParentInPortdata =
            this.basicInPorts.length < 0
              ? [...this.basicInPorts]
              : this.basicInPorts.map(ele => ({
                  id: ele,
                  name: ele
                }));
          //   this.updateChildOutPortdata = [...this.updateParentInPortdata];
        } else {
          this.basicOutPorts =
            response.dataList != null
              ? response.dataList.filter((item: string) => item.includes("OUT-Port"))
              : response.dataList;
          this.updateChildInPortdata =
            this.basicOutPorts.length < 0
              ? [...this.basicOutPorts]
              : this.basicOutPorts.map(ele => ({
                  id: ele,
                  name: ele
                }));
          //   this.updateParentOutPortdata = [...this.updateChildInPortdata];
        }
      },
      (error: any) => this.spinner.hide()
    );
  }

  connectParent(event) {
    this.networkDeviceGroupForm.controls.devicetype.setValue("");

    // let data = {
    //   deviceId: this.selectedDeviceId,
    //   inPortDevices: inData,
    //   outPortDevices: outData,
    // };

    let data = {
      currentDeviceId: this.selectedDeviceId,
      currentDevicePort: this.inForm.controls.inBind.value,
      otherDeviceId: this.inForm.controls.parentDeviceId.value,
      otherDevicePort: this.inForm.controls.outBind.value,
      portType: "IN"
    };

    if (this.inForm.valid) {
      const url = `/NetworkDevice/saveMappingData`;
      this.networkdeviceService.postMethod(url, data).subscribe(
        (response: any) => {
          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            this.inForm.reset();
            this.outForm.reset();
          } else {
            this.inForm.reset();
            this.outForm.reset();
            this.parentDeviceMapping(this.selecetedData);
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

  connectChild(event) {
    this.networkDeviceGroupForm.controls.devicetype.setValue("");

    // let data = {
    //   deviceId: this.selectedDeviceId,
    //   inPortDevices: inData,
    //   outPortDevices: outData,
    // };

    let data = {
      currentDeviceId: this.selectedDeviceId,
      currentDevicePort: this.outForm.controls.outBind.value,
      otherDeviceId: this.outForm.controls.parentDeviceId.value,
      otherDevicePort: this.outForm.controls.inBind.value,
      portType: "OUT"
    };

    if (this.outForm.valid) {
      const url = `/NetworkDevice/saveMappingData`;
      this.networkdeviceService.postMethod(url, data).subscribe(
        (response: any) => {
          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            this.inForm.reset();
            this.outForm.reset();
          } else {
            this.inForm.reset();
            this.outForm.reset();
            this.parentDeviceMapping(this.selecetedData);
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

  canExit() {
    if (!this.networkDeviceGroupForm.dirty) return true;
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
  getServiceArea() {
    const url = "/serviceArea/getAllServiceAreaByStaff";
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.serviceAreaList = response.dataList;
        //
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
  totalPortValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }

  updateNameAndPort(event: any, isParent) {
    this.parentChildPortModal = true;
    this.isParent = isParent;
  }

  getChildParentPortDetails(id) {
    this.childPortData = [];
    this.parentPortData = [];
    let url = `/NetworkDevice/getNetworkDeviceBindByCurrentDeviceId?id=${id}`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        this.childPortData = response.data.filter(
          device => device.portType.toLowerCase() === "out"
        );
        this.parentPortData = response.data.filter(
          device => device.portType.toLowerCase() === "in"
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

  deletePort(id) {
    let url = `/NetworkDevice/deleteNetworkDeviceBindById?id=${id}`;
    this.networkdeviceService.deleteMethod(url).subscribe(
      (response: any) => {
        this.getChildParentPortDetails(this.deviceId);
        this.currentParentPorts(this.deviceId, "IN");
        this.currentParentPorts(this.deviceId, "OUT");
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

  getproductById(productId) {
    let url = `/product/${productId}`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
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

    this.networkDeviceGroupForm.patchValue({
      availableInPorts: availableInPorts,
      availableOutPorts: availableOutPorts,
      totalInPorts: totalInPorts,
      totalOutPorts: totalOutPorts
    });
  }

  isEditing(rowIndex: number): boolean {
    return rowIndex === this.editedRowIndex;
  }

  editValue(rowIndex: number, parameter, isParent: boolean) {
    this.editedRowIndex = rowIndex;
    if (isParent) {
      this.getParentPort(parameter, isParent);

      let parentIndata = {
        id: parameter.currentDevicePort,
        name: parameter.currentDevicePort
      };
      this.updateParentInPortdata.push(parentIndata);
      this.selectedParentInPortdata = parentIndata.id;

      //   let parentOutdata = {
      //     id: parameter.otherDevicePort,
      //     name: parameter.otherDevicePort,
      //   };
      //   this.updateParentOutPortdata.push(parentOutdata);
      //   this.selectedParentOutPortdata = parentOutdata.id;
    } else {
      this.getParentPort(parameter, isParent);

      let childIndata = {
        id: parameter.currentDevicePort,
        name: parameter.currentDevicePort
      };
      this.updateChildInPortdata.push(childIndata);
      this.selectedChildInPortdata = childIndata.id;

      //   let childOutdata = {
      //     id: parameter.otherDevicePort,
      //     name: parameter.otherDevicePort,
      //   };
      //   this.updateChildOutPortdata.push(childOutdata);
      //   this.selectedChildOutPortdata = childOutdata.id;
    }
  }

  updateValue(rowIndex: number, inventorydata, isParent: boolean) {
    let request;
    if (isParent) {
      request = {
        id: inventorydata.id,
        currentDeviceId: inventorydata.currentDeviceId,
        currentDevicePort: this.selectedParentInPortdata,
        otherDeviceId: inventorydata.otherDeviceId,
        otherDevicePort: this.selectedParentOutPortdata
      };
    } else {
      request = {
        id: inventorydata.id,
        currentDeviceId: inventorydata.currentDeviceId,
        currentDevicePort: this.selectedChildInPortdata,
        otherDeviceId: inventorydata.otherDeviceId,
        otherDevicePort: this.selectedChildOutPortdata
      };
    }

    let url = `/NetworkDevice/changeNetworkDeviceBinding`;
    this.networkdeviceService.updateMethod(url, request).subscribe(
      (response: any) => {
        this.editedRowIndex = -1;
        this.getChildParentPortDetails(this.deviceId);
        this.currentParentPorts(this.deviceId, "IN");
        this.currentParentPorts(this.deviceId, "OUT");
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

  closePortDetailsModel() {
    this.editedRowIndex = -1;
    this.parentChildPortModal = false;
  }

  closeNetworkDiagramModel() {
    this.isHierarchyDiagramVisible = false;
  }

  getParentPort(data, isParent) {
    let filter;
    if (isParent) {
      filter = "OUT-Port";
    } else {
      filter = "IN-Port";
    }
    const url = `/NetworkDevice/checkPortAvailability?parentDeviceId=${data.otherDeviceId}&parentPortType=IN`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        this.updateParentOutPortdata =
          response.dataList != null
            ? response.dataList
                .filter((item: string) => item.includes(filter))
                .map(ele => ({
                  id: ele,
                  name: ele
                }))
            : response.dataList;

        this.updateChildOutPortdata = [...this.updateParentOutPortdata];

        let Outdata = {
          id: data.otherDevicePort,
          name: data.otherDevicePort
        };
        this.updateParentOutPortdata.push(Outdata);
        this.selectedParentOutPortdata = Outdata.id;

        this.updateChildOutPortdata.push(Outdata);
        this.selectedChildOutPortdata = Outdata.id;
      },
      (error: any) => {}
    );
  }

  modalOpenParentDevice(deviceType) {
    this.isparentChildDeviceModelOpen = true;
    this.deviceType = deviceType;
  }

  modalCloseParentDevice() {
    this.isparentChildDeviceModelOpen = false;
  }

  removeSelectedparentDevice(deviceType) {
    if (this.deviceType === "Parent") {
      this.inForm.patchValue({
        parentDeviceId: ""
      });
      this.availableOutPorts = "";
    } else {
      this.outForm.patchValue({
        parentDeviceId: ""
      });
      this.availableInPorts = "";
    }
  }

  selectedDeviceChange(selectedDevice) {
    if (this.deviceType === "Parent") {
      this.inForm.patchValue({
        parentDeviceId: selectedDevice.id
      });

      var event = {
        value: selectedDevice.id
      };
      this.selectParent(event, "OUT");
    } else {
      this.outForm.patchValue({
        parentDeviceId: selectedDevice.id
      });

      var event = {
        value: selectedDevice.id
      };
      this.selectParent(event, "IN");
    }
  }

  closeParentMappingModel() {
    this.selectParentModal = false;
  }

  showDiagram = true;
  mappingLoaded = false;

  openHierarchyDialog() {
    this.isHierarchyDiagramVisible = true;
    this.showDiagram = true;
    this.mappingLoaded = false;
    this.hierarchyMappingList = [];
  }

  showHierarchyMappingList(deviceId: number) {
    const url = `/NetworkDevice/getDeviceHierarchyMappingById?id=${deviceId}`;
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        this.hierarchyMappingList = response.dataList || [];
        this.showDiagram = false; // hide diagram
        this.mappingLoaded = true;
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

  exportNetMapping() {
    import("xlsx").then(xlsx => {
      const parentHeaders = [
        "Name",
        "Port Number",
        "Device Type",
        "Owner Type",
        "MAC Address",
        "Serial Number"
      ];
      const childHeaders = [
        "Name",
        "Port Number",
        "Device Type",
        "Owner Type",
        "MAC Address",
        "Serial Number"
      ];

      // Header row 1 with group titles
      const headerRow1 = [
        ...Array(parentHeaders.length).fill("Parent Device Details"),
        ...Array(childHeaders.length).fill("Child Device Details")
      ];

      // Header row 2 with actual column names
      const headerRow2 = [...parentHeaders, ...childHeaders];

      // Data rows
      const dataRows = this.hierarchyMappingList.map((ele: any) => [
        ele?.parentDeviceName || "-",
        ele?.parentDevicePortNumber || "-",
        ele?.parentDeviceType || "-",
        ele?.parentDeviceOwnerType || "-",
        ele?.parentDeviceMacAddress || "-",
        ele?.parentDeviceSerialNumber || "-",

        ele?.childDeviceName || "-",
        ele?.childDevicePortNumber || "-",
        ele?.childDeviceType || "-",
        ele?.childDeviceOwnerType || "-",
        ele?.childDeviceMacAddress || "-",
        ele?.childDeviceSerialNumber || "-"
      ]);

      const allRows = [headerRow1, headerRow2, ...dataRows];
      const worksheet = xlsx.utils.aoa_to_sheet(allRows);

      // Merge cells for grouped headers
      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Parent Device Details (6 columns)
        { s: { r: 0, c: 6 }, e: { r: 0, c: 11 } } // Child Device Details (6 columns)
      ];

      const workbook = {
        Sheets: { "Device Hierarchy": worksheet },
        SheetNames: ["Device Hierarchy"]
      };
      const excelBuffer: any = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
      this.saveAsExcelFile(excelBuffer, "Device_Hierarchy");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + "_Export_" + new Date().getTime() + EXCEL_EXTENSION);
  }
}
