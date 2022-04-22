export const profil =  (state = {}, action) => {
    switch(action.type){
        case 'AUTH_PROFIL_INIT':
          if(action.payload){
            return {
              ...state,
              ...action.payload && {
                avatar: action.payload.avatar,
                pseudo: action.payload.pseudo,
                instagram: action.payload.instagram,
                facebook: action.payload.facebook,
                twitter: action.payload.twitter,
                description: action.payload.description,
                tiktok: action.payload.tiktok
              }
            }
          }
          return null

        default :
            return state
    }
}
