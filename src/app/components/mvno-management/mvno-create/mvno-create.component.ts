import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { RoleService } from "src/app/service/role.service";
import { MvnoManagementService } from "src/app/service/mvno-management.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DeactivateService } from "src/app/service/deactivate.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { ProfileService } from "src/app/service/profile.service";
import { PasswordPolicyService } from "src/app/service/password-policy/password-policy.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";

declare var $: any;

@Component({
  selector: "app-mvno-create",
  templateUrl: "./mvno-create.component.html",
  styleUrls: ["./mvno-create.component.scss"]
})
export class MvnoCreateComponent implements OnInit {
  mvnoTitle = RadiusConstants.MVNO;
  fileToUpload: any;
  mvnoFormGroup: FormGroup;
  existingBooleanValue: boolean;
  isMvnoEdit: boolean = false;
  submitted: boolean = false;
  mvnoData: any;
  viewMvnoData: any;
  mvnoImg: any;
  searchData: any;
  roleList: any[] = [{ id: "", rolename: "" }];
  statusOptions = RadiusConstants.status;
  twofaOptions = RadiusConstants.isTwoFactorEnabled;
  billingOptions = RadiusConstants.billingType;
  twofaType: any;
  days = [];
  editMvnoId: any;
  public loginService: LoginService;
  profileImage: any;
  ProfileList: any;
  passwordList: any;
  isNotificationRequired: boolean = false;
  eventTemplateList: any = [];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private mvnoManagementService: MvnoManagementService,
    private route: ActivatedRoute,
    loginService: LoginService,
    private deactivateService: DeactivateService,
    private PasswordPolicyService: PasswordPolicyService,
    private router: Router,
    private revenueService: RevenueManagementService,
    private commonService: AdoptCommonBaseService,
    private profileService: ProfileService,
    public commondropdownService: CommondropdownService
  ) {
    this.loginService = loginService;
    this.editMvnoId = this.route.snapshot.paramMap.get("mvnoId")!;
  }

  async ngOnInit() {
    if (this.editMvnoId != null) {
      this.isMvnoEdit = true;
      this.getMvnoById(this.editMvnoId);
    }
    this.getAutType();
    this.getAllPasswordPolicy();

    this.existingBooleanValue; // or false, or fetched from a service

    this.mvnoFormGroup = this.fb.group({
      name: ["", Validators.required],
      // isTwoFactorEnabled: [this.existingBooleanValue],
      username: [""],
      password: ["", Validators.required],
      phone: ["", Validators.required],
      status: ["", Validators.required],
      roleId: ["", Validators.required],
      passwordPolicyId: ["", Validators.required],
      eventName: [""],
      suffix: [""],
      description: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      logfile: [""],
      mvnoFooter: [""],
      mvnoHeader: [""],
      custInvoiceRefId: [""],
      profileImage: [""],
      logo_file_name: [""],
      mvnoPaymentDueDays: [""],
      address: [""],
      isTwoFactorEnabled: ["", Validators.required],
      authEventName: [""],
      fullName: ["", Validators.required],
      ispCommissionPercentage: ["", Validators.required],
      ispBillDay: [""],
      clientId: [""],
      profileId: ["", Validators.required],
      billType: ["", Validators.required],
      threshold: ["10"]
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
    this.getAllRole();
    // this.getAllEvent();
    this.getAllProfile();
    this.daySequence();
    this.commondropdownService.mobileNumberLengthSubject$.subscribe(len => {
      if (len) {
        this.mvnoFormGroup
          .get("phone")
          ?.setValidators([Validators.minLength(len.min), Validators.maxLength(len.max)]);
        this.mvnoFormGroup.get("phone")?.updateValueAndValidity();
      }
    });

    // Listen for changes in password policy
    // this.mvnoFormGroup.get("passwordPolicyId")?.valueChanges.subscribe(value => {
    //   this.onPasswordPolicyChange(value);
    // });
  }

  //   onPasswordPolicyChange(event: any) {
  //     const selectedPolicy = this.passwordList?.find(policy => policy.id === event);
  //     this.isNotificationRequired = selectedPolicy?.isNotificationRequired;
  //     if (this.isNotificationRequired) {
  //       this.mvnoFormGroup.controls["password"].reset();
  //       this.mvnoFormGroup.get("password").clearValidators();
  //       this.mvnoFormGroup.get("password").updateValueAndValidity();
  //       //   this.mvnoFormGroup.get("eventName").setValidators(Validators.required);
  //       //   this.mvnoFormGroup.get("eventName").updateValueAndValidity();
  //     } else {
  //       //   this.mvnoFormGroup.controls["eventName"].reset();
  //       this.mvnoFormGroup.get("password").setValidators(Validators.required);
  //       this.mvnoFormGroup.get("password").updateValueAndValidity();
  //       //   this.mvnoFormGroup.get("eventName").clearValidators();
  //       //   this.mvnoFormGroup.get("eventName").updateValueAndValidity();
  //     }
  //   }

  //   getAllEvent() {
  //     this.PasswordPolicyService.getAllEvent().subscribe(
  //       (res: any) => {
  //         if (res.status == 200) {
  //           this.eventTemplateList = res.data;
  //         }
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  //   }

  getAllRole() {
    this.roleService.getAll().subscribe(
      (response: any) => {
        this.roleList = response.dataList.filter(role => role.product === "BSS");
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

  getAllPasswordPolicy() {
    this.PasswordPolicyService.getAllPasswordPolicy().subscribe(
      (response: any) => {
        this.passwordList = response.passwordList;
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

  getAllProfile() {
    const url = "/custAccountProfile/all";
    this.profileService.getAllProfile(url).subscribe(
      (response: any) => {
        this.ProfileList = response.custAccountProfilesList;
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

  addEditMvno(id) {
    this.submitted = true;
    // if (id) {
    //   this.mvnoFormGroup.get("password").clearValidators();
    //   this.mvnoFormGroup.get("password").updateValueAndValidity();
    // }
    // const matchingEvent = this.eventTemplateList.find(
    //   event => event.eventName === this.mvnoFormGroup.get("eventName").value
    // );

    // if (matchingEvent) {
    //   this.mvnoFormGroup.patchValue({
    //     eventId: matchingEvent.eventId
    //   });
    // }

    if (this.mvnoFormGroup.valid) {
      //   if (
      //     this.mvnoFormGroup.value.threshold == null ||
      //     this.mvnoFormGroup.value.threshold == undefined
      //   ) {
      //     this.mvnoFormGroup.controls.threshold.setValue(0);
      //   }
      if (id) {
        const url = "/mvno/update?mvnoId=" + localStorage.getItem("mvnoId");
        this.mvnoData = this.mvnoFormGroup.value;
        this.mvnoImg = "";
        this.mvnoData.id = id;
        this.mvnoData.passwordPolicyId = 1;
        this.mvnoManagementService.postMethod(url, this.mvnoData).subscribe(
          (response: any) => {
            if (response.responseCode === 200) {
              this.submitted = false;
              this.isMvnoEdit = false;
              this.mvnoFormGroup.reset();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              //   if (this.searchkey) {
              //     this.searchMvno();
              //   } else {
              //     this.getMVNOData("");
              //   }
              this.deactivateService.setShouldCheckCanExit(false);
              this.router.navigate(["/home/mvnoManagement/list"]);
            } else {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            }
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
      } else {
        const url = "/mvno/save?mvnoId=" + localStorage.getItem("mvnoId");
        this.mvnoData = this.mvnoFormGroup.value;
        // this.mvnoData.passwordPolicyId = 1; //Remove this line after bss and iwf ui merge done
        this.mvnoManagementService.postMethod(url, this.mvnoData).subscribe(
          (response: any) => {
            if (response.responseCode === 200) {
              this.submitted = false;
              this.mvnoFormGroup.reset();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              //   if (this.searchkey) {
              //     this.searchMvno();
              //   } else {
              //     this.getMVNOData("");
              //   }
              this.deactivateService.setShouldCheckCanExit(false);
              this.router.navigate(["/home/mvnoManagement/list"]);
            } else {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            }
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
    }
  }

  getMvnoById(id) {
    if (id) {
      const url = "/mvno/" + id;
      this.mvnoManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isMvnoEdit = true;
          this.viewMvnoData = response.data;
          if (this.viewMvnoData.profileImage) {
            this.profileImage = `data:image/jpeg;base64,${this.viewMvnoData.profileImage}`;
          }
          this.mvnoFormGroup.patchValue(this.viewMvnoData);
          this.mvnoFormGroup.patchValue({
            isTwoFactorEnabled: this.translateBooleanToLabel(this.viewMvnoData.isTwoFactorEnabled)
          });
          this.getAddressForMvno(this.viewMvnoData.custInvoiceRefId);
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
  }

  generateUserName() {
    if (!this.isMvnoEdit) {
      let name = this.mvnoFormGroup.value.name;
      this.mvnoFormGroup.patchValue({
        username: "admin@" + name
      });
    }
  }

  canExit() {
    if (!this.mvnoFormGroup.dirty) return true;
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

  onFileChangeUpload(files: FileList) {
    let fileArray: FileList;
    const formData = new FormData();

    const selectedFile = files.item(0);
    if (!selectedFile) {
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only JPEG and PNG files are allowed.");
      return;
    }
    const maxSize = 2097152;
    if (selectedFile.size > maxSize) {
      alert("File size cannot exceed 2MB.");
      return;
    }
    this.mvnoFormGroup.patchValue({
      file: files
    });

    fileArray = files;
    formData.append("file", fileArray[0]);
    this.mvnoFormGroup.patchValue({
      logo_file_name: selectedFile.name
    });
    let request = this.mvnoFormGroup.value;
    request.profileImage = fileArray[0];

    // this.mvnoFormGroup.patchValue({ profileImage: fileArray[0] });
    // console.log("fileArray[0] :::: ", fileArray[0]);
    // console.log("req ::::: ", request);
    this.fileToUpload = selectedFile;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = reader.result as string; // Type assertion to string
      const base64Data = base64String.split(",")[1];
      this.profileImage = e.target.result;
      this.mvnoFormGroup.patchValue({
        profileImage: base64Data != null ? base64Data : null
      });
    };
    reader.readAsDataURL(selectedFile);
  }

  getAddressForMvno(custId) {
    const url = "/getAddresses/" + custId;
    this.revenueService.getMethod(url).subscribe((response: any) => {
      if (response.data.length > 0)
        this.mvnoFormGroup.patchValue({
          address: response.data[0].landmark
        });
    });
  }
  translateBooleanToLabel(isEnabled: boolean): string {
    return isEnabled ? "true" : "false";
  }

  getAutType() {
    const url = "/commonList/OtpAuthType";
    this.commonService.get(url).subscribe((response: any) => {
      this.twofaType = response.dataList;
    });
  }

  changeAuthType($event, ddlAuthType) {
    if (ddlAuthType.selectedOption.value == "false") {
      this.mvnoFormGroup.controls.authEventName.setValue("");
      this.mvnoFormGroup.get("authEventName").clearValidators();
      this.mvnoFormGroup.get("authEventName").updateValueAndValidity();
    } else {
      this.mvnoFormGroup.get("authEventName").setValidators([Validators.required]);
      this.mvnoFormGroup.get("authEventName").updateValueAndValidity();
    }
  }

  daySequence() {
    for (let i = 0; i < 28; i++) {
      this.days.push({ label: i + 1 });
    }
    // this.mvnoFormGroup.controls.ispBillDay.setValue(2);
  }

  onChangeBillType(event) {
    if (event.value === "Monthly") {
      this.mvnoFormGroup.get("ispBillDay")?.setValidators(Validators.required);
      this.mvnoFormGroup.get("ispBillDay")?.enable();
      this.mvnoFormGroup.get("ispBillDay")?.updateValueAndValidity();
    } else {
      this.mvnoFormGroup.get("ispBillDay")?.clearValidators();
      this.mvnoFormGroup.get("ispBillDay")?.updateValueAndValidity();
      this.mvnoFormGroup.get("ispBillDay")?.setValue(2);
      // this.mvnoFormGroup.get('ispBillDay')?.disable();
    }
  }

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
