import {getToken} from "./mainToken"
import axios, {AxiosError, AxiosResponse, AxiosRequestConfig, AxiosPromise} from "axios"
import dvaApp from "dvaApp"

interface ISuccessResp<ResDataT> {
    result?: ResDataT,
    error?: string,
    fullResponse?: AxiosResponse,
}

export type IRequestResult<ResDataT> = [
    AxiosError | null,
    ISuccessResp<ResDataT> | null
]

const ROOT_URL = "http://31.148.223.10:8111"

interface IRequestSettings extends AxiosRequestConfig {
    returnFullResponse: boolean,
    needAuth: boolean,
    headers: {[key: string]: string}
    responseType: string
    method: string
    data: string | FormData
}

interface IRequestDataBeforeSerialization {
    [key: string]: any
}

const CONFIG: IRequestSettings = {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    responseType: "json",
    returnFullResponse: false,
    needAuth: true,
    data: "",
    method: "get",
}

const makeUrl = (uri: string) => ROOT_URL + (uri[0] === "/" ? uri : "/" + uri)

const request = async <ResDataT>(url: string, settings: IRequestSettings): Promise<IRequestResult<ResDataT>> => {
    if (settings.needAuth) {
        settings.headers.Authorization = "Bearer " + await getToken()
    }
    delete settings.auth
    try {
        const res = await axios({
            url: makeUrl(url),
            ...settings,
        })
        if (settings.returnFullResponse) {
            return [null, ({fullResponse: res})]
        } else {
            return [null, res.data]
        }
    } catch (err) {
        if (err.response && err.response.status && err.response.status === 401) {
            // This place to logout user
            dvaApp._store.dispatch({
                type: "user/logout",
            })
        }
        return [err, null]
    }
}

const get = <ResDataT>(uri: string, config?: IRequestSettings) => request<ResDataT>(uri, {
    ...CONFIG,
    ...config,
    method: "get",
})

const post = <ResDataT>(
        uri: string,
        data: IRequestDataBeforeSerialization = {},
        config?: IRequestSettings,
    ) => request<ResDataT>(uri, {
    ...CONFIG,
    ...config,
    method: "post",
    data: JSON.stringify(data),
})

const put = <ResDataT>(
        uri: string,
        data: IRequestDataBeforeSerialization = {},
        config: IRequestSettings,
    ) => request<ResDataT>(uri, {
    ...CONFIG,
    ...config,
    method: "put",
    data: JSON.stringify(data),
})

const del = <ResDataT>(uri: string, config: IRequestSettings) => request<ResDataT>(uri, {
    ...CONFIG,
    ...config,
    method: "delete",
})

const postMultipart = <ResDataT>(uri: string, data: IRequestDataBeforeSerialization = {}, config: IRequestSettings) => {
    const req = {
        ...CONFIG,
        ...config,
        method: "post",
    }

    req.headers = {
        "Content-Type": "multipart/form-data",
    }

    req.data = new FormData()

    for (const item in data) {
        if (!item) {
            continue
        }
        req.data.append(item, data[item])
    }

    return request<ResDataT>(uri, req)
}

export {
    get,
    post,
    put,
    del,
    postMultipart,
}
