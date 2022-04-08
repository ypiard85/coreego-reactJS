export const isAuthenticated =  (state = {}, action) => {
    switch(action.type){
        case 'AUTH_STATE_CHANGED':
          if(action.payload) {
            return {
              ...state,
              ...action.payload && {
                id: action.payload.uid,
                email: action.payload.email,
                emailVerified: action.payload.emailVerified
              }
            }
          }
          return null

        default :
            return state
    }
}

export const authAction = (user) => ({
  type: 'AUTH_STATE_CHANGED',
  payload: user
})
