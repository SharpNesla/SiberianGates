import { Injectable } from '@angular/core';
import {EntityRepository} from "../model/repositories/entity-repository";
import {Computer} from "./computer";

@Injectable({
  providedIn: 'root'
})
export class ComputerService extends EntityRepository<Computer> {

}