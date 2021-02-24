import { color } from 'gears';
import { Shape } from '../graphics/index';
import { xresources } from 'beautiful';
import { panelHeight } from './base';

const dpi = xresources.apply_dpi;

const layoutIconsTheme = {
  bg: color('#2b2b2b'),
  border: {
    size: dpi(0.5),
    radius: dpi(0.55),
    color: color('#3e4144'),
  },
  padding: 0.175,
};

const layoutBox = (args: { x?: number; y?: number; width: number; height: number }) =>
  Shape.localContext(
    Shape.box({
      ...args,
      bg: layoutIconsTheme.bg,
      borderSize: layoutIconsTheme.border.size,
      borderColor: layoutIconsTheme.border.color,
      borderRadius: layoutIconsTheme.border.radius,
    }),
  );

const layoutIcon = <R>(draw: (w: number, h: number) => Shape<R>) =>
  Shape.toSurface({ width: panelHeight, height: panelHeight })(
    Shape.paddedPercent(layoutIconsTheme.padding)(
      Shape.size.flatMap(({ width, height }) => draw(width, height)),
    ),
  );

export const layoutIcons = {
  layout_floating: layoutIcon((w, h) =>
    layoutBox({
      x: w * 0.1,
      width: w * 0.9,
      height: h * 0.9,
    }).then(
      layoutBox({
        y: h / 2,
        width: w / 2,
        height: h / 2,
      }),
    ),
  ),
  layout_tile: layoutIcon((w, h) =>
    layoutBox({
      width: w / 2 - layoutIconsTheme.border.size * 2,
      height: h,
    })
      .then(
        layoutBox({
          x: w / 2,
          width: w / 2,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          x: w / 2,
          y: h / 3 + layoutIconsTheme.border.size,
          width: w / 2,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          x: w / 2,
          y: (h / 3) * 2 + layoutIconsTheme.border.size * 2,
          width: w / 2,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      ),
  ),
  layout_tileleft: layoutIcon((w, h) =>
    layoutBox({
      x: w / 2 + layoutIconsTheme.border.size * 2,
      width: w / 2 - layoutIconsTheme.border.size * 2,
      height: h,
    })
      .then(
        layoutBox({
          width: w / 2,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          y: h / 3 + layoutIconsTheme.border.size,
          width: w / 2,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          y: (h / 3) * 2 + layoutIconsTheme.border.size * 2,
          width: w / 2,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      ),
  ),
  layout_tilebottom: layoutIcon((w, h) =>
    layoutBox({
      height: h / 2 - layoutIconsTheme.border.size * 2,
      width: w,
    })
      .then(
        layoutBox({
          y: h / 2,
          height: h / 2,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          y: h / 2,
          x: w / 3 + layoutIconsTheme.border.size,
          height: h / 2,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          y: h / 2,
          x: (w / 3) * 2 + layoutIconsTheme.border.size * 2,
          height: h / 2,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      ),
  ),
  layout_tiletop: layoutIcon((w, h) =>
    layoutBox({
      y: h / 2 + layoutIconsTheme.border.size * 2,
      height: h / 2 - layoutIconsTheme.border.size * 2,
      width: w,
    })
      .then(
        layoutBox({
          height: h / 2,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          x: w / 3 + layoutIconsTheme.border.size,
          height: h / 2,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          x: (w / 3) * 2 + layoutIconsTheme.border.size * 2,
          height: h / 2,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      ),
  ),
  layout_fairh: layoutIcon((w, h) =>
    layoutBox({
      x: w / 2 + layoutIconsTheme.border.size,
      width: w / 2 - layoutIconsTheme.border.size,
      height: h / 3 - layoutIconsTheme.border.size * 2,
    })
      .then(
        layoutBox({
          x: w / 2 + layoutIconsTheme.border.size,
          y: h / 3 + layoutIconsTheme.border.size,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          x: w / 2 + layoutIconsTheme.border.size,
          y: (h / 3) * 2 + layoutIconsTheme.border.size * 2,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          y: h / 3 + layoutIconsTheme.border.size,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          y: (h / 3) * 2 + layoutIconsTheme.border.size * 2,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size * 2,
        }),
      ),
  ),
  layout_fairv: layoutIcon((w, h) =>
    layoutBox({
      y: h / 2 + layoutIconsTheme.border.size,
      height: h / 2 - layoutIconsTheme.border.size,
      width: w / 3 - layoutIconsTheme.border.size * 2,
    })
      .then(
        layoutBox({
          y: h / 2 + layoutIconsTheme.border.size,
          x: w / 3 + layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          y: h / 2 + layoutIconsTheme.border.size,
          x: (w / 3) * 2 + layoutIconsTheme.border.size * 2,
          height: h / 2 - layoutIconsTheme.border.size,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          height: h / 2 - layoutIconsTheme.border.size,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          x: w / 3 + layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      )
      .then(
        layoutBox({
          x: (w / 3) * 2 + layoutIconsTheme.border.size * 2,
          height: h / 2 - layoutIconsTheme.border.size,
          width: w / 3 - layoutIconsTheme.border.size * 2,
        }),
      ),
  ),
  layout_max: layoutIcon((w, h) =>
    layoutBox({
      width: w,
      height: h,
    }),
  ),
  layout_fullscreen: layoutIcon((w, h) =>
    layoutBox({
      width: w,
      height: h,
    }),
  ),
  layout_magnifier: layoutIcon((w, h) =>
    layoutBox({
      width: w / 2 - layoutIconsTheme.border.size,
      height: h / 2 - layoutIconsTheme.border.size,
    })
      .then(
        layoutBox({
          x: w / 2 + layoutIconsTheme.border.size,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 2 + layoutIconsTheme.border.size,
          y: w / 2 + layoutIconsTheme.border.size,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: w / 2 + layoutIconsTheme.border.size,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 4,
          y: w / 4,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
        }),
      ),
  ),
  layout_spiral: layoutIcon((w, h) =>
    layoutBox({
      width: w / 2 - layoutIconsTheme.border.size,
      height: h,
    })
      .then(
        layoutBox({
          x: w / 2,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 2 + w / 4,
          y: h / 2,
          width: w / 4 - layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 2,
          y: h / 2,
          width: w / 4 - layoutIconsTheme.border.size,
          height: h / 4 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 2,
          y: h / 2 + h / 4,
          width: w / 4 - layoutIconsTheme.border.size,
          height: h / 4 - layoutIconsTheme.border.size,
        }),
      ),
  ),
  layout_dwindle: layoutIcon((w, h) =>
    layoutBox({
      width: w / 2 - layoutIconsTheme.border.size,
      height: h,
    })
      .then(
        layoutBox({
          x: w / 2,
          width: w / 2 - layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 2,
          y: h / 2,
          width: w / 4 - layoutIconsTheme.border.size,
          height: h / 2 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 2 + w / 4,
          y: h / 2,
          width: w / 4 - layoutIconsTheme.border.size,
          height: h / 4 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 2 + w / 4,
          y: h / 2 + h / 4,
          width: w / 4 - layoutIconsTheme.border.size,
          height: h / 4 - layoutIconsTheme.border.size,
        }),
      ),
  ),
  layout_cornerne: layoutIcon((w, h) =>
    layoutBox({
      x: w / 3,
      width: (w / 3) * 2 - layoutIconsTheme.border.size,
      height: (h / 3) * 2 - layoutIconsTheme.border.size,
    })
      .then(
        layoutBox({
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: h / 3,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: (h / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: (h / 3) * 2,
          x: w / 3,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: (h / 3) * 2,
          x: (w / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      ),
  ),
  layout_cornernw: layoutIcon((w, h) =>
    layoutBox({
      width: (w / 3) * 2 - layoutIconsTheme.border.size,
      height: (h / 3) * 2 - layoutIconsTheme.border.size,
    })
      .then(
        layoutBox({
          x: (w / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: (w / 3) * 2,
          y: h / 3,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: (w / 3) * 2,
          y: (h / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: (w / 3) * 2,
          x: h / 3,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: (w / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      ),
  ),
  layout_cornerse: layoutIcon((w, h) =>
    layoutBox({
      x: w / 3,
      y: h / 3,
      width: (w / 3) * 2 - layoutIconsTheme.border.size,
      height: (h / 3) * 2 - layoutIconsTheme.border.size,
    })
      .then(
        layoutBox({
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: h / 3,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          y: (h / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 3,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: (w / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      ),
  ),
  layout_cornersw: layoutIcon((w, h) =>
    layoutBox({
      y: h / 3,
      width: (w / 3) * 2 - layoutIconsTheme.border.size,
      height: (h / 3) * 2 - layoutIconsTheme.border.size,
    })
      .then(
        layoutBox({
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: w / 3,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: (w / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: (w / 3) * 2,
          y: h / 3,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      )
      .then(
        layoutBox({
          x: (w / 3) * 2,
          y: (h / 3) * 2,
          width: w / 3 - layoutIconsTheme.border.size,
          height: h / 3 - layoutIconsTheme.border.size,
        }),
      ),
  ),
};
