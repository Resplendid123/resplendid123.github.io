---
title: TypeScript Handbook
date: 2024-01-22
categories: [handbooks]
tags: [handbooks, typescript]
description: Notes on TypeScript's type system, narrowing, interfaces, generics, and how to use types as design feedback.
toc:
  - id: types
    label: Types
  - id: narrowing
    label: Narrowing
  - id: generics
    label: Generics
---

## Types
{: #types }

Types describe the shape of values and the boundaries between modules. They are
most useful when they model the domain rather than only satisfying the compiler.

## Narrowing
{: #narrowing }

Narrowing lets code move from uncertainty to certainty. Clear checks create
safer branches and make runtime assumptions visible.

## Generics
{: #generics }

Generics are useful when a relationship between values matters. They should make
APIs more precise, not harder to read.
