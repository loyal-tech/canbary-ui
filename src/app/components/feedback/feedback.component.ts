import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Regex } from "src/app/constants/regex";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { PRODUCTS, SETTINGS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
import { FeedbackService } from "src/app/service/feedback.service";
import { status } from "./../../RadiusUtils/RadiusConstants";
@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"]
})
export class FeedbackComponent implements OnInit {
  charecter150 = "^.{0,150}$";
  submitted = false;
  isFeedbackEdit: boolean = false;
  listView: boolean = true;
  createView: boolean = false;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  feedbackListData: any = [];
  editFeedbackId: any = [];
  dialogVisible: boolean;

  channelTypelist = [
    { label: "CWSC", value: "CWSC" },
    { label: "Mobile App", value: "MOBILE_APP" },
    { label: "Both", value: "BOTH" }
  ];
  ratingTypelist = [
    { label: "STAR", value: "STAR" },
    { label: "EMOJI", value: "EMOJI" },
    { label: "NUMERIC", value: "NUMERIC" }
  ];
  mandatorylist = [
    { label: "TRUE", value: "true" },
    { label: "FALSE", value: "false" }
  ];
  statuslist = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" }
  ];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private feedbackService: FeedbackService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(SETTINGS.FEEDBACK_CONFIGURATION_CREATE);
    this.editAccess = loginService.hasPermission(SETTINGS.FEEDBACK_CONFIGURATION_EDIT);
    this.deleteAccess = loginService.hasPermission(SETTINGS.FEEDBACK_CONFIGURATION_DELETE);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  feedbackGroupForm: FormGroup;
  ngOnInit(): void {
    this.feedbackGroupForm = this.fb.group({
      event: ["", Validators.required],
      channel: ["CWSC", Validators.required],
      ratingScale: [5, [Validators.required, Validators.min(1)]],
      ratingDisplayType: ["STAR", Validators.required],
      isMandatory: ["true", Validators.required],
      isActive: ["true", Validators.required],
      feedBackMessage: ["", Validators.required]
    });
    this.getFeedbackList();
  }

  createFeedback() {
    this.listView = false;
    this.createView = true;
    this.submitted = false;
    this.isFeedbackEdit = false;
    this.clearFeedbackForm();
  }

  listFeedback() {
    this.listView = true;
    this.createView = false;
    this.getFeedbackList();
  }

  getFeedbackList() {
    this.feedbackService.getAllFeedback().subscribe(
      (response: any) => {
        this.feedbackListData = response.FeedbackConfigList;
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
  addFeedback(id?: number) {
    this.submitted = true;

    if (this.feedbackGroupForm.valid) {
      const feedbackData = this.feedbackGroupForm.value;

      if (id) {
        this.isFeedbackEdit = true;
        this.feedbackService.updateFeedback(id, feedbackData).subscribe(
          (res: any) => {
            if (res.responseCode === 200) {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.msg,
                icon: "far fa-check-circle"
              });
              this.listView = true;
              this.createView = false;
              this.clearFeedbackForm();
              this.getFeedbackList();
            } else {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: res.msg,
                icon: "far fa-times-circle"
              });
            }
          },
          (err: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: err.error?.msg || "Something went wrong",
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        // CREATE FLOW
        this.feedbackService.createFeedback(feedbackData).subscribe(
          (res: any) => {
            if (res.responseCode === 201) {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.responseMessage,
                icon: "far fa-check-circle"
              });
              this.listView = true;
              this.createView = false;
              this.clearFeedbackForm();
              this.getFeedbackList();
            } else {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            }
          },
          (err: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: err.error?.responseMessage || "Something went wrong",
              icon: "far fa-times-circle"
            });
          }
        );
      }
    }
  }

  clearFeedbackForm() {
    this.feedbackGroupForm.setValue({
      event: "",
      feedBackMessage: "",
      isMandatory: "true",
      isActive: "true",
      channel: "CWSC",
      ratingScale: 5,
      ratingDisplayType: "STAR"
    });

    this.submitted = false;
  }

  editFeedback(id: number) {
    this.listView = false;
    this.createView = true;
    this.isFeedbackEdit = true;
    this.feedbackService.getFeedbackById(id).subscribe(
      (response: any) => {
        const feedbackData = response.data;

        this.feedbackGroupForm.patchValue({
          event: feedbackData.event,
          channel: feedbackData.channel,
          feedBackMessage: feedbackData.feedBackMessage,
          ratingScale: feedbackData.ratingScale,
          ratingDisplayType: feedbackData.ratingDisplayType,
          isMandatory: String(feedbackData.isMandatory),
          isActive: String(feedbackData.isActive)
        });

        this.editFeedbackId = id;
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

  deleteFeedback(id: number) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this feedback?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.feedbackService.deleteFeedback(id).subscribe(
          (response: any) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.msg || "Feedback deleted successfully",
              icon: "far fa-check-circle"
            });

            this.getFeedbackList(); // refresh the list after deletion
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error?.ERROR || "An error occurred",
              icon: "far fa-times-circle"
            });
          }
        );
      }
    });
  }

  getRefresh() {
    this.getFeedbackList();
  }
}
