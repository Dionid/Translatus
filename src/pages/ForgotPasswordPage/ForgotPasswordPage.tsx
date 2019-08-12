import {Action, Dispatch} from "redux"
import React, {FormEvent} from "react"
import {connect} from "dva"
import IAppState from "models"
import styles from "./ForgotPasswordPage.scss"
import {Button, Card, Col, Form, Row, Input, Icon, Alert} from "antd"
import classnamesBind from "classnames/bind"
import {Redirect, RouteComponentProps, Link} from "dva/router"
import {IUserState} from "../../dvaApp/models/user"
import {FormComponentProps} from "antd/lib/form"

const cx = classnamesBind.bind(styles)

interface IProps extends RouteComponentProps, FormComponentProps {
    dispatch: Dispatch<Action>,
    user: IUserState,
    loading: boolean,
}

class ForgotPasswordPage extends React.PureComponent<IProps, {}> {

    private handleSubmit = (e: FormEvent<any>) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log("Error", values)
                return
            }
            this.props.dispatch({
                type: "user/forgotPassword",
                payload: values,
            })
        })
    }

    public render() {
        const { from } = this.props.location.state || { from: { pathname: "/" } }
        const { getFieldDecorator } = this.props.form

        if (this.props.user.isAuth) {
            return <Redirect to={from} />
        }

        return (
            <Row className={ cx("wr") } type="flex" justify="center" align="middle">
                <Card title="Восстановление пароля" headStyle={{textAlign: "center"}} className={ cx("card") }>
                    <Form onSubmit={ this.handleSubmit } className="login-form">
                        <Form.Item>
                            {getFieldDecorator("phone", {
                                rules: [
                                    {
                                        validator(rule, value, callback, source, options) {
                                            if (!value) {
                                                callback("Введите свой Телефон!")
                                                return
                                            }
                                            const errors = []
                                            // test if email address already exists in a database
                                            if (!/^\+?\d+$/.test(value)) {
                                                errors.push(new Error("Некорректный номер"))
                                            }
                                            callback(errors)
                                            // and add a validation error to the errors array if it does
                                            return errors
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    type="phone"
                                    addonBefore={<Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />}
                                    placeholder="Телефон" />,
                            )}
                        </Form.Item>
                        <Form.Item style={{marginBottom: 0}}>
                            <Button type="primary" block htmlType="submit" className="login-form-button">
                                Восстановить
                            </Button>
                        </Form.Item>
                        <Form.Item style={{marginBottom: 0}}>
                            Вспомнили пароль? <Link to="/auth/login">тогда входите!</Link>
                        </Form.Item>
                    </Form>
                    {
                        this.props.user.loginErrorMsgs.map((d) => (
                            <Alert message={ d } key={ d } type="error" />
                        ))
                    }
                </Card>
            </Row>
        )
    }
}

export default Form.create({ name: "login_form"})(connect(({user, loading}: IAppState) => {
    return {user, loading: loading.effects["user/auth"]}
})(ForgotPasswordPage))
