import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditUserComponent } from './edit-user.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    EditUserComponent
  ],
  exports: [
    EditUserComponent
  ],
  entryComponents: [ EditUserComponent ]
})
export class EditUserModule { }
