import {get} from "api/main"

type MainAPITranslateResponse = string

class mainAPI {
    async translate(from: string, to: string, query: string) {
        return await get<MainAPITranslateResponse>(`translate/${from}/${to}/${encodeURIComponent(query)}`)
    }
}

const MainAPI = new mainAPI()

export {
    MainAPI,
}