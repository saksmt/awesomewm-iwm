{
  awesome-iwm-src,

  importNpmLock,

  nodejs,
  stdenvNoCC,
}:
stdenvNoCC.mkDerivation {
  name = "awesome-iwm-config";

  nativeBuildInputs = [
    nodejs
    importNpmLock.hooks.npmConfigHook
  ];
  npmDeps = importNpmLock {
    npmRoot = awesome-iwm-src;
  };

  src = awesome-iwm-src;
  buildPhase = ''
    npm run build
    cp rc.lua $out
  '';
}
