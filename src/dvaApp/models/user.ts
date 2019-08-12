import * as API from "api/main"
import {IRequestResult} from "api"
import {batchActions} from "redux-batched-actions"
import {IExtraModel} from "../utills/types"
import {createHashModel} from "../utills/factories"
import {deleteToken, getToken, saveToken} from "api/mainToken"
import {notification} from "antd"
import { routerRedux } from "dva/router"

export interface IUserState {
    username: string
    isAuth: boolean,
    loginErrorMsgs: string[],
}

const emptyState = {
    username: "",
    isAuth: false,
    loginErrorMsgs: [],
}
const namespace = "user"
const model: IExtraModel<IUserState> = createHashModel({
    namespace,
    state: {
        username: "",
        isAuth: !!getToken(),
        loginErrorMsgs: [],
    },
    subscriptions: {
        flushError({ dispatch, history}, done) {
            const cancel = history.listen((data, method) => {
                dispatch({
                    type: "edit",
                    payload: {
                        loginErrorMsgs: [],
                    },
                })
                if (data.pathname.indexOf("/app") > -1) {
                    if (cancel) {
                        cancel()
                    }
                }
            })
            return cancel
        },
    },
    effects: {
        *auth(action, opts) {
            const { call, put } = opts
            const { payload } = action

            const [err, data]: IRequestResult<{access_token: string}>
                = yield call(API.post, "/auth/signin", payload, {needAuth: false})
            console.log(err, data)

            if (err) {
                if (err.response) {
                    const loginErrorMsg = err.response.data.error.message || "Вы ввели неправильный телефон или пароль"
                    yield put({ type: "edit", payload: {loginErrorMsgs: [loginErrorMsg]}})
                } else {
                    notification.error({
                        message: "Произошла ошибка!",
                        description: "Попробуйте чуть позже или обратитесь к администратору",
                    })
                }
                return
            }

            if (data) {
                saveToken(data.success.access_token)
                yield put({ type: "edit", payload: {isAuth: true}})
            }
        },
        *signup(action, opts) {
            const { call, put } = opts
            const { payload } = action

            const [err, data] = yield call(API.post, "/auth/signup", payload, {needAuth: false})

            if (err) {
                if (err.response.status === 500) {
                    const loginErrorMsg = "Вы ввели некорректный номер телефона"
                    yield put({ type: "edit", payload: {
                            loginErrorMsgs: [loginErrorMsg],
                        }})
                    return
                }
                if (err.response && err.response.data) {
                    const loginErrorMsg = err.response.data.error.message || "Вы ввели некорректный номер телефона"
                    yield put({ type: "edit", payload: {
                            loginErrorMsgs: [loginErrorMsg],
                        }})
                } else {
                    notification.error({
                        message: "Произошла ошибка!",
                        description: "Попробуйте чуть позже или обратитесь к администратору",
                    })
                }
                return
            }

            notification.success({
                message: "Регистрация прошла успешно!",
                description: "Вам должно прийти SMS сообщение с паролем",
            })

            yield put(routerRedux.push("/auth/login"))
        },
        *forgotPassword(action, opts) {
            const { call, put } = opts
            const { payload } = action

            const [err, data] = yield call(API.post, "/auth/forgotPassword", payload, {needAuth: false})

            if (err) {
                yield put({
                    type: "edit", payload: {loginErrorMsgs: [err.response.data.error.message] || ["Invalid signUp"]},
                })
                return
            }

            notification.success({
                message: "Пароль успешно сброшен!",
                description: "Вам должно прийти SMS сообщение с новым паролем",
            })

            yield put(routerRedux.push("/auth/login"))
        },
        *logout(action, opts) {
            const { put } = opts
            deleteToken()
            yield put({ type: "edit", payload: emptyState})
        },
    },
})

export default model
