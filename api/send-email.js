// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, remaining, to } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // プロフェッショナルグレードのHTMLメールテンプレート
  const emailHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>洗剤残量のお知らせ</title>
  
  <style>
    /* CSS Reset & Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      /* Design System - Color Palette */
      --primary-50: #f0fdf4;
      --primary-100: #dcfce7;
      --primary-500: #22c55e;
      --primary-600: #16a34a;
      --primary-700: #15803d;
      --primary-900: #14532d;
      
      --accent-400: #fb923c;
      --accent-500: #f97316;
      --accent-600: #ea580c;
      
      --neutral-50: #fafafa;
      --neutral-100: #f5f5f5;
      --neutral-200: #e5e5e5;
      --neutral-600: #525252;
      --neutral-700: #404040;
      --neutral-800: #262626;
      --neutral-900: #171717;
      
      --error-500: #ef4444;
      --warning-500: #eab308;
      --success-500: #10b981;
      
      /* Typography Scale */
      --text-xs: 0.75rem;
      --text-sm: 0.875rem;
      --text-base: 1rem;
      --text-lg: 1.125rem;
      --text-xl: 1.25rem;
      --text-2xl: 1.5rem;
      --text-3xl: 1.875rem;
      --text-4xl: 2.25rem;
      
      /* Spacing System */
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.25rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --space-10: 2.5rem;
      --space-12: 3rem;
      
      /* Border Radius */
      --radius-sm: 0.375rem;
      --radius-md: 0.5rem;
      --radius-lg: 0.75rem;
      --radius-xl: 1rem;
      
      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    }
    
    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      :root {
        --neutral-50: #171717;
        --neutral-100: #262626;
        --neutral-200: #404040;
        --neutral-600: #a3a3a3;
        --neutral-700: #d4d4d4;
        --neutral-800: #e5e5e5;
        --neutral-900: #fafafa;
      }
    }
    
    /* Base Typography */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
      line-height: 1.6;
      background-color: var(--neutral-100);
      color: var(--neutral-800);
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    /* Container & Layout */
    .email-container {
      max-width: 600px;
      width: 100%;
      margin: var(--space-6) auto;
      background-color: var(--neutral-50);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--neutral-200);
    }
    
    /* Header Section */
    .email-header {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      position: relative;
      padding: var(--space-10) var(--space-6);
      text-align: center;
      color: white;
      overflow: hidden;
    }
    
    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><pattern id="grain" width="100" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.05"/><circle cx="30" cy="5" r="0.5" fill="white" opacity="0.03"/><circle cx="70" cy="15" r="1.5" fill="white" opacity="0.04"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }
    
    .header-icon {
      font-size: var(--text-4xl);
      margin-bottom: var(--space-3);
      display: block;
      line-height: 1;
    }
    
    .header-title {
      font-size: var(--text-2xl);
      font-weight: 700;
      letter-spacing: -0.025em;
      margin: 0;
      position: relative;
      z-index: 1;
    }
    
    .header-subtitle {
      font-size: var(--text-sm);
      opacity: 0.9;
      margin-top: var(--space-2);
      font-weight: 400;
      position: relative;
      z-index: 1;
    }
    
    /* Main Content */
    .email-content {
      padding: var(--space-10) var(--space-6);
      text-align: center;
      background: var(--neutral-50);
    }
    
    .product-name {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-800);
      margin-bottom: var(--space-4);
      padding: var(--space-3) var(--space-5);
      background: var(--primary-50);
      border-radius: var(--radius-lg);
      display: inline-block;
      border: 2px solid var(--primary-100);
    }
    
    .remaining-info {
      margin: var(--space-8) 0;
      padding: var(--space-6);
      background: linear-gradient(145deg, var(--neutral-50), var(--neutral-100));
      border-radius: var(--radius-xl);
      border: 1px solid var(--neutral-200);
      position: relative;
      overflow: hidden;
    }
    
    .remaining-info::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-500), var(--accent-500));
    }
    
    .remaining-label {
      font-size: var(--text-base);
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      font-weight: 500;
    }
    
    .remaining-count {
      font-size: var(--text-4xl);
      font-weight: 800;
      color: ${remaining <= 5 ? 'var(--error-500)' : remaining <= 10 ? 'var(--warning-500)' : 'var(--success-500)'};
      margin: var(--space-2) 0;
      line-height: 1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }
    
    .remaining-unit {
      font-size: var(--text-xl);
      font-weight: 600;
      color: var(--neutral-600);
    }
    
    .usage-info {
      font-size: var(--text-sm);
      color: var(--neutral-600);
      margin-top: var(--space-4);
      padding: var(--space-3);
      background: var(--neutral-100);
      border-radius: var(--radius-md);
      border-left: 4px solid var(--primary-500);
    }
    
    .status-message {
      margin: var(--space-8) 0;
      padding: var(--space-5);
      background: ${remaining <= 5 ? 'linear-gradient(145deg, #fef2f2, #fee2e2)' : 'linear-gradient(145deg, #fffbeb, #fef3c7)'};
      border-radius: var(--radius-lg);
      border: 1px solid ${remaining <= 5 ? 'var(--error-500)' : 'var(--warning-500)'};
      color: var(--neutral-800);
    }
    
    .status-message p {
      margin: 0;
      font-size: var(--text-base);
      font-weight: 500;
      line-height: 1.5;
    }
    
    /* CTA Button */
    .cta-container {
      margin-top: var(--space-10);
    }
    
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-8);
      background: linear-gradient(145deg, var(--accent-500), var(--accent-600));
      color: white;
      font-size: var(--text-base);
      font-weight: 600;
      text-decoration: none;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      border: none;
      cursor: pointer;
      min-width: 200px;
      justify-content: center;
    }
    
    .cta-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s;
    }
    
    .cta-button:hover::before {
      left: 100%;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
      background: linear-gradient(145deg, var(--accent-400), var(--accent-500));
    }
    
    .cta-button:active {
      transform: translateY(0);
      box-shadow: var(--shadow-md);
    }
    
    .button-icon {
      font-size: var(--text-lg);
    }
    
    /* Footer */
    .email-footer {
      background: var(--neutral-100);
      padding: var(--space-8) var(--space-6);
      text-align: center;
      border-top: 1px solid var(--neutral-200);
    }
    
    .footer-icon {
      font-size: var(--text-xl);
      margin-bottom: var(--space-3);
      color: var(--primary-500);
    }
    
    .footer-text {
      font-size: var(--text-sm);
      color: var(--neutral-600);
      margin: 0;
      line-height: 1.4;
    }
    
    .footer-disclaimer {
      font-size: var(--text-xs);
      color: var(--neutral-600);
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-200);
    }
    
    /* Progress Indicator */
    .progress-container {
      margin: var(--space-6) 0;
      padding: var(--space-4);
      background: var(--neutral-100);
      border-radius: var(--radius-lg);
    }
    
    .progress-label {
      font-size: var(--text-sm);
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      font-weight: 500;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--neutral-200);
      border-radius: var(--radius-sm);
      overflow: hidden;
      position: relative;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, 
        ${remaining <= 5 ? 'var(--error-500)' : remaining <= 15 ? 'var(--warning-500)' : 'var(--success-500)'}, 
        ${remaining <= 5 ? '#f87171' : remaining <= 15 ? '#fbbf24' : '#34d399'}
      );
      width: ${Math.max((remaining / 50) * 100, 2)}%;
      border-radius: var(--radius-sm);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    /* Responsive Design */
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: var(--space-2);
        border-radius: var(--radius-lg);
      }
      
      .email-header {
        padding: var(--space-8) var(--space-4);
      }
      
      .header-title {
        font-size: var(--text-xl);
      }
      
      .email-content {
        padding: var(--space-8) var(--space-4);
      }
      
      .remaining-count {
        font-size: var(--text-3xl);
      }
      
      .product-name {
        font-size: var(--text-base);
        padding: var(--space-2) var(--space-4);
      }
      
      .cta-button {
        padding: var(--space-4) var(--space-6);
        font-size: var(--text-sm);
        min-width: 180px;
      }
      
      .email-footer {
        padding: var(--space-6) var(--space-4);
      }
    }
    
    /* High Contrast Mode Support */
    @media (prefers-contrast: high) {
      .email-container {
        border: 2px solid var(--neutral-800);
      }
      
      .cta-button {
        border: 2px solid var(--neutral-800);
      }
      
      .remaining-count {
        text-shadow: none;
        font-weight: 900;
      }
    }
    
    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
      .progress-fill::after {
        animation: none;
      }
      
      .cta-button {
        transition: none;
      }
      
      .cta-button:hover {
        transform: none;
      }
    }
    
    /* Print Styles */
    @media print {
      .email-container {
        box-shadow: none;
        border: 1px solid var(--neutral-400);
      }
      
      .email-header {
        background: var(--neutral-200) !important;
        color: var(--neutral-800) !important;
      }
      
      .cta-button {
        background: var(--neutral-200) !important;
        color: var(--neutral-800) !important;
        border: 1px solid var(--neutral-400);
      }
    }
  </style>
