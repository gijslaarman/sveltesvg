const iconTemplate = (svg: string) => `
<script lang="ts">
  export let size: string = '100%'
  $$props.width = size
  $$props.height = size
  delete $$props.size
</script>
${svg}
`

export default iconTemplate
