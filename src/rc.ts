import * as naughty from 'naughty';
import * as beautiful from 'beautiful';
import * as gears from 'gears';
import {filesystem as fs, table} from 'gears';
import * as awful from 'awful';
import {Client, Screen, spawn, Tag, tag} from 'awful';
import * as menubar from 'menubar';
import * as wibox from 'wibox';
import {layout, Layout, Widget} from 'wibox';
import {option} from './data/index';
import {AlignCross, AlignX, Direction, Index, ModifierKey, MouseButton} from 'awesomewm.4.3.ts.d';
import theme from './theme/index';
import 'awful.remote';
import {SeparatorOrientation} from 'awesomewm.4.3.ts.d/awesomewm/wibox/widgets/SeparatorWidget';
import LayoutSwitcher from './widgets/keyboard-layout';
import {forall, isSubset} from './util/index';
import {Shape} from './graphics/index';

const dpi = beautiful.xresources.apply_dpi;

function widgetData<
  T extends Widget,
  D extends Partial<Omit<T, 'children'>> & { children?: R[] },
  R
>(data: D): { [k in string | Index]: unknown } & D {
  if (data.children) {
    const children = data.children;
    data.children = undefined;
    return gears.table.join(children, data);
  } else {
    return data;
  }
}

function setupWidget<T extends Widget, R>(
  widget: T,
): (data: Partial<Omit<T, 'children'>> & { layout?: Layout; children?: R[] }) => T {
  return (data) => {
    widget.setup(widgetData(data));
    return widget;
  };
}

function mkWidget<
  T extends Widget,
  D extends Partial<Omit<T, 'children'>> &
    ({ children?: R[]; widget: T } | { children?: R[]; layout: wibox.Layout }),
  R
>(data: D): { [k in string | Index]: unknown } & D {
  return widgetData(data);
}

if (awesome.startup_errors) {
  naughty.notify({
    preset: naughty.config.presets.critical,
    title: 'Oops, there were errors during startup!',
    text: awesome.startup_errors,
  });
}

let in_error = false;
awesome.connect_signal('debug::error', (err) => {
  if (!in_error) {
    in_error = true;
    naughty.notify({
      preset: naughty.config.presets.critical,
      title: 'Oops, an error happened!',
      text: err.toString(),
    });
  }
});

beautiful.init(theme);

const layoutSwitcher = new LayoutSwitcher(['us', 'ru']);
const terminal = 'roxterm';

const modkey = ModifierKey.Mod4;

awful.layout.layouts = [
  awful.layout.suit.floating,
  awful.layout.suit.tile,
  awful.layout.suit.fair,
  awful.layout.suit.max,
  awful.layout.suit.max.fullscreen,
];

menubar.utils.terminal = terminal;

const myTextClock = wibox.container.margin(wibox.widget.textclock('%H:%M'), dpi(5), dpi(5));

const dateTooltip = awful.tooltip({
  objects: [myTextClock],
  timer_function: () => os.date('%A, %d %B %Y'),
});
dateTooltip.margins_leftright = dpi(10);
dateTooltip.margins_topbottom = dpi(5);

const taglistButtons = table.join<awful.Button<Tag>>(
  awful.button([], MouseButton.Left, (it) => it.view_only()),
  awful.button([modkey], MouseButton.Left, (it) =>
    option(client.focus).forEach((t) => t.move_to_tag(it)),
  ),
  awful.button([], MouseButton.Right, tag.viewtoggle),
  awful.button([modkey], MouseButton.Right, (it) =>
    option(client.focus).forEach((t) => t.toggle_tag(it)),
  ),
  awful.button([], MouseButton.ScrollDown, (it) => tag.viewnext(it.screen)),
  awful.button([], MouseButton.ScrollUp, (it) => tag.viewprev(it.screen)),
);

const tasklistButtons = table.join<awful.Button<Client>>(
  awful.button([], MouseButton.Left, (it) => {
    if (it == client.focus) {
      it.minimized = true;
    } else {
      it.emit_signal('request::activate', 'taglist', { raise: true });
    }
  }),
  awful.button([], MouseButton.Right, (it) => {
    if (it.minimized) {
      it.emit_signal('request::activate', 'taglist', { raise: true });
    } else {
      it.minimized = true;
    }
  })
);

