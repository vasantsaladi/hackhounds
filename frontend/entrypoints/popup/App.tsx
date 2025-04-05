import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-[1280px] mx-auto p-8 text-center">
      <div className="flex justify-center space-x-8">
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="h-24 p-6 will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#54bc4ae0]" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img 
            src={reactLogo} 
            className="h-24 p-6 will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin" 
            alt="React logo" 
          />
        </a>
      </div>
      <h1 className="text-[3.2em] leading-[1.1]">WXT + React</h1>
      <div className="p-8">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-transparent px-5 py-2.5 bg-[#1a1a1a] dark:bg-[#f9f9f9] text-white dark:text-black font-medium cursor-pointer transition-[border-color] duration-[0.25s] hover:border-[#646cff] focus:outline focus:outline-4 focus:outline-blue-500"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code className="font-mono">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-[#888]">
        Click on the WXT and React logos to learn more
      </p>
    </div>
  );
}

export default App;
