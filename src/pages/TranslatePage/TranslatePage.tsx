import {Action, Dispatch} from "redux"
import React from "react"
import {connect} from "dva"
import classnamesBind from "classnames/bind"
import {NavLink, RouteComponentProps, Switch, Route, match as IMatch} from "dva/router"
import {Button, Col, Icon, Input, Row, Select} from 'antd'
import IAppState, {IBrowserState} from "models"
import styles from "./TranslatePage.scss"
import {FormattedMessage} from "react-intl"
import {UIChangeCtrl} from "components/UIChangeCtrl/UIChangeCtrl"
import {MainAPI} from "api/mainAPI"

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
    apiName: string
    name: React.Component<{},{},any>
}

type language = {
    [key in keyof typeof languageKeys]: languageObj
}

const languages: language = {
    "rus": {
        id: "rus",
        apiName: "ru",
        name: <FormattedMessage id={"Languages.russian"}/>,
    },
    "eng": {
        id: "eng",
        apiName: "en",
        name: <FormattedMessage id={"Languages.english"}/>,
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
    loading: boolean,
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
        loading: false,
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

    translate = async () => {
        this.setState({
            loading: true,
            translateAreaTextChanged: false,
            // translatedText: this.state.translateAreaText + " !!!",
        })
        console.log(this.state)
        const [err, resp] = await MainAPI.translate(this.state.translateFromLanguage.apiName, this.state.translateToLanguage.apiName, this.state.translateAreaText)
        this.setState({
            loading: false,
        })
        if (err) {
            debugger
            console.log(err)
            return
        }

        if (resp && resp.result) {
            this.setState({
                translatedText: resp.result,
            })
        }
    }

    onTranslateClick = () => {
        this.translate()
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
            loading,
        } = this.state
        const {
            media,
        } = this.props

        const showTranslateCtrl = translateAreaText !== "" || translatedText !== ""

        return (
            <div style={{ padding: "30px 15px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className={ cx(loading && 'loading') } style={{ width: "100%", maxWidth: 720,}}>
                    <div className={ cx('languageCtrlWr', media.isMobile && 'mobile') }>
                        <div style={{display: "flex", width: "100%", flexDirection: "column", paddingRight: 15}}>
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
                                        <img width={18} height={18} className={ cx("translateIcon") } src={ require(`assets/${translateFromLanguage.id}_flag.png`) } alt=""/>
                                    }
                                </div>
                                <Select
                                    value={ translateFromLanguage.id as languageKeys }
                                    onChange={ this.translateFromLanguageOnChange }
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
                                        <img width={18} height={18} className={ cx("translateIcon") } src={ require(`assets/${translateToLanguage.id}_flag.png`) } alt=""/>
                                    }
                                </div>
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
                            display: "flex",
                            flexShrink: 0,
                            flexGrow: 0,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Button style={{height: "100%"}} size="large" onClick={ this.onSwapClick }>
                                <Icon style={{transform: "rotate(90deg)"}} type="swap" />
                            </Button>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", paddingTop: 15}}>
                        <div style={{width: "100%"}}>
                            <FormattedMessage id={"TranslatePage.translateAreaTextPlaceholder"}>
                                {
                                    (placeholder: string) => (
                                      <TextArea value={ translateAreaText }
                                                onChange={ this.onTranslateAreaChange }
                                                rows={2}
                                                autosize
                                                style={{fontSize: 16, padding: "10px 15px", paddingBottom: 15, borderRadius: 0, borderBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5}}
                                                placeholder={ placeholder }/>
                                    )
                                }
                            </FormattedMessage>
                        </div>
                        <div style={{display: showTranslateCtrl ? "flex" : "none"}}>
                            <Button onClick={ this.onTranslateClick } icon="check" disabled={ !translateAreaTextChanged || translateAreaText == "" } size={"large"} style={{borderRadius: 0, borderRight: 0}} block type={"primary"}>
                                <FormattedMessage id={"TranslatePage.buttonTranslateText"}/>
                            </Button>
                            <Button onClick={ this.onClearClick } icon="close" size={"large"} style={{borderRadius: 0}} block>
                                <FormattedMessage id={"TranslatePage.buttonClearText"}/>
                            </Button>
                        </div>
                        <div style={{width: "100%"}}>
                            <div style={{width: "100%", backgroundColor: "#fff", fontSize: 16, padding: "10px", paddingTop: 15, minHeight: 75, border: "1px solid #d9d9d9", borderTopWidth: !showTranslateCtrl && translatedText === "" ? 1 : 0, borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                                <div style={{wordBreak: "break-word", whiteSpace: "pre-wrap"}}>
                                    { translatedText || <FormattedMessage id={'TranslatePage.translatedEmptyText'} /> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({user, media, loading}: IAppState) => {
    return {user, media}
})(TranslatePage)