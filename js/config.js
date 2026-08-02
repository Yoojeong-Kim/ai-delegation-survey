/**
 * AI Proxy Delegation Study ??Static Configuration
 * 
 * 1. Paste your Google Apps Script Web App URL below
 * 2. Update the image URLs or text for the scenarios
 */

window.AppConfig = {
  // TODO: Paste the URL from your deployed Google Apps Script here!
  GOOGLE_SCRIPT_URL: "",

  // The 4 scenarios used in the simulation page
  scenarios: [
    {
      id: 1,
      title: "Scenario 1",
      description: "Please review the scenario carefully and make your decision.",
      condition_1_image: "images/sc1_ai.jpg",     // Used if AI Secretary
      condition_2_image: "images/sc1_human.jpg"   // Used if Human Secretary
    },
    {
      id: 2,
      title: "Scenario 2",
      description: "Please review the scenario carefully and make your decision.",
      condition_1_image: "images/sc2_ai.jpg",
      condition_2_image: "images/sc2_human.jpg"
    },
    {
      id: 3,
      title: "Scenario 3",
      description: "Please review the scenario carefully and make your decision.",
      condition_1_image: "images/sc3_ai.jpg",
      condition_2_image: "images/sc3_human.jpg"
    },
    {
      id: 4,
      title: "Scenario 4",
      description: "Please review the scenario carefully and make your decision.",
      condition_1_image: "images/sc4_ai.jpg",
      condition_2_image: "images/sc4_human.jpg"
    }
  ]
};
