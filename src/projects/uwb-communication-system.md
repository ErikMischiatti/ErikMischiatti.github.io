---
title: UWB Communication System for Modular UAVs
slug: uwb-communication-system
order: 2
urlPath: /pages/uwb_project.html
publish: true
layout: layouts/project.njk
status: Completed, published 2024
summary: "A modular communication system for drones using ultra-wideband (UWB) technology. Real-time links between the flight controller and the ESCs replace the wiring, so rotor modules can attach to the payload itself."
lead:
  - label: My contribution
    text: "one of four student contributors, and third author of the IEEE CASE 2024 paper."
contribution:
  lead: "One of four student contributors. Third author of the IEEE CASE 2024 paper."
index:
  name: UWB modular UAV
  context: "EES Lab, University of Trento"
  period: "2024"
evidence: { hardware: doc, field: doc, experimental: doc, simulation: none, publication: doc, software: none }
facts:
  - { term: My role, value: "One of four student contributors; third author of the paper", wide: true }
  - { term: Context, value: "Embedded Systems course, EES Lab, University of Trento", wide: true }
  - { term: Research team, value: "Prof. Davide Brunelli (coordinator), Prof. Daniele Fontanelli, Dr. Luca Santoro, Dr. Matteo Nardello", wide: true }
  - { term: Student contributors, value: "Erik Mischiatti, Alessandro Assirelli, Paolo Furia, Marco Perini", wide: true }
  - { term: Basis, value: "University of Trento patent “Wireless Control for Reconfigurable and/or Frameless Autonomous Vehicles”", wide: true }
  - { term: Status, value: "Completed, published 2024" }

featured:
  order: 2
  tier: primary
  layout: media-end
  selectedName: UWB Communication System
  selectedSummary: Flight, paper
  meta:
    - { text: "EES Lab, University of Trento" }
    - { text: "Completed, published 2024" }
  what: "Ultra-wideband links replace the wires between flight controller and ESCs, so rotor modules can attach to the payload itself."
  builtWith: "Decawave DWM1001C, 6489.6&nbsp;MHz channel, up to 6.8&nbsp;Mbps; tri-, quad- and hexacopter layouts"
  contribution: "One of four student contributors. Third author of the IEEE CASE 2024 paper."
  evidenceWords: "Hardware prototype, field test, experimental validation, publication."
  evidenceText: "Outdoor flight; hardware-in-the-loop tests show stable control around a 5&nbsp;ms end-to-end delay."
  caseLabel: UWB case study
  pageLabel: UWB project page
  mediaVideo: { src: /media/uwb/flight-720p.mp4, poster: /media/uwb/flight-poster.webp, width: 1280, height: 720 }
  mediaCaption: "Outdoor flight: rotor modules on a box, no frame. 24&nbsp;s, no sound, 1.5&nbsp;MB."

opening:
  type: photos
  figures:
    - { src: src/media/uwb/detail-43.jpg, widths: [480, 960], sizes: "(max-width: 860px) 100vw, 40vw", alt: "Rotor modules fixed to a box, flying outdoors without a frame, in front of a building." }
  caption: "**Fig. 1** Rotor modules attached to a box, in flight, no frame. Frame from the project's flight video."

sections:
  - id: s-overview
    title: Overview and key features
    short: Overview
    blocks:
      - type: prose
        md: "The project designs and implements a modular communication system for drones using UWB technology. The system enables real-time communication between the flight controller and the ESCs, overcoming the limits of traditional wiring. It is suitable for advanced logistics applications and highly customizable UAV configurations."
      - type: table
        label: Table 1
        caption: Key features, as documented
        wide: true
        head: [Feature, Specification]
        rows:
          - { item: Modular design, cells: ["Supports tricopter, quadcopter and hexacopter setups"] }
          - { item: UWB communication, cells: ["Decawave DWM1001C at 6489.6&nbsp;MHz, 499.2&nbsp;MHz bandwidth, up to 6.8&nbsp;Mbps"] }
          - { item: Latency, cells: ["End-to-end delay within about 5&nbsp;ms for motor control, validated in simulation and real-world tests"] }

  - id: s-arch
    title: System architecture
    blocks:
      - type: prose
        md: "A **master module** captures the PWM signals from the flight controller. Several **slave modules**, each with its own ESC, motor and UWB receiver, reproduce them. The slaves synchronize motor control using PWM triggered by a sync signal from the master."

  - id: s-results
    title: Results
    blocks:
      - type: prose
        md: "Experiments show stable flight despite the wireless delays introduced. Hardware-in-the-loop simulations confirm robust control even around the 5&nbsp;ms delay threshold, consistent with the real-world outcomes."
      - type: video
        id: cap-uwb-flight
        src: /media/uwb/flight-720p.mp4
        poster: /media/uwb/flight-poster.webp
        width: 1280
        height: 720
        caption: "**Fig. 2** Outdoor flight: rotor modules on a box, no frame. 24&nbsp;s, no sound, 1.5&nbsp;MB."

  - id: s-context
    title: "Research context: “Anything is a drone”"
    short: Research context
    blocks:
      - type: prose
        md: |
          Developed within the Embedded Systems Lab at the University of Trento (UniTrento DII), the project explores how any object can become a flying platform using modular, wireless UWB-based propulsion units. The concept removes the traditional frame and cables: the payload itself becomes the drone's structure.

          <ul class="dash">
          <li>Modular plug-and-play propeller units.</li>
          <li>Wireless communication between controller and rotors.</li>
          <li>Dynamic frame concept: the payload becomes the structure.</li>
          <li>Scalable and energy-efficient design for flexible missions.</li>
          </ul>

          Developed within the EES Lab as part of the Embedded Systems course, based on the University of Trento patent “Wireless Control for Reconfigurable and/or Frameless Autonomous Vehicles”.

  - id: s-refs
    title: Publication and resources
    short: Publication
    blocks:
      - type: prose
        md: "Published at the 2024 IEEE International Conference on Automation Science and Engineering (CASE): design and experimental validation of a wireless modular UAV architecture."
      - type: refs
        items:
          - { n: 1, label: "L. Santoro, A. Assirelli, E. Mischiatti, M. Perini, M. Nardello, D. Fontanelli, D. Brunelli. Deconstructing for Superiority: Aristotelian Modularization in UAV Systems. IEEE CASE 2024, pp. 219–224 (IEEE Xplore)", href: "https://ieeexplore.ieee.org/document/10711488" }
          - { n: 2, label: "DOI 10.1109/CASE59546.2024.10711488", href: "https://doi.org/10.1109/CASE59546.2024.10711488" }
          - { n: 3, label: "“Anything is a drone”: research context video (YouTube)", href: "https://www.youtube.com/watch?v=rQPsniFY9L8" }
---
