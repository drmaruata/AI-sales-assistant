# Release Checklist

## Product
- [ ] One beachhead customer segment chosen and documented.
- [ ] Core workflow validated with pilot users.
- [ ] Pricing and quotas tested with real buyers.
- [ ] No nonfunctional screens or placeholder controls.

## Security
- [ ] RLS enabled on every tenant-owned table.
- [ ] Cross-tenant tests pass.
- [ ] No privileged keys in client bundle or repository.
- [ ] Edge Functions validate JWT, workspace membership, and object relationships.
- [ ] AI endpoint has rate limits and bounded inputs/outputs.
- [ ] Logs and analytics exclude unnecessary personal data.
- [ ] Dependency and secret scans reviewed.

## Reliability
- [ ] Error monitoring configured.
- [ ] Backups enabled.
- [ ] Restore rehearsal completed.
- [ ] AI provider timeout and outage tested.
- [ ] Offline and duplicate-submission behavior checked.
- [ ] Real-device smoke tests pass.

## Privacy and store readiness
- [ ] Privacy policy reflects actual data flows and AI provider.
- [ ] Terms and support contact published.
- [ ] Export and deletion flows tested.
- [ ] Google Play / Apple privacy disclosures accurate.
- [ ] Billing flow reviewed against current platform policies.
- [ ] Notification permission and lock-screen content reviewed.

## Release evidence
- [ ] Commit SHA recorded.
- [ ] Test report attached.
- [ ] Known defects listed with severity.
- [ ] Rollback/forward-fix plan documented.
- [ ] Pilot support process ready.
