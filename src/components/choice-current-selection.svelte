<script>
  import { Choices, SELECTION_TYPE } from "../stores/choices";
  import { getSelectionType } from "../utils/helper";

  export let choice;

  let currentChoices;
  let choiceText = ""

  Choices.subscribe((value) => {
    currentChoices = value;
    choiceText = choiceSummary();
  });


  function choiceSummary() {
    const currentSelectionData = currentChoices.selections?.[choice.title];
    const type = getSelectionType(choice);
    let returnValue = "";

    if (currentSelectionData) {
      switch (type) {
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
  <span class="underline decoration-double">Selection:</span>
  {choiceText}
  {#if choice.maxChoices !== 1}
    <span class="text-xs">({currentChoices.selections?.[choice.title]?.length ?? 0}/{choice.maxChoices})</span>
  {/if}
  {#if choice.maxChoices === currentChoices.selections?.[choice.title]?.length}
    <span class="text-xs">-MAX-</span>
  {/if}
</p>
