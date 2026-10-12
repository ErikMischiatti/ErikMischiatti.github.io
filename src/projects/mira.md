---
title: "M.I.R.A.: Modular Interactive Robotic Agent"
slug: mira
order: 8
urlPath: /pages/mira_page.html
publish: true
layout: layouts/project.njk
status: Active desktop prototype
summary: "A software-first embodied assistant built with Python and PySide6: an animated face driven by a renderer-independent embodiment model, a modular cognition layer with safe local actions, and an ambient notch interface in development. It is a desktop prototype, not a hardware robot yet, designed as the foundation for a future robotic body."
lead:
  - label: My contribution
    text: "personal project; design, implementation and tests are my own. The published repository holds the main branch; the notch, voice activation and camera work are on development branches that are not yet published."
contribution:
  lead: "Personal project, published on GitHub."
index:
  name: M.I.R.A.
  context: "Personal, desktop assistant prototype"
  period: Active
evidence: { hardware: none, field: none, experimental: none, simulation: none, publication: none, software: doc }
facts:
  - { term: Context, value: "Personal, open source (MIT)", wide: true }
  - { term: Status, value: "Active desktop embodied-assistant prototype; notch interface in development", wide: true }
  - { term: Stack, value: "Python 3.12, PySide6 / Qt 6, pytest, GitHub Actions; optional local LLM through Ollama. Development branches: OpenCV (camera capture), sherpa-onnx and Silero VAD (voice activation)", wide: true }
featured:
  order: 1
  tier: primary
  layout: media-end
  selectedName: M.I.R.A.
  selectedSummary: Software, prototype
  meta:
    - { text: "Personal, open source" }
    - { text: "Active desktop prototype" }
  what: "A software-first embodied assistant built with Python and PySide6: an animated face driven by a renderer-independent embodiment model, modular cognition with safe local actions, and an ambient notch interface in development."
  builtWith: "Python 3.12, PySide6 / Qt 6, pytest, GitHub Actions, optional Ollama integration"
  contribution: "Personal project, published on GitHub."
  evidenceWords: "Software implementation."
  evidenceText: "Automated tests and CI cover cognition, actions, embodiment and UI behavior. Not a hardware robot yet."
  caseLabel: M.I.R.A. case study
  pageLabel: M.I.R.A. project page
  # Real UI, rendered offscreen from the development branch (see src/media/PROVENANCE.md).
  mediaVideo: { src: /media/mira/main-window-chat.mp4, poster: /media/mira/main-window-chat-poster.webp, width: 860, height: 680, animate: true }
  mediaCaption: "Main window: idle micro-motions, then a typed exchange (replies are in Italian)."

