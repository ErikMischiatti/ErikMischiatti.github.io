---
title: "NEXUS: Modular Robotics Operations Platform"
slug: nexus
order: 10
urlPath: /pages/nexus_project.html
publish: true
layout: layouts/project.njk
status: Early implementation
summary: "A plugin-first operations platform for heterogeneous autonomous systems, written in TypeScript. The headless core runtime, the plugin platform and a browser-based operator UI shell are implemented and tested; robot adapters and the robot model are the next phase and not built yet."
lead:
  - label: Current scope
    text: "an early implementation. The core runtime, plugin platform and operator UI shell exist in code; the UI runs on mock data and does not connect to the core yet. Robot adapters, the normalized robot model, capabilities and missions are design, not implementation."
  - label: My contribution
    text: "personal open-source project, published in my GitHub repository."
contribution:
  lead: "Personal open-source project."
index:
  name: NEXUS
  context: "Personal, operations platform"
  period: "Early implementation, no robot adapters yet"
evidence: { hardware: none, field: none, experimental: none, simulation: none, publication: none, software: doc }
facts:
  - { term: Context, value: "Personal, open source (Apache 2.0)", wide: true }
  - { term: Status, value: "Core runtime, plugin platform and mock-data operator UI shell implemented; adapters not started", wide: true }
  - { term: Stack, value: "TypeScript, Node.js 20, React 19, Vite, Zustand, Vitest", wide: true }
  - { term: Design scope, value: "Robot-agnostic adapters, capability model and middleware independence (ROS / ROS&nbsp;2, MQTT, MAVLink), planned", wide: true }
featured:
  order: 2
  tier: text-led
  layout: text-led
  selectedName: NEXUS
  selectedSummary: Software, open source
  meta:
    - { text: "Personal, open source" }
    - { text: "Early implementation" }
  what: "A plugin-first operations platform for heterogeneous autonomous systems: a TypeScript core runtime and plugin platform, and a browser operator UI shell. Robot adapters are the next phase."
  builtWith: "TypeScript, Node.js, React, Vite, Vitest"
  contribution: "Personal open-source project."
  evidenceWords: "Software implementation."
  evidenceText: "Core runtime, plugin platform and UI shell are covered by automated tests. The UI runs on mock data; no robot is connected yet."
  caseLabel: NEXUS case study
  pageLabel: NEXUS project page
  sequence:
    label: NEXUS, implemented parts
    items: [Event bus, "Configuration, logging, services", Runtime bootstrap, Plugin platform, "Operator UI shell (mock data)"]
    caption: "Implemented building blocks. Adapters, the robot model, capabilities and missions are the planned next layers."

