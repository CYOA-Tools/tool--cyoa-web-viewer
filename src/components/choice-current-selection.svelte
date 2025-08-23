<script>
  import { Choices, SELECTION_TYPE } from "../stores/choices";
  import { getSelectionType } from "../utils/helper";

  let currentChoices;
  Choices.subscribe((value) => {
    currentChoices = value;
  });

  export let choice;

  function choiceSummary() {
    const currentSelectionData = currentChoices.selections?.[choice.title];
    const type = getSelectionType(choice);

    if (currentSelectionData) {
      switch (type) {
        case SELECTION_TYPE.uniqueOnce:
          return currentSelectionData;
        case SELECTION_TYPE.uniqueMulti:
          return currentSelectionData.join(", ");
        case SELECTION_TYPE.multi:
          return Object.entries(currentSelectionData)
            .map(
              ([title, number]) => `${title}${number > 1 ? " x" + number : ""}`
            )
            .join(", ");
      }
    }
    return "None";
  }
</script>

<p class="text-sm">
  <span class="underline decoration-double">Selection:</span>
  {choiceSummary()}
</p>
