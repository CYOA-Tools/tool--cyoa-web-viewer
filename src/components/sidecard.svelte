<script>
  export let className = "";
  export let style = "";
</script>

<div
  {style}
  class={`p-1.5 bg-slate-200 rounded-lg shadow-md flex flex-col gap-1.5 ${className}`}
>
  <slot />
</div>
