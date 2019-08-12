import {ICountState} from "./count"
import {IUserState} from "./user"
import {IBrowser, IBreakPoints} from "redux-responsive/types"
import {IProfileState} from "./profile"

export interface IAppStateLoading {
    global: boolean,
    models: {
        count: boolean,
        user: boolean,
    },
    effects: {
        "user/auth": boolean,
        "user/signup": boolean,
        "profile/getData": boolean,
    }
}

export interface ILocalBreakPoints extends IBreakPoints<string> {
    xs: 375,
    sm: 425,
    md: 768,
    lg: 1024,
    elg: 1440,
}

export interface IBrowserState extends IBrowser<ILocalBreakPoints> {
    isMobile: boolean,
}

export default interface IAppState {
    loading: IAppStateLoading,
    count: ICountState,
    user: IUserState,
    profile: IProfileState,
    media: IBrowserState,
}
