import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.css'],
})
export class DialogPopupComponent implements OnInit {
  constructor(dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public anyvar: any) {}

  ngOnInit(): void {}
}

export class DialogExample {
  constructor(public dialogRef: MatDialogRef<DialogPopupComponent>) {}
}
