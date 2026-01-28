#!/bin/bash
# Synesthesia Status Line for Claude Code
# Imported from Starship prompt configuration (~/.config/starship.toml)
# Colors mapped to wsig's grapheme-color synesthesia palette
# Terracotta (#e08151), Lavender (#9d8ec2), Success green (#8cb369)

input=$(cat)

# Extract JSON data
cwd=$(echo "$input" | jq -r '.workspace.current_dir // .cwd')
used=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
session_id=$(echo "$input" | jq -r '.session_id // ""')
model_name=$(echo "$input" | jq -r '.model.display_name // ""')
output_style=$(echo "$input" | jq -r '.output_style.name // ""')
vim_mode=$(echo "$input" | jq -r '.vim.mode // ""')
agent_name=$(echo "$input" | jq -r '.agent.name // ""')

# === DIRECTORY (cyan bold, with project emoji like Starship) ===
display_path="${cwd/#$HOME/\~}"

# Apply project-specific substitutions (matching Starship config)
case "$cwd" in
    *LeavnOfficial/Leavn*|*/Leavn) display_path="💜 Leavn" ;;
    */hubdash*) display_path="🌊 HubDash" ;;
    */sigstack*) display_path="⚡ SigStack" ;;
    */overnight-work*|*/overnight*) display_path="🌙 Overnight" ;;
    */willsigmon-media*|*/media*) display_path="🎬 Media" ;;
    */Scripts*|*/scripts*) display_path="🧪 Scripts" ;;
    */tip-wsig*) display_path="💰 Tip" ;;
    */Modcaster*) display_path="🎙️ Modcaster" ;;
    */.claude*) display_path="🤖 Claude" ;;
    */GitHub\ MBA*) display_path="📦 GitHub" ;;
    */n8n*|*/workflows*) display_path="🔄 n8n" ;;
    */brain*|*/BRAIN*) display_path="🧠 BRAIN" ;;
    */catalyst*) display_path="🚀 Catalyst" ;;
    */carterhelms*|*/TwoTwelve*) display_path="🤝 Client" ;;
    */iswcpssclosed*) display_path="🏫 ISWCPSS" ;;
    *)
        # Default truncation to last 3 components
        path_parts=(${display_path//\// })
        path_count=${#path_parts[@]}
        if [ $path_count -gt 3 ]; then
            display_path="…/${path_parts[$((path_count-3))]}/${path_parts[$((path_count-2))]}/${path_parts[$((path_count-1))]}"
        fi
        ;;
esac

# === GIT BRANCH & STATUS (matching Starship symbols) ===
git_branch=""
git_status=""
if git -C "$cwd" --no-optional-locks rev-parse --git-dir > /dev/null 2>&1; then
    git_branch=$(git -C "$cwd" --no-optional-locks branch --show-current 2>/dev/null || git -C "$cwd" --no-optional-locks rev-parse --short HEAD 2>/dev/null)

    if [ -n "$git_branch" ]; then
        # Check for status indicators (matching your Starship config)
        status_output=$(git -C "$cwd" -c core.useBuiltinFSMonitor=false --no-optional-locks status --porcelain 2>/dev/null)

        indicators=""
        # Match Starship git_status format exactly
        # staged = +count (green)
        staged=$(echo "$status_output" | grep -c "^[AM]")
        [ "$staged" -gt 0 ] && indicators="${indicators}+${staged}"

        # modified = !count (yellow)
        modified=$(echo "$status_output" | grep -c "^ M")
        [ "$modified" -gt 0 ] && indicators="${indicators}!${modified}"

        # deleted = ✘count (red)
        deleted=$(echo "$status_output" | grep -c "^ D")
        [ "$deleted" -gt 0 ] && indicators="${indicators}✘${deleted}"

        # untracked = ?count (blue)
        untracked=$(echo "$status_output" | grep -c "^??")
        [ "$untracked" -gt 0 ] && indicators="${indicators}?${untracked}"

        # Ahead/Behind (⇡⇣ matching Starship)
        upstream=$(git -C "$cwd" --no-optional-locks rev-parse --abbrev-ref @{upstream} 2>/dev/null)
        if [ -n "$upstream" ]; then
            counts=$(git -C "$cwd" --no-optional-locks rev-list --left-right --count HEAD...@{upstream} 2>/dev/null)
            if [ -n "$counts" ]; then
                behind=$(echo "$counts" | awk '{print $1}')
                ahead=$(echo "$counts" | awk '{print $2}')
                [ "$ahead" -gt 0 ] && indicators="${indicators}⇡${ahead}"
                [ "$behind" -gt 0 ] && indicators="${indicators}⇣${behind}"
            fi
        fi

        [ -n "$indicators" ] && git_status=" $indicators"
    fi
fi

# === SESSION DURATION (dimmed, only if >2s like Starship cmd_duration) ===
duration_info=""
if [[ $session_id =~ ^[0-9]{8}_[0-9]{6} ]]; then
    session_time="${session_id:0:8} ${session_id:9:6}"
    session_epoch=$(date -j -f "%Y%m%d %H%M%S" "$session_time" "+%s" 2>/dev/null || echo "0")
    current_epoch=$(date +%s)
    duration_seconds=$((current_epoch - session_epoch))

    # Only show if >= 2 seconds (matches your Starship min_time: 2_000ms)
    if [ $duration_seconds -ge 2 ]; then
        if [ $duration_seconds -lt 60 ]; then
            duration="${duration_seconds}s"
        elif [ $duration_seconds -lt 3600 ]; then
            duration="$((duration_seconds / 60))m"
        else
            hours=$((duration_seconds / 3600))
            mins=$((duration_seconds % 3600 / 60))
            duration="${hours}h${mins}m"
        fi
        # Dimmed white (matching Starship)
        duration_info=" $(printf '\033[2;37m%s\033[0m' "$duration")"
    fi
fi

# === CONTEXT PERCENTAGE (synesthesia color coding) ===
context_info=""
if [ -n "$used" ]; then
    context_pct=$(printf '%.0f' "$used")
    # Color code by synesthesia palette: success <50%, amber 50-80%, error >80%
    if [ "$context_pct" -lt 50 ]; then
        context_info=" $(printf '\033[2;38;2;140;179;105m%s%%\033[0m' "$context_pct")"  # success green
    elif [ "$context_pct" -lt 80 ]; then
        context_info=" $(printf '\033[2;38;2;212;169;58m%s%%\033[0m' "$context_pct")"   # amber warning
    else
        context_info=" $(printf '\033[2;38;2;204;102;102m%s%%\033[0m' "$context_pct")"  # error red
    fi
fi

# === MODEL INFO (dimmed info blue - synesthesia) ===
model_info=""
if [ -n "$model_name" ]; then
    # Shorten model names for brevity
    case "$model_name" in
        *"Sonnet"*) short_model="🧠 Sonnet" ;;
        *"Haiku"*) short_model="⚡ Haiku" ;;
        *"Opus"*) short_model="💎 Opus" ;;
        *) short_model="$model_name" ;;
    esac
    model_info=" $(printf '\033[2;38;2;122;162;201m%s\033[0m' "$short_model")"  # info blue
