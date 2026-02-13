{
  lib,
  config,
  pkgs,
  ...
}:
let
  cfg = config.windowManager.awesome-iwm;
in
{
  options.windowManager.awesome-iwm = {
    enable = lib.mkEnableOption "awesome wm along with styles in awesome-iwm";

    config-package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.awesome-iwm-config;
      description = "awesome-iwm config package";
    };

    rofi-config-package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.awesome-iwm-rofi-config;
      description = "awesome-iwm config package";
    };

    awesome-package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.awesome;
      description = "awesomeWM package";
    };

    rofi-package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.rofi;
      description = "rofi package";
    };

    terminal = lib.mkOption {
      type = lib.types.str;
      default = "${pkgs.kitty}/bin/kitty";
      description = "Path to terminal emulator binary";
      example = lib.literalExpression ''
        terminal = "''${pkgs.kitty}/bin/kitty";
      '';
    };

    install-only = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = ''
        This registers awesome-iwm as a lua library for awesomeWM, but does not enable it.
        You will need to manually `require` `awesome-iwm` in your awesomeWM config.

        Useful if you plan to additionally hack around your rc.lua.
      '';
    };

    rofi-styles = {
      enable = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = "Enable awesome-iwm styling to rofi used in awesome-iwm";
      };

      install-fonts = lib.mkOption {
        type = lib.types.bool;
        description = "Install fonts required for awesome-iwm styling of rofi";
        default = cfg.rofi-styles.enable;
      };
    };
  };

  config.assertions = [
    {
      assertion = cfg.rofi-styles.enable -> cfg.rofi-styles.install-fonts;
      message = "windowManager.awesome-iwm.rofi-styles.install-fonts is required when windowManager.awesome-iwm.rofi-styles.enable is true";
    }
  ];
}
