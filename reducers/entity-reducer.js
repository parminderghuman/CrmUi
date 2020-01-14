const entityReducer = (state = {
    entity: undefined,
    loading: true,
    entities: [],
    systemEntity: undefined,
    systemEntityMap:{},
    systemEntities: [],
    roles:[]
}, action) => {
    
    switch (action.type) {
        case 'Save':
            return { ...state, entity: action.data, loading: false };

        case 'Load':
            return { ...state, entity: action.data, loading: false };
        case 'List':
            return { ...state, entities: action.data, loading: false };
             case 'Roles':
            return { ...state, roles: action.data, loading: false };

        case 'SystemEntityList':
            return { ...state, systemEntities: action.data, loading: false };
       
        case 'SystemEntityMap':
                    return { ...state, systemEntityMap: action.data.map,  systemEntity: action.data.entity };
        
        default:
            return state;
    }
};

export default entityReducer;