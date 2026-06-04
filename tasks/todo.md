# Task Checklist: Database and Frontend Sample Data Cleanup

- [x] Plan Verification: Present implementation plan and get user approval
- [/] Backend Refactoring & Script:
  - [ ] Remove auto-seeding of non-guest mock users in `backend/routes/auth.js`
  - [ ] Create `backend/clean-db.js` script to clear MongoDB collections (protecting guest user data)
  - [ ] Run `backend/clean-db.js` to execute database cleanup
- [ ] Frontend Refactoring:
  - [ ] Remove non-guest users from resourcing allocations in `StrategyResourcingView.jsx`
  - [ ] Remove non-guest users from `seedUsers` in `StrategyGoalsView.jsx`
- [ ] Verification:
  - [ ] Launch application locally and verify that Strategy pages only display the guest user (Aaryan Ranjan)
- [ ] Git Commit & Push:
  - [ ] Stage, commit, and push updated files to GitHub repository
