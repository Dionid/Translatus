import {Locale} from "antd/lib/locale-provider"
import ru_RU from "antd/lib/locale-provider/ru_RU"
import en_US from "antd/lib/locale-provider/en_US"
import React from "react"
import {LocaleProvider} from "antd"
import {IntlProvider} from 'react-intl'

export enum uiLanguageKeys {
    rus = "ru",
    eng = "eng",
}

interface uiLanguageObj {
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

const uiLanguages: uiLanguage = {
    [uiLanguageKeys.rus]: {
        id: uiLanguageKeys.rus,
        locale: uiLanguageKeys.rus,
        name: "Русский",
        antdLocal: ru_RU,
        messages: {
            "Test": "Тест",
            "TranslatePage.translateAreaEmptyText": "Здесь появится текст перевода",
        }
    },
    [uiLanguageKeys.eng]: {
        id: uiLanguageKeys.eng,
        locale: uiLanguageKeys.eng,
        name: "English",
        antdLocal: en_US,
        messages: {
            "Test": "Test",
            "TranslatePage.translateAreaEmptyText": "Translation...",
        }
    },
}

const LanguageContext = React.createContext({
    uiLanguageSettings: uiLanguages.eng,
    updateUILanguage: (value: uiLanguageKeys) => {
        alert("not function haven't been implemented yet!")
    },
})
const LanguageConsumer = LanguageContext.Consumer

interface LanguageProviderState {
    uiLanguageSettings: uiLanguageObj
}

class LanguageProvider extends React.PureComponent<{}, LanguageProviderState> {
    state = {
        uiLanguageSettings: uiLanguages.ru,
    }

    updateUILanguage = (value: uiLanguageKeys) => {
        this.setState({
            uiLanguageSettings: uiLanguages[value],
        })
    }

    render() {
        const {uiLanguageSettings} = this.state
        return (
            <LanguageContext.Provider
                value={{
                    uiLanguageSettings: uiLanguageSettings,
                    updateUILanguage: this.updateUILanguage,
                }}
            >
                <LocaleProvider locale={uiLanguageSettings.antdLocal}>
                    <IntlProvider locale={uiLanguageSettings.locale} messages={uiLanguageSettings.messages}>
                        {this.props.children}
                    </IntlProvider>
                </LocaleProvider>
            </LanguageContext.Provider>
        )
    }
}


export {
    LanguageProvider,
    LanguageConsumer,
}
