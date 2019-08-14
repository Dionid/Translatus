import {Action, Dispatch} from "redux"
import React, {FunctionComponent, Suspense, lazy} from "react"
import {connect} from "dva"
import IAppState, {IBrowserState} from "models"
import styles from "./AppLayout.scss"
import classnamesBind from "classnames/bind"
import {NavLink, RouteComponentProps, Switch, Route, match as IMatch} from "dva/router"
import {Button, Drawer, Icon, Layout, Menu, Affix} from "antd"
import {SiderTheme} from "antd/lib/layout/Sider"
import {IProfileState} from "../dvaApp/models/profile"
import {MenuTheme} from "antd/lib/menu"
import TranslatePage from "pages/TranslatePage/TranslatePage"
import {FormattedMessage} from "react-intl"
import {UIChangeCtrl} from "components/UIChangeCtrl/StateLess"


const ProfilePage = lazy(() => import("pages/ProfilePage/ProfilePage"))
// const PaymentPage  = lazy(() => import("pages/PaymentPage/PaymentPage"))
// const RequestsPage  = lazy(() => import("pages/RequestsPage/RequestsPage"))
// const TechSupportPage  = lazy(() => import("pages/TechSupportPage/TechSupportPage"))

const cx = classnamesBind.bind(styles)

interface IProps extends RouteComponentProps {
    dispatch: Dispatch<Action>,
    media: IBrowserState,
    profile: IProfileState,
}

interface IState {
    theme: SiderTheme,
    drawerCollapsed: boolean,
}

const {
    Header, Footer, Sider, Content,
} = Layout

const menuItems = [
    {
        title: "Translate",
        icon: "book",
        link: "translate",
        component: TranslatePage,
    },
    // {
    //     title: "Оплата",
    //     icon: "credit-card",
    //     link: "payment",
    //     component: PaymentPage,
    // },
    // {
    //     title: "Заявки",
    //     icon: "file",
    //     link: "request",
    //     component: RequestsPage,
    // },
    // {
    //     title: "Техподдержка",
    //     icon: "setting",
    //     link: "techsup",
    //     component: TechSupportPage,
    // },
]

const Logo = () => {
    return (
        <div className={ cx("logo") }>
            <Icon type="book" className={ cx("icon") }/>
            Translatus
        </div>
    )
}

interface IMainSiderProps {
    toggleDrawerCollapsed: () => void
    theme: MenuTheme
    media: IBrowserState
    selectedKeys: string[]
    match: IMatch<any>
}

