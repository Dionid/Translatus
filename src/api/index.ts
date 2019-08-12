import {AxiosError} from "axios"

interface IErrResp {
    error: {
        type: number, message: string
    },
}

interface ISuccessResp<ResDataT> {
    success?: ResDataT,
    error?: {
        type: number,
        message: string,
    },
}

export type IRequestResult<ResDataT> = [
    AxiosError | null,
    ISuccessResp<ResDataT> | null
]
