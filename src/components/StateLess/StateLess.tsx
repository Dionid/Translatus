import {Action, Dispatch} from "redux"
import React, {FunctionComponent} from "react"
import {connect} from "dva"
import styles from "./StateLess.scss"
import classnamesBind from "classnames/bind"

const cx = classnamesBind.bind(styles)

interface IProps {
    text: string,
}

const StateLess: FunctionComponent<IProps> = (props: IProps) => {
    return null
}

export default StateLess
