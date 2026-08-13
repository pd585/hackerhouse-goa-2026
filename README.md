# Goa Signal Wave

PRD — GOA SIGNAL MAP

Hacker House Goa 2026 · Immersive Builder Identity Web Experience

1. PRODUCT VISION

Create a frictionless, shareable Hacker House Goa 2026 Builder Identity experience where a participant does not simply fill out a form.

Instead, the user:

ENTERS GOA → DISCOVERS HACKER HOUSE → CREATES THEIR BUILDER NODE → ACTIVATES THEIR STACK → CONNECTS THEIR TEAM → BROADCASTS THEIR SIGNAL → RECEIVES THEIR BUILDER WAVE

The experience should feel like an interactive digital journey through Goa, culminating in the required branded Builder ID Card / Builder Wave.

Core idea:

The map is not decoration.

The map is the interface.

2. CONTEST REQUIREMENT ALIGNMENT

The original Hacker House Goa task requires a web tool where a user uploads a photo and receives a branded HH Goa 2026 graphic ready to download/share. It allows a PFP Frame/Overlay or Builder ID Card, with the Builder ID Card being our primary format.

The required flow includes:

photo upload

JPG/PNG/HEIC support

quick builder fields

fast generation

downloadable final graphic

working X sharing

no login wall

no signup gate

one-pass experience

real-photo handling

mobile-friendly design

live working submission

The final product must therefore satisfy the contest requirements without sacrificing the immersive concept.

3. PRIMARY FORMAT

Our primary deliverable is:

FORMAT B — BUILDER ID CARD / BUILDER WAVE

The final output is a personalized Hacker House Goa Builder artifact containing:

profile photo

builder name

role

generated builder title

team

technology stack

signal ID

Hacker House Goa branding

Goa visual environment

signal visualization

The immersive map is the experience leading to the final artifact.

4. CORE PRODUCT CONCEPT

GOA SIGNAL MAP

The user enters a real 3D representation of Goa.

They discover meaningful locations representing stages of their builder identity.

Journey:

REAL GOA
↓
HACKER HOUSE NODE
↓
BUILDER COVE
↓
STACK BAY
↓
TEAM NODE
↓
GOA SIGNAL NETWORK
↓
SIGNAL LIGHTHOUSE
↓
SIGNAL LOCKED
↓
PERSONALIZED BUILDER WAVE
↓
DOWNLOAD / SHARE

5. REAL MAP — ABSOLUTE REQUIREMENT

DO NOT BUILD A FAKE MAP.

This is one of the most important technical constraints.

The geographic environment must use:

REAL GEOGRAPHIC / MAP DATA

Use an appropriate real mapping/3D technology such as:

Mapbox GL JS

MapLibre GL JS

WebGL-based geographic rendering

real geographic tiles

real terrain/elevation where available

The exact implementation may depend on the available platform/API access.

The geographic foundation must NOT be:

CSS gradients pretending to be terrain

SVG Goa outlines

fake CSS oceans

random 3D-looking islands

manually drawn fake roads

generic illustrated maps

static images pretending to be maps

If a real geographic feature cannot be represented accurately using available data, do not fabricate geographic accuracy.

A simpler real map is preferable to a beautiful fake map.

6. FAMOUS EXPERIENCE CONCEPTS

The experience combines several proven interaction patterns while creating an original Hacker House Goa product.

A. Interactive Map Exploration

Inspired by modern map-based exploration experiences.

The user:

explores

zooms

moves through locations

discovers destinations

interacts with geographic context

But the experience is specifically transformed into a Hacker House builder journey.

B. Game-Like Progression

The user progressively unlocks stages:

01 — BUILDER
02 — STACK
03 — TEAM
04 — GOA NODE
05 — BROADCAST

Completing one stage activates the next.

The user should feel like they're progressing through a mission, not filling a questionnaire.

C. Cinematic Product Reveal

Inspired by premium product-reveal experiences.

At the end:

Builder identity

stack

team

signal network

converge into one final artifact.

Then:

SIGNAL LOCKED ✦

The Builder Wave is revealed.

7. UI / VISUAL DESIGN SYSTEM — CRITICAL

The attached Hacker House Goa reference images are the visual inspiration for this product.

IMPORTANT:

USE THEM AS DESIGN REFERENCES.

