---
title: RTK Base Station
slug: rtk-base-station
order: 1
urlPath: /pages/rtk_base_station.html
publish: true
layout: layouts/case-study.njk
status: Version I complete, Version II in progress
summary: "A portable GNSS reference station. It surveys its own position at power-on and broadcasts RTCM corrections over LoRa. The aim is centimetre-level RTK positioning for drones and rovers nearby."
lead:
  - label: My contribution
    text: "hardware selection, enclosure design and field deployment. The mechanical design adapts an open GNSS base station by Burks Builds; the adaptation covers the receiver integration, the power system and the radio."
contribution:
  lead: "Hardware selection, enclosure design, field deployment."
index:
  name: RTK Base Station
  context: null
  period: null
evidence: { hardware: doc, field: rep, experimental: none, simulation: none, publication: none, software: none }
facts:
  - { term: My role, value: "Hardware selection, enclosure design, field deployment", wide: true }
  - { term: Design basis, value: "Enclosure adapted from the Burks Builds GNSS base station prototype [[2]](#ref-2)", wide: true }
  - { term: Status, value: "Version I complete. Version II in progress.", wide: true }

featured:
  order: 1
  tier: primary
  layout: media-start
  selectedSummary: Hardware, field use
  meta:
    - { text: "Version I complete, Version II in progress" }
  what: "A portable GNSS reference station. It runs Survey-In at power-on and broadcasts RTCM corrections over LoRa, designed for centimetre-level RTK positioning of drones and rovers."
  builtWith: "Here4 Base (u-blox F9P), LoRa E220 at 900&nbsp;MHz, 4&nbsp;×&nbsp;18650 pack, three-part printed enclosure"
  contribution: "Hardware selection, enclosure design, field deployment. Enclosure adapted from an open design by Burks Builds."
  evidenceWords: "Hardware prototype. Field test, reported."
  evidenceText: "Field use with drones is stated; no measurements are published."
  caseLabel: RTK case study
  pageLabel: RTK project page
  media:
    - { src: src/media/rtk/cad.jpg, plate: true, widths: [480, 810], sizes: "(max-width: 860px) 100vw, 34vw", alt: "Exploded CAD view of the three-part enclosure: antenna mount, battery section, electronics case." }
    - { src: src/media/rtk/tripod-45.jpg, widths: [360, 720], sizes: "(max-width: 600px) 50vw, 22vw", alt: "Assembled base station with GNSS antenna dome, mounted on a tripod in a lab." }
  mediaCaption: "Exploded CAD view of the enclosure, and the assembled Version I on its tripod."

opening:
  type: photos
  figures:
    - { src: src/media/rtk/cad.jpg, plate: true, widths: [480, 810], sizes: "(max-width: 860px) 60vw, 25vw", alt: "Exploded CAD view of the RTK base station: antenna dome, battery section, electronics case." }
    - { src: src/media/rtk/tripod-45.jpg, widths: [360, 720], sizes: "(max-width: 860px) 40vw, 17vw", alt: "Assembled base station with GNSS antenna dome, on a tripod." }
  caption: "**Fig. 1** Exploded CAD view: antenna mount, battery and charger, receiver and radio. **Fig. 2** Version I, assembled on its tripod."

