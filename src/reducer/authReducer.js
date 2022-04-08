export const  isAuthenticated =  (state = {}, action) => {
    switch(action.type){
        case 'AUTH_STATE_CHANGED':
            return {
              ...state,
              user: action.payload
            }
        default :
            return state
    }
}

export const authAction = (user) => ({
  type: 'AUTH_STATE_CHANGED',
  payload: user
})
