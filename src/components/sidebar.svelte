<script>
	import GLOBAL from "../utils/global"
  let var1 = "First";
  let points = GLOBAL.setup.points;

  let firstPoints = points[0].startValue

</script>

<div class="w-32 h-vscreen flex flex-col bg-slate-500">
  <h2>Sidebar</h2>
  <!-- line,small,max -->

  <div>{var1}</div>
  <div>{firstPoints}</div>
</div>
