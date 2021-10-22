import React, { useContext, useState, useEffect, memo } from 'react';
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

/*
 */

/*

 {items.length === 0 ? <div className="poke-item" >
          <button className="board-btn" onClick={handleAnimation}  >
            <span className="pokeball-icon"><img src='/assets/Pokeball.png' /></span>
            {'choose'}
          </button>
        </div>
        :
        transition((style, item) =>
            item  &&
            <animated.div style={style} className="poke-item">
              <div className={`${props.header}`}>
                <button className="board-btn" onClick={handleAnimation} >
                  <span className="pokeball-icon"><img src='/assets/Pokeball.png' /></span>
                  {'go back'}
                </button>
                <span className="border" />
              </div>
              <div className="card-body">
                <img src={`${process.env.PUBLIC_URL}/assets/pokemons/${props.img}`} />
              </div>
            </animated.div>
          )
        }*/