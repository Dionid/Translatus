import React from "react"
import {connect} from "dva"
import {Action, Dispatch} from "redux"
import {Redirect} from "dva/router"

interface IProps {
    dispatch: Dispatch<Action>,
}

export default connect()((props: IProps) => {
    props.dispatch({
        type: "user/logout",
    })
    return <Redirect to="/auth/login"/>
})
