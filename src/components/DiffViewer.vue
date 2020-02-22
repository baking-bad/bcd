<template>
  <v-card>
    <v-card-title class="body-2 secondary grey--text text--darken-3">
      {{ nameLeft }} -> {{ nameRight }}
      <v-spacer></v-spacer>
      <span v-if="added" class="primary--text font-weight-medium mr-1">+{{ added }}</span>
      <span v-if="removed" class="red--text font-weight-medium">-{{ removed }}</span>
    </v-card-title>
    <v-card-text class="px-0">
      <table>
        <tbody id="table"></tbody>
      </table>
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
    getPartClass(type) {
      if (type == 1 || type == -1) {
        return "part part" + type;
      } else if (type == 2 || type == -2) {
        return "spaces";
      }
      return "";
    },
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
  color: rgba(27, 31, 35, 0.3);
  background-color: rgba(0, 0, 0, 0.02);
  text-align: end;
  min-width: 45px;
}

.number1 {
  background-color: #cdffd8;
}

.number-1 {
  background-color: #ffdce0;
}

#table {
  white-space: pre-wrap;
  font-weight: normal;
  color: #24292e;
  font-size: 12px;
  background-color: transparent;
  font-family: "Roboto Mono", monospace;
  vertical-align: text-top;
  display: -webkit-inline-box;
  margin-top: -3px;
}

td {
  padding: 0 10px;
}

table {
  border-spacing: 0;
  border: 0;
}
</style>