const setWallpaper = (s: Screen) => {
  if (beautiful.wallpaper) {
    gears.wallpaper.maximized(
      typeof beautiful.wallpaper == 'function' ? beautiful.wallpaper(s) : beautiful.wallpaper,
      s,
    );
  }
};

const sep = () =>
  wibox.widget.separator({
    orientation: SeparatorOrientation.Vertical,
    forced_width: dpi(1),
  });

screen.connect_signal('property::geometry', setWallpaper);

awful.screen.connect_for_each_screen((s) => {
  setWallpaper(s);
  tag(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((_) => ''),
    s,
    awful.layout.layouts[0],
  );

  const myPromptBox = awful.widget.prompt();
  s.myPromptBox = myPromptBox;
  const myLayoutBox = awful.widget.layoutbox(s);
  s.myLayoutBox = myLayoutBox;
  myLayoutBox.buttons(
    table.join(
      awful.button([], MouseButton.Left, () => awful.layout.inc(1)),
      awful.button([], MouseButton.Right, () => awful.layout.inc(-1))
    ),
  );

  const myTagList = awful.widget.taglist({
    screen: s,
    buttons: taglistButtons,
    filter: awful.widget.taglist.filter.all,
    widget_template: mkWidget({
      id: 'background_role',
      children: [
        mkWidget({
          width: dpi(17),
          height: dpi(beautiful.wibar_height),
          strategy: wibox.containers.ConstraintStrategy.Exact,
          widget: wibox.container.constraint,
        }),
      ],
      widget: wibox.container.background,
    }),
  });
  s.myTagList = myTagList;
  const myTaskList = awful.widget.tasklist({
    screen: s,
    buttons: tasklistButtons,
    filter: awful.widget.tasklist.filter.currenttags,
    widget_template: mkWidget({
      id: 'background_role',
      children: [
        mkWidget({
          children: [
            mkWidget({
              children: [
                mkWidget({
                  left: dpi(7),
                  right: dpi(7),
                  top: dpi(7),
                  bottom: dpi(7),
                  children: [
                    mkWidget({
                      id: 'icon_role',
                      widget: wibox.widget.imagebox,
                    }),
                  ],
                  widget: wibox.container.margin,
                }),
                mkWidget({
                  id: 'text_margin_role',
                  children: [
                    mkWidget({
                      id: 'text_role',
                      widget: wibox.widget.textbox,
                    }),
                  ],
                  right: dpi(3),
                  widget: wibox.container.margin,
                }),
              ],
              layout: wibox.layout.fixed.horizontal,
              fill_space: true,
            }),
          ],
          widget: wibox.container.place,
          halign: AlignX.Center,
        }),
      ],
      widget: wibox.container.background,
    }),
  });
  myTaskList.buttons(table.join(
    awful.button([ModifierKey.Control], MouseButton.Left, () => {
      s.selected_tags.flatMap(it => it.clients()).forEach(it => {
        it.minimized = true
      })
    }),
    awful.button([ModifierKey.Control, ModifierKey.Shift], MouseButton.Left, () => {
      s.selected_tags.flatMap(it => it.clients()).forEach(it => {
        it.minimized = false
      })
    })
  ))
  s.myTaskList = myTaskList;

  const myWibox = awful.wibar({
    position: AlignCross.Top,
    screen: s,
    height: beautiful.wibar_height + beautiful.wibar_bottom_border_size,
  });
  s.myWibox = myWibox;

  const systrayWidget = wibox.widget.systray();
  const nonEmptyScreenCallbacks: ((show: boolean) => void)[] = [];
  const onNonEmptyScreen: (w: Widget) => Widget = w => {
    nonEmptyScreenCallbacks.push(show => { w.visible = show })
    return w;
  }
  client.connect_signal('manage', () => updateTasklistBordersVisibility());
  client.connect_signal('unmanage', () => updateTasklistBordersVisibility());
  client.connect_signal('tagged', () => updateTasklistBordersVisibility());
  client.connect_signal('untagged', () => updateTasklistBordersVisibility());
  tag.attached_connect_signal(s, 'property::selected', () => updateTasklistBordersVisibility());
  tag.attached_connect_signal(s, 'property::activated', () => updateTasklistBordersVisibility());
  const updateTasklistBordersVisibility = () => {
    if (s.selected_tags.flatMap((it) => it.clients()).length == 0) {
      nonEmptyScreenCallbacks.forEach(it => it(false))
    } else {
      nonEmptyScreenCallbacks.forEach(it => it(true))
    }
  };
  updateTasklistBordersVisibility();
  systrayWidget.set_base_size(theme.systray_icon_size);
  setupWidget(myWibox)({
    children: [
      mkWidget({
        children: [
          mkWidget({
            children: [
              mkWidget({
                children: [
                  wibox.container.margin(
                    layout.fixed.horizontal(myTagList, myPromptBox),
                    dpi(5),
                    dpi(5),
                  ),
                  wibox.layout.align.horizontal(
                    onNonEmptyScreen(wibox.widget.separator({
                      forced_width: dpi(1),
                      forced_height: beautiful.wibar_height + beautiful.wibar_bottom_border_size,
                      shape: Shape.toAwesome(Shape.size.flatMap(it => Shape.box({
                        x: 0,
                        y: 0,
                        ...it
                      }))),
                      orientation: SeparatorOrientation.Vertical
                    })),
                    myTaskList,
                    onNonEmptyScreen(wibox.widget.separator({
                      forced_width: dpi(1),
                      forced_height: beautiful.wibar_height + beautiful.wibar_bottom_border_size,
                      shape: Shape.toAwesome(Shape.size.flatMap(it => Shape.box({
                        x: 0,
                        y: 0,
                        ...it
                      }))),
                      orientation: SeparatorOrientation.Vertical
                    }))
                  ),
                  mkWidget({
                    children: [
                      awful.widget.only_on_screen(
                        wibox.container.margin(
                          systrayWidget,
                          dpi(5),
                          0,
                          theme.systray_icon_margin,
                          theme.systray_icon_margin,
                        ),
                      ),
                      layoutSwitcher.wiboxWidget,
                      sep(),
                      myTextClock,
                      sep(),
                      myLayoutBox,
                    ],
                    layout: layout.fixed.horizontal,
                  }),
                ],
                layout: layout.align.horizontal,
              }),
            ],
            bg: beautiful.bg_normal,
            widget: wibox.container.background,
          }),
        ],
        widget: wibox.container.margin,
        bottom: beautiful.wibar_bottom_border_size,
      }),
    ],
    bg: beautiful.wibar_border_color,
    height: beautiful.wibar_height + beautiful.wibar_bottom_border_size,
    widget: wibox.container.background,
  });
  updateTasklistBordersVisibility();
});

