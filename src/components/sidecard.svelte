<script>
    export let className = '';
  </script>
  
  <div class={`p-1.5 rounded-lg shadow-md flex flex-col gap-1.5 ${className}`}>
    <slot />
</div>