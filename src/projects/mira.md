---
title: "M.I.R.A.: Modular Interactive Robotic Agent"
slug: mira
order: 8
urlPath: /pages/mira_page.html
publish: true
layout: layouts/project.njk
status: Active desktop prototype
summary: "A software-first embodied AI assistant built with Python and PySide6: modular cognition, expressive state feedback and safe local actions. It is a desktop prototype, not a hardware robot yet, designed as the foundation for future robotic embodiment."
lead:
  - label: My contribution
    text: "personal project; the software prototype is published in my GitHub repository."
contribution:
  lead: "Personal project, published on GitHub."
index:
  name: M.I.R.A.
  context: "Personal, desktop assistant prototype"
  period: Active
evidence: { hardware: none, field: none, experimental: none, simulation: none, publication: none, software: doc }
facts:
  - { term: Context, value: "Personal, open source", wide: true }
  - { term: Status, value: Active desktop embodied-assistant prototype, wide: true }
  - { term: Stack, value: "Python 3.12+, PySide6 / Qt, requests, pytest, optional Ollama integration, event-driven architecture", wide: true }
opening:
  type: none

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: "The current prototype combines a chat and interaction core, animated eyes, a state manager, cognition modules, session memory and safe local action execution. The goal is to build the interaction and behavior layer before moving towards physical sensors, actuators and a robotic body."
      - type: video
        id: cap-mira
        src: /media/mira/interface.mp4
        poster: /media/mira/interface-poster.webp
        width: 400
        height: 448
        ratio: "400 / 448"
        maxWidth: 420px
        caption: "**Fig. 1** Desktop interface with expressive animated eyes and compact interaction controls. 25&nbsp;s, no sound."

  - id: s-arch
    title: Architecture
    blocks:
      - type: prose
        md: "M.I.R.A. is organized around an event-driven interaction loop. The resulting state is propagated through the state manager and rendered by the face UI."
      - type: sequence
        label: Interaction loop
        items:
          - { name: User input }
          - { name: Chat / interaction layer }
          - { name: Event bus }
          - { name: Brain }
          - { name: Intent engine }
          - { name: "Memory, action executor, response builder" }
          - { name: "State manager → face UI" }
        caption: "**Fig. 2** Pipeline from user input to the rendered state, as described in the project documentation."

  - id: s-features
    title: Key features
    blocks:
      - type: table
        label: Table 1
        caption: Key features, as documented
        wide: true
        head: [Feature, Description]
        rows:
          - { item: Expressive animated eyes, cells: ["Blink, idle motion, gaze and emotion states give visible feedback on the assistant's state"] }
          - { item: Intent engine, cells: ["Rule-based parsing for deterministic commands, with an optional local LLM path for richer intent extraction"] }
          - { item: Session memory, cells: ["Recent interaction context is kept for continuity within a session"] }
          - { item: Safe local actions, cells: ["A registry and executor pattern constrains local desktop actions behind explicit action contracts"] }
          - { item: Compact GUI, cells: ["The assistant face and chat stay compact, with a hidden debug drawer for development controls"] }
          - { item: Async LLM contract, cells: ["The LLM path avoids UI-thread side effects and keeps cognition separate from rendering"] }

  - id: s-tests
    title: Validation and scope
    short: Validation
    blocks:
      - type: prose
        md: |
          The project includes tests covering action contracts, executor behavior, async brain contracts, desktop actions, LLM intent handling, response building and rule-based intent parsing.

          **Scope.** M.I.R.A. is not a hardware robot yet. The current milestone is a desktop embodied-assistant prototype and a foundation for future robotic embodiment.

  - id: s-refs
    title: Source code
    blocks:
      - type: refs
        items:
          - { n: 1, label: "M.I.R.A. repository (GitHub)", href: "https://github.com/ErikMischiatti/M.I.R.A" }
---
