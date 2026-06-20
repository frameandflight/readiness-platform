export interface Question {
  id: string;
  text: string;
  capability: string;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export const SCORING_DIMENSIONS = ['process', 'technology', 'people', 'data'] as const;
export type ScoringDimension = typeof SCORING_DIMENSIONS[number];

export const DIMENSION_LABELS: Record<ScoringDimension, string> = {
  process: 'Process',
  technology: 'Enabling Technology',
  people: 'People Skills',
  data: 'Data',
};

export const RUBRIC: Record<ScoringDimension, Record<number, string>> = {
  process: {
    1: 'No Process in Place',
    2: 'Partially in place – ad hoc or manual methods',
    3: 'Basic system/process in place – limited scope',
    4: 'Consistently applied process/system – covers most needs',
    5: 'Fully standardized and integrated process',
  },
  technology: {
    1: 'No Technology in Place',
    2: 'Manual or Ad Hoc Tools',
    3: 'Basic Technology Implementation',
    4: 'Established Technology Usage (broad adoption)',
    5: 'Fully Integrated and Scalable Technology',
  },
  people: {
    1: 'No Skill in Place',
    2: 'Informal Skills',
    3: 'Basic Training Available',
    4: 'Consistently Developed Skills Across Roles',
    5: 'Fully Embedded & Scaled Workforce Capability',
  },
  data: {
    1: 'No Data Captured or Available',
    2: 'Unstructured or Inconsistent Data',
    3: 'Basic Data Availability',
    4: 'Reliable and Accessible Data Across Functions',
    5: 'Fully Governed, Integrated, and Actionable Data',
  },
};

export const ASSESSMENT_SECTIONS: Section[] = [
  {
    id: 'supplier_management',
    title: 'Supplier Management',
    questions: [
      { id: 'sm_1', capability: 'Supplier Onboarding', text: 'How well do you have a standardized digital process to onboard suppliers into PLM with required documents, data, and contacts?' },
      { id: 'sm_2', capability: 'Supplier Approval & Qualification', text: 'Do you have a cross-functional approval workflow (Procurement, Quality, Regulatory) to qualify suppliers by material, category, or market?' },
      { id: 'sm_3', capability: 'Supplier-Spec Association', text: 'Can you link multiple suppliers to the same spec and manage their roles (primary, backup) with visibility across plants and products?' },
      { id: 'sm_4', capability: 'Supplier Collaboration on Specifications', text: 'Do you support supplier-enabled submission or co-develop specs directly together, with appropriate visibility, version control, and approval rights?' },
      { id: 'sm_5', capability: 'Document Submission & Version Control', text: 'Is there a structured, version-controlled process for collecting, reviewing, and archiving supplier documents like CoAs, SDS, and certifications?' },
      { id: 'sm_6', capability: 'Compliance & Risk Management', text: 'Are supplier-level certifications, audit results, and risk assessments centrally tracked and linked to specs and claims?' },
      { id: 'sm_7', capability: 'Change Notification and Impact Management', text: 'Is there a clear path to notify you of changes, and does your process/system trigger downstream impact analysis when this occurs?' },
      { id: 'sm_8', capability: 'Supplier Communication & Messaging', text: 'Do you have ways to message suppliers digitally (e.g., request data, send updates), with traceability and audit trail?' },
      { id: 'sm_9', capability: 'On-going Supplier Management', text: 'Is supplier status (approved, inactive, conditional) actively managed and visible across functions and geographies?' },
      { id: 'sm_10', capability: 'Integration with Sourcing & ERP Systems', text: 'Do you have one source of truth for sourcing information to ensure vendor, material linkage, and approval statuses are consistent?' },
    ],
  },
  {
    id: 'raw_material_specs',
    title: 'Raw Material Specifications',
    questions: [
      { id: 'rm_1', capability: 'Specification Creation and Authoring', text: 'Can you author raw material specifications with structured data (not PDFs or spreadsheets)?' },
      { id: 'rm_2', capability: 'Supplier Information Collection', text: 'Do you have a portal or workflow for suppliers to submit, update, and validate raw material specifications and supporting documentation?' },
      { id: 'rm_3', capability: 'Specification Review and Approval Workflow', text: 'Is there a role-based workflow to route raw material specs through cross-functional review and approval with audit trails?' },
      { id: 'rm_4', capability: 'Compliance and Regulatory Validation', text: 'Are raw materials systematically validated against market-specific regulatory requirements and flagged for compliance risks (e.g., allergens, restricted substances)?' },
      { id: 'rm_5', capability: 'Nutrition Management', text: 'Do you have a structured process for capturing, validating, and rolling up raw material nutrition data to the formula and finished product levels?' },
      { id: 'rm_6', capability: 'Change Management', text: 'Can you manage changes to raw material specifications and assess downstream impact to formulas, labeling, and finished products?' },
      { id: 'rm_7', capability: 'Linkage to Formulas and Finished Products', text: 'Are raw material specifications linked to formulas and BOMs in your system to allow for attribute roll-ups (e.g., allergens, nutrition, additives)?' },
      { id: 'rm_8', capability: 'Document and Data Management', text: 'Is raw material data and documentation (e.g., CoAs) stored in a centralized, version-controlled system?' },
      { id: 'rm_9', capability: 'Material Lifecycle', text: 'Do you manage the full material lifecycle (Draft to Active to Obsolete)?' },
      { id: 'rm_10', capability: 'Integration with Other Systems', text: 'Are raw material specifications integrated with your ERP, labeling, procurement, and compliance systems?' },
      { id: 'rm_11', capability: 'Master Data Governance Process', text: 'Do you have a centralized governance model to manage raw material metadata and prevent duplicates or inconsistencies across plants and systems?' },
      { id: 'rm_12', capability: 'Training and Adoption Readiness', text: 'Are training materials, onboarding support, and a helpdesk model in place to ensure adoption of new spec processes?' },
    ],
  },
  {
    id: 'formula_creation',
    title: 'Formula Creation',
    questions: [
      { id: 'fc_1', capability: 'Formula Authoring & Structuring', text: 'Do you have a structured method to create, version, and manage hierarchical formulas with full visibility into changes and roll-ups?' },
      { id: 'fc_2', capability: 'Transformation & Yield Adjustments', text: 'Can you apply and visualize transformation effects (e.g., moisture loss) on ingredient composition and nutrition values across formula levels?' },
      { id: 'fc_3', capability: 'Nutrient & Compliance Rollups', text: 'Can you roll up 100g nutrition, allergens, and additives from ingredients to finished formulas using business logic?' },
      { id: 'fc_4', capability: 'Formula Comparison & Impact Analysis', text: 'Can you compare between formulas and identify material, nutrition, or cost differences quickly and clearly?' },
      { id: 'fc_5', capability: 'Alternate Materials & Substitution', text: 'Do you manage alternate ingredients, substitutions, and processing aids with appropriate tracking and substitution logic?' },
      { id: 'fc_6', capability: 'Regulatory & Claims Validation', text: 'Can you validate formulas against global regulatory rules and brand-specific claims eligibility criteria?' },
      { id: 'fc_7', capability: 'Costing & Optimization', text: 'Can you integrate cost data and perform optimization under formulation constraints (e.g., reduce cost while keeping protein target)?' },
      { id: 'fc_8', capability: 'Formula Targets & Constraint Management', text: 'Can you validate formulas against nutritional, cost, or compliance targets during development?' },
      { id: 'fc_9', capability: 'Formulation for Preparation', text: 'Can your system model "as sold" vs. "as prepared" nutrition, including consumer prep losses and density substantiation?' },
      { id: 'fc_10', capability: 'Spec Compliance & Certification', text: 'Can you manage formula-level certification status (e.g., organic, halal) and validate site/country-specific spec compliance?' },
      { id: 'fc_11', capability: 'Workflow & Change Control', text: 'Do you have an audit trail of formula changes, role-based workflow, and progression blocking?' },
      { id: 'fc_12', capability: 'WIP & Innovation', text: 'Do you have a workspace or sandbox to manage WIP formulas, track iterations, and support exploratory development?' },
      { id: 'fc_13', capability: 'Ingredient Statement Generation', text: 'Can you generate accurate ingredient statements based on transformed, rounded formula output logic?' },
      { id: 'fc_14', capability: 'Claims Scenario Simulation', text: 'Can you simulate claim eligibility under potential formulation options before final approval or launch?' },
    ],
  },
  {
    id: 'formula_management',
    title: 'Formula Management',
    questions: [
      { id: 'fm_1', capability: 'Formula Versioning & Lifecycle', text: 'Do you have a structured process for formula versioning, status control (e.g., draft, locked, retired), and progression rules?' },
      { id: 'fm_2', capability: 'Ingredient Statement Generation', text: 'Can you generate, store, and manage compliant ingredient statements using transformed output data, with grouping and parenthetical entries?' },
      { id: 'fm_3', capability: 'Workflow Routing & Review', text: 'Is there a workflow that supports formula review with due dates, routing logic, and visibility into timing?' },
      { id: 'fm_4', capability: 'Labeling & Regulatory Compliance', text: 'Are ingredient statements and formulas validated for allergen declarations, regulatory formatting, and "do not declare" logic?' },
      { id: 'fm_5', capability: 'Claims & Certifications', text: 'Can you assess formula eligibility for marketing claims and certifications?' },
      { id: 'fm_6', capability: 'Audit Trail & Change Tracking', text: 'Do you maintain full audit trails for formula and ingredient statement edits, overrides, and other actions?' },
    ],
  },
  {
    id: 'trade_management',
    title: 'Trade Management',
    questions: [
      { id: 'tm_1', capability: 'Trade Spec Creation & Version Control', text: 'Is there a controlled process to create, version, and manage trade specs — including field-level lock-downs and audit trails?' },
      { id: 'tm_2', capability: 'Multi-Formula to Trade Linking', text: 'Can you link applicable formulas to a single trade spec, and manage regional or method-based production variations?' },
      { id: 'tm_3', capability: 'Consumer Unit Mapping', text: 'Can you differentiate between consumer, traded, and customer units with GTIN mapping and unit-specific data fields?' },
      { id: 'tm_4', capability: 'Packaging & Label Copy Integration', text: 'Are packaging, mandatory label content, storage conditions, and sustainability data fully integrated with each trade spec?' },
      { id: 'tm_5', capability: 'Workflow & Approval', text: 'Is there an approval process for trade specs, with escalation handling and including external review?' },
      { id: 'tm_6', capability: 'Site-Level Production Mapping', text: 'Are trade specs mapped to relevant production sites with associated allergens, HACCP data, line capabilities, and scheduling visibility?' },
      { id: 'tm_7', capability: 'External Collaboration', text: 'Can you securely share trade spec data with external partners, including co-manufacturers and regulatory reviewers, with version control?' },
    ],
  },
  {
    id: 'claims_management',
    title: 'Claims Management',
    questions: [
      { id: 'cm_1', capability: 'Claims Eligibility Identification', text: 'Do you have a methodology to identify which ingredients, formulas, or trades are eligible for specific claims (e.g., organic, gluten-free)?' },
      { id: 'cm_2', capability: 'Certification Tagging', text: 'Can you assign certification tags to specs based on documentation, with control over who can apply or edit them?' },
      { id: 'cm_3', capability: 'Rollup Logic', text: 'Can you roll up/link certifications from material → formula → trade, with support for exceptions and manual tagging?' },
      { id: 'cm_4', capability: 'Facility Certification Mapping', text: 'Are facility and co-man certification profiles maintained, including certifiers, designations, lines, and expiration tracking?' },
      { id: 'cm_5', capability: 'Approval Workflow & Access', text: 'Is there a workflow for cert/claim review, with restricted access by role and traceability of who approved what?' },
      { id: 'cm_6', capability: 'Audit Readiness', text: 'Can you generate reports for certification status, approval history, compliance flags, and supporting documents on demand?' },
      { id: 'cm_7', capability: 'Reporting & Traceability', text: 'Can you track where claims are used across dielines, trades, and SKUs, and assess impact of a rule or ingredient change?' },
    ],
  },
  {
    id: 'mandatory_label_copy',
    title: 'Mandatory Label Copy',
    questions: [
      { id: 'ml_1', capability: 'Nutrition Data Integration', text: 'Is there integration in MLC of 100g nutrition with serving size logic and jurisdiction-specific rounding?' },
      { id: 'ml_2', capability: 'Serving Size Configuration', text: 'Can you manage multi-format NFP panels (single, dual, aggregate) with flexible serving size and per-container declarations?' },
      { id: 'ml_3', capability: 'Ingredient & Allergen Statements', text: 'Are ingredient statements and allergen declarations generated based on formulation logic, rules, and jurisdiction?' },
      { id: 'ml_4', capability: 'Version Control', text: 'Is there a formal process to track and manage MLC versions, statuses (draft/approved), and history for audit readiness?' },
      { id: 'ml_5', capability: 'Multi-Region Panels', text: 'Can you configure nutrition facts panels by region (e.g., US, Canada, Mexico), and handle region-specific nutrient lists and rounding logic?' },
      { id: 'ml_6', capability: 'Cross-System Linkage', text: 'Is MLC linked to formulas, ingredient statements, trades, and artwork to prevent data duplication and ensure consistency?' },
    ],
  },
  {
    id: 'packaging_management',
    title: 'Packaging Management',
    questions: [
      { id: 'pm_1', capability: 'Packaging Configuration & Option Management', text: 'Can you store all available packaging configurations for a product across plants/lines, with contextual logic for selection?' },
      { id: 'pm_2', capability: 'Component Relationships', text: 'Are your packaging assemblies structured with traceable relationships between components, specs, and attributes?' },
      { id: 'pm_3', capability: 'Document & Dieline Management', text: 'Is documentation and dieline management stored in a centralized, version-controlled system?' },
      { id: 'pm_4', capability: 'Prototype & Lab Workflow', text: 'Do you have processes to submit, track, and document prototype/lab tests?' },
      { id: 'pm_5', capability: 'Sustainability Modeling', text: 'Can you perform tax implication analysis and sustainability impacts based on the materials and configuration?' },
      { id: 'pm_6', capability: 'Search & Assembly Traceability', text: 'Do you have traceability relationships across materials, specs, and assemblies?' },
      { id: 'pm_7', capability: 'Approval Workflow', text: 'Is there a multi-role, status-based approval system with audit trails for packaging assemblies and linked configurations?' },
    ],
  },
  {
    id: 'artwork',
    title: 'Artwork',
    questions: [
      { id: 'aw_1', capability: 'Digital Asset Management', text: 'Do you have a system for storing dielines and artwork files with version control, distribution, and metadata tagging?' },
      { id: 'aw_2', capability: 'Online Proofing Workflow', text: 'Is there digital proofing, annotations, text comparisons, and multi-view reviews with internal and external stakeholders?' },
      { id: 'aw_3', capability: 'Approval & Audit Trail', text: 'Is there a complete audit trail of artwork approvals, including approvers, timestamps, comments, and status?' },
      { id: 'aw_4', capability: 'Componentized Artwork Management', text: 'Are graphics broken into structured components that are reusable across products, formats, and regions?' },
      { id: 'aw_5', capability: 'Trade/BOM & Artwork Sync', text: 'Are graphics linked to trade specs and BOMs to ensure active artwork is used in production and retired artwork is flagged?' },
      { id: 'aw_6', capability: 'Package Copy Governance', text: 'Is package copy managed with traceability, approval, and reuse?' },
      { id: 'aw_7', capability: 'Supplier Collaboration on Specifications', text: 'Do external partners have a methodology for managing proofing, commenting, and submitting graphic updates?' },
    ],
  },
];

export type ScoreMap = Record<string, Record<ScoringDimension, number>>;

export function calculateSectionScore(scores: ScoreMap, section: Section): Record<ScoringDimension, number> {
  const result: Record<ScoringDimension, number> = { process: 0, technology: 0, people: 0, data: 0 };
  let count = 0;

  for (const q of section.questions) {
    const s = scores[q.id];
    if (!s) continue;
    count++;
    for (const dim of SCORING_DIMENSIONS) {
      result[dim] += s[dim] ?? 0;
    }
  }

  if (count > 0) {
    for (const dim of SCORING_DIMENSIONS) {
      result[dim] = parseFloat((result[dim] / count).toFixed(2));
    }
  }
  return result;
}

export function calculateOverallScore(scores: ScoreMap): Record<ScoringDimension, number> {
  const result: Record<ScoringDimension, number> = { process: 0, technology: 0, people: 0, data: 0 };
  let count = 0;

  for (const section of ASSESSMENT_SECTIONS) {
    for (const q of section.questions) {
      const s = scores[q.id];
      if (!s) continue;
      count++;
      for (const dim of SCORING_DIMENSIONS) {
        result[dim] += s[dim] ?? 0;
      }
    }
  }

  if (count > 0) {
    for (const dim of SCORING_DIMENSIONS) {
      result[dim] = parseFloat((result[dim] / count).toFixed(2));
    }
  }
  return result;
}

export function getReadinessLevel(avg: number): { label: string; color: string } {
  if (avg > 4) return { label: 'Ready', color: '#16a34a' };
  if (avg >= 2) return { label: 'In Progress', color: '#d97706' };
  return { label: 'Not Ready', color: '#dc2626' };
}

export function totalQuestions(): number {
  return ASSESSMENT_SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);
}
