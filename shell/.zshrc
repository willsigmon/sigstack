#!/bin/zsh
# Clean zsh config — minimal, safe, and fast.

# Options
setopt NO_BEEP MULTIOS AUTO_PUSHD PUSHD_IGNORE_DUPS INTERACTIVE_COMMENTS

# PATH
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin"
[[ -d "/Library/Frameworks/Python.framework/Versions/3.13/bin" ]] && export PATH="/Library/Frameworks/Python.framework/Versions/3.13/bin:$PATH"
[[ -x "/opt/homebrew/bin/brew" ]] && eval "$(/opt/homebrew/bin/brew shellenv)"
[[ -d "/usr/local/bin" ]] && export PATH="/usr/local/bin:$PATH"

# Node Version Manager
export NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
[[ -s "$NVM_DIR/bash_completion" ]] && source "$NVM_DIR/bash_completion" 2>/dev/null

# History
HISTFILE="$HOME/.zsh_history"
HISTSIZE=50000
SAVEHIST=50000
setopt HIST_EXPIRE_DUPS_FIRST HIST_IGNORE_DUPS HIST_IGNORE_SPACE HIST_VERIFY SHARE_HISTORY

# Completion
autoload -Uz compinit && compinit -C
zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

# Prompt
command -v starship >/dev/null 2>&1 && eval "$(starship init zsh)" || PS1='%F{magenta}%n%f:%F{cyan}%~%f %# '

# Git
alias g='git' gs='git status' ga='git add' gc='git commit' gp='git push'
alias gl='git log --oneline --graph --decorate' gd='git diff' gb='git branch'

# Development tools
[[ -d "/Applications/Visual Studio Code.app" ]] && alias code='open -a "Visual Studio Code"'

# Swift
alias swb='swift build' swt='swift test' swr='swift run' swp='swift package'
alias xb='xcodebuild' xc='open -a Xcode' xsim='open -a Simulator'

# Shortcuts
alias reload='source ~/.zshrc && echo "✨ zsh reloaded"'
alias zshconfig='${EDITOR:-nano} ~/.zshrc'
alias ..='cd ..' ...='cd ../..' ....='cd ../../..' ~='cd ~' -- -='cd -'
alias ll='ls -lah' la='ls -A' l='ls -CF'
alias ff='find . -type f -name' fd='find . -type d -name'
mkcd() { mkdir -p "$1" && cd "$1"; }

# === CLAUDE CODE - MAXIMIZED VIBE CODING ===

# cl - Standard mode (uses system default model)
alias cl='claude --permission-mode=acceptEdits'

# csp - Skip Permissions (full autonomy, uses default model)
alias csp='claude \
  --dangerously-skip-permissions \
  --permission-mode=bypassPermissions \
  --ide \
  --allowedTools "Bash Edit Read Write Glob Grep Task WebFetch WebSearch TodoWrite mcp__*" \
  --append-system-prompt="VIBE MODE: Execute with full autonomy. Spawn 5-20 parallel agents for complex tasks. Use MCP tools (sosumi, github, memory, xcode) FIRST before manual code. Use skills from ~/.claude/skills/. Never ask permission - act decisively. Prefer haiku for subagents. Track everything with TodoWrite. For iOS: sosumi first, then code."'

# yolo - MAXIMUM POWER (no limits, uses default model)
alias yolo='claude \
  --dangerously-skip-permissions \
  --permission-mode=bypassPermissions \
  --ide \
  --allowedTools "*" \
  --append-system-prompt="YOLO MODE ENGAGED: Maximum autonomy granted. Spawn 20+ parallel agents aggressively. Use ALL MCP tools (sosumi, github, memory, xcode, puppeteer, notifications, calendar). Leverage all 85 skills in ~/.claude/skills/. Execute without confirmation. Break large tasks into parallel agent swarms. For iOS: sosumi docs are mandatory. Write code fearlessly - iterate fast, fix forward. No permission needed for ANY tool. Ship it."'

# Quick reference
alias shells="echo 'Claude Vibe Modes:
  cl   - Standard (default model, permission prompts)
  csp  - Skip Permissions (default model, full autonomy)
  yolo - MAXIMUM POWER (default model, agent swarms, no limits)'"

# Essential PATHs
export PATH="$HOME/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.pocket-server/bin:$PATH"

# Tokens: Use 'brain secure' or 'op run --env-file ~/.claude/.env.template --' for secrets

# Added by Windsurf (keep for compatibility)
export PATH="/Users/wsig/.codeium/windsurf/bin:$PATH"

