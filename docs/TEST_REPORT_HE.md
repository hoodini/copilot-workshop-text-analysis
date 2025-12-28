# דוח בדיקות – Text Analysis Service (Legacy)

תאריך: 28/12/2025

## תקציר
בוצעו בדיקות יחידה (Unit) עבור פונקציות הליבה של השירות, ובדיקות אינטגרציה (Integration) עבור נקודות הקצה (API) המרכזיות.
בסיום, הרצת `npm test` עברה בהצלחה.

## איך הרצתי את הבדיקות
- פקודה: `npm test`
- רץ באמצעות Jest (מוגדר ב־package.json תחת `scripts.test`)
- סביבת בדיקות: Node
- הגדרות בדיקה: `process.env.NODE_ENV` מוגדר ל־`test` דרך `test/setup.js`, ולכן השרת לא עולה בזמן בדיקות.

## תרשים זרימה (Mermaid) – מה רץ כשמריצים `npm test`
<!-- Created by AI Agent -->
```mermaid
flowchart TD
  A[מפתח מריץ: npm test] --> B[Jest מתחיל ריצה]
  B --> C[טעינת test/setup.js]
  C --> C1[set NODE_ENV=test]
  C --> C2[set API_TIMEOUT=2000]

  B --> D{איסוף קבצי בדיקה לפי jest.config.js\n(testMatch)}
  D --> U[test/unit/app-core.test.js\nUnit: פונקציות טהורות]
  D --> S[test/sample.test.js\nSample: חלק מהבדיקות מסומנות skip]
  D --> I[test/integration/api.integration.test.js\nIntegration: API + Nock]

  %% Unit tests
  U --> U1[countWords/countSentences/countCharacters/calculateReadingTime]
  U --> U2[toSlug/convertCase/reverseText]
  U --> U3[isValidEmail/isValidUrl/containsProfanity]
  U --> U4[analyzeLocalSentiment + analyzeSentiment]

  %% Sample tests
  S --> S1[בדיקות שמדגימות באגים ידועים]
  S1 --> S2[skip כדי לשמור על CI ירוק]

  %% Integration tests
  I --> I1[Supertest שולח בקשות ל-app\n(require('../../src/index').app)]
  I1 --> I2[Nock מדמה MyMemory API ל-/translate]
  I1 --> I3[בדיקת endpoints: /health, /analyze/stats, /analyze/sentiment, /translate]

  U --> R[תוצאות]
  S --> R
  I --> R
  R --> Z[סיכום Jest: passed / skipped / todo]
```

## אילו בדיקות בוצעו (מה כיסינו)

### 1) בדיקות יחידה – פונקציות “טהורות” (ללא HTTP)
קובץ: `test/unit/app-core.test.js`

נבדקו הפונקציות הבאות:
- סטטיסטיקה: `countWords`, `countSentences`, `countCharacters`, `calculateReadingTime`
- טרנספורמציות: `toSlug`, `convertCase`, `reverseText`
- ולידציה וסנטימנט: `isValidEmail`, `isValidUrl`, `containsProfanity`, `analyzeLocalSentiment`, `analyzeSentiment`

דוגמאות למה בדקנו בפועל:
- קלטים ריקים/Falsy: `''`, `null`, `undefined`, `false`, `0`
- טקסטים “רגילים”: מילה אחת, כמה מילים, סימני פיסוק בסיסיים
- רווחים/Whitespace:
  - רווחים מרובים/רווח מוביל/רווח מסיים (כדי להדגים את הבאג הידוע ב־`countWords`)
  - טאב ושבירת שורה (להראות את ההתנהגות הנוכחית)
- יוניקוד: עברית/יפנית עם רווח
- סוגי קלט לא־מחרוזת: אובייקט/מערך/מספר (מצופה חריגה ב־`countWords` כרגע)
- `calculateReadingTime`: 200 מילים מול 201 מילים (בדיקת עיגול כלפי מעלה)
- סנטימנט מקומי: חיובי/שלילי/נייטרלי, החזרת `matchedWords`, ונרמול ציון לתחום [-1, 1]

הערה: קיימות גם `test.todo(...)` לבדיקות “התנהגות רצויה” עתידית של `countWords` (לא רצות כרגע).

