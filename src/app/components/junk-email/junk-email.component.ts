import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { TicketReasonCategory } from "src/app/components/model/ticket-reason-category";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { JunkEmailService } from "src/app/service/junk-email.service";
import { LoginService } from "src/app/service/login.service";
import { TicketReasonCategoryService } from "src/app/service/ticket-reason-category.service";
import { Dropdown } from "primeng/dropdown";
import { TicketReasonSubCategoryService } from "src/app/service/ticket-reason-sub-category.service";
import { CustomerManagements } from "src/app/components/model/customer";
import { DatePipe } from "@angular/common";
import { TicketManagementService } from "src/app/service/ticket-management.service";
import { SharedModule } from "src/app/shared/shared.module";
import { TICKETING_SYSTEMS } from "src/app/constants/aclConstants";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
declare var $: any;

@Component({
  selector: "app-junk-emaily",
  templateUrl: "./junk-email.component.html",
  styleUrls: ["./junk-email.component.scss"]
})
export class JunkEmailComponent implements OnInit {
  public loginService: LoginService;
  ticketCreateFormGroup: FormGroup;
  serviceData: any;
  planData: any;
  problemDomainList: any;
  subProblemDomainList: any;
  filterPlanList: any;
  currentPageEmailListdata = 1;
  emailListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  emailListDatatotalRecords: any;
  emailListData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  currentPageSize;
  showItemPerPage = 0;
  searchTrcName: any = "sender";
  searchSenderKey: any = "";
  totalDataListLength = 0;
  pageITEM = RadiusConstants.PER_PAGE_ITEMS;
  createTicketSubmitted = false;
  planByServiceArea: any;
  defaultServiceAreaId = RadiusConstants.SERVICEAREA_ID;
  defaultServiceAreaName = "Default";
  selectedServiceName: string = "";
  custType = "Prepaid";
  isCustomerAvailable: boolean = false;
  customerId: any;
  selectedEmail: any;
  descriptionModal: boolean = false;
  description: any;
  createTicketModal: boolean = false;
  isShowAllService: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  customerServiceList: any = [];
  customerPlanList: any = [];
  customerData: any;
  selectedPlan: any;
  searchOption: any = "";
  searchOptionSelect = [
    { label: "All", value: "all" },
    { label: "Unregistered", value: "Unregistered" },
    { label: "Registered", value: "Registered" }
  ];
  isServiceNotAvailable: boolean = false;
  isCustomerCreated: boolean = false;
  serviceAreaData: any;
  plantypaSelectData: any;
  pincodeDD: any;
  areaListDD: any;
  partnerListByServiceArea: any;
  branchData: any;
  isBranchAvailable: boolean;
  isPartnerAvailable: boolean;
  staffList: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ticketReasonCategoryService: TicketReasonCategoryService,
    private junkEmailService: JunkEmailService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService,
    private customerManagementService: CustomermanagementService,
    private ticketSubReasonCategoryService: TicketReasonSubCategoryService,
    public datepipe: DatePipe,
    private ticketManagementService: TicketManagementService,
    public adoptCommonBaseService: AdoptCommonBaseService
  ) {
    this.loginService = loginService;
    // this.getJunkEmailList("");
    // this.getServiceList(this.defaultServiceAreaId);
    // this.getPlanList(this.defaultServiceAreaId);
    this.getBranchByServiceAreaID(this.defaultServiceAreaId);
    this.getPartnerAllByServiceArea(this.defaultServiceAreaId);
    this.commondropdownService.getserviceAreaList();
    // this.commondropdownService.getAllPinCodeNumber();
    this.commondropdownService.getAllPinCodeData();
    this.createAccess = loginService.hasPermission(TICKETING_SYSTEMS.OPEN_OPPORTUNITY_CREATE);
    this.deleteAccess = loginService.hasPermission(TICKETING_SYSTEMS.OPEN_OPPORTUNITY_DELETE);
  }

  ngOnInit(): void {
    this.ticketCreateFormGroup = this.fb.group({
      email: ["", Validators.required],
      domain: [""],
      name: ["", Validators.required],
      service: ["", Validators.required],
      plan: ["", Validators.required],
      problemdomain: ["", Validators.required],
      subproblemdomain: ["", Validators.required],
      subject: [""]
    });

    this.getJunkEmailList("");
    this.getServiceList(this.defaultServiceAreaId);
    this.getPlanList(this.defaultServiceAreaId);
  }

  getJunkEmailList(list) {
    this.emailListData = [];

    let page_list;
    if (list) {
      page_list = list;
      this.emailListdataitemsPerPage = list;
    } else {
      if (this.showItemPerPage == 0) {
        this.emailListdataitemsPerPage = this.pageITEM;
      } else {
        this.emailListdataitemsPerPage = this.showItemPerPage;
      }
    }

    const pagedata = {
      page: this.currentPageEmailListdata,
      pageSize: this.emailListdataitemsPerPage
    };

    const url = "/email/all";
    this.junkEmailService.postMethod(url, pagedata).subscribe(
      (response: any) => {
        this.emailListData = response.dataList;
        this.emailListDatatotalRecords = response.totalRecords;

        if (this.emailListData != null && this.emailListData.length > 0) {
          if (this.showItemPerPage > this.emailListdataitemsPerPage) {
            this.totalDataListLength = this.emailListData.length % this.showItemPerPage;
          } else {
            this.totalDataListLength = this.emailListData.length % this.emailListdataitemsPerPage;
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageEmailListdata > 1) {
      this.currentPageEmailListdata = 1;
    }
    if (!this.searchSenderKey || !this.searchOption) {
      this.getJunkEmailList(this.showItemPerPage);
    } else {
      this.searchSender("");
    }
  }

  pageChangedTrcList(pageNumber) {
    this.currentPageEmailListdata = pageNumber;
    if (this.searchSenderKey || this.searchOption) {
      this.searchSender("");
    } else {
      this.getJunkEmailList("");
    }
  }

  searchSender(list) {
    let page_list;
    if (list) {
      page_list = list;
      this.emailListdataitemsPerPage = list;
    } else {
      if (this.showItemPerPage == 0) {
        this.emailListdataitemsPerPage = this.pageITEM;
      } else {
        this.emailListdataitemsPerPage = this.showItemPerPage;
      }
    }

    const pagedata = {
      page: this.currentPageEmailListdata,
      pageSize: this.emailListdataitemsPerPage
    };
    let emailSearch = {
      filters: [
        {
          filterDataType: "",
          filterValue: this.searchSenderKey,
          filterColumn: this.searchOption,
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageEmailListdata,
      pageSize: this.emailListdataitemsPerPage
    };

    const url = "/email/search";
    this.junkEmailService.postMethod(url, emailSearch).subscribe(
      (response: any) => {
        if (response.dataList == null) {
          this.emailListData = [];
        } else {
          this.emailListData = response.dataList;
        }
        this.emailListDatatotalRecords = response.totalRecords;
        if (this.emailListData != null) {
          if (this.showItemPerPage > this.emailListdataitemsPerPage) {
            this.totalDataListLength = this.emailListData.length % this.showItemPerPage;
          } else {
            this.totalDataListLength = this.emailListData.length % this.emailListdataitemsPerPage;
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

  clearSearchTrc() {
    this.searchSenderKey = "";
    this.searchOption = "";
    this.showItemPerPage = 0;
    this.currentPageSize = RadiusConstants.pageLimitOptions[0];
    this.getJunkEmailList("");
  }

  createTicketClick(emailData: any) {
    this.createTicketModal = true;

    this.selectedEmail = emailData;
    let sender = this.selectedEmail.sender;
    this.ticketCreateFormGroup.controls.email.setValue(sender);
    let domain = "";
    if (this.selectedEmail.sender.includes("@")) {
      domain = this.selectedEmail.sender.substring(sender.indexOf("@") + 1, sender.length);
    }
    this.ticketCreateFormGroup.controls.domain.setValue(domain);

    const url = "/case/findCustomerByEmail/" + this.ticketCreateFormGroup.value.email;

    this.ticketManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.serviceplanlist.isAvaileble) {
          this.isCustomerAvailable = true;
          this.isShowAllService = response.serviceplanlist.isShowAllService;
          this.customerId = response.serviceplanlist.custId;

          const url = "/customers/" + this.customerId;
          this.customerManagementService.getMethod(url).subscribe((response: any) => {
            this.customerData = response.customers;
            let url =
              "/serviceArea/getAllServicesByServiceAreaId" +
              "?mvnoId=" +
              Number(localStorage.getItem("mvnoId"));
            let data = [];
            data.push(this.customerData.serviceareaid);
            this.getPlanbyServiceArea(this.customerData.serviceareaid);
            this.getPartnerAllByServiceArea(this.customerData.serviceareaid);
            this.getBranchByServiceAreaID(this.customerData.serviceareaid);
            this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
              if (response.dataList.length !== 0) {
                this.serviceData = response.dataList;
                if (!this.isShowAllService) {
                  // Filter Service
                  let newServiceList = [];
                  this.customerServiceList.forEach(service => {
                    let findmatch = this.serviceData.find(data => data.id === service.serviceId);
                    if (findmatch) {
                      newServiceList.push(findmatch);
                    }
                  });
                  this.serviceData = [];
                  this.serviceData = newServiceList;

                  // Problem Domain List
                  var serviceIdList = [];
                  if (this.serviceData.length > 0) {
                    serviceIdList = this.serviceData.map(item => {
                      return item.id;
                    });
                    this.getProblemDomainList(serviceIdList);
                  }

                  // Filter Plan
                  let planListData = [];
                  this.customerPlanList.forEach(plan => {
                    let findMatch = this.filterPlanList.find(data => data.id === plan.planId);
                    if (findMatch) {
                      planListData.push(findMatch);
                    }
                  });
                  this.planData = [];
                  this.planData = planListData;
                } else {
                  this.serviceData = this.serviceData.map(item => {
                    let isAssigned = this.customerServiceList.some(cs => cs.serviceId === item.id);
                    if (isAssigned) {
                      return { ...item, isAssigned: true };
                    } else {
                      return { ...item, isAssigned: false };
                    }
                  });
                }
              }
            });
          });

          this.customerPlanList = response.serviceplanlist.planList;
          this.customerServiceList = response.serviceplanlist.serviceList;

          // Check for show all service or not

          this.ticketCreateFormGroup.controls.name.setValue(response.serviceplanlist.name);
          //   if (this.serviceData.length > 0) {
          //     this.ticketCreateFormGroup.controls.service.setValue(this.serviceData[0].id);
          //   }
          //   if (this.planData.length > 0) {
          //     this.ticketCreateFormGroup.controls.plan.setValue(this.planData[0].id);
          //   }
        } else {
          this.isCustomerAvailable = false;
        }
      },
      (error: any) => {}
    );
  }

  closeCreateTicket() {
    this.createTicketModal = false;
    this.createTicketSubmitted = false;
    this.ticketCreateFormGroup.clearAsyncValidators();
    this.ticketCreateFormGroup.updateValueAndValidity();
    this.ticketCreateFormGroup.reset();
  }

  createTicket() {
    this.createTicketSubmitted = true;
    const date = new Date();
    if (!this.ticketCreateFormGroup.valid) {
      return;
    }

    if (this.selectedEmail.desc?.length > 15000) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "The size of the email body exceeds the permissible limit.",
        icon: "far fa-times-circle"
      });
      return;
    }

    var TATDetails = this.subProblemDomainList.find(
      element => element.id == this.ticketCreateFormGroup.value.subproblemdomain
    ).ticketSubCategoryTatMappingList;
    const ticket = TATDetails.find(
      element =>
        element.ticketReasonSubCategoryId == this.ticketCreateFormGroup.value.subproblemdomain
    )?.ticketTatMatrix;

    const timeUnit = ticket ? ticket.runit : "DAY";
    const time = ticket ? ticket.rtime : 1;

    if (timeUnit == "DAY") {
      date.setDate(date.getDate() + time);
    } else if (timeUnit == "HOUR") {
      date.setHours(date.getHours() + time);
    } else {
      date.setMinutes(date.getMinutes() + time);
    }

    let nextFollowupDate = this.datepipe.transform(date, "yyyy-MM-dd");
    let nextFollowupTime = this.datepipe.transform(date, "HH:mm:ss");

    let createCustomer = {
      username: this.ticketCreateFormGroup.value.name,
      password: this.ticketCreateFormGroup.value.name,
      firstname: this.ticketCreateFormGroup.value.name,
      lastname: this.ticketCreateFormGroup.value.name,
      email: this.ticketCreateFormGroup.value.email,
      title: "Mr",
      pan: "",
      gst: "",
      aadhar: "",
      passportNo: "",
      tinNo: null,
      contactperson: this.ticketCreateFormGroup.value.name,
      failcount: 0,
      custtype: "Prepaid",
      custlabel: "customer",
      phone: "",
      mobile: "9898989898",
      secondaryMobile: null,
      faxNumber: null,
      dateOfBirth: null,
      countryCode: "+91",
      dunningType: null,
      dunningSector: null,
      cafno: null,
      voicesrvtype: "",
      didno: "",
      calendarType: "English",
      partnerid: 1,
      salesremark: "",
      servicetype: "",
      serviceareaid: RadiusConstants.SERVICEAREA_ID,
      status: "Active",
      parentCustomerId: null,
      latitude: null,
      longitude: null,
      billTo: "CUSTOMER",
      billableCustomerId: null,
      isInvoiceToOrg: false,
      istrialplan: false,
      popid: null,
      staffId: null,
      discount: 0,
      flatAmount: "0.00",
      plangroupid: null,
      discountType: null,
      discountExpiryDate: null,
      mvnoId: localStorage.getItem("mvnoId"),
      planMappingList: [
        {
          planId: this.ticketCreateFormGroup.value.plan,
          service: this.selectedServiceName,
          serviceId: this.ticketCreateFormGroup.value.service,
          validity: 1,
          discount: 0,
          billTo: "CUSTOMER",
          billableCustomerId: null,
          newAmount: null,
          invoiceType: null,
          offerPrice: 0,
          isInvoiceToOrg: false,
          istrialplan: null,
          discountType: "One-time",
          serialNumber: null,
          discountExpiryDate: null
        }
      ],
      addressList: [
        {
          addressType: "Present",
          landmark: "Default",
          areaId: RadiusConstants.AREA_ID,
          pincodeId: RadiusConstants.PINCODE_ID,
          cityId: RadiusConstants.CITY_ID,
          stateId: RadiusConstants.STATE_ID,
          countryId: RadiusConstants.COUNTRY_ID,
          landmark1: null,
          version: "NEW"
        }
      ],
      overChargeList: [],
      custMacMapppingList: [],
      branch: 1,
      oltid: null,
      masterdbid: null,
      splitterid: null,
      nasPort: null,
      framedIp: null,
      framedIpBind: null,
      ipPoolNameBind: null,
      valleyType: null,
      customerArea: null,
      paymentDetails: {
        amount: 0,
        paymode: null,
        referenceno: null,
        paymentdate: null
      },
      isCustCaf: null,
      dunningCategory: "Silver",
      billday: "",
      department: null,
      invoiceType: null,
      planPurchaseType: "individual"
    };

    let createTicket = {
      caseStatus: "Open",
      caseTitle: this.selectedEmail.summary,
      caseType: "Issue",
      ticketReasonCategoryId: this.ticketCreateFormGroup.value.problemdomain,
      reasonSubCategoryId: this.ticketCreateFormGroup.value.subproblemdomain,
      groupReasonId: null,
      priority: "Medium",
      nextFollowupDate: nextFollowupDate,
      nextFollowupTime: nextFollowupTime,
      currentAssigneeId: null,
      customerAdditionalEmail: null,
      customerAdditionalMobileNumber: null,
      customersId: 138,
      department: "Technical",
      file: null,
      firstRemark: this.selectedEmail.desc,
      helperName: null,
      source: null,
      subSource: null,
      ticketServicemappingList: [
        {
          serviceid: this.ticketCreateFormGroup.value.service
        }
      ],
      serialNumber: "",
      caseForPartner: "Customer",
      caseFor: "Customer",
      caseOrigin: "Email",
      messageId: this.selectedEmail.id ? this.selectedEmail.id : null
    };

    if (this.isCustomerAvailable) {
      if (this.isShowAllService) {
        let selectedService = this.ticketCreateFormGroup.value.service;
        const exists = this.customerServiceList.some(item => item.serviceId === selectedService);
        if (!exists) {
          let createServiceRequest = {
            id: this.customerId,
            failcount: this.customerData.failcount,
            custtype: this.customerData.custtype,
            countryCode: this.customerData.countryCode,
            cafno: this.customerData.cafno,
            calendarType: this.customerData.calendarType,
            partnerid: this.customerData.partnerid,
            serviceareaid: this.customerData.serviceareaid,
            status: this.customerData.status,
            billableCustomerId: null,
            planMappingList: [
              {
                discount: null,
                planId: this.selectedPlan.id,
                service: this.selectedServiceName,
                validity: this.selectedPlan.validity,
                offerprice: this.selectedPlan.offerprice,
                validityUnit: this.selectedPlan.unitsOfValidity,
                istrialplan: null,
                discountType: "One-time",
                discountExpiryDate: null,
                invoiceType: null,
                serialNumber: "",
                planCategory: "individual",
                billTo: "CUSTOMER",
                billableCustomerId: null,
                newAmount: 0,
                isInvoiceToOrg: false
              }
            ],
            addressList: this.customerData.addressList,
            paymentDetails: null,
            dunningCategory: this.customerData.dunningCategory
          };
          // Add Service
          let url = "/addNewServiceForEmail";
          this.customerManagementService
            .postMethod(url, createServiceRequest)
            .subscribe((response: any) => {
              // Sucess
            });
        }
      }

      // create ticket call
      createTicket.customersId = this.customerId;
      const formData = new FormData();
      formData.append("file", "");
      formData.append("entityDTO", JSON.stringify(createTicket));

      const url = "/case/savecase";
      this.ticketManagementService.postMethod(url, formData).subscribe(
        (response: any) => {
          if (response.responseCode === 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
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
            let requestData = {
              id: this.selectedEmail.id,
              folder: "COMPLETED"
            };
            this.updateEmail(requestData);
            this.closeCreateTicket();
            this.getJunkEmailList("");
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
            detail: "Name not available, Please try different one.",
            icon: "far fa-times-circle"
          });
          return;
        }
      );
    } else {
      // create customer, after getting response from customer make call for ticket
      let mvnoId = Number(localStorage.getItem("mvnoId"));
      const urlCustomerCheck =
        "/customer/customerUsernameIsAlreadyExists/" +
        this.ticketCreateFormGroup.value.name +
        "?mvnoId=" +
        mvnoId;
      this.customerManagementService.getMethod(urlCustomerCheck).subscribe((response: any) => {
        if (response.isAlreadyExists == true) {
          this.messageService.add({
            severity: "error",
            summary: "Error ",
            detail: "Name not available. Please Change name",
            icon: "far fa-times-circle"
          });
        } else {
          const url = "/customers";
          createCustomer.mvnoId = localStorage.getItem("mvnoId");
          if (this.isServiceNotAvailable === true) {
            let newAddressList = [
              {
                addressType: "Present",
                landmark: "New Landmark",
                areaId: this.areaListDD[0].id, // New area ID
                pincodeId: this.pincodeDD[0].pincodeid, // New pincode ID
                cityId: this.areaListDD[0].cityId, // New city ID
                stateId: this.areaListDD[0].stateId, // New state ID
                countryId: this.areaListDD[0].countryId, // New country ID
                landmark1: "New Landmark 1",
                version: "NEW"
              }
              // Add more addresses if needed
            ];
            createCustomer.serviceareaid = this.serviceAreaData.id;
            createCustomer.addressList = newAddressList;
          }
          if (this.partnerListByServiceArea.length === 0) {
            if (this.isBranchAvailable === true) createCustomer.branch = this.branchData[0].id;
          } else {
            createCustomer.partnerid = this.partnerListByServiceArea[0].id;
          }
          this.customerManagementService.postMethod(url, createCustomer).subscribe(
            (response: any) => {
              if (response.responseCode == 406) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else {
                let createdCustomer = response.customer;
                createTicket.customersId = createdCustomer.id;
                // create ticket call

                const formData = new FormData();
                formData.append("file", "");
                formData.append("entityDTO", JSON.stringify(createTicket));
                const url = "/case/savecase";
                this.ticketManagementService.postMethod(url, formData).subscribe(
                  (response: any) => {
                    if (response.responseCode === 406) {
                      this.messageService.add({
                        severity: "error",
                        summary: "Error",
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
                      let requestData = {
                        id: this.selectedEmail.id,
                        folder: "COMPLETED"
                      };
                      this.updateEmail(requestData);
                      this.closeCreateTicket();
                      this.getJunkEmailList("");
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
      });
    }
  }

  onServiceChange(event: any, dd: any) {
    let planserviceData;
    let planServiceID = "";
    const serviceId = event.value;
    this.selectedServiceName = dd.selectedOption.name;
    var serviceIdList = [];
    serviceIdList.push(serviceId);
    this.getProblemDomainList(serviceIdList);

    const planserviceurl = "/planservice/all" + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
      planserviceData = response.serviceList.filter(
        service => service.name === this.selectedServiceName
      );
      if (planserviceData.length > 0) {
        planServiceID = planserviceData[0].id;
        this.planData = this.filterPlanList.filter(
          id =>
            id.serviceId === planServiceID &&
            (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
        );

        if (this.planData.length === 0) {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Plan not available for this service ",
            icon: "far fa-times-circle"
          });
        }
      }
    });
  }

  onPlanChange(event: any, dd: any) {
    this.selectedPlan = dd.selectedOption;
  }

  getServiceList(ids) {
    let data = [];
    data.push(ids);

    let url =
      "/serviceArea/getAllServicesByServiceAreaId" +
      "?mvnoId=" +
      Number(localStorage.getItem("mvnoId"));
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      if (response.dataList.length !== 0) {
        this.serviceData = response.dataList;
      } else {
        this.isServiceNotAvailable = true;
      }
    });
  }

  getPlanList(serviceAreaId) {
    if (serviceAreaId) {
      this.planData = [];
      const custType = "Prepaid";
      const url =
        "/plans/serviceArea?planmode=ALL&serviceAreaId=" +
        serviceAreaId +
        "&mvnoId=" +
        localStorage.getItem("mvnoId");
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.postpaidplanList;
          this.filterPlanList = this.planByServiceArea.filter(
            plan => plan.plantype == this.custType
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
  }

  getProblemDomainList(serviceIdList) {
    this.planData = [];
    const url = "/ticketReasonCategory/getReasonCategoryByActiveServices";
    this.ticketReasonCategoryService.postMethod(url, serviceIdList).subscribe(
      (response: any) => {
        this.problemDomainList = response.dataList;
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

  onProblemDomainChange(event: any, dd: Dropdown) {
    let reasonCategoryId = event.value;
    this.getSubReasonCategoryList(reasonCategoryId);
  }

  getSubReasonCategoryList(reasonId) {
    this.subProblemDomainList = [];

    const url = "/ticketReasonSubCategory/getSubCategoryReasons?parentCategoryId=" + reasonId;
    this.ticketSubReasonCategoryService.getMethod(url).subscribe(
      (response: any) => {
        this.subProblemDomainList = response.dataList;
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

  updateEmail(requestData) {
    const url = "/email/update";
    this.junkEmailService.postMethod(url, requestData).subscribe(
      (response: any) => {
        this.getJunkEmailList("");
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

  openDescriptionModal(desc: string) {
    this.descriptionModal = true;
    this.description = desc;
  }

  deleteConfirmonEmail(id: number) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete email ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteEmail(id);
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

  deleteEmail(mailid) {
    var data = { id: mailid };
    const url = "/deletemail";
    this.junkEmailService.postMethod(url, data).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
        this.getJunkEmailList("");
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

  selSearchOption() {
    this.currentPageEmailListdata = 1;
  }
  selServiceArea(event) {
    const serviceAreaId = event.value;

    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.serviceAreaData = response.data;
          this.plantypaSelectData = [];
          this.pincodeDD = [];
          this.serviceAreaData.pincodes.forEach(element => {
            console.table(this.serviceAreaData.pincodes);
            this.commondropdownService.allpincodeNumber.forEach(e => {
              if (e.pincodeid == element) {
                this.pincodeDD.push(e);
              }
              this.getArea(this.pincodeDD[0].pincodeid);
            });
          });
        },
        (error: any) => {}
      );
      this.getPlanbyServiceArea(serviceAreaId);
      this.getPartnerAllByServiceArea(serviceAreaId);
      this.getServiceByServiceAreaID(serviceAreaId);
      this.getBranchByServiceAreaID(serviceAreaId);
      this.getStaffUserByServiceArea(serviceAreaId);
    }
  }

  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.planData = [];
      const url =
        "/plans/serviceArea?planmode=NORMAL&serviceAreaId=" +
        serviceAreaId +
        "&mvnoId=" +
        localStorage.getItem("mvnoId");
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.postpaidplanList;
          this.filterPlanList = this.planByServiceArea.filter(plan => plan.plantype == "Prepaid");
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

  getPartnerAllByServiceArea(serviceAreaId) {
    const url =
      "/getPartnerByServiceAreaId/" + serviceAreaId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.partnerListByServiceArea = response.partnerList.filter(item => item.id != 1);
      },
      (error: any) => {}
    );
  }

  getServiceByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url =
      "/serviceArea/getAllServicesByServiceAreaId" +
      "?mvnoId=" +
      Number(localStorage.getItem("mvnoId"));
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceData = response.dataList;
    });
  }
  getBranchByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url =
      "/branchManagement/getAllBranchesByServiceAreaId?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.postMethod(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      if (this.branchData != null && this.branchData.length > 0) {
        this.isBranchAvailable = true;
      } else {
        this.isBranchAvailable = false;
      }
    });
  }

  getStaffUserByServiceArea(ids) {
    let data = [];
    data.push(ids);
    let url = "/staffsByServiceAreaId/" + ids;
    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      this.staffList = response.dataList;
    });
  }

  getArea(pincodeid) {
    const url = "/area/pincode?pincodeId=" + pincodeid;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.areaListDD = response.areaList;
      },
      (error: any) => {}
    );
  }
}
