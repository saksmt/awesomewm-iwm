{
  stdenvNoCC,
  lib,
  flake,
}:
stdenvNoCC.mkDerivation {
  name = "awesome-iwm-src";
  src = lib.cleanSource flake;
  buildPhase = ''
    cp -R . $out
  '';
}
