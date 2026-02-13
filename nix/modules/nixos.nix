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
    services.xserver.windowManager.awesome = lib.mkIf cfg.enable {
      enable = lib.mkDefault true;
      package = lib.mkMerge [
        (lib.mkIf cfg.install-only cfg.awesome-package)
        (lib.mkIf (!cfg.install-only) awesome-iwm)
      ];
      luaModules = awesome-iwm.luaModules;
    };
    environment.systemPackages = lib.mkMerge [
      (lib.mkIf cfg.enable awesome-iwm.luaModules)
      (lib.mkIf (cfg.enable && !cfg.install-only) (
        awesome-iwm.luaModules
        ++ [
          awesome-iwm
        ]
      ))
    ];
    fonts.packages = lib.mkIf (cfg.enable && !cfg.install-only && cfg.rofi-styles.install-fonts) [
      pkgs.awesome-iwm-rofi-fonts
    ];
  };
}
