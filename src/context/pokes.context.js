import React, { createContext } from 'react';
import { v4 as uuid } from 'uuid';
import pokesReducer from '../reducers/poke.reducer';
import useLocalStorageReducer from '../hooks/useLocalStorageReducer';

export const defaultPokes = {
  '1': {
    items: [
      { 
        id: uuid(), 
        name: 'Pikachu', 
        check: false, 
        img: 'pikachu.png', 
        gradient: 'pikachu-gradient', 
        type: 'electric',
        header: 'pikachu-header'
      },
      { 
        id: uuid(), 
        name: 'Charmander', 
        check: false, 
        img: 'charmander.png', 
        gradient: 'charmander-gradient', 
        type: 'fire',
        header: 'charmander-header'
      },
      { 
        id: uuid(), 
        name: 'Bulbasaur', 
        check: false, 
        img: 'bulbasaur.png', 
        gradient: 'bulbasaur-gradient', 
        type: 'plant',
        header: 'bulbasaur-header'
      },
    ],
  },
  '2': {
    items: [
      { 
        id: uuid(), 
        name: 'Squirtle', 
        check: false, 
        img: 'squirtle.png', 
        gradient: 'squirtle-gradient', 
        type: 'water',
        header: 'squirtle-header'
      },
      { 
        id: uuid(), 
        name: 'Clefairy', 
        check: false, 
        img: 'clefairy.png', 
        gradient: 'clefairy-gradient', 
        type: 'normal fairy',
        header: 'clefairy-header'
      },
    ],
  },
  '3': {
    items: [
      { 
        id: uuid(), 
        name: 'Gastly', 
        check: false, 
        img: 'gastly.png', 
        gradient: 'gastly-gradient', 
        type: 'ghost',
        header: 'gastly-header'
      },
    ],
  },
};
 
export const PokesContext = createContext();
export const DispatchPokesContext = createContext();

export function PokesProvider(props) {
  const [pokes, dispatch] = useLocalStorageReducer("pokes", defaultPokes, pokesReducer);

  return (
    <PokesContext.Provider value={pokes} >
      <DispatchPokesContext.Provider value={dispatch} >
        { props.children }
      </DispatchPokesContext.Provider>
    </PokesContext.Provider>
  )
}