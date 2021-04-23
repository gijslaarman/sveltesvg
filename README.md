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
$ sveltesvg --in "src/assets/svgs/icons" --out "src/components/Icons"
```

##### CLI flags/options:

```
Options:
  --help                      Show help                                [boolean]
  --version                   Show version number                      [boolean]
  --in, --inputDir            input directory path           [string] [required]
  --out, --outputDir          output directory path          [string] [required]
  --ts, --typescript          should export the index files as js or ts, default
                              is .js                                   [boolean]
  --templatePath, --template  The path to the template you would like to use. If
                              left empty will use the default template  [string]
```

\- or -

#### 'package.json' script:

```json
// package.json:
"scripts" {
  "svgs": "sveltesvg --in \"src/assets/svgs/icons\" --out \"src/components/Icons\""
}
```

---

### Using npx

```bash
$ sveltesvg --in "src/assets/svgs/icons" --out "src/components/Icons"
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
```

## Custom templates

I can understand that you want to create your own template per icon. Just like [svgr](https://github.com/gregberge/svgr) you can define a path to where your template is and the generator will add the SVG to that template.

### How to create your own template

Create a function with 1 parameter: `svg`. The function should return a template literal or string where the svg is used.
Write all the svelte markup/css/js/ts you want but don't forget to add the svg somewhere, otherwise the icons won't have the actual SVG.

**Example:**

```js
const iconTemplate = (svg) => `
<script lang="ts">
  export let size: string = '100%'
  $$props.width = size
  $$props.height = size
  delete $$props.size
</script>
${svg}
`

module.exports = iconTemplate
```
