import React from 'react';
import { PokesProvider } from '../../context/pokes.context';
import Board from '../../components/Board/Board';
import './Home.css';

const Home = () => {
  return (
    <PokesProvider>
      <Board />
    </PokesProvider>
  )
}

export default Home;