const globalKeys = table.join<awful.Key<Screen>>(
  awful.key<Screen>([modkey], 'Prior', tag.viewprev, {
    description: 'view previous',
    group: 'tag',
  }),
  awful.key<Screen>([modkey], 'Next', tag.viewnext, {
    description: 'view next',
    group: 'tag',
  }),
  awful.key<Screen>([modkey], 'Escape', tag.history.restore, {
    description: 'go back',
    group: 'tag',
  }),
  awful.key([modkey], 'Left', () => awful.client.focus.bydirection(Direction.Left), {
    description: 'focus left',
    group: 'client',
  }),
  awful.key([modkey], 'Right', () => awful.client.focus.bydirection(Direction.Right), {
    description: 'focus right',
    group: 'client',
  }),
  awful.key([modkey], 'Up', () => awful.client.focus.bydirection(Direction.Up), {
    description: 'focus up',
    group: 'client',
  }),
  awful.key([modkey], 'Down', () => awful.client.focus.bydirection(Direction.Down), {
    description: 'focus down',
    group: 'client',
  }),
  awful.key(
    [modkey, ModifierKey.Mod1],
    'Left',
    () => awful.client.swap.bydirection(Direction.Left),
    {
      description: 'swap with left client',
      group: 'client',
    },
  ),
  awful.key(
    [modkey, ModifierKey.Mod1],
    'Right',
    () => awful.client.swap.bydirection(Direction.Right),
    {
      description: 'swap with right client',
      group: 'client',
    },
  ),
  awful.key([modkey, ModifierKey.Mod1], 'Up', () => awful.client.swap.bydirection(Direction.Up), {
    description: 'swap with up client',
    group: 'client',
  }),
  awful.key(
    [modkey, ModifierKey.Mod1],
    'Down',
    () => awful.client.swap.bydirection(Direction.Down),
    {
      description: 'swap with down client',
      group: 'client',
    },
  ),
  awful.key(
    [modkey, ModifierKey.Control],
    'Left',
    () => awful.screen.focus_bydirection(Direction.Left, awful.screen.focused() as Screen),
    {
      description: 'focus left screen',
      group: 'screen',
    },
  ),
  awful.key(
    [modkey, ModifierKey.Control],
    'Right',
    () => awful.screen.focus_bydirection(Direction.Right, awful.screen.focused() as Screen),
    {
      description: 'focus right screen',
      group: 'screen',
    },
  ),
  awful.key(
    [modkey, ModifierKey.Control],
    'Up',
    () => awful.screen.focus_bydirection(Direction.Up, awful.screen.focused() as Screen),
    {
      description: 'focus up screen',
      group: 'screen',
    },
  ),
  awful.key(
    [modkey, ModifierKey.Control],
    'Down',
    () => awful.screen.focus_bydirection(Direction.Down, awful.screen.focused() as Screen),
    {
      description: 'focus down screen',
      group: 'screen',
    },
  ),
  awful.key(
    [modkey],
    'Tab',
    () => {
      awful.client.focus.history.previous();
      option(client.focus).forEach((it) => it.raise());
    },
    { description: 'go back', group: 'client' },
  ),
  awful.key([modkey], 'Return', () => awful.spawn(terminal), {
    description: 'open a terminal',
    group: 'launcher',
  }),
  awful.key([modkey, ModifierKey.Control], 'r', awesome.restart, {
    description: 'reload awesome',
    group: 'awesome',
  }),
  awful.key([modkey, ModifierKey.Shift], 'q', () => awesome.quit(), {
    description: 'quit',
    group: 'awesome',
  }),
  awful.key([modkey], '=', () => tag.incmwfact(0.05), {
    description: 'increase master width factor',
    group: 'layout',
  }),
  awful.key([modkey], '-', () => tag.incmwfact(-0.05), {
    description: 'decrease master width factor',
    group: 'layout',
  }),
  awful.key([modkey, ModifierKey.Shift], 'h', () => tag.incnmaster(1, null, true), {
    description: 'increase the number of master clients',
    group: 'layout',
  }),
  awful.key([modkey, ModifierKey.Shift], 'l', () => tag.incnmaster(-1, null, true), {
    description: 'decrease the number of master clients',
    group: 'layout',
  }),
  awful.key([modkey, ModifierKey.Control], 'h', () => tag.incncol(1, null, true), {
    description: 'increase the number of columns',
    group: 'layout',
  }),
  awful.key([modkey, ModifierKey.Control], 'l', () => tag.incncol(-1, null, true), {
    description: 'decrease the number of columns',
    group: 'layout',
  }),
  awful.key([modkey], 'space', () => awful.layout.inc(1), {
    description: 'select next',
    group: 'layout',
  }),
  awful.key([modkey, ModifierKey.Shift], 'space', () => awful.layout.inc(-1), {
    description: 'select previous',
    group: 'layout',
  }),
  awful.key(
    [modkey, ModifierKey.Control],
    'n',
    () =>
      option(awful.client.restore()).forEach((it) =>
        it.emit_signal('request::activate', 'key.unminimize', { raise: true }),
      ),
    { description: 'restore minimized', group: 'client' },
  ),
  awful.key([modkey], 'r', () => spawn('rofi -show drun'), {
    description: 'run prompt',
    group: 'launcher',
  }),
  awful.key(
    [modkey],
    'x',
    () =>
      option(awful.screen.focused()).forEach((it) =>
        awful.prompt.run({
          prompt: 'Run Lua code: ',
          textbox: it.myPromptBox.widget,
          exe_callback: awful.util.eval,
          history_path: `${fs.get_cache_dir()}/history_eval`,
        }),
      ),
    { description: 'lua execute prompt', group: 'awesome' },
  ),
  awful.key([modkey], 'p', () => spawn('rofi -show combi'), {
    description: 'show the menubar',
    group: 'launcher',
  }),
  awful.key([modkey], 'w', () => spawn('rofi -show window')),
  awful.key(
    [modkey],
    'u',
    () =>
      option(mouse.current_client).forEach((it) =>
        it.emit_signal('request::activate', 'undermouse', { raise: false }),
      ),
    {
      description: 'focus client under mouse',
      group: 'client',
    },
  ),
);

