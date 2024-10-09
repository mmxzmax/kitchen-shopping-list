import './styles.scss';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import { createApp } from 'vue';
import App from './app/App.vue';

const app = createApp(App);

app.use(router);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#root');
