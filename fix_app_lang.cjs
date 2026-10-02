const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;",
  `if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.language !== 'es' && parsed.language !== 'en') {
        parsed.language = detectedLang;
      }
      return { ...defaultProfile, ...parsed };
    }
    return defaultProfile;`
);

fs.writeFileSync('src/App.tsx', app);
