{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };
  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    let
      global = rec {
        overlays = {
          awesome-iwm = (final: prev: import ./nix/packages self prev);
        };
        nixosModules = {
          awesome-iwm = {
            imports = [
              ({ nixpkgs.overlays = [ overlays.awesome-iwm ]; })
              (import ./nix/modules/options.nix)
              (import ./nix/modules/nixos.nix)
            ];
          };
        };
        homeModules = homeManagerModules;
        homeManagerModules = {
          awesome-iwm = {
            imports = [
              ({ nixpkgs.overlays = [ overlays.awesome-iwm ]; })
              (import ./nix/modules/options.nix)
              (import ./nix/modules/home-manager.nix)
            ];
          };
        };
      };
      systemDependent = utils.lib.eachDefaultSystem (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          mkShell = pkgs.mkShell.override { stdenv = pkgs.stdenvNoCC; };
        in
        {
          packages = import ./nix/packages self pkgs;
          devShells = {
            default = mkShell {
              buildInputs = with pkgs; [
                nodejs
                nixfmt-rfc-style
              ];
              shellHook = ''
                mkdir -p .pkgs &>/dev/null

                rm -f .pkgs/nodejs &>/dev/null
                ln -s "${pkgs.nodejs}" .pkgs/nodejs

                cp -f flake.lock .pkgs/ &>/dev/null
              '';
            };
            testing = mkShell {
              buildInputs = with pkgs; [
                nodejs
                nixfmt-rfc-style

                xorg.xorgserver
              ];
            };
          };
        }
      );
    in
    systemDependent // global;
}
