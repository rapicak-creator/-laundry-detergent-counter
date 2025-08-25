// api/send-email.js
import fetch from 'node-fetch'; // fetchをNode.jsで使うため追加

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, remaining, to } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not set' });
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px; text-align: center;">
      <h2 style="color: #2b7cff;">${type === "半分" ? "洗剤の残量が半分になりました" : "洗剤の残りが少なくなっています"}</h2>
      <div style="margin: 24px auto; width: 120px;">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="55" stroke="#2b7cff" stroke-width="6" fill="#e3f0ff"/>
          <ellipse cx="60" cy="60" rx="40" ry="38" fill="#fff" stroke="#b3d1ff" stroke-width="3"/>
          <ellipse cx="60" cy="60" rx="30" ry="28" fill="#cce6ff"/>
          <text x="60" y="68" text-anchor="middle" font-size="22" fill="#2b7cff" font-weight="bold">${remaining}</text>
          <text x="60" y="90" text-anchor="middle" font-size="12" fill="#555">回分</text>
        </svg>
      </div>
      <p style="font-size: 16px; color: #333; margin-top: 16px;">「部屋干しスーパークリーン」の残りはあと<strong style="color:#2b7cff;">${remaining}回分</strong>です。<br>補充をおすすめします。</p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e3f0ff;">
      <small style="color: #888;">このメールは自動送信されています。</small>
    </div>
  `;
  try {
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
        html: htmlContent,
      }),
    });

    if (response.ok) {
      res.status(200).json({ message: "Email sent" });
    } else {
      const error = await response.json();
      res.status(500).json({ error: error.message || error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || '送信失敗' });
  }
}
