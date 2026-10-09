---
title: EMG-based muscle activity detection
slug: emg-bachelor-thesis
order: 6
urlPath: /pages/bachelor_thesis_project.html
publish: true
layout: layouts/project.njk
status: Completed
summary: "Studying and processing electromyographic (EMG) signals to correlate muscle activation with applied force during upper-limb exercises."
lead:
  - label: My contribution
    text: "author of the bachelor's thesis."
contribution:
  lead: "Author of the bachelor's thesis."
index:
  name: "EMG acquisition, B.Sc. thesis"
  context: University of Padova
  period: "2021"
evidence: { hardware: doc, field: none, experimental: doc, simulation: none, publication: none, software: none }
facts:
  - { term: My role, value: "Author, Bachelor's thesis", wide: true }
  - { term: Context, value: "B.Sc. Mechatronics Engineering, University of Padova", wide: true }
  - { term: Status, value: Completed }
  - { term: Hardware, value: "MyoWare EMG sensors, surface electrodes, Arduino Due", wide: true }
opening:
  type: none

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: "The project follows the EMG signal from the muscle to the microcontroller: amplification, filtering, digitization and visualization. The aim is to understand how muscle contraction intensity can be monitored with MyoWare sensors, an Arduino Due and real-time plotting in Processing."
      - type: table
        label: Table 1
        caption: Key features, as documented
        wide: true
        head: [Feature, Description]
        rows:
          - { item: MyoWare EMG sensor, cells: ["All-in-one analog signal processing (amplification, rectification, integration) with a direct signal output"] }
          - { item: "Arduino Due (12-bit ADC)", cells: ["Real-time analog-to-digital conversion for high-resolution acquisition"] }
          - { item: Signal analysis, cells: ["Feature extraction: RMS, ARV, zero-crossings, slope changes and variance"] }
          - { item: Muscle groups studied, cells: ["Biceps brachii, triceps brachii and flexor carpi ulnaris"] }

  - id: s-arch
    title: System architecture
    blocks:
      - type: sequence
        label: Signal chain
        items:
          - { name: Surface electrodes }
          - { name: MyoWare sensor }
          - { name: Arduino Due }
          - { name: Serial link to PC }
          - { name: Processing visualization }
        caption: "**Fig. 1** Signal chain: the MyoWare sensor feeds preprocessed analog signals to the Arduino Due, which sends the data over serial to a PC running Processing for real-time visualization and analysis."

  - id: s-results
    title: Results
    blocks:
      - type: prose
        md: "The collected signals showed clear activation patterns during weightlifting tasks. Feature extraction confirmed an increase in EMG envelope amplitude with applied force, although a linear correlation was not strictly observable. Baseline noise stayed within 1–3.5&nbsp;mV, and signal integrity was checked through frequency and offset inspections."

  - id: s-tech
    title: Technologies
    blocks:
      - type: table
        label: Table 2
        caption: Technologies used
        wide: true
        head: [Area, Technology]
        rows:
          - { item: Signal acquisition, cells: ["MyoWare EMG sensors, surface electrodes, analog pre-processing"] }
          - { item: Microcontroller, cells: ["Arduino Due with 12-bit ADC for real-time digitization and sampling"] }
          - { item: Visualization, cells: ["Custom Processing interface for live signal plotting and monitoring"] }
          - { item: Signal processing, cells: ["Low-pass filters, differential amplification, baseline noise analysis"] }

  - id: s-refs
    title: Resources
    blocks:
      - type: refs
        items:
          - { n: 1, doc: bsc-thesis, label: "Thesis document: hardware, signal analysis methods and experimental validation" }
---