const tagKeys = range(1, 9)
  .map((tagName) =>
    table.join<awful.Key<Screen>>(
      awful.key(
        [modkey],
        `#${tagName + 9}`,
        () =>
          option(awful.screen.focused())
            .andThen((it) => it.tags[tagName - 1])
            .forEach((it) => it.view_only()),
        { description: `toggle tag #${tagName}`, group: 'tag' },
      ),
      awful.key(
        [modkey, ModifierKey.Control],
        `#${tagName + 9}`,
        () =>
          option(awful.screen.focused())
            .andThen((it) => it.tags[tagName - 1])
            .forEach(tag.viewtoggle),
        { description: `toggle tag #${tagName}`, group: 'tag' },
      ),
      awful.key(
        [modkey, ModifierKey.Shift],
        `#${tagName + 9}`,
        () =>
          option(awful.screen.focused())
            .andThen((it) => it.tags[tagName - 1])
            .zipMap(option(client.focus))((t, c) => c.move_to_tag(t)),
        { description: `move focused client to tag #${tagName}`, group: 'tag' },
      ),
      awful.key(
        [modkey, ModifierKey.Shift, ModifierKey.Control],
        `#${tagName + 9}`,
        () =>
          option(awful.screen.focused())
            .andThen((it) => it.tags[tagName - 1])
            .zipMap(option(client.focus))((t, c) => c.toggle_tag(t)),
        { description: `toggle focused client on tag #${tagName}`, group: 'tag' },
      ),
    ),
  )
  .reduce((a, b) => table.join(a, b));