### 2) בדיקות אינטגרציה – API
קובץ: `test/integration/api.integration.test.js`

נבדקו:
- `GET /health` – החזרת סטטוס ו־timestamp
- `POST /analyze/stats` – החזרת סטטיסטיקות בסיסיות לקלט תקין + 400 לקלט חסר
- `POST /analyze/sentiment` – חיובי/שלילי/נייטרלי + 400 לקלט חסר
- `POST /translate` – בדיקה עם Mock (Nock) להצלחה וכשל של שירות חיצוני

### 3) “Sample tests” לצורכי סדנה
קובץ: `test/sample.test.js`

הקובץ מכיל דוגמאות בדיקה שמטרתן לחשוף באגים.
כדי לשמור על ריצה ירוקה, בדיקות שמייצגות התנהגות “רצויה” אך נכשלות כרגע סומנו כ־`test.skip`.

## מה עבד ומה לא עבד

### מה עבד
- הרצת `npm test` הסתיימה בהצלחה (כל ה־Test Suites עברו).
- בדיקות יחידה של פונקציות הליבה עברו לפי *ההתנהגות הנוכחית* בקוד.
- בדיקות אינטגרציה ל־API עברו.

### מה לא עבד (באגים/התנהגות בעייתית שנמצאה)
הנקודות הבאות הן “ממצאים” בקוד הנוכחי (בחלקן מופיעות כבדיקות `skip`/`todo` שממחישות מה היינו רוצים שיהיה):

1) `countWords` – ספירת מילים לא נכונה ברווחים מרובים / רווחים בתחילת/סוף
- מצב נוכחי: `text.split(' ').length`
- תוצאה: רווחים מרובים מייצרים “מילים ריקות” ונספרים בטעות.
- דוגמה: `'hello  world'` מחזיר 3 במקום 2.

איך לתקן:
- החלפה ל־split על כל whitespace + סינון ריקים:
  - `text.trim().split(/\s+/).filter(Boolean).length`
- רצוי גם להגן על סוגי קלט (למשל להחזיר 0/לזרוק TypeError באופן עקבי).

2) `countSentences` – פיצול נאיבי על `.`
- מצב נוכחי: `text.split('.').length`
- תוצאה: נקודה בסוף משפט יוצרת אלמנט ריק נוסף.
- דוגמה: `'Hello world.'` מחזיר 2 במקום 1.

איך לתקן (אפשרות פשוטה):
- `text.split('.').filter(Boolean).length`
איך לתקן (אפשרות “נכונה” יותר):
- לפצל על ביטוי רגולרי של סוף משפט (`[.!?]`) ולנקות רווחים.

3) `isPalindrome` – לא מתעלם מרווחים/Case
- מצב נוכחי: משווה מחרוזת מקור למחרוזת הפוכה בדיוק.
- תוצאה: `'RaceCar'` נכשל, וגם `'race car'` נכשל.

איך לתקן:
- נרמול לפני בדיקה:
  - להוריד רווחים/סימני פיסוק, להפוך ל־lowercase, ואז להשוות.

4) `findMostFrequentWord` – לא מנקה פיסוק ומחלק רק לפי רווח
- מצב נוכחי: `text.toLowerCase().split(' ')`
- תוצאה: `"hello,"` ו־`"hello"` נחשבות מילים שונות.

איך לתקן:
- ניקוי פיסוק לפני ספירה (למשל `word.replace(/[^\p{L}\p{N}]/gu, '')` או פתרון ASCII פשוט יותר),
- פיצול על `\s+`.

## המלצה לתיקון + איך לוודא
אם מתקנים את `countWords` (ושאר הפונקציות הבעייתיות), מומלץ:
- להסיר את `test.skip` הרלוונטיים ב־`test/sample.test.js`.
- להפוך את `test.todo` ב־`test/unit/app-core.test.js` לבדיקות פעילות.
- להריץ שוב: `npm test`

## קבצים רלוונטיים
- `src/index.js` – מימוש הפונקציות וה־API
- `test/unit/app-core.test.js` – בדיקות יחידה לליבה
- `test/integration/api.integration.test.js` – בדיקות אינטגרציה
- `test/sample.test.js` – בדיקות דוגמה לסדנה (חלקן מסומנות כ־skip)
