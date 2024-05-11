<script>
  import Icon from "@iconify/svelte";
  import Button from "./button.svelte";
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";

  const config = get(CYOAConfig);

  const options = {
    thin: "thin",
    mid: "mid",
    wide: "wide",
  };
  let currentWidth = options.mid;
  let name = "Name";
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

  <div class="p-1.5 text-sm">
    <h2>Sidebar</h2>
    <!-- line,small,max -->
    <div class="flex gap-2">
      <label for="name">Name:</label>
      <input id="name" bind:value={name} />
    </div>

    <div class="flex gap-2">
      <img src="" alt="character-icon" />

      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <span>Pts</span>
          <span
            >{config.setup.points[0].startValue}/{config.setup.points[0]
              .startValue}</span
          >
        </div>
        <div class="flex gap-2">
          <span>Skills</span>
          <span>4/4</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <b>Choice</b>
        <span>Example</span>
      </div>
      <div class="flex gap-2">
        <b>Choice2</b>
        <span>45</span>
      </div>
    </div>
  </div>
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
