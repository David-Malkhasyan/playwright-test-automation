# JetBrains UI Behavioral Checks – Test Map

## Feature Description

JetBrains UI tests verify the main page functionalities of the JetBrains website. These checks ensure that the page is accessible, the title is correct, and key elements like the logo are visible.

---

## Test Scenarios

### jb-001 - should open JetBrains main page and verify title

**Steps:**

1. Navigate to the JetBrains main page.
2. Verify the page title matches the expected regex `/JetBrains: Essential tools for software developers and teams/`.

---

### jb-002 - should verify logo is visible on main page

**Steps:**

1. Navigate to the JetBrains main page.
2. Verify that the logo element with `data-test="logo"` is visible.
