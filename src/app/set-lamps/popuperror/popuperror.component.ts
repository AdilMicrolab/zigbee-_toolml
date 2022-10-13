import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Mqtt } from 'src/app/mqtt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popuperror',
  templateUrl: './popuperror.component.html',
  styleUrls: ['./popuperror.component.css'],
})
export class PopuperrorComponent implements OnInit {
  routed_data: any;
  constructor(
    dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public route: Router,
    private dialogRef: MatDialogRef<PopuperrorComponent>
  ) {
    console.log(this.data);
  }

  ngOnInit(): void {}
  no() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: 'no' });
  }

  yes() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: 'yes' });
  }
}
