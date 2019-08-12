import {Model} from "dva"

export interface IExtraModel<S> extends Model {
    state: S,
}
