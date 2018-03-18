import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditUserModalComponent } from './edit-user-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    EditUserModalComponent
  ],
  exports: [
    EditUserModalComponent
  ]
})
export class EditUserModalModule { }
