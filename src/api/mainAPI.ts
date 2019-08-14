import {get} from "api/main"
import {OptionsUrlencoded} from "body-parser"
import {encode} from "punycode"


type MainAPITranslateResponse = string

class mainAPI {
    async translate(from: string, to: string, query: string) {
        return await get<MainAPITranslateResponse>(`translate/${from}/${to}/${encodeURI(query)}`)
    }
}

const MainAPI = new mainAPI()

export {
    MainAPI,
}