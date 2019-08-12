import {Action, Dispatch} from "redux"
import React from "react"
import {connect} from "dva"
import IAppState, {IAppStateLoading} from "models"
import styles from "./ProfilePage.scss"
import classnamesBind from "classnames/bind"
import {Col, Row, Icon, Typography, Button, notification} from "antd"
import PageTitle from "components/PageTitle/PageTitle"
import Card from "components/Card/Card"
import * as API from "api/main"
import {IRequestResult} from "api"
import {IProfileState} from "../../dvaApp/models/profile"
import {get, post} from "api/main"

const cx = classnamesBind.bind(styles)

interface IProps {
    dispatch: Dispatch<Action>,
    profile: IProfileState,
    loading: IAppStateLoading,
}

const { Text } = Typography

interface IGetBarriersControllerData {
    id: number
    name: string
}

type TControllerTypes =
    | "et"
    | "pi"
    | "rg"

// enum EControllerTypes {
//     et = "et",
//     pi = "pi",
//     rg = "rg",
// }

type IGetBarriersData = {
    [key in TControllerTypes]: IGetBarriersControllerData[]
}

interface IState {
    barriers: IGetBarriersControllerData[],
    selectedControllerType?: TControllerTypes,
    loading: boolean,
}

class ProfilePage extends React.Component<IProps, IState> {
    public state = {
        loading: false,
        selectedControllerType: undefined,
        barriers: [],
    }

    public componentDidMount(): void {
        this.getBarriers()
    }

    private getBarriers = async () => {
        this.setState({
            loading: true,
        })

        const [err, data] = await get<IGetBarriersData>("/app/getControllers")

        this.setState({
            loading: false,
        })

        if (err) {
            notification.error({
                message: "При получении истории произошла ошибка!",
                description: "Попробуйте чуть позже или обратитесь к администратору",
            })
            return
        }

        if (data) {
            if (data.error) {
                return
            } else if (data.success) {
                let selectedControllerType: TControllerTypes
                if (data.success.rg.length) {
                    selectedControllerType = "rg"
                } else if (data.success.pi.length) {
                    selectedControllerType = "pi"
                } else {
                    selectedControllerType = "et"
                }
                this.setState({
                    selectedControllerType,
                    barriers: data.success[selectedControllerType],
                })
            }
        }
    }

    private getCardsSpan = () => {
        return {
            xs: 24,
            sm: 12,
            lg: 8,
            className: cx("col"),
        }
    }

    private openBarrier = async (barrierId: number) => {
        console.log(this.state.selectedControllerType, barrierId)

        this.setState({
            loading: true,
        })

        const [err] = await post("app/openController", {
            type: this.state.selectedControllerType,
            id: barrierId,
        })

        this.setState({
            loading: false,
        })

        if (err) {
            notification.error({
                message: "При получении истории произошла ошибка!",
                description: "Попробуйте чуть позже или обратитесь к администратору",
            })
            return
        }

        notification.success({
            message: "Ворота открыты!",
            description: "Проезжайте, мой господин!",
        })
    }

    public render() {
        const { barriers, loading } = this.state
        const globalLoading = this.props.loading.effects["profile/getData"] || loading
        const {
            fullName,
            address,
            balance,
            carList,
            contractNumber,
            objectNumber,
            payment,
            telephonesList,
            paymentLink,
        } = this.props.profile

        return (
            <div className={ cx("wrapper") }>
                <PageTitle style={{marginBottom: 30}} icon="user" text="Профиль"/>
                <Row className={ cx("row") } gutter={16} type="flex">
                    <Col {...this.getCardsSpan()}>
                        <Card loading={ globalLoading } className={ cx("card") } title="Открытие шлагбаумов">
                            {
                                barriers.map((barrier: IGetBarriersControllerData) => {
                                    return (
                                      <Button.Group style={{width: "100%", display: "flex", marginBottom: 15, }}>
                                          <Button
                                              style={{width: "100%"}}
                                              key={barrier.name}>
                                              { `№ ${barrier.name}` }
                                          </Button>
                                          <Button style={{width: "100%"}} key={barrier.name} onClick={
                                              () => this.openBarrier(barrier.id)
                                          }>Въезд</Button>
                                          <Button style={{width: "100%"}} key={barrier.name} onClick={
                                              () => this.openBarrier(barrier.id)
                                          }>Выезд</Button>
                                      </Button.Group>
                                    )
                                })
                            }
                        </Card>
                    </Col>
                    <Col {...this.getCardsSpan()}>
                        <Card
                            loading={ globalLoading }
                            className={ cx("card") }
                            title="Баланс"
                        >
                            <div className={ cx("balanceBody") } style={{width: "100%"}}>
                                <div className={ cx("text") }>{ balance.toFixed() } руб.</div>
                                <a href={ paymentLink } target="_blank">
                                    <Button type="primary">
                                        Пополнить
                                        <Icon className={ cx("icon") } type="dollar"/>
                                    </Button>
                                </a>
                            </div>
                        </Card>
                    </Col>
                    <Col {...this.getCardsSpan()}>
                        <Card
                            loading={ globalLoading }
                            className={ cx("card") }
                            title="ФИО" extra={<Icon type="user"/>}>
                            <Text>{ fullName }</Text>
                        </Card>
                    </Col>
                </Row>
                <Row className={ cx("row") } gutter={16} type="flex">
                    <Col {...this.getCardsSpan()}>
                        <Card loading={ globalLoading } className={ cx("card") } title="Абонентская плата">
                            <Text>{ payment } р.</Text>
                        </Card>
                    </Col>
                    <Col {...this.getCardsSpan()}>
                        <Card loading={ globalLoading } className={ cx("card") } title="Номер объекта">
                            <Text>{ objectNumber }</Text>
                        </Card>
                    </Col>
                    <Col {...this.getCardsSpan()}>
                        <Card loading={ globalLoading } className={ cx("card") } title="Адрес">
                            <Text>{ address }</Text>
                        </Card>
                    </Col>
                </Row>
                <Row className={ cx("row") } gutter={16} type="flex" justify="center">
                    <Col {...this.getCardsSpan()}>
                        <Card loading={ globalLoading } className={ cx("card") } title="Номер контракта">
                            <Text>{ contractNumber }</Text>
                        </Card>
                    </Col>
                    <Col {...this.getCardsSpan()}>
                        <Card loading={ globalLoading } className={ cx("card") } title="Список автомобилей">
                            {
                                carList.map((car) => {
                                    return <div key={ car.number }>{ `${car.mark}(${car.number})` }</div>
                                })
                            }
                        </Card>
                    </Col>
                    <Col {...this.getCardsSpan()}>
                        <Card loading={ globalLoading } className={ cx("card") } title="Список телефонов">
                            {
                                telephonesList.map((telephones) => {
                                    return <div key={ telephones.number }>{ telephones.number }</div>
                                })
                            }
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(({profile, loading}: IAppState) => {
    return {
        profile,
        loading,
    }
})(ProfilePage)
