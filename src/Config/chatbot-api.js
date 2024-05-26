// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-1.5-pro-latest";
  const API_KEY = "AIzaSyDwe06kQZT32Y1w6sbxIWsBDMUeHlosIpc";
  
  async function runChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "hello"}],
        },
        {
          role: "model",
          parts: [{ text: "Mabuhay! 👋 I'm PlanIt Assistant, your friendly guide to family planning. 😊 How can I assist you today? 🤔"}],
        },
        {
          role: "user",
          parts: [{ text: "What can you do?"}],
        },
        {
          role: "model",
          parts: [{ text: "## PlanItFamIt is here for your Family Planning Needs! 👪\n\nAs PlanIt Assistant, I can help you with various aspects of family planning, such as:\n\n*   **Sex education:** Providing accurate and age-appropriate information about sexual health, contraception, and reproductive health.\n*   **Family planning methods:**  Explaining the different types of contraceptive methods available, including their effectiveness, side effects, and how to use them.\n*   **Pregnancy and childbirth:** Offering information about prenatal care, labor and delivery, and postpartum care.\n*   **Infertility:** Providing resources and support for couples struggling with infertility.\n*   **Relationships and communication:** Helping you build healthy relationships and communicate effectively with your partner about family planning. \n\n**Additionally, I can connect you with our key partner, St. Margaret Lying-In Clinic, located in Olongapo City.** They offer a wide range of services for pregnant mothers, family planning, conceiving, and more. They also have experienced ob-gyne who can provide consultations and address your concerns. 🤰\n\n**Feel free to ask me anything related to family planning. I'm here to help!** 😊"}],
        },
        {
          role: "user",
          parts: [{ text: "What is that clinic that you offer?"}],
        },
        {
          role: "model",
          parts: [{ text: "We are proud to partner with **St. Margaret Lying-In Clinic**, a reputable healthcare facility located at **GF 74A 20TH St. East Bajac Bajac, Olongapo City, Zambales, Philippines**. They offer comprehensive services related to: \n\n*   **Pregnancy and childbirth:** Prenatal care, labor and delivery, postpartum care \n*   **Family planning:** Contraceptive counseling, various birth control methods\n*   **Conceiving:** Fertility consultations and assistance\n*   **Women's health:** General gynecological care and consultations with experienced ob-gyne\n\n**St. Margaret Lying-In Clinic** is dedicated to providing quality care for women at every stage of their reproductive journey.  They are a trusted resource for our users seeking professional medical advice and support. \n\nWould you like to know more about their services or how to schedule an appointment? 🤔"}],
        },
      ],
    });
  
    const result = await chat.sendMessage("YOUR_USER_INPUT");
    const response = result.response;
    console.log(response.text());
  }
  
  runChat();