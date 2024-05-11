<script>
  import Icon from "@iconify/svelte";
  import Button from "./button.svelte";
  export let config = {};

  const options = {
    thin: "thin",
    mid: "mid",
    wide: "wide",
  };
  let currentWidth = options.mid;
</script>

<div
  class={`type-${currentWidth} w-32 h-vscreen flex flex-col bg-slate-500 border-r border-black`}
>
  <div class="flex justify-between p-1.5">
    <Button
      onclick={() => (currentWidth = options.thin)}
      className={currentWidth === options.thin ? "hidden" : ""}
    >
      <Icon class="rotate-180" icon="fluent:arrow-next-12-filled" /></Button
    >
    <Button
      onclick={() => (currentWidth = options.mid)}
      className={currentWidth === options.thin ? "hidden" : ""}
      active={currentWidth === options.mid}
      ><Icon icon="fluent:arrow-left-32-filled" /></Button
    >
    <Button
      onclick={() => (currentWidth = options.wide)}
      className={currentWidth === options.thin ? "absolute z-20" : ""}
      active={currentWidth === options.wide}
    >
      <Icon icon="fluent:arrow-next-12-filled" />
    </Button>
  </div>

  <h2>Sidebar</h2>
  <!-- line,small,max -->

  <div>{config.setup.points[0].startValue}</div>
</div>

<style>
  div.type-wide {
    position: absolute;
    width: 80%;
    max-width: 36rem;
    height: 100vh;
  }
  div.type-mid {
    width: 16rem;
  }
  div.type-thin {
    width: 1px;
  }
</style>
