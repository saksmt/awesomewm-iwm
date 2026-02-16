{
  config,
  pkgs,
  lib,
  ...
}:
let
  cfg = config.windowManager.awesome-iwm;
  awesome-iwm = import ./common.nix { inherit config pkgs; };
in
{
  config = {
    # for some reason it was written into one of CONFIG_DIRS instead
    # of CONFIG_HOME when used xdg.configFile. This method on the other hand
    # is foolproof
    home.file.".config/awesome/rc.lua" = (
      lib.mkIf (cfg.enable && !cfg.install-only) {
        text = ''
          require('awesome-iwm')
        '';
      }
    );

    fonts.fontconfig.enable = lib.mkIf (
      cfg.enable && !cfg.install-only && cfg.rofi-styles.install-fonts
    ) true;
    home.packages = lib.mkMerge [
      (lib.mkIf (cfg.enable && !cfg.install-only && cfg.rofi-styles.install-fonts) [
        pkgs.awesome-iwm-rofi-fonts
      ])
      (lib.mkIf cfg.enable awesome-iwm.luaModules)
    ];
    xsession.windowManager.awesome = lib.mkIf cfg.enable {
      enable = lib.mkDefault true;
      package = lib.mkDefault cfg.awesome-package;
      luaModules = awesome-iwm.luaModules;
    };
  };
}