DO NOT REBUILD THEM.

DO NOT COPY THEIR PAGE COMPOSITIONS.

DO NOT USE THEM AS BACKGROUND IMAGES.

DO NOT TURN THE POSTERS INTO UI SCREENS.

The new product must have its own UI design.

The reference images should influence:

color palette

typography character

visual hierarchy

Goa atmosphere

tropical visual language

signal/network motifs

decorative details

border language

icon treatment

overall energy

Hacker House branding

The existing Hacker House references establish a visual language around deep green, cream, yellow/gold, pink/magenta, tropical Goa scenery, signal waves, lighthouse imagery and event typography.

8. COLOR DIRECTION

Take strong inspiration from the attached Hacker House Goa references.

Primary colors:

HACKER HOUSE GREEN
Deep/dark green

CREAM
Warm off-white / paper-like surfaces

YELLOW / GOLD
Primary action and signal accent

HOT PINK / MAGENTA
Secondary accent and active states

Use these colors intelligently.

Do NOT make the entire website dark green.

The experience should feel:

BRIGHT
TROPICAL
ENERGETIC
PREMIUM
TECHNICAL
PLAYFUL
GOA-INSPIRED

The real 3D map remains the primary visual canvas.

UI panels complement the map rather than covering it.

9. TYPOGRAPHY

Take inspiration from the bold, expressive typography in the Hacker House references.

Use:

Display typography

For major storytelling moments.

Modern UI typography

For controls and interactions.

Monospaced/technical typography

For:

Signal IDs

coordinates

system information

technical status

The typography should feel like an event identity system, not a generic SaaS dashboard.

10. UI PHILOSOPHY

DO NOT BUILD:

generic SaaS dashboard

generic Google Maps clone

plain form UI

dark cyberpunk interface

excessive glassmorphism

generic cards everywhere

excessive rounded rectangles

boring white panels

giant centered form

Instead create:

REAL GOA

HACKER HOUSE

SIGNAL NETWORK

INTERACTIVE EXPLORATION

11. MAP + UI RELATIONSHIP

The real 3D map is the primary visual canvas.

UI should be layered around it.

The interface should feel like the user is operating inside Goa.

Controls should appear contextually.

Example:

BUILDER COVE selected

→ compact Builder interaction panel

STACK BAY selected

→ stack-selection interface

TEAM NODE selected

→ team input

SIGNAL LIGHTHOUSE selected

→ final broadcast action

Do not keep a huge permanent dashboard covering the map.

12. VISUAL DEPTH

Use real 3D map depth wherever supported.

Our Hacker House layer can provide:

custom markers

animated signal routes

glowing signal paths

Builder Cards

lighthouse effects

stack-colored signals

team connections

subtle atmospheric effects

These effects must enhance the real geographic environment, not replace it.

13. SCENE 1 — ENTER GOA

The website opens directly into the real 3D geographic environment.

Visual experience:

Wide Goa view

↓

camera gradually approaches the Hacker House region

↓

Hacker House signal becomes visible

The experience should feel cinematic but should remain fast.

Do not make the user wait through a long loading animation.

14. HACKER HOUSE NODE

Create a custom interactive Hacker House location marker on the real map.

Example:

HACKER HOUSE GOA
HH26
GOA NODE

When selected:

WELCOME, BUILDER.

Then:

ENTER THE NETWORK →

This is a real interactive control.

15. SCENE 2 — BUILDER COVE

First identity stage.

Question:

WHO ARE YOU?

Collect:

Profile photo

Builder name

Role

16. PROFILE PHOTO SYSTEM

The user must be able to upload:

JPG

PNG

HEIC where technically supported

The system must handle:

portrait images

landscape images

off-center photos

different aspect ratios

The original contest specifically requires handling real user photos rather than assuming users have already cropped them.

Photo editor:

User can:

upload

crop

zoom

pan

reposition

reset

The selected crop must be stored and reused in the final Builder Wave.

17. BUILDER CARD

Once identity information is entered, create a real interactive Builder Card inside the 3D environment.

It should feel like a collectible digital identity artifact anchored to the map.

Example:

┌────────────────────────────┐
│ HH26 │
│ │
│ PROFILE PHOTO │
│ │
│ DANNY │
│ AI ENGINEER │
│ │
│ INTELLIGENCE BUILDER │
│ │
│ SIGNALSEEKERS │
│ │
│ HH26-XXXX │
└────────────────────────────┘

