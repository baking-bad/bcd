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
                data: '#fafafa'
            },
            dark: {
                primary: '#75A34F',
                secondary: '#abda82',
                accent: '#9475d2',
                sidenav: '#393939',
                sidebar: '#303030',
                canvas: '#2d2d2d',
                border: '#414141',
                data: '#2a2a2a',
                json_value: '#81C784',
                json_type: '#EEEEEE',
            }
        },
    },
});
