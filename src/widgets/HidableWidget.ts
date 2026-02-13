import Widget from './Widget';
import { Key, Screen, Mouse } from 'awful';
import * as wibox from 'wibox';
import { Widget as WiboxWidget } from 'wibox';
import * as awful from 'awful';

export default class HidableWidget implements Widget {
  readonly wiboxWidget: WiboxWidget;
  private hidden: boolean = false;

  constructor(widget: WiboxWidget, whenHidden: WiboxWidget) {
    const self = this;
    const c = wibox.container.margin(widget, 0, 0, 0, 0);
    this.wiboxWidget = c;

    c.buttons(
      awful.button([], Mouse.Button.Left, () => {
        self.hidden = !self.hidden;
        c.widget = self.hidden ? whenHidden : widget;
      }),
    );
  }

  registerKeys(globals: Key<Screen>[]): Key<Screen>[] {
    return [];
  }
}
