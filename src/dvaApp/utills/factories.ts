import {IExtraModel} from "./types"

export const createHashModel = <S>(options: IExtraModel<S>): IExtraModel<S> => {
    return {
        namespace: options.namespace,
        state: options.state,
        reducers: {
            edit(curState: S, { payload }) {
                return {
                    ...curState,
                    ...payload,
                }
            },
            ...options.reducers,
        },
        effects: {
            ...options.effects,
        },
        subscriptions: {
            ...options.subscriptions,
        },
    }
}
