<script>
  import Icon from "@iconify/svelte";
  import Button from "./button.svelte";
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import { Choices } from "../stores/choices";
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
  let currentWidth = options.thin;
  let name = "Name";
</script>

<div
  class={`type-${currentWidth} w-32 h-vscreen flex flex-col bg-slate-800 border-r border-black overflow-hidden z-10`}
>
  <div class="flex justify-between p-1.5">
    <Button
      onclick={() => (currentWidth = options.thin)}
      className={currentWidth === options.thin ? "hidden" : "w-8"}
    >
      <Icon class="rotate-180" icon="fluent:arrow-next-12-filled" /></Button
    >
    <Button
      onclick={() => (currentWidth = options.mid)}
      className={currentWidth === options.thin
        ? "hidden"
        : "w-8 hidden sm:block"}
      active={currentWidth === options.mid}
      ><Icon icon="fluent:arrow-left-32-filled" /></Button
    >
    <div
      class={currentWidth === options.thin ? "absolute z-20 flex flex-col" : ""}
    >
      <Button
        onclick={() => (currentWidth = options.wide)}
        active={currentWidth === options.wide}
        className="w-8"
      >
        <Icon icon="fluent:arrow-next-12-filled" />
      </Button>

      <div
        class={currentWidth === options.thin
          ? "p-1.5 py-0.5  bg-white mt-3 rounded-md border border-black text-sm"
          : "hidden"}
      >
        {#each config.setup.points as pointTypes, index}
          <div class="flex gap-2 items-center">
            <span class={currentWidth === options.wide ? "hidden" : "block"}
              >{pointTypes.name}</span
            >
            <span>{choices?.points?.[index] ?? pointTypes.startValue} </span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="p-1.5 text-sm xl:text-base flex flex-col gap-2">
    <Sidecard>
      <div class="flex gap-2">
        <label for="name">Name:</label>
        <input id="name" bind:value={name} class="w-full rounded-md" />
      </div>

      <div class="flex gap-2">
        <img src="" alt="character-icon" />

        <div class="flex flex-col gap-2">
          {#each config.setup.points as pointTypes, index}
            <div class="flex gap-2 items-center">
              {#if !!pointTypes.icon}
                <img
                  src={pointTypes.icon}
                  alt="points icon"
                  class={currentWidth === options.wide ? "h-8" : "h-4"}
                />
              {/if}
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
              <span class="underline decoration-double">{key}</span>
              <span>{effect}</span>
            </div>
          {:else}
            <span class="underline decoration-double">{key}</span>
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
