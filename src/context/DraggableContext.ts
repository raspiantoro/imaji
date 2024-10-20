import { createContext } from 'react';

export interface ElementDataString {
  format: string;
  data: string;
}

type ElementDataFunction = (key: string, x: number, y: number) => JSX.Element | null;

export type DraggableElement = ElementDataString | ElementDataFunction | null;

export interface DraggableContextType {
  element: DraggableElement;
  setElement: (element: () => DraggableElement) => void;
}

export const DraggableContext = createContext<DraggableContextType>({
  element: null,
  setElement: () => () => {},
});
