<template>
    <v-row class="align-center justify-center">
        <v-col cols="12" >
            <div class="d-flex align-center justify-center code">
                <code class="hex-view">
                    <span class="primary--text">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F&nbsp;&nbsp;&nbsp;&nbsp;0123456789ABCDEF
                    </span>
                    <br/>
                    <br/>
                    <template v-for="(line, idx) in hexdump">
                        <div :key="idx">
                            <span class="primary--text">{{ line.number }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>{{ line.hex }}</span>
                            <span>{{ '&nbsp;&nbsp;&nbsp;'.repeat(line.tail) }}</span>
                            <span>{{ line.raw }}</span>
                            <br/>
                        </div>
                    </template> 
                </code>
            </div>
        </v-col>
        <v-col class="ml-8">
            <v-btn
                text
                small
                link
                @click.prevent.stop="() => { copy(value) }"
            >
                <v-icon small class="mr-1">mdi-content-copy</v-icon>
                <span>Copy Value</span>
            </v-btn>
        </v-col>
    </v-row>
</template>
  
<script>
import {mapActions} from "vuex";
import { copyToClipboard } from "@/utils/clipboard";

export default {
    name: 'HexView',
    props: {
      value: String,
    },
    data() {
      return {
        buffer: null
      }
    },
    mounted() {
        this.buffer = new Uint8Array(this.value.match(/[\dA-F]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        })).buffer
    },
    computed: {
      content() {
        if (this.buffer && this.buffer.byteLength)
          return this.hexdump;
        else
          return '(empty)'
      },
      hexdump() {
        if (!this.buffer) return [];
        let lines = []
        let view = new DataView(this.buffer)
  
        for (let i = 0; i < this.buffer.byteLength; i += 16) {
            let line = {
                number: ('0000' + i.toString(16).toUpperCase()).slice(-4),
                raw: String.fromCharCode.apply(null,
                    new Uint8Array(this.buffer.slice(i, i + 16))).replace(/[^\x20-\x7E]/g, '.'),
                hex: '',
                tail: 1
            }

            for (let j = 0; j < 16; j++) {
                if (i + j > this.buffer.byteLength - 1) {
                    line.tail += 1
                } else {
                    line.hex += `${(0 + view.getUint8(i + j).toString(16).toUpperCase()).slice(-2)} `
                }
            }
            lines.push(line)
        }
  
        return lines
      },
    },
    methods: {
        ...mapActions(["showClipboardOK", "showClipboardFail"]),
        copy(text, successMessage, failMessage) {
            copyToClipboard(text, this.showClipboardOK.bind(null, successMessage), this.showClipboardFail.bind(null, failMessage));
        },
    }
  }
</script>

<style>
.hex-view {
    /* line-height: 0.9rem !important;  */
    font-size: 0.9rem !important;
    background-color: transparent !important;
    font-family:  "Roboto Mono", monospace;
    display: inline-block;
}

</style>