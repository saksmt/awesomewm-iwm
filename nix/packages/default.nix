self:
{ pkgs, ... }:
rec {
  awesome-iwm-config = pkgs.callPackage ./awesome-iwm-config.nix {
    inherit awesome-iwm-src;
  };
  awesome-iwm-src = pkgs.callPackage ./awesome-iwm-src.nix { flake = self; };
  awesome-iwm-rofi-config = pkgs.callPackage ./awesome-iwm-rofi-config.nix {
    inherit awesome-iwm-src;
  };
  awesome-iwm-rofi-fonts = pkgs.callPackage ./awesome-iwm-rofi-fonts.nix { inherit awesome-iwm-src; };
  awesome-iwm = pkgs.callPackage ./awesome-iwm.nix {
    inherit awesome-iwm-rofi-config awesome-iwm-config;
  };
}
