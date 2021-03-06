import {Inject, OnInit} from "@angular/core";
import {EntityBase} from "../entities/entity-base";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EntityServiceBase} from "../services/entity-service-base";
import {Observable} from "rxjs";

export class CardBase<TEntity extends EntityBase, TRepo extends EntityServiceBase<TEntity>>
  implements OnInit {
  public Entity: Observable<TEntity>;

  constructor(
    public dialogRef: MatDialogRef<CardBase<TEntity, TRepo>>,
    protected repo : TRepo,
    @Inject(MAT_DIALOG_DATA) public data: number) {
    this.Entity = repo.getById(data);
  }

  onClick(): void {
    this.dialogRef.close();

  }

  ngOnInit(): void {
  }
}
