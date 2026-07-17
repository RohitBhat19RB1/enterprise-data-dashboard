const companyPrefixes = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark", "Wayne", "Tyrell", "Cyberdyne", "Aperture"];
const companySuffixes = ["Corp", "Inc", "Industries", "Global", "Systems", "Logistics", "Ventures", "Solutions", "Dynamics"];
const plans = ["Basic", "Professional", "Enterprise"];
const statuses = ["Active", "Pending", "Inactive"];

export const generateLargeDataset = (count = 20) => {
  const data = [];
  
  for (let i = 1; i <= count; i++) {
    const plan = plans[i % plans.length];
    const status = statuses[i % statuses.length];
    
    let spend = 0;
    if (status !== "Inactive") {
      spend = plan === "Enterprise" ? 1000 + (i % 5) * 500 : plan === "Professional" ? 450 : 150;
    }

    const prefix = companyPrefixes[i % companyPrefixes.length];
    const suffix = companySuffixes[i % companySuffixes.length];
    const customerName = `${prefix} ${suffix} (${i})`;

    data.push({
      id: i,
      customer: customerName,
      plan,
      status,
      spend,
      joined: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`
    });
  }
  
  return data;
};

// Parameterized data array. Set to 20 for core requirements, scalable to any arbitrary value.
export const mockData = generateLargeDataset(20); //try 20000, it will work