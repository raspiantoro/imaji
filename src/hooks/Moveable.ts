import { MouseEvent, useState, useCallback, Dispatch, SetStateAction } from 'react';

export interface MoveableProp {
  x?: number;
  y?: number;
}

type MoveableState<T extends MoveableProp> = T & {
  isDown: boolean;
  screenX: number;
  screenY: number;
};

function createMoveableState<T extends MoveableProp>(val: T): MoveableState<T> {
  const state: MoveableState<T> = {
    ...val,
    isDown: false,
    screenX: 0,
    screenY: 0,
  };

  return state;
}

interface MoveableActions<T> {
  mouseDown: (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => void;
  mouseUp: (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => void;
  mouseMove: (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => void;
  mouseMoveX: (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => void;
  mouseMoveY: (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => void;
  mouseLeave: (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => void;
}

export const useMoveable = <P extends MoveableProp, T>(
  prop: P,
): [P, MoveableActions<T>, Dispatch<SetStateAction<P>>] => {
  const initialState: MoveableState<P> = createMoveableState(prop);
  const [state, setState] = useState<MoveableState<P>>(initialState);

  const handleMouseDown = useCallback(
    (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => {
      setState({
        ...state,
        isDown: true,
        x: state.x,
        y: state.y,
        screenX: e.screenX,
        screenY: e.screenY,
      });

      if (callback !== undefined) callback(state as MoveableProp);
    },
    [state, setState],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => {
      if (!state.isDown) return;

      setState({
        ...state,
        isDown: false,
        x: state.x,
        y: state.y,
        screenX: 0,
        screenY: 0,
      });

      if (callback !== undefined) callback(state as MoveableProp);
    },
    [state, setState],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => {
      e.preventDefault();
      if (!state.isDown) return;

      const shiftX = state.screenX === undefined ? e.screenX : e.screenX - state.screenX;
      const shiftY = state.screenY === undefined ? e.screenY : e.screenY - state.screenY;

      const nextX = state.x === undefined ? shiftX : state.x + shiftX;
      const nextY = state.y === undefined ? shiftY : state.y + shiftY;

      setState({
        ...state,
        x: nextX,
        y: nextY,
        screenX: e.screenX,
        screenY: e.screenY,
      });

      if (callback !== undefined) callback({ x: nextX, y: nextY });
    },
    [state, setState],
  );

  const handleMouseMoveX = useCallback(
    (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => {
      e.preventDefault();
      if (!state.isDown) return;

      const shiftX = state.screenX === undefined ? e.screenX : e.screenX - state.screenX;

      const nextX = state.x === undefined ? shiftX : state.x + shiftX;
      const nextY = state.y;

      setState({
        ...state,
        x: nextX,
        screenX: e.screenX,
        screenY: e.screenY,
      });

      if (callback !== undefined) callback({ x: nextX, y: nextY });
    },
    [state, setState],
  );

  const handleMouseMoveY = useCallback(
    (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => {
      e.preventDefault();
      if (!state.isDown) return true;

      const shiftY = state.screenY === undefined ? e.screenY : e.screenY - state.screenY;

      const nextX = state.x;
      const nextY = state.y === undefined ? shiftY : state.y + shiftY;

      setState({
        ...state,
        y: nextY,
        screenX: e.screenX,
        screenY: e.screenY,
      });

      if (callback !== undefined) callback({ x: nextX, y: nextY });
    },
    [state, setState],
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent<T>, callback?: (nextProp: MoveableProp) => void) => {
      setState({
        ...state,
        isDown: false,
      });

      if (callback !== undefined) callback(state as MoveableProp);
    },
    [state, setState],
  );

  return [
    state,
    {
      mouseDown: handleMouseDown,
      mouseUp: handleMouseUp,
      mouseMove: handleMouseMove,
      mouseMoveX: handleMouseMoveX,
      mouseMoveY: handleMouseMoveY,
      mouseLeave: handleMouseLeave,
    },
    setState as Dispatch<SetStateAction<P>>,
  ];
};
