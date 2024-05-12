<script>
  import Icon from "@iconify/svelte";
  import Button from "./button.svelte";
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import { SELECTION_TYPE, Choices } from "../stores/choices";
  import Sidecard from "./sidecard.svelte";

  const config = get(CYOAConfig);
  let choices = {};

  Choices.subscribe((value) => {
    choices = value;
    console.log("-->>SB - choices", { ...choices });
  });

  const options = {
    thin: "thin",
    mid: "mid",
    wide: "wide",
  };
  let currentWidth = options.mid;
  let name = "Name";

  function getSelectionType(selectionsItem) {
    if (Array.isArray(selectionsItem)) {
      return SELECTION_TYPE.uniqueMulti;
    } else if (typeof selectionsItem === "object") {
      return SELECTION_TYPE.multi;
    }
    return SELECTION_TYPE.uniqueOnce;
  }
</script>

<div
  class={`type-${currentWidth} w-32 h-vscreen flex flex-col bg-slate-800 border-r border-black overflow-hidden`}
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

  <div class="p-1.5 text-sm flex flex-col gap-2">
    <Sidecard>
      <div class="flex gap-2">
        <label for="name">Name:</label>
        <input id="name" bind:value={name} />
      </div>

      <div class="flex gap-2">
        <img src="" alt="character-icon" />

        <div class="flex flex-col gap-2">
          {#each config.setup.points as pointTypes, index}
            <div class="flex gap-2">
              <span class={currentWidth === options.wide ? "block" : "hidden"}
                >{pointTypes.fullName}</span
              >
              <span class={currentWidth === options.wide ? "hidden" : "block"}
                >{pointTypes.name}</span
              >
              <span
                ><b>{choices?.points?.[index] ?? pointTypes.startValue}</b
                >/{pointTypes.startValue}</span
              >
            </div>
          {/each}
        </div>
      </div></Sidecard
    >

    {#key choices}
      {#each Object.entries(choices.effects) as [key, effect]}
        <Sidecard>
          {@const isUniqueString = typeof effect === "string"}

          {#if isUniqueString}
            <div class="flex gap-2">
              <b>{key}</b>
              <span>{effect}</span>
            </div>
          {:else}
            <b>{key}</b>
            <div class="flex gap-2 flex-wrap">
              {#each effect as effectListItem}
                {#if effectListItem.quantity !== 0}
                  <p>
                    <span>{effectListItem.name}</span
                    >{#if effectListItem.quantity > 1}
                      <span class="ml-1">x{effectListItem.quantity}</span>
                    {/if}
                  </p>
                {/if}
              {/each}
            </div>
          {/if}
        </Sidecard>
      {/each}
    {/key}
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
