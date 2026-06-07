import { useState, useEffect } from 'react';

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let pyodidePromise: Promise<any> | null = null;

export interface PyodideResult {
  stdout: string;
  stderr: string;
  result: any;
  success: boolean;
}

export function usePyodide() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [loadedPackages, setLoadedPackages] = useState<string[]>([]);

  useEffect(() => {
    if (pyodideInstance) {
      setStatus('ready');
      return;
    }

    if (pyodidePromise) {
      setStatus('loading');
      pyodidePromise.then(() => {
        setStatus('ready');
      }).catch(() => {
        setStatus('error');
      });
      return;
    }

    setStatus('loading');
    pyodidePromise = (async () => {
      // Wait for window.loadPyodide to be defined, in case script tag is still loading
      let checkCount = 0;
      while (!window.loadPyodide && checkCount < 30) {
        await new Promise(resolve => setTimeout(resolve, 200));
        checkCount++;
      }
      
      if (!window.loadPyodide) {
        throw new Error('Pyodide script script tag failed to load on window.');
      }
      
      const py = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
      });
      pyodideInstance = py;
      return py;
    })();

    pyodidePromise
      .then(() => {
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Failed to load Pyodide:', err);
        setStatus('error');
      });
  }, []);

  const runCode = async (code: string, packagesToLoad: string[] = []): Promise<PyodideResult> => {
    if (!pyodideInstance) {
      return { stdout: '', stderr: 'Pyodide is not loaded or ready yet.', result: null, success: false };
    }

    try {
      // Load any packages required by this sandbox
      if (packagesToLoad.length > 0) {
        const unloaded = packagesToLoad.filter(p => !loadedPackages.includes(p));
        if (unloaded.length > 0) {
          setStatus('loading');
          await pyodideInstance.loadPackage(unloaded);
          setLoadedPackages(prev => [...prev, ...unloaded]);
          setStatus('ready');
        }
      }

      // Intercept stdout
      let stdoutBuffer = '';
      let stderrBuffer = '';

      pyodideInstance.setStdout({
        write: (buffer: any) => {
          if (typeof buffer === 'string') {
            stdoutBuffer += buffer;
            return buffer.length;
          }
          try {
            const decoded = new TextDecoder().decode(buffer);
            stdoutBuffer += decoded;
            return buffer.byteLength || buffer.length;
          } catch (e) {
            stdoutBuffer += String(buffer);
            return buffer.length;
          }
        }
      });
      
      pyodideInstance.setStderr({
        write: (buffer: any) => {
          if (typeof buffer === 'string') {
            stderrBuffer += buffer;
            return buffer.length;
          }
          try {
            const decoded = new TextDecoder().decode(buffer);
            stderrBuffer += decoded;
            return buffer.byteLength || buffer.length;
          } catch (e) {
            stderrBuffer += String(buffer);
            return buffer.length;
          }
        }
      });

      // Execute code
      const result = await pyodideInstance.runPythonAsync(code);
      
      return {
        stdout: stdoutBuffer,
        stderr: stderrBuffer,
        result: result,
        success: true
      };
    } catch (err: any) {
      return {
        stdout: '',
        stderr: err.message || String(err),
        result: null,
        success: false
      };
    }
  };

  return { status, runCode, loadedPackages };
}
