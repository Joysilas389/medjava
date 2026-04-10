/* ============================================
   MedJava — Curriculum Tree Definition
   ============================================ */

const CURRICULUM = [
  {
    id: 'java-foundations',
    title: 'Java Foundations',
    icon: 'fa-cube',
    topics: [
      { id: 'java-home',       title: 'Java HOME', status: 'completed' },
      { id: 'java-intro',      title: 'Java Intro', status: 'completed' },
      { id: 'java-get-started', title: 'Java Get Started', status: 'completed' },
      { id: 'java-syntax',     title: 'Java Syntax', status: 'completed' },
      { id: 'java-output',     title: 'Java Output', status: 'completed' },
      { id: 'java-comments',   title: 'Java Comments', status: 'not-started' },
      { id: 'java-variables',  title: 'Java Variables', status: 'completed' },
      { id: 'java-datatypes',  title: 'Java Data Types', status: 'completed' },
      { id: 'java-typecasting', title: 'Java Type Casting', status: 'not-started' },
      { id: 'java-operators',  title: 'Java Operators', status: 'completed' },
      { id: 'java-strings',    title: 'Java Strings', status: 'not-started' },
      { id: 'java-math',       title: 'Java Math', status: 'not-started' },
      { id: 'java-booleans',   title: 'Java Booleans', status: 'completed' },
      { id: 'java-ifelse',     title: 'Java If...Else', status: 'completed' },
      { id: 'java-switch',     title: 'Java Switch', status: 'not-started' },
      { id: 'java-while',      title: 'Java While Loop', status: 'not-started' },
      { id: 'java-for',        title: 'Java For Loop', status: 'not-started' },
      { id: 'java-break',      title: 'Java Break/Continue', status: 'not-started' },
      { id: 'java-arrays',     title: 'Java Arrays', status: 'not-started' },
    ]
  },
  {
    id: 'java-methods',
    title: 'Java Methods',
    icon: 'fa-puzzle-piece',
    topics: [
      { id: 'java-methods',         title: 'Java Methods', status: 'not-started' },
      { id: 'java-method-params',   title: 'Method Parameters', status: 'not-started' },
      { id: 'java-method-overload', title: 'Method Overloading', status: 'not-started' },
      { id: 'java-scope',           title: 'Java Scope', status: 'not-started' },
      { id: 'java-recursion',       title: 'Java Recursion', status: 'not-started' },
    ]
  },
  {
    id: 'java-oop',
    title: 'Java Classes (OOP)',
    icon: 'fa-sitemap',
    topics: [
      { id: 'java-oop-intro',      title: 'Java OOP', status: 'not-started' },
      { id: 'java-classes',        title: 'Classes/Objects', status: 'not-started' },
      { id: 'java-attributes',     title: 'Class Attributes', status: 'not-started' },
      { id: 'java-class-methods',  title: 'Class Methods', status: 'not-started' },
      { id: 'java-constructors',   title: 'Constructors', status: 'not-started' },
      { id: 'java-this',           title: 'this Keyword', status: 'not-started' },
      { id: 'java-modifiers',      title: 'Modifiers', status: 'not-started' },
      { id: 'java-encapsulation',  title: 'Encapsulation', status: 'not-started' },
      { id: 'java-packages',       title: 'Packages / API', status: 'not-started' },
      { id: 'java-inheritance',    title: 'Inheritance', status: 'not-started' },
      { id: 'java-polymorphism',   title: 'Polymorphism', status: 'not-started' },
      { id: 'java-super',          title: 'super Keyword', status: 'not-started' },
      { id: 'java-inner-classes',  title: 'Inner Classes', status: 'not-started' },
      { id: 'java-abstraction',    title: 'Abstraction', status: 'not-started' },
      { id: 'java-interface',      title: 'Interface', status: 'not-started' },
      { id: 'java-enum',           title: 'Enum', status: 'not-started' },
      { id: 'java-scanner-deep',   title: 'Scanner Deep Dive', status: 'not-started' },
      { id: 'java-date',           title: 'Java Date', status: 'not-started' },
    ]
  },
  {
    id: 'java-errors',
    title: 'Errors & Exceptions',
    icon: 'fa-bug',
    topics: [
      { id: 'java-errors',        title: 'Java Errors', status: 'not-started' },
      { id: 'java-debugging',     title: 'Java Debugging', status: 'not-started' },
      { id: 'java-exceptions',    title: 'Java Exceptions', status: 'not-started' },
      { id: 'java-multi-except',  title: 'Multiple Exceptions', status: 'not-started' },
      { id: 'java-try-resources', title: 'try-with-resources', status: 'not-started' },
    ]
  },
  {
    id: 'java-files',
    title: 'File Handling & I/O',
    icon: 'fa-folder-open',
    topics: [
      { id: 'java-files-intro',  title: 'Java Files', status: 'not-started' },
      { id: 'java-file-ops',     title: 'Create/Write/Read/Delete', status: 'not-started' },
      { id: 'java-io-streams',   title: 'I/O Streams', status: 'not-started' },
      { id: 'java-file-streams', title: 'FileInput/OutputStream', status: 'not-started' },
      { id: 'java-buffered',     title: 'BufferedReader/Writer', status: 'not-started' },
    ]
  },
  {
    id: 'java-data-structures',
    title: 'Data Structures',
    icon: 'fa-database',
    topics: [
      { id: 'java-collections',  title: 'Collections', status: 'not-started' },
      { id: 'java-arraylist',    title: 'ArrayList', status: 'not-started' },
      { id: 'java-linkedlist',   title: 'LinkedList', status: 'not-started' },
      { id: 'java-hashset',      title: 'HashSet', status: 'not-started' },
      { id: 'java-hashmap',      title: 'HashMap', status: 'not-started' },
      { id: 'java-treemap',      title: 'TreeMap', status: 'not-started' },
      { id: 'java-iterator',     title: 'Iterator', status: 'not-started' },
      { id: 'java-algorithms',   title: 'Algorithms', status: 'not-started' },
    ]
  },
  {
    id: 'java-advanced',
    title: 'Java Advanced',
    icon: 'fa-rocket',
    topics: [
      { id: 'java-wrapper',    title: 'Wrapper Classes', status: 'not-started' },
      { id: 'java-generics',   title: 'Generics', status: 'not-started' },
      { id: 'java-lambda',     title: 'Lambda Expressions', status: 'not-started' },
      { id: 'java-streams',    title: 'Streams', status: 'not-started' },
      { id: 'java-concurrency', title: 'Concurrency', status: 'not-started' },
    ]
  },
  {
    id: 'med-software',
    title: 'Medical Software Engineering',
    icon: 'fa-hospital',
    topics: [
      { id: 'med-hospital-model', title: 'Hospital System Model', status: 'not-started' },
      { id: 'med-patient-reg',    title: 'Patient Registration', status: 'not-started' },
      { id: 'med-emr',            title: 'EMR Design', status: 'not-started' },
      { id: 'med-lab',            title: 'Lab Information System', status: 'not-started' },
      { id: 'med-prescription',   title: 'Prescription System', status: 'not-started' },
      { id: 'med-icu',            title: 'ICU Monitoring', status: 'not-started' },
      { id: 'med-device',         title: 'Device Integration', status: 'not-started' },
      { id: 'med-hl7',            title: 'HL7 & FHIR', status: 'not-started' },
      { id: 'med-dicom',          title: 'DICOM Imaging', status: 'not-started' },
    ]
  },
  {
    id: 'med-security',
    title: 'Security for Patient Data',
    icon: 'fa-shield-halved',
    topics: [
      { id: 'sec-hashing',     title: 'SHA-256 Hashing', status: 'not-started' },
      { id: 'sec-aes',         title: 'AES-256 Encryption', status: 'not-started' },
      { id: 'sec-rsa',         title: 'RSA Encryption', status: 'not-started' },
      { id: 'sec-signatures',  title: 'Digital Signatures', status: 'not-started' },
      { id: 'sec-access',      title: 'Access Control Models', status: 'not-started' },
      { id: 'sec-api',         title: 'Secure APIs (JWT)', status: 'not-started' },
    ]
  },
  {
    id: 'med-ml',
    title: 'Machine Learning for Medicine',
    icon: 'fa-brain',
    topics: [
      { id: 'ml-fundamentals',    title: 'ML Fundamentals', status: 'not-started' },
      { id: 'ml-features',        title: 'Feature Engineering', status: 'not-started' },
      { id: 'ml-classification',  title: 'Disease Prediction', status: 'not-started' },
      { id: 'ml-regression',      title: 'Dosage Recommendation', status: 'not-started' },
      { id: 'ml-evaluation',      title: 'Model Evaluation', status: 'not-started' },
    ]
  },
  {
    id: 'med-dl',
    title: 'Deep Learning for Imaging',
    icon: 'fa-eye',
    topics: [
      { id: 'dl-nn-basics',     title: 'Neural Network Basics', status: 'not-started' },
      { id: 'dl-cnn',           title: 'CNN for X-ray/MRI', status: 'not-started' },
      { id: 'dl-dl4j',          title: 'DL4J Models', status: 'not-started' },
      { id: 'dl-ethics',        title: 'Ethics of Medical AI', status: 'not-started' },
    ]
  },
  {
    id: 'med-domains',
    title: 'Medical Domains',
    icon: 'fa-stethoscope',
    topics: [
      { id: 'dom-cardiology',   title: 'Cardiology Software', status: 'not-started' },
      { id: 'dom-radiology',    title: 'Radiology & Imaging', status: 'not-started' },
      { id: 'dom-telemedicine', title: 'Telemedicine', status: 'not-started' },
      { id: 'dom-oncology',     title: 'Oncology & Chemo', status: 'not-started' },
      { id: 'dom-ophthalmology', title: 'Ophthalmology', status: 'not-started' },
      { id: 'dom-obgyn',        title: 'OB/GYN', status: 'not-started' },
      { id: 'dom-pediatrics',   title: 'Pediatrics', status: 'not-started' },
      { id: 'dom-emergency',    title: 'Emergency Medicine', status: 'not-started' },
      { id: 'dom-lab',          title: 'Lab Information', status: 'not-started' },
      { id: 'dom-pharmacy',     title: 'Pharmacy Systems', status: 'not-started' },
      { id: 'dom-mental',       title: 'Mental Health', status: 'not-started' },
      { id: 'dom-public-health', title: 'Public Health', status: 'not-started' },
      { id: 'dom-cdss',         title: 'Clinical Decision Support', status: 'not-started' },
    ]
  },
  {
    id: 'med-projects',
    title: 'Medical Projects',
    icon: 'fa-flask-vial',
    topics: [
      { id: 'proj-triage',      title: 'P1: Vital Signs Triage', status: 'not-started' },
      { id: 'proj-bmi',         title: 'P2: BMI Classifier', status: 'not-started' },
      { id: 'proj-records',     title: 'P3: Patient Records', status: 'not-started' },
      { id: 'proj-icu',         title: 'P4: ICU Monitor', status: 'not-started' },
      { id: 'proj-prescription', title: 'P5: Prescription Calc', status: 'not-started' },
      { id: 'proj-emr',         title: 'P6: Encrypted EMR', status: 'not-started' },
      { id: 'proj-hl7',         title: 'P7: HL7 Parser', status: 'not-started' },
      { id: 'proj-lab',         title: 'P8: Lab Analyzer', status: 'not-started' },
      { id: 'proj-drugs',       title: 'P9: Drug Interactions', status: 'not-started' },
      { id: 'proj-ml',          title: 'P10: ML Diagnosis', status: 'not-started' },
    ]
  },
];

