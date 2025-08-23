<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import { Choices } from "../stores/choices";
  import ChoiceCurrentSelection from "./choice-current-selection.svelte";

  let currentChoices;
  Choices.subscribe((value) => {
    currentChoices = value;
  });

  let config = get(CYOAConfig);
  CYOAConfig.subscribe((newVal) => (config = newVal));
</script>

<ul class="list-disc pl-8">
  {#key currentChoices}
    {#each config.choices as choice}
      <a href={`#${choice.title}`}>
        <li>
          <p class="flex justify-between gap-1.5 flex-wrap">
            <span class="underline">{choice.title}</span>
            <ChoiceCurrentSelection {choice} />
          </p>
        </li>
      </a>
    {/each}
  {/key}
</ul>
