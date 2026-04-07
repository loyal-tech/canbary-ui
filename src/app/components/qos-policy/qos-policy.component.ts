import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { QosPolicyManagement } from "src/app/components/model/qos-policy";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import { LoginService } from "src/app/service/login.service";
import { QosPolicyService } from "src/app/service/qos-policy.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { NMSService } from "src/app/service/nms.service";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
declare var $: any;
@Component({
  selector: "app-qos-policy",
  templateUrl: "./qos-policy.component.html",
  styleUrls: ["./qos-policy.component.css"]
})
export class QosPolicyComponent implements OnInit {
  qosPolicyGroupForm: FormGroup;
  submitted: boolean = false;
  searchSubmitted = false;
  createQosPolicyData: QosPolicyManagement;
  qosPolicyListData: any;
  currentPageQosPolicyListdata = 1;
  qosPolicyListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  qosPolicyListdatatotalRecords: any;
  isQosPolicyEdit: boolean = false;
  viewQosPolicyListData: any;
  filteredUpstreamProfile: any[] = [];
  filteredDownstreamProfile: any[] = [];
  qosPolicyData: any = {
    name: "",
    thpolicyname: "",
    basepolicyname: "",
    description: "",
    gatewayName: "",
    downloadSpeed: "",
    uploadSpeed: "",
    baseDownloadSpeed: "",
    baseUploadSpeed: "",
    throttleDownloadSpeed: "",
    throttleUploadSpeed: "",
    thparam1: "",
    thparam2: "",
    thparam3: "",
    baseparam1: "",
    baseparam2: "",
    baseparam3: "",
    type: "",
    qosspeed: ""
  };

  listView: boolean = true;
  createView: boolean = false;
  detailView: boolean = false;
  isUpStreamDetailView: boolean = false;

