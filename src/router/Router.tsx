import React from "react"
import { Router, Route, Switch, Redirect, HashRouter } from "dva/router"
import MainLayout from "../layouts/Main"
import {Router as DvaRouter} from "dva"
import {LanguageProvider} from "src/context/Language/LanguageContext"

const AppRouter: DvaRouter = (api) => {
    if (!api) {
        return {}
    }
    const { history } = api
    return (
        <LanguageProvider>
            <Router history={history}>
                <Route path="/" component={MainLayout}/>
            </Router>
        </LanguageProvider>
    )
}

export default AppRouter
