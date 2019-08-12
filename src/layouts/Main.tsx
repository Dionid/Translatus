import {Action, Dispatch} from "redux"
import React, {lazy, Suspense} from "react"
import {connect} from "dva"
import IAppState from "models"
import styles from "./Main.scss"
import classnamesBind from "classnames/bind"
import ProtectedRoute from "../router/ProtectedRoute/ProtectedRoute"
// import AppLayout from "./AppLayout"
const AppLayout = lazy(() => import("./AppLayout"))
// import Auth from "./Auth"
const Auth = lazy(() => import("./Auth"))
import {Route, Switch, RouteComponentProps} from "dva/router"
import {IUserState} from "../dvaApp/models/user"
import {ErrorBoundary} from "./ErrorLayout"

const cx = classnamesBind.bind(styles)

interface IProps extends RouteComponentProps {
    dispatch: Dispatch<Action>,
    user: IUserState,
}

interface IState {
    test: boolean
}

const LoadingComponent = () => {
    return (
        <div style={{ padding: 30, fontSize: 18 }}>
            Загрузка...
        </div>
    )
}

class MainLayout extends React.PureComponent<IProps, IState> {

    public state = {
        test: true,
    }

    public componentDidMount(): void {
        if (this.props.match.isExact) {
            this.props.history.push("/app")
        }
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (this.props.match.isExact) {
            this.props.history.push("/app")
        }
    }

    public render() {
        return (
            <ErrorBoundary>
                <Suspense fallback={<LoadingComponent/>}>
                    <Switch>
                        {/*<ProtectedRoute path="/app" component={AppLayout}/>*/}
                        <Route path="/app" component={AppLayout}/>
                        <Route path="/auth" component={Auth}/>
                    </Switch>
                </Suspense>
            </ErrorBoundary>
        )
    }
}

export default connect(({user}: IAppState) => {
    return {
        user,
    }
})(MainLayout)
