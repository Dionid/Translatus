import {Action, Dispatch} from "redux"
import React, {FunctionComponent} from "react"
import {connect} from "dva"
import styles from "./StateLess.scss"
import classnamesBind from "classnames/bind"
import {LanguageConsumer} from "src/context/Language/LanguageContext"
import {Input, Select} from "antd"
import {uiLanguageSettings, uiLanguageKeys} from "src/context/Language/uiLanguageSettings"

const cx = classnamesBind.bind(styles)

interface IProps {
    afterSelected?: () => void
    withoutInitial?: boolean
}

const InputGroup = Input.Group;
const { Option } = Select;

const UIChangeCtrl: FunctionComponent<IProps> = (props: IProps) => {
    const {
        afterSelected,
        withoutInitial
    } = props

    return (
        <LanguageConsumer>
            {
                ({updateUILanguage, activeUILanguageSettings}) => {
                    const onSelectChange = (val: uiLanguageKeys) => {
                        updateUILanguage(val)
                        if (afterSelected) afterSelected()
                    }
                    return (
                        <InputGroup compact style={{display:"flex", paddingBottom: 15}} size={"large"}>
                            <div style={{
                                width: "40px",
                                pointerEvents: 'none',
                                backgroundColor: '#fff',
                                borderRight: 0,
                                border: `1px solid #d9d9d9`,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                {
                                    !withoutInitial && <img width={18} height={18} className={ cx("translateIcon") } src={ require(`assets/${activeUILanguageSettings.id}_flag.png`) } alt=""/>
                                }
                            </div>
                            <Select
                                value={ withoutInitial ? undefined : activeUILanguageSettings.id }
                                placeholder={ "Select language" }
                                onChange={ onSelectChange }
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
            }
        </LanguageConsumer>
    )
}

export {
    UIChangeCtrl,
}
