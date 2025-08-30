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
    <title>洗剤の残量のお知らせ</title>
    <style>
        :root {
            /* カラーシステム */
            --primary-50: #f0f9ff;
            --primary-500: #0ea5e9;
            --primary-900: #0c4a6e;
            --neutral-50: #f8fafc;
            --neutral-200: #e2e8f0;
            --neutral-900: #0f172a;
            --semantic-success: #10b981;
            --semantic-warning: #f59e0b;
            --semantic-error: #ef4444;
            --text-on-primary: #ffffff;
            --text-on-neutral: #334155;
            
            /* タイポグラフィスケール */
            --text-xs: 0.75rem;
            --text-sm: 0.875rem;
            --text-base: 1rem;
            --text-lg: 1.125rem;
            --text-xl: 1.25rem;
            --text-2xl: 1.5rem;
            --text-3xl: 1.875rem;
            --text-4xl: 2.25rem;
            --text-5xl: 3rem;

            /* スペーシング */
            --spacing-1: 0.25rem;
            --spacing-2: 0.5rem;
            --spacing-4: 1rem;
            --spacing-6: 1.5rem;
            --spacing-8: 2rem;
            --spacing-12: 3rem;

            /* シャドウ */
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* 全体のリセットと基本スタイル */
        *, *::before, *::after {
            box-sizing: border-box;
        }

        body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            background-color: var(--neutral-50);
            color: var(--neutral-900);
            line-height: 1.5;
            margin: 0;
            padding: var(--spacing-8) var(--spacing-4);
        }

        /* セマンティックなレイアウト */
        main.card-container {
            max-width: 640px;
            margin: auto;
            background-color: #ffffff;
            border-radius: var(--spacing-4);
            box-shadow: var(--shadow-md);
            border: 1px solid var(--neutral-200);
            overflow: hidden;
        }

        header.card-header {
            background-color: var(--primary-500);
            color: var(--text-on-primary);
            padding: var(--spacing-6) var(--spacing-4);
            text-align: center;
        }

        header.card-header h1 {
            font-size: var(--text-2xl);
            font-weight: 700;
            margin: 0;
        }

        section.card-body {
            padding: var(--spacing-8) var(--spacing-6);
            text-align: center;
        }

        /* タイポグラフィと情報階層 */
        .detergent-name {
            font-size: var(--text-lg);
            font-weight: 600;
            color: var(--neutral-900);
            margin-top: 0;
            margin-bottom: var(--spacing-2);
        }

        .remaining-value {
            font-size: var(--text-5xl);
            font-weight: 900;
            line-height: 1;
            margin: var(--spacing-4) 0;
            transition: color 0.3s ease;
        }

        .unit {
            font-size: var(--text-2xl);
            font-weight: 700;
            color: var(--neutral-900);
        }

        .usage-info {
            font-size: var(--text-sm);
            color: var(--neutral-500);
            margin-top: var(--spacing-2);
        }
        
        .message {
            font-size: var(--text-base);
            color: var(--text-on-neutral);
            margin-top: var(--spacing-6);
        }

        /* ボタン */
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: var(--spacing-8);
            padding: var(--spacing-4) var(--spacing-8);
            background-color: var(--primary-500);
            color: var(--text-on-primary);
            font-size: var(--text-base);
            font-weight: 600;
            text-decoration: none;
            border-radius: 9999px; /* Pill shape */
            transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .button:hover, .button:focus {
            background-color: var(--primary-900);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .button-icon {
            margin-left: var(--spacing-2);
        }

        /* フッター */
        footer.card-footer {
            padding: var(--spacing-4);
            font-size: var(--text-xs);
            text-align: center;
            color: var(--neutral-500);
            background-color: var(--neutral-50);
            border-top: 1px solid var(--neutral-200);
        }

        /* JavaScriptによる動的クラス */
        .remaining-warning {
            color: var(--semantic-warning);
        }

        .remaining-critical {
            color: var(--semantic-error);
        }
    </style>
</head>
<body>
    <main class="card-container" role="main">
        <header class="card-header">
            <h1 id="main-heading">洗剤の残量のお知らせ</h1>
        </header>

        <section class="card-body" aria-labelledby="main-heading">
            <h2 class="detergent-name">「部屋干しスーパークリーン」の残りはあと</h2>
            <div class="remaining-value-container" role="status" aria-live="polite">
                <span id="remaining-count" class="remaining-value">${remaining}</span>
                <span class="unit">回分</span>
            </div>
            <p class="usage-info">※1回の使用量：22ml</p>
            <p class="message">そろそろ補充のタイミングです。<br>スムーズな洗濯ライフを続けましょう！</p>
            <a href="https://laundry-detergent-counter.vercel.app/" class="button" role="button">
                今すぐ在庫を確認
                <span class="button-icon" aria-hidden="true">→</span>
            </a>
        </section>

        <footer class="card-footer">
            <p>これは自動送信メールです。</p>
        </footer>
    </main>

    <script>
        // Google Apps Scriptの実行環境ではDOM操作が制限されるため、
        // このスクリプトはクライアントサイドでのプログレッシブエンハンスメントを想定しています。
        // HtmlServiceでこれを実行する場合、htmlに埋め込むのではなく、
        // `google.script.run` を使った非同期処理と組み合わせてください。

        document.addEventListener('DOMContentLoaded', () => {
            const remainingCountElement = document.getElementById('remaining-count');
            const remaining = parseInt(remainingCountElement.textContent, 10);

            // 残量に応じて視覚的フィードバックを変更
            if (remaining <= 5) {
                remainingCountElement.classList.add('remaining-warning');
            }
            if (remaining <= 2) {
                remainingCountElement.classList.add('remaining-critical');
            }
        });
    </script>
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




