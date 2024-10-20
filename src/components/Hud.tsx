import {
  MouseEvent,
  createContext,
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useMoveable } from '../hooks/Moveable';
import { ActiveShapeContext } from '../context/ActiveShapeContext';

const displayMasksConfig = {
  center: false,
  north: false,
  west: false,
  south: false,
  east: false,
};
const STROKE_COLOR = '#b5b7bc';
const STROKE_WIDTH = 2;
const HORIZONTAL_LINE_HEIGHT = 20;
const VERTICAL_LINE_WIDTH = 20;
const MASK_LINE_X_SPACES = 10;
const MASK_LINE_Y_SPACES = 10;
const MASK_LINE_POS_ADJUSTMENT = 10;

interface LineAttr {
  x?: number;
  x2?: number;
  y?: number;
  y2?: number;
  maskWidth?: number | string;
  maskHeight?: number | string;
  maskLineXTreshold?: number;
  maskLineYTreshold?: number;
}

interface CenterMaskAttr {
  width?: string | number;
  height?: string | number;
  xSpaces?: number;
  ySpaces?: number;
  disableLine?: string;
}

export interface HudState {
  x: number;
  y: number;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export interface HudProp {
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  display?: 'none' | 'block';
  className?: string;
}

export interface HudTargetProp {
  x: number;
  y: number;
  height?: number | string;
  width?: number | string;
}

export interface HudContextProp {
  display: 'none' | 'block';
  targetProp: HudTargetProp;
  setTargetProp: (value: HudTargetProp) => void;
}

export interface HudContextType {
  props: HudContextProp;
  setContext: (props: HudContextProp) => void;
}

export const defaultHudContextValue: HudContextType = {
  props: {
    display: 'none',
    targetProp: { x: 0, y: 0, height: 0, width: 0 },
    setTargetProp: () => {},
  },
  setContext: () => {},
};

export const HudContext = createContext(defaultHudContextValue);

export const adjustHudTargetProp = (props: HudTargetProp): HudTargetProp => {
  return {
    x: props.x ?? 0,
    y: props.y ?? 0,
    width: parseInt(props.width as string, 10),
    height: parseInt(props.height as string, 10),
  };
};

export const Hud: FunctionComponent = () => {
  const {
    props: { display, setTargetProp, targetProp },
  } = useContext(HudContext);

  const [moveableState, moveActions, setMoveAbleState] = useMoveable(targetProp);
  const { setId: setActiveShape } = useContext(ActiveShapeContext);

  const [centerAttr, setCenterAttr] = useState<CenterMaskAttr>({
    width: targetProp.width,
    height: targetProp.height,
    xSpaces: 10,
    ySpaces: 10,
  });

  const [centerMoveMask, setCenterMoveMask] = useState<CenterMaskAttr>({
    xSpaces: 0,
    ySpaces: 0,
  });

  const [northLineState, northLineActions, setNorthLineState] = useMoveable<
    LineAttr,
    SVGRectElement
  >({
    x: moveableState.x,
    y: moveableState.y,
    x2: moveableState.x + +targetProp.width! + MASK_LINE_X_SPACES * 2,
    maskHeight: HORIZONTAL_LINE_HEIGHT,
    maskLineXTreshold: MASK_LINE_X_SPACES,
    maskLineYTreshold: MASK_LINE_Y_SPACES,
  });

  const [westLineState, westLineActions, setWestLineState] = useMoveable<LineAttr, SVGRectElement>({
    x: moveableState.x + +targetProp.width! + MASK_LINE_X_SPACES * 2,
    y: moveableState.y,
    y2: moveableState.y + +targetProp.height! + MASK_LINE_Y_SPACES * 2,
    maskWidth: VERTICAL_LINE_WIDTH,
    maskLineXTreshold: MASK_LINE_X_SPACES,
    maskLineYTreshold: MASK_LINE_Y_SPACES,
  });

  const [southLineState, southLineActions, setSouthLineState] = useMoveable<
    LineAttr,
    SVGRectElement
  >({
    x: moveableState.x,
    y: moveableState.y + +targetProp.height! + MASK_LINE_Y_SPACES * 2,
    x2: moveableState.x + +targetProp.width! + +MASK_LINE_X_SPACES * 2,
    maskHeight: HORIZONTAL_LINE_HEIGHT,
    maskLineXTreshold: MASK_LINE_X_SPACES,
    maskLineYTreshold: MASK_LINE_Y_SPACES,
  });

  const [eastLineState, eastLineActions, setEastLineState] = useMoveable<LineAttr, SVGRectElement>({
    x: moveableState.x,
    y: moveableState.y,
    y2: moveableState.y + +targetProp.height! + MASK_LINE_X_SPACES * 2,
    maskWidth: VERTICAL_LINE_WIDTH,
    maskLineXTreshold: MASK_LINE_X_SPACES,
    maskLineYTreshold: MASK_LINE_Y_SPACES,
  });

  const setCenterSize = (size: { width?: number | string; height?: number | string }) => {
    setCenterAttr({
      width: size.width,
      height: size.height,
      xSpaces: 0,
      ySpaces: 0,
    });
  };

  // #region SET DISPLAY BLOCK STATE
  useEffect(() => {
    setMoveAbleState((prev) => {
      prev.x = targetProp.x;
      prev.y = targetProp.y;

      return prev;
    });

    setSouthLineState({
      x: targetProp.x - MASK_LINE_POS_ADJUSTMENT,
      y: targetProp.y + +targetProp.height! + MASK_LINE_Y_SPACES * 2 - MASK_LINE_POS_ADJUSTMENT,
      x2: targetProp.x + +targetProp.width! + +MASK_LINE_X_SPACES * 2 - MASK_LINE_POS_ADJUSTMENT,
      maskHeight: HORIZONTAL_LINE_HEIGHT,
      maskLineXTreshold: MASK_LINE_X_SPACES,
      maskLineYTreshold: MASK_LINE_Y_SPACES,
    });

    setNorthLineState({
      x: targetProp.x - MASK_LINE_POS_ADJUSTMENT,
      y: targetProp.y - MASK_LINE_POS_ADJUSTMENT,
      x2: targetProp.x + +targetProp.width! + MASK_LINE_X_SPACES * 2 - MASK_LINE_POS_ADJUSTMENT,
      maskHeight: HORIZONTAL_LINE_HEIGHT,
      maskLineXTreshold: MASK_LINE_X_SPACES,
      maskLineYTreshold: MASK_LINE_Y_SPACES,
    });

    setWestLineState({
      x: targetProp.x + +targetProp.width! + MASK_LINE_X_SPACES * 2 - MASK_LINE_POS_ADJUSTMENT,
      y: targetProp.y - MASK_LINE_POS_ADJUSTMENT,
      y2: targetProp.y + +targetProp.height! + MASK_LINE_Y_SPACES * 2 - MASK_LINE_POS_ADJUSTMENT,
      maskWidth: VERTICAL_LINE_WIDTH,
      maskLineXTreshold: MASK_LINE_X_SPACES,
      maskLineYTreshold: MASK_LINE_Y_SPACES,
    });

    setEastLineState({
      x: targetProp.x - MASK_LINE_POS_ADJUSTMENT,
      y: targetProp.y - MASK_LINE_POS_ADJUSTMENT,
      y2: targetProp.y + +targetProp.height! + MASK_LINE_X_SPACES * 2 - MASK_LINE_POS_ADJUSTMENT,
      maskWidth: VERTICAL_LINE_WIDTH,
      maskLineXTreshold: MASK_LINE_X_SPACES,
      maskLineYTreshold: MASK_LINE_Y_SPACES,
    });

    setCenterSize({ width: targetProp.width, height: targetProp.height });
  }, [
    setMoveAbleState,
    setSouthLineState,
    setNorthLineState,
    setWestLineState,
    setEastLineState,
    setCenterAttr,
    targetProp,
  ]);
  // #endregion

  // #region CENTER MOUSE EVENT
  const centerMouseEvent = {
    mouseLeave: (e: MouseEvent) => {
      e.preventDefault();
      moveActions.mouseLeave(e, () => {
        setActiveShape(undefined);
        setCenterMoveMask((prev) => {
          prev.height = undefined;
          prev.width = undefined;
          prev.xSpaces = undefined;
          prev.ySpaces = undefined;
          prev.disableLine = undefined;

          return prev;
        });
      });
    },
    mouseUp: (e: MouseEvent) => {
      e.preventDefault();
      moveActions.mouseUp(e, () => {
        setCenterMoveMask((prev) => {
          prev.height = undefined;
          prev.width = undefined;
          prev.xSpaces = undefined;
          prev.ySpaces = undefined;
          prev.disableLine = undefined;

          return prev;
        });
      });
    },
    mouseDown: (e: MouseEvent) => {
      e.preventDefault();
      moveActions.mouseDown(e, () => {
        setCenterMoveMask((prev) => {
          prev.height = '200vh';
          prev.width = '200vw';
          prev.xSpaces = -200;
          prev.ySpaces = -200;
          prev.disableLine = 'pointer-events-none';

          return prev;
        });
      });
    },
    mouseMove: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      moveActions.mouseMove(e, (next) => {
        setTargetProp({
          x: next.x!,
          y: next.y!,
          height: centerAttr.height,
          width: centerAttr.width,
        });

        setNorthLineState((prev) => {
          const yPos = next.y! - MASK_LINE_POS_ADJUSTMENT;
          prev.x = next.x! - MASK_LINE_POS_ADJUSTMENT;
          prev.y = yPos;
          prev.x2 = 20 + next.x! + (centerAttr.width! as number) - MASK_LINE_POS_ADJUSTMENT;
          prev.y2 = yPos;

          return prev;
        });

        setSouthLineState((prev) => {
          const yPos = 20 + next.y! + (centerAttr.height! as number) - MASK_LINE_POS_ADJUSTMENT;
          prev.x = next.x! - MASK_LINE_POS_ADJUSTMENT;
          prev.y = yPos;
          prev.x2 = 20 + next.x! + (centerAttr.width! as number) - MASK_LINE_POS_ADJUSTMENT;
          prev.y2 = yPos;

          return prev;
        });

        setWestLineState((prev) => {
          const xPos = 20 + next.x! + (centerAttr.width! as number) - MASK_LINE_POS_ADJUSTMENT;
          prev.x = xPos;
          prev.y = next.y! - MASK_LINE_POS_ADJUSTMENT;
          prev.x2 = xPos;
          prev.y2 = 20 + next.y! + (centerAttr.height! as number) - MASK_LINE_POS_ADJUSTMENT;

          return prev;
        });

        setEastLineState((prev) => {
          const xPos = next.x! - MASK_LINE_POS_ADJUSTMENT;
          prev.x = xPos;
          prev.y = next.y! - MASK_LINE_POS_ADJUSTMENT;
          prev.x2 = xPos;
          prev.y2 = 20 + next.y! + (centerAttr.height! as number) - MASK_LINE_POS_ADJUSTMENT;

          return prev;
        });
      });
    },
  };

