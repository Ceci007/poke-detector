const pokesReducer = (state, action) => {
  switch(action.type) {
    case "REMOVE_POKE":
      return state.filter(poke => poke.id !== action.id)
    case "TOGGLE_POKE":
      return state.map(poke => ((poke.id === action.id) ? 
      { ...poke, check: !poke.check } : poke))
    default:
      return state;
  }
}

export default pokesReducer;