---
# Restyled BT page: AWAITING EMPLOYER APPROVAL. Production keeps serving the existing public page
# byte-for-byte (publish: false, legacy: true) until src/_data/approvals.json records an explicit
# approval; the build and tools/check-output.mjs fail otherwise. Every sentence on the page is taken
# from the existing public page (pages/bt_mission_manager.html), lightly edited for the layout. The
# homepage unit also uses the public homepage card and the public CV. Do not add anything else.
title: Behavior Tree Mission Manager
slug: bt-mission-manager
order: 3
urlPath: /pages/bt_mission_manager.html
publish: false
legacy: true
layout: layouts/project.njk
status: Active integration
summary: "ROS&nbsp;1 / C++ mission orchestration and runtime safety supervision for an autonomous UAV, built on modular Behavior Trees."
contribution:
  lead: "Develop and test BehaviorTree.CPP logic for preflight, takeoff, pre-intercept, interceptor, post-intercept, landing, and finalization phases."
index:
  name: BT Mission Manager
  context: "EAGLE.ONE, FEE CTU in Prague"
  period: "2025–"
evidence: { hardware: none, field: none, experimental: none, simulation: doc, publication: none, software: doc }
facts:
  - { term: Project, value: EAGLE mission orchestration, wide: true }
  - { term: Status, value: "Under active integration and validation", wide: true }
  - { term: Stack, value: "ROS&nbsp;1 Noetic, C++, BehaviorTree.CPP, MRS UAV System, catkin, nodelets, ROS services and actions, blackboard state model, YAML configuration, GoogleTest, Gazebo simulation, MQTT bridge", wide: true }
opening:
  type: none

