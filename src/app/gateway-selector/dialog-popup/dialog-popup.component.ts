import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.css'],
})
export class DialogPopupComponent implements OnInit {
  constructor(
    dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public route: Router
  ) {}

  ngOnInit(): void {}

  route_set_page() {
    this.route.navigate(['loading-page'], {
      state: this.data,
    });
  }
}

export class DialogExample {
  constructor(public dialogRef: MatDialogRef<DialogPopupComponent>) {}
}
