---
title: Google File System (Oct 2003) Notes
date: 2024-03-30
categories: [paper]
tags: [paper, google-file-system]
description: Notes on master metadata, chunk servers, replication, and the design tradeoffs in the Google File System paper.
toc:
  - id: design
    label: Design
  - id: metadata
    label: Metadata
  - id: replication
    label: Replication
---

## Design
{: #design }

The system is designed for large files, append-heavy workloads, and failure as a
normal condition. That context shapes almost every decision in the paper.

## Metadata
{: #metadata }

The master keeps metadata centralized, which makes coordination simpler. The
design relies on keeping that metadata small and caching it aggressively.

## Replication
{: #replication }

Replication keeps chunks available when machines fail. The system trades strict
general-purpose semantics for throughput and operational simplicity.
