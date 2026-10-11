/**
 * Every factual claim on the site, in one place.
 *
 * Source of truth is the resume - nothing here is invented, and the only
 * URLs are ones that appear on it. Components map over this; no copy lives
 * inside a component.
 */

export const profile = {
  name: 'Deepak Jaygopal Gond',
  shortName: 'Deepak Gond',
  role: 'Data Analyst',
  discipline: 'Data Analyst | Data Engineering',
  location: 'Mumbai, Maharashtra, India',
  email: 'gonddeepak786@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/deepak-gond/',
    github: 'https://github.com/frienf',
    leetcode: 'https://leetcode.com/u/dgond',
  },
};

export const nav = [
  { id: 'impact', label: 'Impact' },
  { id: 'how-i-work', label: 'How I work' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'systems', label: 'Systems' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export const hero = {
  eyebrow: 'Data Analyst \u2022 Data Engineering',
  titleLead: 'Turning data into ',
  titleAccent: 'decisions.',
  lede:
    'I build data systems, analytics workflows and interactive dashboards that ' +
    'turn everyday operational data into measurable business impact \u2014 across ' +
    'supply chain, sales and finance.',
  meta: [
    { icon: 'pin', text: 'Mumbai, Maharashtra, India' },
    { icon: 'brief', text: 'Open to Data Analyst & Data Engineering roles \u00b7 Remote / Hybrid' },
    { icon: 'cap', text: 'M.Sc. Computer Science \u00b7 CGPA 8.84' },
  ],
  // Named in text so the 3D scene never carries meaning on its own
  stages: ['Raw data', 'Transform', 'Analyze', 'Visualize', 'Insight'],
};

export const metrics = [
  {
    value: 40,
    unit: '%',
    label: 'Less manual reporting time',
    note: 'Power BI \u00b7 Looker Studio \u00b7 Apps Script',
    series: [100, 88, 74, 70, 58, 49, 44, 40],
  },
  {
    value: 35,
    unit: '%',
    label: 'Higher collection efficiency',
    note: 'Payment & sales KPI trackers',
    series: [100, 104, 112, 118, 121, 128, 131, 135],
  },
  {
    value: 25,
    unit: '%',
    label: 'Better order fulfilment accuracy',
    note: 'ERPNext data in Power BI',
    series: [100, 103, 108, 110, 116, 119, 122, 125],
  },
  {
    value: 30,
    unit: '%',
    label: 'Higher on-time delivery rate',
    note: 'FMS order-to-dispatch trackers',
    series: [100, 102, 109, 114, 118, 124, 127, 130],
  },
];

export const workflow = [
  {
    id: 'collect',
    name: 'Collect',
    stage: 'Stage 01 \u00b7 Raw data',
    body:
      'Get to the system of record instead of a forwarded spreadsheet. I pull from ' +
      'ERP tables, REST APIs, operational databases and the sheets teams actually ' +
      'live in, then schedule the pull so nobody has to remember it.',
    example:
      'connected ERPNext order, inventory and dispatch data so one pipeline fed ' +
      'every downstream report.',
    tags: ['ERPNext', 'REST APIs', 'MySQL', 'PostgreSQL', 'Google Sheets', 'Apps Script'],
    accent: 1,
  },
  {
    id: 'clean',
    name: 'Clean',
    stage: 'Stage 01 \u00b7 Raw data',
    body:
      'Reconcile, validate, de-duplicate. Most reporting disagreements are really ' +
      'data-quality problems, so I fix them at the source and write the validation ' +
      'rules down so the fix holds next month too.',
    example:
      'SQL and Python reconciliation of warehouse data cut inventory discrepancies by 20%.',
    tags: ['SQL', 'Python', 'pandas', 'NumPy', 'Data validation', 'Reconciliation'],
    accent: 2,
  },
  {
    id: 'transform',
    name: 'Transform',
    stage: 'Stage 02 \u00b7 Transform',
    body:
      'Shape raw records into analysis-ready tables with ETL/ELT steps that run on a ' +
      'schedule. If a human is copy-pasting between two systems, that is the next ' +
      'thing I automate.',
    example:
      'automated sales and warehouse KPI reporting, removing 40% of manual reporting time.',
    tags: ['ETL / ELT', 'Power Query', 'Apps Script', 'Airflow', 'dbt', 'PySpark'],
    accent: 1,
  },
  {
    id: 'model',
    name: 'Model',
    stage: 'Stage 02 \u00b7 Transform',
    body:
      'Build a model the business can reason about: fact and dimension tables, clear ' +
      'grain, measures defined once. Good modelling is what stops two dashboards from ' +
      'reporting two different revenue numbers.',
    example:
      'a shared order-to-dispatch model behind inventory, sales and finance reporting.',
    tags: ['Dimensional modelling', 'Star schema', 'DAX', 'Data warehousing', 'Snowflake', 'BigQuery'],
    accent: 1,
  },
  {
    id: 'analyze',
    name: 'Analyze',
    stage: 'Stage 03 \u00b7 Analyze',
    body:
      'Ask the question properly before answering it. Exploratory analysis to find ' +
      'where the money or the delay actually sits, then trend, cohort and hypothesis ' +
      'testing to check the finding is real and not last week\u2019s noise.',
    example:
      'payment-collection analysis that lifted collection efficiency by 35% and ' +
      'shortened procurement cycles.',
    tags: ['EDA', 'Hypothesis testing', 'A/B testing', 'Regression', 'Cohort analysis', 'SciPy'],
    accent: 1,
  },
  {
    id: 'visualize',
    name: 'Visualize',
    stage: 'Stage 04 \u00b7 Visualize',
    body:
      'One screen, the decision it supports, and nothing else. I design dashboards ' +
      'around the question the viewer arrived with, keep the chart types boring and ' +
      'put the number people need in the first glance.',
    example:
      'interactive Power BI and Looker Studio dashboards giving end-to-end visibility ' +
      'across orders, inventory and dispatch.',
    tags: ['Power BI', 'Looker Studio', 'Tableau', 'Matplotlib', 'Seaborn', 'Streamlit'],
    accent: 1,
  },
  {
    id: 'decide',
    name: 'Decide',
    stage: 'Stage 05 \u00b7 Insight',
    body:
      'The work is only finished when someone changes what they do. I walk owners ' +
      'through what the data says, agree the action and the threshold that would ' +
      'trigger it, then track whether the number actually moved.',
    example: 'FMS trackers that flag slipping orders early \u2014 on-time delivery up 30%.',
    tags: ['KPI reporting', 'Data storytelling', 'Stakeholder review', 'Alerting', 'Documentation'],
    accent: 1,
  },
];

/** Bullets use **…** to mark the measured figure; <Highlight> renders it. */
export const roles = [
  {
    org: 'Voraco Distributors Pvt. Ltd.',
    title: 'Junior Data Analyst',
    meta: 'Full-time \u00b7 Mumbai',
    dates: 'Sept 2025 \u2013 Jun 2026',
    points: [
      'Reduced inventory discrepancies by **20%** by using SQL and Python to clean, reconcile and validate warehouse data.',
      'Cut manual reporting time by **40%** by automating sales and warehouse KPI reporting with interactive Power BI, Looker Studio and Google Sheets (Apps Script) dashboards.',
      'Improved order fulfilment accuracy by **25%** by integrating ERPNext data into Power BI dashboards that give end-to-end visibility across orders, inventory and dispatch.',
      'Raised on-time delivery rates by **30%** by building Flowchart Management System (FMS) trackers that automate supply-chain monitoring from sales-order creation to dispatch.',
      'Improved collection efficiency by **35%** and reduced procurement cycle delays by developing sales reporting and payment-collection trackers that monitor financial KPIs.',
    ],
    stack: ['SQL', 'Python', 'Power BI', 'Looker Studio', 'Apps Script', 'ERPNext', 'Google Sheets', 'Supply chain', 'Financial KPIs'],
    accent: 3,
  },
  {
    org: 'Outlier.ai',
    title: 'Freelance Software Developer',
    meta: 'Remote',
    dates: 'Apr 2025 \u2013 Jun 2025',
    points: [
      'Sped up prototype iterations by **15%** by building UI-focused web apps with React, TypeScript and Tailwind CSS for AI training projects \u2014 shortlisted in CodeCircuit Hackathon 2025.',
      'Improved model training accuracy by **25%** by integrating TensorFlow models into data annotation tools.',
      'Reduced bugs by **30%** by using debugging tools such as Jam to streamline remote development workflows.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'TensorFlow', 'Debugging workflows'],
    accent: 2,
  },
];

export const projects = [
  {
    id: 'mathsketch',
    featured: true,
    title: 'MathSketch',
    kicker: 'Interactive equation solver',
    motif: 'equation',
    year: 'May 2024',
    outcome: { figure: '90%', caption: 'expression recognition accuracy' },
    summary:
      'Draw a maths expression on a canvas and get a rendered, solved result back \u2014 handwriting in, LaTeX out.',
    problem:
      'Typing maths is slower than writing it, and most solvers expect clean syntax rather than a sketch.',
    approach:
      'A FastAPI backend processes base64 canvas images through the OpenRouter API, paired with a responsive React frontend; an HTML5 canvas adds undo/redo and colour swatches, and results render as draggable LaTeX with MathJax.',
    result:
      '90% expression recognition accuracy, with user interaction efficiency up 25% after the canvas rework.',
    tags: ['Python', 'FastAPI', 'React', 'TypeScript', 'OpenRouter', 'MathJax', 'Mantine', 'Tailwind CSS'],
    accent: 2,
  },
  {
    id: 'sudoku',
    title: 'Sudoku Solver',
    kicker: 'Computer vision \u00b7 Streamlit app',
    motif: 'grid',
    year: 'Apr 2023',
    outcome: { figure: '95%', caption: 'digit recognition accuracy' },
    summary:
      'Point it at a photo of a puzzle: the grid is detected, the digits are read and the solution comes back in the app.',
    problem: 'Reading a printed grid reliably is the hard part \u2014 solving it is the easy part.',
    approach:
      'OpenCV handles grid detection and cell extraction, a TensorFlow model classifies the digits, and a backtracking solver runs behind a Streamlit interface.',
    result: '95% digit recognition accuracy and 30% faster solve time after optimising the backtracking algorithm.',
    tags: ['Python', 'OpenCV', 'TensorFlow', 'Streamlit'],
    accent: 2,
  },
  {
    id: 'sign-language',
    title: 'Sign Language Translator',
    kicker: 'Real-time CNN inference',
    motif: 'gesture',
    year: 'Nov 2022',
    outcome: { figure: '35', caption: 'gestures translated live' },
    summary:
      'A webcam, a custom CNN and a readable caption \u2014 finger-spelling turned into text as you sign.',
    problem: 'Gesture recognition has to run fast enough to feel live, on an ordinary laptop webcam.',
    approach:
      'Trained a custom CNN on 3,500 preprocessed images, with OpenCV handling capture and preprocessing for real-time inference.',
    result: '35 hand gestures (A\u2013Z, 1\u20139 and space) translated in real time.',
    tags: ['Python', 'TensorFlow', 'OpenCV', 'CNN'],
    accent: 2,
  },
];

/**
 * Pipeline steps behind each project. These are the text form of the
 * system diagrams - shown as a list on small screens, where a labelled
 * diagram cannot stay legible, and read by screen readers everywhere.
 */
export const systems = [
  {
    id: 'mathsketch',
    motif: 'equation',
    title: 'MathSketch',
    summary: 'Handwriting in, solved LaTeX out.',
    steps: [
      'Canvas sketch',
      'Base64 image',
      'FastAPI pre-processing',
      'OpenRouter vision + MathJax renderer',
      'LaTeX and solution',
    ],
  },
  {
    id: 'sudoku',
    motif: 'grid',
    title: 'Sudoku Solver',
    summary: 'A photo of a puzzle, read and solved.',
    steps: [
      'Puzzle photo',
      'OpenCV: grid detection, cell extraction, warp',
      'TensorFlow digit classifier',
      'Backtracking solver',
      'Solved grid in Streamlit',
    ],
  },
  {
    id: 'sign-language',
    motif: 'gesture',
    title: 'Sign Language Translator',
    summary: 'Finger-spelling captioned as you sign.',
    steps: [
      'Webcam frame',
      'OpenCV pre-processing: skin and contour',
      'Custom CNN across 35 gestures',
      'Real-time inference',
      'Live text caption',
    ],
  },
];

export const skillGroups = [
  {
    name: 'Data analysis & statistics',
    icon: 'sigma',
    open: true,
    items: ['SQL', 'Python', 'pandas', 'NumPy', 'SciPy', 'EDA', 'Hypothesis testing', 'Regression', 'Cohort analysis'],
  },
  {
    name: 'BI & visualization',
    icon: 'chart',
    open: true,
    items: ['Power BI', 'DAX', 'Power Query', 'Looker Studio', 'Tableau', 'Advanced Excel', 'Google Sheets', 'Matplotlib', 'Seaborn'],
  },
  {
    name: 'Data engineering',
    icon: 'flow',
    items: ['ETL / ELT pipelines', 'Data warehousing', 'Dimensional modelling', 'Data lakes', 'Data quality', 'REST APIs', 'ERP integration'],
  },
  {
    name: 'Big data & orchestration',
    icon: 'spark',
    items: ['Apache Spark', 'PySpark', 'Airflow', 'Kafka', 'dbt', 'Databricks', 'Power Automate'],
  },
  {
    name: 'Databases & warehouses',
    icon: 'db',
    items: ['MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Snowflake', 'BigQuery', 'Amazon Redshift'],
  },
  {
    name: 'Cloud & DevOps',
    icon: 'cloud',
    items: ['AWS (S3, Glue)', 'Google Cloud', 'Azure Data Factory', 'Docker', 'Git', 'GitHub', 'CI/CD', 'Linux'],
  },
  {
    name: 'Languages',
    icon: 'code',
    items: ['SQL', 'Python', 'DAX', 'JavaScript', 'TypeScript', 'Java', 'C++'],
  },
  {
    name: 'ML & web development',
    icon: 'brain',
    items: ['TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'NLP', 'FastAPI', 'Flask', 'React', 'Tailwind CSS'],
  },
];

export const about = {
  lead:
    'I like the moment a messy export turns into something a team can act on \u2014 ' +
    'and I like it even more when nobody has to build that report by hand again.',
  paragraphs: [
    'I am a Data Analyst in Mumbai working across analytics and data engineering. Most of my day is spent close to operations: warehouse counts that disagree with the ERP, a collection cycle that slipped, a report three people rebuild every Monday. I find the data behind it, automate the boring part and leave a dashboard that answers the question without me in the room.',
    'My background is computer science rather than pure analytics, which shows up in how I work \u2014 I am comfortable writing the pipeline, the API and the frontend when a problem needs all three. That curiosity is also why I keep building side projects with computer vision and AI tooling: it keeps me honest about what these systems can and cannot do.',
    'Right now I am looking for Data Analyst and Data Engineering work where the measurement matters \u2014 somewhere a 40% drop in manual reporting is treated as a result, not a nice-to-have.',
  ],
};

export const education = [
  {
    degree: 'M.Sc. Computer Science',
    school: 'BK Birla College, University of Mumbai',
    years: '2023\u20132025',
    cgpa: 'CGPA 8.84/10',
  },
  {
    degree: 'B.Sc. Computer Science',
    school: 'Rizvi College, University of Mumbai',
    years: '2020\u20132023',
    cgpa: 'CGPA 8.75/10',
  },
];

export const beliefs = [
  'Solving business problems with data, not dashboards for their own sake',
  'Automating the report that someone rebuilds every week',
  'Working on the data systems underneath \u2014 pipelines, models, quality checks',
  'Exploring AI and software development, usually by building something small',
];

export const contact = {
  title: 'Let\u2019s work with data.',
  lede:
    'If you have operational data that should be telling you more than it currently ' +
    'does, I would be glad to talk it through.',
  responseNote: 'Usually replies within 24 hours',
  links: [
    { icon: 'mail', label: profile.email, href: `mailto:${profile.email}` },
    { icon: 'github', label: 'github.com/frienf', href: profile.links.github },
    { icon: 'code', label: 'leetcode.com/u/dgond', href: profile.links.leetcode },
  ],
};
