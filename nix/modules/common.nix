# this is not a module. intended to be called directly.
{
  config,
  pkgs
}:
let
  cfg = config.windowManager.awesome-iwm;
in
pkgs.awesome-iwm.override {
  awesome = cfg.awesome-package;
  awesome-iwm-config = cfg.config-package;
  awesome-iwm-rofi-config = cfg.rofi-config-package;
  rofi = cfg.rofi-package;
  terminal-binary = cfg.terminal;
  enable-rofi-styles = cfg.rofi-styles.enable;
}
