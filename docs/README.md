# README — Zodiac App (FINAL)

> **Complete horoscope app with monetization** — React Native + Django.
> **Never delete or rename** any `docs/*.md`.

---

## Quick Start

```bash
# Frontend (Expo)
npm install
npm start
# press "i" (iOS) or "a" (Android)

# Backend (Django)
cd api
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## Project Structure

- **Frontend**: React Native with Expo Router, TypeScript
- **Backend**: Django REST Framework with JWT auth
- **Content**: Static JSON files + dynamic API predictions
- **Monetization**: Premium subscriptions with regional pricing (GEL/EUR/USD)

---

## Key Features

- **Daily Horoscopes**: Free daily + premium weekly/monthly/yearly
- **Compatibility**: Zodiac sign matching with detailed breakdown
- **Traits**: Static characteristics for all 12 signs
- **Druid & Chinese**: Ancient wisdom systems tied to birth data
- **Premium Gating**: Blur + upgrade CTA for premium content
- **Regional Pricing**: Auto-detect country → GEL/EUR/USD pricing
- **Analytics**: Event tracking for usage and monetization

---

## Documentation

All specs are in `docs/`:

- `DESIGN_REVIEW.md` — Visual specs, components, tokens
- `ACCEPTANCE.md` — Required functionality checklist
- `API_CONTRACT.md` — Backend endpoint contracts
- `CODE_REVIEW.md` — Development standards
- `CONTENT_GUIDELINES.md` — Copy, data shapes, regional pricing
- `ANALYTICS.md` — Event tracking specification
- `PROJECT_FLOW.md` — Build process and folder structure

---

## Commands

```bash
# Development
npm start                # Start Expo dev server
npm run ios             # Run on iOS simulator
npm run android         # Run on Android emulator
npm run web             # Run on web

# Quality
npm run lint            # ESLint check
npm run typecheck       # TypeScript check
npm test               # Run tests

# Backend
cd api
python manage.py runserver    # Start Django server
python manage.py test         # Run backend tests
```

---

## Deployment

- **Frontend**: EAS Build → App Store/Google Play
- **Backend**: Gunicorn + PostgreSQL on cloud platform
- **Content**: Static JSON served via CDN
- **Analytics**: BigQuery/GA4 integration

---

## Non-Negotiables

- Follow `docs/DESIGN_REVIEW.md` exactly (no improvisation)
- Use only tokens from `constants/theme.ts` and `constants/signs.ts`
- Premium content must be blurred for free users
- Banners must deep-link per routing table
- Regional pricing must be server-driven
- Analytics events must fire per `ANALYTICS.md`

---

## Contributing

1. Read all `docs/*.md` files before coding
2. Never delete or rename documentation files
3. Pass all acceptance criteria before merge
4. Follow TypeScript strict mode
5. Add tests for new functionality

---

## Support

For technical issues, check:

- `docs/PROJECT_FLOW.md` for troubleshooting
- `docs/ACCEPTANCE.md` for feature requirements
- `docs/API_CONTRACT.md` for backend integration
