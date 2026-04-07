import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Acl } from './model/acl';
import { AclOperationsList } from './model/acl-operations-list';
import { AclSave } from './model/acl-save';
import { Aclsaveoperationlist } from './model/aclsaveoperationlist';
declare var $: any;

@Component({
  selector: 'app-acl-gerneric-component',
  templateUrl: './acl-gerneric-component.component.html',
  styleUrls: ['./acl-gerneric-component.component.scss']
})

export class AclGernericComponentComponent implements OnInit {
  @Output('onSave')
  public saveCallback: EventEmitter<any> = new EventEmitter<any>();

  @Output('onAllAccess')
  public onAllPermitBack: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("view") viewModel: NgbModal;


  @Input()
  DataList: Array<Acl>;
  @Input()
  isUpdated: boolean;

  @Input()
  isAllOperation: boolean;

  constructor(private ngbModalService: NgbModal,private messageService: MessageService
    ) { }
  selectedModule: Acl;
  saveSelectedPermission: Array <Aclsaveoperationlist>;
  selectedPermission: Array<AclOperationsList>;
  targetedindex: number;
  saveModule: AclSave;
  check:boolean;
  selectedPermissionNG: Array<any>;
  setPermmision = false;
  ngOnInit() {
    this.selectedPermission =  new Array<AclOperationsList>();    
  }

  onEditPermission(event, i: number) {
    this.selectedModule =  event;
    this.targetedindex = i;
    this.selectedPermissionNG = null;
    if(this.DataList[this.targetedindex].SelectOperationsList){
    this.DataList[this.targetedindex].TempOperationsList = new Array<AclOperationsList>();
      this.DataList[this.targetedindex].TempOperationsList = Object.assign([], this.DataList[this.targetedindex].SelectOperationsList);
    }
    this.setPermmision = true;
  }
onCheckSameData(temp){
    this.check = true;
  this.DataList[this.targetedindex].TempOperationsList.forEach((sdata)=>{
    if(temp.id === sdata.id){
      this.check = false;
      return;
    }
  });
}
  onSelectPermission(permission_event: Array<AclOperationsList>) {
    this.selectedPermissionNG =  new Array<any>();

if(this.DataList[this.targetedindex].TempOperationsList){
  permission_event.forEach((res)=>{
    let temp = new AclOperationsList();
    temp = res;
    this.onCheckSameData(temp);
    if(this.check === true){
      this.selectedPermissionNG =  new Array<any>();
      this.DataList[this.targetedindex].TempOperationsList.forEach((sdata)=>{
        if(sdata.id === this.DataList[this.targetedindex].operallid){
          this.DataList[this.targetedindex].TempOperationsList = new Array<AclOperationsList>();
          return;
        }
      });
      if(this.DataList[this.targetedindex].operallid === res.id){
        this.DataList[this.targetedindex].TempOperationsList = new Array<AclOperationsList>();
      }
      this.DataList[this.targetedindex].TempOperationsList.push(temp);


    }
    else{
      this.selectedPermissionNG =  new Array<any>();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:'Permission is Already Exist',
        icon: 'far fa-times-circle',
      });
    }
  });
}
else{
  permission_event.forEach((res)=>{
    let temp = new AclOperationsList();
    temp = res;
    if(this.DataList[this.targetedindex].operallid === res.id){
      this.DataList[this.targetedindex].TempOperationsList = new Array<AclOperationsList>();
    }
  });
  this.DataList[this.targetedindex].TempOperationsList = permission_event;
  this.selectedPermissionNG =  new Array<any>();
}

  }

  onDeletSelected(i:number) {
    this.DataList[this.targetedindex].TempOperationsList.splice(i,1);
    this.selectedPermissionNG =  new Array<any>();
  }

  onSavePermission() {
 this.DataList[this.targetedindex].SelectOperationsList = Object.assign([], this.DataList[this.targetedindex].TempOperationsList);
    if (this.DataList[this.targetedindex].SelectOperationsList){
      this.DataList[this.targetedindex].SelectOperationsList.forEach((sdata)=>{
        if(this.DataList[this.targetedindex].operallid === sdata.id){
          this.DataList[this.targetedindex].fullaccess = true;
        }else{
          this.DataList[this.targetedindex].fullaccess = false;
        }
      });
      this.selectedPermissionNG =  new Array<any>();
    }

  this.saveCallback.emit(this.DataList);
  this.setPermmision = false;
}


    onFullAccess(fullEvent?,i?:number) {
      if(this.DataList[i].fullaccess === true){
        this.DataList[i].fullaccess = true;
        if( this.DataList[i]){
          this.DataList[i].SelectOperationsList =  new Array<AclOperationsList>();
          this.DataList[i].TempOperationsList =  new Array<AclOperationsList>();
          this.DataList[i].aclOperationsList.forEach((sdata)=>{
            if( this.DataList[i].operallid === sdata.id){
              let temp = new AclOperationsList();
              temp.id = sdata.id;
              temp.classid = sdata.classid;
              temp.opName =  sdata.opName;
              this.DataList[i].SelectOperationsList.push(temp);
            }
          });
        }
        this.saveCallback.emit(this.DataList);
      }
      if(this.DataList[i].fullaccess === false){
        this.isAllOperation = false;
        this.onAllPermitBack.emit(this.isAllOperation);
        this.DataList[i].SelectOperationsList =  new Array<AclOperationsList>();
        this.DataList[i].TempOperationsList =  new Array<AclOperationsList>();
        this.saveCallback.emit(this.DataList);
      }

    }

    onAllFullAccess(event){
      this.onAllPermitBack.emit(this.isAllOperation);
      if(this.isAllOperation === true){
        this.DataList.forEach((currentValue, index) => {
          currentValue.fullaccess =true;
          this.onFullAccess(null,index);
        });
      }else{
        this.DataList.forEach((currentValue, index) => {
          currentValue.fullaccess =false;
          this.onFullAccess(null,index);
        });
      }
    }


  onPopUpCancel() {
    this.selectedPermissionNG =  new Array<any>();
    this.DataList[this.targetedindex].TempOperationsList =  new Array<AclOperationsList>();
    this.ngbModalService.dismissAll();
    this.setPermmision = false;

  }

  onViewPermission(event,i: number) {
    this.selectedModule =  event;
    this.targetedindex = i;
    $("#viewPermmision").modal('show');
  }
}
