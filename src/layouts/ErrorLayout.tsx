import React from "react"

// interface IProps {
//
// }

interface IState {
    hasError: boolean
}

export class ErrorBoundary extends React.PureComponent<{}, IState> {
    public state = {
        hasError: false,
    }

    public static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    public componentDidCatch(error: Error, info: any) {
        console.log(info)
    }

    public render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
                    <h1 style={{fontSize: 18}}>Что-то пошло не так, поддержка уже с этим разбирается</h1>
                </div>
            )
        }

        return this.props.children
    }
}