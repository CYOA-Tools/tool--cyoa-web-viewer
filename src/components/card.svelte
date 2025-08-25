<script>
  export let className = "";
  export let id="";
</script>

<div
  class={`choice-card p-3 border-2 border-black rounded-lg shadow-md flex flex-col ${className}`}
  id={id}
>
  <slot />
</div>

<style>
  .choice-card {
    background: var(--main-card-bg-color);
    border-color: var(--main-card-border-color);
    border-radius: var(--main-card-border-radius);
    border-width: var(--main-card-border-width);
  }
</style>
