---
title: "NEXUS: Modular Robotics Operations Platform"
slug: nexus
order: 10
urlPath: /pages/nexus_project.html
publish: true
layout: layouts/project.njk
status: Early-stage architecture
summary: "A plugin-first operations architecture for heterogeneous autonomous systems, where robots, simulators, middleware stacks and external services connect through explicit adapters instead of being hard-coded into one runtime."
lead:
  - label: Current scope
    text: "an early-stage architecture and open-source foundation. This page presents intended system design, module boundaries and integration strategy, not a complete production implementation."
  - label: My contribution
    text: "personal open-source project, published in my GitHub repository."
contribution:
  lead: "Personal open-source project."
index:
  name: NEXUS
  context: "Personal, operations platform architecture"
  period: "Early architecture, no outputs yet"
evidence: { hardware: none, field: none, experimental: none, simulation: none, publication: none, software: none }
evidenceNote: "Early-stage architecture: no implementation outputs documented yet"
facts:
  - { term: Context, value: "Personal, open source", wide: true }
  - { term: Status, value: Early-stage architecture and open-source foundation, wide: true }
  - { term: Concepts, value: "Plugin-first architecture, robot-agnostic adapters, capability model, ROS / ROS&nbsp;2, MQTT, MAVLink, web operator UI, middleware-independent design", wide: true }
opening:
  type: none

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: "NEXUS focuses on architecture, module boundaries, capability-driven control, plugin contracts and operator-facing system design. It is intended to grow into a robot-agnostic operations layer while staying independent from any single robotics middleware."

  - id: s-arch
    title: Architecture
    blocks:
      - type: prose
        md: "The platform is organized around a normalized operations model. Robots, simulators and external systems connect through adapters; adapters expose state and capabilities; the mission and task layer works against those capabilities; plugins extend behavior and UI without tying the platform to one robot type or middleware stack."
      - type: sequence
        label: NEXUS layers
        roles: true
        items:
          - { name: "Robot, simulator, external system", role: "Physical robots, simulated agents, services or custom endpoints" }
          - { name: Adapter layer, role: "ROS, MQTT, MAVLink, simulator or custom API adapters" }
          - { name: Normalized robot model, role: "Shared state, identity, telemetry, health and command contracts" }
          - { name: Capability registry, role: Declared robot abilities exposed as stable platform capabilities }
          - { name: Mission / task layer, role: Task orchestration that targets capabilities instead of robot-specific APIs }
          - { name: Plugin runtime, role: "Extension point for integrations, tools, behaviors and UI modules" }
          - { name: "Operator UI / API", role: "Supervision, fleet state, commands, diagnostics and external access" }
        caption: "**Fig. 1** Intended layers, from external systems to the operator, as described in the project documentation."

  - id: s-principles
    title: Design principles
    short: Principles
    blocks:
      - type: table
        label: Table 1
        caption: Core design principles
        wide: true
        head: [Principle, Meaning]
        rows:
          - { item: Plugin-first, cells: ["Platform behavior, integrations and operator views extend through explicit plugin contracts"] }
          - { item: Robot-agnostic, cells: ["The core reasons about normalized robots and capabilities, not one vehicle, arm, drone or middleware package"] }
          - { item: Adapter-based, cells: ["Robot-specific details sit behind adapters that translate external systems into stable NEXUS contracts"] }
          - { item: Capability-driven, cells: ["Tasks request abilities such as navigation, inspection, streaming or manipulation, instead of platform-specific commands"] }
          - { item: Middleware-independent, cells: ["ROS, MQTT, MAVLink, simulators and custom APIs are integration choices, not assumptions in the core"] }
          - { item: UI modularity, cells: ["The operator interface supports modular panels and tools that reflect the available plugins, robot types and mission contexts"] }

  - id: s-components
    title: System components and middleware strategy
    short: Components
    blocks:
      - type: table
        label: Table 2
        caption: Intended system components
        wide: true
        head: [Component, Role]
        rows:
          - { item: Adapter SDK, cells: ["How new robots, simulators, middleware bridges and external systems connect to NEXUS"] }
          - { item: Capability registry, cells: ["Tracks declared robot capabilities and exposes them to task logic, UI modules and plugins"] }
          - { item: Plugin runtime, cells: ["A controlled extension surface for platform features without modifying the core"] }
          - { item: Mission / task layer, cells: ["Coordinates high-level work using normalized state and capabilities"] }
          - { item: Robot state model, cells: ["Identity, pose, health, telemetry, mode and availability in one consistent model"] }
          - { item: Operator console, cells: ["The UI shell for supervision, commands, status, diagnostics and plugin panels"] }
          - { item: Integration bridges, cells: ["Bridge concepts for ROS, ROS&nbsp;2, MQTT, MAVLink, simulators and custom infrastructure"] }
          - { item: Observability and logs, cells: ["Events, logs, state history and integration diagnostics for debugging and operations"] }
      - type: prose
        md: |
          NEXUS treats robotics middleware as an integration boundary. ROS, ROS&nbsp;2, MQTT, MAVLink, simulators and custom APIs can all be valuable, but none of them should define the platform core, which depends on stable adapter contracts, normalized robot state and declared capabilities.

          This keeps the operations layer portable across heterogeneous systems: a UAV using MAVLink, a ROS&nbsp;2 ground robot, a simulator and a custom external service should be able to appear in the same operations model when their adapters expose compatible state and capability contracts.

  - id: s-roadmap
    title: Roadmap
    blocks:
      - type: table
        label: Table 3
        caption: "Planned steps (intentions, not completed work)"
        wide: true
        head: [Step, Plan]
        rows:
          - { item: Core data model, cells: ["A first shared model for robot identity, state, telemetry, health, commands and capabilities"] }
          - { item: Adapter interface, cells: ["The adapter contract that external systems use to connect to the platform"] }
          - { item: Simulated adapter, cells: ["A first simulated robot adapter, to validate the model without hardware"] }
          - { item: Bridge prototypes, cells: ["Initial ROS, MQTT and MAVLink bridge prototypes around the same adapter boundary"] }
          - { item: Operator UI shell, cells: ["A minimal web operator console for robot state, capability inspection and basic commands"] }
          - { item: Plugin examples, cells: ["Small example plugins that show extension points and the expected project structure"] }

  - id: s-refs
    title: Source code
    blocks:
      - type: refs
        items:
          - { n: 1, label: "NEXUS repository (GitHub)", href: "https://github.com/ErikMischiatti/NEXUS" }
---
