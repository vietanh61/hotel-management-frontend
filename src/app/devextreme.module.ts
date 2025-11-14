import { NgModule } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxPopupModule,
  DxListModule,
  DxFormModule,
  DxTemplateModule,
  DxSelectBoxModule
} from 'devextreme-angular';

@NgModule({
  exports: [
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    DxListModule,
    DxFormModule,
    DxTemplateModule,
    DxSelectBoxModule    
  ]
})
export class DevExtremeModule { }