featured:
  order: 3
  tier: text-led
  layout: text-led
  selectedName: BT Mission Manager
  selectedSummary: Software, simulation
  meta:
    - { text: "EAGLE.ONE, FEE CTU in Prague, with Fly4Future" }
    - { text: "Active integration, since Oct 2025" }
  what: "ROS&nbsp;1 mission-level supervisor for an interceptor UAV, built around modular BehaviorTree.CPP pipelines, mission-state reporting, service-gated runtime control, external target guidance, and ground-station/MQTT integration."
  builtWith: "ROS&nbsp;1 Noetic, C++, BehaviorTree.CPP, MRS UAV System, Gazebo simulation, GoogleTest"
  contribution: "Develop and test BehaviorTree.CPP logic for preflight, takeoff, pre-intercept, interceptor, post-intercept, landing, and finalization phases. (CV)"
  evidenceWords: "Software implementation, simulation."
  evidenceText: "Verification is layered. Simulation and software tests deliberately distinguish what is verified in software from what requires physical flight validation."
  caseLabel: Mission Manager case study
  pageLabel: Mission Manager project page
  sequence:
    label: Mission phase sequence
    items: [Preflight, Takeoff, Pre-Intercept, Interception, Post-Intercept, Landing, Finalization]
    caption: "Mission phase sequence, as published on the project page. Each phase is an independent behavior tree."

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: |
          The Mission Manager is the high-level orchestration layer of an autonomous UAV mission. It decides what the mission should do next: sequencing mission phases, enforcing runtime preconditions before safety-relevant actions, supervising control authority while the vehicle is flying, coordinating payload and guidance inputs, and reporting mission state to operator interfaces. Low-level flight control stays deliberately outside its scope.

          The guiding design goal is a mission layer that remains reactive and preemptible at all times. It can interrupt itself safely when the runtime conditions it depends on stop holding, hand control back to the operator, and never resume autonomous execution without an explicit human decision.

  - id: s-arch
    title: Architecture and subsystem ownership
    short: Architecture
    blocks:
      - type: prose
        md: |
          The mission is expressed as a top-level orchestration tree that selects the active execution policy and drives phase transitions, plus a set of modular mission-phase trees covering preflight preparation, takeoff, pre-intercept behavior, the interception phase, post-intercept handling, landing, and finalization. A dedicated operator-driven tree covers manual execution. Keeping each phase in its own tree means a phase can be reasoned about, tested, and changed without destabilizing the rest of the mission.

          A shared runtime state model carries mission context between tree nodes, so orchestration decisions read from one coherent view of the mission instead of from scattered node-local variables. Runtime services expose operator control and mission gates, and a mission-state publisher exposes phase and status to operator interfaces, logs, and monitoring.

          The most important architectural property of the system is ownership. Each concern has exactly one authoritative owner, and the Mission Manager is deliberately not that owner for anything it does not decide. It coordinates subsystems it does not own, issuing mission-level commands and consuming reported state rather than maintaining a competing copy of it.
      - type: table
        label: Table 1
        caption: Subsystem ownership
        wide: true
        head: [Subsystem, Owns]
        rows:
          - { item: Mission Manager, cells: ["Mission-level sequencing, phase transitions, execution policy, and precondition gating. It decides when something should happen and under what conditions."] }
          - { item: UAV Autonomy Stack, cells: ["Flight-control execution, state estimation, and trajectory tracking. The mission layer requests outcomes and observes results; it never reimplements flight control."] }
          - { item: Payload Subsystem, cells: ["Payload hardware and runtime state. The Mission Manager coordinates mission-level timing and consumes reported state rather than keeping a parallel copy that could drift."] }
          - { item: Shared Contracts, cells: ["Cross-subsystem message and service contracts live in a shared definition layer, making integration boundaries explicit and versioned instead of implicit."] }
          - { item: Ground Interface, cells: ["A bridge layer carries configuration and status between ground-side systems and the ROS mission layer, keeping operator tooling decoupled from mission internals."] }
          - { item: Single source of truth, cells: ["Where a subsystem is authoritative, the mission layer treats its reported state as truth. This avoids the classic integration failure where two components disagree about reality."] }

  - id: s-capabilities
    title: Key capabilities
    short: Capabilities
    blocks:
      - type: table
        label: Table 2
        caption: Key capabilities
        wide: true
        head: [Capability, Description]
        rows:
          - { item: Execution policies, cells: ["Autonomous, supervised, and manual policies let the same mission logic serve repeatable automation, operator-confirmed validation, and fully hand-driven runs."] }
          - { item: Control-authority supervision, cells: ["Loss of autonomous control authority during an active mission is detected at runtime and preempts autonomous execution safely."] }
          - { item: Precondition gating, cells: ["Safety-relevant actions validate their live runtime preconditions at the moment of execution rather than trusting state captured earlier in the mission."] }
          - { item: Reactive preemption, cells: ["The tree stays reactive throughout: a running branch can be interrupted when its supporting conditions stop holding, instead of blocking until completion."] }
          - { item: Deterministic decision logic, cells: ["Safety-critical decisions are computed by small, side-effect-free modules that are independent of the ROS runtime and testable in isolation."] }
          - { item: External guidance, cells: ["External localization feeds can be integrated as mission-level guidance and gating inputs before onboard sensing takes over."] }
          - { item: Payload coordination, cells: ["Payload interaction is sequenced by mission phase and gated on live preconditions, while hardware truth remains owned by the payload subsystem."] }
          - { item: Mission-state reporting, cells: ["Structured runtime reporting exposes mission phase and interruption status for operator dashboards, logs, and integration diagnostics."] }

  - id: s-flow
    title: Mission flow
    blocks:
      - type: prose
        md: "Autonomous and supervised runs follow the same modular phase sequence, with each phase implemented as an independent tree. The active execution policy determines how much of each phase runs without operator input, and the operator-driven path remains available wherever the selected policy allows it."
      - type: sequence
        label: Mission phase sequence
        roles: true
        items:
          - { name: Preflight, role: Readiness gates }
          - { name: Takeoff, role: Handoff to flight stack }
          - { name: Pre-Intercept, role: Guided positioning }
          - { name: Interception, role: Supervised runtime states }
          - { name: Post-Intercept, role: Payload coordination }
          - { name: Landing, role: Policy-driven descent }
          - { name: Finalization, role: Cleanup and closure }
        caption: "**Fig. 1** Mission phase sequence. Each phase is an independent tree, so phases can be developed, gated, and validated without destabilizing the surrounding mission. Every phase executes under the active policy: autonomous, supervised, or manual."

  - id: s-safety
    title: Runtime safety and operator takeover
    short: Runtime safety
    blocks:
      - type: prose
        md: |
          A mission layer that only handles the nominal path is not a safe mission layer. A substantial part of this work went into making the system behave correctly when its assumptions stop holding mid-flight.

          The Mission Manager supervises whether it still holds autonomous control authority over the vehicle. If that authority is lost during an active mission, autonomous execution is preempted rather than allowed to continue issuing commands into a vehicle it no longer effectively controls. The system transitions into its existing manual/paused control policy, so takeover lands in a control mode the operator already understands instead of an ad-hoc emergency state.

          Restoration of control authority does not automatically resume autonomous execution. The system holds, and resuming is an explicit operator decision. Automatic resumption would mean a vehicle silently reactivating an autonomous mission at a moment the operator did not choose, which is precisely the failure mode this mechanism exists to prevent.
      - type: sequence
        label: Control-authority takeover behavior
        roles: true
        items:
          - { name: Autonomous, role: Mission executing }
          - { name: Preempted, role: "Authority lost: autonomous execution stopped" }
          - { name: Manual / Paused, role: "Policy switch: operator holds control" }
        caption: "**Fig. 2** Control-authority supervision. Returning to autonomous execution requires an explicit operator decision; restored authority never auto-resumes the mission. The return path is deliberately gated on a human decision rather than on the condition simply becoming healthy again."
      - type: prose
        md: |
          **Runtime precondition enforcement.** Safety-relevant mission actions validate their preconditions against live runtime state at the moment they would act, not against state captured earlier in the mission. A critical action is held when its required conditions are no longer valid, the tree stays reactive and preemptible while it waits, and missing or invalid runtime inputs never implicitly authorize the action. Absence of evidence is treated as a reason to hold, not as permission to proceed.

          **Design under uncertainty.** Some external hardware actions do not return feedback sufficient to prove that physical actuation actually occurred. Rather than pretending otherwise, the software uses bounded best-effort command dispatch and conservative status semantics, and keeps an explicit distinction between *a command was acknowledged* and *a physical outcome was confirmed*. The mission layer never reports the second when it only observed the first.

          **Deterministic decision modules.** Safety-critical runtime decisions were extracted out of callback-heavy ROS code into small decision modules that are side-effect-free, independent of the ROS runtime, and independently unit-testable. This turns behavior that previously required a full running stack to observe into logic that can be verified deterministically as a pure function of its inputs.

  - id: s-guidance
    title: External guidance and interceptor supervision
    short: External guidance
    blocks:
      - type: prose
        md: |
          External localization feeds can be integrated as mission-level guidance and gating inputs before onboard sensing takes over. The Mission Manager treats such feeds as mission inputs subject to validity checks: they influence phase progression and gating decisions, but sensing and flight responsibilities remain in their owning subsystems, and guidance that is unavailable or no longer valid does not silently keep driving mission decisions.

          The interception phase performs high-level runtime state supervision. It tracks the phase's progress under the operating policy in effect, decides when the phase should end, and handles operator-driven and autonomous variants of the same phase through configurable policies. It does not implement tracking or flight control, and the mission layer's role is confined to supervision and mission-level exits.

  - id: s-testing
    title: Testing and validation
    short: Testing
    blocks:
      - type: prose
        md: "Verification is layered, and the layers exist because each one catches a class of defect the others cannot. The overall goal is to move as much safety-relevant behavior as possible into tests that are deterministic and cheap to run."
      - type: table
        label: Table 3
        caption: Verification layers
        wide: true
        head: [Layer, Purpose]
        rows:
          - { item: Pure-logic tests, cells: ["Because safety-related decisions live in ROS-independent modules, they are exercised directly as functions over their inputs, including edge cases that are difficult or unsafe to produce on a real vehicle."] }
          - { item: Component tests, cells: ["A purpose-built fake surrounding stack makes runtime events deterministic, so integration behavior can be exercised without launching the complete vehicle stack and without waiting on real timing."] }
          - { item: Full-stack simulation, cells: ["Integrated mission scenarios validate the interaction between Behavior Trees, runtime supervision, operator policy transitions, and mission actions in a complete simulated system."] }
          - { item: Instrumented negative assertions, cells: ["Selected safety tests instrument the service and action boundaries so a test can prove that an unsafe action was never issued, rather than inferring absence from log output."] }
      - type: prose
        md: "Most safety requirements in this system are statements about what must not happen: a critical action must not fire while its preconditions are invalid, an autonomous mission must not resume on its own. Asserting that something did not occur by reading logs is weak evidence. Instrumenting the boundary where the action would leave the process turns that into a direct, positive check."
      - type: note
        md: "**Validation limits.** Simulation and software tests deliberately distinguish what is verified in software from what requires physical flight validation. Timing, actuation, and environmental behavior on real hardware are not claimed to be proven by simulation."

  - id: s-observability
    title: Observability and mission state
    short: Observability
    blocks:
      - type: prose
        md: "Structured mission-state reporting is the system's primary observability surface, and it was extended to represent safety-related interruptions rather than only nominal progress."
      - type: steps
        items:
          - "**Phase is preserved across interruption.** When execution is interrupted, the mission phase reached is retained instead of being discarded or overwritten."
          - "**Interruption is reported separately.** Interruption status is exposed as its own dimension of the mission state, not folded into the phase value."
          - "**Operator context survives.** Operator interfaces retain a clear picture of where a mission was interrupted, which is what an operator needs in order to decide whether and how to resume."
          - "**Only observable facts are reported.** Reporting states what the system actually observed and deliberately avoids asserting unverified causes or unconfirmed hardware outcomes."
      - type: prose
        md: "An observability layer that overstates confidence is worse than one that reports less, because operators calibrate their trust on it."

  - id: s-landing
    title: Landing and finalization
    short: Landing
    blocks:
      - type: prose
        md: "The closing mission stages coordinate post-intercept handling, landing, and mission closure at the orchestration level. Landing behavior follows the active execution policy in the same way earlier phases do, so an operator-driven run and an autonomous run share one code path rather than diverging into a separate shutdown flow. Finalization brings the mission to a defined terminal state and closes out mission-state reporting, so a completed mission and an interrupted one are both externally distinguishable rather than simply going quiet."

  - id: s-publication
    title: Publication note
    blocks:
      - type: note
        md: "This page describes public high-level architecture and engineering rationale only. It intentionally omits interface and topic names, internal state identifiers, configuration keys, operational and timing parameters, deployment and flight procedures, simulator-specific test hooks, hardware mechanism details, and any private infrastructure references. Diagrams on this page are abstract representations authored for publication and do not reproduce internal mission logic."
---
