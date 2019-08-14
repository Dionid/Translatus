import * as API from "api/main"
import {IRequestResult} from "api"
import {batchActions} from "redux-batched-actions"
import {IExtraModel} from "../utills/types"
import {createHashModel} from "../utills/factories"
import {deleteToken, getToken, saveToken} from "api/mainToken"
import {notification} from "antd"

interface ICarData {
    number: string
    mark: string
}

interface IPhoneData {
    number: string
}

interface IReqData {
    address: string
    balance: number
    contractNumber: string
    fullName: string
    objectNumber: number
    payment: number
    carList: ICarData[]
    telephonesList: IPhoneData[]
}

interface IReqPaymentLinkData {
    link: string
}

export interface IProfileState extends IReqData {
    paymentLink: string
}

const namespace = "profile"
const model: IExtraModel<IProfileState> = createHashModel({
    namespace,
    state: {
        address: "",
        balance: 0,
        contractNumber: "",
        fullName: "",
        objectNumber: 0,
        payment: 0,
        carList: [],
        telephonesList: [],
        paymentLink: "",
    },
    effects: {
        *getData(action, opts) {
            const { call, put } = opts
            const { payload } = action

            const [err, data]: IRequestResult<IReqData>
                = yield call(API.get, "/app/profile", payload)

            if (err) {
                notification.error({
                    message: "Произошла ошибка!",
                    description: "Попробуйте войти чуть позже или обратитесь к администратору",
                })
                return
            }

            if (data) {
                yield put({ type: "edit", payload: data.success})
            }

            const [err2, data2]: IRequestResult<IReqPaymentLinkData>
                = yield call(API.get, "/app/payments/link", payload)

            if (err2) {
                notification.error({
                    message: "Произошла ошибка!",
                    description: "Попробуйте войти чуть позже или обратитесь к администратору",
                })
                return
            }

            if (data2) {
                yield put({ type: "edit", payload: {paymentLink: data2.success.link}})
                // yield put({ type: "edit", payload: {paymentLink: "https://autoshlagbaum.com/oplata.html"}})
            }
        },
    },
})

export default model