sections:
  - id: s-context
    title: Context and design intent
    short: Context and design intent
    blocks:
      - type: prose
        md: |
          An RTK base station is a GNSS receiver held at a fixed position. It broadcasts correction data so that a moving receiver nearby, on a drone or a rover, can resolve its own position more precisely. The engineering objective, as stated on the project page, is **drone-grade, centimetre-level positioning**. That is the design target. What the published material shows is set out under Integration and testing.

          This unit is built to be carried and set up in the field. The design features, as documented:

          <ul class="dash">
          <li><strong>Portable.</strong> Three printed parts with a standard tripod thread underneath.</li>
          <li><strong>Self-contained power.</strong> Four 18650 cells; runs while charging over USB-C; battery status visible through a window in the case.</li>
          <li><strong>Automatic start.</strong> An Arduino Nano triggers Survey-In on the receiver at power-on.</li>
          <li><strong>Long-range correction link.</strong> LoRa at 900&nbsp;MHz with an external antenna.</li>
          </ul>
      - type: note
        md: "No formal requirements were published. The list records the design as built, not a specification it was tested against."

  - id: s-arch
    title: System architecture
    blocks:
      - type: drawing
        title: RTK base station, power and data paths
        wide: drawings/power-data-wide.svg
        narrow: [drawings/data-narrow.svg, drawings/power-narrow.svg]
        caption: "**Fig. 3** Power and data paths, redrawn from the functional diagram on the project page. Heavy line: power. Dashed line: data, RF and the switch signal. All modules share ground. On narrow screens the drawing splits into its two paths."
      - type: paths
        groups:
          - title: Data path
            steps:
              - "Antenna to Here4 Base over 30&nbsp;cm coax, TNC to SMA."
              - "At power-on the Nano starts Survey-In over UART."
              - "Here4 Base streams RTCM over a 3.3&nbsp;V UART link to the E220."
              - "The E220 broadcasts the corrections at 900&nbsp;MHz."
          - title: Power path
            steps:
              - "4 × 18650 cells into the IP5310 charger and boost board."
              - "5&nbsp;V rail to the Here4 Base and the Nano."
              - "LM2596 derives 3.3&nbsp;V for the radio."
              - "The metal button switches the 5&nbsp;V output; its LED ring is on the same rail."

  - id: s-impl
    title: Mechanical and electronic implementation
    blocks:
      - type: prose
        md: |
          Three printed parts stack on the tripod. The **bottom case** holds the Here4 Base and the LoRa radio, with the radio antenna mounted outside. The **middle section** holds the four cells and the IP5310 charger and boost board. The **top** carries the GNSS antenna.

          The IP5310 board's own button is removed, so the external metal button switches the 5&nbsp;V output, and its LED ring is wired to the same output. A USB port at the base allows charging from a power bank.
      - type: figures
        columns: 3
        images:
          - { src: src/media/rtk/open-43.jpg, widths: [360, 720], sizes: "(max-width: 600px) 100vw, 26vw", alt: "Open bottom case: Arduino Nano, receiver and LoRa module wiring.", caption: "**Fig. 4** Bottom case: Nano, Here4 Base, LoRa radio." }
          - { src: src/media/rtk/cells-11.jpg, widths: [360, 720], sizes: "(max-width: 600px) 50vw, 18vw", alt: "Battery section with four 18650 cells in a holder and the charging module wiring.", caption: "**Fig. 5** Middle section, 4 × 18650." }
          - { src: src/media/rtk/side-45.jpg, widths: [360, 720], sizes: "(max-width: 600px) 50vw, 18vw", alt: "Side view of the assembled base station on its tripod, with antenna cable.", caption: "**Fig. 6** Side view, antenna connections." }
      - type: table
        label: Table 2
        caption: Components and where they sit in the case
        metaLast: true
        head: [Function, Part, Location]
        rows:
          - { item: GNSS receiver, cells: ["CubePilot Here4 Base, u-blox F9P", Bottom] }
          - { item: Correction radio, cells: ["Ebyte E220-900T22D, external SMA antenna", Bottom] }
          - { item: Controller, cells: [Arduino Nano, "–"] }
          - { item: Energy, cells: ["4 × 18650 Li-ion cells and holder", Middle] }
          - { item: Charger and boost, cells: ["IP5310 (LX-LBC3.1)", Middle] }
          - { item: "3.3&nbsp;V regulator", cells: [LM2596 step-down, "–"] }
          - { item: GNSS antenna, cells: [CS7624A, Top] }
      - type: steps
        title: Bench notes
        items:
          - "Set the LM2596 to 3.3&nbsp;V before connecting the radio."
          - "Connect both antennas before power-on."

  - id: s-test
    title: Integration and testing
    blocks:
      - type: prose
        md: "The published record is one reported field result. The test record keeps what is documented apart from what is only reported, line by line."
      - type: status
        layout: record
        label: Table 1
        caption: "Version I, field test record"
        head: [Item, Record, Status]
        rows:
          - { item: Unit under test, cells: ["Version I, fully assembled."], status: { mark: doc, text: Documented } }
          - { item: Setup, cells: ["Base station broadcasting RTCM over LoRa to drones, in “real drone localization setups”. The drone or rover used is not named."], status: { mark: rep, text: Partly documented } }
          - { item: Conditions, cells: ["Site, date, sky view and distance to the rover are not documented."], status: { mark: none, text: Not documented } }
          - { item: Procedure, cells: ["Survey-In starts automatically at power-on. Survey-In settings, and how positioning accuracy was assessed, are not documented."], status: { mark: rep, text: Partly documented } }
          - { item: Observations, cells: [{ quote: "Fully assembled, validated, and tested during field experiments.", src: "Source: project page [1]" }], status: { mark: rep, text: Reported } }
          - { item: Result, cells: [{ quote: "Stable centimeter-level accuracy in real drone localization setups.", src: "Source: project page [1]. No values, logs or plots are published." }], status: { mark: rep, text: "Reported, no data" } }
          - { item: Limitations, cells: ["The result cannot be checked from published material. Version II has not been tested."], status: { mark: doc, text: Documented } }
        key:
          - { mark: doc, text: Documented in the project material }
          - { mark: rep, text: "Reported, or only partly documented" }

  - id: s-results
    title: Results and limitations
    blocks:
      - type: prose
        md: |
          **Objective.** Centimetre-level RTK positioning for drones and rovers, from a base station that can be carried and set up in the field.

          **Result.** Version I is fully assembled and was used in field experiments. The project page reports stable centimetre-level accuracy in drone localization setups.

          **Limitations.** No measurements, logs or test conditions are published, so the accuracy claim cannot be checked from this page. Version II is documented as work in progress and has not been tested. No CAD files, firmware or wiring files are published.

  - id: s-refs
    title: Resources and references
    short: Resources and references
    blocks:
      - type: refs
        items:
          - { n: 1, label: "Original RTK Base Station project page, source of the quoted results (archived version)", href: "https://github.com/ErikMischiatti/ErikMischiatti.github.io/blob/ee295ad954060e78b797e09003465813a8b1888a/pages/rtk_base_station.html" }
          - { n: 2, label: "Burks Builds, GNSS Base Station Prototype: the mechanical design this adapts", href: "https://burksbuilds.com/robotics/gnss-base-station/gnss-base-station-prototype/" }
          - { gap: "No repository, CAD files or firmware published" }
---
