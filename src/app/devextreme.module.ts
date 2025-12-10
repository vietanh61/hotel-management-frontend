
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
  DxTagBoxModule,
  DxDateBoxModule
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
    DxTagBoxModule,
    DxDateBoxModule
  ]
})
export class DevExtremeModule { }
