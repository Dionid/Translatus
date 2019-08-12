import React, {FunctionComponent} from "react"
import styles from "./Card.scss"
import classnamesBind from "classnames/bind"
import {Card as AntCard } from "antd"

const cx = classnamesBind.bind(styles)

interface IProps {
    children: any,
    className?: string,
    bordered?: boolean,
    [key: string]: any,
}

const Card: FunctionComponent<IProps> = (props: IProps) => {
    const {className, children, ...rest} = props
    return (
        <AntCard
            bordered={false}
            className={ `${cx("card")} ${className}` }
            {...rest}
        >
            { children }
        </AntCard>
    )
}

export default Card
