import {Locale} from "antd/lib/locale-provider"
import ru_RU from "antd/lib/locale-provider/ru_RU"
import en_US from "antd/lib/locale-provider/en_US"
import React from "react"
import {LocaleProvider} from "antd"
import {IntlProvider} from 'react-intl'
import {uiLanguageKeys, uiLanguageObj, uiLanguageSettings} from "src/context/Language/uiLanguageSettings"

const LanguageContext = React.createContext({
    activeUILanguageSettings: uiLanguageSettings.eng,
    updateUILanguage: (value: uiLanguageKeys) => {
        alert("not function haven't been implemented yet!")
    },
})
const LanguageConsumer = LanguageContext.Consumer

interface LanguageProviderState {
    activeUILanguageSettings: uiLanguageObj
}

class LanguageProvider extends React.PureComponent<{}, LanguageProviderState> {
    state = {
        activeUILanguageSettings: uiLanguageSettings.rus,
    }

    updateUILanguage = (value: uiLanguageKeys) => {
        this.setState({
            activeUILanguageSettings: uiLanguageSettings[value],
        })
    }

    render() {
        const {activeUILanguageSettings} = this.state
        return (
            <LanguageContext.Provider
                value={{
                    activeUILanguageSettings: activeUILanguageSettings,
                    updateUILanguage: this.updateUILanguage,
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