const MainSider: FunctionComponent<IMainSiderProps> = ({
     match,
     toggleDrawerCollapsed,
     selectedKeys,
     theme,
     media,
}) => {
    return (
        <Sider
            className={ cx("sider", media.lessThan.lg && "smallerHorTablet") }
            theme={ "light" }
            trigger={ null }
        >
            <div className={ cx("siderContent") }>
                <div className={ cx("menuContent") }>
                    <Menu
                        selectedKeys={ selectedKeys }
                        theme={ theme }
                        mode="inline">
                        <Menu.Item key={ "closeMenu" }>
                            <Icon type={ "close" }/> Закрыть меню
                        </Menu.Item>
                        {
                            menuItems.map((menuItem) => {
                                return (
                                    <Menu.Item key={ menuItem.link }>
                                        <NavLink
                                            onClick={ toggleDrawerCollapsed }
                                            to={ match.url + "/" + menuItem.link }>
                                            <Icon type={ menuItem.icon } />
                                            <span className="nav-text">{ menuItem.title }</span>
                                        </NavLink>
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu>
                    <div style={{padding: 15}}>
                        <FormattedMessage id={ "Nav.interfaceLanguage" }/>
                        <UIChangeCtrl/>
                    </div>
                </div>
                <div className={ cx("submenuContent") }>
                    {/*<ExitMenu theme={ theme }/>*/}
                </div>
            </div>
        </Sider>
    )
}

interface IMainSiderWrProps {
    drawerActive: boolean
    drawerCollapsed: boolean
    toggleDrawerCollapsed: () => void
}

const MainSiderWr: FunctionComponent<IMainSiderWrProps> = ({
   drawerActive,
   drawerCollapsed,
   toggleDrawerCollapsed,
   children,
}) => {
    if (drawerActive) {
        return (
            <Drawer
                visible={!drawerCollapsed}
                onClose={ toggleDrawerCollapsed }
                placement="right"
                width={200}
                closable={ false }
                bodyStyle={{
                    padding: 0,
                    height: "100vh",
                }}
                style={{
                    padding: 0,
                    height: "100vh",
                }}
            >
                { children }
            </Drawer>
        )
    }

    return (
        <Affix className={ cx("affix") } >
            { children }
        </Affix>
    )
}

const ExitMenu = ({ theme }: { theme: MenuTheme }) => {
    return (
        <Menu
            theme={ theme }
            style={{ lineHeight: "64px", borderBottom: "none"}}
            mode="horizontal">
            <Menu.Item className={ cx("menuItem") } key="logout">
                <NavLink to={ "/auth/logout" }>
                    <Icon className={ cx("icon") } type="logout"/>
                    <span className={ cx("text") }>
                        <FormattedMessage id={"Nav.exitButtonText"}/>
                    </span>
                </NavLink>
            </Menu.Item>
        </Menu>
    )
}

const LoadingComponent = () => {
    return (
        <div style={{ padding: 30, fontSize: 18 }}>
            Загрузка...
        </div>
    )
}

class AppLayout extends React.PureComponent<IProps, IState> {
    public state = {
        theme: "light" as SiderTheme,
        drawerCollapsed: true,
    }

    public componentDidMount(): void {
        if (this.props.match.isExact) {
            this.props.history.push(this.props.match.url + "/translate")
        }
        // . Ask for interface language
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (this.props.match.isExact) {
            this.props.history.push(this.props.match.url + "/translate")
        }
    }

    private getSelectedKeys = (): string[] => {
        return this.props.location.pathname.split("/").filter(
            (name) => menuItems.some((obj) => obj.link === name),
        )
    }

    private toggleDrawerCollapsed = () => {
        this.setState({
            drawerCollapsed: !this.state.drawerCollapsed,
        })
    }

    public render() {
        const { theme, drawerCollapsed } = this.state
        const { match, media } = this.props
        const selectedKeys: string[] = this.getSelectedKeys()

        return (
            <Layout style={{width: "100%"}} className={ cx("wrrapperLayout") }>
                <Header
                    style={{ background: theme === "light" ? "#fff" : "", padding: 0, zIndex: 1, height: 50 }}
                >
                    <div className={ cx("headerWr", media.is.md && "isTablet", media.isMobile && "isMobile") }>
                        <div className={ cx("headerContent") }>
                            <Logo/>
                            <div className={ cx("menuTrigger") }>
                                <Icon
                                    className="trigger"
                                    type={"setting"}
                                    style={{fontSize: 18}}
                                    onClick={this.toggleDrawerCollapsed}
                                />
                            </div>
                            <div className={ cx("menuContent") }>
                                {/*
                                <Menu
                                    selectedKeys={ selectedKeys }
                                    theme={ theme }
                                    style={{ lineHeight: "64px", borderBottom: "none"}}
                                    mode="horizontal">
                                    <Menu.Item className={ cx("menuItem") } key="logout">
                                        <Icon className={ cx("icon") } type="user"/>
                                        <span className={ cx("text") }>Здравствуйте, { fullName }</span>
                                    </Menu.Item>
                                </Menu>
                                */}
                                {/*
                                <div className={ cx("infobar") }>
                                    <div className={ cx("item") }>
                                        <Icon style={{marginRight: 5}} className={ cx("icon") } type="dollar"/>
                                        <span className={ cx("text") }>{ balance.toFixed() } руб.</span>
                                    </div>
                                    <div className={ cx("item") }>
                                        <a href={ paymentLink } target="_blank">
                                            <Button type="primary">
                                                Пополнить
                                                <Icon className={ cx("icon") } type="dollar"/>
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                                */}
                                {/*
                                <ExitMenu theme={ theme }/>
                                */}
                            </div>
                        </div>
                    </div>
                </Header>
                <Layout className={ cx("siderLayout", media.lessThan.lg && "smallerHorTablet") }>
                    <div className={ cx("siderLayoutInner") }>
                        <MainSiderWr
                            drawerActive={ media.lessThan.lg }
                            drawerCollapsed={ drawerCollapsed }
                            toggleDrawerCollapsed={ this.toggleDrawerCollapsed }
                        >
                            <MainSider
                                media={ media }
                                theme={ theme }
                                selectedKeys={ selectedKeys }
                                match={ match }
                                toggleDrawerCollapsed={ this.toggleDrawerCollapsed }
                            />
                        </MainSiderWr>
                        <Layout>
                            <Suspense fallback={<LoadingComponent/>}>
                                <Content>
                                    <Switch>
                                        {
                                            menuItems.map((menuItem) => {
                                                return (
                                                    <Route
                                                        key={menuItem.link}
                                                        path={`${match.url}/${menuItem.link}`}
                                                        component={menuItem.component}
                                                    />
                                                )
                                            })
                                        }
                                    </Switch>
                                </Content>
                            </Suspense>
                        </Layout>
                    </div>
                </Layout>
            </Layout>
        )
    }
}

export default connect(({media, profile}: IAppState) => {
    return {media, profile}
})(AppLayout)
