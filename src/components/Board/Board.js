import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { defaultPokes } from "../../context/pokes.context";
import { useTransition, animated } from 'react-spring';
import PokeCard from "../PokeCard/PokeCard";
import { isEmpty } from "lodash";
import './Board.css';

const queryAttr = "data-rbd-drag-handle-draggable-id";

const Board = () => {
  const [columns, setColumns] = useState(defaultPokes);
  const [items, setItems] = useState([]);
  const [placeholderProps, setPlaceholderProps] = useState({});

  const transition = useTransition(items, {
    delay: 200,
    from: { x: -250, y: 850, opacity: 0 },
    enter: item => async (next) => {
      await next({ y: item.y, delay: item.delay, opacity: 1 });
      await next({ x: 0, opacity: 1 });
    },
    leave: { x: 250, y: 850, opacity: 0 },
    /*delay: 200,*/
    config: { mass: 5, tension: 500, friction: 100 },
    delay: 250,
    trail: 25,
  });
  
  const handleAnimation = () => {  
    setItems(v => v.length ? [] : [
      { y: 0, delay: 200 },
    ]);
  }

  const handleDragStart = event => {
    const draggedDOM = getDraggedDom(event.draggableId);

    if (!draggedDOM) {
      return;
    }

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = event.source.index;
    var clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft
      )
    });
  };

  const handleDragEnd = (result, columns, setColumns) => {
    setPlaceholderProps({});
  
    if (!result.destination) return;
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  const handleDragUpdate = event => {
    if (!event.destination) {
      return;
    }

    const draggedDOM = getDraggedDom(event.draggableId);

    if (!draggedDOM) {
      return;
    }

    const { clientHeight, clientWidth } = draggedDOM;
    const destinationIndex = event.destination.index;
    const sourceIndex = event.source.index;

    const childrenArray = [...draggedDOM.parentNode.children];
    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1)
    ];

    var clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft
      )
    });
  };

  const getDraggedDom = draggableId => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    return draggedDOM;
  };

  return (
    <>
      <div className="poke-card" >
      <button className="board-btn" onClick={handleAnimation}  >
        <span className="pokeball-icon"><img src='/assets/Pokeball.png' /></span>
        {items.length === 0 ? 'choose' : 'go back'}
      </button>
    <div style={{ margin: 60 }} />
    </div>
    <div className="board-container">
      <DragDropContext
         onDragStart={handleDragStart}
         onDragUpdate={handleDragUpdate}
         onDragEnd={result => handleDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <div style={{ margin: 20 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="droppable-column"
                        style={{
                          background: snapshot.isDraggingOver
                            ? "linear-gradient(to left top, rgba(30,30,30, 0.4), rgba(30,30,30, 0.2))"
                            : "linear-gradient(to right bottom, rgba(30,30,30, 0.4), rgba(30,30,30, 0.2))",
                          padding: 10,
                          width: 300,
                          minHeight: 850,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="poke-draggable"
                                    style={{
                                      userSelect: "none",
                                      minHeight: "250px",
                                      backgroundColor: snapshot.isDragging
                                        ? "lightgray"
                                        : "transparent",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                  { transition((style, el) => 
                                    el &&
                                    <animated.div style={style} className="poke-item">
                                      <PokeCard {...item} key={item.id} />
                                    </animated.div>
                                  )}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        {!isEmpty(placeholderProps) && snapshot.isDraggingOver && (
                          <div
                            className="placeholder"
                            style={{
                              top: placeholderProps.clientY,
                              left: placeholderProps.clientX,
                              height: placeholderProps.clientHeight,
                              width: placeholderProps.clientWidth
                            }}
                          />
                        )}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
    </>
  );
}

export default Board;

/*
 const [items, setItems] = useState([]);
  const [check, setCheck] = useState(false);

  const transition = useTransition(items, {
    delay: 200,
    from: { x: -250, y: 850, opacity: 0 },
    enter: item => async (next) => {
      await next({ y: item.y, delay: item.delay, opacity: 1 });
      await next({ x: 0, opacity: 1 });
    },
    leave: { x: 250, y: 850, opacity: 0 },
    /*delay: 200,
    config: { mass: 5, tension: 500, friction: 100 },
    delay: 250,
    trail: 25,
  });
  
  const handleAnimation = () => {  
    setItems(v => v.length ? [] : [
      { y: 0 }
    ]);
  }*/
