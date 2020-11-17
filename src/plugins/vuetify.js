import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    iconfont: 'md',
    theme: {
        themes: {
            light: {
                primary: '#6FCF97',
                secondary: '#333333',
                success: '#3cd1c2',
                info: '#ffaa2c',
                error: '#EB5757',
            },
        },
    },
});
