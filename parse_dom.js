// Pseudo-DOM tree from App.tsx and Home.tsx
const tree = {
  name: 'div#root',
  children: [
    {
      name: 'div.h-[100dvh]',
      children: [
        {
          name: 'div.flex-1.key=screen',
          children: [
            {
              name: 'div.Home',
              children: [
                {
                  name: 'div.Header',
                  children: [
                    { name: 'div.left', children: [] },
                    { name: 'div.right', children: [
                      { name: 'button.cortex', children: [{ name: 'svg', children: [{ name: 'circle' }] }] },
                      { name: 'button.menu' }
                    ] }
                  ]
                },
                {
                  name: 'div.ScrollableContent',
                  children: [
                    { name: 'PWAInstallBanner', children: [
                      { name: 'div.left', children: [{name: 'span'}] },
                      { name: 'div.right', children: [{name: 'span'}, {name: 'button', children: [{name: 'svg', children: [{name: 'line'}]}]}] }
                    ] },
                    { name: 'button.SOS' },
                    { name: 'div.Crisis' },
                    { name: 'div.Grid' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
