import { PositiveReal } from 'awesomewm.4.3.ts.d';
import { FontSlant, FontWeight, Pattern, Surface } from 'oocairo';
import { Shape } from '../graphics/index';

export default function textWallpaper(
  width: PositiveReal,
  height: PositiveReal,
  {
    bg,
    fg,
    outline,
    font,
    text,
  }: {
    bg: Pattern;
    fg: Pattern;
    outline: { size: PositiveReal; color: Pattern };
    text: string;
    font: { family: string; slant?: FontSlant; weight?: FontWeight };
  },
): Surface {
  return Shape.toSurface({ width, height })(
    Shape.box({
      width: width,
      height: height,
      bg,
    }).then(
      Shape.context.map((cr) => {
        cr.set_source(fg);
        cr.select_font_face(
          font.family,
          font.slant ?? FontSlant.Normal,
          font.weight ?? FontWeight.Bold,
        );
        cr.set_font_size(height / (text.length < 12 ? 4 : 5));
        cr.move_to(0, 0);
        const textBox = cr.text_extents(text);
        cr.translate(
          width / 2 - textBox.width / 2 - textBox.x_bearing,
          height / 2 - textBox.height / 2 - textBox.y_bearing,
        );
        cr.move_to(0, 0);
        cr.text_path(text);
        cr.fill_preserve();
        cr.set_source(outline.color);
        cr.set_line_width(outline.size);
        cr.stroke();
      }),
    ),
  );
}
