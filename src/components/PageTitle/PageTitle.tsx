import {Action, Dispatch} from "redux"
import React from "react"
import {connect} from "dva"
import styles from "./PageTitle.scss"
import classnamesBind from "classnames/bind"
import {Icon} from "antd"

const cx = classnamesBind.bind(styles)

interface IProps {
    text: string,
    icon: string,
    style?: {},
}

const PageTitle = (props: IProps) => {
    return (
        <div className={ cx("pageTitle") } style={props.style}>
            <div className={ cx("titleIcon") }>
                <Icon type={ props.icon }/>
            </div>
            <div className={ cx("text") }>
                { props.text }
            </div>
        </div>
    )
}

export default PageTitle
