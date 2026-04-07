import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { RoleService } from "src/app/service/role.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PasswordPolicyService } from "src/app/service/password-policy/password-policy.service";

@Component({
  selector: "app-password-create",
  templateUrl: "./password-create.component.html",
  styleUrls: ["./password-create.component.css"]
})
export class PasswordCreateComponent implements OnInit {
  passwordPolicyForm: FormGroup;
  isEdit: boolean = false;
  submitted: boolean = false;
  passwordData: any;
  viewpasswordData: any;
  searchData: any;
  roleList: any[] = [{ id: "", rolename: "" }];
  statusOptions = RadiusConstants.status;
  editPasswordId: any;
  public loginService: LoginService;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private PasswordPolicyService: PasswordPolicyService,
    private route: ActivatedRoute,
    loginService: LoginService,
    private router: Router
  ) {
    this.loginService = loginService;
    this.editPasswordId = this.route.snapshot.paramMap.get("mvnoId")!;
  }

  async ngOnInit() {
    if (this.editPasswordId != null) {
      this.isEdit = true;
      this.getPasswordById(this.editPasswordId);
    }
    this.passwordPolicyForm = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
      min_length: ["", Validators.required],
      max_length: ["", Validators.required],
      expiration_days: ["", Validators.required],
      disable_recycling_prevention: ["", Validators.required],
      disable_account_lockout: ["", Validators.required],
      pattern: ["", Validators.required],
      pattern_description: ["", Validators.required],
      mvnoId: [""],
      isDelete: [false],
      isNotificationRequired: [false]
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
  }
  onlyNumberKey(event: KeyboardEvent) {
    let specialKeys: Array<string> = [
      "Backspace",
      "Tab",
      "End",
      "Home",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ];

    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = event.currentTarget["value"];
    let next: string = current.concat(event.key);

    // Allow only non-zero positive integers
    if (next && !String(next).match(/^[1-9]\d*$/)) {
      event.preventDefault();
    }
  }

  getAllRole() {
    this.roleService.getAll().subscribe(
      (response: any) => {
        // this.roleList = response.dataList.filter(
        //   (role) => role.product === "BSS"
        // );
        this.roleList = response.dataList;
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

  addEditPassword(id) {
    this.submitted = true;
    if (this.passwordPolicyForm.valid) {
      if (id) {
        const url = "/passwordPolicy/update/" + id;
        this.passwordData = this.passwordPolicyForm.value;
        this.passwordData.id = id;
        this.PasswordPolicyService.updateMethod(url, this.passwordData).subscribe(
          (response: any) => {
            if (response.status === 200) {
              this.submitted = false;
              this.isEdit = false;
              this.passwordPolicyForm.reset();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "",
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              this.router.navigate(["/home/password-policy/list"]);
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
        const url = "/passwordPolicy/create";
        this.passwordData = this.passwordPolicyForm.value;
        // console.log("this.createChargeData", this.countryData);
        this.PasswordPolicyService.postMethod(url, this.passwordData).subscribe(
          (response: any) => {
            if (response.status === 200) {
              this.submitted = false;
              this.passwordPolicyForm.reset();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "",
                icon: "far fa-check-circle"
              });
              this.router.navigate(["/home/password-policy/list"]);
            } else {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: "",
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
    }
  }

  getPasswordById(id) {
    if (id) {
      const url = "/passwordPolicy/get/" + id;
      this.PasswordPolicyService.getMethod(url).subscribe(
        (response: any) => {
          this.isEdit = true;
          this.viewpasswordData = response.passwordList;
          this.passwordPolicyForm.patchValue(this.viewpasswordData);
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

  canExit() {
    if (!this.passwordPolicyForm.dirty) return true;
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
}
