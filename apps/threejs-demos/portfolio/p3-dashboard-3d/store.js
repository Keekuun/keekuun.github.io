export function createStore() {
  const devices = [
    { id: 'd1', name: '设备 A', value: 42, status: 'normal' },
    { id: 'd2', name: '设备 B', value: 68, status: 'normal' },
    { id: 'd3', name: '设备 C', value: 35, status: 'normal' },
    { id: 'd4', name: '设备 D', value: 91, status: 'normal' },
  ];
  let selectedId = null;
  const history = { labels: ['t-4', 't-3', 't-2', 't-1', 'now'], values: [40, 52, 48, 60, 55] };
  const listeners = new Set();

  const notify = () => listeners.forEach((fn) => fn(getState()));

  function getState() {
    return { devices: [...devices], selectedId, history: { ...history, values: [...history.values] } };
  }

  return {
    getState,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    select(id) {
      selectedId = id;
      notify();
    },
    tick() {
      const i = Math.floor(Math.random() * devices.length);
      devices[i].value = Math.round(20 + Math.random() * 80);
      devices[i].status = devices[i].value > 75 ? 'alarm' : 'normal';
      history.values.shift();
      history.values.push(Math.round(devices.reduce((s, d) => s + d.value, 0) / devices.length));
      notify();
    },
  };
}