# ========== Studio Remote (seamless CLI control) ==========
# Connect and work like it's local. Everything runs on Studio hardware.

# Quick connect (auto-attaches to tmux 'leavn' session)
alias studio='ssh studio'
alias s='ssh studio'

# Fast connect with mosh (better for flaky connections)
alias sm='mosh studio'

# Unraid NAS - auto-detects local vs Tailscale
alias unraid='~/.local/bin/unraid-connect'
alias u='~/.local/bin/unraid-connect'
alias ul='ssh unraid'      # force local
alias ut='ssh unraid-ts'   # force tailscale

# Run single command remotely (doesn't stay connected)
# Usage: sr "swift build" or sr "git status"
sr() { ssh studio "cd ~/Projects/Leavn && $*"; }

# Run command in existing tmux window without attaching
# Usage: stmux 1 "swift build"  (runs in window 1)
stmux() {
  local window="${1:-1}"
  shift
  ssh studio "tmux send-keys -t leavn:$window '$*' C-m"
}

# File sync shortcuts
studio_push() { rsync -avz --exclude=".git" --exclude="build" . studio:~/Projects/Leavn/; }
studio_pull() { rsync -avz --exclude=".git" --exclude="build" studio:~/Projects/Leavn/ .; }

# Quick status checks
studio_status() { ssh studio "echo '=== Tmux Sessions ===' && tmux ls 2>/dev/null || echo 'No sessions'; echo ''; echo '=== Tailscale ===' && tailscale status | head -n3"; }
alias studio_connect='studio-connect'
studio_health() { ssh studio "~/check-studio-health.sh"; }

# Start/restart leavn session remotely
studio_leavn() { ssh studio "~/start-leavn-session.sh"; }

# Kill and restart session (fresh start)
studio_reset() { ssh studio "tmux kill-session -t leavn 2>/dev/null; ~/start-leavn-session.sh"; }

# Quick project navigation (lands you in Leavn directory)
leavn() { ssh studio -t "cd ~/Projects/Leavn && exec \$SHELL"; }

# Watch Studio resources (runs top remotely)
studio_top() { ssh studio "top"; }

# Tail logs from Studio
studio_logs() { ssh studio "tail -f ~/Projects/Leavn/logs/*.log"; }

# Copy file to Studio
to_studio() { scp "$1" "studio:~/Projects/Leavn/$2"; }

# Grab file from Studio  
from_studio() { scp "studio:~/Projects/Leavn/$1" "${2:-.}"; }

# Studio IP (for quick reference)
studio_ip() { tailscale status | grep -E "wills-studio|100\." | head -1; }

# Edit remotely (opens file on Studio in local editor)
studio_edit() { ssh studio "cat ~/Projects/Leavn/$1"; }


# Display controls
alias set-resolution="/Users/wsig/.local/bin/set-display-resolution.sh"
alias switch-resolution="/Users/wsig/.local/bin/switch-resolution.sh"
alias display-status="/Users/wsig/.local/bin/display-status.sh"
alias optimize-display="/Users/wsig/.local/bin/optimize-display.sh"
alias color-mode="/Users/wsig/.local/bin/color-mode.sh"
alias color-menu="/Users/wsig/.local/bin/color-menubar-app.scpt"
alias colors="/Users/wsig/.local/bin/color-menubar-app.scpt"

# Fine-grained volume control aliases
alias vol-get="vol get"        # Show current volume (use: vol-get)
alias vu="vol up 1"            # Volume up 1%
alias vd="vol down 1"          # Volume down 1%
alias vm="vol mute"            # Mute
alias vu2="vol up 2"           # Volume up 2%
alias vd2="vol down 2"         # Volume down 2%
alias v+="vol up"              # Custom up (e.g. v+ 5)
alias v-="vol down"            # Custom down (e.g. v- 3)

# Fine-grained volume control for Klipsch The Fives speakers
[[ -f ~/.volume_control.sh ]] && source ~/.volume_control.sh

# MCP configuration
[[ -f ~/.mcprc ]] && source ~/.mcprc

# Xcode settings (SIMULATOR_ROOT removed - using default location)
# export SIMULATOR_ROOT="/Volumes/Ext-code/Developer/CoreSimulator"  # Disabled: external drive not mounted
export XCODE_DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer"

export PATH=$PATH:/Users/wsig/.spicetify

# Added by Antigravity
export PATH="/Users/wsig/.antigravity/antigravity/bin:$PATH"

# Gemini CLI - YOLO mode with Gemini 3 Pro
alias gemini="gemini --yolo -m gemini-3-pro-preview"
alias gemini-safe="command gemini"  # Original without YOLO


