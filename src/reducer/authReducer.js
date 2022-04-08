export const  isAuthenticated =  (state = {}, action) => {
    switch(action.type){
        case 'INIT':
            return state = action.payload;
        default :
            return state
    }
}

export const authAction = (user) => {

    return{
        type: 'INIT',
        payload: user
    }

}
