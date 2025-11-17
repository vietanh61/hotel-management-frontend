
import { NgModule } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxPopupModule,
  DxListModule,
  DxFormModule,
  DxTemplateModule,
  DxSelectBoxModule,
  DxNumberBoxModule
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
    DxNumberBoxModule
  ]
})
export class DevExtremeModule { }
