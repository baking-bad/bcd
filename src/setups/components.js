import Vue from 'vue';
import VJsf from '@baking-bad/vjsf/lib/VJsf.js';
import '@baking-bad/vjsf/lib/VJsf.css';
import draggable from 'vuedraggable';

Vue.component('draggable', draggable);
Vue.component('VJsf', VJsf);
