import './styles.scss';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import { createApp } from 'vue';
import App from './app/App.vue';

const app = createApp(App);

app.use(router);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
}); 

app.use(ConfirmationService);
app.use(ToastService);

app.mount('#root');