root.keys([layoutSwitcher].reduce((r, w) => w.registerKeys(r), table.join(globalKeys, tagKeys)));

const clientButtons = table.join<awful.Button<Client>>(
  awful.button([], MouseButton.Left, (it) =>
    it.emit_signal('request::activate', 'mouse_click', { raise: true }),
  ),
  awful.button([modkey], MouseButton.Left, (it) => {
    it.emit_signal('request::activate', 'mouse_click', { raise: true });
    awful.mouse.client.move(it);
  }),
  awful.button([modkey], MouseButton.Right, (it) => {
    it.emit_signal('request::activate', 'mouse_click', { raise: true });
    awful.mouse.client.resize(it);
  }),
);

const clientKeys = table.join<awful.Key<Client>>(
  awful.key(
    [modkey],
    'f',
    (c) => {
      c.fullscreen = !c.fullscreen;
      c.raise();
    },
    { description: 'toggle fullscreen', group: 'client' },
  ),
  awful.key([modkey], 'e', (c) => {
    const screen = c.screen as Screen
    const [fullscreenW, fullscreenH] = [screen.geometry.width, screen.geometry.height];
    c.geometry({
      ...c.geometry(),
      width: fullscreenW,
      height: fullscreenH
    })
  }, { description: 'expand to fullscreen', group: 'client' }),
  awful.key([modkey, ModifierKey.Shift], 'c', (it) => it.kill(), {
    description: 'close',
    group: 'client',
  }),
  awful.key(
    [modkey, ModifierKey.Control],
    'space',
    (it) => {
      it.floating = !it.floating;
    },
    {
      description: 'toggle floating',
      group: 'client',
    },
  ),
  awful.key([modkey, ModifierKey.Control], 'Return', (it) => it.swap(awful.client.getmaster()), {
    description: 'move to master',
    group: 'client',
  }),
  awful.key([modkey], 'o', (it) => it.move_to_screen(), {
    description: 'move to screen',
    group: 'client',
  }),
  awful.key(
    [modkey],
    't',
    (it) => {
      it.ontop = !it.ontop;
    },
    {
      description: 'toggle keep on top',
      group: 'client',
    },
  ),
  awful.key(
    [modkey],
    'n',
    (it) => {
      it.minimized = true;
    },
    {
      description: 'minimize',
      group: 'client',
    },
  ),
  awful.key(
    [modkey],
    'm',
    (it) => {
      it.maximized = !it.maximized;
      it.raise();
    },
    { description: '(un)maximize', group: 'client' },
  ),
  awful.key(
    [modkey],
    'm',
    (it) => {
      it.maximized_vertical = !it.maximized_vertical;
      it.raise();
    },
    { description: '(un)maximize vertically', group: 'client' },
  ),
  awful.key(
    [modkey, ModifierKey.Shift],
    'm',
    (it) => {
      it.maximized_horizontal = !it.maximized_horizontal;
      it.raise();
    },
    { description: '(un)maximize horizontally', group: 'client' },
  ),
);

