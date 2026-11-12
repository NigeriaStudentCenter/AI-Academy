# BSOE Practical Skills Academy — Public GitHub deployment

This subdirectory contains the standalone PUBLIC marketing site for the British School of Outdoor Education's nine independent online practical-skills courses.

## Paths
- `index.html`: main course catalogue
- `plumbing.html`, `electrical.html`, `carpentry.html`, `automotive.html`, `hvac.html`, `solar.html`, `building.html`, `beauty.html`, `gardening.html`: nine dedicated landing pages
- `preview.js`: a simplified original animated process preview with fault simulation; no simulated outcome is represented as a real-workplace assessment
- `checkout.html?course=<slug>`: deliberately unconfigured, noncharging enrolment status page
- `styles.css`: accessible responsive design

## Deliberately omitted
Paid course HTML, workbooks, full MP4 animations, answer banks, assessment materials, tutor instructions and private learner data have NOT been put in this public repository. They remain in the private educator development package pending authenticated server-side entitlements.

## Security requirements before launch
Use a payment provider backend and verify transaction status, amount, currency, product, signature and non-reuse on the server. Serve paid media and lessons from private storage through authenticated entitlements; never rely on hidden links, JavaScript redirects, query parameters, public branches or GitHub Pages for access control. Configure the live Azure tutor with privacy/security controls.

## Transparency
These are independent BSOE courses whose subject areas are informed by Pearson specifications. They are not official Pearson qualifications or endorsements. Course completion does not equal supervised trade competence or a trade licence. Skills involving mains electricity, refrigerants, structures, rooftops, vehicles and machinery require competent supervision.

## GitHub Pages
This public site can be served at `/AI-Academy/practical-skills/` if GitHub Pages is publishing this repository's main-branch root. Publishing settings cannot be inferred from the existence of the files alone. If GitHub Pages uses a different publishing source, the site must be added to that build/output.
