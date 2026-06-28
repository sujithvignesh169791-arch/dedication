export interface ResumeJSON {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location: string;
    achievements: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
    gpa?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export function generateModernTemplate(data: ResumeJSON): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #333; line-height: 1.5; display: flex; }
    .sidebar { width: 30%; background-color: #f8fafc; padding: 30px; border-right: 1px solid #e2e8f0; }
    .main { width: 70%; padding: 30px; }
    h1 { color: #2563eb; font-size: 28px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
    h2 { color: #2563eb; font-size: 18px; margin: 20px 0 10px 0; border-bottom: 2px solid #2563eb; padding-bottom: 5px; text-transform: uppercase; }
    h3 { font-size: 16px; margin: 0 0 5px 0; color: #1e293b; }
    .contact-info { font-size: 14px; margin-bottom: 20px; color: #475569; }
    .contact-item { margin-bottom: 8px; }
    .section-title-side { color: #2563eb; font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; text-transform: uppercase; }
    .skill-tag { display: inline-block; background: #e2e8f0; color: #334155; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 0 4px 4px 0; }
    .exp-item { margin-bottom: 20px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
    .date { font-size: 14px; color: #64748b; font-style: italic; }
    ul { margin: 5px 0 0 0; padding-left: 20px; font-size: 14px; }
    li { margin-bottom: 5px; }
    .summary { font-size: 14px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="sidebar">
    <h1>${data.personalInfo.name}</h1>
    <div class="contact-info">
      <div class="contact-item">${data.personalInfo.email}</div>
      <div class="contact-item">${data.personalInfo.phone}</div>
      <div class="contact-item">${data.personalInfo.location}</div>
      ${data.personalInfo.linkedIn ? `<div class="contact-item">${data.personalInfo.linkedIn}</div>` : ''}
      ${data.personalInfo.website ? `<div class="contact-item">${data.personalInfo.website}</div>` : ''}
    </div>

    <div class="section-title-side">Technical Skills</div>
    <div>${data.skills.technical.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>

    <div class="section-title-side">Tools & Tech</div>
    <div>${data.skills.tools.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>

    <div class="section-title-side">Soft Skills</div>
    <div>${data.skills.soft.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
  </div>
  
  <div class="main">
    <h2>Professional Summary</h2>
    <div class="summary">${data.summary}</div>

    <h2>Experience</h2>
    ${data.experience.map(exp => `
      <div class="exp-item">
        <div class="exp-header">
          <h3>${exp.title} — ${exp.company}</h3>
          <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
        </div>
        <div class="date" style="margin-bottom: 5px;">${exp.location}</div>
        <ul>
          ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
        </ul>
      </div>
    `).join('')}

    <h2>Education</h2>
    ${data.education.map(edu => `
      <div class="exp-item">
        <div class="exp-header">
          <h3>${edu.degree} in ${edu.field}</h3>
          <div class="date">${edu.graduationYear}</div>
        </div>
        <div>${edu.institution}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
      </div>
    `).join('')}
    
    ${data.projects && data.projects.length > 0 ? `
    <h2>Projects</h2>
    ${data.projects.map(proj => `
      <div class="exp-item">
        <h3>${proj.name}</h3>
        <p style="font-size:14px; margin: 5px 0;">${proj.description}</p>
        <div>${proj.technologies.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
      </div>
    `).join('')}
    ` : ''}
  </div>
</body>
</html>
  `;
}

export function generateClassicTemplate(data: ResumeJSON): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 40px; color: #000; line-height: 1.4; }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 10px; }
    h1 { font-size: 24px; margin: 0 0 5px 0; text-transform: uppercase; }
    .contact { font-size: 14px; }
    h2 { font-size: 16px; margin: 15px 0 5px 0; text-transform: uppercase; border-bottom: 1px solid #000; }
    h3 { font-size: 14px; margin: 10px 0 0 0; }
    .date-loc { float: right; font-weight: normal; font-size: 14px; font-style: italic; }
    ul { margin: 5px 0; padding-left: 20px; font-size: 14px; }
    li { margin-bottom: 4px; }
    .summary { font-size: 14px; margin-top: 10px; }
    .skills-block { font-size: 14px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.personalInfo.name}</h1>
    <div class="contact">
      ${data.personalInfo.location} • ${data.personalInfo.phone} • ${data.personalInfo.email}
      ${data.personalInfo.linkedIn ? ` • ${data.personalInfo.linkedIn}` : ''}
    </div>
  </div>

  <h2>Summary</h2>
  <div class="summary">${data.summary}</div>

  <h2>Professional Experience</h2>
  ${data.experience.map(exp => `
    <div>
      <h3><strong>${exp.company}</strong> <span class="date-loc">${exp.location}</span></h3>
      <div style="font-style: italic; font-size: 14px;">${exp.title} <span class="date-loc">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span></div>
      <ul>
        ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <h2>Education</h2>
  ${data.education.map(edu => `
    <div>
      <h3><strong>${edu.institution}</strong> <span class="date-loc">${edu.graduationYear}</span></h3>
      <div style="font-size: 14px;">${edu.degree} in ${edu.field}${edu.gpa ? `, GPA: ${edu.gpa}` : ''}</div>
    </div>
  `).join('')}

  <h2>Skills</h2>
  <div class="skills-block">
    <div><strong>Technical:</strong> ${data.skills.technical.join(', ')}</div>
    <div><strong>Tools:</strong> ${data.skills.tools.join(', ')}</div>
    <div><strong>Soft:</strong> ${data.skills.soft.join(', ')}</div>
  </div>
</body>
</html>
  `;
}

export function generateMinimalTemplate(data: ResumeJSON): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 60px; color: #111827; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
    h1 { font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -0.05em; }
    .contact { text-align: right; font-size: 13px; color: #6b7280; }
    .contact div { margin-bottom: 2px; }
    .section { display: flex; margin-bottom: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px; }
    .section-title { width: 20%; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; font-weight: 600; }
    .section-content { width: 80%; }
    .item { margin-bottom: 25px; }
    .item:last-child { margin-bottom: 0; }
    .item-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
    .item-title { font-weight: 600; font-size: 16px; }
    .item-subtitle { color: #4b5563; font-size: 15px; }
    .date { font-size: 13px; color: #9ca3af; font-variant-numeric: tabular-nums; }
    ul { margin: 10px 0 0 0; padding-left: 18px; font-size: 14px; color: #374151; }
    li { margin-bottom: 6px; }
    .summary { font-size: 15px; color: #374151; }
    .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.personalInfo.name}</h1>
    <div class="contact">
      <div>${data.personalInfo.email}</div>
      <div>${data.personalInfo.phone}</div>
      <div>${data.personalInfo.location}</div>
      ${data.personalInfo.linkedIn ? `<div>${data.personalInfo.linkedIn}</div>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">About</div>
    <div class="section-content summary">${data.summary}</div>
  </div>

  <div class="section">
    <div class="section-title">Experience</div>
    <div class="section-content">
      ${data.experience.map(exp => `
        <div class="item">
          <div class="item-header">
            <div class="item-title">${exp.title}</div>
            <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
          </div>
          <div class="item-subtitle">${exp.company}, ${exp.location}</div>
          <ul>
            ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Education</div>
    <div class="section-content">
      ${data.education.map(edu => `
        <div class="item">
          <div class="item-header">
            <div class="item-title">${edu.degree} in ${edu.field}</div>
            <div class="date">${edu.graduationYear}</div>
          </div>
          <div class="item-subtitle">${edu.institution}${edu.gpa ? ` • ${edu.gpa}` : ''}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Skills</div>
    <div class="section-content skills-grid">
      <div>
        <strong>Technical</strong><br/>
        <span style="color:#6b7280">${data.skills.technical.join(', ')}</span>
      </div>
      <div>
        <strong>Tools & Soft Skills</strong><br/>
        <span style="color:#6b7280">${data.skills.tools.join(', ')}, ${data.skills.soft.join(', ')}</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateTemplate(data: ResumeJSON, style: 'modern' | 'classic' | 'minimal'): string {
  if (style === 'modern') return generateModernTemplate(data);
  if (style === 'classic') return generateClassicTemplate(data);
  return generateMinimalTemplate(data);
}