</head>

<body role="document">
  <div class="email-container" role="main" aria-labelledby="email-title">
    
    <!-- Header Section -->
    <header class="email-header" role="banner">
      <div class="header-icon" role="img" aria-label="洗濯アイコン">🧺</div>
      <h1 class="header-title" id="email-title">洗剤残量通知</h1>
      <p class="header-subtitle">スマート洗濯管理システム</p>
    </header>
    
    <!-- Main Content -->
    <main class="email-content">
      <div class="product-name" role="text">
        「部屋干しスーパークリーン」
      </div>
      
      <div class="remaining-info" role="region" aria-labelledby="remaining-label">
        <p class="remaining-label" id="remaining-label">現在の残量</p>
        <div class="remaining-count" role="text" aria-label="${remaining}回分残り">
          <span>${remaining}</span>
          <span class="remaining-unit">回分</span>
        </div>
        <div class="usage-info" role="note">
          💧 1回の使用量：22ml
        </div>
      </div>
      
      <!-- Progress Indicator -->
      <div class="progress-container" role="region" aria-labelledby="progress-label">
        <p class="progress-label" id="progress-label">残量レベル</p>
        <div class="progress-bar" role="progressbar" 
             aria-valuenow="${remaining}" 
             aria-valuemin="0" 
             aria-valuemax="50"
             aria-label="洗剤残量: ${remaining}回分 / 50回分">
          <div class="progress-fill"></div>
        </div>
      </div>
      
      <div class="status-message" role="alert" aria-live="polite">
        <p>
          ${remaining <= 5 ? 
            '⚠️ 緊急：洗剤の残量が非常に少なくなっています。今すぐ補充をお勧めします。' : 
            remaining <= 10 ? 
            '⚡ 注意：洗剤の残量が少なくなってきました。お早めの補充をお勧めします。' : 
            '✅ まだ余裕がありますが、計画的な補充を心がけましょう。'
          }
        </p>
      </div>
      
      <!-- CTA Section -->
      <div class="cta-container">
        <a href="https://laundry-detergent-counter.vercel.app/" 
           class="cta-button" 
           role="button"
           aria-label="洗剤在庫管理アプリを開く">
          <span class="button-icon">📱</span>
          <span>在庫を管理する</span>
        </a>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="email-footer" role="contentinfo">
      <div class="footer-icon" role="img" aria-label="メールアイコン">📧</div>
      <p class="footer-text">
        このメールは洗剤残量管理システムから<br>
        自動的に送信されています。
      </p>
      <p class="footer-disclaimer" role="note">
        配信停止をご希望の場合は、アプリの設定画面から変更できます。<br>
        ご質問がございましたら、サポートまでお気軽にお問い合わせください。
      </p>
    </footer>
    
  </div>
  
  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EmailMessage",
    "about": "洗剤残量通知",
    "sender": {
      "@type": "Organization",
      "name": "洗剤管理システム"
    },
    "datePublished": "${new Date().toISOString()}",
    "keywords": ["洗剤", "残量", "通知", "家事", "管理"]
  }
  </script>
  
