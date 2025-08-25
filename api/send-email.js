// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, remaining, to } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to,
      subject: type === "半分" 
        ? "洗剤の残量が半分になりました" 
        : "洗剤の残りが少なくなっています",
      text: `「部屋干しスーパークリーン」の残りはあと${remaining}回分です。補充をおすすめします。`,
    }),
  });

  if (response.ok) {
    res.status(200).json({ message: "Email sent" });
  } else {
    const error = await response.json();
    res.status(500).json({ error });
  }
}
