import { createImageShape } from '../shape/ImageShape';
import { Thumbnail } from '../Thumbnail';

interface Props {
  className?: string;
  activeShape?: string;
  setActiveShape?: (name: string | undefined) => void;
}

interface Items {
  title: string;
  target: (key: string, x: number, y: number) => JSX.Element;
  src: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  clipPath?: string;
}

let ornaments: Items[] = [
  {
    title: 'ornament-one',
    target: createImageShape({
      href: '/ornament-one.png',
      height: 419,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-one.png',
  },
  {
    title: 'ornament-two',
    target: createImageShape({
      href: '/ornament-two.png',
      height: 149,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-two.png',
  },
  {
    title: 'ornament-three',
    target: createImageShape({
      href: '/ornament-three.png',
      height: 720,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-three.png',
  },
  {
    title: 'ornament-four',
    target: createImageShape({
      href: '/ornament-four.png',
      height: 120,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-four.png',
  },
  {
    title: 'ornament-five',
    target: createImageShape({
      href: '/ornament-five.png',
      height: 280,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-five.png',
  },
  {
    title: 'ornament-six',
    target: createImageShape({
      href: '/ornament-six.png',
      height: 150,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-six.png',
  },
  {
    title: 'ornament-seven',
    target: createImageShape({
      href: '/ornament-seven.png',
      height: 500,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-seven.png',
  },
  {
    title: 'ornament-eight',
    target: createImageShape({
      href: '/ornament-eight.png',
      height: 180,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-eight.png',
  },
  {
    title: 'ornament-nine',
    target: createImageShape({
      href: '/ornament-nine.png',
      height: 520,
      clipPath: 'url(#clipPath)',
    }),
    src: '/ornament-nine.png',
  },
];

let frames: Items[] = [
  {
    title: 'frame-one',
    target: createImageShape({ href: '/frame-one.png', height: 480, clipPath: 'url(#clipPath)' }),
    src: '/frame-one.png',
  },
  {
    title: 'frame-two',
    target: createImageShape({ href: '/frame-two.png', height: 750, clipPath: 'url(#clipPath)' }),
    src: '/frame-two.png',
  },
  {
    title: 'frame-three',
    target: createImageShape({ href: '/frame-three.png', height: 750, clipPath: 'url(#clipPath)' }),
    src: '/frame-three.png',
  },
  {
    title: 'frame-four',
    target: createImageShape({ href: '/frame-four.png', height: 880, clipPath: 'url(#clipPath)' }),
    src: '/frame-four.png',
  },
  {
    title: 'frame-five',
    target: createImageShape({ href: '/frame-five.png', height: 680, clipPath: 'url(#clipPath)' }),
    src: '/frame-five.png',
  },
  {
    title: 'frame-six',
    target: createImageShape({ href: '/frame-six.png', height: 710, clipPath: 'url(#clipPath)' }),
    src: '/frame-six.png',
  },
  {
    title: 'frame-seven',
    target: createImageShape({ href: '/frame-seven.png', height: 710, clipPath: 'url(#clipPath)' }),
    src: '/frame-seven.png',
  },
  {
    title: 'frame-eight',
    target: createImageShape({ href: '/frame-eight.png', height: 750, clipPath: 'url(#clipPath)' }),
    src: '/frame-eight.png',
  },
  {
    title: 'frame-nine',
    target: createImageShape({ href: '/frame-nine.png', height: 680, clipPath: 'url(#clipPath)' }),
    src: '/frame-nine.png',
  },
];

export function AssetPanel(props: Props) {
  return (
    <div id="asset-panel" className="row-auto">
      <div>
        <span>Ornaments</span>
      </div>
      <div id="asset-panel" className={props.className}>
        <div className="grid grid-cols-3 gap-1 m-4 p-2">
          {ornaments.map((o) => {
            return (
              <Thumbnail
                title={o.title}
                key={o.title}
                target={o.target}
                src={o.src}
                width={o.width}
                height={o.height}
                imageClassName={o.className}
              />
            );
          })}
        </div>
      </div>
      <div>
        <span>Frames</span>
      </div>
      <div id="asset-panel" className={props.className}>
        <div className="grid grid-cols-3 gap-1 m-4 p-2">
          {frames.map((f) => {
            return (
              <Thumbnail
                title={f.title}
                key={f.title}
                target={f.target}
                src={f.src}
                width={f.width}
                height={f.height}
                imageClassName={f.className}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
