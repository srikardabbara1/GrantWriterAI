// Grant proposal model function (no imports/exports)
function createGrantProposal(data) {
  return {
    title: data.title || "",
    applicantInfo: {
      fullName: data.applicantInfo?.fullName || "",
      organization: data.applicantInfo?.organization || "",
      role: data.applicantInfo?.role || "",
      contact: data.applicantInfo?.contact || "",
      linkedin: data.applicantInfo?.linkedin || "",
    },
    grantType: data.grantType || "",
    grantContext: {
      programOrAgency: data.grantContext?.programOrAgency || "",
      applicationDeadline: data.grantContext?.applicationDeadline || "",
    },
    projectSummary: {
      projectTitle: data.projectSummary?.projectTitle || "",
      elevatorPitch: data.projectSummary?.elevatorPitch || "",
      dates: data.projectSummary?.dates || "",
      fundingRequested: data.projectSummary?.fundingRequested || "",
    },
    methodology: {
      what: data.methodology?.what || "",
      how: data.methodology?.how || "",
      timeline: data.methodology?.timeline || "",
    },
    team: {
      members: data.team?.members || "",
      experience: data.team?.experience || "",
    },
    budget: {
      total: data.budget?.total || "",
      requested: data.budget?.requested || "",
      breakdown: data.budget?.breakdown || "",
      matching: data.budget?.matching || "",
    },
    problemStatement: {
      problem: data.problemStatement?.problem || "",
      importance: data.problemStatement?.importance || "",
      affected: data.problemStatement?.affected || "",
    },
    goals: {
      primary: data.goals?.primary || "",
      objectives: data.goals?.objectives || "",
      tools: data.goals?.tools || "",
    },
    outcomes: {
      expected: data.outcomes?.expected || "",
      beneficiaries: data.outcomes?.beneficiaries || "",
      success: data.outcomes?.success || "",
      sustainability: data.outcomes?.sustainability || "",
    },
    compliance: {
      alignment: data.compliance?.alignment || "",
      considerations: data.compliance?.considerations || "",
    },
    supportingMaterials: {
      cvs: data.supportingMaterials?.cvs || null,
      letters: data.supportingMaterials?.letters || null,
      pastGrants: data.supportingMaterials?.pastGrants || null,
      whitepapers: data.supportingMaterials?.whitepapers || null,
    }
  };
}

window.addEventListener('DOMContentLoaded', function() {
  // Set grant title from localStorage
  var title = localStorage.getItem('grantTitle');
  var titleElem = document.querySelector('.grant-title');
  if (titleElem) titleElem.textContent = title || 'Grant Proposal';

  var form = document.querySelector('.grant-inputs-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect all form data
    var data = {
      title: localStorage.getItem('grantTitle'),
      applicantInfo: {
        fullName: form.querySelector('input[placeholder="Full Name"]').value,
        organization: form.querySelector('input[placeholder="Organization / institution (if applicable)"]').value,
        role: form.querySelector('input[placeholder="Role or Title"]').value,
        contact: form.querySelector('input[placeholder="Contact Info"]').value,
        linkedin: form.querySelector('input[placeholder="Linkedin, or Personal Website (optional but useful)"]').value,
      },
      grantType: form.querySelector('select').value,
      grantContext: {
        programOrAgency: form.querySelector('input[placeholder="Project start program or agency name"]').value,
        applicationDeadline: form.querySelector('input[placeholder="Application deadline"]').value,
      },
      projectSummary: {
        projectTitle: form.querySelector('input[placeholder="Project Title"]').value,
        elevatorPitch: form.querySelector('input[placeholder="One-liner elevator pitch"]').value,
        dates: form.querySelector('input[placeholder="Project start and end dates"]').value,
        fundingRequested: form.querySelectorAll('select')[1]?.value || '',
      },
      methodology: {
        what: form.querySelector('input[placeholder="What will be done?"]').value,
        how: form.querySelector('input[placeholder="How will it be done?"]').value,
        timeline: form.querySelector('input[placeholder="Timeline or milestones"]').value,
      },
      team: {
        members: form.querySelector('input[placeholder="Who is on the team? What are their roles and qualifications?"]').value,
        experience: form.querySelector('input[placeholder="Past experience relevant to this project"]').value,
      },
      budget: {
        total: form.querySelector('input[placeholder="Total budget"]').value,
        requested: form.querySelector('input[placeholder="Funding requested"]').value,
        breakdown: form.querySelector('input[placeholder="Breakdown by category (e.g., Personnel, Equipment, Travel, Overhead, etc.)"]').value,
        matching: form.querySelector('input[placeholder*="matching"]').value,
      },
      problemStatement: {
        problem: form.querySelector('input[placeholder="What problem or need does this project address?"]').value,
        importance: form.querySelector('input[placeholder="Why is this issue important or urgent?"]').value,
        affected: form.querySelector('input[placeholder="Who is affected and how?"]').value,
      },
      goals: {
        primary: form.querySelector('input[placeholder="Primary goal of the project"]').value,
        objectives: form.querySelector('input[placeholder="2-3 specific, measurable objectives"]').value,
        tools: form.querySelector('input[placeholder="Tools, technologies, or techniques involved"]').value,
      },
      outcomes: {
        expected: form.querySelector('input[placeholder="Expected results"]').value,
        beneficiaries: form.querySelector('input[placeholder="Who benefits and how?"]').value,
        success: form.querySelector('input[placeholder="How will success be measured?"]').value,
        sustainability: form.querySelector('input[placeholder="Long-term sustainability or scalability"]').value,
      },
      compliance: {
        alignment: form.querySelector('input[placeholder*="align with the funder"]')?.value || '',
        considerations: form.querySelector('input[placeholder*="ethical"]')?.value || '',
      },
      supportingMaterials: {
        cvs: null,
        letters: null,
        pastGrants: null,
        whitepapers: null,
      }
    };

    var grantProposal = createGrantProposal(data);
    console.log('Grant Proposal JSON:', grantProposal);

    // Store the JSON in localStorage
    localStorage.setItem('grantProposal', JSON.stringify(grantProposal));
  });
});

var proposal = JSON.parse(localStorage.getItem('grantProposal'));
