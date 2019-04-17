# TODO
- Keybinds
  - Allow keybinds to stop/always "retrigger"
  - Add "when" or "if" check to keybind
    - Possible format `{combo/key: "ctrl+shift+r", do: function () {}, when: window.isfocused}`
- Write renderer
  - Register something to be drawn by calling an abstract method (i.e. text()), save that to a list of things to do in the current frame, and then render it.