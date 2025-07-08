// grantModel.js
export function createGrantProposal(data) {
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