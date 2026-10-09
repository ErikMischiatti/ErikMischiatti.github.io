---
title: "VISTA: Visual Intelligence State-Tree Architecture"
slug: vista
order: 7
urlPath: /pages/vista_project.html
publish: true
layout: layouts/project.njk
status: Work in progress
summary: "A ROS&nbsp;2 framework that connects on-device Vision-Language Model perception with deterministic Behavior Tree control, for local perception and reactive robot behavior."
lead:
  - label: Project
    text: "ideated and maintained by Andrea Ricciardi."
  - label: My contribution
    text: "limited to the Behavior Tree side of the system: the decision structure, custom BT nodes, blackboard integration, and the runtime link between VLM state and BT control logic."
contribution:
  lead: "Behavior Tree layer: decision structure, custom BT nodes, blackboard integration."
index:
  name: "VISTA, Behavior Tree layer"
  context: "Contribution to A. Ricciardi's ROS&nbsp;2 framework"
  period: In progress
evidence: { hardware: none, field: none, experimental: none, simulation: none, publication: none, software: doc }
facts:
  - { term: My role, value: "Behavior Tree layer: decision structure, custom nodes, blackboard integration", wide: true }
  - { term: Project, value: "Ideated and maintained by Andrea Ricciardi", wide: true }
  - { term: Status, value: Work in progress }
  - { term: Stack, value: "ROS&nbsp;2 Jazzy, C++17, BehaviorTree.CPP v4, rclcpp components, OpenCV, cv_bridge, Gemma VLM, llama.cpp, YAML", wide: true }
opening:
  type: none

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: "VISTA uses a decoupled two-loop architecture. A slower **perception loop** analyzes camera frames through a local Gemma VLM served by llama.cpp; a faster **Behavior Tree loop** consumes structured state and selects robot behaviors without blocking on model inference."

  - id: s-arch
    title: System architecture
    blocks:
      - type: prose
        md: "VISTA runs two ROS&nbsp;2 composable nodes in a multi-threaded component container. GemmaPerceptionNode subscribes to a camera image topic, encodes frames as JPEG, calls a local OpenAI-compatible llama.cpp chat-completions endpoint, parses the JSON perception output and publishes a custom /vlm_data message. BehaviorTreeNode subscribes to that topic, updates a BehaviorTree.CPP blackboard and ticks the tree at the configured control rate."
      - type: sequence
        label: VISTA data flow
        roles: true
        items:
          - { name: Camera image, role: Configurable ROS 2 image topic }
          - { name: GemmaPerceptionNode, role: "JPEG encoding, prompt request, JSON parsing" }
          - { name: /vlm_data, role: "Scene state, hazard level, target visibility, bbox, confidence" }
          - { name: BT blackboard, role: Latest VLM state copied into BehaviorTree.CPP memory }
          - { name: BehaviorTreeNode, role: Fast periodic ticks of the configured BT XML }
          - { name: Robot behaviors, role: "Recovery, target pursuit or default behavior" }
        caption: "**Fig. 1** From camera frames to robot behaviors, as described in the project repository."
      - type: prose
        md: "Runtime parameters live in one YAML file, which configures the VLM host and timeouts, the camera and output topics, JPEG quality, the system prompt, the BT tick rate and the BT XML used by the control node."

  - id: s-bt
    title: Behavior Tree contribution
    short: BT contribution
    blocks:
      - type: prose
        md: "The current tree uses a root **Fallback** node to encode priority-based decisions. The high-priority branch checks whether the VLM-reported hazard level meets the configured threshold and then runs RecoveryBehavior. If no hazard branch succeeds, the target branch checks target visibility and runs PursueTarget with the VLM-provided bounding box. If neither applies, DefaultBehavior runs."
      - type: table
        label: Table 1
        caption: Behavior Tree elements
        wide: true
        head: [Element, Description]
        rows:
          - { item: Custom conditions, cells: ["IsHazardous and IsTargetVisible read structured VLM state from BT input ports and decide whether higher-priority branches run"] }
          - { item: Custom actions, cells: ["RecoveryBehavior, PursueTarget and DefaultBehavior are the current action leaves. The implementation logs the selected behavior; it does not claim a full robot actuation stack"] }
          - { item: Blackboard bridge, cells: ["The ROS subscriber callback writes scene state, hazard level, target visibility, target bounding box, confidence and description into the BT blackboard"] }
          - { item: Configurable XML, cells: ["The tree is loaded from YAML as XML in BehaviorTree.CPP format 4, so the decision structure can be changed from configuration"] }

  - id: s-runtime
    title: Runtime pipeline
    blocks:
      - type: prose
        md: |
          A ROS&nbsp;2 launch file starts both composable nodes inside a multi-threaded component container with intra-process communication. The provided tmux setup can start the local llama.cpp server, launch VISTA and optionally play a recorded rosbag.

          The VLM request uses the configured system prompt to ask for structured JSON: scene state, hazard level, target visibility, target bounding box, confidence and a natural-language description. That structured message is the contract between the slow perception loop and the fast BT loop.

  - id: s-credits
    title: Role and credits
    short: Credits
    blocks:
      - type: prose
        md: |
          My work covers the Behavior Tree part of VISTA: BT architecture and implementation support. It is not authorship of the full VISTA project or of the VLM perception framework, and I do not present myself as the project author.

          VISTA (Visual Intelligence State-Tree Architecture) is ideated and maintained by Andrea Ricciardi. The repository's package metadata lists Andrea Ricciardi as maintainer, and its licence and notice files attribute copyright and software development to Andrea Ricciardi. Third-party components referenced by the repository include Gemma, BehaviorTree.CPP, llama.cpp, cpp-httplib and nlohmann/json, under their respective licences.
---
