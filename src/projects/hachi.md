---
title: "Hachi: AR learning cards"
slug: hachi
order: 9
urlPath: /pages/hachi_project.html
publish: true
layout: layouts/project.njk
status: Completed
summary: "Augmented reality for classroom engagement: educators create AR lessons with interactive 3D models that students view through printable cards. A CLab Trento project in collaboration with HIT (Hub Innovazione Trentino)."
lead:
  - label: Recognition
    text: "DigiEduHack 2021 Global Award winner, an initiative supported by the European Commission. Chosen among 228 submitted solutions and 12 finalists; the team received a €5,000 prize and the title of DigiEduHack Global Ambassador."
  - label: My contribution
    text: "member of the Hachi team; the individual role is not stated in the project material."
contribution:
  lead: "Member of the Hachi team."
index:
  name: "Hachi, AR learning cards"
  context: "CLab Trento with HIT, team; DigiEduHack 2021 award"
  period: "2021"
evidence: { hardware: none, field: none, experimental: none, simulation: none, publication: none, software: doc }
facts:
  - { term: Context, value: "CLab Trento (StartUp Lab), with HIT, Hub Innovazione Trentino", wide: true }
  - { term: Team, value: "Hachi team; individual roles not stated", wide: true }
  - { term: Status, value: Completed }
  - { term: Recognition, value: "DigiEduHack 2021 Global Award", wide: true }
# Opening: the team photograph used as the project's cover on the original homepage.
opening:
  type: photos
  figures:
    - { src: pics/photo_5_2024-10-03_14-58-56.jpg, widths: [640, 960], sizes: "(max-width: 860px) 100vw, 40vw", alt: "The four members of the Hachi team standing beside their stand, with the Hachi poster, printed learning cards, a tablet and a laptop." }
  caption: "**Fig. 1** The Hachi team at its stand."
sections:
  - id: s-concept
    title: From problem to team
    short: Concept
    blocks:
      - type: table
        label: Table 1
        caption: "Challenge, solution and go-to-market, as presented by the team"
        wide: true
        head: [Topic, Summary]
        rows:
          - { item: The problem, cells: ["Traditional teaching methods are often limited in engaging students, which can reduce learning outcomes. Hachi uses augmented reality to create interactive, immersive learning experiences."] }
          - { item: The solution, cells: ["A platform where educators create AR-enhanced lessons with interactive 3D models, viewed through printable cards, to make complex subjects more accessible."] }
          - { item: Competitive advantage, cells: ["Affordability, customizability and ease of use; educators can work with designers on tailored content."] }
          - { item: Market, cells: ["Growing demand for innovative educational tools in EdTech, addressed with an AR solution designed for classroom engagement."] }
          - { item: Business model, cells: ["A two-sided platform connecting educators with AR designers who create custom content."] }
          - { item: Roadmap, cells: ["Launch AR content kits for schools in the Trentino region, then onboard more designers for diverse, personalized content."] }
          - { item: Team, cells: ["Skills in Flutter, AR development, product design and business analysis."] }

  - id: s-gallery
    title: Gallery
    blocks:
      - type: figures
        columns: 2
        images:
          - { src: pics/photo_1_2024-11-12_14-12-55.jpg, widths: [480, 720], sizes: "(max-width: 600px) 50vw, 33vw", alt: "Printable Hachi learning card with an AR marker, on a desk.", caption: "**Fig. 2** Printable learning card with an AR marker." }
          - { src: pics/photo_2_2024-11-12_14-12-55.jpg, widths: [480, 720], sizes: "(max-width: 600px) 50vw, 33vw", alt: "Hachi Action and Info learning cards on a desk.", caption: "**Fig. 3** Action and Info cards." }
          - { src: pics/photo_3_2024-11-12_14-12-55.jpg, widths: [480, 720], sizes: "(max-width: 600px) 50vw, 33vw", alt: "Hachi stand with posters, printed cards and the app running on a tablet.", caption: "**Fig. 4** Hachi stand: posters, printed learning cards and the app on a tablet." }
          - { src: pics/photo_5_2024-11-12_14-12-55.jpg, widths: [480, 720], sizes: "(max-width: 600px) 50vw, 33vw", alt: "Hachi cards with AR markers labelled Object and Action.", caption: "**Fig. 5** Object and Action cards with AR markers." }

  - id: s-tech
    title: Technical details
    short: Technical
    blocks:
      - type: table
        label: Table 2
        caption: Technical details
        wide: true
        head: [Area, Detail]
        rows:
          - { item: Framework, cells: ["Flutter, for cross-platform mobile development"] }
          - { item: AR toolkit, cells: ["AR-ready Flutter packages for tracking and rendering"] }
          - { item: 3D assets, cells: ["3D models rendered on top of printable cards"] }
          - { item: Platforms, cells: ["iOS and Android devices"] }
          - { item: Repository, cells: ["App code, AR logic, sample assets and documentation"] }

  - id: s-refs
    title: Resources
    blocks:
      - type: refs
        items:
          - { n: 1, label: "Hachi repository (GitHub)", href: "https://github.com/Azzeccagarbugli/hachi" }
          - { n: 2, label: "DigiEduHack 2021 winners, official announcement", href: "https://ircai.org/announcing-the-winners-of-digieduhack-2021/" }
---
