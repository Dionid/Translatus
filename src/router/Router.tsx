import React from "react"
import { Router, Route, Switch, Redirect, HashRouter } from "dva/router"
import MainLayout from "../layouts/Main"
import {Router as DvaRouter} from "dva"
import ru_RU from "antd/lib/locale-provider/ru_RU"
import {LocaleProvider} from "antd"

const AppRouter: DvaRouter = (api) => {
    if (!api) {
        return {}
    }
    const { history } = api
    return (
        <LocaleProvider locale={ru_RU}>
            <Router history={history}>
                <Route path="/" component={MainLayout}/>
            </Router>
        </LocaleProvider>
    )
}

export default AppRouter
