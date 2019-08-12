
// Models

class UserModel {
    public id: string
    public login: string
    public password: string
    public cars: CarModel[]
}

class CarModel {
    public id: string
    public number: string
    public user: UserModel
}

class PaymentModel {
    public id: string
    public cost: number
}

// Use cases

interface IUsersPresenter {
    getUsersByCardId: (carId: string) => UserModel[]
}

interface ICarsPresenter {
    getCarsByNumber: (carNumber: string) => CarModel[]
}

interface IPaymentPresenter {
    getCostByCarId: (carNumber: string) => number
    createPayment: (carId: string, cost: number) => PaymentModel
    donePayment: (paymentId: string) => void
}

interface IPaymentForParkingUseCaseProps {
    UsersPresenter: IUsersPresenter,
    CarsPresenter: ICarsPresenter,
    PaymentPresenter: IPaymentPresenter,
}

class PaymentForParkingUseCase {
    private UsersPresenter: IUsersPresenter
    private CarsPresenter: ICarsPresenter
    private PaymentPresenter: IPaymentPresenter

    constructor(props: IPaymentForParkingUseCaseProps) {
        this.UsersPresenter = props.UsersPresenter
        this.CarsPresenter = props.CarsPresenter
        this.PaymentPresenter = props.PaymentPresenter
    }

    public findCarsByNumber = (carNumber: string): CarModel[] => {
        return this.CarsPresenter.getCarsByNumber(carNumber)
    }

    public getCostPerStanding = (carId: string): number => {
        return this.PaymentPresenter.getCostByCarId(carId)
    }

    public makePayment = (carId: string) => {
        const cost = this.PaymentPresenter.getCostByCarId(carId)
        const payment = this.PaymentPresenter.createPayment(carId, cost)
        this.PaymentPresenter.donePayment(payment.id)
        this.AccessPresenter.grantAccess(carId)
    }
}

// Presenters

class UserPresenter {
    // private DataUsersMapper
    public getUsersByCardId = (carId: string): UserModel[] => {
        // 1. Get data from DB
        // 2. Map it to Model
        return [new UserModel()]
    }
}

const UserPresenterInst = new UserPresenter()

const PaymentForParkingUseCaseInst = new PaymentForParkingUseCase({
    UsersPresenter: UserPresenterInst,
})

// Controllers

class OperatorController {
    public findUsersByCar = (carId: string): UserModel[] => {
        return PaymentForParkingUseCaseInst.findUsers(carId)
    }

    public getCostPerStanding = (carId: string): number => {
        return PaymentForParkingUseCaseInst.getCostPerStanding(carId)
    }
}

export {
    UserModel,
}
