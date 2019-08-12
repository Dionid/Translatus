import {Action, Dispatch} from "redux"
import React, {RefObject} from "react"
import {connect} from "dva"
import IAppState from "models"
import styles from "./StateFull.scss"
import classnamesBind from "classnames/bind"

const cx = classnamesBind.bind(styles)

interface IProps {
    dispatch: Dispatch<Action>,
}

class StateFull extends React.Component<IProps, {}> {

    public state = {

    }

    public render() {
        return null
    }
}

export default connect(({}: IAppState) => {
    return {}
})(StateFull)
