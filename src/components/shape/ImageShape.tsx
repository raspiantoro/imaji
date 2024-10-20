import { FunctionComponent, MouseEvent, ReactEventHandler, useContext, useState } from 'react';
import { ActiveShapeContext } from '../../context/ActiveShapeContext';
import { adjustHudTargetProp, HudContext, HudTargetProp } from '../Hud';

interface Props {
  id?: string;
  href: string;
  x: number;
  y: number;
  clipPath?: string;
  key?: string;
  width?: string | number;
  height?: string | number;
}

export const ImageShape: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState(props);

  const { props: hudProps, setContext: setHudContext } = useContext(HudContext);

  const { setId: setActiveShape } = useContext(ActiveShapeContext);

  const handleOnClick = (e: MouseEvent) => {
    e.preventDefault();
    setHudContext({
      ...hudProps,
      display: 'block',
      targetProp: adjustHudTargetProp({
        x: state.x,
        y: state.y,
        height: +state.height!,
        width: +state.width!,
      }),
      setTargetProp: (value: HudTargetProp) => {
        setState({
          ...state,
          x: value.x,
          y: value.y,
          height: value.height,
          width: value.width,
        });
      },
    });
  };

  const handleMouseOver = (e: MouseEvent) => {
    e.preventDefault();
    setActiveShape(e.currentTarget.id);
  };

  // const handleMouseLeave = (e: MouseEvent) => {
  //   e.preventDefault();
  //   setActiveShape(undefined);
  // };

  const handleOnLoad: ReactEventHandler<SVGImageElement> = (e) => {
    const context = e.currentTarget.getBBox();

    setState({
      ...state,
      width: Math.round(context.width),
      height: Math.round(context.height),
    });
  };

  return (
    <>
      <image
        preserveAspectRatio="none"
        onLoad={handleOnLoad}
        onMouseOver={handleMouseOver}
        onMouseDown={handleOnClick}
        href={state.href}
        x={state.x}
        y={state.y}
        width={state.width}
        height={state.height}
        id={state.id}
        clipPath={state.clipPath}
      />
    </>
  );
};

export function createImageShape(param: {
  href: string;
  width?: number;
  height?: number;
  clipPath?: string;
}): (key: string, x: number, y: number) => JSX.Element {
  return (key: string, x: number, y: number) => {
    return (
      <ImageShape
        href={param.href}
        x={x}
        y={y}
        key={key}
        id={`image-shape-${key}`}
        height={param.height}
        width={param.width}
        clipPath={param.clipPath}
      />
    );
  };
}
