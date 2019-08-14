import {Locale} from "antd/lib/locale-provider"
import ru_RU from "antd/lib/locale-provider/ru_RU"
import en_US from "antd/lib/locale-provider/en_US"
import React from "react"
import {LocaleProvider, notification} from "antd"
import {IntlProvider} from 'react-intl'
import {uiLanguageKeys, uiLanguageObj, uiLanguageSettings} from "src/context/Language/uiLanguageSettings"
import {UIChangeCtrl} from "components/UIChangeCtrl/StateLess"
import {ArgsProps} from "antd/es/notification"


class languageLocalStorage {
    KEY = "translatus_lang"

    get(): uiLanguageKeys {
        return localStorage.getItem(this.KEY) as uiLanguageKeys
    }

    set(v: uiLanguageKeys) {
        localStorage.setItem(this.KEY, v)
    }

    has(): boolean {
        return !!this.get()
    }
}

const LanguageLocalStorage = new languageLocalStorage();
const langType = LanguageLocalStorage.get();

const LanguageContext = React.createContext({
    activeUILanguageSettings: uiLanguageSettings[langType] || uiLanguageSettings.eng,
    updateUILanguage: (value: uiLanguageKeys) => {
        alert("not function haven't been implemented yet!")
    },
    langHasBeenSelected: false,
})
const LanguageConsumer = LanguageContext.Consumer

interface LanguageProviderState {
    activeUILanguageSettings: uiLanguageObj
    langHasBeenSelected: boolean,
}

class LanguageProvider extends React.PureComponent<{}, LanguageProviderState> {
    state = {
        activeUILanguageSettings: uiLanguageSettings.eng,
        langHasBeenSelected: LanguageLocalStorage.has(),
    }

    updateUILanguage = (value: uiLanguageKeys) => {
        LanguageLocalStorage.set(value)
        this.setState({
            activeUILanguageSettings: uiLanguageSettings[value],
            langHasBeenSelected: true,
        })
    }

    render() {
        const {activeUILanguageSettings, langHasBeenSelected} = this.state

        return (
            <LanguageContext.Provider
                value={{
                    activeUILanguageSettings: activeUILanguageSettings,
                    updateUILanguage: this.updateUILanguage,
                    langHasBeenSelected: langHasBeenSelected,
                }}
            >
                <LocaleProvider locale={activeUILanguageSettings.antdLocal}>
                    <IntlProvider locale={activeUILanguageSettings.locale} messages={activeUILanguageSettings.messages}>
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