# === BRAIN CLI ===
alias b='brain'
alias bs='brain sync'
alias bc='brain check'
alias bd='brain docs'
alias bw='brain docs'
alias bi='brain idea'

# Claude shortcuts (kept for muscle memory)
alias cc="claude"
alias ccr="claude --resume"
alias ccc="claude --continue"
alias ccplan="claude --plan"
alias ccu="npx ccusage daily --breakdown"
alias ccm="npx ccusage monthly"
alias ccl="npx ccusage blocks --live"

# Claude config sync between machines
alias claude-sync='~/.local/bin/claude-sync'
alias cs='claude-sync status'
alias cspush='claude-sync push'
alias cspull='claude-sync pull'
alias csdiff='claude-sync diff'

# Ghostty terminal config sync
alias gtsync="~/.config/ghostty/sync-ghostty.sh"
alias gtpull="~/.config/ghostty/sync-ghostty.sh pull"
alias gtpush="~/.config/ghostty/sync-ghostty.sh push"
alias gtedit='${EDITOR:-nano} ~/.config/ghostty/config'
alias gtreload='ghostty +reload-config 2>/dev/null || killall -SIGUSR1 Ghostty 2>/dev/null || echo "Restart Ghostty to apply changes"'

# 1Password secure environment
alias secureenv='op run --env-file=$HOME/.claude/.env.template --'
alias devenv='source <(op inject -i $HOME/.claude/.env.template)'
opget() { op item get "$1" --fields "${2:-credential}"; }

# Show BRAIN reminder on terminal start
if [ -z "$BRAIN_SHOWN" ]; then
    export BRAIN_SHOWN=1
    echo "BRAIN: b (boot) | bs (sync) | bc (check) | bd (docs)"
fi

# bun completions
[ -s "/Users/wsig/.bun/_bun" ] && source "/Users/wsig/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Omi API Key
export OMI_API_KEY="omi_mcp_3d0d80f3e82fff85177af4753b3e0ad1"


# Claude dev environment
alias dev='ssh -p 2222 root@192.168.1.139'
alias remote='ssh -p 2222 root@100.119.19.61'
alias go='ssh -p 2222 root@192.168.1.139 -t "tmux attach || tmux new -s main"'


# ═══════════════════════════════════════════════════════════════════
# 🎨 iTerm2 Synesthesia Color System
# ═══════════════════════════════════════════════════════════════════
# Each project has its own color world - designed for grapheme-color synesthesia

# Core functions
iterm2_set_bg() { printf "\033]1337;SetColors=bg=%02x%02x%02x\007" $1 $2 $3; }
iterm2_set_tab() { printf "\033]0;%s\007" "$1"; }
iterm2_set_badge() { printf "\033]1337;SetBadgeFormat=%s\007" $(echo -n "$1" | base64); }
iterm2_set_profile() { printf "\033]1337;SetProfile=%s\007" "$1"; }

# Master project vibe function
iterm2_project_vibe() {
    local project_name=""
    local emoji=""

    case "$PWD" in
        */Leavn*|*/LeavnOfficial*|*/LeavnSite*|*/LeavnAndroid*)
            iterm2_set_bg 36 28 48      # Deep lavender
            project_name="Leavn"; emoji="💜" ;;
        */hubdash*)
            iterm2_set_bg 20 31 41      # Deep teal
            project_name="HubDash"; emoji="🌊" ;;
        */sigstack*)
            iterm2_set_bg 31 26 20      # Warm amber
            project_name="SigStack"; emoji="⚡" ;;
        */overnight*)
            iterm2_set_bg 20 15 31      # Deep violet
            project_name="Overnight"; emoji="🌙" ;;
        */willsigmon-media*|*/media*)
            iterm2_set_bg 36 20 26      # Rose burgundy
            project_name="Media"; emoji="🎬" ;;
        */Scripts*|*/scripts*)
            iterm2_set_bg 15 31 20      # Matrix green
            project_name="Scripts"; emoji="🧪" ;;
        */tip-wsig*)
            iterm2_set_bg 26 31 15      # Money lime
            project_name="Tip"; emoji="💰" ;;
        */Modcaster*)
            iterm2_set_bg 41 20 36      # Podcast magenta
            project_name="Modcaster"; emoji="🎙️" ;;
        */carterhelms*|*/TwoTwelve*)
            iterm2_set_bg 38 35 15      # Client gold
            project_name="Client"; emoji="🤝" ;;
        */iswcpssclosed*)
            iterm2_set_bg 20 31 46      # Carolina blue
            project_name="ISWCPSS"; emoji="🏫" ;;
        */catalyst*)
            iterm2_set_bg 18 28 41      # Navy blue
            project_name="Catalyst"; emoji="🚀" ;;
        */.claude*)
            iterm2_set_bg 31 23 15      # Claude terracotta
            project_name="Claude"; emoji="🤖" ;;
        */GitHub\ MBA*)
            iterm2_set_bg 25 25 30      # Subtle slate
            project_name="GitHub"; emoji="📦" ;;
        */Developer*)
            iterm2_set_bg 22 25 28      # Dev neutral
            project_name="Dev"; emoji="💻" ;;
        *)
            printf "\033]1337;SetColors=bg=default\007"
            project_name=""; emoji="🏠" ;;
    esac

    # Set tab title and badge
    if [[ -n "$project_name" ]]; then
        iterm2_set_tab "$emoji $project_name"
        iterm2_set_badge "$emoji"
    else
        iterm2_set_tab "🏠 Terminal"
        iterm2_set_badge ""
    fi
}

