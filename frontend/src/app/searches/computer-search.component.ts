import {Component, forwardRef} from '@angular/core';
import {SingleSearchBase} from "./single-search-base";
import {ComputerExtension} from "../entities/computer";
import {ComputerService} from "../services/computer.service";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {EmployeeExtension} from "../entities/employee";
import {EmployeeService} from "../services/employee.service";

@Component({
  selector: 'sg-computer-search',
  template: `
      <mat-form-field class="sg-search">
          <mat-label>{{hint}}</mat-label>
          <mat-select [disabled]="disabled" [(value)]="this.selectedEntity">
              <button (click)="search()" mat-icon-button>
                  <mat-icon>search</mat-icon>
              </button>
              <mat-form-field appearance="standard">
                  <input matInput [placeholder]="'Поиск ' + searchHint"
                         (keydown)="$event.stopPropagation()"
                         (keydown.enter)="search()"
                         type="search"
                         [(ngModel)]="searchString">
              </mat-form-field>
              <mat-option [value]="null">Не задано</mat-option>
              <mat-option *ngFor="let entity of entities" [value]="entity">
                  {{entity?.Id}} {{entity?.Name}} {{entity?.InventoryId}}
              </mat-option>
          </mat-select>
      </mat-form-field>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => ComputerSearchComponent)
  }],
  styleUrls: ['./search-styles.scss']
})
export class ComputerSearchComponent extends SingleSearchBase<ComputerExtension> {
  constructor(service : ComputerService){
    super(service)
  }
}