opening:
  type: none

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: "NEXUS aims to be a robot-agnostic operations layer: robots, simulators, middleware stacks and external services connect through explicit adapters instead of being hard-coded into one runtime. Development started from the platform itself. A headless core runtime and a plugin platform come first, followed by an operator UI shell, so that the extension points exist and are tested before the first robot adapter is written."

  - id: s-implemented
    title: What is implemented
    short: Implemented
    blocks:
      - type: table
        label: Table 1
        caption: Implemented components
        wide: true
        head: [Component, Implementation]
        rows:
          - { item: Core runtime, cells: ["A headless, in-process runtime with an event bus, configuration loading and validation, logging, a service container and a bootstrap that starts and stops everything in order"] }
          - { item: Plugin SDK, cells: ["Public plugin contracts and a manifest format, with validation of every manifest before a plugin is accepted"] }
          - { item: Plugin platform, cells: ["Registry, local discovery, loader and lifecycle management; a plugin that fails while starting is rolled back and the failures are reported together"] }
          - { item: Example plugin, cells: ["A telemetry demo plugin package that subscribes to bus events and normalizes a generic payload"] }
          - { item: Operator UI shell, cells: ["A browser shell with top bar, activity bar, sidebar, dockable workspace and event panel, a UI-side plugin view registry and a first telemetry view"] }
          - { item: Runtime snapshot boundary, cells: ["The UI reads one snapshot model of runtime, connection, workspaces, plugins and events. Today a mock provider fills it; the same boundary is where the core will connect"] }

  - id: s-arch
    title: Target architecture
    short: Architecture
    blocks:
      - type: prose
        md: "The intended platform is organized around a normalized operations model. Robots, simulators and external systems connect through adapters; adapters expose state and capabilities; a mission and task layer works against those capabilities; plugins extend behavior and UI without tying the platform to one robot type or middleware stack. The plugin runtime and the operator UI shell exist; the layers below them do not yet."
      - type: sequence
        label: NEXUS layers
        roles: true
        items:
          - { name: "Robot, simulator, external system", role: "Planned: physical robots, simulated agents, services" }
          - { name: Adapter layer, role: "Planned: ROS, MQTT, MAVLink, simulator or custom API adapters" }
          - { name: Normalized robot model, role: "Planned: identity, state, telemetry, health and commands" }
          - { name: Capability registry, role: "Planned: declared robot abilities as stable platform capabilities" }
          - { name: Mission / task layer, role: "Planned: task orchestration against capabilities" }
          - { name: Plugin runtime, role: "Implemented: contracts, discovery, loading, lifecycle" }
          - { name: "Operator UI", role: "Implemented as a shell on mock data; no API yet" }
        caption: "**Fig. 1** Target layers, from external systems to the operator, with the implementation status of each."

  - id: s-principles
    title: Design principles
    short: Principles
    blocks:
      - type: table
        label: Table 2
        caption: Core design principles
        wide: true
        head: [Principle, Meaning]
        rows:
          - { item: Plugin-first, cells: ["Platform behavior, integrations and operator views extend through explicit plugin contracts"] }
          - { item: Robot-agnostic, cells: ["The core is meant to reason about normalized robots and capabilities, not one vehicle, arm, drone or middleware package"] }
          - { item: Adapter-based, cells: ["Robot-specific details are meant to sit behind adapters that translate external systems into stable NEXUS contracts"] }
          - { item: Middleware-independent, cells: ["ROS, MQTT, MAVLink, simulators and custom APIs are integration choices, not assumptions in the core"] }
          - { item: UI modularity, cells: ["Operator panels are registered by plugins, so the interface reflects the plugins that are installed"] }

  - id: s-tests
    title: Validation and limits
    short: Validation
    blocks:
      - type: prose
        md: |
          The core and the UI each have their own Vitest suite: event bus, configuration, logging, service container, runtime bootstrap, manifest validation, discovery, loading and plugin lifecycle on the core side; the shell application, selection, plugin view registration and bootstrap and the snapshot provider on the UI side.

          **Limits.** The UI does not connect to the core: there is no API, WebSocket or IPC bridge yet. The event bus is in-process only. Plugins are not sandboxed, and plugin dependencies and versions are not resolved. No robot can be connected or controlled.

  - id: s-roadmap
    title: Roadmap
    blocks:
      - type: table
        label: Table 3
        caption: "Status of the planned steps"
        wide: true
        head: [Step, Status]
        rows:
          - { item: Core runtime and plugin SDK, cells: ["Done"] }
          - { item: Example plugin, cells: ["Done (telemetry demo)"] }
          - { item: Operator UI shell, cells: ["Done, on mock data"] }
          - { item: Adapter interface and first adapters, cells: ["Next phase, not started: the adapter contract, a simulated adapter, then ROS, MQTT and MAVLink bridges"] }
          - { item: Robot model and capabilities, cells: ["Planned: shared model for identity, state, telemetry, health, commands and capabilities"] }
          - { item: Mission workspace, cells: ["Planned: mission-focused operator layouts and repeatable workflows"] }

  - id: s-refs
    title: Source code
    blocks:
      - type: refs
        items:
          - { n: 1, label: "NEXUS repository (GitHub)", href: "https://github.com/ErikMischiatti/NEXUS" }
---
