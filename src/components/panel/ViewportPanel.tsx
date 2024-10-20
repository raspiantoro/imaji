import { useContext, useState, MouseEvent } from 'react';
import { DropableProp, useDropable } from '../../hooks/Dropable';
import { DraggableContext } from '../../context/DraggableContext';
import { defaultHudContextValue, Hud, HudContext, HudContextType } from '../Hud';
import { ActiveShapeContext, ActiveShapeContextType } from '../../context/ActiveShapeContext';

interface Props {
  className?: string;
  viewbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export function Viewport(props: Props) {
  const [state] = useState(props);

  const [activeShapeState, setActiveShapeState] = useState<string>();
  const activeShapeValue: ActiveShapeContextType = {
    id: activeShapeState,
    setId: setActiveShapeState,
  };

  const { element: nextDropElement } = useContext(DraggableContext);

  const [hudState, setHudState] = useState(defaultHudContextValue.props);
  const hudContextValue: HudContextType = {
    props: hudState,
    setContext: setHudState,
  };

  const initialDropableProp: DropableProp = {
    counter: 0,
    appendedElement: [],
    droppedElement:
      nextDropElement ??
      (() => {
        return null;
      }),
  };

  let [dropableState, dropableHandler] = useDropable(initialDropableProp);

  return (
    <HudContext.Provider value={hudContextValue}>
      <ActiveShapeContext.Provider value={activeShapeValue}>
        <div
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            if (activeShapeState === undefined) setHudState({ ...hudState, display: 'none' });
          }}
          className={`min-h-screen bg-gray-500 ${state.className ?? ''}`}
          onDragOver={dropableHandler.onDragOver}
          onDrop={dropableHandler.onDrop}
        >
          <svg
            id="viewport"
            preserveAspectRatio="xMidYMid meet"
            viewBox={`${state.viewbox.x} ${state.viewbox.y} ${state.viewbox.width} ${state.viewbox.height}`}
            className="h-screen p-5"
          >
            <defs>
              <clipPath id="clipPath">
                <rect x="200" y="50" width="500" height="750" />
              </clipPath>
            </defs>
            <g id="design-area" className="fill-white">
              <rect x="200" y="50" width="500" height="750" />
              {dropableState.appendedElement}
            </g>
            <Hud />
          </svg>
        </div>
      </ActiveShapeContext.Provider>
    </HudContext.Provider>
  );
}
