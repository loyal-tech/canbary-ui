import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { ClientGroupService } from "src/app/service/client-group.service";
import { SmsNotificationService } from "src/app/service/sms-notification.service";
import { TemplateService } from "src/app/service/template.service";
import { eventNames } from "process";
import { MatTableDataSource } from "@angular/material/table";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { SETTINGS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.css"]
})
export class TemplateComponent implements OnInit {
  changeStatusData: any = [];
  groupData: any = [];

  updateTemplateData: any = [];
  createGroupForm: FormGroup;
  saveTemplateForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  //Used and required for pagination
  totalRecords: String;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  smsTemplateData: string;
  emailTemplateData: string;
  attribute: FormArray;
  editFormValues: any;
  editAttributeValues: any = [];

  // isChecked: boolean = false;
  editClientGroupId: number;
  editMode: boolean = false;
  smsChecked: boolean = false;
  emailChecked: boolean = false;
  // smsEventConfigured: boolean = false;
  // emailEventConfigured: boolean = false;
  status = [{ label: "Active" }, { label: "Inactive" }];

  allIEmailDs = [];
  allPushNotificationIDs = [];
  isEmailChecked: boolean = false;
  isPushNotificationChecked: boolean = false;
  allEmailChecked: boolean = false;
  allPushNotificationChecked: boolean = false;

  allIDs = [];
  issmsChecked: boolean = false;
  saveAccess: boolean = false;
  allIsChecked: boolean = false;
  temeplatedata: any = [];
  Wifitemeplatedata: any = [];
  loggedInUser: string;
  displayedColumns = ["eventName", "appendUrl"];
  dataSource: MatTableDataSource<unknown>;
  groupID: any;
  groupEmailID: any;
  groupPushNotificationID: any;
  groupAppednURL: any;
  SearchName = "";
  searchKey: string = "";
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  viewAccess: any;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;
  constructor(
    private messageService: MessageService,
    private clientGroupService: ClientGroupService,
    private TemplateService: TemplateService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private smsNotificationService: SmsNotificationService,
    loginService: LoginService
  ) {
    this.saveAccess = loginService.hasPermission(SETTINGS.TEMPLATE_SAVE);
    this.loginService = loginService;
    this.findAll();
  }

  ngOnInit(): void {
    this.saveTemplateForm = this.fb.group({
      templateId: [""],
      smsEventConfigured: [""],
      smsTemplateData: [""],
      emailEventConfigured: [""],
      emailTemplateData: [""],
      isPushNotification: [""],
      pushNoticationTemplete: [""],
      templateName: [""]
    });
    this.createGroupForm = this.fb.group({
      smsTemplate: ["", Validators.required],
      emailTemplate: ["", Validators.required]
    });

    this.loggedInUser = localStorage.getItem("loggedInUser");
  }
  popoverTitle: string = RadiusConstants.CONFIRM_DIALOG_TITLE;
  popoverMessage: string = RadiusConstants.DELETE_GROUP_CONFIRM_MESSAGE;
  confirmedClicked: boolean = false;
  cancelClicked: boolean = false;
  closeOnOutsideClick: boolean = true;

  async searchGroupByName() {
    this.currentPage = 1;
    this.searchSubmitted = true;

    let name = this.SearchName.trim() ? this.SearchName.trim() : "";
    this.searchKey = name;

    this.TemplateService.getEventByName(name).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.groupData = response;
          this.temeplatedata = response.dataList;
          this.dataSource = new MatTableDataSource(this.temeplatedata);

          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.groupData = response;
          this.temeplatedata = response.templateList;
          this.dataSource = new MatTableDataSource(this.temeplatedata);
          let attributeList = this.groupData.templateList;

          attributeList.forEach(element => {
            this.attribute.push(this.fb.group(element));
          });

          this.allIDs = [];
          this.allIEmailDs = [];
          this.totalRecords = this.groupData.templateList.length;
          for (let i = 0; i < this.temeplatedata.length; i++) {
            if (this.temeplatedata[i].smsEventConfigured == true) {
              this.allIDs.push(this.temeplatedata[i].templateId);

              if (this.temeplatedata.length == this.allIDs.length) {
                this.issmsChecked = true;
                this.allIsChecked = true;
              }
            }
            if (this.temeplatedata[i].emailEventConfigured == true) {
              this.allIEmailDs.push(this.temeplatedata[i].templateId);
              if (this.temeplatedata.length === this.allIEmailDs.length) {
                this.isEmailChecked = true;
                this.allEmailChecked = true;
              }
            }

            if (this.temeplatedata[i].isPushNotification == true) {
              this.allPushNotificationIDs.push(this.temeplatedata[i].templateId);
              if (this.temeplatedata.length === this.allPushNotificationIDs.length) {
                this.isPushNotificationChecked = true;
                this.allPushNotificationChecked = true;
              }
            }
          }
        }
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

