import { DragEventHandler, DragEvent, useContext } from 'react';
import { DraggableContext } from '../context/DraggableContext';

export interface DraggableDataString {
  format: string;
  data: string;
}

const isDraggableDataString = (
  val: DraggableDataFunction | DraggableDataString,
): val is DraggableDataString => {
  const data = val as DraggableDataString;
  return data.format !== undefined && data.data !== undefined;
};

type DraggableDataFunction = (key: string, x: number, y: number) => JSX.Element | null;

interface DraggableProp {
  target: DraggableDataFunction | DraggableDataString;
}

interface DraggableAction<T> {
  onStart: DragEventHandler<T>;
}

export const useDraggable = <P extends DraggableProp, T>(prop: P): DraggableAction<T> => {
  let { setElement } = useContext(DraggableContext);

  const ondragstart = (e: DragEvent<T>) => {
    if (isDraggableDataString(prop.target)) {
      e.dataTransfer.setData(prop.target.format, prop.target.data);
    } else {
      setElement(() => prop.target as DraggableDataFunction);
    }
  };

  return {
    onStart: ondragstart,
  };
};
