// import { useContext } from 'react';
import { useState } from 'react';
import { AssetPanel } from '../components/panel/AssetsPanel';
import { Viewport } from '../components/panel/ViewportPanel';
import {
  DraggableContext,
  DraggableContextType,
  DraggableElement,
} from '../context/DraggableContext';

export function Designer() {
  const [draggableElement, setDraggableElement] = useState<DraggableElement>(null);

  const value: DraggableContextType = {
    element: draggableElement,
    setElement: setDraggableElement,
  };

  return (
    <>
      <DraggableContext.Provider value={value}>
        <div className={`grid grid-cols-[20%_80%]`}>
          <AssetPanel />
          <Viewport viewbox={{ x: -200, y: -50, width: 1080, height: 1080 }} />
        </div>
      </DraggableContext.Provider>
    </>
  );
}
