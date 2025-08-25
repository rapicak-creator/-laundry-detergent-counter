// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, remaining, to } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // HTMLメールの本文を作成します
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 20px auto; }
        .header { font-size: 24px; font-weight: bold; color: #333; }
        .content { margin-top: 20px; }
        .footer { margin-top: 30px; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">洗剤の残量のお知らせ</div>
        <div class="content">
          <p>「部屋干しスーパークリーン」の残りはあと<strong>${remaining}回分</strong>です。</p>
          <p>補充をおすすめします。</p>
        </div>
        <div class="footer">
          <p>これは自動送信メールです。</p>
        </div>
      </div>
    </body>
    </html>
  `;

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
      // textプロパティの代わりにhtmlプロパティを使用
      html: emailHtml,
    }),
  });

  if (response.ok) {
    res.status(200).json({ message: "Email sent" });
  } else {
    const error = await response.json();
    res.status(500).json({ error });
  }
}
