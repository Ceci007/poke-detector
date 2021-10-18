import React, { useContext, memo } from 'react';
import useToggleState from '../../hooks/useToggleState';
import { PokesContext } from '../../context/pokes.context';
import { DispatchPokesContext } from '../../context/pokes.context';
import './PokeCard.css';

const PokeCard = (props) => {
  const pokes = useContext(PokesContext);
  const dispatch = useContext(DispatchPokesContext);

    return (
      <>
        <div className={`${props.header}`}>
          <span className="border" />
        </div>
        <div className="card-body">
          <img src={`${process.env.PUBLIC_URL}/assets/pokemons/${props.img}`} />
        </div>
      </>
    )
}

export default memo(PokeCard);