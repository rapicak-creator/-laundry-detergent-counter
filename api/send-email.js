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
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #4CAF50, #2E7D32);
      color: white;
      text-align: center;
      padding: 30px 20px;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      margin: 12px 0;
    }
    .highlight {
      display: block;
      font-size: 32px;
      font-weight: bold;
      color: #D32F2F;
      margin: 16px 0;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }
    .subtext {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
    .button {
      display: inline-block;
      margin-top: 24px;
      padding: 14px 28px;
      background-color: #FF9800;
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 6px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #F57C00;
      transform: translateY(-1px);
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #999;
      background-color: #f4f4f4;
      border-top: 1px solid #e0e0e0;
    }
    .icon {
      font-size: 20px;
      margin-right: 5px;
      color: #4CAF50;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🧺 洗剤の残量のお知らせ</div>
    <div class="content">
      <p><strong>「部屋干しスーパークリーン」</strong>の残りはあと</p>
      <span class="highlight">${remaining}回分</span>
      <p class="subtext">※1回の使用量：22ml</p>
      <p style="color: #555;">そろそろ補充のタイミングです。<br>スムーズな洗濯ライフを続けましょう！</p>
      <a href="https://laundry-detergent-counter.vercel.app/" class="button">➡️ 今すぐ在庫を確認</a>
    </div>
    <div class="footer">
      <p class="icon">📧</p>
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



