import React from 'react';
import {createRoot} from 'react-dom/client';

const test=(
  <div>
    <h1>Hello World</h1>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis beatae voluptatum neque vitae eos aliquid, consectetur enim rerum mollitia sunt, nam dolor quo velit numquam? Reprehenderit rem molestiae illum reiciendis!</p>
  </div>  
)
const container=document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(test)