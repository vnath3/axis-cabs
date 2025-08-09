@echo off
REM Create directories
mkdir public\ src\styles src\lib src\data src\components src\pages\city-to-city src\pages\packages src\pages\hidden-gems src\pages\api src\schemas

REM Create root files
type nul > .env.example
type nul > package.json
type nul > tsconfig.json
type nul > astro.config.mjs
type nul > tailwind.config.mjs
type nul > postcss.config.cjs
type nul > README.md

REM Create files in public
type nul > public\logo.svg
type nul > public\og-default.jpg
type nul > public\favicon.svg

REM Create files in src
type nul > src\env.d.ts

type nul > src\styles\globals.css

type nul > src\lib\whatsapp.ts
type nul > src\lib\ga.ts
type nul > src\lib\validators.ts

type nul > src\data\pricing.json
type nul > src\data\routes.ts
type nul > src\data\packages.ts
type nul > src\data\gems.ts

type nul > src\components\Header.astro
type nul > src\components\Footer.astro
type nul > src\components\Hero.astro
type nul > src\components\LeadForm.astro
type nul > src\components\FAQ.astro
type nul > src\components\StickyCTAs.astro

type nul > src\pages\index.astro
type nul > src\pages\city-to-city\[slug].astro
type nul > src\pages\packages\[slug].astro
type nul > src\pages\hidden-gems\[slug].astro
type nul > src\pages\api\lead.ts
type nul > src\pages\sitemap.xml.ts

type nul > src\schemas\faq.ts
type nul > src\schemas\jsonld.ts
