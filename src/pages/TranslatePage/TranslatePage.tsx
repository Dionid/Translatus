import {Action, Dispatch} from "redux"
import React from "react"
import {connect} from "dva"
import classnamesBind from "classnames/bind"
import {NavLink, RouteComponentProps, Switch, Route, match as IMatch} from "dva/router"
import {Button, Col, Icon, Input, Row, Select} from 'antd'
import IAppState, {IBrowserState} from "models"
import styles from "./TranslatePage.scss"
import {FormattedMessage} from "react-intl"

const cx = classnamesBind.bind(styles)

const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;

enum languageKeys {
    rus = "rus",
    eng = "eng",
}

interface languageObj {
    id:  keyof typeof languageKeys
    name: string
}

type language = {
    [key in keyof typeof languageKeys]: languageObj
}

const languages: language = {
    "rus": {
        id: "rus",
        name: "Русский",
    },
    "eng": {
        id: "eng",
        name: "Английский",
    },
}

interface IProps extends RouteComponentProps {
    dispatch: Dispatch<Action>,
    media: IBrowserState,
}

interface IState {
    translateAreaText: string,
    translateAreaTextChanged: boolean,
    translatedText: string,
    translateFromLanguage: languageObj,
    translateToLanguage: languageObj,
}

class TranslatePage extends React.PureComponent<IProps, IState> {

    resetState = {
        translateAreaText: "",
        translateAreaTextChanged: false,
        translatedText: "",
    }

    state = {
        ...this.resetState,
        translateFromLanguage: languages["rus"],
        translateToLanguage: languages["eng"],
    }

    componentDidMount(): void {
    }

    onTranslateAreaChange = (e: any) => {
        this.setState({
            translateAreaText: e.target.value,
            translateAreaTextChanged: true,
        })
    }

    onClearClick = () => {
        this.setState({
            ...this.resetState,
        })
    }

    translate = () => {

    }

    onTranslateClick = () => {
        this.setState({
            translateAreaTextChanged: false,
            translatedText: this.state.translateAreaText + " !!!",
        })
    }

    translateFromLanguageOnChange = (v: languageKeys) => {
        // Swap
        if (v === this.state.translateToLanguage.id) {
            this.setState({
                translateToLanguage: this.state.translateFromLanguage,
            })
        }
        this.setState({
            translateFromLanguage: languages[v],
        })
    }

    translateToLanguageOnChange = (v: keyof typeof languageKeys) => {
        // Swap
        if (v === this.state.translateFromLanguage.id) {
            this.setState({
                translateFromLanguage: this.state.translateToLanguage,
            })
        }
        this.setState({
            translateToLanguage: languages[v],
        })
    }

    onSwapClick = () => {
        const newState = {
            translateFromLanguage: this.state.translateToLanguage,
            translateToLanguage: this.state.translateFromLanguage,
            translatedText: "",
            translateAreaText: this.state.translateAreaText,
        }
        // If there is translated text, than use it as for translation
        if (this.state.translatedText) {
            newState.translateAreaText = this.state.translatedText
        }

        this.setState({
            ...newState,
        }, () => {
            this.translate()
        })
    }

    render() {
        const {
            translateAreaText,
            translateAreaTextChanged,
            translatedText,
            translateFromLanguage,
            translateToLanguage,
        } = this.state
        const {
            media,
        } = this.props

        const showTranslateCtrl = translateAreaText !== "" || translatedText !== ""

        return (
            <div style={{ padding: "30px 15px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "100%", maxWidth: 720,}}>
                    <div className={ cx('languageCtrlWr', media.isMobile && 'mobile') }>
                        <div style={{display: "flex", width: "100%", flexDirection: "column", paddingRight: 15}}>
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
                                        <img className={ cx("translateIcon") } src={ require(`assets/${translateFromLanguage.id}_flag.png`) } alt=""/>
                                    }
                                />
                                <Select
                                    value={ translateFromLanguage.id as languageKeys }
                                    onChange={ this.translateFromLanguageOnChange }
                                    showSearch
                                    size={"large"}
                                    style={{width: "100%"}}>
                                    {
                                        Object.keys(languages).map((lang: string) => {
                                            return <Option key={lang} value={lang} >{ languages[lang as languageKeys].name }</Option>
                                        })
                                    }
                                </Select>
                            </InputGroup>
                            <InputGroup compact style={{display:"flex"}} size={"large"}>
                                <Input
                                    size={"large"}
                                    style={{
                                        width: "37px",
                                        pointerEvents: 'none',
                                        backgroundColor: '#fff',
                                        marginLeft: -1,
                                        zIndex: 1,
                                    }}
                                    prefix={ <img className={ cx("translateIcon") } src={ require(`assets/${translateToLanguage.id}_flag.png`) } alt=""/> }
                                />
                                <Select
                                    onChange={ this.translateToLanguageOnChange }
                                    value={ translateToLanguage.id as languageKeys }
                                    size={"large"}
                                    style={{zIndex: 1, width: "100%", borderLeft: 0}}>
                                    {
                                        Object.keys(languages).map(lang => {
                                            return <Option key={lang} value={lang} >{ languages[lang as languageKeys].name }</Option>
                                        })
                                    }
                                </Select>
                            </InputGroup>
                        </div>
                        <div style={{
                            // width: 40,
                            display: "flex",
                            flexShrink: 0,
                            flexGrow: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            // marginRight: media.isMobile ? 0 : 15,
                            // marginLeft: media.isMobile ? 0 : 15,
                            // marginTop: media.isMobile ? 15 : 0,
                            // marginBottom: media.isMobile ? 15 : 0,
                            // justifyContent: media.isMobile ? "center" : "initial",
                        }}>
                            <Button style={{height: "100%"}} size="large" onClick={ this.onSwapClick }>
                                <Icon style={{transform: "rotate(90deg)"}} type="swap" />
                            </Button>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", paddingTop: 15}}>
                        <div style={{width: "100%"}}>
                            <TextArea value={ translateAreaText } onChange={ this.onTranslateAreaChange } rows={2} autosize style={{fontSize: 16, padding: "10px 15px", paddingBottom: 15, borderRadius: 0, borderBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5}} placeholder="Сюда вводить текст" >
                            </TextArea>
                        </div>
                        <div style={{display: showTranslateCtrl ? "flex" : "none"}}>
                            <Button onClick={ this.onTranslateClick } icon="check" disabled={ !translateAreaTextChanged || translateAreaText == "" } size={"large"} style={{borderRadius: 0, borderRight: 0}} block type={"primary"}>Перевести</Button>
                            <Button onClick={ this.onClearClick } icon="close" size={"large"} style={{borderRadius: 0}} block>Очистить</Button>
                        </div>
                        <div style={{width: "100%"}}>
                            <div style={{width: "100%", backgroundColor: "#fff", fontSize: 16, padding: "10px", paddingTop: 15, minHeight: 75, border: "1px solid #d9d9d9", borderTopWidth: !showTranslateCtrl && translatedText === "" ? 1 : 0, borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                                <div style={{wordBreak: "break-word"}}>
                                    { translatedText || <FormattedMessage id={'TranslatePage.translateAreaEmptyText'} /> }
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

export default connect(({user, media, loading}: IAppState) => {
    return {user, media}
})(TranslatePage)