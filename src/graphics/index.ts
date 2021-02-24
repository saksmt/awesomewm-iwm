import { PositiveReal, RealNumber, Fraction } from 'awesomewm.4.3.ts.d';
import { Reader } from '../data/index';
import { color, shape, surface } from 'gears';
import { Surface, CairoContext, Pattern } from 'oocairo';

class AwesomeCairo {
  constructor(
    readonly context: CairoContext,
    readonly width: PositiveReal,
    readonly height: PositiveReal,
  ) {}

  withSize(width: PositiveReal, height: PositiveReal): AwesomeCairo {
    return new AwesomeCairo(this.context, width, height);
  }
}

export type Shape<R> = Reader<AwesomeCairo, R>;
export const Shape = {
  context: Reader.asks((it: AwesomeCairo) => it.context),
  size: Reader.asks((it) => it) as Shape<{ width: PositiveReal; height: PositiveReal }>,

  padded<R>(
    this: void,
    padding:
      | Partial<{
          left: PositiveReal;
          right: PositiveReal;
          top: PositiveReal;
          bottom: PositiveReal;
        }>
      | PositiveReal,
  ): (shape: Shape<R>) => Shape<R> {
    const { top, left, bottom, right } =
      typeof padding == 'number'
        ? { top: padding, right: padding, left: padding, bottom: padding }
        : padding;
    const noPadding = (it: number | undefined) => it == null || it <= 0;
    if (noPadding(bottom) && noPadding(top) && noPadding(left) && noPadding(right)) {
      return (s) => s;
    } else {
      return (s) =>
        Shape.translate(left ?? 0, top ?? 0).then(
          Reader.local(s)((it) =>
            it.withSize(
              it.width - (left ?? 0) - (right ?? 0),
              it.height - (top ?? 0) - (bottom ?? 0),
            ),
          ),
        );
    }
  },

  paddedPercent<R>(
    this: void,
    padding:
      | Partial<{
          left: Fraction;
          right: Fraction;
          top: Fraction;
          bottom: Fraction;
        }>
      | Fraction,
  ): (shape: Shape<R>) => Shape<R> {
    return (s) =>
      Shape.size.flatMap(({ width, height }) =>
        typeof padding == 'number'
          ? Shape.padded<R>({
              left: padding * width,
              right: padding * width,
              top: padding * height,
              bottom: padding * height,
            })(s)
          : Shape.padded<R>({
              left: width * (padding.left ?? 0),
              right: width * (padding.right ?? 0),
              top: height * (padding.top ?? 0),
              bottom: height * (padding.bottom ?? 0),
            })(s),
      );
  },

  toAwesome<R>(
    this: void,
    shape: Shape<R>,
  ): (cr: CairoContext, width: PositiveReal, height: PositiveReal) => void {
    return (cr, width, height) => shape.run(new AwesomeCairo(cr, width, height));
  },

  toSurface<R>(
    this: void,
    { width, height }: { width: PositiveReal; height: PositiveReal },
  ): (shape: Shape<R>) => Surface {
    return (s) => surface.load_from_shape(width, height, Shape.toAwesome(s));
  },

  rectangle(this: void, width: PositiveReal, height: PositiveReal): Shape<void> {
    return Shape.context.map((it) => shape.rectangle(it, width, height));
  },

  roundedRectangle(
    this: void,
    width: PositiveReal,
    height: PositiveReal,
    radius: PositiveReal,
    corners: Partial<{
      topLeft: boolean;
      topRight: boolean;
      bottomLeft: boolean;
      bottomRight: boolean;
    }> = {},
  ): Shape<void> {
    return Shape.context.map((it) =>
      shape.partially_rounded_rect(
        it,
        width,
        height,
        corners.topLeft ?? true,
        corners.topRight ?? true,
        corners.bottomLeft ?? true,
        corners.bottomRight ?? true,
        radius,
      ),
    );
  },

  translate(this: void, x: RealNumber, y: RealNumber): Shape<void> {
    return Shape.context.map((it) => it.translate(x, y));
  },

  withSource(this: void, source: Pattern): <R>(f: Shape<R>) => Shape<R> {
    return (f) =>
      Shape.context.flatMap((ctx) => {
        const original = ctx.get_source();
        ctx.set_source(source);
        return f.map((it) => {
          ctx.set_source(original);
          return it;
        });
      });
  },

  localContext<R>(this: void, shape: Shape<R>): Shape<R> {
    return Shape.context.flatMap((cr) => {
      cr.save();
      return shape.map((result) => {
        cr.restore();
        return result;
      });
    });
  },

  box(
    this: void,
    {
      x,
      y,
      width,
      height,
      bg,
      borderSize,
      borderColor,
      borderRadius,
      corners,
    }: {
      x?: RealNumber;
      y?: RealNumber;
      width: PositiveReal;
      height: PositiveReal;
      bg?: Pattern;
      borderSize?: PositiveReal;
      borderColor?: Pattern;
      borderRadius?: PositiveReal;
      corners?: Partial<{
        topLeft: boolean;
        topRight: boolean;
        bottomLeft: boolean;
        bottomRight: boolean;
      }>;
    },
  ): Shape<void> {
    const startingPoint = Shape.translate(x ?? 0, y ?? 0);

    if (borderSize == null || borderSize == 0) {
      const paint = startingPoint.then(Shape.rectangle(width, height));
      if (bg != null) {
        return Shape.withSource(bg)(paint.then(Shape.context.map((it) => it.fill())));
      } else {
        return paint;
      }
    } else {
      const paint =
        borderRadius == null
          ? Shape.rectangle
          : (w: number, h: number) => Shape.roundedRectangle(w, h, borderRadius, corners);
      return Shape.withSource(borderColor ?? color('#000000'))(
        startingPoint
          .then(Shape.translate(-borderSize, -borderSize))
          .then(paint(width + borderSize * 2, height + borderSize * 2))
          .then(Shape.context.map((it) => it.fill()))
          .then(Shape.translate(borderSize, borderSize)),
      ).then(
        bg == null
          ? paint(width, height)
          : Shape.withSource(bg)(paint(width, height).then(Shape.context.map((it) => it.fill()))),
      );
    }
  },
};
