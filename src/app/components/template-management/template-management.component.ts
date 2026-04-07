import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { ClientGroupService } from "src/app/service/client-group.service";
import { SmsNotificationService } from "src/app/service/sms-notification.service";
import { TemplateManagementService } from "src/app/service/template-management.service";
import { eventNames } from "process";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";

@Component({
  selector: "app-template-management",
  templateUrl: "./template-management.component.html",
  styleUrls: ["./template-management.component.css"]
})
export class TemplateManagementComponent implements OnInit {
  changeStatusData: any = [];
  groupData: any = [];

  updateTemplateData: any = [];
  createGroupForm: FormGroup;
  saveTemplateForm: FormGroup;
  searchGroupByNameForm: FormGroup;
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
    private templateManagementService: TemplateManagementService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private smsNotificationService: SmsNotificationService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.findAll();
  }

  ngOnInit(): void {
    this.saveTemplateForm = this.fb.group({
      eventId: [""],
      smsEventConfigured: [""],
      smsTemplateData: [""],
      emailEventConfigured: [""],
      emailTemplateData: [""],
      templateName: [""]
    });
    this.createGroupForm = this.fb.group({
      smsTemplate: ["", Validators.required],
      emailTemplate: ["", Validators.required]
    });
    this.searchGroupByNameForm = this.fb.group({
      name: [""]
    });
  }
  popoverTitle: string = RadiusConstants.CONFIRM_DIALOG_TITLE;
  popoverMessage: string = RadiusConstants.DELETE_GROUP_CONFIRM_MESSAGE;
  confirmedClicked: boolean = false;
  cancelClicked: boolean = false;
  closeOnOutsideClick: boolean = true;
  addEmailTemp(event: any) {
    if (event.checked) {
      this.emailChecked = true;
    } else {
      this.emailChecked = false;
    }
  }
  async searchGroupByName() {
    this.currentPage = 1;
    this.searchSubmitted = true;
    if (this.searchGroupByNameForm.valid) {
      this.templateManagementService
        .getEventByName(this.searchGroupByNameForm.value.name)
        .subscribe(
          (response: any) => {
            this.groupData = response.eventList;
            this.totalRecords = this.groupData.eventList.length;
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
  }

  async findAll() {
    this.attribute = this.fb.array([]);
    this.smsNotificationService.getEvents().subscribe(
      (response: any) => {
        this.groupData = response;
        let attributeList = this.groupData.eventList;
        attributeList.forEach(element => {
          this.attribute.push(this.fb.group(element));
        });
        for (let index = 0; index < this.groupData.eventList.length; index++) {
          if (!this.groupData.eventList[index].template) {
            this.saveTemplateForm.patchValue({
              eventId: this.groupData.eventList[index].eventId,
              templateName: this.groupData.eventList[index].eventName,
              smsEventConfigured: false,
              smsTemplateData: "",
              emailEventConfigured: false,
              emailTemplateData: ""
            });
          } else {
            this.saveTemplateForm.patchValue({
              eventId: this.groupData.eventList[index].eventId,
              templateName: this.groupData.eventList[index].eventName,
              smsEventConfigured: this.groupData.eventList[index].template.smsEventConfigured,
              smsTemplateData: this.groupData.eventList[index].template.smsTemplateData,
              emailEventConfigured: this.groupData.eventList[index].template.emailEventConfigured,
              emailTemplateData: this.groupData.eventList[index].template.emailTemplateData
            });
          }
          //console.log(this.saveTemplateForm.value);
          //this.editFormValues = this.saveTemplateForm.value;
          // this.editAttributeValues = this.groupData.eventList[index].template;
          this.groupData.eventList[index].template.eventId =
            this.groupData.eventList[index].eventId;
          this.editAttributeValues.push(this.groupData.eventList[index].template);
          // this.addTemplateData = this.groupData.eventList[index].template;
        }
        // const smsConfig = this.groupData.eventList.template.smsEventConfigured;
        // if (smsConfig) {
        //   this.smsEventConfigured.isChecked = true;
        // }
        this.totalRecords = this.groupData.eventList.length;
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
    this.templateManagementService.getTemplates().subscribe(
      (response: any) => {
        let attributeList = response.templateList;
        attributeList.forEach(element => {
          this.attribute.push(this.fb.group(element));
        });
        this.editAttributeValues = response.templateList;
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

  async updateTemplate(updateTemplateData) {
    // index = this.radiusUtility.getIndexOfSelectedRecord(
    //   index,
    //   this.currentPage,
    //   this.itemsPerPage
    // );
    this.saveTemplateForm.patchValue({
      templateId: this.saveTemplateForm.value.templateId,
      eventId: this.saveTemplateForm.value.eventId,
      templateName: this.saveTemplateForm.value.templateName,
      smsEventConfigured: this.saveTemplateForm.value.smsEventConfigured,
      smsTemplateData: this.saveTemplateForm.value.smsTemplateData,
      emailEventConfigured: this.saveTemplateForm.value.emailEventConfigured,
      emailTemplateData: this.saveTemplateForm.value.emailTemplateData
    });
    // const updatedGroupData = {
    //   clId: this.editClientGroupId,
    //   name: this.createGroupForm.value.name,
    //   cgStatus: this.createGroupForm.value.cgStatus,
    // };
    this.templateManagementService.updateTemplate(updateTemplateData).subscribe(
      (response: any) => {
        //this.submitted = false;
        //this.createGroupForm.reset();
        this.findAll();
        //this.editMode = false;
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
  async addTemplate() {
    const addTemplateData: any = [];
    this.submitted = true;

    this.saveTemplateForm.patchValue({
      eventId: this.saveTemplateForm.value.eventId,
      templateName: this.saveTemplateForm.value.templateName,
      smsEventConfigured: this.saveTemplateForm.value.smsEventConfigured,
      smsTemplateData: this.saveTemplateForm.value.smsTemplateData,
      emailEventConfigured: this.saveTemplateForm.value.emailEventConfigured,
      emailTemplateData: this.saveTemplateForm.value.emailTemplateData
    });
    for (let index = 0; index < this.groupData.eventList.length; index++) {
      //delete this.groupData.eventList[index].template.templateId;
      //delete this.groupData.eventList[index].template.createDate;
      //delete this.groupData.eventList[index].template.lastModificationDate;
      // this.groupData.eventList[index].template.eventId = 1;
      addTemplateData.push(this.groupData.eventList[index].template);
      // this.addTemplateData = this.groupData.eventList[index].template;
    }
    this.editFormValues = this.saveTemplateForm.value;
    if (addTemplateData.length == this.editAttributeValues.length) {
      this.updateTemplate(addTemplateData);
    } else {
      this.templateManagementService.addNewtemplate(addTemplateData).subscribe(
        (response: any) => {
          this.submitted = false;
          //this.createGroupForm.reset();
          this.findAll();
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
    this.searchGroupByNameForm.reset();
    this.findAll();
  }

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
  }
}
