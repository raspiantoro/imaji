import { createContext } from 'react';

export interface ActiveShapeContextType {
  id?: string;
  setId: (id?: string) => void;
}

export const ActiveShapeContext = createContext<ActiveShapeContextType>({
  setId: () => {},
});
