import React, { useState, useRef, useContext } from 'react';
import { PokesContext } from '../../context/pokes.context';
import { useTransition, animated } from 'react-spring';
import PokeCard from '../PokeCard/PokeCard';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
import './MobileBoard.css';

const queryAttr = "data-rbd-drag-handle-draggable-id";

const MobileBoard = () => {
  const pokes = useContext(PokesContext);
  const [placeholderProps, setPlaceholderProps] = useState({});
  const [items, setItems] = useState([]);
  const [pokeItems, setPokeItems] = useState(pokes);

  const transition = useTransition(items, {
    delay: 200,
    from: { x: -100, y: 800, opacity: 0 },
    enter: item => async (next) => {
      await next({ y: item.y, delay: item.delay, opacity: 1 });
      await next({ x: 0, opacity: 1 });
    },
    leave: { x: 100, y: 800, opacity: 0 },
    /*delay: 200,*/
    config: { mass: 5, tension: 500, friction: 100 },
    delay: 250,
    trail: 25,
  });

  const handleAnimation = () => { 
    setItems(v => v.length ? [] : [
      { y: 0 }
      /*
      { y: -10, delay: 200, id: 'a', i: 0},
      { y: 0, delay: 400, id: 'b', i: 1 },
      { y: 10, delay: 600, id: 'c', i: 2 },
      { y: 20, delay: 800, id: 'd', i: 3 },
      { y: 30, delay: 1000, id: 'e', i: 4 },*/
    ]);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  const onDragEnd = result => {
	  const { source, destination } = result;
    if(!destination) {
      return;
    }

    if(source.index === destination.index
      && source.droppableId === destination.droppableId) {
      return;
    }

    setPlaceholderProps({})
		setPokeItems(prevPokeItems => reorder(prevPokeItems, source.index, destination.index));
	};

  const onDragUpdate = update => {
    if(!update.destination){
      return;
    }
		const draggableId = update.draggableId;
		const destinationIndex = update.destination.index;

		const domQuery = `[${queryAttr}='${draggableId}']`;
		const draggedDOM = document.querySelector(domQuery);

		if (!draggedDOM) {
			return;
		}
		const { clientHeight, clientWidth } = draggedDOM;

		const clientY = parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) + [...draggedDOM.parentNode.children]
			.slice(0, destinationIndex)
			.reduce((total, curr) => {
				const style = curr.currentStyle || window.getComputedStyle(curr);
				const marginBottom = parseFloat(style.marginBottom);
				return total + curr.clientHeight + marginBottom;
			}, 0);

		setPlaceholderProps({
			clientHeight,
			clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft)
		});
	};

  return (
    <div className="board-container">  
    <button className="board-btn" onClick={handleAnimation} >
      <span className="pokeball-icon"><img src='/assets/Pokeball.png' /></span>
      {items.length !== 0 ? 'unmount board' : 'mount board'}
    </button>
      <DragDropContext onDragEnd={onDragEnd} 
      onDragUpdate={onDragUpdate}
      className="board-items">
        <Droppable droppableId={'pokes-1'}>
          {(provided) => {
            return (
              <div 
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="droppable-column"
              >
               {pokeItems.map((poke) => {
                  return (
                    <Draggable 
                    key={poke.id} 
                    index={poke.i} 
                    draggableId={poke.id}>
                    {(provided) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={items.length === 0 ? "poke-draggable dashed" : "poke-draggable"}
                        >
                          {
                            transition((style, item) => 
                              item && 
                                <animated.div 
                                key={item.id} 
                                style={style} 
                                className="poke-item"
                              >
                                
                                {provided.placeholder}
                                <div style={{
                                  position: "absolute",
                                  top: placeholderProps.clientY,
                                  marginTop: "-20px",
                                  left: placeholderProps.clientX,
                                  height: placeholderProps.clientHeight,
                                  background: "transparent",
                                  width: "100%"
                                }}/> 
                                <PokeCard {...pokes[poke.i]} key={poke.id} />
                              </animated.div>)
                          }
                      </div>)}}
                    </Draggable>
                  )
               })}
              </div>
            )
          }}
        </Droppable>
    </DragDropContext>
  </div>
  );
}

export default MobileBoard;