# Manual vibe command - switch colors anytime
vibe() {
    case "${1:-help}" in
        leavn)    iterm2_set_bg 36 28 48; iterm2_set_tab "💜 Leavn"; iterm2_set_badge "💜" ;;
        hubdash)  iterm2_set_bg 20 31 41; iterm2_set_tab "🌊 HubDash"; iterm2_set_badge "🌊" ;;
        sigstack) iterm2_set_bg 31 26 20; iterm2_set_tab "⚡ SigStack"; iterm2_set_badge "⚡" ;;
        overnight) iterm2_set_bg 20 15 31; iterm2_set_tab "🌙 Overnight"; iterm2_set_badge "🌙" ;;
        media)    iterm2_set_bg 36 20 26; iterm2_set_tab "🎬 Media"; iterm2_set_badge "🎬" ;;
        scripts)  iterm2_set_bg 15 31 20; iterm2_set_tab "🧪 Scripts"; iterm2_set_badge "🧪" ;;
        tip)      iterm2_set_bg 26 31 15; iterm2_set_tab "💰 Tip"; iterm2_set_badge "💰" ;;
        modcaster) iterm2_set_bg 41 20 36; iterm2_set_tab "🎙️ Modcaster"; iterm2_set_badge "🎙️" ;;
        claude)   iterm2_set_bg 31 23 15; iterm2_set_tab "🤖 Claude"; iterm2_set_badge "🤖" ;;
        reset|home|default)
            printf "\033]1337;SetColors=bg=default\007"
            iterm2_set_tab "🏠 Terminal"; iterm2_set_badge "" ;;
        help|*)
            echo "🎨 Vibes: leavn hubdash sigstack overnight media scripts tip modcaster claude reset"
            echo "Current: $PWD" ;;
    esac
}

# List all available vibes with color preview
vibes_list() {
    echo "╔═══════════════════════════════════════╗"
    echo "║     🎨 Project Color Vibes            ║"
    echo "╠═══════════════════════════════════════╣"
    echo "║ 💜 leavn     │ Deep lavender          ║"
    echo "║ 🌊 hubdash   │ Deep teal              ║"
    echo "║ ⚡ sigstack  │ Warm amber             ║"
    echo "║ 🌙 overnight │ Deep violet            ║"
    echo "║ 🎬 media     │ Rose burgundy          ║"
    echo "║ 🧪 scripts   │ Matrix green           ║"
    echo "║ 💰 tip       │ Money lime             ║"
    echo "║ 🎙️ modcaster │ Podcast magenta        ║"
    echo "║ 🤖 claude    │ Claude terracotta      ║"
    echo "║ 🏠 reset     │ Default                ║"
    echo "╚═══════════════════════════════════════╝"
    echo ""
    echo "Usage: vibe <name>  (e.g., vibe leavn)"
}

autoload -Uz add-zsh-hook
add-zsh-hook chpwd iterm2_project_vibe
iterm2_project_vibe

# Vibe Coding Helpers ✨
alias v='code .'
alias c='claude'
# cc and cr defined above in Claude shortcuts section
# yolo defined above in CLAUDE CODE section
alias vibes='echo "✨ $(date +%H:%M) | $(git branch --show-current 2>/dev/null || echo "no repo") | lets go"'