  async findAll() {
    this.searchKey = "";

    this.attribute = this.fb.array([]);
    this.TemplateService.grtTemplate().subscribe(
      (response: any) => {
        this.groupData = response;
        this.temeplatedata = response.templateList;

        if (this.temeplatedata != null && this.temeplatedata.length > 0) {
          this.dataSource = new MatTableDataSource(this.temeplatedata);
          let attributeList = this.groupData.templateList;
          attributeList.forEach(element => {
            this.attribute.push(this.fb.group(element));
          });

          for (let index = 0; index < this.groupData.templateList.length; index++) {
            if (!this.groupData.templateList[index]) {
              this.saveTemplateForm.patchValue({
                templateId: this.groupData.templateList[index].templateId,
                templateName: this.groupData.templateList[index].templateName,
                smsEventConfigured: false,
                smsTemplateData: "",
                emailEventConfigured: false,
                emailTemplateData: "",
                isPushNotification: false,
                pushNoticationTemplete: ""
              });
            }
            this.groupData.templateList[index].templateId =
              this.groupData.templateList[index].templateId;
          }
          this.allIDs = [];
          this.allIEmailDs = [];
          this.allPushNotificationIDs = [];
          this.totalRecords = this.groupData.templateList.length;

          for (let i = 0; i < this.temeplatedata.length; i++) {
            if (this.temeplatedata[i].smsEventConfigured == true) {
              this.allIDs.push(this.temeplatedata[i].templateId);

              if (this.temeplatedata.length == this.allIDs.length) {
                this.issmsChecked = true;
                this.allIsChecked = true;
              }
            }
            if (this.temeplatedata[i].emailEventConfigured == true) {
              this.allIEmailDs.push(this.temeplatedata[i].templateId);
              if (this.temeplatedata.length === this.allIEmailDs.length) {
                this.isEmailChecked = true;
                this.allEmailChecked = true;
              }
            }
            if (this.temeplatedata[i].isPushNotification == true) {
              this.allPushNotificationIDs.push(this.temeplatedata[i].templateId);
              if (this.temeplatedata.length === this.allPushNotificationIDs.length) {
                this.isPushNotificationChecked = true;
                this.allPushNotificationChecked = true;
              }
            }
          }
        }
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

  async updateTemplate() {
    let addTemplateData = [];
    for (let index = 0; index < this.groupData.dataList.length; index++) {
      addTemplateData.push({
        eventId: this.groupData.dataList[index].templateId,
        smsEventConfigured: this.groupData.dataList[index].smsEventConfigured,
        smsTemplateData: this.groupData.dataList[index].smsTemplateData,
        emailEventConfigured: this.groupData.dataList[index].emailEventConfigured,
        emailTemplateData: this.groupData.dataList[index].emailTemplateData,
        appendUrl: this.groupData.dataList[index].appendUrl,
        status: this.groupData.dataList[index].status,
        templateName: this.groupData.dataList[index].templateName,
        mvnoId: this.groupData.dataList[index].mvnoId,
        buId: this.groupData.dataList[index].buId,
        isPushNotification: this.groupData.dataList[index].isPushNotification,
        pushNoticationTemplete: this.groupData.dataList[index].pushNoticationTemplete
      });
    }

    this.groupAppednURL = "";
    this.groupID = "";
    this.groupEmailID = "";
    this.groupPushNotificationID = "";

    // console.log(this.saveTemplateForm.value)
    if (addTemplateData.length != 0) {
      this.TemplateService.updateTemplate(addTemplateData).subscribe(
        (response: any) => {
          if (this.searchKey) {
            this.searchGroupByName();
          } else {
            this.findAll();
          }
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
            summary: error.error.errorMessage,
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  clearSearchForm() {
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.SearchName = "";
    this.findAll();
  }

  // email

  checkAllEmail(event) {
    if (event.checked == true) {
      this.allIEmailDs = [];
      let emailDetail = this.temeplatedata;
      for (let i = 0; i < emailDetail.length; i++) {
        this.allIEmailDs.push(this.temeplatedata[i].templateId);
      }
      this.allIEmailDs.forEach((value, index) => {
        emailDetail.forEach(element => {
          if (element.templateId == value) {
            element.emailEventConfigured = true;
          }
        });
      });
      this.allEmailChecked = true;
      // console.log(this.allIEmailDs);
    }
    if (event.checked == false) {
      let emailDetail = this.temeplatedata;
      this.allIEmailDs.forEach((value, index) => {
        emailDetail.forEach(element => {
          if (element.templateId == value) {
            element.emailEventConfigured = false;
          }
        });
      });
      this.allIEmailDs = [];
      // console.log(this.allIEmailDs);
      this.allEmailChecked = false;
      this.isEmailChecked = false;
    }
  }

  checkAllPushNotification(event) {
    if (event.checked == true) {
      this.allPushNotificationIDs = [];
      let pushNotificationDetail = this.temeplatedata;
      for (let i = 0; i < pushNotificationDetail.length; i++) {
        this.allPushNotificationIDs.push(this.temeplatedata[i].templateId);
      }
      this.allPushNotificationIDs.forEach((value, index) => {
        pushNotificationDetail.forEach(element => {
          if (element.templateId == value) {
            element.isPushNotification = true;
          }
        });
      });
      this.allPushNotificationChecked = true;
      // console.log(this.allIEmailDs);
    }
    if (event.checked == false) {
      let pushNotificationDetail = this.temeplatedata;
      this.allPushNotificationIDs.forEach((value, index) => {
        pushNotificationDetail.forEach(element => {
          if (element.templateId == value) {
            element.isPushNotification = false;
          }
        });
      });
      this.allPushNotificationIDs = [];
      // console.log(this.allIEmailDs);
      this.allPushNotificationChecked = false;
      this.isPushNotificationChecked = false;
    }
  }

  addEmailChecked(id, event: any) {
    if (event.checked) {
      this.allIEmailDs.push(id);
      if (this.temeplatedata.length === this.allIEmailDs.length) {
        this.isEmailChecked = true;
        this.allEmailChecked = true;
      }
      // console.log(this.allIEmailDs);
    } else {
      let emailDetail = this.temeplatedata;
      emailDetail.forEach(element => {
        if (element.templateId == id) {
          element.emailEventConfigured = false;
        }
      });
      if (this.allEmailChecked == true) {
        this.allIEmailDs.forEach((value, index) => {
          if (value == id) {
            this.allIEmailDs.splice(index, 1);
            // console.log(this.allIEmailDs);
          }
        });
      }

      if (this.allIEmailDs.length == 0 || this.allIEmailDs.length !== this.temeplatedata.length) {
        this.isEmailChecked = false;
      }
    }
  }

  addPushChecked(id, event: any) {
    if (event.checked) {
      this.allPushNotificationIDs.push(id);
      if (this.temeplatedata.length === this.allPushNotificationIDs.length) {
        this.isPushNotificationChecked = true;
        this.allPushNotificationChecked = true;
      }
      // console.log(this.allIEmailDs);
    } else {
      let pushDetail = this.temeplatedata;
      pushDetail.forEach(element => {
        if (element.templateId == id) {
          element.isPushNotification = false;
        }
      });
      if (this.allPushNotificationChecked == true) {
        this.allPushNotificationIDs.forEach((value, index) => {
          if (value == id) {
            this.allPushNotificationIDs.splice(index, 1);
            // console.log(this.allIEmailDs);
          }
        });
      }

      if (
        this.allPushNotificationIDs.length == 0 ||
        this.allPushNotificationIDs.length !== this.temeplatedata.length
      ) {
        this.isPushNotificationChecked = false;
      }
    }
  }

  // SMS
  checkSMSAll(event) {
    if (event.checked == true) {
      this.allIDs = [];
      let smsDetail = this.temeplatedata;
      for (let i = 0; i < smsDetail.length; i++) {
        this.allIDs.push(this.temeplatedata[i].templateId);
      }
      this.allIDs.forEach((value, index) => {
        smsDetail.forEach(element => {
          if (element.templateId == value) {
            element.smsEventConfigured = true;
          }
        });
      });
      this.allIsChecked = true;
      // console.log(this.allIDs);
    }
    if (event.checked == false) {
      let smsDetail = this.temeplatedata;
      this.allIDs.forEach((value, index) => {
        smsDetail.forEach(element => {
          if (element.templateId == value) {
            element.smsEventConfigured = false;
          }
        });
      });
      this.allIDs = [];
      // console.log(this.allIDs);
      this.allIsChecked = false;
      this.issmsChecked = false;
    }
  }
  addsmsChecked(id, event: any) {
    if (event.checked) {
      this.allIDs.push(id);
      if (this.temeplatedata.length === this.allIDs.length) {
        this.issmsChecked = true;
        this.allIsChecked = true;
      }
    } else {
      let smsDetails = this.temeplatedata;
      smsDetails.forEach(element => {
        if (element.templateId == id) {
          element.smsEventConfigured = false;
        }
      });
      if (this.allIsChecked == true) {
        this.allIDs.forEach((value, index) => {
          if (value == id) {
            this.allIDs.splice(index, 1);
          }
        });
      }

      if (this.allIDs.length == 0 || this.allIDs.length !== this.temeplatedata.length) {
        this.issmsChecked = false;
      }
    }
  }
  ifsmsTemplateData = true;
  smsTemplateDataEdit(id) {
    this.groupID = id;
    this.groupEmailID = "";
    this.groupAppednURL = "";
    this.groupPushNotificationID = "";
  }
  EmailTemplateDataEdit(id) {
    this.groupEmailID = id;
    this.groupAppednURL = "";
    this.groupID = "";
    this.groupPushNotificationID = "";
  }
  PushTemplateDataEdit(id) {
    this.groupPushNotificationID = id;
    this.groupAppednURL = "";
    this.groupID = "";
    this.groupEmailID = "";
  }
  appendUrlTemplateDataEdit(id) {
    this.groupAppednURL = id;
    this.groupEmailID = "";
    this.groupID = "";
    this.groupPushNotificationID = "";
  }

  async editTemplate(groupData) {
    let addTemplateData = [];
    // for (let index = 0; index < this.groupData.dataList.length; index++) {
    //   addTemplateData.push({
    //     eventId: this.groupData.dataList[index].templateId,
    //     smsEventConfigured: this.groupData.dataList[index].smsEventConfigured,
    //     smsTemplateData: this.groupData.dataList[index].smsTemplateData,
    //     emailEventConfigured: this.groupData.dataList[index].emailEventConfigured,
    //     emailTemplateData: this.groupData.dataList[index].emailTemplateData,
    //     appendUrl: this.groupData.dataList[index].appendUrl,
    //     status: this.groupData.dataList[index].status,
    //     templateName: this.groupData.dataList[index].templateName,
    //     mvnoId: this.groupData.dataList[index].mvnoId,
    //   });
    // }
    groupData.templateId = groupData.templateId;
    addTemplateData.push({
      eventId: groupData.templateId,
      templateId: groupData.templateId,
      smsEventConfigured: groupData.smsEventConfigured,
      smsTemplateData: groupData.smsTemplateData,
      emailEventConfigured: groupData.emailEventConfigured,
      emailTemplateData: groupData.emailTemplateData,
      appendUrl: groupData.appendUrl,
      status: groupData.status,
      templateName: groupData.templateName,
      mvnoId: groupData.mvnoId,
      buId: groupData.buId,
      isPushNotification: groupData.isPushNotification,
      pushNoticationTemplete: groupData.pushNoticationTemplete
    });

    this.groupAppednURL = "";
    this.groupID = "";
    this.groupEmailID = "";
    this.groupPushNotificationID = "";

    // console.log(this.saveTemplateForm.value)
    if (addTemplateData.length != 0) {
      this.TemplateService.updateTemplate(groupData).subscribe(
        (response: any) => {
          if (this.searchKey) {
            this.searchGroupByName();
          } else {
            this.findAll();
          }
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
            summary: error.error.errorMessage,
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }
}
