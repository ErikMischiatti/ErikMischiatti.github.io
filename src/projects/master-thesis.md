---
title: Robotic cable manipulation from demonstration
slug: master-thesis
order: 4
urlPath: /pages/master_thesis_project.html
publish: true
layout: layouts/project.njk
status: Completed
summary: "A master's thesis research prototype for manipulating rigid and deformable objects: one kinesthetic demonstration, encoded as DHB invariant trajectories and combined with vision-based perception, is reused to insert Ethernet cables and interact with modular components."
lead:
  - label: Thesis
    text: "Leveraging Demonstration Learning and Invariant Representations for Modular Assembly and Cable Manipulation."
  - label: My contribution
    text: "author of the thesis."
contribution:
  lead: "Author of the thesis."
index:
  name: "Cable manipulation, M.Sc. thesis"
  context: TU Wien
  period: "2024"
evidence: { hardware: none, field: none, experimental: doc, simulation: none, publication: none, software: doc }
facts:
  - { term: My role, value: "Author, Master's thesis", wide: true }
  - { term: Context, value: "Master's thesis at TU Wien; M.Sc. Mechatronics Engineering, University of Trento", wide: true }
  - { term: Period, value: "Apr – Oct 2024" }
  - { term: Status, value: Completed }
  - { term: Platform, value: "Franka Emika Panda, Intel RealSense D435i, ArUco markers, ROS", wide: true }

# Removed from the homepage featured projects. To feature it again, remove the "# " in front of each line below.
# featured:
#   order: 4
#   tier: secondary
#   layout: secondary
#   selectedName: Robotic cable manipulation
#   selectedSummary: Experiments, code
#   meta:
#     - { text: "Master's thesis, TU Wien" }
#     - { text: "Apr – Oct 2024" }
#   what: "One kinesthetic demonstration, encoded as DHB invariant trajectories, reused across board layouts by a Franka Emika Panda under Behavior Tree execution."
#   contribution: "Author of the thesis."
#   evidenceWords: "Experimental validation, software implementation."
#   evidenceText: "Three scenarios: clip insertion shown; full modular path partially successful, limited by joint constraints and cable slack; new board layouts handled."
#   pageLabel: Thesis project page
#   caseLabel: Thesis case study
#   media:
#     - { src: pics/photo_1_2024-10-03_15-53-10.jpg, widths: [800, 1100], sizes: "(max-width: 600px) 64vw, 28vw", alt: "Camera view of the board with ArUco markers and detected poses overlaid." }
#     - { src: src/media/thesis/clip-45.jpg, widths: [480, 960], sizes: "(max-width: 600px) 36vw, 16vw", alt: "Red cable routed through printed clips on the perforated board." }
#   mediaCaption: "Pose estimation on the board, and a cable routed through printed clips."

