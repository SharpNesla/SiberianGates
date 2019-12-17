import {EntityBase} from "../entities/entity-base";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {count, filter, map} from "rxjs/operators";

export const toCamel = (s) => {
  var str = s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
  return str[0].toUpperCase() + str.slice(1);
};

const isArray = function (a) {
  return Array.isArray(a);
};

const isObject = function (o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

export const keysToCamel = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }

  return o;
};
const toSnake = function (s) {
  return s.replace(/\.?([A-Z])/g, function (x, y) {
    return "_" + y.toLowerCase()
  }).replace(/^_/, "")
};
export const keysToSnake = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[toSnake(k)] = o[k];
      });

    return n;
  }
  return o;
};

export abstract class EntityServiceBase<T extends EntityBase> {
  protected constructor(protected client: HttpClient,
                        protected entityPrefix: string) {

  }

  public getCount(filterDefinition): Observable<number> {
    return this.client.get<number>(`api/${this.entityPrefix}/count`);
  }

  public remove(entity: T) {
    return this.client.delete(`api/${this.entityPrefix}/remove/${entity.Id}`)
  }

  public getById(id: number): Observable<T> {
    return this.client.get<T>(`api/${this.entityPrefix}/${id}`)
      .pipe(map(
        y => keysToCamel(y)
      ));
  }

  public getWithAllCount(searchString: string, offset: number, limit: number, filterDefinition: object,
                         sortDefinition: string, sortOrder: string): Observable<{ entities: T[], allCount: number }> {
    let params = new HttpParams()
      .set("offset", offset.toString())
      .set("limit", limit.toString())
      .set("sort-definition", sortDefinition == null ? "id" : sortDefinition)
      .set("sort-order", sortOrder)
      .set("filter", JSON.stringify(keysToSnake(filterDefinition)))
      .set("with-count", 'true');

    if (searchString) {
      params = params.set('search-string', searchString);
    }

    return this.client.get<{ entities: T[], count: number }>(`api/${this.entityPrefix}/get`, {params})
      .pipe(map(x =>
        ({
          entities: x.entities.map(y => keysToCamel(y)),
          allCount: x['all_count']
        })
      ));
  }

  public get(searchString: string, offset: number, limit: number, filterDefinition: object,
             sortDefinition: string, sortOrder: string): Observable<T[]> {
    let params = new HttpParams()
      .set("offset", offset.toString())
      .set("limit", limit.toString())
      .set("sort-definition", sortDefinition == null ? "id" : sortDefinition)
      .set("sort-order", sortOrder)
      .set("filter", JSON.stringify(keysToSnake(filterDefinition)));

    if (searchString) {
      params = params.set('search-string', searchString);
    }

    return this.client.get<T[]>(`api/${this.entityPrefix}/get`, {params})
      .pipe(map(x => x.map(entity => keysToCamel(entity))))
  }

  public add(entity: T) {
    const preparedEntity = this.prepareEntity({...entity});
    return this.client.post(`api/${this.entityPrefix}/add`, keysToSnake(preparedEntity))
  }

  public update(entity: T) {
    const preparedEntity = this.prepareEntity({...entity});
    return this.client.post(`api/${this.entityPrefix}/edit/${entity.Id}`, keysToSnake(preparedEntity));
  }

  protected prepareEntity(entity: T): T {
    entity.CreatedAt = undefined;
    entity.UpdatedAt = undefined;
    entity.DeletedAt = undefined;

    return entity;
  }
}

export abstract class PackEntityService<T extends EntityBase> extends EntityServiceBase<T> {
  protected constructor(client: HttpClient,
                        entityPrefix: string) {
    super(client, entityPrefix)
  }

  protected prepareEntityRange(entity: T): T {
    entity.CreatedAt = undefined;
    entity.UpdatedAt = undefined;
    entity.DeletedAt = undefined;

    return entity;
  }

  public addRange(entity: T, count: number) {
    const preparedEntity = this.prepareEntityRange({...entity});
    preparedEntity['Count'] = count;
    return this.client.post(`api/${this.entityPrefix}/add-pack`, keysToSnake(preparedEntity))
  }
}
