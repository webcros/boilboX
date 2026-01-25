export interface CareerRole {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export const careerRoles: CareerRole[] = [
  {
    slug: 'kiosk-operator-lead',
    title: 'Kiosk Operator Lead',
    team: 'Operations',
    location: 'San Francisco, CA',
    type: 'Full-time',
    summary: 'Lead daily kiosk operations, train operators, and ensure service quality across shifts.',
    responsibilities: [
      'Manage daily kiosk readiness and shift handoffs.',
      'Coach operators on food safety and hospitality.',
      'Track inventory and report daily sales metrics.',
    ],
    requirements: [
      '2+ years in food service or retail operations.',
      'Strong people management skills.',
      'Comfortable with basic reporting tools.',
    ],
  },
  {
    slug: 'nutrition-analyst',
    title: 'Nutrition Analyst',
    team: 'Product',
    location: 'Remote',
    type: 'Contract',
    summary: 'Maintain nutrition labeling accuracy and support menu iterations with data-backed insights.',
    responsibilities: [
      'Audit meal nutrition data from lab partners.',
      'Update nutrition lookup and labels.',
      'Partner with culinary team on reformulations.',
    ],
    requirements: [
      'Nutrition science or dietetics background.',
      'Experience with nutrition databases.',
      'Strong attention to detail.',
    ],
  },
  {
    slug: 'partner-success-manager',
    title: 'Partner Success Manager',
    team: 'Growth',
    location: 'Austin, TX',
    type: 'Full-time',
    summary: 'Support partner onboarding, launch planning, and long-term success metrics.',
    responsibilities: [
      'Coordinate kiosk launch timelines.',
      'Lead partner check-ins and KPI reviews.',
      'Gather feedback for product improvements.',
    ],
    requirements: [
      '3+ years in customer success or account management.',
      'Experience working with multi-site partners.',
      'Excellent communication and planning skills.',
    ],
  },
];
