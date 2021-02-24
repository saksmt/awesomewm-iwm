import { color } from 'gears';
import { Pattern } from 'oocairo';
import { Shape } from '../graphics/index';
import { xresources } from 'beautiful';

const dpi = xresources.apply_dpi;

const tasklist = {
  bgColor: {
    focus: color('#4e5254'),
    urgent: color('#9d493e99'),
    normal: color('#373a3c'),
  },
  underline: {
    size: dpi(2.5),
    normal: color('#747a80'),
    focus: color('#4a88c7'),
    urgent: color('#c74a4a'),
    minimized: color('#3c3f41'),
  },
};

function tasklistShape(bgColor: Pattern, underlineColor: Pattern): Shape<void> {
  return Shape.size.flatMap(({ width, height }) => {
    return Shape.box({
      width,
      height,
      bg: bgColor,
    }).then(
      Shape.box({
        y: height - tasklist.underline.size,
        bg: underlineColor,
        width,
        height: tasklist.underline.size,
      }),
    );
  });
}

export const tasklistTheme = {
  taglist_spacing: dpi(0),
  tasklist_shape: Shape.toAwesome(
    tasklistShape(tasklist.bgColor.normal, tasklist.underline.normal),
  ),
  tasklist_shape_focus: Shape.toAwesome(
    tasklistShape(tasklist.bgColor.focus, tasklist.underline.focus),
  ),
  tasklist_shape_urgent: Shape.toAwesome(
    tasklistShape(tasklist.bgColor.urgent, tasklist.underline.urgent),
  ),
  tasklist_shape_minimized: Shape.toAwesome(
    tasklistShape(tasklist.bgColor.normal, tasklist.underline.minimized),
  ),
  tasklist_font: 'Ubuntu Light 10',
};
