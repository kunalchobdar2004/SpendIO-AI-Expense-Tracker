require('dotenv').config();

async function checkAvailableModels() {
    console.log("Checking available models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("\n✅ Aapki API Key par yeh models available hain:\n");
            // Sirf wo models dikhayein jo text generate kar sakte hain
            data.models
                .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                .forEach(m => console.log(m.name.replace('models/', '')));
            console.log("\n👆 Upar di gayi list mein se koi ek naam copy karein.");
        } else {
            console.log("Error:", data);
        }
    } catch (error) {
        console.log("Fetch error:", error.message);
    }
}

checkAvailableModels();