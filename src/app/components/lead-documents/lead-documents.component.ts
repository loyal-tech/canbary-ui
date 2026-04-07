import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ActivatedRoute, Router } from "@angular/router";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { saveAs as importedSaveAs } from "file-saver";
import { filter } from "rxjs/operators";
import { LeadDocumentService } from "./lead-documents.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { SALES_CRMS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-lead-documents",
  templateUrl: "./lead-documents.component.html",
  styleUrls: ["./lead-documents.component.css"]
})
export class LeadDocumentsComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  custmerDocList: any = [];
  custmerDoc: any = {};
  isCustmerDocList: boolean = true;
  isCustmerDocCreateOrEdit: boolean = false;

  submitted = false;
  editMode: boolean = false;

  insertLeadDocumentForm: FormGroup;
  custDocId: any;
  leadId: any;
  BASE_API_URL: any;
  currentDate = new Date();
  maxDate = "2090-04-14";
  minDate: any = "2023-08-28";
  public docTypeForLeadList: any[] = [
    {
      text: "",
      id: ""
    }
  ];

  public docSubTypeList: any[] = [
    {
      text: "",
      id: ""
    }
  ];

  documentStatusList: any[];

  VerificationModeValue = [{ value: "Online" }, { value: "Offline" }];

  documentverifyData: any = [];

  ifModeInput = false;
  ifDocumentNumber = false;
  labelname: any;
  isEnableStatus: boolean = false;
  isstatus = false;
  docTypeList: any[];
  custmerType: string;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  downloadDocAccess: boolean = false;
  selectedFilePreview: any[] = [];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private leadDocumentService: LeadDocumentService,
    private route: ActivatedRoute,
    private radiusUtility: RadiusUtility,
    public router: Router,
    public commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.editAccess = loginService.hasPermission(SALES_CRMS.LEAD_DOCS_EDIT);
    this.deleteAccess = loginService.hasPermission(SALES_CRMS.LEAD_DOCS_DELETE);
    this.createAccess = loginService.hasPermission(SALES_CRMS.LEAD_DOCS_CREATE);
    this.downloadDocAccess = loginService.hasPermission(SALES_CRMS.LEAD_DOCS_DOWNLOAD);
    this.minDate = this.currentDate;
  }

  startDateError: any = { isError: false, errorMessage: "" };

  compareStartDates() {
    this.insertLeadDocumentForm.controls["startDate"].setErrors(null);
    if (
      this.insertLeadDocumentForm.controls["endDate"].value &&
      this.insertLeadDocumentForm.controls["startDate"].value
    ) {
      if (
        new Date(this.insertLeadDocumentForm.controls["startDate"].value) >
        new Date(this.insertLeadDocumentForm.controls["endDate"].value)
      ) {
        this.startDateError = {
          isError: true,
          errorMessage: "Start date should not be greater than end date."
        };
        this.insertLeadDocumentForm.controls["startDate"].setErrors({ incorrect: true });
        return;
      } else {
        this.insertLeadDocumentForm.controls["startDate"].setErrors(null);
        this.startDateError = { isError: true, errorMessage: null };

        this.insertLeadDocumentForm.controls["endDate"].setErrors(null);
        this.endDateError = { isError: true, errorMessage: null };
      }
    }
  }

  endDateError: any = { isError: false, errorMessage: "" };

  compareEndDates() {
    this.insertLeadDocumentForm.controls["endDate"].setErrors(null);
    if (
      this.insertLeadDocumentForm.controls["endDate"].value &&
      this.insertLeadDocumentForm.controls["startDate"].value
    ) {
      if (
        new Date(this.insertLeadDocumentForm.controls["endDate"].value) <
        new Date(this.insertLeadDocumentForm.controls["startDate"].value)
      ) {
        this.endDateError = {
          isError: true,
          errorMessage: "End Date must be greater than start date."
        };
        this.insertLeadDocumentForm.controls["endDate"].setErrors({ incorrect: true });
        return;
      } else {
        this.insertLeadDocumentForm.controls["endDate"].setErrors(null);
        this.endDateError = { isError: true, errorMessage: null };
        this.insertLeadDocumentForm.controls["startDate"].setErrors(null);
        this.startDateError = { isError: true, errorMessage: null };
      }
    }
  }

  ngOnInit(): void {
    this.insertLeadDocumentForm = new FormGroup({
      docId: new FormControl(""),
      docType: new FormControl("", [Validators.required]),
      docSubType: new FormControl("", [Validators.required]),
      docStatus: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
      file: new FormControl(""),
      fileSource: new FormControl(""),
      documentNumber: new FormControl(""),
      mode: new FormControl("", [Validators.required]),
      startDate: new FormControl(""),
      endDate: new FormControl("")
    });
    this.BASE_API_URL = this.leadDocumentService.getUrl();
    let id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.leadId = id;
      this.getAll("");
    }

    this.getDocStatusList();
    this.docTypeForLeadList = [];
   const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
        this.editMode = true;
        this.leadId = +idParam;
        setTimeout(() => {
        const index = this.custmerDocList.findIndex(doc => doc.leadMaster.id === this.leadId);
        if (index !== -1) {
            const docId = this.custmerDocList[index].docId;
            this.editCustDocById(docId, index);
        } else {
            console.warn('Lead doc not found for ID', this.leadId);
        }
        }, 100);
    }
  }

  pageChangedDocList(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getAll("");
    } else {
      this.getAll("");
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAll(this.showItemPerPage);
    } else {
      this.getAll("");
    }
  }

  getAll(val) {
    let size;
    this.searchkey = "";
    let pageList = this.currentPage;
    if (val) {
      size = val;
      this.itemsPerPage = val;
    } else {
      size = this.itemsPerPage;
    }
    this.submitted = false;

    const url = "leadDoc/all/" + this.leadId + "?page=" + pageList + "&pageSize=" + size;
    this.leadDocumentService.getLeadDocumentByCustId(url).subscribe(
      (response: any) => {
        this.custmerDocList = response.custmerDocList.content;
        this.totalRecords = response.custmerDocList.totalElements;
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

  openCustmerDocListMenu() {
    this.clearFormData();
    this.submitted = false;
    this.isCustmerDocCreateOrEdit = false;
    this.isCustmerDocList = true;
  }

  openCustmerDocCreateMenu() {
    this.clearFormData();
    this.submitted = false;
    this.editMode = false;
    this.isCustmerDocList = false;
    this.isCustmerDocCreateOrEdit = true;
  }

  downloadDoc(filename, docId, leadId) {
    this.leadDocumentService.downloadFile(docId, leadId).subscribe(blob => {
      importedSaveAs(blob, filename);
    });
  }

  editCustDocById(docId, index) {
    //this.getDocTypeForLeadList();
    this.editMode = true;
    this.isCustmerDocList = false;
    this.isCustmerDocCreateOrEdit = true;
    this.leadId = this.custmerDocList[index].leadMaster.id;
    this.custDocId = docId;
    let status;
    this.custmerDoc = {
      leadMasterId: this.custmerDocList[index].leadMaster.id,
      docType: this.custmerDocList[index].docType,
      docSubType: this.custmerDocList[index].docSubType,
      docStatus: this.custmerDocList[index].docStatus,
      remark: this.custmerDocList[index].remark,
      filename: this.custmerDocList[index].filename,
      documentNumber: this.custmerDocList[index].documentNumber,
      mode: this.custmerDocList[index].mode,
      docId: this.custmerDocList[index].docId,
      startDate: this.custmerDocList[index].startDate,
      endDate: this.custmerDocList[index].endDate
    };

    if (this.custmerDocList[index].mode == "Online") {
      var event = { value: "Online" };
      this.OnVerificationMode(event);

      this.labelname = this.custmerDocList[index].docSubType;
      this.ifModeInput = true;
      this.ifDocumentNumber = true;
      this.insertLeadDocumentForm.get("documentNumber").setValidators([Validators.required]);
      this.insertLeadDocumentForm.get("documentNumber").updateValueAndValidity();
    } else {
      var event = { value: "Offline" };
      this.OnVerificationMode(event);
      var eventTemp = { value: this.custmerDocList[index].docType };
      this.documentSubType(eventTemp);
    }
    this.insertLeadDocumentForm.get("file").clearValidators();
    this.insertLeadDocumentForm.get("file").updateValueAndValidity();

    this.insertLeadDocumentForm.get("fileSource").clearValidators();
    this.insertLeadDocumentForm.get("fileSource").updateValueAndValidity();
    this.insertLeadDocumentForm.patchValue(this.custmerDoc);

    this.selectedFilePreview.push({
      name: this.custmerDocList[index].filename
    });
  }

  deleteConfirm(custDoc) {
    this.confirmationService.confirm({
      message: "Do you want to delete this customer document?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteLeadDocument(custDoc);
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

  deleteLeadDocument(custDoc) {
    this.leadDocumentService.deleteLeadDocument(custDoc).subscribe(
      (response: any) => {
        this.clearFormData();
        this.openCustmerDocListMenu();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });

        this.getAll("");
        location.reload();
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

  clearFormData() {
    this.insertLeadDocumentForm.reset();
    this.editMode = false;
    this.submitted = false;
    this.ifModeInput = false;
    this.ifDocumentNumber = false;
    this.isEnableStatus = true;
    this.insertLeadDocumentForm.value.docStatus = "";

    this.custmerDoc.filename = "";
    this.selectedFilePreview = [];
    this.insertLeadDocumentForm.get("documentNumber").clearValidators();
    this.insertLeadDocumentForm.get("documentNumber").updateValueAndValidity();

    this.insertLeadDocumentForm.get("file").clearValidators();
    this.insertLeadDocumentForm.get("file").updateValueAndValidity();

    this.insertLeadDocumentForm.get("fileSource").clearValidators();
    this.insertLeadDocumentForm.get("fileSource").updateValueAndValidity();
  }

  getDocStatusList() {
    this.leadDocumentService.getDocStatusList().subscribe(result => {
      this.documentStatusList = result.dataList;
    });
  }

  getDocTypeForLeadList() {
    this.leadDocumentService.getDocTypeForLeadList().subscribe(result => {
      this.docTypeForLeadList = result.dataList;
    });
  }

  documentSubType(event) {
    this.docSubTypeList = [];
    let url = `/commonList/custdocsubtype_` + event.value + "_" + this.docTypevalue;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.docSubTypeList = response.dataList;
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.insertLeadDocumentForm.patchValue({
        fileSource: file
      });
      this.selectedFilePreview.push(file);
      this.custmerDoc.filename = "";
    }
  }

  addDocument() {
    this.submitted = true;
    //this.insertLeadDocumentForm.value.docStatus = "pending";
    if (this.insertLeadDocumentForm.valid) {
      if (this.editMode) {
        this.updateLeadDocumentOnDb();
      } else {
        this.saveLeadDocumentOnDb();
      }
    }
  }

  saveLeadDocumentOnDb() {
    let formData: any = new FormData();
    if (this.insertLeadDocumentForm.value.mode !== "Online") {
      let newFormData = Object.assign({}, this.insertLeadDocumentForm.value);
      let docData: any = {
        leadMasterId: this.leadId,
        docType: newFormData.docType,
        docSubType: newFormData.docSubType,
        docStatus: newFormData.docStatus,
        remark: newFormData.remark,
        startDate: newFormData.startDate,
        endDate: newFormData.endDate,
        filename: newFormData.file.split("\\").pop()
      };
      formData.append("file", newFormData.fileSource);
      formData.append("docDetails", JSON.stringify(docData));
      this.leadDocumentService.saveLeadDocument(formData).subscribe(
        res => {
          if (res.responseCode == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: res.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getAll("");
            this.clearFormData();
            this.openCustmerDocListMenu();

            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: res.message,
              icon: "far fa-check-circle"
            });
          }
        },
        err => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    } else {
      let data = {
        leadMasterId: this.leadId,
        docStatus: this.insertLeadDocumentForm.value.docStatus,
        docSubType: this.insertLeadDocumentForm.value.docSubType,
        docType: this.insertLeadDocumentForm.value.docType,
        documentNumber: this.insertLeadDocumentForm.value.documentNumber,
        mode: this.insertLeadDocumentForm.value.mode,
        startDate: this.insertLeadDocumentForm.value.startDate,
        endDate: this.insertLeadDocumentForm.value.endDate,
        remark: this.insertLeadDocumentForm.value.remark
      };

      this.leadDocumentService.saveLeadOnlineDocument(data).subscribe(
        (res: any) => {
          if (res.responseCode == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: res.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getAll("");
            this.clearFormData();
            this.openCustmerDocListMenu();

            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              //detail: res.responseMessage,
              icon: "far fa-check-circle"
            });
          }
        },
        err => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  updateLeadDocumentOnDb() {
    let docData: any = [];
    let formData: any = new FormData();
    let newFormData = Object.assign({}, this.insertLeadDocumentForm.value);

    if (newFormData.mode === "Online") {
      docData = {
        leadMasterId: this.leadId,
        docId: this.custDocId,
        docType: newFormData.docType,
        docSubType: newFormData.docSubType,
        docStatus: newFormData.docStatus,
        remark: newFormData.remark,
        filename: this.custmerDoc.filename,
        uniquename: newFormData.uniquename,
        mode: newFormData.mode,
        startDate: newFormData.startDate,
        endDate: newFormData.endDate,
        documentNumber: newFormData.documentNumber
      };
      this.leadDocumentService.updateLeadOnlineDocument(docData).subscribe(
        (res: any) => {
          this.getAll("");
          this.clearFormData();
          this.openCustmerDocListMenu();
          this.isEnableStatus = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            //detail: res.message,
            icon: "far fa-check-circle"
          });
        },
        err => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    } else {
      docData = {
        leadMasterId: this.leadId,
        docId: this.custDocId,
        docType: newFormData.docType,
        docSubType: newFormData.docSubType,
        docStatus: newFormData.docStatus,
        remark: newFormData.remark,
        filename: this.custmerDoc.filename,
        uniquename: newFormData.uniquename,
        startDate: newFormData.startDate,
        endDate: newFormData.endDate,
        mode: newFormData.mode
      };

      if (newFormData.file) {
        docData.filename = newFormData.file.split("\\").pop();
      }
      formData.append("file", newFormData.fileSource);
      formData.append("docDetails", JSON.stringify(docData));

      this.leadDocumentService.saveLeadDocument(formData).subscribe(
        res => {
          this.getAll("");
          this.clearFormData();
          this.openCustmerDocListMenu();
          this.isEnableStatus = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            //detail: res.message,
            icon: "far fa-check-circle"
          });
        },
        err => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  listLead() {
    this.router.navigate(["/home/lead-management"]);
  }

  approvedCustDoc(doc) {
    this.leadDocumentService.approvedCustDoc(doc.docId, "verified").subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          //detail: "Document approved successfully.",
          icon: "far fa-check-circle"
        });
        this.getAll("");
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

  // DocumentVerify(data) {
  //   this.spinner.show()
  //   const url = 'customers/' + data.leadId

  //   let documentNumber: ''
  //   this.leadDocumentService.LeadgetMethod(url).subscribe(
  //     (response: any) => {
  //       if (data.docSubType == 'Pan Card') {
  //         documentNumber = response.customers.pan
  //       }
  //       if (data.docSubType == 'GST Number') {
  //         documentNumber = response.customers.gst
  //       }
  //       if (data.docSubType == 'Aadhaar Card') {
  //         documentNumber = response.customers.aadhar
  //       }

  //       this.documentverifyData = {
  //         docId: data.docId,
  //         documentNumber: documentNumber,
  //         documentType: data.docSubType,
  //       }
  //       this.verifyDocument(this.documentverifyData)
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: error.error.ERROR,
  //         icon: 'far fa-times-circle',
  //       })
  //       this.spinner.hide()
  //     },
  //   )
  // }

  pageChanged(pagenumber) {
    this.currentPage = pagenumber;
  }
  verifyDocument(data) {
    let documentverifyData = {
      docId: data.docId,
      documentNumber: data.documentNumber,
      documentType: data.docSubType
    };
    this.leadDocumentService.DocumentVerify(documentverifyData).subscribe(
      (response: any) => {
        this.documentverifyData = [];
        this.getAll("");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        if (error.error.status === 500) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.message,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  docTypevalue: any;
  OnVerificationMode(event) {
    //this.docTypeForLeadList = [];
    let url = "";
    this.docTypevalue = "";
    if (event.value == "Online") {
      this.docTypevalue = "online";
      url = `/commonList/custdocverificationmodes?mode=` + this.docTypevalue;
    } else {
      this.docTypevalue = "offline";
      url = `/commonList/custdocverificationmodes?mode=` + this.docTypevalue;
    }
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.docTypeForLeadList = response.dataList;
      if (
        this.custmerDoc.docType &&
        this.custmerDoc.docType != null &&
        this.custmerDoc.docType != ""
      ) {
        var eventTemp = { value: this.custmerDoc.docType };
        this.documentSubType(eventTemp);
      }
    });

    if (event.value == "Online") {
      this.insertLeadDocumentForm.patchValue({
        docStatus: "pending"
      });

      // this.insertLeadDocumentForm.controls.docType.setValue(null);
      // this.insertLeadDocumentForm.controls.docSubType.setValue(null);
      this.ifModeInput = true;
      this.isEnableStatus = false;
      this.isstatus = true;

      this.insertLeadDocumentForm.get("documentNumber").setValidators([Validators.required]);
      this.insertLeadDocumentForm.get("documentNumber").updateValueAndValidity();

      this.insertLeadDocumentForm.get("file").clearValidators();
      this.insertLeadDocumentForm.get("file").updateValueAndValidity();

      this.insertLeadDocumentForm.get("fileSource").clearValidators();
      this.insertLeadDocumentForm.get("fileSource").updateValueAndValidity();
    } else {
      this.ifModeInput = false;
      this.isstatus = false;

      this.docTypeList = this.docTypeForLeadList;
      this.insertLeadDocumentForm.patchValue({
        docStatus: "pending"
      });
      // this.insertLeadDocumentForm.controls.docType.setValue(null);
      // this.insertLeadDocumentForm.controls.docSubType.setValue(null);
      this.isEnableStatus = true;

      this.insertLeadDocumentForm.get("file").setValidators([Validators.required]);
      this.insertLeadDocumentForm.get("file").updateValueAndValidity();

      this.insertLeadDocumentForm.get("fileSource").setValidators([Validators.required]);
      this.insertLeadDocumentForm.get("fileSource").updateValueAndValidity();

      this.insertLeadDocumentForm.get("documentNumber").clearValidators();
      this.insertLeadDocumentForm.get("documentNumber").updateValueAndValidity();
    }
  }
  OnDocumentType(event) {
    this.labelname = event.value;
    this.ifDocumentNumber = true;
    this.insertLeadDocumentForm.controls.documentNumber.setValue("");
  }

  onKeyAdhar(event) {
    let adharnum = this.insertLeadDocumentForm.value.documentNumber.replace(/\s/g, "");

    let v = adharnum.match(/(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (v) {
      v = v[1] ? v[1] + (v[2] ? " " + v[2] + (v[3] ? " " + v[3] : "") : "") : "";
      adharnum = v;
    }

    // if(this.insertLeadDocumentForm.value.documentNumber.length == 14){
    //   let prefix = adharnum.substr(0, adharnum.length - 6);
    //   let suffix = adharnum.substr(-6);
    //   let masked = prefix.replace(/[A-Z\d]/g, '*');
    //   let a = masked + suffix;
    //   this.insertLeadDocumentForm.patchValue({
    //     documentNumber: a,
    //   })
    // } else{
    this.insertLeadDocumentForm.patchValue({
      documentNumber: adharnum
    });
    // }
  }

  onKeyPan(e) {
    let panNum = this.insertLeadDocumentForm.value.documentNumber.replace(/\s/g, "");
    let v = panNum.match(/([A-Z]{1,5})?([0-9]{1,4})?([A-Z]{1,1})?/);
    if (v) {
      v = v[1] ? v[1] + (v[2] ? " " + v[2] + (v[3] ? v[3] : "") : "") : "";
      panNum = v;
    }

    // if(this.customerGroupForm.value.pan.length == 11){
    //     let prefix = panNum.substr(0, panNum.length - 4);
    //     let suffix = panNum.substr(-4);
    //     let masked = prefix.replace(/[A-Z\d]/g, '*');
    //     let a = masked + suffix;
    //     this.customerGroupForm.patchValue({
    //       pan: a,
    //     })
    // }
    // else{
    this.insertLeadDocumentForm.patchValue({
      documentNumber: panNum
    });
    // }
  }

  onKeyGST(e) {
    let gstNum = this.insertLeadDocumentForm.value.documentNumber.replace(/\s/g, "");
    let v = gstNum.match(
      /(\d{1,2})?([A-Z]{1,3})?([A-Z]{1,2})?(\d{1,3})?(\d{1,1})?([A-Z]{1,1})?([A-Z\d]{1,1})?([Z]{1,1})?([A-Z\d]{1,1})?/
    );
    if (v) {
      v = v[1]
        ? v[1] +
          (v[2]
            ? v[2] +
              (v[3]
                ? " " +
                  v[3] +
                  (v[4]
                    ? v[4] +
                      (v[5]
                        ? " " +
                          v[5] +
                          (v[6]
                            ? v[6] + (v[7] ? v[7] + (v[8] ? v[8] + (v[9] ? v[9] : "") : "") : "")
                            : "")
                        : "")
                    : "")
                : "")
            : "")
        : "";
      gstNum = v;
    }

    // if(this.insertLeadDocumentForm.value.documentNumber.length == 17){
    //   let prefix = gstNum.substr(0, gstNum.length - 6);
    //   let suffix = gstNum.substr(-6);
    //   let masked = prefix.replace(/[A-Z\d]/g, '*');
    //   let a = masked + suffix;
    //   this.insertLeadDocumentForm.patchValue({
    //     documentNumber: a,
    //   })
    // }
    // else
    // {
    this.insertLeadDocumentForm.patchValue({
      documentNumber: gstNum
    });
    // }
  }
}
