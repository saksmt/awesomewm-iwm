import { Theme, xresources } from 'beautiful';
import { color } from 'gears';
import { FontWeight } from 'oocairo';
import textWallpaper from './textWallpaper';
import { layoutIcons } from './layoutIcons';
import { tasklistTheme } from './tasklist';
import { taglistTheme } from './taglist';
import { panelHeight, systrayIconSize, systrayMargin } from './base';
import { Shape } from '../graphics/index';
import * as naughty from 'naughty';

const dpi = xresources.apply_dpi;

naughty.config.padding = dpi(5);
naughty.config.spacing = dpi(5);
naughty.config.presets.normal.margin = dpi(10);

const theme: Partial<Theme> = {
  ...layoutIcons,
  ...tasklistTheme,
  ...taglistTheme,

  tooltip_bg: color('#4e505200'),
  tooltip_border_width: dpi(0),
  tooltip_opacity: 0,
  tooltip_font: 'Ubuntu 12',
  tooltip_shape: Shape.toAwesome(
    Shape.size.flatMap(({ width, height }) =>
      Shape.box({
        x: dpi(1),
        y: dpi(1),
        width: width - dpi(2),
        height: height - dpi(2),
        bg: color('#4e5052'),
        borderSize: dpi(1),
        borderColor: color('#54585a'),
        borderRadius: 10,
      }),
    ),
  ),
  separator_color: '#515151',
  separator_shape: Shape.toAwesome(
    Shape.size.flatMap(({ width, height }) =>
      width > height
        ? Shape.box({
            x: width * 0.15,
            width: width * 0.7,
            height: height,
          })
        : Shape.box({
            y: height * 0.15,
            width: width,
            height: height * 0.7,
          }),
    ),
  ),
  separator_thickness: dpi(1),
  notification_bg: '#4e5052',
  notification_fg: '#bfbfbf',
  notification_border_color: '#54585a',
  notification_border_width: dpi(1),
  notification_shape: Shape.toAwesome(
    Shape.size.flatMap(({ width, height }) => Shape.roundedRectangle(width, height, dpi(0.75))),
  ),
  notification_width: dpi(250),

  font: 'Ubuntu 10',

  wibar_height: panelHeight,

  wallpaper: (s) => {
    return textWallpaper(s.geometry.width, s.geometry.height, {
      bg: color('#2b2b2b'),
      fg: color('#313232'),
      outline: {
        size: dpi(0.5),
        color: color('#36383a'),
      },
      text: '// unreachable',
      font: {
        family: 'Hasklig',
        weight: FontWeight.Bold,
      },
    });
  },

  bg_normal: '#3c3f41',
  bg_focus: '#2f65ca',
  bg_urgent: '#9d493e99',
  bg_minimize: '#3c3f41',
  bg_systray: '#3c3f41',

  fg_normal: '#bbbbbb',
  fg_focus: '#bbbbbb',
  fg_urgent: '#bbbbbb',
  fg_minimize: '#bbbbbb',

  border_width: dpi(2),
  border_normal: '#646464',
  border_focus: '#24519B',
  fullscreen_hide_border: true,
  maximized_hide_border: true,

  wibar_border_color: '#323232',
  wibar_bottom_border_size: dpi(1),
  menu_height: panelHeight,
  systray_icon_margin: systrayMargin,
  systray_icon_size: systrayIconSize,
  systray_icon_spacing: dpi(4),
};

export default theme;
