import { version } from '../../package.json';

const art3 = ((s: any) => s.raw)`
      ██╗  ██████╗   ██╗  ███████╗   ██████╗
      ╚═╝  ██╔══██╗  ██║  ██╔════╝  ██╔════╝
      ██║  ██████╔╝  ██║  ███████╗  ██║     
      ██║  ██╔══██╗  ██║  ╚════██║  ██║     
      ██║  ██║  ██║  ██║  ███████║  ╚██████╗
      ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚══════╝   ╚═════╝
      repl interface
`[0];

export const replWelcome = // html
`\
  <span class="internal">\
    <span class="d-inline-block" style="white-space: pre;">${art3}</span>

    Welcome to the iRISC ${version} repl interface.

    Here you are able to execute single ARMv7 commands and immediately see the effect using a command-line interface.\
    Simply type a valid ARM instruction on the prompt below to begin.

    Enter ':help' to see some other cool things you can do.\
  </span>
  &nbsp;\
`

export const terminalHelpString = `
<span class="internal" style="white-space: pre;">\

<u>terminal help:</u>

<div class="border-left">\
  :reset (:r) \t reset the simulator
  :clear (:c) \t clear terminal output
  :help  (:h) \t display help text
</div>\

<div class="border-left">\
  ./src       \t run the program currently loaded in the editor
              \t     'ctrl + c' to force exit a running program
</div>\

<div class="border-left">\
  vi          \t switch to the editor using your favourite text editor
  vim         \t     'esc' to return to terminal from editor
  nano
  nvim
  emacs -nw
  ne
  micro
  tilde\
</div>\

</span>\
`;