The card can use:

depth

subtle holographic treatment

signal edges

Hacker House colors

dynamic photo

animated highlights

It must remain readable and premium.

18. BUILDER TITLE SYSTEM

Use curated role-based titles.

RoleBuilder TitleFull Stack DeveloperCode Voyager AIFrontend EngineerInterface ArchitectBackend EngineerSystems ArchitectAI EngineerIntelligence BuilderMachine Learning EngineerModel AlchemistData EngineerData Pipeline ArchitectProduct EngineerProduct ForgeDesignerVisual StorytellerProduct DesignerExperience SculptorFounderVenture BuilderIndie HackerSolo Ship CaptainResearcherFrontier ExplorerDevRelEcosystem CatalystStudent BuilderNextGen Pioneer

Do NOT use generic titles such as:

CODE. CREATE. CONTRIBUTE.

The Builder Title should feel like a genuine identity.

19. SCENE 3 — STACK BAY

Next destination:

WHAT POWERS YOUR SIGNAL?

Allow multiple technology selections.

Examples:

Python

React

Node.js

SQL

AWS

TypeScript

Docker

Next.js

MongoDB

Go

Rust

Vue

Solidity

User can:

add

remove

change technologies

20. STACK → SIGNAL

This is one of the signature mechanics.

Technologies should become animated signals in the real 3D environment.

Suggested mapping:

React / TypeScript / Docker → Blue

Node.js / MongoDB / Vue / Go → Green

Python / AWS / SQL / Solidity → Yellow/Gold

Next.js / Rust / Security → Magenta

The exact mapping should be deterministic.

Core principle:

The user's stack becomes their signal.

The technologies should not merely appear as text.

They should visibly affect the signal network.

21. SCENE 4 — TEAM NODE

Next:

WHO ARE YOU BUILDING WITH?

User enters:

TEAM NAME

Example:

SIGNALSEEKERS

A team node is created.

The Builder Card connects to the Team Node.

Animated connection:

BUILDER
╲
╲
TEAM
╲
╲
HACKER HOUSE

This communicates:

Builders become stronger when they connect.

22. SCENE 5 — GOA SIGNAL NETWORK

After completing identity, stack and team:

The map becomes active.

The user's:

profile

role

stack

team

become one connected network.

Animations:

signal pulses

traveling routes

node activation

lighthouse beam

stack-colored routes

Builder Card glow

team connections

subtle camera movement

Animations must be purposeful.

Not excessive.

23. SCENE 6 — SIGNAL LIGHTHOUSE

Camera moves toward the Hacker House/Goa signal destination.

All signals converge.

The lighthouse activates.

Status:

IDENTITY ✓
ROLE ✓
STACK ✓
TEAM ✓
GOA NODE ✓

Then:

SIGNAL LOCKED ✦

24. FINAL BUILDER WAVE

The final Builder Wave / ID Card is revealed.

It should contain:

Profile photo

Builder name

Role

Builder title

Team name

Stack

Signal ID

Hacker House Goa branding

Goa environment

signal visualization

The final artifact should feel like a collectible identity card, not a generic form submission.

25. SIGNAL ID

Generate:

HH26-XXXX

Example:

HH26-DS4721

It should be unique-looking per generated session.

Keep the value consistent after generation.

26. DOWNLOAD

The final Builder Wave must be a real downloadable image file, not merely a browser-rendered component.

Target:

1600 × 900 PNG

The exported result should contain the personalized final artifact.

The existing Builder Wave design direction also specifies a 1600×900 PNG export workflow.

27. SHARING

Sharing is a core product feature.

Final screen:

SHARE YOUR WAVE

Provide:

X / Twitter

LinkedIn

Instagram

Native Share

Share with Friends

Download

X / Twitter

Desktop:

Open X compose/intent directly.

Do NOT open an OS share dialog on desktop.

Prefill a useful caption.

Example:

Just got my Hacker House Goa 2026 Builder Wave 🌊
Intelligence Builder | AI Engineer
Less noise. More signal.
#FrameInGoa #HHGoa26

Mobile:

Use native file sharing where supported.

The original implementation plan also specified an X intent fallback and a pre-filled Hacker House caption.

LinkedIn

