{
  lib,
  concatTextFile,
  writeText,
  symlinkJoin,
  makeWrapper,

  awesome,
  awesome-iwm-config,
  awesome-iwm-rofi-config,
  kitty,

  rofi,
  terminal-binary ? "${kitty}/bin/kitty",
  enable-rofi-styles ? true,
}:
let
  quoted =
    v:
    let
      q = "\"";
    in
    "${q}${lib.escape [ q ] (lib.generators.mkValueStringDefault { } v)}${q}";
  terminalLuaString = ''
    terminal = terminal or ${quoted terminal-binary}
  '';
  rofi-config = awesome-iwm-rofi-config.override {
    inherit terminal-binary;
  };
  rofiCmd = [
    "${rofi}/bin/rofi"
  ]
  ++ (lib.optionals enable-rofi-styles [
    "-config"
    rofi-config
  ]);
  rofiLuaArrayElements = builtins.concatStringsSep "," (builtins.map quoted rofiCmd);
  rofiLuaString = ''
    rofi = rofi or {${rofiLuaArrayElements}}
  '';
  luaModule = concatTextFile {
    name = "awesome-iwm.lua-module";
    destination = "/lib/lua/${awesome.lua.luaversion}/awesome-iwm.lua";
    files = [
      (writeText "awesome-iwm.settings" (
        lib.concatStringsSep "\n" [
          terminalLuaString
          rofiLuaString
        ]
      ))
      awesome-iwm-config
    ];
  };
in
(symlinkJoin {
  name = "awesome-iwm";
  paths = [ awesome ];

  nativeBuildInputs = [ makeWrapper ];

  postBuild = ''
    wrapProgram $out/bin/awesome --append-flags "-c ${writeText "rc.lua" ''
      require('awesome-iwm')
    ''}"
  '';
})
// {
  lua = awesome.lua;
}
// {
  with-embedded-config =
    (symlinkJoin {
      name = "awesome-iwm";
      paths = [ awesome ];

      nativeBuildInputs = [ makeWrapper ];

      postBuild = ''
        wrapProgram $out/bin/awesome \
        --append-flags "-c ${luaModule}/lib/lua/${awesome.lua.luaversion}/awesome-iwm.lua"
      '';
    })
    // {
      lua = awesome.lua;
    };
  inherit luaModule;
  luaModules = [ luaModule ];
}
