export interface Insight {
  slug: string;
  title: string;
  focus: string;
  date: string;
  readTime: string;
  summary: string;
  content: string[];
}

export const insights: Insight[] = [
  {
    slug: 'death-of-disconnected-ops',
    title: 'The Death of Disconnected Ops',
    focus: 'The Unified Pipeline Advantage',
    date: 'Oct 12, 2023',
    readTime: '4 min read',
    summary: 'Why treating strategy, automation, and content as separate silos creates "AI slop" and operational bottlenecks.',
    content: [
      'For the last decade, companies have treated digital growth as an assembly line of disconnected silos. Strategy happens in a boardroom. Operations and automation are handled by an IT or RevOps team. Content is outsourced to a creative agency or a team of freelancers.',
      'This model used to work when the barrier to creating content was high. But today, generative AI has driven the cost of producing average text, images, and video down to zero. The result? A massive flood of <gold>generic, disconnected "AI slop"</gold> that dilutes brand identity and clogs up the internet.',
      '[infographic:disconnected-ops]',
      'The core issue isn\'t the AI tools themselves; it\'s the disconnected operations. When the team building your automation workflows doesn\'t understand your core strategy, they build systems that move data efficiently but lack nuance. When your creative team doesn\'t understand your operational infrastructure, they produce beautiful assets that fail to integrate into your sales or marketing pipelines.',
      'True scale requires treating operations and creative as a <gold>single, connected pipeline</gold>. It means laying a deep strategic foundation, engineering custom agentic workflows that understand that strategy, and then forcing the raw output of those systems through a rigorous, cinematic design filter.',
      'When your strategy, your operational tech, and your final content are all driven by the exact same vision under one roof, your brand\'s digital presence remains completely coherent and undeniably impactful.'
    ]
  },
  {
    slug: 'agentic-workflows-vs-basic-automation',
    title: 'Agentic Workflows vs. Basic Automation',
    focus: 'Agentic Infrastructure',
    date: 'Nov 04, 2023',
    readTime: '5 min read',
    summary: 'Why triggering a webhook isn\'t enough anymore, and how autonomous agents actually scale human decision-making.',
    content: [
      'Basic automation is deterministic: "If X happens, then do Y." It is incredibly useful for moving data from a CRM to a spreadsheet, or sending a slack notification when a form is submitted. For years, tools like Zapier and Make have been the backbone of this "if/then" operational efficiency.',
      'But deterministic automation breaks down the moment <gold>ambiguity is introduced</gold>. It cannot make a judgment call. It cannot read the nuance of an angry customer email and decide whether to issue a refund or escalate to a manager. It only follows rigid paths.',
      '[infographic:agentic-workflows]',
      'Agentic workflows represent a fundamental shift in how we build operational infrastructure. Instead of programming rigid rules, we deploy <gold>autonomous AI agents</gold> equipped with a set of tools, a core prompt, and the ability to reason. These agents don\'t just move data around; they scale human decision-making.',
      'An agentic workflow can research a prospect, synthesize their recent company news, draft a highly personalized outreach strategy, and then decide on the optimal channel for delivery—all without human intervention. This is leverage on a completely different scale.',
      'By replacing basic automations with agentic infrastructure, small teams can execute with the operational capacity of large enterprises, while maintaining the nuanced judgment and strategic alignment that rigid automations lack.'
    ]
  },
  {
    slug: 'cinematic-standard-ai-world',
    title: 'The Cinematic Standard in an AI World',
    focus: 'Premium Output & Design Thinking',
    date: 'Jan 18, 2024',
    readTime: '4 min read',
    summary: 'Why human curation and rigorous design thinking are more valuable than ever when raw content costs approach zero.',
    content: [
      'We are living through a massive deflationary event in content creation. With LLMs and image generators, anyone can produce a thousand-word blog post or a photorealistic image in seconds. But as the floor for content quality has risen, the ceiling has remained exactly where it was.',
      'The problem with AI-generated content isn\'t that it\'s bad; it\'s that it\'s <gold>aggressively average</gold>. It lacks a point of view. It defaults to the mean of its training data. In a world drowning in average, generic content—what we call "AI slop"—the only way to cut through the noise is by being distinctly, undeniably premium.',
      '[infographic:cinematic-standard]',
      'This is why we enforce a <gold>Cinematic Standard</gold> on all output generated by our systems. We do not use AI to replace the creative process; we use AI systems to handle the heavy lifting of research, data synthesis, and initial drafting, so that human talent can focus entirely on editorial precision and design thinking.',
      'Cinematic content requires a human eye for pacing, contrast, typography, and narrative tension. It means refusing to publish the raw output of an LLM. It means applying a rigorous filter that ensures every piece of content feels crafted, deliberate, and expensive.',
      'In an era where anyone can generate volume, the brands that win will be the ones that leverage automation for scale, but rely on <gold>human taste for the final cinematic polish</gold>.'
    ]
  },
  {
    slug: 'mapping-the-core',
    title: 'Mapping the Core (Why Tech Stacks Come Last)',
    focus: 'Deep Strategy',
    date: 'Mar 02, 2024',
    readTime: '3 min read',
    summary: 'Why the biggest mistake companies make is buying AI tools before they understand their own operations.',
    content: [
      'The most common mistake founders make when trying to "implement AI" is starting with the technology. They read about a new tool, sign up for a subscription, and then scramble to find a use case for it within their company. <gold>This is backwards</gold>, and it almost always leads to wasted capital and team frustration.',
      'The best AI implementations never start with a tech stack. They start with a deep, uncompromising audit of the business\'s core operations. Before writing a single line of code or deploying a single agent, you must <gold>map the core strategy</gold>.',
      '[infographic:tech-stack]',
      'What is the actual bottleneck in your delivery? Where are your highest-paid employees spending time on low-leverage tasks? What is the unique value proposition that your brand must protect at all costs?',
      'Only once the strategy is mapped and the operational bottlenecks are clearly defined do we look at technology. <gold>The technology should serve the brand\'s unique identity</gold>—not the other way around. By starting with deep analysis rather than shiny new tools, we ensure that the systems we eventually build deliver actual commercial value, rather than just technological novelty.'
    ]
  }
];
