import {Action, Dispatch} from "redux"
import React, {FunctionComponent} from "react"
import {connect} from "dva"
import styles from "./StateLess.scss"
import classnamesBind from "classnames/bind"
import {LanguageConsumer} from "src/context/Language/LanguageContext"
import {Input, Select} from "antd"
import {uiLanguageSettings, uiLanguageKeys} from "src/context/Language/uiLanguageSettings"

const cx = classnamesBind.bind(styles)

interface IProps {}

const InputGroup = Input.Group;
const { Option } = Select;

const UIChangeCtrl: FunctionComponent<IProps> = (props: IProps) => {
    return (
        <LanguageConsumer>
            {
                ({updateUILanguage, activeUILanguageSettings}) => (
                    <InputGroup compact style={{display:"flex", paddingBottom: 15}} size={"large"}>
                        <Input
                            size={"large"}
                            style={{
                                width: "37px",
                                pointerEvents: 'none',
                                backgroundColor: '#fff',
                                borderRight: 0,
                            }}
                            prefix={
                                <img width={18} height={18} className={ cx("translateIcon") } src={ require(`assets/${activeUILanguageSettings.id}_flag.png`) } alt=""/>
                            }
                        />
                        <Select
                            value={ activeUILanguageSettings.id }
                            onChange={ updateUILanguage }
                            showSearch
                            size={"large"}
                            style={{width: "100%"}}>
                            {
                                Object.keys(uiLanguageSettings).map((lang: string) => {
                                    return <Option key={lang} value={lang} >{ uiLanguageSettings[lang as uiLanguageKeys].name }</Option>
                                })
                            }
                        </Select>
                    </InputGroup>
                )

            }
        </LanguageConsumer>
    )
}

export {
    UIChangeCtrl,
}
