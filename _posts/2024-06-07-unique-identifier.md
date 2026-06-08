---
title: Which Unique Identifier Is Right For You?
date: 2024-06-07
categories: [internals]
tags: [internals, unique-identifiers]
description: Comparing UUID, ULID, Snowflake-style IDs, and database sequences for reliability and scale.
toc:
  - id: tradeoffs
    label: Tradeoffs
  - id: ordering
    label: Ordering
  - id: choice
    label: Choice
---

## Tradeoffs
{: #tradeoffs }

An identifier is part of a system's design. The right choice depends on where it
is created, whether it must be sortable, and how it behaves under high write
volume.

## Ordering
{: #ordering }

Ordered identifiers can improve database locality and make logs easier to read.
The tradeoff is that they may expose timing information or require coordination.

## Choice
{: #choice }

Use the simplest ID that satisfies the operational needs. A database sequence is
often enough; distributed systems may need something generated outside the
database.
