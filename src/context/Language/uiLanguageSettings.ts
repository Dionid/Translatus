import {Locale} from "antd/lib/locale-provider"
import ru_RU from "antd/lib/locale-provider/ru_RU"
import en_US from "antd/lib/locale-provider/en_US"

export enum uiLanguageKeys {
    rus = "rus",
    eng = "eng",
}

export interface uiLanguageObj {
    id: uiLanguageKeys
    locale: uiLanguageKeys
    name: string
    antdLocal: Locale,
    messages: {
        [key: string]: string,
    }
}

type uiLanguage = {
    [key in uiLanguageKeys]: uiLanguageObj
}

const uiLanguageSettings: uiLanguage = {
    [uiLanguageKeys.rus]: {
        id: uiLanguageKeys.rus,
        locale: uiLanguageKeys.rus,
        name: "Русский",
        antdLocal: ru_RU,
        messages: {
            "Test": "Тест",
            "Nav.exitButtonText": "Выйти",
            "Nav.closeMenuButtonText": "Закрыть меню",
            "Nav.interfaceLanguage": "Язык приложения:",
            "Languages.russian": "Руский",
            "Languages.english": "Английский",
            "TranslatePage.translatedEmptyText": "Здесь появится текст перевода",
            "TranslatePage.translateAreaTextPlaceholder": "Сюда вводить текст",
            "TranslatePage.buttonTranslateText": "Перевести",
            "TranslatePage.buttonClearText": "Очистить",
        }
    },
    [uiLanguageKeys.eng]: {
        id: uiLanguageKeys.eng,
        locale: uiLanguageKeys.eng,
        name: "English",
        antdLocal: en_US,
        messages: {
            "Test": "Test",
            "Nav.closeMenuButtonText": "Close menu",
            "Nav.exitButtonText": "Exit",
            "Nav.interfaceLanguage": "App language:",
            "Languages.russian": "Russian",
            "Languages.english": "English",
            "TranslatePage.translatedEmptyText": "Translation...",
            "TranslatePage.translateAreaTextPlaceholder": "Insert your text here",
            "TranslatePage.buttonTranslateText": "Translate",
            "TranslatePage.buttonClearText": "Clear"
        }
    },
}

export {
    uiLanguageSettings,
}