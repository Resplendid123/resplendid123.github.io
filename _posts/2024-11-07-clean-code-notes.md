---
title: Clean Code (Robert C Martin)- Notes
date: 2024-11-07
categories: [book-notes]
tags: [book-notes, clean-code]
description: Practical notes on naming, small functions, boundaries, and the discipline required to keep code readable.
toc:
  - id: names
    label: Names
  - id: functions
    label: Functions
  - id: boundaries
    label: Boundaries
---

## Names
{: #names }

Good names reduce the amount of explanation around code. A name should reveal
intent, carry the right level of detail, and avoid forcing the reader to decode
abbreviations.

## Functions
{: #functions }

Small functions are easier to test and move. The important part is not size by
itself, but whether each function has one reason to change.

## Boundaries
{: #boundaries }

Clean boundaries keep details from leaking everywhere. External libraries,
databases, and frameworks should be wrapped at the point where the application
needs a stable contract.
