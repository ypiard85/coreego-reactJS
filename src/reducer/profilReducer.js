export const hasProfil =  (state = false, action) => {
    switch(action.type){
        case 'AUTH_PROFIL_INIT':
          if(action.payload){
            return state = action.payload
          }
          return null

        default :
            return state
    }
}
