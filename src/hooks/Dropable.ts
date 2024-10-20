import { DragEventHandler, DragEvent, useState } from 'react';

export interface DropableDataString {
  format: string;
  data: string;
}

export type DropableDataFunction = (key: string, x: number, y: number) => JSX.Element | null;

const isDropableDataString = (
  val: DropableDataFunction | DropableDataString,
): val is DropableDataString => {
  const data = val as DropableDataString;
  return data.format !== undefined && data.data !== undefined;
};

export interface DropableProp {
  counter: number;
  appendedElement: JSX.Element[];
  droppedElement: DropableDataFunction | DropableDataString;
}

interface DraggableAction<T extends HTMLElement> {
  onDrop: DragEventHandler<T>;
  onDragOver: DragEventHandler<T>;
}

export const useDropable = <P extends DropableProp, T extends HTMLElement>(
  prop: P,
): [P, DraggableAction<T>, (prop: P) => void] => {
  let [state, setState] = useState(prop);

  let [posState, setPosState] = useState({ x: 0, y: 0 });

  const ondrop = (e: DragEvent<T>) => {
    if (isDropableDataString(prop.droppedElement)) {
      handleDataString(e, prop.droppedElement);
    } else {
      const fn = prop.droppedElement as DropableDataFunction;
      if (fn === null) return;
      handleDataFunction(e, fn);
    }
  };

  const handleDataString = (e: DragEvent<T>, data: DropableDataString) => {
    const elementId = e.dataTransfer.getData(data.format);
    const element = document.getElementById(elementId);
    setState({
      ...state,
      appendedElement: [...state.appendedElement, element],
    });
  };

  var handleDataFunction = (e: DragEvent<T>, fn: DropableDataFunction) => {
    let counter = state.counter + 1;
    const rect = e.currentTarget.getBoundingClientRect();

    let nextElement = fn(`${counter}`, posState.x - rect.x, posState.y - rect.y);
    if (nextElement !== null) {
      setState({
        ...state,
        counter: counter,
        appendedElement: [...state.appendedElement, nextElement],
      });
    }
  };

  const onDragOver = (e: DragEvent<T>) => {
    e.preventDefault();
    setPosState({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const setDropableState = (prop: P) => {
    setState(prop);
  };

  return [
    state,
    {
      onDrop: ondrop,
      onDragOver: onDragOver,
    },
    setDropableState,
  ];
};
