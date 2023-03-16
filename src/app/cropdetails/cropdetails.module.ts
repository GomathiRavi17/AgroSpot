import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CropdetailsRoutingModule } from './cropdetails-routing.module';
import { AddCropComponent } from './add-crop/add-crop.component';
import { EditCropComponent } from './edit-crop/edit-crop.component';
import { CropsListComponent } from './crops-list/crops-list.component';
import { CropsDetailsComponent } from './crops-details/crops-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CropfilterPipe } from '../cropfilter.pipe';


@NgModule({
  declarations: [
    AddCropComponent,
    EditCropComponent,
    CropsListComponent,
    CropsDetailsComponent,
    CropfilterPipe
  ],
  imports: [
    CommonModule,
    CropdetailsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CropdetailsModule { }
