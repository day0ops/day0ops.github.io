// Category definitions with their associated tags
export const categories = {
  'cloud-native': {
    title: 'Cloud Native',
    subtitle: 'Platform \u00b7 Cloud \u00b7 Networking',
    description:
      'Running distributed systems at scale \u2014 the stuff that breaks at 3am, the config you misread, and the runbook you forgot to write.',
    tags: [
      'kubernetes',
      'istio',
      'cilium',
      'observability',
      'gitops',
      'docker',
      'containers',
      'networking',
      'cloud',
      'infrastructure',
    ],
    color: 'primary',
  },
  'ai-engineering': {
    title: 'AI Engineering',
    subtitle: 'LLMs \u00b7 Agents \u00b7 MLOps',
    description:
      "The infrastructure shift is real and it's breaking assumptions we spent a decade building. What it takes to run models in production.",
    tags: ['ai', 'llm', 'agents', 'mlops', 'gpu', 'rag', 'machine-learning', 'deep-learning'],
    color: 'oops',
  },
  'software-engineering': {
    title: 'Software Engineering',
    subtitle: 'CS \u00b7 DevOps \u00b7 Open Source',
    description:
      'The craft underneath the tools \u2014 computer science fundamentals that still matter, DevOps practices that actually reduce toil, and honest takes on open source.',
    tags: [
      'software-engineering',
      'devops',
      'sre',
      'linux',
      'architecture',
      'programming',
      'open-source',
      'algorithms',
    ],
    color: 'warn',
  },
  tinkering: {
    title: 'Tinkering',
    subtitle: 'Homelab \u00b7 Lab Notes \u00b7 Side Projects',
    description:
      'The stuff that happens off the clock \u2014 homelab experiments, weekend projects, and the random rabbit holes that teach you more than any course ever could.',
    tags: [
      'homelab',
      'lab-notes',
      'side-project',
      'raspberry-pi',
      'self-hosted',
      'automation',
      'hardware',
      'diy',
      'personal',
    ],
    color: 'success',
  },
} as const;

export type CategoryKey = keyof typeof categories;