opening:
  type: none

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: |
          M.I.R.A. explores the interaction and behavior layer of an assistant before it has a physical body. A face with expressive eyes shows what the assistant is doing (idle, listening, thinking, speaking) and how an action went, while a cognition layer turns typed requests into intents, validated local actions and short replies.

          The embodiment is modelled independently of the renderer: motions, gaze and expressions are computed as immutable frames that any surface can draw. The main window and the notch already share one embodiment this way, and the same separation is what a future robot head would plug into.
      - type: video
        id: cap-mira-main
        src: /media/mira/main-window-chat.mp4
        poster: /media/mira/main-window-chat-poster.webp
        width: 860
        height: 680
        ratio: "860 / 680"
        maxWidth: 640px
        animate: true
        caption: "**Fig. 1** Main window: idle blinks and gaze drift, a typed greeting and a time request handled by the rule-based engine, with the face moving through thinking and speaking states and the action status shown below the conversation. Replies are in Italian. Rendered from the running application on Qt's offscreen platform; 12&nbsp;s, no sound."

  - id: s-notch
    title: Notch interface
    short: Notch
    blocks:
      - type: prose
        md: |
          The notch is an ambient surface: a small frameless overlay at the top of the screen that carries the same eyes as the main window. It stays compact (200&nbsp;×&nbsp;32&nbsp;px) and expands (400&nbsp;×&nbsp;112&nbsp;px) with an animated transition on hover, on system notices (devices, audio, connectivity, running tasks), and while listening, when it shows the live microphone waveform. Right-click opens controls drawn inside the notch, and a double-click opens the main window.

          Its geometry, eye layout and behavior are configurable through a versioned settings file and a live tuning window, and an eye-bounds check keeps every eye pose inside the notch outline.
      - type: video
        id: cap-mira-notch
        src: /media/mira/notch-hover.mp4
        poster: /media/mira/notch-hover-poster.webp
        width: 480
        height: 144
        ratio: "480 / 144"
        maxWidth: 480px
        animate: true
        caption: "**Fig. 2** Notch: compact state, expansion on pointer hover, blink, and collapse. No notice is active, so the expanded notch shows only the eyes. Rendered offscreen over a neutral background; on the desktop it sits at the top edge of the screen. 5&nbsp;s."
      - type: note
        md: "**Development branch.** The notch, system notices and voice activation are implemented and tested on a development branch and are not yet merged into the main branch on GitHub. The notch targets Linux on X11."

  - id: s-arch
    title: Architecture
    blocks:
      - type: prose
        md: "Requests flow from the user interface to the cognition layer and back as state changes. Inference runs off the UI thread; its side effects are committed afterwards in a single serialized step, and results that arrive after a newer request are discarded. Only one component commits the visible activity state, and import-layering and state-authority rules are checked automatically."
      - type: sequence
        label: Interaction loop
        roles: true
        items:
          - { name: Chat panel or notch, role: "Typed input; the surfaces present one shared embodiment" }
          - { name: Brain, role: "Asynchronous request handling, off the UI thread" }
          - { name: Intent engine, role: "Rule-based, or a local LLM with an allowlisted schema and fallback to the rules" }
          - { name: Action policy and executor, role: "Validated contracts and an allowlist of local actions" }
          - { name: "Response builder, session memory", role: Reply text and in-session context }
          - { name: Activity authority, role: "The single writer of the visible state, through the event bus" }
          - { name: Embodiment, role: "Renderer-independent frames drawn by the main window and the notch" }
        caption: "**Fig. 3** Path from user input to the rendered state, as implemented."

  - id: s-features
    title: Key features
    blocks:
      - type: table
        label: Table 1
        caption: "Features and where they are implemented"
        wide: true
        head: [Feature, Description, Where]
        rows:
          - { item: Expressive eyes, cells: ["Blink, idle wander, cursor-following gaze, thinking and speaking motion, and expressions (neutral, happy, confused and others). On the development branch these are computed by a Qt-free micro-motion and gaze model", "GitHub main"] }
          - { item: Semantic cues, cells: ["Success, warning and error are shown through the eyes, and a running task through a narrowed, breathing \"focused\" look", "Development"] }
          - { item: Intent engine, cells: ["Rule-based parsing for deterministic commands (Italian), with an optional local LLM path through Ollama, confidence gating and fallback to the rules", "GitHub main"] }
          - { item: Safe local actions, cells: ["A registry, execution policy and executor run a small set of desktop actions behind explicit contracts; actions that need a confirmation are blocked until a confirmation flow exists", "GitHub main"] }
          - { item: Session memory, cells: ["Recent interaction context is kept within a session; nothing persists across sessions", "GitHub main"] }
          - { item: Compact main window, cells: ["Face and conversation, with a hidden debug drawer for expression tuning and diagnostics", "GitHub main"] }
          - { item: Notch interface, cells: ["Ambient compact and expanded states, notices, in-notch controls, one runtime per user shared by both surfaces", "Development"] }
          - { item: Voice activation, cells: ["Keyboard or optional wake-word activation, voice-activity detection and utterance segmentation; speech-to-text is not implemented yet", "Development"] }
          - { item: Camera capture, cells: ["Opt-in capture foundation on a background thread; frames are not analyzed yet. Face-presence detection exists on a separate experimental branch", "Development"] }

  - id: s-tests
    title: Validation and scope
    short: Validation
    blocks:
      - type: prose
        md: |
          The main branch on GitHub runs its test suite headless on GitHub Actions (Qt offscreen platform), together with the layering and state-authority checks. On the development branch, 71 test files cover action contracts and policy, the asynchronous brain contract, rule and LLM intent handling, the response builder, embodiment and micro-motion, eye rendering, notch geometry, transitions and hover, notice producers, and the audio and listening pipeline. Camera and microphone are replaced by test doubles, so no test opens a device.

          **Scope.** M.I.R.A. is not a hardware robot yet. Speech-to-text, spoken replies, persistent memory and a perception-driven gaze are planned, not implemented.

  - id: s-refs
    title: Source code
    blocks:
      - type: refs
        items:
          - { n: 1, label: "M.I.R.A. repository (GitHub)", href: "https://github.com/ErikMischiatti/M.I.R.A" }
---