  //#endregion

  // #region NORTH LINE MOUSE EVENT
  const northLineMouseEvent = {
    mouseMove: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();

      northLineActions.mouseMoveY(e, (next) => {
        setMoveAbleState((prev) => {
          prev.x = next.x! + MASK_LINE_POS_ADJUSTMENT;
          prev.y = next.y! + MASK_LINE_POS_ADJUSTMENT;
          return prev;
        });

        setCenterAttr((prevCenter) => {
          prevCenter.height = 0 - (next.y! as number) + southLineState.y! - 20;
          prevCenter.width = 0 - (eastLineState.x! as number) + westLineState.x! - 20;
          return prevCenter;
        });

        setTargetProp({
          x: next.x! + MASK_LINE_POS_ADJUSTMENT,
          y: next.y! + MASK_LINE_POS_ADJUSTMENT,
          height: 0 - (next.y! as number) + southLineState.y! - 20,
          width: 0 - (eastLineState.x! as number) + westLineState.x! - 20,
        });

        setWestLineState((prev) => {
          prev.y = next.y;
          prev.y2 = southLineState.y;
          return prev;
        });

        setEastLineState((prev) => {
          prev.y = next.y;
          prev.y2 = southLineState.y;
          return prev;
        });
      });
    },
    mouseDown: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      northLineActions.mouseDown(e, () => {
        setNorthLineState((prev) => {
          prev.maskHeight = '100vh';
          prev.maskLineYTreshold = 200;
          return prev;
        });
      });
    },
    mouseUp: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      northLineActions.mouseUp(e, () => {
        setNorthLineState((prev) => {
          prev.maskHeight = HORIZONTAL_LINE_HEIGHT;
          prev.maskLineYTreshold = MASK_LINE_Y_SPACES;
          return prev;
        });
      });
    },
    mouseLeave: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      northLineActions.mouseLeave(e, () => {
        setNorthLineState((prev) => {
          prev.maskHeight = HORIZONTAL_LINE_HEIGHT;
          prev.maskLineYTreshold = MASK_LINE_Y_SPACES;
          return prev;
        });
      });
    },
  };
  // #endregion

  // #region SOUTH LINE MOUSE EVENT
  const southLineMouseEvent = {
    mouseDown: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      southLineActions.mouseDown(e, () => {
        setSouthLineState((prev) => {
          prev.maskHeight = '100vh';
          prev.maskLineYTreshold = 200;
          return prev;
        });
      });
    },
    mouseLeave: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      southLineActions.mouseLeave(e, () => {
        setSouthLineState((prev) => {
          prev.maskHeight = HORIZONTAL_LINE_HEIGHT;
          prev.maskLineYTreshold = MASK_LINE_Y_SPACES;
          return prev;
        });
      });
    },
    mouseUp: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      southLineActions.mouseLeave(e, () => {
        setSouthLineState((prev) => {
          prev.maskHeight = HORIZONTAL_LINE_HEIGHT;
          prev.maskLineYTreshold = MASK_LINE_Y_SPACES;
          return prev;
        });
      });
    },
    mouseMove: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();

      southLineActions.mouseMoveY(e, (next) => {
        setCenterAttr((prevCenter) => {
          prevCenter.height = 0 - (northLineState.y! as number) + next.y! - 20;
          prevCenter.width = 0 - (eastLineState.x! as number) + westLineState.x! - 20;
          return prevCenter;
        });

        setTargetProp({
          x: eastLineState.x! + MASK_LINE_POS_ADJUSTMENT,
          y: northLineState.y! + MASK_LINE_POS_ADJUSTMENT,
          height: 0 - (northLineState.y! as number) + next.y! - 20,
          width: 0 - (eastLineState.x! as number) + westLineState.x! - 20,
        });

        setWestLineState((prev) => {
          prev.y = northLineState.y;
          prev.y2 = next.y;
          return prev;
        });

        setEastLineState((prev) => {
          prev.y = northLineState.y;
          prev.y2 = next.y;
          return prev;
        });
      });
    },
  };
  // #endregion

  // #region WEST LINE MOUSE EVENT
  const westLineMouseEvent = {
    mouseDown: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      westLineActions.mouseDown(e, () => {
        setWestLineState((prev) => {
          prev.maskWidth = '100vw';
          prev.maskLineXTreshold = 200;
          return prev;
        });
      });
    },
    mouseLeave: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      westLineActions.mouseLeave(e, () => {
        setWestLineState((prev) => {
          prev.maskWidth = VERTICAL_LINE_WIDTH;
          prev.maskLineXTreshold = MASK_LINE_X_SPACES;
          return prev;
        });
      });
    },
    mouseUp: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      westLineActions.mouseLeave(e, () => {
        setWestLineState((prev) => {
          prev.maskWidth = VERTICAL_LINE_WIDTH;
          prev.maskLineXTreshold = MASK_LINE_X_SPACES;
          return prev;
        });
      });
    },
    mouseMove: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();

      westLineActions.mouseMoveX(e, (next) => {
        const updatedHeight = 0 - (northLineState.y! as number) + southLineState.y! - 20;
        const updatedWidth = 0 - (eastLineState.x! as number) + next.x! - 20;

        setCenterAttr((prevCenter) => {
          prevCenter.height = updatedHeight;
          prevCenter.width = updatedWidth;
          return prevCenter;
        });

        setTargetProp({
          x: eastLineState.x! + MASK_LINE_POS_ADJUSTMENT,
          y: northLineState.y! + MASK_LINE_POS_ADJUSTMENT,
          height: updatedHeight,
          width: updatedWidth,
        });

        setNorthLineState((prev) => {
          prev.x = eastLineState.x;
          prev.x2 = next.x;
          return prev;
        });

        setSouthLineState((prev) => {
          prev.x = eastLineState.x;
          prev.x2 = next.x;
          return prev;
        });
      });
    },
  };
  // #endregion

  // #region EAST LINE MOUSE EVENT
  const eastLineMouseEvent = {
    mouseDown: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      eastLineActions.mouseDown(e, () => {
        setEastLineState((prev) => {
          prev.maskWidth = '100vw';
          prev.maskLineXTreshold = 200;
          return prev;
        });
      });
    },
    mouseLeave: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      eastLineActions.mouseLeave(e, () => {
        setEastLineState((prev) => {
          prev.maskWidth = VERTICAL_LINE_WIDTH;
          prev.maskLineXTreshold = MASK_LINE_X_SPACES;
          return prev;
        });
      });
    },
    mouseUp: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();
      eastLineActions.mouseLeave(e, () => {
        setEastLineState((prev) => {
          prev.maskWidth = VERTICAL_LINE_WIDTH;
          prev.maskLineXTreshold = MASK_LINE_X_SPACES;
          return prev;
        });
      });
    },
    mouseMove: (e: MouseEvent<SVGRectElement>) => {
      e.preventDefault();

      eastLineActions.mouseMoveX(e, (next) => {
        setMoveAbleState((prev) => {
          prev.x = next.x! + MASK_LINE_POS_ADJUSTMENT;
          prev.y = northLineState.y! + MASK_LINE_POS_ADJUSTMENT;
          return prev;
        });

        const updatedHeight = 0 - (northLineState.y! as number) + southLineState.y! - 20;
        const updatedWidth = 0 - (next.x! as number) + westLineState.x! - 20;

        setCenterAttr((prevCenter) => {
          prevCenter.height = updatedHeight;
          prevCenter.width = updatedWidth;
          return prevCenter;
        });

        setTargetProp({
          x: eastLineState.x! + MASK_LINE_POS_ADJUSTMENT,
          y: northLineState.y! + MASK_LINE_POS_ADJUSTMENT,
          height: updatedHeight,
          width: updatedWidth,
        });

        setNorthLineState((prev) => {
          prev.x = next.x;
          prev.x2 = westLineState.x;
          return prev;
        });

        setSouthLineState((prev) => {
          prev.x = next.x;
          prev.x2 = westLineState.x;
          return prev;
        });
      });
    },
  };
  // #endregion

  // #region COMPONENT DOM
  return (
    <g
      className={`cursor-move`}
      x={moveableState.x}
      y={moveableState.y}
      style={{ display: display }}
    >
      {
        // #region CENTER RECT
      }
      <rect
        x={moveableState.x + (centerMoveMask.xSpaces ?? centerAttr.xSpaces ?? 0)}
        y={moveableState.y + (centerMoveMask.ySpaces ?? centerAttr.ySpaces ?? 0)}
        width={centerMoveMask.width ?? centerAttr.width}
        height={centerMoveMask.height ?? centerAttr.height}
        onMouseDown={centerMouseEvent.mouseDown}
        onMouseUp={centerMouseEvent.mouseUp}
        onMouseMove={centerMouseEvent.mouseMove}
        onMouseLeave={centerMouseEvent.mouseLeave}
        fill={displayMasksConfig.center ? 'black' : 'transparent'}
        fillOpacity={0.3}
      />
      {
        // #endregion
      }

      {
        // #region NORTH LINE GROUP
      }
      <g className="hover:cursor-row-resize">
        <line
          className={centerMoveMask.disableLine}
          x1={northLineState.x}
          y1={northLineState.y}
          x2={northLineState.x2}
          y2={northLineState.y}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
        />
        <rect
          className={centerMoveMask.disableLine}
          width={centerAttr.width}
          height={northLineState.maskHeight}
          x={northLineState.x! + northLineState.maskLineXTreshold!}
          y={northLineState.y! - northLineState.maskLineYTreshold!}
          onMouseDown={northLineMouseEvent.mouseDown}
          onMouseUp={northLineMouseEvent.mouseUp}
          onMouseLeave={northLineMouseEvent.mouseLeave}
          onMouseMove={northLineMouseEvent.mouseMove}
          fill={displayMasksConfig.north ? 'black' : 'transparent'}
          fillOpacity={0.3}
        ></rect>
      </g>
      {
        // #endregion
      }

      {
        // #region WEST LINE GROUP
      }
      <g className="hover:cursor-col-resize">
        <line
          className={centerMoveMask.disableLine}
          x1={westLineState.x}
          y1={westLineState.y}
          x2={westLineState.x}
          y2={westLineState.y2}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
        />
        <rect
          className={centerMoveMask.disableLine}
          width={westLineState.maskWidth}
          height={centerAttr.height}
          x={westLineState.x! - westLineState.maskLineXTreshold!}
          y={westLineState.y! + westLineState.maskLineYTreshold!}
          onMouseDown={westLineMouseEvent.mouseDown}
          onMouseUp={westLineMouseEvent.mouseUp}
          onMouseLeave={westLineMouseEvent.mouseLeave}
          onMouseMove={westLineMouseEvent.mouseMove}
          fill={displayMasksConfig.west ? 'black' : 'transparent'}
          fillOpacity={0.3}
        ></rect>
      </g>
      {
        // #endregion
      }

      {
        // #region SOUTH LINE GROUP
      }
      <g className="hover:cursor-row-resize">
        <line
          className={centerMoveMask.disableLine}
          x1={southLineState.x}
          y1={southLineState.y}
          x2={southLineState.x2}
          y2={southLineState.y}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
        />
        <rect
          className={centerMoveMask.disableLine}
          width={centerAttr.width}
          height={southLineState.maskHeight}
          x={southLineState.x! + southLineState.maskLineXTreshold!}
          y={southLineState.y! - southLineState.maskLineYTreshold!}
          onMouseDown={southLineMouseEvent.mouseDown}
          onMouseUp={southLineMouseEvent.mouseUp}
          onMouseLeave={southLineMouseEvent.mouseLeave}
          onMouseMove={southLineMouseEvent.mouseMove}
          fill={displayMasksConfig.south ? 'black' : 'transparent'}
          fillOpacity={0.3}
        ></rect>
      </g>
      {
        // #endregion
      }

      {
        // #region EAST LINE GROUP
      }
      <g className="hover:cursor-col-resize">
        <line
          className={centerMoveMask.disableLine}
          x1={eastLineState.x}
          y1={eastLineState.y}
          x2={eastLineState.x}
          y2={eastLineState.y2}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
        />
        <rect
          className={centerMoveMask.disableLine}
          width={eastLineState.maskWidth}
          height={centerAttr.height}
          x={eastLineState.x! - eastLineState.maskLineXTreshold!}
          y={eastLineState.y! + eastLineState.maskLineYTreshold!}
          onMouseDown={eastLineMouseEvent.mouseDown}
          onMouseUp={eastLineMouseEvent.mouseUp}
          onMouseLeave={eastLineMouseEvent.mouseLeave}
          onMouseMove={eastLineMouseEvent.mouseMove}
          fill={displayMasksConfig.east ? 'black' : 'transparent'}
          fillOpacity={0.3}
        ></rect>
      </g>
      {
        // #endregion
      }
    </g>
  );
  // #endregion
};