Provide a real LinkedIn sharing flow.

Do not create a fake button.

Instagram

Because arbitrary websites cannot universally force an Instagram post:

Use:

native share where supported

generated image

download fallback

Never falsely claim that an Instagram post was completed.

Share With Friends

Use the Web Share API when supported.

Allow the generated Builder Wave to be shared to compatible applications.

28. NO LOGIN / NO SIGNUP

ABSOLUTE REQUIREMENT.

There must be:

NO LOGIN

NO SIGNUP

NO PASSWORD

NO EMAIL VERIFICATION

NO ACCOUNT CREATION

NO AUTHENTICATION WALL

The official task explicitly requires a no-login/no-signup one-pass experience.

The user should be able to:

open → create → generate → share

without an account.

29. NO UNNECESSARY BACKEND

The core experience should work client-side.

Do not introduce:

authentication

database

user accounts

unnecessary APIs

unnecessary server-side profile storage

unless technically required for a specific feature.

Builder information can remain client-side during the session.

30. SPEED

The contest specifically requires a near-instant experience and says upload-to-result should take a few seconds rather than a long loading screen.

Therefore:

DO NOT create a long artificial loading sequence.

Animations should happen during the interaction, not as unnecessary waiting.

Target:

User action → immediate response

31. MOBILE-FIRST USABILITY

The contest specifically calls for mobile friendliness.

Support:

mobile

tablet

desktop

On mobile:

map controls remain usable

Builder Card remains readable

photo editor remains usable

inputs remain accessible

sharing is easy

map interaction does not become frustrating

32. ANIMATION LANGUAGE

Animation should feel like signals moving through a real environment.

Potential effects:

Map

camera movement

subtle terrain depth

signal route animation

node pulses

Goa environment

subtle atmospheric movement

lighthouse beam

ocean/environment effects where supported

Builder

card reveal

photo reveal

signal activation

Stack

technology signal activation

colored signal travel

Team

animated connection

Finale

signal convergence

lighthouse activation

Builder Wave reveal

Keep animation smooth and purposeful.

33. BUILDER CARD UI

The Builder Card should be one of the most visually distinctive UI elements.

It should use:

Hacker House green

cream

yellow/gold

hot pink

bold typography

technical signal details

subtle depth

dynamic profile photo

Builder Title

Role

Team

Stack

Signal ID

The card must feel native to Hacker House Goa while still being a new UI design, not a recreation of the supplied posters.

34. UI + MAP RELATIONSHIP

The interface must never dominate the map.

Avoid permanent huge panels.

Instead:

Contextual UI

Location selected:

→ relevant controls appear.

Stage completed:

→ UI collapses / transitions.

Next destination:

→ map becomes the focus.

This creates a feeling of exploration.

35. DATA MODEL

Use a single BuilderData object.

Conceptually:

BuilderData {
photo
photoZoom
photoOffsetX
photoOffsetY
name
role
builderTitle
teamName
stack[]
building
signalId
}

The same data must drive:

Map

↓

Builder Card

↓

Signal Network

↓

Final Builder Wave

No duplicated builder state.

36. TECHNICAL ARCHITECTURE

Conceptual architecture:

REAL MAP ENGINE
│
├── Real Goa geography
├── Real terrain
├── Real map camera
│
▼
HACKER HOUSE CUSTOM LAYER
│
├── Hacker House Node
├── Builder location
├── Stack signals
├── Team Node
├── Lighthouse
└── Signal routes
│
▼
BUILDER DATA
│
├── Photo
├── Name
├── Role
├── Title
├── Team
├── Stack
└── Signal ID
│
▼
FINAL BUILDER WAVE
│
├── Download
├── X
├── LinkedIn
├── Instagram fallback
└── Native Share

37. RESPONSIVE EXPERIENCE

Desktop should showcase the 3D environment beautifully.

Mobile should prioritize:

usability

readable Builder Card

easy photo editing

simple navigation

easy sharing

Never make the experience unusable simply to preserve a desktop composition.

38. ABSOLUTE DON'TS

MAP

❌ fake 3D map
❌ CSS-generated Goa coastline
❌ fake ocean
❌ SVG geography
❌ fake terrain
❌ random fake roads
❌ static image pretending to be a map

UI