# wide: true puts the two photos on a full-width row below the intro (larger; no cropping, each
# photo at its own proportions). Remove it to place them beside the intro again.
opening:
  type: photos
  wide: true
  figures:
    - { src: pics/photo_1_2024-10-03_15-53-10.jpg, widths: [800, 1100, 1400], sizes: "(max-width: 600px) 100vw, 62vw", alt: "Camera view of the board with ArUco markers and detected poses overlaid.", caption: "**Fig. 1** Perception input: ArUco markers on the modular board, with the estimated poses overlaid on the camera view." }
    - { src: pics/photo_4_2024-10-03_15-53-10.jpg, widths: [480, 960], sizes: "(max-width: 600px) 100vw, 27vw", alt: "Red cable routed through printed clips on the perforated board.", caption: "**Fig. 2** The task setting: a cable routed through 3D-printed clips on the board." }

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: |
          The thesis develops a documented robotic research prototype for manipulating rigid and deformable objects. The approach combines kinesthetic demonstration, invariant trajectory representations (DHB) and vision-based perception to insert Ethernet cables and interact with modular components under real-world constraints.

          The public summary should be read as **partially reproducible**: results depend on local hardware, calibration and recorded data.

  - id: s-approach
    title: Approach and system architecture
    short: Approach
    blocks:
      - type: table
        label: Table 1
        caption: Key elements of the approach
        wide: true
        head: [Element, Description]
        rows:
          - { item: Invariant representation (DHB), cells: ["Encodes motion in a bidirectional Denavit–Hartenberg space, so it can be reproduced across spatial configurations"] }
          - { item: Vision-based perception, cells: ["Intel RealSense depth sensing and ArUco markers provide 6D pose estimation and 3D awareness of the scene"] }
          - { item: Modular environment, cells: ["A board inspired by NIST benchmarks, to evaluate task generalization across reconfigurable layouts"] }
          - { item: Learning from demonstration, cells: ["Kinesthetic teaching to program cable-manipulation skills"] }
      - type: prose
        md: "The robotic platform integrates a **Franka Emika Panda** arm, an **Intel RealSense D435i** camera and a ROS-based control system. A perception module estimates the 6D pose of target objects, while DHB encodes the trajectory in a space-invariant form. Execution is coordinated through Behavior Trees and ROS action nodes."
      # Figures from the original page (pics/SystemDesign.png, pics/SetupConfiguration.png), flattened on white in src/media/thesis/.
      - type: figure
        src: src/media/thesis/system-design.png
        widths: [768]
        sizes: "(max-width: 860px) 100vw, 768px"
        plate: true
        maxWidth: 820px
        alt: "System block architecture in three phases: teaching (operator guides the robot), encoding (demonstration trajectory, time and velocity, pre-processing, DHB) and reproducing (camera, detection, Behavior Trees, planner, Cartesian impedance controller, robot)."
        caption: "**Fig. 3** System architecture: teaching, encoding and reproducing phases."
      - type: figure
        src: src/media/thesis/setup-configuration.png
        widths: [750]
        sizes: "(max-width: 860px) 100vw, 750px"
        plate: true
        maxWidth: 820px
        alt: "Experimental setup: the robotic arm system with the RealSense camera, and the assembly board system with ArUco markers, the camera view and the shared base frame."
        caption: "**Fig. 4** Experimental setup configuration: robotic arm system, camera view and assembly board system, linked through the base frame."

  - id: s-results
    title: Experimental scenarios and results
    short: Results
    blocks:
      - type: table
        label: Table 2
        caption: Three experimental scenarios, as reported
        wide: true
        head: [Scenario, Result]
        rows:
          - { item: Clip insertion, cells: ["High-precision cable insertion into modular clips using learned trajectories"] }
          - { item: Full modular path, cells: ["Partial success in executing complex sequences across several modules, limited by joint constraints and cable slack"] }
          - { item: Board reconfiguration, cells: ["The system adapted to new board layouts, confirming the DHB invariance properties"] }
      # Figures from the original page (pics/clip_scenario.png, pics/fullpath_scenario.png), flattened on white in src/media/thesis/.
      - type: figure
        src: src/media/thesis/clip-scenario.png
        widths: [750]
        sizes: "(max-width: 860px) 100vw, 750px"
        plate: true
        maxWidth: 820px
        alt: "Clip insertion scenario: forward sequence (Look, Get_cable, Create_pick_goal, Approach_cable, Insert_clip, Grab_clip, Close_clip, Lock_clip up and down) and inverse sequence (Alignment, Grab_clip, Unlock_clip, Look, Get_cable, Create_pick_goal, Approach_cable, Open_clip), beside the board with one clip."
        caption: "**Fig. 5** Clip insertion scenario: forward and inverse action sequences, and the board layout."
      - type: figure
        src: src/media/thesis/fullpath-scenario.png
        widths: [750]
        sizes: "(max-width: 860px) 100vw, 750px"
        plate: true
        maxWidth: 820px
        alt: "Full modular path scenario: a longer action sequence (Look, Get_cable, Create_pick_goal, Approach_cable, Approach_tube, Insert_tube, Step_back, Push, Step_back, Push, Approach_cable, continuing), beside the board with a cable routed through several modules."
        caption: "**Fig. 6** Full modular path scenario: the action sequence across several modules, and the board layout."
      - type: note
        md: "The repository is a research prototype: results, behavior and replayability depend on local hardware, calibration and recorded data."
      - type: paths
        groups:
          - title: Process
            steps:
              - "Record demonstrations of the task through kinesthetic teaching."
              - "Filter the trajectory data to reduce noise and improve stability."
              - "Encode the demonstrations with the DHB invariant representation."
              - "Generalize the trajectories to new configurations."
          - title: Advantage
            steps:
              - "A single demonstration can be reused in different spatial setups, thanks to the invariance properties of DHB."
      - type: note
        md: "**What Figs. 7–11 show.** The generalization step of the process above, applied to five motion steps of the clip task. Each plot shows a demonstrated trajectory (blue) and the trajectory generated from it for a new start and goal (red); points 1–2 mark the original start and goal, points 3–4 the new ones. The plots illustrate how a demonstration is re-targeted; they are not measurements of task success. 640 × 480, no sound."
      - type: videos
        columns: 2
        animate: true   # GIF-like: autoplay, muted, loop, no controls. Remove for normal video players.
        items:
          - { id: cap-look, src: /media/thesis/look.mp4, poster: /media/thesis/look-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 7** Looking for the clip." }
          - { id: cap-grab, src: /media/thesis/grabclip.mp4, poster: /media/thesis/grabclip-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 8** Grabbing the clip." }
          - { id: cap-insert, src: /media/thesis/insert.mp4, poster: /media/thesis/insert-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 9** Inserting the cable." }
          - { id: cap-close, src: /media/thesis/closeclip.mp4, poster: /media/thesis/closeclip-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 10** Closing the clip." }
          - { id: cap-unlock, src: /media/thesis/unlockclip.mp4, poster: /media/thesis/unlockclip-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 11** Unlocking the clip." }

  - id: s-tech
    title: Technologies
    blocks:
      - type: table
        label: Table 3
        caption: Technologies used
        wide: true
        head: [Area, Technology]
        rows:
          - { item: Robotics, cells: ["Franka Emika Panda arm for motion execution and kinesthetic teaching"] }
          - { item: Vision, cells: ["Intel RealSense D435i depth camera and ArUco markers for 6D pose estimation"] }
          - { item: Software, cells: ["ROS, Python, OpenCV and custom DHB libraries for planning and control"] }
          - { item: Modular hardware, cells: ["3D-printed boards and inserts for flexible, reconfigurable testing"] }

  - id: s-conclusions
    title: Conclusions and future work
    short: Conclusions
    blocks:
      - type: prose
        md: |
          The thesis explores whether invariant representations can support tasks such as cable insertion and modular assembly. DHB supports trajectory generalization across configurations; future work would need stronger robustness for deformable objects, occlusions and calibration changes.

          <ul class="dash">
          <li>Bimanual coordination for advanced wire routing.</li>
          <li>Better visual tracking and tactile feedback.</li>
          <li>Real-time pose refinement and learning for new parts.</li>
          </ul>

  - id: s-refs
    title: Resources
    blocks:
      - type: refs
        items:
          - { n: 1, label: "Master-Thesis-Project repository (GitHub)", href: "https://github.com/ErikMischiatti/Master-Thesis-Project" }
          - { n: 2, doc: msc-thesis, label: "Thesis document" }
---
