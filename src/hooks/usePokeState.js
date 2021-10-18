import useLocalStorageState from './useLocalStorageState';

function usePokeState(initialPokes) {
  const [pokes, setPokes] = useLocalStorageState("pokes", initialPokes);

  return {
    pokes,
    removePoke: pokeId => {
      const updatedPokes = pokes.filter(poke => poke.id !== pokeId);
      setTodos(updatedPokes);
    },
    togglePoke: pokeId => {
      const updatedPokes = pokes.map(poke => ((poke.id === pokeId) 
      ? {...poke, check: !poke.check } : poke));
      setTodos(updatedPokes);
    }
  }
}

export default usePokeState;