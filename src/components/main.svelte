<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";

  const config = get(CYOAConfig);
</script>

<div class="w-full flex-1">{config.title.cyoaName}</div>
