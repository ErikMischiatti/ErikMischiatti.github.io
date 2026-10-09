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

featured:
  order: 4
  tier: secondary
  layout: secondary
  selectedName: Robotic cable manipulation
  selectedSummary: Experiments, code
  meta:
    - { text: "Master's thesis, TU Wien" }
    - { text: "Apr – Oct 2024" }
  what: "One kinesthetic demonstration, encoded as DHB invariant trajectories, reused across board layouts by a Franka Emika Panda under Behavior Tree execution."
  contribution: "Author of the thesis."
  evidenceWords: "Experimental validation, software implementation."
  evidenceText: "Three scenarios: clip insertion shown; full modular path partially successful, limited by joint constraints and cable slack; new board layouts handled."
  pageLabel: Thesis project page
  caseLabel: Thesis case study
  media:
    - { src: pics/photo_1_2024-10-03_15-53-10.jpg, widths: [800, 1100], sizes: "(max-width: 600px) 64vw, 28vw", alt: "Camera view of the board with ArUco markers and detected poses overlaid." }
    - { src: src/media/thesis/clip-45.jpg, widths: [480, 960], sizes: "(max-width: 600px) 36vw, 16vw", alt: "Red cable routed through printed clips on the perforated board." }
  mediaCaption: "Pose estimation on the board, and a cable routed through printed clips."

opening:
  type: photos
  figures:
    - { src: pics/photo_1_2024-10-03_15-53-10.jpg, widths: [800, 1100], sizes: "(max-width: 860px) 60vw, 25vw", alt: "Camera view of the board with ArUco markers and detected poses overlaid." }
    - { src: src/media/thesis/clip-45.jpg, widths: [480, 960], sizes: "(max-width: 860px) 40vw, 17vw", alt: "Red cable routed through printed clips on the perforated board." }
  caption: "**Fig. 1** Perception input: ArUco markers on the modular board, with the estimated poses overlaid on the camera view. **Fig. 2** The task setting: a cable routed through 3D-printed clips on the board."

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
        md: "**What Figs. 3–7 show.** The generalization step of the process above, applied to five motion steps of the clip task. Each plot shows a demonstrated trajectory (blue) and the trajectory generated from it for a new start and goal (red); points 1–2 mark the original start and goal, points 3–4 the new ones. The plots illustrate how a demonstration is re-targeted; they are not measurements of task success. 640 × 480, no sound."
      - type: videos
        columns: 2
        items:
          - { id: cap-look, src: /media/thesis/look.mp4, poster: /media/thesis/look-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 3** Looking for the clip." }
          - { id: cap-grab, src: /media/thesis/grabclip.mp4, poster: /media/thesis/grabclip-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 4** Grabbing the clip." }
          - { id: cap-insert, src: /media/thesis/insert.mp4, poster: /media/thesis/insert-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 5** Inserting the cable." }
          - { id: cap-close, src: /media/thesis/closeclip.mp4, poster: /media/thesis/closeclip-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 6** Closing the clip." }
          - { id: cap-unlock, src: /media/thesis/unlockclip.mp4, poster: /media/thesis/unlockclip-poster.webp, width: 640, height: 480, ratio: "4 / 3", caption: "**Fig. 7** Unlocking the clip." }

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
