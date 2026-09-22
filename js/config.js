/**
 * AI Proxy Delegation Study — Static Configuration
 * 
 * 1. Paste your Google Apps Script Web App URL below
 * 2. Update the image URLs or text for the scenarios
 */

window.AppConfig = {
  // Google Apps Script Web App URL
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzreDqnwAlRJ-kQGikTeNPftITkPCgCey6JDYNRLccZ_3Utn4ZpPFJAyMW9di26UDSJ/exec",

  // The 4 scenarios used in the simulation page
  scenarios: [
    {
      id: 1,
      title: "Scenario 1",
      description: "Please review the scenario carefully and make your decision.",
      accessed_info: "Personal health metrics (blood pressure, blood sugar, weight), dietary history, and prescription medication records.",
      delegated_task: "Planning and ordering meals for the upcoming week and scheduling medication intake.",
      condition_1_images: ["images/s1_ai_1.png", "images/s1_ai_2.png", "images/s1_ai_3.png"],     // Used if AI Secretary
      condition_2_images: ["images/s1_human_1.png", "images/s1_human_2.png", "images/s1_human_3.png"]   // Used if Human Secretary
    },
    {
      id: 2,
      title: "Scenario 2",
      description: "Please review the scenario carefully and make your decision.",
      accessed_info: "Current work calendar, meeting schedule, and office locations.",
      delegated_task: "Rescheduling a Thursday meeting to Friday and reserving a closer meeting room to minimize travel distance.",
      condition_1_images: ["images/s2_ai_1.png", "images/s2_ai_2.png", "images/s2_ai_3.png"],
      condition_2_images: ["images/s2_human_1.png", "images/s2_human_2.png", "images/s2_human_3.png"]
    },
    {
      id: 3,
      title: "Scenario 3",
      description: "Please review the scenario carefully and make your decision.",
      accessed_info: "Private chat and message history with family (younger sister) from the past year, including conversations about her dog.",
      delegated_task: "Writing and sending a personal condolence message to the sister on your behalf.",
      condition_1_images: ["images/s3_ai_1.png", "images/s3_ai_2.png", "images/s3_ai_3.png"],
      condition_2_images: ["images/s3_human_1.png", "images/s3_human_2.png", "images/s3_human_3.png"]
    },
    {
      id: 4,
      title: "Scenario 4",
      description: "Please review the scenario carefully and make your decision.",
      accessed_info: "Friend's (Emma's) personal wishlist, interests, and gift preferences.",
      delegated_task: "Selecting, purchasing, and placing an order for a gift (Tea Gift Box) on your behalf.",
      condition_1_images: ["images/s4_ai_1.png", "images/s4_ai_2.png", "images/s4_ai_3.png"],
      condition_2_images: ["images/s4_human_1.png", "images/s4_human_2.png", "images/s4_human_3.png"]
    }
  ]
};
