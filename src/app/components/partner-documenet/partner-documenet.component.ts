import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
// import { PartnerDocumentService } from "src/app/service/custtomerd";
import { PartnerdocumenetService } from "src/app/service/partnerdocumenet.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ActivatedRoute, Router } from "@angular/router";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { saveAs as importedSaveAs } from "file-saver";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PartnerService } from "src/app/service/partner.service";
declare var $: any;

@Component({
  selector: "app-partner-documenet",
  templateUrl: "./partner-documenet.component.html",
  styleUrls: ["./partner-documenet.component.css"]
})
export class PartnerDocumenetComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;

  custmerDocList: any = [];
  custmerDoc: any = {};
  isCustmerDocList: boolean = true;
  isCustmerDocCreateOrEdit: boolean = false;

  submitted = false;
  editMode: boolean = false;

  insertPartnerDocumentForm: FormGroup;
  parDocId: any;
  partnerID: any;
  BASE_API_URL: any;
  currentDate = new Date();
  maxDate = "2090-04-14";
  minDate: any = "2023-08-28";
  public docTypeForPartnerList: any[] = [
    {
      text: "",
      id: ""
    }
  ];

  docSubTypeList: any[];
  // = [
  //   {
  //     text: "",
  //     id: "",
  //   },
  // ];

  documentStatusList: any[];

  // VerificationModeValue = [{ value: "Online" }, { value: "Offline" }];

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  VerificationModeValue: any = [];
  docTypeList: any[];
  documentverifyData: any = [];

  ifModeInput = false;
  ifDocumentNumber = false;
  labelname: any;
  isEnableStatus: boolean = false;
  isstatus = false;
  custmerType: string;
  disbleDate: any;
  maxDisbleDate: any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  pageItem;
 remarkModal = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private PartnerDocumentService: PartnerdocumenetService,
    public partnerService: PartnerService,
    private route: ActivatedRoute,
    private radiusUtility: RadiusUtility,
    public router: Router,
    public commondropdownService: CommondropdownService
  ) {
    this.minDate = this.currentDate;
  }

  ngOnInit(): void {
    this.insertPartnerDocumentForm = new FormGroup({
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
    // this.BASE_API_URL = this.PartnerDocumentService.getUrl();
    let id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.partnerID = id;
      this.getAll("");
      // this.getSinglePartnerData();
    }

    this.getDocStatusList();
    this.getDocTypeForPartnerList();
    this.verification_Mode();
  }

  verification_Mode() {
    this.VerificationModeValue = [];

    let url = `/commonList/partnerdocverificationmode`;
    this.commondropdownService.getMethod(url).subscribe((response: any) => {
      this.VerificationModeValue = response.dataList;
    });
  }

  docTypevalue = "";
  documentType(event) {
    this.docTypevalue = event.value;
    this.docTypeList = [];
    let url = `/commonList/partnerdocverificationmode_` + event.value;
    this.commondropdownService.getMethod(url).subscribe((response: any) => {
      this.docTypeList = response.dataList;
    });

    if (event.value == "online") {
      this.insertPartnerDocumentForm.patchValue({
        docStatus: "pending"
      });
      this.insertPartnerDocumentForm.controls.docType.setValue(null);
      this.insertPartnerDocumentForm.controls.docSubType.setValue(null);
      this.ifModeInput = true;
      this.isEnableStatus = false;
      this.isstatus = true;
      this.insertPartnerDocumentForm.get("documentNumber").setValidators([Validators.required]);
      this.insertPartnerDocumentForm.get("documentNumber").updateValueAndValidity();
      this.insertPartnerDocumentForm.get("file").clearValidators();
      this.insertPartnerDocumentForm.get("file").updateValueAndValidity();
      this.insertPartnerDocumentForm.get("fileSource").clearValidators();
      this.insertPartnerDocumentForm.get("fileSource").updateValueAndValidity();
    } else {
      this.ifModeInput = false;
      this.docTypeList = this.docTypeForPartnerList;
      this.insertPartnerDocumentForm.patchValue({
        docStatus: "pending"
      });
      this.insertPartnerDocumentForm.controls.docType.setValue(null);
      this.insertPartnerDocumentForm.controls.docSubType.setValue(null);
      this.isEnableStatus = true;
      this.insertPartnerDocumentForm.get("file");
      this.insertPartnerDocumentForm.get("file").updateValueAndValidity();
      this.insertPartnerDocumentForm.get("fileSource");
      this.insertPartnerDocumentForm.get("fileSource").updateValueAndValidity();
      this.insertPartnerDocumentForm.get("documentNumber").clearValidators();
      this.insertPartnerDocumentForm.get("documentNumber").updateValueAndValidity();
    }
  }

  documentSubType(event) {
    this.docSubTypeList = [];
    let url = `/commonList/partnerdocsubtype_` + event.value + "_" + this.docTypevalue;
    this.commondropdownService.getMethod(url).subscribe((response: any) => {
      this.docSubTypeList = response.dataList;
    });
  }

  getSinglePartnerData() {
    // let url = "Partners/" + this.partnerID;
    // this.PartnerDocumentService.PartnergetMethod(url).subscribe((response: any) => {
    //   this.custmerType = response.Partners.custtype;
    // });
  }

  listPartner() {
    this.router.navigate(["/home/partner"]);
  }

  openCustmerDocListMenu() {
    this.clearFormData();
    this.submitted = false;
    this.isCustmerDocCreateOrEdit = false;
    this.isCustmerDocList = true;
    this.pageItem = this.itemsPerPage;
  }

  openCustmerDocCreateMenu() {
    this.clearFormData();
    this.submitted = false;
    this.editMode = false;
    this.isCustmerDocList = false;
    this.isCustmerDocCreateOrEdit = true;
  }

  clearFormData() {
    this.insertPartnerDocumentForm.reset();
    this.editMode = false;
    this.submitted = false;
    this.ifModeInput = false;
    this.ifDocumentNumber = false;
    this.isEnableStatus = true;
    this.insertPartnerDocumentForm.value.docStatus = "";

    this.custmerDoc.filename = "";
    this.insertPartnerDocumentForm.get("documentNumber").clearValidators();
    this.insertPartnerDocumentForm.get("documentNumber").updateValueAndValidity();

    this.insertPartnerDocumentForm.get("file").clearValidators();
    this.insertPartnerDocumentForm.get("file").updateValueAndValidity();

    this.insertPartnerDocumentForm.get("fileSource").clearValidators();
    this.insertPartnerDocumentForm.get("fileSource").updateValueAndValidity();
  }
  downloadDoc(filename, docId, custId) {
    this.PartnerDocumentService.partnerdownloadFile(docId, this.partnerID).subscribe(blob => {
      importedSaveAs(blob, filename);
    });
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    this.getAll("");
  }

  getAll(list) {
    let size;
    this.submitted = false;

    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      if (this.showItemPerPage == 1) {
        this.itemsPerPage = this.pageITEM;
      } else {
        this.itemsPerPage = this.showItemPerPage;
      }
    }
    this.PartnerDocumentService.getPartnerDocumentByCustId(this.partnerID).subscribe(
      (response: any) => {
        this.custmerDocList = response.dataList;
        this.totalRecords = this.custmerDocList.length;
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

  editCustDocById(parDocId, index) {
    this.getDocTypeForPartnerList();
    this.editMode = true;
    this.isCustmerDocList = false;
    this.isCustmerDocCreateOrEdit = true;
    this.parDocId = parDocId;
    // index = this.radiusUtility.getIndexOfSelectedRecord(
    //   index,
    //   this.currentPage,
    //   this.itemsPerPage,
    // )
    // this.custmerDoc = this.custmerDocList[index]
    let status;
    // if (this.custmerDocList[index].docStatus == 'pending') {
    //   status = 'Verification Pending'
    // } else if (this.custmerDocList[index].docStatus == 'verified') {
    //   status = 'Verified'
    // } else {
    //   status = this.custmerDocList[index].docStatus
    // }
    let docModePartner = this.custmerDocList[index].mode;
    this.custmerDoc = {
      docType: this.custmerDocList[index].docType,
      docSubType: this.custmerDocList[index].docSubType,
      docStatus: this.custmerDocList[index].docStatus,
      remark: this.custmerDocList[index].remark,
      filename: this.custmerDocList[index].filename,
      documentNumber: this.custmerDocList[index].documentNumber,
      mode: docModePartner.toLowerCase(),
      docId: this.custmerDocList[index].docId,
      startDate: this.custmerDocList[index].startDate,
      endDate: this.custmerDocList[index].endDate,
      partnerId: this.custmerDocList[index].endDate
    };

    let mode = {
      value: docModePartner.toLowerCase()
    };
    this.documentType(mode);
    let doctypePar = this.custmerDocList[index].docType;
    let Type = {
      value: doctypePar.toLowerCase()
    };
    this.documentSubType(Type);
    if (this.custmerDocList[index].mode == "Online") {
      this.labelname = this.custmerDocList[index].docSubType;
      this.ifModeInput = true;
      this.ifDocumentNumber = true;
      // this.docTypeList = this.docTypeForPartnerList.filter(
      //   subtype => subtype.text === "Proof Of Address" || subtype.text === "Proof of Identity"
      // );
      this.insertPartnerDocumentForm.get("documentNumber").setValidators([Validators.required]);
      this.insertPartnerDocumentForm.get("documentNumber").updateValueAndValidity();
    }
    this.insertPartnerDocumentForm.patchValue(this.custmerDoc);
  }

  deleteConfirm(custDoc) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Partner document?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deletePartnerDocument(custDoc);
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

  deletePartnerDocument(custDoc) {
    let data = {
      docId: custDoc.docId,
      docStatus: custDoc.docStatus,
      docSubType: custDoc.docSubType,
      docType: custDoc.docType,
      documentNumber: custDoc.documentNumber,
      endDate: custDoc.endDate,
      filename: custDoc.filename,
      mode: custDoc.mode,
      mvnoId: custDoc.mvnoId,
      partnerId: custDoc.partnerId,
      remark: custDoc.remark,
      startDate: custDoc.startDate,
      uniquename: custDoc.uniquename
    };
    this.PartnerDocumentService.deletePartnerDocument(data).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        } else {
          this.getAll("");
          this.clearFormData();
          this.openCustmerDocListMenu();
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
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getDocStatusList() {
    this.PartnerDocumentService.getDocStatusList().subscribe(result => {
      this.documentStatusList = result.dataList;
    });
  }

  getDocTypeForPartnerList() {
    this.PartnerDocumentService.getDocTypeForPartnerList().subscribe(result => {
      this.docTypeForPartnerList = result.dataList;
    });
  }

  onChangeDocTypeForPartnerList(doc_type_for_Partner_data) {
    this.insertPartnerDocumentForm.get("docSubType").reset();
    if (doc_type_for_Partner_data) {
      this.docTypeForPartnerList.forEach(element => {
        if (element.id === doc_type_for_Partner_data.id) {
          if (
            this.insertPartnerDocumentForm.value.mode === "Online" &&
            this.insertPartnerDocumentForm.value.docType === "Proof Of Address"
          ) {
            this.docSubTypeList = element.subTypeList.filter(
              subtype => subtype.text === "GST Number"
            );
          } else if (
            this.insertPartnerDocumentForm.value.mode === "Online" &&
            this.insertPartnerDocumentForm.value.docType === "Proof of Identity"
          ) {
            this.docSubTypeList = element.subTypeList.filter(
              subtype => subtype.text === "PAN Card" || subtype.text === "Aadhar Card"
            );
          } else {
            this.docSubTypeList = element.subTypeList;
          }
        }
      });
    } else {
      this.docSubTypeList = [];
    }
  }

 onFileChange(event: any) {
  const file = event.target.files?.[0];
  if (!file) return;

  const blockedExtensions = ['exe', 'zip'];
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension && blockedExtensions.includes(extension)) {
    this.messageService.add({
      severity: 'error',
      summary: 'Invalid File',
      detail: 'EXE and ZIP files are not allowed'
    });

    event.target.value = '';
    this.insertPartnerDocumentForm.patchValue({ fileSource: null });
    return;
  }

  this.insertPartnerDocumentForm.patchValue({
    fileSource: file
  });

  this.custmerDoc.filename = '';
}


  addDocument() {
    this.submitted = true;

    //this.insertPartnerDocumentForm.value.docStatus = "pending";
    if (this.insertPartnerDocumentForm.valid) {
      if (this.editMode) {
        this.updatePartnerDocumentOnDb();
      } else {
        this.savePartnerDocumentOnDb();
      }
    }
  }

  savePartnerDocumentOnDb() {
    let docData;
    let formData: any = new FormData();
    if (this.insertPartnerDocumentForm.value.mode !== "online") {
      let newFormData = Object.assign({}, this.insertPartnerDocumentForm.value);
      if (newFormData.file) {
        docData = [
          {
            partnerId: this.partnerID,
            documentNumber: newFormData.documentNumber,
            mode: newFormData.mode,
            docType: newFormData.docType,
            docSubType: newFormData.docSubType,
            docStatus: newFormData.docStatus,
            remark: newFormData.remark,
            startDate: newFormData.startDate,
            endDate: newFormData.endDate,
            docId: "",
            filename: newFormData.file.split("\\").pop()
          }
        ];
      } else {
        docData = [
          {
            partnerId: this.partnerID,
            documentNumber: newFormData.documentNumber,
            mode: newFormData.mode,
            docType: newFormData.docType,
            docSubType: newFormData.docSubType,
            docStatus: newFormData.docStatus,
            remark: newFormData.remark,
            startDate: newFormData.startDate,
            endDate: newFormData.endDate,
            docId: "",
            filename: ""
          }
        ];
      }
      formData.append("file", newFormData.fileSource);
      formData.append("docDetailsList", JSON.stringify(docData));
      this.PartnerDocumentService.savePartnerDocument(formData).subscribe(
        res => {
          if (res.responseCode == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: res.responseMessage,
              icon: "far fa-times-circle"
            });
          } else if (res.responseCode == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
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
        partnerId: this.partnerID,
        docStatus: this.insertPartnerDocumentForm.value.docStatus,
        docSubType: this.insertPartnerDocumentForm.value.docSubType,
        docType: this.insertPartnerDocumentForm.value.docType,
        documentNumber: this.insertPartnerDocumentForm.value.documentNumber,
        mode: this.insertPartnerDocumentForm.value.mode,
        startDate: this.insertPartnerDocumentForm.value.startDate,
        endDate: this.insertPartnerDocumentForm.value.endDate,
        remark: this.insertPartnerDocumentForm.value.remark
      };
      this.PartnerDocumentService.insertPartnerDocument(data).subscribe(
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
              detail: res.responseMessage,
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

  updatePartnerDocumentOnDb() {
    let docData: any = [];
    let newFormData = Object.assign({}, this.insertPartnerDocumentForm.value);
    // if (newFormData.mode === "Online") {
    //   docData = {
    //     custId: this.partnerID,
    //     docId: this.parDocId,
    //     docType: newFormData.docType,
    //     docSubType: newFormData.docSubType,
    //     docStatus: newFormData.docStatus,
    //     remark: newFormData.remark,
    //     filename: this.custmerDoc.filename,
    //     uniquename: newFormData.uniquename,
    //     mode: newFormData.mode,
    //     startDate: newFormData.startDate,
    //     endDate: newFormData.endDate,
    //     documentNumber: newFormData.documentNumber,
    //   };
    //   this.PartnerDocumentService.updatePartnerOnlineDocument(docData).subscribe(
    //     (res: any) => {
    //       this.getAll('');
    //       this.clearFormData();
    //       this.openCustmerDocListMenu();
    //       this.isEnableStatus = false;
    //       this.messageService.add({
    //         severity: "success",
    //         summary: "Successfully",
    //         detail: res.message,
    //         icon: "far fa-check-circle",
    //       });
    //
    //     },
    //     err => {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: err.error.errorMessage,
    //         icon: "far fa-times-circle",
    //       });
    //
    //     }
    //   );
    // } else {
    docData = {
      partnerId: this.partnerID,
      docId: this.parDocId,
      documentNumber: newFormData.documentNumber,
      mode: newFormData.mode,
      docType: newFormData.docType,
      docSubType: newFormData.docSubType,
      docStatus: newFormData.docStatus,
      remark: newFormData.remark,
      filename: this.custmerDoc.filename,
      uniquename: newFormData.uniquename,
      startDate: newFormData.startDate,
      endDate: newFormData.endDate
    };
    if (newFormData.file) {
      docData.filename = newFormData.file.split("\\").pop();
    }
    this.PartnerDocumentService.updatePartnerDocument(docData).subscribe(
      res => {
        if (res.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: res.responseMessage,
            icon: "far fa-check-circle"
          });
        } else {
          this.getAll("");
          this.clearFormData();
          this.openCustmerDocListMenu();
          this.isEnableStatus = false;
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
    // }
  }

  remark: string;
  remarksubmit = false;
  approveDataobj: any;
  addRemark(data: any) {
    this.approveDataobj = data;
    this.remarkModal = true;
  }

  approvedCustDoc(doc) {}

  DocumentVerify(data) {
    const url = "/partner/" + data.id;
    let documentNumber: "";
    this.partnerService.getMethodNew(url).subscribe(
      (response: any) => {
        if (data.docSubType == "Pan Card") {
          documentNumber = response.Partners.pan;
        }
        if (data.docSubType == "GST Number") {
          documentNumber = response.Partners.gst;
        }
        if (data.docSubType == "Aadhaar Card") {
          documentNumber = response.Partners.aadhar;
        }
        this.documentverifyData = {
          docId: data.docId,
          documentNumber: documentNumber,
          documentType: data.docSubType
        };
        this.verifyDocument(this.documentverifyData);
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

  pageChanged(pagenumber) {
    this.currentPage = pagenumber;
    this.getAll("");
  }
  verifyDocument(data) {
    let documentverifyData = {
      docId: data.docId,
      documentNumber: data.documentNumber,
      documentType: data.docSubType
    };
    this.PartnerDocumentService.DocumentVerify(documentverifyData).subscribe(
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

  OnVerificationMode(event) {
    if (event.value == "Online") {
      this.insertPartnerDocumentForm.patchValue({
        docStatus: "pending"
      });
      this.docTypeList = this.docTypeForPartnerList.filter(
        subtype => subtype.text === "Proof Of Address" || subtype.text === "Proof of Identity"
      );
      this.insertPartnerDocumentForm.controls.docType.setValue(null);
      this.insertPartnerDocumentForm.controls.docSubType.setValue(null);
      this.ifModeInput = true;
      this.isEnableStatus = false;
      this.isstatus = true;
      this.insertPartnerDocumentForm.get("documentNumber").setValidators([Validators.required]);
      this.insertPartnerDocumentForm.get("documentNumber").updateValueAndValidity();
      this.insertPartnerDocumentForm.get("file").clearValidators();
      this.insertPartnerDocumentForm.get("file").updateValueAndValidity();
      this.insertPartnerDocumentForm.get("fileSource").clearValidators();
      this.insertPartnerDocumentForm.get("fileSource").updateValueAndValidity();
    } else {
      this.ifModeInput = false;
      this.docTypeList = this.docTypeForPartnerList;
      this.insertPartnerDocumentForm.patchValue({
        docStatus: "pending"
      });
      this.insertPartnerDocumentForm.controls.docType.setValue(null);
      this.insertPartnerDocumentForm.controls.docSubType.setValue(null);
      this.isEnableStatus = true;
      this.insertPartnerDocumentForm.get("file");
      this.insertPartnerDocumentForm.get("file").updateValueAndValidity();
      this.insertPartnerDocumentForm.get("fileSource");
      this.insertPartnerDocumentForm.get("fileSource").updateValueAndValidity();
      this.insertPartnerDocumentForm.get("documentNumber").clearValidators();
      this.insertPartnerDocumentForm.get("documentNumber").updateValueAndValidity();
    }
  }
  OnDocumentType(event) {
    this.labelname = event.value;
    this.ifDocumentNumber = true;
    this.insertPartnerDocumentForm.controls.documentNumber.setValue("");
  }

  onKeyAdhar(event) {
    let adharnum = this.insertPartnerDocumentForm.value.documentNumber.replace(/\s/g, "");
    let v = adharnum.match(/(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (v) {
      v = v[1] ? v[1] + (v[2] ? " " + v[2] + (v[3] ? " " + v[3] : "") : "") : "";
      adharnum = v;
    }
    if (this.insertPartnerDocumentForm.value.documentNumber.length == 14) {
      let prefix = adharnum.substr(0, adharnum.length - 6);
      let suffix = adharnum.substr(-6);
      let masked = prefix.replace(/[A-Z\d]/g, "*");
      let a = masked + suffix;
      this.insertPartnerDocumentForm.patchValue({
        documentNumber: a
      });
    } else {
      this.insertPartnerDocumentForm.patchValue({
        documentNumber: adharnum
      });
    }
  }

  onKeyPan(e) {
    // let panNum = this.insertPartnerDocumentForm.value.documentNumber.replace(/\s/g, "");
    // let v = panNum.match(/([A-Z]{1,5})?([0-9]{1,4})?([A-Z]{1,1})?/);
    // if (v) {
    //   v = v[1] ? v[1] + (v[2] ? " " + v[2] + (v[3] ? v[3] : "") : "") : "";
    //   panNum = v;
    // }
    // if(this.PartnerGroupForm.value.pan.length == 11){
    //     let prefix = panNum.substr(0, panNum.length - 4);
    //     let suffix = panNum.substr(-4);
    //     let masked = prefix.replace(/[A-Z\d]/g, '*');
    //     let a = masked + suffix;
    //     this.PartnerGroupForm.patchValue({
    //       pan: a,
    //     })
    // }
    // else{
    // this.insertPartnerDocumentForm.patchValue({
    //   documentNumber: panNum,
    // });
    // }
  }

  onKeyGST(e) {
    let gstNum = this.insertPartnerDocumentForm.value.documentNumber.replace(/\s/g, "");
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

    // if(this.insertPartnerDocumentForm.value.documentNumber.length == 17){
    //   let prefix = gstNum.substr(0, gstNum.length - 6);
    //   let suffix = gstNum.substr(-6);
    //   let masked = prefix.replace(/[A-Z\d]/g, '*');
    //   let a = masked + suffix;
    //   this.insertPartnerDocumentForm.patchValue({
    //     documentNumber: a,
    //   })
    // }
    // else
    // {
    this.insertPartnerDocumentForm.patchValue({
      documentNumber: gstNum
    });
    // }
  }

  dateDisble(event) {
    this.disbleDate = event.target.value;
  }

  dateMaxDisble(event) {
    this.maxDisbleDate = event.target.value;
  }
}
