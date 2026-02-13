{ stdenvNoCC, awesome-iwm-src }:
stdenvNoCC.mkDerivation {
  name = "awesome-iwm-rofi-fonts";
  src = awesome-iwm-src;
  installPhase = ''
    runHook preInstall

    install -m444 -Dt $out/share/fonts/true-type/wm-ide-icons rofi/icons/font/wm-ide-icons.ttf

    runHook postInstall
  '';
}
