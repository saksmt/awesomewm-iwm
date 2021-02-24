import { color } from 'gears';
import { xresources } from 'beautiful';
import { Shape } from '../graphics/index';
import { Antialias } from 'oocairo';
import { TaglistVariables } from 'awesomewm.4.3.ts.d/awesomewm/beautiful/variables/taglist';

const dpi = xresources.apply_dpi;

const taglist = {
  squareSize: 2.25,
  border: {
    size: dpi(0.5),
    color: color('#444444'),
  },
  bg: {
    urgent: color('#9d493e99'),
    focus: color('#2f65ca'),
    occupied: color('#183d6d'),
    // occupied: color('#0d293e'),
    empty: color('#2b2b2b'),
  },
};

export const taglistTheme: Partial<TaglistVariables> = {
  taglist_bg_urgent: taglist.bg.urgent,
  taglist_bg_focus: taglist.bg.focus,
  taglist_bg_occupied: taglist.bg.occupied,
  taglist_bg_empty: taglist.bg.empty,
  taglist_shape: Shape.toAwesome(
    Shape.size.flatMap(({ width, height }) => {
      const size = width / taglist.squareSize;
      return Shape.context
        .map((it) => it.set_antialias(Antialias.None))
        .then(
          Shape.box({
            x: size / 2,
            y: height / 2 - size / 2,
            width: size,
            height: size,
            borderSize: taglist.border.size,
            borderColor: taglist.border.color,
            borderRadius: 1,
          }),
        );
    }),
  ),
  taglist_spacing: dpi(0),
};
