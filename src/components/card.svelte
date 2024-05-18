<script>
  export let className = "";
  export let style = "";
</script>

<div
  {style}
  class={`p-3 border-2 border-black rounded-lg shadow-md flex flex-col ${className}`}
>
  <slot />
</div>