❌ generic SaaS dashboard
❌ generic Google Maps clone
❌ generic form
❌ dark cyberpunk interface
❌ excessive glassmorphism
❌ excessive cards
❌ giant permanent dashboard
❌ boring white UI

PRODUCT

❌ login
❌ signup
❌ password
❌ account creation
❌ unnecessary backend
❌ dead buttons
❌ fake sharing
❌ long loading screen

DESIGN REFERENCES

❌ rebuild attached Hacker House posters
❌ use them as backgrounds
❌ copy their exact layouts
❌ recreate their artwork with CSS/SVG
❌ simply place the posters inside the new application

The reference images provide visual language only.

39. MVP PRIORITY

Because the contest deadline is 11:59 PM, August 13, 2026, according to the task document, we must prioritize working functionality.

P0 — MUST WORK

Real Goa map

Hacker House location

Photo upload

Photo crop

Photo zoom

Photo pan

Name

Role

Builder Title

Team

Stack

Signal system

Final Builder Wave

Download

X sharing

Mobile experience

No login/signup

P1 — HIGH VALUE

3D terrain

cinematic camera

animated routes

team connections

lighthouse animation

stack-colored signals

LinkedIn

native share

P2 — POLISH

atmospheric animation

richer Builder Card

micro-interactions

additional environmental details

optional sound only if genuinely useful

Do not sacrifice P0 functionality for P2 visual polish.

40. QUALITY ASSURANCE

Before considering the application complete, test the entire journey as a new user.

START

Open website.

Verify:

no login

no signup

map loads

real geography visible

BUILDER

enter Hacker House

upload photo

crop

zoom

pan

enter name

select role

verify title

STACK

add technologies

remove technologies

verify signal colors

verify animated signals

TEAM

enter team name

verify team node

verify connection

GENERATION

trigger signal broadcast

verify signal convergence

verify final Builder Wave

FINAL

verify profile

verify name

verify role

verify Builder Title

verify team

verify stack

verify Signal ID

download PNG

test X

test LinkedIn

test Native Share

test Instagram fallback

test Share With Friends

There must be ZERO dead buttons.

41. CONTEST SUCCESS CRITERIA

The final product must satisfy both:

FUNCTIONAL REQUIREMENTS

✓ Web tool
✓ Photo upload
✓ Real photo handling
✓ Builder information
✓ Fast generation
✓ Downloadable image
✓ X sharing
✓ No login
✓ No signup
✓ One-pass experience
✓ Mobile-friendly
✓ Working live deployment

These requirements are directly supported by the contest task document.

DIFFERENTIATION

✓ Real Goa geographic environment
✓ Interactive exploration
✓ Builder identity journey
✓ Stack-to-signal storytelling
✓ Team connectivity
✓ Animated network
✓ Cinematic final reveal
✓ Shareable collectible Builder Wave

42. ONE-SENTENCE PRODUCT DEFINITION

GOA SIGNAL MAP is a real geographic 3D Hacker House Goa experience where builders explore Goa, create their identity, activate their technology stack, connect their team, broadcast their signal, and receive a personalized Builder Wave they can download and share.

43. FINAL DESIGN PRINCIPLE

The entire product should communicate:

YOU ARE NOT FILLING OUT A FORM.

You are:

ENTERING THE NETWORK.

Your:

IDENTITY

becomes your:

NODE

Your:

STACK

becomes your:

SIGNAL

Your:

TEAM

becomes your:

CONNECTION

And your:

SIGNAL

becomes your:

BUILDER WAVE.

FINAL INSTRUCTION TO LOVABLE

Build this as a completely new project from scratch.

Use the attached Hacker House Goa reference images only as visual inspiration for the UI design language.

Use real geographic/map technology for Goa.

Do not fabricate the map.

Do not rebuild the supplied artwork.

Do not create a generic dashboard.

Do not add login/signup.

Make every interaction real.

Make the experience fast.

Make it mobile-friendly.

Make the Builder Card genuinely personalized.

Make the signal network respond to the user's actual stack.

Make the final Builder Wave downloadable and shareable.

Most importantly:

REAL GOA + HACKER HOUSE VISUAL LANGUAGE + BUILDER STORY + REAL FUNCTIONALITY.

The result should feel like a Hacker House Goa experience, not a generic map application with a logo added afterward.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1a23032e-fbfa-4034-8a81-98dd1da30218).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
