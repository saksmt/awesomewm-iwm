import Widget from './Widget';
import * as wibox from 'wibox';
import { button, key, Key, Screen, Mouse, Keyboard } from 'awful';
import { Logger } from '../util';
import { WidgetMouseEvents } from 'wibox';
import { xresources } from 'beautiful';

const dpi = xresources.apply_dpi;

const logger = new Logger('kbd.layout');

export default class LayoutSwitcher implements Widget {
  private readonly textBox = wibox.widget.textbox();
  readonly wiboxWidget = wibox.container.margin(this.textBox, dpi(5), dpi(5));
  private current: Index;

  constructor(private readonly layouts: string[]) {
    const [currentLayoutHandle, err] = io.popen(
      'setxkbmap -query | grep layout: | tr -d " " | cut -d: -f2',
    );
    if (currentLayoutHandle === null || currentLayoutHandle === undefined) {
      throw new Error(`Failed to get current layout: ${err}`);
    }

    this.wiboxWidget.buttons([
      ...button<WidgetMouseEvents.TargetedWidget>([], Mouse.Button.Left, () => this.next()),
      ...button<WidgetMouseEvents.TargetedWidget>([], Mouse.Button.Right, () => this.previous()),
    ]);
    let reportedCurrent = 'UNKNOWN';
    for (const [layout] of currentLayoutHandle.lines()) {
      reportedCurrent = layout.split(',')[0].trim();
      break;
    }
    currentLayoutHandle.close();
    this.current = Math.min(layouts.indexOf(reportedCurrent), 0);
    this.textBox.text = reportedCurrent;
  }

  private next(): void {
    const next = this.layouts.length <= this.current + 1 ? 0 : this.current + 1;
    const nextLayout = this.layouts[next];
    os.execute(`setxkbmap ${nextLayout},us`);
    this.current = next;
    this.textBox.text = nextLayout;
  }

  private previous(): void {
    logger.info(`current: ${this.current}, layouts`, [this.layouts]);
    const prev = this.current - 1 >= 0 ? this.current - 1 : this.layouts.length - 1;
    logger.info('prev:', [prev, this.layouts.length]);
    const prevLayout = this.layouts[prev];
    os.execute(`setxkbmap ${prevLayout}`);
    this.current = prev;
    this.textBox.text = prevLayout;
  }

  registerKeys(globals: Key<Screen>[]): Key<Screen>[] {
    return [
      ...globals,
      ...key<Screen>([Keyboard.ModifierKey.Mod1], 'Shift_L', () => this.next()),
      ...key<Screen>([Keyboard.ModifierKey.Mod1], 'Shift_R', () => this.next()),
      ...key<Screen>([Keyboard.ModifierKey.Shift], 'Alt_L', () => this.next()),
      ...key<Screen>([Keyboard.ModifierKey.Shift], 'Alt_R', () => this.next()),
    ];
  }
}