# Quick project jump
proj() {
    local base="/Volumes/Ext-code/GitHub Repos"
    if [[ -z "$1" ]]; then
        ls -1 "$base"
    else
        cd "$base/$1" 2>/dev/null || cd "$base"/*"$1"* 2>/dev/null || echo "Not found: $1"
    fi
}

# Completion for proj
_proj() {
    local base="/Volumes/Ext-code/GitHub Repos"
    _files -W "$base" -/
}
compdef _proj proj

# ═══════════════════════════════════════════════════════════════════
# 🎨 TYPOGRAPHY & DESIGN TOOLKIT
# ═══════════════════════════════════════════════════════════════════
# For the vibe coder who loves beautiful terminals

# ─────────────────────────────────────────────────────────────────
# Claude Theme - Dark & Light Mode Toggle
# ─────────────────────────────────────────────────────────────────
CLAUDE_MODE="dark"  # default

claude_dark() {
    CLAUDE_MODE="dark"
    # Claude dark: warm terracotta brown background, cream text
    printf "\033]1337;SetColors=bg=29211b\007"  # #29211b
    printf "\033]1337;SetColors=fg=eee8df\007"  # #eee8df
    printf "\033]1337;SetColors=bold=fff9f0\007"
    printf "\033]1337;SetColors=curbg=e08151\007"  # terracotta cursor
    printf "\033]1337;SetColors=selbg=483a30\007"
    iterm2_set_tab "🌙 Claude Dark"
    export BAT_THEME="gruvbox-dark"
    export FZF_DEFAULT_OPTS="$FZF_BASE_OPTS --color=bg+:#483a30,bg:#29211b,fg:#eee8df,fg+:#fff9f0,hl:#e08151,hl+:#f0a070,pointer:#e08151,marker:#8cb369,spinner:#e08151,header:#8cb369,border:#483a30,prompt:#e08151"
}

claude_light() {
    CLAUDE_MODE="light"
    # Claude light: warm cream background, dark brown text
    printf "\033]1337;SetColors=bg=fcf9f4\007"  # #fcf9f4
    printf "\033]1337;SetColors=fg=2d231b\007"  # #2d231b
    printf "\033]1337;SetColors=bold=1b140e\007"
    printf "\033]1337;SetColors=curbg=d46939\007"  # terracotta cursor
    printf "\033]1337;SetColors=selbg=eae0d2\007"
    iterm2_set_tab "☀️ Claude Light"
    export BAT_THEME="gruvbox-light"
    export FZF_DEFAULT_OPTS="$FZF_BASE_OPTS --color=bg+:#eae0d2,bg:#fcf9f4,fg:#2d231b,fg+:#1b140e,hl:#d46939,hl+:#c45a2a,pointer:#d46939,marker:#4a7c50,spinner:#d46939,header:#4a7c50,border:#d4c9b8,prompt:#d46939"
}

# Quick toggle
light() { claude_light; echo "☀️  Light mode"; }
dark() { claude_dark; echo "🌙 Dark mode"; }
toggle() { [[ "$CLAUDE_MODE" == "dark" ]] && light || dark; }

# ─────────────────────────────────────────────────────────────────
# Beautiful CLI Replacements
# ─────────────────────────────────────────────────────────────────

# eza - Modern ls with icons and git status
if command -v eza &>/dev/null; then
    alias ls='eza --icons --group-directories-first'
    alias ll='eza -la --icons --group-directories-first --git'
    alias la='eza -a --icons --group-directories-first'
    alias lt='eza --tree --level=2 --icons'
    alias ltt='eza --tree --level=3 --icons'
    alias lttt='eza --tree --level=4 --icons'
    alias l='eza -l --icons --no-permissions --no-user --git'
    alias lg='eza -la --icons --git --git-ignore'  # respect gitignore
fi

# bat - cat with syntax highlighting and line numbers
if command -v bat &>/dev/null; then
    alias cat='bat --paging=never'
    alias catp='bat'  # with pager
    alias catl='bat --style=numbers'  # just line numbers
    export BAT_THEME="gruvbox-dark"
    export MANPAGER="sh -c 'col -bx | bat -l man -p'"  # colorful man pages
fi

# delta - Beautiful git diffs
if command -v delta &>/dev/null; then
    export GIT_PAGER="delta"
fi

# ─────────────────────────────────────────────────────────────────
# FZF - Fuzzy Finder with Claude Colors
# ─────────────────────────────────────────────────────────────────
if command -v fzf &>/dev/null; then
    # Base options (colors added by dark/light mode)
    export FZF_BASE_OPTS="
        --height=60%
        --layout=reverse
        --border=rounded
        --margin=1
        --padding=1
        --info=inline
        --prompt='❯ '
        --pointer='▶'
        --marker='✓'
        --header-first
    "

    # Preview options
    export FZF_CTRL_T_OPTS="--preview 'bat --color=always --style=numbers --line-range=:500 {} 2>/dev/null || eza --tree --level=1 --icons {}'"
    export FZF_ALT_C_OPTS="--preview 'eza --tree --level=2 --icons --color=always {}'"

    # Key bindings
    source <(fzf --zsh) 2>/dev/null

    # Fuzzy project jump
    fp() {
        local dirs=("$HOME/Developer" "$HOME/GitHub MBA" "$HOME/.claude")
        local selected=$(find "${dirs[@]}" -maxdepth 2 -type d 2>/dev/null | fzf --header="📂 Jump to Project")
        [[ -n "$selected" ]] && cd "$selected"
    }

    # Fuzzy file edit
    fe() {
        local file=$(fzf --header="📝 Edit File" --preview 'bat --color=always --style=numbers {}')
        [[ -n "$file" ]] && ${EDITOR:-code} "$file"
    }

    # Fuzzy git branch
    fb() {
        local branch=$(git branch -a | fzf --header=" Switch Branch" | tr -d ' *')
        [[ -n "$branch" ]] && git checkout "${branch#remotes/origin/}"
    }

    # Fuzzy git log
    flog() {
        git log --oneline --graph --color=always | fzf --ansi --no-sort --header=" Git Log" --preview 'git show --color=always {1}'
    }
fi

# ─────────────────────────────────────────────────────────────────
# Zoxide - Smarter cd
# ─────────────────────────────────────────────────────────────────
if command -v zoxide &>/dev/null; then
    eval "$(zoxide init zsh)"
    alias cd='z'       # replace cd with zoxide
    alias cdi='zi'     # interactive mode
fi

# ─────────────────────────────────────────────────────────────────
# Typography & ASCII Art
# ─────────────────────────────────────────────────────────────────

# Figlet banners
if command -v figlet &>/dev/null; then
    banner() { figlet -f slant "$@"; }
    banner_small() { figlet -f small "$@"; }
    banner_big() { figlet -f banner "$@"; }
fi

# Lolcat rainbow text
if command -v lolcat &>/dev/null; then
    alias rainbow='lolcat'
    alias rb='lolcat'
    # Rainbow banner
    rbanner() { figlet -f slant "$@" | lolcat; }
fi

# Box drawing helper
box() {
    local text="$*"
    local len=${#text}
    local border=$(printf '═%.0s' $(seq 1 $((len + 2))))
    echo "╔${border}╗"
    echo "║ ${text} ║"
    echo "╚${border}╝"
}

# Fancy section headers
header() {
    local text="$*"
    local len=${#text}
    local padding=$(( (40 - len) / 2 ))
    local pad_str=$(printf ' %.0s' $(seq 1 $padding))
    echo ""
    echo "┌────────────────────────────────────────┐"
    echo "│${pad_str}${text}${pad_str}│"
    echo "└────────────────────────────────────────┘"
    echo ""
}

# ─────────────────────────────────────────────────────────────────
# Gum - Beautiful Interactive Prompts
# ─────────────────────────────────────────────────────────────────
if command -v gum &>/dev/null; then
    # Quick confirm
    confirm() { gum confirm "$@"; }

    # Styled input
    ask() { gum input --placeholder "$@"; }

    # Choose from options
    choose() { gum choose "$@"; }

    # Write longer text
    write() { gum write --placeholder "$@"; }

    # Spin while running command
    spin() { gum spin --spinner dot --title "$1" -- "${@:2}"; }

    # Styled echo
    say() { gum style --foreground "#e08151" --bold "$@"; }
fi

# ─────────────────────────────────────────────────────────────────
# System Info
# ─────────────────────────────────────────────────────────────────
if command -v fastfetch &>/dev/null; then
    alias sysinfo='fastfetch'
    alias neofetch='fastfetch'  # habit redirect
fi

# ─────────────────────────────────────────────────────────────────
# Welcome Screen
# ─────────────────────────────────────────────────────────────────
show_welcome() {
    if command -v figlet &>/dev/null && command -v lolcat &>/dev/null; then
        echo ""
        figlet -f small "wsig" | lolcat -f
        echo "  ╭─────────────────────────────────────╮" | lolcat -f
        echo "  │  $(date '+%a %b %d')  •  $(date '+%H:%M')              │" | lolcat -f
        echo "  │  light/dark • vibe <project>       │" | lolcat -f
        echo "  ╰─────────────────────────────────────╯" | lolcat -f
        echo ""
    fi
}

# Show welcome on new interactive shells (not subshells)
if [[ -z "$WELCOME_SHOWN" && $- == *i* && -z "$INSIDE_EMACS" ]]; then
    export WELCOME_SHOWN=1
    show_welcome
fi

# ─────────────────────────────────────────────────────────────────
# Quick Reference
# ─────────────────────────────────────────────────────────────────
alias design_help='echo "
╔══════════════════════════════════════════════════════════════╗
║  🎨 TYPOGRAPHY & DESIGN TOOLKIT                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  THEMES                                                      ║
║  ───────────────────────────────                             ║
║  light         Switch to Claude light mode                   ║
║  dark          Switch to Claude dark mode                    ║
║  toggle        Toggle between light/dark                     ║
║  vibe <name>   Project-specific colors                       ║
║                                                              ║
║  FILE VIEWING                                                ║
║  ───────────────────────────────                             ║
║  ls/ll/la      eza with icons & git status                   ║
║  lt/ltt        Tree view (2/3 levels)                        ║
║  cat           bat with syntax highlighting                  ║
║                                                              ║
║  FUZZY FINDING                                               ║
║  ───────────────────────────────                             ║
║  ctrl+t        Fuzzy file search                             ║
║  ctrl+r        Fuzzy history search                          ║
║  fp            Fuzzy project jump                            ║
║  fe            Fuzzy file edit                               ║
║  fb            Fuzzy git branch switch                       ║
║  flog          Fuzzy git log browser                         ║
║                                                              ║
║  TYPOGRAPHY                                                  ║
║  ───────────────────────────────                             ║
║  banner <text>    ASCII art banner                           ║
║  rbanner <text>   Rainbow ASCII banner                       ║
║  box <text>       Draw box around text                       ║
║  header <text>    Section header                             ║
║                                                              ║
║  INTERACTIVE                                                 ║
║  ───────────────────────────────                             ║
║  confirm <q>   Yes/no prompt                                 ║
║  ask <text>    Styled input                                  ║
║  choose a b c  Choose from options                           ║
║  say <text>    Styled output                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"'

# Initialize with Claude dark mode
claude_dark

# ═══════════════════════════════════════════════════════════════════
# 🏷️ SMART TAB & WINDOW NAMING
# ═══════════════════════════════════════════════════════════════════
# Context-aware naming: project + git branch + running command

# Store state for smart naming
typeset -g ITERM_CURRENT_PROJECT=""
typeset -g ITERM_CURRENT_EMOJI=""
typeset -g ITERM_RUNNING_CMD=""

# Set window title (different from tab - shows in window frame)
iterm2_set_window() { printf "\033]2;%s\007" "$1"; }

# Get short git branch name
_git_branch() {
    git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null
}

# Build smart tab title
_smart_tab_title() {
    local title=""
    local emoji="${ITERM_CURRENT_EMOJI:-🏠}"
    local project="${ITERM_CURRENT_PROJECT:-Terminal}"
    local branch=$(_git_branch)
    local cmd="$1"

    # Base: emoji + project
    title="$emoji $project"

    # Add git branch if in a repo
    if [[ -n "$branch" ]]; then
        # Truncate long branch names
        [[ ${#branch} -gt 15 ]] && branch="${branch:0:12}..."
        title="$title:$branch"
    fi

    # Add running command if provided
    if [[ -n "$cmd" ]]; then
        # Clean up the command for display
        local short_cmd="${cmd%% *}"  # First word only
        case "$short_cmd" in
            claude|cl|csp|yolo)
                title="$title 🤖"
                ;;
            git)
                local git_action="${cmd#git }"
                git_action="${git_action%% *}"
                title="$title ⚙️$git_action"
                ;;
            swift|swiftc|xcodebuild|xb)
                title="$title 🔨building"
                ;;
            npm|yarn|pnpm|bun)
                title="$title 📦"
                ;;
            ssh|studio|s)
                title="$title 🔗remote"
                ;;
            vim|nvim|nano|code)
                title="$title ✏️editing"
                ;;
            python|python3|node)
                title="$title ▶️running"
                ;;
            *)
                # Only show command if it's not trivial
                if [[ "$short_cmd" != "ls" && "$short_cmd" != "cd" && "$short_cmd" != "echo" ]]; then
                    title="$title ⚙️$short_cmd"
                fi
                ;;
        esac
    fi

    echo "$title"
}

# Build smart window title (more verbose)
_smart_window_title() {
    local dir="${PWD/#$HOME/~}"
    local branch=$(_git_branch)
    local project="${ITERM_CURRENT_PROJECT}"

    if [[ -n "$project" ]]; then
        if [[ -n "$branch" ]]; then
            echo "$project ($branch) - $dir"
        else
            echo "$project - $dir"
        fi
    else
        echo "$dir"
    fi
}

# Enhanced project vibe that stores state
iterm2_project_vibe_smart() {
    local project_name=""
    local emoji=""

    case "$PWD" in
        */Leavn*|*/LeavnOfficial*|*/LeavnSite*|*/LeavnAndroid*)
            iterm2_set_bg 36 28 48
            project_name="Leavn"; emoji="💜" ;;
        */hubdash*)
            iterm2_set_bg 20 31 41
            project_name="HubDash"; emoji="🌊" ;;
        */sigstack*)
            iterm2_set_bg 31 26 20
            project_name="SigStack"; emoji="⚡" ;;
        */overnight*)
            iterm2_set_bg 20 15 31
            project_name="Overnight"; emoji="🌙" ;;
        */willsigmon-media*|*/media*)
            iterm2_set_bg 36 20 26
            project_name="Media"; emoji="🎬" ;;
        */Scripts*|*/scripts*)
            iterm2_set_bg 15 31 20
            project_name="Scripts"; emoji="🧪" ;;
        */tip-wsig*)
            iterm2_set_bg 26 31 15
            project_name="Tip"; emoji="💰" ;;
        */Modcaster*)
            iterm2_set_bg 41 20 36
            project_name="Modcaster"; emoji="🎙️" ;;
        */carterhelms*|*/TwoTwelve*)
            iterm2_set_bg 38 35 15
            project_name="Client"; emoji="🤝" ;;
        */iswcpssclosed*)
            iterm2_set_bg 20 31 46
            project_name="ISWCPSS"; emoji="🏫" ;;
        */catalyst*)
            iterm2_set_bg 18 28 41
            project_name="Catalyst"; emoji="🚀" ;;
        */.claude*)
            iterm2_set_bg 31 23 15
            project_name="Claude"; emoji="🤖" ;;
        */GitHub\ MBA*)
            iterm2_set_bg 25 25 30
            project_name="GitHub"; emoji="📦" ;;
        */Developer*)
            iterm2_set_bg 22 25 28
            project_name="Dev"; emoji="💻" ;;
        */n8n*|*/workflows*)
            iterm2_set_bg 28 20 15
            project_name="n8n"; emoji="🔄" ;;
        */brain*|*/BRAIN*)
            iterm2_set_bg 20 28 35
            project_name="BRAIN"; emoji="🧠" ;;
        *)
            printf "\033]1337;SetColors=bg=default\007"
            project_name=""; emoji="🏠" ;;
    esac

    # Store state for other functions
    ITERM_CURRENT_PROJECT="$project_name"
    ITERM_CURRENT_EMOJI="$emoji"

    # Set smart titles
    iterm2_set_tab "$(_smart_tab_title)"
    iterm2_set_window "$(_smart_window_title)"
    iterm2_set_badge "$emoji"
}

