
import { NgModule } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxPopupModule,
  DxListModule,
  DxFormModule,
  DxTemplateModule,
  DxSelectBoxModule,
  DxNumberBoxModule,
  DxTagBoxModule
} from 'devextreme-angular';

@NgModule({
  exports: [
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    DxListModule,
    DxFormModule,
    DxTemplateModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxTagBoxModule
  ]
})
export class DevExtremeModule { }
