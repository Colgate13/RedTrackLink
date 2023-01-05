export class Entity<EntityType> {
  protected readonly _id: string;
  public readonly props: EntityType;

  constructor(props: EntityType, id?: string) {
    this._id = id || String(Math.floor(Date.now() / 1000));
    this.props = props;
  }

  public equals(object?: Entity<EntityType>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this._id === object._id;
  }
}