</body>
</html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Smart Laundry <noreply@smartlaundry.app>",
        to,
        subject: type === "半分" 
          ? `🧺 洗剤残量が半分になりました (${remaining}回分)` 
          : `⚠️ 洗剤の残量が少なくなっています (${remaining}回分)`,
        html: emailHtml,
        // Fallback text version for accessibility
        text: `
洗剤残量のお知らせ

「部屋干しスーパークリーン」の残りはあと${remaining}回分です。
(1回の使用量：22ml)

${remaining <= 5 ? 
  '緊急：洗剤の残量が非常に少なくなっています。今すぐ補充をお勧めします。' : 
  remaining <= 10 ? 
  '注意：洗剤の残量が少なくなってきました。お早めの補充をお勧めします。' : 
  'まだ余裕がありますが、計画的な補充を心がけましょう。'
}

在庫管理: https://laundry-detergent-counter.vercel.app/

このメールは自動送信されています。
        `,
        // Email headers for better deliverability
        headers: {
          'X-Priority': remaining <= 5 ? '1' : '3',
          'X-MSMail-Priority': remaining <= 5 ? 'High' : 'Normal',
          'Importance': remaining <= 5 ? 'high' : 'normal',
        }
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      res.status(200).json({ 
        message: "Email sent successfully",
        id: result.id,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('Email sending failed:', result);
      res.status(500).json({ 
        error: "Failed to send email", 
        details: result 
      });
    }
    
  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
}
