<script>
  export let onclick;
  export let className = "";
  export let active = false;
</script>

<button
  on:click={onclick}
  class={`p-1.5 rounded-md bg-slate-100 hover:bg-slate-300 transition-colors border border-black ${className} ${active ? "bg-slate-400" : ""}`}
  ><slot /></button
>
