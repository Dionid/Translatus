import {Action, Dispatch} from "redux"
import React from "react"
import {connect} from "dva"
import {Redirect, Route} from "dva/router"
import styles from "./ProtectedRoute.scss"
import classnamesBind from "classnames/bind"
import IAppState from "../../dvaApp/models"
import {IUserState} from "../../dvaApp/models/user"

const cx = classnamesBind.bind(styles)

interface IProps {
    component: React.ComponentType<any>,
    user: IUserState,
}

const ProtectedRoute = ({ component: Component, user, ...rest }: IProps) => {
    return <Route {...rest} render={(props) => {
        return user.isAuth
            ? <Component {...props}/>
            : <Redirect to={{
                pathname: "/auth",
                state: { from: props.location },
            }} />
    }}/>
}

export default connect(({ user }: IAppState) => {
    return {
        user,
    }
})(ProtectedRoute)
