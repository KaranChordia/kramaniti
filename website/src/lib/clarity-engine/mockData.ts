export interface MockScenario {
  id: string;
  name: string;
  answers: {
    context: string;
    workflow: string;
    presence: string;
  };
  questions: {
    workflow: string;
    presence: string;
    complete: string;
  };
  blueprint: {
    strategy: string;
    systems: string;
    presence: string;
  };
}

export const mockScenarios: MockScenario[] = [
  {
    id: "saas-startup",
    name: "B2B SaaS Startup",
    answers: {
      context: "We are building an AI-powered CRM for boutique real estate agencies. The goal is to automate lead follow-ups and property matching. Our main problem is standing out against massive generic CRMs like Salesforce, and our sales cycles are too long.",
      workflow: "Currently, our sales team manually prospects on LinkedIn, moves them to a spreadsheet, and emails them one by one. We want to automate outreach, automatically score leads based on their website activity, and auto-generate personalized email sequences.",
      presence: "We want our brand to feel high-end, exclusive, but highly technical. We need a dark-mode website with subtle glassmorphism, clear interactive product demos, and a content engine that produces weekly case studies on how AI saves agents time."
    },
    questions: {
      workflow: "Got it. Taking on legacy giants requires a completely different operational rhythm. Let's look at your current sales motions. What does a typical day look like for your sales team right now, and where is the biggest bottleneck in your pipeline?",
      presence: "That's a very clear bottleneck. We can absolutely automate the lead enrichment and sequence generation. Finally, let's talk about perception. When a high-net-worth real estate broker lands on your platform, how do you want them to feel? What's the aesthetic or vibe you are aiming for?",
      complete: "Excellent. I have everything I need. We have the context, the workflow constraints, and the cinematic presence goals. Generating the Blueprint..."
    },
    blueprint: {
      strategy: `# Strategic Positioning Blueprint
## 1. Core Identity & Market Position
**The High-End Niche Authority.** You aren't competing with Salesforce; you are the bespoke, AI-native alternative for boutique real estate. Your positioning must shift from "CRM" to "Autonomous Revenue Engine for Luxury Real Estate."

## 2. The Core Offer
- **Current State:** A generic AI CRM.
- **The Shift:** "The invisible assistant that matches high-net-worth buyers to properties before they even ask."
- **Pricing Strategy:** Premium tiered pricing based on successful matches, not just seat licenses.

## 3. Narrative Architecture
- **The Enemy:** Bloated, generic software that requires a PhD to set up.
- **The Promise:** Zero-friction intelligence. You open it, and your leads are already prioritized and drafted.

## 4. Growth Pipeline
Focus entirely on high-signal outbound. Target top-100 boutique agencies in major metros with highly personalized, AI-generated teardowns of their current listing marketing.`,
      systems: `# Operational Systems Blueprint
## 1. Automated Outbound Engine
Replace the manual spreadsheet process with a connected pipeline:
- **Apollo.io / Clay:** Scrape boutique real estate firm directories and identify key brokers.
- **Instantly.ai:** Manage cold email sequencing across multiple domains.
- **Make.com:** Route positive replies directly into Slack with AI-generated context briefs on the prospect.

## 2. Lead Scoring & Intent Tracking
- Implement **Clearbit** or **RB2B** to deanonymize website traffic.
- If a broker from a known boutique firm visits the pricing page, immediately alert the sales team and auto-enroll the prospect in a high-priority sequence.

## 3. Delivery Infrastructure
- **Onboarding:** Use **Tally.so** for frictionless onboarding forms.
- **Client Portal:** Build a white-labeled **Softr** portal where clients can track the AI's lead engagement metrics in real-time.`,
      presence: `# Cinematic Presence Blueprint
## 1. Visual Identity
- **Aesthetic:** Dark mode, Obsidian backgrounds, Burnished Gold accents, and heavy use of Glassmorphism.
- **Typography:** JetBrains Mono for data/numbers (showing technical precision) and Outfit for headings (clean, modern).
- **Vibe:** It should feel like stepping into a high-end luxury vehicle.

## 2. The Digital Storefront (Website)
- **Hero Section:** No generic laptops. Show a live, interactive visualization of nodes connecting buyers to properties in real-time.
- **Micro-interactions:** Buttons should have subtle "push" physics and gold shockwaves on click.
- **Social Proof:** Replace standard logo walls with deeply technical, metric-driven case studies.

## 3. Content Engine
- **The "Boutique Intel" Newsletter:** A weekly deep-dive into how top 1% brokers use data to close. 
- **Video Strategy:** Short, highly-polished screen recordings showing the AI working in real-time. No talking heads—just the product doing magic.`
    }
  },
  {
    id: "specialty-coffee",
    name: "Specialty Coffee Roaster",
    answers: {
      context: "We are an independent specialty coffee roaster in Portland. We sell wholesale to local cafes and have a direct-to-consumer online subscription. We struggle with customer retention online and managing wholesale orders efficiently.",
      workflow: "Wholesale clients text or email us their orders randomly throughout the week, which causes chaos in the roasting schedule. For online subs, we just use default Shopify emails, but churn is high after month 3.",
      presence: "We want a warm, earthy, analog feel. Think textured paper, deep greens, espresso browns, and warm cream colors. We want to tell the stories of the specific farms we buy from in Colombia and Ethiopia through beautiful photography."
    },
    questions: {
      workflow: "Fascinating. Balancing B2B wholesale logistics with DTC retention is tough. Let's dig into the operations. How do you currently collect and process those wholesale orders, and what's your current cadence for communicating with online subscribers?",
      presence: "That chaos is completely solvable with a unified ordering portal and some automated triggers. Now, let's switch gears to the brand presence. When someone opens a bag of your coffee or visits your site, what's the core emotion and visual aesthetic you want them to experience?",
      complete: "Beautiful. That analog warmth paired with transparent storytelling is a perfect angle. I have all the pieces. Synthesizing the Strategy, Systems, and Presence blueprints now..."
    },
    blueprint: {
      strategy: `# Strategic Positioning Blueprint
## 1. Core Identity & Market Position
**The Transparent Roaster.** You aren't just selling caffeine; you are curating global agriculture. Your positioning shifts from "local coffee" to "Direct-trade, farm-to-cup experiences."

## 2. The Core Offer
- **Wholesale:** "Predictable perfection." Guaranteeing zero out-of-stock emergencies for cafes.
- **DTC Subscription:** The "Explorer's Club." Instead of just getting coffee, subscribers get a monthly zine about the origin, tasting notes, and a digital community.

## 3. Narrative Architecture
- **The Enemy:** Stale, mass-produced commodity coffee and opaque supply chains.
- **The Promise:** Complete transparency. You know the exact elevation and farmer who grew your morning cup.`,
      systems: `# Operational Systems Blueprint
## 1. Wholesale Automation
Eliminate the text/email chaos:
- Build a dedicated wholesale portal using **Shopify B2B** or **Faire**.
- Implement **Airtable** linked to **Make.com** to automatically aggregate all weekly wholesale orders by Tuesday at 5 PM, generating a master roast schedule spreadsheet.
- Send automated SMS reminders to cafes on Monday mornings: "Reply with your order by 5 PM tomorrow to make the Wednesday roast."

## 2. DTC Retention Engine
- Replace default Shopify emails with **Klaviyo**.
- Build a "Month 3" intervention flow: At day 75, send a highly personalized email offering a free sample of a premium reserve roast or a virtual tasting session to prevent churn.

## 3. Inventory Sync
- Connect the roasting output directly to Shopify inventory to prevent overselling limited micro-lots.`,
      presence: `# Cinematic Presence Blueprint
## 1. Visual Identity
- **Aesthetic:** Analog, textured, warm. 
- **Palette:** Deep Forest Green, Espresso Brown, Warm Cream.
- **Typography:** A classic serif for storytelling (e.g., Playfair Display) mixed with a clean sans-serif for logistics.

## 2. The Digital Storefront (Website)
- **Hero Section:** High-quality, slow-motion video of the roasting process or mist over Colombian coffee farms.
- **Product Pages:** Don't just list beans. Show interactive flavor profile radars, farm altitude metrics, and harvest dates.

## 3. Content Engine
- **Origin Stories:** A dedicated blog/video series documenting visits to origin farms. 
- **Brew Guides:** Highly aesthetic, step-by-step visual guides on how to brew the perfect pour-over or espresso with the specific beans they bought.`
    }
  },
  {
    id: "creative-agency",
    name: "Design & Innovation Agency",
    answers: {
      context: "We are a high-end branding and digital design agency. We work with funded startups to build their entire brand identity and web presence. Our problem is that proposals take too long to write, and clients often don't understand the strategic value we bring until it's too late.",
      workflow: "Our creative director spends 10 hours a week writing custom proposals in InDesign. Onboarding is a messy thread of emails. We want to templatize the proposal generation while keeping it highly personalized, and automate the client onboarding.",
      presence: "Ultra-minimal, brutalist but refined. Black and white mostly, with stark typography and massive, high-res project imagery. The site should feel like a high-end art gallery."
    },
    questions: {
      workflow: "The classic agency dilemma—selling high-level strategy but getting bogged down in low-level documentation. Walk me through the exact steps you take from the moment a lead says 'yes' to the moment they are fully onboarded and work begins.",
      presence: "Ten hours a week in InDesign is an incredibly expensive bottleneck. We can definitely systemize that into an automated generation flow. Finally, let's talk about how you present yourselves to the world. What is the defining visual style and tone of voice for the agency's own brand?",
      complete: "Got it. The brutalist, gallery-like approach creates exactly the right exclusivity. I understand your context, workflows, and presence needs. Preparing the synthesis..."
    },
    blueprint: {
      strategy: `# Strategic Positioning Blueprint
## 1. Core Identity & Market Position
**The Vision Architects.** You don't "make logos"; you engineer market perception for the next generation of category leaders. 

## 2. The Core Offer
- **The Shift:** Stop selling "branding packages." Sell "Venture-Ready Market Identity."
- **Pricing:** Shift from hourly billing or fixed-deliverable pricing to value-based pricing anchored against the startup's recent funding round.

## 3. Narrative Architecture
- **The Enemy:** Template-driven, generic design that makes a unique product look like every other SaaS.
- **The Promise:** We make your brand as innovative as your engineering.`,
      systems: `# Operational Systems Blueprint
## 1. Automated Proposal Generation
- Move proposal data generation to **Notion**.
- Use **Make.com** to trigger a document generation workflow in **DocuMint** or **PandaDoc**.
- The creative director only inputs 5 key strategic bullet points; the system generates the 15-page branded PDF automatically.

## 2. Frictionless Onboarding
- Once a proposal is signed via Stripe/PandaDoc, trigger an automated onboarding sequence.
- Auto-provision a dedicated client Slack channel and a shared Notion portal.
- Send an automated "Welcome & Next Steps" video recorded by the founders.

## 3. Client Portal
- Use **Notion** as a dynamic client portal where clients can see project milestones, provide asynchronous feedback on designs, and access final assets without emailing you.`,
      presence: `# Cinematic Presence Blueprint
## 1. Visual Identity
- **Aesthetic:** High-end gallery minimalism.
- **Palette:** Stark Black, Pure White, occasional brutalist neon accents.
- **Typography:** Massive sans-serif typography (e.g., Helvetica Now or Inter) mixed with micro-copy for technical details.

## 2. The Digital Storefront (Website)
- **Hero Section:** Pure typographic hero statement. As you scroll, enormous, immersive project imagery takes over the screen using WebGL or GSAP scroll triggers.
- **Case Studies:** Don't just show the final logo. Show the mess, the process, the wireframes, and the strategy documents. Make the process the hero.

## 3. Content Engine
- **Founder Essays:** Long-form, opinionated essays on design philosophy, published on Substack or the main site. 
- **Behind the Scenes:** Short, raw videos showing the design team debating typography or sketching layouts.`
    }
  }
];
