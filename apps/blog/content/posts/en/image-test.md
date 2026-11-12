---
id: image-test
title: Image test post
description: A temporary post that shows a cover image and an image in the body. Remove before merging.
publishedAt: 2026-11-10T09:00:00+01:00
authors: [werner]
nextStep: none
coverImage:
  src: ./image-test-cover.png
  alt: A path along a mountain ridge under a pale sky.
  caption: The cover, cropped by Ardo to 16:10 in the column layout and 4:3 on phones.
  core: { x: 0.5, y: 0.55, size: 0.6 }
---

This post exists only for the pull request screenshots. The cover above comes from Ardo's
`coverImage` field; the image below is a plain Markdown image in the body.

![An open book with documentation pages and code samples.](./image-test-illustration.png)

Ardo renders both images at build time as AVIF, with one JPEG for browsers without AVIF,
feeds, and the social preview.
