import {Action, Dispatch} from "redux"
import React from "react"
import {connect} from "dva"
import classnamesBind from "classnames/bind"
import {NavLink, RouteComponentProps, Switch, Route, match as IMatch} from "dva/router"
import {Button, Col, Icon, Input, Row, Select} from 'antd'
import IAppState, {IBrowserState} from "models"
import styles from "./TranslatePage.scss"

const cx = classnamesBind.bind(styles)

const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;

interface IProps extends RouteComponentProps {
    dispatch: Dispatch<Action>,
    media: IBrowserState,
}

interface IState {
    translateAreaText: String,
    translateAreaTextChanged: boolean,
    translatedText: String,
}


const languages = {
    "rus": {
        name: "Русский",
    },
    "eng": {
        name: "Английский",
    },
}

class TranslatePage extends React.PureComponent<IProps, IState> {

    state = {
        translateAreaText: "",
        translateAreaTextChanged: false,
        translatedText: ""
    }

    onTranslateAreaChange = (e) => {
        this.setState({
            translateAreaText: e.target.value,
            translateAreaTextChanged: true,
        })
    }

    onClearClick = () => {
        this.setState({
            translateAreaText: "",
            translateAreaTextChanged: false,
            translatedText: "",
        })
    }

    onTranslateClick = () => {
        this.setState({
            translateAreaTextChanged: false,
            translatedText: this.state.translateAreaText,
        })
    }

    render() {
        const { translateAreaText, translateAreaTextChanged, translatedText } = this.state

        const showTranslateCtrl = translateAreaText !== "" || translatedText !== ""

        return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", paddingTop: 30, alignItems: "center" }}>
                <div style={{ width: "100%", maxWidth: 720,}}>
                    <div>
                        <InputGroup compact style={{display:"flex"}} size={"large"}>
                            <Input
                                size={"large"}
                                style={{
                                    width: "37px",
                                    pointerEvents: 'none',
                                    backgroundColor: '#fff',
                                    borderRight: 0,
                                }}
                                prefix={ <Icon type="euro" /> }
                            />
                            <Select  showSearch size={"large"} style={{width: "50%"}} defaultValue={ Object.keys(languages)[0] }>
                                {
                                    Object.keys(languages).map(lang => {
                                        return <Option value={lang} >{ languages[lang].name }</Option>
                                    })
                                }
                            </Select>
                            {/*<div style={{cursor: "pointer", width: 40, backgroundColor: "#fff", border: "1px solid rgb(217, 217, 217)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <Icon type="swap" />
                            </div>*/}
                            <Button size="large" style={{marginRight: 0, marginLeft: -1, zIndex: 2,}}>
                                <Icon type="swap" />
                            </Button>
                            <Input
                                size={"large"}
                                style={{
                                    width: "37px",
                                    pointerEvents: 'none',
                                    backgroundColor: '#fff',
                                    marginLeft: -1,
                                    zIndex: 1,
                                }}
                                prefix={ <Icon type="dollar" /> }
                            />
                            <Select size={"large"} style={{zIndex: 1, width: "50%", borderLeft: 0}} defaultValue={ Object.keys(languages)[1] }>
                                {
                                    Object.keys(languages).map(lang => {
                                        return <Option value={lang} >{ languages[lang].name }</Option>
                                    })
                                }
                            </Select>
                        </InputGroup>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", paddingTop: 15}}>
                        <div style={{width: "100%"}}>
                            <TextArea value={ translateAreaText } onChange={ this.onTranslateAreaChange } rows={2} autosize style={{fontSize: 16, padding: "10px 15px", paddingBottom: 15, borderRadius: 0, borderBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5}} placeholder="Insert your text here" >
                            </TextArea>
                        </div>
                        <div style={{display: showTranslateCtrl ? "flex" : "none"}}>
                            <Button onClick={ this.onTranslateClick } icon="check" disabled={ !translateAreaTextChanged || translateAreaText == "" } size={"large"} style={{borderRadius: 0, borderRight: 0}} block type={"primary"}>Перевести</Button>
                            <Button onClick={ this.onClearClick } icon="close" size={"large"} style={{borderRadius: 0}} block>Очистить</Button>
                        </div>
                        <div style={{width: "100%"}}>
                            <div style={{width: "100%", backgroundColor: "#fff", fontSize: 16, padding: "10px", paddingTop: 15, minHeight: 75, border: "1px solid #d9d9d9", borderTopWidth: !showTranslateCtrl && translatedText === "" ? 1 : 0, borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                                <div>
                                    { translatedText || "Здесь появится текст перевода" }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{position: "fixed", bottom: 100}}>

                </div>
            </div>
        )
    }
}

export default connect(({user, loading}: IAppState) => {
    return {user}
})(TranslatePage)