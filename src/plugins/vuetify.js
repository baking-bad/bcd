import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: '#5b942a',
                secondary: '#327d9d',
                accent: "#FFAB40",
                sidenav: '#404040',
                sidebar: '#e3e3e3',
                canvas: '#f0f0f0',
                border: '#ccc',
                data: '#fff'
            },
            dark: {
                primary: '#4caf50',
                secondary: '#327d9d',
                accent: '#9475d2',
                sidenav: '#404040',
                sidebar: '#363636',
                canvas: '#292929',
                border: '#414141',
                data: '#1E1E1F'
            }
        },
    },
});
