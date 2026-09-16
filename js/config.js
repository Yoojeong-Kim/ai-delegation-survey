/**
 * AI Proxy Delegation Study ??Static Configuration
 * 
 * 1. Paste your Google Apps Script Web App URL below
 * 2. Update the image URLs or text for the scenarios
 */

window.AppConfig = {
  // TODO: Paste the URL from your deployed Google Apps Script here!
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyCHVTPgDndooL_1-ZKSaIGGh8WKjzw31_0pF4-nTmDIlqmvIC7M0zZeK2SAImhZ6cK/exec",

  // The 4 scenarios used in the simulation page
  scenarios: [
    {
      id: 1,
      title: "Scenario 1",
      description: "Please review the scenario carefully and make your decision.",
      condition_1_images: ["images/s1_ai_1.png", "images/s1_ai_2.png", "images/s1_ai_3.png"],     // Used if AI Secretary
      condition_2_images: ["images/s1_human_1.png", "images/s1_human_2.png", "images/s1_human_3.png"]   // Used if Human Secretary
    },
    {
      id: 2,
      title: "Scenario 2",
      description: "Please review the scenario carefully and make your decision.",
      condition_1_images: ["images/s2_ai_1.png", "images/s2_ai_2.png", "images/s2_ai_3.png"],
      condition_2_images: ["images/s2_human_1.png", "images/s2_human_2.png", "images/s2_human_3.png"]
    },
    {
      id: 3,
      title: "Scenario 3",
      description: "Please review the scenario carefully and make your decision.",
      condition_1_images: ["images/s3_ai_1.png", "images/s3_ai_2.png", "images/s3_ai_3.png"],
      condition_2_images: ["images/s3_human_1.png", "images/s3_human_2.png", "images/s3_human_3.png"]
    },
    {
      id: 4,
      title: "Scenario 4",
      description: "Please review the scenario carefully and make your decision.",
      condition_1_images: ["images/s4_ai_1.png", "images/s4_ai_2.png", "images/s4_ai_3.png"],
      condition_2_images: ["images/s4_human_1.png", "images/s4_human_2.png", "images/s4_human_3.png"]
    }
  ]
};
