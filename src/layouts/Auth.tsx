import {Action, Dispatch} from "redux"
import React from "react"
import {connect} from "dva"
import IAppState from "models"
import styles from "./Auth.scss"
import classnamesBind from "classnames/bind"
import ProtectedRoute from "../router/ProtectedRoute/ProtectedRoute"
import AppLayout from "./AppLayout"
import {Layout} from "antd"
import {Route, RouteComponentProps, Switch} from "react-router"
import LoginPage from "pages/LoginPage/LoginPage"
import SignUpPage from "pages/SignUpPage/SignUpPage"
import LogoutPage from "pages/LogoutPage/LogoutPage"
import ForgotPasswordPage from "pages/ForgotPasswordPage/ForgotPasswordPage"

const cx = classnamesBind.bind(styles)

interface IProps extends RouteComponentProps {
    dispatch: Dispatch<Action>,
}

interface IState {

}

const {
    Header, Footer, Sider, Content,
} = Layout

class Auth extends React.Component<IProps, IState> {
    public componentDidMount(): void {
        if (this.props.match.isExact) {
            this.props.history.push(this.props.match.url + "/login")
        }
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (this.props.match.isExact) {
            this.props.history.push(this.props.match.url + "/login")
        }
    }

    public render() {
        const { match } = this.props
        return (
            <Layout className="layout">
                {/*<Header>Auth</Header>*/}
                <Content>
                    <Switch>
                        <Route path={`${match.url}/login`} component={LoginPage}/>
                        <Route path={`${match.url}/signup`} component={SignUpPage}/>
                        <Route path={`${match.url}/logout`} component={LogoutPage}/>
                        <Route path={`${match.url}/forgotPassword`} component={ForgotPasswordPage}/>
                    </Switch>
                </Content>
                <Footer></Footer>
            </Layout>
        )
    }
}

export default connect(({}: IAppState) => {
    return {}
})(Auth)
