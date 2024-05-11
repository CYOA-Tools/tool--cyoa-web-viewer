<script>
    export let className = '';
  </script>
  
  <div class={`p-3 border-2 border-black rounded-lg shadow-md flex flex-col ${className}`}>
    <slot />
</div>