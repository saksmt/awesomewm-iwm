{
  lib,
  stdenvNoCC,
  awesome-iwm-src,
  kitty,
  terminal-binary ? "${kitty}/bin/kitty",
}:
let term = lib.escape ["\"" "\\"] (builtins.toString terminal-binary); in
stdenvNoCC.mkDerivation {
  name = "awesome-iwm-rofi-config";
  src = awesome-iwm-src;
  installPhase = ''
    runHook preInstall

    cat rofi/config.rasi \
      | sed 's/@theme "theme"/@theme "default"/' \
      > $out
    substituteInPlace $out \
      --replace-fail 'terminal: "kitty"' 'terminal: "${term}"'
    echo >> $out
    echo '/************************/' >> $out
    echo '/******** theme *********/' >> $out
    echo '/************************/' >> $out
    echo >> $out
    cat rofi/theme.rasi >> $out

    runHook postInstall
  '';
}
