import {Component, OnInit} from '@angular/core';
import {ThreshService} from "../../../services/thresh.service";
import {Globals} from "../../../globals/globals";
import {BoundThresholdDto, ThresholdDto, ThresholdType, ThresholdTypeLabels} from "../../../dto/ThresholdDto";
import {ToastrService} from "ngx-toastr";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {Formatter} from "../../../utils/Formatter";
import {ConfirmDialogComponent} from "../../shared/confirm-dialog/confirm-dialog.component";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-thresh',
    standalone: true,
    imports: [
        NgForOf,
        NgClass,
        ConfirmDialogComponent,
        NgTemplateOutlet,
        NgIf,
        FormsModule
    ],
    templateUrl: './thresh.component.html',
    styleUrl: './thresh.component.scss'
})
export class ThreshComponent implements OnInit {

    thresholds: ThresholdDto[] = [];
    selected: ThresholdDto | null = null;
    showConfirmModal: boolean = false;
    showDetails: boolean = false;
    activeFilter: boolean | null = null; // null = all, true = active, false = inactive

    constructor(private toastr: ToastrService, private globals: Globals, private service: ThreshService) {
    }

    ngOnInit(): void {
        this.loadThresholds();

    }


    loadThresholds() {
        this.service.getThresholds(this.activeFilter).subscribe({
            next: (data) => {
                this.thresholds = data.thresholds;
            }, error: (err) => {
                this.toastr.error(err.error.error);
            }
        })
    }

    clearFilter() {
        this.activeFilter = null;
        this.loadThresholds();
    }

    mapPercentage(dto: ThresholdDto): string {
        return dto.rewardPercentage + "%";
    }

    isBound(threshold: ThresholdDto): threshold is BoundThresholdDto {
        return (threshold as any).bound !== undefined;
    }

    mapIcon(threshold: ThresholdDto): string {
        switch (threshold.type) {
            case ThresholdType.LessEqual:
                return "bi-arrow-bar-down";
            case ThresholdType.GreaterEqual:
                return "bi-arrow-bar-up";
            case ThresholdType.OnlyRole:
                return "bi-person-exclamation";
        }
    }

    mapBound(threshold: BoundThresholdDto): string {
        return Formatter.formatMoney(threshold.bound)
    }

    mapTitle(threshold: ThresholdDto): String {
        return ThresholdTypeLabels[threshold.type];
    }

    openConfirmModal(threshold: ThresholdDto) {
        this.selected = threshold;
        this.showConfirmModal = true;
    }

    closeConfirmModal() {
        this.showConfirmModal = false;
        this.selected = null;
    }

    setThresholdActive(id: number, active: boolean) {
        this.thresholds = this.thresholds.map(t => t.id === id ? {...t, active: active} : t);
    }

    confirmThresholdChange() {
        if (!this.selected) return;
        this.selected.active ? this.deactivateThreshold() : this.activateThreshold();
        this.closeConfirmModal();
    }


    activateThreshold() {
        if (!this.selected?.id) return;
        if (this.selected.active) {
            this.toastr.error("Cannot activate active threshold");
            return;
        }
        const id = this.selected.id;
        this.service.activateThreshold(id).subscribe({
            next: () => {
                this.toastr.success("Threshold activated");
                this.setThresholdActive(id, true);
            }, error: (err) => {
                this.toastr.error(err.error.error);
            }
        })
    }

    openDetails(threshold: ThresholdDto) {
        this.selected = threshold;
        this.showDetails = true;
    }

    closeDetails() {
        this.showDetails = false;
        this.selected = null;
    }


    deactivateThreshold() {

        if (!this.selected?.id) return;
        if (!this.selected.active) {
            this.toastr.error("Cannot deactivate inactive threshold");
            return;
        }
        const id = this.selected.id;
        this.service.deactivateThreshold(id).subscribe({
            next: () => {
                this.toastr.success("Threshold deactivated");
                this.setThresholdActive(id, false);
            }, error: (err) => {
                this.toastr.error(err.error.error);
            }
        })

    }


    protected readonly ThresholdTypeLabels = ThresholdTypeLabels;
    protected readonly Formatter = Formatter;
}
