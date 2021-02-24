import { Key, Screen } from 'awful';
import { Widget as WiboxWidget } from 'wibox';

export default interface Widget {
  registerKeys(globals: Key<Screen>[]): Key<Screen>[];
  readonly wiboxWidget: WiboxWidget;
}
