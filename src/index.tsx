import "@babel/polyfill"
// import "./polyfills"
import createLoading from "dva-loading"
import React from "react"
import dvaApp from "dvaApp"
import "reset-css"
import "./index.scss"
import AppRouter from "./router/Router"
import ReactDOM from "react-dom"
import registerServiceWorker from "./registerServiceWorker"

const containerName = "#root"

// @ts-ignore
const modelsReq = require.context("./dvaApp/models", true, /\.ts$/)

modelsReq.keys().forEach((filename: string) => {
    const model = modelsReq(filename).default
    if (!model) {
        return
    }

    dvaApp.model(model)

    // @ts-ignore
    if (module.hot) {
        console.log("[HMR] inited with babel-plugin-dva-hmr")
        const modelNamespaceMap: {[key: string]: string} = {}
        modelNamespaceMap[filename] = model.namespace
        const filePath = "./dvaApp/models/" + filename.replace(".ts", "").replace("./", "")
        console.log(filePath)
        // @ts-ignore
        module.hot.accept(filePath, () => {
            try {
                dvaApp.unmodel(modelNamespaceMap[filename])
                const newModel = modelsReq(filename).default
                if (newModel) {
                    dvaApp.model(newModel)
                }
            } catch (e) {
                console.error(e)
            }
        })
    }
})

dvaApp.use({
    // @ts-ignore
    onHmr(render) {
        // @ts-ignore
        if (module.hot) {
            const renderNormally = render
            const renderException = (error: any) => {
                const RedBox = require("redbox-react")
                ReactDOM.render(React.createElement(RedBox, { error }), document.querySelector(containerName))
            }
            const newRender = (router: any) => {
                try {
                    renderNormally(router)
                } catch (error) {
                    console.error("error", error)
                    renderException(error)
                }
            }
            // @ts-ignore
            module.hot.accept("./router/Router", () => {
                const router = require("./router/Router")
                newRender(router.default || router)
            })
        }
    },
})

dvaApp.use(createLoading())

dvaApp.router(AppRouter)

const startApp = () => {
    dvaApp.start("#root")
    registerServiceWorker()
}

// @ts-ignore
if (window.cordova) {
    document.addEventListener("deviceready", startApp, false)
} else {
    startApp()
}