fi

# === OUTPUT STYLE (dimmed lavender - synesthesia structure) ===
style_info=""
if [ -n "$output_style" ] && [ "$output_style" != "default" ]; then
    style_info=" $(printf '\033[2;38;2;157;142;194m[%s]\033[0m' "$output_style")"  # lavender
fi

# === VIM MODE (synesthesia: matching Starship vimcmd_symbol lavender, terracotta for insert) ===
vim_info=""
if [ -n "$vim_mode" ]; then
    if [ "$vim_mode" = "NORMAL" ]; then
        vim_info=" $(printf '\033[1;38;2;157;142;194m❮\033[0m')"  # lavender ❮ (matching Starship)
    else
        vim_info=" $(printf '\033[1;38;2;224;129;81m❯\033[0m')"   # terracotta ❯
    fi
fi

# === AGENT MODE (if running as agent) ===
agent_info=""
if [ -n "$agent_name" ]; then
    agent_info=" $(printf '\033[2;38;2;157;142;194m[%s]\033[0m' "$agent_name")"  # dimmed lavender
fi

# === BUILD STATUS LINE ===
# Format: 💜 Leavn  main +2!1?3 🧠 Sonnet [Learning] 42s 85% [agent] ❮
# Using 24-bit true color for synesthesia accuracy
# Matches Starship prompt: directory, git_branch, git_status, duration, character
status_line=""

# Synesthesia color helpers (24-bit true color)
terracotta='\033[38;2;224;129;81m'  # #e08151 - primary accent
lavender='\033[38;2;157;142;194m'   # #9d8ec2 - structure
success='\033[38;2;140;179;105m'    # #8cb369 - success green
warning='\033[38;2;212;169;58m'     # #d4a93a - amber warning
error='\033[38;2;204;102;102m'      # #cc6666 - error red
info='\033[38;2;122;162;201m'       # #7aa2c9 - info blue
cream='\033[38;2;238;232;223m'      # #eee8df - cream text
reset='\033[0m'
bold='\033[1m'
dim='\033[2m'

# Directory (terracotta bold - primary accent)
status_line="${status_line}$(printf "${bold}${terracotta}%s${reset}" "$display_path")"

# Git branch (lavender with  symbol - structure)
if [ -n "$git_branch" ]; then
    status_line="${status_line} $(printf "${lavender} %s${reset}" "$git_branch")"

    # Git status (error red)
    if [ -n "$git_status" ]; then
        status_line="${status_line}$(printf "${error}%s${reset}" "$git_status")"
    fi
fi

# Model (dimmed info blue)
status_line="${status_line}${model_info}"

# Output style (dimmed lavender)
status_line="${status_line}${style_info}"

# Duration (dimmed cream)
status_line="${status_line}${duration_info}"

# Context % (color-coded by synesthesia palette)
status_line="${status_line}${context_info}"

# Agent mode (dimmed lavender)
status_line="${status_line}${agent_info}"

# Vim mode (lavender ❮ for normal, terracotta ❯ for insert - matching Starship)
status_line="${status_line}${vim_info}"

echo "$status_line"
