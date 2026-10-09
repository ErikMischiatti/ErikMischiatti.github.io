---
title: Green Vigilance
slug: green-vigilance
order: 5
urlPath: /pages/distribution_project.html
publish: true
layout: layouts/project.njk
status: Reproducible simulation baseline
summary: "A Python-first UAV/UGV simulation baseline for early crop-disease detection: scenario comparison, EKF and WLS estimation, and reproducible visual outputs."
lead:
  - label: Scope
    text: "a Python migration and reconstruction of a UAV/UGV precision-agriculture system originally explored for early crop-disease detection. The current work is a reproducible simulation baseline, not a production-ready field robot."
  - label: My contribution
    text: "the Python baseline is published in my GitHub repository. The context of the original system is not stated."
contribution:
  lead: "Python simulation baseline, published in my GitHub repository."
index:
  name: Green Vigilance
  context: null
  period: Baseline complete
evidence: { hardware: none, field: none, experimental: none, simulation: doc, publication: none, software: doc }
facts:
  - { term: Context, gap: Not stated }
  - { term: Status, value: Reproducible simulation baseline }
  - { term: Stack, value: "Python, NumPy, PyYAML, Matplotlib, pytest, GitHub Actions CI, YAML scenarios", wide: true }
opening:
  type: photos
  figures:
    - { src: pics/green_vigilance_baseline_scene3d.png, plate: true, widths: [600, 1200], sizes: "(max-width: 860px) 100vw, 40vw", alt: "3D simulation scene of the baseline scenario: field, canopies, observed leaves, UAV and UGV trajectories, UGV targets and the camera frustum." }
  caption: "**Fig. 1** 3D simulation output for the baseline UAV/UGV scenario."

sections:
  - id: s-overview
    title: Overview
    blocks:
      - type: prose
        md: "The simulation compares scenario configurations, estimates UAV and UGV localization error, assigns ground targets from a disease heatmap, and produces visual outputs and summary reports that can be regenerated from YAML inputs."

  - id: s-arch
    title: Architecture
    blocks:
      - type: sequence
        label: Simulation pipeline
        items:
          - { name: Scenario YAML config }
          - { name: UAV unicycle dynamics + EKF }
          - { name: Camera / frustum observation }
          - { name: Disease heatmap }
          - { name: UGV target assignment }
          - { name: Noisy localization + WLS estimate }
          - { name: "Summary JSON, CSV/Markdown, figures" }
        caption: "**Fig. 2** Pipeline from a scenario configuration to the generated outputs, as described in the project documentation."

  - id: s-features
    title: Key features
    blocks:
      - type: table
        label: Table 1
        caption: Key features, as documented
        wide: true
        head: [Feature, Description]
        rows:
          - { item: Scenario coverage, cells: ["Baseline, high-noise and extreme-uncertainty scenarios, defined as reproducible YAML configurations"] }
          - { item: Deterministic UAV path, cells: ["The UAV follows a deterministic 30% coverage path, for repeatable comparisons between scenario settings"] }
          - { item: Target assignment, cells: ["Disease heatmaps drive UGV target assignment for ground-level inspection candidates"] }
          - { item: Static outputs, cells: ["Static 2D and 3D outputs for trajectories, observations and scenario interpretation"] }
          - { item: Reports, cells: ["Scenario summaries and comparison reports exported as structured files and Markdown tables"] }
          - { item: Tests and CI, cells: ["pytest test coverage and GitHub Actions CI for regression checks of the Python baseline"] }

  - id: s-results
    title: Scenario results
    short: Results
    blocks:
      - type: table
        label: Table 2
        caption: Scenario results from the simulation baseline
        labelled: true
        head: [Scenario, Observed leaves, UAV RMSE, UGV WLS RMSE]
        rows:
          - { item: baseline, cells: ["2711", "0.463 m", "0.536 m"] }
          - { item: high_noise, cells: ["1866", "1.580 m", "0.941 m"] }
          - { item: extreme_uncertainty, cells: ["1228", "1.825 m", "1.568 m"] }
      - type: note
        md: "The validation is qualitative at this stage: exact numerical equivalence with the earlier MATLAB implementation and its report has not been formally validated."

  - id: s-outputs
    title: Generated outputs
    short: Outputs
    blocks:
      - type: figures
        columns: 2
        contain: true
        images:
          - { src: pics/green_vigilance_baseline_heatmap.png, widths: [560, 1120], sizes: "(max-width: 600px) 100vw, 34vw", alt: "Observed disease heatmap over the field, with probability values from 0 to about 0.6.", caption: "**Fig. 3** Disease heatmap used for UGV target assignment." }
          - { src: pics/green_vigilance_baseline_trajectories.png, widths: [560, 1120], sizes: "(max-width: 600px) 100vw, 34vw", alt: "UAV and UGV trajectories with requested coverage area, waypoints, noisy and WLS-estimated UGV paths and targets.", caption: "**Fig. 4** Baseline UAV and UGV trajectory output." }

  - id: s-refs
    title: Resources
    blocks:
      - type: refs
        items:
          - { n: 1, label: "Green-Vigilance-Project repository (GitHub)", href: "https://github.com/ErikMischiatti/Green-Vigilance-Project" }
          - { n: 2, doc: green-vigilance-report, label: "Project report" }
---
