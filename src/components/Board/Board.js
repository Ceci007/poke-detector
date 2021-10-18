import React, { useState, useContext } from "react";
import { PokesContext } from '../../context/pokes.context';
import { defaultPokes } from "../../context/pokes.context";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { isEmpty } from "lodash";
import PokeCard from "../PokeCard/PokeCard";
import "./Board.css";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgray" : "transparent",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "linear-gradient(to right bottom, rgba(30,30,30, 0.6), rgba(30,30,30, 0.3))" : "linear-gradient(to right bottom, rgba(30,30,30, 0.6), rgba(30,30,30, 0.3))",
  padding: grid,
  width: "100%",
  position: "relative"
});

const Board = () => {
  const queryAttr = "data-rbd-drag-handle-draggable-id";
  const pokes = useContext(PokesContext);
  const [placeholderProps, setPlaceholderProps] = useState({});
  const [listItemsOne, updateListItemsOne] = useState(defaultPokes.colOne);
  const [listItemsTwo, updateListItemsTwo] = useState(defaultPokes.colTwo);

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

  const handleDragEnd = result => {
    setPlaceholderProps({});
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const itemsOne = reorder(
      listItemsOne,
      result.source.index,
      result.destination.index
    );

    const itemsTwo = reorder(
      listItemsTwo,
      result.source.index,
      result.destination.index
    );

    updateListItemsOne(itemsOne);
    updateListItemsTwo(itemsTwo);
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

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <div className="board-container">
      <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      className="board-items"
    >
      <Droppable droppableId="droppable-1">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            className="droppable-column"
          >
            {listItemsOne.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    className="poke-draggable">
                    <div className="poke-item">
                      <PokeCard {...item} key={item.id} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
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
        )}
      </Droppable>
      <Droppable droppableId="droppable-2">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            className="droppable-column"
          >
            {listItemsTwo.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    className="poke-draggable">
                    <div className="poke-item">
                      <PokeCard {...item} key={item.id} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
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
        )}
      </Droppable>
    </DragDropContext>
    </div>
  );
};

export default Board;