function renderCurriculum(container, filter = '') {
  container.innerHTML = '';
  const lowerFilter = filter.toLowerCase();

  CURRICULUM.forEach(section => {
    const filteredTopics = section.topics.filter(t =>
      !filter || t.title.toLowerCase().includes(lowerFilter)
    );
    if (filter && filteredTopics.length === 0) return;

    const sectionEl = document.createElement('div');
    sectionEl.className = 'mj-section';
    sectionEl.dataset.sectionId = section.id;

    // Check if first two sections should be open by default
    const isOpen = section.id === 'java-foundations' || !filter ? '' : ' open';

    sectionEl.innerHTML = `
      <div class="mj-section-header${section.id === 'java-foundations' ? ' expanded' : ''}" data-section="${section.id}">
        <i class="fas fa-chevron-right"></i>
        <i class="fas ${section.icon}" style="color: var(--mj-primary); font-size: 0.7rem;"></i>
        <span>${section.title}</span>
      </div>
      <div class="mj-section-items">
        ${filteredTopics.map(t => `
          <div class="mj-topic-item" data-topic-id="${t.id}" data-section-title="${section.title}">
            <span class="status-dot ${t.status}"></span>
            <span>${t.title}</span>
          </div>
        `).join('')}
      </div>
    `;

    if (section.id === 'java-foundations' || filter) {
      sectionEl.classList.add('open');
    }

    container.appendChild(sectionEl);
  });

  // Section toggle
  container.querySelectorAll('.mj-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.mj-section');
      section.classList.toggle('open');
      header.classList.toggle('expanded');
    });
  });

  // Topic click
  container.querySelectorAll('.mj-topic-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.mj-topic-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const topicId = item.dataset.topicId;
      const sectionTitle = item.dataset.sectionTitle;
      const topicTitle = item.querySelector('span:last-child').textContent;
      if (window.MJApp) {
        window.MJApp.openTopic(topicId, topicTitle, sectionTitle);
      }
    });
  });
}

function getProgress() {
  let total = 0, completed = 0;
  CURRICULUM.forEach(s => {
    s.topics.forEach(t => {
      total++;
      if (t.status === 'completed') completed++;
    });
  });
  return Math.round((completed / total) * 100);
}

function updateTopicStatus(topicId, status) {
  CURRICULUM.forEach(s => {
    s.topics.forEach(t => {
      if (t.id === topicId) t.status = status;
    });
  });
}
