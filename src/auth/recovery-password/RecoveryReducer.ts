import {Dispatch} from 'redux'
import {recoveryAPI} from "../../api/recoveryApi";


export type isDoneType = 'true' | 'false' | 'inProgress'
const initialState = {
    isDone: 'false' as isDoneType,
    messangeRecInfo: '',
    error: ''
}

type InitialStateType = typeof initialState

export const RecoveryReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'STATUS_COMPLETED': {
            return {...state, isDone: action.value}
        }
        case "RECOVERY_INFO": {
            return {...state, messangeRecInfo: action.value}
        }
        case "SET-ERROR": {
            return {...state, error: action.error}
        }

        default:
            return state
    }
}

// actions
export const statusCompletedAC = (value: isDoneType) => ({type: 'STATUS_COMPLETED', value} as const)
export const recoveryStatusAC = (value: string) => ({type: 'RECOVERY_INFO', value} as const)
export const setAppErrorAC = (error: string) => ({type: 'SET-ERROR', error} as const)

// thunks
export const forgotTC = (email: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(recoveryStatusAC('loading'))
    recoveryAPI.forgotEmail(email)
        .then((res) => {
            if (res.status === 200) {
                dispatch(statusCompletedAC('inProgress'))
                dispatch(recoveryStatusAC(res.data.info))
            } else {
                dispatch(statusCompletedAC('false'))
                dispatch(recoveryStatusAC('unexpected error'))
            }
        })
        .catch((err) => {
            if (err.response) {
                dispatch(setAppErrorAC(err.response.data.error))
            } else {
                dispatch(setAppErrorAC('dangerous mistake'))
            }
        }).finally(() => {
        dispatch(recoveryStatusAC(''))
    })
}
export const newPasswordTC = (password: string, token: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(recoveryStatusAC('loading'))
    recoveryAPI.resetPassword(password, token)
        .then((res) => {
            if (res.status === 200) {
                /*dispatch(newPasswordAC(password, token))*/
                dispatch(statusCompletedAC("true"))
                dispatch(recoveryStatusAC(res.data.info))

            } else {
                dispatch(statusCompletedAC('false'))
                dispatch(recoveryStatusAC('! error'))
            }

            console.log(res)
        })
        .catch((err) => {
            if (err.response) {
                dispatch(setAppErrorAC(err.response.data.error))
            } else {
                dispatch(setAppErrorAC('dangerous mistake'))
            }
        }).finally(() => {
        dispatch(recoveryStatusAC(''))
    })
}


// types
type ActionsType =
    | ReturnType<typeof statusCompletedAC>
    | ReturnType<typeof recoveryStatusAC>
    | ReturnType<typeof setAppErrorAC>

