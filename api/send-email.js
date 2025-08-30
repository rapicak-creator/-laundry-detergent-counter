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
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>洗剤の残量のお知らせ</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root {
      --primary-50: #f0f9ff;
      --primary-100: #e0f2fe;
      --primary-500: #0ea5e9;
      --primary-700: #0369a1;
      --primary-900: #0c4a6e;
      --neutral-50: #f8fafc;
      --neutral-100: #f1f5f9;
      --neutral-200: #e2e8f0;
      --neutral-300: #cbd5e1;
      --neutral-500: #64748b;
      --neutral-700: #334155;
      --neutral-900: #0f172a;
      --semantic-success: #10b981;
      --semantic-warning: #f59e0b;
      --semantic-error: #ef4444;
      --spacing-1: 0.25rem;
      --spacing-2: 0.5rem;
      --spacing-3: 0.75rem;
      --spacing-4: 1rem;
      --spacing-6: 1.5rem;
      --spacing-8: 2rem;
      --spacing-12: 3rem;
      --text-xs: 0.75rem;
      --text-sm: 0.875rem;
      --text-base: 1rem;
      --text-lg: 1.125rem;
      --text-xl: 1.25rem;
      --text-2xl: 1.5rem;
      --text-3xl: 1.875rem;
    }
    
    /* リセットとベーススタイル */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      background-color: var(--neutral-50);
      margin: 0;
      padding: 0;
      color: var(--neutral-700);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* メインコンテナ */
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }
    
    /* ヘッダー */
    .header {
      background: linear-gradient(135deg, var(--semantic-success), #2E7D32);
      color: white;
      text-align: center;
      padding: var(--spacing-8) var(--spacing-4);
      position: relative;
    }
    
    .header__title {
      font-size: var(--text-2xl);
      font-weight: 700;
      letter-spacing: 0.5px;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
    }
    
    .header__icon {
      font-size: 1.5em;
      display: inline-block;
      vertical-align: middle;
    }
    
    /* コンテンツエリア */
    .content {
      padding: var(--spacing-8) var(--spacing-6);
      text-align: center;
    }
    
    .content__product {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--spacing-4);
      padding-bottom: var(--spacing-4);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .content__product-name {
      color: var(--primary-700);
    }
    
    .content__status {
      margin: var(--spacing-6) 0;
    }
    
    .content__label {
      font-size: var(--text-base);
      color: var(--neutral-700);
      margin-bottom: var(--spacing-2);
    }
    
    /* 残量表示 */
    .remaining {
      position: relative;
      margin: var(--spacing-6) auto;
      width: 180px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: radial-gradient(circle, var(--neutral-50) 60%, var(--neutral-100) 100%);
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.9);
    }
    
    .remaining__count {
      font-size: 3.5rem;
      font-weight: 700;
      color: ${parseInt(remaining) <= 3 ? 'var(--semantic-error)' : (parseInt(remaining) <= 5 ? 'var(--semantic-warning)' : 'var(--semantic-success)')};
      line-height: 1;
      margin-bottom: var(--spacing-1);
    }
    
    .remaining__unit {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-700);
    }
    
    .remaining__note {
      font-size: var(--text-xs);
      color: var(--neutral-500);
      margin-top: var(--spacing-2);
    }
    
    /* メッセージ */
    .message {
      background-color: ${parseInt(remaining) <= 3 ? 'rgba(239, 68, 68, 0.08)' : (parseInt(remaining) <= 5 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)')};
      border-left: 4px solid ${parseInt(remaining) <= 3 ? 'var(--semantic-error)' : (parseInt(remaining) <= 5 ? 'var(--semantic-warning)' : 'var(--semantic-success)')};
      padding: var(--spacing-4);
      margin: var(--spacing-6) 0;
      text-align: left;
      border-radius: 4px;
    }
    
    .message__text {
      font-size: var(--text-base);
      color: var(--neutral-700);
      margin: 0;
    }
    
    /* ボタン */
    .button {
      display: inline-block;
      padding: var(--spacing-3) var(--spacing-6);
      background-color: var(--primary-500);
      color: white;
      font-size: var(--text-base);
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      margin-top: var(--spacing-6);
    }
    
    .button:hover {
      background-color: var(--primary-700);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .button__icon {
      margin-right: var(--spacing-2);
    }
    
    /* フッター */
    .footer {
      text-align: center;
      padding: var(--spacing-4);
      font-size: var(--text-xs);
      color: var(--neutral-500);
      background-color: var(--neutral-100);
      border-top: 1px solid var(--neutral-200);
    }
    
    .footer__icon {
      font-size: var(--text-xl);
      color: var(--primary-500);
      margin-bottom: var(--spacing-2);
      display: block;
    }
    
    /* ダークモード対応 */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: var(--neutral-900);
      }
      
      .container {
        background-color: var(--neutral-800);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }
      
      .content__product {
        color: var(--neutral-100);
        border-bottom-color: var(--neutral-700);
      }
      
      .content__label {
        color: var(--neutral-300);
      }
      
      .remaining {
        background: radial-gradient(circle, var(--neutral-800) 60%, var(--neutral-700) 100%);
      }
      
      .remaining__unit {
        color: var(--neutral-300);
      }
      
      .message {
        background-color: rgba(0, 0, 0, 0.2);
      }
      
      .message__text {
        color: var(--neutral-300);
      }
      
      .footer {
        background-color: var(--neutral-800);
        border-top-color: var(--neutral-700);
      }
    }
    
    /* レスポンシブ対応 */
    @media only screen and (max-width: 480px) {
      .container {
        margin: 10px;
        border-radius: 8px;
      }
      
      .header {
        padding: var(--spacing-6) var(--spacing-4);
      }
      
      .content {
        padding: var(--spacing-6) var(--spacing-4);
      }
      
      .remaining {
        width: 150px;
        height: 150px;
      }
      
      .remaining__count {
        font-size: 3rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="header__title"><span class="header__icon">🧺</span> 洗剤の残量のお知らせ</h1>
    </header>
    
    <main class="content">
      <div class="content__product">
        <span class="content__product-name">「部屋干しスーパークリーン」</span>の残量状況
      </div>
      
      <div class="content__status">
        <p class="content__label">現在の残り回数</p>
        
        <div class="remaining">
          <div class="remaining__count">${remaining}</div>
          <div class="remaining__unit">回分</div>
          <div class="remaining__note">※1回の使用量：22ml</div>
        </div>
      </div>
      
      <div class="message">
        <p class="message__text">${parseInt(remaining) <= 3 ? '⚠️ 洗剤が残りわずかです。早めの補充をおすすめします。' : (parseInt(remaining) <= 5 ? '📝 そろそろ補充のタイミングです。次回のお買い物リストに加えましょう。' : '✓ まだ十分な量が残っています。')}</p>
      </div>
      
      <p>スムーズな洗濯ライフを続けるために、計画的な補充をおすすめします。</p>
      
      <a href="https://laundry-detergent-counter.vercel.app/" class="button">
        <span class="button__icon">📊</span>在庫管理ページを開く
      </a>
    </main>
    
    <footer class="footer">
      <span class="footer__icon">📧</span>
      <p>これは自動送信メールです。ご不明な点がございましたら、返信しないでください。</p>
    </footer>
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



