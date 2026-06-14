const ML_API_URL = "https://isis-boughten-decently.ngrok-free.dev";

export const analyzeWithML = async (inputs: any) => {
  const response = await fetch(`${ML_API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    },
    body: JSON.stringify({
      business_type: inputs.businessType,
      location:      inputs.locationName,
      latitude:      inputs.latitude,
      longitude:     inputs.longitude,
      budget_lakhs:  inputs.budget,
      area_sqm:      inputs.area,
      radius_km:     inputs.radius
    })
  });

  if (!response.ok) throw new Error("ML API error");
  return response.json();
};