<template>
  <v-card>
    <v-card-title class="body-2 secondary grey--text text--darken-3">
      {{ nameLeft }} -> {{ nameRight }}
      <v-spacer></v-spacer>
      <span v-if="added" class="primary--text font-weight-medium mr-1">+{{ added }}</span>
      <span v-if="removed" class="red--text font-weight-medium">-{{ removed }}</span>
    </v-card-title>
    <v-card-text class="px-0">
      <div style="overflow-x: auto;">
        <table class="diff-table">
          <tbody id="table"></tbody>
        </table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DiffViewer",
  props: {
    left: Array,
    right: Array,
    nameLeft: String,
    nameRight: String,
    added: Number,
    removed: Number
  },
  created() {
    this.$nextTick(() => this.buildTable(this.left, this.right));
  },
  methods: {
    buildTable(left, right) {
      let leftIdx = 0;
      let rightIdx = 0;

      let table = document.getElementById("table");
      for (let i = 0; i < left.length; i++) {
        let tr = document.createElement("tr");
        let number_td = document.createElement("td");
        if (left[i].length > 0) number_td.textContent = ++leftIdx;

        number_td.classList.add("number");

        let td = document.createElement("td");
        let leftRowType = 0;
        for (let j = 0; j < left[i].length; j++) {
          let span = document.createElement("span");
          if (left[i][j].type == 1 || left[i][j].type == -1) {
            leftRowType = left[i][j].type;
            span.classList.add("part" + left[i][j].type);
          }
          span.textContent = left[i][j].chunk;
          td.appendChild(span);
          td.classList.add("part");
        }
        if (leftRowType) {
          number_td.classList.add("number" + leftRowType);
          td.classList.add("row" + leftRowType);
        }

        tr.appendChild(number_td);
        tr.appendChild(td);

        let r_number_td = document.createElement("td");
        if (right[i].length > 0) r_number_td.textContent = ++rightIdx;
        r_number_td.classList.add("number");

        let r_td = document.createElement("td");
        let rightRowType = 0;
        for (let j = 0; j < right[i].length; j++) {
          let span = document.createElement("span");
          if (right[i][j].type == 1 || right[i][j].type == -1) {
            rightRowType = right[i][j].type;
            span.classList.add("part" + right[i][j].type);
          }
          span.textContent = right[i][j].chunk;
          r_td.appendChild(span);
          r_td.classList.add("part");
        }

        if (rightRowType) {
          r_number_td.classList.add("number" + rightRowType);
          r_td.classList.add("row" + rightRowType);
        }

        tr.appendChild(r_number_td);
        tr.appendChild(r_td);

        table.appendChild(tr);
      }
    }
  }
};
</script>

<style>
.part {
  position: relative;
  padding-right: 10px;
  padding-left: 10px;
  line-height: 20px;
  vertical-align: top;
  color: #24292e;
  font-size: 12px;
  background-color: transparent;
  font-family: "Roboto Mono", monospace;
  white-space: pre-wrap;
  font-weight: normal;
  vertical-align: text-top;
}

.part-1 {
  background-color: #fdb8c0;
}

.part1 {
  background-color: #acf2bd;
}

.row-1 {
  background-color: #ffeef0;
}

.row1 {
  background-color: #e6ffed;
}

.number {
  width: 3%;
  min-width: 50px;
  padding-right: 10px;
  padding-left: 10px;
  font-size: 12px;
  line-height: 20px;
  color: rgba(27, 31, 35, 0.3);
  text-align: right;
  white-space: nowrap;
  vertical-align: top;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  padding: 0;
}

.number1 {
  background-color: #cdffd8;
}

.number-1 {
  background-color: #ffdce0;
}

.diff-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
</style>