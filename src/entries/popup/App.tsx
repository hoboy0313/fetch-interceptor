import {Button} from '@/components/ui/button';

function App() {
  return (
    <div className="p-5">
      <Button onClick={() => chrome.runtime.reload()}>Reload</Button>
    </div>
  );
}

export default App;
