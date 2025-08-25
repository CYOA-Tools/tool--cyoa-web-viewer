<script>
  export let onclick;
  export let className = "";
  export let active = false;
</script>

<button
  on:click={onclick}
  class={`card-button
    p-1.5 rounded-md
    bg-slate-100 hover:bg-slate-300 transition-colors
    border border-black
    ${className}
    ${active ? "bg-slate-400" : ""}`}
>
  <slot />
</button>

<style>
  button.card-button {
    background: var(--main-card-bg-color);
    border-color: var(--main-card-border-color);
    border-radius: var(--main-card-border-radius);
    border-width: var(--main-card-border-width);
  }
</style>
