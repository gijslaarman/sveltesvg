# Generate + optimize your svgs on command

Got tired of having to do handwork with SVGs & the how-to on implementing them with Svelte.

Dump all your icons/svgs in one folder and this package will generate usable Svelte components from it.

1. [How to generate icons](how-to-generate-icons)
2. [How to use](how-to-use)

## How to generate icons

- [Installing locally](#installing-locally)
- [Using npx](#using-npx)

### Installing locally

```bash
$ npm install @gijslaarman/sveltesvg
```

#### CLI:

```bash
$ @gijslaarman/sveltesvg --in "src/assets/svgs/icons" --out "src/components/Icons"
```

\- or -

#### 'package.json' script:

```json
// package.json:
"scripts" {
  "svgs": "@gijslaarman/sveltesvg --in \"src/assets/svgs/icons\" --out \"src/components/Icons\""
}
```

---

### Using npx

```bash
$ @gijslaarman/sveltesvg --in "src/assets/svgs/icons" --out "src/components/Icons"
```

I recommend saving it as a script inside package.json:

```json
// package.json
{
  "scripts": {
    "svgs": "npx @gijslaarman/sveltesvg --in \"src/assets/icons\" --out \"src/components/Icons\""
  }
}
```

## How to use

```js
// src/components/example.svelte

<script>
  import { IconName } from './Icons'
</script>

// Leave empty to width/height to 100%
<IconName />

// Enter size to give the icon a fixed size
<IconName size="20" />

```