# preexec: called just before a command is executed
_iterm_preexec() {
    ITERM_RUNNING_CMD="$1"
    iterm2_set_tab "$(_smart_tab_title "$1")"
}

# precmd: called just before prompt is displayed (command finished)
_iterm_precmd() {
    ITERM_RUNNING_CMD=""
    iterm2_set_tab "$(_smart_tab_title)"
    iterm2_set_window "$(_smart_window_title)"
}

# Register hooks (replace old chpwd hook with enhanced version)
add-zsh-hook -d chpwd iterm2_project_vibe 2>/dev/null
add-zsh-hook chpwd iterm2_project_vibe_smart
add-zsh-hook preexec _iterm_preexec
add-zsh-hook precmd _iterm_precmd

# Initialize on shell start
iterm2_project_vibe_smart

# ─────────────────────────────────────────────────────────────────
# Claude Session Tab Naming
# ─────────────────────────────────────────────────────────────────
# When starting Claude, set a session-aware name
claude_with_name() {
    local name="${1:-session}"
    export CLAUDE_SESSION="$name"
    iterm2_set_tab "🤖 Claude: $name"
    iterm2_set_badge "🤖"
    shift 2>/dev/null
    claude "$@"
    unset CLAUDE_SESSION
    _iterm_precmd  # Reset title after Claude exits
}

# Aliases for named Claude sessions
alias cn='claude_with_name'
alias cl-leavn='CLAUDE_SESSION=Leavn claude'
alias cl-hubdash='CLAUDE_SESSION=HubDash claude'
alias cl-brain='CLAUDE_SESSION=BRAIN claude'

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