  deletedata: any = {
    id: "",
    name: "",
    thpolicyname: "",
    thparam1: "",
    thparam2: "",
    thparam3: "",
    description: "",
    gatewayName: "",
    downloadSpeed: "",
    uploadSpeed: "",
    baseDownloadSpeed: "",
    baseUploadSpeed: "",
    throttleDownloadSpeed: "",
    throttleUploadSpeed: "",
    basepolicyname: "",
    baseparam1: "",
    baseparam2: "",
    baseparam3: ""
  };
  AclClassConstants;
  AclConstants;
  searchName: any = "";
  searchData: any;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  inputMobile: string;
  totalAreaListLength = 0;
  gatewayAtrribute: FormArray;
  allowedGateway: number;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  upStreamType: any;
  upStreamprofilename: any;
  downStreamProfilename: any;
  assuredbandwidth: any;
  bandwidthUnit: any;
  bandwidthValue: any;
  commistedBustsize: any;
  peakBustsize: any;
  upStreamProfileData: any[] = [];
  downStreamProfileData: any[] = [];
  upStreamProfileDataList: any[] = [];
  mvnoTitle = RadiusConstants.MVNO;
  mvnoId = Number(localStorage.getItem("mvnoId"));
  UpProfilename = false;
  DownProfilename = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private qosPolicyService: QosPolicyService,
    public loginService: LoginService,
    private configService: SystemconfigService,
    public commondropdownService: CommondropdownService,
    private systemService: SystemconfigService,
    private nmsService: NMSService
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.QOS_POLICY_CREATE);
    this.deleteAccess = loginService.hasPermission(PRODUCTS.QOS_POLICY_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.QOS_POLICY_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isQosPolicyEdit = !this.createAccess && this.editAccess ? true : false;
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.gatewayAtrribute = this.fb.array([]);
    this.createGatewayMappingGroup();
    this.configService.getConfigurationByName("GATEWAY_SUPPORT_COUNT").subscribe((res: any) => {
      if (res.data) {
        this.allowedGateway = Number(res.data.value);
      }
    });
  }

  ngOnInit(): void {
    this.qosPolicyGroupForm = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      thpolicyname: ["", Validators.required],
      thparam1: ["", Validators.required],
      thparam2: ["", Validators.required],
      thparam3: ["", Validators.required],
      description: ["", [Validators.required, Validators.pattern(Regex.characterlength100)]],
      basepolicyname: ["", Validators.required],
      baseparam1: ["", Validators.required],
      baseparam2: ["", Validators.required],
      baseparam3: ["", Validators.required],
      type: [""],
      qosspeed: ["", Validators.required],
      upstreamprofileuid: [""],
      downstreamprofileuid: [""],
      upstreamprofileName: [""],
      downstreamprofileName: [""],
      mvnoId: [""]
    });
    const mvnoControl = this.qosPolicyGroupForm.get("mvnoId");

    if (this.mvnoId === 1) {
      //   mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      //   mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();

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
    this.onAddOfGatwayMapping();
    this.getQosPolicyList("");
    this.systemService.getConfigurationByName("NMS_ENABLE").subscribe((res: any) => {
      if (res.data) {
        this.isUpStreamDetailView = res.data.value === "true" ? true : false;
        if (this.isUpStreamDetailView) {
          this.removeValidators();
          this.qosPolicyGroupForm.controls.upstreamprofileuid.setValidators(Validators.required);
          this.qosPolicyGroupForm.controls.downstreamprofileuid.setValidators(Validators.required);
        }
      }
    });
  }

  removeValidators() {
    this.gatewayAtrribute.controls.forEach(control => {
      const formGroup = control as FormGroup;

      Object.keys(formGroup.controls).forEach(key => {
        formGroup.get(key)?.setValidators(null);
        formGroup.get(key)?.updateValueAndValidity();
      });
    });
  }

  createQosPolicy() {
    this.gatewayAtrribute = this.fb.array([]);
    this.createView = true;
    this.listView = false;
    this.detailView = false;
    this.submitted = false;
    this.qosPolicyGroupForm.reset();
    this.isQosPolicyEdit = false;
    this.viewQosPolicyListData = [];
    this.upStreamProfileData = [];
    this.downStreamProfileData = [];
    this.assuredbandwidth = "";
    this.bandwidthUnit = "";
    this.bandwidthValue = "";
    if (!this.isUpStreamDetailView) {
      this.onAddOfGatwayMapping();
    }
  }

  searchQosPolicy() {
    this.createView = false;
    this.listView = true;
    this.detailView = false;
  }

  qosPolicyDetail(id) {
    this.createView = false;
    this.listView = false;
    this.detailView = true;
    this.getQosPolicyById(id);
  }

  addEditQosPolicy(qosPolicyId) {
    this.submitted = true;
    if (this.gatewayAtrribute.length > 0 || this.isUpStreamDetailView) {
      if (this.qosPolicyGroupForm.valid && this.gatewayAtrribute.valid) {
        if (qosPolicyId) {
          let mvnoId =
            Number(localStorage.getItem("mvnoId")) === 1
              ? this.qosPolicyGroupForm.value?.mvnoId == null
                ? Number(localStorage.getItem("mvnoId"))
                : this.qosPolicyGroupForm.value?.mvnoId
              : localStorage.getItem("mvnoId");

          const url = "/qosPolicy/update?mvnoId=" + mvnoId;
          this.viewQosPolicyListData = this.qosPolicyGroupForm.value;
          this.viewQosPolicyListData.qosPolicyGatewayMappingList = this.gatewayAtrribute.value;
          this.viewQosPolicyListData.id = qosPolicyId;
          this.viewQosPolicyListData.mvnoId = mvnoId;
          this.qosPolicyService.postMethod(url, this.viewQosPolicyListData).subscribe(
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
                this.qosPolicyGroupForm.reset();
                this.isQosPolicyEdit = false;
                this.createView = false;
                this.commondropdownService.clearCache(
                  "/qosPolicy/all?mvnoId=" + localStorage.getItem("mvnoId")
                );
                // this.listView = true;
                this.getQosPolicyList("");
                this.viewQosPolicyListData = [];
                this.gatewayAtrribute = this.fb.array([]);
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle"
                });
                this.getQosPolicyList("");
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
          let mvnoId =
            Number(localStorage.getItem("mvnoId")) === 1
              ? this.qosPolicyGroupForm.value?.mvnoId == null
                ? Number(localStorage.getItem("mvnoId"))
                : this.qosPolicyGroupForm.value?.mvnoId
              : localStorage.getItem("mvnoId");

          const url = "/qosPolicy/save?mvnoId=" + mvnoId;
          this.createQosPolicyData = this.qosPolicyGroupForm.value;
          this.createQosPolicyData.mvnoId = mvnoId;
          this.createQosPolicyData.qosPolicyGatewayMappingList = this.gatewayAtrribute.value;
          this.qosPolicyService.postMethod(url, this.createQosPolicyData).subscribe(
            (response: any) => {
              if (
                response.responseCode == 500 ||
                response.responseCode == 417
              ) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });            
              } 
                else if(response.responseCode == 406){
                  this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
                }else {
                this.submitted = false;
                this.qosPolicyGroupForm.reset();
                this.createView = false;
                this.listView = true;
                this.commondropdownService.clearCache(
                  "/qosPolicy/all?mvnoId=" + localStorage.getItem("mvnoId")
                );
                this.gatewayAtrribute = this.fb.array([]);
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle"
                });
                this.getQosPolicyList("");
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Atlease one gateway should be added",
        icon: "far fa-times-circle"
      });
    }
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageQosPolicyListdata > 1) {
      this.currentPageQosPolicyListdata = 1;
    }
    if (!this.searchkey) {
      this.getQosPolicyList(this.showItemPerPage);
    } else {
      this.search();
    }
  }
  getQosPolicyList(list) {
    let size;
    this.listView = true;
    this.searchkey = "";
    let page_list = this.currentPageQosPolicyListdata;
    if (list) {
      size = list;
      this.qosPolicyListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.qosPolicyListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.qosPolicyListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.qosPolicyListdataitemsPerPage;
    }

    const url = "/qosPolicy?mvnoId=" + localStorage.getItem("mvnoId");
    let qospolicydata = {
      page: page_list,
      pageSize: size
    };
    this.qosPolicyService.postMethod(url, qospolicydata).subscribe(
      (response: any) => {
        this.qosPolicyListData = response.dataList;
        this.qosPolicyListdatatotalRecords = response.totalRecords;
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

  async editQosPolicy(qosPolicyId) {
    this.gatewayAtrribute = this.fb.array([]);
    this.createView = true;
    this.listView = false;
    if (qosPolicyId) {
      this.isQosPolicyEdit = true;

      // this.getQosPolicyById(qosPolicyId)
      // setTimeout(() => {
      //   this.qosPolicyGroupForm.patchValue(this.viewQosPolicyListData)
      // }, 1000)
      const upStreamProfileDataList = [];
      const url = "/qosPolicy/" + qosPolicyId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.qosPolicyService.getMethod(url).subscribe(
        (response: any) => {
          this.viewQosPolicyListData = response.data;
          let upStreamProfileName = this.viewQosPolicyListData.upstreamprofileuid;
          let downStreamProfileName = this.viewQosPolicyListData.downstreamprofileuid;
          this.getUpStreamProfiles(upStreamProfileName);
          this.getDownStreamProfiles(downStreamProfileName);
          this.qosPolicyGroupForm.patchValue(this.viewQosPolicyListData);
          if (this.viewQosPolicyListData.qosPolicyGatewayMappingList.length > 0) {
            const clientReplyList = this.viewQosPolicyListData.qosPolicyGatewayMappingList;
            clientReplyList.forEach(element => {
              this.gatewayAtrribute.push(this.fb.group(element));
            });
          }
          this.qosPolicyData = response.data;
          this.deletedata = this.viewQosPolicyListData;
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

  async getQosPolicyById(qosPolicyId) {
    const url = "/qosPolicy/" + qosPolicyId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.qosPolicyService.getMethod(url).subscribe(
      (response: any) => {
        this.viewQosPolicyListData = response.data;
        this.qosPolicyData = response.data;
        this.deletedata = this.viewQosPolicyListData;
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
    if (!this.qosPolicyGroupForm.dirty) return true;
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

  deleteConfirmonQosPolicy(qosPolicyId) {
    this.getQosPolicyById(qosPolicyId);
    if (qosPolicyId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Qos Policy?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteQosPolicy(qosPolicyId);
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

  deleteQosPolicy(qosPolicyId) {
    const url = "/qosPolicy/delete";
    this.deletedata.id = qosPolicyId;
    this.qosPolicyService.postMethod(url, this.deletedata).subscribe(
      (response: any) => {
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
          if (this.currentPageQosPolicyListdata != 1 && this.totalAreaListLength == 1) {
            this.currentPageQosPolicyListdata = this.currentPageQosPolicyListdata - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.getQosPolicyList("");
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

  pageChangedQosPolicyList(pageNumber) {
    this.currentPageQosPolicyListdata = pageNumber;
    if (!this.searchkey) {
      this.getQosPolicyList("");
    } else {
      this.search();
    }
  }

  onAddOfGatwayMapping() {
    if (this.allowedGateway <= this.gatewayAtrribute.length) {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: `Can not add more than ${this.allowedGateway} gateway details.`,
        icon: "far fa-times-circle"
      });
      return;
    } else {
      this.submitted = false;
      this.gatewayAtrribute.push(this.createGatewayMappingGroup());
    }
  }
  deleteConfirmInActiveAttribute(attributeIndex: number) {
    this.gatewayAtrribute.removeAt(attributeIndex);
  }
  createGatewayMappingGroup(): FormGroup {
    return this.fb.group({
      gatewayName: ["", Validators.required],
      downloadSpeed: ["", Validators.required],
      uploadSpeed: ["", Validators.required],
      baseDownloadSpeed: ["", Validators.required],
      baseUploadSpeed: ["", Validators.required],
      throttleDownloadSpeed: ["", Validators.required],
      throttleUploadSpeed: ["", Validators.required],
      qosPolicyId: [""]
    });
  }
  search() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageQosPolicyListdata = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.qosPolicyListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchName.trim();

    const url = `/qosPolicy/search?page=${this.currentPageQosPolicyListdata}&pageSize=${this.qosPolicyListdataitemsPerPage}&sortBy=id&sortOrder=0&mvnoId=${localStorage.getItem("mvnoId")}`;
    this.qosPolicyService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.qosPolicyListData = response.dataList;
        this.qosPolicyListdatatotalRecords = response.totalRecords;

        this.createView = false;
        this.listView = true;
        this.detailView = false;
      },
      (error: any) => {
        this.createView = false;
        this.listView = true;
        this.detailView = false;
        this.qosPolicyListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.qosPolicyListData = [];
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
  clearSearch() {
    this.searchName = "";
    this.searchkey = "";
    this.getQosPolicyList("");
    this.submitted = false;
    this.isQosPolicyEdit = false;
    this.createView = false;
    this.listView = true;
    this.detailView = false;
    this.qosPolicyGroupForm.reset();
  }

  onKeymobilelength(event) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  upProfileLeave() {
    let profileType = this.qosPolicyGroupForm.controls.upstreamprofileName.value;
    this.getUpStreamProfiles(profileType);
  }

  downProfileLeave() {
    let profileType = this.qosPolicyGroupForm.controls.downstreamprofileName.value;
    this.getDownStreamProfiles(profileType);
  }

  getUpStreamProfiles(profileType) {
    this.upStreamProfileData = [];
    this.filteredUpstreamProfile = [];
    if (profileType) {
      this.nmsService.getUpStreamProfileByType(profileType).subscribe(
        (response: any) => {
          if (response.responseCode == "200") {
            this.upStreamProfileData = response.dataList;

            this.filteredUpstreamProfile = this.upStreamProfileData.find(
              obj => obj["profile-name"] === profileType
            );
            //   console.log(this.upStreamProfileData);
            if (this.filteredUpstreamProfile) {
              this.assuredbandwidth = this.filteredUpstreamProfile["assured-bandwidth"];
              this.bandwidthUnit = this.filteredUpstreamProfile["bandwidth-unit"];
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

  getDownStreamProfiles(profileType) {
    this.downStreamProfileData = [];
    this.filteredDownstreamProfile = [];
    if (profileType) {
      this.nmsService.getDownStreamProfileByType(profileType).subscribe(
        (response: any) => {
          if (response.responseCode == "200") {
            this.downStreamProfileData = response.dataList;
            this.downStreamProfilename = profileType;
            this.filteredDownstreamProfile = this.downStreamProfileData.find(
              obj => obj["uuid"] === profileType
            );
            if (this.filteredDownstreamProfile) {
              this.bandwidthValue =
                this.filteredDownstreamProfile["committed-information-rate"].value;
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

  onDropdownChange(event: any, downStreamProfileData) {
    const selectedValue = event.value;
    this.upStreamprofilename = event.value;
    this.filteredUpstreamProfile = downStreamProfileData.find(
      obj => obj["profile-name"] === this.upStreamprofilename
    );
    this.assuredbandwidth = this.filteredUpstreamProfile["assured-bandwidth"];
    this.bandwidthUnit = this.filteredUpstreamProfile["bandwidth-unit"];
  }

  getUpStreamProfileData(name, upStreamprofilename) {
    this.filteredUpstreamProfile = name.find(
      obj => obj["profile-name"] === this.qosPolicyGroupForm.value.upstreamprofileuid
    );
    this.UpProfilename = true;
  }

  ondownstramDropdownChange(event: any, downstream) {
    const selectedValue = event.value;
    this.downStreamProfilename = event.value;
    this.filteredDownstreamProfile = downstream.find(obj => obj["uuid"] === selectedValue);
    this.bandwidthValue = this.filteredDownstreamProfile["committed-information-rate"].value;
    // $("#DownProfilename").modal("show");
  }

  getDownStreamProfileData(name, downstream) {
    this.filteredDownstreamProfile = downstream.find(obj => obj["uuid"] === name);
    this.bandwidthValue = this.filteredDownstreamProfile["committed-information-rate"].value;
    this.commistedBustsize = this.filteredDownstreamProfile["committed-burst-size"].value;
    this.peakBustsize = this.filteredDownstreamProfile["peak-burst-size"].value;
    this.DownProfilename = true;
  }

  closeUpstreamProfile(){
    this.UpProfilename =  false;
  }

  CloseDownStream(){
    this.DownProfilename = false;
  }
}
