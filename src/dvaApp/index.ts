import dva, {DvaInstance} from "dva"
import rImS from "redux-immutable-state-invariant"
import {Store} from "redux"
import {batchDispatchMiddleware} from "redux-batched-actions"
import IAppState, {IBrowserState, ILocalBreakPoints} from "models"
import {createResponsiveStateReducer, responsiveStoreEnhancer} from "redux-responsive"

const commonMiddlewares = [batchDispatchMiddleware]

const middlewares = process.env.NODE_ENV !== "production" ?
    [rImS(), ...commonMiddlewares] :
    [...commonMiddlewares]

interface IDvaInstanceWithStore extends DvaInstance {
    _store: Store<IAppState>,
}

const dvaApp = dva({
    onAction: middlewares,
    extraReducers: {
        media: createResponsiveStateReducer<ILocalBreakPoints, {}>({
            xs: 375,
            sm: 425,
            md: 768,
            lg: 1024,
            elg: 1440,
        }, {
            extraFields: (breakPoints: IBrowserState) => {
                return {
                    isMobile: breakPoints.is.sm || breakPoints.is.xs,
                }
            },
        }),
    },
    extraEnhancers: [
        responsiveStoreEnhancer,
    ],
}) as IDvaInstanceWithStore

export default dvaApp
