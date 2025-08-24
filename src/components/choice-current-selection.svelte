<script>
  import { Choices, SELECTION_TYPE } from "../stores/choices";
  import { getSelectionType } from "../utils/helper";

  export let showPrefix = true;
  export let choice;
  const choiceType = getSelectionType(choice);

  let currentChoices;
  let quantity = 0;
  let choiceText = ""

  Choices.subscribe((value) => {
    currentChoices = value;
    choiceText = choiceSummary();

    if(choiceType === SELECTION_TYPE.multi) {
      quantity = Object.values(currentChoices.selections?.[choice.title] ?? {}).reduce((acc, curr) => acc + curr, 0);
    } else {
      quantity = currentChoices.selections?.[choice.title]?.length ?? 0;
    }

  });


  function choiceSummary() {
    const currentSelectionData = currentChoices.selections?.[choice.title];
    let returnValue = "";

    if (currentSelectionData) {
      switch (choiceType) {
        case SELECTION_TYPE.uniqueOnce:
          returnValue = currentSelectionData;
          break;
        case SELECTION_TYPE.uniqueMulti:
          returnValue = currentSelectionData.join(", ");
          break;
        case SELECTION_TYPE.multi:
          returnValue = Object.entries(currentSelectionData)
            .map(
              ([title, number]) => `${title}${number > 1 ? " x" + number : ""}`
            )
            .join(", ");
      }
    }
    return returnValue;
  }

</script>

<p class="text-sm">
  {#if showPrefix}
    <span class="underline decoration-double">Selection:</span>
  {/if}
  {choiceText}
  {#if choice.maxChoices !== 1}
    <span class="text-xs">({quantity}/{choice.maxChoices})</span>
  {/if}
  {#if choice.maxChoices === quantity}
    <span class="text-xs">-MAX-</span>
  {/if}
</p>
