import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Input() confirmText: string = 'Yes';
  @Input() cancelText: string = 'Cancel';
  @Input() show: boolean = false;
  @Input() disableConfirm: boolean = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
    this.show = false;
  }

  cancel() {
    this.cancelled.emit();
    this.show = false;
  }
}
