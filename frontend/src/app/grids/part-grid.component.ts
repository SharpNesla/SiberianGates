import {Component, OnInit} from '@angular/core';
import {PartTypeService} from "../services/part-type.service";
import {Observable} from "rxjs";
import {Computer} from "../entities/computer";
import {EditorBase} from "../editors/editor-base";
import {Part} from "../entities/part";
import {PartService} from "../services/part.service";
import {EntityGridBase} from "./entity-grid-base";
import {MatDialog} from "@angular/material/dialog";
import {PartCardComponent} from "../cards/part-card.component";


@Component({
  selector: 'sg-part-grid',
  template: `

      <div class="sg-table-container">
          <table mat-table [dataSource]="this.entities"
                 [class.sg-table-compact]="isCompact" class="sg-table">
              <ng-container matColumnDef="select">
                  <th mat-header-cell *matHeaderCellDef>
                      <mat-checkbox (change)="$event ? masterToggle() : null"
                                    [checked]="selection.hasValue() && isAllSelected()"
                                    [indeterminate]="selection.hasValue() && !isAllSelected()">
                      </mat-checkbox>
                  </th>
                  <td mat-cell class="sg-table-checkbox" *matCellDef="let row">
                      <mat-checkbox (click)="$event.stopPropagation()"
                                    (change)="$event ? selection.toggle(row) : null"
                                    [checked]="selection.isSelected(row)">
                      </mat-checkbox>
                  </td>
              </ng-container>

              <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>№</th>
                  <td mat-cell *matCellDef="let element"> {{element.Id}} </td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Имя</th>
                  <td mat-cell *matCellDef="let element"> {{element.Name}} </td>
              </ng-container>

              <ng-container matColumnDef="inventory_id">
                  <th mat-header-cell *matHeaderCellDef>Инвентарный номер</th>
                  <td mat-cell *matCellDef="let element"> {{element.InventoryId}}</td>
              </ng-container>

              <ng-container matColumnDef="info" stickyEnd>
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let element"
                      [class.sg-table-action-button-container-compact]="isCompact"
                      class="sg-table-action-button-container">
                      <button mat-icon-button
                              *ngIf="!isCompact" (click)="remove(element)">
                          <mat-icon>delete</mat-icon>
                      </button>
                      <button mat-icon-button *ngIf="!isCompact"
                              [routerLink]="'/computers/edit/' + element.Id">
                          <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button
                              (click)="showInfoCard(element)">
                          <mat-icon class="sg-table-info-button">error_outline</mat-icon>
                      </button>
                  </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="DisplayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: DisplayedColumns;"></tr>
          </table>
          <div class="sg-search-drawer mat-elevation-z4" [class.sg-search-drawer-active]="filterState">
              <div class="sg-search-drawer-ruleset">
                  <mat-checkbox>По количеству ПО</mat-checkbox>
                  <mat-form-field>
                      <input matInput placeholder="Нижняя граница">
                  </mat-form-field>
                  <mat-form-field>
                      <input matInput placeholder="Верхняя граница">
                  </mat-form-field>
              </div>
          </div>
      </div>

      <sg-crud router-link="/parts/add"
               icon="memory"
               [count]="this.count"
               (Paginate)="this.paginate($event.offset, $event.limit)"
               entity-name="комплектующих"
               (search)="searchString = $event"
               (toggleFilters)="filterState = $event"
               [isCompact]="this.isCompact"></sg-crud>`
})
export class PartGridComponent extends EntityGridBase<Part, PartService> {
  constructor(service: PartService, dialog: MatDialog) {
    super(service, dialog, ['select', 'id', 'name', 'inventory_id', 'info'],
      PartCardComponent);
  }
}