awful.rules.rules = [
  {
    rule: {},
    properties: {
      border_width: beautiful.border_width,
      border_color: beautiful.border_normal,
      focus: awful.client.focus.filter,
      raise: true,
      keys: clientKeys,
      buttons: clientButtons,
      screen: awful.screen.preferred,
      placement: awful.placement.no_overlap + awful.placement.no_offscreen,
    },
  },
  {
    rule: {
      floating: true,
    },
    properties: {
      border_width: 0,
    },
  },
  {
    rule_any: {
      instance: ['DTA', 'copyq', 'pinentry'],
      class: [
        'Arandr',
        'Blueman-manager',
        'Gpick',
        'Kruler',
        'MessageWin',
        'Sxiv',
        'Tor Browser',
        'Wpa_gui',
        'veromix',
        'xtightvncviewer',
      ],
      name: ['Event Tester'],
      role: ['AlarmWindow', 'ConfigManager', 'pop-up'],
    },
    properties: { floating: true },
  },
  {
    // hack to return focus to main window in idea after popup
    rule: {
      class: 'jetbrains-.*',
      instance: 'sun-awt-X11-XWindowPeer',
      name: 'win.*',
    },
    properties: {
      floating: true,
      focus: true,
      focusable: false,
      ontop: true,
      placement: awful.placement.restore,
    },
  },
];

const canBeVisibleTogether = (a: Client, b: Client) => {
  return isSubset(a.tags(), b.tags()) || isSubset(b.tags(), a.tags());
};
const neighborsAndSelfFor = (it: Client) => {
  const clients = (it.screen as Screen).clients;
  return clients.filter((t) => canBeVisibleTogether(it, t));
};

const updateBorders = (it: Client) => {
  const neighbors = neighborsAndSelfFor(it);
  if (neighbors.length > 1) {
    const allDontNeedBorders = forall(
      neighbors,
      (it) =>
        it.floating ||
        it.fullscreen ||
        it.maximized ||
        [
          awful.layout.suit.floating,
          awful.layout.suit.max,
          awful.layout.suit.max.fullscreen,
        ].includes(it.first_tag.layout),
    );

    if (allDontNeedBorders) {
      neighbors.forEach((t) => {
        t.border_width = 0;
      });
    } else {
      neighbors.forEach((t) => {
        t.border_width = option(theme.border_width).getOrElse(0);
      });
    }
  } else {
    it.border_width = 0;
  }
};

client.connect_signal('manage', (it) => {
  if (awesome.startup && !it.size_hints.user_position && !it.size_hints.program_position) {
    awful.placement.no_offscreen(it);
  }
  updateBorders(it);
});

client.connect_signal('unmanage', (it) => updateBorders(it));
client.connect_signal('unmanage', () =>
  option(mouse.current_client).forEach((it) =>
    it.emit_signal('request::activate', 'previousclientclosed', { raise: false }),
  ),
);
client.connect_signal('tagged', (it) => updateBorders(it));
client.connect_signal('untagged', (it) => updateBorders(it));
client.connect_signal('property::floating', (it) => updateBorders(it));
client.connect_signal('property::maximized', (it) => updateBorders(it));
client.connect_signal('property::fullscreen', (it) => updateBorders(it));

awful.screen.connect_for_each_screen((s) =>
  tag.attached_connect_signal(s, 'property::layout', (it) =>
    option(it.clients()[0]).forEach(updateBorders),
  ),
);
awful.screen.connect_for_each_screen((s) =>
  tag.attached_connect_signal(s, 'property::selected', (t) => {
    const lastFocusedOnTag = option(
      awful.client.focus.history.get(s, 0, (c) =>
        c.tags().includes(t) ? awful.client.focus.filter(c) : null,
      ),
    );
    lastFocusedOnTag
      .orElse(option(mouse.current_client))
      .forEach((it) => it.emit_signal('request::activate', 'tagswitch', { raise: false }));
  }),
);

client.connect_signal('mouse::enter', (it) => {
  if (awful.client.focus.filter(it)) {
    client.focus = it;
  }
});

client.connect_signal('focus', (it) => {
  it.border_color = beautiful.border_focus;
});
client.connect_signal('unfocus', (it) => {
  it.border_color = beautiful.border_normal;
});

function range(start: number, endInclusive: number, step = 1): number[] {
  const result = [];
  for (let i = start; i <= endInclusive; i += step) {
    result.push(i);
  }
  return result;
}
