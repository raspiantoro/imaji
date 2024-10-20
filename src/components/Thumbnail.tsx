import { FunctionComponent, useState } from 'react';
import { useDraggable } from '../hooks/Draggable';

interface Props {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  target: (key: string, x: number, y: number) => JSX.Element;
  title: string;
  width?: string | number;
  height?: string | number;
}

export const Thumbnail: FunctionComponent<Props> = (prop: Props) => {
  let [state] = useState(prop);
  let dragHandler = useDraggable<Props, HTMLImageElement>(state);

  return (
    <>
      <div
        className={`border-4 p-1 m-1 h-14 w-14 align-middle content-center hover:border-2 ${state.className ?? ''}`}
      >
        <img
          className={`object-scale-down max-h-full ${state.imageClassName ?? ''}`}
          src={state.src}
          draggable="true"
          onDragStart={dragHandler.onStart}
          alt={state.alt ?? 'thumbnail'}
        />
      </div>
    </>
  );
};
