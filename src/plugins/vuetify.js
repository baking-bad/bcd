import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export function makeVuetify(dark) {
    return new Vuetify({
        theme: {
            dark: dark,
            options: {
                customProperties: true,
            },
            themes: {
                light: {
                    primary: '#5b942a',
                    secondary: '#246100',
                    accent: "#7B1FA2",
                    sidenav: '#404040',
                    sidebar: '#e3e3e3',
                    canvas: '#f0f0f0',
                    border: '#ddd',
                    data: '#f7f7f7',
                    tree: '#388E3C',
                },
                dark: {
                    primary: '#75A34F',
                    secondary: '#abda82',
                    accent: '#BA68C8',
                    sidenav: '#393939',
                    sidebar: '#303030',
                    canvas: '#2d2d2d',
                    border: '#414141',
                    data: '#2a2a2a',
                    tree: '#81C784'
                }
            },
        },
    });
}
