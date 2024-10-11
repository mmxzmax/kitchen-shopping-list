import { describe, it, expect } from 'vitest';

import router from '../router';

import { shallowMount } from '@vue/test-utils';
import App from './App.vue';

describe('App', () => {
  it('renders properly', async () => {
    const wrapper = shallowMount(App, { global: { plugins: [router] } });

    await router.isReady();

    expect(wrapper.text()).toContain('');
  });
});
