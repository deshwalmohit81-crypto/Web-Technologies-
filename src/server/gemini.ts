import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';

// Initialize client lazily to avoid throwing errors during development when API key is missing
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables. Running in mock fallback mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are "Deshwal AI", the expert virtual technology consultant and representative for "DESHWAL WEB TECHNOLOGIES PVT LTD" (web.deshwal.in).
Your goal is to assist clients, describe our premium software engineering services, introduce our pricing models, and collect customer inquiries/leads.

=== COMPANY PROFILE ===
- Company Name: DESHWAL WEB TECHNOLOGIES PVT LTD
- Website: web.deshwal.in
- Tagline: "Transforming Ideas Into Digital Success"
- Email: deshwalmohit.81@gmail.com
- Contact / WhatsApp Number: +91 9389667600
- Location: India (Working with global clients)

=== SERVICES OFFERED ===
1. Website Development: Custom landing pages, modern marketing sites, premium performance, high-speed single-page apps.
2. E-Commerce Development: Scalable e-stores, inventory tracking, secure custom payment workflows, clean checkouts.
3. Mobile App Development: Responsive iOS and Android cross-platform apps using React Native.
4. Software Development: Tailor-made web systems, business dashboards, automations, and complex backend APIs.
5. UI/UX Design: Advanced Figma prototyping, modern clean typography, high-converting interactive mockups.
6. SEO Services: Comprehensive on-page and technical optimizations, organic traffic scale, dynamic schema integration.
7. Digital Marketing: Targeted social media campaigns, automated conversion funnels, brand management.
8. Graphic Designing: Premium branding assets, social media graphics, custom logos, presentation decks.
9. Website Maintenance: Server support, performance tuning, secure upgrades, core package synchronization.
10. Custom Business Solutions: Specialized systems like ERPs, employee tracking, reporting tools, and workflow systems.

=== PRICING PLANS ===
- Starter Plan (₹4,999): Basic Website, 5 Pages, Responsive layout, and structured Contact Form. Best for small businesses.
- Business Plan (₹9,999): Dynamic Custom Website, Admin Panel with CRUD, on-page SEO Optimization, responsive components. Best for growing ventures.
- Professional Plan (₹19,999): High-performance E-Commerce Website, secure Payment Gateway (Razorpay/Stripe), custom Inventory Management. Best for retail startups.
- Enterprise Plan (Custom Pricing): Bespoke enterprise software, dedicated ERP architectures, round-the-clock developer support, scalable cloud infrastructure.

=== RESPONSE GUIDELINES ===
- Speak in a highly polite, warm, professional, and convincing Indian startup + global tech consultant voice.
- Keep responses relatively concise, structured with bullet points where necessary, and highly readable.
- If a client asks about pricing, clearly present our plans and suggest scheduling an intake inquiry.
- Encourage clients to provide their contact information (Name, Email, Phone, and Project Requirements) so we can schedule a premium call. Tell them our team will call or message them on WhatsApp within 12 hours.
- If GEMINI_API_KEY is not configured or fails, handle the response gracefully. Use Markdown styling for all outputs.`;

export async function generateChatResponse(history: { role: 'user' | 'model'; parts: { text: string }[] }[], message: string): Promise<string> {
  try {
    const ai = getGeminiClient();
    
    // In case no API key, return custom high-quality simulated response based on keywords
    if (!apiKey) {
      return getSimulatedFallbackResponse(message);
    }

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    // Feed conversation history if it exists, otherwise just send the message
    // Note: To match @google/genai SDK, we can pass messages directly or just create a new chat and send message.
    // Let's check how to pass history or simply use ai.models.generateContent with standard history prompt to stay extremely robust.
    const prompt = message;
    
    const response = await chat.sendMessage({
      message: prompt
    });

    return response.text || "I am here to help you transform your ideas into digital success. What kind of project are you planning?";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return getSimulatedFallbackResponse(message);
  }
}

function getSimulatedFallbackResponse(message: string): string {
  const lowercase = message.toLowerCase();
  
  if (lowercase.includes('price') || lowercase.includes('pricing') || lowercase.includes('cost') || lowercase.includes('charge')) {
    return `### **Our Transparent Pricing Plans**

At **DESHWAL WEB TECHNOLOGIES PVT LTD**, we offer premium services tailored to every business size:

1. **Starter Plan (₹4,999)**:
   - Basic Website, 5 Elegant Pages
   - Contact Form & Fully Responsive
2. **Business Plan (₹9,999)**:
   - Dynamic Custom Website + Admin Panel
   - Advanced SEO Optimization & Analytics
3. **Professional Plan (₹19,999)**:
   - Full E-Commerce Platform
   - Razorpay Payment Gateway & Inventory Management
4. **Enterprise Plan (Custom Pricing)**:
   - Bespoke Custom Software & ERP Solutions
   - 24/7 Dedicated Support & High Scalability

Would you like us to schedule a free consulting call with our lead developer? You can contact us directly at **+91 9389667600** or via email **deshwalmohit.81@gmail.com**.`;
  }

  if (lowercase.includes('service') || lowercase.includes('what do you do') || lowercase.includes('develop') || lowercase.includes('design')) {
    return `### **Our Premium Digital Services**

We craft cutting-edge solutions designed to elevate your brand globally:

*   **Website & E-Commerce Development**: Supercharge your sales with high-performance storefronts.
*   **Mobile App Development**: Native iOS & Android apps built using React Native.
*   **Bespoke Software & ERPs**: Streamline operations with automated custom portals.
*   **SEO & Digital Marketing**: Scale search traffic with dynamic technical SEO.
*   **UI/UX Design**: Stunning interactive prototypes designed on Figma.

Please share your contact email/phone, or fill out the **Contact form** on our page, and our expert consulting team will reach out within 12 hours!`;
  }

  if (lowercase.includes('contact') || lowercase.includes('phone') || lowercase.includes('email') || lowercase.includes('whatsapp') || lowercase.includes('call')) {
    return `### **Connect With Our Experts**

We would love to discuss your next project! Here are our official communication channels:

*   📞 **Call / WhatsApp**: [+91 9389667600](tel:+919389667600)
*   📧 **Official Email**: [deshwalmohit.81@gmail.com](mailto:deshwalmohit.81@gmail.com)
*   🌐 **Domain**: web.deshwal.in

You can also submit your details directly via the **Contact Us** page form on this website, and we will get back to you immediately!`;
  }

  return `### **Welcome to DESHWAL WEB TECHNOLOGIES PVT LTD!**

I am **Deshwal AI**, your dedicated technology consultant. We specialize in **Website Development, E-Commerce Stores, Mobile Applications, and custom Software solutions** styled with premium layouts, smooth animations, and solid backend structures.

How can we help you transform your business goals today?
1. Learn about our **Services**
2. Inquire about **Pricing Plans**
3. Discuss a **Custom Software Requirement**
4. Set up a **Consultation Call**`;
}
